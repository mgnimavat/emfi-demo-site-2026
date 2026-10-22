"use client";

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { animate, useInView, useMotionValue, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  ArrowRightLeft,
  BriefcaseBusiness,
  ChartNoAxesCombined,
  CircleCheck,
  ShieldCheck,
  BadgeCheck,
  CircleDollarSign,
  ClipboardList,
  FileSearch,
  Handshake,
  type LucideIcon,
} from "lucide-react";
import { services } from "@/content/services";
import { execution } from "@/content/execution";
import styles from "./connected-journey.module.css";

const icons: LucideIcon[] = [
  FileSearch,
  ClipboardList,
  CircleDollarSign,
  ArrowUpRight,
  BadgeCheck,
  Handshake,
];

/** Full Research → Settlement pass; linear so pace stays even across every segment. */
const JOURNEY_MS = 7200;
const RESET_MS = 500;

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

export function ConnectedJourney({ variant = "execution" }: { variant?: "execution" | "lifecycle" }) {
  const ref = useRef<HTMLOListElement>(null);
  const visible = useInView(ref, { amount: 0.15 });
  const prefersReducedMotion = useReducedMotion();
  const reduced = Boolean(prefersReducedMotion);
  const lifecycle = variant === "lifecycle";
  const steps = lifecycle
    ? services.lifecycle.stages.map(stage => ({ label: stage.title.toLowerCase().replace(/\b\w/g, letter => letter.toUpperCase()) }))
    : execution.workflow.steps;
  const stageIcons = lifecycle
    ? [ChartNoAxesCombined, ArrowRightLeft, CircleCheck, ShieldCheck, BriefcaseBusiness]
    : icons;
  const journeyDuration = lifecycle ? 15500 : JOURNEY_MS;
  const lastIndex = steps.length - 1;
  const progress = useMotionValue(0);
  const [progressValue, setProgressValue] = useState(0);

  useEffect(() => {
    return progress.on("change", setProgressValue);
  }, [progress]);

  useEffect(() => {
    if (reduced) {
      progress.set(1);
      return;
    }
    if (!visible) {
      progress.stop();
      return;
    }

    let active = true;
    let controls: { stop: () => void } | null = null;

    const run = () => {
      if (!active) return;
      progress.set(0);
      controls = animate(progress, 1, {
        duration: journeyDuration / 1000,
        ease: "linear",
        onComplete: () => {
          if (!active) return;
          window.setTimeout(() => {
            if (active) run();
          }, RESET_MS);
        },
      });
    };

    run();

    return () => {
      active = false;
      controls?.stop();
    };
  }, [visible, reduced, progress, journeyDuration]);

  const flow = reduced ? 1 : progressValue;
  const frontier = flow * lastIndex;

  function onKeyDown(event: KeyboardEvent<HTMLLIElement>, index: number) {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      const next = (index + 1) % steps.length;
      ref.current?.querySelectorAll<HTMLElement>("[data-step]")[next]?.focus();
      return;
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      const prev = (index - 1 + steps.length) % steps.length;
      ref.current?.querySelectorAll<HTMLElement>("[data-step]")[prev]?.focus();
    }
  }

  return (
    <ol
      ref={ref}
      aria-label={lifecycle ? "Five connected stages of the investment lifecycle" : "Research to settlement process"}
      className={styles.journey}
      data-reduced={reduced ? "true" : "false"}
      style={{ "--play-state": visible && !reduced ? "running" : "paused", "--journey-columns": steps.length } as CSSProperties}
    >
      {steps.map((step, index) => {
        const Icon = stageIcons[index];
        const isLast = index === lastIndex;
        const nodePos = index / lastIndex;
        const isReached = flow >= nodePos - 0.002;
        const isActive = !reduced && Math.abs(frontier - index) < 0.55;
        const segmentFill = isLast
          ? 0
          : clamp01((flow - index / lastIndex) / (1 / lastIndex));

        return (
          <li
            key={step.label}
            data-step
            className={styles.step}
            data-active={isActive ? "true" : "false"}
            data-reached={isReached ? "true" : "false"}
            tabIndex={0}
            aria-current={isActive ? "step" : undefined}
            onKeyDown={(event) => onKeyDown(event, index)}
          >
            {!isLast ? (
              <span
                aria-hidden
                className={styles.connector}
                style={{ "--segment-fill": segmentFill } as CSSProperties}
              >
                <span className={styles.track} />
                <span
                  className={styles.beam}
                  style={{ opacity: segmentFill > 0.01 ? 1 : 0 }}
                />
                <span
                  className={styles.pulse}
                  style={{
                    opacity: segmentFill > 0.02 && segmentFill < 0.98 ? 1 : 0,
                  }}
                />
              </span>
            ) : null}
            <span className={styles.disc} aria-hidden>
              <Icon strokeWidth={1.6} />
            </span>
            <span className={styles.label}>{step.label}</span>
          </li>
        );
      })}
    </ol>
  );
}
