import { researchSignup as copy } from '@/content/research-signup';
import { ResearchSignupForm } from '@/containers/Forms/ResearchSignupForm';
import styles from './ResearchSignupSection.module.css';

export const ResearchSignupSection = () => (
  <section className={styles.section} aria-labelledby="research-signup-heading">
    <div className={styles.container}>
      <div className={styles.introduction}>
        <header className={styles.header}>
          <h1 id="research-signup-heading">{copy.headline.map((line) => <span key={line}>{line}</span>)}</h1>
        </header>
        <div className={styles.copy}>
          <h2>{copy.heading}</h2>
          {copy.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <p>{copy.contactLabel} <a href={`mailto:${copy.email}`}>{copy.email}</a></p>
        </div>
      </div>
      <div className={styles.formColumn}>
        <div className={styles.formPanel}>
          <h2>{copy.form.heading}</h2>
          <ResearchSignupForm />
        </div>
      </div>
    </div>
  </section>
);
