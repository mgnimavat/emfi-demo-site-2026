"use client";

import { useEffect, useRef, useState } from "react";
import { intelligenceReportQuery, validIntelligenceReportDates, intelligenceReportFeeds, type IntelligenceReportDates, type IntelligenceLanguage, type IntelligenceReportFeed, type IntelligenceReportsPage } from "./intelligence-reports";

type FeedState = IntelligenceReportsPage & { error: boolean };
type Feeds = Record<IntelligenceReportFeed, FeedState>;

function initialFeeds(): Feeds {
  return {
    "get-other-report": { records: [], next: 1, error: false },
    "get-spacial-report": { records: [], next: 1, error: false },
  };
}

async function requestPage(language: IntelligenceLanguage, feed: IntelligenceReportFeed, page: number, signal: AbortSignal, dates: IntelligenceReportDates): Promise<IntelligenceReportsPage> {
  const response = await fetch(`/api/intelligence/${language}/${feed}?${intelligenceReportQuery(page, dates)}`, { headers: { Accept: "application/json" }, signal });
  if (!response.ok) throw new Error("Unable to load reports");
  return response.json();
}

export function useIntelligenceReports(language: IntelligenceLanguage, fromDate = "", toDate = "", enabled = true) {
  const key = `${language}/${fromDate}/${toDate}/${enabled}`;
  const [state, setState] = useState(() => ({ key, feeds: initialFeeds(), loading: enabled && validIntelligenceReportDates({ fromDate, toDate }) }));
  if (state.key !== key) {
    setState({ key, feeds: initialFeeds(), loading: enabled && validIntelligenceReportDates({ fromDate, toDate }) });
  }
  const { feeds, loading } = state;
  const controller = useRef<AbortController | null>(null);
  const busy = useRef(true);

  useEffect(() => {
    if (!enabled || !validIntelligenceReportDates({ fromDate, toDate })) return;
    const abort = new AbortController();
    controller.current = abort;
    busy.current = true;
    Promise.allSettled(intelligenceReportFeeds.map(feed => requestPage(language, feed, 1, abort.signal, { fromDate, toDate }))).then(results => {
      if (abort.signal.aborted) return;
      const feeds = Object.fromEntries(results.map((result, index) => [intelligenceReportFeeds[index], result.status === "fulfilled"
        ? { ...result.value, error: false }
        : { records: [], next: 1, error: true }])) as Feeds;
      busy.current = false;
      setState({ key: `${language}/${fromDate}/${toDate}/${enabled}`, feeds, loading: false });
    });
    return () => { abort.abort(); controller.current?.abort(); };
  }, [language, fromDate, toDate, enabled]);

  async function loadMore(selected: readonly IntelligenceReportFeed[], retryOnly = false) {
    if (!enabled || busy.current || !validIntelligenceReportDates({ fromDate, toDate })) return;
    const pending = selected.filter(feed => feeds[feed].next !== null && (!retryOnly || feeds[feed].error));
    if (!pending.length) return;
    busy.current = true;
    setState(previous => ({ ...previous, loading: true }));
    const abort = new AbortController();
    controller.current = abort;
    const results = await Promise.allSettled(pending.map(feed => requestPage(language, feed, feeds[feed].next!, abort.signal, { fromDate, toDate })));
    if (abort.signal.aborted) return;
    setState(previous => {
      const updated = { ...previous.feeds };
      results.forEach((result, index) => {
        const feed = pending[index];
        updated[feed] = result.status === "fulfilled" ? {
          records: [...new Map([...previous.feeds[feed].records, ...result.value.records].map(record => [record.id, record])).values()],
          next: result.value.next,
          error: false,
        } : { ...previous.feeds[feed], error: true };
      });
      return { ...previous, feeds: updated, loading: false };
    });
    busy.current = false;
  }

  return { feeds, loading, loadMore };
}
