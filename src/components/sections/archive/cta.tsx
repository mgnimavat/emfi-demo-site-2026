import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/motion/fade-in";
import styles from "./theme.module.css";

export function ArchiveCta({ title, body, action, href = "/contact" }: { title: string; body: string; action: string; href?: string }) {
  return (
    <section className={styles.cta}>
      <div className={styles.container}>
        <FadeIn className={styles.ctaInner}>
          <h2 className={styles.sectionTitle}>{title}</h2>
          <p>{body}</p>
          <Button href={href} className={styles.button}>{action}</Button>
        </FadeIn>
      </div>
    </section>
  );
}
