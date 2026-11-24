'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';
import {
  Check,
  FileImage,
  FileUp,
  MousePointer2,
  ScanText,
} from 'lucide-react';
import type { SettlementCopy } from '@/lib/i18n/service-dictionaries';
import styles from './SettlementUploadAnimation.module.css';

type UploadCopy = SettlementCopy['uploadAnimation'];
const subscribeToHydration = () => () => {};

const getFrames = (fieldCount: number) => [
  { phase: 'initial', duration: 1250, filled: 0 },
  { phase: 'dragging', duration: 1050, filled: 0 },
  { phase: 'dropped', duration: 320, filled: 0 },
  { phase: 'uploaded', duration: 1150, filled: 0 },
  { phase: 'extracting', duration: 500, filled: 0 },
  ...Array.from({ length: fieldCount }, (_, index) => ({
    phase: 'extracting', duration: 240, filled: index + 1,
  })),
  { phase: 'review', duration: 1800, filled: fieldCount },
  { phase: 'submitting', duration: 650, filled: fieldCount },
  { phase: 'complete', duration: 2300, filled: fieldCount },
];

const TradeFields = ({ fields, filled }: { fields: UploadCopy['fields']; filled: number }) => (
  <dl className={styles.fields}>
    {fields.map((field, index) => (
      <div key={field.id} className={styles.field} data-field={field.id} data-filled={index < filled}>
        <dt>{field.label}</dt>
        <dd>
          {index < filled && (
            <span className={styles.fieldValue}>
              <bdi>{field.value}</bdi>
              <Check size={14} aria-hidden="true" />
            </span>
          )}
        </dd>
      </div>
    ))}
  </dl>
);

export const SettlementUploadAnimation = ({ copy }: { copy: UploadCopy }) => {
  const stage = useRef<HTMLDivElement>(null);
  const visible = useInView(stage, { amount: 0.2 });
  const prefersReducedMotion = useReducedMotion();
  const hydrated = useSyncExternalStore(subscribeToHydration, () => true, () => false);
  const reduced = hydrated && prefersReducedMotion;
  const [frameIndex, setFrameIndex] = useState(0);
  const remaining = useRef<{ frameIndex: number; time: number } | null>(null);
  const frames = getFrames(copy.fields.length);
  const lastFrame = frames.length - 1;
  const frame = frames[reduced ? lastFrame : frameIndex];
  const { duration, phase, filled } = frame;
  const formShown = ['extracting', 'review', 'submitting', 'complete'].includes(phase);
  const uploaded = phase === 'uploaded' || formShown;
  const fileSelected = phase === 'dropped' || uploaded;
  const canSubmit = phase === 'review';
  const submitting = phase === 'submitting';
  const complete = phase === 'complete';
  const running = visible && !reduced;

  useEffect(() => {
    if (!running) return;

    const previous = remaining.current;
    const timeLeft = previous?.frameIndex === frameIndex ? previous.time : duration;
    const start = performance.now();
    let advanced = false;
    const timer = window.setTimeout(() => {
      advanced = true;
      remaining.current = null;
      setFrameIndex(frameIndex === lastFrame ? 0 : frameIndex + 1);
    }, timeLeft);

    return () => {
      window.clearTimeout(timer);
      if (!advanced) {
        remaining.current = { frameIndex, time: Math.max(0, timeLeft - (performance.now() - start)) };
      }
    };
  }, [running, duration, frameIndex, lastFrame]);

  return (
    <div
      ref={stage}
      className={styles.stage}
      role="group"
      aria-label={copy.label}
      data-upload-phase={phase}
      data-playing={running}
    >
      <div className={styles.workspace}>
        <div className={styles.source} data-shifted={formShown} data-uploaded={uploaded}>
          <div className={styles.windowHeader}>
            <FileUp size={17} aria-hidden="true" />
            <h3>{copy.label}</h3>
          </div>
          <div className={styles.uploadBody}>
            <div className={styles.fileInput} data-selected={fileSelected}>
              <FileImage size={16} aria-hidden="true" />
              {fileSelected ? <bdi>{copy.file}</bdi> : <span>{copy.prompt}</span>}
              {phase === 'dragging' && (
                <span className={styles.draggedFile} aria-hidden="true">
                  <FileImage size={15} />
                  <bdi>{copy.file}</bdi>
                  <MousePointer2 className={styles.dragPointer} size={20} />
                </span>
              )}
            </div>
            <div className={styles.previewSlot} aria-hidden="true">
              <div>
                <div className={styles.document}>
                  <div className={styles.ticketTitle}>{copy.ticketTitle}</div>
                  <dl className={styles.ticketFields}>
                    {copy.fields.map((field) => (
                      <div key={field.id} className={styles.ticketField} data-field={field.id}>
                        <dt>{field.label}</dt>
                        <dd><bdi>{field.value}</bdi></dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.output} data-shown={formShown} aria-hidden={!formShown}>
          <div className={styles.windowHeader}>
            <ScanText size={17} aria-hidden="true" />
            <h3>{copy.result}</h3>
          </div>
          <div className={styles.formBody}>
            <TradeFields fields={copy.fields} filled={filled} />
            <button
              type="button"
              className={styles.submit}
              aria-disabled={!canSubmit}
              tabIndex={formShown && !reduced ? undefined : -1}
              onClick={() => {
                if (canSubmit) setFrameIndex(frameIndex + 1);
              }}
            >
              {complete && <Check size={16} aria-hidden="true" />}
              {complete ? copy.submitted : submitting ? copy.submitting : copy.submit}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
