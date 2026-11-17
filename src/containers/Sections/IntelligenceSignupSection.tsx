import { Check } from 'lucide-react';
import { IntelligenceSignupForm } from '@/containers/Forms/IntelligenceSignupForm';
import type { ResearchCopy } from '@/lib/i18n/service-dictionaries';
import styles from './IntelligenceSignupSection.module.css';

export const IntelligenceSignupSection = ({ copy }: { copy: ResearchCopy['signup'] }) => (
  <section id="sign-up" className={styles.section} aria-labelledby="intelligence-signup-heading">
    <div className={styles.card}>
      <div className={styles.copy}>
        <h2 id="intelligence-signup-heading" className={styles.title}>
          {copy.titleLines.map((line) => <span key={line}>{line}</span>)}
        </h2>
        <ul className={styles.benefits}>
          {copy.benefits.map((benefit) => (
            <li key={benefit}><Check size={18} aria-hidden="true" /><span>{benefit}</span></li>
          ))}
        </ul>
        <p className={styles.note}>{copy.note}</p>
      </div>
      <IntelligenceSignupForm copy={copy.form} />
    </div>
  </section>
);
