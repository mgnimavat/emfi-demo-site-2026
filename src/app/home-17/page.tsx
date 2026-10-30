import { EmfiSections } from "@/components/home-17/emfi-sections";
import "@/components/home-17/home-17.css";
// Navbar and footer now come from SiteShell; uncomment these imports and JSX
// after restoring the previous shared chrome in site-shell.tsx.
// import { Home16Footer } from "@/components/sections/home-16/footer";
// import { Home16Header } from "@/components/sections/home-16/header";
import { PrinciplesSection } from "@/components/sections/home-16/principles";
import { QuestionnaireSection } from "@/components/sections/home-16/questionnaire";
import styles from "@/components/sections/home-12/landing.module.css";
import "../home-16/home-16.css";

export const metadata = {
  title: "Home 17",
  description: "Institutional infrastructure. Without the institutional layers. Research, execution, settlement, custody and asset management for professional clients.",
};

export default function Home17Page() {
  return (
    <div className="home-16-shell home-17">
      {/* <Home16Header /> */}
      <div className={`${styles.page} ${styles.fullHero} ${styles.spinMark}`}>
        <EmfiSections showPoints={false} showRouteTitle loop stepLabel="Handover" highlightSlides standardsEyebrow lightBands markFill={false} homeSlides omitSecondSlide perspectivePhones floatingPhones brandLogos whyTimeline blendHeader directPace="home12" responsiveBody="Tech that works. People who respond." dependableBody="Institutional safeguards. Clear accountability." routeTitles={{ conventional: "Conventional Route", direct: "EMFI Route" }} rewriteLastWord directEyebrow="EMFI IS" directBody="Fewer intermediaries. Fewer handovers." whySticky heroCue trimChrome />
      </div>
      <PrinciplesSection stacked whiteCards breakTitle />
      <QuestionnaireSection />
      {/* <Home16Footer /> */}
    </div>
  );
}
