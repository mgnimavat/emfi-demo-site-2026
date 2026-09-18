import { home } from "@/content/home";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { FadeIn, FadeInOnLoad } from "@/components/motion/fade-in";
import { HeroAtmosphere, HeroBrandMark } from "@/components/sections/hero-atmosphere";
import { HeroTypedLastWord } from "@/components/sections/hero-rotating-text";
import { RelationshipMap } from "@/components/sections/relationship-map";
import { ServicesShowcase } from "@/components/sections/services-showcase";
import { WhyShowcase } from "@/components/sections/why-showcase";
import { CtaFeatured } from "@/components/sections/cta-featured";

export const metadata = {
  title: {
    absolute: home.title,
  },
  description: home.hero.body,
};

export default function HomePage() {
  return (
    <>
      <section className="relative flex min-h-[calc(100svh-72px)] flex-col justify-center overflow-hidden bg-page">
        <HeroAtmosphere sign={false} />
        <HeroBrandMark />
        <Container className="relative z-10 py-16 lg:py-24">
          <FadeInOnLoad>
            <h1
                className="text-[clamp(2rem,5vw,4.25rem)] font-extrabold leading-[1.08] tracking-[-0.045em] text-ink"
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
        </Container>
      </section>

      <section className="bg-page py-10 md:py-14" aria-labelledby="relationship-heading">
        <Container>
          <div className="relative overflow-hidden rounded-xl bg-inverse px-6 py-14 text-ink-inverse md:px-10 lg:py-20">
            <div className="relative z-10 grid items-center gap-12 md:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)] md:gap-6">
              <FadeIn>
                <h2
                  id="relationship-heading"
                  className="text-[clamp(2rem,4.4vw,3.65rem)] font-extrabold leading-[1.12] tracking-[-0.04em] text-ink-inverse"
                >
                  {home.chainTitle.split("\n").map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </h2>
                <p className="mt-5 max-w-[38ch] text-[clamp(1rem,1.4vw,1.125rem)] font-normal leading-[1.55] text-ink-inverse-muted">
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

      <WhyShowcase />

      <CtaFeatured />
    </>
  );
}
