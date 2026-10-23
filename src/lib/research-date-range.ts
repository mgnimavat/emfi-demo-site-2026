const format = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

export function trailingResearchRange(months: number, now = new Date()) {
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const start = new Date(end.getFullYear(), end.getMonth() - months + 1, 0);
  start.setDate(Math.min(end.getDate(), start.getDate()));
  return { from: format(start), to: format(end) };
}

export function lastMonthResearchRange(now = new Date()) {
  return trailingResearchRange(1, now);
}

export function lastQuarterResearchRange(now = new Date()) {
  const quarterStart = Math.floor(now.getMonth() / 3) * 3;
  return {
    from: format(new Date(now.getFullYear(), quarterStart - 3, 1)),
    to: format(new Date(now.getFullYear(), quarterStart, 0)),
  };
}

export function displayResearchDate(isoDate: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(isoDate) ? `${isoDate.slice(5, 7)}-${isoDate.slice(8, 10)}-${isoDate.slice(0, 4)}` : "";
}

export function parseResearchDate(value: string): string | null {
  if (!value) return "";
  if (!/^\d{2}-\d{2}-\d{4}$/.test(value)) return null;
  const isoDate = `${value.slice(6)}-${value.slice(0, 2)}-${value.slice(3, 5)}`;
  const parsed = new Date(`${isoDate}T00:00:00Z`);
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === isoDate ? isoDate : null;
}

export function researchDateInput(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  return [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4)].filter(Boolean).join("-");
}
