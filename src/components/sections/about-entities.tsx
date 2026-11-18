"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import type { AboutCopy } from "@/lib/i18n";
import styles from "./about-entities.module.css";

type Point = { x: number; y: number };
type ConnectorPath = { d: string; end: Point };

const ease = [0.22, 1, 0.36, 1] as const;

function badgeTone(badge: string) {
  const key = badge.trim().toLowerCase();
  if (key.includes("hold")) return "holding";
  if (key.includes("fca")) return "fca";
  if (key.includes("dfsa")) return "dfsa";
  if (key.includes("fund")) return "fund";
  return "default";
}

function curve(from: Point, to: Point) {
  const dy = Math.max(to.y - from.y, 48);
  const midY = from.y + dy * 0.52;
  return `M ${from.x} ${from.y} C ${from.x} ${midY}, ${to.x} ${midY}, ${to.x} ${to.y}`;
}

function elbow(from: Point, to: Point) {
  const midY = from.y + Math.max(28, (to.y - from.y) * 0.5);
  return `M ${from.x} ${from.y} L ${from.x} ${midY} L ${to.x} ${midY} L ${to.x} ${to.y}`;
}

export const AboutEntities = ({ copy }: { copy: AboutCopy }) => {
  const section = copy.entities;
  const reduceMotion = useReducedMotion();
  const diagramRef = useRef<HTMLDivElement>(null);
  const holdingRef = useRef<HTMLElement>(null);
  const childRefs = useRef<(HTMLElement | null)[]>([]);
  const inView = useInView(diagramRef, { once: true, amount: 0.25 });
  const [paths, setPaths] = useState<ConnectorPath[]>([]);
  const [origin, setOrigin] = useState<Point | null>(null);
  const [vertical, setVertical] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 900px)");
    const sync = () => setVertical(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useLayoutEffect(() => {
    const diagram = diagramRef.current;
    const holding = holdingRef.current;
    if (!diagram || !holding) return;

    const measure = () => {
      const root = diagram.getBoundingClientRect();
      const parent = holding.getBoundingClientRect();
      const start: Point = {
        x: parent.left + parent.width / 2 - root.left,
        y: parent.bottom - root.top,
      };

      const ends: Point[] = [];
      childRefs.current.forEach((node) => {
        if (!node) return;
        const child = node.getBoundingClientRect();
        ends.push({
          x: vertical ? child.left - root.left + 18 : child.left + child.width / 2 - root.left,
          y: child.top - root.top,
        });
      });

      if (!ends.length) {
        setOrigin(start);
        setPaths([]);
        return;
      }

      setOrigin(start);
      setPaths(
        ends.map((end) => ({
          end,
          d: vertical ? elbow(start, end) : curve(start, end),
        })),
      );
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(diagram);
    observer.observe(holding);
    childRefs.current.forEach((node) => node && observer.observe(node));
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [section.children, vertical]);

  const showMotion = Boolean(inView && !reduceMotion);

  return (
    <section id="structure" className={styles.section} aria-labelledby="about-entities-heading">
      <div className={styles.container}>
        <div className={styles.intro}>
          <motion.h2
            id="about-entities-heading"
            className={styles.title}
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.34, ease }}
          >
            {section.title.map((line, index) => (
              <span key={line}>
                {line}
                {index < section.title.length - 1 ? <br /> : null}
              </span>
            ))}
            <span className={styles.dot} aria-hidden="true">.</span>
          </motion.h2>
          <motion.p
            className={styles.lead}
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.34, delay: reduceMotion ? 0 : 0.05, ease }}
          >
            {section.body}
          </motion.p>
        </div>

        <div
          ref={diagramRef}
          className={styles.diagram}
          data-vertical={vertical || undefined}
          data-active={activeIndex ?? undefined}
        >
          <svg className={styles.connectors} aria-hidden="true">
            <defs>
              <linearGradient id="about-entity-curve" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8098cc" />
                <stop offset="55%" stopColor="#5db1b5" />
                <stop offset="100%" stopColor="#3dceb6" />
              </linearGradient>
              <linearGradient id="about-entity-curve-active" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#9bb6d4" />
                <stop offset="100%" stopColor="#59beac" />
              </linearGradient>
              <filter id="about-entity-dot-glow" x="-80%" y="-80%" width="260%" height="260%">
                <feGaussianBlur stdDeviation="1.6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {paths.map((path, index) => {
              const active = activeIndex === index;
              const dimmed = activeIndex !== null && !active;
              return (
                <motion.path
                  key={`${index}-${path.d}`}
                  d={path.d}
                  className={styles.connector}
                  fill="none"
                  stroke={active ? "url(#about-entity-curve-active)" : "url(#about-entity-curve)"}
                  strokeWidth={active ? 2.2 : 1.4}
                  initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
                  animate={
                    showMotion || reduceMotion
                      ? { pathLength: 1, opacity: dimmed ? 0.22 : 1 }
                      : { pathLength: 0, opacity: 0 }
                  }
                  transition={{
                    pathLength: { duration: 0.42, delay: reduceMotion ? 0 : 0.1 + index * 0.045, ease },
                    opacity: { duration: 0.28, ease },
                  }}
                />
              );
            })}

            {origin ? (
              <motion.g
                initial={reduceMotion ? false : { opacity: 0, scale: 0.7 }}
                animate={showMotion || reduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.3, delay: reduceMotion ? 0 : 0.08, ease }}
                style={{ transformOrigin: `${origin.x}px ${origin.y}px` }}
              >
                <circle className={styles.dotHalo} cx={origin.x} cy={origin.y} r="6" />
                <circle className={styles.dotCore} cx={origin.x} cy={origin.y} r="2.8" />
              </motion.g>
            ) : null}

            {paths.map((path, index) => {
              const active = activeIndex === index;
              const dimmed = activeIndex !== null && !active;
              return (
                <motion.g
                  key={`end-${index}`}
                  className={styles.endDot}
                  data-active={active || undefined}
                  initial={reduceMotion ? false : { opacity: 0, scale: 0.7 }}
                  animate={
                    showMotion || reduceMotion
                      ? { opacity: dimmed ? 0.25 : 1, scale: 1 }
                      : { opacity: 0, scale: 0.7 }
                  }
                  transition={{ duration: 0.3, delay: reduceMotion ? 0 : 0.22 + index * 0.04, ease }}
                  style={{ transformOrigin: `${path.end.x}px ${path.end.y}px` }}
                >
                  <circle className={styles.dotHalo} cx={path.end.x} cy={path.end.y} r="5.5" />
                  <circle className={styles.dotCore} cx={path.end.x} cy={path.end.y} r="2.4" />
                </motion.g>
              );
            })}
          </svg>

          <motion.article
            ref={holdingRef}
            className={styles.holding}
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={showMotion || reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.34, delay: reduceMotion ? 0 : 0.02, ease }}
          >
            <div className={styles.holdingGlow} aria-hidden="true" />
            <span className={`${styles.badge} ${styles.badgeHolding}`}>{section.holding.badge}</span>
            <p className={styles.jurisdiction}>{section.holding.jurisdiction}</p>
            <h3 className={styles.name}>{section.holding.name}</h3>
            <p className={styles.role}>{section.holding.role}</p>
            <p className={styles.meta}>{section.holding.meta}</p>
          </motion.article>

          <div className={styles.children} role="list">
            {section.children.map((entity, index) => {
              const tone = badgeTone(entity.badge);
              return (
                <motion.article
                  key={entity.name}
                  role="listitem"
                  ref={(node) => {
                    childRefs.current[index] = node;
                  }}
                  className={styles.child}
                  data-tone={tone}
                  data-active={activeIndex === index || undefined}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                  onFocus={() => setActiveIndex(index)}
                  onBlur={() => setActiveIndex(null)}
                  tabIndex={0}
                  initial={reduceMotion ? false : { opacity: 0, y: 18 }}
                  animate={showMotion || reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
                  transition={{ duration: 0.34, delay: reduceMotion ? 0 : 0.24 + index * 0.06, ease }}
                >
                  <div className={styles.childTop}>
                    <p className={styles.jurisdiction}>{entity.jurisdiction}</p>
                    <span
                      className={[
                        styles.badge,
                        tone === "fca" ? styles.badgeFca : "",
                        tone === "dfsa" ? styles.badgeDfsa : "",
                        tone === "fund" ? styles.badgeFund : "",
                      ].filter(Boolean).join(" ")}
                    >
                      {entity.badge}
                    </span>
                  </div>
                  <h3 className={styles.name}>{entity.name}</h3>
                  <p className={styles.role}>{entity.role}</p>
                  <p className={styles.meta}>{entity.meta}</p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
