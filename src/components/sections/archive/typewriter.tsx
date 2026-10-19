"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import styles from "./theme.module.css";

const subscribeToHydration = () => () => {};
const subscribeToVisibility = (callback: () => void) => {
  document.addEventListener("visibilitychange", callback);
  return () => document.removeEventListener("visibilitychange", callback);
};
const isDocumentVisible = () => document.visibilityState === "visible";
const serverVisible = () => true;
type Phase = "holding" | "deleting" | "pause" | "typing";

export function ArchiveTypewriter({ words }: { words: string[] }) {
  const ref = useRef<HTMLSpanElement>(null);
  const visible = useInView(ref, { amount: 0.2 });
  const prefersReduced = useReducedMotion();
  const hydrated = useSyncExternalStore(subscribeToHydration, () => true, () => false);
  const documentVisible = useSyncExternalStore(subscribeToVisibility, isDocumentVisible, serverVisible);
  const reduced = Boolean(hydrated && prefersReduced);
  const [frame, setFrame] = useState<{ index: number; chars: number; phase: Phase }>({ index: 0, chars: words[0]?.length ?? 0, phase: "holding" });
  const word = words[frame.index] ?? "";

  useEffect(() => {
    if (!visible || !documentVisible || reduced || words.length < 2) return;
    const delay = frame.phase === "holding" ? 2400 : frame.phase === "pause" ? 220 : frame.phase === "typing" ? 65 : 40;
    const timer = window.setTimeout(() => {
      if (frame.phase === "holding") setFrame({ ...frame, phase: "deleting" });
      else if (frame.phase === "deleting") setFrame({ ...frame, chars: Math.max(0, frame.chars - 1), phase: frame.chars <= 1 ? "pause" : "deleting" });
      else if (frame.phase === "pause") setFrame({ index: (frame.index + 1) % words.length, chars: 0, phase: "typing" });
      else setFrame({ ...frame, chars: frame.chars + 1, phase: frame.chars + 1 >= word.length ? "holding" : "typing" });
    }, delay);
    return () => window.clearTimeout(timer);
  }, [frame, visible, documentVisible, reduced, words.length, word.length]);

  return (
    <span ref={ref} className={styles.typewriter} aria-hidden="true">
      {words.map((item) => <span key={item} className={styles.wordReserve}>{item}</span>)}
      <span className={styles.wordVisible} data-archive-typewriter>{reduced ? words[0] : word.slice(0, frame.chars)}{!reduced && words.length > 1 ? <span className={styles.cursor} /> : null}</span>
    </span>
  );
}
