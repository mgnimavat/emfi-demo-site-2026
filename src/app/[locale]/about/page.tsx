import { notFound } from 'next/navigation';
import { AboutPageSection } from '@/containers/Sections/AboutPageSection';
import { dictionaries, isLocale, locales } from '@/lib/i18n';

type PageProps = { params: Promise<{ locale: string }> };
export const generateStaticParams = () => locales.map((locale) => ({ locale }));
export const dynamicParams = false;
export const generateMetadata = async ({ params }: PageProps) => {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = dictionaries[locale].about;
  return { title: copy.title, description: copy.description, alternates: { languages: { en: '/en/about', es: '/es/about', ar: '/ar/about' } } };
};
const LocalizedPage = async ({ params }: PageProps) => {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <AboutPageSection locale={locale} />;
};
export default LocalizedPage;
