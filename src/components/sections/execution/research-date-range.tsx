"use client";

import { useEffect, useId, useRef, useState, type Ref } from "react";
import { CalendarDays } from "lucide-react";
import { validIntelligenceReportDates } from "@/lib/intelligence-reports";
import { displayResearchDate, parseResearchDate, researchDateInput, lastMonthResearchRange, lastQuarterResearchRange, trailingResearchRange } from "@/lib/research-date-range";
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
const textRange = (range: Range): Range => ({ from: displayResearchDate(range.from), to: displayResearchDate(range.to) });
const label = displayResearchDate;

export function ResearchDateRange({ value, onChange, className }: { value: Range; onChange: (range: Range) => void; className?: string }) {
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const fromInput = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(() => textRange(value));
  const [selectedPreset, setSelectedPreset] = useState(() => matchingPreset(value));
  const from = parseResearchDate(draft.from);
  const to = parseResearchDate(draft.to);
  const valid = from !== null && to !== null && validIntelligenceReportDates({ fromDate: from, toDate: to });
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
    <button ref={trigger} type="button" className={styles.trigger} aria-labelledby={`${id}-label ${id}-value`} aria-haspopup="dialog" aria-expanded={open} aria-controls={open ? `${id}-popup` : undefined} onClick={() => { setDraft(textRange(value)); setSelectedPreset(matchingPreset(value)); setOpen(!open); }}><span id={`${id}-value`}>{summary}</span><CalendarDays size={16} aria-hidden="true" /></button>
    {open ? <div id={`${id}-popup`} role="dialog" aria-labelledby={`${id}-title`} className={styles.popup}>
      <h3 id={`${id}-title`}>Publication dates</h3>
      <div className={styles.presets} aria-label="Date range presets">{presets.map(preset => <button key={preset.label} type="button" aria-label={preset.label} aria-pressed={selectedPreset === preset.label} onClick={() => { setDraft(textRange(preset.range())); setSelectedPreset(preset.label); }}><span className={styles.fullPreset}>{preset.label}</span><span className={styles.shortPreset} aria-hidden="true">{preset.shortLabel}</span></button>)}<button type="button" aria-pressed={selectedPreset === "Custom"} onClick={() => { setSelectedPreset("Custom"); fromInput.current?.focus(); }}>Custom</button></div>
      <div className={styles.inputs}><RangeDateInput label="From" value={draft.from} inputRef={fromInput} invalid={!valid} errorId={`${id}-error`} onChange={from => { setDraft({ ...draft, from }); setSelectedPreset("Custom"); }} /><RangeDateInput label="To" value={draft.to} min={from ?? undefined} invalid={!valid} errorId={`${id}-error`} onChange={to => { setDraft({ ...draft, to }); setSelectedPreset("Custom"); }} /></div>
      {!valid ? <p id={`${id}-error`} role="alert">Enter valid MM-DD-YYYY dates, with To on or after From.</p> : null}
      <div className={styles.actions}><button type="button" onClick={() => close()}>Cancel</button><button type="button" disabled={!valid} onClick={() => { if (valid) { onChange({ from: from!, to: to! }); close(); } }}>Apply</button></div>
    </div> : null}
  </div>;
}

function RangeDateInput({ label, value, min, inputRef, invalid, errorId, onChange }: { label: string; value: string; min?: string; inputRef?: Ref<HTMLInputElement>; invalid: boolean; errorId: string; onChange: (value: string) => void }) {
  const picker = useRef<HTMLInputElement>(null);
  return <label>{label}<span className={styles.dateInput}>
    <input ref={inputRef} type="text" inputMode="numeric" placeholder="MM-DD-YYYY" maxLength={10} aria-label={`Publication date ${label.toLowerCase()}`} value={value} aria-invalid={invalid} aria-describedby={invalid ? errorId : undefined} autoComplete="off" onChange={event => onChange(researchDateInput(event.target.value))} />
    <button type="button" className={styles.calendarButton} aria-label={`Open ${label.toLowerCase()} date calendar`} onClick={() => { if (picker.current?.showPicker) picker.current.showPicker(); else picker.current?.click(); }}><CalendarDays size={16} aria-hidden="true" /></button>
    <input ref={picker} className={styles.nativePicker} type="date" value={parseResearchDate(value) ?? ""} min={min || undefined} tabIndex={-1} aria-hidden="true" onChange={event => onChange(displayResearchDate(event.target.value))} />
  </span></label>;
}
