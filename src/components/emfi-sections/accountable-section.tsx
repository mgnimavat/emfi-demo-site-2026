"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { trust } from "@/content/trust";
import { cardStyle } from "./css";
import { SectionCopy } from "./outcomes";
import { ReplayButton } from "./replay-button";
import chapterStyles from "./sections.module.css";
import styles from "./accountable.module.css";

const HOLD_MS = 3800;
const standards = ["Authorised", "Regulated", "Auditable"] as const;

function StandardsPanel() {
  return (
    <div className={styles.standards}>
      <p className={styles.standardsTitle}>
        <span aria-hidden="true" className={chapterStyles.eyebrowMark} />
        The standard behind the service
      </p>
      <ol className={styles.standardsLines}>
        {standards.map((line, index) => (
          <li key={line} className={styles.standardsLine}>
            <span className={styles.standardsNum} aria-hidden="true">{index + 1}.</span>
            <span className={styles.standardsWord}>{line}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

const slides = [
  {
    title: "Authorised.",
    kind: "logos" as const,
    items: trust.regulators.map((item) => ({
      name: item.name,
      src: item.logo,
      width: item.logoWidth,
      height: item.logoHeight,
    })),
  },
  {
    title: "Regulated.",
    kind: "pills" as const,
    items: trust.regimes.map((item) => item.code),
  },
  {
    title: "Auditable.",
    kind: "logos" as const,
    items: trust.auditors.map((item) => ({
      name: item.name,
      src: item.logo,
      width: item.logoWidth,
      height: item.logoHeight,
    })),
  },
];

function EvidenceSlide({ slide }: { slide: (typeof slides)[number] }) {
  return (
    <>
      <div className={styles.head}>
        <h3 className={styles.title}>{slide.title}</h3>
        <span className={styles.rule} />
      </div>
      {slide.kind === "logos" ? (
        <div className={styles.logos}>
          {slide.items.map((item) => (
            <div key={item.name} className={styles.logoCard}>
              <Image src={item.src} alt={item.name} width={item.width} height={item.height} unoptimized />
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.pills}>
          {slide.items.map((code) => (
            <div key={code} className={styles.pill}>{code}</div>
          ))}
        </div>
      )}
    </>
  );
}

export function AccountableSection({
  cols,
  canReplay,
  showReplay = true,
  staticStandards = false,
  raiseContent = false,
}: {
  cols: string;
  canReplay: boolean;
  showReplay?: boolean;
  staticStandards?: boolean;
  raiseContent?: boolean;
}) {
  const [index, setIndex] = useState(0);
  const [run, setRun] = useState(0);
  const slide = slides[index] ?? slides[0];

  useEffect(() => {
    if (!canReplay || staticStandards) return;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, HOLD_MS);
    return () => window.clearInterval(id);
  }, [canReplay, run, staticStandards]);

  function replay() {
    setIndex(0);
    setRun((current) => current + 1);
  }

  return (
    <section id="accountable" data-screen-label="05 Dependable" style={{ position: "relative", background: "radial-gradient(55% 60% at 0% 100%,rgba(128,152,204,.14),transparent 70%)", zIndex: raiseContent ? undefined : 1, color: "#FFFFFF" }}>
      <div style={{ position: "relative", zIndex: raiseContent ? 2 : undefined, maxWidth: 1320, margin: "0 auto", padding: "clamp(88px,10vw,144px) clamp(20px,4vw,56px)", borderTop: "1px solid rgba(162,194,253,.16)", display: "grid", gridTemplateColumns: cols, gap: "40px clamp(40px,5vw,80px)", alignItems: "center" }}>
        <SectionCopy
          title="Dependable."
          body="Institutional safeguards, clear accountability and the relevant regulatory oversight behind the services we provide."
          action={{ href: "/why-emfi", label: "See the standards" }}
        />
        <div style={{ ...cardStyle, containerType: "inline-size", paddingTop: !staticStandards && showReplay && canReplay ? cardStyle.paddingTop : cardStyle.padding }}>
          {staticStandards ? <StandardsPanel /> : null}
          {!staticStandards && showReplay && canReplay ? <ReplayButton onClick={replay} /> : null}
          {!staticStandards && canReplay ? (
            <div className={styles.stage} aria-live="polite">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${run}-${slide.title}`}
                  className={styles.slide}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                >
                  <EvidenceSlide slide={slide} />
                </motion.div>
              </AnimatePresence>
            </div>
          ) : !staticStandards ? (
            <div className={styles.stack}>
              {slides.map((item) => <EvidenceSlide key={item.title} slide={item} />)}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
