// To restore the previous shared chrome, uncomment these imports and JSX below,
// remove Home11Header/Home11Footer here, and restore the home page chrome.
// import { Header } from "@/components/layout/header";
// import { Footer } from "@/components/layout/footer";
import { Home11Header } from "@/components/sections/home-11/header";
import { Home11Footer } from "@/components/sections/home-11/footer";
import { HashScroll } from "@/components/layout/hash-scroll";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col bg-page text-ink">
      <HashScroll />
      {/* <Header /> */}
      <Home11Header />
      <main className="flex-1">{children}</main>
      {/* <Footer /> */}
      <Home11Footer />
    </div>
  );
}
