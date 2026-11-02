import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/motion/fade-in";
import styles from "@/containers/Sections/ArchivedServices/a3d0954/components/sections/archive/theme.module.css";

export function ArchiveCta({ title, body, action, href = "/contact", className }: { title: string; body: string; action: string; href?: string; className?: string }) {
  return (
    <section className={className ? `${styles.cta} ${className}` : styles.cta}>
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
