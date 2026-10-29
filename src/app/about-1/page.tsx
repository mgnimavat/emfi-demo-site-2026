import { about } from "@/content/about";
import { FadeIn } from "@/components/motion/fade-in";
import { AboutLocations } from "@/components/sections/about-locations";
import { AboutTimeline } from "@/components/sections/about-timeline";
import { PersonCard } from "@/components/sections/person-card";
import { ArchiveCta } from "@/components/sections/archive/cta";
import styles from "@/components/sections/archive/theme.module.css";

export const metadata = { title: "About", description: about.body };

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <AboutTimeline headingAs="h1" />
      <section className={styles.soft} aria-labelledby="people-heading">
        <div className={styles.section}>
          <div className={styles.container}>
            <FadeIn className={styles.peopleIntro}><h2 id="people-heading" className={styles.sectionTitle}>{about.peopleTitle}</h2><p className={styles.sectionBody}>{about.peopleBody}</p></FadeIn>
            <div className={styles.personGrid}>{about.people.map((person, i) => <FadeIn key={person.name} delay={i * 0.04} className="h-full"><PersonCard person={person} /></FadeIn>)}</div>
          </div>
        </div>
      </section>
      <AboutLocations />
      <ArchiveCta className={styles.ctaBlue} title={about.ctaTitle} body={about.ctaBody} action={about.ctaButton} />
    </div>
  );
}
