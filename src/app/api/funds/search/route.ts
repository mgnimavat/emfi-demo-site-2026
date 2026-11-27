import { NextResponse } from 'next/server';
import { searchFundProvider, searchFundUniverse } from '@/lib/fund-directory';
import { canSearchFunds, type FundSearchResponse } from '@/lib/fund-search';

const headers = { 'Cache-Control': 'no-store' };

export const GET = async (request: Request) => {
  const query = new URL(request.url).searchParams.get('q')?.trim() ?? '';
  if (!canSearchFunds(query)) {
    return NextResponse.json({ error: 'invalid_query' }, { status: 400, headers });
  }

  const endpoint = process.env.EMFI_FUND_SEARCH_URL;
  try {
    const page = endpoint
      ? await searchFundProvider(endpoint, query, process.env.EMFI_FUND_SEARCH_API_KEY, request.signal)
      : await searchFundUniverse(query);
    const result: FundSearchResponse = { ...page, source: endpoint ? 'provider' : 'workbook' };
    return NextResponse.json(result, { headers });
  } catch {
    return NextResponse.json({ error: 'catalogue_unavailable' }, { status: 502, headers });
  }
};
