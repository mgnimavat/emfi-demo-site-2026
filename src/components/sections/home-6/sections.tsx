import { MotionRegion } from "@/components/sections/landing/motion-region";
import { Button } from "@/components/ui/button";
import { home6 as home } from "@/content/home-6";
import { BrandMark, TechnologyIcon, PeopleIcon, RelationshipIcon, ResponsibilityIcon, ConnectedIcon } from "@/components/sections/landing/icons";
import glass from "@/components/sections/glass-card.module.css";
import styles from "./landing.module.css";

export function HeroSection() {
  return <section id="home" className={styles.hero} aria-labelledby="home-heading">
      <MotionRegion className={styles.heroLayout} reveal={false}>
        <div className={styles.heroCopy}>
          <p className={styles.heroEyebrow}>{home.hero.eyebrow}</p>
          <h1 id="home-heading">
            <span className={styles.heroLead}>Settle</span>
            <span className={styles.heroRest}>for Less</span>
          </h1>
          <p className={styles.heroAccent}><strong>Execute</strong> and <strong>Custody</strong><br />for Less, too.</p>
        </div>
        <div className={styles.heroSymbol} aria-hidden="true">
          <div className={styles.heroSymbolOrbit}>
            <BrandMark />
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
        <h2 id="responsive-heading" className={styles.sectionTitle}>Responsive</h2>
        <div className={`${glass.card} ${styles.principles}`}>
          <article><div className={styles.principleTitle}><span className={styles.principleIcon}><TechnologyIcon /></span><h3>Technology Where <span>It Helps</span></h3></div><p>Technology provides the structure, visibility and control needed to handle established processes efficiently.</p></article>
          <article><div className={styles.principleTitle}><span className={styles.principleIcon}><PeopleIcon /></span><h3>People Where <span>Judgement Matters</span></h3></div><p>Experienced teams remain involved where a requirement needs context, coordination or human judgement.</p></article>
        </div>
      </MotionRegion></div>
    </section>;
}

export function AccountabilitySection() {
  return <section id="accountable" className={styles.accountable} aria-labelledby="accountable-heading">
      <div className={styles.accountableInner}><MotionRegion>
        <h2 id="accountable-heading" className={styles.sectionTitle}>Accountable</h2>
        <div className={styles.cards}>
          <article className={`${glass.card} ${styles.card}`}><div className={styles.cardTitle}><span className={styles.cardIcon}><RelationshipIcon /></span><h3>One <span>Relationship</span></h3></div><p>A clear relationship sits at the centre of the work, helping coordinate the relevant teams and services.</p></article>
          <article className={`${glass.card} ${styles.card}`}><div className={styles.cardTitle}><span className={styles.cardIcon}><ResponsibilityIcon /></span><h3>Clear <span>Responsibility</span></h3></div><p>Defined responsibilities make it clear who is involved and who is responsible for progressing the work.</p></article>
          <article className={`${glass.card} ${styles.card}`}><div className={styles.cardTitle}><span className={styles.cardIcon}><ConnectedIcon /></span><h3>Connected <span>Delivery</span></h3></div><p>The relationship continues across the relevant stages of the investment process, from instruction through to outcome.</p></article>
        </div>
      </MotionRegion></div>
    </section>;
}

export function ContactSection() {
  return <section id="contact" className={styles.contact} aria-labelledby="contact-heading"><MotionRegion className={styles.contactInner}><h2 id="contact-heading">{home.contactCta.title}</h2><p>{home.contactCta.body}</p><Button href="/contact" className={styles.contactAction}>{home.contactCta.action}</Button></MotionRegion></section>;
}
