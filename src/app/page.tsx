import { home } from "@/content/home";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { FadeIn, FadeInOnLoad } from "@/components/motion/fade-in";
import { HeroAtmosphere } from "@/components/sections/hero-atmosphere";
import { HeroGlassReveal } from "@/components/sections/hero-glass-reveal";
import { HeroTypedLastWord } from "@/components/sections/hero-rotating-text";
import { RelationshipMap } from "@/components/sections/relationship-map";
import { ServicesShowcase } from "@/components/sections/services-showcase";
import { WhyTrust } from "@/components/sections/why-trust";
import { WhyShowcase } from "@/components/sections/why-showcase";
import { DecadeFeature } from "@/components/sections/decade-feature";
import { CtaFeatured } from "@/components/sections/cta-featured";
import { Marquee } from "@/components/ui/marquee";

export const metadata = {
  title: {
    absolute: home.title,
  },
  description: home.hero.body,
};

export default function HomePage() {
  return (
    <>
      <section className="relative flex min-h-[calc(100svh-72px)] flex-col overflow-hidden bg-page">
        <HeroAtmosphere sign={false} />
        <Container className="relative z-10 grid flex-1 items-center gap-10 py-12 max-lg:justify-items-center lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-12 lg:py-16">
          <div className="w-full max-lg:max-w-[42rem]">
            <FadeInOnLoad>
              <h1
                className="text-[clamp(2.125rem,5vw,4.25rem)] font-extrabold leading-[1.08] tracking-[-0.045em] text-ink max-[639px]:text-[34px]"
                aria-label={`${home.hero.headline} ${home.hero.headlineAccent} ${home.hero.headlineAccentWords[0]}`}
              >
                {home.hero.headline.split(" ").map((word) => (
                  <span key={word} className="block">
                    {word}
                  </span>
                ))}
                <HeroTypedLastWord
                  prefix={home.hero.headlineAccent}
                  words={home.hero.headlineAccentWords}
                />
              </h1>
            </FadeInOnLoad>
            <FadeInOnLoad delay={0.16}>
              <p className="mt-7 max-w-[50ch] text-[clamp(1.0625rem,1.7vw,1.25rem)] font-normal leading-[1.55] text-ink-secondary">
                {home.hero.body}
              </p>
            </FadeInOnLoad>
            <FadeInOnLoad delay={0.24}>
              <div className="mt-11 flex flex-wrap items-center gap-4">
                <Button
                  href="/contact"
                  className="min-h-0 px-8 py-4.25 text-[15px] font-bold leading-6 tracking-normal"
                >
                  {home.hero.primaryCta}
                </Button>
                <Button
                  href="/services"
                  variant="outline"
                  className="min-h-0 px-8 py-4.25 text-[15px] font-bold leading-6 tracking-normal"
                >
                  {home.hero.secondaryCta}
                </Button>
              </div>
            </FadeInOnLoad>
          </div>
          <HeroGlassReveal className="w-full min-w-0 max-w-[780px] justify-self-end max-lg:max-w-[90vw] max-lg:justify-self-center" />
        </Container>
        <Marquee items={home.hero.entities} className="relative z-10" />
      </section>

      <section className="bg-page py-10 md:py-14" aria-labelledby="relationship-heading">
        <Container>
          <div className="relative overflow-hidden rounded-xl bg-subtle px-6 py-14 text-ink md:px-10 lg:py-20">
            <div className="relative z-10 grid items-center gap-12 md:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)] md:gap-6">
              <FadeIn>
                <h2
                  id="relationship-heading"
                  className="text-[clamp(2rem,4.4vw,3.65rem)] font-extrabold leading-[1.12] tracking-[-0.04em] text-ink"
                >
                  {home.chainTitle.split("\n").map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </h2>
                <p className="mt-5 max-w-[38ch] text-[clamp(1rem,1.4vw,1.125rem)] font-normal leading-[1.55] text-ink-secondary">
                  {home.chainBody}
                </p>
              </FadeIn>
              <FadeIn delay={0.1}>
                <RelationshipMap />
              </FadeIn>
            </div>
          </div>
        </Container>
      </section>

      <ServicesShowcase />

      <WhyTrust />

      <WhyShowcase />

      <DecadeFeature />

      <CtaFeatured />
    </>
  );
}
