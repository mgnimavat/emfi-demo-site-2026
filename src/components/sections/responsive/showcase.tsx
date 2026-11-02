"use client";

import { useEffect, useSyncExternalStore } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { HeroDashboardScreen } from "@/components/home-17/operating-view";
import { ResearchExecutionHeroMockup } from "@/components/home-17/research-execution-hero";
import styles from "./showcase.module.css";

const executionView = ["OrderEur"] as const;
const loop = { duration: 18, repeat: Infinity, ease: "easeInOut" as const, times: [0, 0.46, 0.74, 1] };

function useWide() {
  return useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia("(min-width: 900px)");
      query.addEventListener("change", onChange);
      return () => query.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(min-width: 900px)").matches,
    () => true,
  );
}

export function ResponsiveShowcase() {
  const reduced = useReducedMotion();
  const wide = useWide();
  const play = wide && !reduced;

  useEffect(() => {
    const frame = requestAnimationFrame(() => window.scrollTo(0, 0));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className={styles.stage} aria-hidden>
      <motion.div className={styles.dashboard} initial={play ? { opacity: 0, y: 16 } : false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
        <motion.div
          className={styles.motion}
          animate={play ? { x: [0, 0, -6, 0], y: [0, 0, 4, 0], rotate: [-1.2, -1.2, 0, -1.2] } : { x: 0, y: 0, rotate: 0 }}
          transition={play ? loop : { duration: 0 }}
        >
          <div className={styles.clip}>
            <div className={styles.dashboardScale}>
              <HeroDashboardScreen trimChrome bare square />
            </div>
          </div>
        </motion.div>
      </motion.div>
      <motion.div className={styles.execution} initial={play ? { opacity: 0, y: 20 } : false} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: play ? 0.18 : 0 }}>
        <motion.div
          className={styles.motion}
          animate={play ? { x: [0, 0, -4, 0], y: [0, 0, -4, 0], rotate: [0.6, 0.6, 0, 0.6] } : { x: 0, y: 0, rotate: 0 }}
          transition={play ? loop : { duration: 0 }}
        >
          <div className={styles.clip}>
            <div className={styles.executionScale}>
              <ResearchExecutionHeroMockup quietFrame square trimChrome views={executionView} />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
