import { EmfiSections } from "@/components/home-21/emfi-sections/emfi-sections";
import { PrinciplesSection } from "@/components/home-21/principles/principles";
import { QuestionnaireSection } from "@/components/home-21/questionnaire/questionnaire";
import styles from "@/components/home-21/landing.module.css";
import "./home-21.css";

export const metadata = {
  title: "Home 21",
  description: "Institutional infrastructure. Without the institutional layers. Research, execution, settlement, custody and asset management for professional clients.",
};

export default function Home21Page() {
  return (
    <div className="home-21-shell">
      <div className={`${styles.page} ${styles.fullHero} ${styles.spinMark}`}>
        <EmfiSections showPoints={false} showRouteTitle loop stepLabel="Handover" highlightSlides standardsEyebrow lightBands markFill={false} homeSlides omitSecondSlide perspectivePhones floatingPhones brandLogos whyTimeline blendHeader directPace="home12" responsiveBody="Technology that works. People who respond." dependableBody="Institutional safeguards. Clear accountability." routeTitles={{ conventional: "Conventional Route", direct: "EMFI Route" }} directEyebrow="EMFI IS" directBody="Fewer intermediaries. Fewer handovers." whySticky heroCue trimChrome home15Trade shortWhy grayLogos />
      </div>
      <PrinciplesSection stacked />
      <QuestionnaireSection />
    </div>
  );
}
