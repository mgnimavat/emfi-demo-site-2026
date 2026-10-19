import { BrandWordmark } from "@/components/brand/wordmark";
import Link from "next/link";
import footer from "@/content/site-footer.json";

export function Footer() {
  return <footer className="emfi-site-footer"><div className="emfi-footer-inner">
    <div className="emfi-footer-top">
      <div className="emfi-footer-brand">
        <Link href="/" aria-label="EMFI home"><BrandWordmark width={160} className="emfi-footer-logo" /></Link>
        <p className="emfi-footer-tagline">{footer.tagline}</p>
        <p className="emfi-footer-entities">{footer.entities}</p>
      </div>
      {footer.linkGroups.map((group) => <nav key={group.heading} className="emfi-footer-links" aria-label={`Footer ${group.heading.toLowerCase()}`}>
        <h2>{group.heading}</h2>
        <ul>{group.links.map((link) => <li key={link.href}><Link href={link.href}>{link.label}</Link></li>)}</ul>
      </nav>)}
    </div>
    <div className="emfi-footer-offices">{footer.offices.map((office) => <address key={office.city} className="emfi-footer-office">
      <h2>{office.city}</h2>
      <p>{office.lines.map((line) => <span key={line}>{line}</span>)}</p>
      <a href={`mailto:${office.email}`}>{office.email}</a>
    </address>)}</div>
    <div className="emfi-footer-legal">
      <p>{footer.legal}</p>
      <p className="emfi-footer-legal-detail">{footer.legalDetail}</p>
    </div>
  </div></footer>;
}
