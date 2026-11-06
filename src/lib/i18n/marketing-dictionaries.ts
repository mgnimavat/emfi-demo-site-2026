import enHome from '@/content/locales/en/home.json';
import enDirect from '@/content/locales/en/direct.json';
import enResponsive from '@/content/locales/en/responsive.json';
import enDependable from '@/content/locales/en/dependable.json';
import enMarketingUi from '@/content/locales/en/marketing-ui.json';
import esHome from '@/content/locales/es/home.json';
import esDirect from '@/content/locales/es/direct.json';
import esResponsive from '@/content/locales/es/responsive.json';
import esDependable from '@/content/locales/es/dependable.json';
import esMarketingUi from '@/content/locales/es/marketing-ui.json';
import arHome from '@/content/locales/ar/home.json';
import arDirect from '@/content/locales/ar/direct.json';
import arResponsive from '@/content/locales/ar/responsive.json';
import arDependable from '@/content/locales/ar/dependable.json';
import arMarketingUi from '@/content/locales/ar/marketing-ui.json';
import type { Locale } from './routing';
import { serviceDictionaries, type ServiceMessages } from './service-dictionaries';

export type HomeCopy = typeof enHome;
export type DirectCopy = typeof enDirect;
export type ResponsiveCopy = typeof enResponsive;
export type DependableCopy = typeof enDependable;
export const marketingDictionaries = {
  en: { home: enHome, direct: enDirect, responsive: enResponsive, dependable: enDependable },
  es: { home: esHome, direct: esDirect, responsive: esResponsive, dependable: esDependable },
  ar: { home: arHome, direct: arDirect, responsive: arResponsive, dependable: arDependable },
} satisfies Record<Locale, { home: HomeCopy; direct: DirectCopy; responsive: ResponsiveCopy; dependable: DependableCopy }>;
const marketingMessages = { en: enMarketingUi, es: esMarketingUi, ar: arMarketingUi };
export const getMarketingMessages = (locale: Locale): ServiceMessages => ({
  ...serviceDictionaries[locale].research.ui,
  ...serviceDictionaries[locale].settlement.ui,
  ...serviceDictionaries[locale].wealth.ui,
  ...marketingMessages[locale],
});
