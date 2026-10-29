"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { about } from "@/content/about";
import styles from "./about-timeline.module.css";

export const AboutTimeline = ({ headingAs: Heading = "h2", showCounter = true }: { headingAs?: "h1" | "h2"; showCounter?: boolean }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(0);
  useEffect(() => {
    const header = document.querySelector("header");
    if (!header) return;
    const updateHeader = () => {
      const height = header.getBoundingClientRect().height;
      setHeaderHeight(height);
      sectionRef.current?.style.setProperty("--journey-header-height", `${height}px`);
    };
    const observer = new ResizeObserver(updateHeader);
    observer.observe(header);
    updateHeader();
    return () => observer.disconnect();
  }, []);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: [`start ${headerHeight}px`, "end end"] });
  const count = about.milestones.length;
  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    setActive(Math.min(count - 1, Math.max(0, Math.floor(progress * count))));
  });
  const [year, title, description] = about.milestones[active];

  const selectMilestone = (index: number) => {
    const section = sectionRef.current;
    if (!section) return;
    if (reduceMotion || matchMedia("(max-height: 560px), (prefers-reduced-motion: reduce)").matches) {
      setActive(index);
      return;
    }
    const start = section.getBoundingClientRect().top + window.scrollY - headerHeight;
    const distance = section.offsetHeight - window.innerHeight + headerHeight;
    // Land in the middle of this milestone's scroll range, in either direction.
    window.scrollTo({ top: start + ((index + 0.5) / count) * distance, behavior: "instant" });
  };

  return (
    <section id="about-journey" ref={sectionRef} className={styles.timeline} data-static={Boolean(reduceMotion)} aria-labelledby="timeline-heading">
      <div className={styles.stage}>
        <div className={styles.inner}>
          <div className={styles.heading}>
            <p>{about.yearsEyebrow}</p>
            <Heading id="timeline-heading">{about.yearsTitle}</Heading>
          </div>
          <div className={styles.layout}>
            <div className={styles.feature} aria-hidden="true">
              <motion.div key={year} initial={reduceMotion ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}>
                <p className={styles.year}>{year}</p>
                <span className={styles.rule} />
                <p className={styles.achievement}>{description}</p>
                {showCounter ? <p className={styles.counter}>{String(active + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}</p> : null}
              </motion.div>
            </div>
            <ol className={styles.milestones} aria-label="Platform milestones">
              {about.milestones.map(([itemYear, itemTitle, itemDescription], index) => (
                <li key={itemYear} data-active={index === active}>
                  <button type="button" onClick={() => selectMilestone(index)} aria-current={index === active ? "step" : undefined} aria-describedby={`milestone-description-${itemYear}`}>
                    <span className={styles.listYear}>{itemYear}</span>
                    <span className={styles.listTitle}>{itemTitle}</span>
                  </button>
                  <p id={`milestone-description-${itemYear}`} className={styles.listDescription}>{itemDescription}</p>
                </li>
              ))}
            </ol>
          </div>
          <p className={styles.currentTitle} aria-live="off">{year} · {title}</p>
        </div>
      </div>
    </section>
  );
};
