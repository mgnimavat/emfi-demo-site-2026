import { HeroSection, ExpectBand, ResponsiveSection, ContactSection } from "@/components/sections/home-5/sections";
import { DirectFlowSection } from "@/components/sections/home-5/direct-flow";
import styles from "@/components/sections/home-5/landing.module.css";

export const metadata = {
  title: "Home 5",
  description: "Institutional infrastructure. Without the institutional layers. Research, execution, settlement, custody and asset management for professional clients.",
};

export default function Home5Page() {
  return <div className={styles.page}><HeroSection /><ExpectBand /><DirectFlowSection /><ResponsiveSection /><ContactSection /></div>;
}
