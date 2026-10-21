"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { ProductAnimation } from "@/components/sections/services/product-animation";
import styles from "./research-to-trade.module.css";

// Type the topic, read its report, highlight NVIDIA in the text, then search and buy it in execution.
const durations = [2000, 650, 800, 1000, 1100, 1600, 1600, 400];
const cycleDuration = durations.reduce((sum, duration) => sum + duration, 0);
const keyword = "Artificial Intelligence";
const subscribeToHydration = () => () => {};
const subscribeToVisibility = (callback: () => void) => {
  document.addEventListener("visibilitychange", callback);
  return () => document.removeEventListener("visibilitychange", callback);
};

function journeyFrame(elapsed: number) {
  let time = elapsed % cycleDuration;
  for (let phase = 0; phase < durations.length; phase++) {
    if (time < durations[phase]) return {
      phase,
      query: phase === 0 ? keyword.slice(0, Math.floor(Math.max(0, time - 250) / 65))
        : phase === 7 ? "" : keyword,
    };
    time -= durations[phase];
  }
  return { phase: 0, query: "" };
}

export function ResearchToTrade() {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useInView(ref, { amount: 0.2 });
  const prefersReducedMotion = useReducedMotion();
  const hydrated = useSyncExternalStore(subscribeToHydration, () => true, () => false);
  const documentVisible = useSyncExternalStore(subscribeToVisibility, () => !document.hidden, () => true);
  const reduced = Boolean(hydrated && prefersReducedMotion);
  const [frame, setFrame] = useState({ phase: 0, query: "" });
  const elapsed = useRef(0);
  const phase = reduced ? 6 : frame.phase;
  const query = reduced ? keyword : frame.query;
  const running = visible && documentVisible && !reduced;
  const researchActive = phase <= 3 || phase === 7;
  const executionShown = phase >= 4 && phase <= 6;
  const transition = { duration: reduced ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] as const };

  useEffect(() => {
    if (!running) return;
    let previous = performance.now();
    const timer = window.setInterval(() => {
      const now = performance.now();
      elapsed.current += now - previous;
      previous = now;
      const next = journeyFrame(elapsed.current);
      setFrame((current) => current.phase === next.phase && current.query === next.query ? current : next);
    }, 30);
    return () => window.clearInterval(timer);
  }, [running]);

  return (
    <div ref={ref} aria-label="Research to execution demonstration" className="relative isolate min-w-0">
      <div aria-hidden className="pointer-events-none absolute inset-x-6 bottom-20 top-20 -z-10 rounded-full bg-soft/60 blur-3xl" />
      <div className="relative grid grid-cols-[repeat(20,minmax(0,1fr))] grid-rows-[64px_auto_64px] items-stretch sm:grid-rows-[80px_auto_80px]" data-journey-phase={phase}>
        <motion.div
          data-research-window
          data-centered={researchActive}
          className={`${styles.researchWindow} relative col-span-19 col-start-1 row-span-2 row-start-1 origin-top-left sm:col-span-14 sm:col-start-1`}
          initial={false}
          animate={{ opacity: researchActive ? 1 : 0.55, scale: 1 }}
          transition={transition}
          style={{ zIndex: researchActive ? 10 : 0 }}
          aria-hidden={!researchActive}
          inert={!researchActive}
        >
          <div className={`h-full rounded-lg transition-shadow duration-500 motion-reduce:transition-none ${researchActive ? "ring-1 ring-brand-focus/20 shadow-[var(--elevation-card-hover)]" : ""}`}>
            <ProductAnimation view="research" compact fillHeight paused={!running || !researchActive} researchQuery={query} researchStage={phase === 0 || phase === 7 ? "typing" : phase === 1 ? "loading" : phase >= 3 ? "selected" : "report"} />
          </div>
        </motion.div>
        <motion.div
          data-execution-window
          className="relative z-20 col-span-19 col-start-2 row-span-2 row-start-2 origin-top-right sm:col-span-14 sm:col-start-7"
          initial={false}
          animate={{ opacity: executionShown ? 1 : 0, y: executionShown ? 0 : 24, scale: executionShown ? 1 : 0.98 }}
          transition={transition}
          style={{ visibility: phase >= 4 ? "visible" : "hidden" }}
          aria-hidden={!executionShown}
          inert={!executionShown}
        >
          <div className="h-full rounded-lg ring-1 ring-brand-focus/20 shadow-[var(--elevation-card-hover)]">
            <ProductAnimation view="execution" compact fillHeight submissionDuration={1.6} paused={!running || !executionShown} orderStage={phase < 4 ? undefined : phase === 4 ? "searching" : phase === 5 ? "submitting" : "booked"} />
          </div>
        </motion.div>
      </div>
      <p className="sr-only">Demo repeating sequence: search Artificial Intelligence, read an example report on AI demand and GPU sales, highlight the word NVIDIA in the report text, then search NVIDIA in execution and book a simulated buy order.</p>
    </div>
  );
}
