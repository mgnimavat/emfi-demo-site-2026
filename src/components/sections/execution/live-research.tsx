"use client";

import { useMemo, useState } from "react";
import { useServiceLocale } from "@/ui/hooks/useServiceLocale";
import { RotateCcw, Search, X } from "lucide-react";
import { emptyExecutionFilters, filterExecutionResearch, invalidResearchDateRange, type ExecutionResearchFilters } from "@/lib/execution-research";
import { alternateIntelligenceReports, intelligenceReportFeeds, intelligenceReportLabels, mergeIntelligenceReports, type IntelligenceLanguage } from "@/lib/intelligence-reports";
import { useIntelligenceReports } from "@/lib/use-intelligence-reports";
import { useIntelligenceSearch } from "@/lib/use-intelligence-search";
import { reportSourceUrl } from "@/lib/intelligence-report-types";
import { useIntelligenceReportTypes } from "@/lib/use-intelligence-report-types";
import { trailingResearchRange } from "@/lib/research-date-range";
import { ResearchDateRange } from "./research-date-range";
import { useIntelligenceCountries } from "@/lib/use-intelligence-countries";
import { ResearchFilterSelect } from "./research-filter-select";
import { ResearchPublications, ResearchPublicationsSkeleton } from "./research-publications";
import styles from "./research-publications.module.css";

const defaultFilters = (): ExecutionResearchFilters => ({ ...emptyExecutionFilters, ...trailingResearchRange(12) });

export const LiveResearch = ({ singleColumn = false }: { singleColumn?: boolean }) => {
  const { t, locale } = useServiceLocale();
  const language: IntelligenceLanguage = locale === "es" ? "espanol" : "english";
  const [filters, setFilters] = useState(defaultFilters);
  const search = useIntelligenceSearch(language, filters.keyword);
  const { feeds, loading, loadMore } = useIntelligenceReports(language, filters.from, filters.to, !search.active);
  const countryList = useIntelligenceCountries();
  const reportCatalogue = useIntelligenceReportTypes();
  const selectedFeeds = intelligenceReportFeeds.filter(feed => !filters.reportType || intelligenceReportLabels[feed] === filters.reportType);
  const allRecords = useMemo(() => mergeIntelligenceReports(...intelligenceReportFeeds.map(feed => feeds[feed].records)), [feeds]);
  const sourceRecords = search.active ? search.records : allRecords;
  const typedRecords = useMemo(() => sourceRecords.map(record => {
    const derivedType = reportCatalogue.types[record.id];
    const sourceUrl = record.sourceUrl ?? reportSourceUrl(record.id, reportCatalogue.slugs[record.id], language);
    return { ...record, ...(derivedType ? { topics: [...new Set([...record.topics, derivedType])] } : {}), ...(sourceUrl ? { sourceUrl } : {}) };
  }), [sourceRecords, reportCatalogue.types, reportCatalogue.slugs, language]);
  const records = useMemo(() => alternateIntelligenceReports(filterExecutionResearch(typedRecords, filters)), [typedRecords, filters]);
  const invalidDates = invalidResearchDateRange(filters);
  const failedFeeds = selectedFeeds.filter(feed => feeds[feed].error);
  const hasMore = search.active ? search.next !== null : selectedFeeds.some(feed => feeds[feed].next !== null);
  const pending = search.active ? search.loading : loading;
  const error = search.active ? search.error : failedFeeds.length > 0;
  const initialLoading = (pending && !sourceRecords.length) || (Boolean(filters.derivedType) && reportCatalogue.loading);
  const updateFilter = (patch: Partial<ExecutionResearchFilters>) => setFilters(previous => ({ ...previous, ...patch }));

  return <div className={`${styles.publications} ${singleColumn ? styles.singleColumn : ''}`}>
    {locale === "ar" ? <p>{t("Publications are available in English on this page.")}</p> : null}
    <aside className={styles.filterBar} aria-label={t("Research filters")}>
      <div className={styles.filterFields}>
        <label className={`${styles.filterField} ${styles.searchLabel}`}>{t("Search research")} <span className={styles.researchSearch}>
            <Search size={19} strokeWidth={1.7} aria-hidden="true" />
            <input type="search" placeholder={t("Search reports, markets or countries…")} value={filters.keyword} onChange={event => updateFilter({ keyword: event.target.value })} />
            {filters.keyword ? <button type="button" aria-label={t("Clear search")} onClick={() => updateFilter({ keyword: "" })}><X size={16} aria-hidden="true" /></button> : null}
          </span>
        </label>
        <div className={styles.filterControls}>
        <ResearchDateRange className={styles.filterField} label={t("Date")} value={{ from: filters.from, to: filters.to }} onChange={updateFilter} />
        <ResearchFilterSelect className={styles.filterField} label={t("Country")} allLabel={t("All countries")} options={countryList.countries} value={filters.country} onChange={country => updateFilter({ country })} />
        <button type="button" className={styles.resetFilters} aria-label={t("Reset filters")} title={t("Reset filters")} onClick={() => setFilters(defaultFilters())}><RotateCcw size={16} aria-hidden="true" /></button>
        </div>
      </div>
      {invalidDates ? <p role="alert">{t("Choose an end date on or after the start date.")}</p> : null}
      {reportCatalogue.error ? <p role="alert">{t("Some report details could not be loaded.")} <button type="button" onClick={reportCatalogue.retry}>{t("Try again")}</button></p> : null}
      {countryList.error ? <p role="alert">{t("Could not load countries.")} <button type="button" onClick={countryList.retry}>{t("Try again")}</button></p> : null}
    </aside>
    {!initialLoading && error ? <div className={styles.feedStatus}>
      <p role="alert">{search.active ? t("Could not search reports.") : t("Could not load reports.")} <button type="button" disabled={pending} onClick={() => search.active ? search.retry() : loadMore(selectedFeeds, true)}>{t("Try again")}</button></p>
    </div> : null}
    {initialLoading ? <ResearchPublicationsSkeleton singleColumn={singleColumn} /> : <ResearchPublications
      singleColumn={singleColumn}
      key={JSON.stringify(filters)}
      records={records}
      language={language}
      hasMore={hasMore}
      loadingMore={pending}
      loadMoreDisabled={invalidDates || error}
      onLoadMore={() => search.active ? search.loadMore() : loadMore(selectedFeeds)}
    />}
  </div>;
};
