'use client';

import { useRef, useState } from 'react';
import { useAnimationFrame, useInView, useReducedMotion } from 'framer-motion';
import { ArrowRight, Check, Clock3, Link2, Unlink, X } from 'lucide-react';
import type { SettlementCopy } from '@/lib/i18n/service-dictionaries';
import styles from './SettlementLinkedAnimation.module.css';

type SettlementPanel = SettlementCopy['serviceSections'][number]['panels'][number];
type LinkedCopy = SettlementCopy['linkedAnimation'];
type InstructionState = keyof LinkedCopy['states'];
const timing = { cycle: 9000, settle: 2000, attempt: 3200, outcome: 6200 } as const;

const Instruction = ({ instruction, buy, state, copy }: {
  instruction: string; buy: boolean; state: InstructionState; copy: LinkedCopy;
}) => {
  const separator = instruction.indexOf(':');
  const label = separator < 0 ? instruction : instruction.slice(0, separator);
  const StatusIcon = state === 'settled' || state === 'available' ? Check : state === 'failed' ? X : Clock3;

  return (
    <div className={styles.instruction} data-instruction={buy ? 'buy' : 'sell'} data-state={state}>
      <span className={styles.statusIcon}><StatusIcon size={24} aria-hidden="true" /></span>
      <span className={styles.instructionLabel}>{label}</span>
      <span className={styles.status}>{copy.states[state]}</span>
    </div>
  );
};

export const SettlementLinkedAnimation = ({ panels, copy }: {
  panels: SettlementPanel[]; copy: LinkedCopy;
}) => {
  const stage = useRef<HTMLDivElement>(null);
  const elapsed = useRef(0);
  const lastPhase = useRef(0);
  const [phase, setPhase] = useState(0);
  const visible = useInView(stage, { amount: 0.2 });
  const reducedMotion = useReducedMotion();
  const activePhase = reducedMotion ? 3 : phase;

  useAnimationFrame((_time, delta) => {
    if (!visible || reducedMotion || document.hidden) return;
    elapsed.current = (elapsed.current + Math.min(delta, 64)) % timing.cycle;
    const nextPhase = elapsed.current >= timing.outcome ? 3 : elapsed.current >= timing.attempt ? 2
      : elapsed.current >= timing.settle ? 1 : 0;
    if (lastPhase.current !== nextPhase) {
      lastPhase.current = nextPhase;
      setPhase(nextPhase);
    }
  });

  return (
    <div ref={stage} className={styles.stage} data-running={visible && !reducedMotion} data-phase={activePhase}>
      {panels.map((panel) => {
        const linked = panel.id === 'linked';
        const ConnectionIcon = linked ? Link2 : Unlink;
        const buyState: InstructionState = linked && activePhase >= 1 ? 'settled' : 'pending';
        const sellState: InstructionState = activePhase >= 3 ? (linked ? 'available' : 'failed')
          : activePhase >= 2 ? 'attempting' : 'waiting';

        return (
          <figure key={panel.id} className={styles.panel} data-linked={linked}>
            <h3>{panel.title}</h3>
            <div className={styles.scene}>
              <div className={styles.travelLane} aria-hidden="true">
                <span className={styles.travelProgress} />
                <span className={styles.tradeMarker}><ArrowRight size={18} /></span>
                <span className={styles.barrier}><X size={16} /></span>
              </div>
              {panel.steps.map((step, index) => (
                <div key={step} className={styles.instructionSlot}>
                  {index > 0 ? (
                    <span className={styles.connection} aria-hidden="true">
                      <span className={styles.connectionLine} />
                      <span className={styles.connectionIcon}><ConnectionIcon size={20} /></span>
                    </span>
                  ) : null}
                  <Instruction instruction={step} buy={index === 0} copy={copy}
                    state={index === 0 ? buyState : sellState} />
                </div>
              ))}
            </div>
            <figcaption>{panel.body}</figcaption>
          </figure>
        );
      })}
    </div>
  );
};
