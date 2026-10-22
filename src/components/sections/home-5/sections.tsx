import { MotionRegion } from "@/components/sections/landing/motion-region";
import { Button } from "@/components/ui/button";
import { home5 as home } from "@/content/home-5";
import { BrandMark } from "@/components/sections/landing/icons";
import { ComplexityIcon, ExpenseIcon, ExposureIcon } from "@/components/sections/home-5/icons";
import glass from "@/components/sections/glass-card.module.css";
import styles from "./landing.module.css";

const responsiveIcons = [ComplexityIcon, ExpenseIcon, ExposureIcon];

const heroMarkDepths = [0, 4, 8, 12, 16];

export function HeroSection() {
  return <section id="home" className={styles.hero} aria-labelledby="home-heading">
      <MotionRegion className={styles.heroLayout} reveal={false}>
        <div className={styles.heroCopy}>
          <p className={styles.heroEyebrow}>{home.hero.eyebrow}</p>
          <h1 id="home-heading">
            <span className={styles.heroLead}>Settle</span>
            <span className={styles.heroRest}>for Less</span>
          </h1>
          <p className={styles.heroAccent}><strong>Execute</strong> and <strong>Custody</strong><br />for Less, Too.</p>
        </div>
        <div className={styles.heroSymbol} aria-hidden="true">
          <div className={styles.heroSymbolScene}>
            <span className={styles.heroSymbolGlow} />
            <div className={styles.heroSymbolSpin}>
              {heroMarkDepths.map((depth) => (
                <span key={depth} className={styles.heroSymbolSlice} style={{ transform: `translateZ(${depth}px)` }}>
                  <BrandMark />
                </span>
              ))}
              <span className={styles.heroSymbolFace}><BrandMark /></span>
            </div>
          </div>
        </div>
      </MotionRegion>
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
