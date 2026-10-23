"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import styles from "./research-filter-select.module.css";

export function ResearchFilterSelect({ label, allLabel, options, value, onChange, className }: {
  label: string;
  allLabel?: string;
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const search = useRef({ text: "", time: 0 });
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const items = [...(allLabel ? [{ value: "", label: allLabel }] : []), ...options.map(option => ({ value: option, label: option }))];
  const selectedIndex = Math.max(0, items.findIndex(item => item.value === value));

  useEffect(() => {
    if (!open) return;
    function outside(event: PointerEvent) {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open]);

  useEffect(() => {
    if (open) root.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  function choose(index: number) {
    onChange(items[index].value);
    setOpen(false);
  }

  return <div ref={root} className={`${className ?? ""} ${styles.field}`} onBlur={event => {
    if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
  }}>
    <span id={`${id}-label`}>{label}</span>
    <button type="button" role="combobox" aria-labelledby={`${id}-label`} aria-controls={`${id}-options`} aria-expanded={open} aria-haspopup="listbox" aria-activedescendant={open ? `${id}-option-${active}` : undefined} className={styles.trigger} data-open={open} onClick={() => { setActive(selectedIndex); setOpen(!open); }} onKeyDown={event => {
      if (event.key === "Tab") { setOpen(false); return; }
      if (event.key === "Escape") { event.preventDefault(); setOpen(false); return; }
      if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
        event.preventDefault();
        setOpen(true);
        setActive(event.key === "Home" ? 0 : event.key === "End" ? items.length - 1 : !open ? selectedIndex : (active + (event.key === "ArrowDown" ? 1 : -1) + items.length) % items.length);
      } else if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        if (open) choose(active);
        else { setActive(selectedIndex); setOpen(true); }
      } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
        const now = Date.now();
        search.current = { text: now - search.current.time < 700 ? search.current.text + event.key : event.key, time: now };
        const found = items.findIndex(item => item.label.toLowerCase().startsWith(search.current.text.toLowerCase()));
        if (found >= 0) { event.preventDefault(); setActive(found); setOpen(true); }
      }
    }}><span>{items.find(item => item.value === value)?.label ?? `Select ${label}`}</span><ChevronDown size={15} strokeWidth={1.7} aria-hidden="true" /></button>
    {open ? <ul id={`${id}-options`} role="listbox" aria-labelledby={`${id}-label`} className={styles.menu}>
      {items.map((item, index) => <li key={item.value} id={`${id}-option-${index}`} role="option" aria-selected={value === item.value} data-index={index} data-active={active === index} onPointerMove={() => setActive(index)} onPointerDown={event => event.preventDefault()} onClick={() => choose(index)} className={styles.option}><span>{item.label}</span>{value === item.value ? <Check size={15} aria-hidden="true" /> : null}</li>)}
    </ul> : null}
  </div>;
}
