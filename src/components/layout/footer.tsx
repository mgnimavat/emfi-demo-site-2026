import { BrandWordmark } from "@/components/brand/wordmark";
import Link from "next/link";
import footer from "@/content/site-footer.json";

export function Footer() {
  return <footer className="emfi-site-footer"><div className="emfi-footer-inner">
    <div className="emfi-footer-brand"><Link href="/" aria-label="EMFI home"><BrandWordmark width={160} className="emfi-footer-logo" /></Link></div>
    <div className="emfi-footer-offices">{footer.offices.map((office) => <address key={office.city} className="emfi-footer-office">
      <h2>{office.city}</h2>
      <p>{office.lines.map((line) => <span key={line}>{line}</span>)}</p>
      <a href={`mailto:${office.email}`}>{office.email}</a>
    </address>)}</div>
    <p className="emfi-footer-legal">{footer.legal}</p>
  </div></footer>;
}
