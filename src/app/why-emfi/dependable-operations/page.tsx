import Image from "next/image";
import { ExecutionHeroPhrases } from "@/components/sections/execution/hero-phrases";
import { ExecutionReveal } from "@/components/sections/execution/reveal";
import hero from "@/components/sections/execution/page.module.css";
import band from "@/components/sections/responsive/page.module.css";
import { ServiceDisclosures } from "@/containers/Sections/ServiceDisclosures";
import { dependableOperations as copy } from "@/content/dependable-operations";
import { OversightCycle } from "@/components/sections/dependable/oversight-cycle";
import styles from "@/components/sections/dependable/page.module.css";

const authorities = [
  { src: "/brand/regulators/cima-brand.png", alt: "Cayman Islands Monetary Authority", label: "EMFI Fund", width: 80, height: 80 },
  { src: "/brand/regulators/fca-brand.svg", alt: "Financial Conduct Authority", label: "EMFI Securities Limited\nEMFI Capital Limited", width: 176, height: 100 },
  { src: "/brand/regulators/dfsa-brand.png", alt: "Dubai Financial Services Authority", label: "EMFI Capital (DIFC) Limited", width: 160, height: 100 },
];

export const metadata = { title: copy.title, description: copy.description };

export default function DependableOperationsPage() {
  return (
    <div>
      <section className={`${hero.hero} ${band.screen}`}>
        <div className={hero.container}>
          <div className={hero.heroGrid}>
            <ExecutionReveal className={hero.heroCopy}>
              <h1 className={`${hero.spacedLines} ${band.headline}`}>{copy.headline}</h1>
              <ExecutionHeroPhrases phrases={copy.phrases} fixed={copy.fixed} />
            </ExecutionReveal>
            <ExecutionReveal delay={0.12} className={hero.heroMedia}>
              <OversightCycle />
            </ExecutionReveal>
          </div>
        </div>
      </section>

      <section className={`${band.band} ${band.navy}`} aria-labelledby="regulation-heading">
        <div className={hero.container}>
          <div className={band.layout}>
            <ExecutionReveal>
              <h2 id="regulation-heading" className={band.title}>{copy.regulation.title}</h2>
              <div className={band.copy}>
                <p className={band.leadLine}>{copy.regulation.lead}</p>
                {copy.regulation.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
            </ExecutionReveal>
            <div className={styles.entities}>
              {copy.regulation.entities.map((entity) => (
                <a key={entity.name} className={styles.entity} href={entity.href} target="_blank" rel="noreferrer">
                  <span>{entity.region}</span>
                  <strong>{entity.name}</strong>
                  <p>{entity.detail}</p>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={`${band.band} ${band.white}`} aria-labelledby="oversight-heading">
        <div className={hero.container}>
          <div className={band.tech}>
            <ExecutionReveal>
              <h2 id="oversight-heading" className={band.title}>{copy.oversight.title}</h2>
              <div className={band.copy}>
                <p className={band.leadLine}>{copy.oversight.lead}</p>
                {copy.oversight.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
              </ExecutionReveal>
            <div className={styles.panel}>
              <p className={styles.kicker}>Authorised by</p>
              <div className={styles.marks}>
                {authorities.map((item) => (
                  <div key={item.alt} className={styles.mark}>
                    <Image src={item.src} alt={item.alt} width={item.width} height={item.height} unoptimized />
                    <p>{item.label.split("\n").map((line) => <span key={line}>{line}</span>)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <ServiceDisclosures headingId="dependable-disclosure-heading" title={copy.disclosure.title} action={copy.disclosure.action} external>
        {copy.disclosure.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </ServiceDisclosures>
    </div>
  );
}
