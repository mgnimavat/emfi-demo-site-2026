"use client";

import { createContext, useContext, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import styles from "./sections.module.css";

const Y = "clamp(88px,10vw,144px)";
const X = "clamp(20px,4vw,56px)";
const WhyFrameContext = createContext(0);

export function sectionPad(rail: boolean, horizontal = true) {
  const left = `calc(${X} + 54px)`;
  if (!horizontal) return rail ? `${Y} 0 ${Y} ${left}` : `${Y} 0`;
  return rail ? `${Y} ${X} ${Y} ${left}` : `${Y} ${X}`;
}

export function WhyMarker({ n, active }: { n: number; active: boolean }) {
  return (
    <span className={active ? `${styles.whyMarker} ${styles.whyMarkerActive}` : styles.whyMarker} data-why-marker aria-hidden="true">
      {n}
    </span>
  );
}

export function useWhyActive(step: number) {
  const passed = useContext(WhyFrameContext);
  return step > 0 && passed >= step;
}

export function WhyFlow({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const elbowRef = useRef<HTMLSpanElement>(null);
  const elbowFillRef = useRef<HTMLSpanElement>(null);
  const pulseRef = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(0);

  useLayoutEffect(() => {
    const flow = ref.current;
    const rail = railRef.current;
    const fill = fillRef.current;
    const elbow = elbowRef.current;
    const elbowFill = elbowFillRef.current;
    const pulse = pulseRef.current;
    if (!flow || !rail || !fill || !elbow || !elbowFill || !pulse) return;
    let raf = 0;

    const measure = () => {
      raf = 0;
      const origin = flow.querySelector<HTMLElement>("[data-why-origin]");
      const marks = [...flow.querySelectorAll<HTMLElement>("[data-why-marker]")];
      if (!origin || marks.length < 2) return;
      const flowRect = flow.getBoundingClientRect();
      const originRect = origin.getBoundingClientRect();
      const originY = originRect.top + originRect.height / 2;
      const points = marks.map((mark) => {
        const rect = mark.getBoundingClientRect();
        return { x: rect.left + rect.width / 2 - flowRect.left, y: rect.top + rect.height / 2 - flowRect.top, viewY: rect.top + rect.height / 2 };
      });
      const first = points[0];
      const last = points[points.length - 1];
      const top = originY - flowRect.top;
      const height = Math.max(0, last.y - top);
      const elbowWidth = Math.max(0, originRect.left - flowRect.left - first.x - 22);
      const span = Math.max(1, last.viewY - originY);
      const midpoint = window.innerHeight * 0.52;
      const progress = Math.max(0, Math.min(1, (midpoint - originY) / span));
      const traveled = progress * (elbowWidth + height);
      const onElbow = elbowWidth > 0 && traveled < elbowWidth;
      const down = onElbow ? 0 : Math.max(0, traveled - elbowWidth);
      const passed = flowRect.bottom <= 0 ? points.length : points.filter((point) => down + 7 >= point.y - top - 15).length;

      rail.style.left = `${first.x}px`;
      rail.style.top = `${top}px`;
      rail.style.height = `${height}px`;
      rail.style.opacity = "1";
      rail.style.setProperty("--rail-span", `${height}px`);
      elbow.style.width = `${elbowWidth}px`;
      elbowFill.style.left = "1px";
      elbowFill.style.width = `${elbowWidth}px`;
      elbowFill.style.backgroundSize = `${Math.max(elbowWidth, 1)}px 100%`;
      if (onElbow) {
        fill.style.height = "0%";
        elbowFill.style.clipPath = `inset(0 0 0 ${elbowWidth - traveled}px)`;
        pulse.style.left = `${1 + elbowWidth - traveled}px`;
        pulse.style.top = "0px";
      } else {
        const vertical = height ? Math.min(1, down / height) : 0;
        fill.style.height = `${vertical * 100}%`;
        elbowFill.style.clipPath = "none";
        pulse.style.left = "50%";
        pulse.style.top = `${vertical * 100}%`;
      }
      setActive((current) => (current === passed ? current : passed));
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };

    measure();
    const observer = new ResizeObserver(schedule);
    observer.observe(flow);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return (
    <div ref={ref} className={styles.whyFlow}>
      <div ref={railRef} className={styles.whyRail} aria-hidden="true">
        <span className={styles.whyRailTrack} />
        <span ref={fillRef} className={styles.whyRailFill} />
        <span ref={elbowRef} className={styles.whyRailElbow} />
        <span ref={elbowFillRef} className={styles.whyRailElbowFill} />
        <span ref={pulseRef} className={styles.whyRailPulse} />
      </div>
      <WhyFrameContext.Provider value={active}>{children}</WhyFrameContext.Provider>
    </div>
  );
}
