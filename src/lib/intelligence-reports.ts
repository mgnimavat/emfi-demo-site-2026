import { decodeHTML } from "entities";
import type { ExecutionResearchChart, ExecutionResearchRecord } from "@/content/execution";

export const intelligenceReportFeeds = ["get-other-report", "get-spacial-report"] as const;
export type IntelligenceReportFeed = typeof intelligenceReportFeeds[number];
export type IntelligenceLanguage = "english" | "espanol";
export const intelligenceReportLabels: Record<IntelligenceReportFeed, string> = {
  "get-other-report": "Other Reports",
  "get-spacial-report": "Special Reports",
};

export type IntelligenceReportsPage = {
  records: ExecutionResearchRecord[];
  next: number | null;
};

/** Both feeds share report IDs; one publication should occupy one list entry. */
export function mergeIntelligenceReports(...feeds: readonly (readonly ExecutionResearchRecord[])[]): ExecutionResearchRecord[] {
  return [...new Map(feeds.flat().map(report => [report.id, report])).values()]
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt) || b.id.localeCompare(a.id, undefined, { numeric: true }));
}

function object(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function text(value: unknown) {
  if (typeof value !== "string") return "";
  return decodeHTML(value.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, "").replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
}

function date(value: unknown) {
  const result = typeof value === "string" ? value.slice(0, 10) : "";
  const parsed = new Date(`${result}T00:00:00Z`);
  return /^\d{4}-\d{2}-\d{2}$/.test(result) && Number.isFinite(parsed.getTime()) && parsed.toISOString().startsWith(result) ? result : null;
}

function numeric(value: unknown): number | null {
  const result = typeof value === "number" ? value : typeof value === "string" && value.trim() ? Number(value) : NaN;
  return Number.isFinite(result) ? result : null;
}

function chartPoints(value: unknown, field: string) {
  if (!Array.isArray(value)) return [];
  const points = value.flatMap(value => {
    const row = object(value);
    const observedAt = date(row.created ?? row.main_date ?? row.date);
    const price = numeric(row[field]);
    return observedAt && price !== null ? [{ date: observedAt, value: price }] : [];
  });
  return [...new Map(points.map(point => [point.date, point])).values()].sort((a, b) => a.date.localeCompare(b.date));
}

function readIntelligenceChart(report: Record<string, unknown>): ExecutionResearchChart | null {
  const data = object(report.chart_data);
  const options = object(data.options);
  if (report.graph_type === "global") {
    const countries = Array.isArray(data.countries) ? data.countries.flatMap(value => {
      const country = object(value);
      const change = numeric(country.avg_percentage_change ?? country.value);
      const name = text(country.title);
      return name && change !== null ? [{ id: String(country.id ?? name), name, value: change }] : [];
    }) : [];
    return countries.length ? { kind: "world", title: "Country daily change (%)", countries } : null;
  }
  if (report.graph_type !== "market_history") return null;
  const metric = numeric(options.option_prices ?? report.option_prices) ?? 1;
  const field = metric === 2 ? "YLD_YTM_MID" : metric === 3 ? "Z_SPRD_MID" : "last_price";
  const history = chartPoints(data.history_data, field);
  const points = history.length ? history : chartPoints(data.benchmark_history_data, "column1");
  if (points.length < 2) return null;
  const benchmark = numeric(options.option_banchmark ?? report.option_banchmark) ?? 0;
  const benchmarkPoints = benchmark > 0 ? chartPoints(data.benchmark_history_data, "column2") : [];
  return {
    kind: "price",
    title: [text(report.display_title_first) || text(options.title), text(report.display_sub_title) || (metric === 2 ? "Yield (%)" : metric === 3 ? "Spread (bps)" : "Price")].filter(Boolean).join(" "),
    points,
    ...(benchmarkPoints.length > 1 ? { benchmarkPoints, benchmarkTitle: text(report.display_title_second) || text(options.title2) || "Benchmark" } : {}),
  };
}

export function normalizeIntelligenceChart(payload: unknown): ExecutionResearchChart | null {
  const response = object(payload);
  const report = object(object(response.data).sliders);
  if (response.success !== true || !report.graph_type) throw new Error("Invalid intelligence chart response");
  return readIntelligenceChart(report);
}

export type IntelligenceChartSource = "other" | "special" | "auto";

export function intelligenceChartUrl(language: IntelligenceLanguage, source: Exclude<IntelligenceChartSource, "auto">, id: string) {
  if (!["english", "espanol"].includes(language) || !["other", "special"].includes(source) || !/^\d+$/.test(id)) throw new Error("Invalid intelligence chart request");
  return `https://api.emfi.uk/api/intelligence/${language}/${source === "special" ? "get-spacial-report-by-id" : "get-report-chart"}/${id}`;
}

export async function fetchIntelligenceChart(language: IntelligenceLanguage, source: IntelligenceChartSource, id: string): Promise<ExecutionResearchChart | null> {
  const sources = source === "auto" ? ["other", "special"] as const : [source];
  let successful = false;
  for (const candidate of sources) {
    try {
      const response = await fetch(intelligenceChartUrl(language, candidate, id), { headers: { Accept: "application/json" }, signal: AbortSignal.timeout(15000), cache: "no-store" });
      if (!response.ok) throw new Error("Intelligence chart unavailable");
      const chart = normalizeIntelligenceChart(await response.json());
      successful = true;
      if (chart) return chart;
    } catch (error) {
      if (source !== "auto") throw error;
    }
  }
  if (!successful) throw new Error("Intelligence chart unavailable");
  return null;
}

function normalizeReport(value: unknown, reportType: string): ExecutionResearchRecord {
  const report = object(value);
  const id = String(report.id ?? "");
  const title = text(report.report_title);
  const publishedAt = date(report.display_date);
  if (!/^\d+$/.test(id) || !title || !publishedAt) throw new Error("Invalid intelligence report");
  const description = typeof report.description === "string" ? report.description : "";
  const paragraphs = description.split(/<\/p\s*>|<br\s*\/?\s*>/i).map(text).filter(Boolean);
  const chart = readIntelligenceChart(report);
  return {
    id: `emfi-${id}`,
    title,
    country: text(report.title) || "Global",
    reportType,
    publishedAt,
    topics: [reportType],
    paragraphs,
    source: "EMFI Intelligence API",
    ...(chart ? { chart } : {}),
  };
}

export function normalizeIntelligencePage(payload: unknown, feed: IntelligenceReportFeed, page: number): IntelligenceReportsPage {
  const response = object(payload);
  const data = object(response.data);
  const pagination = object(data.pagination);
  // The regular feed omits pagination on its last page, including one-page
  // date ranges, while still returning valid rows and this known error string.
  const endMatch = typeof data.error === "string" ? /^queried page (\d+) is >= to maximum page number (\d+)$/.exec(data.error) : null;
  const terminalPage = data.pagination == null && endMatch !== null && Number(endMatch[1]) === page && Number(endMatch[2]) <= page;
  const sliders = terminalPage && (data.sliders == null || data.sliders === false) ? [] : data.sliders;
  if (response.success !== true || !Array.isArray(sliders) || (!terminalPage && pagination.current !== page)) throw new Error("Invalid intelligence response");
  const next = pagination.next == null ? null : pagination.next;
  if (next !== null && (typeof next !== "number" || !Number.isSafeInteger(next) || next <= page)) throw new Error("Invalid intelligence pagination");
  return { records: sliders.map(report => ({ ...normalizeReport(report, intelligenceReportLabels[feed]), chartSource: feed === "get-spacial-report" ? "special" as const : "other" as const })), next: next as number | null };
}

export function normalizeIntelligenceSearchPage(payload: unknown, language: IntelligenceLanguage, page: number): IntelligenceReportsPage {
  const response = object(payload);
  const data = object(response.data);
  const pagination = object(data.pagination);
  if (response.success !== true || !Array.isArray(data.reports_list) || pagination.current !== page) throw new Error("Invalid intelligence search response");
  const next = pagination.next == null ? null : pagination.next;
  if (next !== null && (typeof next !== "number" || !Number.isSafeInteger(next) || next <= page)) throw new Error("Invalid intelligence search pagination");
  return {
    records: data.reports_list.map(value => {
      const report = object(value);
      const format = text(report.format_type) || "Report";
      // These are the two special-report families supplied by the Intelligence API.
      // Other formats (including Country Report) belong to the other-report feed.
      const special = ["special report", "emfi monthly review"].includes(format.toLowerCase());
      const feed = special ? "get-spacial-report" : "get-other-report";
      const reportType = intelligenceReportLabels[feed];
      const normalized = normalizeReport({ ...report,
        report_title: text(report.report_title) || [text(report.country_name), format].filter(Boolean).join(" · "),
        title: report.country_name,
        display_date: report.publish_date ?? report.report_date,
      }, reportType);
      const topic = text(report.topic);
      return {
        ...normalized,
        chartSource: special ? "special" as const : "other" as const,
        topics: [normalized.reportType, format, ...(topic ? [topic] : [])],
        ...(typeof report.report_slug === "string" && report.report_slug ? { sourceUrl: `https://emfi.uk/${language}/intelligence/details/${encodeURIComponent(report.report_slug)}?id=${report.id}` } : {}),
      };
    }),
    next: next as number | null,
  };
}

export function intelligenceSearchUrl(language: IntelligenceLanguage, searchTerm: string, page: number) {
  if (!["english", "espanol"].includes(language) || !searchTerm.trim() || !Number.isSafeInteger(page) || page < 1) throw new Error("Invalid intelligence search request");
  return `https://api.emfi.uk/api/intelligence/${language}/search/${encodeURIComponent(searchTerm.trim())}?page=${page}`;
}

export async function fetchIntelligenceSearch(language: IntelligenceLanguage, searchTerm: string, page: number): Promise<IntelligenceReportsPage> {
  const response = await fetch(intelligenceSearchUrl(language, searchTerm, page), {
    headers: { Accept: "application/json" }, signal: AbortSignal.timeout(15000), cache: "no-store",
  });
  if (!response.ok) throw new Error("Intelligence search unavailable");
  return normalizeIntelligenceSearchPage(await response.json(), language, page);
}

export type IntelligenceReportDates = { fromDate?: string; toDate?: string };

export function validIntelligenceReportDates({ fromDate = "", toDate = "" }: IntelligenceReportDates) {
  const valid = (date: string) => !date || (/^\d{4}-\d{2}-\d{2}$/.test(date) && Number.isFinite(Date.parse(date)) && new Date(date).toISOString().slice(0, 10) === date);
  return valid(fromDate) && valid(toDate) && (!fromDate || !toDate || fromDate <= toDate);
}

export function intelligenceReportQuery(page: number, dates: IntelligenceReportDates = {}) {
  if (!validIntelligenceReportDates(dates)) throw new Error("Invalid report dates");
  const query = new URLSearchParams({ page: String(page) });
  if (dates.fromDate) query.set("fromDate", dates.fromDate);
  if (dates.toDate) query.set("toDate", dates.toDate);
  return query.toString();
}

export function intelligenceReportsUrl(language: IntelligenceLanguage, feed: IntelligenceReportFeed, page: number, dates: IntelligenceReportDates = {}) {
  if (!["english", "espanol"].includes(language) || !intelligenceReportFeeds.includes(feed) || !Number.isSafeInteger(page) || page < 1) throw new Error("Invalid intelligence request");
  return `https://api.emfi.uk/api/intelligence/${language}/${feed}?${intelligenceReportQuery(page, dates)}`;
}

export async function fetchIntelligenceReports(language: IntelligenceLanguage, feed: IntelligenceReportFeed, page: number, dates: IntelligenceReportDates = {}): Promise<IntelligenceReportsPage> {
  const response = await fetch(intelligenceReportsUrl(language, feed, page, dates), {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(15000),
    cache: "no-store",
  });
  if (!response.ok) throw new Error("Intelligence service unavailable");
  return normalizeIntelligencePage(await response.json(), feed, page);
}
