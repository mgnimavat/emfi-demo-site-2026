import { EmfiSections } from "@/components/emfi-sections/emfi-sections";
import { Home10Footer } from "@/components/sections/home-10/footer";
import { Home10Header } from "@/components/sections/home-10/header";
import { DiscussSection, HeroSection } from "@/components/sections/home-10/sections";
import styles from "@/components/sections/home-10/landing.module.css";

export const metadata = {
  title: { absolute: "EMFI — Settle For Less." },
  description: "Institutional infrastructure. Without the institutional layers. Research, execution, settlement, custody and asset management for professional clients.",
};

export default function Home10Page() {
  return (
    <>
      <Home10Header />
      <div className={styles.page}>
        <HeroSection />
        <EmfiSections showPoints={false} showRouteTitle loop stepLabel="Order" highlightSlides staticStandards lightBands homeSlides />
      </div>
      <DiscussSection />
      <Home10Footer />
    </>
  );
}
