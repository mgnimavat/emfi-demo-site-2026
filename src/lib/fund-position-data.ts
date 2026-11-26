export const fundPositionRanges = ['1-year', '3-year', '5-year'] as const;
export type FundPositionRange = typeof fundPositionRanges[number];
export type FundPositionPoint = { date: number; value: number };

const isTimestamp = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(new Date(value).getTime());

const isPositionRow = (row: unknown): row is { date: number; settled: number } =>
  typeof row === 'object' && row !== null &&
  'date' in row && isTimestamp(row.date) &&
  'settled' in row && typeof row.settled === 'number' && Number.isFinite(row.settled);

const isFundPositionPoint = (point: unknown): point is FundPositionPoint =>
  typeof point === 'object' && point !== null && 'date' in point && isTimestamp(point.date) &&
  'value' in point && typeof point.value === 'number' && point.value >= 0 && point.value <= 1;

export const isFundPositionSeries = (points: unknown): points is FundPositionPoint[] =>
  Array.isArray(points) && points.length > 1 && points.every(isFundPositionPoint) &&
  points.every(({ date }, index) => index === 0 || date > points[index - 1].date);

export const parseFundPositionData = (payload: unknown, trailingYears?: number): FundPositionPoint[] => {
  if (typeof payload !== 'object' || payload === null || !('data' in payload) ||
    !Array.isArray(payload.data) || !payload.data.every(isPositionRow)) {
    throw new Error('Invalid fund position feed');
  }

  const valuesByDate = new Map(payload.data.map(({ date, settled }) => [date, settled]));
  if (valuesByDate.size < 2) throw new Error('Fund position feed has fewer than two dates');

  const positions = [...valuesByDate.entries()].sort(([first], [second]) => first - second);
  const cutoff = new Date(positions[positions.length - 1][0]);
  const latestMonth = cutoff.getUTCMonth();
  if (trailingYears !== undefined) {
    cutoff.setUTCFullYear(cutoff.getUTCFullYear() - trailingYears);
    if (cutoff.getUTCMonth() !== latestMonth) cutoff.setUTCDate(0);
  }
  const period = trailingYears === undefined
    ? positions
    : positions.filter(([date]) => date >= cutoff.getTime());
  if (period.length < 2) throw new Error('Fund position period has fewer than two dates');

  const values = period.map(([, value]) => value);
  const minimum = Math.min(...values);
  const spread = Math.max(...values) - minimum;
  return period.map(([date, value]) => ({ date, value: spread === 0 ? 0.5 : (value - minimum) / spread }));
};
