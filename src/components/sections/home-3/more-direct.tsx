import { home3 as home } from "@/content/home-3";
import { Container } from "@/components/layout/container";
import { FadeIn } from "@/components/motion/fade-in";
import { BrandSign } from "@/components/brand/logo";

function FlowNode({
  label,
  sub,
  hub = false,
}: {
  label: string;
  sub: string;
  hub?: boolean;
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center text-center">
      <div
        className={
          hub
            ? "flex h-16 w-16 items-center justify-center rounded-full bg-inverse text-ink-inverse"
            : "flex h-16 w-16 items-center justify-center rounded-full border border-line bg-page text-ink"
        }
      >
        {hub ? <BrandSign className="h-8 w-8" /> : <span className="font-heading text-lg font-bold">{label[0]}</span>}
      </div>
      <p className="mt-3 font-heading text-[1.15rem] font-bold leading-[1.15] tracking-[-0.02em] text-ink">{label}</p>
      <p className="mt-1 text-sm leading-5 text-ink-muted">{sub}</p>
    </div>
  );
}

function FlowLink() {
  return (
    <span
      aria-hidden
      className="mb-10 hidden h-px w-12 shrink-0 bg-[linear-gradient(90deg,var(--flow-from),var(--flow-mid),var(--flow-to))] sm:block md:w-20"
    />
  );
}

export function MoreDirect() {
  const [client, hub, depository] = home.direct.nodes;

  return (
    <section id="direct" className="scroll-mt-[72px] bg-subtle" aria-labelledby="direct-title">
      <Container className="py-16 md:py-24">
        <FadeIn>
          <h2
            id="direct-title"
            className="font-heading text-[clamp(2rem,4.2vw,3.5rem)] font-bold leading-[1.08] tracking-[-0.03em] text-ink"
          >
            {home.direct.title}
          </h2>
          <p className="mt-5 max-w-3xl text-[clamp(1.0625rem,1.7vw,1.25rem)] font-normal leading-[1.55] text-ink-secondary">
            {home.direct.body}
          </p>
        </FadeIn>

        <FadeIn delay={0.12} className="mt-10">
          <div className="rounded-[10px] border border-black/6 bg-white px-5 py-8 shadow-[0_18px_50px_rgba(15,23,42,0.12),0_2px_10px_rgba(15,23,42,0.06)] md:px-10 md:py-10">
            <p className="mb-5 text-center font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-ink-muted">
              Replaced intermediaries
            </p>
            <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
              {home.direct.via.map((name) => (
                <span
                  key={name}
                  className="rounded-full border border-line bg-subtle px-3 py-1.5 text-sm text-ink-muted line-through decoration-ink-muted/50"
                >
                  {name}
                </span>
              ))}
            </div>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-0">
              <FlowNode label={client.label} sub={client.sub} />
              <FlowLink />
              <FlowNode label={hub.label} sub={hub.sub} hub />
              <FlowLink />
              <FlowNode label={depository.label} sub={depository.sub} />
            </div>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
