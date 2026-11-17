import assert from 'node:assert/strict';
import test from 'node:test';
import { getSettlementAnimationFrame, settlementAnimationTiming } from '../src/lib/settlement-account-animation.ts';

const tokenKeys = ['sharedA', 'dedicatedA', 'dedicatedB'];
const distance = (from, to) => Math.hypot(to[0] - from[0], to[1] - from[1]);

test('tokens keep their positions across scene boundaries', () => {
  for (const boundary of [settlementAnimationTiming.scene, settlementAnimationTiming.scene * 2]) {
    const before = getSettlementAnimationFrame(boundary - 1);
    const after = getSettlementAnimationFrame(boundary);
    for (const key of tokenKeys) assert.ok(distance(before[key], after[key]) < 0.01, key);
    assert.equal(after.opacity, 1);
  }
});

test('deliveries remain pending until the securities have arrived', () => {
  const time = settlementAnimationTiming.scene + settlementAnimationTiming.deliveryConfirmation;
  assert.equal(getSettlementAnimationFrame(time - 1).delivered, false);
  const completed = getSettlementAnimationFrame(time);
  assert.equal(completed.delivered, true);
  assert.deepEqual(completed.sharedA, [318, 270]);
  assert.deepEqual(completed.dedicatedA, [62, 270]);
  assert.deepEqual(completed.dedicatedB, [318, 270]);
});

test('visible tokens move continuously throughout the complete loop', () => {
  const cycle = settlementAnimationTiming.scene * 3;
  for (let elapsed = 16; elapsed <= cycle + 1000; elapsed += 16) {
    const before = getSettlementAnimationFrame(elapsed - 16);
    const after = getSettlementAnimationFrame(elapsed);
    if (before.opacity < 0.05 || after.opacity < 0.05) continue;
    for (const key of tokenKeys) assert.ok(distance(before[key], after[key]) < 5, `${key} at ${elapsed}ms`);
  }
});

test('loop reset happens while the tokens are invisible', () => {
  const cycle = settlementAnimationTiming.scene * 3;
  assert.ok(getSettlementAnimationFrame(cycle - 1).opacity < 0.01);
  const restart = getSettlementAnimationFrame(cycle);
  assert.equal(restart.opacity, 0);
  assert.equal(restart.phase, 0);
  assert.equal(restart.delivered, false);
  assert.deepEqual(restart.sharedA, [132, 70]);
});
