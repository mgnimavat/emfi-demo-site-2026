import assert from 'node:assert/strict';
import test from 'node:test';
import {
  getLinkedSettlementComparisonFrame,
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
