"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronDown, FileText, Search } from "lucide-react";

// Reference close: https://stockanalysis.com/stocks/nvda/history/ (15 October 2026).
// The bid/ask spread is illustrative, rather than an executable market quote.
const orderExample = { bid: 217.22, ask: 217.24, shares: 10_000 };
const formatNumber = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function Chart({ kind, running, index }: { kind: number; running: boolean; index: number }) {
  const transition = { duration: 6, repeat: Infinity, delay: index * 0.12, ease: "easeInOut" as const };
  if (kind === 0) return (
    <svg viewBox="0 0 140 85" className="mt-3 h-20 w-full" aria-hidden>
      <path d="M20 70 A50 50 0 0 1 120 70" fill="none" stroke="var(--bg-soft)" strokeWidth="15" />
      <motion.path d="M20 70 A50 50 0 0 1 120 70" fill="none" stroke="var(--action-primary)" strokeWidth="15" pathLength="1" strokeDasharray="1" animate={{ strokeDashoffset: running ? [0.7, 0.22, 0.22, 0.7] : 0.22 }} transition={transition} />
      <circle cx="70" cy="70" r="4" fill="var(--action-focus)" />
    </svg>
  );
  if (kind === 2) return (
    <svg viewBox="0 0 140 85" className="mt-3 h-20 w-full" aria-hidden>
      <path d="M5 25H135 M5 50H135 M5 75H135" stroke="var(--border-default)" />
      <motion.path d="M5 65 L25 55 L44 62 L64 35 L84 44 L107 21 L135 12" fill="none" stroke="var(--action-focus)" strokeWidth="3" strokeLinecap="round" animate={{ pathLength: running ? [0, 1, 1, 0] : 1 }} transition={transition} />
    </svg>
  );
  return (
    <div className="mt-3 flex h-20 items-end gap-2 border-b border-line px-1 pb-1" aria-hidden>
      {[46, 78, 60, 92, 68].map((height, i) => (
        <motion.span key={i} className={`flex-1 rounded-t-sm ${i === 3 ? "bg-brand" : "bg-[var(--color-blue-200)]"}`} style={{ height: `${height}%`, transformOrigin: "bottom" }} animate={{ scaleY: running ? [0.3, 1, 1, 0.3] : 1 }} transition={{ ...transition, delay: i * 0.1 + index * 0.12 }} />
      ))}
    </div>
  );
}

