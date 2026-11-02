import { ResearchExecutionHeroMockup } from '@/components/home-17/research-execution-hero';
import { execution } from '@/content/execution';
import { ExecutionReveal } from './reveal';
import styles from './workstation-section.module.css';

const workstationViews = ['OrderEur'] as const;

export const WorkstationSection = () => {
  const content = execution.workstation;

  return (
    <section id="execution" className={styles.section} aria-labelledby="execution-heading">
      <div className={styles.container}>
        <ExecutionReveal className={styles.copy}>
          <h2 id="execution-heading" className={styles.title}>
            <span>{content.title}</span>
            <span>{content.accent}</span>
          </h2>
          <p className={styles.lead}>{content.lead}</p>
          <div className={styles.body}>
            {content.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
        </ExecutionReveal>
        <ExecutionReveal delay={0.12} className={styles.visual}>
          <div className={styles.workstation}>
            <h3>{content.name}</h3>
            <p>{content.description}</p>
          </div>
          <div role="img" aria-label={content.visualLabel}>
            <ResearchExecutionHeroMockup
              views={workstationViews}
              quietFrame
              square
              trimChrome
              appBar
            />
          </div>
        </ExecutionReveal>
      </div>
    </section>
  );
};
