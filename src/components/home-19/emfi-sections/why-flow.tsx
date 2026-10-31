"use client";

import { Children, createContext, useContext, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from "react";
import { ArrowDown, ArrowRight } from "lucide-react";
import styles from "./sections.module.css";

const Y = "clamp(88px,10vw,144px)";
const X = "clamp(20px,4vw,56px)";
const WHY_LEARN_MORE_HREFS = [
  "/services/settlement-custody",
  "/services/settlement-custody#workstation-demo",
  "/why-emfi",
] as const;
const WhyFrameContext = createContext(0);
const WhyPinContext = createContext(false);
const WhyEngagedContext = createContext(false);

export function useWhyPinned() {
  return useContext(WhyPinContext);
}

export function useWhyEngaged() {
  return useContext(WhyEngagedContext);
}

export function sectionPad(rail: boolean, horizontal = true, pinned = false) {
  const left = `calc(${X} + 54px)`;
  if (pinned) {
    const top = "60px";
    const bottom = "clamp(100px, 13vh, 132px)";
    return `${top} var(--pin-side, 120px) ${bottom}`;
  }
  if (!horizontal) return rail ? `${Y} 0 ${Y} ${left}` : `${Y} 0`;
  return rail ? `${Y} ${X} ${Y} ${left}` : `${Y} ${X}`;
}

export function sectionFrame(pinned: boolean, centered: boolean, columns: string): CSSProperties {
  if (pinned) {
    return {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start",
      gap: "clamp(16px, 2.4vh, 28px)",
    };
  }
  if (centered) {
    return {
      display: "flex",
      flexDirection: "column",
      alignItems: "stretch",
      gap: 64,
    };
  }
  return {
    display: "grid",
    gridTemplateColumns: columns,
    alignItems: "center",
    gap: "30px clamp(30px,5vw,30px)",
  };
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

export function useWhyStep() {
  return useContext(WhyFrameContext);
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

export function WhyFlow({ children, stickyLabel = false, formProgress = false, shortWhy = false }: { children: ReactNode; stickyLabel?: boolean; formProgress?: boolean; shortWhy?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const elbowRef = useRef<HTMLSpanElement>(null);
  const elbowFillRef = useRef<HTMLSpanElement>(null);
  const pulseRef = useRef<HTMLSpanElement>(null);
  const wheelLockRef = useRef({ coolUntil: 0, blocked: false, timer: 0 });
  const [active, setActive] = useState(stickyLabel ? 1 : 0);
  const [engaged, setEngaged] = useState(false);

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
      const stageRect = stage.getBoundingClientRect();
      const inView = stageRect.top < 90 && stageRect.bottom > window.innerHeight - 8;
      setEngaged((current) => (current === inView ? current : inView));
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

    const wheelLock = wheelLockRef.current;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const pinMetrics = () => {
      const rect = flow.getBoundingClientRect();
      const distance = Math.max(1, flow.offsetHeight - window.innerHeight);
      const start = rect.top + window.scrollY;
      const steps = stageRef.current?.querySelectorAll("[data-why-slide]").length ?? 0;
      const progress = Math.max(0, Math.min(1, (window.scrollY - start) / distance));
      const step = steps === 0 ? 1 : progress >= 1 ? steps : Math.min(steps, Math.floor(progress * steps + 1e-6) + 1);
      return { rect, distance, start, steps, progress, step };
    };

    const onWheel = (event: WheelEvent) => {
      if (!stickyLabel || reduceMotion.matches || event.deltaY === 0) return;
      const { rect, distance, start, steps, step } = pinMetrics();
      const pinned = rect.top <= 1 && rect.bottom >= window.innerHeight - 1;
      if (!pinned || steps < 2) {
        wheelLock.blocked = true;
        window.clearTimeout(wheelLock.timer);
        wheelLock.timer = window.setTimeout(() => { wheelLock.blocked = false; }, 180);
        return;
      }
      const target = event.target;
      if (target instanceof Element) {
        let node: Element | null = target;
        while (node && node !== flow) {
          const overflow = getComputedStyle(node).overflowY;
          if ((overflow === "auto" || overflow === "scroll") && node.scrollHeight > node.clientHeight + 1) return;
          node = node.parentElement;
        }
      }
      event.preventDefault();
      if (wheelLock.blocked) {
        window.clearTimeout(wheelLock.timer);
        wheelLock.timer = window.setTimeout(() => { wheelLock.blocked = false; }, 180);
        return;
      }
      if (performance.now() < wheelLock.coolUntil) return;
      wheelLock.coolUntil = performance.now() + 720;
      const dir = event.deltaY > 0 ? 1 : -1;
      const header = stageRef.current?.getBoundingClientRect().top ?? 0;
      if (dir > 0 && step >= steps) {
        let node: HTMLElement | null = flow;
        let top = start + distance + window.innerHeight;
        while (node) {
          const next = node.nextElementSibling;
          if (next instanceof HTMLElement) {
            top = next.getBoundingClientRect().top + window.scrollY - header;
            break;
          }
          node = node.parentElement;
        }
        window.scrollTo({ top, behavior: "smooth" });
        return;
      }
      if (dir < 0 && step <= 1) {
        window.scrollTo({ top: Math.max(0, start - window.innerHeight + header), behavior: "smooth" });
        return;
      }
      const nextProgress = Math.min((step + dir - 0.5) / steps, 0.999);
      window.scrollTo({ top: start + distance * nextProgress, behavior: "smooth" });
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("wheel", onWheel);
    };
  }, [active, stickyLabel]);

  const rail = <Rail railRef={railRef} fillRef={fillRef} elbowRef={elbowRef} elbowFillRef={elbowFillRef} pulseRef={pulseRef} />;

  if (stickyLabel) {
    return (
      <WhyPinContext.Provider value={true}>
        <WhyEngagedContext.Provider value={engaged}>
        <WhyFrameContext.Provider value={active}>
          <div ref={ref} className={styles.whyPin}>
            <div ref={stageRef} className={`${styles.whyPinStage} ${styles.whyFlow} ${styles.whyFlowSticky}`}>
              <div ref={slotRef} className={styles.whyStickySlot} aria-hidden="true">
                <p className={shortWhy ? `${styles.whyStickyWord} ${styles.whyWordLarge}` : styles.whyStickyWord}><span>{shortWhy ? "Why" : "Why EMFI"}</span></p>
              </div>
              <div className={[styles.whyPinMarkers, formProgress ? styles.whyFormProgress : "", shortWhy ? styles.whyPinMarkersStart : ""].filter(Boolean).join(" ")} data-why-pin-markers data-why-form-progress={formProgress ? "" : undefined} aria-hidden="true">
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
              <a
                className={`${styles.heroCue} ${styles.heroCueOnLight} section-bottom-cue`}
                href={shortWhy ? WHY_LEARN_MORE_HREFS[Math.max(1, Math.min(WHY_LEARN_MORE_HREFS.length, active)) - 1] : "#settle"}
              >
                {shortWhy ? (
                  <>
                    <span className="section-bottom-cue-label"><span>Learn More</span></span>
                    <ArrowRight size={16} strokeWidth={1.75} className={styles.heroCueLearnArrow} aria-hidden="true" />
                  </>
                ) : (
                  <>
                    <span className="section-bottom-cue-label"><span>What less means for you</span></span>
                    <ArrowDown size={16} strokeWidth={1.75} aria-hidden="true" />
                  </>
                )}
              </a>
            </div>
          </div>
        </WhyFrameContext.Provider>
        </WhyEngagedContext.Provider>
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
