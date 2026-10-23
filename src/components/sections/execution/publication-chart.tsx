"use client";

import { useId } from "react";
import type { ExecutionResearchChart } from "@/content/execution";
import { PublicationWorldMap } from "./publication-world-map";
import styles from "./research-publications.module.css";

const dateLabel = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", timeZone: "UTC" });

export function PublicationChartSkeleton() {
  return <div className={styles.chartSkeleton} role="status" aria-label="Loading chart" aria-busy="true"><span className={`${styles.skeletonBlock} ${styles.skeletonMeta}`} /><span className={`${styles.skeletonBlock} ${styles.skeletonPlot}`} /></div>;
}

function scale(values: readonly number[], top: number, bottom: number) {
  const min = Math.min(...values), max = Math.max(...values);
  const rough = (max - min || 1) / 4;
  const magnitude = 10 ** Math.floor(Math.log10(rough));
  const step = [1, 2, 2.5, 5, 10].map(value => value * magnitude).find(value => value >= rough) ?? rough;
  let low = Math.floor(min / step) * step, high = Math.ceil(max / step) * step;
  if (low === high) { low -= step; high += step; }
  return { y: (value: number) => bottom - (value - low) / (high - low) * (bottom - top), ticks: Array.from({ length: Math.round((high - low) / step) + 1 }, (_, i) => low + i * step) };
}

export function PublicationChart({ chart }: { chart: ExecutionResearchChart }) {
  const id = useId();
  if (chart.kind === "world") return <PublicationWorldMap chart={chart} />;
  const points = chart.points ?? [];
  if (points.length < 2) return null;
  const benchmark = chart.benchmarkPoints ?? [];
  const left = 58, right = benchmark.length ? 538 : 580, top = 18, bottom = 300;
  const allPoints = [...points, ...benchmark];
  const start = Math.min(...allPoints.map(point => Date.parse(point.date)));
  const end = Math.max(...allPoints.map(point => Date.parse(point.date)));
  const x = (date: string) => left + (Date.parse(date) - start) / (end - start || 1) * (right - left);
  const primary = scale(points.map(point => point.value), top, bottom);
  const secondary = benchmark.length ? scale(benchmark.map(point => point.value), top, bottom) : null;
  const line = (series: typeof points, y: (value: number) => number) => series.map((point, index) => `${index ? "L" : "M"}${x(point.date).toFixed(2)},${y(point.value).toFixed(2)}`).join(" ");
  const path = line(points, primary.y);
  const ticks = [...new Map(Array.from({ length: 5 }, (_, index) => points[Math.round(index / 4 * (points.length - 1))]).map(point => [point.date, point])).values()];
  return <figure className={styles.chart}>
    <figcaption>{chart.title}</figcaption>
    {secondary ? <div className={styles.chartLegend}><span>{chart.title}</span><span>{chart.benchmarkTitle}</span></div> : null}
    <svg viewBox="0 0 600 344" role="img" aria-labelledby={`${id}-title ${id}-desc`} className={styles.priceChart}>
      <title id={`${id}-title`}>{chart.title}</title>
      <desc id={`${id}-desc`}>Published observations from {points[0].date} to {points[points.length - 1].date}. First value {points[0].value}; last value {points[points.length - 1].value}.{secondary ? ` Benchmark: ${chart.benchmarkTitle}, shown on the right axis.` : ""}</desc>
      <defs><linearGradient id={`${id}-fill`} x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#8098cc" stopOpacity=".3" /><stop offset="100%" stopColor="#dce8f8" stopOpacity=".08" /></linearGradient></defs>
      {primary.ticks.map(tick => <g key={tick}><line x1={left} x2={right} y1={primary.y(tick)} y2={primary.y(tick)} stroke="#e4eaf2" /><text x={left - 14} y={primary.y(tick)} textAnchor="end" dominantBaseline="middle">{Number(tick.toFixed(2))}</text></g>)}
      {secondary?.ticks.map(tick => <text key={tick} x={right + 10} y={secondary.y(tick)} dominantBaseline="middle">{Number(tick.toFixed(2))}</text>)}
      <path d={`${path} L${x(points[points.length - 1].date)},${bottom} L${x(points[0].date)},${bottom} Z`} fill={`url(#${id}-fill)`} />
      <path d={path} fill="none" stroke="#31558a" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" data-publication-price-line />
      {secondary ? <path d={line(benchmark, secondary.y)} fill="none" stroke="#9a6d4e" strokeWidth="1.8" strokeLinecap="round" data-publication-benchmark-line /> : null}
      {ticks.map((point, index) => <text key={point.date} x={x(point.date)} y={328} textAnchor={index === 0 ? "start" : index === ticks.length - 1 ? "end" : "middle"}>{dateLabel.format(new Date(`${point.date}T00:00:00Z`))}</text>)}
    </svg>
  </figure>;
}
