'use client';

import Image from 'next/image';
import { useReducedMotion, motion } from 'framer-motion';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import reveal from './ProviderCardReveal.module.css';
import styles from './WhyServicePages.module.css';

export type RelationshipCarouselItem = {
  name: string;
  body?: string;
  href?: string;
  logo?: { src: string; width: number; height: number };
};

const COLUMNS = 3;
const ROWS_PER_SLIDE = 3;
/** Same pace as the home Dependable carousel. */
const HOLD_MS = 3800;
/** Space between logo rows, in px (kept in JS so the scroll offset stays exact). */
const ROW_GAP = 16;
/** Share of a row kept in view above and below the active slide. */
const PEEK = 0.4;

const chunk = <T,>(list: readonly T[], size: number) => {
  const rows: T[][] = [];
  for (let i = 0; i < list.length; i += size) rows.push(list.slice(i, i + size));
  return rows;
};

const ProviderCard = ({ item }: { item: RelationshipCarouselItem }) => {
  const { name, body, href, logo } = item;
  const cardClassName = `${styles.provider} ${reveal.card} ${reveal.panel}`;
  const content = (
    <>
      <div className={`${styles.providerBrand} ${reveal.brand}`} data-provider={name}>
        {logo ? <Image {...logo} alt="" className={styles.providerLogo} unoptimized /> : <strong>{name}</strong>}
      </div>
      {body ? <span className={reveal.details}>{body}</span> : null}
    </>
  );

  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cardClassName}
      aria-label={`${name} (opens in a new tab)`}>
      {content}
    </a>
  ) : (
    <div className={cardClassName} tabIndex={body ? 0 : undefined}>{content}</div>
  );
};

/**
 * Logo carousel for the Dependable "Regulated. Audited. Connected." band.
 * Each slide is three rows of three logos (nine at a time). The previous and next slides stay partly in view.
 */
export const RelationshipCarousel = ({ items }: { items: readonly RelationshipCarouselItem[] }) => {
  const reduceMotion = useReducedMotion();
  const viewportRef = useRef<HTMLDivElement>(null);
  const rows = useMemo(() => chunk(items, COLUMNS), [items]);
  const count = rows.length;
  const loop = useMemo(() => [...rows, ...rows, ...rows, ...rows], [rows]);
  const [rowHeight, setRowHeight] = useState(0);
  /* Index of the first visible row, inside the middle copy of the loop. */
  const [pos, setPos] = useState(count);
  const [instant, setInstant] = useState(false);
  const [paused, setPaused] = useState(false);

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const measure = () => {
      const row = viewport.querySelector<HTMLElement>('[data-carousel-row]');
      const next = row?.offsetHeight ?? 0;
      if (next > 0) setRowHeight((current) => (current === next ? current : next));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (paused || count < ROWS_PER_SLIDE) return;
    const id = window.setInterval(() => setPos((current) => current + ROWS_PER_SLIDE), HOLD_MS);
    return () => window.clearInterval(id);
  }, [paused, count]);

  /* Once past the middle copy, snap back by one copy so the loop never runs out (four copies leave room for the three-row window and its peek). */
  useEffect(() => {
    if (pos < count * 2) return;
    const timeout = window.setTimeout(() => {
      setInstant(true);
      setPos((current) => current - count);
    }, reduceMotion ? 0 : 720);
    return () => window.clearTimeout(timeout);
  }, [pos, count, reduceMotion]);

  useEffect(() => {
    if (!instant) return;
    const id = window.requestAnimationFrame(() => setInstant(false));
    return () => window.cancelAnimationFrame(id);
  }, [instant, pos]);

  const peek = Math.round(rowHeight * PEEK);
  const viewportHeight = rowHeight > 0
    ? rowHeight * ROWS_PER_SLIDE + ROW_GAP * ROWS_PER_SLIDE + peek * 2 + ROW_GAP
    : undefined;
  const y = rowHeight > 0 ? -(pos * (rowHeight + ROW_GAP)) + peek + ROW_GAP : 0;

  return (
    <div
      className={styles.relationshipCarousel}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <svg className={styles.logoFilter} aria-hidden="true" focusable="false">
        <defs>
          <filter id="why-relationship-navy" colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -.6378 -2.1456 -.2166 0 3" />
            <feComposite in2="SourceAlpha" operator="in" result="ink" />
            <feFlood floodColor="var(--text-primary, #071832)" />
            <feComposite in2="ink" operator="in" />
          </filter>
        </defs>
      </svg>
      <div
        ref={viewportRef}
        className={styles.relationshipCarouselViewport}
        style={viewportHeight ? { height: viewportHeight } : undefined}
      >
        <motion.ul
          className={styles.relationshipCarouselTrack}
          role="list"
          style={{ gap: ROW_GAP }}
          animate={{ y }}
          transition={instant || reduceMotion ? { duration: 0 } : { duration: 0.68, ease: [0.22, 1, 0.36, 1] }}
        >
          {loop.map((row, i) => {
            const offset = i - pos;
            const active = offset >= 0 && offset < ROWS_PER_SLIDE;
            return (
              <li
                key={`${row[0].name}-${i}`}
                className={styles.relationshipCarouselRow}
                data-carousel-row=""
                data-active={active ? 'true' : 'false'}
                aria-hidden={active ? undefined : true}
                inert={!active}
              >
                {row.map((item) => (
                  <div key={item.name} className={styles.providerItem}>
                    <ProviderCard item={item} />
                  </div>
                ))}
              </li>
            );
          })}
        </motion.ul>
      </div>
    </div>
  );
};
