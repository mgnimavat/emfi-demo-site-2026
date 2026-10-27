import { EmfiSections } from "@/components/emfi-sections/emfi-sections";
// Navbar and footer now come from SiteShell; uncomment these imports and JSX
// after restoring the previous shared chrome in site-shell.tsx.
// import { Home12Footer } from "@/components/sections/home-12/footer";
// import { Home12Header } from "@/components/sections/home-12/header";
import { DiscussSection } from "@/components/sections/home-12/sections";
import styles from "@/components/sections/home-12/landing.module.css";

export const metadata = {
  title: { absolute: "EMFI — Settle For Less." },
  description: "Institutional infrastructure. Without the institutional layers. Research, execution, settlement, custody and asset management for professional clients.",
};

export default function Home122Page() {
  return (
    <>
      {/* <Home12Header /> */}
      <div className={`${styles.page} ${styles.fullHero}`}>
        <EmfiSections showPoints={false} showRouteTitle loop stepLabel="Handover" highlightSlides standardsEyebrow lightBands markFill={false} homeSlides whyTimeline blendHeader directPace="home12" responsiveBody="Technology that works. People who respond." dependableBody="Institutional safeguards. Clear accountability." routeTitles={{ conventional: "Conventional Route", direct: "Direct Route EMFI" }} />
      </div>
      <DiscussSection />
      {/* <Home12Footer /> */}
    </>
  );
}
