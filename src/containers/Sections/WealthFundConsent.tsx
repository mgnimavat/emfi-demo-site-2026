'use client';

import { useId, useState, type FormEvent } from 'react';
import { ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ResearchFilterSelect } from '@/components/sections/execution/research-filter-select';
import type { WealthCopy } from '@/lib/i18n/service-dictionaries';
import styles from './WealthFundConsent.module.css';

type ConsentCopy = WealthCopy['redesign']['hero']['gate'];

export const WealthFundConsent = ({ copy, onConfirm }: { copy: ConsentCopy; onConfirm: () => void }) => {
  const headingId = useId();
  const descriptionId = useId();
  const [error, setError] = useState('');
  const [selection, setSelection] = useState({ investor: '', country: '' });
  const [submitted, setSubmitted] = useState(false);
  const selects = [
    { name: 'investor', label: copy.investorLabel, options: copy.investors },
    { name: 'country', label: copy.countryLabel, options: copy.countries },
  ] as const;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    const { country, investor } = selection;
    const missing = selects.findIndex(({ name }) => !selection[name]);
    if (missing >= 0) {
      setError(copy.required);
      event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="combobox"]')[missing]?.focus();
      return;
    }

    if (country === 'us') {
      setError(copy.restricted);
      return;
    }

    if (!copy.investors.some(({ value }) => value === investor) ||
      !copy.countries.some(({ value }) => value === country) ||
      new FormData(event.currentTarget).get('risk') !== 'on') return;

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
            <ResearchFilterSelect key={name} className={styles.selectField} label={label}
              placeholder={copy.select} options={options} value={selection[name]} required
              invalid={submitted && !selection[name]} onChange={(value) => {
                setSelection((current) => ({ ...current, [name]: value }));
                setError('');
              }} />
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
