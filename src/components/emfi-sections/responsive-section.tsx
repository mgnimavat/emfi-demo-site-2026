"use client";

import { ResearchExecutionHeroMockup, home10ResponsiveSlides, home12ResponsiveSlides, responsiveHighlightSlides } from "@/components/mockups/research-execution-hero";
import { SectionCopy } from "./outcomes";
import styles from "./sections.module.css";
import { sectionPad, useWhyActive, WhyMarker } from "./why-flow";

export function ResponsiveSection({
  cols,
  textOrder,
  highlightSlides = false,
  light = false,
  homeSlides = false,
  omitSecondSlide = false,
  step,
  body = "Technology that works. People who respond. Clearer workflows with support from people who can help resolve issues.",
  centered = false,
}: {
  cols: string;
  textOrder: number;
  highlightSlides?: boolean;
  light?: boolean;
  homeSlides?: boolean;
  omitSecondSlide?: boolean;
  step?: number;
  body?: string;
  centered?: boolean;
}) {
  const marked = step != null;
  const active = useWhyActive(step ?? 0);

  return (
    <section id="responsive" data-screen-label="04 Responsive" data-why-step={marked ? "" : undefined} style={{ position: "relative", background: light ? "#e6effb" : "radial-gradient(50% 60% at 100% 50%,rgba(0,201,167,.1),transparent 70%)", zIndex: light ? undefined : 1, color: light ? "#071832" : "#FFFFFF" }}>
      {marked && step ? <WhyMarker n={step} active={active} /> : null}
      <div className={light ? styles.lightCopy : undefined} style={{ position: "relative", zIndex: light ? 2 : undefined, maxWidth: 1320, margin: "0 auto", padding: sectionPad(marked), borderTop: light ? "1px solid rgba(7,24,50,.08)" : "1px solid rgba(162,194,253,.16)", display: centered ? "flex" : "grid", flexDirection: centered ? "column" : undefined, gridTemplateColumns: centered ? undefined : cols, gap: centered ? 64 : "40px clamp(40px,5vw,80px)", alignItems: centered ? "stretch" : "center" }}>
        <div style={{ position: "relative", minWidth: 0, order: centered ? undefined : textOrder }}>
          <SectionCopy
            title="Responsive."
            body={body}
            action={{ href: "/services/settlement-custody#workstation-demo", label: "See how we work" }}
            tone={light ? "light" : "dark"}
            align={centered ? "center" : "start"}
          />
        </div>
        <div style={{ minWidth: 0, width: centered ? "100%" : undefined, color: "#071832", fontFamily: "var(--font-inter), Inter, Arial, sans-serif" }}>
          <ResearchExecutionHeroMockup views={homeSlides ? (omitSecondSlide ? home12ResponsiveSlides : home10ResponsiveSlides) : highlightSlides ? responsiveHighlightSlides : undefined} />
        </div>
      </div>
    </section>
  );
}
