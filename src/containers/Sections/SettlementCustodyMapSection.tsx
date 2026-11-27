'use client';

import { useId, useState, type PointerEvent } from 'react';
import { ArrowDown } from 'lucide-react';
import countryOutlines from '@/content/world-map-paths.json';
import type { SettlementCopy } from '@/lib/i18n/service-dictionaries';
import { useServiceLocale } from '@/ui/hooks/useServiceLocale';
import styles from './SettlementCustodyMapSection.module.css';

const projection = { width: 600, height: 290 };
const world = { x: -8, y: 0, width: 616, height: 250 };

const project = (longitude: number, latitude: number) => ({
  x: ((longitude + 180) / 360) * projection.width,
  y: ((90 - latitude) / 180) * projection.height,
});

const gridLines = (step: number) => [
  ...Array.from({ length: 360 / step + 1 }, (_, index) => {
    const { x } = project(index * step - 180, 0);
    return `M${x},0V${projection.height}`;
  }),
  ...Array.from({ length: 180 / step + 1 }, (_, index) => {
    const { y } = project(0, index * step - 90);
    return `M0,${y}H${projection.width}`;
  }),
].join(' ');

const worldGrid = gridLines(30);
const countryPaths = new Map(countryOutlines.map(({ name, path }) => [name, path]));
const countries = [
  { id: 'AR', country: 'Argentina', point: project(-64, -35) },
  { id: 'AU', country: 'Australia', point: project(134, -25) },
  { id: 'BH', country: 'Bahrain', point: { x: 383.35, y: 105.35 } },
  { id: 'BR', country: 'Brazil', point: project(-52, -12) },
  { id: 'CL', country: 'Chile', point: project(-71, -34) },
  { id: 'CO', country: 'Colombia', point: project(-74, 4) },
  { id: 'CR', country: 'Costa Rica', point: project(-84, 10) },
  { id: 'DK', country: 'Denmark', point: project(10, 56) },
  { id: 'DE', country: 'Germany', point: project(10, 51) },
  { id: 'GR', country: 'Greece', point: project(22, 39) },
  { id: 'HK', country: 'Hong Kong', point: project(114.17, 22.31) },
  { id: 'IL', country: 'Israel', point: project(35, 31) },
  { id: 'IT', country: 'Italy', point: project(12, 43) },
  { id: 'JP', country: 'Japan', point: project(138, 36) },
  { id: 'KZ', country: 'Kazakhstan', point: project(67, 48) },
  { id: 'KW', country: 'Kuwait', point: { x: 378.5, y: 100 } },
  { id: 'MX', country: 'Mexico', point: project(-102, 24) },
  { id: 'NL', country: 'Netherlands', point: project(5.4, 52.2) },
  { id: 'NO', country: 'Norway', point: project(10, 62) },
  { id: 'OM', country: 'Oman', point: project(57, 21) },
  { id: 'PA', country: 'Panama', point: project(-80, 8.7) },
  { id: 'PE', country: 'Peru', point: project(-75, -10) },
  { id: 'PL', country: 'Poland', point: project(19, 52) },
  { id: 'QA', country: 'Qatar', point: { x: 384.5, y: 106.4 } },
  { id: 'SA', country: 'Saudi Arabia', point: project(45, 24) },
  { id: 'ZA', country: 'South Africa', point: project(25, -29) },
  { id: 'ES', country: 'Spain', point: project(-4, 40) },
  { id: 'CH', country: 'Switzerland', point: project(8.2, 46.8) },
  { id: 'TR', country: 'Turkey', point: project(35, 39) },
  { id: 'GB', country: 'United Kingdom', point: project(-3, 54) },
  { id: 'UY', country: 'Uruguay', point: project(-56, -33) },
  { id: 'US', country: 'United States', point: project(-99, 39) },
] as const;

const exchanges = [
  { id: 'ADX', point: project(54.38, 24.45), offset: { x: 9, y: 8 } },
  { id: 'DFM', point: project(55.27, 25.20), offset: { x: 8, y: -4 } },
] as const;

const countryPinOffsets: Partial<Record<CountryMarket['id'], MapPoint>> = {
  BH: { x: -2, y: -9 },
  HK: { x: 0, y: 0 },
  KW: { x: -5, y: -3 },
  QA: { x: -4, y: 5 },
};
const settlementSystems = ['Clearstream', 'Euroclear'] as const;

type CustodyMapCopy = SettlementCopy['custodyMap'];
type CountryMarket = (typeof countries)[number];
type MapPoint = ReturnType<typeof project>;
type MarketLabel = { name: string; point: MapPoint };

