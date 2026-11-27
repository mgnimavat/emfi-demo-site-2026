export const fundSearchMinLength = 2;
export const fundSearchMaxLength = 180;
export const fundSearchLimit = 12;

export const fundDetailFields = [
  'isin', 'fundHouse', 'familyCurrency', 'incomeTreatment', 'domicile', 'lei', 'unitDecimals',
] as const;

export type FundSearchOption = {
  id: string;
  name: string;
} & Partial<Record<(typeof fundDetailFields)[number], string>>;

export type FundSearchPage = {
  results: FundSearchOption[];
  hasMore: boolean;
};

export type FundSearchResponse = FundSearchPage & { source: 'workbook' | 'provider' };

export const normalizeFundSearch = (value: string) =>
  value.normalize('NFKD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();

export const canSearchFunds = (query: string) =>
  query.length <= fundSearchMaxLength &&
  normalizeFundSearch(query).replaceAll(' ', '').length >= fundSearchMinLength;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const readText = (value: unknown) => typeof value === 'string' ? value.trim() : '';

export const readFundSearchPage = (value: unknown): FundSearchPage => {
  if (!isRecord(value) || !Array.isArray(value.results)) {
    throw new Error('Invalid fund search response');
  }

  const results: FundSearchOption[] = [];
  const seen = new Set<string>();
  for (const row of value.results) {
    if (!isRecord(row)) throw new Error('Invalid fund search result');
    const id = readText(row.id);
    const name = readText(row.name);
    if (!id || !name) throw new Error('Fund search result is missing an ID or name');
    if (seen.has(id)) continue;
    if (results.length === fundSearchLimit) return { results, hasMore: true };

    seen.add(id);
    const result: FundSearchOption = { id, name };
    for (const field of fundDetailFields) {
      const text = readText(row[field]);
      if (text) result[field] = text;
    }
    results.push(result);
  }
  return { results, hasMore: value.hasMore === true };
};

export const requestFundSearch = async (query: string, signal: AbortSignal): Promise<FundSearchResponse> => {
  const response = await fetch(`/api/funds/search?${new URLSearchParams({ q: query })}`, {
    headers: { Accept: 'application/json' },
    signal,
  });
  if (!response.ok) throw new Error('Fund search unavailable');

  const payload: unknown = await response.json();
  if (!isRecord(payload) || (payload.source !== 'workbook' && payload.source !== 'provider')) {
    throw new Error('Invalid fund search source');
  }
  return { ...readFundSearchPage(payload), source: payload.source };
};
