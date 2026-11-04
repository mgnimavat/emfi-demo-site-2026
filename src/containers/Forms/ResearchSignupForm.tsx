'use client';

import { useState, type FormEvent } from 'react';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
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
        <span>{copy.type} <span className={styles.required}>*</span></span>
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
          <input name={field.name} type={field.type} autoComplete={field.autoComplete} required placeholder=" " />
          <span className={styles.inputLabel}>{field.label} <span className={styles.required}>*</span></span>
        </label>
      ))}
      {type === 'entity' ? (
        <div>
          <label className={styles.field}>
            <input name="distribution_list" type="email" multiple required placeholder=" " aria-describedby="signup-distribution-help" />
            <span className={styles.inputLabel}>{copy.distributionList} <span className={styles.required}>*</span></span>
          </label>
          <p id="signup-distribution-help" className={styles.help}>{copy.distributionHelp}</p>
        </div>
      ) : null}
      <label className={`${styles.field} ${styles.selectField}`}>
        <span>{copy.jurisdiction} <span className={styles.required}>*</span></span>
        <select name="jurisdiction" autoComplete="country-name" defaultValue="" required>
          <option value="" disabled>{copy.jurisdiction}</option>
          {jurisdictions.map((name) => <option key={name} value={name}>{name}</option>)}
        </select>
        <ChevronDown size={18} aria-hidden="true" />
      </label>
      <div className={styles.actions}><button type="submit">{copy.submit}<ArrowUpRight size={18} aria-hidden="true" /></button></div>
      {error ? <p className={styles.help} role="alert">{copy.invalidNotice}</p> : null}
      {payload ? <p className={styles.help} role="status">{copy.preparedNotice}</p> : null}
    </form>
  );
};
