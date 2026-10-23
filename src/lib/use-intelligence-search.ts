"use client";

import { useEffect, useRef, useState } from "react";
import { mergeIntelligenceReports, type IntelligenceLanguage, type IntelligenceReportsPage } from "./intelligence-reports";

type SearchState = IntelligenceReportsPage & { term: string; loading: boolean; error: boolean };

async function requestSearch(language: IntelligenceLanguage, term: string, page: number, signal: AbortSignal): Promise<IntelligenceReportsPage> {
  const response = await fetch(`/api/intelligence/${language}/search/${encodeURIComponent(term)}?page=${page}`, { headers: { Accept: "application/json" }, signal });
  if (!response.ok) throw new Error("Unable to search reports");
  return response.json();
}

export function useIntelligenceSearch(language: IntelligenceLanguage, keyword: string) {
  const term = keyword.trim();
  const [state, setState] = useState<SearchState>({ term: "", records: [], next: null, loading: false, error: false });
  const [attempt, setAttempt] = useState(0);
  const controller = useRef<AbortController | null>(null);
  const busy = useRef(false);

  useEffect(() => {
    if (!term) return;
    const abort = new AbortController();
    controller.current = abort;
    const timer = window.setTimeout(async () => {
      busy.current = true;
      setState({ term, records: [], next: null, loading: true, error: false });
      try {
        const result = await requestSearch(language, term, 1, abort.signal);
        if (!abort.signal.aborted) setState({ ...result, term, loading: false, error: false });
      } catch {
        if (!abort.signal.aborted) setState({ term, records: [], next: null, loading: false, error: true });
      } finally {
        if (!abort.signal.aborted) busy.current = false;
      }
    }, 350);
    return () => { window.clearTimeout(timer); abort.abort(); controller.current?.abort(); busy.current = false; };
  }, [language, term, attempt]);

  async function loadMore() {
    if (!term || state.term !== term || state.next === null || busy.current) return;
    busy.current = true;
    setState(previous => ({ ...previous, loading: true, error: false }));
    const abort = new AbortController();
    controller.current = abort;
    try {
      const result = await requestSearch(language, term, state.next, abort.signal);
      if (!abort.signal.aborted) setState(previous => ({ ...previous, records: mergeIntelligenceReports(previous.records, result.records), next: result.next, loading: false, error: false }));
    } catch {
      if (!abort.signal.aborted) setState(previous => ({ ...previous, loading: false, error: true }));
    } finally {
      if (!abort.signal.aborted) busy.current = false;
    }
  }

  return {
    active: Boolean(term),
    records: state.term === term ? state.records : [],
    loading: Boolean(term) && (state.term !== term || state.loading),
    next: state.term === term ? state.next : null,
    error: state.term === term && state.error,
    loadMore,
    retry: () => state.records.length ? loadMore() : setAttempt(previous => previous + 1),
  };
}
