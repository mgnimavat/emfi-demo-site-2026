"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowRight, Check } from "lucide-react";
import styles from "./interactive-execution-ticket.module.css";

// Fixed demonstration prices, not a live market feed or executable quotes.
const securities = [
  { symbol: "NVDA", name: "NVIDIA", exchange: "NASDAQ", bid: 217.22, ask: 217.24 },
  { symbol: "AAPL", name: "Apple", exchange: "NASDAQ", bid: 229.90, ask: 229.94 },
  { symbol: "MSFT", name: "Microsoft", exchange: "NASDAQ", bid: 418.10, ask: 418.16 },
] as const;
const money = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
type OrderType = "Market" | "Limit" | "Stop";
type Draft = { symbol: string; orderType: OrderType; timeInForce: "Day" | "GTC"; side: "Buy" | "Sell"; quantity: string; price: string };
const initialDraft: Draft = { symbol: "NVDA", orderType: "Market", timeInForce: "Day", side: "Buy", quantity: "10000", price: "" };

export function InteractiveExecutionTicket() {
  const [draft, setDraft] = useState(initialDraft);
  const [status, setStatus] = useState<"editing" | "submitting" | "booked">("editing");
  const [error, setError] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current !== null) clearTimeout(timer.current); }, []);

  const security = securities.find((item) => item.symbol === draft.symbol) ?? securities[0];
  const quantity = Number(draft.quantity);
  const validQuantity = Number.isSafeInteger(quantity) && quantity > 0;
  const marketPrice = draft.side === "Buy" ? security.ask : security.bid;
  const indicativePrice = draft.orderType === "Limit" ? Number(draft.price) : marketPrice;
  const calculatedValue = validQuantity && indicativePrice > 0 ? quantity * indicativePrice : NaN;
  const orderValue = Number.isFinite(calculatedValue) ? calculatedValue : null;
  const pending = status === "submitting";

  function update(patch: Partial<Draft>) {
    setDraft((current) => ({ ...current, ...patch }));
    setStatus("editing");
    setError("");
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    if (!validQuantity) { setError("Enter a positive whole number of shares."); return; }
    if (draft.orderType !== "Market" && (!Number.isFinite(Number(draft.price)) || Number(draft.price) <= 0)) { setError("Enter a valid positive price."); return; }
    if (orderValue === null) { setError("Enter a valid quantity and price for this simulation."); return; }
    setError("");
    setStatus("submitting");
    timer.current = setTimeout(() => { setStatus("booked"); timer.current = null; }, 700);
  }

  return <form className={styles.ticket} aria-label="Simulated execution ticket" onSubmit={submit}>
    <div className={styles.header}><span><strong>emfi</strong> / Execution</span><span className={styles.badge}><i aria-hidden="true" />Illustrative</span></div>
    <div className={styles.body}>
      <fieldset disabled={pending} className={styles.fields}>
        <legend className="sr-only">Order details</legend>
        <label className={styles.security}>Security selection
          <span className={styles.securityControl}>
            <select aria-label="Security selection" value={draft.symbol} onChange={(event) => update({ symbol: event.target.value, price: "" })}>{securities.map((item) => <option key={item.symbol} value={item.symbol}>{item.symbol} · {item.name}</option>)}</select>
            <span className={styles.exchange}>{security.exchange} · USD</span>
          </span>
        </label>
        <p className={styles.quoteNote}>Illustrative prices · USD · Not live</p>
        <div className={styles.quotes} aria-live="polite">
          <div className={styles.bid}><span>Bid</span><strong>{money.format(security.bid)}</strong></div>
          <div className={styles.ask}><span>Ask</span><strong>{money.format(security.ask)}</strong></div>
        </div>
        <div className={styles.grid}>
          <label className={styles.field}>Order type<select aria-label="Order type" value={draft.orderType} onChange={(event) => update({ orderType: event.target.value as OrderType, price: "" })}><option>Market</option><option>Limit</option><option>Stop</option></select></label>
          <label className={styles.field}>Time in force<select aria-label="Time in force" value={draft.timeInForce} onChange={(event) => update({ timeInForce: event.target.value as Draft["timeInForce"] })}><option>Day</option><option value="GTC">GTC</option></select></label>
          <label className={styles.field}>Side<select aria-label="Side" value={draft.side} onChange={(event) => update({ side: event.target.value as Draft["side"] })}><option>Buy</option><option>Sell</option></select></label>
          <label className={styles.field}>Number of shares<input required type="number" inputMode="numeric" min="1" step="1" value={draft.quantity} onChange={(event) => update({ quantity: event.target.value })} /></label>
          {draft.orderType !== "Market" ? <label className={`${styles.field} ${styles.priceField}`}>{draft.orderType === "Limit" ? "Limit price (USD)" : "Stop price (USD)"}<input required type="number" inputMode="decimal" min="0.01" step="0.01" placeholder="0.00" value={draft.price} onChange={(event) => update({ price: event.target.value })} /></label> : null}
        </div>
      </fieldset>
      <div className={styles.total}><span>Estimated order value</span><output aria-live="polite" aria-label="Estimated order value">{orderValue === null ? "—" : money.format(orderValue)} USD</output></div>
      {error ? <p role="alert" className={styles.error}>{error}</p> : null}
      <button type="submit" className={styles.submit} disabled={pending} aria-busy={pending}>{pending ? "Booking simulated order…" : status === "booked" ? "Run simulation again" : "Simulate order"}<ArrowRight size={15} aria-hidden="true" /></button>
      <div role="status" aria-live="polite" aria-atomic="true">
        {status === "booked" ? <div className={styles.confirmation}><Check size={18} aria-hidden="true" /><div><strong>Simulated order booked</strong><p>{draft.side} {quantity.toLocaleString("en-US")} {security.symbol} · {draft.orderType} · {draft.timeInForce}{draft.orderType !== "Market" ? ` · ${money.format(Number(draft.price))} USD ${draft.orderType.toLowerCase()} price` : ""}</p></div></div> : null}
      </div>
      <p className={styles.disclaimer}>Simulation only. No real order is placed.</p>
    </div>
  </form>;
}
