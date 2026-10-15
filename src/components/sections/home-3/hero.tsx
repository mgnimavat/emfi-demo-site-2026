"use client";

import { home3 as home } from "@/content/home-3";
import { Button } from "@/components/ui/button";
import { FadeInOnLoad } from "@/components/motion/fade-in";
import { HeroRotatingText } from "@/components/sections/hero-rotating-text";

export function Home3Hero() {
  return (
    <div className="relative z-10 flex flex-1 flex-col justify-center py-16 lg:py-20">
      <div className="max-w-3xl">
        <FadeInOnLoad>
          <h1
            className="font-heading text-[clamp(2.15rem,4.2vw,3.5rem)] font-bold leading-[0.98] tracking-[-0.03em] text-ink"
            aria-label={`${home.hero.headline} ${home.hero.headlineAccent}`}
          >
            <span className="block">{home.hero.headline}</span>
            <span className="block">{home.hero.headlineAccent}</span>
          </h1>
        </FadeInOnLoad>
        <FadeInOnLoad delay={0.12}>
          <p
            className="mt-6 font-heading text-[clamp(1.5rem,2.6vw,2.15rem)] font-light leading-[1.15] tracking-[-0.03em] text-ink"
            aria-label={`${home.hero.accentPrefix} ${home.hero.accentWords.join(" ")}`}
          >
            {home.hero.accentPrefix}{" "}
            <HeroRotatingText words={home.hero.accentWords} />
          </p>
        </FadeInOnLoad>
        <FadeInOnLoad delay={0.2}>
          <p className="mt-4 max-w-[46ch] text-[clamp(1.0625rem,1.7vw,1.25rem)] font-normal leading-[1.55] text-ink-secondary">
            {home.hero.body}
          </p>
        </FadeInOnLoad>
        <FadeInOnLoad delay={0.28}>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button
              href="#contact"
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
