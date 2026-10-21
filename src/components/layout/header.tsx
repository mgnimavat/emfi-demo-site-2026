"use client";

import { useEffect, useRef, useState } from "react";
import { BrandWordmark } from "@/components/brand/wordmark";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "@/content/nav";
import navigation from "@/content/site-navigation.json";

function LoginMark() {
  return <svg viewBox="0 0 145 145" className="emfi-client-icon" aria-hidden="true" focusable="false"><path d={navigation.markPath} fill="currentColor" /></svg>;
}

function activeLink(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();
  return <Navigation key={pathname} pathname={pathname} />;
}

function Navigation({ pathname }: { pathname: string }) {
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
    <header className="emfi-site-header">
      <div className="emfi-header-inner">
        <Link href="/" aria-label="EMFI home" className="emfi-header-home" onClick={() => setOpen(false)}>
          <BrandWordmark className="emfi-header-logo" priority />
        </Link>
        <nav aria-label="Main navigation" className="emfi-header-nav">
          {navLinks.map((link) => <Link key={link.href} href={link.href} aria-current={activeLink(pathname, link.href) ? "page" : undefined}>{link.label}</Link>)}
        </nav>
        <div className="emfi-login-slot"><a href={navigation.loginHref} className="emfi-client-login" aria-label="Client Login" aria-describedby="emfi-login-tooltip"><LoginMark /><span id="emfi-login-tooltip" className="emfi-client-tooltip" role="tooltip">Click here to Login</span></a></div>
        <button ref={toggle} type="button" className="emfi-menu-toggle" aria-expanded={open} aria-controls="emfi-mobile-navigation" onClick={() => setOpen((value) => !value)}>{open ? "Close" : "Menu"}</button>
      </div>
      <nav id="emfi-mobile-navigation" aria-label="Mobile navigation" className="emfi-mobile-nav" hidden={!open}>
        {navLinks.map((link) => <Link key={link.href} href={link.href} onClick={() => setOpen(false)} aria-current={activeLink(pathname, link.href) ? "page" : undefined}>{link.label}</Link>)}
        <a href={navigation.loginHref} className="emfi-client-mobile" aria-label="Client Login"><LoginMark /><span>Client Login</span></a>
      </nav>
    </header>
  );
}
