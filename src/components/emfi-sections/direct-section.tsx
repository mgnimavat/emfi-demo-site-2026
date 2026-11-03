"use client";

import { useLayoutEffect, useRef, type RefObject } from "react";
import { useReducedMotion } from "framer-motion";
import { cardStyle, centeredCardSpace } from "./css";
import { DirectRouteAnimation } from "./direct-route-animation";
import { SectionAction, SectionCopy, SectionFooterBody } from "./outcomes";
import { ReplayButton } from "./replay-button";
import styles from "./sections.module.css";
import type { dirVals } from "./values";
import { sectionFrame, sectionPad, useWhyActive, useWhyEngaged, useWhyPinned, useWhyStep, WhyMarker } from "./why-flow";

export function DirectSection({
  cols,
  cardRef,
  canReplay,
  onReplay,
  values,
  showRouteTitle = false,
  showReplay = true,
  stepLabel = "Handover",
  light = false,
  step,
  centered = false,
  eyebrow,
  body = "Fewer unnecessary intermediaries.\nA more direct route to market.",
  shortWhy = false,
  pairedCue = false,
}: {
  cols: string;
  cardRef: RefObject<HTMLDivElement | null>;
  canReplay: boolean;
  onReplay: () => void;
  values: ReturnType<typeof dirVals>;
  showRouteTitle?: boolean;
  showReplay?: boolean;
  stepLabel?: string;
  light?: boolean;
  step?: number;
  centered?: boolean;
  eyebrow?: string;
  body?: string;
  shortWhy?: boolean;
  pairedCue?: boolean;
}) {
  const { dCount, dNote, dRouteTitle } = values;
  const marked = step != null;
  const active = useWhyActive(step ?? 0);
  const pinned = useWhyPinned();
  const stepNow = useWhyStep();
  const engaged = useWhyEngaged();
  const showing = pinned && engaged && marked && stepNow === step;
  const replayRef = useRef(onReplay);
  const reduceMotion = useReducedMotion();

  useLayoutEffect(() => {
    replayRef.current = onReplay;
  }, [onReplay]);

  useLayoutEffect(() => {
    if (!showing) return;
    replayRef.current();
  }, [showing]);
  const routeCols = cols.includes("52fr") ? "minmax(0, 1fr) minmax(0, calc((100% - 30px) * 0.52 + 150px))" : cols;

  return (
    <section id="direct" data-screen-label="03 More direct" data-why-step={marked ? "" : undefined} style={{ position: "relative", height: pinned ? "100%" : undefined, background: pinned && light && !reduceMotion ? "transparent" : light ? "#ffffff" : "radial-gradient(50% 60% at 0% 20%,rgba(162,194,253,.1),transparent 70%)", zIndex: light ? undefined : 1, color: light ? "#071832" : "#FFFFFF" }}>
      {marked && step ? <WhyMarker n={step} active={active} /> : null}
      <div className={[light ? styles.lightCopy : "", pinned ? styles.pinStack : ""].filter(Boolean).join(" ") || undefined} style={{ position: "relative", zIndex: light ? 2 : undefined, maxWidth: 1320, margin: "0 auto", padding: sectionPad(marked, !light, pinned), borderTop: pinned ? "none" : light ? "1px solid rgba(7,24,50,.08)" : "1px solid rgba(162,194,253,.16)", ...sectionFrame(pinned, centered, routeCols) }}>
        {marked && !eyebrow ? <p className={styles.whyKicker} data-why-origin style={centered || pinned ? { width: "100%", justifyContent: "center", marginBottom: 0 } : undefined}>Why EMFI</p> : null}
        <div style={{ position: "relative", width: pinned ? "min(100%, 560px)" : undefined }}>
          <SectionCopy
            title="Direct."
            eyebrow={eyebrow}
            plainEyebrow={pinned && Boolean(eyebrow)}
            origin={marked && Boolean(eyebrow)}
            body={shortWhy && pinned ? undefined : body}
            action={pinned ? undefined : { href: "/services/settlement-custody", label: "Learn More" }}
            tone={light ? "light" : "dark"}
            align={centered || pinned ? "center" : "start"}
          />
        </div>
        <div ref={cardRef} className={pinned ? styles.pinVisual : undefined} style={centered && !pinned ? { ...cardStyle, width: "100%", paddingTop: `calc(${cardStyle.paddingTop} + ${centeredCardSpace})`, paddingBottom: `calc(${cardStyle.padding} + ${centeredCardSpace})` } : cardStyle}>
          {showReplay && canReplay ? <ReplayButton onClick={onReplay} /> : null}
          {showRouteTitle ? <p className={centered ? `${styles.routeTitle} ${styles.routeTitleCenter}` : styles.routeTitle}>{pinned ? null : <span aria-hidden="true" className={styles.eyebrowMark} />}<span className={dRouteTitle === "EMFI Route" ? styles.routeTitleEmfi : dRouteTitle === "Conventional Route" ? styles.routeTitleConventional : undefined}>{dRouteTitle}</span>{centered && !pinned ? <span aria-hidden="true" className={styles.eyebrowMark} /> : null}</p> : null}
          <DirectRouteAnimation values={values} stepLabel={stepLabel} pinned={pinned} />
          {showRouteTitle ? null : (
            <div style={{ marginTop: 12, paddingTop: 14, borderTop: "1px solid rgba(162,194,253,.18)", display: "flex", justifyContent: "center", alignItems: "baseline", gap: 10 }}>
              {dNote ? <span style={{ fontSize: 13, fontWeight: 600, color: "#B1C0E2" }}>{dNote}</span> : null}
              <span style={{ fontSize: 14, fontWeight: 700, color: "#CBD2E8" }}>Handovers</span>
              <strong style={{ minWidth: ".7em", fontSize: 30, fontWeight: 800, letterSpacing: "-.03em", color: "#FFFFFF" }}>{dCount}</strong>
            </div>
          )}
        </div>
        {pinned ? (shortWhy ? <SectionFooterBody body={body} tone={light ? "light" : "dark"} cueHref={pairedCue ? "/services/settlement-custody" : undefined} /> : <SectionAction href="/services/settlement-custody" label="Learn More" />) : null}
      </div>
    </section>
  );
}
