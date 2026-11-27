import { IntelligenceSignupForm } from '@/containers/Forms/IntelligenceSignupForm';
import type { ResearchCopy } from '@/lib/i18n/service-dictionaries';
import styles from './IntelligenceSignupSection.module.css';

export const IntelligenceSignupSection = ({ copy }: { copy: ResearchCopy['signup'] }) => (
  <section id="sign-up" className={styles.section} aria-labelledby="intelligence-signup-heading">
    <div className={styles.card}>
      <div className={styles.copy}>
        <h2 id="intelligence-signup-heading" className={styles.title}>
          {copy.title} <span className={styles.accent}>{copy.titleAccent}</span>
        </h2>
      </div>
      <IntelligenceSignupForm copy={copy.form} />
    </div>
  </section>
);
