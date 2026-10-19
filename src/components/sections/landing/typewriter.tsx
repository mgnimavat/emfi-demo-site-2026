"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./landing.module.css";

const words = ["custody.", "research.", "asset management.", "execution.", "wealth management."];
export function HeroTypewriter() {
  const ref = useRef<HTMLParagraphElement>(null);
  const [text, setText] = useState(words[0]);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false, elapsed = 0, previous = performance.now();
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; previous = performance.now(); }, { threshold: .1 });
    observer.observe(element);
    const resetClock = () => { previous = performance.now(); };
    document.addEventListener("visibilitychange", resetClock);
    const tick = window.setInterval(() => {
      const now = performance.now(), delta = now - previous; previous = now;
      if (reduced.matches) { setText(words[0]); return; }
      if (!visible || document.hidden) return;
      elapsed += delta;
      if (elapsed < 1500) { setText(""); return; }
      const loop = words.reduce((sum, word) => sum + word.length * 120 + 2400 + 220, 0);
      let time = (elapsed - 1500) % loop;
      for (const word of words) {
        const typing = word.length * 75, erasing = word.length * 45;
        if (time < typing) { setText(word.slice(0, Math.floor(time / 75))); return; }
        time -= typing;
        if (time < 2400) { setText(word); return; }
        time -= 2400;
        if (time < erasing) { setText(word.slice(0, word.length - Math.floor(time / 45))); return; }
        time -= erasing;
        if (time < 220) { setText(""); return; }
        time -= 220;
      }
    }, 30);
    return () => { window.clearInterval(tick); observer.disconnect(); document.removeEventListener("visibilitychange", resetClock); };
  }, []);
  return <p ref={ref} className={styles.heroAccent} aria-label="Less custody. Less research. Less asset management. Less execution. Less wealth management."><span aria-hidden="true">Less <span data-home-typewriter>{text}</span><span className={styles.caret} /></span></p>;
}
