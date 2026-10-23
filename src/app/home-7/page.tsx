import { HeroSection, ExpectBand, ResponsiveSection, ContactSection } from "@/components/sections/home-7/sections";
import { DirectFlowSection } from "@/components/sections/home-7/direct-flow";
import styles from "@/components/sections/home-7/landing.module.css";

export const metadata = {
  title: { absolute: "EMFI — Settle For Less." },
  description: "Institutional infrastructure. Without the institutional layers. Research, execution, settlement, custody and asset management for professional clients.",
};

export default function Home7Page() {
  return <div className={styles.page}><HeroSection /><ExpectBand /><DirectFlowSection /><ResponsiveSection /><ContactSection /></div>;
}
