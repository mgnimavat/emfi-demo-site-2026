import { PersonCard } from '@/components/sections/person-card';
import { ExecutionReveal } from '@/components/sections/execution/reveal';
import type { ResearchCopy } from '@/lib/i18n/service-dictionaries';
import theme from '@/components/sections/archive/theme.module.css';
import styles from './ResearchTeamSection.module.css';

export const ResearchTeamSection = ({ copy }: { copy: ResearchCopy['team'] }) => (
  <section id="research-team" className={`${theme.peopleBand} ${theme.section}`} aria-labelledby="research-team-heading">
    <div className={theme.container}>
      <ExecutionReveal className={theme.peopleIntro}>
        <h2 id="research-team-heading" className={theme.sectionTitle}>
          {copy.title}
        </h2>
        <p className={styles.body}>{copy.body}</p>
      </ExecutionReveal>
      <div className={theme.personGrid}>
        {copy.people.map((person) => (
          <ExecutionReveal key={person.name} className={person.startDesktopRow ? styles.rowStart : undefined}>
            <PersonCard person={person} />
          </ExecutionReveal>
        ))}
      </div>
    </div>
  </section>
);
