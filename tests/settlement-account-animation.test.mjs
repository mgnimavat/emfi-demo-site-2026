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

test('the delivery trail follows the tokens before settlement is confirmed', () => {
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

test('each arrival trail follows its own token from the client to the account', () => {
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

for (const [orientation, axis] of [['horizontal', 'x'], ['vertical', 'y'], ['track', 'y']]) {
  test(`the ${orientation} tracks connect clients, accounts and deliveries in order`, () => {
    const { clients, accounts, pool, deliveries, routes } = settlementLayouts[orientation];

    for (const [index, sharedArrival, sharedDelivery, arrival, delivery] of [
      [0, routes.sharedArrival, routes.sharedPending, routes.arrivalA, routes.deliveryA],
      [1, routes.sharedArrivalB, routes.sharedDelivery, routes.arrivalB, routes.deliveryB],
    ]) {
      const client = clients[index];
      const account = accounts[index];
      const destination = deliveries[index];
      assert.deepEqual(sharedArrival.points[0], station(client));
      assert.deepEqual(sharedArrival.points.at(-1), station(pool));
      assert.deepEqual(sharedDelivery.points[0], station(pool));
      assert.deepEqual(sharedDelivery.points.at(-1), station(destination));
      assert.deepEqual(arrival.points[0], station(client));
      assert.deepEqual(arrival.points.at(-1), station(account));
      assert.deepEqual(delivery.points[0], station(account));
      assert.deepEqual(delivery.points.at(-1), station(destination));
      assert.ok(client[axis] < account[axis] && account[axis] < destination[axis]);
    }

    const completed = getSettlementAnimationFrame(settlementAnimationTiming.scene * 2, orientation);
    assert.deepEqual(completed.sharedA, station(deliveries[1]));
    assert.deepEqual(completed.dedicatedA, station(deliveries[0]));
    assert.deepEqual(completed.dedicatedB, station(deliveries[1]));
  });
}
