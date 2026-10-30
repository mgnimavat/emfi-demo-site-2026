"use client";

import { Children, createContext, useContext, useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { ArrowDown } from "lucide-react";
import styles from "./sections.module.css";

const Y = "clamp(88px,10vw,144px)";
const X = "clamp(20px,4vw,56px)";
const WhyFrameContext = createContext(0);
const WhyPinContext = createContext(false);

export function useWhyPinned() {
  return useContext(WhyPinContext);
}

export function sectionPad(rail: boolean, horizontal = true, pinned = false) {
  const left = `calc(${X} + 54px)`;
  if (pinned) {
    const top = "clamp(112px, 14vh, 148px)";
    const bottom = "clamp(100px, 13vh, 132px)";
    const right = "clamp(52px, 4vw, 56px)";
    const pinLeft = `calc(${X} + 54px + clamp(28px, 7vw, 100px))`;
    return `${top} ${right} ${bottom} ${pinLeft}`;
  }
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

function Rail({
  railRef,
  fillRef,
  elbowRef,
  elbowFillRef,
  pulseRef,
}: {
  railRef: RefObject<HTMLDivElement | null>;
  fillRef: RefObject<HTMLSpanElement | null>;
  elbowRef: RefObject<HTMLSpanElement | null>;
  elbowFillRef: RefObject<HTMLSpanElement | null>;
  pulseRef: RefObject<HTMLSpanElement | null>;
}) {
  return (
    <div ref={railRef} className={styles.whyRail} aria-hidden="true">
      <span className={styles.whyRailTrack} />
      <span ref={fillRef} className={styles.whyRailFill} />
      <span ref={elbowRef} className={styles.whyRailElbow} />
      <span ref={elbowFillRef} className={styles.whyRailElbowFill} />
      <span ref={pulseRef} className={styles.whyRailPulse} />
    </div>
  );
}

export function WhyFlow({ children, stickyLabel = false, formProgress = false }: { children: ReactNode; stickyLabel?: boolean; formProgress?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const elbowRef = useRef<HTMLSpanElement>(null);
  const elbowFillRef = useRef<HTMLSpanElement>(null);
  const pulseRef = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(stickyLabel ? 1 : 0);

  useLayoutEffect(() => {
    const flow = ref.current;
    const rail = railRef.current;
    const fill = fillRef.current;
    const elbow = elbowRef.current;
    const elbowFill = elbowFillRef.current;
    const pulse = pulseRef.current;
    const slot = slotRef.current;
    if (!flow || !rail || !fill || !elbow || !elbowFill || !pulse) return;
    let raf = 0;

    const measurePin = () => {
      const stage = stageRef.current;
      if (!stage) return false;
      const marks = [...stage.querySelectorAll<HTMLElement>("[data-why-pin-marker]")];
      const slides = [...stage.querySelectorAll<HTMLElement>("[data-why-slide]")];
      const markerBox = stage.querySelector<HTMLElement>("[data-why-pin-markers]");
      const formBar = markerBox?.hasAttribute("data-why-form-progress") ?? false;
      if (!markerBox || slides.length < 2 || (!formBar && marks.length < 2)) return false;
      const flowRect = flow.getBoundingClientRect();
      const distance = Math.max(1, flow.offsetHeight - window.innerHeight);
      const progress = Math.max(0, Math.min(1, -flowRect.top / distance));
      const steps = slides.length;
      const step = progress >= 1 ? steps : Math.min(steps, Math.floor(progress * steps + 1e-6) + 1);

      rail.style.left = "";
      rail.style.top = "";
      rail.style.height = "";
      rail.style.opacity = "1";
      rail.style.setProperty("--rail-span", "100%");
      elbow.style.display = "none";
      elbowFill.style.display = "none";
      pulse.style.display = "none";
      fill.style.height = "100%";
      if (formBar) {
        fill.style.width = `${(step / steps) * 100}%`;
        fill.style.backgroundSize = "100% 100%";
      } else {
        const railRect = rail.getBoundingClientRect();
        const activeRect = marks[step - 1].getBoundingClientRect();
        const end = activeRect.top + activeRect.height / 2;
        const fillPx = Math.max(0, Math.min(railRect.height, end - railRect.top));
        fill.style.width = "100%";
        fill.style.height = `${fillPx}px`;
        fill.style.backgroundSize = `100% ${Math.max(railRect.height, 1)}px`;
        marks.forEach((mark, index) => {
          const on = index === step - 1;
          const done = index < step - 1;
          mark.className = on
            ? `${styles.whyPinStep} ${styles.whyPinStepActive}`
            : done
              ? `${styles.whyPinStep} ${styles.whyPinStepDone}`
              : styles.whyPinStep;
        });
      }
      stage.dataset.whyStep = String(step);
      slides.forEach((slide, index) => {
        const on = index === step - 1;
        slide.style.opacity = on ? "1" : "0";
        slide.style.visibility = on ? "visible" : "hidden";
        slide.style.pointerEvents = on ? "auto" : "none";
        slide.style.transform = "none";
        slide.setAttribute("aria-hidden", on ? "false" : "true");
        if ("inert" in slide) (slide as HTMLElement & { inert: boolean }).inert = !on;
      });
      setActive((current) => (current === step ? current : step));
      return true;
    };

    const measure = () => {
      raf = 0;
      if (stickyLabel && !window.matchMedia("(prefers-reduced-motion: reduce)").matches && measurePin()) return;
      const origin = flow.querySelector<HTMLElement>("[data-why-origin]");
      const marks = [...flow.querySelectorAll<HTMLElement>("[data-why-marker]")].filter((mark) => mark.getClientRects().length > 0);
      if (!origin || marks.length < 2) return;
      const flowRect = flow.getBoundingClientRect();
      const originRect = origin.getBoundingClientRect();
      const originY = originRect.top + originRect.height / 2;
      const nudge = stickyLabel ? 21 : 0;
      const points = marks.map((mark) => {
        const rect = mark.getBoundingClientRect();
        return { x: rect.left + rect.width / 2 - flowRect.left - nudge, y: rect.top + rect.height / 2 - flowRect.top, viewY: rect.top + rect.height / 2 };
      });
      const first = points[0];
      const last = points[points.length - 1];
      const lead = stickyLabel ? 150 : 0;
      const startY = originY - lead;
      const top = startY - flowRect.top;
      const beforeFirst = Math.max(0, first.y - top);
      const tail = stickyLabel ? beforeFirst + 20 : 0;
      const height = Math.max(0, last.y - top + tail);
      const elbowWidth = lead ? 0 : Math.max(0, originRect.left - flowRect.left - first.x - 22);
      const span = Math.max(1, last.viewY - startY + tail);
      const midpoint = window.innerHeight * 0.52;
      const progress = Math.max(0, Math.min(1, (midpoint - startY) / span));
      const traveled = progress * (elbowWidth + height);
      const onElbow = elbowWidth > 0 && traveled < elbowWidth;
      const down = onElbow ? 0 : Math.max(0, traveled - elbowWidth);
      const passed = flowRect.bottom <= 0 ? points.length : points.filter((point) => down + 7 >= point.y - top - 15).length;

      rail.style.left = `${first.x + nudge}px`;
      rail.style.top = `${top}px`;
      rail.style.height = `${height}px`;
      rail.style.opacity = "1";
      rail.style.setProperty("--rail-span", `${height}px`);
      elbow.style.display = lead ? "none" : "";
      elbowFill.style.display = lead ? "none" : "";
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
      if (slot) {
        const label = slot.querySelector("span");
        if (label) {
          const wordBox = label.parentElement?.getBoundingClientRect();
          const textBox = label.getBoundingClientRect();
          const overhang = wordBox ? Math.max(0, wordBox.bottom - textBox.bottom) : 0;
          slot.style.bottom = `${100 - overhang}px`;
        }
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
  }, [active, stickyLabel]);

  const rail = <Rail railRef={railRef} fillRef={fillRef} elbowRef={elbowRef} elbowFillRef={elbowFillRef} pulseRef={pulseRef} />;

  if (stickyLabel) {
    return (
      <WhyPinContext.Provider value={true}>
        <WhyFrameContext.Provider value={active}>
          <div ref={ref} className={styles.whyPin}>
            <div ref={stageRef} className={`${styles.whyPinStage} ${styles.whyFlow} ${styles.whyFlowSticky}`}>
              <div ref={slotRef} className={styles.whyStickySlot} aria-hidden="true">
                <p className={styles.whyStickyWord}><span>Why EMFI</span></p>
              </div>
              <div className={formProgress ? `${styles.whyPinMarkers} ${styles.whyFormProgress}` : styles.whyPinMarkers} data-why-pin-markers data-why-form-progress={formProgress ? "" : undefined} aria-hidden="true">
                {formProgress ? (
                  <>
                    <span className={styles.whyFormTrack}>{rail}</span>
                    <span className={styles.whyFormCount}>{Math.max(active, 1)} / {Children.count(children)}</span>
                  </>
                ) : (
                  <>
                    {[1, 2, 3].map((n) => (
                      <span key={n} data-why-pin-marker className={n === active ? `${styles.whyPinStep} ${styles.whyPinStepActive}` : styles.whyPinStep}>
                        {n}
                      </span>
                    ))}
                    {rail}
                  </>
                )}
              </div>
              <div className={styles.whyPinSlides}>
                {Children.map(children, (child, index) => (
                  <div key={index} className={styles.whyPinSlide} data-why-slide>{child}</div>
                ))}
              </div>
              <a className={`${styles.heroCue} ${styles.heroCueOnLight} section-bottom-cue`} href="#settle">
                <span className="section-bottom-cue-label"><span>What less means for you</span></span>
                <ArrowDown size={16} strokeWidth={1.75} aria-hidden="true" />
              </a>
            </div>
          </div>
        </WhyFrameContext.Provider>
      </WhyPinContext.Provider>
    );
  }

  return (
    <div ref={ref} className={styles.whyFlow}>
      {rail}
      <WhyFrameContext.Provider value={active}>{children}</WhyFrameContext.Provider>
    </div>
  );
}
