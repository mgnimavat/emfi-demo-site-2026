export const fundPositionRanges = ['1-year', '3-year', 'since-launch'] as const;
export type FundPositionRange = typeof fundPositionRanges[number];
export type FundPositionPoint = { date: number; value: number };

const isPositionRow = (row: unknown): row is { date: number; settled: number } =>
  typeof row === 'object' && row !== null &&
  'date' in row && typeof row.date === 'number' && Number.isFinite(new Date(row.date).getTime()) &&
  'settled' in row && typeof row.settled === 'number' && Number.isFinite(row.settled);

export const parseFundPositionData = (payload: unknown): FundPositionPoint[] => {
  if (typeof payload !== 'object' || payload === null || !('data' in payload) ||
    !Array.isArray(payload.data) || !payload.data.every(isPositionRow)) {
    throw new Error('Invalid fund position feed');
  }

  const valuesByDate = new Map(payload.data.map(({ date, settled }) => [date, settled]));
  if (valuesByDate.size < 2) throw new Error('Fund position feed has fewer than two dates');

  const values = [...valuesByDate.values()];
  const minimum = Math.min(...values);
  const spread = Math.max(...values) - minimum;
  return [...valuesByDate.entries()].sort(([first], [second]) => first - second)
    .map(([date, value]) => ({ date, value: spread === 0 ? 0.5 : (value - minimum) / spread }));
};
