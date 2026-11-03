"use client";

import { useMemo, useState } from "react";
import { MaskedWorkstationValue } from '@/containers/Sections/WorkstationPrivacy';
import styles from "./execution-transactions.module.css";
import { unmaskedWorkstationTransactions, workstationTransactions } from '@/content/workstation-preview';
import { useCurrentMonth } from '@/lib/use-current-month';
import { previousMonthTransactionDates } from '@/lib/workstation-dates';

const columns = ["Reference", "Trade Date", "Settlement", "Security", "Order Type", "ISIN", "Direction", "Amount", "Price", "Market Value", "Accrued", "Portfolio", "Counterparty", "Status"];
const sensitiveColumns = new Set([
  'Security', 'Portfolio', 'Counterparty',
]);
const tradeDateColumn = columns.indexOf('Trade Date');
const settlementColumn = columns.indexOf('Settlement');
// These rows are constructed placeholders, never copied from a client or trading system.
const initialRows = Array.from({ length: 10 }, (_, index) => ({
  id: index, cells: ["XXXX", "XXXX", "XXXX", "XXXX", "Market", "XXXX", index % 2 ? "Sell" : "Buy", "XXXX", "XXXX", "XXXX", "XXXX", "XXXX", "XXXX", index < 3 ? "Pending" : "Filled"],
}));

export function ExecutionTransactions({ staticPreview = false, hideIsin = false, referenceStyle = 'masked' }: { staticPreview?: boolean; hideIsin?: boolean; referenceStyle?: 'masked' | 'full' }) {
  const [filters, setFilters] = useState<Record<number, string>>({});
  const currentMonth = useCurrentMonth();
  const previewRows = referenceStyle === 'full' ? unmaskedWorkstationTransactions : workstationTransactions;
  const datedPreviewRows = useMemo(() => {
    const dates = previousMonthTransactionDates(currentMonth);
    return previewRows.map((row) => {
      const cells = [...row.cells];
      cells[tradeDateColumn] = dates.tradeDate;
      cells[settlementColumn] = dates.settlementDate;
      return { ...row, cells };
    });
  }, [previewRows, currentMonth]);
  const records = staticPreview ? datedPreviewRows : initialRows;
  const filtered = useMemo(() => records.filter((row) => Object.entries(filters).every(([index, value]) => row.cells[Number(index)].toLowerCase().includes(value.trim().toLowerCase()))), [filters, records]);

  return <section className={styles.panel} aria-label="Demo transactions">
    <div className={styles.header}>
      <h3>Transaction</h3>
    </div>
    <div className={styles.scroll} tabIndex={0} role="region" aria-label="Scrollable dummy transaction table">
      <table>
        <thead><tr>{columns.map((column, index) => hideIsin && column === "ISIN" ? null : <th key={column} scope="col"><span>{column}</span>{[4, 6, 13].includes(index) ? <select aria-label={`Filter transactions by ${column}`} value={filters[index] ?? ""} onChange={(event) => setFilters((current) => ({ ...current, [index]: event.target.value }))}><option value="">All</option>{(index === 4 ? ["Market"] : index === 6 ? ["Buy", "Sell"] : ["Pending", "Filled", "Cancelled"]).map((value) => <option key={value}>{value}</option>)}</select> : <input aria-label={`Filter transactions by ${column}`} placeholder={column} value={filters[index] ?? ""} onChange={(event) => setFilters((current) => ({ ...current, [index]: event.target.value }))} />}</th>)}</tr></thead>
        <tbody>{filtered.map((row) => <tr key={row.id}>{row.cells.map((cell, index) => hideIsin && columns[index] === "ISIN" ? null : <td key={index}>{index === 13 ? <span className={styles.badge} data-status={cell}>{cell}</span> : <span>{staticPreview && sensitiveColumns.has(columns[index]) ? <MaskedWorkstationValue value={cell} /> : cell}</span>}</td>)}</tr>)}</tbody>
      </table>
      {!filtered.length ? <p className={styles.empty}>No demo transactions match these filters.</p> : null}
    </div>
    {!staticPreview ? <p className={styles.note} role="status">XXXX placeholders · Fictional demo records only · No live orders.</p> : null}
  </section>;
}
