'use client';

import { useRef, useState, type RefObject } from 'react';
import { useAnimationFrame, useInView, useReducedMotion } from 'framer-motion';
import { CircleCheck, Layers3, ShieldCheck, TriangleAlert } from 'lucide-react';
import type { SettlementCopy } from '@/lib/i18n/service-dictionaries';
import { getSettlementAnimationFrame, settlementRoutes } from '@/lib/settlement-account-animation';
import styles from './SettlementAccountAnimation.module.css';

type AnimationCopy = SettlementCopy['accountAnimation'];
type TokenRef = RefObject<SVGGElement | null>;
type Point = readonly [number, number];

const SecurityToken = ({ owner, tokenRef, position, reducedMotion }: {
  owner: 'A' | 'B'; tokenRef?: TokenRef; position: Point; reducedMotion: boolean;
}) => (
  <g ref={tokenRef} className={`${styles.token} ${owner === 'B' ? styles.tokenB : ''}`} data-token={owner}
    transform={`translate(${position.join(' ')})`} opacity={reducedMotion ? 1 : 0}>
    <circle r="23" className={styles.tokenHalo} />
    <circle r="16" />
    <text textAnchor="middle" dominantBaseline="central">{owner}</text>
  </g>
);

const DeliveryNode = ({ owner, dedicated, settled, copy }: {
  owner: 'A' | 'B'; dedicated: boolean; settled: boolean; copy: AnimationCopy;
}) => {
  const delivered = settled && (dedicated || owner === 'B');
  const left = owner === 'A' ? 24 : 280;

  return (
    <g className={styles.delivery} data-owner={owner} data-status={delivered ? 'delivered' : 'pending'}>
      <rect x={left} y="244" width="216" height="72" rx="12" />
      {!dedicated && owner === 'B' ? (
        <g className={styles.waitingDelivery}>
          <circle cx="318" cy="265" r="9" />
          <path d="M318 260 V265 L321 267" />
        </g>
      ) : null}
      {!dedicated && owner === 'A' ? (
        <g className={styles.pendingMarker}>
          <circle cx="70" cy="265" r="9" />
          <path d="M70 260.5 V265 L73 267" />
        </g>
      ) : null}
      <text x={left + 132} y="270" textAnchor="middle">
        {owner === 'A' ? copy.deliveryA : copy.delivery}
      </text>
      <text x={left + 108} y="300" textAnchor="middle" className={styles.deliveryStatus}>
        {delivered ? copy.delivered : copy.pending}
      </text>
    </g>
  );
};

const AccountDiagram = ({ dedicated, settled, copy, tokenARef, tokenBRef, reducedMotion }: {
  dedicated: boolean; settled: boolean; copy: AnimationCopy; tokenARef: TokenRef;
  tokenBRef?: TokenRef; reducedMotion: boolean;
}) => (
  <svg className={styles.diagram} viewBox="0 0 520 340" aria-hidden="true" focusable="false">
    <path className={styles.route} d={dedicated
      ? `${settlementRoutes.arrivalA.path} ${settlementRoutes.arrivalB.path} ${settlementRoutes.deliveryA.path} ${settlementRoutes.deliveryB.path}`
      : `${settlementRoutes.sharedArrival.path} M388 84 C388 112 290 98 290 124 M240 202 C240 228 132 218 132 244 ${settlementRoutes.sharedDelivery.path}`} />
    <path className={styles.activeRoute} d={dedicated ? settlementRoutes.deliveryB.path : settlementRoutes.sharedDelivery.path} />
    {dedicated ? <path className={styles.activeRoute} d={settlementRoutes.deliveryA.path} /> : (
      <g className={styles.pendingRoute}>
        <path d="M240 202 C240 228 132 218 132 244" />
      </g>
    )}
    <g className={styles.source}>
      <rect x="24" y="22" width="216" height="62" rx="14" />
      <rect x="280" y="22" width="216" height="62" rx="14" />
      <text x="132" y="60" textAnchor="middle">{copy.clientA}</text>
      <text x="388" y="60" textAnchor="middle">{copy.clientB}</text>
    </g>
    {dedicated ? (
      <g className={styles.vaults}>
        <rect x="24" y="124" width="216" height="78" rx="14" />
        <rect x="280" y="124" width="216" height="78" rx="14" />
        <text x="132" y="150" textAnchor="middle">{copy.accountA}</text>
        <text x="388" y="150" textAnchor="middle">{copy.accountB}</text>
        <path className={styles.divider} d="M260 112 V220" />
      </g>
    ) : (
      <g className={styles.pool}>
        <rect x="108" y="124" width="304" height="78" rx="14" />
        <text x="260" y="150" textAnchor="middle">{copy.pool}</text>
      </g>
    )}
    <DeliveryNode owner="A" dedicated={dedicated} settled={settled} copy={copy} />
    <DeliveryNode owner="B" dedicated={dedicated} settled={settled} copy={copy} />
    <SecurityToken owner="A" tokenRef={tokenARef} reducedMotion={reducedMotion}
      position={reducedMotion ? (dedicated ? [62, 270] : [318, 270]) : [132, 70]} />
    {dedicated ? <SecurityToken owner="B" tokenRef={tokenBRef}
      reducedMotion={reducedMotion} position={reducedMotion ? [318, 270] : [388, 70]} /> : null}
  </svg>
);

