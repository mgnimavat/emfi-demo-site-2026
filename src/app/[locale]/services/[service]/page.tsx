import { notFound } from 'next/navigation';
import { locales, isLocale } from '@/lib/i18n';
import { serviceDictionaries } from '@/lib/i18n/service-dictionaries';
import { LocalizedServicePageSection, servicePages, isServicePage } from '@/containers/Sections/LocalizedServicePageSection';

type PageProps = { params: Promise<{ locale: string; service: string }> };
export const dynamicParams = false;
export const generateStaticParams = () => locales.flatMap((locale) =>
  Object.keys(servicePages).map((service) => ({ locale, service }))
);
export const generateMetadata = async ({ params }: PageProps) => {
  const { locale, service } = await params;
  if (!isLocale(locale) || !isServicePage(service)) notFound();
  const copy = serviceDictionaries[locale][servicePages[service]];
  return {
    title: copy.title,
    description: copy.description,
    alternates: { languages: Object.fromEntries(locales.map((language) =>
      [language, `/${language}/services/${service}`]
    )) },
  };
};
const LocalizedServicePage = async ({ params }: PageProps) => {
  const { locale, service } = await params;
  if (!isLocale(locale) || !isServicePage(service)) notFound();
  return <LocalizedServicePageSection service={service} locale={locale} />;
};
export default LocalizedServicePage;
