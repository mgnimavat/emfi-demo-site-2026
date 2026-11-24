import { notFound } from 'next/navigation';
import { locales, isLocale } from '@/lib/i18n';
import { serviceDictionaries } from '@/lib/i18n/service-dictionaries';
import { LocalizedServicePageSection, servicePages, isServicePage, type ServicePage } from '@/containers/Sections/LocalizedServicePageSection';

type PageProps = { params: Promise<{ locale: string; service: string }> };
const archiveServices = new Map<string, ServicePage>([
  ['settlement-custody-archive', 'settlement-custody'],
  ['wealth-asset-management-archive', 'wealth-asset-management'],
]);

export const dynamicParams = false;
export const generateStaticParams = () => locales.flatMap((locale) =>
  [...Object.keys(servicePages), ...archiveServices.keys()].map((service) => ({ locale, service }))
);
export const generateMetadata = async ({ params }: PageProps) => {
  const { locale, service } = await params;
  const archiveService = archiveServices.get(service);
  const servicePage = archiveService ?? service;
  if (!isLocale(locale) || !isServicePage(servicePage)) notFound();
  const copy = serviceDictionaries[locale][servicePages[servicePage]];
  return {
    title: servicePage === 'wealth-asset-management'
      ? serviceDictionaries[locale].wealth.redesign.hero.title
      : copy.title,
    description: copy.description,
    ...(archiveService && { robots: { index: false, follow: true } }),
    alternates: { languages: Object.fromEntries(locales.map((language) =>
      [language, `/${language}/services/${service}`]
    )) },
  };
};
const LocalizedServicePage = async ({ params }: PageProps) => {
  const { locale, service } = await params;
  const archiveService = archiveServices.get(service);
  const servicePage = archiveService ?? service;
  if (!isLocale(locale) || !isServicePage(servicePage)) notFound();
  return <LocalizedServicePageSection service={servicePage} locale={locale}
    settlementVariant={service === 'settlement-custody' ? 'archive' : undefined}
    wealthVariant={archiveService === 'wealth-asset-management' ? 'archive' : undefined} />;
};
export default LocalizedServicePage;
