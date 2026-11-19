import ar from '@/content/locales/ar/why-pages.json';
import en from '@/content/locales/en/why-pages.json';
import es from '@/content/locales/es/why-pages.json';
import type { Locale } from './routing';

export type WhyPageCopy = typeof en;
export const whyPageDictionaries = { en, es, ar } satisfies Record<Locale, WhyPageCopy>;
