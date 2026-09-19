"use client";

import { useState } from "react";
import { home2 as home } from "@/content/home-2";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { FadeInOnLoad } from "@/components/motion/fade-in";
import { HeroTypedLastWord } from "@/components/sections/hero-rotating-text";
import { HeroFlowchart } from "@/components/sections/home-2/hero-flowchart";

export function Home2Hero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeName = home.hero.headlineAccentWords[activeIndex];

  return (
    <div className="relative z-10 grid flex-1 items-center gap-8 py-10 max-lg:justify-items-center lg:grid-cols-2 lg:gap-10 lg:py-14">
      <div className="w-full min-w-0 max-lg:max-w-2xl">
        <FadeInOnLoad>
          <Eyebrow className="mb-5 text-[11px] tracking-[0.22em]">{home.chainEyebrow}</Eyebrow>
          <h1
            className="font-heading text-[clamp(2.15rem,4.2vw,3.5rem)] font-bold leading-[0.98] tracking-[-0.03em] text-ink"
            aria-label={`${home.hero.headline} ${home.hero.headlineAccent} ${activeName}`}
          >
            <span className="block">{home.hero.headline}</span>
            <span className="block">{home.hero.headlineAccent}</span>
            <HeroTypedLastWord
              words={home.hero.headlineAccentWords}
              onWordIndexChange={setActiveIndex}
            />
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
      <FadeInOnLoad delay={0.2} className="w-full min-w-0 max-lg:max-w-2xl">
        <HeroFlowchart activeName={activeName} />
      </FadeInOnLoad>
    </div>
  );
}
