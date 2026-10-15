import { Monitor, Users } from "lucide-react";
import { home3 as home } from "@/content/home-3";
import { Container } from "@/components/layout/container";
import { FadeIn } from "@/components/motion/fade-in";

const icons = [Monitor, Users] as const;

export function MoreResponsive() {
  return (
    <section id="responsive" className="scroll-mt-[72px] bg-page" aria-labelledby="responsive-title">
      <Container className="py-16 md:py-24">
        <FadeIn>
          <h2
            id="responsive-title"
            className="font-heading text-[clamp(2rem,4.2vw,3.5rem)] font-bold leading-[1.08] tracking-[-0.03em] text-ink"
          >
            {home.responsive.title}
          </h2>
        </FadeIn>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {home.responsive.cards.map((card, index) => {
            const Icon = icons[index] ?? Monitor;
            return (
              <FadeIn key={card.title} delay={0.08 + index * 0.08}>
                <article className="h-full rounded-xl border border-line bg-page p-7 md:p-8">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink">
                    <Icon size={18} aria-hidden />
                  </div>
                  <h3 className="mt-5 font-heading text-[1.25rem] font-bold leading-[1.15] tracking-[-0.02em] text-ink md:text-[1.4rem]">
                    {card.title}
                  </h3>
                  <p className="mt-3 text-[15px] font-normal leading-[1.55] text-ink-secondary">{card.body}</p>
                </article>
              </FadeIn>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
