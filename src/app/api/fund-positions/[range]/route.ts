import { NextResponse } from 'next/server';
import { fundPositionRanges, parseFundPositionData } from '@/lib/fund-position-data';

const feedRoot = 'https://emfi-dev.s3.eu-west-2.amazonaws.com/data/';
const feedRefreshSeconds = 900;
const feedTimeoutMs = 8000;

export const GET = async (_request: Request, { params }: { params: Promise<{ range: string }> }) => {
  const { range } = await params;
  const feedRange = fundPositionRanges.find((candidate) => candidate === range);
  if (!feedRange) return NextResponse.json({ error: 'Unknown chart range' }, { status: 404 });

  try {
    const response = await fetch(`${feedRoot}funds-${feedRange}-position-data.json`, {
      headers: { Accept: 'application/json' },
      next: { revalidate: feedRefreshSeconds },
      signal: AbortSignal.timeout(feedTimeoutMs),
    });
    if (!response.ok) throw new Error('Fund position feed is unavailable');
    const payload: unknown = await response.json();
    return NextResponse.json(parseFundPositionData(payload), { headers: { 'Cache-Control': 'no-store' } });
  } catch {
    return NextResponse.json({ error: 'Fund position data unavailable' }, {
      status: 502,
      headers: { 'Cache-Control': 'no-store' },
    });
  }
};
