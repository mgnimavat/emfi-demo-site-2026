"use client";

import { useId, useState, useSyncExternalStore } from "react";
import { useServiceLocale } from "@/ui/hooks/useServiceLocale";
import { ArrowDown, ArrowUpRight, ChevronDown, FileText } from "lucide-react";
import cueStyles from "@/components/emfi-sections/sections.module.css";
import type { ExecutionResearchRecord } from "@/content/execution";
import type { IntelligenceLanguage } from "@/lib/intelligence-reports";
import { useReportChart } from "@/lib/use-report-chart";
import { PublicationChart, PublicationChartSkeleton } from "./publication-chart";
import styles from "./research-publications.module.css";

const dateLabel = (date: string, locale: string) => new Intl.DateTimeFormat(locale, { day: "2-digit", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T12:00:00Z`));
const reportsPerColumn = 7;
const reportsPerPage = reportsPerColumn * 2;
const mobileLayoutQuery = "(max-width: 639px)";
const subscribeToLayout = (onChange: () => void) => {
  const query = window.matchMedia(mobileLayoutQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};
const isMobileLayout = () => window.matchMedia(mobileLayoutQuery).matches;
const serverLayout = () => false;
const skeletonReports = Array.from({ length: reportsPerColumn }, (_, index) => `report-placeholder-${index + 1}`);

const SkeletonRows = ({ singleColumn = false }: { singleColumn?: boolean }) => <div className={styles.accordionGrid} aria-hidden="true">
  {(singleColumn ? ["single"] : ["left", "right"]).map(column => <div key={column} className={styles.accordionColumn}>
    {skeletonReports.map(key => <div key={key} className={styles.skeletonCard}>
      <span className={`${styles.skeletonBlock} ${styles.skeletonMeta}`} />
      <span className={`${styles.skeletonBlock} ${styles.skeletonTitle}`} />
      <span className={`${styles.skeletonBlock} ${styles.skeletonMeta}`} />
    </div>)}
  </div>)}
</div>;

export const ResearchPublicationsSkeleton = ({ singleColumn = false }: { singleColumn?: boolean }) => {
  const { t } = useServiceLocale();
  return <div role="status" aria-label={t("Loading reports")} aria-busy="true"><SkeletonRows singleColumn={singleColumn} /></div>;
};

const ReportDetails = ({ report, language }: { report: ExecutionResearchRecord; language: IntelligenceLanguage }) => {
  const { t } = useServiceLocale();
  const chart = useReportChart(report, language);
  return <>
    <div className={styles.accordionChart}>
      {chart.loading ? <PublicationChartSkeleton /> : chart.error ? <div className={styles.chartMessage} role="alert">{t("Could not load this chart.")} <button type="button" onClick={chart.retry}>{t("Try again")}</button></div> : chart.chart ? <PublicationChart chart={chart.chart} /> : <p className={styles.chartMessage}>{t("No chart data available for this report.")}</p>}
    </div>
    <p className={styles.accordionBody}>{report.paragraphs.join(" ")}</p>
    {report.sourceUrl ? <a href={report.sourceUrl} target="_blank" rel="noopener noreferrer" className={styles.sourceLink}>{t("Read full report")} <ArrowUpRight size={15} aria-hidden="true" /><span className="sr-only">  {t("on EMFI Intelligence (opens in a new tab)")}</span></a> : null}
  </>;
};

const ReportAccordion = ({ report, language, open, onToggle }: { report: ExecutionResearchRecord; language: IntelligenceLanguage; open: boolean; onToggle: (id: string, open: boolean) => void }) => {
  const { locale, t } = useServiceLocale();
  const id = useId();
  return <details className={styles.accordionCard} open={open} onToggle={event => onToggle(report.id, event.currentTarget.open)}>
    <summary className={styles.accordionSummary} id={`${id}-heading`}>
      <span className={styles.accordionHeading}>
        <span className={styles.accordionMeta}>{report.country}<span aria-hidden="true">·</span>{t(report.reportType)}</span>
        <span className={styles.accordionTitle}>{report.title}</span>
        <time dateTime={report.publishedAt}>{dateLabel(report.publishedAt, locale)}</time>
      </span>
      <span className={styles.accordionToggle}><ChevronDown size={18} aria-hidden="true" /></span>
    </summary>
    <div className={styles.accordionContent} role="region" aria-labelledby={`${id}-heading`}>
      {open ? <ReportDetails report={report} language={language} /> : null}
    </div>
  </details>;
};

export const ResearchPublications = ({ records, language = "english", hasMore = false, loadingMore = false, loadMoreDisabled = false, singleColumn = false, onLoadMore }: {
  records: readonly ExecutionResearchRecord[];
  language?: IntelligenceLanguage;
  hasMore?: boolean;
  loadingMore?: boolean;
  loadMoreDisabled?: boolean;
  singleColumn?: boolean;
  onLoadMore?: () => void;
}) => {
  const { t } = useServiceLocale();
  const mobile = useSyncExternalStore(subscribeToLayout, isMobileLayout, serverLayout);
  const pageSize = singleColumn ? reportsPerColumn : reportsPerPage;
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const visibleRecords = records.slice(0, visibleCount);
  const hasLocalMore = records.length > visibleCount;
  const canLoadMore = hasLocalMore || Boolean(hasMore && onLoadMore);
  const showMore = () => {
    if (!hasLocalMore) onLoadMore?.();
    setVisibleCount((count) => Math.min(count, records.length) + pageSize);
  };
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const toggleReport = (id: string, open: boolean) => setExpanded(previous => previous[id] === open ? previous : { ...previous, [id]: open });
  const columns = mobile || singleColumn ? [{ id: "single", reports: visibleRecords }] : [
    { id: "left", reports: visibleRecords.filter((_, index) => index % 2 === 0) },
    { id: "right", reports: visibleRecords.filter((_, index) => index % 2 !== 0) },
  ];

  return <section className={styles.accordionResults} aria-label={t("Research reports")} aria-busy={loadingMore}>
  {records.length ? <div className={styles.accordionGrid}>
    {columns.map(column => <div key={column.id} className={styles.accordionColumn}>
      {column.reports.map(report => <ReportAccordion key={report.id} report={report} language={language} open={expanded[report.id] ?? false} onToggle={toggleReport} />)}
    </div>)}
  </div> : <div className={styles.emptyState}><FileText size={28} strokeWidth={1.5} aria-hidden="true" /><h4>{t("No matching reports")}</h4><p>{t("Try another search, date or country, or reset your filters.")}</p></div>}
  <span className="sr-only" role="status" aria-live="polite">{visibleRecords.length}  {t("reports shown")}</span>
  {canLoadMore ? <div className={styles.loadMoreRow}>
    <button className={cueStyles.heroCue} type="button" disabled={loadingMore || (!hasLocalMore && loadMoreDisabled)} onClick={showMore}>{loadingMore ? t("Loading reports…") : t("Load more reports")}<ArrowDown size={16} strokeWidth={1.75} aria-hidden="true" /></button>
  </div> : null}
</section>;
};