export function ProductAnimation({ view }: { view: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { amount: 0.2 });
  const reduced = useReducedMotion();
  const running = visible && !reduced;
  const loop = { duration: 8, repeat: Infinity, ease: "easeInOut" as const };

  return (
    <div ref={ref} role="img" aria-label={`Illustrative animated ${view === "research" ? "research explorer loading a generic AI-market brief titled The AI boom: beyond the headlines" : view === "backoffice" ? "client dashboard with six charts and obscured totals" : "NVIDIA NVDA order ticket showing illustrative bid and ask prices and a simulated order"}`} className="relative w-full max-w-[620px] overflow-hidden rounded-lg border border-line bg-page shadow-[var(--elevation-card-hover)]">
      <div className="flex items-center justify-between gap-2 border-b border-line bg-inverse px-4 py-3 text-ink-inverse sm:px-5">
        <span className="text-sm font-semibold tracking-[-0.02em]">emfi<span className="font-normal text-ink-inverse-muted"> / {view === "research" ? "Research" : view === "backoffice" ? "Client dashboard" : "Execution"}</span></span>
        <span className="flex items-center gap-1.5 text-[10px] text-ink-inverse-muted"><span className="size-1.5 rounded-full bg-ink-inverse-muted" />Illustrative</span>
      </div>
      {view === "research" ? (
        <div className="p-4 sm:p-6">
          <div className="flex items-center gap-2 rounded-md border border-line bg-subtle px-3 py-3 text-xs text-ink-secondary"><Search size={15} aria-hidden />Country, report type or topic</div>
          <div className="my-4 flex flex-wrap gap-2 text-[11px] text-brand">
            {["Artificial intelligence", "Technology", "Market themes"].map((label) => <span key={label} className="rounded-full bg-soft px-3 py-2">{label}</span>)}
          </div>
          <div className="relative overflow-hidden rounded-md border border-line p-4 sm:p-5">
            {!reduced ? (
              <motion.div
                aria-hidden
                data-research-skeleton
                className="pointer-events-none absolute inset-0 z-10 bg-page p-4 sm:p-5"
                initial={{ opacity: 1 }}
                animate={{ opacity: visible ? [1, 1, 0] : 1 }}
                transition={{ duration: 2.2, times: [0, 0.8, 1] }}
              >
                <div className="mb-5 h-3 w-28 rounded-full bg-soft" />
                <div className="h-6 w-[90%] rounded-md bg-line" />
                <div className="mt-3 h-6 w-[65%] rounded-md bg-line" />
                <div className="mt-7 space-y-3">
                  {[100, 94, 98, 78, 100, 90, 65].map((width, i) => (
                    <motion.div key={i} className="h-2.5 rounded-full bg-line" style={{ width: `${width}%` }} animate={{ opacity: running ? [0.4, 1, 0.4] : 1 }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.08 }} />
                  ))}
                </div>
              </motion.div>
            ) : null}
            <motion.div
              data-research-brief
              initial={reduced ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: visible || reduced ? 1 : 0, y: visible || reduced ? 0 : 8 }}
              transition={{ delay: reduced ? 0 : 1.9, duration: reduced ? 0 : 0.45 }}
            >
              <div className="mb-4 flex items-center gap-2 text-xs text-ink-secondary"><FileText size={16} className="text-brand" aria-hidden />Technology brief · Example</div>
              <p className="text-xl font-semibold leading-tight tracking-[-0.025em] text-ink sm:text-2xl">The AI boom: beyond the headlines</p>
              <p className="mt-4 text-sm leading-7 text-ink-secondary">An illustrative look at how demand for computing, data centres and energy could shape the next wave of AI investment.</p>
              <p className="mt-3 text-sm leading-7 text-ink-secondary">The longer-term question is how businesses turn new capabilities into useful products and sustainable value.</p>
              <div className="mt-5 rounded-md bg-soft px-3 py-3 text-xs leading-6 text-ink">Themes to watch: infrastructure, adoption and productivity.</div>
              <div className="mt-6 flex items-center justify-between border-t border-line pt-4 text-xs text-ink-secondary"><span>Research → Investment view</span><ArrowRight size={15} aria-hidden /></div>
            </motion.div>
          </div>
        </div>
      ) : view === "backoffice" ? (
        <div className="p-3 sm:p-5">
          <div className="mb-4 flex items-center justify-between text-xs text-ink-secondary"><span>Account overview</span><span className="rounded-full bg-soft px-2.5 py-1.5">Demonstration</span></div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
            {["Balances", "Transactions", "Exposure", "Positions", "Charges", "Performance"].map((label, i) => (
              <div key={label} className="min-w-0 rounded-md border border-line p-2.5 sm:p-3">
                <p className="text-[11px] font-semibold text-ink sm:text-xs">{label}</p>
                <span aria-hidden className="mt-2 block h-2 w-10 rounded-full bg-ink-muted/40 blur-[3px]" />
                <Chart kind={i % 3} running={running} index={i} />
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2 border-t border-line pt-3 text-xs text-ink-secondary"><span className="size-1.5 rounded-full bg-brand-focus" />Illustrative charts · Totals obscured</div>
        </div>
      ) : (
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between text-xs text-ink-secondary"><span>Security selection</span><ChevronDown size={15} aria-hidden /></div>
          <motion.div className="mt-2 rounded-md border border-line bg-subtle px-4 py-3" animate={{ borderColor: running ? ["var(--border-default)", "var(--action-focus)", "var(--border-default)", "var(--border-default)"] : "var(--border-default)" }} transition={loop}>
            <span className="text-sm font-semibold text-ink">NVDA · NVIDIA</span>
            <span className="mt-1 block text-xs text-ink-secondary">NASDAQ · USD</span>
          </motion.div>
          <p className="mt-2 text-[11px] leading-5 text-ink-secondary">
            Illustrative spread · Reference close $217.23 · <a href="https://stockanalysis.com/stocks/nvda/history/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">15 Oct 2026</a>
          </p>
          <div className="my-5 grid grid-cols-2 gap-3">
            {[["Bid", formatNumber.format(orderExample.bid)], ["Ask", formatNumber.format(orderExample.ask)]].map(([label, value]) => (
              <div key={label} className={`rounded-md border p-3 ${label === "Bid" ? "border-emerald-200 bg-linear-to-br from-emerald-50 to-white text-emerald-700" : "border-red-200 bg-linear-to-br from-red-50 to-white text-red-700"}`}>
                <p className="text-xs font-medium">{label}</p>
                <p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4 text-xs text-ink-secondary">
            {[["Order type", "Market"], ["Time in force", "Day"], ["Side", "Buy"], ["Number of shares", orderExample.shares.toLocaleString("en-US")]].map(([label, value]) => <div key={label}><p>{label}</p><p className="mt-2 rounded-md bg-subtle px-3 py-2.5 text-sm font-medium text-ink">{value}</p></div>)}
          </div>
          <div className="my-5 flex items-center justify-between border-t border-line pt-4 text-sm text-ink-secondary"><span>Estimated order value</span><span className="font-semibold tabular-nums text-ink">{formatNumber.format(orderExample.ask * orderExample.shares)} USD</span></div>
          <div className="relative overflow-hidden rounded-full bg-brand px-4 py-3 text-center text-sm font-semibold text-ink-inverse">
            <motion.span className="absolute inset-y-0 left-0 bg-ink-inverse/15" aria-hidden animate={{ width: running ? ["0%", "0%", "100%", "100%", "0%"] : "100%" }} transition={loop} />
            <span className="relative inline-flex items-center gap-2">Simulate order <ArrowRight size={15} aria-hidden /></span>
          </div>
        </div>
      )}
    </div>
  );
}
