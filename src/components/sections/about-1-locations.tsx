import { Mail, MapPin, Phone } from "lucide-react";
import { dictionaries, type CommonCopy } from "@/lib/i18n";
import styles from "./about-1-locations.module.css";

const MAP_ZOOM = 16;

type Place = CommonCopy["locations"]["places"][number];

export const LocationMap = ({ place, copy }: { place: Place; copy: CommonCopy }) => (
  <div className={styles.mapFrame}>
    <iframe
      className={styles.map}
      title={`${copy.map} ${place.city}`}
      src={`https://maps.google.com/maps?ll=${encodeURIComponent(place.mapQuery)}&z=${MAP_ZOOM}&output=embed`}
      loading="eager"
      referrerPolicy="no-referrer-when-downgrade"
      tabIndex={-1}
    />
    <span className={styles.pin} aria-hidden="true">
      <svg viewBox="0 0 32 42">
        <path fill="currentColor" d="M16 0C7.16 0 0 7.16 0 16c0 10.6 16 26 16 26s16-15.4 16-26C32 7.16 24.84 0 16 0z" />
        <circle cx="16" cy="16" r="5.5" fill="#fff" />
      </svg>
    </span>
  </div>
);

export const About1Locations = ({ copy = dictionaries.en.common }: { copy?: CommonCopy }) => (
  <section className={styles.section} aria-labelledby="locations-heading">
    <div className={styles.inner}>
      <header className={styles.heading}>
        <h2 id="locations-heading">{copy.locations.title}</h2>
      </header>
      <div className={styles.columns}>
        {copy.locations.places.map(place => (
          <article key={place.city} className={styles.column}>
            <LocationMap place={place} copy={copy} />
            <div className={styles.body}>
              <div className={styles.details}>
                <h3>{place.city}</h3>
                <p className={styles.kicker}>{place.kicker.map(line => <span key={line}>{line}</span>)}</p>
                <span className={styles.address}>
                  <span className={styles.addressIcon}><MapPin size={16} aria-hidden="true" /></span>
                  <address>{place.lines.map(line => <span key={line}>{line}</span>)}</address>
                </span>
              </div>
              <div className={styles.contacts}>
                <a href={`mailto:${place.email}`}>
                  <span className={styles.addressIcon}><Mail size={16} aria-hidden="true" /></span>
                  <span dir="ltr">{place.email}</span>
                </a>
                {"phone" in place ? <a href={`tel:${String(place.phone).replace(/\s/g, "")}`}>
                  <span className={styles.addressIcon}><Phone size={16} aria-hidden="true" /></span>
                  <span dir="ltr">{String(place.phone)}</span>
                </a> : null}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);
