import { home4 as home } from "@/content/home-4";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { FadeInOnLoad } from "@/components/motion/fade-in";
import { HeroTypedLastWord } from "@/components/sections/hero-rotating-text";

export function Home4Hero() {
  return (
    <div className="relative z-10 flex flex-1 items-center py-10 max-lg:justify-center lg:py-14">
      <div className="w-full min-w-0 max-w-3xl">
        <FadeInOnLoad>
          <Eyebrow className="mb-5 text-[11px] tracking-[0.22em]">{home.chainEyebrow}</Eyebrow>
          <h1
            className="font-heading text-[clamp(2.75rem,7.2vw,5.75rem)] font-bold uppercase leading-[0.9] tracking-[-0.02em] text-ink"
            aria-label={`${home.hero.headline} ${home.hero.headlineAccent} ${home.hero.headlineAccentWords[0]}`}
          >
            <span className="block">{home.hero.headline}</span>
            <span className="block">{home.hero.headlineAccent}</span>
            <HeroTypedLastWord words={home.hero.headlineAccentWords} />
          </h1>
        </FadeInOnLoad>
        <FadeInOnLoad delay={0.16}>
          <p className="mt-5 max-w-[50ch] text-[clamp(1.0625rem,1.7vw,1.25rem)] font-normal leading-[1.55] text-ink-secondary">
            {home.hero.body}
          </p>
        </FadeInOnLoad>
        <FadeInOnLoad delay={0.24}>
          <div className="mt-8 flex flex-wrap items-center gap-4">
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
    </div>
  );
}
