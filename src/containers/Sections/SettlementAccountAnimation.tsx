'use client';

import { useId, useRef, useState, useSyncExternalStore, type CSSProperties, type RefObject } from 'react';
import { motion, useAnimationFrame, useInView } from 'framer-motion';
import { CircleCheck, TriangleAlert } from 'lucide-react';
import { directPaceScale, getDirectRouteDuration } from '@/components/emfi-sections/values';
import type { SettlementCopy } from '@/lib/i18n/service-dictionaries';
import {
  getSettlementAnimationFrame,
  getSettlementComparisonFrame,
  settlementAnimationTiming,
  settlementLayouts,
  type SettlementOrientation,
} from '@/lib/settlement-account-animation';
import styles from './SettlementAccountAnimation.module.css';

type AnimationCopy = SettlementCopy['accountAnimation'];
type TokenRef = RefObject<SVGGElement | null>;
type Point = readonly [number, number];

const morphDuration = 0.65;
const loopDuration = getDirectRouteDuration(directPaceScale('home12'));
const compactQuery = '(max-width: 699px)';
const reducedMotionQuery = '(prefers-reduced-motion: reduce)';
const subscribeToMedia = (query: string) => (onChange: () => void) => {
  const media = window.matchMedia(query);
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
};
const subscribeToLayout = subscribeToMedia(compactQuery);
const subscribeToReducedMotion = subscribeToMedia(reducedMotionQuery);
const getReducedMotion = () => window.matchMedia(reducedMotionQuery).matches;
const getServerReducedMotion = () => false;
const getOrientation = (): SettlementOrientation => window.matchMedia(compactQuery).matches
  ? 'vertical'
  : 'horizontal';
const getServerOrientation = (): SettlementOrientation => 'horizontal';
const initialScene = getSettlementComparisonFrame(0, loopDuration, 'horizontal');
const completedElapsed = settlementAnimationTiming.scene * 2;

type DiagramLayout = (typeof settlementLayouts)[SettlementOrientation];
type DiagramNode = DiagramLayout['clients'][number];

const boxAttributes = ({ x, y, width, height }: DiagramNode) => ({ x, y, width, height });

const SecurityToken = ({ owner, tokenRef, position, visible }: {
  owner: 'A' | 'B'; tokenRef: TokenRef; position: Point; visible: boolean;
}) => (
  <g ref={tokenRef} className={`${styles.token} ${owner === 'B' ? styles.tokenB : ''}`} data-token={owner}
    transform={`translate(${position.join(' ')})`} opacity={visible ? 1 : 0}>
    <circle r="23" className={styles.tokenHalo} />
    <circle r="16" />
    <text textAnchor="middle" dominantBaseline="central">{owner}</text>
  </g>
);

const DeliveryNode = ({ owner, node, dedicated, settled, copy, track }: {
  node: DiagramLayout['deliveries'][number]; owner: 'A' | 'B'; dedicated: boolean; settled: boolean;
  copy: AnimationCopy; track: boolean;
}) => {
  const delivered = settled && (dedicated || owner === 'B');

  return (
    <g className={styles.delivery} data-owner={owner} data-status={delivered ? 'delivered' : 'pending'}>
      {track ? (
        <circle className={styles.station} cx={node.x} cy={node.y} r="7" />
      ) : (
        <rect {...boxAttributes(node)} rx="12" />
      )}
      {!dedicated ? (
        <g className={owner === 'A' ? styles.pendingMarker : styles.waitingDelivery}
          transform={`translate(${node.marker.join(' ')})`}>
          <circle r="9" />
          <path d="M0 -5 V0 L3 2" />
        </g>
      ) : null}
      <text x={node.label[0]} y={node.label[1]} textAnchor="middle">
        {owner === 'A' ? copy.deliveryA : copy.delivery}
      </text>
      <text x={node.status[0]} y={node.status[1]} textAnchor="middle" className={styles.deliveryStatus}>
        {delivered ? copy.delivered : copy.pending}
      </text>
    </g>
  );
};

