import { notFound } from 'next/navigation';
import { locales, isLocale } from '@/lib/i18n';
import { serviceDictionaries } from '@/lib/i18n/service-dictionaries';
import { LocalizedServicePageSection, servicePages, isServicePage } from '@/containers/Sections/LocalizedServicePageSection';

type PageProps = { params: Promise<{ locale: string; service: string }> };
const settlementArchive = 'settlement-custody-archive';
const resolveService = (service: string) => service === settlementArchive ? 'settlement-custody' : service;

export const dynamicParams = false;
export const generateStaticParams = () => locales.flatMap((locale) =>
  [...Object.keys(servicePages), settlementArchive].map((service) => ({ locale, service }))
);
export const generateMetadata = async ({ params }: PageProps) => {
  const { locale, service } = await params;
  const servicePage = resolveService(service);
  if (!isLocale(locale) || !isServicePage(servicePage)) notFound();
  const copy = serviceDictionaries[locale][servicePages[servicePage]];
  return {
    title: copy.title,
    description: copy.description,
    ...(service === settlementArchive && { robots: { index: false, follow: true } }),
    alternates: { languages: Object.fromEntries(locales.map((language) =>
      [language, `/${language}/services/${service}`]
    )) },
  };
};
const LocalizedServicePage = async ({ params }: PageProps) => {
  const { locale, service } = await params;
  const servicePage = resolveService(service);
  if (!isLocale(locale) || !isServicePage(servicePage)) notFound();
  return <LocalizedServicePageSection service={servicePage} locale={locale}
    settlementVariant={service === settlementArchive ? 'archive' : undefined} />;
};
export default LocalizedServicePage;
