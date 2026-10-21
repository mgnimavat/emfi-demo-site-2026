import { HeroSection, ExpectBand, ResponsiveSection, AccountabilitySection, ContactSection } from "@/components/sections/landing/sections";
import { DirectFlowSection } from "@/components/sections/landing/direct-flow";
import { CurvedBand } from "@/components/layout/curved-band";
import styles from "@/components/sections/landing/landing.module.css";

export const metadata = {
  title: { absolute: "EMFI — Settle For Less." },
  description: "Institutional infrastructure. Without the institutional layers. Research, execution, settlement, custody and asset management for professional clients.",
};

export default function HomePage() {
  return <div className={styles.page}><HeroSection /><ExpectBand /><DirectFlowSection /><ResponsiveSection /><CurvedBand nextBackground="#f4f7fb"><AccountabilitySection /></CurvedBand><ContactSection /></div>;
}