const AccountDiagram = ({ orientation, dedicated, settled, copy, tokenARef, tokenBRef, reducedMotion }: {
  orientation: SettlementOrientation;
  dedicated: boolean; settled: boolean; copy: AnimationCopy; tokenARef: TokenRef;
  tokenBRef: TokenRef; reducedMotion: boolean;
}) => {
  const { viewBox, routes, clients, accounts, pool, deliveries } = settlementLayouts[orientation];
  const { sharedArrival, sharedArrivalB, sharedPending, sharedDelivery, arrivalA, arrivalB,
    deliveryA, deliveryB } = routes;
  const accountA = dedicated ? accounts[0] : pool;
  const accountB = dedicated ? accounts[1] : pool;
  const leftDelivery = dedicated ? deliveryA.path : sharedPending.path;
  const rightDelivery = dedicated ? deliveryB.path : sharedDelivery.path;
  const transition = { duration: reducedMotion ? 0 : morphDuration, ease: 'easeInOut' } as const;
  const tokenScene = getSettlementAnimationFrame(reducedMotion ? completedElapsed : 0, orientation);
  const track = orientation === 'track';
  const gradientId = useId();
  const routeGradientId = `${gradientId}-route`;
  const gradientStyles = track ? {
    '--track-token-gradient': `url("#${gradientId}")`,
    '--track-route-gradient': `url("#${routeGradientId}")`,
  } as CSSProperties : undefined;
  const sources = [
    { owner: 'A', node: clients[0], label: copy.clientA },
    { owner: 'B', node: clients[1], label: copy.clientB },
  ];

  return (
    <svg className={styles.diagram} viewBox={viewBox} aria-hidden="true" focusable="false" style={gradientStyles}>
      {track && (
        <defs>
          <linearGradient id={gradientId} x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--flow-from)" />
            <stop offset="50%" stopColor="var(--flow-mid)" />
            <stop offset="100%" stopColor="var(--flow-to)" />
          </linearGradient>
          <linearGradient id={routeGradientId} href={`#${gradientId}`} gradientUnits="userSpaceOnUse"
            x2="0" y2="100%" />
        </defs>
      )}
      <motion.path className={`${styles.route} ${styles.arrivalA}`} initial={false} transition={transition}
        animate={{ d: dedicated ? arrivalA.path : sharedArrival.path }} />
      <motion.path className={`${styles.route} ${styles.arrivalB}`} initial={false} transition={transition}
        animate={{ d: dedicated ? arrivalB.path : sharedArrivalB.path }} />
      <motion.path className={styles.route} initial={false} transition={transition}
        animate={{ d: leftDelivery }} />
      <motion.path className={styles.route} initial={false} transition={transition}
        animate={{ d: rightDelivery }} />
      <motion.path className={dedicated ? styles.activeRoute : styles.pendingRoute}
        initial={false} transition={transition} animate={{ d: leftDelivery }} />
      <motion.path className={styles.activeRoute} initial={false} transition={transition}
        animate={{ d: rightDelivery }} />
      <g className={styles.source}>
        {sources.map(({ owner, node, label }) => (
          <g key={owner}>
            {track ? (
              <circle className={styles.station} cx={node.x} cy={node.y} r="8" />
            ) : (
              <rect {...boxAttributes(node)} rx="14" />
            )}
            <text x={node.label[0]} y={node.label[1]} textAnchor="middle">{label}</text>
          </g>
        ))}
      </g>
      <g className={styles.accounts}>
        {track ? (
          <>
            <motion.circle className={styles.station} r="8" initial={false} transition={transition}
              animate={{ cx: accountA.x, cy: accountA.y }} />
            <motion.circle className={styles.station} r="8" initial={false} transition={transition}
              animate={{ cx: accountB.x, cy: accountB.y, opacity: dedicated ? 1 : 0 }} />
          </>
        ) : (
          <>
            <motion.rect rx="14" initial={false} transition={transition}
              animate={boxAttributes(accountA)} />
            <motion.rect rx="14" initial={false} transition={transition}
              animate={{ ...boxAttributes(accountB), opacity: dedicated ? 1 : 0 }} />
          </>
        )}
        <text x={accountA.label[0]} y={accountA.label[1]} textAnchor="middle">
          {dedicated ? copy.accountA : copy.pool}
        </text>
        {dedicated ? (
          <text x={accountB.label[0]} y={accountB.label[1]} textAnchor="middle">{copy.accountB}</text>
        ) : null}
      </g>
      <DeliveryNode owner="A" node={deliveries[0]} dedicated={dedicated} settled={settled} copy={copy} track={track} />
      <DeliveryNode owner="B" node={deliveries[1]} dedicated={dedicated} settled={settled} copy={copy} track={track} />
      <SecurityToken owner="A" tokenRef={tokenARef} visible={reducedMotion}
        position={dedicated ? tokenScene.dedicatedA : tokenScene.sharedA} />
      <SecurityToken owner="B" tokenRef={tokenBRef} visible={reducedMotion && dedicated}
        position={tokenScene.dedicatedB} />
    </svg>
  );
};

