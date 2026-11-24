"use client";

import styles from "./sections.module.css";

export function ReplayButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" className={styles.replay} onClick={onClick} aria-label="Replay animation" title="Replay">
      <span aria-hidden="true" className={styles.replayIcon} />
    </button>
  );
}
