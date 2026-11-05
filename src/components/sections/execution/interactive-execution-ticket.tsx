"use client";

import { useEffect, useId, useRef, useState, type CSSProperties, type FormEvent, type KeyboardEvent } from "react";
import { useServiceLocale } from "@/ui/hooks/useServiceLocale";
import { ArrowDown, ArrowUp, Check, ChevronDown, Eye } from "lucide-react";
import { executionSecurities, demoExecutionSecurities, type ExecutionSecurity, type ExecutionSymbol } from "@/content/execution-securities";
import { MaskedWorkstationValue } from '@/containers/Sections/WorkstationPrivacy';
import styles from "./interactive-execution-ticket.module.css";

const money = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const maskedPrice = '***';
type Side = "Buy" | "Sell";
type OrderType = "Market" | "Limit" | "Stop";
type Draft = { symbol: ExecutionSymbol; orderType: OrderType; timeInForce: "Day" | "GTC"; venue: "Interactive" | "Voice"; quantity: string; price: string };
const initialDraft: Draft = { symbol: "NVDA", orderType: "Market", timeInForce: "Day", venue: "Interactive", quantity: "100", price: "" };
type Preview = { stage?: "searching" | "submitting" | "booked"; running: boolean; submissionDuration: number };

export function InteractiveExecutionTicket({ preview, fillHeight = false, staticPreview = false, controlsEnabled = !staticPreview, hideIsin = false, maskPrices = false, orderPreview, securities: availableSecurities, onSecurityChange }: { preview?: Preview; fillHeight?: boolean; staticPreview?: boolean; controlsEnabled?: boolean; hideIsin?: boolean; maskPrices?: boolean; orderPreview?: Pick<Draft, "orderType" | "timeInForce">; securities?: readonly ExecutionSecurity[]; onSecurityChange?: (symbol: ExecutionSymbol) => void }) {
  const { t } = useServiceLocale();
  const securities = availableSecurities?.length ? availableSecurities : preview || staticPreview ? executionSecurities : demoExecutionSecurities;
  const [draft, setDraft] = useState<Draft>(() => ({ ...initialDraft, ...orderPreview, symbol: securities[0].symbol }));
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
  const showOrderPreview = animated && Boolean(orderPreview);
  const pending = animated ? preview?.stage === "submitting" : status === "submitting";
  const booked = animated ? preview?.stage === "booked" : status === "booked";
  const security = securities.find((item) => item.symbol === draft.symbol) ?? securities[0];
  const quantity = Number(draft.quantity);
  const validQuantity = Number.isSafeInteger(quantity) && quantity > 0;
  const results = securities.filter((item) => `${item.symbol} ${item.name} ${item.isin}`.toLowerCase().includes(query.trim().toLowerCase()));
  const activeIndex = Math.min(activeResult, Math.max(0, results.length - 1));
  const previewName = security.symbol === 'NVDA' ? 'NVIDIA' : security.name;
  const searchValue = animated ? (preview?.stage && preview.stage !== "searching" ? previewName : "") : query;

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
    if (!controlsEnabled || animated || pending) return;
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

  return <form className={`${styles.ticket} ${fillHeight ? styles.fillHeight : ""} ${animated && fillHeight ? styles.previewFill : ""}`} aria-label={animated ? t("Animated execution preview") : t("Simulated execution ticket")} onSubmit={submit} onKeyDown={(event) => {
    if (!animated && event.key === "Enter" && event.target instanceof HTMLInputElement && event.target !== searchRef.current) {
      event.preventDefault();
      event.currentTarget.requestSubmit(buyRef.current ?? undefined);
    }
  }}>
    <div className={styles.header}><span className={styles.windowTitle}><strong>{t("Execution")}</strong></span></div>
    <div className={styles.body}>
      <fieldset disabled={!controlsEnabled || animated || pending} className={styles.fields}>
        <legend className="sr-only">{t("Order details")}</legend>
        <div className={styles.search} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setSearchOpen(false); }}>
          <div className={styles.searchControl}>
            <input ref={searchRef} disabled={staticPreview} type="search" role="combobox" aria-label={t("Security selection")} aria-expanded={!staticPreview && !animated && searchOpen} aria-controls={`${id}-securities`} aria-autocomplete="list" aria-activedescendant={searchOpen && results[activeIndex] ? `${id}-${results[activeIndex].symbol}` : undefined} autoComplete="off" placeholder={preview?.stage === "searching" ? "" : hideIsin ? t("Search by ticker or name...") : t("Search by ISIN or Ticker...")} value={searchValue} onFocus={() => { if (!animated) setSearchOpen(true); }} onChange={(event) => { setQuery(event.target.value); setActiveResult(0); setSearchOpen(true); }} onKeyDown={searchKeyDown} />
            {animated && preview?.stage === "searching" ? <span key="searching" className={styles.animatedQuery} style={{ animationPlayState: preview.running ? "running" : "paused" }}>{previewName}</span> : null}
            <button type="button" disabled={staticPreview} tabIndex={-1} aria-label={t("Show securities")} className={styles.searchToggle} onClick={() => { const next = !searchOpen; searchRef.current?.focus(); setSearchOpen(next); }}><ChevronDown size={16} aria-hidden="true" /></button>
          </div>
          {searchOpen && !animated && !staticPreview ? <ul id={`${id}-securities`} role="listbox" aria-label={t("Securities")} className={styles.results}>
            {results.map((item, index) => <li key={item.symbol} role="option" id={`${id}-${item.symbol}`} aria-selected={index === activeIndex} onMouseDown={(event) => event.preventDefault()} onClick={() => choose(item.symbol)}><strong>{staticPreview ? <MaskedWorkstationValue value={item.name} /> : `${item.symbol} · ${item.name}`}</strong>{!hideIsin ? <span>{item.isin}</span> : null}</li>)}
            {!results.length ? <li className={styles.empty} role="option" aria-disabled="true" aria-selected="false">{t("No matching security")}</li> : null}
          </ul> : null}
        </div>
        <div className={styles.selectedSecurity}><strong>{staticPreview ? <MaskedWorkstationValue value={security.name} /> : security.name}</strong><span className={styles.securityActions}><span className={styles.optionBadge} aria-hidden="true">OPT</span><button type="button" className={styles.detailsButton} aria-label={detailsOpen ? t("Hide security details") : t("Show security details")} aria-expanded={detailsOpen} onClick={() => setDetailsOpen((open) => !open)}><Eye size={15} aria-hidden="true" /></button></span></div>
        {detailsOpen ? <p className={styles.securityDetails}><span>{staticPreview ? <MaskedWorkstationValue value={security.symbol} /> : security.symbol}</span> · {security.exchange}  {t("· USD")}{!hideIsin ? <><br />{security.isin}</> : null}</p> : null}
        <div className={styles.quotes} aria-label={t("Demo bid and ask prices in USD")}>
          <div className={styles.bid}><span>{t("Bid")}</span><strong>{maskPrices ? maskedPrice : money.format(security.bid)} <ArrowUp size={12} aria-hidden="true" /></strong></div><span className={styles.spread} aria-hidden="true">-</span><div className={styles.ask}><span>{t("Ask")}</span><strong><ArrowDown size={12} aria-hidden="true" /> {maskPrices ? maskedPrice : money.format(security.ask)}</strong></div>
        </div>
        <div className={styles.grid}>
          <label className={styles.field}>{t("Order Type")}<span className={styles.selectControl}><select aria-label={t("Order type")} value={showOrderPreview ? orderPreview?.orderType : draft.orderType} onChange={(event) => update({ orderType: event.target.value as OrderType, price: "" })}><option value="Market">{showOrderPreview ? t("MARKET") : t("Market")}</option><option value="Limit">{showOrderPreview ? t("LIMIT") : t("Limit")}</option><option value="Stop">{showOrderPreview ? t("STOP") : t("Stop")}</option></select><ChevronDown size={16} aria-hidden="true" /></span></label>
          <label className={styles.field}>{t("Time")}<span className={styles.selectControl}><select aria-label={t("Time in force")} value={showOrderPreview ? orderPreview?.timeInForce : draft.timeInForce} onChange={(event) => update({ timeInForce: event.target.value as Draft["timeInForce"] })}><option value="Day">{showOrderPreview ? t("DAY") : t("Day")}</option><option>GTC</option></select><ChevronDown size={16} aria-hidden="true" /></span></label>
        </div>
        <label className={`${styles.field} ${styles.quantity}`}>{t("Quantity")}<input required aria-label={t("Quantity")} type="number" inputMode="numeric" min="1" step="1" value={draft.quantity} onChange={(event) => update({ quantity: event.target.value })} /></label>
        {draft.orderType !== "Market" && !showOrderPreview ? <label className={`${styles.field} ${styles.priceField}`}>{draft.orderType === "Limit" ? t("Limit price (USD)") : t("Stop price (USD)")}<input required type="number" inputMode="decimal" min="0.01" step="0.01" placeholder="0.00" value={draft.price} onChange={(event) => update({ price: event.target.value })} /></label> : null}
      </fieldset>
      {error ? <p role="alert" className={styles.error}>{t(error)}</p> : null}
      <div className={styles.orderActions}>
        <button type="submit" name="side" value="Sell" className={styles.sell} disabled={!controlsEnabled || animated || pending} aria-busy={pending && !animated && side === "Sell"} data-booking={pending && !animated && side === "Sell"}>{t("Sell")}</button>
        <button ref={buyRef} type="submit" name="side" value="Buy" className={styles.buy} disabled={!controlsEnabled || animated || pending} aria-busy={pending && (animated || side === "Buy")} data-booking={pending && (animated || side === "Buy")} style={animated ? { "--booking-duration": `${preview?.submissionDuration}s`, "--booking-state": preview?.running ? "running" : "paused" } as CSSProperties : undefined}>{t("Buy")}</button>
      </div>
      {!staticPreview ? <div role={animated ? undefined : "status"} aria-live={animated ? "off" : "polite"} aria-atomic="true" className={styles.status}>
        {pending ? <p>{t("Booking simulated")} {animated ? t("Buy") : t(side)}  {t("order…")}</p> : booked ? <div className={styles.confirmation}><Check size={15} aria-hidden="true" /><span>{animated ? `${t("Order booked")} · ${t("Buy")} ${previewName} · ${t("Simulation")}` : `${t("Simulated order booked")} · ${t(side)} ${quantity.toLocaleString("en-US")} ${security.symbol} · ${t(draft.orderType)} · ${t(draft.timeInForce)} · ${t(draft.venue)}${draft.orderType !== "Market" ? ` · ${money.format(Number(draft.price))} USD` : ""}` }</span></div> : null}
      </div> : null}
      {!staticPreview ? <p className={styles.disclaimer}>{t("Simulation only · No real order is placed.")}</p> : null}
    </div>
  </form>;
}
