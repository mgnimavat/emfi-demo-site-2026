"use client";

import { useEffect, useRef } from "react";

/** Content is visible without JS; only running animations depend on visibility. */
export function MotionRegion({ children, className, reveal = true }: { children: React.ReactNode; className?: string; reveal?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    let inView = false;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => { element.dataset.motionActive = String(inView && !document.hidden && !reduced.matches); };
    const observer = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; update(); }, { threshold: .01 });
    const revealObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { element.dataset.revealed = "true"; revealObserver.disconnect(); }
    }, { threshold: .14, rootMargin: "0px 0px -6% 0px" });
    if (reveal && !reduced.matches) { element.dataset.revealed = "false"; revealObserver.observe(element); }
    observer.observe(element);
    document.addEventListener("visibilitychange", update);
    reduced.addEventListener("change", update);
    return () => { observer.disconnect(); revealObserver.disconnect(); document.removeEventListener("visibilitychange", update); reduced.removeEventListener("change", update); };
  }, [reveal]);
  return <div ref={ref} className={className} data-motion-region>{children}</div>;
}
