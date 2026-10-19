import { Building2, Network, WalletCards } from "lucide-react";
import { services } from "@/content/services-old";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Eyebrow } from "@/components/ui/eyebrow";
import { FadeIn } from "@/components/motion/fade-in";
import { PageHero } from "@/components/sections/page-hero";

export const metadata = {
  title: "Services",
  description: services.body,
  robots: { index: false, follow: true },
};

const audienceIcons = [Building2, Network, WalletCards];

export default function ServicesOldPage() {
  return (
    <>
      <PageHero title={services.headline} body={services.body}>
        <div className="mt-9">
          <Button href="/contact">{services.cta}</Button>
        </div>
      </PageHero>

      <section>
        <Container className="py-12 md:py-16">
          <FadeIn>
            <Eyebrow>{services.whatEyebrow}</Eyebrow>
            <h2 className="mb-14 text-4xl font-bold text-ink md:text-5xl">
              {services.whatTitle}
            </h2>
          </FadeIn>
          <div className="space-y-5">
            {services.items.map((item, i) => (
              <FadeIn key={item.num} delay={i * 0.08}>
                <article
                  className={`grid gap-8 rounded-lg border p-8 emfi-card-lift md:grid-cols-[200px_1fr] md:p-14 ${
                    item.kind ? "border-brand-focus/25 bg-soft" : "border-line bg-card"
                  }`}
                >
                  <div>
                    <p className={`font-mono text-sm ${item.kind ? "text-brand" : "text-ink-muted"}`}>
                      {item.num}
                    </p>
                    <h3 className="mt-4 text-2xl font-semibold text-ink">{item.title}</h3>
                    {item.kind ? (
                      <p className="mt-5 font-mono text-[10px] uppercase tracking-widest text-brand">
                        {item.core}
                      </p>
                    ) : null}
                  </div>
                  <div>
                    <p className="max-w-2xl text-lg leading-8 text-ink-secondary">{item.desc}</p>
                    <div className="mt-7 flex flex-wrap gap-x-7 gap-y-2">
                      {item.features.map((f) => (
                        <span key={f} className="text-[12px] text-ink-muted">
                          — {f}
                        </span>
                      ))}
                    </div>
                    <Button
                      href={item.path}
                      variant="secondary"
                      className="mt-8 min-h-0 px-5 py-3 text-[12px] font-semibold"
                    >
                      {services.explorePrefix} {item.title}
                    </Button>
                  </div>
                </article>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-line bg-subtle">
        <Container className="py-12 md:py-16">
          <FadeIn>
            <Eyebrow>{services.serveEyebrow}</Eyebrow>
            <h2 className="max-w-3xl whitespace-pre-line text-4xl font-bold text-ink md:text-5xl">
              {services.serveTitle}
            </h2>
          </FadeIn>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {services.audiences.map((audience, i) => {
              const Icon = audienceIcons[i];
              return (
                <FadeIn key={audience.title} delay={i * 0.08}>
                  <Card>
                    <Icon size={24} className="mb-14 text-brand" />
                    <h3 className="text-xl font-semibold text-ink">{audience.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-ink-secondary">{audience.desc}</p>
                  </Card>
                </FadeIn>
              );
            })}
          </div>
        </Container>
      </section>
    </>
  );
}
