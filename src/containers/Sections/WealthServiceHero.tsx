'use client';

import { useCallback, useId, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react';
import { fundChart, fundIllustrationPeriod, fundIllustrationPoints } from '@/content/fund-illustration';
import type { WealthCopy } from '@/lib/i18n/service-dictionaries';
import { useServiceLocale } from '@/ui/hooks/useServiceLocale';
import { WealthFundConsent } from './WealthFundConsent';
import styles from './WealthServiceHero.module.css';

const dateOptions = { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' } as const;
const monthOptions = { month: 'short', timeZone: 'UTC' } as const;
const axisLabelCount = 5;
const gridLineCount = 4;
const gridLines = Array.from({ length: gridLineCount }, (_, index) =>
  fundChart.inset + index * (fundChart.height - fundChart.inset * 2) / (gridLineCount - 1)
);
const backdropLine = 'M0 243 L34 227 L70 234 L108 206 L140 214 L181 184 L216 198 L246 176 L279 187 L306 149 L336 162 L374 145 L412 170 L445 155 L476 167 L510 133 L544 147 L578 109 L610 126 L644 99 L680 120 L718 91 L748 100 L780 68 L815 91 L850 59 L883 74 L919 49 L952 66 L1000 42';

export const WealthServiceHero = ({ copy }: { copy: WealthCopy['redesign']['hero'] }) => {
  const { locale, t } = useServiceLocale();
  const formatLocale = locale === 'en' ? 'en-GB' : locale;
  const dateFormatter = new Intl.DateTimeFormat(formatLocale, dateOptions);
  const monthFormatter = new Intl.DateTimeFormat(formatLocale, monthOptions);
  const [range, setRange] = useState(2);
  const [showChart, setShowChart] = useState(false);
  const [cursor, setCursor] = useState<number | null>(null);
  const focusChart = useCallback((figure: HTMLElement | null) => {
    figure?.focus();
  }, []);
  const chartId = useId();
  const gradientId = `${chartId}-fill`;
  const backdropId = `${chartId}-backdrop`;
  const periodStart = new Date(fundIllustrationPeriod.start);
  const periodEnd = new Date(fundIllustrationPeriod.end);
  const selectedStart = new Date(periodEnd);
  const years = fundChart.ranges[range];
  selectedStart.setUTCFullYear(periodEnd.getUTCFullYear() - years);
  const startDate = years ? selectedStart : periodStart;
  const rangeSpan = periodEnd.getTime() - startDate.getTime();
  const axisDates = Array.from({ length: axisLabelCount }, (_, index) =>
    new Date(startDate.getTime() + (index / (axisLabelCount - 1)) * rangeSpan)
  );
  const startFraction = (startDate.getTime() - periodStart.getTime())
    / (periodEnd.getTime() - periodStart.getTime());
  const lastIndex = fundIllustrationPoints.length - 1;
  const startIndex = Math.ceil(lastIndex * startFraction);
  const points = fundIllustrationPoints.slice(startIndex);
  const minimum = Math.min(...points);
  const spread = Math.max(...points) - minimum || 1;
  const coordinates = points.map((point, index) => ({
    date: periodStart.getTime()
      + (startIndex + index) / lastIndex * (periodEnd.getTime() - periodStart.getTime()),
    x: fundChart.inset + (index / (points.length - 1)) * (fundChart.width - fundChart.inset * 2),
    y: fundChart.inset + (1 - (point - minimum) / spread) * (fundChart.height - fundChart.inset * 2),
  }));
  const path = coordinates.map(({ x, y }, index) =>
    `${index ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`
  ).join(' ');
  const endpoint = coordinates[coordinates.length - 1];
  const active = cursor === null ? null : coordinates[cursor];
  const clampIndex = (index: number) => Math.max(0, Math.min(points.length - 1, index));

  const moveCursor = (event: PointerEvent<SVGSVGElement>) => {
    const { left, width } = event.currentTarget.getBoundingClientRect();
    if (!width) return;
    const x = (event.clientX - left) / width * fundChart.width;
    const position = (x - fundChart.inset) / (fundChart.width - 2 * fundChart.inset);
    setCursor(clampIndex(Math.round(position * (points.length - 1))));
  };

  const navigateChart = (event: KeyboardEvent<SVGSVGElement>) => {
    if (event.key === 'Escape') {
      setCursor(null);
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      setCursor(event.key === 'Home' ? 0 : points.length - 1);
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      const step = event.key === 'ArrowLeft' ? -1 : 1;
      setCursor((current) => clampIndex((current ?? points.length - 1) + step));
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
        <h1 id="wealth-heading" className="sr-only">{copy.titleLines.join(' ')}</h1>
        {showChart ? (
          <figure ref={focusChart} tabIndex={-1} className={styles.fund} aria-label={copy.fundName}>
            <header className={styles.header}>
              <h2 className={styles.fundTitle}>{copy.fundName}</h2>
              <div className={styles.ranges} role="group" aria-label={copy.fundName}>
                {copy.ranges.map((label, index) => (
                  <button key={label} type="button" aria-pressed={range === index}
                    onClick={() => { setRange(index); setCursor(null); }}>{label}</button>
                ))}
              </div>
            </header>
            <div className={styles.plot}>
              <svg viewBox={`0 0 ${fundChart.width} ${fundChart.height}`} preserveAspectRatio="none"
                role="img" aria-label={`${copy.fundName}. ${copy.ranges[range]}.`}
                aria-describedby={`${chartId}-help`}
                tabIndex={0} onPointerDown={moveCursor} onPointerMove={moveCursor}
                onPointerLeave={(event) => { if (event.pointerType === 'mouse') setCursor(null); }}
                onKeyDown={navigateChart}
                onFocus={() => setCursor((current) => current ?? points.length - 1)}
                onBlur={() => setCursor(null)}>
                <desc id={`${chartId}-help`}>
                  {copy.illustration}{' '}
                  {t('Use Left and Right arrow keys to explore points, or Home and End to jump to the first and last point.')}
                </desc>
                <defs>
                  <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-blue-300)" stopOpacity="0.26" />
                    <stop offset="100%" stopColor="var(--color-blue-100)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <g key={range} className={styles.series}>
                  <path d={`${path} L${fundChart.width - fundChart.inset} ${fundChart.height - fundChart.inset} L${fundChart.inset} ${fundChart.height - fundChart.inset} Z`}
                    fill={`url(#${gradientId})`} />
                  <path d={path} className={styles.line} />
                  <path d={`M${endpoint.x} ${endpoint.y} l0.01 0`} className={styles.endpointHalo} />
                  <path d={`M${endpoint.x} ${endpoint.y} l0.01 0`} className={styles.endpoint} />
                </g>
                {active ? (
                  <g aria-hidden="true">
                    <line x1={active.x} x2={active.x} y1={fundChart.inset}
                      y2={fundChart.height - fundChart.inset} className={styles.crosshair} />
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
              {axisDates.map((date) => {
                const month = date.toISOString().slice(0, 7);
                return <time key={month} dateTime={month}>{monthFormatter.format(date)}</time>;
              })}
            </div>
          </figure>
        ) : <WealthFundConsent copy={copy.gate} onConfirm={() => setShowChart(true)} />}
      </div>
    </section>
  );
};
