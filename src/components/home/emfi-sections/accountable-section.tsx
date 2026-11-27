"use client";

import { useServiceLocale } from '@/ui/hooks/useServiceLocale';

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { trust } from "@/content/trust";
import { cardStyle, centeredCardSpace } from "./css";
import { SectionAction, SectionCopy, SectionFooterBody } from "./outcomes";
import { ReplayButton } from "./replay-button";
import chapterStyles from "./sections.module.css";
import styles from "./accountable.module.css";
import { sectionFrame, sectionPad, useWhyActive, useWhyEngaged, useWhyPinned, useWhySplit, useWhyStep, WhyMarker } from "./why-flow";

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
  "/brand/regulators/fca.svg?v=2": "/brand/regulators/fca-light.svg",
  "/brand/regulators/dfsa.png": "/brand/regulators/dfsa-light.png",
  "/brand/regulators/cima.png": "/brand/regulators/cima-light.png",
  "/brand/auditors/baker-tilly.png": "/brand/auditors/baker-tilly-light.png",
  "/brand/auditors/buzzacott.png": "/brand/auditors/buzzacott-light.png",
  "/brand/auditors/bdo.png": "/brand/auditors/bdo-light.png",
  "/brand/standing/emta.svg": "/brand/standing/emta-light.svg",
  "/brand/standing/cisi.png": "/brand/standing/cisi-light.png",
  "/brand/standing/bloomberg.png": "/brand/standing/bloomberg-light.png",
};
const inkMarkSrc: Record<string, string> = {
  "/brand/regulators/fca.svg?v=2": "/brand/regulators/fca-brand.svg",
  "/brand/regulators/dfsa.png": "/brand/regulators/dfsa-brand.png",
  "/brand/regulators/cima.png": "/brand/regulators/cima-brand.png",
  "/brand/auditors/baker-tilly.png": "/brand/auditors/baker-tilly-brand.png",
  "/brand/auditors/buzzacott.png": "/brand/auditors/buzzacott-brand.png",
  "/brand/auditors/bdo.png": "/brand/auditors/bdo-brand.png",
  "/brand/standing/emta.svg": "/brand/standing/emta-brand.svg",
  "/brand/standing/cisi.png": "/brand/standing/cisi-brand.png",
  "/brand/standing/bloomberg.png": "/brand/standing/bloomberg-brand.png",
  "/brand/press/reuters.svg": "/brand/press/reuters-brand.svg",
  "/brand/press/wsj.svg": "/brand/press/wsj-brand.svg",
  "/brand/press/nyt.svg": "/brand/press/nyt-brand.svg",
};
const grayMarkSrc: Record<string, string> = {
  "/brand/standing/cisi.png": "/brand/standing/cisi-gray.png",
};

function StandardsEyebrow({ centered = false }: { centered?: boolean }) {
  const { t } = useServiceLocale();
  const classes = [styles.standardsTitle, centered ? styles.standardsCenter : ""].filter(Boolean).join(" ");
  return (
    <p className={classes}>
      <span aria-hidden="true" className={chapterStyles.eyebrowMark} />
      {t("The standard behind the service")}{centered ? <span aria-hidden="true" className={chapterStyles.eyebrowMark} /> : null}
    </p>
  );
}

function StandardsPanel({ centered = false }: { centered?: boolean }) {
  const { t } = useServiceLocale();
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
            key={t(line)}
            className={styles.standardsLine}
            style={{ animationDelay: `${index * 0.18}s` }}
            onAnimationEnd={(event) => {
              if (event.target !== event.currentTarget || index !== standards.length - 1) return;
              setReady(true);
            }}
          >
            <span className={styles.standardsPull}>
              <span className={styles.standardsNum} aria-hidden="true">{index + 1}.</span>
              <span className={styles.standardsWord}>{t(line)}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

type LogoItem = {
  name: string;
  src?: string;
  width?: number;
  height?: number;
  entities?: readonly string[];
  textLogo?: "risk";
};

type EvidenceSlideItem = {
  title: string;
  kind: "logos";
  items: readonly LogoItem[];
};

const slides: EvidenceSlideItem[] = [
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
      { name: "LSEG", src: "/brand/standing/lseg.png", width: 1067, height: 1040 },
      { name: "Risk Intelligence", textLogo: "risk" },
      { name: "Bloomberg", src: "/brand/standing/bloomberg.png", width: 280, height: 56 },
    ] satisfies LogoItem[],
  },
  {
    title: "Quoted in",
    kind: "logos" as const,
    items: [
      { name: "Reuters", src: "/brand/press/reuters.svg", width: 280, height: 70 },
      { name: "The Wall Street Journal", src: "/brand/press/wsj.svg", width: 64, height: 64 },
      { name: "The New York Times", src: "/brand/press/nyt.svg", width: 184, height: 25 },
    ] satisfies LogoItem[],
  },
];

