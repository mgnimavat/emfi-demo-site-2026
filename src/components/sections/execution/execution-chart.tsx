'use client';

import { useId, useMemo, useState } from 'react';
import { useServiceLocale } from '@/ui/hooks/useServiceLocale';
import { TimeSeriesPlot } from '@/ui/components/TimeSeriesPlot';
import type { ExecutionSecurity } from '@/content/execution-securities';
import { MaskedWorkstationValue } from '@/containers/Sections/WorkstationPrivacy';
import styles from './execution-chart.module.css';

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

const makeSeries = (security: ExecutionSecurity, range: Range) => {
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
  const ticks = Array.from({ length: Math.round((high - low) / step) + 1 }, (_, index) => low + step * index);
  return { points: data, ticks };
};

type ExecutionChartProps = {
  security: ExecutionSecurity;
  staticPreview?: boolean;
  controlsEnabled?: boolean;
};

export const ExecutionChart = ({ security, staticPreview = false, controlsEnabled = !staticPreview }: ExecutionChartProps) => {
  const { t } = useServiceLocale();
  const [range, setRange] = useState<Range>('1M');
  const { points, ticks } = useMemo(() => makeSeries(security, range), [security, range]);
  const plotId = `${useId()}-plot`;
  const demoChartDescription = t('Synthetic USD prices for a local demonstration, not historical or live market data.');
  const chartInstructions = t('Use Left and Right arrow keys to explore points, or Home and End to jump to the first and last point.');

  return (
    <figure className={styles.chart} aria-label={`${staticPreview ? 'Sample security' : security.symbol} demo price chart`}>
      <div className={styles.header}>
        <span className={styles.title}>
          <strong>{staticPreview ? <MaskedWorkstationValue value={security.symbol} /> : security.symbol}</strong>
        </span>
        <div className={styles.ranges} role="group" aria-label={t('Chart time range')}>
          {ranges.map((item) => (
            <button key={item.label} type="button" disabled={!controlsEnabled} aria-pressed={range === item.label}
              aria-controls={plotId} onClick={() => setRange(item.label)}>
              {item.label}
            </button>
          ))}
        </div>
      </div>
      <TimeSeriesPlot
        id={plotId}
        title={`${staticPreview ? 'Sample security' : security.name} · ${range} demo price chart`}
        description={controlsEnabled ? `${demoChartDescription} ${chartInstructions}` : demoChartDescription}
        state={{ kind: 'ready', points }}
        valueTicks={ticks}
        formatAxisDate={range === '1D' ? timeFormat.format : axisDate.format}
        formatTooltipDate={range === '1D' ? timeFormat.format : tooltipDate.format}
        formatAxisValue={priceFormat.format}
        formatTooltipValue={(value) => `${priceFormat.format(value)} USD`}
        controlsEnabled={controlsEnabled}
      />
      {!staticPreview && <figcaption>{t('Demo price chart · USD · Not live')}</figcaption>}
    </figure>
  );
};
