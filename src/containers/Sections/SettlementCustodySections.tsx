import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Check, ShieldCheck } from 'lucide-react';
import { ResearchExecutionHeroMockup } from '@/components/home-17/research-execution-hero';
import { ExecutionReveal } from '@/components/sections/execution/reveal';
import { settlement } from '@/content/settlement';
import { ServiceDisclosures } from './ServiceDisclosures';
import styles from './SettlementCustodySections.module.css';

const dashboardViews = ['HeroDashboard'] as const;

const SettlementOverview = () => {
  const content = settlement.overview;

  return (
    <section id="settlement" className={`${styles.section} ${styles.navy}`} aria-labelledby="settlement-heading">
      <div className={`${styles.container} ${styles.overviewGrid}`}>
        <ExecutionReveal className={styles.copy}>
          <h2 id="settlement-heading" className={styles.title}>{content.title}</h2>
          <p className={styles.lead}>{content.lead}</p>
          <p className={styles.body}>{content.body}</p>
          <ul className={styles.checkList} aria-labelledby="settlement-dashboard-heading">
            {content.items.map((item) => <li key={item}><Check size={17} aria-hidden="true" />{item}</li>)}
          </ul>
        </ExecutionReveal>
        <ExecutionReveal delay={0.12} className={styles.dashboard}>
          <div className={styles.visualHeading}>
            <h3 id="settlement-dashboard-heading">{content.dashboardTitle}</h3>
            <p>{content.dashboardBody}</p>
          </div>
          <ResearchExecutionHeroMockup views={dashboardViews} quietFrame square trimChrome appBar />
        </ExecutionReveal>
      </div>
    </section>
  );
};

const CustodySafeguarding = () => {
  const content = settlement.custody;

  return (
    <section id="custody" className={styles.section} aria-labelledby="custody-heading">
      <div className={styles.container}>
        <div className={styles.introGrid}>
          <ExecutionReveal><h2 id="custody-heading" className={styles.title}>{content.title}</h2></ExecutionReveal>
          <ExecutionReveal delay={0.12}>
            <p className={styles.introLead}>{content.lead}</p>
            <p className={styles.body}>{content.body}</p>
          </ExecutionReveal>
        </div>
        <div className={styles.custodyGrid}>
          <div className={styles.controls}>
            <div className={styles.ruleGrid}>
              {content.rules.map((rule) => (
                <ExecutionReveal key={rule.id} className={styles.rule}>
                  <span className={styles.code}>{rule.code}</span>
                  <h3>{rule.title}</h3>
                  <p className={styles.summary}>{rule.summary}</p>
                  {rule.paragraphs.map((paragraph) => <p className={styles.body} key={paragraph}>{paragraph}</p>)}
                </ExecutionReveal>
              ))}
            </div>
            <div className={styles.oversight}>
              <ShieldCheck size={28} strokeWidth={1.5} aria-hidden="true" />
              <div>
                <p className={styles.code}>{content.oversight.code}</p>
                <h3>{content.oversight.title}</h3>
                <p className={styles.body}>{content.oversight.summary}</p>
              </div>
            </div>
          </div>
          <ExecutionReveal delay={0.12} className={styles.mobileVisual}>
            <Image src={content.mobileImage} alt={content.mobileAlt} width={489} height={1024} className={styles.mobileImage} />
          </ExecutionReveal>
        </div>
        <div className={styles.callout}>
          <h3>{content.calloutTitle}</h3>
          <p className={styles.body}>{content.callout}</p>
        </div>
        <p className={`${styles.body} ${styles.related}`}>
          {content.relatedBody}{' '}<Link href={content.relatedHref}>{content.relatedLabel}<ArrowUpRight size={15} aria-hidden="true" /></Link>{' '}page.
        </p>
      </div>
    </section>
  );
};

const ClientAssetDisclosures = () => {
  const content = settlement.disclosures;

  return (
    <ServiceDisclosures
      headingId="client-asset-heading"
      title={content.title}
      titleLines={content.titleLines}
      action={content.action}
      external
    >
      {content.entities.map((entity) => <p key={entity.name}><strong>{entity.name}</strong> {entity.body}</p>)}
      <p>{content.notice}</p>
    </ServiceDisclosures>
  );
};

export const SettlementCustodySections = () => (
  <>
    <SettlementOverview />
    <CustodySafeguarding />
    <ClientAssetDisclosures />
  </>
);
