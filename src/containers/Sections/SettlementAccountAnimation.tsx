'use client';

import { useLayoutEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from 'react';
import { useAnimationFrame, useInView } from 'framer-motion';
import { ArrowRight, ArrowRightLeft, Check, LockKeyhole, TriangleAlert } from 'lucide-react';
import type { SettlementCopy } from '@/lib/i18n/service-dictionaries';
import {
  getSettlementChapterFrame,
  nextSettlementChapter,
  settlementChapterDuration,
  type SettlementChapter,
} from '@/lib/settlement-account-animation';
import styles from './SettlementAccountAnimation.module.css';

type AnimationCopy = SettlementCopy['accountAnimation'];
type Frame = ReturnType<typeof getSettlementChapterFrame>;

const sharedDelivery = { own: 70, cross: 30 };
const sharedDeliveryStyle = {
  '--own-share': sharedDelivery.own / (sharedDelivery.own + sharedDelivery.cross),
} as CSSProperties;

const reducedMotionQuery = '(prefers-reduced-motion: reduce)';
const subscribeToReducedMotion = (onChange: () => void) => {
  const media = window.matchMedia(reducedMotionQuery);
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
};
const getReducedMotion = () => window.matchMedia(reducedMotionQuery).matches;
const getServerReducedMotion = () => false;

const paintTiles = (board: HTMLDivElement | null, frame: Frame) => {
  if (!board) return;
  board.style.setProperty('--first-tile', frame.firstTile.toFixed(4));
  board.style.setProperty('--second-tile', frame.secondTile.toFixed(4));
};

interface AccountCardProps {
  side: 'source' | 'target';
  tone?: 'navy';
  title: string;
  children: ReactNode;
}

const AccountCard = ({ side, tone, title, children }: AccountCardProps) => (
  <div className={styles.card} data-side={side} data-tone={tone}>
    <div className={styles.cardTitle}>{title}</div>
    {children}
  </div>
);

const Slot = ({ children, wide = false }: { children?: ReactNode; wide?: boolean }) => (
  <div className={styles.slot} data-wide={wide}>{children}</div>
);

const SecurityTile = ({ label, amount, tone, locked }: {
  label: string; amount?: number; tone?: 'navy' | 'warning'; locked?: boolean;
}) => (
  <div className={styles.tile} data-tone={tone}>
    {locked && <LockKeyhole size={13} aria-hidden="true" />}
    <span>{label}</span>
    {amount !== undefined && <b>{amount}</b>}
  </div>
);

const Bridge = ({ warning = false }: { warning?: boolean }) => (
  <div className={styles.bridge} data-warning={warning} aria-hidden="true">
    <ArrowRight size={15} />
  </div>
);

const SharedScene = ({ copy, crossUse }: { copy: AnimationCopy; crossUse: boolean }) => (
  <>
    <AccountCard side="source" title={copy.pool}>
      <Slot />
      <Slot />
    </AccountCard>
    <AccountCard side="target" title={copy.delivery}>
      <Slot />
      <Slot />
    </AccountCard>
    <Bridge warning={crossUse} />
    <div className={styles.track} data-track="own">
      <SecurityTile label={copy.clientB} amount={sharedDelivery.own} />
    </div>
    <div className={styles.track} data-track="cross">
      <SecurityTile label={copy.clientA} amount={sharedDelivery.cross} tone={crossUse ? 'warning' : 'navy'} />
    </div>
  </>
);

const DedicatedScene = ({ copy }: { copy: AnimationCopy }) => (
  <>
    <AccountCard side="source" tone="navy" title={copy.accountA}>
      <Slot wide><SecurityTile label={copy.securities} locked /></Slot>
    </AccountCard>
    <AccountCard side="target" title={copy.accountB}>
      <Slot wide><SecurityTile label={copy.securities} locked /></Slot>
    </AccountCard>
    <div className={styles.barrier} aria-hidden="true"><LockKeyhole size={17} /></div>
  </>
);

const describeFrame = (chapter: SettlementChapter, { phase, delivered, crossUse }: Frame) =>
  ({ chapter, phase, delivered, crossUse });

export const SettlementAccountAnimation = ({ copy }: { copy: AnimationCopy }) => {
  const reducedMotion = useSyncExternalStore(subscribeToReducedMotion, getReducedMotion, getServerReducedMotion);
  const stage = useRef<HTMLDivElement>(null);
  const board = useRef<HTMLDivElement>(null);
  const elapsed = useRef(0);
  const [scene, setScene] = useState(() => describeFrame('shared', getSettlementChapterFrame('shared', 0)));
  const visible = useInView(stage, { amount: 0.25 });
  const chapter = reducedMotion ? 'shared' : scene.chapter;
  const duration = settlementChapterDuration(chapter);
  const { phase, delivered, crossUse } = reducedMotion ? getSettlementChapterFrame(chapter, duration) : scene;
  const running = visible && !reducedMotion;
  const caption = chapter === 'shared' ? copy.sharedCaption : copy.dedicatedCaption;
  const captionTone = crossUse ? 'warning' : delivered ? 'complete' : undefined;
  const CaptionIcon = crossUse ? TriangleAlert : delivered ? Check : ArrowRightLeft;

  useLayoutEffect(() => {
    paintTiles(board.current, getSettlementChapterFrame(chapter, reducedMotion ? duration : elapsed.current));
  }, [chapter, duration, reducedMotion, scene]);

  useAnimationFrame((_time, delta) => {
    if (!running || document.hidden) return;

    elapsed.current += Math.min(delta, 64);
    if (elapsed.current >= duration) {
      const next = nextSettlementChapter(chapter);
      elapsed.current = 0;
      setScene(describeFrame(next, getSettlementChapterFrame(next, 0)));
      return;
    }

    const frame = getSettlementChapterFrame(chapter, elapsed.current);
    paintTiles(board.current, frame);
    if (scene.phase !== frame.phase || scene.delivered !== frame.delivered || scene.crossUse !== frame.crossUse) {
      setScene(describeFrame(chapter, frame));
    }
  });

  return (
    <div ref={stage} className={styles.stage} data-phase={phase} data-chapter={chapter}
      data-running={running} data-settled={delivered} data-cross-use={crossUse}>
      <figure className={styles.figure}>
        <div ref={board} className={styles.board} data-scene={chapter}
          style={chapter === 'shared' ? sharedDeliveryStyle : undefined}>
          {chapter === 'shared' && <SharedScene copy={copy} crossUse={crossUse} />}
          {chapter === 'separate' && <DedicatedScene copy={copy} />}
        </div>
        <figcaption className={styles.caption} data-tone={captionTone}>
          <CaptionIcon size={15} aria-hidden="true" />
          <span>{caption}</span>
        </figcaption>
      </figure>
      {reducedMotion && (
        <figure className={styles.figure}>
          <div className={styles.board} data-scene="separate"><DedicatedScene copy={copy} /></div>
          <figcaption className={styles.caption} data-tone="complete">
            <Check size={15} aria-hidden="true" />
            <span>{copy.dedicatedCaption}</span>
          </figcaption>
        </figure>
      )}
    </div>
  );
};
