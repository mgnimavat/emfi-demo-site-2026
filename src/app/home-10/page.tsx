import { EmfiSections } from "@/components/emfi-sections/emfi-sections";
// Navbar and footer now come from SiteShell; uncomment these imports and JSX
// after restoring the previous shared chrome in site-shell.tsx.
// import { Home10Footer } from "@/components/sections/home-10/footer";
// import { Home10Header } from "@/components/sections/home-10/header";
import { DiscussSection, HeroSection } from "@/components/sections/home-10/sections";
import styles from "@/components/sections/home-10/landing.module.css";

export const metadata = {
  title: "Home 10",
  description: "Institutional infrastructure. Without the institutional layers. Research, execution, settlement, custody and asset management for professional clients.",
};

export default function Home10Page() {
  return (
    <>
      {/* <Home10Header /> */}
      <div className={styles.page}>
        <HeroSection />
        <EmfiSections showPoints={false} showRouteTitle loop stepLabel="Handover" highlightSlides staticStandards lightBands homeSlides />
      </div>
      <DiscussSection />
      {/* <Home10Footer /> */}
    </>
  );
}
