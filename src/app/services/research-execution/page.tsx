import Link from "next/link";
import { execution } from "@/content/execution";
import { Container } from "@/components/layout/container";
import { Card } from "@/components/ui/card";
import { Eyebrow } from "@/components/ui/eyebrow";
import { FadeIn } from "@/components/motion/fade-in";
import { PageHero } from "@/components/sections/page-hero";
import { CtaBand } from "@/components/sections/cta-band";
import { BloombergBand } from "@/components/sections/bloomberg-band";
import { ResearchExplorer } from "@/components/demos/research-explorer";
import { SecurityLookup } from "@/components/demos/security-lookup";
import { HeroMockup } from "@/components/mockups/operating-view";

export const metadata = {
  title: execution.title,
  description: execution.body,
};

export default function ResearchExecutionPage() {
  return (
    <>
      <PageHero
        title={execution.headline}
        body={execution.body}
        visualWide
        visual={
          <>
            <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-ink-muted">
              {execution.mockupLabel} · {execution.mockupStatus}
            </p>
            <HeroMockup />
          </>
        }
      />

      <section className="border-b border-line bg-subtle">
        <Container className="py-10">
          <div className="grid gap-8 md:grid-cols-3">
            {execution.highlights.map(([label, body]) => (
              <div key={label} className="border-l-2 border-brand pl-5">
                <p className="font-mono text-[11px] text-ink-muted">{label}</p>
                <p className="mt-3 text-sm leading-6 text-ink">{body}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 max-w-3xl text-sm leading-6 text-ink-secondary">
            {execution.entity}{" "}
            <Link href="/trust" className="font-semibold text-brand hover:underline">
              {execution.entityCta}
            </Link>
            .
          </p>
        </Container>
      </section>

      <section>
        <Container className="grid gap-10 py-12 md:grid-cols-2 md:py-16">
          <FadeIn>
            <Eyebrow>{execution.researchEyebrow}</Eyebrow>
            <h2 className="text-3xl font-bold tracking-[-0.025em] text-ink md:text-4xl">
              {execution.researchTitle}
            </h2>
            <p className="mt-4 text-base leading-7 text-ink-secondary">
              {execution.researchBody}
            </p>
          </FadeIn>
          <FadeIn delay={0.08}>
            <Eyebrow>{execution.executionEyebrow}</Eyebrow>
            <h2 className="text-3xl font-bold tracking-[-0.025em] text-ink md:text-4xl">
              {execution.executionTitle}
            </h2>
            <p className="mt-4 text-base leading-7 text-ink-secondary">
              {execution.executionBody}
            </p>
          </FadeIn>
        </Container>
      </section>

      <section className="bg-subtle">
        <Container className="py-12 md:py-16">
          <FadeIn>
            <Eyebrow>{execution.howEyebrow}</Eyebrow>
            <h2 className="text-4xl font-bold tracking-[-0.025em] text-ink md:text-5xl">
              {execution.howTitle}
            </h2>
          </FadeIn>
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {execution.steps.map(([title, body], i) => (
              <FadeIn key={title} delay={i * 0.08}>
                <Card>
                  <div className="mb-10 font-mono text-sm text-brand">0{i + 1}</div>
                  <h3 className="text-xl font-semibold text-ink">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-ink-secondary">{body}</p>
                </Card>
              </FadeIn>
            ))}
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {execution.books.map(([title, body], i) => (
              <article
                key={title}
                className={`rounded-lg border p-6 ${
                  i === 0
                    ? "border-brand bg-inverse text-ink-inverse"
                    : "border-line bg-card text-ink"
                }`}
              >
                <h3 className="text-lg font-semibold">{title}</h3>
                <p
                  className={`mt-3 text-sm leading-6 ${
                    i === 0 ? "text-ink-inverse-muted" : "text-ink-secondary"
                  }`}
                >
                  {body}
                </p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section>
        <Container className="py-12 md:py-16">
          <FadeIn>
            <Eyebrow>{execution.demoResearchEyebrow}</Eyebrow>
            <h2 className="text-4xl font-bold tracking-[-0.025em] text-ink">
              {execution.demoResearchTitle}
            </h2>
          </FadeIn>
          <div className="mt-8">
            <ResearchExplorer />
          </div>
        </Container>
      </section>

      <BloombergBand />

      <section className="bg-subtle">
        <Container className="py-12 md:py-16">
          <FadeIn>
            <Eyebrow>{execution.demoExecutionEyebrow}</Eyebrow>
            <h2 className="text-4xl font-bold tracking-[-0.025em] text-ink">
              {execution.demoExecutionTitle}
            </h2>
            <p className="mt-4 max-w-4xl text-lg leading-8 text-ink-secondary">
              {execution.demoExecutionBody}
            </p>
          </FadeIn>
          <div className="mt-8">
            <SecurityLookup />
          </div>
        </Container>
      </section>

      <CtaBand
        eyebrow={execution.followEyebrow}
        title={execution.followTitle}
        body={execution.followBody}
        action="Discuss your requirements"
      />
    </>
  );
}
