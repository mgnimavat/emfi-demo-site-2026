import { home1 as home } from "@/content/home-1";

export function HeroRouteBoard() {
  const { heroBoard: board, chainInfra } = home;

  return (
    <article
      className="relative overflow-hidden rounded-[1.25rem] px-5 py-6 text-ink-inverse md:px-7 md:py-8"
      style={{ background: "var(--bg-inverse)" }}
      aria-label={`${board.originTitle} to ${board.hubTitle} to institutional infrastructure`}
    >
      <header className="mb-7 flex items-start justify-between gap-4 md:mb-9">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink-inverse-muted">
          {board.kicker}
        </p>
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-ink-inverse-muted">
          {board.route}
        </p>
      </header>

      <div className="grid items-center gap-6 md:grid-cols-[minmax(0,0.9fr)_auto_minmax(0,1.1fr)] md:gap-3 lg:gap-5">
        <div className="flex flex-col">
          <div
            className="rounded-lg px-4 py-3.5"
            style={{
              border: "1px solid color-mix(in srgb, var(--color-blue-100) 28%, transparent)",
              background: "color-mix(in srgb, var(--bg-inverse) 72%, black)",
            }}
          >
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ink-inverse-muted">
              {board.originLabel}
            </p>
            <p className="mt-2 font-heading text-[1.35rem] font-bold leading-none tracking-[-0.03em] text-ink-inverse">
              {board.originTitle}
            </p>
          </div>

          <div className="relative mx-auto flex h-8 w-px items-start justify-center" aria-hidden>
            <span
              className="absolute inset-y-0 w-px"
              style={{ background: "color-mix(in srgb, var(--color-blue-100) 55%, transparent)" }}
            />
            <span
              className="relative z-10 mt-[11px] size-2 rounded-full"
              style={{ background: "var(--color-blue-100)" }}
            />
          </div>

          <div
            className="rounded-lg px-4 py-5"
            style={{
              border: "1px solid color-mix(in srgb, var(--color-blue-100) 42%, transparent)",
              background: "color-mix(in srgb, var(--bg-inverse) 58%, var(--color-blue-550))",
            }}
          >
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ink-inverse-muted">
              {board.hubLabel}
            </p>
            <p className="mt-3 font-heading text-[2.35rem] font-bold leading-none tracking-[-0.04em] text-ink-inverse md:text-[2.6rem]">
              {board.hubTitle}
            </p>
            <p className="mt-4 flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ink-inverse-muted">
              <span
                className="size-1.5 rounded-full"
                style={{ background: "var(--color-blue-100)" }}
              />
              {board.hubCaption}
            </p>
          </div>
        </div>

        <div className="hidden items-center md:flex" aria-hidden>
          <span
            className="h-px w-8 lg:w-12"
            style={{ background: "color-mix(in srgb, var(--color-blue-100) 55%, transparent)" }}
          />
          <span
            className="size-2 shrink-0 rounded-full"
            style={{ background: "var(--color-blue-100)" }}
          />
          <span
            className="mx-1.5 size-4 shrink-0 rounded-full"
            style={{
              background: "color-mix(in srgb, var(--color-blue-100) 82%, white)",
              boxShadow: "0 0 0 6px color-mix(in srgb, var(--color-blue-100) 18%, transparent)",
            }}
          />
        </div>

        <div>
          <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ink-inverse-muted">
            {board.destinationLabel}
          </p>
          <ul className="grid grid-cols-2 gap-2.5">
            {chainInfra.map((item) => (
              <li
                key={item.name}
                className="rounded-lg px-3.5 py-3"
                style={{
                  border: "1px solid color-mix(in srgb, var(--color-blue-100) 22%, transparent)",
                  background: "color-mix(in srgb, var(--bg-inverse) 78%, black)",
                }}
              >
                <span className="flex items-start gap-2">
                  <span
                    className="mt-1.5 size-1.5 shrink-0 rounded-full"
                    style={{ background: "color-mix(in srgb, var(--color-blue-100) 70%, white)" }}
                  />
                  <span>
                    <p className="font-heading text-[13px] font-bold uppercase leading-none tracking-[-0.02em] text-ink-inverse">
                      {item.name}
                    </p>
                    <p className="mt-1.5 font-mono text-[9px] font-bold uppercase leading-4 tracking-[0.12em] text-ink-inverse-muted">
                      {item.role}
                    </p>
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}
