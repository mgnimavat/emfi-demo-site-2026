"use client";

import { useState } from "react";
import { ArrowDown, Search } from "lucide-react";
import { DemoDisclaimer } from "@/components/demos/demo-disclaimer";

type SettlementResult = {
  security: string;
  eligibility: string;
  depository: string;
  route: string;
  qualified: string;
};

export function SettlementDemo() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "done">(
    "idle",
  );
  const [error, setError] = useState("");
  const [result, setResult] = useState<SettlementResult | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      const res = await fetch(
        `/api/demo/settlement?q=${encodeURIComponent(query)}`,
      );
      const data = (await res.json()) as SettlementResult & { error?: string };
      if (!res.ok) {
        setResult(null);
        setError(data.error ?? "Demonstration unavailable.");
        setStatus("error");
        return;
      }
      setResult(data);
      setStatus("done");
    } catch {
      setResult(null);
      setError("Demonstration unavailable.");
      setStatus("error");
    }
  }

  return (
    <div id="settlement-demo" className="rounded-lg border border-line bg-page p-6 md:p-8">
      <h3 className="mt-2 text-2xl font-bold text-ink">Settlement eligibility</h3>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-ink-secondary">
        Security → eligibility → depository → route. Not every security is
        eligible for every route.
      </p>

      <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row">
        <label className="relative flex-1">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Security / ISIN"
            className="w-full rounded-md border border-line bg-subtle py-3 pl-10 pr-4 text-sm text-ink outline-none focus:border-brand-focus"
          />
        </label>
        <button
          type="submit"
          disabled={status === "loading"}
          className="rounded-full bg-brand px-6 py-3 text-[13px] font-bold text-ink-inverse disabled:opacity-60"
        >
          {status === "loading" ? "Checking…" : "Check route"}
        </button>
      </form>

      {error ? (
        <p className="mt-4 text-sm text-ink-secondary">{error}</p>
      ) : null}

      {result ? (
        <div className="mt-6 grid gap-2">
          {[
            ["Security", result.security],
            ["Settlement eligibility", result.eligibility],
            ["Depository", result.depository],
            ["Settlement route", result.route],
          ].map(([label, value], i) => (
            <div key={label}>
              <article className="rounded-md border border-line bg-subtle px-4 py-3">
                <p className="font-mono text-[10px] tracking-[0.14em] text-ink-muted">
                  {label}
                </p>
                <p className="mt-1 text-sm font-semibold text-ink">{value}</p>
              </article>
              {i < 3 ? (
                <div className="flex justify-center py-1 text-brand" aria-hidden>
                  <ArrowDown size={14} />
                </div>
              ) : null}
            </div>
          ))}
          <p className="mt-2 text-xs leading-5 text-ink-muted">{result.qualified}</p>
        </div>
      ) : null}

      <DemoDisclaimer />
    </div>
  );
}
