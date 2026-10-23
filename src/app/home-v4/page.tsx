import { ExpectBand, ResponsiveSection, AccountabilitySection, ContactSection } from "@/components/sections/landing/sections";
import { HomeV4Hero } from "@/components/sections/home-v4/hero";
import { MoreDirectV4 } from "@/components/sections/home-v4/more-direct";
import { CurvedBand } from "@/components/layout/curved-band";
import styles from "@/components/sections/landing/landing.module.css";

export const metadata = {
  title: { absolute: "EMFI — Settle For Less." },
  description: "Institutional infrastructure. Without the institutional layers. Research, execution, settlement, custody and asset management for professional clients.",
  robots: { index: false, follow: true },
};

export default function HomeV4Page() {
  return (
    <div className={styles.page}>
      <CurvedBand nextBackground="#fff">
        <HomeV4Hero />
      </CurvedBand>
      <CurvedBand nextBackground="#071932">
        <ExpectBand />
      </CurvedBand>
      <MoreDirectV4 />
      <ResponsiveSection />
      <CurvedBand nextBackground="#f4f7fb">
        <AccountabilitySection />
      </CurvedBand>
      <ContactSection />
    </div>
  );
}
