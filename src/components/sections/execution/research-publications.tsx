"use client";

import Image from "next/image";
import { useId, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { execution, type ExecutionResearchRecord } from "@/content/execution";
import styles from "./research-publications.module.css";
import pageStyles from "./page.module.css";

const dateFormat = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" });
const dateLabel = (date: string) => dateFormat.format(new Date(`${date}T12:00:00Z`));
const chartDate = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", timeZone: "UTC" });

function PublicationChart({ chart }: { chart: NonNullable<ExecutionResearchRecord["chart"]> }) {
  const id = useId();
  if (chart.kind === "world") return <figure className={styles.chart}>
    <figcaption>{chart.title}</figcaption>
    <Image src="/research/intelligence-global-snapshot.svg" alt="Global country daily change map from EMFI Intelligence" width={600} height={290} className={styles.worldMap} />
    <p className={styles.chartNote}>Country daily change · EMFI source snapshot</p>
  </figure>;
  const points = chart.points ?? [];
  if (points.length < 2) return null;
  const left = 58, right = 580, top = 18, bottom = 300;
  const values = points.map(point => point.value);
  const min = Math.min(...values), max = Math.max(...values);
  const roughStep = (max - min || 1) / 4;
  const magnitude = 10 ** Math.floor(Math.log10(roughStep));
  const step = [1, 2, 2.5, 5, 10].map(value => value * magnitude).find(value => value >= roughStep) ?? roughStep;
  const low = Math.floor(min / step) * step, high = Math.ceil(max / step) * step;
  const start = Date.parse(points[0].date), end = Date.parse(points[points.length - 1].date);
  const x = (point: typeof points[number]) => left + (Date.parse(point.date) - start) / (end - start || 1) * (right - left);
  const y = (value: number) => bottom - (value - low) / (high - low || 1) * (bottom - top);
  const line = points.map((point, index) => `${index ? "L" : "M"}${x(point).toFixed(2)},${y(point.value).toFixed(2)}`).join(" ");
  const ticks = Array.from({ length: Math.round((high - low) / step) + 1 }, (_, index) => low + index * step);
  return <figure className={styles.chart}>
    <figcaption>{chart.title}</figcaption>
    <svg viewBox="0 0 600 344" role="img" aria-labelledby={`${id}-title ${id}-desc`} className={styles.priceChart}>
      <title id={`${id}-title`}>{chart.title}</title>
      <desc id={`${id}-desc`}>EMFI published price observations from {dateLabel(points[0].date)} to {dateLabel(points[points.length - 1].date)}. First price {points[0].value}; last price {points[points.length - 1].value}.</desc>
      <defs><linearGradient id={`${id}-fill`} x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#8098cc" stopOpacity=".3" /><stop offset="100%" stopColor="#dce8f8" stopOpacity=".08" /></linearGradient></defs>
      {ticks.map(tick => <g key={tick}><line x1={left} x2={right} y1={y(tick)} y2={y(tick)} stroke="#e4eaf2" /><text x={left - 14} y={y(tick)} textAnchor="end" dominantBaseline="middle">{Number(tick.toFixed(2))}</text></g>)}
      <path d={`${line} L${right},${bottom} L${left},${bottom} Z`} fill={`url(#${id}-fill)`} />
      <path d={line} fill="none" stroke="#31558a" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round" data-publication-price-line />
      {Array.from({ length: 5 }, (_, index) => points[Math.round(index / 4 * (points.length - 1))]).map((point, index) => <text key={point.date} x={x(point)} y={328} textAnchor={index === 0 ? "start" : index === 4 ? "end" : "middle"}>{chartDate.format(new Date(`${point.date}T12:00:00Z`))}</text>)}
    </svg>
  </figure>;
}

export function ResearchPublications({ records }: { records: readonly ExecutionResearchRecord[] }) {
  const [selectedId, setSelectedId] = useState(execution.research.records[0].id);
  const [page, setPage] = useState(1);
  const pageSize = 4;
  const pageCount = Math.ceil(records.length / pageSize);
  const pageRecords = records.slice((page - 1) * pageSize, page * pageSize);
  const previewRef = useRef<HTMLElement>(null);
  const selected = pageRecords.find(record => record.id === selectedId) ?? pageRecords[0] ?? null;

  function changePage(nextPage: number) {
    setPage(nextPage);
    setSelectedId(records[(nextPage - 1) * pageSize].id);
  }

  function readMore(id: string) {
    setSelectedId(id);
    if (window.matchMedia("(max-width: 899px)").matches) {
      requestAnimationFrame(() => previewRef.current?.scrollIntoView({ block: "start", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" }));
    }
  }

  return <>
    <div className={pageStyles.researchLayout}>
      <div className={pageStyles.results}>
        <div className={pageStyles.resultsTop}><h3>Publications</h3><p role="status" aria-live="polite">{records.length} {records.length === 1 ? "result" : "results"}</p></div>
        {!records.length ? <p className={pageStyles.empty}>No research matches these filters. Try another title or topic, or reset your filters.</p> : <ul id="research-publication-list" className={pageStyles.resultList} aria-label="Research publications">{pageRecords.map(record => <li key={record.id} className={pageStyles.result} data-selected={record.id === selected?.id}>
          <button type="button" className={pageStyles.resultButton} onClick={() => readMore(record.id)} aria-label={`Read more: ${record.title}`} aria-current={record.id === selected?.id ? "true" : undefined} aria-controls="publication-preview">
            <span className={pageStyles.meta}><span>{record.country}</span><time dateTime={record.publishedAt}>{dateLabel(record.publishedAt)}</time></span>
            <span className={pageStyles.resultTitle}>{record.title}</span>
            <span className={styles.cardFooter}><span className={pageStyles.reportType}>{record.reportType}</span><span className={pageStyles.readMore}>Read more <ArrowRight size={14} aria-hidden="true" /></span></span>
          </button>
        </li>)}</ul>}
        {pageCount > 1 ? <div className={styles.pagination}>
          <p role="status" aria-live="polite">{(page - 1) * pageSize + 1}–{Math.min(page * pageSize, records.length)} of {records.length}</p>
          <nav aria-label="Publication pages">
            <button type="button" aria-label="Previous publication page" aria-controls="research-publication-list" disabled={page === 1} onClick={() => changePage(page - 1)}><ChevronLeft size={16} aria-hidden="true" /></button>
            {Array.from({ length: pageCount }, (_, index) => index + 1).map(number => <button key={number} type="button" aria-label={`Publication page ${number}`} aria-current={page === number ? "page" : undefined} aria-controls="research-publication-list" onClick={() => changePage(number)}>{number}</button>)}
            <button type="button" aria-label="Next publication page" aria-controls="research-publication-list" disabled={page === pageCount} onClick={() => changePage(page + 1)}><ChevronRight size={16} aria-hidden="true" /></button>
          </nav>
        </div> : null}
      </div>
      <section ref={previewRef} id="publication-preview" aria-labelledby="publication-preview-heading" className={pageStyles.reportPreview}>
        <div className={pageStyles.previewTop}><span>Publication preview</span>{selected ? <span className={pageStyles.reportType}>{selected.reportType}</span> : null}</div>
        {selected ? <>
          <p className={pageStyles.previewMeta}>{selected.country} · <time dateTime={selected.publishedAt}>{dateLabel(selected.publishedAt)}</time></p>
          <h3 id="publication-preview-heading" className={pageStyles.reportTitle} aria-live="polite">{selected.title}</h3>
          {selected.topics.some(topic => topic !== selected.reportType) ? <div className={pageStyles.topicTags}>{selected.topics.filter(topic => topic !== selected.reportType).map(topic => <span key={topic}>{topic}</span>)}</div> : null}
          <div className={pageStyles.reportBody}>{selected.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>
          {selected.chart ? <div className={styles.previewChart}><PublicationChart chart={selected.chart} /></div> : null}
          {selected.sourceUrl ? <a href={selected.sourceUrl} target="_blank" rel="noopener noreferrer" className={pageStyles.previewReadMore}>Read more <ArrowUpRight size={15} aria-hidden="true" /><span className="sr-only"> on EMFI Intelligence (opens in a new tab)</span></a> : null}
        </> : <><h3 id="publication-preview-heading" className={pageStyles.reportTitle}>No publication selected</h3><p className={pageStyles.empty}>Adjust the filters to find a publication to preview.</p></>}
      </section>
    </div>
  </>;
}
