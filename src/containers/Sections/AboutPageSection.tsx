import { FadeIn } from '@/components/motion/fade-in';
import { About1Locations } from '@/components/sections/about-1-locations';
import { AboutEntities } from '@/components/sections/about-entities';
import { AboutMarket } from '@/components/sections/about-market';
import { AboutTimeline } from '@/components/sections/about-timeline';
import { PersonCard } from '@/components/sections/person-card';
import { dictionaries, type Locale } from '@/lib/i18n';
import styles from '@/components/sections/archive/theme.module.css';
import '@/app/about/about.css';

export const AboutPageSection = ({ locale = 'en' }: { locale?: Locale }) => {
  const { about, common } = dictionaries[locale];
  return (
    <div lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} className={`${styles.page} about-page localized-page`}>
      <AboutMarket copy={about} />
      <AboutTimeline headingAs="h2" showCounter={false} showMark={false} copy={about} />
      <AboutEntities copy={about} />
      <section className={styles.peopleBand} aria-labelledby="people-heading">
        <div className={styles.section}>
          <div className={styles.container}>
            <FadeIn className={styles.peopleIntro}><h2 id="people-heading" className={styles.sectionTitle}>{about.peopleTitle}</h2></FadeIn>
            <div className={styles.personGrid}>
              {about.people.map((person, index) =>
                "spacer" in person && person.spacer ? (
                  <div key={`spacer-${index}`} className={styles.personSpacer} aria-hidden="true" />
                ) : (
                  <FadeIn key={person.name} delay={index * 0.04} className="h-full">
                    <PersonCard person={person} boardLabel={about.boardLabel} />
                  </FadeIn>
                ),
              )}
            </div>
          </div>
        </div>
      </section>
      <About1Locations copy={common} />
    </div>
  );
};
