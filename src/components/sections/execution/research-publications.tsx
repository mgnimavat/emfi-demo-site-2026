"use client";

import { useId, useState, useSyncExternalStore } from "react";
import { ArrowUpRight, ChevronDown, FileText } from "lucide-react";
import type { ExecutionResearchRecord } from "@/content/execution";
import type { IntelligenceLanguage } from "@/lib/intelligence-reports";
import { useReportChart } from "@/lib/use-report-chart";
import { PublicationChart, PublicationChartSkeleton } from "./publication-chart";
import styles from "./research-publications.module.css";

const dateFormat = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "long", year: "numeric", timeZone: "UTC" });
const dateLabel = (date: string) => dateFormat.format(new Date(`${date}T12:00:00Z`));
const initiallyExpandedReports = 2;
const mobileLayoutQuery = "(max-width: 639px)";
const subscribeToLayout = (onChange: () => void) => {
  const query = window.matchMedia(mobileLayoutQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};
const isMobileLayout = () => window.matchMedia(mobileLayoutQuery).matches;
const serverLayout = () => false;

const SkeletonRows = () => <div className={styles.accordionGrid} aria-hidden="true">
  {["first", "second"].map(key => <div key={key} className={styles.skeletonCard}>
    <span className={`${styles.skeletonBlock} ${styles.skeletonTitle}`} />
    <span className={`${styles.skeletonBlock} ${styles.skeletonMeta}`} />
    <PublicationChartSkeleton />
  </div>)}
</div>;

export const ResearchPublicationsSkeleton = () => <div role="status" aria-label="Loading reports" aria-busy="true"><SkeletonRows /></div>;

const ReportDetails = ({ report, language }: { report: ExecutionResearchRecord; language: IntelligenceLanguage }) => {
  const chart = useReportChart(report, language);
  return <>
    <div className={styles.accordionChart}>
      {chart.loading ? <PublicationChartSkeleton /> : chart.error ? <div className={styles.chartMessage} role="alert">Could not load this chart. <button type="button" onClick={chart.retry}>Try again</button></div> : chart.chart ? <PublicationChart chart={chart.chart} /> : <p className={styles.chartMessage}>No chart data available for this report.</p>}
    </div>
    <p className={styles.accordionBody}>{report.paragraphs.join(" ")}</p>
    {report.sourceUrl ? <a href={report.sourceUrl} target="_blank" rel="noopener noreferrer" className={styles.sourceLink}>Read full report <ArrowUpRight size={15} aria-hidden="true" /><span className="sr-only"> on EMFI Intelligence (opens in a new tab)</span></a> : null}
  </>;
};

const ReportAccordion = ({ report, language, open, onToggle }: { report: ExecutionResearchRecord; language: IntelligenceLanguage; open: boolean; onToggle: (id: string, open: boolean) => void }) => {
  const id = useId();
  return <details className={styles.accordionCard} open={open} onToggle={event => onToggle(report.id, event.currentTarget.open)}>
    <summary className={styles.accordionSummary} id={`${id}-heading`}>
      <span className={styles.accordionHeading}>
        <span className={styles.accordionMeta}>{report.country}<span aria-hidden="true">·</span>{report.reportType}</span>
        <span className={styles.accordionTitle}>{report.title}</span>
        <time dateTime={report.publishedAt}>{dateLabel(report.publishedAt)}</time>
      </span>
      <span className={styles.accordionToggle}><ChevronDown size={18} aria-hidden="true" /></span>
    </summary>
    <div className={styles.accordionContent} role="region" aria-labelledby={`${id}-heading`}>
      {open ? <ReportDetails report={report} language={language} /> : null}
    </div>
  </details>;
};

export const ResearchPublications = ({ records, language = "english", hasMore = false, loadingMore = false, loadMoreDisabled = false, onLoadMore }: {
  records: readonly ExecutionResearchRecord[];
  language?: IntelligenceLanguage;
  hasMore?: boolean;
  loadingMore?: boolean;
  loadMoreDisabled?: boolean;
  onLoadMore?: () => void;
}) => {
  const mobile = useSyncExternalStore(subscribeToLayout, isMobileLayout, serverLayout);
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => Object.fromEntries(records.slice(0, initiallyExpandedReports).map(report => [report.id, true])));
  const toggleReport = (id: string, open: boolean) => setExpanded(previous => previous[id] === open ? previous : { ...previous, [id]: open });
  const columns = mobile ? [{ id: "mobile", reports: records }] : [
    { id: "left", reports: records.filter((_, index) => index % 2 === 0) },
    { id: "right", reports: records.filter((_, index) => index % 2 !== 0) },
  ];

  return <section className={styles.accordionResults} aria-label="Research reports" aria-busy={loadingMore}>
  {records.length ? <div className={styles.accordionGrid}>
    {columns.map(column => <div key={column.id} className={styles.accordionColumn}>
      {column.reports.map(report => <ReportAccordion key={report.id} report={report} language={language} open={expanded[report.id] ?? false} onToggle={toggleReport} />)}
    </div>)}
  </div> : <div className={styles.emptyState}><FileText size={28} strokeWidth={1.5} aria-hidden="true" /><h4>No matching reports</h4><p>Try another search, date or country, or reset your filters.</p></div>}
  {hasMore && onLoadMore ? <div className={styles.loadMoreRow}><button type="button" disabled={loadingMore || loadMoreDisabled} onClick={onLoadMore}>{loadingMore ? "Loading reports…" : "Load more reports"}</button></div> : null}
</section>;
};
