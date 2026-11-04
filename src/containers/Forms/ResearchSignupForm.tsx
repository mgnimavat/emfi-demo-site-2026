'use client';

import { useState, type FormEvent } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import buttonStyles from '@/components/sections/home-16/questionnaire.module.css';
import { researchSignup } from '@/content/research-signup';
import jurisdictions from '@/content/research-signup-jurisdictions.json';
import { buildResearchSignupPayload } from '@/lib/research-signup';
import type { ResearchSignupPayload, ResearchSignupType } from '@/types/research-signup';
import styles from './ResearchSignupForm.module.css';

const copy = researchSignup.form;

export const ResearchSignupForm = () => {
  const [type, setType] = useState<ResearchSignupType | ''>('');
  const [payload, setPayload] = useState<ResearchSignupPayload | null>(null);
  const [error, setError] = useState(false);

  const prepareSignup = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextPayload = buildResearchSignupPayload(new FormData(event.currentTarget));
    setError(nextPayload === null);
    setPayload(nextPayload);
  };

  const clearStatus = () => {
    setPayload(null);
    setError(false);
  };

  return (
    <form className={styles.form} aria-label={copy.label} onSubmit={prepareSignup} onChange={clearStatus}>
      <label className={`${styles.field} ${styles.selectField}`}>
        <span className="sr-only">{copy.type}</span>
        <select name="type" required value={type} onChange={(event) => {
          const value = event.target.value;
          if (value === 'individual' || value === 'entity') setType(value);
        }}>
          <option value="" disabled>{copy.type}</option>
          {copy.types.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
        <ChevronDown size={18} aria-hidden="true" />
      </label>
      {copy.fields.map((field) => (
        <label key={field.name} className={`${styles.field} ${field.name === 'email' ? '' : styles.nameField}`}>
          <span className="sr-only">{field.label}</span>
          <input name={field.name} type={field.type} autoComplete={field.autoComplete} required placeholder={field.label} />
        </label>
      ))}
      {type === 'entity' ? (
        <div>
          <label className={styles.field}>
            <span className="sr-only">{copy.distributionList}</span>
            <input name="distribution_list" type="email" multiple required placeholder={copy.distributionList} aria-describedby="signup-distribution-help" />
          </label>
          <p id="signup-distribution-help" className={styles.help}>{copy.distributionHelp}</p>
        </div>
      ) : null}
      <label className={`${styles.field} ${styles.selectField}`}>
        <span className="sr-only">{copy.jurisdiction}</span>
        <select name="jurisdiction" autoComplete="country-name" defaultValue="" required>
          <option value="" disabled>{copy.jurisdiction}</option>
          {jurisdictions.map((name) => <option key={name} value={name}>{name}</option>)}
        </select>
        <ChevronDown size={18} aria-hidden="true" />
      </label>
      <div className={styles.actions}><button type="submit" className={buttonStyles.next}>{copy.submit}<ArrowRight aria-hidden="true" /></button></div>
      {error ? <p className={styles.help} role="alert">{copy.invalidNotice}</p> : null}
      {payload ? <p className={styles.help} role="status">{copy.preparedNotice}</p> : null}
    </form>
  );
};
