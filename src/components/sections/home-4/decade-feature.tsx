import { home4 as home } from "@/content/home-4";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/motion/fade-in";
import { DecadeHeroVisual } from "@/components/diagrams/decade-hero-visual";

export function DecadeFeature() {
  return (
    <section className="bg-page py-16 md:py-24" aria-labelledby="decade-heading">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <FadeIn>
            <p className="mb-5 font-mono text-[12px] font-bold tracking-[0.16em] text-ink-muted">
              {home.anniversaryEyebrow}
            </p>
            <h2
              id="decade-heading"
              aria-label={home.anniversaryTitle.replace("\n", " ")}
              className="font-heading text-[clamp(2.15rem,4.6vw,3.75rem)] font-bold leading-[1.08] tracking-[-0.03em] text-ink"
            >
              {home.anniversaryTitle.split("\n").map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>
            <p className="mt-6 max-w-[42ch] text-[1.0625rem] font-normal leading-[1.6] text-ink-secondary">
              {home.anniversaryBody}
            </p>
            <div className="mt-8">
              <Button
                href="/about"
                className="min-h-0 px-8 py-4 text-[15px] font-bold leading-6 tracking-normal"
              >
                {home.anniversaryCta}
              </Button>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="relative mx-auto flex aspect-square w-full max-w-[28rem] items-center justify-center">
              <span
                aria-hidden
                className="absolute inset-[12%] rounded-full"
                style={{ background: "color-mix(in srgb, var(--color-blue-100) 22%, transparent)" }}
              />
              <DecadeHeroVisual showCaption={false} className="relative z-10 max-w-[19rem] md:max-w-[21rem]" />
            </div>
          </FadeIn>
        </div>
      </Container>
    </section>
  );
}
