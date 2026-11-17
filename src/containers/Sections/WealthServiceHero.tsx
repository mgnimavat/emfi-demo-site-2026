'use client';

import { useId, useState } from 'react';
import { Info } from 'lucide-react';
import { fundChart, fundIllustrationPoints } from '@/content/fund-illustration';
import type { WealthCopy } from '@/lib/i18n/service-dictionaries';
import styles from './WealthServiceHero.module.css';

const rangeStarts = [0.8, 0.38, 0] as const;
const gridLineCount = 4;
const gridLines = Array.from({ length: gridLineCount }, (_, index) =>
  fundChart.inset + index * (fundChart.height - fundChart.inset * 2) / (gridLineCount - 1)
);

export const WealthServiceHero = ({ copy }: { copy: WealthCopy['redesign']['hero'] }) => {
  const [range, setRange] = useState(2);
  const chartId = useId();
  const gradientId = `${chartId}-fill`;
  const clipId = `${chartId}-reveal`;
  const points = fundIllustrationPoints.slice(Math.floor(fundIllustrationPoints.length * rangeStarts[range]));
  const minimum = Math.min(...points);
  const spread = Math.max(...points) - minimum || 1;
  const coordinates = points.map((point, index) => ({
    x: fundChart.inset + index / (points.length - 1) * (fundChart.width - fundChart.inset * 2),
    y: fundChart.inset + (1 - (point - minimum) / spread) * (fundChart.height - fundChart.inset * 2),
  }));
  const path = coordinates.map(({ x, y }, index) =>
    `${index ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`
  ).join(' ');
  const endpoint = coordinates[coordinates.length - 1];

  return (
    <section className={styles.section} aria-labelledby="wealth-fund-heading">
      <div className={styles.container}>
        <figure className={styles.fund}>
          <header className={styles.header}>
            <div className={styles.heading}>
              <p className={styles.eyebrow}>{copy.titleLines.join(' ')}</p>
              <h1 id="wealth-fund-heading" className={styles.fundTitle}>{copy.fundName}</h1>
            </div>
            <div className={styles.ranges} role="group" aria-label={copy.fundName}>
              {copy.ranges.map((label, index) => (
                <button key={label} type="button" aria-pressed={range === index}
                  onClick={() => setRange(index)}>{label}</button>
              ))}
            </div>
          </header>
          <div className={styles.meta}>
            <span className={styles.series}><span className={styles.swatch} aria-hidden="true" />{copy.chartSeries}</span>
            <span className={styles.badge}><Info size={13} aria-hidden="true" />{copy.chartBadge}</span>
          </div>
          <div className={styles.plot}>
            <svg viewBox={`0 0 ${fundChart.width} ${fundChart.height}`} preserveAspectRatio="none"
              role="img" aria-labelledby={`${chartId}-title`}>
              <title id={`${chartId}-title`}>{copy.fundName}. {copy.ranges[range]}. {copy.illustration}</title>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-blue-200)" stopOpacity="0.24" />
                  <stop offset="100%" stopColor="var(--color-blue-25)" stopOpacity="0.02" />
                </linearGradient>
                <clipPath id={clipId}>
                  <rect key={range} width={fundChart.width} height={fundChart.height} className={styles.revealMask} />
                </clipPath>
              </defs>
              {gridLines.map((y) => (
                <line key={y} x1={fundChart.inset} y1={y}
                  x2={fundChart.width - fundChart.inset} y2={y} className={styles.gridLine} />
              ))}
              <g clipPath={`url(#${clipId})`}>
                <path d={`${path} L${fundChart.width - fundChart.inset} ${fundChart.height - fundChart.inset} L${fundChart.inset} ${fundChart.height - fundChart.inset} Z`}
                  fill={`url(#${gradientId})`} />
                <path d={path} className={styles.line} />
                <path d={`M${endpoint.x} ${endpoint.y} l0.01 0`} className={styles.endpointHalo} />
                <path d={`M${endpoint.x} ${endpoint.y} l0.01 0`} className={styles.endpoint} />
              </g>
            </svg>
          </div>
          <div className={styles.axis} aria-hidden="true"><span>{copy.axisStart}</span><span>{copy.axisEnd}</span></div>
        </figure>
      </div>
    </section>
  );
};
