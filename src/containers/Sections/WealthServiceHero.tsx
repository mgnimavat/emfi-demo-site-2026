'use client';

import { useCallback, useId, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react';
import { fundChart, fundIllustrationPeriod, fundIllustrationPoints } from '@/content/fund-illustration';
import type { WealthCopy } from '@/lib/i18n/service-dictionaries';
import { useServiceLocale } from '@/ui/hooks/useServiceLocale';
import { WealthFundConsent } from './WealthFundConsent';
import styles from './WealthServiceHero.module.css';

const dateOptions = { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' } as const;
const gridLineCount = 4;
const gridLines = Array.from({ length: gridLineCount }, (_, index) =>
  fundChart.inset + index * (fundChart.height - fundChart.inset * 2) / (gridLineCount - 1)
);
export const WealthServiceHero = ({ copy }: { copy: WealthCopy['redesign']['hero'] }) => {
  const { locale, t } = useServiceLocale();
  const dateFormatter = new Intl.DateTimeFormat(locale === 'en' ? 'en-GB' : locale, dateOptions);
  const [range, setRange] = useState(2);
  const [showChart, setShowChart] = useState(false);
  const [cursor, setCursor] = useState<number | null>(null);
  const focusChart = useCallback((figure: HTMLElement | null) => {
    figure?.focus();
  }, []);
  const chartId = useId();
  const gradientId = `${chartId}-fill`;
  const periodStart = new Date(fundIllustrationPeriod.start);
  const periodEnd = new Date(fundIllustrationPeriod.end);
  const selectedStart = new Date(periodEnd);
  const years = fundChart.ranges[range];
  selectedStart.setUTCFullYear(periodEnd.getUTCFullYear() - years);
  const startDate = years ? selectedStart : periodStart;
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
                role="img" aria-labelledby={`${chartId}-title`} aria-describedby={`${chartId}-help`}
                tabIndex={0} onPointerDown={moveCursor} onPointerMove={moveCursor}
                onPointerLeave={(event) => { if (event.pointerType === 'mouse') setCursor(null); }}
                onKeyDown={navigateChart}
                onFocus={() => setCursor((current) => current ?? points.length - 1)}
                onBlur={() => setCursor(null)}>
                <title id={`${chartId}-title`}>{copy.fundName}. {copy.ranges[range]}. {copy.illustration}</title>
                <desc id={`${chartId}-help`}>
                  {t('Use Left and Right arrow keys to explore points, or Home and End to jump to the first and last point.')}
                </desc>
                <defs>
                  <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--flow-from)" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="var(--flow-from)" stopOpacity="0.02" />
                  </linearGradient>
                </defs>
                {gridLines.map((y) => (
                  <line key={y} x1={fundChart.inset} y1={y}
                    x2={fundChart.width - fundChart.inset} y2={y} className={styles.gridLine} />
                ))}
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
                    <path d={`M${active.x} ${active.y} l0.01 0`} className={styles.activeMarker} />
                  </g>
                ) : null}
              </svg>
              {active ? (
                <div className={styles.tooltip} role="status"
                  style={{ '--tooltip-x': `${active.x / fundChart.width * 100}%` } as CSSProperties}>
                  <time dateTime={new Date(active.date).toISOString().slice(0, 10)}>
                    {dateFormatter.format(active.date)}
                  </time>
                  <span>{copy.chartBadge}</span>
                </div>
              ) : null}
            </div>
            <div className={styles.axis}>
              <time dateTime={startDate.toISOString().slice(0, 10)}>{dateFormatter.format(startDate)}</time>
              <time dateTime={fundIllustrationPeriod.end}>{dateFormatter.format(periodEnd)}</time>
            </div>
          </figure>
        ) : <WealthFundConsent copy={copy.gate} onConfirm={() => setShowChart(true)} />}
      </div>
    </section>
  );
};
