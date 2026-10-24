import { Home8Footer } from "@/components/sections/home-8/footer";
import { Home8Header } from "@/components/sections/home-8/header";
import { DirectFlowSection } from "@/components/sections/home-8/direct-flow";
import { ContactSection, ExpectBand, HeroSection, ResponsiveSection } from "@/components/sections/home-8/sections";
import styles from "@/components/sections/home-8/landing.module.css";

export const metadata = {
  title: { absolute: "EMFI — Settle For Less." },
  description: "Institutional infrastructure. Without the institutional layers. Research, execution, settlement, custody and asset management for professional clients.",
};

export default function Home8Page() {
  return (
    <>
      <Home8Header />
      <div className={styles.page}>
        <HeroSection />
        <ExpectBand />
        <DirectFlowSection />
        <ResponsiveSection />
        <ContactSection />
      </div>
      <Home8Footer />
    </>
  );
}
