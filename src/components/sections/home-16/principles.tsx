"use client";

import { useId, useState } from "react";
import { ArrowDown, ChevronDown, ChevronUp } from "lucide-react";
import { principles as copy } from "@/content/home-16-principles";
import navigation from "@/content/site-navigation.json";
import cueStyles from "@/components/emfi-sections/sections.module.css";
import styles from "./principles.module.css";

function GradientMark() {
  const gradientId = `principles-mark-${useId().replace(/:/g, "")}`;

  return (
    <svg viewBox="0 0 145 145" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="72.5" x2="145" y2="72.5" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="var(--principle-from)" stopOpacity="1" />
          <stop offset="48%" stopColor="var(--principle-mid)" stopOpacity="1" />
          <stop offset="100%" stopColor="var(--principle-to)" stopOpacity="1" />
        </linearGradient>
      </defs>
      <path d={navigation.markPath} fill={`url(#${gradientId})`} fillOpacity="1" />
    </svg>
  );
}

type PrincipleId = (typeof copy.items)[number]["id"];

function OpenPrinciples() {
  return (
    <section id="settle" className={styles.openSection} aria-labelledby="home-16-principles-heading">
      <div className={styles.container}>
        <h2 id="home-16-principles-heading" className={styles.openTitle}>
          {copy.title} <span className={styles.emphasis}>{copy.accent}</span>
        </h2>
        <div className={styles.openRows}>
          {copy.items.map((item) => (
            <article key={item.id} className={styles.openRow}>
              <div className={styles.openCard}>
                <h3 className={styles.openCardTitle}>
                  <span className={styles.emphasis}>{copy.prefix}</span> {item.label}.
                </h3>
                <p className={styles.openSummary}>{item.summary}</p>
              </div>
              <div className={styles.openDetail}>
                <h3 className={styles.openDetailHeading}>{item.heading}</h3>
                <div className={styles.openDetailBody}>
                  <p>{item.detail}</p>
                  <ul>{item.points.map((point) => <li key={point}>{point}</li>)}</ul>
                  <p className={styles.openNote}>{item.note}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function InteractivePrinciples() {
  const [activeId, setActiveId] = useState<PrincipleId | null>(null);

  return (
    <section id="settle" className={styles.section} aria-labelledby="home-16-principles-heading">
      <div className={styles.container}>
        <div className={styles.intro}>
          <div className={styles.mark} aria-hidden="true">
            <GradientMark />
          </div>
          <div className={styles.introCopy}>
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
}

function StackedPrinciples({ whiteCards = false, breakTitle = false }: { whiteCards?: boolean; breakTitle?: boolean }) {
  return (
    <section id="settle" className={`${styles.section} ${styles.stackedSection}`} aria-labelledby="home-16-principles-heading">
      <div className={styles.mark} aria-hidden="true">
        <GradientMark />
      </div>
      <div className={styles.container}>
        <div className={`${styles.intro} ${styles.stackedIntro}`}>
          <div className={styles.introCopy}>
            <h2 id="home-16-principles-heading" className={breakTitle ? `${styles.title} ${styles.stackedTitleBreak}` : styles.title}>
              <span>{copy.title}</span>
              <span className={styles.accent}><span className={styles.emphasis}>{copy.accent.replace(/\.$/, "")}</span><span className={styles.period}>.</span></span>
            </h2>
            <div className={styles.stackedCards}>
              {copy.items.map((item) => (
                <article key={item.id} className={whiteCards ? `${styles.card} ${styles.stackedCard} ${styles.stackedCardPlain}` : `${styles.card} ${styles.stackedCard}`}>
                  <h3 className={styles.stackedCardTitle}>
                    <span className={styles.emphasis}>{copy.prefix}</span> {item.label}.
                  </h3>
                  <div className={styles.detail}>
                    <p>{item.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
      <a className={`${cueStyles.heroCue} ${cueStyles.heroCueOnLight}`} href="#say-less">
        Let&apos;s Talk
        <ArrowDown size={16} strokeWidth={1.75} aria-hidden="true" />
      </a>
    </section>
  );
}

export const PrinciplesSection = ({ open = false, stacked = false, whiteCards = false, breakTitle = false }: { open?: boolean; stacked?: boolean; whiteCards?: boolean; breakTitle?: boolean }) => {
  if (open) return <OpenPrinciples />;
  if (stacked) return <StackedPrinciples whiteCards={whiteCards} breakTitle={breakTitle} />;
  return <InteractivePrinciples />;
};
