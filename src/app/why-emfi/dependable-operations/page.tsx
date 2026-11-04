import Image from "next/image";
import { ExecutionHeroTitle } from "@/components/sections/execution/hero-title";
import { ExecutionReveal } from "@/components/sections/execution/reveal";
import hero from "@/components/sections/execution/page.module.css";
import band from "@/components/sections/responsive/page.module.css";
import { ServiceDisclosures } from "@/containers/Sections/ServiceDisclosures";
import { dependableOperations as copy } from "@/content/dependable-operations";
import { OversightCycle } from "@/components/sections/dependable/oversight-cycle";
import styles from "@/components/sections/dependable/page.module.css";
import feature from "@/containers/Sections/DependableOperationsSections.module.css";

const authorities = [
  { src: "/brand/regulators/cima-brand.png", alt: "Cayman Islands Monetary Authority", label: "EMFI Fund", width: 80, height: 80 },
  { src: "/brand/regulators/fca-brand.svg", alt: "Financial Conduct Authority", label: "EMFI Securities Limited\nEMFI Capital Limited", width: 176, height: 100 },
  { src: "/brand/regulators/dfsa-brand.png", alt: "Dubai Financial Services Authority", label: "EMFI Capital (DIFC) Limited", width: 160, height: 100 },
];

export const metadata = { title: copy.title, description: copy.description };

const DependableOperationsPage = () => {
  return (
    <div>
      <section className={`${hero.hero} ${band.screen}`}>
        <div className={hero.container}>
          <div className={hero.heroGrid}>
            <ExecutionReveal className={hero.heroCopy}>
              <ExecutionHeroTitle
                headline={copy.headline}
                prefix={copy.fixed}
                words={copy.phrases}
                headlineClassName={`${hero.spacedLines} ${band.headline}`}
              />
            </ExecutionReveal>
            <ExecutionReveal delay={0.12} className={hero.heroMedia}>
              <OversightCycle />
            </ExecutionReveal>
          </div>
        </div>
      </section>

      <section className={`${band.band} ${band.navy} ${feature.section}`} aria-labelledby="regulation-heading">
        <div className={feature.container}>
          <div className={feature.introduction}>
            <ExecutionReveal>
              <h2 id="regulation-heading" className={feature.title}>{copy.regulation.titleLines.map((line) => <span key={line}>{line}</span>)}</h2>
            </ExecutionReveal>
            <ExecutionReveal className={feature.copy}>
              <p className={feature.lead}>{copy.regulation.lead}</p>
              {copy.regulation.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </ExecutionReveal>
          </div>
          <ExecutionReveal className={feature.entities}>
            {copy.regulation.entities.map((entity) => (
              <a key={entity.name} className={feature.entity} href={entity.href} target="_blank" rel="noreferrer">
                <span>{entity.region}</span>
                <strong>{entity.name}</strong>
                <p>{entity.detail}</p>
              </a>
            ))}
          </ExecutionReveal>
        </div>
      </section>

      <section className={`${band.band} ${band.white} ${feature.section} ${feature.oversight}`} aria-labelledby="oversight-heading">
        <div className={feature.container}>
          <div className={feature.introduction}>
            <ExecutionReveal>
              <h2 id="oversight-heading" className={feature.title}>{copy.oversight.titleLines.map((line) => <span key={line}>{line}</span>)}</h2>
            </ExecutionReveal>
            <ExecutionReveal className={`${feature.copy} ${feature.lightCopy}`}>
              <p className={feature.lead}>{copy.oversight.lead}</p>
              {copy.oversight.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </ExecutionReveal>
          </div>
          <ExecutionReveal className={`${styles.panel} ${feature.logoPanel}`}>
            <div className={`${styles.marks} ${feature.logoMarks}`}>
              {authorities.map((item) => (
                <div key={item.alt} className={`${styles.mark} ${feature.logoMark}`}>
                  <Image src={item.src} alt={item.alt} width={item.width} height={item.height} unoptimized />
                  <p>{item.label.split("\n").map((line) => <span key={line}>{line}</span>)}</p>
                </div>
              ))}
            </div>
          </ExecutionReveal>
        </div>
      </section>

      <ServiceDisclosures headingId="dependable-disclosure-heading" title={copy.disclosure.title} action={copy.disclosure.action} actionPlacement="panel" external>
        {copy.disclosure.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </ServiceDisclosures>
    </div>
  );
};

export default DependableOperationsPage;
