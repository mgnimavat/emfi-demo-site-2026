import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { trust } from "@/content/trust-old";
import { Container } from "@/components/layout/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { FadeIn } from "@/components/motion/fade-in";
import { CtaBand } from "@/components/sections/cta-band";
import { PageHero } from "@/components/sections/page-hero";
import { HeroRings } from "@/components/sections/hero-rings";
import { cn } from "@/lib/cn";

export const metadata = {
  title: "Why EMFI (old design)",
  description: trust.body,
  robots: { index: false, follow: true },
};

const cardHover =
  "rounded-lg border border-line transition-[translate,border-color,box-shadow] duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover:-translate-y-[3px] group-hover:border-ink/25 group-hover:shadow-[var(--elevation-card-hover)]";

const authorisedLogoMotion =
  "duration-600 ease-[cubic-bezier(0.4,0,0.2,1)]";

export default function WhyEmfiOldPage() {
  return (
    <>
      <PageHero
        title={trust.headline}
        body={trust.body}
        visual={<HeroRings />}
        visualOverlay
      />

      <section>
        <Container className="py-12 md:py-16">
          <FadeIn>
            <Eyebrow>{trust.authorisedEyebrow}</Eyebrow>
            <h2 className="text-4xl font-bold tracking-[-0.025em] text-ink md:text-5xl">
              {trust.authorisedTitle}
            </h2>
            <p className="mt-4 max-w-4xl text-lg leading-8 text-ink-secondary">
              {trust.authorisedBody}
            </p>
          </FadeIn>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {trust.regulators.map((item, i) => (
              <FadeIn key={item.code} delay={i * 0.08}>
                <div className="group relative h-[8.5rem]">
                <article
                  tabIndex={0}
                  className={`absolute inset-0 overflow-hidden bg-card outline-none group-hover:z-10 group-hover:bg-page focus-visible:ring-2 focus-visible:ring-brand-focus ${cardHover}`}
                >
                  <div className={`absolute inset-y-0 left-0 right-0 flex items-center justify-center overflow-visible px-4 transition-[right,padding] ${authorisedLogoMotion} group-hover:right-[66%] group-hover:px-3 group-focus-within:right-[66%] group-focus-within:px-3`}>
                    <span
                      className={
                        item.mark
                          ? `relative h-20 w-20 overflow-hidden rounded-full transition-[width,height] ${authorisedLogoMotion} group-hover:h-16 group-hover:w-16 group-focus-within:h-16 group-focus-within:w-16`
                          : "flex items-center justify-center"
                      }
                    >
                      <Image
                        src={item.logo}
                        alt={item.name}
                        width={item.logoWidth}
                        height={item.logoHeight}
                        className={
                          item.mark
                            ? `h-20 w-20 object-cover grayscale transition-[filter,width,height] ${authorisedLogoMotion} group-hover:h-16 group-hover:w-16 group-hover:grayscale-0 group-focus-within:h-16 group-focus-within:w-16 group-focus-within:grayscale-0`
                            : `h-20 w-auto max-h-20 max-w-[13rem] overflow-visible object-contain object-center grayscale transition-[filter,max-height,max-width] ${authorisedLogoMotion} group-hover:max-h-12 group-hover:max-w-[8.5rem] group-hover:grayscale-0 group-focus-within:max-h-12 group-focus-within:max-w-[8.5rem] group-focus-within:grayscale-0`
                        }
                        unoptimized
                      />
                    </span>
                  </div>
                  <div className={`pointer-events-none absolute inset-y-0 right-0 z-10 flex w-[66%] flex-col justify-center border-l border-transparent pr-5 pl-3 text-left opacity-0 transition-opacity ${authorisedLogoMotion} group-hover:opacity-100 group-focus-within:opacity-100`}>
                    <h3 className="text-base font-bold leading-snug text-ink md:text-lg">{item.name}</h3>
                    <ul className="mt-1.5 flex flex-col gap-0.5">
                      {item.entries.map((entry) => (
                        <li key={entry.href}>
                          <a
                            href={entry.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="pointer-events-auto inline-flex items-center gap-1 text-xs font-medium text-brand hover:underline"
                          >
                            {entry.entity}
                            <ArrowUpRight size={13} aria-hidden className="shrink-0" />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
                </div>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-subtle">
        <Container className="py-12 md:py-16">
          <FadeIn>
            <Eyebrow>{trust.regulatedEyebrow}</Eyebrow>
            <h2 className="text-4xl font-bold tracking-[-0.025em] text-ink md:text-5xl">
              {trust.regulatedTitle}
            </h2>
            <p className="mt-4 max-w-4xl text-lg leading-8 text-ink-secondary">
              {trust.regulatedBody}
            </p>
          </FadeIn>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {trust.regimes.map((item, i) => (
              <FadeIn key={item.code} delay={i * 0.06}>
                <div className="group h-full">
                <article className={`h-full bg-page p-7 text-ink ${cardHover}`}>
                  <p className="font-mono text-[12px] font-bold tracking-[0.14em] text-brand">
                    {item.code}
                  </p>
                  <h3 className="mt-3 text-xl font-bold">{item.name}</h3>
                  <p className="mt-3 text-sm leading-6 text-ink-secondary">{item.body}</p>
                </article>
                </div>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      <section>
        <Container className="py-12 md:py-16">
          <FadeIn>
            <Eyebrow>{trust.auditableEyebrow}</Eyebrow>
            <h2 className="text-4xl font-bold tracking-[-0.025em] text-ink md:text-5xl">
              {trust.auditableTitle}
            </h2>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-ink-secondary">
              {trust.auditableBody}
            </p>
          </FadeIn>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {trust.auditors.map((item, i) => (
              <FadeIn key={item.name} delay={i * 0.08}>
                <div className="group h-full">
                  <article
                    className={`flex h-[8.5rem] items-center justify-center bg-page px-7 ${cardHover}`}
                  >
                    <Image
                      src={item.logo}
                      alt={item.name}
                      width={item.logoWidth}
                      height={item.logoHeight}
                      className={cn(
                        "h-14 w-auto max-w-[240px] object-contain grayscale transition-[filter] duration-300 group-hover:grayscale-0",
                        item.ink &&
                          "contrast-[0.38] group-hover:contrast-100",
                      )}
                      unoptimized
                    />
                  </article>
                </div>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      <section id="regulated-entities" className="scroll-mt-24 bg-subtle">
        <Container className="py-12 md:py-16">
          <FadeIn>
            <Eyebrow>{trust.entitiesEyebrow}</Eyebrow>
            <h2 className="text-4xl font-bold tracking-[-0.025em] text-ink md:text-5xl">
              {trust.entitiesTitle}
            </h2>
            <p className="mt-4 max-w-4xl text-lg leading-8 text-ink-secondary">
              {trust.entitiesBody}
            </p>
          </FadeIn>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {trust.entities.map((item, i) => (
              <FadeIn key={item.name} delay={i * 0.05}>
                <div className="group h-full">
                  <article className={`h-full bg-page p-7 ${cardHover}`}>
                    <h3 className="font-mono text-sm font-bold uppercase tracking-[0.12em] text-ink">
                      {item.name}
                    </h3>
                    <div className="mt-4 grid gap-6 border-t border-line pt-5 sm:grid-cols-2">
                      <div>
                        <p className="text-lg font-bold text-ink">{item.jurisdiction}</p>
                        <p className="mt-1 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-ink-muted">
                          Jurisdiction
                        </p>
                      </div>
                      <div>
                        <p className="text-lg font-bold text-ink">{item.regulator}</p>
                        <p className="mt-1 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-ink-muted">
                          Regulator
                        </p>
                      </div>
                    </div>
                    <div className="mt-6">
                      <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-ink-muted">
                        Role
                      </p>
                      <p className="mt-1 text-sm leading-6 text-ink-secondary">{item.role}</p>
                    </div>
                  </article>
                </div>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      <CtaBand title={trust.ctaTitle} body={trust.ctaBody} action={trust.ctaButton} />
    </>
  );
}
