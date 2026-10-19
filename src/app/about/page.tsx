import { CurvedBand } from "@/components/layout/curved-band";
import { about } from "@/content/about";
import { FadeIn } from "@/components/motion/fade-in";
import { AboutHero } from "@/components/sections/about-hero";
import { AboutTimeline } from "@/components/sections/about-timeline";
import { PersonCard } from "@/components/sections/person-card";
import { ProfessionalStanding } from "@/components/sections/professional-standing";
import { ArchiveCta } from "@/components/sections/archive/cta";
import styles from "@/components/sections/archive/theme.module.css";

export const metadata = { title: "About", description: about.body };

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <CurvedBand nextBackground="#071932"><AboutHero /></CurvedBand>
      <CurvedBand nextBackground="#fff"><AboutTimeline /></CurvedBand><div className={styles.legacy}><CurvedBand nextBackground="#f4f7fb" background="#fff"><ProfessionalStanding /></CurvedBand></div>
      <CurvedBand nextBackground="#f4f7fb"><section className={`${styles.section} ${styles.soft}`} aria-labelledby="people-heading">
        <div className={styles.container}>
          <FadeIn className={styles.peopleIntro}><h2 id="people-heading" className={styles.sectionTitle}>{about.peopleTitle}</h2><p className={styles.sectionBody}>{about.peopleBody}</p></FadeIn>
          <div className={styles.personGrid}>{about.people.map((person, i) => <FadeIn key={person.name} delay={i * 0.04} className="h-full"><PersonCard person={person} /></FadeIn>)}</div>
        </div>
      </section></CurvedBand>
      <CurvedBand nextBackground="#0c1725"><ArchiveCta title={about.ctaTitle} body={about.ctaBody} action={about.ctaButton} /></CurvedBand>
    </div>
  );
}
