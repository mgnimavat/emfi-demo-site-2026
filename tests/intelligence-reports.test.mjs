import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { fetchIntelligenceChart, fetchIntelligenceReports, fetchIntelligenceSearch, intelligenceChartUrl, intelligenceReportsUrl, intelligenceSearchUrl, mergeIntelligenceReports, normalizeIntelligenceChart, normalizeIntelligencePage, normalizeIntelligenceSearchPage } from "../src/lib/intelligence-reports.ts";
import { emptyExecutionFilters, filterExecutionResearch } from "../src/lib/execution-research.ts";
import { countryChangeColor, mapCountryKey } from "../src/lib/intelligence-map.ts";

function response(sliders = [], pagination = { current: 1, next: 2 }) {
  return { success: true, data: { sliders, pagination } };
}

const report = {
  id: 2582,
  report_title: "  Research &amp; markets  ",
  title: "Pakistan",
  display_date: "2026-10-20",
  description: "<p>Rates &amp; growth.</p><p>Client&#8217;s view.<img src=x onerror=alert(1)></p><script>doNotRender()</script>",
  graph_type: "market_history",
  display_title_first: "Bond",
  display_sub_title: "Price",
  chart_data: { history_data: [
    { created: "2026-10-20T00:00:00Z", last_price: 101 },
    { created: "2026-10-19T00:00:00Z", last_price: 0 },
    { created: "invalid", last_price: 100 },
    { created: "2026-10-18T00:00:00Z", last_price: null },
  ] },
};

test("merges both report arrays into one newest-first list without duplicate IDs", () => {
  const other = normalizeIntelligencePage(response([report]), "get-other-report", 1).records;
  const special = normalizeIntelligencePage(response([{ ...report, id: 2575, display_date: "2026-10-05" }]), "get-spacial-report", 1).records;
  assert.deepEqual(mergeIntelligenceReports(special, other, other).map(item => [item.id, item.reportType]), [
    ["emfi-2582", "Other Reports"],
    ["emfi-2575", "Special Reports"],
  ]);
  assert.deepEqual(mergeIntelligenceReports([], special), special);
  assert.deepEqual(mergeIntelligenceReports([], []), []);
});

test("searches titles, summaries, countries and types across both loaded feeds", () => {
  const records = mergeIntelligenceReports(
    normalizeIntelligencePage(response([{ ...report, report_title: "Inflación and fiscal policy", description: "<p>Reserves improved.</p>" }]), "get-other-report", 1).records,
    normalizeIntelligencePage(response([{ ...report, id: 2575, title: "Global", report_title: "Monthly review", description: "<p>Pakistan reserves improved.</p>" }]), "get-spacial-report", 1).records,
  );
  const search = (keyword, filters = {}) => filterExecutionResearch(records, { ...emptyExecutionFilters, keyword, ...filters });
  assert.equal(search("  PAKISTAN  reserves ").length, 2);
  assert.equal(search("inflacion").length, 1);
  assert.equal(search("monthly").length, 1);
  assert.equal(search("special reports").length, 1);
  assert.equal(search("Pakistan", { reportType: "Special Reports" })[0].id, "emfi-2575");
  assert.equal(search("reserves", { country: "Pakistan" }).length, 1);
  assert.equal(search("reserves", { from: "2026-10-21" }).length, 0);
  assert.equal(search("does not exist").length, 0);
  assert.equal(search(" ").length, 2);
});

test("constructs both endpoints and preserves spacial, language, and page", () => {
  assert.equal(intelligenceReportsUrl("english", "get-other-report", 1), "https://api.emfi.uk/api/intelligence/english/get-other-report?page=1");
  assert.equal(intelligenceReportsUrl("espanol", "get-spacial-report", 2), "https://api.emfi.uk/api/intelligence/espanol/get-spacial-report?page=2");
  for (const page of [0, -1, 1.5, NaN]) assert.throws(() => intelligenceReportsUrl("english", "get-other-report", page));
  assert.throws(() => intelligenceReportsUrl("french", "get-other-report", 1));
  assert.throws(() => intelligenceReportsUrl("english", "get-special-report", 1));
});

