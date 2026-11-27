import { ResearchToTrade } from '@/components/sections/execution/research-to-trade';
import type { ResearchCopy } from '@/lib/i18n/service-dictionaries';
import { ExecutionReveal } from '@/components/sections/execution/reveal';
import sectionStyles from '@/components/sections/execution/workstation-section.module.css';
import styles from './ExecutionVenuesSection.module.css';

export const ExecutionVenuesSection = ({ copy }: { copy: ResearchCopy['executionVenues'] }) => (
  <section id="execution" className={styles.section} aria-labelledby="execution-heading">
    <div className={styles.container}>
      <div className={styles.introduction}>
        <ExecutionReveal>
          <h2 id="execution-heading" className={sectionStyles.featureTitle}>{copy.title}</h2>
        </ExecutionReveal>
        <ExecutionReveal delay={0.12} className={styles.copy}>
          <p className={styles.description}>{copy.subtitle} {copy.body}</p>
        </ExecutionReveal>
      </div>
      <ExecutionReveal delay={0.12} className={sectionStyles.visual}>
        <ResearchToTrade />
      </ExecutionReveal>
    </div>
  </section>
);
