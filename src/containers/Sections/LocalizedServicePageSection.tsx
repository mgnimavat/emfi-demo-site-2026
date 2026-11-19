import { ResearchToTrade } from '@/components/sections/execution/research-to-trade';
import { ExecutionReveal } from '@/components/sections/execution/reveal';
import { ExecutionHeroTitle } from '@/components/sections/execution/hero-title';
import { ResearchSection } from '@/components/sections/execution/research-section';
import { WorkstationSection } from '@/components/sections/execution/workstation-section';
import { ExecutionVenuesSection } from './ExecutionVenuesSection';
import { ResearchTeamSection } from './ResearchTeamSection';
import { IntelligenceSignupSection } from './IntelligenceSignupSection';
import { ResearchDisclosures } from '@/components/sections/execution/research-disclosures';
import { ServiceHero } from './ServiceHero';
import { SettlementCustodySections } from './SettlementCustodySections';
import { SettlementServiceSections } from './SettlementServiceSections';
import { SettlementQuestionnaireSection } from './SettlementQuestionnaireSection';
import { OfficeContactSection } from './OfficeContactSection';
import { SettlementHeroAnimation } from './SettlementHeroAnimation';
import { PrinciplesSection } from '@/components/home/principles/principles';
import { getMarketingMessages, marketingDictionaries } from '@/lib/i18n/marketing-dictionaries';
import { dictionaries } from '@/lib/i18n';
import { ResearchOfficeSection } from './ResearchOfficeSection';
import { WealthAssetSections } from './WealthAssetSections';
import { WealthServiceHero } from './WealthServiceHero';
import { WealthServiceSections } from './WealthServiceSections';
import { ServiceLocaleProvider } from '@/ui/hooks/useServiceLocale';
import { serviceDictionaries } from '@/lib/i18n/service-dictionaries';
import type { Locale } from '@/lib/i18n';
import theme from '@/components/sections/archive/theme.module.css';
import heroStyles from '@/components/sections/execution/page.module.css';
import styles from './ServicePage.module.css';
import localeStyles from './LocalizedServicePageSection.module.css';

export const servicePages = {
  'research-execution': 'research',
  'settlement-custody': 'settlement',
  'wealth-asset-management': 'wealth',
} as const;
export type ServicePage = keyof typeof servicePages;
export const isServicePage = (value: string): value is ServicePage =>
  Object.hasOwn(servicePages, value);

