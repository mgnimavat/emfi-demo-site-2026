"use client";

import { useEffect, useRef } from "react";
import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform, type MotionValue } from "framer-motion";
import { ArrowUpRight, Check, FileText, Handshake, Layers3, ScanLine, Search, type LucideIcon } from "lucide-react";
import { execution } from "@/content/execution";

const icons = [FileText, Search, ScanLine, ArrowUpRight, Check, Layers3];

function Step({ label, detail, Icon, index, total, progress, compact }: { label: string; detail: string; Icon: LucideIcon; index: number; total: number; progress: MotionValue<number>; compact: boolean }) {
  const opacity = useTransform(progress, [Math.max(0, (index - 0.2) / total), (index + 0.6) / total], [0, 1]);
  return (
    <li className={`relative flex items-center gap-4 ${compact ? "rounded-lg border border-line bg-page p-4 sm:p-5" : "lg:flex-col lg:px-2 lg:text-center"}`}>
      <span className="relative flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-md border border-line-strong bg-page text-brand shadow-sm">
        <motion.span aria-hidden className="absolute inset-0 bg-soft" style={{ opacity }} />
        <Icon size={23} strokeWidth={1.5} aria-hidden className="relative" />
      </span>
      <span className="min-w-0">
        <span className="block text-xs leading-5 text-ink-secondary">{detail}</span>
        <span className={`mt-1 block font-semibold leading-6 text-ink ${compact ? "text-base sm:text-lg" : "text-base"}`}>{label}</span>
      </span>
    </li>
  );
}

export function ExecutionWorkflow({ compact = false }: { compact?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.2 });
  const reduced = useReducedMotion();
  const progress = useMotionValue(0);
  const selected = compact ? [0, 1, 3] : [0, 1, 2, 3, 4, 5];

  useEffect(() => {
    if (reduced) { progress.set(1); return; }
    if (!inView || progress.get() >= 1) return;
    const controls = animate(progress, 1, { duration: (1 - progress.get()) * 4.8, ease: "linear" });
    return () => controls.stop();
  }, [inView, reduced, progress]);

  return (
    <div ref={ref} className="relative">
      {compact ? (
        <div className="mb-5 flex items-center justify-between gap-3 border-b border-line pb-5">
          <span className="font-mono text-xs uppercase tracking-[0.1em] text-ink-secondary">From view to action</span>
          <Handshake size={20} className="text-brand" aria-hidden />
        </div>
      ) : null}
      <div aria-hidden className={compact ? "pointer-events-none absolute bottom-7 left-11 top-24 w-px bg-line-strong sm:left-12" : "pointer-events-none absolute bottom-7 left-7 top-7 w-px bg-line-strong lg:bottom-auto lg:left-[8.33%] lg:right-[8.33%] lg:h-px lg:w-auto"} />
      {!compact ? <motion.div aria-hidden className="pointer-events-none absolute left-[8.33%] right-[8.33%] top-7 hidden h-px origin-left bg-brand-focus lg:block" style={{ scaleX: progress }} /> : null}
      <ol aria-label={compact ? "Research to execution overview" : "Execution workflow"} className={compact ? "relative grid gap-3" : "relative grid gap-6 lg:grid-cols-6 lg:gap-2"}>
        {selected.map((stepIndex, i) => {
          const step = execution.workflow.steps[stepIndex];
          return <Step key={step.label} {...step} Icon={icons[stepIndex]} index={i} total={selected.length} progress={progress} compact={compact} />;
        })}
      </ol>
    </div>
  );
}
