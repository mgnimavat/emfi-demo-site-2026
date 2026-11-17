'use client';

import { useState, type FormEvent } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import type { ResearchCopy } from '@/lib/i18n/service-dictionaries';
import { useServiceLocale } from '@/ui/hooks/useServiceLocale';
import styles from './IntelligenceSignupForm.module.css';

export const IntelligenceSignupForm = ({ copy }: { copy: ResearchCopy['signup']['form'] }) => {
  const [prepared, setPrepared] = useState(false);
  const { localize } = useServiceLocale();
  const prepareSignup = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPrepared(true);
  };

  return (
    <form className={styles.form} onSubmit={prepareSignup} onChange={() => setPrepared(false)}
      aria-labelledby="intelligence-signup-form-heading">
      <h3 id="intelligence-signup-form-heading" className={styles.heading}>{copy.heading}</h3>
      <div className={styles.fields}>
        {copy.fields.map((field) => (
          <label className={styles.field} key={field.name}>
            <span className="sr-only">{field.label}</span>
            <input name={field.name} type={field.type} autoComplete={field.autoComplete}
              placeholder={field.label} required />
          </label>
        ))}
      </div>
      <label className={`${styles.field} ${styles.selectWrap}`}>
        <span className="sr-only">{copy.interestLabel}</span>
        <select name="interest" defaultValue="" required>
          <option value="" disabled>{copy.interestLabel}</option>
          {copy.interests.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        <ChevronDown size={18} aria-hidden="true" />
      </label>
      <label className={styles.checkbox}>
        <input type="checkbox" name="professional" required />
        <span>{copy.professional}</span>
      </label>
      <label className={styles.checkbox}>
        <input type="checkbox" name="email_consent" />
        <span>{copy.consent} <a href={localize('/privacy-policy')}>{copy.privacyLabel}</a>.</span>
      </label>
      <button type="submit" className={styles.submit}>
        {copy.submit}<ArrowRight size={18} aria-hidden="true" />
      </button>
      {prepared ? <p role="status" className={styles.status}>{copy.preparedNotice}</p> : null}
    </form>
  );
};
