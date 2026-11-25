'use client';

import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type RefObject } from 'react';
import { useAnimationFrame, useInView } from 'framer-motion';
import { Check, Clock3, Landmark, TriangleAlert, UserRound } from 'lucide-react';
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
import type { SettlementStationIcon } from './settlement-station-models';

type AnimationCopy = SettlementCopy['accountAnimation'];
type Model = 'shared' | 'separate';
type Owner = 'A' | 'B';
type Point = readonly [number, number];
type TokenRef = RefObject<HTMLDivElement | null>;
type Layout = (typeof settlementLayouts)[SettlementOrientation];
type Frame = ReturnType<typeof getSettlementComparisonFrame>;

const stationFallbacks = {
  client: UserRound,
  bank: Landmark,
  pending: Clock3,
  complete: Check,
} as const;

const loopDuration = getDirectRouteDuration(directPaceScale('home12'));
const modelDuration = loopDuration / 2;
const completedElapsed = settlementAnimationTiming.scene * 2;

const subscribeToMedia = (query: string) => (onChange: () => void) => {
  const media = window.matchMedia(query);
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
};

const compactQuery = '(max-width: 699px)';
const reducedMotionQuery = '(prefers-reduced-motion: reduce)';
const subscribeToLayout = subscribeToMedia(compactQuery);
const subscribeToReducedMotion = subscribeToMedia(reducedMotionQuery);
const getOrientation = (): SettlementOrientation => window.matchMedia(compactQuery).matches ? 'vertical' : 'horizontal';
const getServerOrientation = (): SettlementOrientation => 'horizontal';
const getReducedMotion = () => window.matchMedia(reducedMotionQuery).matches;
const getServerReducedMotion = () => false;

const getFrame = (elapsed: number, orientation: SettlementOrientation) =>
  getSettlementComparisonFrame(elapsed, loopDuration, orientation);

const getTokenOpacity = (frame: Frame, owner: Owner) =>
  (owner === 'A' || frame.dedicated) ? frame.opacity : 0;

const plotSize = (layout: Layout): Point => {
  const [, , width, height] = layout.viewBox.split(' ').map(Number);
  return [width, height];
};

const asPercent = (coordinate: number, extent: number) => `${(coordinate / extent * 100).toFixed(3)}%`;

const positionStyle = ([x, y]: Point, [width, height]: Point) => ({
  '--position-x': asPercent(x, width),
  '--position-y': asPercent(y, height),
}) as CSSProperties;

const moveToken = (ref: TokenRef, [x, y]: Point, [width, height]: Point, opacity: number) => {
  const token = ref.current;
  if (!token) return;
  token.style.setProperty('--position-x', asPercent(x, width));
  token.style.setProperty('--position-y', asPercent(y, height));
  token.style.opacity = opacity.toFixed(3);
};

const paintFrame = (tokenA: TokenRef, tokenB: TokenRef, frame: Frame, size: Point) => {
  moveToken(tokenA, frame.dedicated ? frame.dedicatedA : frame.sharedA, size, getTokenOpacity(frame, 'A'));
  moveToken(tokenB, frame.dedicatedB, size, getTokenOpacity(frame, 'B'));
};

const SecurityBadge = ({ owner }: { owner: Owner }) => (
  <span className={styles.badge} data-owner={owner} aria-hidden="true">{owner}</span>
);

const StationModel = ({ icon, owner }: { icon: SettlementStationIcon; owner?: Owner }) => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const Fallback = stationFallbacks[icon];

  useEffect(() => {
    const element = canvas.current;
    if (!element) return;

    let current = true;
    delete element.dataset.rendered;
    void import('./settlement-station-models')
      .then(({ paintStationModel }) => {
        if (current && paintStationModel(element, icon, owner)) element.dataset.rendered = 'true';
      })
      .catch(() => {});

    return () => { current = false; };
  }, [icon, owner]);

  return (
    <span className={styles.stationModel} aria-hidden="true">
      <canvas ref={canvas} className={styles.stationIcon} />
      <Fallback className={styles.stationFallback} />
    </span>
  );
};

const Station = ({ node, size, label, icon, owner, status, tone }: {
  node: { x: number; y: number };
  size: Point;
  label: string;
  icon: SettlementStationIcon;
  owner?: Owner;
  status?: string;
  tone?: 'warning' | 'complete';
}) => (
  <div className={styles.station} style={positionStyle([node.x, node.y], size)} data-owner={owner}>
    <StationModel icon={icon} owner={owner} />
    <span className={styles.stationLabel}>{label}</span>
    {status && <span className={styles.stationStatus} data-tone={tone}>{status}</span>}
  </div>
);

const SecurityToken = ({ owner, tokenRef, position, size, opacity }: {
  owner: Owner; tokenRef: TokenRef; position: Point; size: Point; opacity: number;
}) => (
  <div ref={tokenRef} className={styles.tokenCarrier} aria-hidden="true"
    style={{ ...positionStyle(position, size), opacity }}>
    <SecurityBadge owner={owner} />
  </div>
);

