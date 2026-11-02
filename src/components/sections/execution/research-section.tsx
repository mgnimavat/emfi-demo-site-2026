import { execution } from '@/content/execution';
import { ExecutionReveal } from './reveal';
import { LiveResearch } from './live-research';
import styles from './research-section.module.css';

export const ResearchSection = () => {
  const { introduction } = execution.research;

  return (
    <section id="research" className={styles.section} aria-labelledby="research-heading">
      <div className={styles.container}>
        <div className={styles.introduction}>
          <ExecutionReveal className={styles.heading}>
            <h2 id="research-heading" className={styles.title}>
              <span>{introduction.title}</span>
              <span className={styles.accent}>{introduction.accent}</span>
            </h2>
          </ExecutionReveal>
          <ExecutionReveal delay={0.12} className={styles.copy}>
            <h3 className={styles.lead}>{introduction.lead}</h3>
            {introduction.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </ExecutionReveal>
        </div>
        <LiveResearch />
      </div>
    </section>
  );
};
