"use client";

import { useMemo, useSyncExternalStore } from "react";
import { execution } from "@/content/execution";

const subscribe = (callback: () => void) => {
  window.addEventListener("popstate", callback);
  return () => window.removeEventListener("popstate", callback);
};
const getSnapshot = () => {
  const id = new URLSearchParams(window.location.search).get("research");
  if (!id) return "";
  let draft = "";
  try { draft = sessionStorage.getItem("emfi-trade-enquiry") ?? ""; } catch { /* The report ID is enough to retain research context. */ }
  return JSON.stringify({ id, draft });
};
const getServerSnapshot = () => "";

export function useResearchEnquiry() {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return useMemo(() => {
    if (!snapshot) return null;
    const { id, draft } = JSON.parse(snapshot) as { id: string; draft: string };
    const record = execution.research.records.find((item) => item.id === id);
    if (!record) return null;
    const lines = [`Research: ${record.title}`, `Market: ${record.country}`, `Report type: ${record.reportType}`, `Publication date: ${record.publishedAt}`];
    try {
      const values = JSON.parse(draft);
      if (values.researchId === id) {
        if (typeof values.security === "string" && values.security.trim()) lines.push(`Security or issuer: ${values.security.slice(0, 120)}`);
        if (values.side === "Buy" || values.side === "Sell") lines.push(`Side: ${values.side}`);
        const quantity = Number(values.quantity);
        if (Number.isSafeInteger(quantity) && quantity > 0 && quantity <= 1e12) lines.push(`Quantity: ${quantity.toLocaleString("en-US")}`);
        if (typeof values.notes === "string" && values.notes.trim()) lines.push(`Additional requirements: ${values.notes.slice(0, 1000)}`);
      }
    } catch { /* A direct research link still has verified report context. */ }
    return { record, message: lines.join("\n") };
  }, [snapshot]);
}
