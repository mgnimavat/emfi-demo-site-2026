import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import styles from './ServiceDisclosures.module.css';

type ServiceDisclosuresProps = {
  headingId: string;
  title: string;
  titleLines?: readonly string[];
  action: { label: string; href: string };
  children: ReactNode;
  external?: boolean;
};

export const ServiceDisclosures = ({
  headingId,
  title,
  titleLines,
  action,
  children,
  external = false,
}: ServiceDisclosuresProps) => {
  const ActionIcon = external ? ArrowUpRight : ArrowRight;

  return (
    <section className={styles.section} aria-labelledby={headingId}>
      <div className={styles.container}>
        <div className={styles.introduction}>
          <h2 id={headingId} className={styles.title} aria-label={title}>
            {titleLines ? titleLines.map((line) => <span className={styles.titleLine} key={line}>{line}</span>) : title}
          </h2>
        </div>
        <div className={styles.copy}>{children}</div>
        <Link
          className={styles.action}
          href={action.href}
          target={external ? '_blank' : undefined}
          rel={external ? 'noopener noreferrer' : undefined}
        >
          <span>{action.label}</span>
          <ActionIcon size={17} aria-hidden="true" />
          {external ? <span className="sr-only"> (opens in a new tab)</span> : null}
        </Link>
      </div>
    </section>
  );
};
