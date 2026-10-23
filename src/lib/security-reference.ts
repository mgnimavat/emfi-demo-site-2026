export type SecurityReferenceField = { path: string; label: string; value: string };
export type SecurityReferenceSection = { key: string; title: string; fields: SecurityReferenceField[] };

const privateFields = new Set(["key", "xapikey", "apikey", "apitoken", "accesstoken", "refreshtoken", "authorization", "password", "secret", "clientsecret", "credentials", "cookie", "setcookie"]);
const labels: Record<string, string> = {
  isin: "ISIN", security_name: "Security name", common_code: "Common Code", cfi_code: "CFI code", min_piece: "Minimum tradable amount", min_increment: "Multiple tradable amount", bridge_cbl: "Bridge settlement eligibility", external_cbf: "External CBF", specialised_depositary: "Specialised depositary", maximum_withholding_tax_rate: "Maximum withholding tax rate",
};
export function referenceFieldLabel(key: string): string {
  if (labels[key]) return labels[key];
  const words = key.replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/[_-]+/g, " ").trim();
  return words ? (words[0].toUpperCase() + words.slice(1)).replace(/\b(isin|cfi|cbl|cbf|figi|ric|usd|eur|gbp|lei)\b/gi, word => word.toUpperCase()) : "Value";
}

/** Keep the security data, not credentials or the API's transport envelope. */
export function collectSecurityReferenceSections(data: Record<string, unknown>): SecurityReferenceSection[] {
  const sections: SecurityReferenceSection[] = [];
  const seen = new WeakSet<object>();
  function collect(value: unknown, path: string[], labelPath: string[], fields: SecurityReferenceField[]) {
    if (value == null) return;
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      const text = String(value).trim();
      if (!text || text.toLowerCase() === "not provided" || (typeof value === "number" && !Number.isFinite(value))) return;
      fields.push({ path: path.join("."), label: labelPath.map(referenceFieldLabel).join(" · "), value: text });
      return;
    }
    if (typeof value !== "object" || seen.has(value)) return;
    seen.add(value);
    for (const [key, child] of Object.entries(value)) {
      if (privateFields.has(key.replace(/[^a-z0-9]/gi, "").toLowerCase())) continue;
      collect(child, [...path, key], [...labelPath, Array.isArray(value) ? String(Number(key) + 1) : key], fields);
    }
    seen.delete(value);
  }
  const additional: SecurityReferenceField[] = [];
  for (const [key, value] of Object.entries(data)) {
    if (privateFields.has(key.replace(/[^a-z0-9]/gi, "").toLowerCase())) continue;
    if (value && typeof value === "object") {
      const fields: SecurityReferenceField[] = [];
      collect(value, [key], [], fields);
      if (fields.length) sections.push({ key, title: referenceFieldLabel(key), fields });
    } else collect(value, [key], [key], additional);
  }
  if (additional.length) sections.push({ key: "additional", title: "Additional information", fields: additional });
  return sections;
}

export type SecurityReferenceData = {
  sourceName: string;
  sections: SecurityReferenceSection[];
  basic: { isin: string; securityName: string; market: string; minPiece: string; minIncrement: string };
  euroclear: { commonCode: string; instrument: string; cfiCode: string; withholdingTax: string; quantityType: string; bridgeCbl: string; externalCbf: string; depositary: string } | null;
};

const object = (value: unknown): Record<string, unknown> => value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
const field = (value: unknown) => typeof value === "string" ? value.trim() : typeof value === "number" && Number.isFinite(value) ? String(value) : "";
export const validSecurityIsin = (value: unknown): value is string => typeof value === "string" && /^[A-Z]{2}[A-Z0-9]{9}\d$/i.test(value.trim());

export function normalizeSecurityReference(payload: unknown): SecurityReferenceData | null {
  const response = object(payload);
  if (response.status === 0 || response.status === "0") return null;
  if (response.status !== 1 && response.status !== "1") throw new Error("Invalid security response");
  const data = object(response.data);
  const basic = object(data.basic);
  const sections = collectSecurityReferenceSections(data);
  if (!sections.length) throw new Error("Invalid security reference");
  const euroclear = object(data.euroclear);
  return {
    sourceName: field(response.source_name),
    sections,
    basic: { isin: field(basic.isin).toUpperCase(), securityName: field(basic.security_name), market: field(basic.market), minPiece: field(basic.min_piece), minIncrement: field(basic.min_increment) },
    euroclear: Object.keys(euroclear).length ? { commonCode: field(euroclear.common_code), instrument: field(euroclear.instrument), cfiCode: field(euroclear.cfi_code), withholdingTax: field(euroclear.maximum_withholding_tax_rate), quantityType: field(euroclear.quantity_type), bridgeCbl: field(euroclear.bridge_cbl), externalCbf: field(euroclear.external_cbf), depositary: field(euroclear.specialised_depositary) } : null,
  };
}

export async function findSecurityReference(isin: string, apiKey: string, signal?: AbortSignal) {
  if (!validSecurityIsin(isin) || !apiKey) throw new Error("Invalid security request");
  const response = await fetch("https://admin-uat.emfi.uk/api/find-securities", {
    method: "POST", headers: { Accept: "application/json", "Content-Type": "application/json", "X-Api-Key": apiKey },
    body: JSON.stringify({ isin: isin.trim().toUpperCase() }), cache: "no-store",
    signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(15000)]) : AbortSignal.timeout(15000),
  });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error("Security lookup unavailable");
  return normalizeSecurityReference(await response.json());
}
