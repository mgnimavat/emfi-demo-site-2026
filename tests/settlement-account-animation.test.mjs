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
  assert.deepEqual(completed.sharedA, [318, 270]);
  assert.deepEqual(completed.dedicatedA, [62, 270]);
  assert.deepEqual(completed.dedicatedB, [318, 270]);
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
  assert.deepEqual(restart.sharedA, [132, 70]);
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

test('the horizontal routes keep clients, accounts and deliveries in reading order', () => {
  const { clients, accounts, deliveries } = settlementLayouts.horizontal;
  const first = getSettlementAnimationFrame(0, 'horizontal');
  const arrived = getSettlementAnimationFrame(settlementAnimationTiming.scene, 'horizontal');
  const delivered = getSettlementAnimationFrame(settlementAnimationTiming.scene * 2, 'horizontal');
  const inside = ([x, y], box) => x > box.x && x < box.x + box.width && y > box.y && y < box.y + box.height;
  assert.ok(inside(first.dedicatedA, clients[0]));
  assert.ok(inside(first.dedicatedB, clients[1]));
  assert.ok(inside(arrived.dedicatedA, accounts[0]));
  assert.ok(inside(arrived.dedicatedB, accounts[1]));
  assert.ok(inside(delivered.dedicatedA, deliveries[0]));
  assert.ok(inside(delivered.dedicatedB, deliveries[1]));
  assert.ok(inside(delivered.sharedA, deliveries[1]));
  assert.ok(clients[0].x < accounts[0].x && accounts[0].x < deliveries[0].x);
});

test('vertical connectors meet the account and delivery boxes at their centers', () => {
  const { routes, accounts, pool, deliveries } = settlementLayouts.vertical;
  const centerX = (box) => box.x + box.width / 2;

  for (const [shared, dedicated, index] of [
    [routes.sharedPending, routes.deliveryA, 0],
    [routes.sharedDelivery, routes.deliveryB, 1],
  ]) {
    const delivery = deliveries[index];
    const account = accounts[index];
    const gapStart = account.y + account.height;
    const gapEnd = delivery.y;
    const sharedConnector = shared.points.filter(([, y]) => y >= gapStart && y <= gapEnd);
    const dedicatedConnector = dedicated.points.filter(([, y]) => y >= gapStart && y <= gapEnd);

    assert.deepEqual(sharedConnector[0], [centerX(pool), gapStart]);
    assert.deepEqual(sharedConnector.at(-1), [centerX(delivery), gapEnd]);
    assert.deepEqual(dedicatedConnector[0], [centerX(account), gapStart]);
    assert.deepEqual(dedicatedConnector.at(-1), [centerX(delivery), gapEnd]);
    assert.ok(dedicatedConnector.every(([x]) => Math.abs(x - centerX(account)) < 0.001));
  }
});

test('the archive track connects the shared pool and dedicated accounts to the expected deliveries', () => {
  const { clients, accounts, pool, deliveries, routes } = settlementLayouts.track;
  const station = ({ x, y }) => [x, y];

  assert.deepEqual(routes.sharedArrival.points.at(-1), station(pool));
  assert.deepEqual(routes.sharedArrivalB.points.at(-1), station(pool));

  for (const [index, arrival, delivery] of [
    [0, routes.arrivalA, routes.deliveryA],
    [1, routes.arrivalB, routes.deliveryB],
  ]) {
    assert.deepEqual(arrival.points[0], station(clients[index]));
    assert.deepEqual(arrival.points.at(-1), station(accounts[index]));
    assert.deepEqual(delivery.points[0], station(accounts[index]));
    assert.deepEqual(delivery.points.at(-1), station(deliveries[index]));
    assert.ok(delivery.points.every(([x]) => Math.abs(x - clients[index].x) < 0.001));
    assert.ok(clients[index].y < accounts[index].y && accounts[index].y < deliveries[index].y);
  }

  const completed = getSettlementAnimationFrame(settlementAnimationTiming.scene * 2, 'track');
  assert.deepEqual(completed.sharedA, station(deliveries[1]));
  assert.deepEqual(completed.dedicatedA, station(deliveries[0]));
  assert.deepEqual(completed.dedicatedB, station(deliveries[1]));
});
