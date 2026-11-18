"use client";

import { useServiceLocale } from '@/ui/hooks/useServiceLocale';

import { useLayoutEffect, useRef, type RefObject } from "react";
import { useReducedMotion } from "framer-motion";
import { cardStyle, centeredCardSpace } from "@/components/emfi-sections/css";
import { DirectRouteAnimation } from "@/components/emfi-sections/direct-route-animation";
import { SectionAction, SectionCopy, SectionFooterBody } from "@/components/emfi-sections/outcomes";
import { ReplayButton } from "@/components/emfi-sections/replay-button";
import styles from "@/components/emfi-sections/sections.module.css";
import type { dirVals } from "@/components/emfi-sections/values";
import { sectionFrame, sectionPad, useWhyActive, useWhyEngaged, useWhyPinned, useWhySplit, useWhyStep, WhyMarker } from "@/components/emfi-sections/why-flow";

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
  const { t } = useServiceLocale();
  const { dCount, dNote, dRouteTitle } = values;
  const marked = step != null;
  const active = useWhyActive(step ?? 0);
  const pinned = useWhyPinned();
  const split = useWhySplit();
  const stepNow = useWhyStep();
  const engaged = useWhyEngaged();
  const showing = pinned && engaged && marked && stepNow === step;
  const replayRef = useRef(onReplay);
  const reduceMotion = useReducedMotion();
  const solidLight = light && (!pinned || split || Boolean(reduceMotion));

  useLayoutEffect(() => {
    replayRef.current = onReplay;
  }, [onReplay]);

  useLayoutEffect(() => {
    if (!showing) return;
    replayRef.current();
  }, [showing]);
  const routeCols = cols.includes("52fr") ? "minmax(0, 1fr) minmax(0, calc((100% - 30px) * 0.52 + 150px))" : cols;
  const splitLead = "Fewer intermediaries.\nFewer handovers.";
  const splitBody =
    "Every extra hand on a transaction is another place for it to stall. We connect you directly to Euroclear, FundSettle and Allfunds, and one team stays responsible from instruction to settlement.";

  return (
    <section id="direct" data-screen-label="03 More direct" data-why-step={marked ? "" : undefined} style={{ position: "relative", height: pinned ? "100%" : undefined, background: solidLight ? "#ffffff" : light ? "transparent" : "radial-gradient(50% 60% at 0% 20%,rgba(162,194,253,.1),transparent 70%)", zIndex: light ? undefined : 1, color: light ? "#071832" : "#FFFFFF" }}>
      {marked && step && !split ? <WhyMarker n={step} active={active} /> : null}
      <div
        className={[light ? styles.lightCopy : "", pinned ? styles.pinStack : "", split ? styles.splitDirect : ""].filter(Boolean).join(" ") || undefined}
        style={{
          position: "relative",
          zIndex: light ? 2 : undefined,
          maxWidth: split ? 1480 : 1320,
          margin: "0 auto",
          padding: split ? "0 clamp(110px, calc(8vw + 70px), 190px)" : sectionPad(marked, !light, pinned),
          borderTop: pinned ? "none" : light ? "1px solid rgba(7,24,50,.08)" : "1px solid rgba(162,194,253,.16)",
          ...sectionFrame(pinned, centered, routeCols),
          ...(split ? { alignItems: "flex-start", justifyContent: "flex-start", gap: 0 } : null),
        }}
      >
        {marked && !eyebrow && !split ? <p className={styles.whyKicker} data-why-origin style={centered || pinned ? { width: "100%", justifyContent: "center", marginBottom: 0 } : undefined}>{t("Why EMFI")}</p> : null}
        <div className={split ? styles.splitDirectCopy : undefined} style={{ position: "relative", width: pinned && !split ? "min(100%, 560px)" : undefined }}>
          <SectionCopy
            title="Direct."
            index={split ? "01" : undefined}
            eyebrow={eyebrow}
            plainEyebrow={pinned && Boolean(eyebrow)}
            origin={marked && Boolean(eyebrow)}
            lead={split ? splitLead : undefined}
            body={split ? splitBody : shortWhy && pinned ? undefined : body}
            action={pinned ? undefined : { href: "/why-emfi/direct-access", label: "Learn More" }}
            tone={light ? "light" : "dark"}
            align={split ? "start" : centered || pinned ? "center" : "start"}
          />
        </div>
        <div
          ref={cardRef}
          className={[pinned ? styles.pinVisual : "", split ? styles.splitDirectVisual : ""].filter(Boolean).join(" ") || undefined}
          style={
            split
              ? undefined
              : centered && !pinned
                ? { ...cardStyle, width: "100%", paddingTop: `calc(${cardStyle.paddingTop} + ${centeredCardSpace})`, paddingBottom: `calc(${cardStyle.padding} + ${centeredCardSpace})` }
                : cardStyle
          }
        >
          {showReplay && canReplay && !split ? <ReplayButton onClick={onReplay} /> : null}
          {showRouteTitle ? (
            <p
              className={centered && !pinned && !split ? `${styles.routeTitle} ${styles.routeTitleCenter}` : styles.routeTitle}
              style={split ? { position: "relative", top: "auto", left: 0, right: "auto", margin: "0 0 8px", justifyContent: "flex-start" } : undefined}
            >
              {pinned ? null : <span aria-hidden="true" className={styles.eyebrowMark} />}
              <span className={dRouteTitle === "EMFI Route" ? styles.routeTitleEmfi : dRouteTitle === "Conventional Route" ? styles.routeTitleConventional : undefined}>{t(dRouteTitle)}</span>
              {centered && !pinned ? <span aria-hidden="true" className={styles.eyebrowMark} /> : null}
            </p>
          ) : null}
          <DirectRouteAnimation values={values} stepLabel={stepLabel} pinned={pinned} />
          {showRouteTitle ? null : (
            <div style={{ marginTop: 12, paddingTop: 14, borderTop: "1px solid rgba(162,194,253,.18)", display: "flex", justifyContent: "center", alignItems: "baseline", gap: 10 }}>
              {dNote ? <span style={{ fontSize: 13, fontWeight: 600, color: "#B1C0E2" }}>{t(dNote)}</span> : null}
              <span style={{ fontSize: 14, fontWeight: 700, color: "#CBD2E8" }}>{t("Handovers")}</span>
              <strong style={{ minWidth: ".7em", fontSize: 30, fontWeight: 800, letterSpacing: "-.03em", color: "#FFFFFF" }}>{dCount}</strong>
            </div>
          )}
        </div>
        {pinned ? (
          split ? (
            <SectionAction href="/why-emfi/direct-access" label="Learn More" align="start" />
          ) : shortWhy ? (
            <SectionFooterBody body={body} tone={light ? "light" : "dark"} cueHref={pairedCue ? "/why-emfi/direct-access" : undefined} />
          ) : (
            <SectionAction href="/why-emfi/direct-access" label="Learn More" />
          )
        ) : null}
      </div>
    </section>
  );
}
