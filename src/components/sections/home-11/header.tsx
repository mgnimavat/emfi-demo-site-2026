"use client";

import { useEffect, useId, useRef, useState } from "react";
import { BrandWordmark } from "@/components/brand/wordmark";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { dictionaries, getBasePath, getPageLocale, localizeHref, isLocalizedPath, type Locale } from "@/lib/i18n";
import { home11 } from "@/content/home-11";
import navigation from "@/content/site-navigation.json";
import styles from "./chrome.module.css";
import { LanguageSelect } from '@/ui/components/LanguageSelect';

const LoginMark = () => {
  return <svg viewBox="0 0 145 145" className={styles.clientIcon} aria-hidden="true" focusable="false"><path d={navigation.markPath} fill="currentColor" /></svg>;
}

const activeLink = (pathname: string, href: string) => {
  return pathname === href || pathname.startsWith(`${href}/`);
}

const LanguageDropdown = ({
  locale,
  label,
  disabled,
  disabledTitle,
  onSelect,
}: {
  locale: Locale;
  label: string;
  disabled: boolean;
  disabledTitle?: string;
  onSelect: (next: Locale) => void;
}) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className={styles.languageControl} ref={rootRef}>
      <button
        type="button"
        className={styles.languageTrigger}
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        disabled={disabled}
        title={disabled ? disabledTitle : undefined}
        onClick={() => setOpen((value) => !value)}
      >
        <span>{locale.toUpperCase()}</span>
        <svg className={styles.languageChevron} viewBox="0 0 12 12" aria-hidden="true" focusable="false">
          <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open ? (
        <ul id={listId} className={styles.languageMenu} role="listbox" aria-label={label}>
          {locales.map((language) => (
            <li key={language} role="option" aria-selected={language === locale} lang={language}>
              <button
                type="button"
                className={styles.languageOption}
                disabled={language === locale}
                onClick={() => {
                  setOpen(false);
                  if (language !== locale) onSelect(language);
                }}
              >
                {language.toUpperCase()}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};

export const Home11Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const locale = getPageLocale(pathname);
  const basePath = getBasePath(pathname);
  const copy = dictionaries[locale].common;
  const supportsLanguages = isLocalizedPath(basePath);
  const linkHref = (href: string) => localizeHref(href, locale);
  const linkLabel = (href: string, label: string) => {
    if (href === '/about') return copy.about;
    if (href === '/contact') return copy.contact;
    const index = home11.navLinks.findIndex((link) => link.href === href);
    return index >= 0 ? copy.services[index] : label;
  };
  const switchLanguage = (nextLocale: Locale) => {
    const page = basePath;
    setOpen(false);
    router.push(`${localizeHref(page, nextLocale)}${window.location.search}${window.location.hash}`, { scroll: false });
  };

  useEffect(() => {
    document.documentElement.lang = locale;
    return () => { document.documentElement.lang = "en"; };
  }, [locale]);
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = headerRef.current;
    if (!element) return;
    const updateHeight = () => {
      document.documentElement.style.setProperty("--site-header-height", `${element.getBoundingClientRect().height}px`);
    };
    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); toggle.current?.focus(); }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const languageProps = {
    locale,
    label: copy.language,
    disabled: !supportsLanguages,
    disabledTitle: copy.languageAvailability,
    onSelect: switchLanguage,
  };

  return (
    <header ref={headerRef} lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} className={styles.header}>
      <div className={styles.inner}>
        <Link href={linkHref("/")} aria-label="EMFI home" className={styles.home} onClick={() => setOpen(false)}>
          <BrandWordmark className={styles.logo} priority />
        </Link>
        <nav aria-label={copy.navigation} className={styles.navShell}>
          <div className={styles.nav}>
            {home11.navLinks.map((link) => (
              <Link key={link.href} href={linkHref(link.href)} aria-current={activeLink(basePath, link.href) ? "page" : undefined}>{linkLabel(link.href, link.label)}</Link>
            ))}
          </div>
          <div className={styles.loginSlot}>
            {home11.utilityLinks.map((link) => (
              <Link key={link.href} href={linkHref(link.href)} aria-current={activeLink(basePath, link.href) ? "page" : undefined}>{linkLabel(link.href, link.label)}</Link>
            ))}
            <LanguageDropdown {...languageProps} />
            <a href={navigation.loginHref} className={styles.clientLogin} aria-label={copy.login} aria-describedby="home-11-login-tooltip">
              <LoginMark />
              <span id="home-11-login-tooltip" className={styles.tooltip} role="tooltip">{copy.loginHint}</span>
            </a>
          </div>
        </nav>
        <button ref={toggle} type="button" className={styles.menuToggle} aria-expanded={open} aria-controls="home-11-mobile-navigation" onClick={() => setOpen((value) => !value)}>{open ? copy.close : copy.menu}</button>
      </div>
      <nav id="home-11-mobile-navigation" aria-label={copy.mobileNavigation} className={styles.mobileNav} hidden={!open}>
        {[...home11.navLinks, ...home11.utilityLinks].map((link) => (
          <Link key={link.href} href={linkHref(link.href)} onClick={() => setOpen(false)} aria-current={activeLink(basePath, link.href) ? "page" : undefined}>{linkLabel(link.href, link.label)}</Link>
        ))}
        <LanguageDropdown {...languageProps} />
        <a href={navigation.loginHref} className={styles.clientMobile} aria-label={copy.login}><LoginMark /><span>{copy.login}</span></a>
      </nav>
    </header>
  );
}