test("uses sliders and next, decodes summaries as text and maps real chart observations", () => {
  const page = normalizeIntelligencePage(response([report]), "get-other-report", 1);
  assert.equal(page.next, 2);
  assert.equal(page.records[0].title, "Research & markets");
  assert.equal(page.records[0].reportType, "Other Reports");
  assert.deepEqual(page.records[0].paragraphs, ["Rates & growth.", "Client’s view."]);
  assert.deepEqual(page.records[0].chart.points, [{ date: "2026-10-19", value: 0 }, { date: "2026-10-20", value: 101 }]);
});

test("accepts an empty final page without next and does not invent global charts", () => {
  assert.deepEqual(normalizeIntelligencePage(response([], { current: 4 }), "get-spacial-report", 4), { records: [], next: null });
  const page = normalizeIntelligencePage(response([{ ...report, graph_type: "global" }]), "get-spacial-report", 1);
  assert.equal(page.records[0].reportType, "Special Reports");
  assert.equal(page.records[0].chart, undefined);
});

test("rejects API failures, malformed records, wrong pages and circular pagination", () => {
  for (const payload of [
    { success: false, data: {} },
    { success: true, data: { sliders: {}, pagination: { current: 1 } } },
    response([{}]),
    response([{ ...report, display_date: "2026-02-30" }]),
    response([], { current: 2, next: 3 }),
    response([], { current: 1, next: 1 }),
  ]) assert.throws(() => normalizeIntelligencePage(payload, "get-other-report", 1));
});

test("requests JSON and propagates HTTP and malformed-JSON failures", async context => {
  const requests = [];
  context.mock.method(globalThis, "fetch", async (url, options) => {
    requests.push({ url, options });
    return Response.json(response([report]));
  });
  const page = await fetchIntelligenceReports("english", "get-other-report", 1);
  assert.equal(page.records.length, 1);
  assert.equal(requests[0].options.headers.Accept, "application/json");
  globalThis.fetch.mock.mockImplementation(async () => new Response("Unavailable", { status: 503 }));
  await assert.rejects(fetchIntelligenceReports("english", "get-other-report", 1));
  globalThis.fetch.mock.mockImplementation(async () => new Response("not JSON"));
  await assert.rejects(fetchIntelligenceReports("english", "get-other-report", 1));
});

test("search uses reports_list, publish_date, country_name and format_type", () => {
  const payload = { success: true, data: { reports_list: [{ id: 99, report_title: "Argentina outlook", country_name: "Argentina", format_type: "Country Report", publish_date: "2026-10-20T00:00:00Z", description: "<p>Fiscal &amp; monetary policy.</p>", report_slug: "argentina-outlook" }], pagination: { current: 1, next: 2 } } };
  const page = normalizeIntelligenceSearchPage(payload, "english", 1);
  assert.equal(page.next, 2);
  assert.equal(page.records[0].country, "Argentina");
  assert.equal(page.records[0].publishedAt, "2026-10-20");
  assert.equal(page.records[0].reportType, "Other Reports");
  assert.ok(page.records[0].topics.includes("Country Report"));
  assert.equal(page.records[0].sourceUrl, "https://emfi.uk/english/intelligence/details/argentina-outlook?id=99");
  assert.deepEqual(page.records[0].paragraphs, ["Fiscal & monetary policy."]);
  payload.data.reports_list[0].report_title = "";
  assert.equal(normalizeIntelligenceSearchPage(payload, "english", 1).records[0].title, "Argentina · Country Report");
  assert.throws(() => normalizeIntelligenceSearchPage(response([]), "english", 1));
  assert.deepEqual(normalizeIntelligenceSearchPage({ success: true, data: { reports_list: [], pagination: { current: 1 } } }, "english", 1), { records: [], next: null });
});

test("search makes a GET request to the exact search endpoint with encoded terms and next page", async context => {
  assert.equal(intelligenceSearchUrl("english", " EMFI ", 1), "https://api.emfi.uk/api/intelligence/english/search/EMFI?page=1");
  assert.equal(intelligenceSearchUrl("espanol", "Perú & Chile", 2), "https://api.emfi.uk/api/intelligence/espanol/search/Per%C3%BA%20%26%20Chile?page=2");
  assert.throws(() => intelligenceSearchUrl("english", " ", 1));
  assert.throws(() => intelligenceSearchUrl("english", "EMFI", 0));
  context.mock.method(globalThis, "fetch", async (url, options) => {
    assert.equal(url, "https://api.emfi.uk/api/intelligence/english/search/EMFI?page=2");
    assert.equal(options.headers.Accept, "application/json");
    assert.equal(options.body, undefined);
    return Response.json({ success: true, data: { reports_list: [], pagination: { current: 2 } } });
  });
  assert.deepEqual(await fetchIntelligenceSearch("english", "EMFI", 2), { records: [], next: null });
});

