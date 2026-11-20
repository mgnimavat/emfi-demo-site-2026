import Image from 'next/image';
import { ExecutionReveal } from '@/components/sections/execution/reveal';
import { PersonCard } from '@/components/sections/person-card';
import { wealthProviderAssets } from '@/content/wealth-provider-assets';
import type { AboutCopy } from '@/lib/i18n';
import type { ResearchCopy, WealthCopy } from '@/lib/i18n/service-dictionaries';
import { SettlementDashboard } from './SettlementDashboard';
import theme from '@/components/sections/archive/theme.module.css';
import styles from './WealthServiceSections.module.css';
import reveal from './ProviderCardReveal.module.css';

const portfolioResearchNames = new Set([
  'Guillermo Guerrero',
  'Albani Granado',
  'Rosamnis Marcano',
  'Matias Montes',
]);

export const WealthServiceSections = ({ copy, researchTeam, aboutPeople, archiveFund = false }: {
  copy: WealthCopy['redesign'];
  researchTeam: ResearchCopy['team'];
  aboutPeople: readonly AboutCopy['people'][number][];
  archiveFund?: boolean;
}) => (
  <>
    <section id="fund-structure" className={`${styles.section} ${styles.soft} ${styles.fundStructure}`}
      aria-labelledby="fund-structure-heading">
      <div className={archiveFund ? `${styles.container} ${styles.fundArchiveLayout}` : styles.container}>
        <div className={styles.fundIntroduction}>
          <ExecutionReveal>
            <h2 id="fund-structure-heading" className={styles.title}>
              {(archiveFund ? copy.fund.archive.titleLines : copy.fund.titleLines)
                .map((line) => <span key={line}>{line}</span>)}
            </h2>
          </ExecutionReveal>
          <ExecutionReveal delay={0.12} className={archiveFund ? styles.fundArchiveCopy : undefined}>
            <p className={styles.lead}>{copy.fund.lead}</p>
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
                <li key={provider.id} className={`${styles.provider} ${reveal.card}`}
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
    <section id="investment-mandate" className={`${styles.section} ${styles.mandateSection}`}
      aria-labelledby="mandate-heading">
      <div className={styles.container}>
        <div className={styles.mandateLayout}>
          <ExecutionReveal className={styles.mandateIntro}>
            <h2 id="mandate-heading" className={styles.mandateTitle}>
              {copy.mandate.titleLines.map((line) => <span key={line}>{line}{' '}</span>)}
            </h2>
            <p className={styles.mandateLead}>{copy.mandate.body}</p>
          </ExecutionReveal>
          <ExecutionReveal delay={0.12}>
            <ol className={styles.mandateSteps} role="list">
              {copy.mandate.steps.map((step, index) => (
                <li key={step.title} className={styles.mandateStep}>
                  <span className={styles.mandateNumber} aria-hidden="true">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className={styles.mandateStepCopy}>
                    <h3>{step.title}</h3>
                    <p className={styles.body}>{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </ExecutionReveal>
        </div>
      </div>
    </section>
    <section id="portfolio-visibility" className={`${styles.section} ${styles.navy}`} aria-labelledby="portfolio-visibility-heading">
      <div className={styles.container}>
        <ExecutionReveal className={styles.visibilityIntro}>
          <h2 id="portfolio-visibility-heading" className={`${theme.sectionTitle} ${styles.visibilityTitle}`}>
            {copy.visibility.titleLines.join(' ')}
          </h2>
          <p className={styles.visibilityDescription}>{copy.visibility.body}</p>
        </ExecutionReveal>
        <ExecutionReveal><SettlementDashboard /></ExecutionReveal>
      </div>
    </section>
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
  </>
);
