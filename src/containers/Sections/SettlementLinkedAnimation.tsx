'use client';

import { useRef } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';
import { Check, Clock3, Link2, LockKeyhole, Unlink } from 'lucide-react';
import type { SettlementCopy } from '@/lib/i18n/service-dictionaries';
import styles from './SettlementLinkedAnimation.module.css';

type SettlementPanel = SettlementCopy['serviceSections'][number]['panels'][number];

const Instruction = ({ instruction, buy, linked }: {
  instruction: string; buy: boolean; linked: boolean;
}) => {
  const separator = instruction.indexOf(':');
  const label = separator < 0 ? instruction : instruction.slice(0, separator);
  const status = separator < 0 ? '' : instruction.slice(separator + 1).trim();
  const StatusIcon = buy ? (linked ? LockKeyhole : Check) : Clock3;

  return (
    <div className={styles.instruction} data-instruction={buy ? 'buy' : 'sell'}>
      <span className={styles.statusIcon}><StatusIcon size={24} aria-hidden="true" /></span>
      <span className={styles.instructionLabel}>{label}</span>
      <span className={styles.status}>{status}</span>
    </div>
  );
};

export const SettlementLinkedAnimation = ({ panels }: { panels: SettlementPanel[] }) => {
  const stage = useRef<HTMLDivElement>(null);
  const visible = useInView(stage, { amount: 0.2 });
  const reducedMotion = useReducedMotion();

  return (
    <div ref={stage} className={styles.stage} data-running={visible && !reducedMotion}>
      {panels.map((panel) => {
        const linked = panel.id === 'linked';
        const ConnectionIcon = linked ? Link2 : Unlink;

        return (
          <figure key={panel.id} className={styles.panel} data-linked={linked}>
            <h3>{panel.title}</h3>
            <div className={styles.scene}>
              {panel.steps.map((step, index) => (
                <div key={step} className={styles.instructionSlot}>
                  {index > 0 ? (
                    <span className={styles.connection} aria-hidden="true">
                      <span className={styles.connectionLine} />
                      <span className={styles.connectionIcon}><ConnectionIcon size={20} /></span>
                    </span>
                  ) : null}
                  <Instruction instruction={step} buy={index === 0} linked={linked} />
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
