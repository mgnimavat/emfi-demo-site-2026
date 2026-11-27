'use client';

import { useId, useRef, useState, useSyncExternalStore } from 'react';
import { useAnimationFrame, useInView } from 'framer-motion';
import { CircleCheck, Link2, TriangleAlert, Unlink } from 'lucide-react';
import type { SettlementCopy } from '@/lib/i18n/service-dictionaries';
import {
  getLinkedSettlementComparisonFrame,
  getLinkedSettlementStoryProgress,
  getLinkedSettlementTradeFill,
  linkedSettlementOutcome,
  linkedSettlementTiming,
} from '@/lib/settlement-linked-animation';
import styles from './SettlementLinkedAnimation.module.css';

type SettlementPanel = SettlementCopy['serviceSections'][number]['panels'][number];
type LinkedCopy = SettlementCopy['linkedAnimation'];
type ComparisonFrame = ReturnType<typeof getLinkedSettlementComparisonFrame>;

const TradeCard = ({ trade, state, copy }: {
  trade: 'buy' | 'sell'; state: keyof LinkedCopy['states']; copy: LinkedCopy;
}) => (
  <div className={styles.tradeCard} data-trade={trade} data-trade-state={state}>
    <strong>{copy[trade]}</strong>
    <span className={styles.tradeState}>{copy.states[state]}</span>
  </div>
);

const TradeCards = ({ copy, linked, buy, sell }: Pick<ComparisonFrame, 'linked' | 'buy' | 'sell'> & {
  copy: LinkedCopy;
}) => {
  const buyState = linked && sell === 'settling' ? 'settling' : buy;

  return (
    <div className={styles.tradeCards} role="group" aria-label={copy.label}>
      <TradeCard trade="sell" state={sell} copy={copy} />
      <TradeCard trade="buy" state={buyState} copy={copy} />
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
const storyPlaybackRate = 1.5;
const reducedMotionQuery = '(prefers-reduced-motion: reduce)';
const subscribeToReducedMotion = (onChange: () => void) => {
  const media = window.matchMedia(reducedMotionQuery);
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
};
const getReducedMotion = () => window.matchMedia(reducedMotionQuery).matches;
const getServerReducedMotion = () => false;

export const SettlementLinkedAnimation = ({ panels, copy, layout = 'horizontal', tradeCards = false }: {
  panels: SettlementPanel[]; copy: LinkedCopy; layout?: 'horizontal' | 'vertical'; tradeCards?: boolean;
}) => {
  const headingId = useId();
  const stage = useRef<HTMLElement>(null);
  const elapsed = useRef(0);
  const [frame, setFrame] = useState(initialFrame);
  const visible = useInView(stage, { amount: 0.25 });
  const reducedMotion = useSyncExternalStore(subscribeToReducedMotion, getReducedMotion, getServerReducedMotion);
  const linked = (reducedMotion && !tradeCards) || frame.linked;
  const { buy, sell } = reducedMotion ? linkedSettlementOutcome[linked ? 'linked' : 'unlinked'] : frame;
  const unlinkedPanel = panels.find((panel) => panel.id === 'unlinked');
  const linkedPanel = panels.find((panel) => panel.id === 'linked');
  const panel = linked ? linkedPanel : unlinkedPanel;
  const ConnectionIcon = linked ? Link2 : Unlink;
  const activeStep = sell === 'pending' ? 0 : sell === 'settling' ? 1 : 2;
  const flowStep = !linked && sell === 'failed'
    ? copy.fundingInterest
    : copy.story[linked ? 'linked' : 'unlinked'][activeStep];

  const paintTradeFill = (time: number, next: ComparisonFrame) => {
    const fill = getLinkedSettlementTradeFill(time, next);
    stage.current?.style.setProperty('--buy-fill', String(fill.buy));
    stage.current?.style.setProperty('--sell-fill', String(fill.sell));
  };

  const selectScenario = (nextLinked: boolean) => {
    elapsed.current = nextLinked ? linkedSettlementTiming.cycle : 0;
    const next = getLinkedSettlementComparisonFrame(elapsed.current);
    paintTradeFill(elapsed.current, next);
    setFrame(next);
  };

  useAnimationFrame((_time, delta) => {
    if (!visible || reducedMotion || document.hidden) return;
    elapsed.current += Math.min(delta, 64) * storyPlaybackRate;
    const next = getLinkedSettlementComparisonFrame(elapsed.current);
    if (tradeCards) {
      paintTradeFill(elapsed.current, next);
    } else {
      stage.current?.style.setProperty('--step-progress', `${getLinkedSettlementStoryProgress(elapsed.current)}`);
    }
    if (next.linked !== frame.linked || next.sell !== frame.sell || (tradeCards && next.buy !== frame.buy)) {
      setFrame(next);
    }
  });

  if (!panel) return null;

  return (
    <figure ref={stage} className={styles.stage} aria-labelledby={headingId}
      data-linked={linked} data-sell-state={sell} data-layout={layout} data-trade-cards={tradeCards || undefined}>
      <h3 id={headingId} className={styles.title}>
        <ConnectionIcon size={17} aria-hidden="true" />
        {panel.title}
      </h3>
      {tradeCards ? (
        <>
          <TradeCards copy={copy} linked={linked} buy={buy} sell={sell} />
          <div className={styles.flowCopy}>
            <strong>{flowStep?.title}</strong>
            <p>{flowStep?.body}</p>
          </div>
        </>
      ) : <SettlementStory steps={linked ? copy.story.linked : copy.story.unlinked} activeStep={activeStep} />}
      <figcaption className={styles.caption}>
        {panels.map((scenario) => {
          const CaptionIcon = scenario.id === 'linked' ? CircleCheck : TriangleAlert;
          const summary = scenario.id === 'linked' ? copy.storySummary.linked : copy.storySummary.unlinked;
          if (tradeCards) return (
            <button key={scenario.id} type="button" className={styles.scenarioButton}
              data-scenario={scenario.id} aria-pressed={scenario.id === panel.id}
              onClick={() => selectScenario(scenario.id === 'linked')}>
              <CaptionIcon size={17} aria-hidden="true" />{scenario.title}
            </button>
          );
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
