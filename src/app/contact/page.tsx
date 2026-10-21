"use client";

import { CurvedBand } from "@/components/layout/curved-band";
import { ContactHero } from "@/components/sections/contact/hero";
import contactStyles from "@/components/sections/contact/contact.module.css";
import { useState } from "react";
import { contact } from "@/content/contact";
import { useResearchEnquiry } from "@/lib/use-research-enquiry";
import styles from "@/components/sections/archive/theme.module.css";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const researchEnquiry = useResearchEnquiry();
  return (
    <div className={styles.page}>
      <CurvedBand nextBackground="#fff"><ContactHero /></CurvedBand>
      <CurvedBand nextBackground="#0c1725"><section id="contact-enquiry" className={`${styles.section} ${contactStyles.enquiry}`} aria-labelledby="contact-form-heading">
        <div className={styles.container}>
          <div className={contactStyles.enquiryLayout}>
            <h2 id="contact-form-heading" className={`${styles.sectionTitle} ${contactStyles.formTitle}`}>{contact.formEyebrow}</h2>
            <form className={styles.form} aria-labelledby="contact-form-heading" onSubmit={(event) => { event.preventDefault(); setSent(true); }}>
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
      </div>
  );
}