const moveToken = (token: TokenRef, position: Point, opacity: number) => {
  token.current?.setAttribute('transform', `translate(${position[0].toFixed(2)} ${position[1].toFixed(2)})`);
  token.current?.setAttribute('opacity', opacity.toFixed(3));
};

export const SettlementAccountAnimation = ({ copy }: { copy: AnimationCopy }) => {
  const stage = useRef<HTMLDivElement>(null);
  const sharedA = useRef<SVGGElement>(null);
  const dedicatedA = useRef<SVGGElement>(null);
  const dedicatedB = useRef<SVGGElement>(null);
  const elapsed = useRef(0);
  const lastScene = useRef({ phase: 0, delivered: false });
  const [scene, setScene] = useState({ phase: 0, delivered: false });
  const [focused, setFocused] = useState(false);
  const visible = useInView(stage, { amount: 0.25 });
  const reducedMotion = Boolean(useReducedMotion());
  const activePhase = reducedMotion ? copy.sharedCaptions.length - 1 : scene.phase;
  const settled = reducedMotion || scene.delivered;
  const running = visible && !reducedMotion && !focused;

  useAnimationFrame((_time, delta) => {
    if (!running || document.hidden) return;
    elapsed.current += Math.min(delta, 64);
    const frame = getSettlementAnimationFrame(elapsed.current);
    moveToken(sharedA, frame.sharedA, frame.opacity);
    moveToken(dedicatedA, frame.dedicatedA, frame.opacity);
    moveToken(dedicatedB, frame.dedicatedB, frame.opacity);
    if (lastScene.current.phase !== frame.phase || lastScene.current.delivered !== frame.delivered) {
      const nextScene = { phase: frame.phase, delivered: frame.delivered };
      lastScene.current = nextScene;
      setScene(nextScene);
    }
  });

  return (
    <div ref={stage} className={styles.stage} data-phase={activePhase} data-running={running}
      data-settled={settled} role="group" aria-label={`${copy.sharedTitle} — ${copy.dedicatedTitle}`}
      tabIndex={0} onFocusCapture={() => setFocused(true)} onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
      }}>
      <div className={styles.comparison}>
        <figure className={`${styles.panel} ${styles.shared}`}>
          <div className={styles.panelHeader}><Layers3 size={20} aria-hidden="true" /><h3>{copy.sharedTitle}</h3></div>
          <AccountDiagram dedicated={false} settled={settled} copy={copy} tokenARef={sharedA} reducedMotion={reducedMotion} />
          <figcaption>
            <TriangleAlert size={18} aria-hidden="true" /><p>{copy.sharedCaptions[activePhase]}</p>
          </figcaption>
        </figure>
        <figure className={`${styles.panel} ${styles.dedicated}`}>
          <div className={styles.panelHeader}><ShieldCheck size={20} aria-hidden="true" /><h3>{copy.dedicatedTitle}</h3></div>
          <AccountDiagram dedicated settled={settled} copy={copy} tokenARef={dedicatedA} tokenBRef={dedicatedB} reducedMotion={reducedMotion} />
          <figcaption>
            <CircleCheck size={18} aria-hidden="true" /><p>{copy.dedicatedCaptions[activePhase]}</p>
          </figcaption>
        </figure>
      </div>
    </div>
  );
};
