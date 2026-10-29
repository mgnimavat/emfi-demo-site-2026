"use client";

import type { RefObject } from "react";
import { useReducedMotion } from "framer-motion";
import { cardStyle, centeredCardSpace, css } from "./css";
import { MarkSwitch } from "./mark-trace";
import { SectionCopy } from "./outcomes";
import { ReplayButton } from "./replay-button";
import styles from "./sections.module.css";
import type { dirVals } from "./values";
import { sectionPad, useWhyActive, useWhyPinned, WhyMarker } from "./why-flow";

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
}) {
  const { dNodes, dLines, dTok, dHand, dTags, dCount, dNote, dRouteTitle, dStageH, dBandOp, dBandS } = values;
  const marked = step != null;
  const active = useWhyActive(step ?? 0);
  const pinned = useWhyPinned();
  const reduceMotion = useReducedMotion();
  const routeCols = cols.includes("52fr") ? "minmax(0, 1fr) minmax(0, calc((100% - 30px) * 0.52 + 150px))" : cols;

  return (
    <section id="direct" data-screen-label="03 More direct" data-why-step={marked ? "" : undefined} style={{ position: "relative", height: pinned ? "100%" : undefined, background: pinned && light && !reduceMotion ? "transparent" : light ? "#ffffff" : "radial-gradient(50% 60% at 0% 20%,rgba(162,194,253,.1),transparent 70%)", zIndex: light ? undefined : 1, color: light ? "#071832" : "#FFFFFF" }}>
      {marked && step ? <WhyMarker n={step} active={active} /> : null}
      <div className={light ? styles.lightCopy : undefined} style={{ position: "relative", zIndex: light ? 2 : undefined, maxWidth: 1320, margin: "0 auto", padding: sectionPad(marked, !light, pinned), borderTop: pinned ? "none" : light ? "1px solid rgba(7,24,50,.08)" : "1px solid rgba(162,194,253,.16)", display: centered ? "flex" : "grid", flexDirection: centered ? "column" : undefined, gridTemplateColumns: centered ? undefined : routeCols, gap: centered ? 64 : "30px clamp(30px,5vw,30px)", alignItems: centered ? "stretch" : "center" }}>
        {marked && !eyebrow ? <p className={styles.whyKicker} data-why-origin style={centered ? { width: "100%", justifyContent: "center", marginBottom: 0 } : undefined}>Why EMFI</p> : null}
        <div style={{ position: "relative" }}>
          <SectionCopy
            title="Direct."
            eyebrow={eyebrow}
            plainEyebrow={pinned && Boolean(eyebrow)}
            origin={marked && Boolean(eyebrow)}
            body={body}
            action={{ href: "/services/settlement-custody", label: "Learn More" }}
            tone={light ? "light" : "dark"}
            align={centered ? "center" : "start"}
          />
        </div>
        <div ref={cardRef} className={pinned ? styles.pinVisual : undefined} style={centered ? { ...cardStyle, width: "100%", paddingTop: `calc(${cardStyle.paddingTop} + ${centeredCardSpace})`, paddingBottom: `calc(${cardStyle.padding} + ${centeredCardSpace})` } : cardStyle}>
          {showReplay && canReplay ? <ReplayButton onClick={onReplay} /> : null}
          {showRouteTitle ? <p className={centered ? `${styles.routeTitle} ${styles.routeTitleCenter}` : styles.routeTitle}>{pinned ? null : <span aria-hidden="true" className={styles.eyebrowMark} />}<span className={dRouteTitle === "EMFI Route" ? styles.routeTitleEmfi : dRouteTitle === "Conventional Route" ? styles.routeTitleConventional : undefined}>{dRouteTitle}</span>{centered && !pinned ? <span aria-hidden="true" className={styles.eyebrowMark} /> : null}</p> : null}
          <div role="img" aria-label="An instruction moves from You to Settlement agent, Sub-custodian, Custodian and Depository. The same route then shortens to You, EMFI, Depository." style={{ position: "relative", height: pinned ? undefined : dStageH, flex: pinned ? "1 1 auto" : undefined, minHeight: pinned ? 0 : undefined }}>
            <span style={{ position: "absolute", zIndex: 0, borderRadius: 999, background: "linear-gradient(90deg,rgba(162,194,253,.22),rgba(128,152,204,.16),rgba(0,201,167,.22))", opacity: dBandOp, ...css(dBandS) }} />
            {dLines.map((line, index) => (
              <span key={index} style={{ position: "absolute", zIndex: 1, background: line.c, backgroundSize: line.size, backgroundRepeat: line.size ? "no-repeat" : undefined, opacity: line.op, ...css(line.s) }} />
            ))}
            {dNodes.map((n) => (
              <div key={n.name} style={{ position: "absolute", zIndex: 2, left: n.left, top: n.top, width: 0, height: 0, opacity: n.op }}>
                <span style={{ position: "absolute", left: 0, top: 0, display: "grid", placeItems: "center", transform: n.tf, transition: "background .25s ease", ...css(n.dot) }}>
                  {n.sw && n.e ? <MarkSwitch draw={n.e} size={n.ms} /> : null}
                </span>
                <span style={{ position: "absolute", display: "flex", flexDirection: "column", gap: 3, ...css(n.ls) }}>
                  <strong style={{ fontSize: n.fs, fontWeight: 800, lineHeight: 1.2, color: n.nc }}>{n.name}</strong>
                  <span style={{ fontSize: 12, fontWeight: 700, lineHeight: 1.25, color: n.subC, opacity: n.subOp }}>{n.sub}</span>
                </span>
              </div>
            ))}
            <span style={{ position: "absolute", zIndex: 3, left: dHand.left, top: dHand.top, transform: dHand.tf, fontSize: 12, fontWeight: 700, color: "#B1C0E2", whiteSpace: "nowrap", opacity: dHand.op }}>{stepLabel}</span>
            {dTags.map((tag, index) => (
              <span key={index} style={{ position: "absolute", zIndex: 3, left: tag.left, top: tag.top, transform: tag.tf, fontSize: 12, fontWeight: 700, color: "#B1C0E2", whiteSpace: "nowrap", opacity: tag.op }}>{tag.text}</span>
            ))}
            <span style={{ position: "absolute", zIndex: 4, left: dTok.left, top: dTok.top, width: 14, height: 14, margin: "-7px 0 0 -7px", borderRadius: "50%", background: dTok.bg, boxShadow: "0 0 0 4px #0E2242", opacity: dTok.op }} />
          </div>
          {showRouteTitle ? null : (
            <div style={{ marginTop: 12, paddingTop: 14, borderTop: "1px solid rgba(162,194,253,.18)", display: "flex", justifyContent: "center", alignItems: "baseline", gap: 10 }}>
              {dNote ? <span style={{ fontSize: 13, fontWeight: 600, color: "#B1C0E2" }}>{dNote}</span> : null}
              <span style={{ fontSize: 14, fontWeight: 700, color: "#CBD2E8" }}>Handovers</span>
              <strong style={{ minWidth: ".7em", fontSize: 30, fontWeight: 800, letterSpacing: "-.03em", color: "#FFFFFF" }}>{dCount}</strong>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
