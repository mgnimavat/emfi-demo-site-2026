import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import ctaStyles from '@/components/sections/home-16/questionnaire.module.css';
import styles from './ServiceDisclosures.module.css';

type ServiceDisclosuresProps = {
  headingId: string;
  title: string;
  action: { label: string; href: string };
  children: ReactNode;
  external?: boolean;
  actionPlacement?: 'column' | 'panel';
};

export const ServiceDisclosures = ({
  headingId,
  title,
  action,
  children,
  external = false,
  actionPlacement = 'column',
}: ServiceDisclosuresProps) => {
  const panelAction = actionPlacement === 'panel';
  const ActionIcon = panelAction ? ArrowRight : external ? ArrowUpRight : ArrowRight;
  const actionLink = (
    <Link
      className={panelAction ? `${ctaStyles.next} ${styles.panelButton}` : styles.action}
      href={action.href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
    >
      <span>{action.label}</span>
      <ActionIcon size={panelAction ? 14 : 17} aria-hidden="true" />
      {external ? <span className="sr-only"> (opens in a new tab)</span> : null}
    </Link>
  );

  return (
    <section className={styles.section} aria-labelledby={headingId}>
      <div className={`${styles.container} ${panelAction ? styles.panelAction : ''}`}>
        <div className={styles.introduction}>
          <h2 id={headingId} className={styles.title}>{title}</h2>
        </div>
        <div className={styles.copy}>
          {children}
          {panelAction ? actionLink : null}
        </div>
        {!panelAction ? actionLink : null}
      </div>
    </section>
  );
};
