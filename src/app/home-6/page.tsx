import { HeroSection, ExpectBand, ResponsiveSection, AccountabilitySection, ContactSection } from "@/components/sections/home-6/sections";
import { DirectFlowSection } from "@/components/sections/home-6/direct-flow";
import styles from "@/components/sections/home-6/landing.module.css";

export const metadata = {
  title: { absolute: "EMFI — Settle For Less." },
  description: "Institutional infrastructure. Without the institutional layers. Research, execution, settlement, custody and asset management for professional clients.",
};

export default function Home6Page() {
  return <div className={styles.page}><HeroSection /><ExpectBand /><DirectFlowSection /><ResponsiveSection /><AccountabilitySection /><ContactSection /></div>;
}
