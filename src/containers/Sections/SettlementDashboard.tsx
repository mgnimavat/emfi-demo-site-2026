'use client';

import type { ReactNode } from 'react';
import { useServiceLocale } from "@/ui/hooks/useServiceLocale";
import { settlementDashboard, type DashboardSeries } from '@/content/settlement-dashboard';
import { maskWorkstationValue } from '@/content/workstation-preview';
import { MaskedWorkstationValue, WorkstationPrivacyProvider } from './WorkstationPrivacy';
import windowStyles from '@/components/sections/execution/execution-chart.module.css';
import styles from './SettlementDashboard.module.css';

const chart = {
  width: 440,
  height: 280,
  top: 12,
  bottom: 244,
  right: 420,
  verticalLeft: 64,
  horizontalLeft: 84,
  barWidthRatio: 0.48,
  horizontalBarHeight: 32,
  horizontalBarRatio: 0.6,
  labelOffset: 10,
  donut: { centerX: 220, centerY: 226, radius: 160, weight: 68 },
} as const;

const MaskedChartText = ({
  value,
  x,
  y,
  anchor = 'end',
  starCount,
}: {
  value: string;
  x: number;
  y: number;
  anchor?: 'start' | 'middle' | 'end';
  starCount?: number;
}) => (
  <text x={x} y={y} textAnchor={anchor} data-workstation-mask="initial-stars">
    {maskWorkstationValue(value, starCount)}
  </text>
);

const DashboardCard = ({
  title,
  total,
  starCount,
  children,
}: {
  title: string;
  total: string;
  starCount?: number;
  children: ReactNode;
}) => (
  <article className={styles.card} aria-label={`${title} — masked demonstration`}>
    <header className={`${windowStyles.header} ${styles.cardHeader}`}>
      <h4>{title}</h4>
      <strong><MaskedWorkstationValue value={total} starCount={starCount} /></strong>
    </header>
    <div className={styles.chartBody}><div className={styles.chartContent}>{children}</div></div>
  </article>
);

const VerticalChart = ({ series }: { series: DashboardSeries }) => {
  const { t } = useServiceLocale();
  const plotHeight = chart.bottom - chart.top;
  const slot = (chart.right - chart.verticalLeft) / series.bars.length;

  return (
    <svg viewBox={`0 0 ${chart.width} ${chart.height}`} className={styles.chart} aria-hidden="true">
      {series.ticks.map((tick) => {
        const y = chart.bottom - tick / series.maximum * plotHeight;
        return (
          <g key={tick}>
            <line x1={chart.verticalLeft} y1={y} x2={chart.right} y2={y} className={styles.gridLine} />
            <MaskedChartText value={String(tick)} starCount={series.maskLength} x={chart.verticalLeft - chart.labelOffset} y={y + 3} />
          </g>
        );
      })}
      {series.bars.map((bar, index) => {
        const height = bar.value / series.maximum * plotHeight;
        const center = chart.verticalLeft + slot * (index + 0.5);
        return (
          <g key={bar.label}>
            <rect
              x={center - slot * chart.barWidthRatio / 2}
              y={chart.bottom - height}
              width={slot * chart.barWidthRatio}
              height={height}
              rx="2"
              data-tone={bar.tone}
            />
            {series.maskLabels ? (
              <MaskedChartText value={bar.label} starCount={series.maskLength} x={center} y={chart.bottom + chart.labelOffset + 6} anchor="middle" />
            ) : <text x={center} y={chart.bottom + chart.labelOffset + 6} textAnchor="middle">
              {t(bar.label).split(' ').map((word, wordIndex) => (
                <tspan key={`${bar.label}-${word}`} x={center} dy={wordIndex === 0 ? 0 : chart.labelOffset}>
                  {word}
                </tspan>
              ))}
            </text>}
          </g>
        );
      })}
    </svg>
  );
};