export const LocalizedServicePageSection = ({
  service,
  locale = 'en',
  researchVariant = 'current',
  settlementVariant = 'current',
  wealthVariant = 'current',
}: { service: ServicePage; locale?: Locale; researchVariant?: 'current' | 'archived'; settlementVariant?: 'current' | 'v1' | 'archived'; wealthVariant?: 'current' | 'v1' }) => {
  const dictionary = serviceDictionaries[locale];
  const messages = dictionary[servicePages[service]].ui;
  const research = service === 'research-execution';
  const copy = service === 'settlement-custody' ? dictionary.settlement : dictionary.wealth;
  const [londonEntity, dubaiEntity] = dictionary.settlement.disclosures.entities;
  return (
    <ServiceLocaleProvider locale={locale} messages={messages}>
      <div data-service={service} data-research-variant={research ? researchVariant : undefined}
        data-settlement-variant={service === 'settlement-custody' ? settlementVariant : undefined}
        data-wealth-variant={service === 'wealth-asset-management' ? wealthVariant : undefined}
        lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}
        className={`${research ? theme.page : styles.page} ${localeStyles.page}`}>
        {research ? (
          <>
            {researchVariant === 'archived' ? <section className={heroStyles.hero}>
              <div className={heroStyles.container}><div className={heroStyles.heroGrid}>
                <ExecutionReveal className={heroStyles.heroCopy}>
                  <ExecutionHeroTitle key={locale} headline={dictionary.research.headline}
                    prefix={dictionary.research.heroTitle.prefix} words={dictionary.research.heroTitle.words} />
                </ExecutionReveal>
                <ExecutionReveal delay={0.12} className={heroStyles.heroMedia}>
                  <ResearchToTrade />
                </ExecutionReveal>
              </div></div>
            </section> : null}
            <ResearchSection key={locale} copy={dictionary.research}
              appearance={researchVariant === 'current' ? 'light' : 'dark'}
              primaryHeading={researchVariant === 'current'} />
            {researchVariant === 'current' ? (
              <>
                <ExecutionVenuesSection copy={dictionary.research.executionVenues} />
                <ResearchTeamSection copy={dictionary.research.team} />
                <IntelligenceSignupSection copy={dictionary.research.signup} />
              </>
            ) : <WorkstationSection copy={dictionary.research} maskVariant="blur" />}
            {researchVariant === 'current' ? (
              <ResearchOfficeSection copy={dictionaries[locale].common}
                disclosures={dictionary.research.disclosures} />
            ) : <ResearchDisclosures copy={dictionary.research} />}
          </>
        ) : (
          <>
            {service === 'wealth-asset-management' && wealthVariant === 'current' ? (
              <WealthServiceHero copy={dictionary.wealth.redesign.hero} />
            ) : service === 'settlement-custody' && settlementVariant !== 'archived' ? (
              <PrinciplesSection stacked hero copy={marketingDictionaries[locale].home.principles}
                cueHref="#settlement"
                cueLabel={getMarketingMessages(locale)["Let's Talk"]} />
            ) : <ServiceHero key={locale} lines={copy.heroLines} phrases={copy.heroPhrases}
              typewriter={copy.heroTypewriter}
              visual={service === 'settlement-custody' ? <SettlementHeroAnimation /> : undefined}
              taglineClassName={service === 'wealth-asset-management' ? heroStyles.wealthTagline : undefined}
              headlineClassName={service === 'wealth-asset-management' ? heroStyles.wideHeadline : undefined} />}
            {service === 'settlement-custody' ? (
              settlementVariant === 'current' ? <>
                <SettlementServiceSections copy={dictionary.settlement} />
                <SettlementQuestionnaireSection copy={dictionary.settlement.questionnaire} />
                <OfficeContactSection copy={dictionaries[locale].common} officeCity="London"
                  sectionId="settlement-office" layout="columns" officeCities={['London', 'Dubai']}
                  officeEntityNames={{ London: [londonEntity.name] }}
                  officeDisclosures={{
                    London: <p><strong>{londonEntity.name}</strong> {londonEntity.body}</p>,
                    Dubai: <p><strong>{dubaiEntity.name}</strong> {dubaiEntity.body}</p>,
                  }} />
              </> :
              <SettlementCustodySections copy={dictionary.settlement}
                officeCopy={settlementVariant === 'v1' ? dictionaries[locale].common : undefined} />
            ) : wealthVariant === 'current' ? <>
              <WealthServiceSections copy={dictionary.wealth.redesign} researchTeam={dictionary.research.team} />
              <OfficeContactSection copy={dictionaries[locale].common} officeCity="Cayman" sectionId="wealth-office"
                layout="columns" officeCities={['Dubai', 'Cayman']}
                officeDisclosures={{
                  Dubai: <>
                    {dictionary.settlement.disclosures.entities.slice(1, 2).map((entity) => (
                      <p key={entity.name}><strong>{entity.name}</strong> {entity.body}</p>
                    ))}
                  </>,
                  Cayman: <p><strong>{dictionary.wealth.disclosures.entity}</strong> {dictionary.wealth.disclosures.introduction}</p>,
                }} />
            </> : <WealthAssetSections copy={dictionary.wealth} locale={locale}
              officeCopy={dictionaries[locale].common} />}
          </>
        )}
      </div>
    </ServiceLocaleProvider>
  );
};
