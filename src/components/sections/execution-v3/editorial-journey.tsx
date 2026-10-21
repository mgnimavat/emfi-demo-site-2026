"use client";

import { useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { execution } from "@/content/execution";
import styles from "./editorial-journey.module.css";

function StageRow({
  label,
  index,
  total,
  progress,
  reduced,
  activeIndex,
}: {
  label: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
  reduced: boolean;
  activeIndex: number;
}) {
  const last = total - 1;
  const nodePos = index / last;
  const revealStart = Math.max(0, nodePos - 0.12);
  const revealPeak = nodePos;
  const settle = Math.min(1, nodePos + 0.18);

  const opacity = useTransform(
    progress,
    [revealStart, revealPeak, settle, 1],
    reduced ? [1, 1, 1, 1] : [0.42, 1, 0.78, 0.78],
  );
  const nodeFill = useTransform(
    progress,
    [Math.max(0, nodePos - 0.08), nodePos + 0.04],
    reduced ? [1, 1] : [0, 1],
  );
  const emphasis = useTransform(
    progress,
    [revealStart, revealPeak, settle, 1],
    reduced ? [1, 1, 1, 1] : [0.16, 1, 0.68, 0.68],
  );
  const labelScale = useTransform(
    progress,
    [revealStart, revealPeak, settle, 1],
    reduced ? [1, 1, 1, 1] : [0.96, 1.12, 1.03, 1.03],
  );

  const isActive = reduced || activeIndex === index;
  const isReached = reduced || activeIndex >= index;

  function onKeyDown(event: KeyboardEvent<HTMLLIElement>) {
    const list = event.currentTarget.parentElement;
    if (!list) return;
    const items = [...list.querySelectorAll<HTMLElement>("[data-stage]")];
    const current = items.indexOf(event.currentTarget);
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();
      items[(current + 1) % items.length]?.focus();
    }
    if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();
      items[(current - 1 + items.length) % items.length]?.focus();
    }
  }

  return (
    <motion.li
      data-stage
      className={styles.stage}
      data-active={isActive ? "true" : "false"}
      data-reached={isReached ? "true" : "false"}
      style={{ opacity, "--stage-emphasis": emphasis } as CSSProperties}
      tabIndex={0}
      aria-current={isActive ? "step" : undefined}
      onKeyDown={onKeyDown}
    >
      <span className={styles.node} aria-hidden="true">
        <motion.span className={styles.nodeFill} style={{ scale: nodeFill }} />
      </span>
      <span className={styles.number} aria-hidden="true">
        {String(index + 1).padStart(2, "0")}
      </span>
      <motion.span className={styles.label} style={{ scale: labelScale }}>
        <span className={styles.labelInner}>{label}</span>
      </motion.span>
    </motion.li>
  );
}

export function EditorialJourney() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedPreference = useReducedMotion();
  const reduced = Boolean(reducedPreference);
  const steps = execution.workflow.steps;
  const [activeIndex, setActiveIndex] = useState(0);

  // Progress while scrolling through the taller section — each stage lands as it enters.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.65", "end 0.35"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: reduced ? 1000 : 80,
    damping: reduced ? 100 : 28,
    mass: reduced ? 0.1 : 0.5,
    restDelta: 0.001,
  });

  useMotionValueEvent(smoothProgress, "change", (value) => {
    if (reduced) {
      setActiveIndex(steps.length - 1);
      return;
    }
    const next = Math.min(steps.length - 1, Math.max(0, Math.round(value * (steps.length - 1))));
    setActiveIndex((current) => (current === next ? current : next));
  });

  const lineScale = useTransform(smoothProgress, [0, 1], reduced ? [1, 1] : [0, 1]);
  const lineOpacity = useTransform(smoothProgress, [0, 0.05, 1], reduced ? [1, 1, 1] : [0.45, 1, 1]);

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      data-reduced={reduced ? "true" : "false"}
      aria-labelledby="workflow-heading-v3"
    >
      <div className={styles.inner}>
        <div className={styles.header}>
          <h2 id="workflow-heading-v3" className={styles.title}>
            {execution.workflow.title}
          </h2>
          <p className={styles.body}>{execution.workflow.body}</p>
        </div>

        <ol
          className={styles.stages}
          aria-label="Research to settlement process"
          style={{ "--active-ratio": activeIndex / Math.max(1, steps.length - 1) } as CSSProperties}
        >
          <div className={styles.rail} aria-hidden="true">
            <span className={styles.railTrack} />
            <motion.span
              className={styles.railProgress}
              style={{ scaleY: lineScale, opacity: lineOpacity }}
            />
          </div>

          {steps.map((step, index) => (
            <StageRow
              key={step.label}
              label={step.label}
              index={index}
              total={steps.length}
              progress={smoothProgress}
              reduced={reduced}
              activeIndex={activeIndex}
            />
          ))}
        </ol>
      </div>
    </section>
  );
}
