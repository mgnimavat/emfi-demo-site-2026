"use client";

import { useReducedMotion } from "framer-motion";
import { ResearchExecutionHeroMockup, home10ResponsiveSlides, home12ResponsiveSlides, home16ResponsiveSlides, homeV5ResponsiveSlides, responsiveHighlightSlides } from "@/components/mockups/research-execution-hero";
import { SectionAction, SectionCopy } from "./outcomes";
import styles from "./sections.module.css";
import { sectionFrame, sectionPad, useWhyActive, useWhyEngaged, useWhyPinned, useWhyStep, WhyMarker } from "./why-flow";

export function ResponsiveSection({
  cols,
  textOrder,
  highlightSlides = false,
  light = false,
  homeSlides = false,
  omitSecondSlide = false,
  perspectivePhones = false,
  floatingPhones = false,
  step,
  body = "Technology that works. People who respond. Clearer workflows with support from people who can help resolve issues.",
  centered = false,
  eyebrow,
}: {
  cols: string;
  textOrder: number;
  highlightSlides?: boolean;
  light?: boolean;
  homeSlides?: boolean;
  omitSecondSlide?: boolean;
  perspectivePhones?: boolean;
  floatingPhones?: boolean;
  step?: number;
  body?: string;
  centered?: boolean;
  eyebrow?: string;
}) {
  const marked = step != null;
  const active = useWhyActive(step ?? 0);
  const pinned = useWhyPinned();
  const stepNow = useWhyStep();
  const engaged = useWhyEngaged();
  const showing = pinned && engaged && marked && stepNow === step;
  const reduceMotion = useReducedMotion();
  return (
    <section id="responsive" data-screen-label="04 Responsive" data-why-step={marked ? "" : undefined} style={{ position: "relative", height: pinned ? "100%" : undefined, background: pinned && light && !reduceMotion ? "transparent" : light ? "#e6effb" : "radial-gradient(50% 60% at 100% 50%,rgba(0,201,167,.1),transparent 70%)", zIndex: light ? undefined : 1, color: light ? "#071832" : "#FFFFFF" }}>
      {marked && step ? <WhyMarker n={step} active={active} /> : null}
      <div className={[light ? styles.lightCopy : "", pinned ? styles.pinStack : ""].filter(Boolean).join(" ") || undefined} style={{ position: "relative", zIndex: light ? 2 : undefined, maxWidth: 1320, margin: "0 auto", padding: sectionPad(marked, !light, pinned), borderTop: pinned ? "none" : light ? "1px solid rgba(7,24,50,.08)" : "1px solid rgba(162,194,253,.16)", ...sectionFrame(pinned, centered, cols) }}>
        <div style={{ position: "relative", minWidth: 0, width: pinned ? "min(100%, 560px)" : undefined, order: pinned || centered ? undefined : textOrder }}>
          <SectionCopy
            title="Responsive."
            eyebrow={eyebrow}
            plainEyebrow={pinned && Boolean(eyebrow)}
            body={body}
            action={pinned ? undefined : { href: "/services/settlement-custody#workstation-demo", label: "Learn More" }}
            tone={light ? "light" : "dark"}
            align={centered || pinned ? "center" : "start"}
          />
        </div>
        <div className={pinned ? styles.pinStackMedia : undefined} style={{ minWidth: 0, width: centered && !pinned ? "100%" : undefined, color: "#071832", fontFamily: "var(--font-inter), Inter, Arial, sans-serif" }}>
          {!pinned || showing ? (
            <ResearchExecutionHeroMockup active={pinned ? true : undefined} square={floatingPhones} quietFrame={floatingPhones} views={homeSlides ? (floatingPhones ? homeV5ResponsiveSlides : perspectivePhones ? home16ResponsiveSlides : omitSecondSlide ? home12ResponsiveSlides : home10ResponsiveSlides) : highlightSlides ? responsiveHighlightSlides : undefined} />
          ) : null}
        </div>
        {pinned ? <SectionAction href="/services/settlement-custody#workstation-demo" label="Learn More" /> : null}
      </div>
    </section>
  );
}