test("search keeps the same two report collections and their correct chart sources", () => {
  const formats = ["Country Report", "Flash Note", "Strategy Viewpoint", "Special Report", "EMFI Monthly Review"];
  const payload = { success: true, data: { reports_list: formats.map((format_type, i) => ({ id: i + 1, report_title: `Report ${i}`, country_name: "Global", format_type, publish_date: "2026-10-20" })), pagination: { current: 1 } } };
  const page = normalizeIntelligenceSearchPage(payload, "english", 1);
  assert.deepEqual(page.records.map(report => report.reportType), ["Other Reports", "Other Reports", "Other Reports", "Special Reports", "Special Reports"]);
  assert.deepEqual(page.records.map(report => report.chartSource), ["other", "other", "other", "special", "special"]);
  assert.equal(filterExecutionResearch(page.records, { ...emptyExecutionFilters, reportType: "Special Reports" }).length, 2);
  assert.equal(filterExecutionResearch(page.records, { ...emptyExecutionFilters, reportType: "Other Reports" }).length, 3);
});

test("chart sources preserve spacial spelling and validate IDs", () => {
  assert.equal(intelligenceChartUrl("english", "other", "2581"), "https://api.emfi.uk/api/intelligence/english/get-report-chart/2581");
  assert.equal(intelligenceChartUrl("espanol", "special", "2575"), "https://api.emfi.uk/api/intelligence/espanol/get-spacial-report-by-id/2575");
  assert.throws(() => intelligenceChartUrl("english", "other", "../2581"));
  assert.equal(normalizeIntelligencePage(response([report]), "get-spacial-report", 1).records[0].chartSource, "special");
  assert.equal(normalizeIntelligencePage(response([report]), "get-other-report", 1).records[0].chartSource, "other");
});

test("normalizes chart endpoint history, benchmark columns, and metric selection", () => {
  const slider = { ...report, option_banchmark: 440290, display_title_second: "Benchmark bond", chart_data: {
    options: { option_banchmark: 440290, option_prices: 1 },
    history_data: report.chart_data.history_data,
    benchmark_history_data: [{ main_date: "2026-10-19", column2: 77 }, { main_date: "2026-10-20", column2: 78 }],
  } };
  const chart = normalizeIntelligenceChart({ success: true, data: { sliders: slider } });
  assert.equal(chart.kind, "price");
  assert.deepEqual(chart.benchmarkPoints, [{ date: "2026-10-19", value: 77 }, { date: "2026-10-20", value: 78 }]);
  assert.equal(chart.benchmarkTitle, "Benchmark bond");
  slider.chart_data.options.option_prices = 2;
  slider.chart_data.history_data = [{ created: "2026-10-19", last_price: 100, YLD_YTM_MID: 5 }, { created: "2026-10-20", last_price: 101, YLD_YTM_MID: 6 }];
  assert.deepEqual(normalizeIntelligenceChart({ success: true, data: { sliders: slider } }).points.map(point => point.value), [5, 6]);
});

test("country charts use actual countries data and retain zero changes", () => {
  const chart = normalizeIntelligenceChart({ success: true, data: { sliders: { graph_type: "global", chart_data: { countries: [
    { id: 1, title: "Argentina", avg_percentage_change: 1.31, value: -1.31 },
    { id: 2, title: "Zambia", avg_percentage_change: 0 },
    { id: 3, title: "Invalid", avg_percentage_change: null },
  ] } } } });
  assert.equal(chart.kind, "world");
  assert.deepEqual(chart.countries.map(country => country.value), [1.31, 0]);
  assert.equal(normalizeIntelligenceChart({ success: true, data: { sliders: { graph_type: "global", chart_data: { countries: [] } } } }), null);
  assert.throws(() => normalizeIntelligenceChart({ success: false }));
});

