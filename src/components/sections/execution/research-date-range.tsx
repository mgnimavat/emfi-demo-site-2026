"use client";

import { useEffect, useId, useRef, useState } from "react";
import { CalendarDays } from "lucide-react";
import { validIntelligenceReportDates } from "@/lib/intelligence-reports";
import { lastMonthResearchRange, lastQuarterResearchRange, trailingResearchRange } from "@/lib/research-date-range";
import styles from "./research-date-range.module.css";

type Range = { from: string; to: string };
const presets = [
  { label: "Last month", shortLabel: "1M", range: () => lastMonthResearchRange() },
  { label: "6 months", shortLabel: "6M", range: () => trailingResearchRange(6) },
  { label: "Last quarter", shortLabel: "Quarter", range: () => lastQuarterResearchRange() },
  { label: "Year", shortLabel: "1Y", range: () => trailingResearchRange(12) },
];
const matchingPreset = (value: Range) => presets.find(preset => {
  const range = preset.range();
  return range.from === value.from && range.to === value.to;
})?.label ?? "Custom";
const dateFormat = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
const label = (date: string) => dateFormat.format(new Date(`${date}T12:00:00Z`));

export function ResearchDateRange({ value, onChange, className }: { value: Range; onChange: (range: Range) => void; className?: string }) {
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const fromInput = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(value);
  const [selectedPreset, setSelectedPreset] = useState(() => matchingPreset(value));
  const valid = validIntelligenceReportDates({ fromDate: draft.from, toDate: draft.to });
  function close(restoreFocus = true) { setOpen(false); if (restoreFocus) trigger.current?.focus(); }
  useEffect(() => {
    if (!open) return;
    fromInput.current?.focus();
    function outside(event: PointerEvent) { if (!root.current?.contains(event.target as Node)) setOpen(false); }
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open]);
  const summary = value.from && value.to ? `${label(value.from)} – ${label(value.to)}` : value.from ? `From ${label(value.from)}` : value.to ? `Until ${label(value.to)}` : "Custom";

  return <div ref={root} className={`${className ?? ""} ${styles.field}`} onKeyDown={event => { if (event.key === "Escape" && open) { event.preventDefault(); event.stopPropagation(); close(); } }} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false); }}>
    <span id={`${id}-label`}>Date range</span>
    <button ref={trigger} type="button" className={styles.trigger} aria-labelledby={`${id}-label ${id}-value`} aria-haspopup="dialog" aria-expanded={open} aria-controls={open ? `${id}-popup` : undefined} onClick={() => { setDraft(value); setSelectedPreset(matchingPreset(value)); setOpen(!open); }}><span id={`${id}-value`}>{summary}</span><CalendarDays size={16} aria-hidden="true" /></button>
    {open ? <div id={`${id}-popup`} role="dialog" aria-labelledby={`${id}-title`} className={styles.popup}>
      <h3 id={`${id}-title`}>Publication dates</h3>
      <div className={styles.presets} aria-label="Date range presets">{presets.map(preset => <button key={preset.label} type="button" aria-label={preset.label} aria-pressed={selectedPreset === preset.label} onClick={() => { setDraft(preset.range()); setSelectedPreset(preset.label); }}><span className={styles.fullPreset}>{preset.label}</span><span className={styles.shortPreset} aria-hidden="true">{preset.shortLabel}</span></button>)}<button type="button" aria-pressed={selectedPreset === "Custom"} onClick={() => { setSelectedPreset("Custom"); fromInput.current?.focus(); }}>Custom</button></div>
      <div className={styles.inputs}><label>From<input ref={fromInput} type="date" aria-label="Publication date from" value={draft.from} aria-invalid={!valid} aria-describedby={!valid ? `${id}-error` : undefined} onChange={event => { setDraft({ ...draft, from: event.target.value }); setSelectedPreset("Custom"); }} /></label><label>To<input type="date" aria-label="Publication date to" value={draft.to} min={draft.from || undefined} aria-invalid={!valid} aria-describedby={!valid ? `${id}-error` : undefined} onChange={event => { setDraft({ ...draft, to: event.target.value }); setSelectedPreset("Custom"); }} /></label></div>
      {!valid ? <p id={`${id}-error`} role="alert">Choose an end date on or after the start date.</p> : null}
      <div className={styles.actions}><button type="button" onClick={() => close()}>Cancel</button><button type="button" disabled={!valid} onClick={() => { onChange(draft); close(); }}>Apply</button></div>
    </div> : null}
  </div>;
}
