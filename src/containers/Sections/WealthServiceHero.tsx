'use client';

import {
  useEffect, useId, useMemo, useRef, useState,
  type CSSProperties, type KeyboardEvent, type PointerEvent,
} from 'react';
import { fundPositionRanges, isFundPositionSeries, type FundPositionPoint, type FundPositionRange } from '@/lib/fund-position-data';
import { ExecutionHeroTitle } from '@/components/sections/execution/hero-title';
import type { WealthCopy } from '@/lib/i18n/service-dictionaries';
import { TimeSeriesPlot, type TimeSeriesPlotState } from '@/ui/components/TimeSeriesPlot';
import { useServiceLocale } from '@/ui/hooks/useServiceLocale';
import { WealthFundConsent } from './WealthFundConsent';
import styles from './WealthServiceHero.module.css';

const dateOptions = { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' } as const;
const monthOptions = { month: 'short', year: 'numeric', timeZone: 'UTC' } as const;
const plot = { width: 1000, height: 400, top: 26, bottom: 380 } as const;
const shineWidth = plot.width * 0.16;
const dateStops = [0, 0.25, 0.5, 0.75, 1] as const;
const upperTooltipBand = plot.height / 4;
const gridRows = 6;
const relativeTicks = [0, 0.2, 0.4, 0.6, 0.8, 1] as const;
const monthLabelSpacing = 90;
const gridLines = Array.from({ length: gridRows }, (_, index) =>
  plot.top + index * (plot.bottom - plot.top) / (gridRows - 1)
);
const previewProfile = [
  [0, 0.02], [0.025, 0.045], [0.045, 0.03], [0.062, 0.066], [0.08, 0.026],
  [0.123, 0.024], [0.127, 0.48], [0.147, 0.41], [0.17, 0.47], [0.193, 0.42],
  [0.228, 0.43], [0.243, 0.57], [0.282, 0.54], [0.298, 0.70], [0.325, 0.75],
  [0.353, 0.62], [0.386, 0.68], [0.409, 0.83], [0.447, 0.79], [0.461, 0.95],
  [0.49, 0.91], [0.52, 0.86], [0.551, 0.94], [0.583, 0.89], [0.607, 0.80],
  [0.643, 0.86], [0.669, 0.82], [0.713, 0.84], [0.759, 0.83], [0.789, 0.97],
  [0.815, 0.90], [0.841, 0.92], [0.865, 0.84], [0.891, 0.82], [0.912, 0.99],
  [0.941, 0.92], [0.959, 0.79], [0.976, 0.66], [0.99, 0.68], [1, 0.56],
] as const;
const defaultRange: FundPositionRange = '1-year';

const toPlotY = (value: number) => plot.bottom - value * (plot.bottom - plot.top);

const toPath = (points: { x: number; y: number }[]) =>
  points.map(({ x, y }, index) => `${index === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');

const previewPath = toPath(previewProfile.map(([progress, value]) => ({
  x: progress * plot.width,
  y: toPlotY(value),
})));
const previewPoints = previewProfile.map(([date, value]) => ({ date, value }));

type ChartResult = { range: FundPositionRange; points: FundPositionPoint[] | 'unavailable' };

export const WealthServiceHero = ({ copy, heroTypewriter, layout = 'stacked' }: {
  copy: WealthCopy['redesign']['hero']; heroTypewriter: WealthCopy['heroTypewriter']; layout?: 'stacked' | 'split';
}) => {
  const { locale, t } = useServiceLocale();
  const split = layout === 'split';
  const formatLocale = locale === 'en' ? 'en-GB' : locale;
  const dateFormatter = useMemo(() => new Intl.DateTimeFormat(formatLocale, dateOptions), [formatLocale]);
  const monthFormatter = useMemo(() => new Intl.DateTimeFormat(formatLocale, monthOptions), [formatLocale]);
  const [range, setRange] = useState<FundPositionRange>(defaultRange);
  const [confirmed, setConfirmed] = useState(false);
  const [result, setResult] = useState<ChartResult | null>(null);
  const [retry, setRetry] = useState(0);
  const [cursor, setCursor] = useState<number | null>(null);
  const activeRangeRef = useRef<HTMLButtonElement>(null);
  const chartId = useId();
  const plotId = `${chartId}-plot`;
  const areaGradientId = `${chartId}-area-fill`;
  const shineGradientId = `${chartId}-shine`;
  const shineMaskId = `${chartId}-shine-mask`;
  const guideGradientId = `${chartId}-guide`;
  const points = result?.range === range ? result.points : null;
  const loading = confirmed && points === null;

  useEffect(() => {
    if (confirmed) activeRangeRef.current?.focus({ preventScroll: true });
  }, [confirmed]);

  useEffect(() => {
    if (!confirmed) return;
    const controller = new AbortController();
    const { signal } = controller;
    const load = async () => {
      try {
        const response = await fetch(`/api/fund-positions/${range}`, { signal, cache: 'no-store' });
        if (!response.ok) throw new Error('Chart feed unavailable');
        const data: unknown = await response.json();
        if (signal.aborted) return;
        setResult({ range, points: isFundPositionSeries(data) ? data : 'unavailable' });
      } catch {
        if (!signal.aborted) setResult({ range, points: 'unavailable' });
      }
    };
    void load();
    return () => controller.abort();
  }, [confirmed, range, retry]);

  const chart = useMemo(() => {
    if (split || !Array.isArray(points)) return null;
    const first = points[0];
    const last = points[points.length - 1];
    if (!first || !last || first.date >= last.date) return null;
    const span = last.date - first.date;
    const coordinates = points.map(({ date, value }) => ({
      date,
      x: (date - first.date) / span * plot.width,
      y: toPlotY(value),
    }));
    return {
      axisDates: dateStops.map((stop) => new Date(first.date + stop * span)),
      coordinates,
      path: toPath(coordinates),
      endpoint: coordinates[coordinates.length - 1],
    };
  }, [points, split]);

  const active = cursor === null ? null : chart?.coordinates[cursor];
  const lastIndex = (chart?.coordinates.length ?? 1) - 1;
  const visiblePath = confirmed ? chart?.path : previewPath;

  const moveCursor = (event: PointerEvent<SVGSVGElement>) => {
    const { left, width } = event.currentTarget.getBoundingClientRect();
    if (!width || !chart) return;

    const x = (event.clientX - left) / width * plot.width;
    const next = chart.coordinates.findIndex((point) => point.x >= x);
    if (next <= 0) {
      setCursor(next === 0 ? 0 : lastIndex);
      return;
    }
    const previous = next - 1;
    setCursor(x - chart.coordinates[previous].x < chart.coordinates[next].x - x ? previous : next);
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
      setCursor((current) => Math.max(0, Math.min(lastIndex, (current ?? lastIndex) + step)));
    }
  };

  const chartTitle = `${copy.chartSeries}. ${copy.ranges[fundPositionRanges.indexOf(range)]}.`;
  const chartInstructions = t('Use Left and Right arrow keys to explore points, or Home and End to jump to the first and last point.');
  const title = <h1 id="wealth-heading" className={styles.title}>{copy.title}</h1>;
  const subtitle = <p className={split ? styles.chartTitle : styles.description}>{confirmed ? copy.body : null}</p>;
  const rangeControls = (
    <div className={split ? styles.chartRanges : styles.ranges} role="group" aria-label={copy.rangeLabel} inert={!confirmed}>
      {fundPositionRanges.map((option, index) => (
        <button key={option} ref={range === option ? activeRangeRef : undefined}
          type="button" aria-pressed={range === option} aria-controls={split ? plotId : undefined}
          onClick={() => {
            if (option === range) return;
            setResult(null);
            setRange(option);
            setCursor(null);
          }}>
          <bdi>{copy.ranges[index]}</bdi>
        </button>
      ))}
    </div>
  );
  const summary = (
    <div className={split ? styles.chartToolbar : styles.summary}>{subtitle}{rangeControls}</div>
  );
  const consent = !confirmed && (
    <div className={styles.overlay}>
      <WealthFundConsent copy={copy.gate} onConfirm={() => setConfirmed(true)} />
    </div>
  );
  const retryChart = (
    <div className={styles.chartState}>
      <p role="alert">{copy.chartUnavailable}</p>
      <button type="button" onClick={() => {
        setResult(null);
        setRetry((value) => value + 1);
      }}>
        {copy.chartRetry}
      </button>
    </div>
  );
  const workstationPlot: TimeSeriesPlotState = !confirmed
    ? { kind: 'preview', points: previewPoints }
    : Array.isArray(points) ? { kind: 'ready', points }
    : loading ? { kind: 'loading', label: copy.chartLoading }
    : { kind: 'unavailable', content: retryChart };
  const fund = split ? (
    <figure inert={!confirmed} className={styles.cardFigure} aria-label={copy.chartSeries}
      aria-describedby={`${chartId}-disclaimer`}>
      <TimeSeriesPlot
        id={plotId}
        title={chartTitle}
        description={`${copy.chartScaleDescription} ${chartInstructions}`}
        state={workstationPlot}
        valueTicks={relativeTicks}
        minDateTickSpacing={monthLabelSpacing}
        formatAxisDate={monthFormatter.format}
        formatTooltipDate={dateFormatter.format}
        showNativeTooltip={false}
      />
      <figcaption id={`${chartId}-disclaimer`} className={styles.cardDisclaimer}>
        <strong>{copy.disclaimerLabel}:</strong>{' '}{copy.risk}
      </figcaption>
    </figure>
  ) : (
    <figure inert={!confirmed} className={styles.fund} aria-label={copy.chartSeries}>
      <div className={styles.plot} data-interactive={Boolean(chart)} data-loading={loading}>
        <svg viewBox={`0 0 ${plot.width} ${plot.height}`} preserveAspectRatio="none"
          role={chart ? 'img' : undefined} aria-hidden={!chart}
          aria-label={chart ? chartTitle : undefined}
          aria-describedby={chart ? `${chartId}-help` : undefined}
          tabIndex={chart ? 0 : undefined}
          onPointerDown={moveCursor} onPointerMove={moveCursor}
          onPointerLeave={(event) => { if (event.pointerType === 'mouse') setCursor(null); }}
          onKeyDown={navigateChart} onFocus={() => setCursor((current) => current ?? lastIndex)}
          onBlur={() => setCursor(null)}>
          {chart && (
            <desc id={`${chartId}-help`}>{chartInstructions}</desc>
          )}
          <defs>
            <linearGradient id={areaGradientId} gradientUnits="userSpaceOnUse"
              x1="0" y1={plot.top} x2="0" y2={plot.bottom}>
              <stop stopColor="color-mix(in srgb, var(--color-blue-100) 32%, var(--bg-page))" />
              <stop offset="100%" stopColor="var(--bg-page)" />
            </linearGradient>
            {chart && (
              <>
                <linearGradient id={shineGradientId}>
                  <stop stopColor="white" stopOpacity="0" />
                  <stop offset="32%" stopColor="white" stopOpacity=".28" />
                  <stop offset="50%" stopColor="white" stopOpacity=".96" />
                  <stop offset="68%" stopColor="white" stopOpacity=".28" />
                  <stop offset="100%" stopColor="white" stopOpacity="0" />
                </linearGradient>
                <mask id={shineMaskId} maskUnits="userSpaceOnUse"
                  x={0} y={0} width={plot.width} height={plot.height}>
                  <rect className={styles.shineSweep} x={-shineWidth} width={shineWidth}
                    height={plot.height} fill={`url(#${shineGradientId})`} />
                </mask>
              </>
            )}
            <linearGradient id={guideGradientId} gradientUnits="userSpaceOnUse"
              x1="0" y1={plot.top} x2="0" y2={plot.bottom}>
              <stop stopColor="var(--accent)" stopOpacity="0" />
              <stop offset="24%" stopColor="var(--accent)" stopOpacity=".65" />
              <stop offset="76%" stopColor="var(--accent)" stopOpacity=".65" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <g aria-hidden="true">
            {visiblePath && (
              <path key={confirmed ? `${range}-area` : 'preview-area'} className={styles.series}
                d={`${visiblePath} V${plot.bottom} H0 Z`} fill={`url(#${areaGradientId})`} />
            )}
            {gridLines.map((y) => (
              <line key={y} x1="0" x2={plot.width} y1={y} y2={y} className={styles.gridLine} />
            ))}
            {dateStops.map((stop) => (
              <line key={stop} x1={stop * plot.width} x2={stop * plot.width} y1={plot.top}
                y2={plot.bottom} className={`${styles.gridLine} ${styles.verticalGrid}`} />
            ))}
            {visiblePath && (
              <g key={confirmed ? range : 'preview'} className={styles.series}>
                <path d={visiblePath} className={styles.line} />
                {chart && (
                  <path d={visiblePath} className={styles.lineShine} mask={`url(#${shineMaskId})`} />
                )}
              </g>
            )}
            {chart && (
              <g>
                <path d={`M${chart.endpoint.x} ${chart.endpoint.y} h.01`}
                  className={styles.endpointPulse} />
                <path d={`M${chart.endpoint.x} ${chart.endpoint.y} h.01`}
                  className={styles.endpoint} />
              </g>
            )}
            {active && (
              <line x1={active.x} x2={active.x} y1={plot.top} y2={plot.bottom}
                stroke={`url(#${guideGradientId})`} className={styles.activeGuide} />
            )}
          </g>
        </svg>
        {active && (
          <div className={styles.selection}
            style={{
              '--active-x': `${active.x / plot.width * 100}%`,
              '--active-y': `${active.y / plot.height * 100}%`,
            } as CSSProperties}>
            <span className={styles.activeMarker} aria-hidden="true" />
            <div className={styles.tooltip} role="status" data-below={active.y < upperTooltipBand}>
              <time dateTime={new Date(active.date).toISOString().slice(0, 10)}>
                {dateFormatter.format(active.date)}
              </time>
            </div>
          </div>
        )}
        {loading && (
          <div className={styles.chartSkeleton} role="status">
            <span className="sr-only">{copy.chartLoading}</span>
          </div>
        )}
        {confirmed && !loading && !chart && retryChart}
      </div>
      <figcaption className={styles.chartFooter}>
        {(chart || loading) && (
          <div className={styles.axis} aria-hidden={loading || undefined}>
            {chart ? chart.axisDates.map((date, index) => (
              <time key={date.getTime()} dateTime={date.toISOString().slice(0, 10)}
                style={{ '--tick-x': `${dateStops[index] * 100}%` } as CSSProperties}>
                {monthFormatter.format(date)}
              </time>
            )) : dateStops.map((stop) => (
              <span key={stop} className={styles.skeletonTick}
                style={{ '--tick-x': `${stop * 100}%` } as CSSProperties} />
            ))}
          </div>
        )}
        <p className={styles.disclaimer}>
          <strong>{copy.disclaimerLabel}:</strong>{' '}{copy.risk} {copy.capitalRisk} {copy.marketing}
        </p>
      </figcaption>
    </figure>
  );

  return (
    <section className={styles.section} aria-labelledby="wealth-heading" data-confirmed={confirmed}>
      <div className={styles.container}>
        <div className={styles.stage} data-layout={split ? layout : undefined}>
          {split ? (
            <>
              <div className={styles.heroCopy}>
                <ExecutionHeroTitle headlineId="wealth-heading" headline={copy.title} {...heroTypewriter}
                  headlineClassName={styles.title} taglineClassName={styles.heroStrapline} />
              </div>
              <div className={styles.chartCard}>{summary}{fund}{consent}</div>
            </>
          ) : (
            <>{title}{summary}{fund}{consent}</>
          )}
        </div>
      </div>
    </section>
  );
};
