"use client";

import { useId, useState } from "react";
import { home } from "@/content/home";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export function WhyShowcase() {
  const tabs = home.whyTabs;
  const [active, setActive] = useState(0);
  const tab = tabs[active];
  const baseId = useId();
  const titleLabel = tabs.map((item) => item.label.replace(/\.$/, "")).join(". ") + ".";

  function onTabKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    const next = event.key === "ArrowDown" ? (active + 1) % tabs.length : (active - 1 + tabs.length) % tabs.length;
    setActive(next);
    document.getElementById(`${baseId}-tab-${next}`)?.focus();
  }

  return (
    <section className="bg-inverse py-12 md:py-20" aria-labelledby="why-heading">
      <Container>
        <div className="rounded-[1.75rem] bg-page px-6 py-10 md:px-10 md:py-12 lg:px-14 lg:py-14">
          <div className="grid items-start gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.12fr)] md:gap-12 lg:gap-16">
              <div>
                <h2 id="why-heading" className="sr-only">
                  {titleLabel}
                </h2>
                <div
                  role="tablist"
                  aria-label="Authorised, regulated, auditable"
                  onKeyDown={onTabKeyDown}
                  className="flex flex-col font-heading text-[clamp(2.35rem,4.6vw,4rem)] font-bold leading-[1.08] tracking-[-0.03em]"
                >
                  {tabs.map((item, index) => {
                    const selected = index === active;
                    return (
                      <button
                        key={item.label}
                        type="button"
                        role="tab"
                        id={`${baseId}-tab-${index}`}
                        aria-selected={selected}
                        aria-controls={`${baseId}-panel`}
                        tabIndex={selected ? 0 : -1}
                        onClick={() => setActive(index)}
                        className={cn(
                          "block w-fit whitespace-nowrap border-b-[3px] pb-0.5 text-left transition-colors duration-200",
                          selected
                            ? "border-ink text-ink"
                            : "border-transparent text-[color-mix(in_srgb,var(--color-blue-100)_55%,var(--text-primary))] hover:text-ink/60",
                        )}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </div>

                <div
                  role="tabpanel"
                  id={`${baseId}-panel`}
                  aria-labelledby={`${baseId}-tab-${active}`}
                >
                  <div className="mt-7 border-t border-line pt-6">
                    <p className="font-mono text-[12px] font-bold uppercase tracking-[0.16em] text-ink-muted">
                      {tab.eyebrow}
                    </p>
                    <p className="mt-3 max-w-[38ch] text-[1.0625rem] font-normal leading-[1.6] text-ink">
                      {tab.body}
                    </p>
                    <div className="mt-8">
                      <Button
                        href={tab.href}
                        showArrow={false}
                        className="min-h-0 px-8 py-4 text-[15px] font-bold leading-6 tracking-normal"
                      >
                        {tab.cta}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <ul className="flex flex-col gap-3" aria-live="polite">
                {tab.items.map((item) => (
                  <li key={item.name}>
                    <article className="flex items-start justify-between gap-5 rounded-[1.25rem] border border-line px-5 py-4">
                      <div className="min-w-0">
                        <h3 className="text-[16px] font-semibold leading-snug tracking-[-0.015em] text-ink">
                          {item.name}
                        </h3>
                        <p className="mt-1 text-[14px] font-normal leading-6 text-ink-secondary">
                          {item.detail}
                        </p>
                      </div>
                      <p className="shrink-0 pt-1 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-ink-muted">
                        {item.tag}
                      </p>
                    </article>
                  </li>
                ))}
                <li>
                  <article
                    className="rounded-[1.25rem] px-5 py-4"
                    style={{ background: "var(--color-blue-50)" }}
                  >
                    <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-ink-muted">
                      {tab.note.label}
                    </p>
                    <p className="mt-1.5 text-[14px] font-normal leading-6 text-ink">
                      {tab.note.body}
                    </p>
                  </article>
                </li>
              </ul>
            </div>
          </div>
      </Container>
    </section>
  );
}