/** Dependable split slider (home and Dependable page hero): fund and legal providers take the middle slot. */
const splitLogoSlides: readonly EvidenceSlideItem[] = [
  slides[1], // Audited by
  {
    title: "Fund and legal partners",
    kind: "logos" as const,
    items: [
      { name: "Dechert", src: "/images/fund-providers/dechert.png", width: 1024, height: 1024 },
      { name: "Walkers", src: "/images/fund-providers/walkers.jpg", width: 1797, height: 614 },
      { name: "Apex", src: "/images/fund-providers/apex.svg", width: 550, height: 514 },
    ],
  },
  slides[2], // Connected to
];

function plainTitle(slide: EvidenceSlideItem) {
  return slide.title.replace(/\.$/, "");
}

function logoEntities(item: LogoItem) {
  return item.entities?.length ? item.entities : null;
}

function PlainEvidenceLogos({ slide, ink = false, gray = false }: { slide: EvidenceSlideItem; ink?: boolean; gray?: boolean }) {
  const { t } = useServiceLocale();
  const marks = gray ? { ...brandMarkSrc, ...grayMarkSrc } : ink ? inkMarkSrc : brandMarkSrc;
  return (
    <div className={styles.plainRow}>
      {(slide.items as LogoItem[]).map((item) => {
        const entities = logoEntities(item);
        const large = slide.title.startsWith("Authorised");
        return (
          <div
            key={item.name}
            className={[
              styles.plainItem,
              large && styles.plainItemLarge,
              item.name === "Financial Conduct Authority" && styles.plainItemFca,
              item.name === "BDO" && styles.plainItemBdo,
              item.name === "Cayman Islands Monetary Authority" && styles.plainItemCima,
              item.name === "Dubai Financial Services Authority" && styles.plainItemDfsa,
              item.name === "The Wall Street Journal" && styles.plainItemWsj,
              navyProviderNames.has(item.name) && styles.plainItemNavy,
              item.name === "Walkers" && styles.plainItemNavyWide,
              item.name === "CISI" && styles.plainItemCisi,
              item.name === "LSEG" && styles.plainItemLseg,
              item.textLogo === "risk" && styles.plainItemRisk,
              item.name === "Bloomberg" && styles.plainItemBloomberg,
              entities && styles.plainItemWithEntities,
            ].filter(Boolean).join(" ")}
          >
            <div className={styles.plainLogo}>
              {item.textLogo === "risk" ? (
                <p className={styles.riskLogo}>
                  <span className={styles.riskKicker}>{t("Risk Intelligence")}</span>
                  <span className={styles.riskWord}>World-Check</span>
                  <span className={styles.riskRule} aria-hidden="true" />
                  <span className={styles.riskWord}>Media Check</span>
                </p>
              ) : (
                <Image src={marks[item.src!] ?? item.src!} alt={item.name} width={item.width ?? 1} height={item.height ?? 1} unoptimized />
              )}
            </div>
            {entities ? (
              <ul className={styles.plainEntities}>
                {entities.map((entity) => (
                  <li key={entity}>{entity}</li>
                ))}
              </ul>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function PlainEvidenceContent({ slide, ink = false, gray = false }: { slide: EvidenceSlideItem; ink?: boolean; gray?: boolean }) {
  const { t } = useServiceLocale();
  return (
    <>
      <h3 className={styles.plainTitle}>{t(plainTitle(slide))}</h3>
      <PlainEvidenceLogos slide={slide} ink={ink} gray={gray} />
    </>
  );
}

/** Space between stacked logo rows. The viewport grows to keep the gap below the active row visible. */
const LOGO_ROW_GAP = 10;
/** Portion of the next logo row kept in view. The previous row stays out of frame. */
const LOGO_ROW_PEEK_NEXT = 0.5;

function SplitPeekCarousel({
  deck,
  index,
  ink = false,
  gray = false,
  reduceMotion = false,
}: {
  deck: readonly EvidenceSlideItem[];
  index: number;
  ink?: boolean;
  gray?: boolean;
  reduceMotion?: boolean;
}) {
  const { t } = useServiceLocale();
  const viewportRef = useRef<HTMLDivElement>(null);
  const prevIndexRef = useRef(index);
  const [metrics, setMetrics] = useState({ viewport: 0, slide: 0 });
  const count = deck.length;
  const loop = useMemo(() => [...deck, ...deck, ...deck], [deck]);
  const active = ((index % count) + count) % count;
  const [pos, setPos] = useState(count + active);
  const [instant, setInstant] = useState(false);

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const measure = () => {
      const slideEl = viewport.querySelector<HTMLElement>("[data-dependable-slide]");
      const slide = slideEl?.offsetHeight ?? 0;
      if (slide <= 0) return;
      /* Active logos, 10px gap, 0.5 of the next logos. The previous row stays above the frame. */
      const next = {
        viewport: slide * (1 + LOGO_ROW_PEEK_NEXT) + LOGO_ROW_GAP,
        slide,
      };
      setMetrics((current) => (current.slide === next.slide && current.viewport === next.viewport ? current : next));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(viewport);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const prev = prevIndexRef.current;
    prevIndexRef.current = index;
    const prevMod = ((prev % count) + count) % count;
    const nextMod = ((index % count) + count) % count;
    if (prev === index) return;

    /* Normal autoplay step (including wrap from last → first). */
    if ((prevMod + 1) % count === nextMod) {
      setPos((current) => current + 1);
      return;
    }

    /* Replay / hard jump — snap onto the middle copy. */
    setInstant(true);
    setPos(count + nextMod);
  }, [index, count]);

  useEffect(() => {
    if (pos < count * 2) return;
    const timeout = window.setTimeout(() => {
      setInstant(true);
      setPos((current) => current - count);
    }, reduceMotion ? 0 : 640);
    return () => window.clearTimeout(timeout);
  }, [pos, count, reduceMotion]);

  useEffect(() => {
    if (!instant) return;
    const id = window.requestAnimationFrame(() => setInstant(false));
    return () => window.cancelAnimationFrame(id);
  }, [instant, pos]);

  const y =
    metrics.slide > 0
      ? -(pos * (metrics.slide + LOGO_ROW_GAP))
      : 0;
  const activeItem = deck[active];

  return (
    <div className={styles.splitCarousel}>
      {/* Navy tint for the fund and legal providers; white fields drop out. Used by .plainItemNavy. */}
      <svg
        style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <filter id="dependable-hero-navy" colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -.6378 -2.1456 -.2166 0 3" />
            <feComposite in2="SourceAlpha" operator="in" result="ink" />
            <feFlood floodColor="var(--text-primary, #071832)" />
            <feComposite in2="ink" operator="in" />
          </filter>
        </defs>
      </svg>
      <h3 className={styles.splitCarouselTitle} key={activeItem.title}>
        {t(plainTitle(activeItem))}
      </h3>
      <div
        ref={viewportRef}
        className={styles.splitCarouselViewport}
        style={metrics.viewport > 0 ? { height: metrics.viewport } : undefined}
      >
        <motion.div
          className={styles.splitCarouselTrack}
          style={{ gap: LOGO_ROW_GAP }}
          animate={{ y }}
          transition={
            instant || reduceMotion
              ? { duration: 0 }
              : { duration: 0.62, ease: [0.22, 1, 0.36, 1] }
          }
        >
          {loop.map((item, i) => {
            const isActive = i === pos;
            return (
              <div
                key={`${item.title}-${i}`}
                className={styles.splitCarouselSlide}
                data-dependable-slide=""
                data-active={isActive ? "true" : "false"}
                aria-hidden={isActive ? undefined : true}
              >
                <div className={styles.splitCarouselPanel}>
                  <PlainEvidenceLogos slide={item} ink={ink} gray={gray} />
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
      <p className={styles.slideDisclaimer}>
        {t("Disclaimer: These names and logos identify specific EMFI relationships and do not imply endorsement. Permissions apply only to the relevant entity.")}
      </p>
    </div>
  );
}

/** Fund and legal providers in the Dependable hero are tinted navy, matching the Regulated section. */
const navyProviderNames = new Set(["Apex", "Walkers", "Dechert"]);

export function DependablePeekSlide() {
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % splitLogoSlides.length);
    }, HOLD_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className={`${styles.splitEvidence} ${styles.heroSlide}`}>
      <SplitPeekCarousel
        deck={splitLogoSlides}
        index={index}
        ink
        reduceMotion={Boolean(reduceMotion)}
      />
    </div>
  );
}

function EvidenceSlide({ slide, plain = false, centered = false, brandLogos = false, open = false, ink = false, gray = false }: { slide: EvidenceSlideItem; plain?: boolean; centered?: boolean; brandLogos?: boolean; open?: boolean; ink?: boolean; gray?: boolean }) {
  const { t } = useServiceLocale();
  const title = plain || open ? slide.title.replace(/\.$/, "") : slide.title;
  if (open) {
    return (
      <div className={styles.plainSlide}>
        <PlainEvidenceContent slide={slide} ink={ink} gray={gray} />
      </div>
    );
  }
  return (
    <>
      <div className={centered ? `${styles.head} ${styles.headCenter}` : styles.head}>
        <h3 className={styles.title}>{t(title)}</h3>
        {plain ? null : <span className={styles.rule} />}
      </div>
      <div className={[styles.logos, brandLogos && styles.brandLogos, brandLogos && slide.title.startsWith("Authorised") && styles.authorityLogos].filter(Boolean).join(" ")}>
        {slide.items.map((item) => (
          <div key={item.name} className={[styles.logoCard, brandLogos && (item.name.startsWith("Dubai") || item.name.startsWith("Cayman")) && styles.markLogo, brandLogos && (item.name.startsWith("Cayman") || item.name.startsWith("Baker")) && styles.largeLogo].filter(Boolean).join(" ")}>
            <Image src={(item.src && brandLogos ? brandLogoSrc[item.src] : item.src) ?? ""} alt={item.name} width={item.width} height={item.height} unoptimized />
          </div>
        ))}
      </div>
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
  brandInk = false,
  grayLogos = false,
  pairedCue = false,
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
  brandInk?: boolean;
  grayLogos?: boolean;
  pairedCue?: boolean;
}) {
  const { t } = useServiceLocale();
  const [index, setIndex] = useState(0);
  const [run, setRun] = useState(0);
  const marked = step != null;
  const active = useWhyActive(step ?? 0);
  const pinned = useWhyPinned();
  const split = useWhySplit();
  const stepNow = useWhyStep();
  const engaged = useWhyEngaged();
  const showing = pinned && engaged && marked && stepNow === step;
  const reduceMotion = useReducedMotion();
  const solidLight = light && (!pinned || split || Boolean(reduceMotion));
  const deck = split ? splitLogoSlides : slides;
  const slide = deck[index % deck.length] ?? deck[0];
  const splitLead = "Institutional safeguards.\nClear accountability.";
  const splitBody =
    "The details matter: regulated entities, client asset arrangements, reconciliations, independent professional oversight and a clear understanding of fees. These are the foundations behind the services EMFI provides.";

  useLayoutEffect(() => {
    if (!showing || staticStandards || !canReplay) return;
    setIndex(0);
    setRun((current) => current + 1);
  }, [showing, staticStandards, canReplay]);

  useEffect(() => {
    if (!canReplay || staticStandards || (pinned && !showing)) return;
    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % deck.length);
    }, HOLD_MS);
    return () => window.clearInterval(id);
  }, [canReplay, run, staticStandards, pinned, showing, deck.length]);

  function replay() {
    setIndex(0);
    setRun((current) => current + 1);
  }

  const evidenceCarousel = (
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
              transition={{ duration: reduceMotion ? 0.01 : 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              {t(plainTitle(slide))}
            </motion.h3>
          </AnimatePresence>
        </div>
        <div className={styles.plainSlideViewport}>
          <AnimatePresence mode="wait">
            <motion.div
              key={`logos-${run}-${slide.title}`}
              className={styles.plainSlideContent}
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: "55%", rotateX: 55 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: "-55%", rotateX: -55 }}
              transition={{ duration: reduceMotion ? 0.01 : 0.48, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: "center center" }}
            >
              <PlainEvidenceLogos slide={slide} ink={brandInk} gray={grayLogos} />
            </motion.div>
          </AnimatePresence>
        </div>
        <p className={styles.slideDisclaimer}>
          {t("Disclaimer: These names and logos identify specific relationships with EMFI entities. Their inclusion does not imply endorsement or recommendation. Regulatory permissions, frameworks, audit appointments and professional designations apply only to the relevant entity or activities.")}
        </p>
      </div>
    </div>
  );

  return (
    <section id="accountable" data-screen-label="05 Dependable" data-why-step={marked ? "" : undefined} style={{ position: "relative", height: pinned ? "100%" : undefined, background: solidLight ? "#ffffff" : light ? "transparent" : "radial-gradient(55% 60% at 0% 100%,rgba(128,152,204,.14),transparent 70%)", zIndex: light || raiseContent ? undefined : 1, color: light ? "#071832" : "#FFFFFF" }}>
      {marked && step && !split ? <WhyMarker n={step} active={active} /> : null}
      <div
        className={[light ? chapterStyles.lightCopy : "", pinned ? chapterStyles.pinStack : "", split ? chapterStyles.splitDirect : "", split ? chapterStyles.whyColumns : ""].filter(Boolean).join(" ") || undefined}
        style={{
          position: "relative",
          zIndex: light || raiseContent ? 2 : undefined,
          maxWidth: split ? 1440 : 1320,
          margin: "0 auto",
          padding: split ? "0 clamp(20px, 4vw, 56px)" : sectionPad(marked, !light, pinned),
          borderTop: pinned ? "none" : light ? "1px solid rgba(7,24,50,.08)" : "1px solid rgba(162,194,253,.16)",
          ...sectionFrame(pinned, centered, cols),
          ...(split ? { alignItems: "flex-start", justifyContent: "flex-start", gap: 0 } : null),
        }}
      >
        <div className={split ? chapterStyles.splitDirectCopy : undefined} style={{ position: "relative", width: pinned ? (split ? undefined : "min(100%, 560px)") : undefined }}>
          <SectionCopy
            title="Dependable."
            index={split ? "03" : undefined}
            eyebrow={eyebrow}
            plainEyebrow={pinned && Boolean(eyebrow)}
            lead={split ? splitLead : undefined}
            body={split ? splitBody : shortWhy && pinned ? undefined : body}
            action={pinned ? undefined : { href: "/why-emfi/dependable-operations", label: "Learn More" }}
            tone={light ? "light" : "dark"}
            align={split ? "start" : centered || pinned ? "center" : "start"}
          />
          {pinned && split ? <SectionAction href="/why-emfi/dependable-operations" label="Learn More" align="start" /> : null}
        </div>
        {split ? (
          <div className={`${styles.splitEvidence}${brandInk ? ` ${styles.plainInk}` : ""}`} style={{ width: "100%" }}>
            <SplitPeekCarousel
              deck={splitLogoSlides}
              index={index}
              ink={brandInk}
              gray={grayLogos}
              reduceMotion={Boolean(reduceMotion)}
            />
          </div>
        ) : (
          <div className={pinned ? `${chapterStyles.pinVisual} ${styles.plainVisual}${shortWhy ? ` ${styles.plainWide}` : ""}${brandInk ? ` ${styles.plainInk}` : ""}` : undefined} style={pinned ? { containerType: "inline-size" } : { ...cardStyle, containerType: "inline-size", width: centered ? "100%" : undefined, paddingTop: `calc(${!staticStandards && showReplay && canReplay ? cardStyle.paddingTop : cardStyle.padding}${centered ? ` + ${centeredCardSpace}` : ""})`, paddingBottom: centered ? `calc(${cardStyle.padding} + ${centeredCardSpace})` : cardStyle.padding }}>
            {staticStandards ? <StandardsPanel centered={centered} /> : null}
            {!staticStandards && showReplay && canReplay ? <ReplayButton onClick={replay} /> : null}
            {!staticStandards && canReplay ? (
              shortWhy && pinned ? (
                evidenceCarousel
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
                      <EvidenceSlide slide={slide} plain={standardsEyebrow} centered={centered || pinned} brandLogos={brandLogos} open={pinned} ink={brandInk} gray={grayLogos} />
                    </motion.div>
                  </AnimatePresence>
                </div>
              )
            ) : !staticStandards ? (
              <div className={styles.stack}>
                {slides.map((item) => <EvidenceSlide key={item.title} slide={item} plain={standardsEyebrow} centered={centered || pinned} brandLogos={brandLogos} open={pinned} ink={brandInk} gray={grayLogos} />)}
              </div>
            ) : null}
          </div>
        )}
        {pinned && !split ? (
          shortWhy ? (
            <SectionFooterBody body={body} tone={light ? "light" : "dark"} cueHref={pairedCue ? "/why-emfi/dependable-operations" : undefined} />
          ) : (
            <SectionAction href="/why-emfi/dependable-operations" label="Learn More" />
          )
        ) : null}
      </div>
    </section>
  );
}
