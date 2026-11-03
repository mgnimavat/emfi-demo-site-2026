import assert from 'node:assert/strict';
import { test } from 'node:test';
import { previousMonthTransactionDates } from '../src/lib/workstation-dates.ts';

test('January uses December of the previous year', () => {
  assert.deepEqual(previousMonthTransactionDates('2026-01'), {
    tradeDate: '15 Dec 2025',
    settlementDate: '16 Dec 2025',
  });
});

test('sample trade and settlement dates skip weekends', () => {
  assert.deepEqual(previousMonthTransactionDates('2026-03'), {
    tradeDate: '16 Feb 2026',
    settlementDate: '17 Feb 2026',
  });
  assert.deepEqual(previousMonthTransactionDates('2024-03'), {
    tradeDate: '15 Feb 2024',
    settlementDate: '16 Feb 2024',
  });
});

test('dates stay in the previous month and settlement follows trade throughout the year', () => {
  for (let month = 1; month <= 12; month += 1) {
    const key = `2026-${String(month).padStart(2, '0')}`;
    const dates = previousMonthTransactionDates(key);
    const trade = new Date(`${dates.tradeDate} 12:00:00 GMT`);
    const settlement = new Date(`${dates.settlementDate} 12:00:00 GMT`);
    const expectedMonth = new Date(Date.UTC(2026, month - 2, 1));
    for (const date of [trade, settlement]) {
      assert.equal(date.getUTCMonth(), expectedMonth.getUTCMonth());
      assert.equal(date.getUTCFullYear(), expectedMonth.getUTCFullYear());
      assert.ok(date.getUTCDay() >= 1 && date.getUTCDay() <= 5);
    }
    assert.ok(settlement > trade);
  }
});

test('server and invalid month snapshots leave dates empty', () => {
  for (const value of ['', '2026-00', '2026-13', 'invalid']) {
    assert.deepEqual(previousMonthTransactionDates(value), { tradeDate: '', settlementDate: '' });
  }
});
