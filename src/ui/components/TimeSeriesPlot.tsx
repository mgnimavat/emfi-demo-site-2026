'use client';

import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';
import styles from './TimeSeriesPlot.module.css';

type TimeSeriesPoint = { date: number; value: number };
type PlotPoint = TimeSeriesPoint & { x: number; y: number };

export type TimeSeriesPlotState =
  | { kind: 'ready' | 'preview'; points: readonly TimeSeriesPoint[] }
  | { kind: 'loading'; label: string }
  | { kind: 'unavailable'; content: ReactNode };

type TimeSeriesPlotProps = {
  id: string;
  title: string;
  description: string;
  state: TimeSeriesPlotState;
  valueTicks: readonly number[];
  minDateTickSpacing?: number;
  formatAxisDate: (date: number) => string;
  formatTooltipDate: (date: number) => string;
  formatAxisValue?: (value: number) => string;
  formatTooltipValue?: (value: number) => string;
  showNativeTooltip?: boolean;
  controlsEnabled?: boolean;
};

const initialSize = { width: 820, height: 380 };
const plotInsets = { left: 66, narrowLeft: 54, right: 24, top: 24, bottom: 42 };
const valueTooltip = { width: 160, height: 48 };
const dateTooltip = { width: 120, height: 32 };
const emptySeries: readonly TimeSeriesPoint[] = [];

const nearestPoint = (points: readonly PlotPoint[], x: number) => {
  let left = 0;
  let right = points.length - 1;
  while (right - left > 1) {
    const middle = Math.floor((left + right) / 2);
    if (points[middle].x > x) right = middle;
    else left = middle;
  }
  return x - points[left].x <= points[right].x - x ? left : right;
};

