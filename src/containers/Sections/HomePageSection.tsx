import { ServiceLocaleProvider } from '@/ui/hooks/useServiceLocale';
import type { Locale } from '@/lib/i18n';
import { getMarketingMessages, marketingDictionaries } from '@/lib/i18n/marketing-dictionaries';
import localeStyles from './LocalizedMarketingPageSection.module.css';
import { EmfiSections } from "@/components/emfi-sections/emfi-sections";
import { PrinciplesSection } from "@/components/home/principles/principles";
import { QuestionnaireSection } from "@/components/home/questionnaire/questionnaire";
import styles from "@/components/sections/home-12/landing.module.css";
import "@/app/home-16/home-16.css";
import "@/app/home.css";

export const HomePageSection = ({ locale = 'en' }: { locale?: Locale }) => {
  const copy = marketingDictionaries[locale].home;
  return (
    <ServiceLocaleProvider locale={locale} messages={getMarketingMessages(locale)}>
    <div lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} className={`home-16-shell home-page ${localeStyles.page}`}>

      <div className={`${styles.page} ${styles.fullHero} ${styles.spinMark}`}>
        <EmfiSections showPoints={false} showRouteTitle loop stepLabel="Handover" highlightSlides standardsEyebrow lightBands markFill={false} homeSlides omitSecondSlide perspectivePhones floatingPhones brandLogos whyTimeline blendHeader directPace="home12" responsiveBody="Technology that works. People who respond." dependableBody="Institutional safeguards. Clear accountability." routeTitles={{ conventional: "Conventional Route", direct: "EMFI Route" }} directEyebrow="EMFI IS" directBody="Fewer intermediaries. Fewer handovers." whySticky heroCue trimChrome home15Trade shortWhy brandInk settlementDash />
      </div>
      <PrinciplesSection stacked copy={copy.principles} />
      <QuestionnaireSection copy={copy.questionnaire} />
    </div>
    </ServiceLocaleProvider>
  );
};
