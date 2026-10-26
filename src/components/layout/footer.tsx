"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import footer from "@/content/site-footer.json";

export function Footer() {
  const pathname = usePathname();
  if (pathname === "/home-8" || pathname === "/home-9" || pathname === "/home-10") return null;
  return <footer className="emfi-site-footer"><div className="emfi-footer-inner">
    <div className="emfi-footer-top">
      {footer.linkGroups.map((group) => <nav key={group.heading} className="emfi-footer-links" aria-label={`Footer ${group.heading.toLowerCase()}`}>
        <h2>{group.heading}</h2>
        <ul>{group.links.map((link) => <li key={link.href}>{link.href.startsWith("http") ? <a href={link.href} target="_blank" rel="noopener noreferrer">{link.label}</a> : <Link href={link.href}>{link.label}</Link>}</li>)}</ul>
      </nav>)}
    </div>
    <div className="emfi-footer-legal">
      <p>{footer.legal}</p>
      <p className="emfi-footer-legal-detail">{footer.legalDetail}</p>
    </div>
  </div></footer>;
}
