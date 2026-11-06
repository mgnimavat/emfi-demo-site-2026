import { ServiceLocaleProvider } from '@/ui/hooks/useServiceLocale';
import type { Locale } from '@/lib/i18n';
import { getMarketingMessages, marketingDictionaries } from '@/lib/i18n/marketing-dictionaries';
import { DirectAccessPageSection } from './DirectAccessPageSection';
import { ResponsiveTechnologyPageSection } from './ResponsiveTechnologyPageSection';
import { DependableOperationsPageSection } from './DependableOperationsPageSection';
import styles from './LocalizedMarketingPageSection.module.css';

export const whyPages = {
  'direct-access': 'direct',
  'responsive-technology': 'responsive',
  'dependable-operations': 'dependable',
} as const;
export type WhyPage = keyof typeof whyPages;
export const isWhyPage = (value: string): value is WhyPage => Object.hasOwn(whyPages, value);

export const LocalizedWhyPageSection = ({ page, locale = 'en' }: {
  page: WhyPage;
  locale?: Locale;
}) => {
  const dictionary = marketingDictionaries[locale];
  return (
    <ServiceLocaleProvider locale={locale} messages={getMarketingMessages(locale)}>
      <div data-why-page={page} lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} className={styles.page}>
        {page === 'direct-access' ? <DirectAccessPageSection copy={dictionary.direct} /> :
          page === 'responsive-technology' ? <ResponsiveTechnologyPageSection copy={dictionary.responsive} /> :
            <DependableOperationsPageSection copy={dictionary.dependable} />}
      </div>
    </ServiceLocaleProvider>
  );
};
