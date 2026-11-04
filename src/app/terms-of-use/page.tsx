import { LegalPage } from "@/components/legal/legal-page";
import styles from "@/components/legal/legal.module.css";
import { termsOfUse } from "@/content/terms-of-use";

export const metadata = {
  title: "Terms of Use",
  description: "Terms of Use for the EMFI Website.",
};

export default function TermsOfUsePage() {
  return (
    <LegalPage title={termsOfUse.title}>
      <div>
        {termsOfUse.lead.map((paragraph) => (
          <p key={paragraph[0]} className={styles.lead}>{paragraph[0]}</p>
        ))}
      </div>
      {termsOfUse.sections.map((section) => (
        <section key={section.title} className={styles.section}>
          <h2>{section.title}</h2>
          {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </section>
      ))}
    </LegalPage>
  );
}
