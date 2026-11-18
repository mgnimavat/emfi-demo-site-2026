import { notFound } from 'next/navigation';
import { locales, isLocale, localizeHref } from '@/lib/i18n';
import { getWhyPageMetadata, LocalizedWhyPageSection, resolveWhyPage, whySlugs } from '@/containers/Sections/LocalizedWhyPageSection';

type PageProps = { params: Promise<{ locale: string; page: string }> };
export const dynamicParams = false;
export const generateStaticParams = () => locales.flatMap((locale) =>
  whySlugs.map((page) => ({ locale, page }))
);
export const generateMetadata = async ({ params }: PageProps) => {
  const { locale, page } = await params;
  const route = resolveWhyPage(page);
  if (!isLocale(locale) || !route) notFound();
  return {
    ...getWhyPageMetadata(route.page, locale, route.archived),
    alternates: { languages: Object.fromEntries(locales.map((language) =>
      [language, localizeHref(`/why-emfi/${page}`, language)]
    )) },
  };
};
const LocalizedWhyPage = async ({ params }: PageProps) => {
  const { locale, page } = await params;
  const route = resolveWhyPage(page);
  if (!isLocale(locale) || !route) notFound();
  return <LocalizedWhyPageSection {...route} locale={locale} />;
};
export default LocalizedWhyPage;
