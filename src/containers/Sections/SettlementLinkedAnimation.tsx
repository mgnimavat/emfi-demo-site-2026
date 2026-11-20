'use client';

import { useId, useRef, useState, useSyncExternalStore } from 'react';
import { useAnimationFrame, useInView } from 'framer-motion';
import { CircleCheck, Link2, TriangleAlert, Unlink } from 'lucide-react';
import type { SettlementCopy } from '@/lib/i18n/service-dictionaries';
import {
  getLinkedSettlementComparisonFrame,
  getLinkedSettlementStoryProgress,
  linkedSettlementOutcome,
} from '@/lib/settlement-linked-animation';
import styles from './SettlementLinkedAnimation.module.css';

type SettlementPanel = SettlementCopy['serviceSections'][number]['panels'][number];
type LinkedCopy = SettlementCopy['linkedAnimation'];
const SettlementStory = ({ steps, activeStep }: {
  steps: LinkedCopy['story']['linked']; activeStep: number;
}) => (
  <ol className={styles.story} role="list">
    {steps.map((step, index) => (
      <li key={step.id} className={styles.storyStep} data-step={step.id}
        data-complete={index < activeStep} aria-current={index === activeStep ? 'step' : undefined}>
        <span className={styles.stepNumber} aria-hidden="true">{index + 1}</span>
        <div className={styles.stepCopy}>
          <strong>{step.title}</strong>
          <p>{step.body}</p>
        </div>
      </li>
    ))}
  </ol>
);

const initialFrame = getLinkedSettlementComparisonFrame(0);
const storyPlaybackRate = 0.75;
const reducedMotionQuery = '(prefers-reduced-motion: reduce)';
const subscribeToReducedMotion = (onChange: () => void) => {
  const media = window.matchMedia(reducedMotionQuery);
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
};
const getReducedMotion = () => window.matchMedia(reducedMotionQuery).matches;
const getServerReducedMotion = () => false;

export const SettlementLinkedAnimation = ({ panels, copy, layout = 'horizontal' }: {
  panels: SettlementPanel[]; copy: LinkedCopy; layout?: 'horizontal' | 'vertical';
}) => {
  const headingId = useId();
  const stage = useRef<HTMLElement>(null);
  const elapsed = useRef(0);
  const [frame, setFrame] = useState(initialFrame);
  const visible = useInView(stage, { amount: 0.25 });
  const reducedMotion = useSyncExternalStore(subscribeToReducedMotion, getReducedMotion, getServerReducedMotion);
  const linked = reducedMotion || frame.linked;
  const sell = reducedMotion ? linkedSettlementOutcome.linked.sell : frame.sell;
  const unlinkedPanel = panels.find((panel) => panel.id === 'unlinked');
  const linkedPanel = panels.find((panel) => panel.id === 'linked');
  const panel = linked ? linkedPanel : unlinkedPanel;
  const ConnectionIcon = linked ? Link2 : Unlink;
  const activeStep = sell === 'pending' ? 0 : sell === 'settling' ? 1 : 2;

  useAnimationFrame((_time, delta) => {
    if (!visible || reducedMotion || document.hidden) return;
    elapsed.current += Math.min(delta, 64) * storyPlaybackRate;
    const next = getLinkedSettlementComparisonFrame(elapsed.current);
    stage.current?.style.setProperty('--step-progress', `${getLinkedSettlementStoryProgress(elapsed.current)}`);
    if (next.linked !== frame.linked || next.sell !== frame.sell) {
      setFrame(next);
    }
  });

  if (!panel) return null;

  return (
    <figure ref={stage} className={styles.stage} aria-labelledby={headingId}
      data-linked={linked} data-sell-state={sell} data-layout={layout}>
      <h3 id={headingId} className={styles.title}>
        <ConnectionIcon size={17} aria-hidden="true" />
        {panel.title}
      </h3>
      <SettlementStory steps={linked ? copy.story.linked : copy.story.unlinked} activeStep={activeStep} />
      <figcaption className={styles.caption}>
        {panels.map((scenario) => {
          const CaptionIcon = scenario.id === 'linked' ? CircleCheck : TriangleAlert;
          const summary = scenario.id === 'linked' ? copy.storySummary.linked : copy.storySummary.unlinked;
          return (
            <div key={scenario.id} className={styles.outcome} data-scenario={scenario.id}
              aria-current={!reducedMotion && scenario.id === panel.id ? 'true' : undefined}>
              <CaptionIcon size={20} aria-hidden="true" />
              <div>
                <strong>{scenario.title}</strong>
                <p>{summary}</p>
              </div>
            </div>
          );
        })}
      </figcaption>
    </figure>
  );
};
