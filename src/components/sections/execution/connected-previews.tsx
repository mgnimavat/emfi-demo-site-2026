"use client";

import { CurvedBand } from "@/components/layout/curved-band";
import { useMemo, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { execution } from "@/content/execution";
import { demoExecutionSecurities, type ExecutionSymbol } from "@/content/execution-securities";
import { emptyExecutionFilters, filterExecutionResearch, invalidResearchDateRange } from "@/lib/execution-research";
import { InteractiveExecutionTicket } from "./interactive-execution-ticket";
import { ExecutionChart } from "./execution-chart";
import { ExecutionWatchlists } from "./execution-watchlists";
import { ExecutionTransactions } from "./execution-transactions";
import { ExecutionReveal } from "./reveal";
import styles from "./page.module.css";

const dateFormat = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" });
const dateLabel = (value: string) => dateFormat.format(new Date(`${value}T12:00:00Z`));
const markets = [...new Set(execution.research.records.map((record) => record.country))].sort();

export function ConnectedExecutionPreviews() {
  const [securitySymbol, setSecuritySymbol] = useState<ExecutionSymbol>("XXXX-01");
  const chartSecurity = demoExecutionSecurities.find((security) => security.symbol === securitySymbol) ?? demoExecutionSecurities[0];
  const [filters, setFilters] = useState(emptyExecutionFilters);
  const records = useMemo(() => filterExecutionResearch(execution.research.records, filters), [filters]);
  const invalidDates = invalidResearchDateRange(filters);
  const [selectedId, setSelectedId] = useState(execution.research.records[0].id);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const previewRef = useRef<HTMLElement>(null);
  const selected = records.find((record) => record.id === selectedId) ?? records[0] ?? null;
  const expanded = selected?.id === expandedId;

  function readMore(id: string) {
    setSelectedId(id);
    setExpandedId(id);
    if (window.matchMedia("(max-width: 899px)").matches) {
      requestAnimationFrame(() => previewRef.current?.scrollIntoView({ block: "start", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" }));
    }
  }

  function resetFilters() {
    setFilters(emptyExecutionFilters);
    setSelectedId(execution.research.records[0].id);
    setExpandedId(null);
  }

  return <>
    <CurvedBand nextBackground="#dce8f8"><section id="research" aria-labelledby="research-heading" className={`${styles.section} ${styles.soft} ${styles.researchSection} scroll-mt-24`}>
      <div className={styles.container}>
        <ExecutionReveal className={styles.researchIntro}><h2 id="research-heading" className={styles.title}>{execution.research.title}</h2><p className={styles.body}>{execution.research.body}</p></ExecutionReveal>
        <div className={styles.preview}>
          <aside className={styles.filters} aria-label="Research filters">
            <div className={styles.filterFields}>
              <label className={styles.field}>Search<input type="search" aria-label="Search by keyword, issuer or market" placeholder="Keyword, issuer or market" value={filters.keyword} onChange={(event) => setFilters({ ...filters, keyword: event.target.value })} /></label>
              <label className={styles.field}>Market<select aria-label="Market" value={filters.country} onChange={(event) => setFilters({ ...filters, country: event.target.value })}><option value="">All markets</option>{markets.map((market) => <option key={market}>{market}</option>)}</select></label>
              <label className={styles.field}>From date<input type="date" aria-label="Publication date from" value={filters.from} aria-invalid={invalidDates} aria-describedby={invalidDates ? "research-date-error" : undefined} onChange={(event) => setFilters({ ...filters, from: event.target.value })} /></label>
              <label className={styles.field}>To date<input type="date" aria-label="Publication date to" value={filters.to} aria-invalid={invalidDates} aria-describedby={invalidDates ? "research-date-error" : undefined} onChange={(event) => setFilters({ ...filters, to: event.target.value })} /></label>
              <button type="button" className={styles.reset} aria-label="Reset filters" onClick={resetFilters}>Reset</button>
            </div>
            {invalidDates ? <p id="research-date-error" role="alert">Choose an end date on or after the start date.</p> : null}
          </aside>
          <div className={styles.researchLayout}>
            <div className={styles.results}>
              <div className={styles.resultsTop}><h3>Publications</h3><p role="status" aria-live="polite">{records.length} {records.length === 1 ? "result" : "results"}</p></div>
              {!records.length ? <p className={styles.empty}>No research matches these filters. Try another keyword or reset your filters.</p> : <ul className={styles.resultList} aria-label="Research publications">{records.map((record) => <li key={record.id} className={styles.result} data-selected={record.id === selected?.id}>
                <button type="button" className={styles.resultButton} onClick={() => readMore(record.id)} aria-label={`Read more: ${record.title}`} aria-current={record.id === selected?.id ? "true" : undefined} aria-controls="publication-preview">
                  <span className={styles.meta}><span className={styles.reportType}>{record.reportType}</span><span>{record.country}</span><span className={styles.metaDot} aria-hidden="true" /><time dateTime={record.publishedAt}>{dateLabel(record.publishedAt)}</time></span>
                  <span className={styles.resultTitle}>{record.title}</span>
                  <span className={styles.readMore}>Read more <ArrowRight size={14} aria-hidden="true" /></span>
                </button>
              </li>)}</ul>}
            </div>
            <section ref={previewRef} id="publication-preview" aria-labelledby="publication-preview-heading" className={styles.reportPreview}>
              <div className={styles.previewTop}><span>Publication preview</span>{selected ? <span className={styles.reportType}>{selected.reportType}</span> : null}</div>
              {selected ? <>
                <p className={styles.previewMeta}>{selected.country} · <time dateTime={selected.publishedAt}>{dateLabel(selected.publishedAt)}</time></p>
                <h3 id="publication-preview-heading" className={styles.reportTitle} aria-live="polite">{selected.title}</h3>
                {selected.topics.length ? <div className={styles.topicTags}>{selected.topics.map((topic) => <span key={topic}>{topic}</span>)}</div> : null}
                <div className={styles.reportBody}>
                  {selected.paragraphs.length ? (expanded ? selected.paragraphs : selected.paragraphs.slice(0, 1)).map((paragraph) => <p key={paragraph}>{paragraph}</p>) : <p>Full report content is not available for this publication in the preview.</p>}
                </div>
                {selected.paragraphs.length > 1 ? <button type="button" className={styles.previewReadMore} aria-expanded={expanded} onClick={() => setExpandedId(expanded ? null : selected.id)}>{expanded ? "Show less" : "Read more"}<ArrowRight size={15} aria-hidden="true" /></button> : null}
                <p className={styles.excerptNote}>{selected.paragraphs.length ? "Report excerpt from supplied publication records." : "Publication title, market, report type and date are shown above."}</p>
              </> : <><h3 id="publication-preview-heading" className={styles.reportTitle}>No publication selected</h3><p className={styles.empty}>Adjust the filters to find a publication to preview.</p></>}
            </section>
          </div>
          <p className={styles.previewNote}>Supplied publication records. This library is not connected to a live research feed.</p>
        </div>
      </div>
    </section></CurvedBand>
    <CurvedBand nextBackground="#071932"><section id="execution-preview" aria-label="Execution window" className={`${styles.section} ${styles.executionStage} scroll-mt-24`}>
      <div className={styles.container}>
        <ExecutionReveal className={styles.executionCaption}><h2>Put Insight Into Action,</h2><p>across relevant markets and securities.</p></ExecutionReveal>
        <ExecutionReveal className={styles.executionLayout}>
          <ExecutionChart security={chartSecurity} />
          <div className={styles.executionWindow}><InteractiveExecutionTicket fillHeight onSecurityChange={setSecuritySymbol} /></div>
        </ExecutionReveal>
        <ExecutionReveal className={styles.executionSecondaryLayout}><ExecutionWatchlists /><ExecutionTransactions /></ExecutionReveal>
      </div>
    </section></CurvedBand>
  </>;
}
