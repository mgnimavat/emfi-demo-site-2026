"use client";

import { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";
import {
  ArrowUpDown,
  Calendar,
  Folder,
  Power,
  Search,
  Settings,
} from "lucide-react";

const VIEWS = ["Dashboard", "Securities", "Balances", "Cash"] as const;
type View = (typeof VIEWS)[number];

const HOLD_MS = 3200;

const MODULES = [
  "Clients",
  "Onboarding",
  "Compliance",
  "Reporting",
  "Accounting",
  "Operations",
  "Research",
  "Management",
] as const;

const VIEW_META: Record<
  View,
  { crumbs: string; date: string }
> = {
  Dashboard: {
    crumbs: "Home  >  Clients  >  Account  >  Dashboard",
    date: "2026-08-18  –  2026-08-19",
  },
  Securities: {
    crumbs: "Home  >  Clients  >  Transactions  >  Securities",
    date: "2025-08-21  –  2026-08-21",
  },
  Balances: {
    crumbs: "Home  >  Clients  >  Cash  >  Balances",
    date: "2026-09-21",
  },
  Cash: {
    crumbs: "Home  >  Clients  >  Transactions  >  Cash",
    date: "2025-08-21  –  2026-08-21",
  },
};

/* Platform chart / status accents from the live product screenshots */
const ACCENT = {
  rust: "#b85c45",
  fail: "#d64545",
  status: "#f0a070",
  statusText: "#5c3a28",
  outstanding: "#f5e6a8",
  barMuted: "#9aa3ad",
  barBlue: "#5b7a9d",
  barNavy: "#2c3e55",
  barGrey: "#c5cbd3",
} as const;

function SemiDonut({
  tone = ACCENT.rust,
  weight = 22,
  extra = false,
  className = "mx-auto mt-0.5 h-[88px] w-full",
}: {
  tone?: string;
  weight?: number;
  extra?: boolean;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 220 118" className={className} aria-hidden>
      <path
        d="M22 108 A 88 88 0 1 1 198 108"
        fill="none"
        stroke="var(--border-strong)"
        strokeWidth={weight}
        strokeLinecap="butt"
      />
      <path
        d="M22 108 A 88 88 0 1 1 198 108"
        fill="none"
        stroke={tone}
        strokeWidth={weight}
        strokeDasharray={extra ? "214 277" : "230 277"}
        strokeDashoffset="0"
      />
      <path
        d="M22 108 A 88 88 0 1 1 198 108"
        fill="none"
        stroke={ACCENT.barMuted}
        strokeWidth={weight}
        strokeDasharray="38 469"
        strokeDashoffset="-232"
      />
      <path
        d="M22 108 A 88 88 0 1 1 198 108"
        fill="none"
        stroke={ACCENT.barBlue}
        strokeWidth={weight}
        strokeDasharray="8 499"
        strokeDashoffset="-270"
      />
      {extra ? (
        <path
          d="M22 108 A 88 88 0 1 1 198 108"
          fill="none"
          stroke="#7f97b0"
          strokeWidth={weight}
          strokeDasharray="16 540"
          strokeDashoffset="-214"
        />
      ) : null}
    </svg>
  );
}

function VBars({
  bars,
  maxLabel,
}: {
  bars: { label: string; height: number; color: string }[];
  maxLabel?: string;
}) {
  return (
    <div className="relative mt-2 flex h-[100px] items-end justify-center gap-10 px-3">
      {maxLabel ? (
        <span className="absolute left-1 top-0 text-[7px] text-ink-muted blur-[3px] select-none">
          {maxLabel}
        </span>
      ) : null}
      {bars.map((bar) => (
        <div key={bar.label} className="flex h-full w-14 flex-col items-center justify-end gap-1">
          <div
            className="w-full rounded-[2px]"
            style={{ height: `${bar.height}%`, backgroundColor: bar.color }}
          />
          <span className="text-[8px] text-ink-muted">{bar.label}</span>
        </div>
      ))}
    </div>
  );
}

function AxisBars({
  bars,
  ticks,
  axes = true,
}: {
  bars: { label: string; height: number; color: string; breadth?: string }[];
  ticks: string[];
  axes?: boolean;
}) {
  if (!axes) {
    return (
      <div className="mt-2 flex min-h-0 flex-1 items-end">
        {bars.map((bar) => (
          <div key={bar.label} className="flex h-full flex-1 items-end justify-center">
            <div
              className="rounded-t-[3px]"
              style={{
                height: `${bar.height}%`,
                width: bar.breadth ?? "62%",
                backgroundColor: bar.color,
              }}
            />
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="mt-1 flex min-h-0 flex-1 gap-1">
      <div className="flex flex-col justify-between pb-3.5 text-[6px] leading-none text-ink-muted">
        {ticks.map((tick) => (
          <span key={tick}>{tick}</span>
        ))}
      </div>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <div className="relative flex min-h-0 flex-1 items-end border-b border-l border-[#e4e8ee]">
          {bars.map((bar) => (
            <div key={bar.label} className="relative z-[1] flex h-full flex-1 items-end justify-center">
              <div
                className="rounded-t-[3px]"
                style={{
                  height: `${bar.height}%`,
                  width: bar.breadth ?? "62%",
                  backgroundColor: bar.color,
                }}
              />
            </div>
          ))}
        </div>
        <div className="mt-1 flex">
          {bars.map((bar) => (
            <span key={bar.label} className="min-w-0 flex-1 text-center text-[5.5px] leading-none text-ink-muted">
              {bar.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function HBars({
  items,
  dense = false,
  fill = false,
}: {
  items: { label: string; width: number; color: string }[];
  dense?: boolean;
  fill?: boolean;
}) {
  return (
    <div
      className={
        fill
          ? "mt-2 flex min-h-0 flex-1 flex-col gap-2"
          : dense
            ? "mt-2 flex flex-col gap-2"
            : "mt-2 space-y-1.5"
      }
    >
      {items.map((item) => (
        <div key={item.label} className={`flex items-center gap-2 ${fill ? "min-h-0 flex-1" : ""}`}>
          <span className={`w-[42%] truncate leading-tight text-ink-muted ${dense ? "text-[6.5px]" : "text-[7.5px]"}`}>
            {item.label}
          </span>
          <div className={`flex-1 bg-subtle ${fill ? "h-full rounded-[3px]" : dense ? "h-2 rounded-[2px]" : "h-2.5 rounded-[2px]"}`}>
            <div
              className={`h-full ${fill ? "rounded-[3px]" : "rounded-[2px]"}`}
              style={{ width: `${item.width}%`, backgroundColor: item.color }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function CardShell({
  title,
  value,
  children,
}: {
  title: string;
  value?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-md border border-line bg-page px-2.5 py-2 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-[11px] font-semibold text-ink">{title}</h3>
        {value ? (
          <p className="shrink-0 text-[11px] font-semibold tabular-nums text-ink blur-[5px] select-none">
            {value}
          </p>
        ) : null}
      </div>
      {children}
    </div>
  );
}

function StatusPill({ label }: { label: string }) {
  return (
    <span
      className="inline-flex max-w-full items-center rounded-md px-1.5 py-0.5 text-[7.5px] font-semibold whitespace-nowrap"
      style={{ backgroundColor: ACCENT.status, color: ACCENT.statusText }}
    >
      {label}
    </span>
  );
}

function FilterCell({
  value,
  highlight,
  select,
}: {
  value?: string;
  highlight?: boolean;
  select?: boolean;
}) {
  return (
    <div
      className={`mt-1 flex h-5 items-center rounded-[3px] border border-line px-1.5 text-[8px] ${
        highlight ? "" : "bg-page text-ink-muted"
      }`}
      style={
        highlight
          ? { backgroundColor: ACCENT.outstanding, color: "#5a4a20" }
          : undefined
      }
    >
      <span className="truncate">{value ?? ""}</span>
      {select ? <span className="ml-auto pl-1 text-[7px] opacity-60">▾</span> : null}
    </div>
  );
}

function DashboardPanel({ demo = false, quiet = false }: { demo?: boolean; quiet?: boolean }) {
  const usd = demo ? ACCENT.barNavy : ACCENT.rust;
  const currencies = (
    quiet
      ? [
          ["USD", usd],
          ["EUR", ACCENT.barBlue],
          ["GBP", ACCENT.barMuted],
          ["JPY", ACCENT.barGrey],
          ["CHF", "#7f97b0"],
        ]
      : [
          ["USD", usd],
          ["EUR", ACCENT.barBlue],
          ["GBP", ACCENT.barMuted],
          ["JPY", ACCENT.barGrey],
        ]
  ) as [string, string][];
  const exposure = demo
    ? [
        { label: "Demo Capital 1", width: 87, color: "#8b95a3" },
        { label: "Demo Capital 2", width: 55, color: "#b7cfe6" },
        { label: "Demo Capital 4", width: 20, color: "#2c3138" },
        { label: "Demo Capital 5", width: 16, color: "#9aa3ad" },
        { label: "Demo Capital 6", width: 20, color: "#2c3138" },
        { label: "Demo Capital 7", width: 15, color: "#1a2744" },
        { label: "Demo Capital 8", width: 12, color: "#c5d8ea" },
      ]
    : [
        { label: "NETOFF", width: 94, color: ACCENT.barNavy },
        { label: "A.G.P. / ALLIANCE GLOBAL PARTNERS CORP", width: 72, color: ACCENT.barMuted },
        { label: "EUROPEAN DEPOSITARY BANK SA", width: 58, color: ACCENT.barBlue },
        { label: "CLEARSTREAM BANKING S.A.", width: 44, color: ACCENT.barGrey },
        { label: "BANCO BTG PACTUAL S.A.", width: 36, color: ACCENT.barMuted },
        { label: "INTERACTIVE BROKERS (U.K.) LIMITED", width: 28, color: ACCENT.barBlue },
      ];
  const positions = demo
    ? [
        { label: "Demo Securities 1", width: 93, color: "#8b95a3" },
        { label: "Demo Securities 2", width: 21, color: "#c5d4e6" },
        { label: "Demo Securities 3", width: 19, color: "#2a2a2a" },
        { label: "Demo Securities 4", width: 15, color: "#8d97a3" },
        { label: "Demo Securities 5", width: 8, color: "#3a3f46" },
        { label: "Demo Securities 6", width: 5, color: "#1a2744" },
      ]
    : [
        { label: "PEMEX 6 5/8 PERP", width: 96, color: ACCENT.barMuted },
        { label: "GRUPO SUPERVIELLE SA-SP ADR", width: 48, color: ACCENT.barNavy },
        { label: "META PLATFORMS INC-CLASS A", width: 36, color: ACCENT.barBlue },
        { label: "ARGENTINA REPUBLIC 3.5 2041", width: 30, color: ACCENT.barGrey },
        { label: "TURKEY 9.375 2033", width: 24, color: ACCENT.barMuted },
      ];

  return (
    <div className="grid h-full grid-cols-3 grid-rows-2 gap-2">
      <CardShell title="Balances" value={demo ? undefined : "$85,604,878"}>
        {quiet ? (
          <div className="flex min-h-0 flex-1 flex-col justify-between">
            <SemiDonut
              tone={usd}
              weight={36}
              extra
              className="mx-auto mt-1 aspect-[220/118] h-auto w-full"
            />
            <div className="flex flex-col items-center gap-1.5">
              {[currencies.slice(0, 3), currencies.slice(3)].map((row) => (
                <div key={row[0][0]} className="flex justify-center gap-x-3">
                  {row.map(([ccy, color]) => (
                    <span key={ccy} className="flex items-center gap-1 text-[7px] text-ink-muted">
                      <span className="h-2.5 w-[2px] rounded-sm" style={{ backgroundColor: color }} />
                      {ccy}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <SemiDonut tone={usd} weight={demo ? 36 : 22} />
            <div className="mt-1 flex flex-wrap justify-center gap-x-3 gap-y-0.5">
              {currencies.map(([ccy, color]) => (
                <span key={ccy} className="flex items-center gap-1 text-[7px] text-ink-muted">
                  <span className="h-2.5 w-[2px] rounded-sm" style={{ backgroundColor: color }} />
                  {ccy}
                </span>
              ))}
            </div>
          </>
        )}
      </CardShell>
      <CardShell title="Transactions" value={demo ? undefined : "10,460"}>
        {demo ? (
          <AxisBars
            axes={!quiet}
            ticks={["30", "20", "10", "0"]}
            bars={[
              { label: "Submitted", height: 53, color: "#8d97a3" },
              { label: "Unmatched", height: 83, color: "#b7cfe6" },
              { label: "Matched", height: 77, color: "#2c3138" },
              { label: "Settled", height: 50, color: "#8d97a3" },
              { label: "Failing", height: 80, color: "#1a2744" },
            ]}
          />
        ) : (
          <VBars
            maxLabel="12.5k"
            bars={[
              { label: "Submitted", height: 78, color: ACCENT.barNavy },
              { label: "Settled", height: 92, color: ACCENT.barBlue },
            ]}
          />
        )}
      </CardShell>
      <CardShell title="Exposure" value={demo ? undefined : "$13,750,261"}>
        <HBars items={exposure} dense={demo} fill={quiet} />
      </CardShell>
      <CardShell title="Positions" value={demo ? undefined : "$38,339,254"}>
        <HBars items={positions} dense={demo} fill={quiet} />
      </CardShell>
      <CardShell title="Charges" value={demo ? undefined : "$330"}>
        {demo ? (
          <AxisBars
            axes={!quiet}
            ticks={["1500", "1000", "500", "0"]}
            bars={[
              { label: "Ticket", height: 93, color: "#8d97a3", breadth: quiet ? "42%" : "46%" },
              { label: "Financing", height: quiet ? 36 : 4, color: "#c5d8ea", breadth: quiet ? "42%" : "22%" },
            ]}
          />
        ) : (
          <VBars
            maxLabel="400"
            bars={[{ label: "", height: 72, color: ACCENT.barMuted }]}
          />
        )}
      </CardShell>
      <CardShell title="Performance" value={demo ? undefined : "+$128,420"}>
        <HBars
          dense={demo}
          fill={quiet}
          items={
            demo
              ? [
                  { label: "Demo Securities 1", width: 88, color: "#8b95a3" },
                  { label: "Demo Securities 2", width: 53, color: "#b7cfe6" },
                  { label: "Demo Securities 3", width: 50, color: "#2c3138" },
                  { label: "Demo Securities 4", width: 21, color: "#9aa3ad" },
                  { label: "Demo Securities 5", width: 11, color: "#3a3f46" },
                  { label: "Demo Securities 6", width: 4, color: "#1a2744" },
                  { label: "Demo Securities 7", width: 2, color: "#d5e0ea" },
                ]
              : [
                  { label: "EM Fixed Income Book", width: 88, color: ACCENT.barNavy },
                  { label: "LatAm Sovereign Desk", width: 66, color: ACCENT.barBlue },
                  { label: "CEEMEA Credit Portfolio", width: 52, color: ACCENT.barMuted },
                  { label: "Asia Hard Currency", width: 40, color: ACCENT.barGrey },
                  { label: "Equity Linked Notes", width: 28, color: ACCENT.barBlue },
                  { label: "FX & Rates Overlay", width: 18, color: ACCENT.barMuted },
                ]
          }
        />
      </CardShell>
    </div>
  );
}

function SecuritiesPanel() {
  const headers = [
    "Reference",
    "Trade Date ↓",
    "Contractual",
    "Actual",
    "Security",
    "ISIN",
    "Currency",
    "Direction",
    "Amount",
    "Price",
    "Accrued",
    "Market Value",
    "Portfolio",
    "Counterparty",
    "Status",
  ] as const;

  const rows = [
    [
      "S24081201-1",
      "08/12/2024",
      "08/14/2024",
      "08/14/2024",
      "VODAFONE GROUP...",
      "GB00BH4HKS39",
      "GBP",
      "Buy",
      "344.00",
      "1.18450000",
      "0.00",
      "407.27",
      "DEMO EMFI",
      "EMFI Capital",
      "Submitted",
    ],
    [
      "S24081104-2",
      "08/11/2024",
      "08/13/2024",
      "08/13/2024",
      "PEMEX 6 5/8 PERP",
      "USP78625EA55",
      "USD",
      "Sell",
      "1,250,000.00",
      "98.12500000",
      "12,450.00",
      "1,239,012.50",
      "DEMO EMFI",
      "Interactive Brokers",
      "Submitted",
    ],
    [
      "S24081009-1",
      "08/10/2024",
      "08/12/2024",
      "08/12/2024",
      "NELCVAA ID",
      "US64049PAB34",
      "USD",
      "Buy",
      "85,000.00",
      "102.50000000",
      "210.00",
      "87,335.00",
      "DEMO EMFI",
      "A.G.P. / Alliance",
      "Submitted",
    ],
    [
      "S24080915-3",
      "08/09/2024",
      "08/13/2024",
      "08/13/2024",
      "HSBC HOLDINGS PLC",
      "GB0005405286",
      "GBP",
      "Buy",
      "12,400.00",
      "6.84200000",
      "0.00",
      "84,840.80",
      "DEMO EMFI",
      "EMFI Capital",
      "Submitted",
    ],
    [
      "S24080822-1",
      "08/08/2024",
      "08/12/2024",
      "08/12/2024",
      "ARGENTINA 3.5 2041",
      "US040114HR43",
      "USD",
      "Sell",
      "640,000.00",
      "44.25000000",
      "1,820.00",
      "285,020.00",
      "DEMO EMFI",
      "Clearstream Banking",
      "Submitted",
    ],
    [
      "S24080718-2",
      "08/07/2024",
      "08/11/2024",
      "08/11/2024",
      "TURKEY 9.375 2033",
      "US900123CY29",
      "USD",
      "Buy",
      "410,000.00",
      "101.75000000",
      "980.00",
      "418,155.00",
      "DEMO EMFI",
      "European Depositary",
      "Submitted",
    ],
  ] as const;

  return (
    <div className="h-full overflow-hidden rounded-md border border-line bg-page">
      <table className="w-full min-w-[920px] border-collapse text-left text-[8.5px]">
        <thead>
          <tr className="bg-subtle text-[8.5px] font-semibold text-ink">
            {headers.map((h) => (
              <th key={h} className="whitespace-nowrap px-1.5 py-1.5 font-semibold">
                {h}
              </th>
            ))}
          </tr>
          <tr className="bg-page">
            {headers.map((h, i) => (
              <th key={`f-${h}`} className="px-1 pb-1.5 align-top">
                <FilterCell
                  value={i === headers.length - 1 ? "Outstanding" : undefined}
                  highlight={i === headers.length - 1}
                  select={i === headers.length - 1 || i === 7}
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={row[0]} className={ri % 2 === 1 ? "bg-subtle/60" : "bg-page"}>
              {row.map((cell, i) => (
                <td
                  key={i}
                  className={`max-w-[72px] truncate whitespace-nowrap px-1.5 py-1.5 text-ink ${
                    i >= 8 && i <= 11 ? "text-right tabular-nums" : ""
                  }`}
                >
                  {i === row.length - 1 ? <StatusPill label={cell} /> : cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BalancesPanel() {
  const headers = ["Name", "Identifier", "Class", "Price", "Amount", "Market Value"] as const;
  const rows = [
    ["USD | UNITED STATES", "USD", "Cash", "1.00000", "46,047,394.06", "46,047,394.06"],
    ["EUR | EUROZONE", "EUR", "Cash", "1.33500", "1,224,931.01", "1,635,282.90"],
    ["GBP | UNITED KINGDOM", "GBP", "Cash", "1.33200", "11,976,323.28", "15,952,462.61"],
    ["RUB | RUSSIA", "RUB", "Cash", "0.01120", "276,986.62", "3,102.25"],
    ["CHF | SWITZERLAND", "CHF", "Cash", "1.11800", "420,500.00", "470,119.00"],
    ["AUD | AUSTRALIA", "AUD", "Cash", "0.66200", "310,000.00", "205,220.00"],
    ["NOK | NORWAY", "NOK", "Cash", "0.09410", "1,850,000.00", "174,085.00"],
    ["CAD | CANADA", "CAD", "Cash", "0.72800", "890,250.00", "648,102.00"],
    ["HKD | HONG KONG", "HKD", "Cash", "0.12820", "2,410,000.00", "308,962.00"],
    ["LKR | SRI LANKA", "LKR", "Cash", "0.00328", "18,400,000", "60,352.00"],
    ["JPY | JAPAN", "JPY", "Cash", "0.00680", "18,400,000", "125,120.00"],
    ["SEK | SWEDEN", "SEK", "Cash", "0.09540", "1,120,000.00", "106,848.00"],
  ] as const;

  return (
    <div className="h-full overflow-hidden rounded-md border border-line bg-page">
      <table className="w-full border-collapse text-left text-[10px]">
        <thead>
          <tr className="bg-subtle text-[10px] font-semibold text-ink">
            {headers.map((h) => (
              <th key={h} className="px-3 py-2 font-semibold">
                {h}
              </th>
            ))}
          </tr>
          <tr className="bg-page">
            {headers.map((h) => (
              <th key={`f-${h}`} className="px-3 pb-2">
                <FilterCell />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={row[1]} className={ri % 2 === 1 ? "bg-subtle/50" : "bg-page"}>
              {row.map((cell, i) => (
                <td
                  key={i}
                  className={`truncate px-3 py-2 text-ink ${
                    i >= 3 ? "text-right tabular-nums" : ""
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CashPanel() {
  const headers = [
    "Reference",
    "Trade Date ↓",
    "Contractual",
    "Actual",
    "Security",
    "Amount",
    "Portfolio",
    "Type",
    "Status",
  ] as const;

  const rows = [
    [
      "C991124062-1",
      "08/12/2024",
      "08/14/2024",
      "08/14/2024",
      "EUR",
      "23.00",
      "DEMO EMFI",
      "FX Trade",
      "Submitted",
    ],
    [
      "C991124055-2",
      "08/11/2024",
      "08/13/2024",
      "08/13/2024",
      "USD",
      "10,000.00",
      "DEMO EMFI",
      "Deposit",
      "Submitted",
    ],
    [
      "C991124048-1",
      "08/10/2024",
      "08/12/2024",
      "08/12/2024",
      "GBP",
      "76.88",
      "DEMO EMFI",
      "FX Trade",
      "Submitted",
    ],
    [
      "C991124041-3",
      "08/09/2024",
      "08/13/2024",
      "08/13/2024",
      "USD",
      "1,250.00",
      "DEMO EMFI",
      "Withdrawal",
      "Submitted",
    ],
    [
      "C991124033-1",
      "08/08/2024",
      "08/12/2024",
      "08/12/2024",
      "EUR",
      "5,400.00",
      "DEMO EMFI",
      "Deposit",
      "Submitted",
    ],
    [
      "C991124027-2",
      "08/07/2024",
      "08/11/2024",
      "08/11/2024",
      "USD",
      "320.50",
      "DEMO EMFI",
      "FX Trade",
      "Submitted",
    ],
  ] as const;

  return (
    <div className="h-full overflow-hidden rounded-md border border-line bg-page">
      <table className="w-full table-fixed border-collapse text-left text-[8.5px]">
        <colgroup>
          <col className="w-[14%]" />
          <col className="w-[11%]" />
          <col className="w-[11%]" />
          <col className="w-[11%]" />
          <col className="w-[8%]" />
          <col className="w-[10%]" />
          <col className="w-[14%]" />
          <col className="w-[9%]" />
          <col className="w-[12%]" />
        </colgroup>
        <thead>
          <tr className="bg-subtle text-[8.5px] font-semibold text-ink">
            {headers.map((h) => (
              <th key={h} className="truncate px-1.5 py-1.5 font-semibold">
                {h}
              </th>
            ))}
          </tr>
          <tr className="bg-page">
            {headers.map((h, i) => (
              <th key={`f-${h}`} className="px-1 pb-1.5 align-top">
                <FilterCell
                  value={i >= headers.length - 2 ? "All" : undefined}
                  select={i >= headers.length - 2}
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={row[0]} className={ri % 2 === 1 ? "bg-subtle/60" : "bg-page"}>
              {row.map((cell, i) => {
                const isStatus = i === row.length - 1;
                return (
                  <td
                    key={i}
                    className={`px-1.5 py-1.5 text-ink ${
                      isStatus ? "overflow-visible" : "truncate"
                    } ${i === 5 ? "text-right tabular-nums" : ""}`}
                  >
                    {isStatus ? <StatusPill label={cell} /> : cell}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const panels: Record<Exclude<View, "Dashboard">, () => ReactNode> = {
  Securities: SecuritiesPanel,
  Balances: BalancesPanel,
  Cash: CashPanel,
};

const TAB_LABEL: Record<View, string> = {
  Dashboard: "Dashboard",
  Securities: "Securities",
  Balances: "Cash",
  Cash: "Cash",
};

export function OperatingView({
  tabs = false,
  views = VIEWS,
  fill = false,
  demo = false,
  bare = false,
  square = false,
  trimChrome = false,
}: {
  compact?: boolean;
  tabs?: boolean;
  views?: readonly View[];
  fill?: boolean;
  demo?: boolean;
  bare?: boolean;
  square?: boolean;
  trimChrome?: boolean;
} = {}) {
  const reduced = useReducedMotion();
  const sequence = views.length ? views : VIEWS;
  const [index, setIndex] = useState(0);
  const view = sequence[index] ?? sequence[0];
  const meta = VIEW_META[view];
  const Panel = view === "Dashboard" ? () => <DashboardPanel demo={demo} quiet={trimChrome} /> : panels[view];

  useEffect(() => {
    if (reduced || sequence.length < 2) return;
    const pageId = window.setInterval(
      () => setIndex((i) => (i + 1) % sequence.length),
      HOLD_MS,
    );
    return () => window.clearInterval(pageId);
  }, [reduced, sequence.length]);

  const frame = (
    <div className={cn("pointer-events-none overflow-hidden bg-page", square ? "rounded-none" : "rounded-md", bare ? "" : "border border-line shadow-sm", fill && "flex h-full min-h-0 flex-col")}>
      {trimChrome ? null : <header className="flex items-center gap-2 bg-nav px-3 py-2">
        <Image
          src="/brand/emfi-logo.svg"
          alt="emfi"
          width={131}
          height={53}
          className="h-[26px] w-auto shrink-0"
          unoptimized
        />
        <p className="hidden max-w-[200px] truncate text-[9px] text-ink-inverse/70 lg:block">
          {meta.crumbs}
        </p>
        <div className="mx-auto hidden h-7 w-[min(42%,220px)] shrink items-center rounded-md bg-page px-2.5 sm:flex">
          <span className="truncate text-[9px] text-ink-muted">
            Search by Reference, ISIN, Ticker or Counterparty
          </span>
          <Search size={12} className="ml-auto shrink-0 text-ink-muted" />
        </div>
        <div className="ml-auto flex items-center gap-2.5 text-ink-inverse">
          <ArrowUpDown size={13} />
          <Folder size={13} />
          <Power size={13} />
        </div>
      </header>}

      {trimChrome ? null : <div className="relative flex h-9 items-end bg-page pl-2 pr-2 sm:pl-3 sm:pr-3">
        {/* Border starts after the left gap so it doesn't show before Clients */}
        <div className="pointer-events-none absolute bottom-0 left-2 right-0 border-b border-brand sm:left-3" />
        <div className="relative z-[1] flex min-w-0 flex-1 items-end overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {MODULES.map((item) => (
            <span
              key={item}
              className={`flex h-7 shrink-0 items-center px-1.5 text-[8px] font-medium whitespace-nowrap sm:px-2 sm:text-[8.5px] ${
                item === "Clients"
                  ? "-mb-px rounded-t-[8px] bg-brand text-ink-inverse"
                  : "mb-px text-ink-secondary"
              }`}
            >
              {item}
            </span>
          ))}
        </div>
        <div className="relative z-[1] mb-[3px] ml-1 flex shrink-0 items-center gap-1">
          <span className="inline-flex h-6 max-w-[130px] items-center gap-1 overflow-hidden rounded-full border border-line bg-page px-1.5 text-[7.5px] text-ink sm:max-w-[150px]">
            <Calendar size={10} className="shrink-0" />
            <span className="truncate tabular-nums">{meta.date}</span>
          </span>
          <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-[5px] bg-brand text-ink-inverse">
            <Settings size={11} />
          </span>
        </div>
      </div>}

      <div className={cn("relative overflow-hidden bg-page p-2 md:p-2.5", fill ? "min-h-0 flex-1" : "h-[332px] md:h-[372px]")}>
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
            className="h-full overflow-hidden"
          >
            <Panel />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );

  if (!tabs) return frame;

  return (
    <div className="mt-8">
      <div className="mb-4 flex flex-wrap gap-2">
        {sequence.map((item, i) => (
          <button
            key={item}
            type="button"
            onClick={() => setIndex(i)}
            className={cn(
              "rounded-full border px-4 py-2 font-mono text-[11px] font-bold tracking-[0.12em]",
              view === item
                ? "border-brand bg-brand text-ink-inverse"
                : "border-line text-ink-muted hover:border-ink hover:text-ink",
            )}
          >
            {TAB_LABEL[item]}
          </button>
        ))}
      </div>
      <div className="overflow-hidden rounded-xl border border-line bg-page p-2 md:p-3">
        {frame}
      </div>
    </div>
  );
}

export function HeroMockup() {
  return (
    <div className="rounded-xl border border-line bg-page p-2 md:p-3">
      <OperatingView compact />
    </div>
  );
}

export function HeroDashboardScreen({ bare = false, square = false, trimChrome = false }: { bare?: boolean; square?: boolean; trimChrome?: boolean } = {}) {
  return <OperatingView views={["Dashboard"]} fill demo bare={bare} square={square} trimChrome={trimChrome} />;
}
