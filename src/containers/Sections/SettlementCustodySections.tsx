import Link from 'next/link';
import { ArrowRight, Check, Sparkles, UserRoundCheck } from 'lucide-react';
import { ConnectedJourney } from '@/components/sections/execution-v2/connected-journey';
import flowStyles from '@/components/sections/execution/page.module.css';
import { settlement } from '@/content/settlement';
import { Button } from '@/components/ui/button';
import { SettlementDemo } from '@/components/demos/settlement-demo';
import { WorkstationDemo } from '@/components/demos/workstation-demo';
import { OperatingView } from '@/components/mockups/operating-view';
import { ExecutionReveal } from '@/components/sections/execution/reveal';
import { ServiceSectionHeading } from './ServiceSectionHeading';
import styles from './ServicePage.module.css';

export const SettlementCustodySections = () => (
  <>
    <section className={styles.section} aria-labelledby="settlement-overview-heading">
      <div className={styles.container}>
        <div className={styles.introGrid}>
          <ServiceSectionHeading
            title={settlement.headline.replace('\n', ' ')}
            id="settlement-overview-heading"
          />
          <ExecutionReveal className={styles.introBody}>
            <p>{settlement.body}</p>
            <p className={styles.entityNote}>
              {settlement.entity}{' '}
              <Link href="/why-emfi">
                {settlement.entityCta}
                <ArrowRight size={13} aria-hidden="true" />
              </Link>
            </p>
          </ExecutionReveal>
        </div>
      </div>
    </section>

    <section className={flowStyles.flow} aria-labelledby="settlement-flow-heading">
      <div className={flowStyles.container}>
        <ExecutionReveal>
          <h2 id="settlement-flow-heading" className={flowStyles.title}>
            {settlement.diffTitle}
          </h2>
          <p className={flowStyles.body}>{settlement.diffBody}</p>
        </ExecutionReveal>
        <ConnectedJourney variant="settlement" />
      </div>
    </section>

    <section
      className={`${styles.section} ${styles.softBand}`}
      aria-labelledby="settlement-visibility-heading"
    >
      <div className={styles.container}>
        <ServiceSectionHeading
          title={settlement.visTitle}
          body={settlement.visBody}
          id="settlement-visibility-heading"
        />
        <ExecutionReveal className={styles.demoSurface}>
          <OperatingView tabs views={['Dashboard', 'Securities', 'Balances']} />
        </ExecutionReveal>
      </div>
    </section>

    <section className={styles.section} aria-labelledby="settlement-eligibility-heading">
      <div className={styles.container}>
        <div className={styles.introGrid}>
          <ServiceSectionHeading title={settlement.demoTitle} id="settlement-eligibility-heading" />
          <p className={styles.introBody}>{settlement.demoBody}</p>
        </div>
        <ExecutionReveal className={styles.demoSurface}>
          <SettlementDemo />
        </ExecutionReveal>
      </div>
    </section>

    <section
      className={`${styles.section} ${styles.softBand}`}
      aria-labelledby="settlement-workstation-heading"
    >
      <div className={styles.container}>
        <ServiceSectionHeading
          title={settlement.workstationTitle}
          id="settlement-workstation-heading"
        />
        <ExecutionReveal className={styles.demoSurface}>
          <WorkstationDemo />
        </ExecutionReveal>
      </div>
    </section>

    <section className={styles.section} aria-labelledby="asset-servicing-heading">
      <div className={styles.container}>
        <ServiceSectionHeading title={settlement.assetTitle} id="asset-servicing-heading" />
        <div className={styles.twoColumns}>
          {settlement.servicing.map(([heading, items], index) => {
            const Icon = index === 0 ? Sparkles : UserRoundCheck;
            return (
              <ExecutionReveal key={heading} className={styles.fillHeight}>
                <article className={styles.serviceCard}>
                  <span className={styles.cardIcon}>
                    <Icon size={25} strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <h3>{heading === 'AUTOMATED' ? 'Automated servicing' : 'Human support'}</h3>
                  <ul className={styles.checkList}>
                    {items.map((item) => (
                      <li key={item}>
                        <Check size={16} aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
              </ExecutionReveal>
            );
          })}
        </div>
      </div>
    </section>

    <section
      className={`${styles.section} ${styles.softBand}`}
      aria-labelledby="settlement-relationship-heading"
    >
      <div className={styles.container}>
        <ServiceSectionHeading title={settlement.roleTitle} id="settlement-relationship-heading" />
        <div className={styles.twoColumns}>
          {settlement.roles.map(([label, body, cta]) => (
            <article key={label} className={`${styles.serviceCard} ${styles.roleCard}`}>
              <p className={styles.cardEyebrow}>{label}</p>
              <h3>{body}</h3>
              <div className={styles.cardAction}>
                <Button href="/contact">{cta}</Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section className={styles.section} aria-labelledby="settlement-connected-heading">
      <div className={styles.container}>
        <ServiceSectionHeading
          title={settlement.connectedTitle}
          id="settlement-connected-heading"
        />
        <ol className={styles.connectedChain}>
          {settlement.connected.map((item, index) => (
            <li key={item}>
              <span>{item}</span>
              {index < settlement.connected.length - 1 ? (
                <ArrowRight size={17} aria-hidden="true" />
              ) : null}
            </li>
          ))}
        </ol>
        <ul className={styles.capabilityGrid}>
          {settlement.capabilities.map((item) => (
            <li key={item}>
              <Check size={17} aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  </>
);
