"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

const subscribeToHydration = () => () => {};

export function ExecutionReveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reducedPreference = useReducedMotion();
  const hydrated = useSyncExternalStore(subscribeToHydration, () => true, () => false);
  const reduced = hydrated && reducedPreference;
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: reduced ? 0 : 0.35, delay: reduced ? 0 : delay }}
    >
      {children}
    </motion.div>
  );
}
