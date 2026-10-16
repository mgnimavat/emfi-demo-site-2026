import { ArrowDownRight, Check, ChartNoAxesCombined, Layers3, ScanLine } from "lucide-react";
import { services } from "@/content/services-new";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { FadeIn } from "@/components/motion/fade-in";
import { PageHero } from "@/components/sections/page-hero";
import { ProductShowcase } from "@/components/sections/services/product-showcase";
import { BrandSign } from "@/components/brand/logo";

export const metadata = {
  title: services.title,
  description: services.body,
};

const serviceIcons = [ScanLine, Layers3, ChartNoAxesCombined];

export default function ServicesNewPage() {
  return (
    <>
      <PageHero
        title={services.headline}
        body={services.body}
        visualWide
        lead={<Eyebrow>{services.eyebrow}</Eyebrow>}
        visual={
          <nav aria-label="Services on this page" className="relative isolate overflow-hidden rounded-xl border border-line bg-page p-5 shadow-[var(--elevation-card-hover)] sm:p-7 lg:p-8">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-64"
              style={{ background: "radial-gradient(ellipse at 100% 0%, var(--bg-soft), transparent 70%)" }}
            >
              <BrandSign className="absolute -right-8 -top-10 size-52 text-[var(--color-blue-100)] opacity-30 sm:-right-6 sm:size-60 [mask-image:linear-gradient(135deg,transparent_5%,black_60%,transparent_100%)]" />
            </div>
            <div className="mb-7 flex items-start justify-between gap-4 border-b border-line pb-6">
              <div>
                <p className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.12em] text-ink-secondary">
                  <span className="size-1.5 rounded-full bg-brand-focus" aria-hidden />
                  One relationship
                </p>
                <p className="mt-3 max-w-[15rem] text-2xl font-semibold leading-tight tracking-[-0.035em] text-ink sm:max-w-none sm:text-[28px]">Three connected capabilities.</p>
              </div>
            </div>
            <div className="relative grid gap-3">
              <span aria-hidden className="pointer-events-none absolute bottom-12 left-[43px] top-12 w-px bg-line-strong sm:left-[51px]" />
              {services.items.map((item, i) => {
                const Icon = serviceIcons[i];
                return (
                  <a
                    key={item.num}
                    href={`#svc-${item.num}`}
                    className={`group relative flex items-center gap-4 rounded-lg border p-3.5 transition-[background-color,border-color,box-shadow] duration-300 hover:border-brand hover:bg-brand hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-focus sm:gap-5 sm:p-5 ${i === 1 ? "border-brand-focus/10 bg-soft" : "border-line bg-page"}`}
                  >
                    <span className="relative flex size-14 shrink-0 items-center justify-center rounded-md border border-line bg-page text-brand shadow-sm transition-[background-color,border-color,color] duration-300 group-hover:border-ink-inverse/20 group-hover:bg-ink-inverse/10 group-hover:text-ink-inverse sm:size-16">
                      <Icon size={27} strokeWidth={1.35} aria-hidden />
                      <span aria-hidden className="absolute -right-1 -top-1 size-2.5 rounded-full border-[3px] border-page bg-brand-focus transition-colors group-hover:border-brand group-hover:bg-ink-inverse" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="mt-1 block text-lg font-semibold leading-snug tracking-[-0.025em] text-ink transition-colors group-hover:text-ink-inverse sm:text-2xl">{item.title}</span>
                      <span className="mt-2 block text-sm leading-6 text-ink-secondary transition-colors group-hover:text-ink-inverse-muted">{item.slogan.replace(/\n/g, " ")}</span>
                    </span>
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-line bg-page text-ink-muted transition-[transform,background-color,border-color,color] duration-300 group-hover:translate-y-0.5 group-hover:border-ink-inverse/20 group-hover:bg-ink-inverse/10 group-hover:text-ink-inverse sm:size-10">
                      <ArrowDownRight size={17} aria-hidden />
                    </span>
                  </a>
                );
              })}
            </div>
          </nav>
        }
      />

      <section aria-labelledby="services-heading">
        <Container className="py-12 md:py-16">
          <FadeIn>
            <Eyebrow>What we do</Eyebrow>
            <h2 id="services-heading" className="mb-10 text-4xl font-bold tracking-[-0.025em] text-ink md:mb-14 md:text-5xl">
              Everything connected. Nothing unnecessary.
            </h2>
          </FadeIn>
          <div className="space-y-5">
            {services.items.map((item, i) => {
              const Icon = serviceIcons[i];
              return (
                <FadeIn key={item.num} delay={i * 0.08}>
                  <article
                    id={`svc-${item.num}`}
                    aria-labelledby={`service-title-${i}`}
                    className={`emfi-card-lift relative isolate grid scroll-mt-24 overflow-hidden rounded-lg border bg-page md:grid-cols-[minmax(0,0.8fr)_minmax(0,2fr)] ${i === 1 ? "border-brand-focus/20" : "border-line"}`}
                    style={{
                      backgroundImage: `radial-gradient(ellipse at ${i === 1 ? "100% 100%" : "100% 0%"}, var(--bg-soft), transparent 62%)`,
                    }}
                  >
                    <BrandSign
                      className="pointer-events-none absolute -right-12 -bottom-16 size-64 text-[var(--color-blue-200)] opacity-15 sm:-right-10 sm:size-72"
                    />
                    <div className={`relative z-10 flex flex-col border-b border-line p-6 sm:p-8 md:border-b-0 md:border-r lg:p-10 ${i === 1 ? "bg-linear-to-br from-soft via-soft to-page" : "bg-linear-to-br from-card via-card to-soft/50"}`}>
                      <div className="mb-7 flex items-center justify-between gap-4">
                        <span className="flex size-14 items-center justify-center rounded-md border border-line bg-page text-brand shadow-sm">
                          <Icon size={26} strokeWidth={1.4} aria-hidden />
                        </span>
                      </div>
                      <h3 id={`service-title-${i}`} className="max-w-xs text-2xl font-semibold leading-[1.2] tracking-[-0.035em] text-ink lg:text-[28px]">{item.title}</h3>
                      <p className="mt-4 max-w-[24ch] whitespace-pre-line text-base italic leading-7 text-ink-secondary">{item.slogan}</p>
                      <span aria-hidden className="mt-8 h-1 w-8 rounded-full bg-brand-focus/40 md:mt-auto md:pt-0" />
                    </div>
                    <div className="relative z-10 p-6 sm:p-8 lg:p-10">
                      <p className="max-w-3xl text-lg font-bold leading-8 text-ink md:text-xl md:leading-9">{item.desc}</p>
                      <ul className="mt-7 grid gap-x-8 sm:grid-cols-2">
                        {item.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-3 border-t border-line py-5 text-base leading-7 text-ink">
                            <span className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-soft text-brand"><Check size={12} strokeWidth={2} aria-hidden /></span>
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-5 border-t border-line pt-6">
                        <Button href={item.path} className="max-w-full min-h-12 px-6 py-3.5 text-[15px] font-semibold sm:px-7">{item.cta}</Button>
                      </div>
                    </div>
                  </article>
                </FadeIn>
              );
            })}
          </div>
        </Container>
      </section>

      <section id="product-evidence" aria-labelledby="evidence-title" className="scroll-mt-24 border-t border-line bg-page py-14 md:py-20">
        <Container>
          <FadeIn className="mb-10 grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-end lg:gap-20">
            <div>
              <Eyebrow className="text-xs">{services.evidence.eyebrow}</Eyebrow>
              <h2 id="evidence-title" className="text-4xl font-extrabold leading-[1.08] tracking-[-0.04em] text-ink md:text-5xl lg:text-6xl">{services.evidence.title}</h2>
            </div>
            <p className="max-w-2xl text-base leading-8 text-ink-secondary">{services.evidence.body}</p>
          </FadeIn>
          <ProductShowcase />
        </Container>
      </section>
    </>
  );
}
