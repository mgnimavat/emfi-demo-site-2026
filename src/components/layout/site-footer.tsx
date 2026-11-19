"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/layout/footer";
import { Home11Footer } from "@/components/sections/home-11/footer";
import { Home16Footer } from "@/components/sections/home-16/footer";

function isContactPath(pathname: string) {
  return pathname === "/contact" || pathname.endsWith("/contact");
}

export function SiteFooter() {
  const pathname = usePathname();

  if (pathname === "/home-22") return <Footer />;
  if (pathname === "/home-23") return <Home16Footer />;
  if (isContactPath(pathname)) return <Home11Footer socialVariant="outline" />;
  return <Home11Footer />;
}
