import { MotionRegion } from "@/components/sections/landing/motion-region";
import styles from "../about-hero.module.css";

export function ContactHero() {
  return <section className={styles.hero} aria-labelledby="contact-hero-heading">
    <MotionRegion reveal={false} className={styles.layout}>
      <div className={styles.copy}>
        <p className={styles.eyebrow}>Contact EMFI</p>
        <h1 id="contact-hero-heading"><span>Let’s</span><span>Discuss.</span></h1>
      </div>
    </MotionRegion>
  </section>;
}
