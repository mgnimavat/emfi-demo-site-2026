import { ArrowDown, Check, FileUp, ScanText, ShieldCheck, Workflow } from 'lucide-react';
import { ExecutionReveal } from '@/components/sections/execution/reveal';
import type { SettlementCopy } from '@/lib/i18n/service-dictionaries';
import { SettlementAccountAnimation } from './SettlementAccountAnimation';
import { SettlementLinkedAnimation } from './SettlementLinkedAnimation';
import { SettlementUploadAnimation } from './SettlementUploadAnimation';
import styles from './SettlementServiceSections.module.css';

const workflowIcons = { upload: FileUp, extract: ScanText, validate: ShieldCheck, process: Workflow };
const isWorkflowStep = (id: string): id is keyof typeof workflowIcons => id in workflowIcons;

const ArchiveCrossBorder = ({ lead, copy, showFullDeposits }: {
  lead: string; copy: SettlementCopy; showFullDeposits: boolean;
}) => {
  const { titleLines, body } = copy.crossBorderArchive;

  return (
    <section id="cross-border" className={`${styles.section} ${styles.archiveSection}`}
      aria-labelledby="cross-border-heading">
      <div className={`${styles.container} ${styles.archiveLayout}`}>
        <ExecutionReveal className={styles.archiveCopy}>
          <h2 id="cross-border-heading" className={styles.title}>
            {titleLines.map((line) => <span key={line}>{line}</span>)}
          </h2>
          <p className={styles.archiveLead}>{lead} {body}</p>
        </ExecutionReveal>
        <div className={styles.archiveAnimation} data-full-deposits={showFullDeposits || undefined}>
          <SettlementAccountAnimation copy={copy.accountAnimation} showFullDeposits={showFullDeposits} />
        </div>
      </div>
    </section>
  );
};

type ServiceSection = SettlementCopy['serviceSections'][number];

const TradeEntryMethods = ({ section, archive = false }: { section: ServiceSection; archive?: boolean }) => (
  section.methods ? (
    <div className={archive ? `${styles.methods} ${styles.archiveMethods}` : styles.methods}>
      <h3>{section.methodsTitle}</h3>
      <div className={styles.methodGrid}>
        {section.methods.map((method) => (
          <ExecutionReveal key={method.id} className={styles.method}>
            {archive && <span className={styles.methodDot} aria-hidden="true" />}
            <div>
              <h4>{method.title}</h4>
              <p className={styles.body}>{method.body}</p>
            </div>
          </ExecutionReveal>
        ))}
      </div>
    </div>
  ) : null
);

const ArchiveWorkflow = ({ section, copy, showLinkedTradeCards }: {
  section: ServiceSection; copy: SettlementCopy; showLinkedTradeCards: boolean;
}) => (
  <section id={section.id} className={`${styles.section} ${styles.archiveSection} ${styles.archiveWorkflow}`}
    aria-labelledby={`${section.id}-heading`}>
    <div className={`${styles.container} ${styles.archiveLayout}`}>
      <ExecutionReveal className={styles.archiveCopy}>
        <h2 id={`${section.id}-heading`} className={styles.title}>
          {section.titleLines.map((line) => <span key={line}>{line}</span>)}
        </h2>
        <p className={styles.archiveLead}>{section.lead}</p>
        <TradeEntryMethods section={section} archive />
      </ExecutionReveal>
      <div className={styles.archiveAnimation}>
        {section.id === 'linked-settlement' ? (
          <SettlementLinkedAnimation panels={section.panels} copy={copy.linkedAnimation}
            layout="vertical" tradeCards={showLinkedTradeCards} />
        ) : (
          <SettlementUploadAnimation copy={copy.uploadAnimation} />
        )}
      </div>
    </div>
  </section>
);

export const SettlementServiceSections = ({ copy, archive = false, showFullDeposits = false, showLinkedTradeCards = false }: {
  copy: SettlementCopy; archive?: boolean; showFullDeposits?: boolean; showLinkedTradeCards?: boolean;
}) => (
  <div id="settlement" className={styles.sections}>
    {copy.serviceSections.map((section) => archive && section.id === 'cross-border' ? (
      <ArchiveCrossBorder key={section.id} lead={section.lead} copy={copy} showFullDeposits={showFullDeposits} />
    ) : archive && (section.id === 'linked-settlement' || section.id === 'trade-upload') ? (
      <ArchiveWorkflow key={section.id} section={section} copy={copy} showLinkedTradeCards={showLinkedTradeCards} />
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
            <SettlementUploadAnimation copy={copy.uploadAnimation} />
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
          <TradeEntryMethods section={section} />
        </div>
      </section>
    ))}
  </div>
);
