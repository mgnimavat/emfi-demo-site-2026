import { ResearchExecutionHeroMockup } from "@/components/mockups/research-execution-hero";
import { SectionCopy } from "./outcomes";

export function ResponsiveSection({
  cols,
  textOrder,
}: {
  cols: string;
  textOrder: number;
}) {
  return (
    <section id="responsive" data-screen-label="04 Responsive" style={{ position: "relative", background: "radial-gradient(50% 60% at 100% 50%,rgba(0,201,167,.1),transparent 70%)", zIndex: 1, color: "#FFFFFF" }}>
      <div style={{ maxWidth: 1320, margin: "0 auto", padding: "clamp(88px,10vw,144px) clamp(20px,4vw,56px)", borderTop: "1px solid rgba(162,194,253,.16)", display: "grid", gridTemplateColumns: cols, gap: "40px clamp(40px,5vw,80px)", alignItems: "center" }}>
        <div style={{ minWidth: 0, order: textOrder }}>
          <SectionCopy
            title="Responsive."
            body="Technology that works. People who respond. Clearer workflows with support from people who can help resolve issues."
            action={{ href: "/services/settlement-custody#workstation-demo", label: "See how we work" }}
          />
        </div>
        <div style={{ minWidth: 0, color: "#071832", fontFamily: "var(--font-inter), Inter, Arial, sans-serif" }}>
          <ResearchExecutionHeroMockup />
        </div>
      </div>
    </section>
  );
}
