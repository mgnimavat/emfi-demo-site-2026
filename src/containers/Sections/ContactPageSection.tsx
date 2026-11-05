import { ContactEnquirySection } from '@/containers/Sections/ContactEnquirySection';
import { About1Locations } from '@/components/sections/about-1-locations';
import { dictionaries, type Locale } from '@/lib/i18n';

export const ContactPageSection = ({ locale = 'en' }: { locale?: Locale }) => (
  <div lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} className="localized-page">
    <ContactEnquirySection copy={dictionaries[locale].contact} />
    <About1Locations copy={dictionaries[locale].common} />
  </div>
);
