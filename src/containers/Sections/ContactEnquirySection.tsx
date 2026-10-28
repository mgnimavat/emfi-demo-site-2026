'use client';

import { useState, type FormEvent } from 'react';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import { contact } from '@/content/contact';
import { useResearchEnquiry } from '@/lib/use-research-enquiry';
import ctaStyles from '@/components/sections/home-16/questionnaire.module.css';
import styles from '@/components/sections/contact/contact.module.css';

export const ContactEnquirySection = () => {
  const [draftReady, setDraftReady] = useState(false);
  const [attachmentName, setAttachmentName] = useState('');
  const researchEnquiry = useResearchEnquiry();
  const copy = contact.cta;

  const submitEnquiry = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const details = copy.fields.map(
      (field) => `${field.label}: ${String(data.get(field.name) ?? '').trim()}`
    );
    const body = [
      ...details,
      `${copy.businessUnit}: ${String(data.get('businessUnit') ?? '')}`,
      `${copy.subject}: ${String(data.get('subject') ?? '')}`,
      '',
      `${contact.message}: ${String(data.get('message') ?? '').trim()}`,
    ];
    if (attachmentName) body.push('', `${copy.attachment}: ${attachmentName}`, copy.attachmentNotice);
    if (researchEnquiry) body.push('', researchEnquiry.message);
    window.location.href = `mailto:${contact.locations[0].email}?subject=${encodeURIComponent(copy.emailSubject)}&body=${encodeURIComponent(body.join('\n'))}`;
    setDraftReady(true);
  };

  return (
    <section id="contact-enquiry" className={`${ctaStyles.section} ${styles.section}`} aria-labelledby="contact-heading">
      <div className={ctaStyles.card}>
        <div className={`${ctaStyles.sidebar} ${styles.headingColumn}`}>
          <h1 id="contact-heading" className={`${ctaStyles.intro} ${ctaStyles.contactIntro}`}>
            {copy.title}<br /><span className={ctaStyles.accent}>{copy.accent.replace(/\.$/, '')}</span>.
          </h1>
        </div>
        <div className={`${ctaStyles.questionCard} ${styles.formPanel}`}>
          <form aria-labelledby="contact-heading" onSubmit={submitEnquiry}>
            {researchEnquiry ? (
              <div className={styles.researchContext}>
                <p>{copy.researchLabel}</p>
                <strong>{researchEnquiry.record.title}</strong>
              </div>
            ) : null}
            <div className={`${ctaStyles.fields} ${styles.fields}`}>
              {copy.fields.map((field) => (
                <input key={field.name} aria-label={field.label} name={field.name} type={field.type}
                  placeholder={field.placeholder} autoComplete={field.autoComplete}
                  required={field.required} />
              ))}
              <div className={styles.selectWrap}>
                <select aria-label={copy.businessUnit} name="businessUnit" required defaultValue="">
                  <option value="" disabled>{copy.businessUnitPlaceholder}</option>
                  {copy.businessUnits.map((unit) => <option key={unit} value={unit}>{unit}</option>)}
                </select>
                <ChevronDown aria-hidden="true" />
              </div>
              <div className={styles.selectWrap}>
                <select aria-label={copy.subject} name="subject" required defaultValue="">
                  <option value="" disabled>{copy.subjectPlaceholder}</option>
                  {copy.subjects.map((subject) => <option key={subject} value={subject}>{subject}</option>)}
                </select>
                <ChevronDown aria-hidden="true" />
              </div>
            </div>
            <label className={styles.message}>
              <textarea aria-label={contact.message} placeholder={contact.message} name="message" rows={2} required />
            </label>
            <div className={`${ctaStyles.actions} ${styles.actions}`}>
              <div className={styles.attachment}>
                <input type="file" name="attachment" aria-label={copy.attachment}
                  aria-describedby={attachmentName ? 'contact-attachment-notice' : undefined}
                  onChange={(event) => setAttachmentName(event.target.files?.[0]?.name ?? '')} />
              </div>
              <button type="submit" className={`${ctaStyles.next} ${styles.submit}`}>
                {contact.submit}<ArrowUpRight aria-hidden="true" />
              </button>
            </div>
            {attachmentName ? <p id="contact-attachment-notice" className={ctaStyles.description}>{copy.attachmentNotice}</p> : null}
            {draftReady ? <p role="status" className={ctaStyles.description}>{copy.draftNotice}</p> : null}
          </form>
        </div>
      </div>
    </section>
  );
};
