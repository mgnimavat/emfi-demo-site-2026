import { EmfiSections } from "@/components/emfi-sections/emfi-sections";
// Navbar and footer now come from SiteShell; uncomment these imports and JSX
// after restoring the previous shared chrome in site-shell.tsx.
// import { Home8Footer } from "@/components/sections/home-8/footer";
// import { Home8Header } from "@/components/sections/home-8/header";
import { DiscussSection, HeroSection } from "@/components/sections/home-8/sections";
import styles from "@/components/sections/home-8/landing.module.css";

export const metadata = {
  title: "Home 8",
  description: "Institutional infrastructure. Without the institutional layers. Research, execution, settlement, custody and asset management for professional clients.",
};

export default function Home8Page() {
  return (
    <>
      {/* <Home8Header /> */}
      <div className={styles.page}>
        <HeroSection />
        <EmfiSections />
      </div>
      <DiscussSection />
      {/* <Home8Footer /> */}
    </>
  );
}
