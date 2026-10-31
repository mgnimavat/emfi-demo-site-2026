import { Mail, MapPin, Phone } from "lucide-react";
import { about1Locations } from "@/content/about-1-locations";
import styles from "./about-1-locations.module.css";

const places = about1Locations.places;
const mapsUrl = (query: string) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

export const About1Locations = () => (
  <section className={styles.section} aria-labelledby="locations-heading">
    <div className={styles.inner}>
      <header className={styles.heading}>
        <h2 id="locations-heading">{about1Locations.title}</h2>
      </header>
      <div className={styles.columns}>
        {places.map(place => (
          <article key={place.city} className={styles.column}>
            <div className={styles.mapFrame}>
              <iframe
                className={styles.map}
                title={`${place.city} map`}
                src={`https://maps.google.com/maps?q=${encodeURIComponent(place.mapQuery)}&ll=${place.mapCenter}&z=16&output=embed`}
                loading="eager"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className={styles.body}>
              <a className={styles.detailsLink} href={mapsUrl(place.mapQuery)} target="_blank" rel="noopener noreferrer">
                <h3>{place.city}</h3>
                <p className={styles.kicker}>{place.kicker}</p>
                <span className={styles.address}>
                  <span className={styles.addressIcon}><MapPin size={16} aria-hidden="true" /></span>
                  <address>{place.lines.map(line => <span key={line}>{line}</span>)}</address>
                </span>
              </a>
              <div className={styles.contacts}>
                <a href={`mailto:${place.email}`}><Mail size={15} aria-hidden="true" />{place.email}</a>
                {"phone" in place ? <a href={`tel:${place.phone.replace(/\s/g, "")}`}><Phone size={15} aria-hidden="true" />{place.phone}</a> : null}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);
