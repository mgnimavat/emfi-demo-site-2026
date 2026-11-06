import { notFound } from 'next/navigation';
import { HomePageSection } from '@/containers/Sections/HomePageSection';
import { isLocale, locales, localizeHref } from '@/lib/i18n';
import { marketingDictionaries } from '@/lib/i18n/marketing-dictionaries';

type PageProps = { params: Promise<{ locale: string }> };
export const dynamicParams = false;
export const generateStaticParams = () => locales.map((locale) => ({ locale }));
export const generateMetadata = async ({ params }: PageProps) => {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = marketingDictionaries[locale].home;
  return {
    title: { absolute: copy.title },
    description: copy.description,
    alternates: { languages: Object.fromEntries(locales.map((language) =>
      [language, localizeHref('/', language)]
    )) },
  };
};
const LocalizedHomePage = async ({ params }: PageProps) => {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <HomePageSection locale={locale} />;
};
export default LocalizedHomePage;
