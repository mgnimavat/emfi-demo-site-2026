"use client";

import { useServiceLocale } from '@/ui/hooks/useServiceLocale';

import { useEffect, useLayoutEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import styles from "./page.module.css";

const HOLD_MS = 3400;

const slides = [
  { title: "Regulated under", items: ["CASS", "MiFID", "AIFMD"] },
  {
    title: "Audited by",
    logos: [
      { src: "/brand/auditors/baker-tilly-brand.png", alt: "Baker Tilly", width: 280, height: 73 },
      { src: "/brand/auditors/buzzacott-brand.png", alt: "Buzzacott", width: 280, height: 56 },
      { src: "/brand/auditors/bdo-brand.png", alt: "BDO", width: 280, height: 108 },
    ],
  },
  {
    title: "Connected to",
    logos: [
      { src: "/brand/standing/emta-brand.svg", alt: "EMTA", width: 290, height: 85 },
      { src: "/brand/standing/cisi-brand.png", alt: "CISI", width: 572, height: 288 },
      { src: "/brand/standing/bloomberg-brand.png", alt: "Bloomberg", width: 280, height: 56 },
    ],
  },
  {
    title: "Quoted in",
    logos: [
      { src: "/brand/press/reuters-brand.svg", alt: "Reuters", width: 280, height: 70 },
      { src: "/brand/press/wsj-brand.svg", alt: "The Wall Street Journal", width: 64, height: 64 },
      { src: "/brand/press/nyt-brand.svg", alt: "The New York Times", width: 184, height: 25 },
    ],
  },
];

export function OversightCycle() {
  const { t } = useServiceLocale();
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();
  const slide = slides[index];

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    const frame = requestAnimationFrame(() => window.scrollTo(0, 0));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => setIndex((current) => (current + 1) % slides.length), HOLD_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className={styles.cycle} aria-live="polite">
      <AnimatePresence mode="wait">
        <motion.div
          key={t(slide.title)}
          className={styles.cycleFrame}
          initial={reduce ? false : { opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: -18 }}
          transition={{ duration: reduce ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className={styles.groupLabel}>{t(slide.title)}</p>
          <div className={styles.cycleRow}>
            {"logos" in slide && slide.logos
              ? slide.logos.map((item) => (
                  <div key={item.alt} className={styles.cycleCell}>
                    <Image src={item.src} alt={item.alt} width={item.width} height={item.height} unoptimized />
                  </div>
                ))
              : "items" in slide && slide.items
                ? slide.items.map((item) => (
                    <div key={item} className={styles.cycleCell}>
                      <span>{item}</span>
                    </div>
                  ))
                : null}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
