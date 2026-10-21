import { CurvedBand } from "@/components/layout/curved-band";
import { about } from "@/content/about";
import { FadeIn } from "@/components/motion/fade-in";
import { AboutHero } from "@/components/sections/about-hero";
import { AboutTimeline } from "@/components/sections/about-timeline";
import { PersonCardSmall } from "@/components/sections/person-card-small";
import cardStyles from "@/components/sections/person-card-small.module.css";
import { ArchiveCta } from "@/components/sections/archive/cta";
import styles from "@/components/sections/archive/theme.module.css";

export const metadata = {
  title: "About (small cards)",
  description: about.body,
  robots: { index: false, follow: true },
};

export default function AboutSmallPage() {
  return (
    <div className={styles.page}>
      <CurvedBand nextBackground="#071932"><AboutHero /></CurvedBand>
      <CurvedBand nextBackground="#f4f7fb"><AboutTimeline /></CurvedBand>
      <CurvedBand nextBackground="#dce8f8"><section className={`${styles.section} ${styles.soft}`} aria-labelledby="people-heading">
        <div className={styles.container}>
          <FadeIn className={styles.peopleIntro}><h2 id="people-heading" className={styles.sectionTitle}>{about.peopleTitle}</h2><p className={styles.sectionBody}>{about.peopleBody}</p></FadeIn>
          <div className={cardStyles.grid}>{about.people.map((person, i) => <FadeIn key={person.name} delay={i * 0.04} className="h-full"><PersonCardSmall person={person} /></FadeIn>)}</div>
        </div>
      </section></CurvedBand>
      <CurvedBand nextBackground="#071932"><ArchiveCta className={styles.ctaBlue} title={about.ctaTitle} body={about.ctaBody} action={about.ctaButton} /></CurvedBand>
    </div>
  );
}
