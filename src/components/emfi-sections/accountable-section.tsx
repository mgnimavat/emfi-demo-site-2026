"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { trust } from "@/content/trust";
import { cardStyle, centeredCardSpace } from "./css";
import { SectionAction, SectionCopy, SectionFooterBody } from "./outcomes";
import { ReplayButton } from "./replay-button";
import chapterStyles from "./sections.module.css";
import styles from "./accountable.module.css";
import { sectionFrame, sectionPad, useWhyActive, useWhyEngaged, useWhyPinned, useWhyStep, WhyMarker } from "./why-flow";

const HOLD_MS = 3800;
const standards = ["Authorised", "Regulated", "Auditable"] as const;
const brandLogoSrc: Record<string, string> = {
  "/brand/regulators/fca.svg?v=2": "/brand/regulators/fca-white.svg",
  "/brand/regulators/dfsa.png": "/brand/regulators/dfsa-white.png",
  "/brand/regulators/cima.png": "/brand/regulators/cima-white.png",
  "/brand/auditors/baker-tilly.png": "/brand/auditors/baker-tilly-white.png",
  "/brand/auditors/buzzacott.png": "/brand/auditors/buzzacott-white.png",
  "/brand/auditors/bdo.png": "/brand/auditors/bdo-white.png",
};
const brandMarkSrc: Record<string, string> = {
  "/brand/regulators/fca.svg?v=2": "/brand/regulators/fca-brand.svg",
  "/brand/regulators/dfsa.png": "/brand/regulators/dfsa-brand.png",
  "/brand/regulators/cima.png": "/brand/regulators/cima-brand.png",
  "/brand/auditors/baker-tilly.png": "/brand/auditors/baker-tilly-brand.png",
  "/brand/auditors/buzzacott.png": "/brand/auditors/buzzacott-brand.png",
  "/brand/auditors/bdo.png": "/brand/auditors/bdo-brand.png",
  "/brand/standing/emta.svg": "/brand/standing/emta-brand.svg",
  "/brand/standing/cisi.png": "/brand/standing/cisi-brand.png",
  "/brand/standing/bloomberg.png": "/brand/standing/bloomberg-brand.png",
};

function StandardsEyebrow({ centered = false }: { centered?: boolean }) {
  const classes = [styles.standardsTitle, centered ? styles.standardsCenter : ""].filter(Boolean).join(" ");
  return (
    <p className={classes}>
      <span aria-hidden="true" className={chapterStyles.eyebrowMark} />
      The standard behind the service
      {centered ? <span aria-hidden="true" className={chapterStyles.eyebrowMark} /> : null}
    </p>
  );
}

function StandardsPanel({ centered = false }: { centered?: boolean }) {
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
      <StandardsEyebrow centered={centered} />
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
    title: "Authorised by",
    kind: "logos" as const,
    items: [trust.regulators[2], trust.regulators[0], trust.regulators[1]].map((item) => ({
      name: item.name,
      src: item.logo,
      width: item.logoWidth,
      height: item.logoHeight,
    })),
  },
  {
    title: "Regulated under",
    kind: "pills" as const,
    items: trust.regimes.map((item) => item.code).filter((code) => code !== "MIFIDPRU"),
  },
  {
    title: "Audited by",
    kind: "logos" as const,
    items: trust.auditors.map((item) => ({
      name: item.name,
      src: item.logo,
      width: item.logoWidth,
      height: item.logoHeight,
    })),
  },
  {
    title: "Connected to",
    kind: "logos" as const,
    items: [
      { name: "EMTA", src: "/brand/standing/emta.svg", width: 290, height: 85 },
      { name: "CISI", src: "/brand/standing/cisi.png", width: 572, height: 288 },
      { name: "Bloomberg", src: "/brand/standing/bloomberg.png", width: 280, height: 56 },
    ],
  },
  {
    title: "Quoted in",
    kind: "pills" as const,
    items: ["Reuters", "WSJ", "NYT"],
  },
];

function plainTitle(slide: (typeof slides)[number]) {
  return slide.title.replace(/\.$/, "");
}

