import type { CSSProperties } from "react";
import { ChartNoAxesCombined, ArrowRightLeft, CircleCheck, ShieldCheck, BriefcaseBusiness } from "lucide-react";
import { CurvedBand } from "@/components/layout/curved-band";
import { services } from "@/content/services";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/motion/fade-in";
import { BrandSign } from "@/components/brand/logo";
import { ServicesHeroSubtext } from "@/components/sections/services/hero-subtext";
import { MotionRegion } from "@/components/sections/landing/motion-region";
import styles from "./services.module.css";

export const metadata = { title: services.title, description: services.lifecycle.body };
const stageIcons = [ChartNoAxesCombined, ArrowRightLeft, CircleCheck, ShieldCheck, BriefcaseBusiness];
const servicePoints = [{ x: 180, y: 60 }, { x: 76.077, y: 240 }, { x: 283.923, y: 240 }];

export default function ServicesPage() {
  return (
    <div className={styles.page}>
      <CurvedBand nextBackground="#071932"><section className={styles.hero} aria-labelledby="services-heading">
        <Container className={styles.container}>
          <div className={styles.heroGrid}>
            <FadeIn>
              <h1 id="services-heading" className={styles.heroTitle} aria-label="One Relationship.">{services.headline.split("\n").map(line => <span key={line}>{line}</span>)}</h1>
              <ServicesHeroSubtext phrases={services.heroSubtext} />
              <div className={styles.heroActions}><Button href="#investment-lifecycle" className={styles.action}>Explore Our Services</Button></div>
            </FadeIn>
            <MotionRegion className={styles.heroVisual} reveal={false}>
              <nav className={styles.heroOrbit} aria-label="Explore EMFI services">
                <svg className={styles.orbitConnections} viewBox="0 0 360 360" fill="none" aria-hidden="true">
                  <circle className={styles.orbitRing} cx="180" cy="180" r="120" stroke="#8098cc" strokeOpacity=".45" />
                  {servicePoints.map(point => <line className={styles.orbitSpoke} pathLength="1" key={point.x} x1="180" y1="180" x2={point.x} y2={point.y} stroke="#8098cc" strokeWidth="1.5" strokeOpacity=".65" />)}
                  <circle cx="180" cy="180" r="72" fill="#f7f9fc" stroke="#b8c5d5" strokeOpacity=".5" />
                </svg>
                <BrandSign className={styles.heroMark} />{services.items.map((item, i) => {
                const Icon = [ChartNoAxesCombined, ShieldCheck, BriefcaseBusiness][i];
                const point = servicePoints[i];
                return <a key={item.num} href={item.path} className={styles.orbitService} style={{ "--node-x": `${point.x / 360 * 100}%`, "--node-y": `${point.y / 360 * 100}%`, "--node-delay": `${220 + i * 140}ms` } as CSSProperties}><span className={styles.orbitNode}><Icon aria-hidden="true" strokeWidth={1.5} /></span><span className={styles.orbitLabel}><span className={styles.orbitTitle}>{item.title}</span></span></a>;
              })}</nav>
            </MotionRegion>
          </div>
        </Container>
      </section></CurvedBand>

      <CurvedBand nextBackground="#fff"><section id="investment-lifecycle" className={styles.lifecycle} aria-labelledby="lifecycle-heading">
        <Container className={styles.container}>
          <FadeIn className={styles.lifecycleIntro}>
            <h2 id="lifecycle-heading" className={styles.sectionTitle}>{services.lifecycle.title}</h2>
            <p className={styles.supporting}>{services.lifecycle.body}</p>
          </FadeIn>
          <FadeIn>
            <ol className={styles.lifecycleDiagram} aria-label="Five connected stages of the investment lifecycle">
              {services.lifecycle.stages.map((stage, i) => {
                const Icon = stageIcons[i];
                return <li key={stage.num} className={styles.lifecycleStage}>
                  <span className={styles.stageIcon}><Icon aria-hidden="true" strokeWidth={1.5} /></span>
                  <div className={styles.stageCopy}><h3>{stage.title}</h3><p>{stage.description}</p></div>
                </li>;
              })}
            </ol>
          </FadeIn>
        </Container>
      </section></CurvedBand>

      <CurvedBand nextBackground="#f4f7fb"><section id="service-capabilities" className={styles.capabilities} aria-label="EMFI services">
        <Container className={styles.container}>
          <FadeIn>
            <div className={styles.serviceCards}>
              {services.items.map((item, i) => <article key={item.num} id={`svc-${item.num}`} aria-labelledby={`service-title-${item.num}`} className={styles.serviceCard}>
                <h2 id={`service-title-${item.num}`} className={styles.serviceTitle}>{item.title}</h2>
                <p className={styles.serviceDescription}>{item.desc}</p>
                <div className={styles.serviceAction}><Button href={item.path} variant={i === 1 ? "inverse" : "primary"} className={styles.action}>{item.cta}</Button></div>
              </article>)}
            </div>
          </FadeIn>
        </Container>
      </section></CurvedBand>

      <CurvedBand nextBackground="#0c1725"><section aria-labelledby="services-cta-heading" className={styles.contactCta}>
        <Container className={styles.container}>
          <FadeIn className={styles.ctaInner}>
            <h2 id="services-cta-heading" className={styles.sectionTitle}>{services.cta.title}</h2>
            <p>{services.cta.body}</p>
            <Button href="/contact" className={styles.action}>{services.cta.action}</Button>
          </FadeIn>
        </Container>
      </section></CurvedBand>
    </div>
  );
}
