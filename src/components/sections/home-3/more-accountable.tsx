import { home3 as home } from "@/content/home-3";
import { Container } from "@/components/layout/container";
import { FadeIn } from "@/components/motion/fade-in";

function BeliefIcon({ index }: { index: number }) {
  if (index === 0) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <circle cx="12" cy="12" r="3" />
        <circle cx="12" cy="12" r="8" />
      </svg>
    );
  }

  if (index === 1) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <path d="M12 3.5l6.5 2.3v5.4c0 3.8-2.6 6.1-6.5 7.6-3.9-1.5-6.5-3.8-6.5-7.6V5.8L12 3.5z" />
      </svg>
    );
  }

  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function MoreAccountable() {
  return (
    <section id="accountable" className="scroll-mt-[72px] bg-inverse" aria-labelledby="accountable-title">
      <Container className="py-16 md:py-24 lg:py-28">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,0.76fr)_minmax(0,1.24fr)] lg:gap-16">
          <FadeIn>
            <h2
              id="accountable-title"
              className="font-heading text-[clamp(1.85rem,3.6vw,3.15rem)] font-bold leading-[1.08] tracking-[-0.03em] text-ink-inverse"
            >
              {home.accountable.title}
            </h2>
          </FadeIn>
          <FadeIn delay={0.08}>
            <div className="space-y-2">
              {home.accountable.statements.map((line) => (
                <p
                  key={line}
                  className="font-heading text-[clamp(1.5rem,2.8vw,2.35rem)] font-bold leading-[1.15] tracking-[-0.03em] text-ink-inverse"
                >
                  {line}
                </p>
              ))}
            </div>
          </FadeIn>
        </div>

        <div className="mt-14 grid gap-8 sm:grid-cols-3 sm:gap-6 lg:gap-8">
          {home.accountable.beliefs.map((item, index) => (
            <FadeIn key={item.title} delay={0.1 + index * 0.06}>
              <article>
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-ink-inverse/20 text-ink-inverse">
                  <BeliefIcon index={index} />
                </div>
                <h3 className="mt-5 font-heading text-[1.25rem] font-bold leading-[1.15] tracking-[-0.02em] text-ink-inverse md:text-[1.4rem]">
                  {item.title}
                </h3>
                <p className="mt-3 text-[15px] font-normal leading-[1.55] text-ink-inverse-muted">{item.body}</p>
              </article>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
