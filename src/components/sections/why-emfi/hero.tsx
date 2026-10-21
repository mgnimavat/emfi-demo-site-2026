import Link from "next/link";
import { BadgeCheck, ShieldCheck, ClipboardCheck } from "lucide-react";
import { BrandSign } from "@/components/brand/logo";
import { trust } from "@/content/trust";
import { ArrowIcon } from "@/components/sections/landing/icons";
import { MotionRegion } from "@/components/sections/landing/motion-region";
import { ArchiveTypewriter } from "@/components/sections/archive/typewriter";
import styles from "./why-emfi.module.css";

export function WhyEmfiHero() {
  return <section className={styles.hero} aria-labelledby="why-emfi-heading">
    <MotionRegion className={styles.heroLayout} reveal={false}>
      <div className={styles.heroCopy}>
        <h1 id="why-emfi-heading">Why EMFI?</h1>
        <p className={styles.subtitle} aria-label="Authorised. Regulated. Auditable."><ArchiveTypewriter words={["Authorised.", "Regulated.", "Auditable."]} /></p>
        <p className={styles.heroBody}>{trust.body}</p>
        <Link href="#authorised" className={styles.heroAction}>Explore the evidence <ArrowIcon /></Link>
      </div>
      <MotionRegion className={styles.evidenceAnimation} reveal={false}>
      <figure className={styles.evidenceMap} aria-label="EMFI: Authorised, Regulated, Auditable">
        <svg className={styles.evidenceConnections} viewBox="0 0 600 600" fill="none" aria-hidden="true">
          <path className={styles.shieldOutline} pathLength="1" d="M300 52C354 80 420 104 480 116V242C480 338 398 399 300 440C202 399 120 338 120 242V116C180 104 246 80 300 52Z" stroke="#becfe8" strokeWidth="1.5" />
          {["M234 214L120 170", "M366 214L480 170", "M300 310V440"].map(path => <path key={path} className={styles.evidenceSpoke} pathLength="1" d={path} stroke="#a9bfdf" strokeWidth="1.5" />)}
        </svg>
        <div className={styles.evidenceHub} aria-hidden="true"><BrandSign className={styles.evidenceMark} /></div>
        <nav className={styles.oversightNodes} aria-label="Explore EMFI oversight">
          {[
            { title: "Authorised", href: "#authorised", Icon: BadgeCheck },
            { title: "Regulated", href: "#framework", Icon: ShieldCheck },
            { title: "Auditable", href: "#audit", Icon: ClipboardCheck },
          ].map(({ Icon, ...item }) => <a key={item.title} href={item.href} className={styles.oversightNode}>
            <span className={styles.nodeBadge}><Icon size={24} strokeWidth={1.5} aria-hidden="true" /></span>
            <span className={styles.nodeTitle}>{item.title}</span>
          </a>)}
        </nav>
      </figure>
      </MotionRegion>
    </MotionRegion>
  </section>;
}
