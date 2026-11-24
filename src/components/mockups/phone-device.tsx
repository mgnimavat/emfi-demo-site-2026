import Image from "next/image";
import styles from "./phone-device.module.css";

type PhoneDeviceProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  featured?: boolean;
};

export function PhoneDevice({ src, alt, featured = false }: PhoneDeviceProps) {
  return (
    <figure className={styles.device} data-featured={featured ? "" : undefined}>
      <div className={styles.shell}>
        <div className={styles.screen}>
          <div className={styles.uiFrame}>
            <Image src={src} alt={alt} fill sizes={featured ? '292px' : '240px'} className={styles.ui} unoptimized />
          </div>
          <span className={styles.island} aria-hidden="true" />
          <span className={styles.home} aria-hidden="true" />
        </div>
      </div>
    </figure>
  );
}
