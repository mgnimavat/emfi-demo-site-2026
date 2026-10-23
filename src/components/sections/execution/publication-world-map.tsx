"use client";

import { useId, useState } from "react";
import type { ExecutionResearchChart } from "@/content/execution";
import outlines from "@/content/world-map-paths.json";
import { countryChangeColor, mapCountryKey } from "@/lib/intelligence-map";
import styles from "./research-publications.module.css";

// The existing outlines use an equirectangular 600 × 290 viewBox.
// Small territories absent from those outlines are represented at their coordinates.
const markers = [{ name: "Aruba", longitude: -69.9683, latitude: 12.5211 }];
const percent = (value: number) => `${value > 0 ? "+" : ""}${value.toFixed(2)}%`;

export function PublicationWorldMap({ chart }: { chart: ExecutionResearchChart }) {
  const id = useId();
  const [active, setActive] = useState<string | null>(null);
  const countries = new Map((chart.countries ?? []).map(country => [mapCountryKey(country.name), country]));
  const max = Math.max(...(chart.countries ?? []).map(country => Math.abs(country.value)), .01);
  const selected = active ? countries.get(mapCountryKey(active)) : undefined;
  const label = (name: string) => {
    const country = countries.get(mapCountryKey(name));
    return `${country?.name ?? name}: ${country ? percent(country.value) : "no data available"}`;
  };

  return <figure className={styles.chart} data-publication-country-chart>
    <figcaption>{chart.title}</figcaption>
    <svg viewBox="0 0 600 290" role="group" aria-labelledby={`${id}-title ${id}-description`} className={styles.worldMap} data-publication-world-map onPointerLeave={() => setActive(null)}>
      <title id={`${id}-title`}>World map of country daily changes</title>
      <desc id={`${id}-description`}>Green indicates a positive change and red a negative change. Grey countries have no data. Hover, tap, or focus a country to view its percentage change.</desc>
      {outlines.map(country => {
        const data = countries.get(mapCountryKey(country.name));
        return <path key={country.name} d={country.path} fill={countryChangeColor(data?.value, max)} fillRule="evenodd" vectorEffect="non-scaling-stroke"
          data-country={country.name} data-country-value={data?.value} data-active={active === country.name || undefined}
          role="img" aria-label={label(country.name)} tabIndex={data ? 0 : undefined}
          onPointerEnter={() => setActive(country.name)} onClick={() => setActive(country.name)} onFocus={() => setActive(country.name)} onBlur={() => setActive(null)}>
          <title>{label(country.name)}</title>
        </path>;
      })}
      {markers.map(country => {
        const data = countries.get(mapCountryKey(country.name));
        return data ? <circle key={country.name} cx={(country.longitude + 180) / 360 * 600} cy={(90 - country.latitude) / 180 * 290} r="2" fill={countryChangeColor(data.value, max)} vectorEffect="non-scaling-stroke"
          data-country={country.name} data-country-value={data.value} data-active={active === country.name || undefined}
          role="img" aria-label={label(country.name)} tabIndex={0}
          onPointerEnter={() => setActive(country.name)} onClick={() => setActive(country.name)} onFocus={() => setActive(country.name)} onBlur={() => setActive(null)}><title>{label(country.name)}</title></circle> : null;
      })}
    </svg>
    <p className={styles.mapDetail} aria-live="polite">{active ? <><strong>{selected?.name ?? active}</strong><span>{selected ? percent(selected.value) : "No data available"}</span></> : "Hover or select a country to view its daily change."}</p>
    <div className={styles.mapLegend} aria-label={`Daily change scale from ${percent(-max)} to ${percent(max)}. Grey indicates no data.`}>
      <div className={styles.mapScale}><span className={styles.mapScaleGradient} /><div><span>{percent(-max)}</span><span>0%</span><span>{percent(max)}</span></div></div>
      <span className={styles.mapNoData}>No data</span>
    </div>
  </figure>;
}
