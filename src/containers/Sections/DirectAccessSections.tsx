import { Check } from 'lucide-react';
import type { DirectCopy } from '@/lib/i18n/marketing-dictionaries';
import { ExecutionReveal } from '@/components/sections/execution/reveal';
import { ConnectedJourney } from '@/components/sections/execution-v2/connected-journey';
import band from '@/components/sections/responsive/page.module.css';
import { ServiceDisclosures } from './ServiceDisclosures';
import styles from './DirectAccessSections.module.css';

export const DirectAccessSections = ({ copy }: { copy: DirectCopy }) => (
  <>
    <section className={`${band.band} ${band.navy} ${styles.infrastructure}`} aria-labelledby="infrastructure-heading">
      <div className={styles.infrastructureContainer}>
        <div className={styles.infrastructureLayout}>
          <ExecutionReveal>
            <h2 id="infrastructure-heading" className={styles.infrastructureTitle}>{copy.infrastructure.titleLines.map((line) => <span key={line}>{line}</span>)}</h2>
          </ExecutionReveal>
          <ExecutionReveal className={styles.infrastructureCopy}>
            <p className={styles.infrastructureLead}>{copy.infrastructure.lead}</p>
            <p>{copy.infrastructure.body}</p>
            <p>{copy.infrastructure.note}</p>
          </ExecutionReveal>
        </div>
        <div className={styles.providers}>
          {copy.infrastructure.providers.map((provider) => (
            <ExecutionReveal key={provider.name} className={styles.provider}>
              <h3>{provider.name}</h3>
              <p>{provider.description}</p>
            </ExecutionReveal>
          ))}
        </div>
      </div>
    </section>

    <section className={`${band.band} ${band.white} ${styles.infrastructure}`} aria-labelledby="dma-heading">
      <div className={styles.infrastructureContainer}>
        <div className={styles.infrastructureLayout}>
          <ExecutionReveal>
            <h2 id="dma-heading" className={styles.infrastructureTitle}>{copy.execution.titleLines.map((line) => <span key={line}>{line}</span>)}</h2>
          </ExecutionReveal>
          <ExecutionReveal className={`${styles.infrastructureCopy} ${styles.executionCopy}`}>
            <p className={styles.infrastructureLead}>{copy.execution.lead}</p>
            {copy.execution.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </ExecutionReveal>
        </div>
        <ExecutionReveal className={styles.executionVisual}>
            <div className={styles.dmaJourney}>
              <ConnectedJourney
                label={copy.execution.modelLabel}
                steps={copy.execution.steps}
                icons={['search', 'shield', 'handshake', 'handshake']}
              />
            </div>
            <div className={styles.conditions}>
              <h3>{copy.execution.conditionsTitle}</h3>
              <ul>
                {copy.execution.conditions.map((condition) => (
                  <li key={condition}><Check size={16} aria-hidden="true" /><span>{condition}</span></li>
                ))}
              </ul>
            </div>
        </ExecutionReveal>
      </div>
    </section>

    <ServiceDisclosures
      headingId="access-disclosures-heading"
      title={copy.disclosures.title}
      action={copy.disclosures.action}
      actionPlacement="panel"
      external
    >
      {copy.disclosures.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
    </ServiceDisclosures>
  </>
);
