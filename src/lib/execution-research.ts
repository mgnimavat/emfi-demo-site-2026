import type { ExecutionResearchRecord } from "@/content/execution";

export type ExecutionResearchFilters = {
  keyword: string;
  country: string;
  reportType: string;
  derivedType: string;
  from: string;
  to: string;
};

export const emptyExecutionFilters: ExecutionResearchFilters = {
  keyword: "", country: "", reportType: "", derivedType: "", from: "", to: "",
};

export function invalidResearchDateRange(filters: ExecutionResearchFilters) {
  return Boolean(filters.from && filters.to && filters.from > filters.to);
}

export function filterExecutionResearch(records: readonly ExecutionResearchRecord[], filters: ExecutionResearchFilters) {
  if (invalidResearchDateRange(filters)) return [];
  const keywords = filters.keyword.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  return records.filter((record) => {
    const text = [record.title, ...record.topics].join(" ").toLocaleLowerCase();
    return keywords.every((keyword) => text.includes(keyword))
      && (!filters.country || record.country === filters.country)
      && (!filters.reportType || record.publicationType === filters.reportType)
      && (!filters.derivedType || record.topics.includes(filters.derivedType))
      && (!filters.from || record.publishedAt >= filters.from)
      && (!filters.to || record.publishedAt <= filters.to);
  });
}
