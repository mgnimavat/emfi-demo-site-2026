import { notFound } from 'next/navigation';
import { ContactPageSection } from '@/containers/Sections/ContactPageSection';
import { dictionaries, isLocale, locales } from '@/lib/i18n';

type PageProps = { params: Promise<{ locale: string }> };
export const generateStaticParams = () => locales.map((locale) => ({ locale }));
export const dynamicParams = false;
export const generateMetadata = async ({ params }: PageProps) => {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = dictionaries[locale].contact;
  return { title: copy.title, description: copy.description, alternates: { languages: { en: '/en/contact', es: '/es/contact', ar: '/ar/contact' } } };
};
const LocalizedPage = async ({ params }: PageProps) => {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <ContactPageSection locale={locale} />;
};
export default LocalizedPage;
