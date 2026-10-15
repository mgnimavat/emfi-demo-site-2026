import { home3 as home } from "@/content/home-3";
import { Container } from "@/components/layout/container";
import { FadeIn } from "@/components/motion/fade-in";

export function ExpectMore() {
  return (
    <section id="expect" className="scroll-mt-[72px] border-t border-line bg-page" aria-labelledby="expect-title">
      <Container className="py-16 md:py-24">
        <FadeIn>
          <h2
            id="expect-title"
            className="font-heading text-[clamp(2rem,4.2vw,3.5rem)] font-bold leading-[1.08] tracking-[-0.03em] text-ink"
          >
            {home.expect.title}
          </h2>
        </FadeIn>
      </Container>
    </section>
  );
}
