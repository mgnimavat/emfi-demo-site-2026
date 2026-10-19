"use client";

import { CurvedBand } from "@/components/layout/curved-band";
import Link from "next/link";
import { about } from "@/content/about";
import { useState } from "react";
import { contact } from "@/content/contact";
import { FadeIn } from "@/components/motion/fade-in";
import { useResearchEnquiry } from "@/lib/use-research-enquiry";
import styles from "@/components/sections/archive/theme.module.css";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const researchEnquiry = useResearchEnquiry();
  return (
    <div className={styles.page}>
      <CurvedBand nextBackground="#fff"><section className={styles.contact}>
        <div className={styles.container}>
          <div className={styles.contactGrid}>
            <FadeIn className={styles.contactIntro}>
              <h1>{contact.headline.split("\n").map((line) => <span key={line}>{line}</span>)}</h1>
              <p>{contact.body}</p>
              <nav aria-label="Contact locations" className={styles.locationNav}>
                {contact.locations.map((location) => <a key={location.city} href={`#contact-${location.city.toLowerCase().replaceAll(" ", "-")}`}>{location.city}</a>)}
              </nav>
            </FadeIn>
            <form className={styles.form} onSubmit={(event) => { event.preventDefault(); setSent(true); }}>
              <h2>{contact.formEyebrow}</h2>
              {researchEnquiry ? <div className={styles.success}><p className="text-sm">Research context</p><p className="mt-2 font-semibold">{researchEnquiry.record.title}</p></div> : null}
              {sent ? <div role="status" className={styles.success}>{contact.success}</div> : null}
              <div className={styles.formFields}>
                {contact.fields.map((field, i) => <label key={field} className={styles.field}>{field}<input required={i < 4} name={['name', 'company', 'role', 'email', 'phone'][i]} type={field === "Email" ? "email" : i === 4 ? "tel" : "text"} autoComplete={['name', 'organization', 'organization-title', 'email', 'tel'][i]} /></label>)}
                <label className={styles.field}>{contact.clientType}<select name="clientType" aria-label={contact.clientType}>{contact.clientTypes.map((option) => <option key={option}>{option}</option>)}</select></label>
                <label className={styles.field}>{contact.serviceInterest}<select name="serviceInterest" aria-label={contact.serviceInterest}>{contact.services.map((option) => <option key={option}>{option}</option>)}</select></label>
              </div>
              <label className={styles.field}>{contact.message}<textarea key={researchEnquiry?.record.id ?? "general"} name="message" aria-label={contact.message} required defaultValue={researchEnquiry?.message ?? ""} /></label>
              <label className={styles.confirm}><input required type="checkbox" name="professionalClient" />{contact.confirm}</label>
              <button type="submit" className={styles.submit}>{contact.submit}</button>
            </form>
          </div>
        </div>
      </section></CurvedBand>
      <CurvedBand nextBackground="#0c1725" background="#fff"><section className={styles.section} aria-labelledby="locations-heading">
        <div className={styles.container}>
          <h2 id="locations-heading" className={styles.sectionTitle}>{about.geographyTitle}</h2>
          <p className={styles.sectionBody}>{about.geographyBody}</p>
          <div className={styles.grid3}>{contact.locations.map((location, i) => <FadeIn key={location.city} delay={i * 0.08}><article id={`contact-${location.city.toLowerCase().replaceAll(" ", "-")}`} className={`${styles.card} ${styles.locationCard}`}>
            <span className={styles.label}>{about.geography[i].role}</span>
            <h3>{about.geography[i].city}</h3><p>{about.geography[i].note}</p>
            {location.city === "Dubai" ? <p className="mt-3">{location.entity}</p> : null}
            <p className="mt-3">{location.note}</p>
            {location.lines.length ? <p className={styles.locationLines}>{location.lines.map((line) => <span key={line}>{line}</span>)}</p> : null}
            <div className={styles.registerLinks}><a href={`mailto:${location.email}`}>{location.email}</a></div>
          </article></FadeIn>)}</div>
          <p className={styles.contactNote}>{about.entitiesNote}{" "}<Link href="/why-emfi#regulated-entities" className={styles.textLink}>{about.entitiesCta}</Link>.</p>
          <p className={styles.contactNote}>{contact.coverage}</p>
        </div>
      </section></CurvedBand>
    </div>
  );
}
