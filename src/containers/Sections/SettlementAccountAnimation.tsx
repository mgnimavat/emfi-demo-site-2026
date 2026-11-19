'use client';

import { useRef, useState, useSyncExternalStore, type RefObject } from 'react';
import { motion, useAnimationFrame, useInView, useReducedMotion } from 'framer-motion';
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
const subscribeToLayout = (onChange: () => void) => {
  const query = window.matchMedia(compactQuery);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
};
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

const DeliveryNode = ({ owner, node, dedicated, settled, copy }: {
  node: DiagramLayout['deliveries'][number]; owner: 'A' | 'B'; dedicated: boolean; settled: boolean; copy: AnimationCopy;
}) => {
  const delivered = settled && (dedicated || owner === 'B');

  return (
    <g className={styles.delivery} data-owner={owner} data-status={delivered ? 'delivered' : 'pending'}>
      <rect {...boxAttributes(node)} rx="12" />
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

  return (
    <svg className={styles.diagram} viewBox={viewBox} aria-hidden="true" focusable="false">
      <motion.path className={styles.route} initial={false} transition={transition}
        animate={{ d: dedicated ? arrivalA.path : sharedArrival.path }} />
      <motion.path className={styles.route} initial={false} transition={transition}
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
        <rect {...boxAttributes(clients[0])} rx="14" />
        <rect {...boxAttributes(clients[1])} rx="14" />
        <text x={clients[0].label[0]} y={clients[0].label[1]} textAnchor="middle">{copy.clientA}</text>
        <text x={clients[1].label[0]} y={clients[1].label[1]} textAnchor="middle">{copy.clientB}</text>
      </g>
      <g className={styles.accounts}>
        <motion.rect rx="14" initial={false} transition={transition}
          animate={boxAttributes(accountA)} />
        <motion.rect rx="14" initial={false} transition={transition}
          animate={{ ...boxAttributes(accountB), opacity: dedicated ? 1 : 0 }} />
        <text x={accountA.label[0]} y={accountA.label[1]} textAnchor="middle">
          {dedicated ? copy.accountA : copy.pool}
        </text>
        {dedicated ? (
          <text x={accountB.label[0]} y={accountB.label[1]} textAnchor="middle">{copy.accountB}</text>
        ) : null}
      </g>
      <DeliveryNode owner="A" node={deliveries[0]} dedicated={dedicated} settled={settled} copy={copy} />
      <DeliveryNode owner="B" node={deliveries[1]} dedicated={dedicated} settled={settled} copy={copy} />
      <SecurityToken owner="A" tokenRef={tokenARef} visible={reducedMotion}
        position={dedicated ? tokenScene.dedicatedA : tokenScene.sharedA} />
      <SecurityToken owner="B" tokenRef={tokenBRef} visible={reducedMotion}
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
  const reducedMotion = Boolean(useReducedMotion());
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
      <h3 className={styles.routeTitle}>{dedicated ? copy.dedicatedTitle : copy.sharedTitle}</h3>
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
