import { Button } from "@/components/ui/button";
import { Mail, MessageCircle } from "lucide-react";
import { BrandSign } from "@/components/brand/logo";
import { contact } from "@/content/contact";
import { MotionRegion } from "@/components/sections/landing/motion-region";
import { ArchiveTypewriter } from "@/components/sections/archive/typewriter";
import styles from "./contact.module.css";

export function ContactHero() {
  return <section className={styles.hero} aria-labelledby="contact-hero-heading">
    <div className={styles.layout}>
      <div className={styles.copy}>
        <h1 id="contact-hero-heading"><span>Let’s</span><span>Discuss.</span></h1>
        <p className={styles.subtitle} aria-label={contact.heroPhrases.join(" ")}><ArchiveTypewriter words={contact.heroPhrases} /></p>
        <div className={styles.actions}><Button href="#contact-enquiry" className={styles.primary}>Start a conversation</Button></div>
      </div>
      <MotionRegion className={styles.visual} reveal={false}>
        <figure className={styles.conversation} aria-label="A direct conversation with EMFI">
          <svg viewBox="0 0 560 520" className={styles.outline} fill="none" aria-hidden="true">
            <path className={styles.conversationFrame} pathLength="1" d="M140 100H420Q460 100 460 140V330Q460 370 420 370H280L200 430V370H140Q100 370 100 330V140Q100 100 140 100Z" stroke="#becfe8" strokeWidth="1.5" />
            <path className={styles.connections} pathLength="1" d="M211 215L100 180M349 253L460 280" stroke="#a9bfdf" strokeWidth="1.5" />
            <path className={styles.signal} pathLength="1" d="M100 180L211 215" stroke="#8098cc" strokeWidth="2" strokeLinecap="round" />
            <path className={`${styles.signal} ${styles.outgoingSignal}`} pathLength="1" d="M349 253L460 280" stroke="#8098cc" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <BrandSign className={styles.mark} />
          <span className={`${styles.iconBadge} ${styles.emailIcon}`} aria-hidden="true"><Mail size={24} strokeWidth={1.5} /></span>
          <span className={`${styles.iconBadge} ${styles.messageIcon}`} aria-hidden="true"><MessageCircle size={24} strokeWidth={1.5} /></span>
        </figure>
      </MotionRegion>
    </div>
  </section>;
}
