import Link from "next/link";
import { about } from "@/content/about-old";
import { Container } from "@/components/layout/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { FadeIn } from "@/components/motion/fade-in";
import { PageHero } from "@/components/sections/page-hero";
import { DecadeHeroVisual } from "@/components/diagrams/decade-hero-visual";
import { AboutTimeline } from "@/components/sections/legacy/about-timeline";
import { PersonCard } from "@/components/sections/legacy/person-card";
import { CtaBand } from "@/components/sections/cta-band";
import { ProfessionalStanding } from "@/components/sections/professional-standing";

const cardHover =
  "rounded-lg border border-line transition-[translate,border-color,box-shadow] duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] group-hover:-translate-y-[3px] group-hover:border-ink/25 group-hover:shadow-[var(--elevation-card-hover)]";

export const metadata = {
  title: "About (old design)",
  description: about.body,
  robots: { index: false, follow: true },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        title={about.headline}
        body={about.body}
        visual={<DecadeHeroVisual />}
      />

      <AboutTimeline />

      <ProfessionalStanding />

      <section className="bg-subtle">
        <Container className="py-12 md:py-16">
          <FadeIn>
            <Eyebrow>{about.peopleEyebrow}</Eyebrow>
            <h2 className="text-4xl font-bold tracking-[-0.025em] text-ink md:text-5xl">
              {about.peopleTitle}
            </h2>
            <p className="mt-4 max-w-4xl text-lg leading-8 text-ink-secondary">
              {about.peopleBody}
            </p>
          </FadeIn>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {about.people.map((person, i) => (
              <FadeIn key={person.name} delay={i * 0.04} className="h-full">
                <PersonCard person={person} />
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      <section>
        <Container className="py-12 md:py-16">
          <FadeIn>
            <Eyebrow>{about.geographyEyebrow}</Eyebrow>
            <h2 className="text-4xl font-bold tracking-[-0.025em] text-ink md:text-5xl">
              {about.geographyTitle}
            </h2>
            <p className="mt-4 max-w-4xl text-lg leading-8 text-ink-secondary">
              {about.geographyBody}
            </p>
          </FadeIn>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {about.geography.map((place, i) => (
              <FadeIn key={place.city} delay={i * 0.08}>
                <div className="group h-full">
                  <article className={`flex h-full flex-col bg-page p-7 text-ink ${cardHover}`}>
                    <p className="font-mono text-[12px] font-bold tracking-[0.14em] text-brand">
                      {place.role}
                    </p>
                    <h3 className="mt-3 text-xl font-bold">{place.city}</h3>
                    <p className="mt-3 text-sm leading-6 text-ink-secondary">{place.note}</p>
                  </article>
                </div>
              </FadeIn>
            ))}
          </div>
          <p className="mt-8 text-sm text-ink-muted">
            {about.entitiesNote}{" "}
            <Link href="/why-emfi#regulated-entities" className="font-semibold text-brand hover:underline">
              {about.entitiesCta}
            </Link>
            .
          </p>
        </Container>
      </section>

      <CtaBand
        title={about.ctaTitle}
        body={about.ctaBody}
        action={about.ctaButton}
        sectionLink
      />
    </>
  );
}
