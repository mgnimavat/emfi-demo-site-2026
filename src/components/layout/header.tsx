"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { navLinks } from "@/content/nav";
import { Logo, LogoMark } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

function linkActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 bg-nav">
      <div className="mx-auto grid h-[72px] max-w-[1440px] grid-cols-[1fr_auto_1fr] items-center px-6 md:px-10">
        <Link
          href="/"
          aria-label="EMFI home"
          className="justify-self-start"
          onClick={() => setOpen(false)}
        >
          <Logo />
        </Link>

        <nav className="hidden items-center gap-5 lg:flex lg:gap-7" aria-label="Primary">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "border-b pb-1 text-[15px] font-semibold transition-colors",
                linkActive(pathname, link.href)
                  ? "border-ink-inverse font-bold text-ink-inverse"
                  : "border-transparent text-ink-inverse/80 hover:border-ink-inverse hover:text-ink-inverse",
              )}
              aria-current={pathname === link.href ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-3">
          <Link
            href="/"
            aria-label="EMFI"
            className="group relative text-ink-inverse"
            onClick={() => setOpen(false)}
          >
            <LogoMark decorative />
            <span
              role="tooltip"
              className="pointer-events-none absolute right-0 top-full z-[60] mt-2 whitespace-nowrap rounded-md bg-page px-2.5 py-1.5 text-[12px] font-semibold text-ink opacity-0 shadow-[var(--elevation-card-hover)] transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
            >
              Click Here to Login
            </span>
          </Link>
          <button
            type="button"
            aria-label={open ? "Close navigation" : "Open navigation"}
            className="flex min-h-11 min-w-11 items-center justify-center rounded-full border border-line-inverse text-ink-inverse lg:hidden"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="border-t border-line-inverse bg-nav px-6 py-8 lg:hidden">
          <div className="grid gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "text-[16px] font-semibold",
                  linkActive(pathname, link.href)
                    ? "font-bold text-ink-inverse"
                    : "text-ink-inverse/80",
                )}
                aria-current={pathname === link.href ? "page" : undefined}
              >
                {link.label}
              </Link>
            ))}
            <Button href="/contact" variant="inverse">
              Discuss your requirements
            </Button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
