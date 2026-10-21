"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import type { ExecutionSecurity } from "@/content/execution-securities";
import styles from "./execution-chart.module.css";

const ranges = [
  { label: "1D", days: 1, span: .025 },
  { label: "5D", days: 5, span: .045 },
  { label: "1M", days: 30, span: .09 },
  { label: "6M", days: 183, span: .18 },
  { label: "YTD", days: 287, span: .23 },
  { label: "1Y", days: 365, span: .28 },
  { label: "5Y", days: 1826, span: .56 },
  { label: "MAX", days: 3652, span: .7 },
] as const;
type Range = (typeof ranges)[number]["label"];
const endDate = Date.UTC(2026, 9, 15, 16);
const day = 86_400_000;
const priceFormat = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const axisDate = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
const tooltipDate = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
const timeFormat = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "UTC" });

export function ExecutionChart({ security }: { security: ExecutionSecurity }) {
  const [range, setRange] = useState<Range>("1M");
  const [cursor, setCursor] = useState<number | null>(null);
  const [size, setSize] = useState({ width: 820, height: 380 });
  const plotRef = useRef<HTMLDivElement>(null);
  const id = useId().replaceAll(":", "");
  useEffect(() => {
    const element = plotRef.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      const width = Math.round(entry.contentRect.width), height = Math.round(entry.contentRect.height);
      if (width > 0 && height > 0) setSize((current) => current.width === width && current.height === height ? current : { width, height });
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const selectedRange = ranges.find((item) => item.label === range) ?? ranges[5];
  const lastPrice = (security.bid + security.ask) / 2;
  const firstPrice = lastPrice * (1 - selectedRange.span);
  // Fixed synthetic price action: trend, pullbacks, and a seeded noise bridge.
  // No historical market data, live feed, or nondeterministic render-time values.
  const anchors = [0, .08, .19, .11, .3, .23, .44, .35, .58, .47, .72, .65, .84, .73, .9, .83, 1];
  let seed = [...`${security.symbol}-${range}`].reduce((value, char) => (value * 31 + char.charCodeAt(0)) >>> 0, 17);
  let walk = 0;
  const noise = [0];
  for (let index = 1; index < 181; index++) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    walk += seed / 4294967296 - .5;
    noise.push(walk);
  }
  const data = noise.map((value, index) => {
    const t = index / (noise.length - 1);
    const position = t * (anchors.length - 1);
    const segment = Math.min(Math.floor(position), anchors.length - 2);
    const progress = anchors[segment] + (anchors[segment + 1] - anchors[segment]) * (position - segment);
    const variation = (value - t * noise[noise.length - 1]) * .035;
    return { date: endDate - selectedRange.days * day * (1 - t), value: firstPrice + (lastPrice - firstPrice) * (progress + variation) };
  });
  const minimum = Math.min(...data.map(point => point.value));
  const maximum = Math.max(...data.map(point => point.value));
  const rawStep = (maximum - minimum) / 5;
  const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const step = Math.ceil(rawStep / magnitude) * magnitude;
  const low = Math.max(0, Math.floor((minimum - rawStep * .25) / step) * step);
  const high = Math.ceil((maximum + rawStep * .25) / step) * step;
  const left = size.width < 450 ? 54 : 66, right = size.width - 24, top = 24, bottom = size.height - 42;
  const x = (index: number) => left + (right - left) * index / (data.length - 1);
  const y = (value: number) => bottom - (bottom - top) * (value - low) / (high - low);
  const path = data.map((point, index) => `${index ? "L" : "M"}${x(index).toFixed(2)},${y(point.value).toFixed(2)}`).join(" ");
  const area = `${path} L${right},${bottom} L${left},${bottom} Z`;
  const ticks = Array.from({ length: Math.round((high - low) / step) + 1 }, (_, index) => low + step * index);
  const active = cursor === null ? null : data[cursor];

  function move(event: PointerEvent<SVGSVGElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const position = (event.clientX - bounds.left) * size.width / bounds.width;
    setCursor(Math.max(0, Math.min(data.length - 1, Math.round((position - left) / (right - left) * (data.length - 1)))));
  }

  function keyDown(event: KeyboardEvent<SVGSVGElement>) {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      setCursor((current) => Math.max(0, Math.min(data.length - 1, (current ?? data.length - 1) + (event.key === "ArrowRight" ? 1 : -1))));
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      setCursor(event.key === "Home" ? 0 : data.length - 1);
    } else if (event.key === "Escape") setCursor(null);
  }

  const tooltipX = cursor === null ? left : Math.min(Math.max(x(cursor) - 80, left), right - 160);
  return <figure className={styles.chart} aria-label={`${security.symbol} demo price chart`}>
    <div className={styles.header}>
      <span className={styles.title}><strong>{security.symbol}</strong></span>
      <div className={styles.ranges} role="group" aria-label="Chart time range">{ranges.map((item) => <button key={item.label} type="button" aria-pressed={range === item.label} aria-controls={`${id}-plot`} onClick={() => { setRange(item.label); setCursor(null); }}>{item.label}</button>)}</div>
    </div>
    <div ref={plotRef} className={styles.plot}>
      <svg id={`${id}-plot`} viewBox={`0 0 ${size.width} ${size.height}`} className={styles.svg} role="img" aria-labelledby={`${id}-title ${id}-description`} tabIndex={0} onPointerMove={move} onPointerLeave={() => setCursor(null)} onFocus={() => setCursor(data.length - 1)} onBlur={() => setCursor(null)} onKeyDown={keyDown}>
        <title id={`${id}-title`}>{`${security.name} · ${range} demo price chart`}</title>
        <desc id={`${id}-description`}>Synthetic USD prices for a local demonstration, not historical or live market data. Use Left and Right arrow keys to explore points, or Home and End to jump to the first and last point.</desc>
        <defs><linearGradient id={`${id}-area`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#4d6fb8" stopOpacity=".24" /><stop offset="100%" stopColor="#dce8f8" stopOpacity=".03" /></linearGradient></defs>
        <g className={styles.yTicks}>{ticks.map((tick) => <g key={tick}><line x1={left} x2={right} y1={y(tick)} y2={y(tick)} /><text x={left - 12} y={y(tick)} dominantBaseline="middle" textAnchor="end">{priceFormat.format(tick)}</text></g>)}</g>
        <line x1={left} x2={right} y1={y(lastPrice)} y2={y(lastPrice)} stroke="#8098cc" strokeOpacity=".45" strokeDasharray="4 5" />
        <path d={area} fill={`url(#${id}-area)`} />
        <path d={path} fill="none" stroke="#244f88" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" data-price-line />
        <circle cx={right} cy={y(lastPrice)} r="4" fill="#244f88" stroke="#fff" strokeWidth="2" />
        <line x1={left} x2={right} y1={bottom} y2={bottom} className={styles.baseline} />
        <g className={styles.xTicks}>{Array.from({ length: 6 }, (_, index) => {
          const pointIndex = Math.round((data.length - 1) * index / 5);
          const point = data[pointIndex];
          return <g key={index}><line x1={x(pointIndex)} x2={x(pointIndex)} y1={bottom} y2={bottom + 7} /><text x={x(pointIndex)} y={bottom + 25} textAnchor={index === 0 ? "start" : index === 5 ? "end" : "middle"}>{range === "1D" ? timeFormat.format(point.date) : axisDate.format(point.date)}</text></g>;
        })}</g>
        {active && cursor !== null ? <g className={styles.cursor} pointerEvents="none" data-chart-cursor><line x1={x(cursor)} x2={x(cursor)} y1={top} y2={bottom} strokeDasharray="3 4" /><circle cx={x(cursor)} cy={y(active.value)} r="4" /><rect x={tooltipX} y={top + 4} width="160" height="48" rx="6" /><text x={tooltipX + 12} y={top + 23}>{range === "1D" ? timeFormat.format(active.date) : tooltipDate.format(active.date)}</text><text x={tooltipX + 12} y={top + 42} className={styles.tooltipPrice}>{`${priceFormat.format(active.value)} USD`}</text></g> : null}
      </svg>
    </div>
    <figcaption>Demo price chart · USD · Not live</figcaption>
  </figure>;
}
