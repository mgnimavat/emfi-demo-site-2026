import { NextResponse } from "next/server";
import { fetchIntelligenceSearch, type IntelligenceLanguage } from "@/lib/intelligence-reports";

export async function GET(request: Request, { params }: { params: Promise<{ lang: string; searchTerm: string }> }) {
  const { lang, searchTerm } = await params;
  const rawPage = new URL(request.url).searchParams.get("page") ?? "1";
  const page = Number(rawPage);
  if (!["english", "espanol"].includes(lang) || !searchTerm.trim() || !/^\d+$/.test(rawPage) || !Number.isSafeInteger(page) || page < 1) {
    return NextResponse.json({ error: "Invalid search request." }, { status: 400 });
  }
  try {
    return NextResponse.json(await fetchIntelligenceSearch(lang as IntelligenceLanguage, searchTerm, page), { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60" } });
  } catch {
    return NextResponse.json({ error: "Search is temporarily unavailable. Please try again." }, { status: 502 });
  }
}
