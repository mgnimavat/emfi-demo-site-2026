import Image from "next/image";
import { about } from "@/content/about";
import styles from "./person-card.module.css";

const placeholderPhoto = "/people/placeholder-draw-sky.jpg";

export function PersonCard({ person }: { person: (typeof about.people)[number] }) {
  const headingId = `person-${person.name.toLowerCase().replace(/\s+/g, "-")}`;
  const isBoard = "board" in person && person.board;

  return (
    <article className={styles.card} aria-labelledby={headingId} aria-describedby={`${headingId}-details`} tabIndex={0}>
      <div className={styles.portrait} aria-hidden="true">
        <Image
          src={placeholderPhoto}
          alt=""
          width={480}
          height={480}
          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
          className={styles.photo}
        />
      </div>
      <div className={styles.body}>
        <h3 id={headingId} className={styles.name}>{person.name}</h3>
        <div className={styles.details}>
          <div className={styles.detailsInner}>
            <p className={styles.role}>{person.role}</p>
            <p id={`${headingId}-details`} className={styles.description}>{person.description}</p>
            {isBoard ? (
              <div className={styles.board}>
                <span>{about.boardLabel}</span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
