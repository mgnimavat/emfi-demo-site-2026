import { ExecutionWorkstation } from '@/containers/Sections/ExecutionWorkstation';
import type { WorkstationMaskVariant } from '@/containers/Sections/WorkstationPrivacy';
import { execution } from '@/content/execution';
import { ExecutionReveal } from './reveal';
import styles from './workstation-section.module.css';

export const WorkstationSection = ({ maskVariant = 'initial-stars' }: { maskVariant?: WorkstationMaskVariant }) => {
  const content = execution.workstation;

  return (
    <section id="execution" className={styles.section} aria-labelledby="execution-heading">
      <div className={styles.container}>
        <div className={styles.introduction}>
          <ExecutionReveal>
            <h2 id="execution-heading" className={styles.title}>
              <span>{content.title}</span>
              <span>{content.accent}</span>
            </h2>
          </ExecutionReveal>
          <ExecutionReveal delay={0.12} className={styles.copy}>
            <h3 className={styles.lead}>{content.lead}</h3>
            <div className={styles.body}>
              {content.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </ExecutionReveal>
        </div>
        <ExecutionReveal delay={0.12} className={styles.visual}>
          <div className={styles.workstation}>
            <h3>{content.name}</h3>
            <p>{content.description}</p>
          </div>
          <ExecutionWorkstation maskVariant={maskVariant} />
        </ExecutionReveal>
      </div>
    </section>
  );
};
