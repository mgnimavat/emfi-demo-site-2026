"use client";

import { useEffect, useState } from "react";

export function useIntelligenceCountries() {
  const [countries, setCountries] = useState<string[]>([]);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      setError(false);
      try {
        const response = await fetch("/api/home/countries-list", { headers: { Accept: "application/json" }, signal: controller.signal });
        if (!response.ok) throw new Error("Countries unavailable");
        const data = await response.json();
        if (!Array.isArray(data.countries) || !data.countries.every((country: unknown) => typeof country === "string")) throw new Error("Invalid countries response");
        if (!controller.signal.aborted) setCountries(data.countries);
      } catch {
        if (!controller.signal.aborted) setError(true);
      }
    }
    void load();
    return () => controller.abort();
  }, [attempt]);
  return { countries, error, retry: () => setAttempt(previous => previous + 1) };
}
