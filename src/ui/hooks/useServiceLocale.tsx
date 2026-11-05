'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { Locale } from '@/lib/i18n';
import type { ServiceMessages } from '@/lib/i18n/service-dictionaries';

type ServiceLocale = { locale: Locale; messages: ServiceMessages };
const ServiceLocaleContext = createContext<ServiceLocale>({ locale: 'en', messages: {} });

export const ServiceLocaleProvider = ({ locale, messages, children }: ServiceLocale & { children: ReactNode }) => (
  <ServiceLocaleContext.Provider value={{ locale, messages }}>
    {children}
  </ServiceLocaleContext.Provider>
);

export const useServiceLocale = () => {
  const { locale, messages } = useContext(ServiceLocaleContext);
  const t = (value: string): string => messages[value] ?? value;
  return { locale, t };
};
