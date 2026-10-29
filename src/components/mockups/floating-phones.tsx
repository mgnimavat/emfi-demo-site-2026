"use client";

import Image from "next/image";
import styles from "./floating-phones.module.css";

const PHONES = [
  { src: "/images/services/phone-balances.png?v=4", alt: "Balances on the EMFI mobile app", place: "left" },
  { src: "/images/services/phone-order-entry.png?v=3", alt: "Order entry on the EMFI mobile app", place: "center" },
  { src: "/images/services/phone-securities.png?v=3", alt: "Securities on the EMFI mobile app", place: "right" },
] as const;

export function FloatingPhones() {
  return (
    <div className={styles.stage} data-pose="cards">
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
