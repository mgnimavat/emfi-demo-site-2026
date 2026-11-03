import { Check } from 'lucide-react';
import { directAccess as copy } from '@/content/direct-access';
import { ExecutionReveal } from '@/components/sections/execution/reveal';
import { ConnectedJourney } from '@/components/sections/execution-v2/connected-journey';
import hero from '@/components/sections/execution/page.module.css';
import band from '@/components/sections/responsive/page.module.css';
import { ServiceDisclosures } from './ServiceDisclosures';
import styles from './DirectAccessSections.module.css';

export const DirectAccessSections = () => (
  <>
    <section className={`${band.band} ${band.navy}`} aria-labelledby="infrastructure-heading">
      <div className={hero.container}>
        <div className={band.layout}>
          <ExecutionReveal>
            <p className={styles.eyebrow}>{copy.infrastructure.eyebrow}</p>
            <h2 id="infrastructure-heading" className={band.title}>{copy.infrastructure.title}</h2>
            <div className={band.copy}>
              <p className={band.leadLine}>{copy.infrastructure.lead}</p>
              <p>{copy.infrastructure.body}</p>
              <p className={band.callout}>{copy.infrastructure.note}</p>
            </div>
          </ExecutionReveal>
          <div className={styles.providers}>
            {copy.infrastructure.providers.map((provider) => (
              <ExecutionReveal key={provider.name} className={styles.provider}>
                <h3>{provider.category}</h3>
                <div className={styles.providerIdentity}>
                  <strong>{provider.name}</strong>
                  <span>{provider.role}</span>
                </div>
                <p>{provider.description}</p>
              </ExecutionReveal>
            ))}
          </div>
        </div>
      </div>
    </section>

    <section className={`${band.band} ${band.white}`} aria-labelledby="dma-heading">
      <div className={hero.container}>
        <div className={band.layout}>
          <ExecutionReveal>
            <p className={styles.eyebrow}>{copy.execution.eyebrow}</p>
            <h2 id="dma-heading" className={band.title}>{copy.execution.title}</h2>
            <div className={band.copy}>
              <p className={band.leadLine}>{copy.execution.lead}</p>
              {copy.execution.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </ExecutionReveal>
          <ExecutionReveal className={styles.executionVisual}>
            <div className={styles.dmaJourney}>
              <ConnectedJourney
                orientation="vertical"
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
