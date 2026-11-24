"use client";

import { useEffect } from "react";

export function useHeaderBlend(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    const sync = () => {
      const header = document.querySelector("header");
      const expect = document.querySelector("#expect");
      if (!header || !expect) return;
      const headerH = header.getBoundingClientRect().height;
      document.body.style.setProperty("--home-12-header-h", `${headerH}px`);
      document.body.classList.toggle("home-12-header-solid", window.scrollY >= window.innerHeight * 0.05);
    };

    sync();
    document.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      document.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
      document.body.classList.remove("home-12-header-solid");
      document.body.style.removeProperty("--home-12-header-h");
    };
  }, [enabled]);
}
