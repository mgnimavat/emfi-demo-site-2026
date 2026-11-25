import assert from 'node:assert/strict';
import test from 'node:test';
import {
  getSettlementChapterFrame,
  nextSettlementChapter,
  settlementChapterDuration,
  settlementChapters,
} from '../src/lib/settlement-account-animation.ts';

test('the shared and separate account scenes loop in order', () => {
  assert.deepEqual(settlementChapters, ['shared', 'separate']);
  assert.equal(nextSettlementChapter('shared'), 'separate');
  assert.equal(nextSettlementChapter('separate'), 'shared');
});

test('Client B’s own securities arrive before Client A’s securities cover the shortfall', () => {
  const frameAt = (elapsed) => getSettlementChapterFrame('shared', elapsed);
  const ownDelivery = frameAt(825);
  assert.equal(ownDelivery.firstTile, 0.5);
  assert.equal(ownDelivery.secondTile, 0);
  assert.equal(ownDelivery.crossUse, false);

  const crossDelivery = frameAt(1950);
  assert.equal(crossDelivery.firstTile, 1);
  assert.equal(crossDelivery.secondTile, 0.5);
  assert.equal(crossDelivery.crossUse, true);
  assert.equal(crossDelivery.delivered, false);
  assert.equal(frameAt(2400).secondTile, 1);
  assert.equal(frameAt(2400).delivered, true);
});

test('dedicated-account tiles stay inside their own accounts throughout the scene', () => {
  for (const elapsed of [0, 650, settlementChapterDuration('separate')]) {
    const frame = getSettlementChapterFrame('separate', elapsed);
    assert.equal(frame.crossUse, false);
    assert.equal(frame.firstTile, 0);
    assert.equal(frame.secondTile, 0);
    assert.equal(frame.delivered, elapsed >= 650);
  }
});

test('every chapter holds its completed state before the next scene', () => {
  for (const chapter of settlementChapters) {
    const duration = settlementChapterDuration(chapter);
    assert.equal(getSettlementChapterFrame(chapter, duration - 1000).delivered, true);
    assert.deepEqual(getSettlementChapterFrame(chapter, duration - 1), getSettlementChapterFrame(chapter, duration));
  }
});
