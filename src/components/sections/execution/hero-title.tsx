'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import { execution } from '@/content/execution';
import styles from './page.module.css';

const timing = { initialHold: 2200, hold: 1900, delete: 48, type: 82, pause: 420 };
const motionQuery = '(prefers-reduced-motion: reduce)';
const subscribeToMotion = (notify: () => void) => {
  const preference = window.matchMedia(motionQuery);
  preference.addEventListener('change', notify);
  return () => preference.removeEventListener('change', notify);
};
const getReducedMotion = () => window.matchMedia(motionQuery).matches;
const getServerMotion = () => false;
type Frame = {
  index: number;
  chars: number;
  phase: 'initial' | 'holding' | 'deleting' | 'pause' | 'typing';
};

type ExecutionHeroTitleProps = {
  headline?: string;
  prefix?: string;
  words?: readonly string[];
  taglineClassName?: string;
  headlineClassName?: string;
};

export const ExecutionHeroTitle = ({
  headline = execution.headline,
  prefix = execution.heroTitle.prefix,
  words = execution.heroTitle.words,
  taglineClassName,
  headlineClassName,
}: ExecutionHeroTitleProps) => {
  const reduced = useSyncExternalStore(subscribeToMotion, getReducedMotion, getServerMotion);
  const [frame, setFrame] = useState<Frame>({
    index: 0,
    chars: words[0].length,
    phase: 'initial',
  });
  const word = words[frame.index];

  useEffect(() => {
    if (reduced) return;

    const delay =
      frame.phase === 'initial'
        ? timing.initialHold
        : frame.phase === 'holding'
          ? timing.hold
          : frame.phase === 'pause'
            ? timing.pause
            : frame.phase === 'deleting'
              ? timing.delete
              : timing.type;
    const timer = window.setTimeout(() => {
      if (frame.phase === 'initial' || frame.phase === 'holding') {
        setFrame({ ...frame, chars: word.length - 1, phase: 'deleting' });
      } else if (frame.phase === 'deleting') {
        const chars = Math.max(0, frame.chars - 1);
        setFrame({ ...frame, chars, phase: chars === 0 ? 'pause' : 'deleting' });
      } else if (frame.phase === 'pause') {
        setFrame({ index: (frame.index + 1) % words.length, chars: 1, phase: 'typing' });
      } else {
        const chars = frame.chars + 1;
        setFrame({ ...frame, chars, phase: chars >= word.length ? 'holding' : 'typing' });
      }
    }, delay);
    return () => window.clearTimeout(timer);
  }, [frame, reduced, word.length, words.length]);

  return (
    <>
      <h1 className={`${styles.headline} ${headlineClassName ?? ''}`}>{headline}</h1>
      <p className={`${styles.strapline} ${taglineClassName ?? ''}`}>
        <span className="sr-only">{words.map((text) => `${prefix} ${text}${text.endsWith('.') ? '' : '.'}`).join(' ')}</span>
        {words.map((text) => (
          <span key={text} className={styles.reserve} aria-hidden="true">{prefix} {text}</span>
        ))}
        <span className={styles.typed} aria-hidden="true">
          {prefix}{' '}<span className={styles.typedWord}>
            <span data-execution-hero-word>{reduced ? words[0] : word.slice(0, frame.chars)}</span>
            {!reduced ? <span className={styles.cursor} /> : null}
          </span>
        </span>
      </p>
    </>
  );
};
