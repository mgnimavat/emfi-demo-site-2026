import { ServiceLocaleProvider } from '@/ui/hooks/useServiceLocale';
import type { Locale } from '@/lib/i18n';
import { getMarketingMessages, marketingDictionaries } from '@/lib/i18n/marketing-dictionaries';
import { whyPageDictionaries } from '@/lib/i18n/why-page-dictionaries';
import { DirectAccessPageSection } from './DirectAccessPageSection';
import { ResponsiveTechnologyPageSection } from './ResponsiveTechnologyPageSection';
import { DependableOperationsPageSection } from './DependableOperationsPageSection';
import { DependableContentPage, DirectContentPage, ResponsiveContentPage } from './WhyServicePages';
import styles from './LocalizedMarketingPageSection.module.css';

const whyPages = {
  'direct-access': 'direct',
  'responsive-technology': 'responsive',
  'dependable-operations': 'dependable',
} as const;
export type WhyPage = keyof typeof whyPages;
const isWhyPage = (value: string): value is WhyPage => Object.hasOwn(whyPages, value);
export const whySlugs = Object.keys(whyPages).flatMap((page) => [page, `${page}-old`]);

export const resolveWhyPage = (slug: string) => {
  const archived = slug.endsWith('-old');
  const page = archived ? slug.slice(0, -'-old'.length) : slug;
  return isWhyPage(page) ? { page, archived } : null;
};

export const getWhyPageMetadata = (page: WhyPage, locale: Locale = 'en', archived = false) => {
  const copy = (archived ? marketingDictionaries : whyPageDictionaries)[locale][whyPages[page]];
  return { title: copy.title, description: copy.description };
};

export const LocalizedWhyPageSection = ({ page, locale = 'en', archived = false }: {
  page: WhyPage;
  locale?: Locale;
  archived?: boolean;
}) => {
  const previous = marketingDictionaries[locale];
  const current = whyPageDictionaries[locale];
  return (
    <ServiceLocaleProvider locale={locale} messages={getMarketingMessages(locale)}>
      <div data-why-page={page} lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} className={styles.page}>
        {page === 'direct-access' ? (
          archived ? <DirectAccessPageSection copy={previous.direct} /> : (
            <DirectContentPage copy={current.direct} heroCopy={previous.direct} locale={locale} />
          )
        ) : page === 'responsive-technology' ? (
          archived ? <ResponsiveTechnologyPageSection copy={previous.responsive} /> : (
            <ResponsiveContentPage copy={current.responsive} heroCopy={previous.responsive}
              workflowSteps={previous.responsive.specialist.steps} />
          )
        ) : archived ? <DependableOperationsPageSection copy={previous.dependable} /> : (
          <DependableContentPage copy={current.dependable} heroCopy={previous.dependable} />
        )}
      </div>
    </ServiceLocaleProvider>
  );
};
