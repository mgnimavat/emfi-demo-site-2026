type Point = readonly [number, number];
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

export const settlementRoutes = {
  sharedArrival: createRoute([132, 70], [
    { to: [132, 84] }, { controls: [[132, 112], [260, 98]], to: [260, 124] }, { to: [260, 180] },
  ]),
  arrivalA: createRoute([132, 70], [{ to: [132, 180] }]),
  arrivalB: createRoute([388, 70], [{ to: [388, 180] }]),
  sharedDelivery: createRoute([260, 180], [
    { to: [260, 202] }, { controls: [[260, 246], [318, 230]], to: [318, 270] },
  ]),
  deliveryA: createRoute([132, 180], [
    { to: [132, 202] }, { controls: [[132, 232], [62, 238]], to: [62, 270] },
  ]),
  deliveryB: createRoute([388, 180], [
    { to: [388, 202] }, { controls: [[388, 232], [318, 238]], to: [318, 270] },
  ]),
};

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
  scene: 6000,
  arrivalDelay: 600,
  arrivalTravel: 3400,
  secondClientDelay: 200,
  deliveryDelay: 400,
  deliveryTravel: 3600,
  deliveryConfirmation: 4200,
  fade: 1000,
} as const;

export const getSettlementAnimationFrame = (elapsed: number) => {
  const timing = settlementAnimationTiming;
  const cycle = elapsed % (timing.scene * 3);
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
    sharedA: phase === 0 ? pointOnRoute(settlementRoutes.sharedArrival, arrival)
      : pointOnRoute(settlementRoutes.sharedDelivery, phase === 1 ? delivery : 1),
    dedicatedA: phase === 0 ? pointOnRoute(settlementRoutes.arrivalA, arrival)
      : pointOnRoute(settlementRoutes.deliveryA, phase === 1 ? delivery : 1),
    dedicatedB: phase === 0 ? pointOnRoute(settlementRoutes.arrivalB,
      ease((sceneTime - timing.arrivalDelay - timing.secondClientDelay) / timing.arrivalTravel))
      : pointOnRoute(settlementRoutes.deliveryB, phase === 1 ? delivery : 1),
  };
};
