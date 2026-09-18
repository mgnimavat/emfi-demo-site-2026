import { Button } from "@/components/ui/button";
import { Container } from "@/components/layout/container";
import { home } from "@/content/home";

type CtaLocation = {
  label: string;
  address: string;
  email: string;
};

export function CtaFeatured({
  title = home.ctaTitle,
  body = home.ctaBody,
  action = home.ctaButton,
  locations = home.ctaLocations,
}: {
  title?: string;
  body?: string;
  action?: string;
  locations?: readonly CtaLocation[];
}) {
  const titleLines = title.split("\n").filter(Boolean);

  return (
    <section className="bg-page pb-10 pt-10 md:pb-14 md:pt-14">
      <Container>
        <div className="emfi-cta-featured relative overflow-hidden rounded-xl px-6 py-16 text-center text-ink-inverse md:px-16 md:py-24">
          <span aria-hidden className="emfi-cta-sweep">
            <span className="emfi-cta-sweep-scan">
              <span className="emfi-cta-sweep-wake" />
              <span className="emfi-cta-sweep-halo" />
              <span className="emfi-cta-sweep-core" />
            </span>
          </span>
          <div className="relative z-10 mx-auto max-w-3xl">
            <h2 className="text-4xl font-bold leading-[1.05] tracking-[-0.02em] md:text-6xl lg:text-[4.5rem]">
              {titleLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-ink-inverse-muted md:text-lg md:leading-8">
              {body}
            </p>
            {locations.length > 0 ? (
              <div className="mx-auto mt-10 grid max-w-4xl gap-6 border-t border-line-inverse/50 pt-6 text-left md:grid-cols-2 md:gap-0 md:divide-x md:divide-line-inverse/50">
                {locations.map((place) => (
                  <article key={place.email} className="md:px-10 md:first:pl-0 md:last:pr-0">
                    <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-ink-inverse-muted">
                      {place.label}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-ink-inverse">
                      {place.address}{" "}
                      <span className="text-ink-inverse-muted">·</span>{" "}
                      <a
                        href={`mailto:${place.email}`}
                        className="font-semibold text-ink-inverse underline-offset-2 hover:underline"
                      >
                        {place.email}
                      </a>
                    </p>
                  </article>
                ))}
              </div>
            ) : null}
            <div className="mt-10">
              <Button href="/contact" variant="inverse">
                {action}
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