export const SettlementCustodyMapSection = ({ title, copy, cueLabel }: {
  title: string;
  copy: CustodyMapCopy;
  cueLabel: string;
}) => {
  const { locale } = useServiceLocale();
  const countryNames = new Intl.DisplayNames(locale, { type: 'region' });
  const [hoveredMarket, setHoveredMarket] = useState<MarketLabel | null>(null);
  const [focusedMarket, setFocusedMarket] = useState<MarketLabel | null>(null);
  const visibleMarket = hoveredMarket ?? focusedMarket;
  const id = useId();
  const landFillId = `${id}-land-fill`;

  const countryLabel = ({ id, country }: CountryMarket) => {
    if (id === 'HK') return copy.hongKong;
    return locale === 'en' ? country : countryNames.of(id) ?? country;
  };

  const marketEvents = (name: string, point: MapPoint) => ({
    role: 'img',
    tabIndex: 0,
    'aria-label': name,
    onPointerEnter: (event: PointerEvent<SVGElement>) => {
      if (event.pointerType !== 'touch') setHoveredMarket({ name, point });
    },
    onPointerLeave: () => setHoveredMarket(null),
    onFocus: () => setFocusedMarket({ name, point }),
    onBlur: () => setFocusedMarket(null),
    onClick: () => setFocusedMarket({ name, point }),
  });

  const renderPin = (key: string, name: string, point: MapPoint, offset: MapPoint) => {
    const pin = { x: point.x + offset.x, y: point.y + offset.y };
    return (
      <g key={key} className={styles.pin} {...marketEvents(name, pin)}>
        <line x1={point.x} y1={point.y} x2={pin.x} y2={pin.y} vectorEffect="non-scaling-stroke" />
        <circle cx={pin.x} cy={pin.y} r={3} vectorEffect="non-scaling-stroke" />
      </g>
    );
  };

  return (
    <section id="custody-coverage" className={styles.section} aria-labelledby="custody-coverage-heading">
      <div className={styles.layout}>
        <h1 id="custody-coverage-heading" className={styles.title}>{title}</h1>

        <div className={styles.map}>
          <svg
            className={styles.atlas}
            viewBox={`${world.x} ${world.y} ${world.width} ${world.height}`}
            role="group"
            aria-label={copy.marketSelection}
          >
            <defs>
              <linearGradient id={landFillId} x1="80" x2="460" y1="20" y2="235" gradientUnits="userSpaceOnUse">
                <stop stopColor="var(--land-north)" />
                <stop offset=".55" stopColor="var(--land-middle)" />
                <stop offset="1" stopColor="var(--land-south)" />
              </linearGradient>
            </defs>
            <path className={styles.graticule} d={worldGrid} aria-hidden="true" />
            <g className={styles.land} fill={`url(#${landFillId})`} fillRule="evenodd" aria-hidden="true">
              {countryOutlines.map(({ name, path }) => (
                <path key={name} d={path} vectorEffect="non-scaling-stroke" />
              ))}
            </g>
            <path d={countryPaths.get('United Arab Emirates')} className={styles.highlight}
              aria-hidden="true" fillRule="evenodd" vectorEffect="non-scaling-stroke" />
            {countries.map((option) => {
              const path = countryPaths.get(option.country);
              if (!path) return null;
              return (
                <path
                  key={option.id}
                  d={path}
                  className={styles.highlight}
                  fillRule="evenodd"
                  vectorEffect="non-scaling-stroke"
                  {...(countryPinOffsets[option.id] ? { 'aria-hidden': true } : marketEvents(countryLabel(option), option.point))}
                />
              );
            })}
            {countries.map((option) => {
              const offset = countryPinOffsets[option.id];
              return offset && renderPin(option.id, countryLabel(option), option.point, offset);
            })}
            {exchanges.map(({ id, point, offset }) => renderPin(id, copy.exchanges[id], point, offset))}
          </svg>
          {visibleMarket && (
            <span
              className={styles.mapLabel}
              style={{
                left: `${((visibleMarket.point.x - world.x) / world.width) * 100}%`,
                top: `${((visibleMarket.point.y - world.y) / world.height) * 100}%`,
              }}
              aria-hidden="true"
            >
              {visibleMarket.name}
            </span>
          )}
        </div>
        <div className={styles.legend}>
          <div className={styles.legendGroup}>
            <span id={`${id}-exchange-label`} className={styles.legendLabel}>{copy.exchangeLabel}</span>
            <ul aria-labelledby={`${id}-exchange-label`}>
              {exchanges.map(({ id }) => <li key={id}>{copy.exchanges[id]}</li>)}
            </ul>
          </div>
          <div className={styles.legendGroup}>
            <span id={`${id}-systems-label`} className={styles.legendLabel}>{copy.systemsLabel}</span>
            <ul aria-labelledby={`${id}-systems-label`}>
              {settlementSystems.map((system) => <li key={system}>{system}</li>)}
            </ul>
          </div>
        </div>
        <footer className={styles.caption}>
          <p className={styles.description}>{copy.description}</p>
          <a className={styles.cue} href="#settlement">
            {cueLabel}
            <ArrowDown size={16} aria-hidden="true" />
          </a>
        </footer>
      </div>
    </section>
  );
};
