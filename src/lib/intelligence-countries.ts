export function normalizeIntelligenceCountries(payload: unknown): string[] {
  if (!payload || typeof payload !== "object" || !("success" in payload) || payload.success !== true || !("data" in payload)) throw new Error("Invalid countries response");
  const data = payload.data;
  if (!data || typeof data !== "object" || !("countries" in data)) throw new Error("Invalid countries response");
  if (data.countries === false) return [];
  if (!Array.isArray(data.countries)) throw new Error("Invalid countries response");
  return [...new Set(data.countries.flatMap(country => typeof country?.country_name === "string" && country.country_name.trim() ? [country.country_name.trim()] : []))].sort((a, b) => a.localeCompare(b, "en"));
}

export async function fetchIntelligenceCountries(): Promise<string[]> {
  const response = await fetch("https://api.emfi.uk/api/home/countries-list", {
    headers: { Accept: "application/json" }, signal: AbortSignal.timeout(15000), cache: "no-store",
  });
  if (!response.ok) throw new Error("Countries unavailable");
  return normalizeIntelligenceCountries(await response.json());
}
