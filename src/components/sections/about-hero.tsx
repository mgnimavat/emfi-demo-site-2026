import Link from "next/link";
import { BrandMark, ArrowIcon } from "@/components/sections/landing/icons";
import { MotionRegion } from "@/components/sections/landing/motion-region";
import styles from "./about-hero.module.css";

export function AboutHero() {
  return <section className={styles.hero} aria-labelledby="about-hero-heading">
    <MotionRegion reveal={false} className={styles.layout}>
      <div className={styles.copy}>
        <h1 id="about-hero-heading" aria-label="A decade of building direct access."><span>A decade</span><span>of building.</span></h1>
        <p className={styles.subtitle}>Direct access.</p>
        <Link href="#about-journey" className={styles.action}>Explore our journey <ArrowIcon /></Link>
      </div>
      <figure className={styles.decade} aria-label="10 years of EMFI, 2016 to 2026">
        <div className={styles.numeral} aria-hidden="true"><span>1</span><span className={styles.zero}>0</span></div>
        <figcaption className={styles.years}>Years of</figcaption>
        <div className={styles.logoSpace} aria-hidden="true" />
        <div className={styles.decadeMark} aria-hidden="true"><span className={styles.symbol}><BrandMark /></span></div>

      </figure>
    </MotionRegion>
  </section>;
}
