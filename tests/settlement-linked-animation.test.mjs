import assert from 'node:assert/strict';
import test from 'node:test';
import {
  getLinkedSettlementComparisonFrame,
  getLinkedSettlementStoryProgress,
  getLinkedSettlementTradeFill,
  getLinkedSettlementScene,
  linkedSettlementOutcome,
  linkedSettlementTiming,
} from '../src/lib/settlement-linked-animation.ts';

test('the unlinked buy stays settled when the sell fails', () => {
  const { buySettlement, sellAttempt, outcome } = linkedSettlementTiming;
  assert.deepEqual(getLinkedSettlementScene(buySettlement - 1).unlinked, { buy: 'pending', sell: 'pending' });
  assert.deepEqual(getLinkedSettlementScene(buySettlement).unlinked, { buy: 'settled', sell: 'pending' });
  assert.deepEqual(getLinkedSettlementScene(sellAttempt).unlinked, { buy: 'settled', sell: 'settling' });
  assert.deepEqual(getLinkedSettlementScene(outcome).unlinked, { buy: 'settled', sell: 'failed' });
});

test('the story connector fills toward the next step and resets for each scenario', () => {
  const { cycle, sellAttempt, outcome } = linkedSettlementTiming;
  for (const start of [0, cycle, cycle * 2]) {
    assert.equal(getLinkedSettlementStoryProgress(start), 0);
    assert.equal(getLinkedSettlementStoryProgress(start + sellAttempt / 2), 0.5);
    assert.equal(getLinkedSettlementStoryProgress(start + sellAttempt), 0);
    assert.equal(getLinkedSettlementStoryProgress(start + (sellAttempt + outcome) / 2), 0.5);
    assert.equal(getLinkedSettlementStoryProgress(start + outcome), 1);
  }
});

test('the linked buy is held until both instructions settle together', () => {
  const { buySettlement, outcome, cycle } = linkedSettlementTiming;
  assert.deepEqual(getLinkedSettlementScene(buySettlement).linked, { buy: 'held', sell: 'pending' });
  assert.deepEqual(getLinkedSettlementScene(outcome - 1).linked, { buy: 'held', sell: 'settling' });
  assert.deepEqual(linkedSettlementOutcome.linked, { buy: 'settled', sell: 'settled' });
  assert.equal(getLinkedSettlementScene(outcome), linkedSettlementOutcome);
  assert.equal(getLinkedSettlementScene(cycle), getLinkedSettlementScene(0));
});

test('one graph plays the unlinked flow, the linked flow, and then restarts', () => {
  const { cycle, sellAttempt, outcome } = linkedSettlementTiming;
  assert.deepEqual(getLinkedSettlementComparisonFrame(0), {
    linked: false, buy: 'pending', sell: 'pending', progress: 0,
  });
  assert.deepEqual(getLinkedSettlementComparisonFrame((sellAttempt + outcome) / 2), {
    linked: false, buy: 'settled', sell: 'settling', progress: 0.5,
  });
  assert.deepEqual(getLinkedSettlementComparisonFrame(cycle - 1), {
    linked: false, buy: 'settled', sell: 'failed', progress: 1,
  });
  assert.deepEqual(getLinkedSettlementComparisonFrame(cycle), {
    linked: true, buy: 'held', sell: 'pending', progress: 0,
  });
  assert.deepEqual(getLinkedSettlementComparisonFrame(cycle + outcome), {
    linked: true, buy: 'settled', sell: 'settled', progress: 1,
  });
  assert.deepEqual(getLinkedSettlementComparisonFrame(cycle * 2), getLinkedSettlementComparisonFrame(0));
});

test('only the buy fills without linking and both fills stay in sync with linking', () => {
  const { buySettlement, cycle, sellAttempt, outcome } = linkedSettlementTiming;
  const fillAt = (time) => getLinkedSettlementTradeFill(time, getLinkedSettlementComparisonFrame(time));
  assert.deepEqual(fillAt(0), { buy: 0, sell: 0 });
  assert.deepEqual(fillAt(buySettlement), { buy: 1, sell: 0 });
  assert.deepEqual(fillAt(outcome), { buy: 1, sell: 0 });
  assert.deepEqual(fillAt(cycle), { buy: 0, sell: 0 });
  assert.deepEqual(fillAt(cycle + (sellAttempt + outcome) / 2), { buy: 0.5, sell: 0.5 });
  assert.deepEqual(fillAt(cycle + outcome), { buy: 1, sell: 1 });
});
