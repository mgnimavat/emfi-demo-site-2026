import { unstable_cache } from 'next/cache';
import { NextResponse } from 'next/server';
import { fundPositionRanges, parseFundPositionData, type FundPositionRange } from '@/lib/fund-position-data';

const feedRoot = 'https://emfi-dev.s3.eu-west-2.amazonaws.com/data/';
const feedRefreshSeconds = 6 * 60 * 60;
const feedTimeoutMs = 8000;

const readFundPositions = unstable_cache(async (range: FundPositionRange) => {
  const response = await fetch(`${feedRoot}funds-${range}-position-data.json`, {
    headers: { Accept: 'application/json' },
    cache: 'no-store',
    signal: AbortSignal.timeout(feedTimeoutMs),
  });
  if (!response.ok) throw new Error('Fund position feed is unavailable');
  const payload: unknown = await response.json();
  return parseFundPositionData(payload);
}, ['fund-position-chart'], { revalidate: feedRefreshSeconds });

export const GET = async (_request: Request, { params }: { params: Promise<{ range: string }> }) => {
  const { range } = await params;
  const feedRange = fundPositionRanges.find((candidate) => candidate === range);
  if (!feedRange) return NextResponse.json({ error: 'Unknown chart range' }, { status: 404 });

  try {
    return NextResponse.json(await readFundPositions(feedRange), { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ error: 'Fund position data unavailable' }, {
      status: 502,
      headers: { 'Cache-Control': 'no-store' },
    });
  }
};
