import { ServiceLocaleProvider } from '@/ui/hooks/useServiceLocale';
import type { Locale } from '@/lib/i18n';
import { getMarketingMessages, marketingDictionaries } from '@/lib/i18n/marketing-dictionaries';
import localeStyles from './LocalizedMarketingPageSection.module.css';
import { EmfiSections } from "@/components/home-24/emfi-sections/emfi-sections";
import { QuestionnaireSection } from "@/components/home-24/questionnaire/questionnaire";
import styles from "@/components/home-24/landing.module.css";
import "@/app/home-16/home-16.css";
import "@/app/home.css";

export const Home24PageSection = ({ locale = 'en' }: { locale?: Locale }) => {
  const copy = marketingDictionaries[locale].home;
  return (
    <ServiceLocaleProvider locale={locale} messages={getMarketingMessages(locale)}>
    <div lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} className={`home-16-shell home-page home-24 ${localeStyles.page}`}>

      <div className={`${styles.page} ${styles.fullHero} ${styles.spinMark}`}>
        <EmfiSections showRouteTitle loop stepLabel="Handover" highlightSlides standardsEyebrow lightBands markFill={false} homeSlides omitSecondSlide perspectivePhones floatingPhones brandLogos whyTimeline blendHeader directPace="home12" responsiveBody="Technology that works. People who respond." dependableBody="Institutional safeguards. Clear accountability." routeTitles={{ conventional: "Conventional Route", direct: "EMFI Route" }} directBody="Fewer intermediaries. Fewer handovers." whySticky heroCue trimChrome home15Trade shortWhy brandInk settlementDash splitWhy />
      </div>
      <QuestionnaireSection copy={copy.questionnaire} />
    </div>
    </ServiceLocaleProvider>
  );
};
