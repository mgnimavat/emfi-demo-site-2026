import { EmfiSections } from "@/components/emfi-sections/emfi-sections";
// Navbar and footer now come from SiteShell; uncomment these imports and JSX
// after restoring the previous shared chrome in site-shell.tsx.
// import { Home16Footer } from "@/components/sections/home-16/footer";
// import { Home16Header } from "@/components/sections/home-16/header";
import { PrinciplesSection } from "@/components/sections/home-16/principles";
import { QuestionnaireSection } from "@/components/sections/home-16/questionnaire";
import styles from "@/components/sections/home-12/landing.module.css";
import "./home-16/home-16.css";

export const metadata = {
  title: { absolute: "EMFI | Home" },
  description: "Institutional infrastructure. Without the institutional layers. Research, execution, settlement, custody and asset management for professional clients.",
};

export default function HomePage() {
  return (
    <div className="home-16-shell">
      {/* <Home16Header /> */}
      <div className={`${styles.page} ${styles.fullHero} ${styles.spinMark}`}>
        <EmfiSections showPoints={false} showRouteTitle loop stepLabel="Handover" highlightSlides standardsEyebrow lightBands markFill={false} homeSlides omitSecondSlide perspectivePhones brandLogos whyTimeline blendHeader directPace="home12" responsiveBody="Technology that works. People who respond." dependableBody="Institutional safeguards. Clear accountability." routeTitles={{ conventional: "Conventional Route", direct: "EMFI Route" }} />
      </div>
      <PrinciplesSection />
      <QuestionnaireSection />
      {/* <Home16Footer /> */}
    </div>
  );
}
