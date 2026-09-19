import { home2 as home } from "@/content/home-2";
import { Container } from "@/components/layout/container";
import { HeroAtmosphere, HeroBrandMark } from "@/components/sections/hero-atmosphere";
import { Home2Hero } from "@/components/sections/home-2/hero";
import { ServicesShowcase } from "@/components/sections/home-2/services-showcase";
import { WhyTrust } from "@/components/sections/home-2/why-trust";
import { WhyShowcase } from "@/components/sections/home-2/why-showcase";
import { DecadeFeature } from "@/components/sections/home-2/decade-feature";
import { CtaFeatured } from "@/components/sections/home-2/cta-featured";
import { Marquee } from "@/components/ui/marquee";

export const metadata = {
  title: {
    absolute: `${home.title} — Home 2`,
  },
  description: home.hero.body,
};

export default function Home2Page() {
  return (
    <>
      <section className="relative flex min-h-[calc((100svh-72px)*0.85)] flex-col overflow-hidden bg-page">
        <HeroAtmosphere sign={false} />
        <div className="relative flex min-h-0 flex-1 flex-col">
          <HeroBrandMark />
          <Container className="relative z-10 flex min-h-0 flex-1 flex-col">
            <Home2Hero />
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
