"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { home1 as home } from "@/content/home-1";

export function InfrastructureRotator() {
  const reduced = useReducedMotion();
  const rails = home.chainInfra;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduced || rails.length < 2) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % rails.length),
      2400,
    );
    return () => window.clearInterval(id);
  }, [rails.length, reduced]);

  const active = rails[index] ?? rails[0];

  return (
    <div className="mx-auto grid max-w-xl gap-3">
      {home.chainNodes.map((node) => (
        <div key={node.label}>
          <article className="rounded-lg border border-line bg-page px-6 py-5 text-center">
            <p className="font-mono text-[11px] font-bold tracking-[0.16em] text-ink-muted">
              {node.sub}
            </p>
            <h3 className="mt-1 text-2xl font-extrabold tracking-[-0.03em] text-ink">
              {node.label}
            </h3>
          </article>
          <div className="flex justify-center py-2 text-brand" aria-hidden>
            <ArrowDown size={18} />
          </div>
        </div>
      ))}
      <article className="rounded-lg border-2 border-brand bg-inverse px-6 py-6 text-center text-ink-inverse">
        <p className="font-mono text-[11px] font-bold tracking-[0.16em] text-ink-inverse-muted">
          {active.role}
        </p>
        <h3
          className="mt-1 text-3xl font-extrabold tracking-[-0.03em]"
          aria-live="polite"
        >
          {active.name}
        </h3>
        <div className="mt-5 flex justify-center gap-2">
          {rails.map((rail, i) => (
            <span
              key={rail.name}
              className={`h-1.5 w-1.5 rounded-full ${
                i === index ? "bg-brand" : "bg-ink-inverse/30"
              }`}
            />
          ))}
        </div>
      </article>
    </div>
  );
}
