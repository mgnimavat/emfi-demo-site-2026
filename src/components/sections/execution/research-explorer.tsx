"use client";

import { useId, useMemo, useState } from "react";
import { CalendarDays, ChevronDown, FileSearch, FileText, Globe2, RotateCcw, Search, SlidersHorizontal, X } from "lucide-react";
import { execution } from "@/content/execution";
import { emptyExecutionFilters, filterExecutionResearch, invalidResearchDateRange, type ExecutionResearchFilters } from "@/lib/execution-research";

const fieldClass = "mt-2 block min-h-12 w-full min-w-0 max-w-full rounded-md border border-line-strong bg-page px-3 py-3 text-base font-normal text-ink outline-none transition-[border-color,box-shadow] hover:border-brand-focus/40 focus:border-brand-focus focus:ring-2 focus:ring-brand-focus/20";
const dateFormat = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" });
const countries = [...new Set(execution.research.records.map((record) => record.country))].sort();
const reportTypes = [...new Set(execution.research.records.map((record) => record.reportType))].sort();
const filterLabels: Record<keyof ExecutionResearchFilters, string> = {
  keyword: "Keyword", country: "Country", reportType: "Report type", from: "From", to: "To",
};

export function ExecutionResearchExplorer() {
  const [filters, setFilters] = useState<ExecutionResearchFilters>(emptyExecutionFilters);
  const id = useId();
  const invalidDates = invalidResearchDateRange(filters);
  const records = useMemo(() => filterExecutionResearch(execution.research.records, filters), [filters]);
  const updateFilter = (key: keyof ExecutionResearchFilters, value: string) => setFilters((previous) => ({ ...previous, [key]: value }));
  const activeFilters = (Object.entries(filters) as [keyof ExecutionResearchFilters, string][]).filter(([, value]) => value.trim());

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-subtle">
      <div className="grid items-start gap-6 p-4 sm:p-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-7 lg:p-7 xl:grid-cols-[300px_minmax(0,1fr)]">
        <aside aria-label="Research filters" className="rounded-lg border border-line bg-page p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between border-b border-line pb-4 text-brand">
            <span className="inline-flex items-center gap-2.5 text-sm font-semibold"><SlidersHorizontal size={18} strokeWidth={1.5} aria-hidden />Filters</span>
            <span aria-hidden className="h-1 w-8 rounded-full bg-soft" />
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
            <div className="min-w-0 sm:col-span-2 lg:col-span-1">
              <label htmlFor={`${id}-query`} className="block text-sm font-semibold leading-6 text-ink">Search by keyword, country or topic</label>
              <div className="relative">
                <Search size={18} aria-hidden className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" />
                <input id={`${id}-query`} type="search" value={filters.keyword} onChange={(event) => updateFilter("keyword", event.target.value)} placeholder="Try Venezuela, IMF or Fixed Income" className={`${fieldClass} pl-10`} />
              </div>
            </div>
            <label className="min-w-0 text-sm font-semibold text-ink">Country
              <select aria-label="Country" value={filters.country} onChange={(event) => updateFilter("country", event.target.value)} className={fieldClass}>
                <option value="">All countries</option>
                {countries.map((country) => <option key={country}>{country}</option>)}
              </select>
            </label>
            <label className="min-w-0 text-sm font-semibold text-ink">Report type
              <select aria-label="Report type" value={filters.reportType} onChange={(event) => updateFilter("reportType", event.target.value)} className={fieldClass}>
                <option value="">All report types</option>
                {reportTypes.map((type) => <option key={type}>{type}</option>)}
              </select>
            </label>
            <label className="min-w-0 text-sm font-semibold text-ink">Publication date from
              <input type="date" aria-label="Publication date from" value={filters.from} onChange={(event) => updateFilter("from", event.target.value)} aria-invalid={invalidDates} aria-describedby={invalidDates ? `${id}-date-error` : undefined} className={fieldClass} />
            </label>
            <label className="min-w-0 text-sm font-semibold text-ink">Publication date to
              <input type="date" aria-label="Publication date to" value={filters.to} onChange={(event) => updateFilter("to", event.target.value)} aria-invalid={invalidDates} aria-describedby={invalidDates ? `${id}-date-error` : undefined} className={fieldClass} />
            </label>
          </div>
          {invalidDates ? <p id={`${id}-date-error`} role="alert" className="mt-4 text-sm font-medium leading-6 text-red-700">Choose an end date on or after the start date.</p> : null}
        </aside>

        <section aria-label="Research results" className="min-w-0">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 px-1">
            <p role="status" aria-live="polite" className="flex items-center gap-2.5 text-sm font-medium text-ink-secondary"><span className="flex size-9 items-center justify-center rounded-md border border-line bg-page text-base font-semibold tabular-nums text-ink">{records.length}</span>{" "}{records.length === 1 ? "record" : "records"} found</p>
            <button type="button" onClick={() => setFilters(emptyExecutionFilters)} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line-strong bg-page px-4 py-2 text-sm font-semibold text-brand transition-colors hover:border-brand-focus/30 hover:bg-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-focus"><RotateCcw size={14} aria-hidden />Reset filters</button>
          </div>
          {activeFilters.length ? (
            <div aria-label="Active filters" className="mb-5 flex flex-wrap gap-2">
              {activeFilters.map(([key, value]) => (
                <button key={key} type="button" aria-label={`Remove ${filterLabels[key].toLowerCase()} filter`} onClick={() => updateFilter(key, "")} className="inline-flex min-h-9 max-w-full items-center gap-2 rounded-full border border-brand-focus/15 bg-soft px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:border-brand-focus/40 focus-visible:outline-2 focus-visible:outline-brand-focus">
                  <span className="min-w-0 break-words">{filterLabels[key]}: {value}</span><X size={12} className="shrink-0" aria-hidden />
                </button>
              ))}
            </div>
          ) : null}
          {!records.length ? (
            <div className="rounded-lg border border-dashed border-line-strong bg-page px-5 py-14 text-center">
              <span className="mx-auto mb-5 flex size-16 items-center justify-center rounded-lg bg-soft text-brand"><FileSearch size={30} strokeWidth={1.5} aria-hidden /></span>
              <p className="text-lg font-semibold text-ink">{invalidDates ? "Check the publication date range." : "No research matches these filters."}</p>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-ink-secondary">This preview contains four screenshot-sourced records. Reset the filters to see them all.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {records.map((record) => (
                <details key={record.id} className="group overflow-hidden rounded-lg border border-line bg-page transition-[border-color,box-shadow] duration-200 hover:border-brand-focus/30 hover:shadow-[var(--elevation-card-hover)] open:border-brand-focus/30 open:shadow-[var(--elevation-card-hover)] motion-reduce:transition-none">
                  <summary className="relative flex min-h-36 cursor-pointer list-none items-start gap-4 p-5 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-focus sm:gap-5 sm:p-6 [&::-webkit-details-marker]:hidden">
                    <span aria-hidden className={`absolute inset-y-5 left-0 w-[3px] rounded-r-full transition-colors group-open:bg-brand-focus ${record.paragraphs.length ? "bg-brand-focus/60" : "bg-line-strong"}`} />
                    <span className={`mt-1 hidden size-13 shrink-0 items-center justify-center rounded-md border shadow-sm sm:flex ${record.paragraphs.length ? "border-brand bg-brand text-ink-inverse" : "border-line bg-soft text-brand"}`}><FileText size={24} strokeWidth={1.4} aria-hidden /></span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs leading-6 text-ink-secondary">
                        <span className="inline-flex items-center gap-1.5 font-medium text-ink"><Globe2 size={13} aria-hidden />{record.country}</span>
                        <span className="rounded-full bg-subtle px-2.5 py-0.5">{record.reportType}</span>
                        <span className="inline-flex items-center gap-1.5"><CalendarDays size={13} aria-hidden /><time dateTime={record.publishedAt}>{dateFormat.format(new Date(`${record.publishedAt}T12:00:00Z`))}</time></span>
                      </span>
                      <span className="mt-3 block text-xl font-semibold leading-7 tracking-[-0.025em] text-ink sm:text-2xl sm:leading-8">{record.title}</span>
                      <span className={`mt-2 block text-sm leading-6 ${record.paragraphs.length ? "font-medium text-brand" : "text-ink-secondary"}`}>{record.paragraphs.length ? "Read supplied excerpt" : "View supplied record · full report pending"}</span>
                    </span>
                    <span className="mt-1 flex size-10 shrink-0 items-center justify-center rounded-full border border-line bg-page text-brand transition-colors group-hover:bg-soft group-open:border-brand group-open:bg-brand group-open:text-ink-inverse"><ChevronDown size={18} aria-hidden className="transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none" /></span>
                  </summary>
                  <div className="border-t border-line bg-linear-to-br from-soft/40 to-page p-5 sm:p-6">
                    {record.topics.length ? <div className="mb-5 flex flex-wrap gap-2">{record.topics.map((topic) => <span key={topic} className="rounded-full border border-brand-focus/10 bg-page px-3 py-1.5 text-xs font-medium text-ink">{topic}</span>)}</div> : null}
                    <div className="max-w-4xl space-y-4 text-base leading-8 text-ink-secondary">
                      {record.paragraphs.length ? record.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>) : <p>Report body not supplied. Only the publication metadata is available in this preview.</p>}
                    </div>
                    <p className="mt-6 max-w-4xl rounded-md border border-line bg-page px-4 py-3 text-sm leading-7 text-ink-secondary"><strong className="font-semibold text-ink">Source context:</strong> {record.source}</p>
                  </div>
                </details>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
