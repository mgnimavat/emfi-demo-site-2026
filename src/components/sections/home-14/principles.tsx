'use client';

import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { principles as copy } from '@/content/home-14-principles';
import styles from './principles.module.css';

type PrincipleId = (typeof copy.items)[number]['id'];

export const PrinciplesSection = () => {
  const [activeId, setActiveId] = useState<PrincipleId>('cost');

  return (
    <section className={styles.section} aria-labelledby="home-14-principles-heading">
      <div className={styles.container}>
        <h2 id="home-14-principles-heading" className={styles.title}>
          {copy.title} <span className={styles.gradient}>{copy.accent}</span>
        </h2>
        <div className={styles.layout}>
        <div className={styles.cards}>
          {copy.items.map((item) => (
            <button
              key={item.id}
              id={`principle-${item.id}`}
              type="button"
              className={styles.card}
              aria-expanded={activeId === item.id}
              aria-controls={`principle-${item.id}-detail`}
              onClick={() => setActiveId(item.id)}
            >
              <span className={styles.cardTitle}>
                <span className={styles.gradient}>{copy.prefix}</span> {item.label}.
              </span>
              <span className={styles.cardBottom}>
                <span className={styles.summary}>{item.summary}</span>
                <span className={styles.arrow}><ArrowUpRight aria-hidden="true" /></span>
              </span>
            </button>
          ))}
        </div>
        <div className={styles.details}>
          {copy.items.map((item) => (
            <div
              key={item.id}
              id={`principle-${item.id}-detail`}
              role="region"
              aria-labelledby={`principle-${item.id}`}
              className={styles.detail}
              aria-hidden={activeId !== item.id}
              inert={activeId !== item.id}
            >
              <div className={styles.detailHeading}>
                <p className={styles.eyebrow}>{copy.prefix} {item.label}</p>
                <h3>{item.heading}</h3>
              </div>
              <div className={styles.detailBody}>
                <p>{item.body}</p>
                <ul>{item.points.map((point) => <li key={point}>{point}</li>)}</ul>
                <p className={styles.note}>{item.note}</p>
              </div>
            </div>
          ))}
        </div>
        </div>
      </div>
    </section>
  );
};
