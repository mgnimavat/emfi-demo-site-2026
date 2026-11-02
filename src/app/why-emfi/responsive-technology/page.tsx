import { ResearchExecutionHeroMockup, homeV5ResponsiveSlides } from "@/components/home-17/research-execution-hero";
import { ConnectedJourney } from "@/components/sections/execution-v2/connected-journey";
import { ResponsiveShowcase } from "@/components/sections/responsive/showcase";
import { ExecutionHeroPhrases } from "@/components/sections/execution/hero-phrases";
import { ExecutionReveal } from "@/components/sections/execution/reveal";
import hero from "@/components/sections/execution/page.module.css";
import { responsiveTechnology as copy } from "@/content/responsive-technology";
import styles from "@/components/sections/responsive/page.module.css";

export const metadata = { title: copy.title, description: copy.description };

export default function ResponsiveTechnologyPage() {
  return (
    <div>
      <section className={`${hero.hero} ${styles.screen}`}>
        <div className={hero.container}>
          <div className={hero.heroGrid}>
            <ExecutionReveal className={hero.heroCopy}>
              <h1 className={hero.spacedLines}>{copy.headline.split("\n").map((line) => <span key={line}>{line}</span>)}</h1>
              <ExecutionHeroPhrases phrases={copy.phrases} fixed={copy.fixed} />
            </ExecutionReveal>
            <ExecutionReveal delay={0.12} className={hero.heroMedia}>
              <ResponsiveShowcase />
            </ExecutionReveal>
          </div>
        </div>
      </section>

      <section className={`${styles.band} ${styles.navy}`} aria-labelledby="specialist-heading">
        <div className={`${hero.container} ${styles.alignNav}`}>
          <div className={styles.layout}>
            <ExecutionReveal>
              <h2 id="specialist-heading" className={styles.title}>{copy.specialist.title}</h2>
              <div className={styles.copy}>
                <p className={styles.leadLine}>{copy.specialist.lead}</p>
                {copy.specialist.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                <p className={styles.callout}>{copy.specialist.callout}</p>
                <p>{copy.specialist.closing}</p>
              </div>
            </ExecutionReveal>
            <div className={styles.journeySlot}>
              <ConnectedJourney
                orientation="vertical"
                label="From requirement to workable route"
                steps={copy.specialist.steps.map((step) => ({ label: step.title, detail: step.body }))}
                icons={["search", "shield", "handshake"]}
              />
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.band} ${styles.white}`} aria-labelledby="technology-heading">
        <div className={hero.container}>
          <div className={styles.tech}>
            <ExecutionReveal>
              <h2 id="technology-heading" className={styles.title}>{copy.technology.title}</h2>
              <div className={styles.copy}>
                <p className={styles.leadLine}>{copy.technology.lead}</p>
                {copy.technology.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
            </ExecutionReveal>
            <div className={styles.techMedia}>
              <ResearchExecutionHeroMockup quietFrame square trimChrome views={homeV5ResponsiveSlides} />
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.band} ${styles.disclosure}`} aria-labelledby="disclosure-heading">
        <div className={hero.container}>
          <div className={styles.disclosureGrid}>
            <h2 id="disclosure-heading" className={styles.title}>{copy.disclosure.title}</h2>
            <div className={styles.copy}>
              {copy.disclosure.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
