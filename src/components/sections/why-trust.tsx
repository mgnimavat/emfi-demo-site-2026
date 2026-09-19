import { home } from "@/content/home";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { FadeIn } from "@/components/motion/fade-in";

function PillarIcon({ index }: { index: number }) {
  if (index === 0) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
    );
  }

  if (index === 1) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
        <circle cx="12" cy="12" r="3" />
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="1" fill="currentColor" />
      </svg>
    );
  }

  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      {[5, 12, 19].flatMap((y) =>
        [5, 12, 19].map((x) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1" fill="currentColor" />),
      )}
    </svg>
  );
}

export function WhyTrust() {
  return (
    <section className="bg-inverse" aria-labelledby="why-emfi-heading">
      <Container className="py-16 md:py-24 lg:py-28">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,0.76fr)_minmax(0,1.24fr)] lg:gap-12 xl:gap-16">
          <FadeIn>
            <Eyebrow inverse className="mb-5 text-[11px] tracking-[0.22em]">
              {home.whyEyebrow}
            </Eyebrow>
            <h2
              id="why-emfi-heading"
              className="font-heading text-[clamp(1.85rem,3.6vw,3.15rem)] font-bold leading-[1.08] tracking-[-0.03em] text-ink-inverse"
            >
              {home.whyTitle}
            </h2>
            <p className="mt-6 text-[1rem] font-normal leading-[1.55] text-ink-inverse-muted md:text-[1.0625rem]">
              {home.whyBody.split("\n").map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
            <div className="mt-8">
              <Button
                href="/why-emfi"
                variant="ghost"
                className="min-h-0 border-ink-inverse px-8 py-4.25 text-[15px] font-bold leading-6 tracking-normal hover:bg-ink-inverse/10"
              >
                {home.whyCta}
              </Button>
            </div>
          </FadeIn>

          <div className="grid gap-8 sm:grid-cols-3 sm:gap-6 lg:gap-8 lg:pt-10">
            {home.why.map(([title, body], index) => (
              <FadeIn key={title} delay={0.08 + index * 0.06}>
                <article>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-ink-inverse/20 text-ink-inverse">
                    <PillarIcon index={index} />
                  </div>
                  <h3 className="mt-5 font-heading text-[1.25rem] font-bold leading-[1.15] tracking-[-0.02em] text-ink-inverse md:text-[1.4rem]">
                    {title}
                  </h3>
                  <p className="mt-3 text-[15px] font-normal leading-[1.55] text-ink-inverse-muted">
                    {body}
                  </p>
                </article>
              </FadeIn>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
