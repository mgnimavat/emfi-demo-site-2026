'use client';

import { useLayoutEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type RefObject } from 'react';
import { useAnimationFrame, useInView } from 'framer-motion';
import { Check, Clock3, Landmark, TriangleAlert, UserRound, type LucideIcon } from 'lucide-react';
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
type Model = 'shared' | 'separate';
type Owner = 'A' | 'B';
type TokenStop = 'client' | 'account' | 'delivery';
type Point = readonly [number, number];
type TokenRef = RefObject<HTMLDivElement | null>;
type Layout = (typeof settlementLayouts)[SettlementOrientation];
type Frame = ReturnType<typeof getSettlementComparisonFrame>;

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

const getFrame = (elapsed: number, orientation: SettlementOrientation, model: Model | null) => {
  const time = model === null ? elapsed : elapsed % modelDuration + (model === 'separate' ? modelDuration : 0);
  return getSettlementComparisonFrame(time, loopDuration, orientation);
};

const getTokenStop = (frame: Frame, owner: Owner): TokenStop | null => {
  if (frame.phase === 0) {
    const progress = owner === 'A' ? frame.arrivalProgressA : frame.arrivalProgressB;
    if (progress === 0) return 'client';
    return progress === 1 ? 'account' : null;
  }
  if (frame.deliveryProgress === 0) return 'account';
  return frame.delivered ? 'delivery' : null;
};

const getMovingTokenOpacity = (frame: Frame, owner: Owner) =>
  (owner === 'A' || frame.dedicated) && getTokenStop(frame, owner) === null ? frame.opacity : 0;

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

const paintFrame = (stage: HTMLDivElement | null, tokenA: TokenRef, tokenB: TokenRef, frame: Frame, size: Point) => {
  stage?.style.setProperty('--arrival-progress-a', frame.arrivalProgressA.toFixed(4));
  stage?.style.setProperty('--arrival-progress-b', frame.arrivalProgressB.toFixed(4));
  stage?.style.setProperty('--delivery-progress', frame.deliveryProgress.toFixed(4));
  moveToken(tokenA, frame.dedicated ? frame.dedicatedA : frame.sharedA, size, getMovingTokenOpacity(frame, 'A'));
  moveToken(tokenB, frame.dedicatedB, size, getMovingTokenOpacity(frame, 'B'));
};

const SecurityBadge = ({ owner }: { owner: Owner }) => (
  <span className={styles.badge} data-owner={owner} aria-hidden="true">{owner}</span>
);

