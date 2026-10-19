import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { wealth } from "@/content/wealth";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Eyebrow } from "@/components/ui/eyebrow";
import { FadeIn } from "@/components/motion/fade-in";
import { PageHero } from "@/components/sections/page-hero";
import { PortfolioView } from "@/components/mockups/portfolio-view";

export const metadata = {
  title: wealth.title,
  description: wealth.body,
};

export default function WealthAssetManagementPage() {
  return (
    <>
      <PageHero title={wealth.headline} body={wealth.body} />

      <section>
        <Container className="py-12 md:py-16">
          <div className="grid gap-4 md:grid-cols-3">
            {wealth.pillars.map((pillar, i) => (
              <FadeIn key={pillar.title} delay={i * 0.08}>
                <Card className="h-full">
                  <p className="font-mono text-[12px] font-bold tracking-[0.14em] text-brand">
                    {pillar.regime}
                  </p>
                  <h3 className="mt-4 text-2xl font-bold text-ink">{pillar.title}</h3>
                  <p className="mt-4 text-sm leading-6 text-ink-secondary">{pillar.body}</p>
                  <p className="mt-6 text-xs leading-5 text-ink-muted">{pillar.entity}</p>
                </Card>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-subtle">
        <Container className="py-12 md:py-16">
          <FadeIn>
            <Eyebrow>{wealth.fundNoteEyebrow}</Eyebrow>
            <h2 className="max-w-3xl text-4xl font-bold tracking-[-0.025em] text-ink md:text-5xl">
              {wealth.fundNoteTitle}
            </h2>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-ink-secondary">
              {wealth.fundNoteBody}
            </p>
          </FadeIn>
        </Container>
      </section>

      <section>
        <Container className="py-12 md:py-16">
          <FadeIn>
            <Eyebrow>{wealth.problemEyebrow}</Eyebrow>
            <h2 className="max-w-4xl text-4xl font-bold tracking-[-0.025em] text-ink md:text-5xl">
              {wealth.problemTitle}
            </h2>
          </FadeIn>
          <div className="mt-8 grid overflow-hidden rounded-lg border border-line md:grid-cols-2">
            <div className="border-b border-line p-8 md:border-b-0 md:border-r">
              <p className="font-mono text-[11px] text-ink-muted">{wealth.typicallyLabel}</p>
              {wealth.typically.map((item) => (
                <p
                  key={item}
                  className="mt-7 border-b border-line pb-4 text-sm text-ink-secondary last:border-0"
                >
                  — {item}
                </p>
              ))}
            </div>
            <div className="bg-inverse p-8 text-ink-inverse">
              <p className="font-mono text-[11px] text-ink-inverse-muted">{wealth.emfiLabel}</p>
              {wealth.emfiProvides.map((item) => (
                <p
                  key={item}
                  className="mt-7 border-b border-line-inverse/40 pb-4 text-sm text-ink-inverse-muted last:border-0"
                >
                  + {item}
                </p>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-subtle">
        <Container className="py-12 md:py-16">
          <FadeIn>
            <Eyebrow>{wealth.getEyebrow}</Eyebrow>
            <h2 className="text-4xl font-bold tracking-[-0.025em] text-ink md:text-5xl">
              {wealth.getTitle}
            </h2>
          </FadeIn>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {wealth.getItems.map((title, i) => (
              <FadeIn key={title} delay={i * 0.08}>
                <Card>
                  <ShieldCheck className="mb-16 text-brand" size={23} />
                  <h3 className="text-xl font-semibold text-ink">{title}</h3>
                  <p className="mt-4 text-sm leading-6 text-ink-secondary">{wealth.getBody}</p>
                </Card>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      <section>
        <Container className="py-12 md:py-16">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <FadeIn>
              <Eyebrow>{wealth.visEyebrow}</Eyebrow>
              <h2 className="text-4xl font-bold tracking-[-0.025em] text-ink">
                {wealth.visTitle}
              </h2>
              <p className="mt-5 text-lg leading-8 text-ink-secondary">{wealth.visBody}</p>
              <p className="mt-6 text-sm text-ink-muted">
                Legal entities for each activity are listed on{" "}
                <Link href="/why-emfi" className="font-semibold text-brand hover:underline">
                  Why EMFI
                </Link>
                .
              </p>
            </FadeIn>
            <FadeIn delay={0.12}>
              <PortfolioView />
            </FadeIn>
          </div>
        </Container>
      </section>

      <section className="bg-inverse text-ink-inverse mt-10 md:mt-14 mb-10 md:mb-14">
        <Container className="py-12 md:py-16">
          <FadeIn>
            <Eyebrow inverse>{wealth.onboardEyebrow}</Eyebrow>
            <h2 className="text-4xl font-bold tracking-[-0.025em] md:text-5xl">
              {wealth.onboardTitle}
            </h2>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-ink-inverse-muted">
              {wealth.onboardBody}
            </p>
          </FadeIn>
          <div className="mt-10 grid gap-3 md:grid-cols-2">
            {wealth.criteria.map((item) => (
              <div
                key={item}
                className="rounded-md border border-line-inverse/40 p-5 font-mono text-[11px] text-ink-inverse-muted emfi-card-lift"
              >
                <span className="mr-3 text-ink-inverse">✓</span>
                {item}
              </div>
            ))}
          </div>
          <div className="mt-10">
            <Button href="/contact" variant="inverse">
              {wealth.cta}
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
