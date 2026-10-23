import { MotionRegion } from "@/components/sections/landing/motion-region";
import { BrandMark } from "@/components/sections/landing/icons";
import { home5 as home } from "@/content/home-5";
import landing from "@/components/sections/landing/landing.module.css";
import styles from "./hero.module.css";

function InvestmentIcon() {
  return (
    <svg className={styles.eyebrowIcon} viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="7" width="18" height="14" rx="2" />
      <path d="M8 7V5.5A2.5 2.5 0 0 1 10.5 3h3A2.5 2.5 0 0 1 16 5.5V7" />
    </svg>
  );
}

export function HomeV4Hero() {
  return <section id="home" className={`${landing.hero} ${styles.hero}`} aria-labelledby="home-heading">
    <MotionRegion className={`${landing.heroLayout} ${styles.layout}`} reveal={false}>
      <div className={landing.heroCopy}>
        <p className={styles.eyebrow}>
          <InvestmentIcon />
          <span>{home.hero.eyebrow}</span>
        </p>
        <h1 id="home-heading">
          <span>Settle</span>
          <span>for Less</span>
        </h1>
        <p className={`${landing.heroAccent} ${styles.accent}`}><strong>Execute</strong> and <strong>Custody</strong><br />for Less, Too.</p>
      </div>
      <div className={`${landing.heroSymbol} ${styles.symbol}`}><BrandMark animated /></div>
    </MotionRegion>
  </section>;
}
