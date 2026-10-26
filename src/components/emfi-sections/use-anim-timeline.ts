"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const DUR = { tD: 13000, tR: 13000, tA: 12000 } as const;
type TimelineKey = keyof typeof DUR;

function headerHeight() {
  const header = document.querySelector("header");
  if (!header) return 0;
  const position = getComputedStyle(header).position;
  if (position !== "sticky" && position !== "fixed") return 0;
  return header.offsetHeight;
}

export function useAnimTimeline({ loopDirect = false }: { loopDirect?: boolean } = {}) {
  const chapRef = useRef<HTMLDivElement>(null);
  const dRef = useRef<HTMLDivElement>(null);
  const rRef = useRef<HTMLDivElement>(null);
  const aRef = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(1280);
  const [hdr, setHdr] = useState(73);
  const [chapP, setChapP] = useState(0);
  const [tl, setTl] = useState({ tD: 0, tR: 0, tA: 0 });
  const [canReplay, setCanReplay] = useState(true);
  const reducedRef = useRef(false);
  const loopDirectRef = useRef(loopDirect);
  loopDirectRef.current = loopDirect;
  const startRef = useRef<Partial<Record<TimelineKey, number>>>({});
  const elapsedRef = useRef<Partial<Record<TimelineKey, number>>>({});
  const visibleRef = useRef<Partial<Record<TimelineKey, boolean>>>({});
  const valuesRef = useRef({ tD: 0, tR: 0, tA: 0 });
  const rafRef = useRef(0);
  const srafRef = useRef(0);
  const tickRef = useRef<() => void>(() => {});

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let animOn = !media.matches;

    const onResize = () => {
      const width = window.innerWidth;
      const height = headerHeight();
      setW((prev) => (prev === width ? prev : width));
      setHdr((prev) => (prev === height ? prev : height));
    };

    const onScroll = () => {
      if (srafRef.current) return;
      srafRef.current = requestAnimationFrame(() => {
        srafRef.current = 0;
        const chapter = chapRef.current;
        if (!chapter) return;
        const rect = chapter.getBoundingClientRect();
        const vh = window.innerHeight;
        const cp = animOn
          ? Math.round(Math.max(0, Math.min(1, (vh * 0.3 - rect.top) / Math.max(1, rect.height - vh * 0.7))) * 1000) / 1000
          : 1;
        setChapP((prev) => (prev === cp ? prev : cp));
      });
    };

    const tick = () => {
      rafRef.current = 0;
      const now = performance.now();
      const next = { ...valuesRef.current };
      let changed = false;
      let run = false;
      (Object.keys(DUR) as TimelineKey[]).forEach((key) => {
        const start = startRef.current[key];
        if (start == null) return;
        const duration = DUR[key];
        const looping = loopDirectRef.current && key === "tD" && visibleRef.current[key] !== false;
        const elapsed = now - start;
        const value = looping ? (elapsed % duration) / duration : Math.min(1, elapsed / duration);
        if (value !== valuesRef.current[key]) {
          next[key] = value;
          changed = true;
        }
        if (looping || value < 1) run = true;
      });
      if (changed) {
        valuesRef.current = next;
        setTl(next);
      }
      if (run) rafRef.current = requestAnimationFrame(tick);
    };
    tickRef.current = tick;

    let observer: IntersectionObserver | undefined;
    const map: [typeof dRef, TimelineKey][] = [[dRef, "tD"], [rRef, "tR"], [aRef, "tA"]];

    const watchCards = () => {
      if (observer || !animOn || !("IntersectionObserver" in window)) return;
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const match = map.find((item) => item[0].current === entry.target);
          if (!match) return;
          const key = match[1];
          const loops = loopDirectRef.current && key === "tD";
          visibleRef.current[key] = entry.isIntersecting;
          if (!entry.isIntersecting) {
            if (loops && startRef.current[key] != null) {
              elapsedRef.current[key] = performance.now() - startRef.current[key];
              delete startRef.current[key];
            }
            return;
          }
          if (startRef.current[key] == null) {
            const carried = loops ? elapsedRef.current[key] ?? 0 : 0;
            startRef.current[key] = performance.now() - carried;
          }
          if (!loops) observer?.unobserve(entry.target);
          if (!rafRef.current) rafRef.current = requestAnimationFrame(() => tickRef.current());
        });
      }, { threshold: 0.25 });
      map.forEach(([ref]) => {
        if (ref.current) observer?.observe(ref.current);
      });
    };

    const applyMotion = () => {
      animOn = !media.matches;
      reducedRef.current = media.matches;
      setCanReplay(animOn);
      if (!animOn || !("IntersectionObserver" in window)) {
        observer?.disconnect();
        observer = undefined;
        cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
        startRef.current = {};
        valuesRef.current = { tD: 1, tR: 1, tA: 1 };
        setTl({ tD: 1, tR: 1, tA: 1 });
        setChapP(1);
        return;
      }
      watchCards();
    };

    const onMotion = () => applyMotion();
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    media.addEventListener("change", onMotion);
    const boot = requestAnimationFrame(() => {
      applyMotion();
      onResize();
      onScroll();
    });

    return () => {
      cancelAnimationFrame(boot);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      media.removeEventListener("change", onMotion);
      cancelAnimationFrame(rafRef.current);
      cancelAnimationFrame(srafRef.current);
      rafRef.current = 0;
      srafRef.current = 0;
      startRef.current = {};
      observer?.disconnect();
    };
  }, []);

  const replay = useCallback((key: TimelineKey) => {
    if (reducedRef.current) return;
    startRef.current[key] = performance.now();
    valuesRef.current = { ...valuesRef.current, [key]: 0 };
    setTl((prev) => ({ ...prev, [key]: 0 }));
    if (!rafRef.current) rafRef.current = requestAnimationFrame(() => tickRef.current());
  }, []);

  return {
    chapRef,
    dRef,
    rRef,
    aRef,
    w,
    hdr,
    chapP,
    tD: tl.tD,
    tR: tl.tR,
    tA: tl.tA,
    canReplay,
    replayD: () => replay("tD"),
    replayR: () => replay("tR"),
    replayA: () => replay("tA"),
  };
}
