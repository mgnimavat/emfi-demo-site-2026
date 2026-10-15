import { home3 as home } from "@/content/home-3";
import { Container } from "@/components/layout/container";
import { FadeIn } from "@/components/motion/fade-in";
import { Home3ContactForm } from "@/components/sections/home-3/contact-form";

export function Home3Contact() {
  return (
    <section id="contact" className="scroll-mt-[72px] bg-page" aria-labelledby="contact-title">
      <Container className="grid items-start gap-10 py-16 md:py-24 lg:grid-cols-2 lg:gap-16">
        <FadeIn>
          <h2
            id="contact-title"
            className="font-heading text-[clamp(2rem,4.2vw,3.5rem)] font-bold leading-[1.08] tracking-[-0.03em] text-ink"
          >
            {home.contact.title}
          </h2>
        </FadeIn>
        <FadeIn delay={0.08}>
          <Home3ContactForm />
        </FadeIn>
      </Container>
    </section>
  );
}
