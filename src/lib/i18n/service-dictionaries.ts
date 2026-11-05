import enResearch from '@/content/locales/en/research.json';
import esResearch from '@/content/locales/es/research.json';
import arResearch from '@/content/locales/ar/research.json';
import enSettlement from '@/content/locales/en/settlement.json';
import esSettlement from '@/content/locales/es/settlement.json';
import arSettlement from '@/content/locales/ar/settlement.json';
import enWealth from '@/content/locales/en/wealth.json';
import esWealth from '@/content/locales/es/wealth.json';
import arWealth from '@/content/locales/ar/wealth.json';
import type { Locale } from './index';

export type ServiceMessages = Readonly<Record<string, string>>;
export type ResearchCopy = Omit<typeof enResearch, 'ui'> & { ui: ServiceMessages };
export type SettlementCopy = Omit<typeof enSettlement, 'ui'> & { ui: ServiceMessages };
export type WealthCopy = Omit<typeof enWealth, 'ui'> & { ui: ServiceMessages };
export const serviceDictionaries = {
  en: { research: enResearch, settlement: enSettlement, wealth: enWealth },
  es: { research: esResearch, settlement: esSettlement, wealth: esWealth },
  ar: { research: arResearch, settlement: arSettlement, wealth: arWealth },
} satisfies Record<Locale, { research: ResearchCopy; settlement: SettlementCopy; wealth: WealthCopy }>;
