import { HeroSection, ExpectBand, ResponsiveSection, AccountabilitySection, ContactSection } from "@/components/sections/landing/sections";
import { DirectFlowSection } from "@/components/sections/landing/direct-flow";
import styles from "@/components/sections/landing/landing.module.css";

export const metadata = {
  title: { absolute: "EMFI — Settle For Less." },
  description: "Institutional infrastructure. Without the institutional layers. Research, execution, settlement, custody and asset management for professional clients.",
};

export default function HomePage() {
  return <div className={styles.page}><HeroSection /><ExpectBand /><DirectFlowSection /><ResponsiveSection /><AccountabilitySection /><ContactSection /></div>;
}