const HorizontalChart = ({ series }: { series: DashboardSeries }) => {
  const plotWidth = chart.right - chart.horizontalLeft;
  const slot = (chart.bottom - chart.top) / series.bars.length;
  const barHeight = series.barHeight ?? Math.min(chart.horizontalBarHeight, slot * chart.horizontalBarRatio);

  return (
    <svg viewBox={`0 0 ${chart.width} ${chart.height}`} className={styles.chart} aria-hidden="true">
      {series.ticks.map((tick, index) => {
        const x = chart.horizontalLeft + tick / series.maximum * plotWidth;
        return (
          <g key={tick}>
            <line x1={x} y1={chart.top} x2={x} y2={chart.bottom} className={styles.gridLine} />
            <MaskedChartText value={String(tick)} starCount={series.maskLength} x={x} y={chart.bottom + chart.labelOffset + 6} anchor={index === series.ticks.length - 1 ? 'end' : 'middle'} />
          </g>
        );
      })}
      {series.bars.map((bar, index) => {
        const center = chart.top + slot * (index + 0.5);
        return (
          <g key={bar.label}>
            <MaskedChartText value={bar.label} starCount={series.maskLength} x={chart.horizontalLeft - chart.labelOffset} y={center + 3} />
            <rect
              x={chart.horizontalLeft}
              y={center - barHeight / 2}
              width={bar.value / series.maximum * plotWidth}
              height={barHeight}
              rx="2"
              data-tone={bar.tone}
            />
          </g>
        );
      })}
    </svg>
  );
};

const BalanceChart = () => {
  const { t } = useServiceLocale();
  const { centerX, centerY, radius, weight } = chart.donut;

  return (
    <>
      <svg viewBox={`0 0 ${chart.width} ${chart.height}`} className={styles.chart} aria-hidden="true">
        {settlementDashboard.balances.currencies.map((currency, index) => {
          const start = settlementDashboard.balances.currencies
            .slice(0, index).reduce((total, item) => total + item.share, 0);
          return (
            <path
              key={currency.label}
              d={`M ${centerX - radius} ${centerY} A ${radius} ${radius} 0 0 1 ${centerX + radius} ${centerY}`}
              fill="none"
              pathLength="100"
              strokeWidth={weight}
              strokeDasharray={`${currency.share - 0.3} 100`}
              strokeDashoffset={-start}
              data-tone={currency.tone}
              className={styles.donutSegment}
            />
          );
        })}
      </svg>
      <ul className={styles.legend} aria-label={t("Balance currencies")}>
        {settlementDashboard.balances.currencies.map((currency) => (
          <li key={currency.label}>
            <span className={styles.swatch} data-tone={currency.tone} aria-hidden="true" />
            <MaskedWorkstationValue value={currency.label} starCount={settlementDashboard.balances.maskLength} />
          </li>
        ))}
      </ul>
    </>
  );
};

export const SettlementDashboard = () => {
  const { t } = useServiceLocale();
  return (
  <div
    className={styles.viewport}
    role="region"
    aria-label={t("Illustrative portfolio dashboard")}
    tabIndex={0}
  >
    <WorkstationPrivacyProvider variant="initial-stars">
      <div className={styles.preview}>
        <DashboardCard title={t(settlementDashboard.balances.title)} total={settlementDashboard.balances.total} starCount={settlementDashboard.balances.maskLength}>
          <BalanceChart />
        </DashboardCard>
        <DashboardCard title={t(settlementDashboard.transactions.title)} total={settlementDashboard.transactions.total} starCount={settlementDashboard.transactions.maskLength}>
          <VerticalChart series={settlementDashboard.transactions} />
        </DashboardCard>
        <DashboardCard title={t(settlementDashboard.exposure.title)} total={settlementDashboard.exposure.total}>
          <HorizontalChart series={settlementDashboard.exposure} />
        </DashboardCard>
        <DashboardCard title={t(settlementDashboard.positions.title)} total={settlementDashboard.positions.total} starCount={settlementDashboard.positions.maskLength}>
          <HorizontalChart series={settlementDashboard.positions} />
        </DashboardCard>
        <DashboardCard title={t(settlementDashboard.charges.title)} total={settlementDashboard.charges.total} starCount={settlementDashboard.charges.maskLength}>
          <VerticalChart series={settlementDashboard.charges} />
        </DashboardCard>
        <DashboardCard title={t(settlementDashboard.performance.title)} total={settlementDashboard.performance.total}>
          <HorizontalChart series={settlementDashboard.performance} />
        </DashboardCard>
      </div>
    </WorkstationPrivacyProvider>
  </div>
);
};
