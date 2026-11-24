import { LegalDocumentSearch } from "@/components/legal/document-search";
import styles from "@/components/legal/legal.module.css";
import { legalDocuments } from "@/content/legal";

export function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <article className={styles.page}>
      <header className={styles.masthead}>
        <div className={`${styles.inner} ${styles.mastheadGrid}`}>
          <h1>{title}</h1>
          <LegalDocumentSearch current={title} documents={legalDocuments} />
        </div>
      </header>
      <div className={styles.inner}>
        <div className={styles.copy}>{children}</div>
      </div>
    </article>
  );
}

const flushSections = new Set([
  "Privacy Notice: Data protection under the EU General Data Protection Regulation (EU GDPR)",
  "Privacy Notice: Data protection for all countries other than the EEA",
]);

export function LegalHtml({ html }: { html: string }) {
  const parts = html.split(/<h4>/i);
  const lead = parts[0]?.trim();
  const sections = parts.slice(1).map((part) => {
    const close = part.indexOf("</h4>");
    return {
      title: part.slice(0, close).replace(/<[^>]+>/g, "").trim(),
      body: part.slice(close + 5).trim(),
    };
  });

  return (
    <>
      {lead ? <div className={styles.lead} dangerouslySetInnerHTML={{ __html: lead }} /> : null}
      {sections.map((section) => (
        <section key={section.title} className={flushSections.has(section.title) ? `${styles.section} ${styles.sectionFlush}` : styles.section}>
          <h2>{section.title}</h2>
          <div dangerouslySetInnerHTML={{ __html: section.body }} />
        </section>
      ))}
    </>
  );
}
