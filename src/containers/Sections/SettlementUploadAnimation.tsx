'use client';

import { useRef } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';
import { ArrowRight, Check, FileImage, FileUp, MousePointer2 } from 'lucide-react';
import type { SettlementCopy } from '@/lib/i18n/service-dictionaries';
import styles from './SettlementUploadAnimation.module.css';

type UploadCopy = SettlementCopy['uploadAnimation'];
type SettlementPanel = SettlementCopy['serviceSections'][number]['panels'][number];
type UploadProps = {
  copy: UploadCopy;
  panels: SettlementPanel[];
};

export const SettlementUploadAnimation = ({ copy, panels }: UploadProps) => {
  const stage = useRef<HTMLDivElement>(null);
  const visible = useInView(stage, { amount: 0.2 });
  const reducedMotion = useReducedMotion();

  return (
    <div ref={stage} className={styles.stage} aria-label={copy.label} data-running={visible && !reducedMotion}>
      <div>
        <div className={styles.workspace}>
          <div className={styles.source}>
            <div className={styles.dropzone} aria-hidden="true">
              <FileUp size={32} />
              <strong>{copy.prompt}</strong>
              <span>{copy.hint}</span>
            </div>
            <div className={styles.floatingFile} aria-hidden="true">
              <FileImage size={22} /><span>{copy.file}</span>
              <MousePointer2 className={styles.cursor} size={26} />
            </div>
            <figure className={styles.document} aria-label={copy.document}>
              <div className={styles.documentHeader}><FileImage size={15} /><span>{copy.file}</span><Check size={15} /></div>
              <figcaption>{copy.document}</figcaption>
              <div className={styles.highlights}>
                {copy.fields.map((field) => <mark key={field.id}>{field.value}</mark>)}
                <mark>USD</mark>
              </div>
              <div className={styles.lines} aria-hidden="true"><span /><span /><span /><span /></div>
              <div className={styles.scan} aria-hidden="true" />
            </figure>
          </div>
          <div className={styles.connector} aria-hidden="true"><ArrowRight size={22} /></div>
          <div className={styles.output}>
            <h3>{copy.result}</h3>
            <dl className={styles.fields}>
              {copy.fields.map((field) => (
                <div key={field.id} className={styles.field}>
                  <dt>{field.label}</dt>
                  <dd><span className={styles.value}>{field.value}</span>
                    <span className={styles.read}><Check size={13} aria-hidden="true" />{copy.read}</span>
                  </dd>
                </div>
              ))}
            </dl>
            <p className={styles.ready}><Check size={15} aria-hidden="true" />{copy.ready}</p>
          </div>
        </div>
        <ol className={styles.steps}>
          {panels.map((panel) => (
            <li key={panel.id}>
              <span className={styles.stepTrack} aria-hidden="true"><span /></span>
              <h4><span>{panel.steps[0]} / </span>{panel.title}</h4>
              <p>{panel.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

