"use client";

import { CurvedBand } from "@/components/layout/curved-band";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { execution, researchReportTypes, researchDerivedTypes } from "@/content/execution";
import { demoExecutionSecurities, type ExecutionSymbol } from "@/content/execution-securities";
import { emptyExecutionFilters, filterExecutionResearch, invalidResearchDateRange } from "@/lib/execution-research";
import { InteractiveExecutionTicket } from "./interactive-execution-ticket";
import { ResearchPublications } from "./research-publications";
import { ResearchFilterSelect } from "./research-filter-select";
import { ExecutionChart } from "./execution-chart";
import { ExecutionWatchlists } from "./execution-watchlists";
import { ExecutionTransactions } from "./execution-transactions";
import { ExecutionReveal } from "./reveal";
import styles from "./page.module.css";

const countries = [...new Set(execution.research.records.map((record) => record.country))].sort();

export function ConnectedExecutionPreviews() {
  const [securitySymbol, setSecuritySymbol] = useState<ExecutionSymbol>("XXXX-01");
  const chartSecurity = demoExecutionSecurities.find((security) => security.symbol === securitySymbol) ?? demoExecutionSecurities[0];
  const [filters, setFilters] = useState(emptyExecutionFilters);
  const records = useMemo(() => filterExecutionResearch(execution.research.records, filters), [filters]);
  const invalidDates = invalidResearchDateRange(filters);
  function resetFilters() {
    setFilters(emptyExecutionFilters);
  }

  return <>
    <CurvedBand nextBackground="#fff"><section id="research" aria-labelledby="research-heading" className={`${styles.section} ${styles.soft} ${styles.researchSection} scroll-mt-24`}>
      <div className={styles.container}>
        <ExecutionReveal className={styles.researchIntro}><h2 id="research-heading" className={styles.title}>{execution.research.title}</h2><p className={styles.body}>{execution.research.body}</p></ExecutionReveal>
        <div className={styles.preview}>
          <aside className={styles.filters} aria-label="Research filters">
            <div className={styles.filterFields}>
              <label className={styles.field}>Title / Topic<span className={styles.searchField}><Search size={16} aria-hidden="true" /><input type="search" aria-label="Report Title / Topic" placeholder="Search titles or topics" value={filters.keyword} onChange={(event) => setFilters({ ...filters, keyword: event.target.value })} /></span></label>
              <ResearchFilterSelect className={styles.field} label="Country" allLabel="All countries" options={countries} value={filters.country} onChange={country => setFilters({ ...filters, country })} />
              <ResearchFilterSelect className={styles.field} label="Report Type" allLabel="All report types" options={researchReportTypes} value={filters.reportType} onChange={reportType => setFilters({ ...filters, reportType })} />
              <ResearchFilterSelect className={styles.field} label="Derived Type" allLabel="All derived types" options={researchDerivedTypes} value={filters.derivedType} onChange={derivedType => setFilters({ ...filters, derivedType })} />
              <label className={styles.field}>Published From<input type="date" aria-label="Publication date from" value={filters.from} aria-invalid={invalidDates} aria-describedby={invalidDates ? "research-date-error" : undefined} onChange={(event) => setFilters({ ...filters, from: event.target.value })} /></label>
              <label className={styles.field}>Published To<input type="date" aria-label="Publication date to" value={filters.to} aria-invalid={invalidDates} aria-describedby={invalidDates ? "research-date-error" : undefined} onChange={(event) => setFilters({ ...filters, to: event.target.value })} /></label>
              <button type="button" className={styles.reset} aria-label="Reset filters" onClick={resetFilters}>Reset</button>
            </div>
            {invalidDates ? <p id="research-date-error" role="alert">Choose an end date on or after the start date.</p> : null}
          </aside>
          <ResearchPublications key={JSON.stringify(filters)} records={records} />
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