test("chart API fetch uses known source and can resolve an unknown search report source", async context => {
  const calls = [];
  context.mock.method(globalThis, "fetch", async (url, options) => {
    calls.push(url);
    assert.equal(options.headers.Accept, "application/json");
    if (url.includes("get-report-chart")) return new Response("Not found", { status: 404 });
    return Response.json({ success: true, data: { sliders: report } });
  });
  assert.equal((await fetchIntelligenceChart("english", "auto", "2575")).kind, "price");
  assert.deepEqual(calls, ["https://api.emfi.uk/api/intelligence/english/get-report-chart/2575", "https://api.emfi.uk/api/intelligence/english/get-spacial-report-by-id/2575"]);
  calls.length = 0;
  await fetchIntelligenceChart("english", "special", "2575");
  assert.equal(calls.length, 1);
});

test("world map joins country aliases and gives live changes distinct signed colours", () => {
  assert.equal(mapCountryKey("Ivory Coast"), mapCountryKey("Côte d’Ivoire"));
  assert.equal(mapCountryKey("Czech Republic"), mapCountryKey("Czechia"));
  assert.equal(mapCountryKey("United States of America"), mapCountryKey("United States"));
  assert.equal(countryChangeColor(100, 100), "rgb(44,128,94)");
  assert.equal(countryChangeColor(-100, 100), "rgb(180,72,65)");
  assert.equal(countryChangeColor(undefined, 100), "#e7edf4");
  assert.notEqual(countryChangeColor(0, 100), countryChangeColor(undefined, 100));
  assert.notEqual(countryChangeColor(1, 100), countryChangeColor(100, 100));
});

test("India-view geometry covers the configured Kashmir points without overlapping neighbouring hit areas", () => {
  const outlines = JSON.parse(readFileSync(new URL("../src/content/world-map-paths.json", import.meta.url), "utf8"));
  const paths = new Map(outlines.map(country => [country.name, country.path]));
  function contains(name, longitude, latitude) {
    const x = (longitude + 180) / 360 * 600, y = (90 - latitude) / 180 * 290;
    let inside = false;
    for (const ring of paths.get(name).split("M").slice(1)) {
      const points = [...ring.matchAll(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g)].map(match => [Number(match[1]), Number(match[2])]);
      for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
        const [ax, ay] = points[i], [bx, by] = points[j];
        if ((ay > y) !== (by > y) && x < (bx - ax) * (y - ay) / (by - ay) + ax) inside = !inside;
      }
    }
    return inside;
  }
  assert.equal(outlines.length, 202);
  assert.equal(paths.size, 202);
  for (const point of [[74.3, 35.9], [79, 35]]) {
    assert.equal(contains("India", ...point), true);
    assert.equal(contains("Pakistan", ...point), false);
    assert.equal(contains("China", ...point), false);
  }
  assert.equal(contains("India", 77.2, 28.6), true);
  assert.equal(contains("Pakistan", 73.1, 33.7), true);
  assert.equal(contains("China", 116.4, 39.9), true);
});

test("country dropdown normalizes the dedicated API list independently of report pages", async () => {
  const { normalizeIntelligenceCountries } = await import("../src/lib/intelligence-countries.ts");
  assert.deepEqual(normalizeIntelligenceCountries({ success: true, data: { countries: [
    { country_id: 2, country_name: "Zambia" }, { country_id: 1, country_name: " Argentina " },
    { country_id: 3, country_name: "Global" }, { country_id: 2, country_name: "Zambia" },
    { country_name: null }, null, { country_name: " " },
  ] } }), ["Argentina", "Global", "Zambia"]);
  assert.deepEqual(normalizeIntelligenceCountries({ success: true, data: { countries: false } }), []);
  assert.throws(() => normalizeIntelligenceCountries({ success: false, data: { countries: [] } }));
  assert.throws(() => normalizeIntelligenceCountries({ success: true, data: {} }));
});