const AccountDiagram = ({ layout, copy, dedicated, delivered, frame, tokenA, tokenB }: {
  layout: Layout; copy: AnimationCopy; dedicated: boolean; delivered: boolean;
  frame: Frame; tokenA: TokenRef; tokenB: TokenRef;
}) => {
  const { clients, accounts, pool, deliveries } = layout;
  const size = plotSize(layout);
  const deliveredA = delivered && dedicated;

  return (
    <div className={styles.canvas}>
      <SecurityToken owner="A" tokenRef={tokenA} position={dedicated ? frame.dedicatedA : frame.sharedA}
        size={size} opacity={getTokenOpacity(frame, 'A')} />
      <SecurityToken owner="B" tokenRef={tokenB} position={frame.dedicatedB} size={size}
        opacity={getTokenOpacity(frame, 'B')} />

      <Station node={clients[0]} size={size} label={copy.clientA} icon="client" owner="A" />
      <Station node={clients[1]} size={size} label={copy.clientB} icon="client" owner="B" />
      <div className={styles.accounts} key={dedicated ? 'separate' : 'shared'}>
        {dedicated ? (
          <>
            <Station node={accounts[0]} size={size} label={copy.accountA} icon="bank" owner="A" />
            <Station node={accounts[1]} size={size} label={copy.accountB} icon="bank" owner="B" />
          </>
        ) : <Station node={pool} size={size} label={copy.pool} icon="bank" />}
      </div>
      <Station node={deliveries[0]} size={size} label={copy.deliveryA} owner="A"
        icon={deliveredA ? 'complete' : 'pending'} status={deliveredA ? copy.delivered : copy.pending}
        tone={deliveredA ? 'complete' : delivered ? 'warning' : undefined} />
      <Station node={deliveries[1]} size={size} label={copy.delivery} owner="B"
        icon={delivered ? 'complete' : 'pending'} status={delivered ? copy.delivered : copy.pending}
        tone={delivered ? 'complete' : undefined} />
    </div>
  );
};

export const SettlementAccountAnimation = ({ copy, label }: {
  copy: AnimationCopy;
  label: string;
}) => {
  const orientation = useSyncExternalStore(subscribeToLayout, getOrientation, getServerOrientation);
  const reducedMotion = useSyncExternalStore(subscribeToReducedMotion, getReducedMotion, getServerReducedMotion);
  const stage = useRef<HTMLDivElement>(null);
  const tokenA = useRef<HTMLDivElement>(null);
  const tokenB = useRef<HTMLDivElement>(null);
  const elapsed = useRef(0);
  const [staticModel, setStaticModel] = useState<Model>('separate');
  const [scene, setScene] = useState(() => getFrame(0, 'horizontal'));
  const visible = useInView(stage, { amount: 0.25 });
  const layout = settlementLayouts[orientation];
  const size = plotSize(layout);
  const frame = reducedMotion
    ? { ...getSettlementAnimationFrame(completedElapsed, orientation), dedicated: staticModel === 'separate' }
    : scene;
  const { phase, delivered, dedicated } = frame;
  const activeModel = dedicated ? 'separate' : 'shared';
  const running = visible && !reducedMotion;
  const captions = dedicated ? copy.dedicatedCaptions : copy.sharedCaptions;
  const CaptionIcon = dedicated ? Check : TriangleAlert;

  useLayoutEffect(() => {
    if (reducedMotion) return;
    paintFrame(tokenA, tokenB, getFrame(elapsed.current, orientation),
      plotSize(settlementLayouts[orientation]));
  }, [orientation, reducedMotion]);

  useAnimationFrame((_time, delta) => {
    if (!running || document.hidden) return;
    elapsed.current += Math.min(delta, 64);
    const next = getFrame(elapsed.current, orientation);
    paintFrame(tokenA, tokenB, next, size);
    if (scene.phase !== next.phase || scene.delivered !== next.delivered || scene.dedicated !== next.dedicated) {
      setScene(next);
    }
  });

  const selectModel = (nextModel: Model) => {
    elapsed.current = nextModel === 'separate' ? modelDuration : 0;
    const first = getFrame(elapsed.current, orientation);
    if (!reducedMotion) paintFrame(tokenA, tokenB, first, size);
    setStaticModel(nextModel);
    setScene(first);
  };

  return (
    <div ref={stage} className={styles.stage} data-orientation={orientation} data-phase={phase}
      data-dedicated={dedicated} data-running={running} data-settled={delivered}>
      <div className={styles.modes} role="group" aria-label={label}>
        <button type="button" aria-pressed={activeModel === 'shared'} onClick={() => selectModel('shared')}>
          {copy.sharedTitle}
        </button>
        <button type="button" aria-pressed={activeModel === 'separate'} onClick={() => selectModel('separate')}>
          {copy.dedicatedTitle}
        </button>
      </div>
      <figure className={styles.figure}>
        <AccountDiagram layout={layout} copy={copy} dedicated={dedicated} delivered={delivered}
          frame={frame} tokenA={tokenA} tokenB={tokenB} />
        <figcaption className={styles.caption} aria-live={reducedMotion ? 'polite' : 'off'}>
          <CaptionIcon size={17} aria-hidden="true" />
          <span>{captions[phase]}</span>
        </figcaption>
      </figure>
    </div>
  );
};
