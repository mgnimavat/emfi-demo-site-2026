import emfiStyles from "@/components/emfi-sections/sections.module.css";
import { dictionaries, type AboutCopy } from "@/lib/i18n";
import styles from "./about-hero.module.css";

export const AboutHero = ({ copy = dictionaries.en.about }: { copy?: AboutCopy }) => {
  const hero = copy.hero;
  const accentLines = hero.accent.split("\n");
  return (
    <section className={`${styles.hero} ${emfiStyles.chapter}`} aria-labelledby="about-hero-heading">
      <div className={emfiStyles.lockup}>
        <h1 id="about-hero-heading" className={emfiStyles.headline}>{hero.lead}</h1>
        <p className={emfiStyles.subheadline}>
          {accentLines.map((line, index) => (
            <span key={`${line}-${index}`}>
              {index > 0 ? <br /> : null}
              {line}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
};
