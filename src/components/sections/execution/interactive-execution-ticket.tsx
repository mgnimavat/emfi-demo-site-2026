"use client";

import { useEffect, useId, useRef, useState, type CSSProperties, type FormEvent, type KeyboardEvent } from "react";
import { ArrowDown, ArrowUp, Check, ChevronDown, Eye } from "lucide-react";
import { executionSecurities, demoExecutionSecurities, type ExecutionSymbol } from "@/content/execution-securities";
import styles from "./interactive-execution-ticket.module.css";

const money = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
type Side = "Buy" | "Sell";
type OrderType = "Market" | "Limit" | "Stop";
type Draft = { symbol: ExecutionSymbol; orderType: OrderType; timeInForce: "Day" | "GTC"; venue: "Interactive" | "Voice"; quantity: string; price: string };
const initialDraft: Draft = { symbol: "NVDA", orderType: "Market", timeInForce: "Day", venue: "Interactive", quantity: "100", price: "" };
type Preview = { stage?: "searching" | "submitting" | "booked"; running: boolean; submissionDuration: number };

export function InteractiveExecutionTicket({ preview, fillHeight = false, onSecurityChange }: { preview?: Preview; fillHeight?: boolean; onSecurityChange?: (symbol: ExecutionSymbol) => void }) {
  const securities = preview ? executionSecurities : demoExecutionSecurities;
  const [draft, setDraft] = useState<Draft>(() => ({ ...initialDraft, symbol: securities[0].symbol }));
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeResult, setActiveResult] = useState(0);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [side, setSide] = useState<Side>("Buy");
  const [status, setStatus] = useState<"editing" | "submitting" | "booked">("editing");
  const [error, setError] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const buyRef = useRef<HTMLButtonElement>(null);
  const id = useId();
  useEffect(() => () => { if (timer.current !== null) clearTimeout(timer.current); }, []);

  const animated = Boolean(preview);
  const pending = animated ? preview?.stage === "submitting" : status === "submitting";
  const booked = animated ? preview?.stage === "booked" : status === "booked";
  const security = securities.find((item) => item.symbol === draft.symbol) ?? securities[0];
  const quantity = Number(draft.quantity);
  const validQuantity = Number.isSafeInteger(quantity) && quantity > 0;
  const results = securities.filter((item) => `${item.symbol} ${item.name} ${item.isin}`.toLowerCase().includes(query.trim().toLowerCase()));
  const activeIndex = Math.min(activeResult, Math.max(0, results.length - 1));
  const searchValue = animated ? (preview?.stage && preview.stage !== "searching" ? "NVIDIA" : "") : query;

  function update(patch: Partial<Draft>) {
    setDraft((current) => ({ ...current, ...patch }));
    setStatus("editing");
    setError("");
  }

  function choose(symbol: ExecutionSymbol) {
    update({ symbol, price: "" });
    onSecurityChange?.(symbol);
    setQuery("");
    setSearchOpen(false);
    setActiveResult(0);
    searchRef.current?.focus();
  }

  function searchKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setSearchOpen(true);
      setActiveResult((current) => Math.max(0, Math.min(results.length - 1, current + (event.key === "ArrowDown" ? 1 : -1))));
    } else if (event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();
      if (results[activeIndex]) choose(results[activeIndex].symbol);
    } else if (event.key === "Escape") {
      event.preventDefault();
      setSearchOpen(false);
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (animated || pending) return;
    const submitter = (event.nativeEvent as SubmitEvent).submitter;
    const selectedSide: Side = submitter?.getAttribute("value") === "Sell" ? "Sell" : "Buy";
    if (!validQuantity) { setError("Enter a positive whole number of shares."); return; }
    const price = draft.orderType === "Limit" ? Number(draft.price) : selectedSide === "Buy" ? security.ask : security.bid;
    if (draft.orderType !== "Market" && (!Number.isFinite(Number(draft.price)) || Number(draft.price) <= 0)) { setError("Enter a valid positive price."); return; }
    if (!Number.isFinite(quantity * price)) { setError("Enter a valid quantity and price for this simulation."); return; }
    setSide(selectedSide);
    setError("");
    setSearchOpen(false);
    setStatus("submitting");
    timer.current = setTimeout(() => { setStatus("booked"); timer.current = null; }, 700);
  }

  return <form className={`${styles.ticket} ${fillHeight ? styles.fillHeight : ""}`} aria-label={animated ? "Animated execution preview" : "Simulated execution ticket"} onSubmit={submit} onKeyDown={(event) => {
    if (!animated && event.key === "Enter" && event.target instanceof HTMLInputElement && event.target !== searchRef.current) {
      event.preventDefault();
      event.currentTarget.requestSubmit(buyRef.current ?? undefined);
    }
  }}>
    <div className={styles.header}><span className={styles.windowTitle}><strong>Execution</strong></span></div>
    <div className={styles.body}>
      <fieldset disabled={animated || pending} className={styles.fields}>
        <legend className="sr-only">Order details</legend>
        <div className={styles.search} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setSearchOpen(false); }}>
          <div className={styles.searchControl}>
            <input ref={searchRef} type="search" role="combobox" aria-label="Security selection" aria-expanded={!animated && searchOpen} aria-controls={`${id}-securities`} aria-autocomplete="list" aria-activedescendant={searchOpen && results[activeIndex] ? `${id}-${results[activeIndex].symbol}` : undefined} autoComplete="off" placeholder={preview?.stage === "searching" ? "" : "Search by ISIN or Ticker..."} value={searchValue} onFocus={() => { if (!animated) setSearchOpen(true); }} onChange={(event) => { setQuery(event.target.value); setActiveResult(0); setSearchOpen(true); }} onKeyDown={searchKeyDown} />
            {animated && preview?.stage === "searching" ? <span key="searching" className={styles.animatedQuery} style={{ animationPlayState: preview.running ? "running" : "paused" }}>NVIDIA</span> : null}
            <button type="button" tabIndex={-1} aria-label="Show securities" className={styles.searchToggle} onClick={() => { const next = !searchOpen; searchRef.current?.focus(); setSearchOpen(next); }}><ChevronDown size={16} aria-hidden="true" /></button>
          </div>
          {searchOpen && !animated ? <ul id={`${id}-securities`} role="listbox" aria-label="Securities" className={styles.results}>
            {results.map((item, index) => <li key={item.symbol} role="option" id={`${id}-${item.symbol}`} aria-selected={index === activeIndex} onMouseDown={(event) => event.preventDefault()} onClick={() => choose(item.symbol)}><strong>{item.symbol} · {item.name}</strong><span>{item.isin}</span></li>)}
            {!results.length ? <li className={styles.empty} role="option" aria-disabled="true" aria-selected="false">No matching security</li> : null}
          </ul> : null}
        </div>
        <div className={styles.selectedSecurity}><strong>{security.name}</strong><span className={styles.securityActions}><span className={styles.optionBadge} aria-hidden="true">OPT</span><button type="button" className={styles.detailsButton} aria-label={detailsOpen ? "Hide security details" : "Show security details"} aria-expanded={detailsOpen} onClick={() => setDetailsOpen((open) => !open)}><Eye size={15} aria-hidden="true" /></button></span></div>
        {detailsOpen ? <p className={styles.securityDetails}>{security.symbol} · {security.exchange} · USD<br />{security.isin}</p> : null}
        <div className={styles.quotes} aria-label="Demo bid and ask prices in USD">
          <div className={styles.bid}><span>Bid</span><strong>{money.format(security.bid)} <ArrowUp size={12} aria-hidden="true" /></strong></div><span className={styles.spread} aria-hidden="true">-</span><div className={styles.ask}><span>Ask</span><strong><ArrowDown size={12} aria-hidden="true" /> {money.format(security.ask)}</strong></div>
        </div>
        <div className={styles.grid}>
          <label className={styles.field}>Order Type<span className={styles.selectControl}><select aria-label="Order type" value={draft.orderType} onChange={(event) => update({ orderType: event.target.value as OrderType, price: "" })}><option value="Market">Market</option><option value="Limit">Limit</option><option value="Stop">Stop</option></select><ChevronDown size={16} aria-hidden="true" /></span></label>
          <label className={styles.field}>Time<span className={styles.selectControl}><select aria-label="Time in force" value={draft.timeInForce} onChange={(event) => update({ timeInForce: event.target.value as Draft["timeInForce"] })}><option value="Day">Day</option><option>GTC</option></select><ChevronDown size={16} aria-hidden="true" /></span></label>
        </div>
        <label className={`${styles.field} ${styles.quantity}`}>Quantity<input required aria-label="Quantity" type="number" inputMode="numeric" min="1" step="1" value={draft.quantity} onChange={(event) => update({ quantity: event.target.value })} /></label>
        {draft.orderType !== "Market" ? <label className={`${styles.field} ${styles.priceField}`}>{draft.orderType === "Limit" ? "Limit price (USD)" : "Stop price (USD)"}<input required type="number" inputMode="decimal" min="0.01" step="0.01" placeholder="0.00" value={draft.price} onChange={(event) => update({ price: event.target.value })} /></label> : null}
      </fieldset>
      {error ? <p role="alert" className={styles.error}>{error}</p> : null}
      <div className={styles.orderActions}>
        <button type="submit" name="side" value="Sell" className={styles.sell} disabled={animated || pending} aria-busy={pending && !animated && side === "Sell"} data-booking={pending && !animated && side === "Sell"}>Sell</button>
        <button ref={buyRef} type="submit" name="side" value="Buy" className={styles.buy} disabled={animated || pending} aria-busy={pending && (animated || side === "Buy")} data-booking={pending && (animated || side === "Buy")} style={animated ? { "--booking-duration": `${preview?.submissionDuration}s`, "--booking-state": preview?.running ? "running" : "paused" } as CSSProperties : undefined}>Buy</button>
      </div>
      <div role={animated ? undefined : "status"} aria-live={animated ? "off" : "polite"} aria-atomic="true" className={styles.status}>
        {pending ? <p>Booking simulated {animated ? "buy" : side.toLowerCase()} order…</p> : booked ? <div className={styles.confirmation}><Check size={15} aria-hidden="true" /><span>{animated ? "Order booked · Buy NVIDIA · Simulation" : `Simulated order booked · ${side} ${quantity.toLocaleString("en-US")} ${security.symbol} · ${draft.orderType} · ${draft.timeInForce} · ${draft.venue}${draft.orderType !== "Market" ? ` · ${money.format(Number(draft.price))} USD` : ""}` }</span></div> : null}
      </div>
      <p className={styles.disclaimer}>Simulation only · No real order is placed.</p>
    </div>
  </form>;
}
