import { EmfiSections } from "@/components/emfi-sections/emfi-sections";
import { PrinciplesSection } from "@/components/home-23/principles/principles";
import { QuestionnaireSection } from "@/components/home/questionnaire/questionnaire";
import styles from "@/components/sections/home-12/landing.module.css";
import "../home-16/home-16.css";
import "../home.css";
import "./home-23.css";

export const metadata = {
  title: "Home 23",
  description: "Institutional infrastructure. Without the institutional layers. Research, execution, settlement, custody and asset management for professional clients.",
};

export default function Home23Page() {
  return (
    <div className="home-16-shell home-page home-23">
      <div className={`${styles.page} ${styles.fullHero} ${styles.spinMark}`}>
        <EmfiSections showPoints={false} showRouteTitle loop stepLabel="Handover" highlightSlides standardsEyebrow lightBands markFill={false} homeSlides omitSecondSlide perspectivePhones floatingPhones brandLogos whyTimeline blendHeader directPace="home12" responsiveBody="Technology that works. People who respond." dependableBody="Institutional safeguards. Clear accountability." routeTitles={{ conventional: "Conventional Route", direct: "EMFI Route" }} directEyebrow="EMFI IS" directBody="Fewer intermediaries. Fewer handovers." whySticky heroCue trimChrome home15Trade shortWhy brandInk settlementDash />
      </div>
      <PrinciplesSection stacked />
      <QuestionnaireSection />
    </div>
  );
}
