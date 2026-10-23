"use client";

import { useEffect, useState } from "react";
import type { ExecutionResearchChart, ExecutionResearchRecord } from "@/content/execution";
import type { IntelligenceLanguage } from "./intelligence-reports";

const cache = new Map<string, ExecutionResearchChart | null>();

/** Mount per selected report so a slow previous response cannot replace its chart. */
export function useReportChart(report: ExecutionResearchRecord, language: IntelligenceLanguage) {
  const id = report.id.replace(/^emfi-/, "");
  const endpoint = report.chartSource === "special" ? "get-spacial-report-by-id" : report.chartSource === "other" ? "get-report-chart" : "get-chart";
  const key = `${language}/${endpoint}/${id}`;
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState(() => ({ chart: report.chart ?? cache.get(key) ?? null, loading: !report.chart && !cache.has(key), error: false }));
  const embedded = report.chart;

  useEffect(() => {
    if (embedded || cache.has(key)) return;
    const abort = new AbortController();
    fetch(`/api/intelligence/${language}/${endpoint}/${id}`, { headers: { Accept: "application/json" }, signal: abort.signal })
      .then(async response => {
        if (!response.ok) throw new Error("Unable to load chart");
        return response.json() as Promise<{ chart: ExecutionResearchChart | null }>;
      })
      .then(({ chart }) => {
        if (abort.signal.aborted) return;
        cache.set(key, chart);
        setState({ chart, loading: false, error: false });
      })
      .catch(() => { if (!abort.signal.aborted) setState({ chart: null, loading: false, error: true }); });
    return () => abort.abort();
  }, [key, language, endpoint, id, embedded, attempt]);

  return { ...state, retry: () => { setState({ chart: null, loading: true, error: false }); setAttempt(previous => previous + 1); } };
}
