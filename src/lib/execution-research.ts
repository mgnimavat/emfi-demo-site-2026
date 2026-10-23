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

function searchableText(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase();
}

export function filterExecutionResearch(records: readonly ExecutionResearchRecord[], filters: ExecutionResearchFilters) {
  if (invalidResearchDateRange(filters)) return [];
  const keywords = searchableText(filters.keyword).trim().split(/\s+/).filter(Boolean);
  return records.filter((record) => {
    const text = searchableText([record.title, record.country, record.reportType, ...record.topics, ...record.paragraphs].join(" "));
    return keywords.every((keyword) => text.includes(keyword))
      && (!filters.country || record.country === filters.country)
      && (!filters.reportType || (record.publicationType === filters.reportType || record.reportType === filters.reportType))
      && (!filters.derivedType || record.topics.includes(filters.derivedType))
      && (!filters.from || record.publishedAt >= filters.from)
      && (!filters.to || record.publishedAt <= filters.to);
  });
}
