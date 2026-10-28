import type { Metadata } from "next";
import Script from "next/script";
import localFont from "next/font/local";
import { SiteShell } from "@/components/layout/site-shell";
import "./globals.css";

const inter = localFont({
  src: "../assets/fonts/inter-latin-variable.woff2",
  weight: "100 900",
  style: "normal",
  variable: "--font-inter",
  display: "swap",
});

const ibmPlexMono = localFont({
  src: [
    { path: "../assets/fonts/ibm-plex-mono-latin-400.woff2", weight: "400", style: "normal" },
    { path: "../assets/fonts/ibm-plex-mono-latin-500.woff2", weight: "500", style: "normal" },
    { path: "../assets/fonts/ibm-plex-mono-latin-600.woff2", weight: "600", style: "normal" },
    { path: "../assets/fonts/ibm-plex-mono-latin-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "EMFI | Home",
    template: "EMFI | %s",
  },
  description:
    "EMFI provides institutional investment infrastructure — research and execution, settlement and custody, wealth and asset management — through one operating relationship, without unnecessary institutional layers.",
  keywords: [
    "institutional investment infrastructure",
    "research and execution",
    "settlement",
    "custody",
    "asset servicing",
    "wealth management",
    "asset management",
    "institutional investors",
    "regulated investment services",
  ],
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [{ url: "/brand/favicon.ico", type: "image/x-icon" }],
    shortcut: "/brand/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${ibmPlexMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full font-sans" suppressHydrationWarning>
        <Script src="/hydration-guard.js" strategy="beforeInteractive" />
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
