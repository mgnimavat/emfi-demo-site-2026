import { FadeIn } from "@/components/motion/fade-in";
import type { AboutCopy } from "@/lib/i18n";
import styles from "./about-market.module.css";

export const AboutMarket = ({ copy }: { copy: AboutCopy }) => {
  const section = copy.market;
  return (
    <section className={styles.section} aria-labelledby="about-market-heading">
      {/* Soft brand atmosphere on the open side of the split — opposite the headline weight. */}
      <div className={styles.mark} aria-hidden="true" />
      <div className={styles.container}>
        <div className={styles.copy}>
          <FadeIn>
            <h1 id="about-market-heading" className={styles.title}>
              {section.title.map((line, index) => (
                <span key={line}>
                  {line}
                  {index < section.title.length - 1 ? <br /> : null}
                </span>
              ))}
              <span className={styles.dot} aria-hidden="true">.</span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.08}>
            <p className={styles.lead}>{section.body}</p>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};
