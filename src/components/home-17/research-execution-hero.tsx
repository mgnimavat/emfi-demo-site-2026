"use client";

import { useEffect, useState, type ReactNode } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowUpDown,
  Calendar,
  Eye,
  Folder,
  GripVertical,
  Pencil,
  Power,
  Search,
  Settings,
  X,
} from "lucide-react";
import { FloatingPhones } from "@/components/home-17/floating-phones";
import { HeroDashboardScreen } from "@/components/home-17/operating-view";

const HOLD_MS = 3400;

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

const VIEWS = [
  "Dashboard",
  "Reports",
  "Bahamas",
  "Turkey",
  "OrderEur",
  "OrderAapl",
] as const;
type View = (typeof VIEWS)[number] | "HeroDashboard" | "MobileBalances" | "MobileScreens" | "MobileScreensPerspective" | "FloatingPhones";

export const responsiveHighlightSlides = ["Dashboard", "Reports", "OrderAapl"] as const satisfies readonly View[];
export const home10ResponsiveSlides = ["OrderEur", "OrderAapl", "HeroDashboard", "MobileBalances"] as const satisfies readonly View[];
export const home12ResponsiveSlides = ["OrderEur", "HeroDashboard", "MobileScreens"] as const satisfies readonly View[];
export const home16ResponsiveSlides = ["OrderEur", "HeroDashboard", "MobileScreensPerspective"] as const satisfies readonly View[];
export const homeV5ResponsiveSlides = ["HeroDashboard", "OrderEur", "FloatingPhones"] as const satisfies readonly View[];

const VIEW_META: Record<
  View,
  {
    crumbs: string;
    date: string;
    activeModule: (typeof MODULES)[number];
    kind: "app" | "public";
  }
> = {
  Dashboard: {
    crumbs: "Home  >  Research  >  Dashboard",
    date: "10/21/25 – 10/21/26",
    activeModule: "Research",
    kind: "app",
  },
  Reports: {
    crumbs: "Home  >  Research  >  Reports",
    date: "01/01/26 – 10/21/26",
    activeModule: "Research",
    kind: "app",
  },
  Bahamas: {
    crumbs: "",
    date: "",
    activeModule: "Research",
    kind: "public",
  },
  Turkey: {
    crumbs: "",
    date: "",
    activeModule: "Research",
    kind: "public",
  },
  OrderEur: {
    crumbs: "Home  >  Clients  >  Bookings  >  Order Entry",
    date: "09/12/26 – 10/21/26",
    activeModule: "Clients",
    kind: "app",
  },
  OrderAapl: {
    crumbs: "Home  >  Clients  >  Bookings  >  Order Entry",
    date: "09/12/26 – 10/21/26",
    activeModule: "Clients",
    kind: "app",
  },
  HeroDashboard: {
    crumbs: "",
    date: "",
    activeModule: "Clients",
    kind: "public",
  },
  MobileBalances: {
    crumbs: "",
    date: "",
    activeModule: "Clients",
    kind: "public",
  },
  MobileScreens: {
    crumbs: "",
    date: "",
    activeModule: "Clients",
    kind: "public",
  },
  MobileScreensPerspective: {
    crumbs: "",
    date: "",
    activeModule: "Clients",
    kind: "public",
  },
  FloatingPhones: {
    crumbs: "",
    date: "",
    activeModule: "Clients",
    kind: "public",
  },
};

const CHART = {
  navy: "#1e2a3d",
  slate: "#6b7788",
  mist: "#b8c8e1",
  ash: "#9aa3ad",
  fill: "#d8dee8",
  green: "#22c55e",
  red: "#ef4444",
  status: "#22c55e",
} as const;

function CardShell({
  title,
  value,
  children,
}: {
  title: string;
  value: string;
  children: ReactNode;
}) {
  return (
    <div className="pointer-events-auto min-h-0 overflow-hidden rounded-md border border-line bg-page px-2.5 py-2 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <h3 className="min-w-0 truncate text-[10px] font-semibold text-ink">{title}</h3>
        <p
          className="shrink-0 cursor-default text-[10px] font-semibold tabular-nums text-ink blur-[5px] transition-[filter] duration-200 select-none hover:blur-none"
          title={value}
        >
          {value}
        </p>
      </div>
      {children}
    </div>
  );
}

function VBars({
  bars,
}: {
  bars: { label: string; height: number; color: string; value?: string }[];
}) {
  return (
    <div className="relative mt-2 flex h-[92px] items-end justify-between gap-0.5 px-0.5">
      {bars.map((bar) => (
        <div
          key={bar.label}
          className="group/bar flex h-full flex-1 flex-col items-center justify-end gap-1"
          title={bar.value ? `${bar.label}: ${bar.value}` : bar.label}
        >
          <div
            className="relative w-full max-w-[14px] rounded-[2px] transition-[filter] group-hover/bar:brightness-110"
            style={{ height: `${bar.height}%`, backgroundColor: bar.color }}
          >
            {bar.value ? (
              <span className="pointer-events-none absolute -top-3 left-1/2 -translate-x-1/2 text-[6px] font-semibold tabular-nums text-ink opacity-0 transition-opacity group-hover/bar:opacity-100">
                {bar.value}
              </span>
            ) : null}
          </div>
          <span className="text-[5.5px] leading-none text-ink-muted">{bar.label}</span>
        </div>
      ))}
    </div>
  );
}

