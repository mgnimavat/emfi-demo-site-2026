import Image from 'next/image';
import { ArrowDown, Layers } from 'lucide-react';
import { ExecutionReveal } from '@/components/sections/execution/reveal';
import { PersonCard } from '@/components/sections/person-card';
import { wealthProviderAssets } from '@/content/wealth-provider-assets';
import type { WealthCopy } from '@/lib/i18n/service-dictionaries';
import { SettlementDashboard } from './SettlementDashboard';
import theme from '@/components/sections/archive/theme.module.css';
import styles from './WealthServiceSections.module.css';

export const WealthServiceSections = ({ copy }: { copy: WealthCopy['redesign'] }) => (
  <>
    <section id="fund-structure" className={`${styles.section} ${styles.soft}`} aria-labelledby="fund-structure-heading">
      <div className={styles.container}>
        <div className={styles.introduction}>
          <ExecutionReveal>
            <h2 id="fund-structure-heading" className={styles.title}>
              {copy.fund.titleLines.map((line) => <span key={line}>{line}</span>)}
            </h2>
          </ExecutionReveal>
          <ExecutionReveal className={styles.copy} delay={0.12}>
            <p className={styles.lead}>{copy.fund.lead}</p>
            <p className={styles.body}>{copy.fund.body}</p>
          </ExecutionReveal>
        </div>
        <ExecutionReveal>
          <figure className={styles.structure}>
            <figcaption className={styles.fundRoot}>
              <Layers size={28} aria-hidden="true" />
              <h3>{copy.fund.name}</h3>
              <p>{copy.fund.jurisdiction}</p>
            </figcaption>
            <ArrowDown size={28} className={styles.connector} aria-hidden="true" />
            <div className={styles.portfolios}>
              <h4>{copy.fund.portfolioTitle}</h4>
              <p className={styles.body}>{copy.fund.portfolioBody}</p>
            </div>
          </figure>
        </ExecutionReveal>
        <div className={styles.providers}>
          <h3>{copy.fund.providersTitle}</h3>
          <ul className={styles.providerGrid}>
            {copy.fund.providers.map((provider) => {
              const asset = wealthProviderAssets[provider.id];
              return (
                <li key={provider.id} className={styles.provider}>
                  <div className={styles.providerBrand}>
                    {asset ? <Image src={asset.src} alt={provider.name} width={asset.width}
                      height={asset.height} className={styles.providerLogo} /> : <strong>{provider.name}</strong>}
                  </div>
                  <span>{provider.role}</span>
                </li>
              );
            })}
          </ul>
          <p className={styles.notice}>{copy.fund.notice}</p>
        </div>
      </div>
    </section>
    <section id="investment-mandate" className={styles.section} aria-labelledby="mandate-heading">
      <div className={styles.container}>
        <div className={styles.introduction}>
          <ExecutionReveal>
            <h2 id="mandate-heading" className={styles.title}>
              {copy.mandate.titleLines.map((line) => <span key={line}>{line}</span>)}
            </h2>
          </ExecutionReveal>
          <ExecutionReveal delay={0.12}><p className={styles.lead}>{copy.mandate.body}</p></ExecutionReveal>
        </div>
        <ol className={styles.mandateGrid}>
          {copy.mandate.steps.map((step, index) => (
            <li key={step.title}>
              <ExecutionReveal className={styles.mandateCard}>
                <span className={styles.number}>{String(index + 1).padStart(2, '0')}</span>
                <h3>{step.title}</h3>
                <p className={styles.body}>{step.body}</p>
              </ExecutionReveal>
            </li>
          ))}
        </ol>
        <p className={styles.notice}>{copy.mandate.notice}</p>
      </div>
    </section>
    <section id="portfolio-visibility" className={`${styles.section} ${styles.navy}`} aria-labelledby="portfolio-visibility-heading">
      <div className={styles.container}>
        <div className={styles.introduction}>
          <ExecutionReveal>
            <h2 id="portfolio-visibility-heading" className={styles.title}>
              {copy.visibility.titleLines.map((line) => <span key={line}>{line}</span>)}
            </h2>
          </ExecutionReveal>
          <ExecutionReveal delay={0.12}><p className={styles.lead}>{copy.visibility.body}</p></ExecutionReveal>
        </div>
        <ExecutionReveal><SettlementDashboard /></ExecutionReveal>
        <p className={styles.notice}>{copy.visibility.notice}</p>
      </div>
    </section>
    <section id="portfolio-team" className={styles.section} aria-labelledby="portfolio-team-heading">
      <div className={styles.container}>
        <ExecutionReveal className={theme.peopleIntro}>
          <h2 id="portfolio-team-heading" className={theme.sectionTitle}>{copy.team.title}</h2>
        </ExecutionReveal>
        <div className={styles.teamGrid}>
          {copy.team.people.map((person) => (
            <ExecutionReveal key={person.name}><PersonCard person={person} /></ExecutionReveal>
          ))}
        </div>
      </div>
    </section>
  </>
);
