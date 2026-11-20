type Point = readonly [number, number];
export type SettlementOrientation = 'horizontal' | 'vertical' | 'track';
type Route = { path: string; points: Point[]; distances: number[]; length: number };

const curveSamples = 40;
const clamp = (value: number) => Math.max(0, Math.min(1, value));
const ease = (value: number) => {
  const progress = clamp(value);
  return progress * progress * (3 - 2 * progress);
};
const createRoute = (from: Point, to: Point, [first, second]: readonly [Point, Point]): Route => {
  const path = `M${from.join(' ')} C${first.join(' ')} ${second.join(' ')} ${to.join(' ')}`;
  const points: Point[] = [from];
  const distances = [0];

  for (let sample = 1; sample <= curveSamples; sample += 1) {
    const t = sample / curveSamples;
    const u = 1 - t;
    const x = u ** 3 * from[0] + 3 * u ** 2 * t * first[0] + 3 * u * t ** 2 * second[0] + t ** 3 * to[0];
    const y = u ** 3 * from[1] + 3 * u ** 2 * t * first[1] + 3 * u * t ** 2 * second[1] + t ** 3 * to[1];
    const [previousX, previousY] = points[sample - 1];
    points.push([x, y]);
    distances.push(distances[sample - 1] + Math.hypot(x - previousX, y - previousY));
  }
  return { path, points, distances, length: distances[distances.length - 1] };
};

const trackLayout = (
  viewBox: string,
  axis: 'x' | 'y',
  clientPositions: readonly [Point, Point],
  accountPositions: readonly [Point, Point],
  deliveryPositions: readonly [Point, Point],
) => {
  const [clientA, clientB] = clientPositions;
  const [accountA, accountB] = accountPositions;
  const [deliveryA, deliveryB] = deliveryPositions;
  const pool: Point = [(accountA[0] + accountB[0]) / 2, (accountA[1] + accountB[1]) / 2];
  const connect = (from: Point, to: Point) => {
    const middleX = (from[0] + to[0]) / 2;
    const middleY = (from[1] + to[1]) / 2;
    const controls: readonly [Point, Point] = axis === 'x'
      ? [[middleX, from[1]], [middleX, to[1]]]
      : [[from[0], middleY], [to[0], middleY]];
    return createRoute(from, to, controls);
  };
  const node = ([x, y]: Point, labelOffset = 30) => ({ x, y, label: [x, y + labelOffset] });
  const delivery = ([x, y]: Point) => ({ ...node([x, y]), status: [x, y + 50] });

  return {
    viewBox,
    clients: [node(clientA, -20), node(clientB, -20)] as const,
    accounts: [node(accountA), node(accountB)] as const,
    pool: node(pool),
    deliveries: [delivery(deliveryA), delivery(deliveryB)] as const,
    routes: {
      sharedArrival: connect(clientA, pool),
      sharedArrivalB: connect(clientB, pool),
      sharedPending: connect(pool, deliveryA),
      sharedDelivery: connect(pool, deliveryB),
      arrivalA: connect(clientA, accountA),
      arrivalB: connect(clientB, accountB),
      deliveryA: connect(accountA, deliveryA),
      deliveryB: connect(accountB, deliveryB),
    },
  };
};

export const settlementLayouts = {
  horizontal: trackLayout('0 0 1000 252', 'x', [[114, 50], [114, 180]],
    [[500, 50], [500, 180]], [[872, 50], [872, 180]]),
  vertical: trackLayout('0 0 520 340', 'y', [[132, 44], [388, 44]],
    [[132, 154], [388, 154]], [[132, 274], [388, 274]]),
  track: trackLayout('0 0 520 416', 'y', [[132, 44], [388, 44]],
    [[132, 194], [388, 194]], [[132, 350], [388, 350]]),
} as const;

const pointOnRoute = (route: Route, progress: number): Point => {
  const distance = clamp(progress) * route.length;
  const index = route.distances.findIndex((value) => value >= distance);
  if (index <= 0) return route.points[0];
  const from = route.points[index - 1];
  const to = route.points[index];
  const fraction = (distance - route.distances[index - 1]) /
    (route.distances[index] - route.distances[index - 1]);
  return [from[0] + (to[0] - from[0]) * fraction, from[1] + (to[1] - from[1]) * fraction];
};

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
  const { routes } = settlementLayouts[orientation];
  const timing = settlementAnimationTiming;
  const cycle = elapsed % settlementAccountDuration;
  const phase = Math.floor(cycle / timing.scene);
  const sceneTime = cycle % timing.scene;
  const arrival = ease((sceneTime - timing.arrivalDelay) / timing.arrivalTravel);
  const secondArrival = ease((sceneTime - timing.arrivalDelay - timing.secondClientDelay) / timing.arrivalTravel);
  const delivery = ease((sceneTime - timing.deliveryDelay) / timing.deliveryTravel);
  const opacity = phase === 0 ? clamp(sceneTime / timing.fade)
    : phase === 2 ? clamp((timing.scene - sceneTime) / timing.fade) : 1;
  return {
    phase,
    delivered: phase === 2 || (phase === 1 && sceneTime >= timing.deliveryConfirmation),
    arrivalProgressA: phase === 0 ? arrival : 1,
    arrivalProgressB: phase === 0 ? secondArrival : 1,
    deliveryProgress: phase === 0 ? 0 : phase === 1 ? delivery : 1,
    opacity,
    sharedA: phase === 0 ? pointOnRoute(routes.sharedArrival, arrival)
      : pointOnRoute(routes.sharedDelivery, phase === 1 ? delivery : 1),
    dedicatedA: phase === 0 ? pointOnRoute(routes.arrivalA, arrival)
      : pointOnRoute(routes.deliveryA, phase === 1 ? delivery : 1),
    dedicatedB: phase === 0 ? pointOnRoute(routes.arrivalB, secondArrival)
      : pointOnRoute(routes.deliveryB, phase === 1 ? delivery : 1),
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
