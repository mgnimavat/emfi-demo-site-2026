import { MotionRegion } from "@/components/sections/landing/motion-region";
import { BrandMark } from "@/components/sections/landing/icons";
import { home5 as home } from "@/content/home-5";
import landing from "@/components/sections/landing/landing.module.css";
import styles from "./hero.module.css";

export function HomeV3Hero() {
  return <section id="home" className={`${landing.hero} ${styles.hero}`} aria-labelledby="home-heading">
    <MotionRegion className={`${landing.heroLayout} ${styles.layout}`} reveal={false}>
      <div className={landing.heroCopy}>
        <p className={styles.eyebrow}>{home.hero.eyebrow}</p>
        <h1 id="home-heading">
          <span className={styles.headlineLead}>Settle</span>
          <span className={styles.headlineRest}>for Less</span>
        </h1>
        <p className={`${landing.heroAccent} ${styles.accent}`}><strong>Execute</strong> and <strong>Custody</strong><br />for Less, Too.</p>
      </div>
      <div className={`${landing.heroSymbol} ${styles.symbol}`}><BrandMark animated /></div>
    </MotionRegion>
  </section>;
}
