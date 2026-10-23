"use client";

import { useEffect, useState } from "react";

export function useIntelligenceReportTypes() {
  const [state, setState] = useState<{ types: Record<string, string>; slugs: Record<string, string>; loading: boolean; error: boolean }>({ types: {}, slugs: {}, loading: true, error: false });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const response = await fetch("/api/home/report-types", { headers: { Accept: "application/json" }, signal: controller.signal });
        if (!response.ok) throw new Error("Derived types unavailable");
        const data = await response.json();
        if (!data.types || typeof data.types !== "object" || Array.isArray(data.types) || !Object.values(data.types).every(type => typeof type === "string")) throw new Error("Invalid report types");
        const slugs = data.slugs ?? {};
        if (typeof slugs !== "object" || Array.isArray(slugs) || !Object.values(slugs).every(slug => typeof slug === "string")) throw new Error("Invalid report links");
        if (!controller.signal.aborted) setState({ types: data.types, slugs, loading: false, error: false });
      } catch {
        if (!controller.signal.aborted) setState({ types: {}, slugs: {}, loading: false, error: true });
      }
    }
    void load();
    return () => controller.abort();
  }, [attempt]);
  return { ...state, retry: () => setAttempt(value => value + 1) };
}
