type Point = readonly [number, number];
export type SettlementOrientation = 'horizontal' | 'vertical';
type Segment = { to: Point; controls?: readonly [Point, Point] };
type Route = { path: string; points: Point[]; distances: number[]; length: number };

const curveSamples = 40;
const clamp = (value: number) => Math.max(0, Math.min(1, value));
const ease = (value: number) => {
  const progress = clamp(value);
  return progress * progress * (3 - 2 * progress);
};
const createRoute = (start: Point, segments: Segment[]): Route => {
  let previous = start;
  let path = `M${start.join(' ')}`;
  const points: Point[] = [start];
  segments.forEach(({ to, controls }) => {
    if (controls) {
      path += ` C${controls[0].join(' ')} ${controls[1].join(' ')} ${to.join(' ')}`;
      const from = previous;
      for (let sample = 1; sample <= curveSamples; sample += 1) {
        const t = sample / curveSamples;
        const u = 1 - t;
        points.push([
          u ** 3 * from[0] + 3 * u ** 2 * t * controls[0][0] + 3 * u * t ** 2 * controls[1][0] + t ** 3 * to[0],
          u ** 3 * from[1] + 3 * u ** 2 * t * controls[0][1] + 3 * u * t ** 2 * controls[1][1] + t ** 3 * to[1],
        ]);
      }
    } else {
      path += ` L${to.join(' ')}`;
      points.push(to);
    }
    previous = to;
  });
  const distances = [0];
  for (let index = 1; index < points.length; index += 1) {
    distances.push(distances[index - 1] + Math.hypot(
      points[index][0] - points[index - 1][0], points[index][1] - points[index - 1][1]
    ));
  }
  return { path, points, distances, length: distances[distances.length - 1] };
};

const verticalCurve = (from: Point, to: Point): Segment => {
  const middleY = (from[1] + to[1]) / 2;
  return { controls: [[from[0], middleY], [to[0], middleY]], to };
};

const verticalArrival = (clientX: number, accountX: number) => createRoute([clientX, 70], [
  { to: [clientX, 84] },
  verticalCurve([clientX, 84], [accountX, 124]),
  { to: [accountX, 180] },
]);

const verticalDelivery = (accountX: number, deliveryX: number, markerX: number) =>
  createRoute([accountX, 180], [
    { to: [accountX, 202] },
    verticalCurve([accountX, 202], [deliveryX, 244]),
    verticalCurve([deliveryX, 244], [markerX, 270]),
  ]);

const verticalRoutes = {
  sharedArrival: verticalArrival(132, 260),
  sharedArrivalB: verticalArrival(388, 260),
  arrivalA: verticalArrival(132, 132),
  arrivalB: verticalArrival(388, 388),
  sharedPending: verticalDelivery(260, 132, 62),
  sharedDelivery: verticalDelivery(260, 388, 318),
  deliveryA: verticalDelivery(132, 132, 62),
  deliveryB: verticalDelivery(388, 388, 318),
};

const horizontalRoutes = {
  sharedArrival: createRoute([192, 59], [
    { to: [234, 59] }, { controls: [[300, 59], [327, 126]], to: [390, 126] }, { to: [500, 148] },
  ]),
  sharedArrivalB: createRoute([192, 193], [
    { to: [234, 193] }, { controls: [[300, 193], [327, 126]], to: [390, 126] }, { to: [500, 148] },
  ]),
  arrivalA: createRoute([192, 59], [
    { to: [234, 59] }, { controls: [[300, 59], [327, 59]], to: [390, 59] }, { to: [500, 77] },
  ]),
  arrivalB: createRoute([192, 193], [
    { to: [234, 193] }, { controls: [[300, 193], [327, 193]], to: [390, 193] }, { to: [500, 211] },
  ]),
  sharedPending: createRoute([500, 148], [
    { to: [610, 126] }, { controls: [[662, 126], [679, 59]], to: [769, 59] },
  ]),
  sharedDelivery: createRoute([500, 148], [
    { to: [610, 126] }, { controls: [[662, 126], [679, 193]], to: [769, 193] },
  ]),
  deliveryA: createRoute([500, 77], [
    { to: [610, 59] }, { controls: [[662, 59], [679, 59]], to: [769, 59] },
  ]),
  deliveryB: createRoute([500, 211], [
    { to: [610, 193] }, { controls: [[662, 193], [679, 193]], to: [769, 193] },
  ]),
};

const node = (x: number, y: number, width: number, height: number, label: Point) => ({
  x, y, width, height, label,
});

export const settlementLayouts = {
  horizontal: {
    viewBox: '0 0 1000 252',
    clients: [node(24, 26, 210, 66, [114, 65]), node(24, 160, 210, 66, [114, 199])],
    accounts: [node(390, 20, 220, 78, [500, 48]), node(390, 154, 220, 78, [500, 182])],
    pool: node(390, 20, 220, 212, [500, 115]),
    deliveries: [
      { ...node(730, 20, 246, 78, [872, 54]), status: [872, 76], marker: [769, 59] },
      { ...node(730, 154, 246, 78, [872, 188]), status: [872, 210], marker: [769, 193] },
    ],
    routes: horizontalRoutes,
  },
  vertical: {
    viewBox: '0 0 520 340',
    clients: [node(24, 22, 216, 62, [132, 60]), node(280, 22, 216, 62, [388, 60])],
    accounts: [node(24, 124, 216, 78, [132, 150]), node(280, 124, 216, 78, [388, 150])],
    pool: node(108, 124, 304, 78, [260, 150]),
    deliveries: [
      { ...node(24, 244, 216, 72, [156, 282]), status: [132, 303], marker: [62, 267] },
      { ...node(280, 244, 216, 72, [412, 282]), status: [388, 303], marker: [318, 267] },
    ],
    routes: verticalRoutes,
  },
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
  const delivery = ease((sceneTime - timing.deliveryDelay) / timing.deliveryTravel);
  const opacity = phase === 0 ? clamp(sceneTime / timing.fade)
    : phase === 2 ? clamp((timing.scene - sceneTime) / timing.fade) : 1;
  return {
    phase,
    delivered: phase === 2 || (phase === 1 && sceneTime >= timing.deliveryConfirmation),
    opacity,
    sharedA: phase === 0 ? pointOnRoute(routes.sharedArrival, arrival)
      : pointOnRoute(routes.sharedDelivery, phase === 1 ? delivery : 1),
    dedicatedA: phase === 0 ? pointOnRoute(routes.arrivalA, arrival)
      : pointOnRoute(routes.deliveryA, phase === 1 ? delivery : 1),
    dedicatedB: phase === 0 ? pointOnRoute(routes.arrivalB,
      ease((sceneTime - timing.arrivalDelay - timing.secondClientDelay) / timing.arrivalTravel))
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