function HBars({
  items,
}: {
  items: { label: string; width: number; color: string }[];
}) {
  return (
    <div className="mt-2 space-y-1.5">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <span className="w-[46%] truncate text-[6.5px] leading-tight text-ink-muted">
            {item.label}
          </span>
          <div className="h-2 flex-1 rounded-[2px] bg-subtle">
            <div
              className="h-full rounded-[2px]"
              style={{ width: `${item.width}%`, backgroundColor: item.color }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function FilterCell({
  value,
  select,
}: {
  value?: string;
  select?: boolean;
}) {
  return (
    <div className="mt-1 flex h-5 items-center rounded-[3px] border border-line bg-page px-1.5 text-[8px] text-ink-muted">
      <span className="truncate">{value ?? ""}</span>
      {select ? <span className="ml-auto pl-1 text-[7px] opacity-60">▾</span> : null}
    </div>
  );
}

function ActivePill({ label }: { label: string }) {
  return (
    <span className="flex w-full items-center justify-center rounded-[5px] bg-[#8AFF8E] px-2 py-0.5 text-center text-[7px] font-semibold text-[#36a16b]">
      {label}
    </span>
  );
}

function StatusBadge({
  status,
  apple = false,
  radius,
}: {
  status: "Filled" | "Rejected" | "Placed" | "Working";
  apple?: boolean;
  radius?: number;
}) {
  const filled = status === "Filled";
  const corner = radius ?? (apple ? 3 : 6);
  const tone = filled
    ? ""
    : status === "Working"
      ? "bg-[#dbe7ff] text-[#2458c5]"
      : "bg-[#ffe4cc] text-[#c45a12]";
  return (
    <span
      className={`flex w-full items-center justify-center px-1 text-center text-[5.5px] font-semibold leading-none ${apple ? "h-full min-h-[12px]" : "py-0.5"} ${tone}`}
      style={
        filled
          ? { borderRadius: corner, backgroundColor: "#8AFF8E", color: "#36a16b" }
          : { borderRadius: corner }
      }
    >
      {status}
    </span>
  );
}

/** Wide rectangular area chart used by Order Entry (EURUSD) */
function AreaChart({
  path,
  labels,
  yLabels,
}: {
  path: string;
  labels: string[];
  yLabels: string[];
}) {
  const gradId = `re-area-${labels[0]?.replace(/\s+/g, "") ?? "chart"}`;
  const nY = Math.max(1, yLabels.length - 1);
  const gridYs = yLabels.map((_, i) => 10 + (i * 120) / nY);
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="relative min-h-0 flex-1">
        <div className="absolute inset-y-1 left-0 z-[1] flex w-9 flex-col justify-between text-[6.5px] tabular-nums text-[#8a94a3]">
          {yLabels.map((y) => (
            <span key={y}>{y}</span>
          ))}
        </div>
        <svg viewBox="0 0 320 140" className="ml-9 h-full w-[calc(100%-2.25rem)]" aria-hidden>
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#9aa3ad" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
          </defs>
          {gridYs.map((y) => (
            <line key={y} x1="0" y1={y} x2="320" y2={y} stroke="#e5e9ef" strokeWidth="1" />
          ))}
          <path d={`${path} L320 140 L0 140 Z`} fill={`url(#${gradId})`} />
          <path d={path} fill="none" stroke="#4a5568" strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="ml-9 mt-1 flex justify-between text-[6.5px] tabular-nums text-[#8a94a3]">
        {labels.map((l) => (
          <span key={l}>{l}</span>
        ))}
      </div>
    </div>
  );
}

/** Square article chart used by Bahamas / Turkey panels */
function ArticleAreaChart({
  path,
  labels,
  yLabels,
  endDot,
}: {
  path: string;
  labels: string[];
  yLabels: string[];
  endDot?: { x: number; y: number };
}) {
  const gradId = `re-article-${labels[0]?.replace(/\s+/g, "") ?? "chart"}`;
  const vb = 320;
  const pl = 48;
  const pt = 14;
  const pr = 308;
  const pb = 278;
  const pw = pr - pl;
  const ph = pb - pt;
  const sx = pw / 320;
  const sy = ph / 140;
  const nY = Math.max(1, yLabels.length - 1);
  const nX = Math.max(1, labels.length - 1);

  return (
    <svg viewBox={`0 0 ${vb} ${vb}`} className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6b7788" stopOpacity="0.22" />
          <stop offset="70%" stopColor="#9aa3ad" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>
      {yLabels.map((lab, i) => {
        const y = pt + (i / nY) * ph;
        return (
          <g key={lab}>
            <line x1={pl} y1={y} x2={pr} y2={y} stroke="#e8ecf1" strokeWidth="1" />
            <text
              x={pl - 5}
              y={y}
              textAnchor="end"
              dominantBaseline="middle"
              fill="#8a94a3"
              fontSize="10"
              fontFamily="ui-sans-serif, system-ui, sans-serif"
            >
              {lab}
            </text>
          </g>
        );
      })}
      <g transform={`translate(${pl}, ${pt}) scale(${sx}, ${sy})`}>
        <path d={`${path} L320 140 L0 140 Z`} fill={`url(#${gradId})`} />
        <path
          d={path}
          fill="none"
          stroke="#3d4a5c"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        {endDot ? (
          <circle cx={endDot.x} cy={endDot.y} r="2.5" fill="#3d4a5c" />
        ) : null}
      </g>
      {labels.map((lab, i) => {
        const x = pl + (i / nX) * pw;
        const anchor = i === 0 ? "start" : i === labels.length - 1 ? "end" : "middle";
        return (
          <text
            key={lab}
            x={x}
            y={pb + 18}
            textAnchor={anchor}
            fill="#8a94a3"
            fontSize="10"
            fontFamily="ui-sans-serif, system-ui, sans-serif"
          >
            {lab}
          </text>
        );
      })}
    </svg>
  );
}

function CandleChart() {
  // Demo OHLC in SVG y-space (higher y = lower price). Values not copied from product.
  const candles = [
    { x: 14, o: 78, c: 58, h: 48, l: 88 },
    { x: 30, o: 58, c: 70, h: 52, l: 80 },
    { x: 46, o: 70, c: 50, h: 42, l: 78 },
    { x: 62, o: 50, c: 42, h: 34, l: 60 },
    { x: 78, o: 42, c: 56, h: 36, l: 68 },
    { x: 94, o: 56, c: 46, h: 40, l: 64 },
    { x: 110, o: 46, c: 34, h: 28, l: 54 },
    { x: 126, o: 34, c: 40, h: 30, l: 50 },
    { x: 142, o: 40, c: 26, h: 20, l: 48 },
    { x: 158, o: 26, c: 32, h: 22, l: 42 },
    { x: 174, o: 32, c: 22, h: 16, l: 40 },
    { x: 190, o: 22, c: 30, h: 18, l: 38 },
    { x: 206, o: 30, c: 18, h: 12, l: 36 },
    { x: 222, o: 18, c: 28, h: 14, l: 36 },
    { x: 238, o: 28, c: 20, h: 12, l: 34 },
    { x: 254, o: 20, c: 36, h: 16, l: 44 },
    { x: 270, o: 36, c: 24, h: 18, l: 42 },
    { x: 286, o: 24, c: 30, h: 16, l: 38 },
    { x: 302, o: 30, c: 18, h: 12, l: 36 },
  ];
  const yLabels = ["339.75", "339.50", "339.25", "339.00", "338.75"];
  const xLabels = ["15:20", "15:30", "15:40", "15:50", "15:58"];

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="relative min-h-0 flex-1">
        <div className="absolute inset-y-0.5 left-0 z-[1] flex w-8 flex-col justify-between text-[5.5px] tabular-nums text-[#8a94a3]">
          {yLabels.map((y) => (
            <span key={y}>{y}</span>
          ))}
        </div>
        <svg viewBox="0 0 320 120" className="ml-8 h-full w-[calc(100%-2rem)]" aria-hidden>
          {[12, 36, 60, 84, 108].map((y) => (
            <line key={y} x1="0" y1={y} x2="320" y2={y} stroke="#e8ecf1" strokeWidth="1" />
          ))}
          {candles.map((c) => {
            const up = c.c < c.o;
            const color = up ? "#22c55e" : "#f04438";
            const top = Math.min(c.o, c.c);
            const height = Math.max(3, Math.abs(c.c - c.o));
            return (
              <g key={c.x}>
                <line x1={c.x} y1={c.h} x2={c.x} y2={c.l} stroke={color} strokeWidth="1" />
                <rect x={c.x - 3.5} y={top} width="7" height={height} fill={color} rx="0.5" />
              </g>
            );
          })}
        </svg>
      </div>
      <div className="ml-8 mt-0.5 flex justify-between text-[5.5px] tabular-nums text-[#8a94a3]">
        {xLabels.map((l) => (
          <span key={l}>{l}</span>
        ))}
      </div>

      {/* Session navigator / volume strip — no second time row */}
      <div className="mt-1.5 shrink-0 pb-0.5">
        <svg viewBox="0 0 320 36" className="h-[36px] w-full" preserveAspectRatio="none" aria-hidden>
          <path
            d="M0 30 C18 26, 36 24, 52 20 C70 14, 88 22, 106 16 C124 10, 142 18, 160 12 C178 6, 196 14, 214 8 C232 4, 250 10, 268 6 C286 2, 304 8, 320 4 L320 36 L0 36 Z"
            fill="#f0a060"
            opacity="0.85"
          />
        </svg>
      </div>
    </div>
  );
}

function ResearchDashboardPanel() {
  return (
    <div className="grid h-full grid-cols-2 grid-rows-2 gap-2">
      <CardShell title="Reader Counts" value="3282">
        <VBars
          bars={[
            { label: "May '26", height: 96, color: CHART.slate, value: "482" },
            { label: "Jun '26", height: 88, color: CHART.mist, value: "441" },
            { label: "Aug '26", height: 78, color: CHART.navy, value: "390" },
            { label: "Jul '26", height: 72, color: CHART.ash, value: "360" },
            { label: "Apr '26", height: 64, color: CHART.slate, value: "320" },
            { label: "Sep '26", height: 58, color: CHART.mist, value: "290" },
            { label: "Mar '26", height: 50, color: CHART.navy, value: "250" },
            { label: "Jan '26", height: 44, color: CHART.ash, value: "220" },
            { label: "Feb '26", height: 38, color: CHART.slate, value: "190" },
            { label: "Nov '25", height: 32, color: CHART.mist, value: "160" },
            { label: "Dec '25", height: 26, color: CHART.navy, value: "130" },
            { label: "Oct '25", height: 20, color: CHART.ash, value: "100" },
          ]}
        />
      </CardShell>
      <CardShell title="Report Counts" value="12822">
        <HBars
          items={[
            { label: "Global: First Impacts of the Surging Oil", width: 96, color: CHART.navy },
            { label: "Colombia: Colombia in 2026", width: 78, color: CHART.slate },
            { label: "Global: EMFI Monthly Review - April", width: 64, color: CHART.mist },
            { label: "Global: EMFI Monthly Review - August", width: 52, color: CHART.ash },
            { label: "Colombia: Policy Rate Hike Amid Fiscal…", width: 40, color: CHART.slate },
            { label: "Venezuela: Venezuela in 2028", width: 28, color: CHART.mist },
          ]}
        />
      </CardShell>
      <CardShell title="Reader Jurisdiction" value="454">
        <HBars
          items={[
            { label: "Embargoed", width: 96, color: CHART.navy },
            { label: "LONDON", width: 72, color: CHART.slate },
            { label: "NEW YORK", width: 58, color: CHART.mist },
            { label: "TORONTO", width: 46, color: CHART.ash },
            { label: "SINGAPORE", width: 36, color: CHART.slate },
            { label: "DUBAI", width: 26, color: CHART.mist },
            { label: "PARIS", width: 18, color: CHART.ash },
          ]}
        />
      </CardShell>
      <CardShell title="Clients" value="1626">
        <HBars
          items={[
            { label: "Embargoed", width: 96, color: CHART.navy },
            { label: "BLUESAY FUNDS MANAGEMENT COMPANY SA", width: 74, color: CHART.slate },
            { label: "EMFI GROUP LIMITED", width: 60, color: CHART.mist },
            { label: "BANCO CITI MEXICO SA IDBM GFCM", width: 48, color: CHART.ash },
            { label: "LOOMIS SAYLES & COMPANY LP", width: 36, color: CHART.slate },
            { label: "BA CONTINUUM PRIVATE LIMITED", width: 26, color: CHART.mist },
            { label: "GOLDMAN SACHS & CO LLC", width: 18, color: CHART.ash },
          ]}
        />
      </CardShell>
    </div>
  );
}

function ResearchReportsPanel() {
  const headers = ["Date", "Report Type", "Country", "Title", "Status"] as const;
  const rows = [
    ["10/20/2026", "Daily Note", "Pakistan", "Double-Digit Inflation Could Delay The B+", "Active"],
    ["10/19/2026", "Country Report", "Zambia", "Hand In Hand With The IMF", "Active"],
    ["10/18/2026", "Daily Note", "Global", "EM Credit: Soft Landing Still Intact", "Active"],
    ["10/17/2026", "Country Report", "Ecuador", "Fiscal Anchors Hold Through Q4", "Active"],
    ["10/16/2026", "Daily Note", "Turkey", "Firewall Holds Into Year-End", "Active"],
    ["10/15/2026", "Strategy Viewpoint", "Caribbean", "Spreads: Tight, but Not Right", "Active"],
    ["10/14/2026", "Country Report", "Colombia", "Policy Path Remains Data Dependent", "Active"],
  ] as const;

  return (
    <div className="h-full overflow-hidden rounded-md border border-line bg-page">
      <table className="w-full border-collapse text-left text-[8.5px]">
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
                  value={i === 1 || i === 4 ? "All" : undefined}
                  select={i === 1 || i === 4}
                />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={row[0] + row[3]} className={ri % 2 === 1 ? "bg-subtle/60" : "bg-page"}>
              {row.map((cell, i) => (
                <td
                  key={i}
                  className={`whitespace-nowrap px-1.5 py-1.5 text-ink ${
                    i === 4 ? "w-[72px]" : "max-w-[140px] truncate"
                  }`}
                >
                  {i === 4 ? <ActivePill label={cell} /> : cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PublicArticlePanel({
  country,
  subtitle,
  paragraphs,
  chartTitle,
  path,
  yLabels,
  xLabels,
  endY,
}: {
  country: string;
  subtitle: string;
  paragraphs: string[];
  chartTitle: string;
  path: string;
  yLabels: string[];
  xLabels: string[];
  endY: number;
}) {
  return (
    <div className="pointer-events-none flex h-full min-h-0 flex-col overflow-hidden rounded-md border border-line bg-page shadow-sm">
      <header className="flex shrink-0 items-center gap-3 bg-nav px-3 py-2">
        <Image
          src="/brand/emfi-logo.svg"
          alt="emfi"
          width={131}
          height={53}
          className="h-[26px] w-auto shrink-0"
          unoptimized
        />
        <nav className="mx-auto hidden items-center gap-4 text-[8px] font-medium text-ink-inverse/80 sm:flex">
          {["Home", "Intelligence", "Services", "About", "Contact"].map((item) => (
            <span key={item}>{item}</span>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2.5 text-[8px] text-ink-inverse/80">
          <span>Español</span>
          <Folder size={12} />
        </div>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-[1.15fr_0.95fr] gap-5 overflow-hidden px-5 pt-5 pb-5 sm:gap-6 sm:px-8 sm:pt-6 sm:pb-6">
        <div className="min-w-0 overflow-hidden">
          <h2 className="text-[24px] font-bold leading-none tracking-[-0.03em] text-[#0a1629]">
            {country}
          </h2>
          <h3 className="mt-3.5 text-[11px] font-bold leading-snug text-[#0a1629]">{subtitle}</h3>
          <div className="mt-2.5 space-y-2 text-[7.5px] leading-[1.55] text-[#4a5568]">
            {paragraphs.map((p) => (
              <p key={p.slice(0, 28)}>{p}</p>
            ))}
          </div>
        </div>

        <div className="flex aspect-square w-full max-w-[240px] flex-col self-start overflow-hidden rounded-[10px] border border-[#e4e8ee] bg-white p-2.5 shadow-[0_10px_28px_rgba(10,22,41,0.08)] justify-self-end sm:max-w-none">
          <p className="mb-1.5 shrink-0 text-center text-[8px] font-medium text-[#0a1629]">
            <span className="blur-[3.5px] select-none">{chartTitle}</span>
          </p>
          <div className="min-h-0 flex-1">
            <ArticleAreaChart
              path={path}
              labels={xLabels}
              yLabels={yLabels}
              endDot={{ x: 320, y: endY }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ExecutionSide({
  symbol,
  apple = false,
  radius = 6,
  spread = false,
}: {
  symbol: string;
  apple?: boolean;
  radius?: number;
  spread?: boolean;
}) {
  const ccy = symbol === "AAPL" ? "USD" : "EUR";
  const label = symbol === "AAPL" ? "APPLE INC" : symbol;
  if (apple) {
    return (
      <div className={`flex h-full min-h-0 flex-col overflow-hidden ${radius === 8 ? "rounded-[8px] border border-[#e0e4ea]" : radius > 6 ? "rounded-md border border-line shadow-sm" : "rounded-[10px] border border-[#e0e4ea]"} bg-white`}>
        <div className="flex shrink-0 items-center gap-1 bg-[#f3f5f8] px-2 py-1">
          <GripVertical size={9} className="shrink-0 text-[#98a2b3]" strokeWidth={2} />
          <span className="text-[8.5px] font-bold text-[#0a1629]">Execution</span>
          <X size={10} className="ml-auto text-[#80909d]" strokeWidth={2} />
        </div>

        <div className="flex min-h-0 flex-1 flex-col justify-between gap-1 overflow-hidden px-2 py-1.5">
          <div className="flex h-[16px] shrink-0 items-center border border-[#d8dde5] px-1.5 text-[6px] text-[#8a94a3]" style={{ borderRadius: radius }}>
            <span className="truncate">Search by ISIN or Ticker...</span>
            <span className="ml-auto pl-1 text-[6px]">▾</span>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <span className="text-[7.5px] font-bold text-[#2458a6]">APPLE INC</span>
            <span className="ml-auto inline-flex items-center gap-1">
              <span className="inline-flex h-[11px] items-center rounded-[4px] border border-[#d8dde5] px-1 text-[5.5px] font-semibold text-[#6b7788]">
                OPT
              </span>
              <Eye size={9} className="text-[#80909d]" strokeWidth={2} />
            </span>
          </div>

          <div className="relative flex h-[26px] shrink-0 overflow-hidden" style={{ borderRadius: radius }}>
            <div className="flex min-w-0 flex-1 flex-col justify-center bg-[#e7f8ee] pl-1.5">
              <p className="text-[5px] font-semibold leading-none text-[#16a34a]">BID</p>
              <p className="mt-0.5 text-[7px] font-bold leading-none tabular-nums text-[#16a34a]">343.78 ↑</p>
            </div>
            <div className="pointer-events-none absolute top-1/2 left-1/2 z-[1] flex h-[14px] w-[14px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[4px] bg-[#0a1629] text-[9px] font-bold leading-none text-white">
              −
            </div>
            <div className="flex min-w-0 flex-1 flex-col items-end justify-center bg-[#fdecec] pr-1.5">
              <p className="text-[5px] font-semibold leading-none text-[#e11d2e]">ASK</p>
              <p className="mt-0.5 text-[7px] font-bold leading-none tabular-nums text-[#e11d2e]">↓ 343.90</p>
            </div>
          </div>

          <div className="grid shrink-0 grid-cols-2 gap-1.5">
            <p className="text-[5.5px] font-medium leading-none text-[#0a1629]">Order Type</p>
            <p className="text-[5.5px] font-medium leading-none text-[#0a1629]">Time</p>
          </div>
          <div className="grid shrink-0 grid-cols-2 gap-1.5">
            <div className="flex h-[16px] items-center border border-[#d8dde5] px-1.5 text-[6.5px] font-semibold text-[#0a1629]" style={{ borderRadius: radius }}>
              MARKET
              <span className="ml-auto text-[6px] font-normal text-[#8a94a3]">▾</span>
            </div>
            <div className="flex h-[16px] items-center border border-[#d8dde5] px-1.5 text-[6.5px] font-semibold text-[#0a1629]" style={{ borderRadius: radius }}>
              DAY
              <span className="ml-auto text-[6px] font-normal text-[#8a94a3]">▾</span>
            </div>
          </div>

          <p className="shrink-0 text-[5.5px] font-medium leading-none text-[#0a1629]">Quantity</p>
          <div className="flex h-[16px] shrink-0 items-center border border-[#d8dde5] px-1.5 text-[7px] font-semibold tabular-nums text-[#0a1629]" style={{ borderRadius: radius }}>
            0
          </div>

          <div className="grid shrink-0 grid-cols-2 gap-1.5">
            <span className="flex h-[22px] items-center justify-center bg-[#f02020] text-[8px] font-bold text-white" style={{ borderRadius: radius }}>
              Sell
            </span>
            <span className="flex h-[22px] items-center justify-center bg-[#22c55e] text-[8px] font-bold text-white" style={{ borderRadius: radius }}>
              Buy
            </span>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-[10px] border border-[#e0e4ea] bg-white">
      <div className="flex shrink-0 items-center justify-between px-2 py-1">
        <span className="text-[8.5px] font-bold text-[#0a1629]">Execution</span>
        <X size={10} className="text-[#80909d]" strokeWidth={2} />
      </div>

      <div className={`flex min-h-0 flex-1 flex-col gap-1 overflow-hidden px-2 ${spread ? "pb-2" : "pb-1.5"}`}>
        <div className={`flex shrink-0 items-center gap-1 rounded-[10px] border border-[#d8dde5] px-1.5 text-[6px] text-[#8a94a3] ${spread ? "h-[22px]" : "h-[18px]"}`}>
          <Search size={8} className="shrink-0 text-[#8a94a3]" />
          <span className="truncate">{apple ? "Search by ISIN or Ticker..." : "Search by ISIN or Ticker"}</span>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <span className="text-[7.5px] font-bold text-[#0a1629]">{label}</span>
          {apple ? (
            <span className="ml-auto text-[6px] font-semibold text-[#6b7788]">OPT</span>
          ) : symbol !== "AAPL" ? (
            <span className="inline-flex h-2.5 items-center rounded-full bg-[#eef1f5] px-1 text-[4.5px] font-semibold text-[#6b7788]">
              FUT
            </span>
          ) : null}
          {apple ? null : <Eye size={9} className="ml-auto text-[#2b6cb0]" strokeWidth={2} />}
        </div>

        <div className={`shrink-0 rounded-[10px] border border-[#d8dde5] px-1.5 ${spread ? "py-1" : "py-0.5"}`}>
          <p className="text-[5px] font-medium leading-none text-[#8a94a3]">Broker</p>
          <div className="mt-0.5 flex items-center justify-between text-[7px] font-semibold text-[#0a1629]">
            <span className="blur-[3.5px] select-none">Interactive</span>
            <span className="text-[6px] text-[#8a94a3]">▾</span>
          </div>
        </div>

        <div className="relative flex shrink-0 items-stretch gap-1.5">
          <div className={`min-w-0 flex-1 rounded-[10px] px-1 text-center ${spread ? "py-1" : "py-0.5"} ${apple ? "border border-[#d7f3e3] bg-[#e9f9ef]" : "border border-[#d8dde5]"}`}>
            <p className="text-[5px] font-semibold leading-none text-[#8a94a3]">BID</p>
            <p className={`mt-0.5 text-[8px] font-bold leading-none tabular-nums ${apple ? "text-[#16a34a]" : "text-[#22c55e]"}`}>{spread ? "▲ 1.1189" : apple ? "0.00 ↑" : "▲ 0"}</p>
          </div>
          <div className="pointer-events-none absolute top-1/2 left-1/2 z-[1] flex h-[18px] w-[18px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#0a1629] text-[7px] font-bold text-white ring-2 ring-white">
            0
          </div>
          <div className={`min-w-0 flex-1 rounded-[10px] px-1 text-center ${spread ? "py-1" : "py-0.5"} ${apple ? "border border-[#f8d4d2] bg-[#fdeceb]" : "border border-[#d8dde5]"}`}>
            <p className="text-[5px] font-semibold leading-none text-[#8a94a3]">ASK</p>
            <p className={`mt-0.5 text-[8px] font-bold leading-none tabular-nums ${apple ? "text-[#e11d2e]" : "text-[#f04438]"}`}>{spread ? "▼ 1.1190" : apple ? "↓ 0.00" : "▼ 0"}</p>
          </div>
        </div>

        <div className="grid shrink-0 grid-cols-2 gap-1.5">
          <div className={`rounded-[10px] border border-[#d8dde5] px-1.5 ${spread ? "py-1" : "py-0.5"}`}>
            <p className="text-[5px] font-medium leading-none text-[#8a94a3]">Order Type</p>
            <div className="mt-0.5 flex items-center justify-between text-[6.5px] font-semibold text-[#0a1629]">
              MARKET
              <span className="text-[5.5px] text-[#8a94a3]">▾</span>
            </div>
          </div>
          <div className={`rounded-[10px] border border-[#d8dde5] px-1.5 ${spread ? "py-1" : "py-0.5"}`}>
            <p className="text-[5px] font-medium leading-none text-[#8a94a3]">Time</p>
            <div className="mt-0.5 flex items-center justify-between text-[6.5px] font-semibold text-[#0a1629]">
              DAY
              <span className="text-[5.5px] text-[#8a94a3]">▾</span>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 overflow-hidden rounded-[10px] border border-[#d8dde5]">
          <div className={`min-w-0 flex-1 px-1.5 ${spread ? "py-1" : "py-0.5"}`}>
            <p className="text-[5px] font-medium leading-none text-[#8a94a3]">Quantity</p>
            <p className="mt-0.5 text-[7px] font-semibold tabular-nums text-[#0a1629]">0</p>
          </div>
          <span className="flex min-w-[26px] items-center justify-center bg-[#0a1629] px-1.5 text-[6.5px] font-bold text-white">
            {ccy}
          </span>
        </div>

        <div className={`${spread ? "" : "mt-auto pt-0.5"} grid shrink-0 grid-cols-2 gap-1.5`}>
          <span className={`flex h-6 items-center justify-center rounded-[10px] text-[8px] font-bold text-white ${apple ? "bg-[#f07167]" : "bg-[#f04438]"}`}>
            Sell
          </span>
          <span className={`flex h-6 items-center justify-center rounded-[10px] text-[8px] font-bold text-white ${apple ? "bg-[#2fce73]" : "bg-[#22c55e]"}`}>
            Buy
          </span>
        </div>
      </div>
    </div>
  );
}

function TransactionsStrip({ apple = false, statusRadius }: { apple?: boolean; statusRadius?: number }) {
  const headers = (apple
    ? [
        "Reference",
        "Trade Date",
        "Settlement",
        "Security",
        "Order Type",
        "ISIN",
        "Direction",
        "Amount",
        "Price",
        "Market Value",
        "Accrued",
        "Status",
      ]
    : [
        "Reference",
        "Trade Date",
        "Settlement",
        "Security",
        "Order Type",
        "ISIN",
        "Direction",
        "Amount",
        "Price",
        "Accrued",
        "Market Value",
        "Portfolio",
        "Counterparty",
        "Status",
      ]) as readonly string[];

  const filterPlaceholders = apple
    ? [
        "Reference",
        "mm/dd/yyyy",
        "mm/dd/yyyy",
        "Security",
        "Order Type",
        "ISIN",
        "Direction",
        "Amount",
        "Price",
        "Market Value",
        "Accrued",
        "All",
      ]
    : [
        "Reference",
        "mm/dd/yyyy",
        "mm/dd/yyyy",
        "Security",
        "Order Type",
        "ISIN",
        "Direction",
        "Amount",
        "Price",
        "Accrued",
        "Market Value",
        "Portfolio",
        "Counterparty",
        "All",
      ];

  const appleRows = [
    ["T933753449-1", "10/29/2026", "10/30/2026", "PEMEX 6 5/8 PERP", "Limit", "US71656MAF67", "Buy", "0/25,000", "98.960", "51,387.22", "26,447.22", "Filled"],
    ["T282545185-1", "10/29/2026", "10/30/2026", "PEMEX 6 5/8 PERP", "Limit", "US71656MAF67", "Buy", "0/20,000", "98.890", "41,095.78", "21,317.78", "Filled"],
    ["T282545184-1", "10/29/2026", "10/30/2026", "PEMEX 6 5/8 PERP", "Limit", "US71656MAF67", "Buy", "0/20,000", "98.890", "41,095.78", "21,317.78", "Filled"],
    ["T8737354762-1", "10/29/2026", "10/30/2026", "PEMEX 6 5/8 PERP", "Limit", "US71656MAF67", "Buy", "0/15,000", "98.860", "30,817.33", "15,988.33", "Filled"],
    ["T6761119876-1", "10/29/2026", "10/30/2026", "ARGENT 0.75 07/09/30", "Limit", "US040114HS26", "Buy", "0/25,000", "98.560", "19,758.25", "46.25", "Filled"],
  ] as const;

  const classicRows = [
    ["T261019083-1", "10/19/2026", "10/21/2026", "MSFT | NMS | USD", "MARKET", "US5949181045", "Buy", "0/5", "MARKET", "0", "24.00", "Alpha Desk 003", "Intesa Desk EU", "Placed"],
    ["T261018044-2", "10/18/2026", "10/20/2026", "AAPL | NMS | USD", "LIMIT", "US0378331005", "Sell", "2/2", "218.40", "0", "436.80", "Equity Book 02", "Prime Broker EU", "Filled"],
    ["T261017019-1", "10/17/2026", "10/19/2026", "EURUSD | FX | EUR", "MARKET", "EU0009652759", "Buy", "1/1", "1.0874", "0", "108.74", "FX Overlay 01", "Clearstream SA", "Filled"],
    ["T261016061-3", "10/16/2026", "10/20/2026", "BAHAMA 6 | USD", "MARKET", "USP0684UAE91", "Redeem", "0/3", "MARKET", "12", "0.00", "Sov Book 07", "Regional Custody", "Placed"],
    ["T261015028-1", "10/15/2026", "10/17/2026", "META | NMS | USD", "LIMIT", "US30303M1027", "Buy", "4/4", "512.30", "0", "2,049.20", "Tech Book 05", "Agency Desk LTD", "Filled"],
  ] as const;

  const rows = apple ? appleRows : classicRows;

  const portfolioIdx = headers.indexOf("Portfolio");
  const counterpartyIdx = headers.indexOf("Counterparty");
  const tradeDateIdx = headers.indexOf("Trade Date");
  const settlementIdx = headers.indexOf("Settlement");
  const statusIdx = headers.indexOf("Status");
  const refIdx = headers.indexOf("Reference");
  const securityIdx = headers.indexOf("Security");
  const isinIdx = headers.indexOf("ISIN");

  return (
    <div className={`flex min-h-0 flex-col overflow-hidden ${statusRadius === 8 ? "rounded-[8px] border border-[#e0e4ea]" : statusRadius ? "h-full rounded-md border border-line shadow-sm" : "h-full rounded-[10px] border border-[#e0e4ea]"} bg-white`}>
      <div className="flex shrink-0 items-center justify-between bg-[#e8edf3] px-2.5 py-1.5">
        <span className="text-[9px] font-bold text-[#0a1629]">{apple ? "Transaction" : "Transactions"}</span>
        <div className="flex items-center gap-1">
          <span className="inline-flex h-[18px] items-center rounded-[10px] bg-[#f04438] px-2 text-[6.5px] font-bold text-white">
            Kill All
          </span>
          <span className="inline-flex h-[18px] w-[18px] items-center justify-center rounded-[6px] bg-[#0a1629] text-white">
            <Pencil size={9} strokeWidth={2.2} />
          </span>
          <span className="inline-flex h-[18px] w-[18px] items-center justify-center rounded-[6px] bg-[#0a1629] text-white">
            <X size={10} strokeWidth={2.2} />
          </span>
        </div>
      </div>
      <div className={`min-h-0 px-0.5 ${statusRadius === 8 ? "pb-2" : "flex-1 overflow-hidden pb-1.5"}`}>
        <table className="w-full table-fixed border-collapse text-left text-[5.5px]">
          <thead>
            <tr className="bg-white text-[#485666]">
              {headers.map((h) => (
                <th key={h} className="truncate px-0.5 py-1 font-bold leading-none">
                  {h}
                </th>
              ))}
            </tr>
            <tr className="bg-white">
              {filterPlaceholders.map((ph, i) => (
                <th key={`f-${headers[i]}`} className="px-0.5 pb-1 align-top">
                  <div className="flex h-[15px] items-center rounded-[4px] border border-[#d5dae3] bg-white px-1 text-[5px] font-medium text-[#9aa3ad]">
                    <span className="truncate">{ph}</span>
                    {i === statusIdx ? (
                      <span className="ml-auto pl-0.5 text-[5px] opacity-70">▾</span>
                    ) : null}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr
                key={row[0]}
                className={`border-t border-[#eef1f5] ${ri % 2 === 1 ? "bg-[#f5f7fa]" : "bg-white"}`}
              >
                {row.map((cell, i) => {
                  const sensitive =
                    i === portfolioIdx ||
                    i === counterpartyIdx ||
                    (apple &&
                      (i === tradeDateIdx ||
                        i === settlementIdx ||
                        i === securityIdx ||
                        i === isinIdx));
                  const status = cell as "Filled" | "Rejected" | "Placed" | "Working";
                  return (
                    <td
                      key={i}
                      className={`truncate leading-none ${
                        apple ? (i === statusIdx ? "h-[16px] px-px py-[2px]" : "px-0.5 py-[2px]") : "px-0.5 py-1"
                      } ${
                        i >= 7 && i <= 10
                          ? "text-right tabular-nums text-[#0a1629]"
                          : "text-[#3d4a5c]"
                      } ${i === refIdx ? "font-medium text-[#3b82c4]" : ""} ${
                        i === securityIdx ? "text-[#2f5f8f]" : ""
                      } ${i === isinIdx ? "text-[#b86b2e]" : ""} ${
                        i === statusIdx ? "text-center" : ""
                      } ${sensitive ? "blur-[3.5px] select-none" : ""}`}
                    >
                      {i === statusIdx ? <StatusBadge status={status} apple={apple} radius={statusRadius} /> : cell}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function OrderEntryPanel({
  symbol,
  title,
  chart,
  apple = false,
  radius = 6,
  spread = false,
}: {
  symbol: string;
  title: string;
  chart: "line" | "candle";
  apple?: boolean;
  radius?: number;
  spread?: boolean;
}) {
  return (
    <div
      className={`relative h-full overflow-hidden ${spread ? "rounded-xl" : ""} ${radius > 6 && radius !== 8 ? "bg-transparent" : "bg-[#eef1f5]"}`}
      style={radius === 8 ? { borderRadius: 8 } : undefined}
    >
      {/* Scale the full Order Entry so chart + execution + transactions all fit */}
      <div
        className={`absolute inset-0 grid gap-2 ${radius === 8 ? "px-1.5 pt-1.5 pb-2" : spread ? "p-4" : "p-1.5"}`}
        style={{
          gridTemplateRows: radius === 8 ? "minmax(0, 1fr) auto" : spread ? "minmax(0, 61%) minmax(0, 39%)" : "minmax(0, 58%) minmax(0, 42%)",
        }}
      >
        <div className={`grid min-h-0 gap-2 overflow-hidden ${radius > 6 ? "grid-cols-[minmax(0,1fr)_228px]" : "grid-cols-[1.35fr_1fr]"}`}>
          <div className={`flex h-full min-h-0 flex-col overflow-hidden ${radius === 8 ? "rounded-[8px] border border-[#e0e4ea]" : radius > 6 ? "rounded-md border border-line shadow-sm" : "rounded-[10px] border border-[#e0e4ea]"} bg-white`}>
            <div className="flex shrink-0 items-center gap-2 px-2 py-1">
              <span
                className={`text-[9px] font-bold text-[#0a1629] ${
                  chart === "candle" ? "blur-[3.5px] select-none" : ""
                }`}
              >
                {title}
              </span>
              <div className="ml-auto flex items-center gap-1.5">
                {chart === "candle" ? (
                  <>
                    {/* Chart-type toggles */}
                    <span className="inline-flex h-4 w-4 items-center justify-center rounded-[3px] text-[#8a94a3]">
                      <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
                        <path d="M1 7.5 L3 5 L5 6 L7 3.5 L9 2" fill="none" stroke="currentColor" strokeWidth="1.2" />
                      </svg>
                    </span>
                    <span className="inline-flex h-4 w-4 items-center justify-center rounded-[3px] bg-[#e8eef8] text-[#3b6db5]">
                      <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
                        <line x1="2.5" y1="1.5" x2="2.5" y2="8.5" stroke="currentColor" strokeWidth="1" />
                        <rect x="1.5" y="3" width="2" height="3.5" fill="currentColor" />
                        <line x1="7.5" y1="1.5" x2="7.5" y2="8.5" stroke="currentColor" strokeWidth="1" />
                        <rect x="6.5" y="2.5" width="2" height="4" fill="currentColor" />
                      </svg>
                    </span>
                    <div className="ml-0.5 flex items-center gap-0.5 text-[6.5px] text-[#6b7788]">
                      {["1D", "5D", "1M", "6M", "YTD", "1Y", "5Y"].map((t, i) => (
                        <span
                          key={t}
                          className={
                            i === 0
                              ? "rounded-[3px] bg-[#dbe7f5] px-1 py-0.5 font-bold text-[#0a1629]"
                              : "px-0.5 font-medium"
                          }
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </>
                ) : apple ? (
                  <>
                    <span className="inline-flex h-4 w-4 items-center justify-center rounded-[3px] text-[#8a94a3]">
                      <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
                        <path d="M1 7.5 L3 5 L5 6 L7 3.5 L9 2" fill="none" stroke="currentColor" strokeWidth="1.2" />
                      </svg>
                    </span>
                    <span className="inline-flex h-4 w-4 items-center justify-center rounded-[3px] bg-[#e8eef8] text-[#3b6db5]">
                      <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
                        <line x1="2.5" y1="1.5" x2="2.5" y2="8.5" stroke="currentColor" strokeWidth="1" />
                        <rect x="1.5" y="3" width="2" height="3.5" fill="currentColor" />
                        <line x1="7.5" y1="1.5" x2="7.5" y2="8.5" stroke="currentColor" strokeWidth="1" />
                        <rect x="6.5" y="2.5" width="2" height="4" fill="currentColor" />
                      </svg>
                    </span>
                    <div className="flex items-center gap-1 text-[6.5px] text-[#6b7788]">
                      {["1D", "5D", "1M", "6M", "YTD", "1Y", "5Y", "MAX"].map((t) => (
                        <span key={t} className="font-medium">
                          {t}
                        </span>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-1.5 text-[6.5px] text-[#6b7788]">
                    {["5D", "1M", "6M", "YTD", "1Y", "5Y", "MAX"].map((t, i) => (
                      <span key={t} className={i === 1 ? "font-bold text-[#0a1629]" : "font-medium"}>
                        {t}
                      </span>
                    ))}
                  </div>
                )}
                <X size={10} className="text-[#80909d]" />
              </div>
            </div>
            <div className="min-h-0 flex-1 px-1.5 pb-1.5">
              {chart === "line" ? (
                <AreaChart
                  path={
                    apple
                      ? "M0 122 C36 108, 62 72, 96 58 C128 46, 168 52, 206 46 C244 40, 278 30, 320 16"
                      : "M0 88 C28 80, 48 72, 70 78 C96 86, 118 54, 148 48 C176 42, 198 58, 228 40 C256 24, 286 32, 320 28"
                  }
                  labels={
                    apple
                      ? ["4. May", "11. May", "18. May", "25. May", "1. Jun", "8. Jun"]
                      : ["22 Sep", "29 Sep", "06 Oct", "13 Oct", "20 Oct"]
                  }
                  yLabels={
                    apple
                      ? ["320.0000", "310.0000", "300.0000", "290.0000", "280.0000", "270.0000"]
                      : ["1.150", "1.135", "1.120", "1.105"]
                  }
                />
              ) : (
                <CandleChart />
              )}
            </div>
          </div>
          <ExecutionSide symbol={symbol} apple={apple} radius={apple ? radius : undefined} spread={spread} />
        </div>
        <div className={radius === 8 ? "" : "min-h-0 overflow-hidden"}>
          <TransactionsStrip apple={apple} statusRadius={radius > 6 ? radius : undefined} />
        </div>
      </div>
    </div>
  );
}

function AppChrome({
  crumbs,
  date,
  activeModule,
  bare = false,
  square = false,
  trimChrome = false,
  appBar = false,
  home15Round = false,
  children,
}: {
  crumbs: string;
  date: string;
  activeModule: (typeof MODULES)[number];
  bare?: boolean;
  square?: boolean;
  trimChrome?: boolean;
  appBar?: boolean;
  home15Round?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={`pointer-events-none flex h-full min-h-0 flex-col overflow-hidden ${appBar ? "rounded-[8px] bg-page" : trimChrome ? `${home15Round ? "rounded-xl" : "rounded-md"} bg-transparent` : square ? "rounded-none bg-page" : "rounded-md bg-page"} ${bare || trimChrome || appBar ? "" : "border border-line shadow-sm"}`}>
      {trimChrome && !appBar ? null : <header className={`flex shrink-0 items-center gap-2 bg-nav px-3 py-2 ${appBar ? "relative" : ""}`}>
        <Image
          src="/brand/emfi-logo.svg"
          alt="emfi"
          width={131}
          height={53}
          className="h-[26px] w-auto shrink-0"
          unoptimized
        />
        {appBar ? null : <p className="hidden max-w-[200px] truncate text-[9px] text-ink-inverse/70 lg:block">
          {crumbs}
        </p>}
        <div className={appBar ? "absolute left-1/2 flex h-7 w-[min(62%,320px)] -translate-x-1/2 items-center rounded-md bg-page px-2.5" : "mx-auto hidden h-7 w-[min(42%,220px)] shrink items-center rounded-md bg-page px-2.5 sm:flex"}>
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

      {trimChrome ? null : <div className="relative flex h-9 shrink-0 items-end bg-page pl-2 pr-2 sm:pl-3 sm:pr-3">
        {/* Border starts after the left gap so it doesn't show before Clients */}
        <div className="pointer-events-none absolute bottom-0 left-2 right-0 border-b border-brand sm:left-3" />
        <div className="relative z-[1] flex min-w-0 flex-1 items-end overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {MODULES.map((item) => (
            <span
              key={item}
              className={`flex h-7 shrink-0 items-center px-1.5 text-[8px] font-medium whitespace-nowrap sm:px-2 sm:text-[8.5px] ${
                item === activeModule
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
            <span className="min-w-0 truncate tabular-nums">{date}</span>
          </span>
          <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-[5px] bg-brand text-ink-inverse">
            <Settings size={11} />
          </span>
        </div>
      </div>}

      <div className={`relative min-h-0 flex-1 overflow-hidden p-2 md:p-2.5 ${trimChrome && !appBar ? "bg-transparent" : "bg-page"}`}>
        {children}
      </div>
    </div>
  );
}

function ViewPanel({ view, apple = false, square = false, trimChrome = false, appBar = false, home15Trade = false }: { view: View; apple?: boolean; square?: boolean; trimChrome?: boolean; appBar?: boolean; home15Trade?: boolean }) {
  switch (view) {
    case "Dashboard":
      return <ResearchDashboardPanel />;
    case "Reports":
      return <ResearchReportsPanel />;
    case "Bahamas":
      return (
        <PublicArticlePanel
          country="Bahamas"
          subtitle="Strategy Viewpoint : Caribbean Spreads: Tight, but Not Right"
          paragraphs={[
            "Caribbean Eurobonds have tightened further versus the EM USD Sovereign High Yield Index, leaving thin cushions for any fiscal or tourism shock.",
            "On a reference Z-spread basis, Barbados still screens as one of the cleaner relative-value names after recent Fitch and S&P actions.",
            "Trinidad & Tobago looks supported near-term, while TRITOB 34 and JAMAN 39 leave little room if growth or tourism softens.",
            "We stay constructive on quality Caribbean credit, but prefer selective holders over indiscriminate spread compression from here.",
          ]}
          chartTitle="- BAHAMA 6 11/21/28 Price"
          path="M0 98 C36 90, 58 108, 86 72 C114 36, 138 54, 162 46 C186 38, 210 68, 236 34 C262 12, 288 22, 320 28"
          yLabels={["100.485", "100.345", "100.205", "100.065"]}
          xLabels={["04 May", "19 May", "04 Jun", "18 Jun", "07 Jul"]}
          endY={28}
        />
      );
    case "Turkey":
      return (
        <PublicArticlePanel
          country="Turkey"
          subtitle="Country Report : Firewall Holds"
          paragraphs={[
            "The SPK moved to liquidate weaker funds while the CBRT stepped in with liquidity to keep market functioning orderly.",
            "Net lira reserves have steadied and CPI disinflation is advancing, though services inflation remains sticky.",
            "Political risk and external financing still set the outer bounds for the curve into the next policy window.",
            "We stay constructive near-term while watching FX intervention signals and deposit dollarisation trends.",
          ]}
          chartTitle="- TURKEY 6 1/8 10/24/28 Price"
          path="M0 22 C36 28, 60 48, 88 36 C116 24, 144 78, 172 90 C200 102, 232 70, 260 82 C288 94, 304 112, 320 118"
          yLabels={["102", "101.15", "100.3", "99.45", "98.6"]}
          xLabels={["27 Apr", "15 Jun", "01 Aug", "07 Oct"]}
          endY={118}
        />
      );
    case "OrderEur":
      return home15Trade ? (
        <OrderEntryPanel symbol="EURUSD" title="EURUSD" chart="line" spread />
      ) : apple ? (
        <OrderEntryPanel symbol="AAPL" title="APPLE INC" chart="line" apple radius={appBar ? 8 : trimChrome ? 10 : 6} />
      ) : (
        <OrderEntryPanel symbol="EURUSD" title="EURUSD" chart="line" />
      );
    case "OrderAapl":
      return <OrderEntryPanel symbol="AAPL" title="APPLE INC" chart="candle" />;
    case "HeroDashboard":
      return (
        <div className="h-full">
          <HeroDashboardScreen bare={apple} square={square} trimChrome={trimChrome} appBar={appBar} />
        </div>
      );
    case "MobileBalances":
      return <MobileBalancesSlide />;
    case "MobileScreens":
      return <MobileScreensSlide />;
    case "MobileScreensPerspective":
      return (
        <MobileScreensSlide
          src="/images/services/balances-three-screens-perspective.jpg"
          width={2048}
          height={1564}
          rounded
        />
      );
    case "FloatingPhones":
      return <FloatingPhones slim={trimChrome} />;
  }
}

const balancesGradient = "linear-gradient(165deg, #f5f9fd 0%, #d7e6f8 100%)";
const ctaBorderGradient = "linear-gradient(90deg, #a7c4fd 0%, #a1bcf3 10%, #9ab5ea 20%, #94aee1 30%, #90a7d9 40%, #899fd0 50%, #75a5c9 60%, #5aafc3 70%, #42b7bc 80%, #2dc0b5 90%, #1ecaae 100%)";
const quietBorder = "linear-gradient(90deg, rgb(186 214 246 / 80%), rgb(168 206 220 / 55%))";
const phoneViews = new Set<View>(["FloatingPhones"]);

function MobileBalancesSlide() {
  return (
    <div className="flex h-full items-center justify-center">
      <Image
        src="/images/services/balances-iphone.png"
        alt="Balances on the EMFI mobile app"
        width={489}
        height={1024}
        className="h-full w-auto max-w-full object-contain"
        unoptimized
      />
    </div>
  );
}

function MobileScreensSlide({
  src = "/images/services/balances-three-phones.jpg",
  width = 1024,
  height = 794,
  rounded = false,
}: {
  src?: string;
  width?: number;
  height?: number;
  rounded?: boolean;
} = {}) {
  return (
    <div className="flex h-full items-center justify-center">
      <Image
        src={src}
        alt="EMFI mobile app showing order entry, balances, and activity"
        width={width}
        height={height}
        className={`h-auto max-h-full w-auto max-w-full object-contain${rounded ? " rounded-xl" : ""}`}
        unoptimized
      />
    </div>
  );
}

export function ResearchExecutionHeroMockup({ views = VIEWS, quietFrame = false, square = false, trimChrome = false, appBar = false, home15Trade = false }: { views?: readonly View[]; quietFrame?: boolean; square?: boolean; trimChrome?: boolean; appBar?: boolean; home15Trade?: boolean } = {}) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const view = views[index] ?? views[0];
  const meta = VIEW_META[view];
  const still = phoneViews.has(view);
  const openFrame = quietFrame;
  const tradeRound = trimChrome && !appBar && !home15Trade && view === "OrderEur";
  const home15Round = home15Trade && view === "OrderEur";
  const hold = HOLD_MS;

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % views.length),
      hold,
    );
    return () => window.clearInterval(id);
  }, [reduced, views, hold]);

  return (
    <div
      data-trade={tradeRound ? "" : undefined}
      className={`${appBar ? "overflow-hidden" : home15Round ? "rounded-xl" : tradeRound ? "rounded-md" : !square ? "rounded-xl" : "rounded-none"} ${openFrame ? "" : `border border-transparent ${quietFrame ? "p-px" : "p-2 md:p-3"}`}`}
      style={
        openFrame
          ? undefined
          : {
              background: `${view === "MobileBalances" || view === "MobileScreens" || phoneViews.has(view) ? balancesGradient : "linear-gradient(#fff, #fff)"} padding-box, ${quietFrame ? quietBorder : ctaBorderGradient} border-box`,
            }
      }
    >
      {/* Fixed stage height so public + app slides never resize the hero */}
      <div className={`relative h-[438px] md:h-[478px] ${appBar || still ? "" : "overflow-hidden"}`} style={appBar ? undefined : home15Round ? { borderRadius: "var(--radius-surface)" } : tradeRound ? { borderRadius: "var(--radius-control)" } : square ? { borderRadius: 0 } : quietFrame ? { borderRadius: 29 } : undefined}>
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={still ? false : { opacity: 0, y: 12 }}
            animate={still ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={still ? { opacity: 0 } : { opacity: 0, y: -10 }}
            transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
            className={`absolute inset-0 h-full ${still ? "" : "overflow-hidden"} ${appBar && !still ? "rounded-[8px] border border-line" : ""}`}
          >
            {meta.kind === "public" ? (
              <ViewPanel view={view} apple={quietFrame} square={square} trimChrome={trimChrome} appBar={appBar} home15Trade={home15Trade} />
            ) : (
              <AppChrome
                crumbs={meta.crumbs}
                date={meta.date}
                activeModule={meta.activeModule}
                bare={quietFrame}
                square={square}
                trimChrome={trimChrome}
                appBar={appBar}
                home15Round={home15Round}
              >
                <ViewPanel view={view} apple={quietFrame} square={square} trimChrome={trimChrome} appBar={appBar} home15Trade={home15Trade} />
              </AppChrome>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
