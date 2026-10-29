"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";
import styles from "./floating-phones.module.css";

const PHONES = [
  { src: "/images/services/phone-balances.png?v=3", alt: "Balances on the EMFI mobile app", place: "left" },
  { src: "/images/services/phone-order-entry.png?v=3", alt: "Order entry on the EMFI mobile app", place: "center" },
  { src: "/images/services/phone-securities.png?v=3", alt: "Securities on the EMFI mobile app", place: "right" },
] as const;

/** Long enough for the 800ms pose transition to finish before the next one starts. */
export const PHONE_POSE_MS = 4400;

export function FloatingPhones() {
  const reduced = useReducedMotion();
  const [pose, setPose] = useState<"cards" | "cinematic">("cards");

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => {
      setPose((current) => (current === "cards" ? "cinematic" : "cards"));
    }, PHONE_POSE_MS);
    return () => window.clearInterval(id);
  }, [reduced]);

  return (
    <div className={styles.stage} data-pose={reduced ? "cards" : pose}>
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.pedestal} aria-hidden="true" />
      {PHONES.map((phone) => (
        <div key={phone.src} className={`${styles.phone} ${styles[phone.place]}`}>
          <div className={styles.bezel}>
            <Image
              src={phone.src}
              alt={phone.alt}
              width={483}
              height={1024}
              className={styles.screen}
              unoptimized
            />
          </div>
        </div>
      ))}
    </div>
  );
}
