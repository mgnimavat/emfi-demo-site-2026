import enAbout from '@/content/locales/en/about.json';
import enContact from '@/content/locales/en/contact.json';
import enCommon from '@/content/locales/en/common.json';
import esAbout from '@/content/locales/es/about.json';
import esContact from '@/content/locales/es/contact.json';
import esCommon from '@/content/locales/es/common.json';
import arAbout from '@/content/locales/ar/about.json';
import arContact from '@/content/locales/ar/contact.json';
import arCommon from '@/content/locales/ar/common.json';

import type { Locale } from './routing';
export { locales, isLocale, localizedPaths, isLocalizedPath, getBasePath, getPageLocale, localizeHref } from './routing';
export type { Locale } from './routing';
export type AboutCopy = typeof enAbout;
export type ContactCopy = typeof enContact;
export type CommonCopy = typeof enCommon;
export const dictionaries = {
  en: { about: enAbout, contact: enContact, common: enCommon },
  es: { about: esAbout, contact: esContact, common: esCommon },
  ar: { about: arAbout, contact: arContact, common: arCommon },
} satisfies Record<Locale, { about: AboutCopy; contact: ContactCopy; common: CommonCopy }>;

