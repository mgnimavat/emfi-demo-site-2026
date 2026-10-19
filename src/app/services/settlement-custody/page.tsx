import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { settlement } from "@/content/settlement";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Eyebrow } from "@/components/ui/eyebrow";
import { FadeIn } from "@/components/motion/fade-in";
import { PageHero } from "@/components/sections/page-hero";
import { SettlementChain } from "@/components/diagrams/settlement-chain";
import { SettlementDemo } from "@/components/demos/settlement-demo";
import { WorkstationDemo } from "@/components/demos/workstation-demo";
import { OperatingView } from "@/components/mockups/operating-view";

export const metadata = {
  title: settlement.title,
  description: settlement.body,
};

export default function SettlementCustodyPage() {
  return (
    <>
      <PageHero title={settlement.headline} body={settlement.body}>
        <span className="mt-9 inline-block rounded-full border border-brand px-4 py-2 font-mono text-[11px] tracking-wide text-brand">
          {settlement.badge}
        </span>
      </PageHero>

      <section className="border-b border-line bg-subtle">
        <Container className="py-12 md:py-16">
          <FadeIn>
            <Eyebrow>{settlement.diffEyebrow}</Eyebrow>
            <h2 className="text-4xl font-bold tracking-[-0.025em] text-ink md:text-5xl">
              {settlement.diffTitle}
            </h2>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-ink-secondary">
              {settlement.diffBody}
            </p>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-ink-muted">
              {settlement.entity}{" "}
              <Link href="/why-emfi" className="font-semibold text-brand hover:underline">
                {settlement.entityCta}
              </Link>
              .
            </p>
          </FadeIn>
          <div className="mt-8 border-y border-line py-8">
            <SettlementChain nodes={settlement.chain} />
          </div>
        </Container>
      </section>

      <section>
        <Container className="py-12 md:py-16">
          <FadeIn>
            <Eyebrow>{settlement.visEyebrow}</Eyebrow>
            <h2 className="text-4xl font-bold tracking-[-0.025em] text-ink md:text-5xl">
              {settlement.visTitle}
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-ink-secondary">
              {settlement.visBody}
            </p>
          </FadeIn>
          <OperatingView
            tabs
            views={["Dashboard", "Securities", "Balances"] as const}
          />
        </Container>
      </section>

      <section className="bg-subtle">
        <Container className="py-12 md:py-16">
          <FadeIn>
            <Eyebrow>{settlement.demoEyebrow}</Eyebrow>
            <h2 className="text-4xl font-bold tracking-[-0.025em] text-ink md:text-5xl">
              {settlement.demoTitle}
            </h2>
            <p className="mt-4 max-w-4xl text-lg leading-8 text-ink-secondary">
              {settlement.demoBody}
            </p>
          </FadeIn>
          <div className="mt-8">
            <SettlementDemo />
          </div>
        </Container>
      </section>

      <section>
        <Container className="py-12 md:py-16">
          <FadeIn>
            <Eyebrow>{settlement.workstationEyebrow}</Eyebrow>
            <h2 className="text-4xl font-bold tracking-[-0.025em] text-ink md:text-5xl">
              {settlement.workstationTitle}
            </h2>
          </FadeIn>
          <div className="mt-8">
            <WorkstationDemo />
          </div>
        </Container>
      </section>

      <section className="bg-subtle">
        <Container className="py-12 md:py-16">
          <FadeIn>
            <Eyebrow>{settlement.assetEyebrow}</Eyebrow>
            <h2 className="max-w-3xl text-4xl font-bold tracking-[-0.025em] text-ink md:text-5xl">
              {settlement.assetTitle}
            </h2>
          </FadeIn>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {settlement.servicing.map(([heading, items], i) => (
              <FadeIn key={heading} delay={i * 0.08}>
                <Card>
                  <p className="font-mono text-[11px] tracking-widest text-ink-muted">
                    {heading}
                  </p>
                  {items.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 border-b border-line py-5 text-sm text-ink last:border-0"
                    >
                      <Check size={15} className="text-brand" />
                      {item}
                    </div>
                  ))}
                </Card>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      <section>
        <Container className="py-12 md:py-16">
          <FadeIn>
            <Eyebrow>{settlement.roleEyebrow}</Eyebrow>
            <h2 className="text-4xl font-bold tracking-[-0.025em] text-ink md:text-5xl">
              {settlement.roleTitle}
            </h2>
          </FadeIn>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {settlement.roles.map(([label, body, cta]) => (
              <article
                key={label}
                className="rounded-lg border border-line border-t-4 border-t-brand bg-card p-9 emfi-card-lift"
              >
                <p className="font-mono text-[11px] tracking-widest text-brand">{label}</p>
                <p className="mt-7 text-lg leading-8 text-ink-secondary">{body}</p>
                <div className="mt-8">
                  <Button href="/contact">{cta}</Button>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-line bg-subtle">
        <Container className="py-12 md:py-16">
          <FadeIn>
            <Eyebrow>{settlement.connectedEyebrow}</Eyebrow>
            <h2 className="text-4xl font-bold tracking-[-0.025em] text-ink md:text-5xl">
              {settlement.connectedTitle}
            </h2>
          </FadeIn>
          <div className="mt-12 flex flex-wrap items-center gap-2 font-mono text-[12px]">
            {settlement.connected.map((item, i) => (
              <span key={item} className="flex items-center gap-2">
                <span className="rounded-md border border-line bg-card px-5 py-4 text-ink">
                  {item}
                </span>
                {i < settlement.connected.length - 1 ? (
                  <ArrowRight size={14} className="text-brand" />
                ) : null}
              </span>
            ))}
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-7">
            {settlement.capabilities.map((item) => (
              <div
                key={item}
                className="rounded-lg border border-line bg-card p-5 text-center text-[12px] text-ink emfi-card-lift"
              >
                <Check className="mx-auto mb-8 text-brand" size={18} />
                {item}
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
