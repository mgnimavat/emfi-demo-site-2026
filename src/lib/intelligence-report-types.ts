export function normalizeReportTypes(payload: unknown): Record<string, string> {
  const response = payload as { success?: boolean; data?: { search_report_list?: unknown } } | null;
  const rows = response?.data?.search_report_list;
  if (response?.success !== true || (rows !== false && !Array.isArray(rows))) throw new Error("Invalid report catalogue");
  return Object.fromEntries((rows || []).flatMap((row: unknown) => {
    const report = row as { id?: unknown; format_type?: unknown } | null;
    const id = String(report?.id ?? "");
    const type = typeof report?.format_type === "string" ? report.format_type.trim() : "";
    return /^\d+$/.test(id) && type ? [[`emfi-${id}`, type]] : [];
  }));
}

export function normalizeReportSlugs(payload: unknown): Record<string, string> {
  const response = payload as { success?: boolean; data?: { search_report_list?: unknown } } | null;
  const rows = response?.data?.search_report_list;
  if (response?.success !== true || (rows !== false && !Array.isArray(rows))) throw new Error("Invalid report catalogue");
  return Object.fromEntries((rows || []).flatMap((row: unknown) => {
    const report = row as { id?: unknown; report_slug?: unknown } | null;
    const id = String(report?.id ?? "");
    const slug = typeof report?.report_slug === "string" ? report.report_slug.trim() : "";
    return /^\d+$/.test(id) && slug ? [[`emfi-${id}`, slug]] : [];
  }));
}

export function reportSourceUrl(id: string, slug: string | undefined, language: "english" | "espanol") {
  const match = /^emfi-(\d+)$/.exec(id);
  return match && slug?.trim() ? `https://emfi.uk/${language}/intelligence/details/${encodeURIComponent(slug.trim())}?id=${match[1]}` : undefined;
}
