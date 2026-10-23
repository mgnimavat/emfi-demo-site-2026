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
