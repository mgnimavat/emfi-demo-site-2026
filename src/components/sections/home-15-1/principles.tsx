'use client';

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { principles as copy } from '@/content/home-15-1-principles';
import styles from './principles.module.css';

type PrincipleId = (typeof copy.items)[number]['id'];

export const PrinciplesSection = () => {
  const [activeId, setActiveId] = useState<PrincipleId | null>(null);

  return (
    <section className={styles.section} aria-labelledby="home-15-1-principles-heading">
      <div className={styles.container}>
        <h2 id="home-15-1-principles-heading" className={styles.title}>
          {copy.title} <span className={styles.emphasis}>{copy.accent}</span>
        </h2>
        <div className={styles.accordion}>
          {copy.items.map((item) => {
            const active = activeId === item.id;
            return (
              <div key={item.id} className={styles.item} data-active={active}>
                <h3 className={styles.itemHeading}>
                  <button
                    id={`principle-${item.id}`}
                    type="button"
                    className={styles.trigger}
                    aria-expanded={active}
                    aria-controls={`principle-${item.id}-detail`}
                    onClick={() => setActiveId((current) => current === item.id ? null : item.id)}
                  >
                    <span className={styles.cardTitle}>
                      <span className={styles.emphasis}>{copy.prefix}</span> {item.label}.
                    </span>
                    <span className={styles.summary}>{item.summary}</span>
                    <span className={styles.toggle}><ArrowRight aria-hidden="true" /></span>
                  </button>
                </h3>
                <div
                  id={`principle-${item.id}-detail`}
                  role="region"
                  aria-labelledby={`principle-${item.id}`}
                  className={styles.detail}
                  hidden={!active}
                >
                  <h4 className={styles.detailTitle}>{item.heading}</h4>
                  <div className={styles.detailBody}>
                    <p>{item.body}</p>
                    <ul>{item.points.map((point) => <li key={point}>{point}</li>)}</ul>
                    <p className={styles.note}>{item.note}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
