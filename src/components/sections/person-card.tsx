import Image from "next/image";
import { dictionaries, type AboutCopy } from "@/lib/i18n";
import styles from "./person-card.module.css";

const placeholderPhoto = "/people/placeholder-draw-sky.jpg";

export const PersonCard = ({ person, boardLabel = dictionaries.en.about.boardLabel }: { person: AboutCopy["people"][number]; boardLabel?: string }) => {
  const headingId = `person-${person.name.toLowerCase().replace(/\s+/g, "-")}`;
  const isBoard = "board" in person && person.board;
  const inset = "inset" in person && person.inset;
  const raised = "raised" in person && person.raised;
  const photo = "photo" in person && person.photo ? person.photo : placeholderPhoto;

  return (
    <article className={[styles.card, isBoard && styles.boardCard, inset && styles.inset, raised && styles.raised].filter(Boolean).join(" ")} aria-labelledby={headingId} aria-describedby={`${headingId}-details`} tabIndex={0}>
      <div className={styles.portrait} aria-hidden="true">
        <Image
          src={photo}
          alt=""
          width={480}
          height={480}
          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
          className={styles.photo}
        />
      </div>
      <div className={styles.body}>
        <h3 id={headingId} className={styles.name}>{person.name}</h3>
        <p className={styles.role}>{person.role}</p>
        <div className={styles.details}>
          <div className={styles.detailsInner}>
            {isBoard ? <p className={styles.board}>{boardLabel}</p> : null}
            <p id={`${headingId}-details`} className={styles.description}>{person.description}</p>
          </div>
        </div>
      </div>
    </article>
  );
}
