"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { ExecutionResearchRecord } from "@/content/execution";
import type { IntelligenceLanguage } from "@/lib/intelligence-reports";
import { useReportChart } from "@/lib/use-report-chart";
import { PublicationChart, PublicationChartSkeleton } from "./publication-chart";
import styles from "./research-publications.module.css";
import pageStyles from "./page.module.css";

const dateFormat = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" });
const dateLabel = (date: string) => dateFormat.format(new Date(`${date}T12:00:00Z`));

function SkeletonRows({ count = 3 }: { count?: number }) {
  return <div className={styles.skeletonRows} aria-hidden="true">{Array.from({ length: count }, (_, index) => <div key={index} className={styles.skeletonCard}><span className={`${styles.skeletonBlock} ${styles.skeletonMeta}`} /><span className={`${styles.skeletonBlock} ${styles.skeletonTitle}`} /><span className={`${styles.skeletonBlock} ${styles.skeletonTag}`} /></div>)}</div>;
}

export function ResearchPublicationsSkeleton() {
  return <div className={`${pageStyles.researchLayout} ${styles.researchLayout}`} role="status" aria-label="Loading publications" aria-busy="true">
    <div className={`${pageStyles.results} ${styles.resultsPanel}`}><div className={styles.resultsHeader}><span className={`${styles.skeletonBlock} ${styles.skeletonHeading}`} /></div><div className={styles.scrollViewport}><SkeletonRows count={4} /></div></div>
    <div className={`${pageStyles.reportPreview} ${styles.previewPanel}`}><span className={`${styles.skeletonBlock} ${styles.skeletonMeta}`} /><span className={`${styles.skeletonBlock} ${styles.skeletonTitle}`} /><div className={styles.skeletonParagraph}><span className={styles.skeletonBlock} /><span className={styles.skeletonBlock} /><span className={styles.skeletonBlock} /></div><PublicationChartSkeleton /></div>
  </div>;
}

function ReportDetails({ report, language }: { report: ExecutionResearchRecord; language: IntelligenceLanguage }) {
  const chart = useReportChart(report, language);
  return <>
    <div className={styles.previewMetadata}><p className={pageStyles.previewMeta}>{report.country} · <time dateTime={report.publishedAt}>{dateLabel(report.publishedAt)}</time></p><span className={pageStyles.reportType}>{report.reportType}</span></div>
    <h3 id="publication-preview-heading" className={pageStyles.reportTitle} aria-live="polite">{report.title}</h3>
    {report.topics.some(topic => topic !== report.reportType) ? <div className={pageStyles.topicTags}>{report.topics.filter(topic => topic !== report.reportType).map(topic => <span key={topic}>{topic}</span>)}</div> : null}
    <div className={pageStyles.reportBody}>{report.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
    {report.sourceUrl ? <a href={report.sourceUrl} target="_blank" rel="noopener noreferrer" className={pageStyles.previewReadMore}>Read more <ArrowUpRight size={15} aria-hidden="true" /><span className="sr-only"> on EMFI Intelligence (opens in a new tab)</span></a> : null}
    <div className={styles.previewChart}>
      {chart.loading ? <PublicationChartSkeleton /> : chart.error ? <div className={styles.chartMessage} role="alert">Could not load this chart. <button type="button" onClick={chart.retry}>Try again</button></div> : chart.chart ? <PublicationChart chart={chart.chart} /> : <p className={styles.chartMessage}>No chart data available for this report.</p>}
    </div>
  </>;
}

export function ResearchPublications({ records, language = "english", hasMore = false, loadingMore = false, loadMoreDisabled = false, onLoadMore }: {
  records: readonly ExecutionResearchRecord[];
  language?: IntelligenceLanguage;
  hasMore?: boolean;
  loadingMore?: boolean;
  loadMoreDisabled?: boolean;
  onLoadMore?: () => void;
}) {
  const [selectedId, setSelectedId] = useState(records[0]?.id ?? "");
  const previewRef = useRef<HTMLElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const selected = records.find(record => record.id === selectedId) ?? records[0] ?? null;

  useEffect(() => {
    const sentinel = sentinelRef.current;
    const root = scrollRef.current;
    if (!sentinel || !root || !hasMore || loadingMore || loadMoreDisabled || !onLoadMore) return;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) onLoadMore(); }, { root, rootMargin: "0px 0px 160px 0px" });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, loadMoreDisabled, onLoadMore, records.length]);

  function readMore(id: string) {
    setSelectedId(id);
    requestAnimationFrame(() => {
      previewRef.current?.scrollTo({ top: 0 });
      if (window.matchMedia("(max-width: 899px)").matches) previewRef.current?.scrollIntoView({ block: "start", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    });
  }

  return <div className={`${pageStyles.researchLayout} ${styles.researchLayout}`}>
    <div className={`${pageStyles.results} ${styles.resultsPanel}`}>
      <div className={`${pageStyles.resultsTop} ${styles.resultsHeader}`}><h3 id="publications-list-heading">Reports</h3></div>
      <div ref={scrollRef} className={styles.scrollViewport} role="region" aria-labelledby="publications-list-heading" tabIndex={0} data-publications-scroll aria-busy={loadingMore}>
        {!records.length ? <p className={pageStyles.empty}>No research matches these filters. Try another title or topic, or reset your filters.</p> : <ul id="research-publication-list" className={pageStyles.resultList} aria-label="Research publications">{records.map(record => <li key={record.id} className={pageStyles.result} data-selected={record.id === selected?.id}>
          <button type="button" className={pageStyles.resultButton} onClick={() => readMore(record.id)} aria-label={`Read more: ${record.title}`} aria-current={record.id === selected?.id ? "true" : undefined} aria-controls="publication-preview">
            <span className={pageStyles.meta}><span>{record.country}</span><time dateTime={record.publishedAt}>{dateLabel(record.publishedAt)}</time></span>
            <span className={pageStyles.resultTitle}>{record.title}</span>
            <span className={styles.cardFooter}><span className={pageStyles.reportType}>{record.reportType}</span><span className={pageStyles.readMore}>Read more <ArrowRight size={14} aria-hidden="true" /></span></span>
          </button>
        </li>)}</ul>}
        {loadingMore ? <div className={styles.appendSkeleton} role="status" aria-label="Loading more publications"><SkeletonRows count={2} /></div> : null}
        <div ref={sentinelRef} className={styles.scrollSentinel} aria-hidden="true" />
      </div>
    </div>
    <section ref={previewRef} id="publication-preview" aria-labelledby="publication-preview-heading" className={`${pageStyles.reportPreview} ${styles.previewPanel}`} tabIndex={0}>
      {selected ? <ReportDetails key={`${language}/${selected.chartSource ?? "auto"}/${selected.id}`} report={selected} language={language} /> : <><h3 id="publication-preview-heading" className={pageStyles.reportTitle}>No publication selected</h3><p className={pageStyles.empty}>Adjust the filters to find a publication to preview.</p></>}
    </section>
  </div>;
}
