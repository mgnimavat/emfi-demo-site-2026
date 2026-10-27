"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { trust } from "@/content/trust";
import { cardStyle } from "./css";
import { SectionCopy } from "./outcomes";
import { ReplayButton } from "./replay-button";
import chapterStyles from "./sections.module.css";
import styles from "./accountable.module.css";
import { sectionPad, useWhyActive, WhyMarker } from "./why-flow";

const HOLD_MS = 3800;
const standards = ["Authorised", "Regulated", "Auditable"] as const;

function StandardsEyebrow({ lead = false }: { lead?: boolean }) {
  return (
    <p className={lead ? `${styles.standardsTitle} ${styles.standardsLead}` : styles.standardsTitle}>
      <span aria-hidden="true" className={chapterStyles.eyebrowMark} />
      The standard behind the service
    </p>
  );
}

function StandardsPanel() {
  const listRef = useRef<HTMLOListElement>(null);
  const reduceMotion = useReducedMotion();
  const inView = useInView(listRef, { once: true, amount: 0.4 });
  const [shown, setShown] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (reduceMotion || inView) setShown(true);
    if (reduceMotion) setReady(true);
  }, [reduceMotion, inView]);

  return (
    <div className={styles.standards}>
      <StandardsEyebrow />
      <ol
        ref={listRef}
        className={styles.standardsLines}
        data-shown={shown ? "true" : undefined}
        data-ready={ready ? "true" : undefined}
      >
        {standards.map((line, index) => (
          <li
            key={line}
            className={styles.standardsLine}
            style={{ animationDelay: `${index * 0.18}s` }}
            onAnimationEnd={(event) => {
              if (event.target !== event.currentTarget || index !== standards.length - 1) return;
              setReady(true);
            }}
          >
            <span className={styles.standardsPull}>
              <span className={styles.standardsNum} aria-hidden="true">{index + 1}.</span>
              <span className={styles.standardsWord}>{line}</span>
            </span>
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

function EvidenceSlide({ slide, plain = false }: { slide: (typeof slides)[number]; plain?: boolean }) {
  const title = plain ? slide.title.replace(/\.$/, "") : slide.title;
  return (
    <>
      <div className={styles.head}>
        <h3 className={styles.title}>{title}</h3>
        {plain ? null : <span className={styles.rule} />}
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
  standardsEyebrow = false,
  raiseContent = false,
  light = false,
  step,
  body = "Institutional safeguards, clear accountability and the relevant regulatory oversight behind the services we provide.",
}: {
  cols: string;
  canReplay: boolean;
  showReplay?: boolean;
  staticStandards?: boolean;
  standardsEyebrow?: boolean;
  raiseContent?: boolean;
  light?: boolean;
  step?: number;
  body?: string;
}) {
  const [index, setIndex] = useState(0);
  const [run, setRun] = useState(0);
  const marked = step != null;
  const active = useWhyActive(step ?? 0);
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
    <section id="accountable" data-screen-label="05 Dependable" data-why-step={marked ? "" : undefined} style={{ position: "relative", background: light ? "#ffffff" : "radial-gradient(55% 60% at 0% 100%,rgba(128,152,204,.14),transparent 70%)", zIndex: light || raiseContent ? undefined : 1, color: light ? "#071832" : "#FFFFFF" }}>
      {marked && step ? <WhyMarker n={step} active={active} /> : null}
      <div className={light ? chapterStyles.lightCopy : undefined} style={{ position: "relative", zIndex: light || raiseContent ? 2 : undefined, maxWidth: 1320, margin: "0 auto", padding: sectionPad(marked), borderTop: light ? "1px solid rgba(7,24,50,.08)" : "1px solid rgba(162,194,253,.16)", display: "grid", gridTemplateColumns: cols, gap: "40px clamp(40px,5vw,80px)", alignItems: "center" }}>
        <SectionCopy
          title="Dependable."
          body={body}
          action={{ href: "/why-emfi", label: "See the standards" }}
          tone={light ? "light" : "dark"}
        />
        <div style={{ ...cardStyle, containerType: "inline-size", paddingTop: !staticStandards && showReplay && canReplay ? cardStyle.paddingTop : cardStyle.padding }}>
          {staticStandards ? <StandardsPanel /> : null}
          {!staticStandards && standardsEyebrow ? <StandardsEyebrow lead /> : null}
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
                  <EvidenceSlide slide={slide} plain={standardsEyebrow} />
                </motion.div>
              </AnimatePresence>
            </div>
          ) : !staticStandards ? (
            <div className={styles.stack}>
              {slides.map((item) => <EvidenceSlide key={item.title} slide={item} plain={standardsEyebrow} />)}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
