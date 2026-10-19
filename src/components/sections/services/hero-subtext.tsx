"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import styles from "@/app/services/services.module.css";

const subscribeToHydration = () => () => {};

// Timing from Archive 10's heroTypeFrame: type, hold, delete, pause.
function typeFrame(words: string[], elapsed: number) {
  if (elapsed < 1500) return "";
  const firstTypedAt = 1500 + words[0].length * 75;
  if (elapsed < firstTypedAt) return words[0].slice(0, Math.floor((elapsed - 1500) / 75));
  const duration = words.reduce((total, word, i) => total + 2400 + word.length * 45 + 220 + words[(i + 1) % words.length].length * 75, 0);
  let time = (elapsed - firstTypedAt) % duration;
  for (let i = 0; i < words.length; i++) {
    const word = words[i], next = words[(i + 1) % words.length];
    if (time < 2400) return word;
    time -= 2400;
    if (time < word.length * 45) return word.slice(0, word.length - Math.floor(time / 45));
    time -= word.length * 45;
    if (time < 220) return "";
    time -= 220;
    if (time < next.length * 75) return next.slice(0, Math.floor(time / 75));
    time -= next.length * 75;
  }
  return words[0];
}

export function ServicesHeroSubtext({ phrases }: { phrases: string[] }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const elapsed = useRef(0);
  const visible = useInView(ref, { amount: 0.2 });
  const prefersReduced = useReducedMotion();
  const hydrated = useSyncExternalStore(subscribeToHydration, () => true, () => false);
  const reduced = Boolean(hydrated && prefersReduced);
  const words = useMemo(() => phrases.map((phrase) => phrase.replace(/^More\s+/, "")), [phrases]);
  const [text, setText] = useState("");

  useEffect(() => {
    if (!visible || reduced || !words.length) return;
    let previous = performance.now();
    const timer = window.setInterval(() => {
      const now = performance.now();
      if (!document.hidden) {
        elapsed.current += now - previous;
        const next = typeFrame(words, elapsed.current);
        setText((current) => current === next ? current : next);
      }
      previous = now;
    }, 40);
    return () => window.clearInterval(timer);
  }, [visible, reduced, words]);

  return (
    <p ref={ref} className={styles.heroSubtext}>
      <span className="sr-only">{phrases.join(" ")}</span>
      <span aria-hidden="true" className={styles.typeLine}>More{" "}
        <span className={styles.typeWord}>
          {words.map((word) => <span key={word} className={styles.typeReserve}>{word}</span>)}
          <span className={styles.typeLetters} data-services-typewriter>{reduced ? words[0] : text}<span className={styles.caret} /></span>
        </span>
      </span>
    </p>
  );
}
