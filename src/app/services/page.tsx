import { CurvedBand } from "@/components/layout/curved-band";
import { services } from "@/content/services";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/motion/fade-in";
import { BrandWordmark } from "@/components/brand/wordmark";
import { BrandSign } from "@/components/brand/logo";
import styles from "./services.module.css";
import { ServicesHeroSubtext } from "@/components/sections/services/hero-subtext";

export const metadata = {
  title: services.title,
  description: services.body,
};

export default function ServicesPage() {
  return (
    <div className={styles.page}>
      <CurvedBand nextBackground="#fff"><section className={styles.hero}>
        <Container className={styles.container}>
          <div className={styles.heroGrid}>
            <FadeIn>
              <h1 className={styles.heroTitle} aria-label={services.headline.replace(/\n/g, " ")}>{services.headline.split("\n").map((line) => <span key={line}>{line.replace("Relationship", "Relation\u00adship")}</span>)}</h1>
              <ServicesHeroSubtext phrases={services.heroSubtext} />
              <div className={styles.heroActions}><Button href="#service-capabilities" className={styles.action}>Three connected capabilities.</Button></div>
            </FadeIn>
            <FadeIn delay={0.14}>
              <nav aria-label="Services on this page" className={styles.serviceNav}>
                <div className={styles.connectionRoot}><BrandWordmark width={120} /></div>
                <div className={styles.navLinks}>
                  {services.items.map((item) => (
                    <a key={item.num} href={`#svc-${item.num}`} className={styles.navLink}>
                      <span className={styles.navCopy}><span className={styles.navTitle}>{item.title}</span><span className={styles.navSlogan}>{item.slogan.replace(/\n/g, " ")}</span></span>
                    </a>
                  ))}
                </div>
              </nav>
            </FadeIn>
          </div>
        </Container>
      </section></CurvedBand>

      <CurvedBand nextBackground="#f4f7fb"><section id="service-capabilities" aria-labelledby="services-heading" className={styles.capabilities}>
        <Container className={styles.container}>
          <FadeIn>
            <h2 id="services-heading" className={styles.sectionTitle}>Everything connected. Nothing unnecessary.</h2>
          </FadeIn>
          <div className={styles.cardList}>
            {services.items.map((item, i) => (
              <FadeIn key={item.num} delay={i * 0.06}>
                <article id={`svc-${item.num}`} aria-labelledby={`service-title-${i}`} className={styles.serviceCard}>
                  <BrandSign className={styles.cardMark} />
                  <div className={styles.cardIntro}>
                    <h3 id={`service-title-${i}`}>{item.title}</h3>
                    <p>{item.slogan}</p>
                  </div>
                  <div className={styles.cardBody}>
                    <p className={styles.description}>{item.desc}</p>
                    <ul className={styles.features}>
                      {item.features.map((feature) => <li key={feature}>{feature}</li>)}
                    </ul>
                    <div className={styles.cardAction}>
                      <Button href={item.path} className={styles.action}>{item.cta}</Button>
                    </div>
                  </div>
                </article>
              </FadeIn>
            ))}
          </div>
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
