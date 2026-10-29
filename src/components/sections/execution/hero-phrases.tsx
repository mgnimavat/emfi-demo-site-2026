'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';
import { execution } from '@/content/execution';
import styles from './page.module.css';

const subscribeToHydration = () => () => {};
type Frame = { index: number; chars: number; phase: 'typing' | 'holding' | 'deleting' | 'pause' };

type ExecutionHeroPhrasesProps = {
  phrases?: readonly string[];
};

export const ExecutionHeroPhrases = ({
  phrases = execution.heroPhrases,
}: ExecutionHeroPhrasesProps) => {
  const ref = useRef<HTMLParagraphElement>(null);
  const visible = useInView(ref, { amount: 0.2 });
  const prefersReduced = useReducedMotion();
  const hydrated = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false
  );
  const reduced = Boolean(hydrated && prefersReduced);
  const [frame, setFrame] = useState<Frame>({ index: 0, chars: 5, phase: 'typing' });
  const phrase = phrases[frame.index];
  const nextIndex = (frame.index + 1) % phrases.length;
  const keep = phrase.startsWith('From ') && phrases[nextIndex].startsWith('From ') ? 5 : 0;

  useEffect(() => {
    if (!visible || reduced) return;
    const delay =
      frame.phase === 'holding'
        ? 2400
        : frame.phase === 'pause'
          ? 220
          : frame.phase === 'typing'
            ? 65
            : 40;
    const timer = window.setTimeout(() => {
      if (document.hidden) {
        setFrame({ ...frame });
        return;
      }
      if (frame.phase === 'typing')
        setFrame({
          ...frame,
          chars: frame.chars + 1,
          phase: frame.chars + 1 >= phrase.length ? 'holding' : 'typing',
        });
      else if (frame.phase === 'holding') setFrame({ ...frame, phase: 'deleting' });
      else if (frame.phase === 'deleting')
        setFrame({
          ...frame,
          chars: Math.max(keep, frame.chars - 1),
          phase: frame.chars - 1 <= keep ? 'pause' : 'deleting',
        });
      else setFrame({ index: nextIndex, chars: keep, phase: 'typing' });
    }, delay);
    return () => window.clearTimeout(timer);
  }, [frame, visible, reduced, phrase.length, keep, nextIndex]);

  return (
    <p ref={ref} className={styles.strapline}>
      <span className="sr-only">{phrases.join(' ')}</span>
      {phrases.map((text) => (
        <span key={text} aria-hidden className={styles.reserve}>
          {text}
        </span>
      ))}
      <span aria-hidden className={styles.typed} data-execution-phrase>
        {reduced ? phrases[0] : phrase.slice(0, frame.chars)}
        {!reduced ? <span className={styles.cursor} /> : null}
      </span>
    </p>
  );
};
