"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Award, CircleCheck, ClipboardCheck, Scale } from "lucide-react";
import { home2 as home } from "@/content/home-2";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/eyebrow";
import { cn } from "@/lib/cn";

const panelIcons = [Award, Scale, ClipboardCheck] as const;
const RING_FILL_MS = 5000;

export function WhyShowcase() {
  const tabs = home.whyTabs;
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const PanelIcon = panelIcons[active] ?? Award;
  const baseId = useId();
  const ringGradId = `trust-ring-${baseId.replace(/:/g, "")}`;
  const sectionRef = useRef<HTMLElement>(null);
  const cycleRef = useRef(0);
  const reducedMotion = useReducedMotion();

  function selectTab(index: number) {
    cycleRef.current += 1;
    setActive(index);
  }

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.35 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reducedMotion || !inView) return;
    const cycle = cycleRef.current;
    const timer = window.setTimeout(() => {
      if (cycleRef.current !== cycle) return;
      setActive((index) => (index + 1) % tabs.length);
    }, RING_FILL_MS);
    return () => window.clearTimeout(timer);
  }, [active, inView, reducedMotion, tabs.length]);

  function onTabKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const next = event.key === "ArrowRight" ? (active + 1) % tabs.length : (active - 1 + tabs.length) % tabs.length;
    selectTab(next);
    document.getElementById(`${baseId}-tab-${next}`)?.focus();
  }

  return (
    <section ref={sectionRef} className="bg-page py-16 md:py-24" aria-labelledby="why-heading">
      <Container>
        <Eyebrow className="mb-5 text-[11px] tracking-[0.22em]">{home.trustEyebrow}</Eyebrow>
        <h2
          id="why-heading"
          className="max-w-4xl font-heading text-[clamp(2rem,4.2vw,3.5rem)] font-bold leading-[1.08] tracking-[-0.03em] text-ink"
        >
          {home.trustTitle}
        </h2>

        <div
          role="tablist"
          aria-label="Authorised, regulated, auditable"
          onKeyDown={onTabKeyDown}
          className="mt-8 inline-flex max-w-full flex-wrap rounded-full bg-subtle p-1"
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
                aria-controls={`${baseId}-panel-${index}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => selectTab(index)}
                className={cn(
                  "rounded-full px-5 py-2.5 text-[14px] font-bold tracking-[-0.01em] transition-colors duration-200 md:px-7 md:py-3 md:text-[15px]",
                  selected
                    ? "bg-inverse text-ink-inverse"
                    : "text-ink hover:text-ink/70",
                )}
              >
                {item.label.replace(/\.$/, "")}
              </button>
            );
          })}
        </div>

        <div className="mt-6 overflow-hidden rounded-[1.75rem] bg-subtle md:mt-8">
          <div className="grid items-stretch lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
            <div className="flex min-h-[22rem] items-center justify-center overflow-hidden bg-inverse md:min-h-[26rem]">
              <div
                className="emfi-trust-graphic relative flex h-60 w-60 items-center justify-center md:h-72 md:w-72"
                aria-hidden
              >
                <span
                  className="emfi-trust-graphic-glow absolute inset-0 rounded-full"
                  style={{ background: "color-mix(in srgb, var(--color-blue-100) 100%, transparent)" }}
                />
                <svg
                  key={active}
                  viewBox="0 0 100 100"
                  className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
                >
                  <defs>
                    <linearGradient id={ringGradId} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="var(--flow-from)" />
                      <stop offset="48%" stopColor="var(--flow-mid)" />
                      <stop offset="100%" stopColor="var(--flow-to)" />
                    </linearGradient>
                  </defs>
                  <circle cx="50" cy="50" r="47" className="emfi-trust-ring" />
                  <circle
                    cx="50"
                    cy="50"
                    r="47"
                    pathLength="1"
                    stroke={`url(#${ringGradId})`}
                    className={cn("emfi-trust-ring-energy", inView && !reducedMotion && "is-running")}
                  />
                </svg>
                <PanelIcon
                  size={112}
                  strokeWidth={1.1}
                  className="relative h-28 w-28 text-ink-inverse-muted md:h-32 md:w-32"
                />
              </div>
            </div>

            <div className="grid">
              {tabs.map((item, index) => {
                const selected = index === active;
                return (
                  <div
                    key={item.label}
                    role="tabpanel"
                    id={`${baseId}-panel-${index}`}
                    aria-labelledby={`${baseId}-tab-${index}`}
                    aria-hidden={!selected}
                    inert={!selected}
                    className={cn(
                      "col-start-1 row-start-1 flex flex-col justify-center px-7 py-10 md:px-10 lg:px-12 lg:py-14",
                      selected ? "visible" : "invisible",
                    )}
                  >
                    <h3 className="font-heading text-[clamp(1.6rem,2.8vw,2.25rem)] font-bold leading-[1.15] tracking-[-0.025em] text-ink">
                      {item.eyebrow}
                    </h3>
                    <p className="mt-4 max-w-[42ch] text-[1.0625rem] font-normal leading-[1.6] text-ink-secondary">
                      {item.body}
                    </p>
                    <ul className="mt-6 flex flex-col gap-3">
                      {item.items.map((entry) => (
                        <li key={entry.name} className="flex items-start gap-3">
                          <CircleCheck
                            size={20}
                            aria-hidden
                            className="mt-0.5 shrink-0"
                            style={{ color: "var(--color-blue-400)" }}
                          />
                          <span className="text-[15px] font-medium leading-6 text-ink">
                            {entry.name}
                            <span className="text-ink-muted"> · {entry.tag}</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-8">
                      <Button
                        href={item.href}
                        className="min-h-0 px-8 py-4 text-[15px] font-bold leading-6 tracking-normal"
                      >
                        {item.cta}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
