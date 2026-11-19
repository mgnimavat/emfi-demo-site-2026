'use client';

import { useId, useRef, useState } from 'react';
import { useAnimationFrame, useInView, useReducedMotion } from 'framer-motion';
import { ArrowRight, Check, CircleCheck, Clock3, Link2, Pause, TriangleAlert, Unlink, X } from 'lucide-react';
import type { SettlementCopy } from '@/lib/i18n/service-dictionaries';
import {
  getLinkedSettlementComparisonFrame,
  linkedSettlementOutcome,
} from '@/lib/settlement-linked-animation';
import styles from './SettlementLinkedAnimation.module.css';

type SettlementPanel = SettlementCopy['serviceSections'][number]['panels'][number];
type LinkedCopy = SettlementCopy['linkedAnimation'];
type InstructionState = keyof LinkedCopy['states'];

const Instruction = ({ label, side, state, copy, exposure = false }: {
  label: string; side: 'buy' | 'sell'; state: InstructionState; copy: LinkedCopy; exposure?: boolean;
}) => {
  const StatusIcon = state === 'settled' ? Check : state === 'failed' ? X : state === 'held' ? Pause : Clock3;

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

const initialFrame = getLinkedSettlementComparisonFrame(0);

export const SettlementLinkedAnimation = ({ panels, copy }: {
  panels: SettlementPanel[]; copy: LinkedCopy;
}) => {
  const headingId = useId();
  const stage = useRef<HTMLElement>(null);
  const connection = useRef<HTMLDivElement>(null);
  const elapsed = useRef(0);
  const [frame, setFrame] = useState(initialFrame);
  const visible = useInView(stage, { amount: 0.25 });
  const reducedMotion = useReducedMotion();
  const linked = Boolean(reducedMotion) || frame.linked;
  const { buy, sell } = reducedMotion ? linkedSettlementOutcome.linked : frame;
  const financingExposure = !linked && buy === 'settled' && sell !== 'settled';
  const unlinkedPanel = panels.find((panel) => panel.id === 'unlinked');
  const linkedPanel = panels.find((panel) => panel.id === 'linked');
  const panel = linked ? linkedPanel : unlinkedPanel;
  const ConnectionIcon = linked ? Link2 : Unlink;
  const TravelIcon = sell === 'failed' ? X : sell === 'settled' ? Check : ArrowRight;

  useAnimationFrame((_time, delta) => {
    if (!visible || reducedMotion || document.hidden) return;
    elapsed.current += Math.min(delta, 64);
    const next = getLinkedSettlementComparisonFrame(elapsed.current);
    connection.current?.style.setProperty('--travel-position', `${next.progress * 100}%`);
    if (next.linked !== frame.linked || next.buy !== frame.buy || next.sell !== frame.sell) {
      setFrame(next);
    }
  });

  if (!panel) return null;

  return (
    <figure ref={stage} className={styles.stage} aria-labelledby={headingId}
      data-linked={linked} data-sell-state={sell}>
      <h3 id={headingId} className={styles.title}>{panel.title}</h3>
      <div className={styles.scene}>
        <Instruction label={panel.steps[0] ?? copy.buy} side="buy" state={buy} copy={copy}
          exposure={financingExposure} />
        <div ref={connection} className={styles.connection} aria-hidden="true">
          <span className={styles.connectionLine} />
          <span className={styles.connectionProgress} />
          <span className={styles.connectionIcon}><ConnectionIcon size={18} /></span>
          <span className={styles.tradeMarker}><TravelIcon size={16} /></span>
        </div>
        <Instruction label={panel.steps[1] ?? copy.sell} side="sell" state={sell} copy={copy} />
      </div>
      <figcaption className={styles.caption}>
        {panels.map((scenario) => {
          const CaptionIcon = scenario.id === 'linked' ? CircleCheck : TriangleAlert;
          return (
            <div key={scenario.id} className={styles.outcome} data-scenario={scenario.id}
              aria-current={!reducedMotion && scenario.id === panel.id ? 'true' : undefined}>
              <CaptionIcon size={20} aria-hidden="true" />
              <div>
                <strong>{scenario.title}</strong>
                <p>{scenario.body}</p>
              </div>
            </div>
          );
        })}
      </figcaption>
    </figure>
  );
};
