import Link from 'next/link';
import { ArrowUpRight, Check, ShieldCheck } from 'lucide-react';
import { ExecutionReveal } from '@/components/sections/execution/reveal';
import { serviceDictionaries, type SettlementCopy } from '@/lib/i18n/service-dictionaries';
import { ServiceDisclosures } from './ServiceDisclosures';
import { SettlementDashboard } from './SettlementDashboard';
import { SettlementMobileHoldings } from './SettlementMobileHoldings';
import styles from './SettlementCustodySections.module.css';

const SettlementOverview = ({ copy: settlement }: { copy: SettlementCopy }) => {
  const content = settlement.overview;

  return (
    <section id="settlement" className={`${styles.section} ${styles.navy}`} aria-labelledby="settlement-heading">
      <div className={styles.container}>
        <div className={styles.overviewGrid}>
          <ExecutionReveal>
            <h2 id="settlement-heading" className={styles.overviewTitle}>
              {content.titleLines.map((line) => <span key={line}>{line}</span>)}
            </h2>
          </ExecutionReveal>
          <ExecutionReveal delay={0.12} className={styles.copy}>
            <h3 className={styles.lead}>{content.lead}</h3>
            <p className={styles.body}>{content.body}</p>
            <ul className={styles.checkList} aria-label={content.dashboardTitle}>
              {content.items.map((item) => <li key={item}><Check size={17} aria-hidden="true" />{item}</li>)}
            </ul>
          </ExecutionReveal>
        </div>
        <ExecutionReveal delay={0.12} className={styles.dashboard}>
          <div className={styles.visualHeading}>
            <h3 id="settlement-dashboard-heading">{content.dashboardTitle}</h3>
            <p>{content.dashboardBody}</p>
          </div>
          <SettlementDashboard />
        </ExecutionReveal>
      </div>
    </section>
  );
};

const CustodySafeguarding = ({ copy: settlement }: { copy: SettlementCopy }) => {
  const content = settlement.custody;

  return (
    <section id="custody" className={styles.section} aria-labelledby="custody-heading">
      <div className={styles.container}>
        <div className={styles.introGrid}>
          <ExecutionReveal className={styles.custodyHeading}>
            <h2 id="custody-heading" className={`${styles.title} ${styles.custodyTitle}`} aria-label={content.title}>
              {content.titleLines.map((line) => <span key={line}>{line}</span>)}
            </h2>
          </ExecutionReveal>
          <ExecutionReveal delay={0.12}>
            <p className={styles.introLead}>{content.lead}</p>
            <p className={styles.body}>{content.body}</p>
          </ExecutionReveal>
        </div>
        <div className={styles.custodyGrid}>
          <div className={styles.controls}>
            <article className={`${styles.rule} ${styles.protection}`}>
              <h3>{content.calloutTitle}</h3>
              <p className={styles.body}>{content.callout}</p>
              <div className={styles.oversight}>
                <ShieldCheck size={22} strokeWidth={1.5} aria-hidden="true" />
                <h4>{content.oversight.title}</h4>
              </div>
            </article>
            <div className={styles.ruleGrid}>
              {content.rules.map((rule) => (
                <ExecutionReveal key={rule.id} className={styles.rule}>
                  <span className={styles.code}>{rule.code}</span>
                  <h3>{rule.title}</h3>
                  {rule.paragraphs.map((paragraph) => <p className={styles.body} key={paragraph}>{paragraph}</p>)}
                </ExecutionReveal>
              ))}
            </div>
          </div>
          <ExecutionReveal delay={0.12} className={styles.mobileVisual}>
            <SettlementMobileHoldings />
          </ExecutionReveal>
        </div>
        <p className={`${styles.body} ${styles.related}`}>
          {content.relatedBody}{' '}<Link href={content.relatedHref}>{content.relatedLabel}<ArrowUpRight size={15} aria-hidden="true" /></Link>{' '}{content.relatedSuffix}
        </p>
      </div>
    </section>
  );
};

const ClientAssetDisclosures = ({ copy: settlement }: { copy: SettlementCopy }) => {
  const content = settlement.disclosures;

  return (
    <ServiceDisclosures
      headingId="client-asset-heading"
      title={content.title}
      action={content.action}
      actionPlacement="panel"
      external
      newTabLabel={settlement.ui['(opens in a new tab)']}
    >
      {content.entities.map((entity) => <p key={entity.name}><strong>{entity.name}</strong> {entity.body}</p>)}
      <p>{content.notice}</p>
    </ServiceDisclosures>
  );
};

export const SettlementCustodySections = ({ copy = serviceDictionaries.en.settlement }: { copy?: SettlementCopy }) => (
  <>
    <SettlementOverview copy={copy} />
    <CustodySafeguarding copy={copy} />
    <ClientAssetDisclosures copy={copy} />
  </>
);
