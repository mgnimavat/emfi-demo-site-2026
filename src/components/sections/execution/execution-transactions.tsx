"use client";

import { useMemo, useState } from "react";
import { useServiceLocale } from "@/ui/hooks/useServiceLocale";
import { MaskedWorkstationValue } from '@/containers/Sections/WorkstationPrivacy';
import styles from "./execution-transactions.module.css";
import { unmaskedWorkstationTransactions, workstationTransactions } from '@/content/workstation-preview';
import { useCurrentMonth } from '@/lib/use-current-month';
import { previousMonthTransactionDates } from '@/lib/workstation-dates';

const columns = ["Reference", "Trade Date", "Settlement", "Security", "Order Type", "ISIN", "Direction", "Amount", "Price", "Market Value", "Accrued", "Portfolio", "Counterparty", "Status"];
const displayedColumns = new Set([
  'Reference',
  // 'Trade Date',
  // 'Settlement',
  'Security', 'Order Type', 'ISIN', 'Direction', 'Amount', 'Price',
  'Market Value', 'Accrued', 'Portfolio', 'Counterparty', 'Status',
]);
const sensitiveColumns = new Set([
  'Security', 'Portfolio', 'Counterparty',
]);
const tradeDateColumn = columns.indexOf('Trade Date');
const settlementColumn = columns.indexOf('Settlement');
const compactHiddenColumns = new Set(['ISIN', 'Portfolio', 'Counterparty', 'Accrued', 'Order Type']);
// These rows are constructed placeholders, never copied from a client or trading system.
const initialRows = Array.from({ length: 10 }, (_, index) => ({
  id: index, cells: ["XXXX", "XXXX", "XXXX", "XXXX", "Market", "XXXX", index % 2 ? "Sell" : "Buy", "XXXX", "XXXX", "XXXX", "XXXX", "XXXX", "XXXX", index < 3 ? "Pending" : "Filled"],
}));

export function ExecutionTransactions({ staticPreview = false, hideIsin = false, compact = false, referenceStyle = 'masked' }: { staticPreview?: boolean; hideIsin?: boolean; compact?: boolean; referenceStyle?: 'masked' | 'full' }) {
  const { t } = useServiceLocale();
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
  const isHiddenColumn = (column: string) => !displayedColumns.has(column) || (hideIsin && column === 'ISIN') || (compact && compactHiddenColumns.has(column));

  return <section className={styles.panel} aria-label={t("Demo transactions")}>
    <div className={styles.header}>
      <h3>{t("Transaction")}</h3>
    </div>
    <div className={`${styles.scroll} ${compact ? styles.compactScroll : ''}`} tabIndex={0} role="region" aria-label={t("Scrollable dummy transaction table")}>
      <table className={compact ? styles.compactTable : undefined}>
        {compact ? <colgroup>{columns.map((column) => isHiddenColumn(column) ? null : <col key={column} data-column={column} />)}</colgroup> : null}
        <thead><tr>{columns.map((column, index) => isHiddenColumn(column) ? null : <th key={column} scope="col"><span>{t(column)}</span>{[4, 6, 13].includes(index) ? <select aria-label={`${t("Filter transactions by")} ${t(column)}`} value={filters[index] ?? ""} onChange={(event) => setFilters((current) => ({ ...current, [index]: event.target.value }))}><option value="">{t("All")}</option>{(index === 4 ? ["Market"] : index === 6 ? ["Buy", "Sell"] : ["Pending", "Filled", "Cancelled"]).map((value) => <option key={value} value={value}>{t(value)}</option>)}</select> : <input aria-label={`${t("Filter transactions by")} ${t(column)}`} placeholder={t(column)} value={filters[index] ?? ""} onChange={(event) => setFilters((current) => ({ ...current, [index]: event.target.value }))} />}</th>)}</tr></thead>
        <tbody>{filtered.map((row) => <tr key={row.id}>{row.cells.map((cell, index) => isHiddenColumn(columns[index]) ? null : <td key={index} data-label={compact ? t(columns[index]) : undefined}>{index === 13 ? <span className={styles.badge} data-status={cell}>{t(cell)}</span> : <span>{staticPreview && sensitiveColumns.has(columns[index]) ? <MaskedWorkstationValue value={cell} /> : t(cell)}</span>}</td>)}</tr>)}</tbody>
      </table>
      {!filtered.length ? <p className={styles.empty}>{t("No demo transactions match these filters.")}</p> : null}
    </div>
    {!staticPreview ? <p className={styles.note} role="status">{t("XXXX placeholders · Fictional demo records only · No live orders.")}</p> : null}
  </section>;
}
