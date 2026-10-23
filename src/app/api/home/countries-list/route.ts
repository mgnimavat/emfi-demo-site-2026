import { NextResponse } from "next/server";
import { fetchIntelligenceCountries } from "@/lib/intelligence-countries";

export async function GET() {
  try {
    return NextResponse.json({ countries: await fetchIntelligenceCountries() }, { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60" } });
  } catch {
    return NextResponse.json({ error: "Countries are temporarily unavailable." }, { status: 502 });
  }
}
