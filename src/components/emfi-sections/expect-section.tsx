import { ArrowDown } from "lucide-react";
import { HeroRotatingText } from "@/components/sections/hero-rotating-text";
import styles from "./sections.module.css";

const rewriteWords = ["Runaround.", "Friction.", "Bureaucracy."];

export function ExpectSection({ showPoints = true, raiseContent = false, rewriteLastWord = false, heroCue = false }: { showPoints?: boolean; raiseContent?: boolean; rewriteLastWord?: boolean; heroCue?: boolean }) {
  return (
    <section id="expect" data-screen-label="02 Why EMFI" style={{ position: "relative", background: "radial-gradient(60% 120% at 50% 0%,rgba(162,194,253,.16),transparent 70%)", zIndex: raiseContent ? undefined : 1, color: "#FFFFFF" }}>
      <div className={styles.lockup} style={raiseContent ? { position: "relative", zIndex: 2 } : undefined}>
        <p className={styles.eyebrow}><span className={styles.eyebrowMark} aria-hidden="true" /><span>Why EMFI</span></p>
        <h2 className={styles.headline}>Institutional<br />Infrastructure.</h2>
        <p className={styles.subheadline} aria-label={rewriteLastWord ? rewriteWords.map((word) => `Without the Institutional ${word}`).join(" ") : undefined}>Without the Institutional<br />{rewriteLastWord ? <HeroRotatingText words={rewriteWords} /> : "Runaround."}</p>
        {showPoints ? <p className={styles.points}>Direct. Responsive. Dependable.</p> : null}
      </div>
      {heroCue ? (
        <a className={`${styles.heroCue} section-bottom-cue`} href="#direct">
          <span className="section-bottom-cue-label"><span>Why EMFI</span></span>
          <ArrowDown size={16} strokeWidth={1.75} aria-hidden="true" />
        </a>
      ) : null}
    </section>
  );
}
