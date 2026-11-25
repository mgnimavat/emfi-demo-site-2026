import Image from 'next/image';
import { executionVenueGroups } from '@/content/execution-venues';
import type { ResearchCopy } from '@/lib/i18n/service-dictionaries';
import { ExecutionReveal } from '@/components/sections/execution/reveal';
import sectionStyles from '@/components/sections/execution/workstation-section.module.css';
import styles from './ExecutionVenuesSection.module.css';
import reveal from './ProviderCardReveal.module.css';

const executionVenues = executionVenueGroups.map((group) => group.venues).flat();

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
      <ExecutionReveal delay={0.12}>
        <h3 id="execution-venues-heading" className={styles.venuesTitle}>{copy.venuesTitle}</h3>
        <ul className={styles.venues} aria-labelledby="execution-venues-heading">
          {executionVenues.map((venue) => (
            <li key={venue.name}>
              <a href={venue.href} target="_blank" rel="noreferrer"
                className={`${styles.card} ${reveal.card} ${reveal.panel}`}>
                <span className={`${styles.logoFrame} ${reveal.brand}`}>
                  <Image src={venue.logo} alt="" width={200} height={64}
                    className={venue.name === 'Euroclear FundSettle' ? styles.squareLogo : styles.logo} />
                </span>
                <span className={reveal.details}>{venue.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </ExecutionReveal>
    </div>
  </section>
);
