import { unstable_cache } from "next/cache";
import { NextResponse } from "next/server";
import { normalizeReportTypes } from "@/lib/intelligence-report-types";

// Cache the compact lookup; the upstream catalogue is larger than Next's
// per-entry cache limit and includes fields this filter does not need.
const readReportTypes = unstable_cache(async () => {
  const response = await fetch("https://api.emfi.uk/api/home/search-report-list", {
    headers: { Accept: "application/json" }, signal: AbortSignal.timeout(15000), cache: "no-store",
  });
  if (!response.ok) throw new Error("Report catalogue unavailable");
  return normalizeReportTypes(await response.json());
}, ["intelligence-derived-types"], { revalidate: 300 });

export async function GET() {
  try {
    return NextResponse.json({ types: await readReportTypes() }, { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=60" } });
  } catch {
    return NextResponse.json({ error: "Derived types are temporarily unavailable." }, { status: 502 });
  }
}
