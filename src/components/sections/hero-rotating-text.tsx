"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";

type Phase = "typing" | "holding" | "deleting";

export function splitLastWord(text: string) {
  const trimmed = text.trimEnd();
  const i = trimmed.lastIndexOf(" ");
  if (i === -1) return { rest: "", lastWord: trimmed };
  return { rest: trimmed.slice(0, i), lastWord: trimmed.slice(i + 1) };
}

export function HeroRotatingText({
  words,
  className,
  typeMs = 55,
  deleteMs = 35,
  holdMs = 2200,
}: {
  words: readonly string[];
  className?: string;
  typeMs?: number;
  deleteMs?: number;
  holdMs?: number;
}) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("typing");
  const [chars, setChars] = useState(0);
  const word = words[index] ?? words[0] ?? "";
  const longest = words.reduce((a, b) => (a.length >= b.length ? a : b), "");

  useEffect(() => {
    if (words.length === 0) return;

    if (reduced) {
      setChars(word.length);
      setPhase("holding");
      return;
    }

    if (phase === "typing") {
      if (chars >= word.length) {
        const id = window.setTimeout(() => setPhase("holding"), 0);
        return () => window.clearTimeout(id);
      }
      const id = window.setTimeout(() => setChars((c) => c + 1), typeMs);
      return () => window.clearTimeout(id);
    }

    if (phase === "holding") {
      const id = window.setTimeout(() => setPhase("deleting"), holdMs);
      return () => window.clearTimeout(id);
    }

    if (chars <= 0) {
      const id = window.setTimeout(() => {
        setIndex((i) => (i + 1) % words.length);
        setPhase("typing");
      }, typeMs);
      return () => window.clearTimeout(id);
    }

    const id = window.setTimeout(() => setChars((c) => c - 1), deleteMs);
    return () => window.clearTimeout(id);
  }, [chars, deleteMs, holdMs, phase, reduced, typeMs, word.length, words.length]);

  const visible = reduced ? word : word.slice(0, chars);

  return (
    <span className={cn("relative inline-block", className)} aria-hidden>
      <span className="invisible whitespace-pre">{longest}</span>
      <span className="absolute inset-x-0 top-0 whitespace-pre">
        {visible}
        <span
          className={cn(
            "ml-0.5 inline-block h-[0.85em] w-[2px] translate-y-[0.12em] bg-current align-baseline",
            phase === "holding" || reduced ? "emfi-caret" : "emfi-caret-solid",
          )}
        />
      </span>
    </span>
  );
}

export function HeroTypedLastWord({
  text,
  words,
  prefix,
  className,
}: {
  text?: string;
  words?: readonly string[];
  prefix?: string;
  className?: string;
}) {
  const split = text ? splitLastWord(text) : { rest: "", lastWord: "" };
  const rest = prefix ?? split.rest;
  const animated = words && words.length > 0 ? words : split.lastWord ? [split.lastWord] : [];

  if (animated.length === 0) return null;

  return (
    <span className={cn("block font-light tracking-[-0.045em] text-brand", className)}>
      {rest ? (
        <>
          {rest}
          <br />
        </>
      ) : null}
      <HeroRotatingText words={animated} />
    </span>
  );
}
