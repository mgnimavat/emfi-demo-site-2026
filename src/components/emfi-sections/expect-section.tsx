import styles from "./sections.module.css";

export function ExpectSection() {
  return (
    <section id="expect" data-screen-label="02 Why EMFI" style={{ position: "relative", background: "radial-gradient(60% 120% at 50% 0%,rgba(162,194,253,.16),transparent 70%)", zIndex: 1, color: "#FFFFFF" }}>
      <div className={styles.lockup}>
        <p className={styles.eyebrow}><span className={styles.eyebrowMark} aria-hidden="true" /><span>Why EMFI</span></p>
        <h2 className={styles.headline}>Institutional<br />Infrastructure.</h2>
        <p className={styles.subheadline}>Without the Institutional<br />Runaround.</p>
        <p className={styles.points}>Direct. Responsive. Dependable.</p>
      </div>
    </section>
  );
}
