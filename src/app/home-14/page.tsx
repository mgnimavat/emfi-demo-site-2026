import { EmfiSections } from "@/components/emfi-sections/emfi-sections";
// Navbar and footer now come from SiteShell; uncomment these imports and JSX
// after restoring the previous shared chrome in site-shell.tsx.
// import { Home14Footer } from "@/components/sections/home-14/footer";
// import { Home14Header } from "@/components/sections/home-14/header";
import { HeroSection } from "@/components/sections/home-14/sections";
import { PrinciplesSection } from "@/components/sections/home-14/principles";
import { QuestionnaireSection } from "@/components/sections/home-14/questionnaire";
import styles from "@/components/sections/home-14/landing.module.css";

export const metadata = {
  title: { absolute: "EMFI — Settle For Less." },
  description: "Institutional infrastructure. Without the institutional layers. Research, execution, settlement, custody and asset management for professional clients.",
};

export default function Home14Page() {
  return (
    <>
      {/* <Home14Header /> */}
      <div className={styles.page}>
        <HeroSection />
        <EmfiSections showPoints={false} showRouteTitle loop stepLabel="Order" highlightSlides staticStandards lightBands markFill={false} homeSlides />
      </div>
      <PrinciplesSection />
      <QuestionnaireSection />
      {/* <Home14Footer /> */}
    </>
  );
}
