'use client';

import { useCallback, useEffect, useId, useMemo, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react';
import { fundPositionRanges, type FundPositionPoint } from '@/lib/fund-position-data';
import type { WealthCopy } from '@/lib/i18n/service-dictionaries';
import { useServiceLocale } from '@/ui/hooks/useServiceLocale';
import { WealthFundConsent } from './WealthFundConsent';
import styles from './WealthServiceHero.module.css';

const dateOptions = { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' } as const;
const monthOptions = { month: 'short', year: 'numeric', timeZone: 'UTC' } as const;
const fundChart = { width: 1000, height: 360, inset: 20 } as const;
const plotWidth = fundChart.width - fundChart.inset * 2;
const plotHeight = fundChart.height - fundChart.inset * 2;
const plotBottom = fundChart.height - fundChart.inset;
const axisLabelCount = 5;
const gridLineCount = 4;
const gridLines = Array.from({ length: gridLineCount }, (_, index) =>
  fundChart.inset + index * plotHeight / (gridLineCount - 1)
);
const backdropLine = 'M0 243 L34 227 L70 234 L108 206 L140 214 L181 184 L216 198 L246 176 L279 187 L306 149 L336 162 L374 145 L412 170 L445 155 L476 167 L510 133 L544 147 L578 109 L610 126 L644 99 L680 120 L718 91 L748 100 L780 68 L815 91 L850 59 L883 74 L919 49 L952 66 L1000 42';

export const WealthServiceHero = ({ copy }: { copy: WealthCopy['redesign']['hero'] }) => {
  const { locale, t } = useServiceLocale();
  const formatLocale = locale === 'en' ? 'en-GB' : locale;
  const dateFormatter = new Intl.DateTimeFormat(formatLocale, dateOptions);
  const monthFormatter = new Intl.DateTimeFormat(formatLocale, monthOptions);
  const [range, setRange] = useState(2);
  const [showChart, setShowChart] = useState(false);
  const [result, setResult] = useState<FundPositionPoint[] | 'unavailable' | null>(null);
  const [retry, setRetry] = useState(0);
  const [cursor, setCursor] = useState<number | null>(null);
  const focusChart = useCallback((figure: HTMLElement | null) => {
    figure?.focus();
  }, []);
  const chartId = useId();
  const gradientId = `${chartId}-fill`;
  const backdropId = `${chartId}-backdrop`;
  const feed = fundPositionRanges[range];

  useEffect(() => {
    if (!showChart) return;
    const controller = new AbortController();
    const { signal } = controller;
    const load = async () => {
      try {
        const response = await fetch(`/api/fund-positions/${feed}`, { signal, cache: 'no-store' });
        if (!response.ok) throw new Error('Chart feed unavailable');
        const data = await response.json() as FundPositionPoint[];
        if (!signal.aborted) setResult(data);
      } catch {
        if (!signal.aborted) setResult('unavailable');
      }
    };
    void load();
    return () => controller.abort();
  }, [feed, retry, showChart]);

  const chart = useMemo(() => {
    if (!Array.isArray(result)) return null;
    const periodStart = result[0].date;
    const rangeSpan = result[result.length - 1].date - periodStart;
    const coordinates = result.map(({ date, value }) => ({
      date,
      x: fundChart.inset + (date - periodStart) / rangeSpan * plotWidth,
      y: fundChart.inset + (1 - value) * plotHeight,
    }));
    const path = coordinates.map(({ x, y }, index) =>
      `${index ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`
    ).join(' ');
    const axisDates = Array.from({ length: axisLabelCount }, (_, index) =>
      new Date(periodStart + index / (axisLabelCount - 1) * rangeSpan)
    );
    return { axisDates, coordinates, path, endpoint: coordinates[coordinates.length - 1] };
  }, [result]);

  const active = cursor === null ? null : chart?.coordinates[cursor];
  const lastIndex = (chart?.coordinates.length ?? 1) - 1;
  const clampIndex = (index: number) => Math.max(0, Math.min(lastIndex, index));

  const moveCursor = (event: PointerEvent<SVGSVGElement>) => {
    const { left, width } = event.currentTarget.getBoundingClientRect();
    if (!width || !chart) return;
    const x = (event.clientX - left) / width * fundChart.width;
    const next = chart.coordinates.findIndex((point) => point.x >= x);
    const previous = next - 1;
    const nearest = previous >= 0 && x - chart.coordinates[previous].x < chart.coordinates[next].x - x
      ? previous
      : next;
    setCursor(nearest < 0 ? lastIndex : nearest);
  };

  const navigateChart = (event: KeyboardEvent<SVGSVGElement>) => {
    if (event.key === 'Escape') {
      setCursor(null);
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      setCursor(event.key === 'Home' ? 0 : lastIndex);
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      const step = event.key === 'ArrowLeft' ? -1 : 1;
      setCursor((current) => clampIndex((current ?? lastIndex) + step));
    }
  };

  return (
    <section className={styles.section} data-chart={showChart} aria-labelledby="wealth-heading">
      {!showChart ? (
        <svg className={styles.chartBackdrop} viewBox={`0 0 ${fundChart.width} ${fundChart.height}`}
          preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <defs>
            <linearGradient id={backdropId} x2="0" y2="1">
              <stop stopColor="var(--color-blue-200)" stopOpacity=".32" />
              <stop offset="100%" stopColor="var(--color-blue-100)" stopOpacity="0" />
            </linearGradient>
          </defs>
          {gridLines.map((y) => (
            <line key={y} x1="0" x2={fundChart.width} y1={y} y2={y} className={styles.gridLine} />
          ))}
          <path d={`${backdropLine} V${fundChart.height} H0 Z`} fill={`url(#${backdropId})`} />
          <path d={backdropLine} className={styles.backdropLine} />
        </svg>
      ) : null}
      <div className={styles.container}>
        <h1 id="wealth-heading" className={showChart ? 'sr-only' : styles.title}>
          {copy.titleLines.map((line, index) => (
            <span key={line}>{index > 0 ? ' ' : ''}{line}</span>
          ))}
        </h1>
        {showChart ? (
          <figure ref={focusChart} tabIndex={-1} className={styles.fund} aria-label={copy.fundName}>
            <header className={styles.header}>
              <h2 className={styles.fundTitle}>{copy.fundName}</h2>
              <div className={styles.ranges} role="group" aria-label={copy.fundName}>
                {copy.ranges.map((label, index) => (
                  <button key={label} type="button" aria-pressed={range === index}
                    onClick={() => {
                      if (index === range) return;
                      setResult(null);
                      setRange(index);
                      setCursor(null);
                    }}>{label}</button>
                ))}
              </div>
            </header>
            {chart ? (
              <>
                  <div className={styles.plot}>
                    <svg viewBox={`0 0 ${fundChart.width} ${fundChart.height}`} preserveAspectRatio="none"
                      role="img" aria-label={`${copy.fundName}. ${copy.chartSeries}. ${copy.ranges[range]}.`}
                      aria-describedby={`${chartId}-help`}
                      tabIndex={0} onPointerDown={moveCursor} onPointerMove={moveCursor}
                      onPointerLeave={(event) => { if (event.pointerType === 'mouse') setCursor(null); }}
                      onKeyDown={navigateChart}
                      onFocus={() => setCursor((current) => current ?? lastIndex)}
                      onBlur={() => setCursor(null)}>
                      <desc id={`${chartId}-help`}>
                        {t('Use Left and Right arrow keys to explore points, or Home and End to jump to the first and last point.')}
                      </desc>
                      <defs>
                        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--color-blue-300)" stopOpacity="0.26" />
                          <stop offset="100%" stopColor="var(--color-blue-100)" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      {gridLines.map((y) => (
                        <line key={y} x1={fundChart.inset} x2={fundChart.width - fundChart.inset}
                          y1={y} y2={y} className={styles.gridLine} />
                      ))}
                      <g key={range} className={styles.series}>
                        <path d={`${chart.path} L${fundChart.width - fundChart.inset} ${plotBottom} L${fundChart.inset} ${plotBottom} Z`}
                          fill={`url(#${gradientId})`} />
                        <path d={chart.path} className={styles.line} />
                        <path d={`M${chart.endpoint.x} ${chart.endpoint.y} l0.01 0`} className={styles.endpointHalo} />
                        <path d={`M${chart.endpoint.x} ${chart.endpoint.y} l0.01 0`} className={styles.endpoint} />
                      </g>
                      {active ? (
                        <g aria-hidden="true">
                          <line x1={active.x} x2={active.x} y1={fundChart.inset}
                            y2={plotBottom} className={styles.crosshair} />
                          <path d={`M${active.x} ${active.y} l0.01 0`} className={styles.markerHalo} />
                          <path d={`M${active.x} ${active.y} l0.01 0`} className={styles.activeMarker} />
                        </g>
                      ) : null}
                    </svg>
                    {active ? (
                      <div className={styles.tooltip} role="status"
                        data-below={active.y < fundChart.height / 6}
                        style={{
                          '--tooltip-x': `${active.x / fundChart.width * 100}%`,
                          '--tooltip-y': `${active.y / fundChart.height * 100}%`,
                        } as CSSProperties}>
                        <time dateTime={new Date(active.date).toISOString().slice(0, 10)}>
                          {dateFormatter.format(active.date)}
                        </time>
                      </div>
                    ) : null}
                  </div>
                  <div className={styles.axis}>
                    {chart.axisDates.map((date) => (
                      <time key={date.getTime()} dateTime={date.toISOString().slice(0, 10)}>
                        {monthFormatter.format(date)}
                      </time>
                    ))}
                  </div>
              </>
            ) : (
              <div className={styles.chartState}>
                {result === 'unavailable' ? (
                  <>
                    <p role="alert">{copy.chartUnavailable}</p>
                    <button type="button" onClick={() => { setResult(null); setRetry((value) => value + 1); }}>
                      {copy.chartRetry}
                    </button>
                  </>
                ) : <p role="status">{copy.chartLoading}</p>}
              </div>
            )}
          </figure>
        ) : <WealthFundConsent copy={copy.gate} onConfirm={() => setShowChart(true)} />}
      </div>
    </section>
  );
};
