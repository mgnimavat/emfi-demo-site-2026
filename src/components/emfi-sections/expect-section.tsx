'use client';

import { useServiceLocale } from '@/ui/hooks/useServiceLocale';

import { ArrowDown } from "lucide-react";
import { HeroRotatingText } from "@/components/sections/hero-rotating-text";
import styles from "./sections.module.css";

const rewriteWords = ["Runaround.", "Friction.", "Bureaucracy."];

export function ExpectSection({ showPoints = true, raiseContent = false, rewriteLastWord = false, heroCue = false }: { showPoints?: boolean; raiseContent?: boolean; rewriteLastWord?: boolean; heroCue?: boolean }) {
  const { t } = useServiceLocale();
  const pointsLabel = t("Direct. Responsive. Dependable.");
  const pointWords = pointsLabel.split(/\.\s*/).map((word) => word.trim()).filter(Boolean);
  return (
    <section id="expect" data-screen-label="02 Why EMFI" style={{ position: "relative", background: "radial-gradient(60% 120% at 50% 0%,rgba(162,194,253,.16),transparent 70%)", zIndex: raiseContent ? undefined : 1, color: "#FFFFFF" }}>
      <div className={styles.lockup} style={raiseContent ? { position: "relative", zIndex: 2 } : undefined}>
        <p className={styles.eyebrow}><span className={styles.eyebrowMark} aria-hidden="true" /><span>{t("Why EMFI")}</span></p>
        <h2 className={styles.headline}>{t("Institutional")}<br />{t("Infrastructure.")}</h2>
        <p className={styles.subheadline} aria-label={rewriteLastWord ? rewriteWords.map((word) => `Without the Institutional ${word}`).join(" ") : undefined}>{t("Without the Institutional")}<br />{rewriteLastWord ? <HeroRotatingText words={rewriteWords} /> : t("Runaround.")}</p>
        {!heroCue && showPoints ? <p className={styles.points}>{pointsLabel}</p> : null}
      </div>
      {heroCue ? (
        <a className={`${styles.heroCueStack} section-bottom-cue`} href="#direct">
          <span className={`${styles.heroCue} ${styles.heroCueInStack} ${styles.heroCueGlass}`}>
            <span className="section-bottom-cue-label"><span>{t("Why EMFI")}</span></span>
            <ArrowDown size={14} strokeWidth={1.75} aria-hidden="true" />
          </span>
          {showPoints ? (
            <>
              <span className={styles.heroCueDivider} aria-hidden="true" />
              <span className={`${styles.points} ${styles.pointsUnderCue}`} aria-label={pointsLabel}>
                {pointWords.map((word) => (
                  <span key={word}>{word}.</span>
                ))}
              </span>
            </>
          ) : null}
        </a>
      ) : null}
    </section>
  );
}
