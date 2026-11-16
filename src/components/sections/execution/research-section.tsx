import { serviceDictionaries, type ResearchCopy } from '@/lib/i18n/service-dictionaries';
import { ExecutionReveal } from './reveal';
import { LiveResearch } from './live-research';
import styles from './research-section.module.css';

export const ResearchSection = ({
  layout = 'standard',
  copy = serviceDictionaries.en.research,
  appearance = 'dark',
  primaryHeading = false,
}: {
  layout?: 'standard' | 'split';
  copy?: ResearchCopy;
  appearance?: 'light' | 'dark';
  primaryHeading?: boolean;
}) => {
  const { introduction } = copy.research;
  const split = layout === 'split';
  const Heading = primaryHeading ? 'h1' : 'h2';
  const compact = appearance === 'light' && primaryHeading;

  return (
    <section id="research" className={`${styles.section} ${appearance === 'light' ? styles.light : ''} ${compact ? styles.compact : ''}`} aria-labelledby="research-heading">
      <div className={`${styles.container} ${split ? styles.split : ''}`}>
        {!compact ? <div className={styles.introduction}>
          <ExecutionReveal className={styles.heading}>
            <Heading id="research-heading" className={styles.title}>
              <span>{introduction.title}</span>
              <span className={styles.accent}>{introduction.accent}</span>
            </Heading>
          </ExecutionReveal>
          <ExecutionReveal delay={0.12} className={styles.copy}>
            <h3 className={styles.lead}>{introduction.lead}</h3>
            {introduction.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </ExecutionReveal>
        </div> : null}
        <LiveResearch singleColumn={split} compact={compact} heading={copy.research.intelligenceTitle} />
      </div>
    </section>
  );
};
