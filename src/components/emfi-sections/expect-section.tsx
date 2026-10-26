import styles from "./sections.module.css";

export function ExpectSection({ showPoints = true, raiseContent = false }: { showPoints?: boolean; raiseContent?: boolean }) {
  return (
    <section id="expect" data-screen-label="02 Why EMFI" style={{ position: "relative", background: "radial-gradient(60% 120% at 50% 0%,rgba(162,194,253,.16),transparent 70%)", zIndex: raiseContent ? undefined : 1, color: "#FFFFFF" }}>
      <div className={styles.lockup} style={raiseContent ? { position: "relative", zIndex: 2 } : undefined}>
        <p className={styles.eyebrow}><span className={styles.eyebrowMark} aria-hidden="true" /><span>Why EMFI</span></p>
        <h2 className={styles.headline}>Institutional<br />Infrastructure.</h2>
        <p className={styles.subheadline}>Without the Institutional<br />Runaround.</p>
        {showPoints ? <p className={styles.points}>Direct. Responsive. Dependable.</p> : null}
      </div>
    </section>
  );
}
