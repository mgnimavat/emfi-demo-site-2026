"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useSyncExternalStore } from "react";
import { brandSignPath } from "@/components/brand/logo";
import { about } from "@/content/about";
import { cn } from "@/lib/cn";

const CX = 160;
const RING = 92;
const YEAR_GAP = 22;
const PAD_Y = 36;
const CY = PAD_Y + YEAR_GAP + RING;
const VIEW_H = CY + RING + YEAR_GAP + PAD_Y;
const MARK_SIZE = 72;
const MARK_VIEWBOX = 50;
const MARK_SCALE = MARK_SIZE / MARK_VIEWBOX;
const ease = [0.22, 1, 0.36, 1] as const;
const subscribeToHydration = () => () => {};

const ARC = `M ${CX} ${CY - RING} A ${RING} ${RING} 0 0 1 ${CX} ${CY + RING}`;

export function DecadeHeroVisual({
  showCaption = true,
  className,
}: {
  showCaption?: boolean;
  className?: string;
}) {
  const reducedPreference = useReducedMotion();
  const hydrated = useSyncExternalStore(subscribeToHydration, () => true, () => false);
  const reduceMotion = hydrated && reducedPreference;
  const { from, to, mark, caption } = about.heroVisual;
  const label = `${from} to ${to}. ${mark}. ${caption}.`;

  return (
    <figure className={cn("relative mx-auto w-full max-w-[17rem]", className)} aria-label={label}>
      <svg viewBox={`0 0 320 ${VIEW_H}`} className="h-auto w-full" role="img" aria-hidden>
        <defs>
          <linearGradient id="emfi-decade-flow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--flow-from)" />
            <stop offset="48%" stopColor="var(--flow-mid)" />
            <stop offset="100%" stopColor="var(--flow-to)" />
          </linearGradient>
        </defs>
        <path
          d={ARC}
          fill="none"
          stroke="var(--color-blue-100)"
          strokeOpacity={0.55}
          strokeWidth={2.5}
          strokeLinecap="round"
        />
        {reduceMotion ? (
          <path
            d={ARC}
            fill="none"
            stroke="url(#emfi-decade-flow)"
            strokeWidth={2.5}
            strokeLinecap="round"
          />
        ) : (
          <motion.path
            d={ARC}
            fill="none"
            stroke="url(#emfi-decade-flow)"
            strokeWidth={2.5}
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: [0, 0, 1, 1] }}
            transition={{
              duration: 8,
              times: [0, 0.08, 0.78, 1],
              repeat: Infinity,
              repeatDelay: 1.1,
              ease,
            }}
          />
        )}

        <circle cx={CX} cy={CY - RING} r={3.5} fill="var(--action-primary)" />
        <circle cx={CX} cy={CY + RING} r={3.5} fill="var(--action-primary)" />

        {reduceMotion ? (
          <g>
            <circle
              cx={CX}
              cy={CY + RING}
              r={8}
              fill="color-mix(in srgb, var(--flow-to) 22%, transparent)"
            />
            <circle cx={CX} cy={CY + RING} r={3.5} fill="url(#emfi-decade-flow)" />
          </g>
        ) : (
          <motion.g
            initial={{ rotate: -90 }}
            animate={{ rotate: [-90, -90, 90, 90] }}
            transition={{
              duration: 8,
              times: [0, 0.08, 0.78, 1],
              repeat: Infinity,
              repeatDelay: 1.1,
              ease,
            }}
            transformTemplate={({ rotate }) => `rotate(${rotate} ${CX} ${CY})`}
          >
            <circle
              cx={CX + RING}
              cy={CY}
              r={8}
              fill="color-mix(in srgb, var(--flow-to) 22%, transparent)"
            />
            <circle cx={CX + RING} cy={CY} r={3.5} fill="url(#emfi-decade-flow)" />
          </motion.g>
        )}

        <g
          transform={`translate(${CX - MARK_SIZE / 2} ${CY - MARK_SIZE / 2}) scale(${MARK_SCALE})`}
        >
          <path fill="var(--bg-inverse)" d={brandSignPath} />
        </g>

        <text
          x={CX}
          y={CY - RING - YEAR_GAP}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="var(--action-primary)"
          fontSize={15}
          fontWeight={700}
          letterSpacing={2.4}
          fontFamily="var(--font-ibm-plex-mono), ui-monospace, monospace"
        >
          {from}
        </text>
        <text
          x={CX}
          y={CY + RING + YEAR_GAP}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="var(--action-primary)"
          fontSize={15}
          fontWeight={700}
          letterSpacing={2.4}
          fontFamily="var(--font-ibm-plex-mono), ui-monospace, monospace"
        >
          {to}
        </text>
      </svg>
      {showCaption ? (
        <p className="mx-auto mt-2 w-fit rounded-lg bg-inverse px-4 py-2.5 text-center font-mono text-[12px] font-extrabold uppercase tracking-[0.16em] text-ink-inverse">
          {caption}
        </p>
      ) : null}
    </figure>
  );
}
