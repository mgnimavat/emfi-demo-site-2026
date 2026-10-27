"use client";

import { useEffect, useRef, useState } from "react";
import { BrandWordmark } from "@/components/brand/wordmark";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { home15 } from "@/content/home-15";
import navigation from "@/content/site-navigation.json";
import styles from "./chrome.module.css";

function LoginMark() {
  return <svg viewBox="0 0 145 145" className={styles.clientIcon} aria-hidden="true" focusable="false"><path d={navigation.markPath} fill="currentColor" /></svg>;
}

function activeLink(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Home15Header() {
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
        <Link href="/home-15" aria-label="EMFI home" className={styles.home} onClick={() => setOpen(false)}>
          <BrandWordmark className={styles.logo} priority />
        </Link>
        <nav aria-label="Main navigation" className={styles.navShell}>
          <div className={styles.nav}>
            {home15.navLinks.map((link) => (
              <Link key={link.href} href={link.href} aria-current={activeLink(pathname, link.href) ? "page" : undefined}>{link.label}</Link>
            ))}
          </div>
          <div className={styles.loginSlot}>
            {home15.utilityLinks.map((link) => (
              <Link key={link.href} href={link.href} aria-current={activeLink(pathname, link.href) ? "page" : undefined}>{link.label}</Link>
            ))}
            <a href={navigation.loginHref} className={styles.clientLogin} aria-label="Client Login" aria-describedby="home-15-login-tooltip">
              <LoginMark />
              <span id="home-15-login-tooltip" className={styles.tooltip} role="tooltip">Click here to Login</span>
            </a>
          </div>
        </nav>
        <button ref={toggle} type="button" className={styles.menuToggle} aria-expanded={open} aria-controls="home-15-mobile-navigation" onClick={() => setOpen((value) => !value)}>{open ? "Close" : "Menu"}</button>
      </div>
      <nav id="home-15-mobile-navigation" aria-label="Mobile navigation" className={styles.mobileNav} hidden={!open}>
        {[...home15.navLinks, ...home15.utilityLinks].map((link) => (
          <Link key={link.href} href={link.href} onClick={() => setOpen(false)} aria-current={activeLink(pathname, link.href) ? "page" : undefined}>{link.label}</Link>
        ))}
        <a href={navigation.loginHref} className={styles.clientMobile} aria-label="Client Login"><LoginMark /><span>Client Login</span></a>
      </nav>
    </header>
  );
}
