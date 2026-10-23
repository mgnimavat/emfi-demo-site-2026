export function hasReferenceValue(value: string | undefined): value is string {
  return Boolean(value?.trim()) && value?.trim().toLowerCase() !== "not provided";
}

export function referenceQuantity(value: string | undefined) {
  if (!value?.trim()) return "";
  return Number.isFinite(Number(value)) ? new Intl.NumberFormat("en-GB", { maximumFractionDigits: 8 }).format(Number(value)) : value;
}

export function referenceEligibility(value: string | undefined): "Available" | "Not available" | "Not provided" {
  if (["YES", "Y", "TRUE", "1"].includes(value?.trim().toUpperCase() ?? "")) return "Available";
  if (["NO", "N", "FALSE", "0"].includes(value?.trim().toUpperCase() ?? "")) return "Not available";
  return "Not provided";
}

type ReferenceField = { path: string; label: string; value: string };
export type SecurityDetailGroup = { title: string; fields: (ReferenceField & { eligibility: boolean })[] };

export function securityDetailGroups(sections: readonly { key: string; title: string; fields: readonly ReferenceField[] }[]) {
  const groups = { security: [] as SecurityDetailGroup[], settlement: [] as SecurityDetailGroup[] };
  const constraints = new Set(["min_piece", "min_increment", "quantity_type"]);
  const settlementFields = new Set(["bridge_cbl", "external_cbf", "specialised_depositary", "clearing_system", "internal_settlement_eligibility", "bridge_settlement_eligibility", "local_market_receive_eligibility", "local_market_deliver_eligibility"]);
  for (const section of sections) {
    for (const field of section.fields) {
      if (!hasReferenceValue(field.value)) continue;
      const key = field.path.split(".").at(-1) ?? "";
      const eligibility = key === "bridge_cbl" || key.endsWith("settlement_eligibility") || key.endsWith("receive_eligibility") || key.endsWith("deliver_eligibility");
      const settlement = constraints.has(key) || settlementFields.has(key) || /settlement|trading_constraints/i.test(section.key);
      const title = settlement ? constraints.has(key) ? "Trading constraints" : eligibility ? "Settlement eligibility" : section.key === "euroclear" ? "Settlement information" : section.title : section.key === "basic" ? "" : section.title;
      const target = settlement ? groups.settlement : groups.security;
      let group = target.find(group => group.title === title);
      if (!group) { group = { title, fields: [] }; target.push(group); }
      let value = field.value;
      if (key === "min_piece" || key === "min_increment") value = referenceQuantity(value);
      if (key === "quantity_type" && value === "FAMT") value = "Face amount";
      if (key === "maximum_withholding_tax_rate" && Number.isFinite(Number(value)) && !value.endsWith("%")) value = `${referenceQuantity(value)}%`;
      if (eligibility) {
        const availability = referenceEligibility(value);
        if (availability !== "Not provided") value = availability;
      }
      group.fields.push({ ...field, value, eligibility });
    }
  }
  return groups;
}