const Station = ({ node, size, label, icon: Icon, owner, token, status, tone }: {
  node: { x: number; y: number };
  size: Point;
  label: string;
  icon: LucideIcon;
  owner?: Owner;
  token?: Owner;
  status?: string;
  tone?: 'warning' | 'complete';
}) => (
  <div className={styles.station} style={positionStyle([node.x, node.y], size)} data-owner={owner}>
    <div className={styles.stationHeader}>
      <Icon className={styles.stationIcon} size={16} aria-hidden="true" />
      {token && <SecurityBadge owner={token} />}
    </div>
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

const Route = ({ path, progress, owner, inactive, blocked }: {
  path: string; progress?: string; owner?: Owner; inactive?: boolean; blocked?: boolean;
}) => (
  <>
    <path d={path} className={styles.rail} data-inactive={inactive || undefined}
      data-blocked={blocked || undefined} />
    {progress && (
      <path d={path} pathLength="1" className={styles.trail} data-owner={owner}
        style={{ '--route-progress': `var(${progress})` } as CSSProperties} />
    )}
  </>
);

const AccountDiagram = ({ layout, copy, dedicated, delivered, frame, tokenA, tokenB }: {
  layout: Layout; copy: AnimationCopy; dedicated: boolean; delivered: boolean;
  frame: Frame; tokenA: TokenRef; tokenB: TokenRef;
}) => {
  const { clients, accounts, pool, deliveries, routes, viewBox } = layout;
  const size = plotSize(layout);
  const deliveredA = delivered && dedicated;
  const stopA = getTokenStop(frame, 'A');
  const stopB = dedicated ? getTokenStop(frame, 'B') : null;
  const deliveryBStop = dedicated ? stopB : stopA;

  return (
    <div className={styles.canvas}>
      <svg className={styles.routes} viewBox={viewBox} preserveAspectRatio="none" aria-hidden="true">
        {dedicated ? (
          <>
            <Route path={routes.arrivalA.path} progress="--arrival-progress-a" owner="A" />
            <Route path={routes.arrivalB.path} progress="--arrival-progress-b" owner="B" />
            <Route path={routes.deliveryA.path} progress="--delivery-progress" owner="A" />
            <Route path={routes.deliveryB.path} progress="--delivery-progress" owner="B" />
          </>
        ) : (
          <>
            <Route path={routes.sharedArrivalB.path} />
            <Route path={routes.sharedArrival.path} progress="--arrival-progress-a" owner="A" />
            <Route path={routes.sharedPending.path} inactive blocked={delivered} />
            <Route path={routes.sharedDelivery.path} progress="--delivery-progress" owner="A" />
          </>
        )}
      </svg>

      <SecurityToken owner="A" tokenRef={tokenA} position={dedicated ? frame.dedicatedA : frame.sharedA}
        size={size} opacity={getMovingTokenOpacity(frame, 'A')} />
      <SecurityToken owner="B" tokenRef={tokenB} position={frame.dedicatedB} size={size}
        opacity={getMovingTokenOpacity(frame, 'B')} />

      <Station node={clients[0]} size={size} label={copy.clientA} icon={UserRound} owner="A"
        token={stopA === 'client' ? 'A' : undefined} />
      <Station node={clients[1]} size={size} label={copy.clientB} icon={UserRound} owner="B"
        token={stopB === 'client' ? 'B' : undefined} />
      <div className={styles.accounts} key={dedicated ? 'separate' : 'shared'}>
        {dedicated ? (
          <>
            <Station node={accounts[0]} size={size} label={copy.accountA} icon={Landmark} owner="A"
              token={stopA === 'account' ? 'A' : undefined} />
            <Station node={accounts[1]} size={size} label={copy.accountB} icon={Landmark} owner="B"
              token={stopB === 'account' ? 'B' : undefined} />
          </>
        ) : <Station node={pool} size={size} label={copy.pool} icon={Landmark}
          token={stopA === 'account' ? 'A' : undefined} />}
      </div>
      <Station node={deliveries[0]} size={size} label={copy.deliveryA} owner="A"
        token={dedicated && stopA === 'delivery' ? 'A' : undefined}
        icon={deliveredA ? Check : Clock3} status={deliveredA ? copy.delivered : copy.pending}
        tone={deliveredA ? 'complete' : delivered ? 'warning' : undefined} />
      <Station node={deliveries[1]} size={size} label={copy.delivery} owner="B"
        token={deliveryBStop === 'delivery' ? (dedicated ? 'B' : 'A') : undefined}
        icon={delivered ? Check : Clock3} status={delivered ? copy.delivered : copy.pending}
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
  const [model, setModel] = useState<Model | null>(null);
  const [scene, setScene] = useState(() => getFrame(0, 'horizontal', null));
  const visible = useInView(stage, { amount: 0.25 });
  const layout = settlementLayouts[orientation];
  const size = plotSize(layout);
  const frame = reducedMotion
    ? { ...getSettlementAnimationFrame(completedElapsed, orientation), dedicated: model !== 'shared' }
    : scene;
  const { phase, delivered, dedicated } = frame;
  const activeModel = dedicated ? 'separate' : 'shared';
  const running = visible && !reducedMotion;
  const captions = dedicated ? copy.dedicatedCaptions : copy.sharedCaptions;
  const CaptionIcon = dedicated ? Check : TriangleAlert;

  useLayoutEffect(() => {
    if (reducedMotion) return;
    paintFrame(stage.current, tokenA, tokenB, getFrame(elapsed.current, orientation, model),
      plotSize(settlementLayouts[orientation]));
  }, [orientation, model, reducedMotion]);

  useAnimationFrame((_time, delta) => {
    if (!running || document.hidden) return;
    elapsed.current += Math.min(delta, 64);
    const next = getFrame(elapsed.current, orientation, model);
    paintFrame(stage.current, tokenA, tokenB, next, size);
    if (scene.phase !== next.phase || scene.delivered !== next.delivered || scene.dedicated !== next.dedicated
      || getTokenStop(scene, 'A') !== getTokenStop(next, 'A')
      || (next.dedicated && getTokenStop(scene, 'B') !== getTokenStop(next, 'B'))) {
      setScene(next);
    }
  });

  const selectModel = (nextModel: Model) => {
    elapsed.current = 0;
    const first = getFrame(0, orientation, nextModel);
    if (!reducedMotion) paintFrame(stage.current, tokenA, tokenB, first, size);
    setModel(nextModel);
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
        <figcaption className={styles.caption} aria-live={model ? 'polite' : 'off'}>
          <CaptionIcon size={17} aria-hidden="true" />
          <span>{captions[phase]}</span>
        </figcaption>
      </figure>
    </div>
  );
};
