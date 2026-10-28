import { home3 as home } from "@/content/home-3";
import { Container } from "@/components/layout/container";
import { HeroAtmosphere, HeroBrandMark } from "@/components/sections/hero-atmosphere";
import { Home3Hero } from "@/components/sections/home-3/hero";
import { ExpectMore } from "@/components/sections/home-3/expect-more";
import { MoreDirect } from "@/components/sections/home-3/more-direct";
import { MoreResponsive } from "@/components/sections/home-3/more-responsive";
import { MoreAccountable } from "@/components/sections/home-3/more-accountable";
import { Home3Contact } from "@/components/sections/home-3/contact";

export const metadata = {
  title: "Home 3",
  description: home.hero.body,
};

export default function Home3Page() {
  return (
    <>
      <section
        id="home"
        className="relative flex min-h-[calc(100svh-72px)] scroll-mt-[72px] flex-col overflow-hidden bg-page"
      >
        <HeroAtmosphere sign={false} />
        <div className="relative flex min-h-0 flex-1 flex-col">
          <HeroBrandMark />
          <Container className="relative z-10 flex min-h-0 flex-1 flex-col">
            <Home3Hero />
          </Container>
        </div>
      </section>

      <ExpectMore />
      <MoreDirect />
      <MoreResponsive />
      <MoreAccountable />
      <Home3Contact />
    </>
  );
}
