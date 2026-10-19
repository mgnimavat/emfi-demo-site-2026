import { MotionRegion } from "@/components/sections/landing/motion-region";
import { HeroTypewriter } from "@/components/sections/landing/typewriter";
import { HomeContactForm } from "@/components/sections/landing/contact-form";
import { ArrowIcon, BrandMark, SectionCurve, TechnologyIcon, PeopleIcon, RelationshipIcon, ResponsibilityIcon, ConnectedIcon } from "@/components/sections/landing/icons";
import styles from "@/components/sections/landing/landing.module.css";


export function HeroSection() {
  return <section id="home" className={styles.hero} aria-labelledby="home-heading">
      <MotionRegion className={styles.heroLayout} reveal={false}>
        <div className={styles.heroCopy}>
          <h1 id="home-heading" aria-label="Settle for less."><span>Settle</span><span>For Less.</span></h1>
          <HeroTypewriter />
          <div className={styles.heroActions}><a href="#contact" className={styles.heroDiscuss}>Discuss your requirements <ArrowIcon /></a></div>
        </div>
        <div className={styles.heroSymbol}><BrandMark animated /></div>
      </MotionRegion>
    </section>;
}

export function ExpectBand() {
  return <section className={styles.expect} aria-labelledby="expect-heading"><MotionRegion><h2 id="expect-heading">Expect More.</h2></MotionRegion></section>;
}

export function ResponsiveSection() {
  return <section id="responsive" className={styles.responsive} aria-labelledby="responsive-heading">
      <SectionCurve />
      <div className={styles.benefitInner}><MotionRegion>
        <h2 id="responsive-heading" className={styles.sectionTitle}>More responsive.</h2>
        <div className={styles.cards}>
          <article className={styles.card}><div className={styles.cardTitle}><span className={styles.cardIcon}><TechnologyIcon /></span><h3>Technology where <span>it helps</span></h3></div><p>Technology provides the structure, visibility and control needed to handle established processes efficiently.</p></article>
          <article className={styles.card}><div className={styles.cardTitle}><span className={styles.cardIcon}><PeopleIcon /></span><h3>People where <span>judgement matters</span></h3></div><p>Experienced teams remain involved where a requirement needs context, coordination or human judgement.</p></article>
        </div>
      </MotionRegion></div>
    </section>;
}

export function AccountabilitySection() {
  return <section id="accountable" className={styles.accountable} aria-labelledby="accountable-heading">
      <SectionCurve />
      <div className={styles.accountableInner}><MotionRegion>
        <h2 id="accountable-heading" className={styles.sectionTitle}>More accountable.</h2>
        <div className={styles.principles}>
          <article><div className={styles.principleTitle}><span><RelationshipIcon /></span><h3>One relationship</h3></div><p>A clear relationship sits at the centre of the work, helping coordinate the relevant teams and services.</p></article>
          <article><div className={styles.principleTitle}><span><ResponsibilityIcon /></span><h3>Clear responsibility</h3></div><p>Defined responsibilities make it clear who is involved and who is responsible for progressing the work.</p></article>
          <article><div className={styles.principleTitle}><span><ConnectedIcon /></span><h3>Connected delivery</h3></div><p>The relationship continues across the relevant stages of the investment process, from instruction through to outcome.</p></article>
        </div>
      </MotionRegion></div>
    </section>;
}

export function ContactSection() {
  return <section id="contact" className={styles.contact} aria-labelledby="contact-heading"><div className={styles.contactInner}><MotionRegion><h2 id="contact-heading">Discuss your requirements.</h2></MotionRegion><HomeContactForm /></div></section>;
}
