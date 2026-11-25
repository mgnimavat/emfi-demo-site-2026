type Point = readonly [number, number];
export type SettlementOrientation = 'horizontal' | 'vertical' | 'track';
type Station = { x: number; y: number };

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const ease = (value: number) => {
  const progress = clamp(value);
  return progress * progress * (3 - 2 * progress);
};
const createLayout = (
  viewBox: string,
  clientPositions: readonly [Point, Point],
  accountPositions: readonly [Point, Point],
  deliveryPositions: readonly [Point, Point],
) => {
  const [clientA, clientB] = clientPositions;
  const [accountA, accountB] = accountPositions;
  const [deliveryA, deliveryB] = deliveryPositions;
  const pool: Point = [(accountA[0] + accountB[0]) / 2, (accountA[1] + accountB[1]) / 2];
  const node = ([x, y]: Point): Station => ({ x, y });

  return {
    viewBox,
    clients: [node(clientA), node(clientB)] as const,
    accounts: [node(accountA), node(accountB)] as const,
    pool: node(pool),
    deliveries: [node(deliveryA), node(deliveryB)] as const,
  };
};

export const settlementLayouts = {
  horizontal: createLayout('0 0 1000 252', [[114, 50], [114, 180]],
    [[500, 50], [500, 180]], [[872, 50], [872, 180]]),
  vertical: createLayout('0 0 520 340', [[132, 44], [388, 44]],
    [[132, 154], [388, 154]], [[132, 274], [388, 274]]),
  track: createLayout('0 0 520 416', [[132, 44], [388, 44]],
    [[132, 194], [388, 194]], [[132, 350], [388, 350]]),
} as const;

const interpolate = (from: Station, to: Station, progress: number): Point => [
  from.x + (to.x - from.x) * progress,
  from.y + (to.y - from.y) * progress,
];

export const settlementAnimationTiming = {
  scene: 4000,
  arrivalDelay: 750,
  arrivalTravel: 2100,
  secondClientDelay: 200,
  deliveryDelay: 220,
  deliveryTravel: 2200,
  deliveryConfirmation: 2500,
  fade: 700,
} as const;

const settlementAccountDuration = settlementAnimationTiming.scene * 3;

export const getSettlementAnimationFrame = (elapsed: number, orientation: SettlementOrientation) => {
  const { clients, accounts, pool, deliveries } = settlementLayouts[orientation];
  const timing = settlementAnimationTiming;
  const cycle = elapsed % settlementAccountDuration;
  const phase = Math.floor(cycle / timing.scene);
  const sceneTime = cycle % timing.scene;
  const arrival = ease((sceneTime - timing.arrivalDelay) / timing.arrivalTravel);
  const secondArrival = ease((sceneTime - timing.arrivalDelay - timing.secondClientDelay) / timing.arrivalTravel);
  const delivery = ease((sceneTime - timing.deliveryDelay) / timing.deliveryTravel);
  const opacity = phase === 0 ? clamp(sceneTime / timing.fade)
    : phase === 2 ? clamp((timing.scene - sceneTime) / timing.fade) : 1;
  const deliveryProgress = phase === 0 ? 0 : phase === 1 ? delivery : 1;
  return {
    phase,
    delivered: phase === 2 || (phase === 1 && sceneTime >= timing.deliveryConfirmation),
    arrivalProgressA: phase === 0 ? arrival : 1,
    arrivalProgressB: phase === 0 ? secondArrival : 1,
    deliveryProgress,
    opacity,
    sharedA: phase === 0 ? interpolate(clients[0], pool, arrival)
      : interpolate(pool, deliveries[1], deliveryProgress),
    dedicatedA: phase === 0 ? interpolate(clients[0], accounts[0], arrival)
      : interpolate(accounts[0], deliveries[0], deliveryProgress),
    dedicatedB: phase === 0 ? interpolate(clients[1], accounts[1], secondArrival)
      : interpolate(accounts[1], deliveries[1], deliveryProgress),
  };
};

export const getSettlementComparisonFrame = (
  elapsed: number, loopDuration: number, orientation: SettlementOrientation,
) => {
  const progress = (elapsed % loopDuration) / loopDuration;
  return {
    ...getSettlementAnimationFrame(progress * settlementAccountDuration * 2, orientation),
    dedicated: progress >= 0.5,
  };
};
