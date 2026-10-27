import { EmfiSections } from "@/components/emfi-sections/emfi-sections";
// Navbar and footer now come from SiteShell; uncomment these imports and JSX
// after restoring the previous shared chrome in site-shell.tsx.
// import { Home11Footer } from "@/components/sections/home-11/footer";
// import { Home11Header } from "@/components/sections/home-11/header";
import { DiscussSection, HeroSection } from "@/components/sections/home-11/sections";
import styles from "@/components/sections/home-11/landing.module.css";

export const metadata = {
  title: { absolute: "EMFI — Settle For Less." },
  description: "Institutional infrastructure. Without the institutional layers. Research, execution, settlement, custody and asset management for professional clients.",
};

export default function Home11Page() {
  return (
    <>
      {/* <Home11Header /> */}
      <div className={styles.page}>
        <HeroSection />
        <EmfiSections showPoints={false} showRouteTitle loop stepLabel="Order" highlightSlides staticStandards lightBands markFill={false} homeSlides />
      </div>
      <DiscussSection />
      {/* <Home11Footer /> */}
    </>
  );
}
