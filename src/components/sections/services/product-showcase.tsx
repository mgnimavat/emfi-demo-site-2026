"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { ChartNoAxesCombined, FileText, Layers3 } from "lucide-react";
import { services } from "@/content/services-new";
import { ProductAnimation } from "./product-animation";
import { BrandSign } from "@/components/brand/logo";

const icons = [FileText, ChartNoAxesCombined, Layers3];

export function ProductShowcase() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const items = services.evidence.items;

  function onTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % items.length;
    else if (event.key === "ArrowLeft") next = (index + items.length - 1) % items.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = items.length - 1;
    else return;
    event.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  }

  return (
    <>
      <div role="tablist" aria-label="EMFI product views" className="flex items-stretch gap-2 rounded-lg border border-line bg-subtle p-2 sm:grid sm:grid-cols-3 sm:gap-3">
        {items.map((item, i) => {
          const Icon = icons[i];
          return (
            <button
              key={item.id}
              ref={(element) => { tabs.current[i] = element; }}
              type="button"
              id={`product-tab-${item.id}`}
              role="tab"
              aria-label={item.title}
              aria-selected={active === i}
              aria-controls={`product-panel-${item.id}`}
              tabIndex={active === i ? 0 : -1}
              onClick={() => setActive(i)}
              onKeyDown={(event) => onTabKeyDown(event, i)}
              className={`flex min-h-14 min-w-0 items-center justify-center gap-2 rounded-md border px-2 py-3 text-left transition-[background-color,color,border-color,box-shadow] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-focus sm:min-h-20 sm:w-auto sm:gap-4 sm:px-5 sm:py-4 ${active === i ? "flex-1 border-brand bg-brand text-ink-inverse shadow-sm" : "w-11 shrink-0 border-transparent text-ink-secondary hover:border-line-strong hover:bg-page"}`}
            >
              <Icon size={23} strokeWidth={1.5} className="size-5 shrink-0 sm:size-6" aria-hidden />
              <span className={`min-w-0 text-sm font-semibold leading-5 sm:flex-1 sm:text-base sm:leading-6 lg:text-lg ${active === i ? "block" : "hidden sm:block"}`}>{item.title}</span>
              <span aria-hidden className={`hidden font-mono text-xs sm:block ${active === i ? "text-ink-inverse-muted" : "text-ink-muted"}`}>0{i + 1}</span>
            </button>
          );
        })}
      </div>

      {items.map((item, i) => (
        <div
          key={item.id}
          id={`product-panel-${item.id}`}
          role="tabpanel"
          aria-labelledby={`product-tab-${item.id}`}
          tabIndex={0}
          hidden={active !== i}
          className="mt-6 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-focus"
        >
          <figure className="relative isolate grid overflow-hidden rounded-xl border border-line bg-page lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
            <BrandSign className="pointer-events-none absolute bottom-3 right-3 -z-10 size-64 text-[var(--color-blue-200)] opacity-10 sm:bottom-4 sm:right-4 sm:size-80" />
            <div
              className="relative isolate flex items-center justify-center overflow-hidden border-b border-line p-4 sm:min-h-[540px] sm:p-8 lg:border-b-0 lg:border-r lg:p-9"
              style={{ background: "radial-gradient(ellipse at 15% 15%, var(--bg-page), transparent 65%), linear-gradient(135deg, var(--bg-soft), var(--color-blue-50))" }}
            >
              {active === i ? <ProductAnimation view={item.id} /> : null}
            </div>
            <figcaption className="flex flex-col justify-center p-6 sm:p-10 lg:p-12">
              <p className="flex items-center gap-3 font-mono text-xs uppercase leading-6 tracking-[0.08em] text-ink-secondary">
                <span>0{i + 1}</span><span className="h-px w-7 bg-line-strong" aria-hidden />{item.layer}
              </p>
              <h3 className="mt-5 text-3xl font-semibold leading-tight tracking-[-0.035em] text-ink sm:text-4xl">{item.title}</h3>
              <p className="mt-5 text-lg leading-8 text-ink-secondary">{item.body}</p>

            </figcaption>
          </figure>
        </div>
      ))}


    </>
  );
}