const moveToken = (token: TokenRef, position: Point, opacity: number) => {
  token.current?.setAttribute('transform', `translate(${position[0].toFixed(2)} ${position[1].toFixed(2)})`);
  token.current?.setAttribute('opacity', opacity.toFixed(3));
};

export const SettlementAccountAnimation = ({ copy, orientation: fixedOrientation }: {
  copy: AnimationCopy; orientation?: SettlementOrientation;
}) => {
  const responsiveOrientation = useSyncExternalStore(subscribeToLayout, getOrientation, getServerOrientation);
  const orientation = fixedOrientation ?? responsiveOrientation;
  const stage = useRef<HTMLDivElement>(null);
  const tokenA = useRef<SVGGElement>(null);
  const tokenB = useRef<SVGGElement>(null);
  const elapsed = useRef(0);
  const [scene, setScene] = useState(initialScene);
  const visible = useInView(stage, { amount: 0.25 });
  const reducedMotion = useSyncExternalStore(subscribeToReducedMotion, getReducedMotion, getServerReducedMotion);
  const { phase, delivered, dedicated } = reducedMotion
    ? { phase: 2, delivered: true, dedicated: true }
    : scene;
  const running = visible && !reducedMotion;
  const CaptionIcon = dedicated ? CircleCheck : TriangleAlert;
  const captions = dedicated ? copy.dedicatedCaptions : copy.sharedCaptions;

  useAnimationFrame((_time, delta) => {
    if (!running || document.hidden) return;
    elapsed.current += Math.min(delta, 64);
    const frame = getSettlementComparisonFrame(elapsed.current, loopDuration, orientation);
    moveToken(tokenA, frame.dedicated ? frame.dedicatedA : frame.sharedA, frame.opacity);
    moveToken(tokenB, frame.dedicatedB, frame.dedicated ? frame.opacity : 0);
    if (scene.phase !== frame.phase || scene.delivered !== frame.delivered ||
      scene.dedicated !== frame.dedicated) {
      setScene(frame);
    }
  });

  return (
    <div ref={stage} className={styles.stage} data-phase={phase} data-running={running}
      data-settled={delivered} data-dedicated={dedicated} data-orientation={orientation}>
      <h3 className={styles.routeTitle}>
        <span>{dedicated ? copy.dedicatedTitle : copy.sharedTitle}</span>
      </h3>
      <figure className={styles.figure}>
        <AccountDiagram key={orientation} orientation={orientation} dedicated={dedicated} settled={delivered} copy={copy}
          tokenARef={tokenA} tokenBRef={tokenB} reducedMotion={reducedMotion} />
        <figcaption>
          <CaptionIcon size={18} aria-hidden="true" /><p>{captions[phase]}</p>
        </figcaption>
      </figure>
    </div>
  );
};
