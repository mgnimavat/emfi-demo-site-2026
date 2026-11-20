'use client';

import { useId, useRef, useState, useSyncExternalStore } from 'react';
import { useAnimationFrame, useInView, useReducedMotion } from 'framer-motion';
import { ArrowRight, Check, CircleCheck, Clock3, Link2, Pause, TriangleAlert, Unlink, X } from 'lucide-react';
import type { SettlementCopy } from '@/lib/i18n/service-dictionaries';
import {
  getLinkedSettlementComparisonFrame,
  getLinkedSettlementStoryProgress,
  linkedSettlementOutcome,
} from '@/lib/settlement-linked-animation';
import styles from './SettlementLinkedAnimation.module.css';

type SettlementPanel = SettlementCopy['serviceSections'][number]['panels'][number];
type LinkedCopy = SettlementCopy['linkedAnimation'];
type InstructionState = keyof LinkedCopy['states'];
type TradeSide = 'buy' | 'sell';
const instructionIcons = { pending: Clock3, held: Pause, settling: ArrowRight, settled: Check, failed: X };

const Instruction = ({ label, side, state, copy, exposure = false }: {
  label: string; side: TradeSide; state: InstructionState; copy: LinkedCopy; exposure?: boolean;
}) => {
  const StatusIcon = state === 'settling' ? Clock3 : instructionIcons[state];

  return (
    <div className={styles.instruction} data-instruction={side} data-state={state}>
      <span className={styles.statusIcon}><StatusIcon key={state} size={22} aria-hidden="true" /></span>
      <div className={styles.instructionCopy}>
        <span className={styles.instructionLabel}>{label}</span>
        <span className={styles.status}>{copy.states[state]}</span>
        {exposure ? (
          <span className={styles.exposure}>
            <TriangleAlert size={14} aria-hidden="true" />
            {copy.exposure}
          </span>
        ) : null}
      </div>
    </div>
  );
};

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
const subscribeToHydration = () => () => {};

export const SettlementLinkedAnimation = ({ panels, copy, track = false }: {
  panels: SettlementPanel[]; copy: LinkedCopy; track?: boolean;
}) => {
  const headingId = useId();
  const stage = useRef<HTMLElement>(null);
  const connection = useRef<HTMLDivElement>(null);
  const elapsed = useRef(0);
  const [frame, setFrame] = useState(initialFrame);
  const visible = useInView(stage, { amount: 0.25 });
  const reducedMotionPreference = useReducedMotion();
  const hydrated = useSyncExternalStore(subscribeToHydration, () => true, () => false);
  const reducedMotion = hydrated && Boolean(reducedMotionPreference);
  const linked = reducedMotion || frame.linked;
  const { buy, sell } = reducedMotion ? linkedSettlementOutcome.linked : frame;
  const financingExposure = !linked && buy === 'settled' && sell !== 'settled';
  const unlinkedPanel = panels.find((panel) => panel.id === 'unlinked');
  const linkedPanel = panels.find((panel) => panel.id === 'linked');
  const panel = linked ? linkedPanel : unlinkedPanel;
  const ConnectionIcon = linked ? Link2 : Unlink;
  const TravelIcon = sell === 'failed' ? X : sell === 'settled' ? Check : ArrowRight;
  const activeStep = sell === 'pending' ? 0 : sell === 'settling' ? 1 : 2;

  useAnimationFrame((_time, delta) => {
    if (!visible || reducedMotion || document.hidden) return;
    elapsed.current += Math.min(delta, 64) * (track ? storyPlaybackRate : 1);
    const next = getLinkedSettlementComparisonFrame(elapsed.current);
    if (track) {
      stage.current?.style.setProperty('--step-progress', `${getLinkedSettlementStoryProgress(elapsed.current)}`);
    } else {
      connection.current?.style.setProperty('--travel-position', `${next.progress * 100}%`);
    }
    if (next.linked !== frame.linked || next.buy !== frame.buy || next.sell !== frame.sell) {
      setFrame(next);
    }
  });

  if (!panel) return null;
  const buyLabel = panel.steps[0] ?? copy.buy;
  const sellLabel = panel.steps[1] ?? copy.sell;

  return (
    <figure ref={stage} className={styles.stage} aria-labelledby={headingId}
      data-linked={linked} data-sell-state={sell} data-track={track}>
      <h3 id={headingId} className={styles.title}>
        {track && <ConnectionIcon size={17} aria-hidden="true" />}
        {panel.title}
      </h3>
      {track ? (
        <SettlementStory steps={linked ? copy.story.linked : copy.story.unlinked} activeStep={activeStep} />
      ) : (
        <div className={styles.scene}>
          <Instruction label={buyLabel} side="buy" state={buy} copy={copy} exposure={financingExposure} />
          <div ref={connection} className={styles.connection} aria-hidden="true">
            <span className={styles.connectionLine} />
            <span className={styles.connectionProgress} />
            <span className={styles.connectionIcon}><ConnectionIcon size={18} /></span>
            <span className={styles.tradeMarker}><TravelIcon size={16} /></span>
          </div>
          <Instruction label={sellLabel} side="sell" state={sell} copy={copy} />
        </div>
      )}
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
                <p>{track ? summary : scenario.body}</p>
              </div>
            </div>
          );
        })}
      </figcaption>
    </figure>
  );
};
