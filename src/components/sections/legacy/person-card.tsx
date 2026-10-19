import { about } from "@/content/about-old";

const placeholderPhoto = "/people/placeholder.jpg";

export function PersonCard({
  person,
}: {
  person: (typeof about.people)[number];
}) {
  const photo = "photo" in person && person.photo ? person.photo : placeholderPhoto;

  return (
    <article
      tabIndex={0}
      className="emfi-person-card group h-full min-h-[300px] cursor-pointer overflow-hidden rounded-lg border border-line bg-page outline-none transition-[translate,border-color,box-shadow] duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] hover:-translate-y-[3px] hover:border-ink/25 hover:shadow-[var(--elevation-card-hover)] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-focus focus-visible:-translate-y-[3px] focus-visible:border-ink/25 focus-visible:shadow-[var(--elevation-card-hover)]"
    >
      <div className="emfi-person-card-inner relative h-full min-h-[300px]">
        <div className="emfi-person-card-front flex h-full min-h-[300px] flex-col items-center bg-page px-6 py-8 text-center">
          <div className="h-28 w-28 shrink-0 overflow-hidden rounded-full bg-subtle [clip-path:circle(50%)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo}
              alt=""
              width={112}
              height={112}
              className="block h-full w-full object-cover object-center [clip-path:circle(50%)]"
            />
          </div>
          <h3 className="mt-6 text-lg font-semibold text-ink">{person.name}</h3>
          <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-muted">
            {person.role}
          </p>
          <p className="sr-only">{person.description}</p>
          {"board" in person && person.board ? (
            <p className="mt-4 inline-block border border-brand/25 bg-soft px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-brand">
              {about.boardLabel}
            </p>
          ) : null}
        </div>
        <div
          aria-hidden
          className="emfi-person-card-back absolute inset-0 flex flex-col bg-[var(--color-blue-550)] px-6 py-7 text-center"
        >
          <p className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-ink-inverse-muted">
            {person.role}
          </p>
          <p className="mx-auto flex max-w-[15.5rem] flex-1 items-center justify-center text-[calc(1.35rem-2px)] font-semibold leading-[1.35] tracking-[-0.035em] text-ink-inverse">
            {person.description}
          </p>
          <p className="text-[13px] font-medium tracking-[0.01em] text-ink-inverse-muted">
            {person.name}
          </p>
        </div>
      </div>
    </article>
  );
}
