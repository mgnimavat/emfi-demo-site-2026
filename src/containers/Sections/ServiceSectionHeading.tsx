import { ExecutionReveal } from '@/components/sections/execution/reveal';
import styles from './ServicePage.module.css';

type ServiceSectionHeadingProps = {
  title: string;
  body?: string;
  id?: string;
};

export const ServiceSectionHeading = ({ title, body, id }: ServiceSectionHeadingProps) => (
  <ExecutionReveal className={styles.sectionHeading}>
    <h2 id={id} className={styles.sectionTitle}>
      {title}
    </h2>
    {body ? <p className={styles.sectionBody}>{body}</p> : null}
  </ExecutionReveal>
);
