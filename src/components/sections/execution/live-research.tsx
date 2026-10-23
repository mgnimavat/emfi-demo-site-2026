"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { emptyExecutionFilters, filterExecutionResearch, invalidResearchDateRange, type ExecutionResearchFilters } from "@/lib/execution-research";
import { intelligenceReportFeeds, intelligenceReportLabels, mergeIntelligenceReports, type IntelligenceLanguage } from "@/lib/intelligence-reports";
import { useIntelligenceReports } from "@/lib/use-intelligence-reports";
import { useIntelligenceSearch } from "@/lib/use-intelligence-search";
import { useIntelligenceReportTypes } from "@/lib/use-intelligence-report-types";
import { trailingResearchRange } from "@/lib/research-date-range";
import { ResearchDateRange } from "./research-date-range";
import { useIntelligenceCountries } from "@/lib/use-intelligence-countries";
import { ResearchFilterSelect } from "./research-filter-select";
import { ResearchPublications, ResearchPublicationsSkeleton } from "./research-publications";
import styles from "./page.module.css";

const defaultFilters = () => ({ ...emptyExecutionFilters, reportType: "Special Reports", ...trailingResearchRange(12) });
const reportTypes = Object.values(intelligenceReportLabels);

export function LiveResearch() {
  const [language, setLanguage] = useState<IntelligenceLanguage>("english");
  const [filters, setFilters] = useState(defaultFilters);
  return <LiveResearchFeed key={language} language={language} onLanguageChange={setLanguage} filters={filters} setFilters={setFilters} />;
}

function LiveResearchFeed({ language, onLanguageChange, filters, setFilters }: { language: IntelligenceLanguage; onLanguageChange: (language: IntelligenceLanguage) => void; filters: ExecutionResearchFilters; setFilters: (filters: ExecutionResearchFilters) => void }) {
  const { feeds, loading, loadMore } = useIntelligenceReports(language, filters.from, filters.to, !filters.keyword.trim());
  const countryList = useIntelligenceCountries();
  const reportCatalogue = useIntelligenceReportTypes();
  const search = useIntelligenceSearch(language, filters.keyword);
  const selectedFeeds = intelligenceReportFeeds.filter(feed => !filters.reportType || intelligenceReportLabels[feed] === filters.reportType);
  const allRecords = useMemo(() => mergeIntelligenceReports(...intelligenceReportFeeds.map(feed => feeds[feed].records)), [feeds]);
  const sourceRecords = search.active ? search.records : allRecords;
  const typedRecords = useMemo(() => sourceRecords.map(record => {
    const derivedType = search.active ? undefined : reportCatalogue.types[record.id];
    return derivedType ? { ...record, topics: [...new Set([...record.topics, derivedType])] } : record;
  }), [sourceRecords, reportCatalogue.types, search.active]);
  const derivedTypes = useMemo(() => [...new Set(Object.values(reportCatalogue.types))].filter(type => {
    const special = ["Special Report", "EMFI Monthly Review"].includes(type);
    return !filters.reportType || (filters.reportType === "Special Reports" ? special : !special);
  }).sort(), [reportCatalogue.types, filters.reportType]);
  const records = useMemo(() => search.active ? search.records : filterExecutionResearch(typedRecords, filters), [search.active, search.records, typedRecords, filters]);
  const invalidDates = invalidResearchDateRange(filters);
  const failedFeeds = selectedFeeds.filter(feed => feeds[feed].error);
  const hasMore = search.active ? search.next !== null : selectedFeeds.some(feed => feeds[feed].next !== null);
  const pending = search.active ? search.loading : loading;
  const error = search.active ? search.error : failedFeeds.length > 0;
  const initialLoading = (pending && !sourceRecords.length) || (Boolean(filters.derivedType) && reportCatalogue.loading);

  function updateSearch(keyword: string) {
    setFilters(keyword.trim() ? { ...emptyExecutionFilters, keyword } : defaultFilters());
  }

  function updateFilter(patch: Partial<ExecutionResearchFilters>) {
    // Search and feed filters use separate API contracts. Switching controls
    // exits search rather than applying stale filters to its returned rows.
    setFilters({ ...(search.active ? defaultFilters() : filters), ...patch, keyword: "" });
  }

  return <div className={styles.preview}>
    <aside className={styles.filters} aria-label="Research filters">
      <div className={styles.filterFields}>
        <label className={styles.field}>Search reports<span className={styles.searchField}><Search size={16} aria-hidden="true" /><input type="search" aria-label="Search reports" placeholder="Search reports or countries" value={filters.keyword} onChange={event => updateSearch(event.target.value)} /></span></label>
        <ResearchFilterSelect className={styles.field} label="Country" allLabel="All countries" options={countryList.countries} value={filters.country} onChange={country => updateFilter({ country })} />
        <ResearchFilterSelect className={styles.field} label="Report Type" options={reportTypes} value={filters.reportType} onChange={reportType => updateFilter({ reportType, derivedType: "" })} />
        <ResearchFilterSelect className={styles.field} label="Derived Type" allLabel="All derived types" options={derivedTypes} value={filters.derivedType} onChange={derivedType => updateFilter({ derivedType, ...(search.active && derivedType ? { reportType: ["Special Report", "EMFI Monthly Review"].includes(derivedType) ? "Special Reports" : "Other Reports" } : {}) })} />
        <ResearchFilterSelect className={styles.field} label="Language" options={["English", "Español"]} value={language === "english" ? "English" : "Español"} onChange={value => onLanguageChange(value === "English" ? "english" : "espanol")} />
        <ResearchDateRange className={styles.field} value={{ from: filters.from, to: filters.to }} onChange={range => updateFilter(range)} />
        <button type="button" className={styles.reset} aria-label="Reset filters" onClick={() => setFilters(defaultFilters())}>Reset</button>
      </div>
      {invalidDates ? <p id="research-date-error" role="alert">Choose an end date on or after the start date.</p> : null}
      {!search.active && reportCatalogue.error ? <p role="alert">Could not load derived types. <button type="button" className={styles.reset} onClick={reportCatalogue.retry}>Try again</button></p> : null}
      {countryList.error ? <p role="alert">Could not load countries. <button type="button" className={styles.reset} onClick={countryList.retry}>Try again</button></p> : null}
    </aside>
    {!initialLoading && error ? <div className={styles.researchStatus}>
      <p role="alert">{search.active ? "Could not search reports." : `Could not load ${failedFeeds.map(feed => intelligenceReportLabels[feed]).join(" and ")}.`} <button type="button" className={styles.reset} disabled={pending} onClick={() => search.active ? search.retry() : loadMore(selectedFeeds, true)}>Try again</button></p>
    </div> : null}
    {initialLoading ? <ResearchPublicationsSkeleton /> : null}
    {!initialLoading ? <ResearchPublications
      key={JSON.stringify(filters)}
      records={records}
      language={language}
      hasMore={hasMore}
      loadingMore={pending}
      loadMoreDisabled={invalidDates || error}
      onLoadMore={() => search.active ? search.loadMore() : loadMore(selectedFeeds)}
    /> : null}
  </div>;
}
