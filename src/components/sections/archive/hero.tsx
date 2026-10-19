import type { ReactNode } from "react";
import { BrandSign } from "@/components/brand/logo";
import { FadeIn } from "@/components/motion/fade-in";
import { ArchiveTypewriter } from "./typewriter";
import styles from "./theme.module.css";

export function ArchiveHero({ title, body, visual, rotate = false, prefix }: { title: string; body: string; visual?: ReactNode; rotate?: boolean; prefix?: string }) {
  const accent = prefix ? title.replace(/\s+/g, " ").replace(prefix, "").trim() : "";
  const words = rotate ? title.split(/[.\n]+/).map((word) => word.trim()).filter(Boolean).map((word) => `${word}.`) : [];
  return (
    <section className={`${styles.hero} ${visual ? styles.decadeHero : ""}`}>
      <div className={styles.container}>
        <div className={styles.heroGrid}>
          <FadeIn className={styles.heroCopy}>
            <h1 className={`${styles.heroTitle} ${prefix ? styles.editorialTitle : ""}`} aria-label={title.replace(/\n/g, " ")}>
              {rotate ? <ArchiveTypewriter words={words} /> : prefix ? <><span className={styles.heroPrefix}>{prefix}</span><span className={styles.heroAccent}>{accent}</span></> : title}
            </h1>
            <p>{body}</p>
          </FadeIn>
          <FadeIn delay={0.14} className={styles.heroVisual}>{visual ?? <BrandSign className={styles.heroMark} />}</FadeIn>
        </div>
      </div>
    </section>
  );
}
