import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { trust } from "@/content/trust";
import { FadeIn } from "@/components/motion/fade-in";
import { CurvedBand } from "@/components/layout/curved-band";
import { WhyEmfiHero } from "@/components/sections/why-emfi/hero";
import { ArchiveCta } from "@/components/sections/archive/cta";
import styles from "@/components/sections/archive/theme.module.css";
import why from "@/components/sections/why-emfi/why-emfi.module.css";

export const metadata = { title: trust.title, description: trust.body };

export default function WhyEmfiPage() {
  return (
    <div className={styles.page}>
      <CurvedBand nextBackground="#fff"><WhyEmfiHero /></CurvedBand>
      <CurvedBand nextBackground="#071932" background="#fff"><section id="authorised" className={styles.section} aria-labelledby="authorised-heading">
        <div className={styles.container}>
          <FadeIn className={why.sectionIntro}><h2 id="authorised-heading" className={styles.sectionTitle}>{trust.authorisedTitle}</h2><p className={styles.sectionBody}>{trust.authorisedBody}</p></FadeIn>
          <div className={styles.grid3}>{trust.regulators.map((item, i) => <FadeIn key={item.code} delay={i * 0.08}>
            <article className={`${styles.card} ${why.authorityCard}`}>
              <div className={why.authorityLogo}><Image src={item.logo} alt={item.name} width={item.logoWidth} height={item.logoHeight} unoptimized /></div>
              <h3>{item.name}</h3>
              <div className={why.authorityLinks}>{item.entries.map((entry) => <a key={entry.href} href={entry.href} target="_blank" rel="noopener noreferrer"><span>{entry.entity}</span><ArrowUpRight size={15} className="shrink-0" aria-hidden /></a>)}</div>
            </article>
          </FadeIn>)}</div>
        </div>
      </section></CurvedBand>
      <CurvedBand nextBackground="#fff"><section id="framework" className={`${styles.section} ${why.framework}`} aria-labelledby="framework-heading">
        <div className={styles.container}>
          <FadeIn className={why.sectionIntro}><h2 id="framework-heading" className={styles.sectionTitle}>{trust.regulatedTitle}</h2><p className={styles.sectionBody}>{trust.regulatedBody}</p></FadeIn>
          <div className={why.frameworkGrid}>{trust.regimes.map((item, i) => <FadeIn key={item.code} delay={i * 0.06}><article className={why.frameworkCard}><span className={why.frameworkCode}>{item.code}</span><h3>{item.name}</h3><p>{item.body}</p></article></FadeIn>)}</div>
        </div>
      </section></CurvedBand>
      <CurvedBand nextBackground="#dce8f8" background="#fff"><section id="audit" className={styles.section} aria-labelledby="audit-heading">
        <div className={styles.container}>
          <FadeIn className={why.sectionIntro}><h2 id="audit-heading" className={styles.sectionTitle}>{trust.auditableTitle}</h2><p className={styles.sectionBody}>{trust.auditableBody}</p></FadeIn>
          <div className={styles.grid3}>{trust.auditors.map((item, i) => <FadeIn key={item.name} delay={i * 0.08}><article className={`${styles.card} ${why.auditCard}`}><Image src={item.logo} alt={item.name} width={item.logoWidth} height={item.logoHeight} unoptimized /><p>{item.scope}</p></article></FadeIn>)}</div>
        </div>
      </section></CurvedBand>
      <CurvedBand nextBackground="#f4f7fb"><section id="regulated-entities" className={`${styles.section} ${styles.blue} scroll-mt-24`} aria-labelledby="entities-heading">
        <div className={styles.container}>
          <FadeIn className={why.sectionIntro}><h2 id="entities-heading" className={styles.sectionTitle}>{trust.entitiesTitle}</h2><p className={styles.sectionBody}>{trust.entitiesBody}</p></FadeIn>
          <div className={styles.grid2}>{trust.entities.map((item, i) => <FadeIn key={item.name} delay={i * 0.06}><article className={`${styles.card} ${why.entityCard}`}>
            <h3>{item.name}</h3>
            <dl className={styles.entityDetails}><div><dt>Jurisdiction</dt><dd>{item.jurisdiction}</dd></div><div><dt>Regulator</dt><dd>{item.regulator}</dd></div></dl>
            <div className={styles.entityRole}><span className={styles.label}>Role</span><p>{item.role}</p></div>
            <a href={item.href} target="_blank" rel="noopener noreferrer" className={why.entityLink}>View public register<ArrowUpRight size={15} className="shrink-0" aria-hidden /></a>
          </article></FadeIn>)}</div>
        </div>
      </section></CurvedBand>
      <CurvedBand nextBackground="#0c1725"><ArchiveCta title={trust.ctaTitle} body={trust.ctaBody} action={trust.ctaButton} /></CurvedBand>
    </div>
  );
}
