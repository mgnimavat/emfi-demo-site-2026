import { EmfiSections } from "@/components/emfi-sections/emfi-sections";
import { Home9Footer } from "@/components/sections/home-9/footer";
import { Home9Header } from "@/components/sections/home-9/header";
import { DiscussSection, HeroSection } from "@/components/sections/home-9/sections";
import styles from "@/components/sections/home-9/landing.module.css";

export const metadata = {
  title: { absolute: "EMFI — Settle For Less." },
  description: "Institutional infrastructure. Without the institutional layers. Research, execution, settlement, custody and asset management for professional clients.",
};

export default function Home9Page() {
  return (
    <>
      <Home9Header />
      <div className={styles.page}>
        <HeroSection />
        <EmfiSections />
      </div>
      <DiscussSection />
      <Home9Footer />
    </>
  );
}
