import { HeroSection, ExpectBand, ResponsiveSection, AccountabilitySection, ContactSection } from "@/components/sections/landing/sections";
import { MoreDirectV2 } from "@/components/sections/home-v2/more-direct";
import { CurvedBand } from "@/components/layout/curved-band";
import styles from "@/components/sections/landing/landing.module.css";

export const metadata = {
  title: "Home v2",
  description: "Institutional infrastructure. Without the institutional layers. Research, execution, settlement, custody and asset management for professional clients.",
  robots: { index: false, follow: true },
};

export default function HomeV2Page() {
  return (
    <div className={styles.page}>
      <CurvedBand nextBackground="#fff">
        <HeroSection />
      </CurvedBand>
      <CurvedBand nextBackground="#071932">
        <ExpectBand />
      </CurvedBand>
      <MoreDirectV2 />
      <ResponsiveSection />
      <CurvedBand nextBackground="#f4f7fb">
        <AccountabilitySection />
      </CurvedBand>
      <ContactSection />
    </div>
  );
}
