"use client";

import { useRef, type CSSProperties } from "react";
import { useInView } from "framer-motion";
import { execution } from "@/content/execution";
import styles from "./page.module.css";

export function DirectExecutionWorkflow() {
  const ref = useRef<HTMLOListElement>(null);
  const visible = useInView(ref, { amount: 0.15 });
  return <ol ref={ref} aria-label="Research to settlement process" className={styles.flowNodes} style={{ "--play-state": visible ? "running" : "paused" } as CSSProperties}>
    {execution.workflow.steps.map((step, i) => <li key={step.label} className={styles.flowNode}>
      {i < execution.workflow.steps.length - 1 ? <span aria-hidden className={styles.beam} style={{ "--delay": `${i * 1.1}s` } as CSSProperties} /> : null}
      <span aria-hidden className={styles.discSlot}><span className={styles.disc}><i /></span></span>
      <span className={styles.nodeLabel}>{step.label}</span>
    </li>)}
  </ol>;
}
