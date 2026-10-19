"use client";

import { useMemo, useState } from "react";
import { GripVertical, RotateCw, Trash2, X } from "lucide-react";
import styles from "./execution-transactions.module.css";

const columns = ["Reference", "Trade Date", "Settlement", "Security", "Order Type", "ISIN", "Direction", "Amount", "Price", "Market Value", "Accrued", "Portfolio", "Counterparty", "Status"];
// These rows are constructed placeholders, never copied from a client or trading system.
const initialRows = Array.from({ length: 10 }, (_, index) => ({
  id: index, cells: ["XXXX", "XXXX", "XXXX", "XXXX", "Market", "XXXX", index % 2 ? "Sell" : "Buy", "XXXX", "XXXX", "XXXX", "XXXX", "XXXX", "XXXX", index < 3 ? "Pending" : "Filled"],
}));

export function ExecutionTransactions() {
  const [rows, setRows] = useState(initialRows);
  const [filters, setFilters] = useState<Record<number, string>>({});
  const [closed, setClosed] = useState(false);
  const [notice, setNotice] = useState("");
  const filtered = useMemo(() => rows.filter((row) => Object.entries(filters).every(([index, value]) => row.cells[Number(index)].toLowerCase().includes(value.trim().toLowerCase()))), [rows, filters]);

  if (closed) return <div className={styles.closed}><button type="button" onClick={() => setClosed(false)}>Open transactions</button></div>;
  return <section className={styles.panel} aria-label="Demo transactions">
    <div className={styles.header}>
      <h3><GripVertical size={15} aria-hidden="true" />Transaction</h3>
      <div className={styles.actions}>
        <button type="button" className={styles.kill} disabled={!rows.some((row) => row.cells[13] === "Pending")} onClick={() => { setRows((current) => current.map((row) => row.cells[13] === "Pending" ? { ...row, cells: row.cells.map((cell, i) => i === 13 ? "Cancelled" : cell) } : row)); setNotice("Pending demo orders cancelled locally."); }}><Trash2 size={12} aria-hidden="true" />Kill All</button>
        <button type="button" aria-label="Reset transaction filters" onClick={() => { setFilters({}); setNotice("Filters reset."); }}><X size={15} aria-hidden="true" /></button>
        <button type="button" aria-label="Reload demo transactions" onClick={() => { setRows(initialRows); setFilters({}); setNotice("Demo records restored."); }}><RotateCw size={15} aria-hidden="true" /></button>
        <button type="button" aria-label="Close transactions" onClick={() => setClosed(true)}><X size={19} aria-hidden="true" /></button>
      </div>
    </div>
    <div className={styles.scroll} tabIndex={0} role="region" aria-label="Scrollable dummy transaction table">
      <table>
        <thead><tr>{columns.map((column, index) => <th key={column} scope="col"><span>{column}</span>{[4, 6, 13].includes(index) ? <select aria-label={`Filter transactions by ${column}`} value={filters[index] ?? ""} onChange={(event) => setFilters((current) => ({ ...current, [index]: event.target.value }))}><option value="">All</option>{(index === 4 ? ["Market"] : index === 6 ? ["Buy", "Sell"] : ["Pending", "Filled", "Cancelled"]).map((value) => <option key={value}>{value}</option>)}</select> : <input aria-label={`Filter transactions by ${column}`} placeholder={column} value={filters[index] ?? ""} onChange={(event) => setFilters((current) => ({ ...current, [index]: event.target.value }))} />}</th>)}</tr></thead>
        <tbody>{filtered.map((row) => <tr key={row.id}>{row.cells.map((cell, index) => <td key={index}>{index === 13 ? <span className={styles.badge} data-status={cell}>{cell}</span> : cell}</td>)}</tr>)}</tbody>
      </table>
      {!filtered.length ? <p className={styles.empty}>No demo transactions match these filters.</p> : null}
    </div>
    <p className={styles.note} role="status">{notice || "XXXX placeholders · Fictional demo records only · No live orders."}</p>
  </section>;
}
