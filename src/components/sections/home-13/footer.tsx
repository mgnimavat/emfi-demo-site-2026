import Link from "next/link";
import { home13 } from "@/content/home-13";
import footer from "@/content/site-footer.json";
import styles from "./chrome.module.css";

const resources = ["Direct", "Responsive", "Accountable"] as const;
const copyright = [
  "©2026 EMFI Group Limited. All Rights Reserved.",
  "Authorised and Regulated by the Financial Conduct Authority (FCA).",
  "25-26 Dering Street, Mayfair, London W1S 1AW, United Kingdom.",
  "Intended for Professional Clients Only. Not Suitable for Retail Clients or US Persons.",
] as const;
const legalGroup = footer.linkGroups.find((group) => group.heading === "Legal");
const regulatoryGroup = footer.linkGroups.find((group) => group.heading === "Regulatory");
const socialLinks = [
  { title: "Twitter", href: "https://twitter.com/EmfiSecurities", viewBox: "0 0 512 512", d: "M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8l164.9-188.5L26.8 48h145.6l100.5 132.9zm-24.8 373.8h39.1L151.1 88h-42z" },
  { title: "LinkedIn", href: "https://www.linkedin.com/company/emfisecurities", viewBox: "0 0 448 512", d: "M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3M447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z" },
  { title: "Facebook", href: "https://www.facebook.com/EMFISecurities/", viewBox: "0 0 320 512", d: "M80 299.3V512h116V299.3h86.5l18-97.8H196v-34.6c0-51.7 20.3-71.5 72.7-71.5 16.3 0 29.4.4 37 1.2V7.9C291.4 4 256.4 0 236.2 0 129.3 0 80 50.5 80 159.4v42.1H14v97.8z" },
  { title: "Bloomberg", href: "bbg://screens/EMFI", viewBox: "0 0 24 24", evenodd: true, d: "M4 2.4h9.1c3.15 0 5.15 1.7 5.15 4.25 0 1.72-.95 3.12-2.45 3.75 1.9.58 3.1 2.05 3.1 4.1 0 2.85-2.35 4.8-5.7 4.8H4V2.4zm3.7 2.55v4.3h5.05c1.42 0 2.25-.68 2.25-1.85s-.83-1.85-2.25-1.85H7.7zm0 6.7v4.7h5.7c1.62 0 2.55-.75 2.55-1.95s-.93-1.95-2.55-1.95H7.7z" },
  { title: "Apple Store", href: "https://apps.apple.com/us/app/e-wealth/id1572648317", viewBox: "0 0 384 512", d: "M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9m-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3" },
  { title: "Google Play Store", href: "https://play.google.com/store/apps/details?id=com.emfi.emfi", viewBox: "0 0 512 512", d: "M325.3 234.3 104.6 13l280.8 161.2zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256zm425.2 225.6-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8M104.6 499l280.8-161.2-60.1-60.1z" },
] as const;

function BrandIcon({ d, viewBox, evenodd }: { d: string; viewBox: string; evenodd?: boolean }) {
  return (
    <svg viewBox={viewBox} aria-hidden="true" focusable="false">
      <path d={d} fillRule={evenodd ? "evenodd" : "nonzero"} />
    </svg>
  );
}

function FooterLinkItems({ links }: { links: readonly { label: string; href: string }[] }) {
  return links.map((link) => (
    <li key={link.href}>
      {link.href.startsWith("http") ? <a href={link.href} target="_blank" rel="noopener noreferrer">{link.label}</a> : <Link href={link.href}>{link.label}</Link>}
    </li>
  ));
}

export function Home13Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <div className={styles.footerTop}>
          <nav className={styles.footerLinks} aria-label="Footer services">
            <h2>Services</h2>
            <ul>
              <FooterLinkItems links={home13.navLinks} />
            </ul>
          </nav>
          <nav className={styles.footerLinks} aria-label="Footer resources">
            <h2>Resources</h2>
            <ul>
              {resources.map((label) => <li key={label}>{label}</li>)}
            </ul>
          </nav>
          {legalGroup ? (
            <nav className={styles.footerLinks} aria-label="Footer legal">
              <h2>{legalGroup.heading}</h2>
              <ul><FooterLinkItems links={legalGroup.links} /></ul>
            </nav>
          ) : null}
          {regulatoryGroup ? (
            <nav className={styles.footerLinks} aria-label="Footer regulatory">
              <h2>{regulatoryGroup.heading}</h2>
              <ul><FooterLinkItems links={regulatoryGroup.links} /></ul>
            </nav>
          ) : null}
        </div>
        <div className={styles.footerLegal}>
          <ul className={styles.social} aria-label="Social media">
            {socialLinks.map((item) => (
              <li key={item.title}>
                <a href={item.href} title={item.title} aria-label={item.title} {...(item.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                  <BrandIcon d={item.d} viewBox={item.viewBox} evenodd={"evenodd" in item} />
                </a>
              </li>
            ))}
          </ul>
          {copyright.map((line) => <p key={line}>{line}</p>)}
        </div>
      </div>
    </footer>
  );
}
