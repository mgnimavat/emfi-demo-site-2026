import { MotionRegion } from "@/components/sections/landing/motion-region";
import styles from "./about-hero.module.css";

export function AboutHero() {
  return <section className={styles.hero} aria-labelledby="about-hero-heading">
    <MotionRegion reveal={false} className={styles.layout}>
      <div className={styles.copy}>
        <p className={styles.eyebrow}>10 years of EMFI</p>
        <h1 id="about-hero-heading" className={styles.longHeading}><span>Institutional Focus,</span><span>Human Service.</span></h1>
      </div>
    </MotionRegion>
  </section>;
}
