import Image from 'next/image';
import { executionVenueGroups } from '@/content/execution-venues';
import type { ResearchCopy } from '@/lib/i18n/service-dictionaries';
import { ExecutionReveal } from '@/components/sections/execution/reveal';
import styles from './ExecutionVenuesSection.module.css';
import reveal from './ProviderCardReveal.module.css';

export const ExecutionVenuesSection = ({ copy }: { copy: ResearchCopy['executionVenues'] }) => (
  <section id="execution" className={styles.section} aria-labelledby="execution-heading">
    <div className={styles.container}>
      <div className={styles.introduction}>
        <ExecutionReveal>
          <h2 id="execution-heading" className={styles.title}>{copy.title}</h2>
        </ExecutionReveal>
        <ExecutionReveal delay={0.12}>
          <h3 className={styles.subtitle}>{copy.subtitle}</h3>
          <p className={styles.body}>{copy.body}</p>
        </ExecutionReveal>
      </div>
      <div className={styles.groups}>
        {executionVenueGroups.map((group) => (
          <ExecutionReveal key={group.id}>
            <ul className={styles.venues}>
              {group.venues.map((venue) => (
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
        ))}
      </div>
    </div>
  </section>
);
