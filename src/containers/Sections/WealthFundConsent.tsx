'use client';

import { useId, useState, type FormEvent } from 'react';
import { ChevronDown, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { WealthCopy } from '@/lib/i18n/service-dictionaries';
import styles from './WealthFundConsent.module.css';

type ConsentCopy = WealthCopy['redesign']['hero']['gate'];

export const WealthFundConsent = ({ copy, onConfirm }: { copy: ConsentCopy; onConfirm: () => void }) => {
  const headingId = useId();
  const descriptionId = useId();
  const [error, setError] = useState('');
  const selects = [
    { name: 'investor', label: copy.investorLabel, options: copy.investors },
    { name: 'country', label: copy.countryLabel, options: copy.countries },
  ];

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const country = values.get('country');

    if (country === 'us') {
      setError(copy.restricted);
      return;
    }

    if (!copy.investors.some(({ value }) => value === values.get('investor')) ||
      !copy.countries.some(({ value }) => value === country) ||
      values.get('risk') !== 'on') return;

    onConfirm();
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} onChange={() => setError('')}
      aria-labelledby={headingId} aria-describedby={descriptionId}>
      <div className={styles.intro}>
        <span className={styles.icon}><ShieldCheck size={24} aria-hidden="true" /></span>
        <h2 id={headingId}>{copy.title}</h2>
        <p id={descriptionId}>{copy.body}</p>
      </div>
      <div className={styles.fields}>
        <div className={styles.selects}>
          {selects.map(({ name, label, options }) => (
            <label key={name}>
              <span>{label}</span>
              <span className={styles.selectControl}>
                <select name={name} defaultValue="" required>
                  <option value="" disabled>{copy.select}</option>
                  {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
                <ChevronDown size={16} aria-hidden="true" />
              </span>
            </label>
          ))}
        </div>
        <label className={styles.acknowledgment}>
          <input name="risk" type="checkbox" required />
          <span>{copy.risk}</span>
        </label>
        {error ? <p className={styles.error} role="alert">{error}</p> : null}
        <div className={styles.actions}>
          <Button type="submit" className={`${styles.submit} min-h-11 px-6 py-2 text-sm tracking-normal`}>
            {copy.submit}
          </Button>
          <button type="button" className={styles.decline} onClick={() => setError(copy.ineligible)}>{copy.decline}</button>
        </div>
      </div>
    </form>
  );
};
