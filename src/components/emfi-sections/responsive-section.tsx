import { ResearchExecutionHeroMockup, responsiveHighlightSlides } from "@/components/mockups/research-execution-hero";
import { SectionCopy } from "./outcomes";
import styles from "./sections.module.css";

export function ResponsiveSection({
  cols,
  textOrder,
  highlightSlides = false,
  light = false,
}: {
  cols: string;
  textOrder: number;
  highlightSlides?: boolean;
  light?: boolean;
}) {
  return (
    <section id="responsive" data-screen-label="04 Responsive" style={{ position: "relative", background: light ? "#e6effb" : "radial-gradient(50% 60% at 100% 50%,rgba(0,201,167,.1),transparent 70%)", zIndex: light ? undefined : 1, color: light ? "#071832" : "#FFFFFF" }}>
      <div className={light ? styles.lightCopy : undefined} style={{ position: "relative", zIndex: light ? 2 : undefined, maxWidth: 1320, margin: "0 auto", padding: "clamp(88px,10vw,144px) clamp(20px,4vw,56px)", borderTop: light ? "1px solid rgba(7,24,50,.08)" : "1px solid rgba(162,194,253,.16)", display: "grid", gridTemplateColumns: cols, gap: "40px clamp(40px,5vw,80px)", alignItems: "center" }}>
        <div style={{ minWidth: 0, order: textOrder }}>
          <SectionCopy
            title="Responsive."
            body="Technology that works. People who respond. Clearer workflows with support from people who can help resolve issues."
            action={{ href: "/services/settlement-custody#workstation-demo", label: "See how we work" }}
            tone={light ? "light" : "dark"}
          />
        </div>
        <div style={{ minWidth: 0, color: "#071832", fontFamily: "var(--font-inter), Inter, Arial, sans-serif" }}>
          <ResearchExecutionHeroMockup views={highlightSlides ? responsiveHighlightSlides : undefined} />
        </div>
      </div>
    </section>
  );
}
