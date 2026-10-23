import { NextResponse } from "next/server";
import { fetchIntelligenceReports, validIntelligenceReportDates, intelligenceReportFeeds, type IntelligenceLanguage, type IntelligenceReportFeed } from "@/lib/intelligence-reports";

export async function GET(request: Request, { params }: { params: Promise<{ lang: string; report: string }> }) {
  const { lang, report } = await params;
  const query = new URL(request.url).searchParams;
  const dates = { fromDate: query.get("fromDate") ?? "", toDate: query.get("toDate") ?? "" };
  const rawPage = query.get("page") ?? "1";
  const page = Number(rawPage);
  if (!["english", "espanol"].includes(lang) || !intelligenceReportFeeds.includes(report as IntelligenceReportFeed) || !/^\d+$/.test(rawPage) || !Number.isSafeInteger(page) || page < 1 || !validIntelligenceReportDates(dates)) {
    return NextResponse.json({ error: "Invalid report request." }, { status: 400 });
  }
  try {
    const data = await fetchIntelligenceReports(lang as IntelligenceLanguage, report as IntelligenceReportFeed, page, dates);
    return NextResponse.json(data, { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60" } });
  } catch {
    return NextResponse.json({ error: "Reports are temporarily unavailable. Please try again." }, { status: 502 });
  }
}
