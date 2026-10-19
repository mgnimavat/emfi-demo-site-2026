import Image from "next/image";
import { about } from "@/content/about";
import styles from "./person-card.module.css";

export function PersonCard({ person }: { person: (typeof about.people)[number] }) {
  const photo = "photo" in person ? person.photo : undefined;
  const initials = person.name.split(/\s+/).map((name) => name[0]).slice(0, 2).join("");
  const headingId = `person-${person.name.toLowerCase().replace(/\s+/g, "-")}`;

  return <article className={styles.card} aria-labelledby={headingId} aria-describedby={`${headingId}-details`} tabIndex={0}>
    <div className={styles.header}>
      <div className={styles.portrait} aria-hidden="true">
        {photo ? <Image src={photo} alt="" width={480} height={480} sizes="(min-width: 1200px) 400px, (min-width: 768px) 50vw, 100vw" className={styles.photo} /> : <span className={styles.initials}>{initials}</span>}
      </div>
      <div className={styles.identity}><h3 id={headingId}>{person.name}</h3><p>{person.role}</p></div>
    </div>
    <p id={`${headingId}-details`} className={styles.description}>{person.description}</p>
    {"board" in person && person.board ? <div className={styles.board}><span>{about.boardLabel}</span></div> : null}
  </article>;
}
