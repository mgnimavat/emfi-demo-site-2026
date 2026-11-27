import Image from 'next/image';
import { Check } from 'lucide-react';
import { ExecutionReveal } from '@/components/sections/execution/reveal';
import { PersonCard } from '@/components/sections/person-card';
import { wealthProviderAssets } from '@/content/wealth-provider-assets';
import type { AboutCopy } from '@/lib/i18n';
import type { ResearchCopy, WealthCopy } from '@/lib/i18n/service-dictionaries';
import { SettlementDashboard } from './SettlementDashboard';
import { WealthFundSearch } from './WealthFundSearch';
import theme from '@/components/sections/archive/theme.module.css';
import styles from './WealthServiceSections.module.css';
import reveal from './ProviderCardReveal.module.css';
import bandStyles from './WhyServicePages.module.css';

const portfolioResearchNames = new Set([
  'Guillermo Guerrero',
  'Albani Granado',
  'Rosamnis Marcano',
  'Matias Montes',
]);

export const WealthServiceSections = ({
  copy, researchTeam, aboutPeople, archiveFund = false, fundLeadAsTitle = false, showFundSearch = false,
}: {
  copy: WealthCopy['redesign'];
  researchTeam: ResearchCopy['team'];
  aboutPeople: readonly AboutCopy['people'][number][];
  archiveFund?: boolean;
  fundLeadAsTitle?: boolean;
  showFundSearch?: boolean;
}) => {
  const team = (
    <section id="portfolio-team" className={styles.section} aria-labelledby="portfolio-team-heading">
      <div className={styles.container}>
        <ExecutionReveal className={theme.peopleIntro}>
          <h2 id="portfolio-team-heading" className={theme.sectionTitle}>{copy.team.title}</h2>
        </ExecutionReveal>
        <div className={styles.teamGrid}>
          {[
            ...copy.team.people.map((person) => ({
              ...person,
              description: aboutPeople.find(({ name }) => name === person.name)?.description,
            })),
            ...researchTeam.people.filter((person) => portfolioResearchNames.has(person.name)),
          ].map((person) => (
            <ExecutionReveal key={person.name}><PersonCard person={person} /></ExecutionReveal>
          ))}
        </div>
      </div>
    </section>
  );

  return (
    <>
      <section id="fund-structure" className={`${styles.section} ${styles.fundStructure}`}
        aria-labelledby="fund-structure-heading">
        <div className={`${styles.container} ${styles.fundLayout}${archiveFund ? ` ${styles.fundArchiveLayout}` : ''}`}>
          <div className={styles.fundIntroduction}>
            <ExecutionReveal>
              <h2 id="fund-structure-heading" className={fundLeadAsTitle ? `${styles.title} ${styles.fundLeadTitle}` : styles.title}>
                {fundLeadAsTitle ? copy.fund.lead : (archiveFund ? copy.fund.archive.titleLines : copy.fund.titleLines)
                  .map((line) => <span key={line}>{line}</span>)}
              </h2>
            </ExecutionReveal>
            <ExecutionReveal delay={0.12}
              className={`${styles.descriptionContainer}${archiveFund ? ` ${styles.fundArchiveCopy}` : ''}`}>
              <p className={styles.description}>
                {archiveFund ? copy.fund.archive.lead : fundLeadAsTitle ? copy.fund.body : `${copy.fund.lead} ${copy.fund.body}`}
              </p>
              {archiveFund && <p className={styles.body}>{copy.fund.archive.body}</p>}
            </ExecutionReveal>
          </div>
          <ExecutionReveal className={styles.providers}>
            <svg className={styles.logoFilter} aria-hidden="true" focusable="false">
              <defs>
                <filter id="wealth-provider-navy" colorInterpolationFilters="sRGB">
                  <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -.6378 -2.1456 -.2166 0 3" />
                  <feComposite in2="SourceAlpha" operator="in" result="ink" />
                  <feFlood floodColor="var(--text-primary)" />
                  <feComposite in2="ink" operator="in" />
                </filter>
              </defs>
            </svg>
            <h3 id="fund-providers-heading">{copy.fund.providersTitle}</h3>
            <ul className={styles.providerGrid} aria-labelledby="fund-providers-heading">
              {copy.fund.providers.map((provider) => {
                const asset = wealthProviderAssets[provider.id];
                return (
                  <li key={provider.id} className={`${styles.provider} ${reveal.card} ${reveal.panel}`}
                    tabIndex={provider.role ? 0 : undefined}>
                    <div className={`${styles.providerBrand} ${reveal.brand}`} data-provider={provider.id}>
                      {asset ? <Image src={asset.src} alt={provider.name} width={asset.width}
                        height={asset.height} className={styles.providerLogo} /> : <strong>{provider.name}</strong>}
                    </div>
                    {provider.role && <span className={reveal.details}>{provider.role}</span>}
                  </li>
                );
              })}
            </ul>
          </ExecutionReveal>
        </div>
      </section>
      <section id="portfolio-visibility" className={`${styles.section} ${styles.visibilitySection}`} aria-labelledby="portfolio-visibility-heading">
        <div className={`${styles.container} ${styles.visibilityContainer}`}>
          <ExecutionReveal className={styles.visibilityIntro}>
            <h2 id="portfolio-visibility-heading" className={styles.title}>
              {(showFundSearch ? copy.fund.titleLines : copy.visibility.titleLines)
                .map((line) => <span key={line}>{line}{' '}</span>)}
            </h2>
            <div className={styles.descriptionContainer}>
              <p className={styles.description}>{copy.visibility.body}</p>
            </div>
          </ExecutionReveal>
          <ExecutionReveal delay={0.12} className={styles.visibilityDashboard}>
            <SettlementDashboard borderless fit />
          </ExecutionReveal>
        </div>
      </section>
      {showFundSearch ? <WealthFundSearch copy={copy.fundSearch} /> : team}
      <section id="investment-mandate" className={`${styles.section} ${styles.mandateSection}`}
        aria-labelledby="mandate-heading">
        <div className={styles.container}>
          <div className={styles.splitLayout}>
            <ExecutionReveal className={styles.mandateIntro}>
              <h2 id="mandate-heading" className={styles.mandateTitle}>
                {copy.mandate.titleLines.map((line) => <span key={line}>{line}{' '}</span>)}
              </h2>
              <p className={styles.description}>{copy.mandate.body}</p>
            </ExecutionReveal>
            <ExecutionReveal delay={0.12} className={bandStyles.conditions}>
              <h3 id="mandate-steps-heading">{copy.mandate.stepsTitle}</h3>
              <ol className={styles.mandateSteps} role="list" aria-labelledby="mandate-steps-heading">
                {copy.mandate.steps.map((step) => (
                  <li key={step.title} className={styles.mandateStep}>
                    <span className={bandStyles.conditionMark} aria-hidden="true">
                      <Check size={14} strokeWidth={2.5} />
                    </span>
                    <h4>{step.title}</h4>
                    <p className={styles.body}>{step.body}</p>
                  </li>
                ))}
              </ol>
            </ExecutionReveal>
          </div>
        </div>
      </section>
      {showFundSearch && team}
    </>
  );
};