export const TimeSeriesPlot = ({
  id, title, description, state, valueTicks, formatAxisDate, formatTooltipDate,
  formatAxisValue, formatTooltipValue, minDateTickSpacing = 74, controlsEnabled = true,
  showNativeTooltip = true,
}: TimeSeriesPlotProps) => {
  const plotRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(initialSize);
  const [selection, setSelection] = useState<{ points: readonly TimeSeriesPoint[]; index: number } | null>(null);

  useEffect(() => {
    const element = plotRef.current;
    if (!element) return;

    const observer = new ResizeObserver(([entry]) => {
      const width = Math.round(entry.contentRect.width);
      const height = Math.round(entry.contentRect.height);
      if (width > 0 && height > 0) {
        setSize((current) => current.width === width && current.height === height ? current : { width, height });
      }
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const points = 'points' in state ? state.points : emptySeries;
  const first = points[0];
  const last = points[points.length - 1];
  const firstDate = first?.date ?? 0;
  const dateSpan = last ? last.date - firstDate : 0;
  const low = valueTicks[0];
  const high = valueTicks[valueTicks.length - 1];
  const valueAxisInset = size.width < 450 ? plotInsets.narrowLeft : plotInsets.left;
  const left = formatAxisValue ? valueAxisInset : plotInsets.right;
  const right = Math.max(left + 1, size.width - plotInsets.right);
  const top = plotInsets.top;
  const bottom = Math.max(top + 1, size.height - plotInsets.bottom);
  const plotWidth = right - left;
  const plotHeight = bottom - top;
  const y = (value: number) => bottom - plotHeight * (value - low) / (high - low);

  const series = useMemo(() => {
    if (dateSpan <= 0 || high <= low) return null;
    const coordinates = points.map(({ date, value }) => ({
      date,
      value,
      x: left + plotWidth * (date - firstDate) / dateSpan,
      y: bottom - plotHeight * (value - low) / (high - low),
    }));
    const line = coordinates.map(({ x, y }, index) => (
      `${index === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`
    )).join(' ');
    return { coordinates, line, endpoint: coordinates[coordinates.length - 1] };
  }, [points, firstDate, dateSpan, high, low, left, plotWidth, bottom, plotHeight]);

  const ready = state.kind === 'ready' && series !== null;
  const interactive = ready && controlsEnabled;
  const placeholders = state.kind === 'loading' || state.kind === 'preview';
  const activeIndex = selection?.points === points ? selection.index : null;
  const active = interactive && activeIndex !== null ? series.coordinates[activeIndex] : undefined;
  const lastIndex = points.length - 1;
  const axisIntervals = plotWidth >= 5 * minDateTickSpacing ? 5
    : plotWidth >= Math.max(240, 3 * minDateTickSpacing) ? 3 : 2;
  const dates = Array.from({ length: axisIntervals + 1 }, (_, index) => index / axisIntervals);
  const datePlaceholderWidth = Math.max(2, Math.min(42, plotWidth / dates.length - 6));

  const move = (event: PointerEvent<SVGSVGElement>) => {
    if (!series) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    if (!bounds.width) return;

    const x = (event.clientX - bounds.left) * size.width / bounds.width;
    const index = nearestPoint(series.coordinates, x);
    setSelection((current) => current?.points === points && current.index === index ? current : { points, index });
  };

  const navigate = (event: KeyboardEvent<SVGSVGElement>) => {
    switch (event.key) {
      case 'Escape':
        setSelection(null);
        break;
      case 'Home':
      case 'End':
        event.preventDefault();
        setSelection({ points, index: event.key === 'Home' ? 0 : lastIndex });
        break;
      case 'ArrowLeft':
      case 'ArrowRight': {
        event.preventDefault();
        const step = event.key === 'ArrowRight' ? 1 : -1;
        setSelection((current) => {
          const index = current?.points === points ? current.index : lastIndex;
          return { points, index: Math.max(0, Math.min(lastIndex, index + step)) };
        });
        break;
      }
    }
  };

  const tooltipSize = formatTooltipValue ? valueTooltip : dateTooltip;
  const tooltipWidth = Math.min(tooltipSize.width, plotWidth);
  const tooltipX = active ? Math.min(Math.max(active.x - tooltipWidth / 2, left), right - tooltipWidth) : left;
  const tooltipY = top + 4;
  const tooltipDate = active ? formatTooltipDate(active.date) : '';
  const tooltipValue = active ? formatTooltipValue?.(active.value) : undefined;

  return (
    <div ref={plotRef} className={styles.plot} data-chart-state={state.kind}>
      <svg
        id={id}
        className={styles.svg}
        viewBox={`0 0 ${size.width} ${size.height}`}
        role={ready ? 'img' : undefined}
        aria-hidden={!ready || undefined}
        aria-label={ready ? title : undefined}
        aria-describedby={ready ? `${id}-description` : undefined}
        tabIndex={interactive ? 0 : undefined}
        onPointerDown={interactive ? move : undefined}
        onPointerMove={interactive ? move : undefined}
        onPointerLeave={interactive ? (event) => { if (event.pointerType === 'mouse') setSelection(null); } : undefined}
        onFocus={interactive ? () => setSelection((current) => current?.points === points
          ? current : { points, index: lastIndex }) : undefined}
        onBlur={interactive ? () => setSelection(null) : undefined}
        onKeyDown={interactive ? navigate : undefined}
      >
        {ready && showNativeTooltip && <title>{title}</title>}
        {ready && <desc id={`${id}-description`}>{description}</desc>}
        <defs>
          <linearGradient id={`${id}-area`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" className={styles.areaStart} />
            <stop offset="100%" className={styles.areaEnd} />
          </linearGradient>
        </defs>
        <g aria-hidden="true">
          {valueTicks.map((tick) => (
            <g key={tick}>
              <line x1={left} x2={right} y1={y(tick)} y2={y(tick)} className={styles.gridLine} />
              {ready && formatAxisValue && (
                <text x={left - 12} y={y(tick)} dominantBaseline="middle" textAnchor="end">
                  {formatAxisValue(tick)}
                </text>
              )}
              {placeholders && formatAxisValue && (
                <rect x={left - 34} y={y(tick) - 3} width={22} height={6} rx={3} className={styles.skeletonTick} />
              )}
            </g>
          ))}
          {series && (
            <>
              {ready && (
                <line x1={left} x2={right} y1={series.endpoint.y} y2={series.endpoint.y} className={styles.latestGuide} />
              )}
              <path d={`${series.line} V${bottom} H${left} Z`} fill={`url(#${id}-area)`} />
              <path d={series.line} className={styles.line} data-price-line />
              {ready && <circle cx={right} cy={series.endpoint.y} r={4} className={styles.endpoint} />}
            </>
          )}
          <line x1={left} x2={right} y1={bottom} y2={bottom} className={styles.gridLine} />
          {dates.map((progress) => {
            const x = left + progress * plotWidth;
            return (
              <g key={progress}>
                <line x1={x} x2={x} y1={bottom} y2={bottom + 7} className={styles.gridLine} />
                {ready && (
                  <text x={x} y={bottom + 25} textAnchor={progress === 0 ? 'start' : progress === 1 ? 'end' : 'middle'}>
                    {formatAxisDate(firstDate + progress * dateSpan)}
                  </text>
                )}
                {placeholders && (
                  <rect x={Math.max(left, Math.min(x - datePlaceholderWidth / 2, right - datePlaceholderWidth))}
                    y={bottom + 18} width={datePlaceholderWidth} height={7} rx={3} className={styles.skeletonTick} />
                )}
              </g>
            );
          })}
          {active && (
            <g pointerEvents="none" data-chart-cursor>
              <line x1={active.x} x2={active.x} y1={top} y2={bottom} className={styles.cursorGuide} />
              <circle cx={active.x} cy={active.y} r={4} className={styles.cursorPoint} />
              <rect x={tooltipX} y={tooltipY} width={tooltipWidth} height={tooltipSize.height}
                rx={6} className={styles.tooltip} />
              <text x={tooltipX + 12} y={tooltipY + (formatTooltipValue ? 19 : 20)}
                className={formatTooltipValue ? undefined : styles.tooltipValue}>{tooltipDate}</text>
              {formatTooltipValue && (
                <text x={tooltipX + 12} y={tooltipY + 38} className={styles.tooltipValue}>{tooltipValue}</text>
              )}
            </g>
          )}
        </g>
      </svg>
      {state.kind === 'loading' && <span className={styles.loadingLabel} role="status">{state.label}</span>}
      {state.kind === 'unavailable' && state.content}
      {interactive && (
        <span className="sr-only" role="status">{tooltipValue ? `${tooltipDate}, ${tooltipValue}` : tooltipDate}</span>
      )}
    </div>
  );
};
