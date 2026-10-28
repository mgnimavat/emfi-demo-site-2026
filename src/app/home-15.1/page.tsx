import { EmfiSections } from "@/components/emfi-sections/emfi-sections";
// Navbar and footer now come from SiteShell; uncomment these imports and JSX
// after restoring the previous shared chrome in site-shell.tsx.
// import { Home151Footer } from "@/components/sections/home-15-1/footer";
// import { Home151Header } from "@/components/sections/home-15-1/header";
import { PrinciplesSection } from "@/components/sections/home-15-1/principles";
import { QuestionnaireSection } from "@/components/sections/home-15-1/questionnaire";
import styles from "@/components/sections/home-12/landing.module.css";

export const metadata = {
  title: "Home 15.1",
  description: "Institutional infrastructure. Without the institutional layers. Research, execution, settlement, custody and asset management for professional clients.",
};

export default function Home151Page() {
  return (
    <>
      {/* <Home151Header /> */}
      <div className={styles.page}>
        <EmfiSections
          showPoints={false}
          showRouteTitle
          loop
          stepLabel="Handover"
          highlightSlides
          standardsEyebrow
          lightBands
          markFill={false}
          homeSlides
          whyTimeline
          blendHeader
          responsiveBody="Technology that works. People who respond."
          dependableBody="Institutional safeguards. Clear accountability."
          routeTitles={{ conventional: "Conventional Route", direct: "Direct Route EMFI" }}
        />
      </div>
      <PrinciplesSection />
      <QuestionnaireSection />
      {/* <Home151Footer /> */}
    </>
  );
}
