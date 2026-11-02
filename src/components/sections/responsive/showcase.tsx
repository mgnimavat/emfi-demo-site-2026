"use client";

import { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { HeroDashboardScreen } from "@/components/home-17/operating-view";
import { ResearchExecutionHeroMockup } from "@/components/home-17/research-execution-hero";
import styles from "./showcase.module.css";

const executionView = ["OrderEur"] as const;

export function ResponsiveShowcase() {
  const reduced = useReducedMotion();

  useEffect(() => {
    const frame = requestAnimationFrame(() => window.scrollTo(0, 0));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className={styles.stage} aria-hidden>
      <motion.div className={styles.dashboard} initial={reduced ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className={styles.clip}>
          <div className={styles.dashboardScale}>
            <HeroDashboardScreen trimChrome bare square />
          </div>
        </div>
      </motion.div>
      <motion.div className={styles.execution} initial={reduced ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: reduced ? 0 : 0.12 }}>
        <div className={styles.clip}>
          <div className={styles.executionScale}>
            <ResearchExecutionHeroMockup quietFrame square trimChrome views={executionView} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
