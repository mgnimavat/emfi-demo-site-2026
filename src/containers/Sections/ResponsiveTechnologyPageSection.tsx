import type { ResponsiveCopy } from '@/lib/i18n/marketing-dictionaries';
import { ResponsiveTechnologyShowcase } from "@/containers/Sections/ResponsiveTechnologyShowcase";
import { ConnectedJourney } from "@/components/sections/execution-v2/connected-journey";
import { ResponsiveShowcase } from "@/components/sections/responsive/showcase";
import { ExecutionHeroTitle } from "@/components/sections/execution/hero-title";
import { ExecutionReveal } from "@/components/sections/execution/reveal";
import hero from "@/components/sections/execution/page.module.css";
import { ServiceDisclosures } from "@/containers/Sections/ServiceDisclosures";
import styles from "@/components/sections/responsive/page.module.css";
import feature from "@/containers/Sections/ResponsiveTechnologySections.module.css";


export const ResponsiveTechnologyPageSection = ({ copy }: { copy: ResponsiveCopy }) => {
  return (
    <div>
      <section className={`${hero.hero} ${styles.screen}`}>
        <div className={hero.container}>
          <div className={hero.heroGrid}>
            <ExecutionReveal className={hero.heroCopy}>
              <ExecutionHeroTitle
                headline={copy.headline}
                prefix={copy.fixed}
                words={copy.phrases}
                headlineClassName={`${hero.spacedLines} ${styles.headline}`}
              />
            </ExecutionReveal>
            <ExecutionReveal delay={0.12} className={hero.heroMedia}>
              <ResponsiveShowcase />
            </ExecutionReveal>
          </div>
        </div>
      </section>

      <section className={`${styles.band} ${styles.navy} ${feature.section}`} aria-labelledby="specialist-heading">
        <div className={feature.container}>
          <div className={feature.introduction}>
            <ExecutionReveal>
              <h2 id="specialist-heading" className={feature.title}>{copy.specialist.titleLines.map((line) => <span key={line}>{line}</span>)}</h2>
            </ExecutionReveal>
            <ExecutionReveal className={feature.copy}>
              <p className={feature.lead}>{copy.specialist.lead}</p>
              {copy.specialist.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              <p>{copy.specialist.callout}</p>
              <p>{copy.specialist.closing}</p>
            </ExecutionReveal>
          </div>
          <ExecutionReveal className={feature.workflow}>
            <ConnectedJourney
              label={copy.workflowLabel}
              steps={copy.specialist.steps.map((step) => ({ label: step.title, detail: step.body }))}
              icons={["search", "shield", "handshake"]}
            />
          </ExecutionReveal>
        </div>
      </section>

      <section className={`${styles.band} ${styles.white} ${feature.section} ${feature.technology}`} aria-labelledby="technology-heading">
        <div className={feature.container}>
          <div className={feature.introduction}>
            <ExecutionReveal>
              <h2 id="technology-heading" className={feature.title}>{copy.technology.titleLines.map((line) => <span key={line}>{line}</span>)}</h2>
            </ExecutionReveal>
            <ExecutionReveal className={`${feature.copy} ${feature.lightCopy}`}>
              <p className={feature.lead}>{copy.technology.lead}</p>
              {copy.technology.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </ExecutionReveal>
          </div>
          <ExecutionReveal className={feature.technologyVisual}>
            <ResponsiveTechnologyShowcase />
          </ExecutionReveal>
        </div>
      </section>

      <ServiceDisclosures headingId="disclosure-heading" title={copy.disclosure.title} action={copy.disclosure.action} actionPlacement="panel" external>
        {copy.disclosure.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </ServiceDisclosures>
    </div>
  );
};

