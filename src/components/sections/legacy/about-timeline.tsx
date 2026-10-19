"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { about } from "@/content/about-old";
import { Container } from "@/components/layout/container";
import { Eyebrow } from "@/components/ui/eyebrow";
import { FadeIn } from "@/components/motion/fade-in";
import { cn } from "@/lib/cn";

const ease = [0.22, 1, 0.36, 1] as const;
const subscribeToHydration = () => () => {};

export function AboutTimeline() {
  const reducedPreference = useReducedMotion();
  const hydrated = useSyncExternalStore(subscribeToHydration, () => true, () => false);
  const reduceMotion = hydrated && reducedPreference;
  const last = about.milestones.length - 1;

  return (
    <section className="bg-subtle">
      <Container className="py-12 md:py-16">
        <FadeIn>
          <Eyebrow>{about.yearsEyebrow}</Eyebrow>
          <h2 className="w-full text-4xl font-bold tracking-[-0.025em] text-ink md:text-5xl">
            {about.yearsTitle}
          </h2>
        </FadeIn>

        <ol className="relative mt-6">
          <span
            aria-hidden
            className="pointer-events-none absolute bottom-2 left-[1.15rem] top-2 w-px bg-line md:left-1/2 md:-translate-x-1/2"
          />
          <motion.span
            aria-hidden
            className="pointer-events-none absolute bottom-2 left-[1.15rem] top-2 w-0.5 origin-top bg-brand md:left-1/2 md:-translate-x-1/2"
            initial={reduceMotion ? false : { scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 1.4, ease }}
          />

          {about.milestones.map(([year, title, desc], i) => (
            <MilestoneItem
              key={`${year}-${title}`}
              year={year}
              title={title}
              desc={desc}
              index={i}
              total={about.milestones.length}
              isLast={i === last}
              reduceMotion={Boolean(reduceMotion)}
            />
          ))}
        </ol>
      </Container>
    </section>
  );
}

function MilestoneItem({
  year,
  title,
  desc,
  index,
  total,
  isLast,
  reduceMotion,
}: {
  year: string;
  title: string;
  desc: string;
  index: number;
  total: number;
  isLast: boolean;
  reduceMotion: boolean;
}) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, {
    amount: isLast ? 0.35 : 0.55,
    margin: isLast ? "0px 0px -8% 0px" : "-30% 0px -15% 0px",
  });
  const ready = useSyncExternalStore(subscribeToHydration, () => true, () => false);
  const [latched, setLatched] = useState(false);
  const left = index % 2 === 0;

  useEffect(() => {
    if (!isLast || !inView) return;
    const frame = requestAnimationFrame(() => setLatched(true));
    return () => cancelAnimationFrame(frame);
  }, [isLast, inView]);

  const active = ready
    ? reduceMotion
      ? isLast
      : isLast
        ? latched
        : inView
    : false;
  const delay = reduceMotion ? 0 : 0.08 + index * 0.07;

  return (
    <li
      ref={ref}
      className="relative grid grid-cols-[2.3rem_1fr] items-center gap-x-4 pb-5 last:pb-0 md:grid-cols-[1fr_2.5rem_1fr] md:gap-x-0 md:pb-7"
    >
      <div className="relative z-10 col-start-1 row-start-1 flex justify-center md:col-start-2">
        <span className="relative flex h-3.5 w-3.5 items-center justify-center">
          <motion.span
            className={cn(
              "block h-3.5 w-3.5 rounded-full ring-[6px] ring-subtle transition-colors duration-300",
              active ? "bg-brand" : "bg-brand-focus",
            )}
            initial={reduceMotion ? false : { scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.38, delay, ease }}
          />
          {isLast && active && !reduceMotion ? (
            <motion.span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-full bg-brand/35"
              animate={{ scale: [1, 2.05, 1], opacity: [0.55, 0, 0.55] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
            />
          ) : null}
        </span>
      </div>

      <motion.p
        className={cn(
          "hidden font-mono text-sm font-bold tracking-[0.12em] transition-colors duration-300 md:block",
          left ? "md:col-start-3 md:pl-8 md:text-left" : "md:col-start-1 md:pr-8 md:text-right",
          active ? "text-brand" : "text-ink-muted",
        )}
        initial={reduceMotion ? false : { opacity: 0, x: left ? 12 : -12 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.4, delay, ease }}
      >
        {year}
      </motion.p>

      <motion.article
        className={cn(
          "group relative col-start-2 row-start-1 rounded-lg border px-4 py-3 emfi-card-lift md:row-start-1 md:px-5 md:py-3.5",
          left ? "md:col-start-1 md:mr-1 md:text-right" : "md:col-start-3 md:ml-1",
          active
            ? "border-brand bg-page"
            : "border-line bg-card hover:bg-page",
        )}
        initial={reduceMotion ? false : { opacity: 0, x: left ? -18 : 18 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.45, delay: delay + 0.04, ease }}
      >
        <span
          aria-hidden
          className={cn(
            "absolute top-1/2 z-10 hidden h-2.5 w-2.5 md:block",
            left
              ? "right-0 border-r border-t [transform:translate(50%,-50%)_rotate(45deg)]"
              : "left-0 border-b border-l [transform:translate(-50%,-50%)_rotate(45deg)]",
            active
              ? "border-brand bg-page"
              : "border-line bg-card group-hover:bg-page",
          )}
        />
        <div
          className={cn(
            "relative flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1",
            left && "md:justify-end",
          )}
        >
          <p
            className={cn(
              "font-mono text-[11px] font-bold tracking-[0.16em] md:hidden",
              active ? "text-brand" : "text-ink-muted",
            )}
          >
            {year}
          </p>
          <p className="font-mono text-[11px] font-bold tracking-[0.16em] text-ink-muted">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </p>
        </div>
        <h3 className="relative mt-1 text-lg font-bold tracking-[-0.02em] text-ink md:text-xl">
          {title}
        </h3>
        <p className="relative mt-1 text-sm font-medium leading-6 text-ink-secondary md:text-[15px] md:leading-6">
          {desc}
        </p>
      </motion.article>
    </li>
  );
}
