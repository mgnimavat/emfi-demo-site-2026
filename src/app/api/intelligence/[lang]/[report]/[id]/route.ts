import { NextResponse } from "next/server";
import { fetchIntelligenceChart, type IntelligenceChartSource, type IntelligenceLanguage } from "@/lib/intelligence-reports";

const sources: Record<string, IntelligenceChartSource> = { "get-report-chart": "other", "get-spacial-report-by-id": "special", "get-chart": "auto" };

export async function GET(_request: Request, { params }: { params: Promise<{ lang: string; report: string; id: string }> }) {
  const { lang, report, id } = await params;
  const source = Object.hasOwn(sources, report) ? sources[report] : undefined;
  if (!["english", "espanol"].includes(lang) || !source || !/^\d+$/.test(id)) return NextResponse.json({ error: "Invalid chart request." }, { status: 400 });
  try {
    const chart = await fetchIntelligenceChart(lang as IntelligenceLanguage, source, id);
    return NextResponse.json({ chart }, { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60" } });
  } catch {
    return NextResponse.json({ error: "Chart is temporarily unavailable. Please try again." }, { status: 502 });
  }
}
