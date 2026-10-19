import Link from "next/link";
import { trust } from "@/content/trust";
import { BrandWordmark } from "@/components/brand/wordmark";
import { ArrowIcon } from "@/components/sections/landing/icons";
import { MotionRegion } from "@/components/sections/landing/motion-region";
import { ArchiveTypewriter } from "@/components/sections/archive/typewriter";
import styles from "./why-emfi.module.css";

const evidence = [
  { title: "Authorised", label: "Authorities", href: "#authorised", items: trust.regulators.map((item) => item.code) },
  { title: "Regulated", label: "Frameworks", href: "#framework", items: trust.regimes.map((item) => item.code) },
  { title: "Auditable", label: "External audit", href: "#audit", items: trust.auditors.map((item) => item.name) },
];

export function WhyEmfiHero() {
  return <section className={styles.hero} aria-labelledby="why-emfi-heading">
    <MotionRegion className={styles.heroLayout} reveal={false}>
      <div className={styles.heroCopy}>
        <h1 id="why-emfi-heading">Why EMFI?</h1>
        <p className={styles.subtitle} aria-label="Authorised. Regulated. Auditable."><ArchiveTypewriter words={["Authorised.", "Regulated.", "Auditable."]} /></p>
        <p className={styles.heroBody}>{trust.body}</p>
        <Link href="#authorised" className={styles.heroAction}>Explore the evidence <ArrowIcon /></Link>
      </div>
      <figure className={styles.evidenceMap} aria-label="EMFI oversight: authorities, regulatory frameworks and external audit">
        <div className={styles.mapBrand}><BrandWordmark width={160} /></div>
        <nav className={styles.branches} aria-label="Explore EMFI oversight">
          {evidence.map((item) => <a key={item.title} href={item.href} className={styles.pillar}>
            <span className={styles.pillarTitle}>{item.title}</span>
            <span className={styles.pillarLabel}>{item.label}</span>
            <span className={styles.pillarItems}>{item.items.map((name) => <span key={name}>{name}</span>)}</span>
          </a>)}
        </nav>
      </figure>
    </MotionRegion>
  </section>;
}
