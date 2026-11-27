'use client';

import { useEffect, useState } from 'react';
import { canSearchFunds, requestFundSearch, type FundSearchResponse } from './fund-search';

type SearchResult = (FundSearchResponse & { status: 'ready' }) | { status: 'error' };
type SearchState = SearchResult | { status: 'idle' | 'loading' };

const searchDebounceMs = 280;

export const useFundSearch = (query: string, enabled: boolean) => {
  const term = query.trim();
  const canSearch = enabled && canSearchFunds(term);
  const [attempt, setAttempt] = useState(0);
  const [response, setResponse] = useState<{ term: string; attempt: number; result: SearchResult }>();

  useEffect(() => {
    if (!canSearch) return;

    const controller = new AbortController();
    const { signal } = controller;
    const timer = window.setTimeout(async () => {
      try {
        const result = await requestFundSearch(term, signal);
        if (!signal.aborted) setResponse({ term, attempt, result: { status: 'ready', ...result } });
      } catch {
        if (!signal.aborted) setResponse({ term, attempt, result: { status: 'error' } });
      }
    }, searchDebounceMs);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [canSearch, term, attempt]);

  const state: SearchState = !canSearch ? { status: 'idle' }
    : response?.term === term && response.attempt === attempt ? response.result
    : { status: 'loading' };

  return { state, retry: () => setAttempt((current) => current + 1) };
};
