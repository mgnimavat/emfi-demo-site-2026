"use client";

import { useEffect, useRef, useState } from "react";
import { BrandWordmark } from "@/components/brand/wordmark";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { home14 } from "@/content/home-14";
import navigation from "@/content/site-navigation.json";
import styles from "./chrome.module.css";

function LoginMark() {
  return <svg viewBox="0 0 145 145" className={styles.clientIcon} aria-hidden="true" focusable="false"><path d={navigation.markPath} fill="currentColor" /></svg>;
}

function activeLink(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Home14Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); toggle.current?.focus(); }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/home-14" aria-label="EMFI home" className={styles.home} onClick={() => setOpen(false)}>
          <BrandWordmark className={styles.logo} priority />
        </Link>
        <nav aria-label="Main navigation" className={styles.navShell}>
          <div className={styles.nav}>
            {home14.navLinks.map((link) => (
              <Link key={link.href} href={link.href} aria-current={activeLink(pathname, link.href) ? "page" : undefined}>{link.label}</Link>
            ))}
          </div>
          <div className={styles.loginSlot}>
            {home14.utilityLinks.map((link) => (
              <Link key={link.href} href={link.href} aria-current={activeLink(pathname, link.href) ? "page" : undefined}>{link.label}</Link>
            ))}
            <a href={navigation.loginHref} className={styles.clientLogin} aria-label="Client Login" aria-describedby="home-14-login-tooltip">
              <LoginMark />
              <span id="home-14-login-tooltip" className={styles.tooltip} role="tooltip">Click here to Login</span>
            </a>
          </div>
        </nav>
        <button ref={toggle} type="button" className={styles.menuToggle} aria-expanded={open} aria-controls="home-14-mobile-navigation" onClick={() => setOpen((value) => !value)}>{open ? "Close" : "Menu"}</button>
      </div>
      <nav id="home-14-mobile-navigation" aria-label="Mobile navigation" className={styles.mobileNav} hidden={!open}>
        {[...home14.navLinks, ...home14.utilityLinks].map((link) => (
          <Link key={link.href} href={link.href} onClick={() => setOpen(false)} aria-current={activeLink(pathname, link.href) ? "page" : undefined}>{link.label}</Link>
        ))}
        <a href={navigation.loginHref} className={styles.clientMobile} aria-label="Client Login"><LoginMark /><span>Client Login</span></a>
      </nav>
    </header>
  );
}