test("both report APIs retain date bounds on initial and subsequent pages", async context => {
  const { intelligenceReportQuery } = await import("../src/lib/intelligence-reports.ts");
  const dates = { fromDate: "2026-09-10", toDate: "2026-10-13" };
  const requests = [];
  context.mock.method(globalThis, "fetch", async url => {
    requests.push(url);
    return Response.json(response([], { current: Number(new URL(url).searchParams.get("page")) }));
  });
  for (const feed of ["get-other-report", "get-spacial-report"]) {
    for (const page of [1, 2]) {
      const expected = `https://api.emfi.uk/api/intelligence/english/${feed}?page=${page}&fromDate=2026-09-10&toDate=2026-10-13`;
      assert.equal(intelligenceReportsUrl("english", feed, page, dates), expected);
      await fetchIntelligenceReports("english", feed, page, dates);
      assert.equal(requests.at(-1), expected);
    }
  }
  assert.equal(intelligenceReportQuery(1, { fromDate: dates.fromDate }), "page=1&fromDate=2026-09-10");
  assert.equal(intelligenceReportQuery(1, { toDate: dates.toDate }), "page=1&toDate=2026-10-13");
  assert.equal(intelligenceReportQuery(1, {}), "page=1");
  for (const invalid of [{ fromDate: "2026-02-30" }, { toDate: "invalid" }, { fromDate: "2026-10-14", toDate: "2026-10-13" }]) {
    assert.throws(() => intelligenceReportQuery(1, invalid));
  }
});

test("retains filtered report rows when upstream omits last-page metadata", () => {
  const lastPage = { success: true, data: { error: "queried page 1 is >= to maximum page number 1", sliders: [report] } };
  const normalized = normalizeIntelligencePage(lastPage, "get-other-report", 1);
  assert.equal(normalized.records.length, 1);
  assert.equal(normalized.next, null);
  assert.deepEqual(normalizeIntelligencePage({ success: true, data: { error: "queried page 1 is >= to maximum page number 0" } }, "get-spacial-report", 1), { records: [], next: null });
  assert.throws(() => normalizeIntelligencePage(lastPage, "get-other-report", 2));
  assert.throws(() => normalizeIntelligencePage({ success: true, data: { error: "Database error", sliders: [report] } }, "get-other-report", 1));
});

test("default month range clamps month-end dates and handles leap years", async () => {
  const { lastMonthResearchRange } = await import("../src/lib/research-date-range.ts");
  assert.deepEqual(lastMonthResearchRange(new Date(2026, 9, 23)), { from: "2026-09-23", to: "2026-10-23" });
  assert.deepEqual(lastMonthResearchRange(new Date(2026, 2, 31)), { from: "2026-02-28", to: "2026-03-31" });
  assert.deepEqual(lastMonthResearchRange(new Date(2024, 2, 31)), { from: "2024-02-29", to: "2024-03-31" });
  assert.deepEqual(lastMonthResearchRange(new Date(2026, 0, 15)), { from: "2025-12-15", to: "2026-01-15" });
});

test("derived report formats join by ID and filter independently of report groups", async () => {
  const { normalizeReportTypes } = await import("../src/lib/intelligence-report-types.ts");
  const types = normalizeReportTypes({ success: true, data: { search_report_list: [
    { id: 2582, format_type: "Flash Note", report_file: "not exposed" },
    { id: 2575, format_type: "EMFI Monthly Review" }, { id: 1, format_type: null },
  ] } });
  assert.deepEqual(types, { "emfi-2582": "Flash Note", "emfi-2575": "EMFI Monthly Review" });
  const records = normalizeIntelligencePage(response([report]), "get-other-report", 1).records.map(record => ({ ...record, topics: [...record.topics, types[record.id]] }));
  assert.equal(filterExecutionResearch(records, { ...emptyExecutionFilters, reportType: "Other Reports", derivedType: "Flash Note" }).length, 1);
  assert.equal(filterExecutionResearch(records, { ...emptyExecutionFilters, derivedType: "Country Report" }).length, 0);
  assert.deepEqual(normalizeReportTypes({ success: true, data: { search_report_list: false } }), {});
  assert.throws(() => normalizeReportTypes({ success: false }));
});

test("six-month, year and previous calendar quarter presets handle date boundaries", async () => {
  const { trailingResearchRange, lastQuarterResearchRange } = await import("../src/lib/research-date-range.ts");
  const now = new Date(2026, 9, 23);
  assert.deepEqual(trailingResearchRange(6, now), { from: "2026-04-23", to: "2026-10-23" });
  assert.deepEqual(trailingResearchRange(12, now), { from: "2025-10-23", to: "2026-10-23" });
  assert.deepEqual(trailingResearchRange(12, new Date(2024, 1, 29)), { from: "2023-02-28", to: "2024-02-29" });
  assert.deepEqual(lastQuarterResearchRange(now), { from: "2026-07-01", to: "2026-09-30" });
  assert.deepEqual(lastQuarterResearchRange(new Date(2026, 0, 15)), { from: "2025-10-01", to: "2025-12-31" });
});
