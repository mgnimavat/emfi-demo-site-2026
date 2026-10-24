import { MotionRegion } from "@/components/sections/landing/motion-region";
import { Button } from "@/components/ui/button";
import { home8 as home } from "@/content/home-8";
import { ComplexityIcon, ExpenseIcon, ExposureIcon } from "@/components/sections/home-8/icons";
import { BrandMark } from "@/components/sections/landing/icons";
import glass from "@/components/sections/glass-card.module.css";
import styles from "./landing.module.css";

const responsiveIcons = [ComplexityIcon, ExpenseIcon, ExposureIcon];

export function HeroSection() {
  return <section id="home" className={styles.hero} aria-labelledby="home-heading">
      <div className={styles.heroStage}>
        <MotionRegion className={styles.heroLayout} reveal={false}>
          <div className={styles.heroCopy}>
            <p className={styles.heroEyebrow}><span className={styles.heroEyebrowMark} aria-hidden="true" /><span>{home.hero.eyebrow}</span></p>
            <h1 id="home-heading">
              <span className={styles.heroLead}>Settle</span>
              <span className={styles.heroRest}>for <span className={styles.heroLess}>Less</span></span>
            </h1>
            <p className={styles.heroAccent}><strong>Execute</strong> and <strong>Custody</strong> for Less, too.</p>
          </div>
          <div className={styles.heroSymbol} aria-hidden="true">
            <div className={styles.heroSymbolOrbit}>
              <BrandMark />
            </div>
          </div>
        </MotionRegion>
        <MotionRegion className={styles.heroPillars}>
          {home.hero.pillars.map((item) => (
            <article key={item.label} className={styles.heroPillar}>
              <p className={styles.heroPillarIndex}><span>{item.index}</span> / {item.label}</p>
              <h2>{item.title}</h2>
              <p>{item.body}</p>
            </article>
          ))}
        </MotionRegion>
      </div>
    </section>;
}

export function ExpectBand() {
  return <section className={styles.expect} aria-labelledby="expect-heading"><MotionRegion><h2 id="expect-heading">Why EMFI</h2></MotionRegion></section>;
}

export function ResponsiveSection() {
  return <section id="responsive" className={styles.responsive} aria-labelledby="responsive-heading">
      <div className={styles.benefitInner}><MotionRegion>
        <h2 id="responsive-heading" className={styles.sectionTitle}>Your Advantages</h2>
        <div className={styles.cards}>
          {home.responsive.map((item, index) => {
            const Icon = responsiveIcons[index];
            return <article key={item.title} className={`${glass.card} ${styles.benefitCard}`}>
              <div className={styles.cardTitle}><span className={styles.cardIcon}><Icon /></span><h3>{item.titleLead} <span>{item.titleRest}</span></h3></div>
              <p>{item.body}</p>
            </article>;
          })}
        </div>
      </MotionRegion></div>
    </section>;
}

export function ContactSection() {
  return <section id="contact" className={styles.contact} aria-labelledby="contact-heading"><MotionRegion className={styles.contactInner}><h2 id="contact-heading">{home.contactCta.title}</h2><p>{home.contactCta.body}</p><Button href="/contact" className={styles.contactAction}>{home.contactCta.action}</Button></MotionRegion></section>;
}
