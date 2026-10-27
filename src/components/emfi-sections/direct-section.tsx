"use client";

import type { RefObject } from "react";
import { cardStyle, css } from "./css";
import { MarkSwitch } from "./mark-trace";
import { SectionCopy } from "./outcomes";
import { ReplayButton } from "./replay-button";
import styles from "./sections.module.css";
import type { dirVals } from "./values";
import { sectionPad, useWhyActive, WhyMarker } from "./why-flow";

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
}) {
  const { dNodes, dLines, dTok, dHand, dCount, dNote, dRouteTitle, dStageH, dBandOp, dBandS } = values;
  const marked = step != null;
  const active = useWhyActive(step ?? 0);

  return (
    <section id="direct" data-screen-label="03 More direct" data-why-step={marked ? "" : undefined} style={{ position: "relative", background: light ? "#ffffff" : "radial-gradient(50% 60% at 0% 20%,rgba(162,194,253,.1),transparent 70%)", zIndex: light ? undefined : 1, color: light ? "#071832" : "#FFFFFF" }}>
      {marked && step ? <WhyMarker n={step} active={active} /> : null}
      <div className={light ? styles.lightCopy : undefined} style={{ position: "relative", zIndex: light ? 2 : undefined, maxWidth: 1320, margin: "0 auto", padding: sectionPad(marked), borderTop: light ? "1px solid rgba(7,24,50,.08)" : "1px solid rgba(162,194,253,.16)", display: "grid", gridTemplateColumns: cols, gap: "40px clamp(40px,5vw,80px)", alignItems: "center" }}>
        {marked ? <p className={styles.whyKicker} data-why-origin>Why EMFI</p> : null}
        <SectionCopy
          title="Direct."
          body="Fewer unnecessary intermediaries. A more direct route to market."
          action={{ href: "/services/settlement-custody", label: "Explore direct access" }}
          tone={light ? "light" : "dark"}
        />
        <div ref={cardRef} style={cardStyle}>
          {showReplay && canReplay ? <ReplayButton onClick={onReplay} /> : null}
          {showRouteTitle ? <p className={styles.routeTitle}><span aria-hidden="true" className={styles.eyebrowMark} />{dRouteTitle}</p> : null}
          <div role="img" aria-label="An instruction moves from Client to Settlement agent, Sub-custodian, Custodian and Depository. The same route then shortens to Client, EMFI, Depository." style={{ position: "relative", height: dStageH }}>
            <span style={{ position: "absolute", zIndex: 0, borderRadius: 999, background: "linear-gradient(90deg,rgba(162,194,253,.22),rgba(128,152,204,.16),rgba(0,201,167,.22))", opacity: dBandOp, ...css(dBandS) }} />
            {dLines.map((line, index) => (
              <span key={index} style={{ position: "absolute", zIndex: 1, background: line.c, opacity: line.op, ...css(line.s) }} />
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
