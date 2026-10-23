"use client";

import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { ArrowLeft, FileText, Info, Search, X } from "lucide-react";
import type { SecurityReferenceData } from "@/lib/security-reference";
import { hasReferenceValue, securityDetailGroups } from "@/lib/security-reference-view";
import styles from "./security-reference.module.css";

const searchTypes = ["ISIN", "Security name", "Common Code"] as const;
type SearchType = typeof searchTypes[number];
const enabledSearchTypes: readonly SearchType[] = ["ISIN"];
const placeholders: Record<SearchType, string> = { ISIN: "Enter an ISIN", "Security name": "Enter a security name", "Common Code": "Enter a Common Code" };

export function SecurityReference() {
  const id = useId();
  const card = useRef<HTMLDivElement>(null);
  const [unavailable, setUnavailable] = useState<{ type: SearchType } | null>(null);
  const [type, setType] = useState<SearchType>("ISIN");
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [result, setResult] = useState<SecurityReferenceData | null>(null);
  const [lookupError, setLookupError] = useState("");
  const [detailOpen, setDetailOpen] = useState(false);
  const viewButton = useRef<HTMLButtonElement>(null);
  const request = useRef<AbortController | null>(null);
  useEffect(() => () => request.current?.abort(), []);
  function resetResult() { setUnavailable(null); request.current?.abort(); setStatus("idle"); setResult(null); setLookupError(""); setDetailOpen(false); }
  const input = useRef<HTMLInputElement>(null);
  const radios = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (!unavailable) return;
    const timer = window.setTimeout(() => setUnavailable(null), 5000);
    function outside(event: PointerEvent) { if (!card.current?.contains(event.target as Node)) setUnavailable(null); }
    document.addEventListener("pointerdown", outside);
    return () => { window.clearTimeout(timer); document.removeEventListener("pointerdown", outside); };
  }, [unavailable]);

  function choose(next: SearchType) {
    if (!enabledSearchTypes.includes(next)) { setUnavailable({ type: next }); return; }
    setUnavailable(null);
    if (next === type) return;
    setType(next); setError(""); resetResult();
  }
  function radioKeys(event: KeyboardEvent, index: number) {
    if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const current = enabledSearchTypes.indexOf(searchTypes[index]);
    const next = event.key === "Home" ? 0 : event.key === "End" ? enabledSearchTypes.length - 1 : (current + (["ArrowRight", "ArrowDown"].includes(event.key) ? 1 : -1) + enabledSearchTypes.length) % enabledSearchTypes.length;
    choose(enabledSearchTypes[next]);
    radios.current[searchTypes.indexOf(enabledSearchTypes[next])]?.focus();
  }
  async function search(event: FormEvent) {
    event.preventDefault();
    const value = query.trim();
    const message = !value ? "Enter a search value." : type === "ISIN" && !/^[A-Z]{2}[A-Z0-9]{9}\d$/i.test(value) ? "Enter a valid 12-character ISIN." : type === "Common Code" && !/^\d{9}$/.test(value) ? "Enter a 9-digit Common Code." : type === "Security name" && value.length < 2 ? "Enter at least two characters." : "";
    setError(message);
    if (message) { input.current?.focus(); return; }
    if (type !== "ISIN") { setError("Use an ISIN to retrieve security reference data."); input.current?.focus(); return; }
    request.current?.abort();
    const controller = new AbortController();
    request.current = controller;
    setStatus("loading");
    setResult(null);
    setLookupError("");
    try {
      const response = await fetch("/api/securities/find", { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify({ isin: value.toUpperCase() }), signal: controller.signal });
      const data = await response.json();
      if (controller.signal.aborted) return;
      if (!response.ok || !data.data) {
        setLookupError(typeof data.error === "string" ? data.error : "Could not retrieve security details. Please try again.");
        setStatus("error");
        return;
      }
      setResult(data.data);
      setStatus("done");
    } catch {
      if (!controller.signal.aborted) { setLookupError("Could not retrieve security details. Please try again."); setStatus("error"); }
    }
  }

  function clearSearch() {
    setQuery(""); setError(""); resetResult();
    requestAnimationFrame(() => input.current?.focus());
  }

  if (result && detailOpen) return <div className={styles.card}><ReferenceDetails result={result} onBack={() => { setDetailOpen(false); requestAnimationFrame(() => viewButton.current?.focus()); }} onClear={clearSearch} /></div>;

  return <div ref={card} className={styles.card} onKeyDown={event => { if (event.key === "Escape" && unavailable) { event.preventDefault(); setUnavailable(null); } }}>
    <div className={styles.cardIntro}><h3 id={`${id}-heading`}>Search Institutional Securities</h3><p>Find security reference information using an ISIN, security name or Common Code.</p></div>
    <form aria-labelledby={`${id}-heading`} onSubmit={search} noValidate>
      <span id={`${id}-search-by`} className={styles.label}>Search by</span>
      <div className={styles.searchMode}>
        <div className={styles.searchTypes} role="radiogroup" aria-labelledby={`${id}-search-by`}>{searchTypes.map((option, index) => <button key={option} ref={element => { radios.current[index] = element; }} type="button" role="radio" aria-disabled={!enabledSearchTypes.includes(option)} aria-checked={type === option} tabIndex={type === option ? 0 : -1} onPointerDown={event => { if (!enabledSearchTypes.includes(option)) event.preventDefault(); }} onClick={() => choose(option)} onKeyDown={event => radioKeys(event, index)}>{option}</button>)}</div>
        {unavailable ? <div className={styles.unavailableNotice}>
          <span className={styles.noticeIcon}><Info size={18} aria-hidden="true" /></span>
          <div role="status" aria-live="polite"><strong>{unavailable.type} search</strong><p>Temporarily unavailable. Please search by ISIN.</p></div>
          <button type="button" aria-label="Dismiss notice" onClick={() => { setUnavailable(null); radios.current[0]?.focus(); }}><X size={14} aria-hidden="true" /></button>
        </div> : null}
      </div>
      <label htmlFor={`${id}-query`} className={styles.label}>Search value</label>
      <div className={styles.inputWrap}><Search size={18} aria-hidden="true" /><input ref={input} id={`${id}-query`} type="search" value={query} placeholder={placeholders[type]} aria-invalid={Boolean(error)} aria-describedby={error ? `${id}-error` : undefined} autoComplete="off" maxLength={160} onChange={event => { setQuery(event.target.value); setError(""); resetResult(); }} /></div>
      {error ? <p id={`${id}-error`} className={styles.error} role="alert">{error}</p> : null}
      <div className={styles.actions}><button type="submit" disabled={status === "loading"}>{status === "loading" ? "Searching" : "Search"}</button><button type="button" onClick={clearSearch}>Clear</button></div>
    </form>
    {result ? <section className={styles.results} aria-label="Security search results" aria-live="polite">
      <h4>Result</h4>
      <article className={styles.matchCard}>
        <div className={styles.matchHeading}><h5>{result.basic.securityName || "Security reference"}</h5><button ref={viewButton} type="button" onClick={() => { setUnavailable(null); setDetailOpen(true); }}>View details</button></div>
        <dl className={styles.matchFields}>{[["ISIN", result.basic.isin], ["Instrument", result.euroclear?.instrument], ["Common Code", result.euroclear?.commonCode]].filter(([, value]) => hasReferenceValue(value)).map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
      </article>
    </section> : <div className={`${styles.result} ${status === "idle" ? styles.emptyState : ""}`} role="status" aria-live="polite" aria-busy={status === "loading"}>
      {status === "loading" ? <div className={styles.skeleton} aria-label="Loading security details">{[0, 1, 2, 3].map(line => <span key={line} />)}</div> : status === "error" ? <><strong>{lookupError}</strong><p>Check your search value or try again.</p></> : <><div className={styles.emptyVisual} aria-hidden="true"><span className={styles.emptyHalo} /><span className={styles.emptyDocument}><FileText size={30} strokeWidth={1.25} /></span><span className={styles.emptySearch}><Search size={19} strokeWidth={1.7} /></span></div><div className={styles.emptyCopy}><strong>Find a security</strong><p>Enter an ISIN above to explore security details and settlement information.</p></div></>}
    </div>}

  </div>;
}

