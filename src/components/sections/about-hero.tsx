import styles from "./about-hero.module.css";

export const AboutHero = () => {
  return <section className={styles.hero} aria-labelledby="about-hero-heading">
    <div className={styles.layout}>
      <div className={styles.copy}>
        <h1 id="about-hero-heading" className={styles.heading}>10 Years of EMFI.</h1>
      </div>
    </div>
  </section>;
};
