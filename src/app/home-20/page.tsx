import { EmfiSections } from "@/components/emfi-sections/emfi-sections";
import { PrinciplesSection } from "@/components/home/principles/principles";
import { QuestionnaireSection } from "@/components/home/questionnaire/questionnaire";
import styles from "@/components/sections/home-12/landing.module.css";
import "../home-16/home-16.css";
import "./home-20.css";

export const metadata = {
  title: "Home 20",
  description: "Institutional infrastructure. Without the institutional layers. Research, execution, settlement, custody and asset management for professional clients.",
};

export default function Home20Page() {
  return (
    <div className="home-16-shell home-20">
      <div className={`${styles.page} ${styles.fullHero} ${styles.spinMark}`}>
        <EmfiSections showPoints={false} showRouteTitle loop stepLabel="Handover" highlightSlides standardsEyebrow lightBands markFill={false} homeSlides omitSecondSlide perspectivePhones floatingPhones brandLogos whyTimeline blendHeader directPace="home12" responsiveBody="Technology that works. People who respond." dependableBody="Institutional safeguards. Clear accountability." routeTitles={{ conventional: "Conventional Route", direct: "EMFI Route" }} directEyebrow="EMFI IS" directBody="Fewer intermediaries. Fewer handovers." whySticky heroCue trimChrome home15Trade shortWhy brandInk pairedCue />
      </div>
      <PrinciplesSection stacked />
      <QuestionnaireSection />
    </div>
  );
}
