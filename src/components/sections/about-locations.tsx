import { Mail, MapPin, Phone } from "lucide-react";
import { contact } from "@/content/contact";
import styles from "./about-locations.module.css";

const offices = contact.locations.filter(location => location.kind === "office");

export function AboutLocations() {
  return <section className={styles.section} aria-labelledby="locations-heading">
    <div className={styles.inner}>
      <header className={styles.heading}>
        <p className={styles.eyebrow}>Our locations</p>
        <h2 id="locations-heading">London &amp; Dubai.</h2>
      </header>
      <div className={styles.offices}>
        {offices.map(office => {
          const isLondon = office.city === "London";
          const query = isLondon ? "25-26 Dering Street, Mayfair, London W1S 1AW" : "Innovation One, DIFC, Dubai, United Arab Emirates";
          return <article key={office.city} className={styles.card} aria-labelledby={`office-${office.city.toLowerCase()}`}>
            <div className={styles.details}>
              <p className={styles.country}><MapPin size={14} aria-hidden="true" />{isLondon ? "United Kingdom" : "United Arab Emirates"}</p>
              <h3 id={`office-${office.city.toLowerCase()}`}>{office.city}</h3>
              <p className={styles.entity}>{isLondon ? "EMFI Group Limited" : office.entity}</p>
              <div className={styles.info}>
                <address>
                  {office.lines.map(line => <span key={line}>{line}</span>)}
                </address>
                <div className={styles.contacts}>
                  <a href={`mailto:${office.email}`}><Mail size={15} aria-hidden="true" />{office.email}</a>
                  {isLondon ? <a href="tel:+442039833634"><Phone size={15} aria-hidden="true" />+44 20 3983 3634</a> : null}
                </div>
              </div>
            </div>
            <div className={styles.mapFrame}>
              <iframe
                className={styles.map}
                title={`${office.city} office street map`}
                src={`https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=16&output=embed`}
                width="900"
                height="400"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </article>;
        })}
      </div>
    </div>
  </section>;
}