function PlainEvidenceLogos({ slide }: { slide: (typeof slides)[number] }) {
  return (
    <div className={styles.plainRow}>
      {slide.kind === "logos"
        ? slide.items.map((item) => (
            <div key={item.name} className={[styles.plainItem, item.name === "Financial Conduct Authority" && styles.plainItemFca, item.name === "BDO" && styles.plainItemBdo].filter(Boolean).join(" ")}>
              <Image src={brandMarkSrc[item.src] ?? item.src} alt={item.name} width={item.width} height={item.height} unoptimized />
            </div>
          ))
        : slide.items.map((code) => (
            <div key={code} className={styles.plainItem}>
              <span className={styles.plainLabel}>{code}</span>
            </div>
          ))}
    </div>
  );
}

function PlainEvidenceContent({ slide }: { slide: (typeof slides)[number] }) {
  return (
    <>
      <h3 className={styles.plainTitle}>{plainTitle(slide)}</h3>
      <PlainEvidenceLogos slide={slide} />
    </>
  );
}

function EvidenceSlide({ slide, plain = false, centered = false, brandLogos = false, open = false }: { slide: (typeof slides)[number]; plain?: boolean; centered?: boolean; brandLogos?: boolean; open?: boolean }) {
  const title = plain || open ? slide.title.replace(/\.$/, "") : slide.title;
  if (open) {
    return (
      <div className={styles.plainSlide}>
        <PlainEvidenceContent slide={slide} />
      </div>
    );
  }
  return (
    <>
      <div className={centered ? `${styles.head} ${styles.headCenter}` : styles.head}>
        <h3 className={styles.title}>{title}</h3>
        {plain ? null : <span className={styles.rule} />}
      </div>
      {slide.kind === "logos" ? (
        <div className={[styles.logos, brandLogos && styles.brandLogos, brandLogos && slide.title.startsWith("Authorised") && styles.authorityLogos].filter(Boolean).join(" ")}>
          {slide.items.map((item) => (
            <div key={item.name} className={[styles.logoCard, brandLogos && (item.name.startsWith("Dubai") || item.name.startsWith("Cayman")) && styles.markLogo, brandLogos && (item.name.startsWith("Cayman") || item.name.startsWith("Baker")) && styles.largeLogo].filter(Boolean).join(" ")}>
              <Image src={brandLogos ? brandLogoSrc[item.src] ?? item.src : item.src} alt={item.name} width={item.width} height={item.height} unoptimized />
            </div>
          ))}
        </div>
      ) : (
        <div className={brandLogos ? `${styles.pills} ${styles.brandLogos}` : styles.pills}>
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
  centered = false,
  brandLogos = false,
  eyebrow,
  shortWhy = false,
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
  centered?: boolean;
  brandLogos?: boolean;
  eyebrow?: string;
  shortWhy?: boolean;
}) {
  const [index, setIndex] = useState(0);
  const [run, setRun] = useState(0);
  const marked = step != null;
  const active = useWhyActive(step ?? 0);
  const pinned = useWhyPinned();
  const stepNow = useWhyStep();
  const engaged = useWhyEngaged();
  const showing = pinned && engaged && marked && stepNow === step;
  const reduceMotion = useReducedMotion();
  const slide = slides[index] ?? slides[0];

  useLayoutEffect(() => {
    if (!showing || staticStandards || !canReplay) return;
    setIndex(0);
    setRun((current) => current + 1);
  }, [showing, staticStandards, canReplay]);

  useEffect(() => {
    if (!canReplay || staticStandards || (pinned && !showing)) return;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, HOLD_MS);
    return () => window.clearInterval(id);
  }, [canReplay, run, staticStandards, pinned, showing]);

  function replay() {
    setIndex(0);
    setRun((current) => current + 1);
  }

  return (
    <section id="accountable" data-screen-label="05 Dependable" data-why-step={marked ? "" : undefined} style={{ position: "relative", height: pinned ? "100%" : undefined, background: pinned && light && !reduceMotion ? "transparent" : light ? "#ffffff" : "radial-gradient(55% 60% at 0% 100%,rgba(128,152,204,.14),transparent 70%)", zIndex: light || raiseContent ? undefined : 1, color: light ? "#071832" : "#FFFFFF" }}>
      {marked && step ? <WhyMarker n={step} active={active} /> : null}
      <div className={[light ? chapterStyles.lightCopy : "", pinned ? chapterStyles.pinStack : ""].filter(Boolean).join(" ") || undefined} style={{ position: "relative", zIndex: light || raiseContent ? 2 : undefined, maxWidth: 1320, margin: "0 auto", padding: sectionPad(marked, !light, pinned), borderTop: pinned ? "none" : light ? "1px solid rgba(7,24,50,.08)" : "1px solid rgba(162,194,253,.16)", ...sectionFrame(pinned, centered, cols) }}>
        <div style={{ position: "relative", width: pinned ? "min(100%, 560px)" : undefined }}>
          <SectionCopy
            title="Dependable."
            eyebrow={eyebrow}
            plainEyebrow={pinned && Boolean(eyebrow)}
            body={shortWhy && pinned ? undefined : body}
            action={pinned ? undefined : { href: "/why-emfi", label: "Learn More" }}
            tone={light ? "light" : "dark"}
            align={centered || pinned ? "center" : "start"}
          />
        </div>
        <div className={pinned ? `${chapterStyles.pinVisual} ${styles.plainVisual}` : undefined} style={pinned ? { containerType: "inline-size" } : { ...cardStyle, containerType: "inline-size", width: centered ? "100%" : undefined, paddingTop: `calc(${!staticStandards && showReplay && canReplay ? cardStyle.paddingTop : cardStyle.padding}${centered ? ` + ${centeredCardSpace}` : ""})`, paddingBottom: centered ? `calc(${cardStyle.padding} + ${centeredCardSpace})` : cardStyle.padding }}>
          {staticStandards ? <StandardsPanel centered={centered} /> : null}
          {!staticStandards && showReplay && canReplay ? <ReplayButton onClick={replay} /> : null}
          {!staticStandards && canReplay ? (
            shortWhy && pinned ? (
              <div className={`${styles.stage} ${styles.pinStage} ${styles.plainStage} ${chapterStyles.pinVisualFill}`} aria-live="polite">
                <div className={styles.plainSlide}>
                  <div className={styles.plainTitleSlot}>
                    <AnimatePresence mode="wait">
                      <motion.h3
                        key={`title-${run}-${slide.title}`}
                        className={styles.plainTitle}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      >
                        {plainTitle(slide)}
                      </motion.h3>
                    </AnimatePresence>
                  </div>
                  <div className={styles.plainSlideViewport}>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`logos-${run}-${slide.title}`}
                        className={styles.plainSlideContent}
                        initial={{ opacity: 0, y: "55%", rotateX: 55 }}
                        animate={{ opacity: 1, y: 0, rotateX: 0 }}
                        exit={{ opacity: 0, y: "-55%", rotateX: -55 }}
                        transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
                        style={{ transformOrigin: "center center" }}
                      >
                        <PlainEvidenceLogos slide={slide} />
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            ) : (
              <div className={`${styles.stage}${pinned ? ` ${styles.pinStage} ${styles.plainStage} ${chapterStyles.pinVisualFill}` : ""}`} aria-live="polite">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${run}-${slide.title}`}
                    className={styles.slide}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <EvidenceSlide slide={slide} plain={standardsEyebrow} centered={centered || pinned} brandLogos={brandLogos} open={pinned} />
                  </motion.div>
                </AnimatePresence>
              </div>
            )
          ) : !staticStandards ? (
            <div className={styles.stack}>
              {slides.map((item) => <EvidenceSlide key={item.title} slide={item} plain={standardsEyebrow} centered={centered || pinned} brandLogos={brandLogos} open={pinned} />)}
            </div>
          ) : null}
        </div>
        {pinned ? (shortWhy ? <SectionFooterBody body={body} tone={light ? "light" : "dark"} /> : <SectionAction href="/why-emfi" label="Learn More" />) : null}
      </div>
    </section>
  );
}
