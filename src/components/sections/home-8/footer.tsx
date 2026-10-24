import Link from "next/link";
import { home8 } from "@/content/home-8";
import footer from "@/content/site-footer.json";
import styles from "./chrome.module.css";

const legalGroup = footer.linkGroups.find((group) => group.heading === "Legal");
const regulatoryGroup = footer.linkGroups.find((group) => group.heading === "Regulatory");

export function Home8Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerTop}>
          <nav className={styles.footerLinks} aria-label="Footer pages">
            <h2>Pages</h2>
            <ul>
              {[...home8.navLinks, ...home8.utilityLinks].map((link) => (
                <li key={link.href}><Link href={link.href}>{link.label}</Link></li>
              ))}
            </ul>
          </nav>
          {legalGroup ? (
            <nav className={styles.footerLinks} aria-label="Footer legal">
              <h2>{legalGroup.heading}</h2>
              <ul>
                {legalGroup.links.map((link) => (
                  <li key={link.href}>
                    {link.href.startsWith("http") ? <a href={link.href} target="_blank" rel="noopener noreferrer">{link.label}</a> : <Link href={link.href}>{link.label}</Link>}
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
          {regulatoryGroup ? (
            <nav className={styles.footerLinks} aria-label="Footer regulatory">
              <h2>{regulatoryGroup.heading}</h2>
              <ul>
                {regulatoryGroup.links.map((link) => (
                  <li key={link.href}>
                    {link.href.startsWith("http") ? <a href={link.href} target="_blank" rel="noopener noreferrer">{link.label}</a> : <Link href={link.href}>{link.label}</Link>}
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
        </div>
        <div className={styles.footerLegal}>
          <p>{footer.legal}</p>
          <p className={styles.footerLegalDetail}>{footer.legalDetail}</p>
        </div>
      </div>
    </footer>
  );
}
