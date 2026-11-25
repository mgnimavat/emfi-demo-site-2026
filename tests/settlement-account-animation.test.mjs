import assert from 'node:assert/strict';
import test from 'node:test';
import { directPaceScale, getDirectRouteDuration } from '../src/components/emfi-sections/values.ts';
import {
  getSettlementAnimationFrame,
  settlementLayouts,
  getSettlementComparisonFrame,
  settlementAnimationTiming,
} from '../src/lib/settlement-account-animation.ts';

const getVerticalFrame = (elapsed) => getSettlementAnimationFrame(elapsed, 'vertical');
const station = ({ x, y }) => [x, y];
const tokenKeys = ['sharedA', 'dedicatedA', 'dedicatedB'];
const distance = (from, to) => Math.hypot(to[0] - from[0], to[1] - from[1]);

test('tokens keep their positions across scene boundaries', () => {
  for (const boundary of [settlementAnimationTiming.scene, settlementAnimationTiming.scene * 2]) {
    const before = getVerticalFrame(boundary - 1);
    const after = getVerticalFrame(boundary);
    for (const key of tokenKeys) assert.ok(distance(before[key], after[key]) < 0.01, key);
    assert.equal(after.opacity, 1);
  }
});

test('deliveries remain pending until the securities have arrived', () => {
  const time = settlementAnimationTiming.scene + settlementAnimationTiming.deliveryConfirmation;
  assert.equal(getVerticalFrame(time - 1).delivered, false);
  const completed = getVerticalFrame(time);
  assert.equal(completed.delivered, true);
  assert.deepEqual(completed.sharedA, station(settlementLayouts.vertical.deliveries[1]));
  assert.deepEqual(completed.dedicatedA, station(settlementLayouts.vertical.deliveries[0]));
  assert.deepEqual(completed.dedicatedB, station(settlementLayouts.vertical.deliveries[1]));
});

test('delivery progress advances before settlement is confirmed', () => {
  const { scene, deliveryDelay, deliveryTravel, deliveryConfirmation } = settlementAnimationTiming;
  assert.equal(getVerticalFrame(scene + deliveryDelay).deliveryProgress, 0);

  const traveling = getVerticalFrame(scene + deliveryDelay + deliveryTravel / 2);
  assert.equal(traveling.deliveryProgress, 0.5);
  assert.equal(traveling.arrivalProgressA, 1);
  assert.equal(traveling.arrivalProgressB, 1);
  assert.equal(traveling.delivered, false);

  const arrived = getVerticalFrame(scene + deliveryConfirmation);
  assert.equal(arrived.deliveryProgress, 1);
  assert.equal(arrived.delivered, true);
});

test('each arrival starts and finishes on its own schedule', () => {
  const { arrivalDelay, arrivalTravel, secondClientDelay } = settlementAnimationTiming;
  const firstDeparture = getVerticalFrame(arrivalDelay + secondClientDelay);
  assert.ok(firstDeparture.arrivalProgressA > 0);
  assert.equal(firstDeparture.arrivalProgressB, 0);

  const firstArrival = getVerticalFrame(arrivalDelay + arrivalTravel);
  assert.equal(firstArrival.arrivalProgressA, 1);
  assert.ok(firstArrival.arrivalProgressB < 1);
  assert.equal(firstArrival.deliveryProgress, 0);
});

test('visible tokens move continuously throughout the complete loop', () => {
  const cycle = settlementAnimationTiming.scene * 3;
  for (let elapsed = 16; elapsed <= cycle + 1000; elapsed += 16) {
    const before = getVerticalFrame(elapsed - 16);
    const after = getVerticalFrame(elapsed);
    if (before.opacity < 0.05 || after.opacity < 0.05) continue;
    for (const key of tokenKeys) assert.ok(distance(before[key], after[key]) < 5, `${key} at ${elapsed}ms`);
  }
});

test('loop reset happens while the tokens are invisible', () => {
  const cycle = settlementAnimationTiming.scene * 3;
  assert.ok(getVerticalFrame(cycle - 1).opacity < 0.01);
  const restart = getVerticalFrame(cycle);
  assert.equal(restart.opacity, 0);
  assert.equal(restart.phase, 0);
  assert.equal(restart.delivered, false);
  assert.deepEqual(restart.sharedA, station(settlementLayouts.vertical.clients[0]));
});

test('the model switches and the full loop resets on the Direct timeline', () => {
  const duration = getDirectRouteDuration(directPaceScale('home12'));
  assert.equal(getSettlementComparisonFrame(0, duration, 'horizontal').dedicated, false);
  for (const dedicated of [true, false]) {
    const boundary = duration * (dedicated ? 0.5 : 1);
    const before = getSettlementComparisonFrame(boundary - 1, duration, 'horizontal');
    const after = getSettlementComparisonFrame(boundary, duration, 'horizontal');
    assert.equal(before.dedicated, !dedicated);
    assert.equal(before.delivered, true);
    assert.ok(before.opacity < 0.01);
    assert.equal(after.dedicated, dedicated);
    assert.equal(after.phase, 0);
    assert.equal(after.delivered, false);
    assert.equal(after.opacity, 0);
  }
  assert.deepEqual(getSettlementComparisonFrame(duration, duration, 'horizontal'),
    getSettlementComparisonFrame(0, duration, 'horizontal'));
});

const assertDirectPosition = (point, from, to, progress) => {
  const offset = [point[0] - from.x, point[1] - from.y];
  const delta = [to.x - from.x, to.y - from.y];
  assert.ok(Math.abs(offset[0] * delta[1] - offset[1] * delta[0]) < 1e-6);
  assert.ok(Math.abs(Math.hypot(...offset) - Math.hypot(...delta) * progress) < 1e-6);
};

for (const orientation of ['horizontal', 'vertical', 'track']) {
  test(`markers take a direct path between the stations in the ${orientation} layout`, () => {
    const { clients, accounts, pool, deliveries } = settlementLayouts[orientation];
    const { scene, arrivalDelay, arrivalTravel, deliveryDelay, deliveryTravel } = settlementAnimationTiming;

    for (const fraction of [0.25, 0.5, 0.75]) {
      const arriving = getSettlementAnimationFrame(arrivalDelay + arrivalTravel * fraction, orientation);
      assertDirectPosition(arriving.sharedA, clients[0], pool, arriving.arrivalProgressA);
      assertDirectPosition(arriving.dedicatedA, clients[0], accounts[0], arriving.arrivalProgressA);
      assertDirectPosition(arriving.dedicatedB, clients[1], accounts[1], arriving.arrivalProgressB);

      const delivering = getSettlementAnimationFrame(scene + deliveryDelay + deliveryTravel * fraction, orientation);
      assertDirectPosition(delivering.sharedA, pool, deliveries[1], delivering.deliveryProgress);
      assertDirectPosition(delivering.dedicatedA, accounts[0], deliveries[0], delivering.deliveryProgress);
      assertDirectPosition(delivering.dedicatedB, accounts[1], deliveries[1], delivering.deliveryProgress);
    }

    const completed = getSettlementAnimationFrame(scene * 2, orientation);
    assert.deepEqual(completed.sharedA, station(deliveries[1]));
    assert.deepEqual(completed.dedicatedA, station(deliveries[0]));
    assert.deepEqual(completed.dedicatedB, station(deliveries[1]));
  });
}
