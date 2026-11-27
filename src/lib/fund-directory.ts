import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { gunzipSync } from 'node:zlib';
import {
  fundSearchLimit,
  normalizeFundSearch,
  readFundSearchPage,
  type FundSearchOption,
  type FundSearchPage,
} from './fund-search';

type SearchableFund = {
  option: FundSearchOption;
  name: string;
  isin: string;
};

const snapshotPath = join(process.cwd(), 'src/content/data/fund-universe.json.gz');
const providerTimeoutMs = 5_000;
let fundIndex: Promise<SearchableFund[]> | undefined;

const loadFundIndex = async () => {
  const snapshot = await readFile(snapshotPath);
  const records: FundSearchOption[] = JSON.parse(gunzipSync(snapshot).toString('utf8'));
  return records.map((option) => ({
    option,
    name: normalizeFundSearch(option.name),
    isin: option.isin?.toLowerCase() ?? '',
  }));
};

const readFundIndex = () => {
  fundIndex ??= loadFundIndex().catch((error: unknown) => {
    fundIndex = undefined;
    throw error;
  });
  return fundIndex;
};

const matchRank = (fund: SearchableFund, term: string, isinTerm: string, words: string[]) => {
  if (fund.isin === isinTerm) return 0;
  if (fund.name === term) return 1;
  if (fund.isin.startsWith(isinTerm)) return 2;
  if (fund.name.startsWith(term)) return 3;
  if (words.every((word) => fund.name.includes(word))) return 4;
  return -1;
};

export const searchFundUniverse = async (query: string): Promise<FundSearchPage> => {
  const term = normalizeFundSearch(query);
  const words = term.split(' ');
  const isinTerm = words.join('');
  const matches: FundSearchOption[][] = [[], [], [], [], []];
  let matchCount = 0;

  for (const fund of await readFundIndex()) {
    const rank = matchRank(fund, term, isinTerm, words);
    if (rank < 0) continue;
    const bucket = matches[rank];
    if (bucket.length < fundSearchLimit) bucket.push(fund.option);
    matchCount++;
  }

  return {
    results: matches.flat().slice(0, fundSearchLimit),
    hasMore: matchCount > fundSearchLimit,
  };
};

export const searchFundProvider = async (
  endpoint: string,
  query: string,
  apiKey: string | undefined,
  signal: AbortSignal,
) => {
  const url = new URL(endpoint);
  url.searchParams.set('q', query);
  url.searchParams.set('limit', String(fundSearchLimit));
  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
      ...(apiKey && { Authorization: `Bearer ${apiKey}` }),
    },
    cache: 'no-store',
    signal: AbortSignal.any([signal, AbortSignal.timeout(providerTimeoutMs)]),
  });
  if (!response.ok) throw new Error('Fund search provider unavailable');

  return readFundSearchPage(await response.json());
};
