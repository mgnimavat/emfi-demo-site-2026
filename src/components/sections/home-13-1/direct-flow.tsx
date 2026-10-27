import { BrandMark } from "@/components/sections/landing/icons";
import { home131 as home } from "@/content/home-13-1";
import styles from "./direct-flow.module.css";

export function DirectFlowSection() {
  const copy = home.direct;

  return (
    <section id="direct" className={styles.section} aria-labelledby="direct-heading">
      <span className={styles.mark} aria-hidden="true"><BrandMark /></span>
      <div className={styles.inner}>
        <h2 id="direct-heading">{copy.title}</h2>
        <p className={styles.lead}>{copy.lead}</p>
        <p className={styles.body}>{copy.body}</p>
        <div className={styles.card}>
          <div className={styles.route} aria-hidden="true">
            <div className={styles.node}>
              <span className={styles.clientDot} />
              <span>Client</span>
            </div>
            <span className={styles.lineIn} />
            <div className={styles.hub}>
              <span className={styles.hubDisc}><BrandMark /></span>
              <span>EMFI</span>
            </div>
            <span className={styles.lineOut} />
            <div className={styles.node}>
              <span className={styles.destDot} />
              <span>Depository</span>
              <small>Received</small>
            </div>
          </div>
          <p className={styles.cardFoot}>
            <span>{copy.previous}</span>
            <strong>{copy.handoversLabel}</strong>
            <b>{copy.handovers}</b>
          </p>
          <p className={styles.note}>{copy.note}</p>
        </div>
      </div>
    </section>
  );
}
