"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import { ArrowUpRight, ChevronDown, Mail, MapPin, Phone } from "lucide-react";
import { contact } from "@/content/contact";
import { about1Locations } from "@/content/about-1-locations";
import styles from "./about-1-locations.module.css";

const locations = about1Locations.entities.flatMap(entity => contact.locations
  .filter(office => office.city === entity.city)
  .map(office => ({ ...office, ...entity })));
const subscribeToHydration = () => () => {};
const clientHydrated = () => true;
const serverHydrated = () => false;

export const About1Locations = () => {
  const hydrated = useSyncExternalStore(subscribeToHydration, clientHydrated, serverHydrated);
  const [selectedCity, setSelectedCity] = useState(locations[0].city);
  const [visitedCities, setVisitedCities] = useState<string[]>([locations[0].city]);
  const [loadedCities, setLoadedCities] = useState<string[]>([]);
  const [preloadMaps, setPreloadMaps] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const office = locations.find(location => location.city === selectedCity) ?? locations[0];
  const isEnquiry = office.kind === "enquiry";
  const city = isEnquiry ? "Cayman" : office.city;
  const handleMapLoad = (city: string) => {
    setLoadedCities(previous => previous.includes(city) ? previous : [...previous, city]);
    setPreloadMaps(true);
  };
  const selectLocation = (city: typeof selectedCity) => {
    setVisitedCities(previous => previous.includes(city) ? previous : [...previous, city]);
    setSelectedCity(city);
    if (window.matchMedia("(max-width: 759px)").matches) {
      requestAnimationFrame(() => panelRef.current?.scrollIntoView({ block: "start", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" }));
    }
  };

  return <section className={styles.section} aria-labelledby="locations-heading">
    <div className={styles.inner}>
      <header className={styles.heading}>
        <h2 id="locations-heading">{about1Locations.title}</h2>
      </header>
      <div className={styles.workspace}>
        <div className={styles.entityList} aria-label="EMFI entities">
          {locations.map(entity => <div key={entity.city} className={styles.entityRow} data-active={entity.city === selectedCity}>
            <button type="button" className={styles.entitySelector} aria-label={`Show ${entity.city === "Cayman Islands" ? "Cayman" : entity.city} on map`} aria-pressed={entity.city === selectedCity} aria-controls="entity-location-panel" onClick={() => selectLocation(entity.city)}>
              <span className={styles.rowMeta}>{entity.label}</span>
              <span className={styles.rowCity}>{entity.city === "Cayman Islands" ? "Cayman" : entity.city}</span>
            </button>
            <div className={styles.entityAction} aria-hidden={entity.city !== selectedCity} inert={entity.city !== selectedCity}>
              <span className={styles.selectionToggle} aria-hidden="true"><ChevronDown size={16} /></span>
              {entity.href ? <a className={styles.entityLink} href={entity.href} aria-label={`${entity.label} (opens in a new tab)`} target="_blank" rel="noopener noreferrer"><span className={styles.fullCta}>{entity.label}</span><span className={styles.compactCta}>{entity.label}</span><ArrowUpRight size={15} aria-hidden="true" /></a> : <button type="button" className={styles.entityLink} aria-label={entity.label} disabled><span className={styles.fullCta}>{entity.label}</span><span className={styles.compactCta}>{entity.label}</span><ArrowUpRight size={15} aria-hidden="true" /></button>}
            </div>
          </div>)}
        </div>
        <div ref={panelRef} id="entity-location-panel" className={styles.mapPanel} role="region" aria-label={`${office.label} — ${city}`}>
          <div className={styles.mapFrame}>
            {locations.filter(location => hydrated && (preloadMaps || visitedCities.includes(location.city))).map(location => {
              const active = location.city === selectedCity;
              return <iframe
                key={location.city}
                id={`location-${location.city.toLowerCase().replace(/\s+/g, "-")}-map`}
                className={styles.map}
                data-active={active}
                title={location.kind === "enquiry" ? `${location.city} regional map` : `${location.city} office street map`}
                src={`https://maps.google.com/maps?q=${encodeURIComponent(location.mapCenter)}&ll=${location.mapCenter}&z=${location.mapZoom}&output=embed`}
                width="900"
                height="400"
                loading={active ? "lazy" : "eager"}
                tabIndex={active ? 0 : -1}
                aria-hidden={!active}
                inert={!active}
                referrerPolicy="no-referrer-when-downgrade"
                onLoad={() => handleMapLoad(location.city)}
                allowFullScreen
              />;
            })}
            {!loadedCities.includes(selectedCity) ? <div className={styles.mapLoading} role="status" aria-label={`Loading ${city} map`}>Loading map…</div> : null}
          </div>
          <div className={styles.locationDetails}>
            <div className={styles.locationHeading}>
              <h3 aria-live="polite">{office.legalName}</h3>
            </div>
            <div className={styles.locationBody}>
              <div className={styles.address}>
                <span className={styles.addressIcon}><MapPin size={16} aria-hidden="true" /></span>
                {isEnquiry ? <p className={styles.enquiryNote}>{office.enquiryLines.map(line => <span key={line}>{line}{" "}</span>)}</p> : <address>{office.lines.map(line => <span key={line}>{line}</span>)}</address>}
              </div>
              <div className={styles.contacts}>
                <a href={`mailto:${office.email}`}><Mail size={15} aria-hidden="true" />{office.email}</a>
                {office.city === "London" ? <a href="tel:+442039833634"><Phone size={15} aria-hidden="true" />+44 20 3983 3634</a> : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>;
};
