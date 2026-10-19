"use client";

import { useRef, useState, type FormEvent } from "react";
import { Check, GripVertical, Pencil, Plus, X } from "lucide-react";
import { executionWatchlists, type ExecutionWatchlist } from "@/content/execution-watchlists";
import styles from "./execution-watchlists.module.css";

function WatchlistPanel({ definition }: { definition: ExecutionWatchlist }) {
  const [ids, setIds] = useState<readonly string[]>(definition.initialIds);
  const [editing, setEditing] = useState(false);
  const [adding, setAdding] = useState(false);
  const [candidate, setCandidate] = useState("");
  const [closed, setClosed] = useState(false);
  const addRef = useRef<HTMLButtonElement>(null);
  const editRef = useRef<HTMLButtonElement>(null);
  const pickerRef = useRef<HTMLSelectElement>(null);
  const reopenRef = useRef<HTMLButtonElement>(null);
  const titleId = `watchlist-${definition.id}-heading`;
  const remaining = definition.instruments.filter((instrument) => !ids.includes(instrument.id));
  const rows = ids.flatMap((id) => {
    const instrument = definition.instruments.find((item) => item.id === id);
    return instrument ? [instrument] : [];
  });
  const price = new Intl.NumberFormat("en-US", { minimumFractionDigits: definition.precision, maximumFractionDigits: definition.precision, useGrouping: false });

  function openPicker() {
    setCandidate(remaining[0]?.id ?? "");
    setAdding(true);
    requestAnimationFrame(() => pickerRef.current?.focus());
  }

  function add(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!remaining.some((item) => item.id === candidate)) return;
    setIds((current) => current.includes(candidate) ? current : [...current, candidate]);
    setAdding(false);
    requestAnimationFrame(() => editRef.current?.focus());
  }

  if (closed) return <article className={styles.closed} aria-label={`${definition.title} watchlist closed`}><button ref={reopenRef} type="button" onClick={() => setClosed(false)}>Open {definition.title} watchlist</button></article>;

  return <article className={styles.panel} aria-labelledby={titleId}>
    <div className={styles.header}>
      <div className={styles.title}><GripVertical size={15} aria-hidden="true" /><h3 id={titleId}>Equity Monitor</h3></div>
      <div className={styles.actions}>
        <button ref={editRef} type="button" aria-label={editing ? `Done editing ${definition.title} watchlist` : `Edit ${definition.title} watchlist`} aria-pressed={editing} onClick={() => setEditing((current) => !current)}>{editing ? <Check size={18} aria-hidden="true" /> : <Pencil size={18} aria-hidden="true" />}</button>
        <button ref={addRef} type="button" aria-label={`Add instrument to ${definition.title} watchlist`} disabled={!remaining.length} title={remaining.length ? "Add instrument" : "All demo instruments are listed"} aria-expanded={adding} onClick={() => { if (adding) setAdding(false); else openPicker(); }}><Plus size={21} aria-hidden="true" /></button>
        <button type="button" aria-label={`Close ${definition.title} watchlist`} onClick={() => { setAdding(false); setClosed(true); requestAnimationFrame(() => reopenRef.current?.focus()); }}><X size={19} aria-hidden="true" /></button>
      </div>
    </div>
    {adding ? <form className={styles.addForm} aria-label={`Add to ${definition.title} watchlist`} onSubmit={add}>
      <label className="sr-only" htmlFor={`watchlist-${definition.id}-instrument`}>Instrument</label>
      <select ref={pickerRef} id={`watchlist-${definition.id}-instrument`} required value={candidate} onChange={(event) => setCandidate(event.target.value)}>{remaining.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select>
      <button type="submit" className={styles.addConfirm}>Add</button>
      <button type="button" className={styles.cancel} aria-label={`Cancel adding to ${definition.title} watchlist`} onClick={() => { setAdding(false); requestAnimationFrame(() => addRef.current?.focus()); }}><X size={16} aria-hidden="true" /></button>
    </form> : null}
    <table className={styles.table} aria-label={`${definition.title} sample quotes`}>
      <colgroup><col /><col className={styles.priceColumn} /><col className={styles.priceColumn} />{editing ? <col className={styles.removeColumn} /> : null}</colgroup>
      <thead><tr><th scope="col">Name</th><th scope="col">Bid</th><th scope="col">Ask</th>{editing ? <th scope="col"><span className="sr-only">Remove</span></th> : null}</tr></thead>
      <tbody>{rows.map((instrument) => <tr key={instrument.id}>
        <th scope="row"><span className={styles.instrument} title={instrument.name}>{instrument.name}</span><span className={styles.identifier} title={instrument.identifier}>{instrument.identifier}</span></th>
        <td className={styles.bid}><span>{price.format(instrument.bid)}</span><small>{instrument.bidSize}</small></td>
        <td className={styles.ask}><span>{price.format(instrument.ask)}</span><small>{instrument.askSize}</small></td>
        {editing ? <td className={styles.removeCell}><button type="button" aria-label={`Remove ${instrument.name} from ${definition.title} watchlist`} onClick={() => setIds((current) => current.filter((id) => id !== instrument.id))}><X size={14} aria-hidden="true" /></button></td> : null}
      </tr>)}</tbody>
    </table>
    {!rows.length ? <p className={styles.empty}>No instruments yet. Use + to add one.</p> : null}
  </article>;
}

export function ExecutionWatchlists() {
  return <section className={styles.watchlists} aria-label="Equity monitor">
    <div className={styles.categoryPanel}><WatchlistPanel definition={executionWatchlists[0]} /></div>
    <p className={styles.note}>Sample prices and sizes · Not a live market feed.</p>
  </section>;
}
