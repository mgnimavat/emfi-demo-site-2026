import { ResearchToTrade } from '@/components/sections/execution/research-to-trade';
import { ExecutionReveal } from '@/components/sections/execution/reveal';
import { ExecutionHeroTitle } from '@/components/sections/execution/hero-title';
import { ResearchSection } from '@/components/sections/execution/research-section';
import { WorkstationSection } from '@/components/sections/execution/workstation-section';
import { ResearchDisclosures } from '@/components/sections/execution/research-disclosures';
import { ServiceHero } from './ServiceHero';
import { SettlementCustodySections } from './SettlementCustodySections';
import { SettlementHeroAnimation } from './SettlementHeroAnimation';
import { PrinciplesSection } from '@/components/home/principles/principles';
import { getMarketingMessages, marketingDictionaries } from '@/lib/i18n/marketing-dictionaries';
import { dictionaries } from '@/lib/i18n';
import { ResearchOfficeSection } from './ResearchOfficeSection';
import { WealthAssetSections } from './WealthAssetSections';
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
}: { service: ServicePage; locale?: Locale; researchVariant?: 'current' | 'archived'; settlementVariant?: 'current' | 'archived' }) => {
  const dictionary = serviceDictionaries[locale];
  const messages = dictionary[servicePages[service]].ui;
  const research = service === 'research-execution';
  const copy = service === 'settlement-custody' ? dictionary.settlement : dictionary.wealth;
  return (
    <ServiceLocaleProvider locale={locale} messages={messages}>
      <div data-service={service} data-research-variant={research ? researchVariant : undefined}
        data-settlement-variant={service === 'settlement-custody' ? settlementVariant : undefined}
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
            <WorkstationSection copy={dictionary.research} maskVariant="blur" />
            {researchVariant === 'current' ? (
              <ResearchOfficeSection copy={dictionaries[locale].common}
                disclosures={dictionary.research.disclosures} />
            ) : <ResearchDisclosures copy={dictionary.research} />}
          </>
        ) : (
          <>
            {service === 'settlement-custody' && settlementVariant === 'current' ? (
              <PrinciplesSection stacked hero copy={marketingDictionaries[locale].home.principles}
                cueHref="#settlement"
                cueLabel={getMarketingMessages(locale)["Let's Talk"]} />
            ) : <ServiceHero key={locale} lines={copy.heroLines} phrases={copy.heroPhrases}
              typewriter={copy.heroTypewriter}
              visual={service === 'settlement-custody' ? <SettlementHeroAnimation /> : undefined}
              taglineClassName={service === 'wealth-asset-management' ? heroStyles.wealthTagline : undefined}
              headlineClassName={service === 'wealth-asset-management' ? heroStyles.wideHeadline : undefined} />}
            {service === 'settlement-custody' ? (
              <SettlementCustodySections copy={dictionary.settlement}
                officeCopy={settlementVariant === 'current' ? dictionaries[locale].common : undefined} />
            ) : <WealthAssetSections copy={dictionary.wealth} locale={locale}
              officeCopy={dictionaries[locale].common} />}
          </>
        )}
      </div>
    </ServiceLocaleProvider>
  );
};
