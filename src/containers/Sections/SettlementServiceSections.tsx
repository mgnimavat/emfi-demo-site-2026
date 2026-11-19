import { ArrowDown, Check, FileUp, ScanText, ShieldCheck, Workflow } from 'lucide-react';
import { ExecutionReveal } from '@/components/sections/execution/reveal';
import type { SettlementCopy } from '@/lib/i18n/service-dictionaries';
import { SettlementAccountAnimation } from './SettlementAccountAnimation';
import { SettlementLinkedAnimation } from './SettlementLinkedAnimation';
import { SettlementUploadAnimation } from './SettlementUploadAnimation';
import styles from './SettlementServiceSections.module.css';

const workflowIcons = { upload: FileUp, extract: ScanText, validate: ShieldCheck, process: Workflow };
const isWorkflowStep = (id: string): id is keyof typeof workflowIcons => id in workflowIcons;

const ArchiveCrossBorder = ({ lead, copy }: { lead: string; copy: SettlementCopy }) => {
  const { titleLines, body, detail } = copy.crossBorderArchive;

  return (
    <section id="cross-border" className={`${styles.section} ${styles.archiveSection}`}
      aria-labelledby="cross-border-heading">
      <div className={`${styles.container} ${styles.archiveLayout}`}>
        <ExecutionReveal className={styles.archiveCopy}>
          <h2 id="cross-border-heading" className={styles.title}>
            {titleLines.map((line) => <span key={line}>{line}</span>)}
          </h2>
          <p className={styles.archiveLead}>{lead}</p>
          <p className={styles.body}>{body}</p>
          <div className={styles.archiveDetail}>
            <h3>{detail.title}</h3>
            <p className={styles.body}>{detail.body}</p>
          </div>
        </ExecutionReveal>
        <div className={styles.archiveAnimation}>
          <SettlementAccountAnimation copy={copy.accountAnimation} orientation="vertical" />
        </div>
      </div>
    </section>
  );
};

export const SettlementServiceSections = ({ copy, archiveCrossBorder = false }: {
  copy: SettlementCopy; archiveCrossBorder?: boolean;
}) => (
  <div id="settlement" className={styles.sections}>
    {copy.serviceSections.map((section) => archiveCrossBorder && section.id === 'cross-border' ? (
      <ArchiveCrossBorder key={section.id} lead={section.lead} copy={copy} />
    ) : (
      <section
        key={section.id}
        id={section.id}
        className={styles.section}
        aria-labelledby={`${section.id}-heading`}
      >
        <div className={styles.container}>
          <div className={`${styles.introduction} ${
            section.id === 'trade-upload' ? styles.uploadIntroduction : ''
          }`}>
            <ExecutionReveal>
              <h2 id={`${section.id}-heading`}
                className={section.id === 'trade-upload' ? styles.uploadTitle : styles.title}>
                {section.titleLines.map((line) => <span key={line}>{line}</span>)}
              </h2>
            </ExecutionReveal>
            <ExecutionReveal delay={0.12} className={styles.copy}>
              <p className={styles.lead}>{section.lead}</p>
            </ExecutionReveal>
          </div>
          {section.id === 'cross-border' ? (
            <SettlementAccountAnimation copy={copy.accountAnimation} />
          ) : section.id === 'linked-settlement' ? (
            <SettlementLinkedAnimation panels={section.panels} copy={copy.linkedAnimation} />
          ) : section.id === 'trade-upload' ? (
            <SettlementUploadAnimation panels={section.panels} copy={copy.uploadAnimation} />
          ) : (
          <div className={styles.panels} data-workflow={section.id === 'trade-upload'}>
            {section.panels.map((panel) => {
              const Icon = isWorkflowStep(panel.id) ? workflowIcons[panel.id] : ShieldCheck;
              return (
                <ExecutionReveal key={panel.id} className={styles.panel}>
                  {section.id === 'trade-upload' ? (
                    <span className={styles.icon}><Icon size={26} aria-hidden="true" /></span>
                  ) : null}
                  <h3>{panel.title}</h3>
                  {section.id === 'trade-upload' ? null : (
                    <ol className={styles.steps}>
                      {panel.steps.map((step, index) => (
                        <li key={step}>
                          {index === 0 ? <Check size={16} aria-hidden="true" /> : <ArrowDown size={16} aria-hidden="true" />}
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  )}
                  <p className={styles.body}>{panel.body}</p>
                </ExecutionReveal>
              );
            })}
          </div>
          )}
          {section.methods ? (
            <div className={styles.methods}>
              <h3>{section.methodsTitle}</h3>
              <div className={styles.methodGrid}>
                {section.methods.map((method) => (
                  <ExecutionReveal key={method.title} className={styles.method}>
                    <h4>{method.title}</h4>
                    <p className={styles.body}>{method.body}</p>
                  </ExecutionReveal>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>
    ))}
  </div>
);
