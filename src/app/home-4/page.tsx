import { home4 as home } from "@/content/home-4";
import { Container } from "@/components/layout/container";
import { HeroAtmosphere, HeroBrandMark } from "@/components/sections/hero-atmosphere";
import { Home4Hero } from "@/components/sections/home-4/hero";
import { ServicesShowcase } from "@/components/sections/home-4/services-showcase";
import { WhyTrust } from "@/components/sections/home-4/why-trust";
import { WhyShowcase } from "@/components/sections/home-4/why-showcase";
import { DecadeFeature } from "@/components/sections/home-4/decade-feature";
import { CtaFeatured } from "@/components/sections/home-4/cta-featured";
import { Marquee } from "@/components/ui/marquee";

export const metadata = {
  title: "Home 4",
  description: home.hero.body,
};

export default function Home4Page() {
  return (
    <>
      <section className="relative flex min-h-[calc((100svh-72px)*0.85)] flex-col overflow-hidden bg-page">
        <HeroAtmosphere sign={false} />
        <div className="relative flex min-h-0 flex-1 flex-col">
          <HeroBrandMark className="emfi-hero-mark-lg" />
          <Container className="relative z-10 flex min-h-0 flex-1 flex-col">
            <Home4Hero />
          </Container>
        </div>
        <Marquee items={home.hero.entities} className="relative z-10" />
      </section>

      <ServicesShowcase />

      <WhyTrust />

      <WhyShowcase />

      <DecadeFeature />

      <CtaFeatured />
    </>
  );
}