function ReferenceDetails({ result, onBack, onClear }: { result: SecurityReferenceData; onBack: () => void; onClear: () => void }) {
  const id = useId();
  const [tab, setTab] = useState(0);
  const heading = useRef<HTMLHeadingElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  useEffect(() => { heading.current?.focus({ preventScroll: true }); }, []);
  const { basic } = result;
  const groups = securityDetailGroups(result.sections);
  const availableTabs = [{ label: "Security details", groups: groups.security }, { label: "Settlement", groups: groups.settlement }].filter(tab => tab.groups.length);
  const tabLabels = availableTabs.map(tab => tab.label);
  return <section className={styles.detailsView} aria-label="Security reference details">
    <div className={styles.detailActions}><button type="button" onClick={onBack}><ArrowLeft size={14} aria-hidden="true" />Back to results</button><button type="button" onClick={onClear}>Clear</button></div>
    <h3 ref={heading} tabIndex={-1} className={styles.detailTitle}>{basic.securityName || "Security reference"}</h3>
    {result.sourceName ? <p className={styles.detailSource}>{result.sourceName}</p> : null}
    <div className={styles.detailTabs} role="tablist" aria-label="Security information">{tabLabels.map((label, index) => <button key={label} ref={element => { tabs.current[index] = element; }} type="button" role="tab" id={`${id}-tab-${index}`} aria-controls={`${id}-panel-${index}`} aria-selected={tab === index} tabIndex={tab === index ? 0 : -1} onClick={() => setTab(index)} onKeyDown={event => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === "Home" ? 0 : event.key === "End" ? tabLabels.length - 1 : (index + (event.key === "ArrowRight" ? 1 : -1) + tabLabels.length) % tabLabels.length;
      setTab(next); tabs.current[next]?.focus();
    }}>{label}</button>)}</div>
    <div className={styles.detailPanel} role="tabpanel" id={`${id}-panel-${tab}`} aria-labelledby={`${id}-tab-${tab}`} tabIndex={0}>
      {(availableTabs[tab]?.groups ?? []).map((group, index) => <div key={`${group.title}/${index}`}>
        {group.title ? <h4 className={styles.groupTitle}>{group.title}</h4> : null}
        <dl className={styles.detailRows}>{group.fields.map(field => <div key={field.path}><dt>{field.label}</dt><dd>{field.eligibility ? <span className={styles.eligibilityBadge} data-state={field.value}>{field.value}</span> : field.value}</dd></div>)}</dl>
      </div>)}
    </div>
  </section>;
}
