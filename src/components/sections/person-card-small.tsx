import Image from "next/image";
import { about } from "@/content/about";
import styles from "./person-card-small.module.css";

const placeholderPhoto = "/people/placeholder-draw-sky.jpg";

export function PersonCardSmall({ person }: { person: (typeof about.people)[number] }) {
  const headingId = `person-${person.name.toLowerCase().replace(/\s+/g, "-")}`;
  const isBoard = "board" in person && person.board;
  const photo =
    "photo" in person && typeof person.photo === "string" && person.photo
      ? person.photo
      : placeholderPhoto;

  return (
    <article className={styles.card} aria-labelledby={headingId} aria-describedby={`${headingId}-details`}>
      <p id={`${headingId}-details`} className={styles.description}>{person.description}</p>
      <div className={styles.footer}>
        <div className={styles.identity}>
          <h3 id={headingId} className={styles.name}>{person.name}</h3>
          <p className={styles.role}>{person.role}</p>
          {isBoard ? <span className={styles.board}>{about.boardLabel}</span> : null}
        </div>
        <div className={styles.avatar} aria-hidden="true">
          <Image
            src={photo}
            alt=""
            width={112}
            height={112}
            sizes="56px"
            className={styles.photo}
          />
        </div>
      </div>
    </article>
  );
}
