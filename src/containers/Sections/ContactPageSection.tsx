import { ContactEnquirySection } from '@/containers/Sections/ContactEnquirySection';
import { About1Locations } from '@/components/sections/about-1-locations';
import { dictionaries, type Locale } from '@/lib/i18n';
import styles from '@/components/sections/contact/contact.module.css';

export const ContactPageSection = ({ locale = 'en' }: { locale?: Locale }) => (
  <div lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} className={`localized-page ${styles.page}`}>
    <ContactEnquirySection copy={dictionaries[locale].contact} />
    <About1Locations copy={dictionaries[locale].common} />
  </div>
);
