import type { CSSProperties, ReactNode } from "react";
import styles from "./curved-band.module.css";

/** Round the section's actual background, preserving gradients at the boundary. */
export function CurvedBand({ children, nextBackground, background, flat = false }: { children: ReactNode; nextBackground: string; background?: string; flat?: boolean }) {
  if (flat) return <>{children}</>;
  return <div className={`${styles.band} ${background ? styles.surface : ""}`} style={{ "--next-band-background": nextBackground, "--band-background": background } as CSSProperties} data-curved-band>{children}</div>;
}
