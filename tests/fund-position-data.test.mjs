import assert from 'node:assert/strict';
import test from 'node:test';
import { parseFundPositionData } from '../src/lib/fund-position-data.ts';

test('chart points use settled values and preserve the sorted feed dates', () => {
  const first = Date.UTC(2026, 10, 18);
  const second = Date.UTC(2026, 10, 19);
  const third = Date.UTC(2026, 10, 22);
  assert.deepEqual(parseFundPositionData({ data: [
    { date: third, settled: 30, traded: 40 },
    { date: first, settled: 10, traded: 200 },
    { date: second, settled: 15, traded: 200 },
    { date: second, settled: 20, traded: 500 },
  ] }), [
    { date: first, value: 0 },
    { date: second, value: 0.5 },
    { date: third, value: 1 },
  ]);
});

test('invalid or incomplete feeds cannot produce a chart', () => {
  assert.throws(() => parseFundPositionData({ data: [] }));
  assert.throws(() => parseFundPositionData({ data: [{ date: 1, settled: 1 }, { date: 2, traded: 1 }] }));
});

test('the five-year window trims older observations before normalizing', () => {
  const beforeCutoff = Date.UTC(2019, 1, 27);
  const atCutoff = Date.UTC(2019, 1, 28);
  const latest = Date.UTC(2024, 1, 29);
  const data = [
    { date: latest, settled: 20 },
    { date: beforeCutoff, settled: 100 },
    { date: atCutoff, settled: 10 },
  ];
  const expected = [{ date: atCutoff, value: 0 }, { date: latest, value: 1 }];
  assert.deepEqual(parseFundPositionData({ data }, 5), expected);
  assert.deepEqual(parseFundPositionData({ data: data.filter(({ date }) => date >= atCutoff) }, 5), expected);
});
