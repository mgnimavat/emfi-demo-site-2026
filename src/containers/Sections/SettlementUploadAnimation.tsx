'use client';

import { useRef } from 'react';
import { useInView } from 'framer-motion';
import {
  ArrowRight,
  Check,
  FileImage,
  FileUp,
  MousePointer2,
  ScanText,
  ShieldCheck,
  Workflow,
  type LucideIcon,
} from 'lucide-react';
import type { SettlementCopy } from '@/lib/i18n/service-dictionaries';
import styles from './SettlementUploadAnimation.module.css';

type UploadCopy = SettlementCopy['uploadAnimation'];
type SettlementPanel = SettlementCopy['serviceSections'][number]['panels'][number];
type UploadProps = {
  copy: UploadCopy;
  panels: SettlementPanel[];
};

const stepIcons: Partial<Record<string, LucideIcon>> = {
  upload: FileUp,
  extract: ScanText,
  validate: ShieldCheck,
  process: Workflow,
};

export const SettlementUploadAnimation = ({ copy, panels }: UploadProps) => {
  const stage = useRef<HTMLDivElement>(null);
  const visible = useInView(stage, { amount: 0.2 });

  return (
    <div
      ref={stage}
      className={styles.stage}
      role="group"
      aria-label={copy.label}
      data-playing={visible}
    >
      <div className={styles.workspace}>
        <div className={styles.source} aria-hidden="true">
          <div className={styles.dropzone}>
            <FileUp size={25} />
            <strong>{copy.prompt}</strong>
            <span className={styles.draggedFile}>
              <FileImage size={17} />
              <bdi>{copy.file}</bdi>
              <MousePointer2 className={styles.dragPointer} size={19} />
            </span>
          </div>
          <div className={styles.document}>
            <div className={styles.documentHeader}>
              <FileImage size={15} />
              <bdi>{copy.file}</bdi>
              <bdi className={styles.fileType}>PNG</bdi>
            </div>
            <div className={styles.ticketTitle}>{copy.ticketTitle}</div>
            <dl className={styles.ticketFields}>
              {copy.fields.map((field) => (
                <div key={field.id} className={styles.ticketField}>
                  <dt>{field.label}</dt>
                  <dd><bdi>{field.value}</bdi></dd>
                </div>
              ))}
            </dl>
            <span className={styles.scan} />
          </div>
        </div>
        <div className={styles.connector} aria-hidden="true"><ArrowRight size={18} /></div>
        <div className={styles.output}>
          <div className={styles.outputHeader}>
            <span className={styles.headerIcon}><ScanText size={17} aria-hidden="true" /></span>
            <h3>{copy.result}</h3>
          </div>
          <dl className={styles.fields}>
            {copy.fields.map((field) => (
              <div key={field.id} className={styles.field}>
                <dt>{field.label}</dt>
                <dd>
                  <bdi className={styles.value}>{field.value}</bdi>
                  <Check className={styles.read} size={14} aria-hidden="true" />
                </dd>
              </div>
            ))}
          </dl>
          <p className={styles.ready}><ShieldCheck size={16} aria-hidden="true" />{copy.ready}</p>
          <ol className={styles.steps}>
            {panels.map((panel) => {
              const Icon = stepIcons[panel.id];
              return (
                <li key={panel.id}>
                  {Icon && <Icon size={15} aria-hidden="true" />}
                  <span>{panel.title}</span>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </div>
  );
};

