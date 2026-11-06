import { notFound } from 'next/navigation';
import { locales, isLocale, localizeHref } from '@/lib/i18n';
import { marketingDictionaries } from '@/lib/i18n/marketing-dictionaries';
import { LocalizedWhyPageSection, whyPages, isWhyPage } from '@/containers/Sections/LocalizedWhyPageSection';

type PageProps = { params: Promise<{ locale: string; page: string }> };
export const dynamicParams = false;
export const generateStaticParams = () => locales.flatMap((locale) =>
  Object.keys(whyPages).map((page) => ({ locale, page }))
);
export const generateMetadata = async ({ params }: PageProps) => {
  const { locale, page } = await params;
  if (!isLocale(locale) || !isWhyPage(page)) notFound();
  const copy = marketingDictionaries[locale][whyPages[page]];
  return {
    title: copy.title,
    description: copy.description,
    alternates: { languages: Object.fromEntries(locales.map((language) =>
      [language, localizeHref(`/why-emfi/${page}`, language)]
    )) },
  };
};
const LocalizedWhyPage = async ({ params }: PageProps) => {
  const { locale, page } = await params;
  if (!isLocale(locale) || !isWhyPage(page)) notFound();
  return <LocalizedWhyPageSection page={page} locale={locale} />;
};
export default LocalizedWhyPage;
