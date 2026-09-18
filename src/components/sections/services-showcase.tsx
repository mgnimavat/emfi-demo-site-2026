"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { home } from "@/content/home";
import { Eyebrow } from "@/components/ui/eyebrow";
import { cn } from "@/lib/cn";

function serviceInitials(title: string) {
  return title
    .split(/[\s&/]+/)
    .filter((part) => part.length > 1)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function serviceLens(title: string) {
  return (title.split(/[\s&/]+/).find((part) => part.length > 2) ?? title).toUpperCase();
}

export function ServicesShowcase() {
  const items = home.services;
  const [index, setIndex] = useState<number>(items.length);
  const [animate, setAnimate] = useState(true);
  const titleLines = home.servicesTitle.split("\n").filter(Boolean);
  const titleLabel = home.servicesTitle.replace(/\n/g, " ");
  const track = [...items, ...items, ...items];

  function go(step: number) {
    setAnimate(true);
    setIndex((current) => current + step);
  }

  function handleTransitionEnd(event: React.TransitionEvent<HTMLUListElement>) {
    if (event.target !== event.currentTarget || event.propertyName !== "transform") return;
    if (index >= items.length * 2) {
      setAnimate(false);
      setIndex(items.length);
    } else if (index < items.length) {
      setAnimate(false);
      setIndex(index + items.length);
    }
  }

  useEffect(() => {
    if (animate) return;
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setAnimate(true));
    });
    return () => cancelAnimationFrame(id);
  }, [animate]);

  return (
    <section
      className="scroll-mt-[6.5rem] overflow-hidden bg-page py-16 md:py-24"
      aria-labelledby="services-heading"
    >
      <div className="flex flex-col gap-10 md:flex-row md:items-start md:gap-14 lg:gap-20">
        <div className="w-full shrink-0 px-6 md:w-[min(48%,32rem)] md:pl-[max(2.5rem,calc((100vw-1440px)/2+2.5rem))] md:pr-0">
          <Eyebrow className="mb-5 text-[11px] tracking-[0.22em]">{home.servicesEyebrow}</Eyebrow>
          <h2
            id="services-heading"
            aria-label={titleLabel}
            className="font-heading text-[clamp(2.35rem,4.6vw,4rem)] font-bold leading-[0.98] tracking-[-0.03em] text-ink"
          >
            {titleLines.map((line) => (
              <span key={line} className="block whitespace-nowrap">
                {line}
              </span>
            ))}
          </h2>
          <div className="mt-8 flex items-center gap-3">
            <button
              type="button"
              onClick={() => go(-1)}
              className="flex h-12 w-12 items-center justify-center rounded-full text-ink transition-colors hover:bg-[var(--color-blue-50)]"
              style={{ background: "var(--color-blue-100)" }}
              aria-label="Previous service"
            >
              <ArrowLeft size={18} strokeWidth={2.2} />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-inverse text-ink-inverse transition-colors hover:bg-brand"
              aria-label="Next service"
            >
              <ArrowRight size={18} strokeWidth={2.2} />
            </button>
          </div>
        </div>

        <div
          className="min-w-0 flex-1 [--card-gap:1rem] [--card-w:min(19rem,calc(100%-3.75rem))] md:[--card-w:calc((100%-2*var(--card-gap))/2.5)]"
        >
          <div className="overflow-hidden">
            <ul
              className={cn(
                "flex gap-[var(--card-gap)] motion-reduce:transition-none",
                animate && "transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
              )}
              style={{
                transform: `translateX(calc(-${index} * (var(--card-w) + var(--card-gap))))`,
              }}
              onTransitionEnd={handleTransitionEnd}
            >
              {track.map(([title, body, href], i) => {
                const inverse = (i % items.length) % 2 === 1;
                const visible = i >= index && i < index + 3;
                return (
                  <li
                    key={`${title}-${i}`}
                    className="w-[var(--card-w)] shrink-0"
                    aria-hidden={!visible}
                  >
                    <article
                      className={cn(
                        "flex h-[23.5rem] flex-col rounded-[1.75rem] p-7 md:h-[25rem] md:p-8",
                        inverse ? "bg-inverse text-ink-inverse" : "text-ink",
                      )}
                      style={
                        inverse
                          ? undefined
                          : { background: "var(--color-blue-100)" }
                      }
                    >
                      <span
                        className={cn(
                          "flex size-14 shrink-0 self-start items-center justify-center rounded-full font-heading text-[17px] font-bold tracking-[-0.04em]",
                          inverse
                            ? "bg-[color-mix(in_srgb,var(--bg-inverse)_62%,black)] text-ink-inverse"
                            : "bg-page text-ink",
                        )}
                      >
                        {serviceInitials(title)}
                      </span>
                      <p
                        className={cn(
                          "mt-8 font-mono text-[10px] font-bold uppercase tracking-[0.2em]",
                          inverse ? "text-ink-inverse-muted" : "text-ink-muted",
                        )}
                      >
                        {serviceLens(title)}
                      </p>
                      <p
                        className={cn(
                          "mt-3 flex-1 text-[1.05rem] font-medium leading-7 tracking-[-0.02em]",
                          inverse ? "text-ink-inverse" : "text-ink",
                        )}
                      >
                        {body}
                      </p>
                      <Link
                        href={href}
                        tabIndex={visible ? undefined : -1}
                        className={cn(
                          "mt-6 inline-flex w-fit max-w-full truncate rounded-full px-4 py-2.5 text-[12px] font-semibold tracking-[-0.01em]",
                          inverse
                            ? "bg-[var(--color-blue-100)] text-ink hover:bg-page"
                            : "bg-inverse text-ink-inverse hover:bg-brand",
                        )}
                      >
                        {title}
                      </Link>
                    </article>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
