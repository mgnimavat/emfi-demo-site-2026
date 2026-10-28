"use client";

import { useId, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { principles as copy } from "@/content/home-16-principles";
import navigation from "@/content/site-navigation.json";
import styles from "./principles.module.css";

function GradientMark() {
  const gradientId = `principles-mark-${useId().replace(/:/g, "")}`;

  return (
    <svg viewBox="0 0 145 145" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="72.5" x2="145" y2="72.5" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7a9cc3" />
          <stop offset="36%" stopColor="#69a6bb" />
          <stop offset="68%" stopColor="#5db1b5" />
          <stop offset="100%" stopColor="#59beac" />
        </linearGradient>
      </defs>
      <path d={navigation.markPath} fill={`url(#${gradientId})`} />
    </svg>
  );
}

type PrincipleId = (typeof copy.items)[number]["id"];

export const PrinciplesSection = () => {
  const [activeId, setActiveId] = useState<PrincipleId | null>(null);

  return (
    <section className={styles.section} aria-labelledby="home-16-principles-heading">
      <div className={styles.container}>
        <div className={styles.intro}>
          <div className={styles.mark} aria-hidden="true">
            <GradientMark />
          </div>
          <div className={styles.introCopy}>
            <p className={styles.eyebrow}><span className={styles.eyebrowMark} aria-hidden="true" /><span>{copy.eyebrow}</span></p>
            <h2 id="home-16-principles-heading" className={styles.title}>
              <span>{copy.title}</span>
              <span className={styles.accent}><span className={styles.emphasis}>{copy.accent.replace(/\.$/, "")}</span><span className={styles.period}>.</span></span>
            </h2>
          </div>
        </div>
        <div className={styles.cards}>
          {copy.items.map((item) => {
            const open = activeId === item.id;
            return (
              <article
                key={item.id}
                className={styles.card}
                data-open={open}
                onMouseEnter={() => setActiveId(item.id)}
                onMouseLeave={() => setActiveId((current) => (current === item.id ? null : current))}
              >
                <h3 className={styles.cardHeading}>
                  <button
                    id={`principle-${item.id}`}
                    type="button"
                    className={styles.trigger}
                    aria-expanded={open}
                    aria-controls={`principle-${item.id}-detail`}
                    onMouseDown={(event) => event.preventDefault()}
                    onFocus={() => setActiveId(item.id)}
                    onBlur={() => setActiveId((current) => (current === item.id ? null : current))}
                  >
                    <span className={styles.cardTitle}>
                      <span className={styles.emphasis}>{copy.prefix}</span> {item.label}.
                    </span>
                    <span className={styles.toggle}>{open ? <ChevronUp aria-hidden="true" /> : <ChevronDown aria-hidden="true" />}</span>
                  </button>
                </h3>
                <div
                  id={`principle-${item.id}-detail`}
                  role="region"
                  aria-labelledby={`principle-${item.id}`}
                  className={styles.detail}
                  hidden={!open}
                >
                  <p>{item.body}</p>
                </div>
              </article>
            );
          })}
          {copy.items.map((item) => (
            <div key={`${item.id}-sizer`} className={`${styles.card} ${styles.sizer}`} aria-hidden="true" inert>
              <div className={styles.cardHeading}>
                <div className={styles.trigger}>
                  <span className={styles.cardTitle}>
                    <span className={styles.emphasis}>{copy.prefix}</span> {item.label}.
                  </span>
                  <span className={styles.toggle} />
                </div>
              </div>
              <div className={styles.detail}>
                <p>{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
