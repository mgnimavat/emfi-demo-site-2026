import assert from "node:assert/strict";
import { test } from "node:test";
import { findSecurityReference, normalizeSecurityReference, validSecurityIsin } from "../src/lib/security-reference.ts";
const payload = { status: 1, source_name: "Euroclear", data: { basic: { isin: "AED01283C235", security_name: "UAE FED GOV SUKUK PROGRAMME LT", market: "DAE", min_piece: "0.00000000", min_increment: "100000.00000000" }, euroclear: { common_code: "267160490", instrument: "BOND", cfi_code: "DAFNFR", maximum_withholding_tax_rate: "0.00000000", quantity_type: "FAMT", bridge_cbl: "NO", external_cbf: "NO", specialised_depositary: "CENTRAL BANK OF THE UA EMIRATES" } } };

test("normalizes returned reference fields without replacing returned ISIN", () => {
  const result = normalizeSecurityReference(payload);
  assert.equal(result.basic.isin, "AED01283C235");
  assert.equal(result.basic.minPiece, "0.00000000");
  assert.equal(result.basic.minIncrement, "100000.00000000");
  assert.equal(result.euroclear.commonCode, "267160490");
  assert.equal(result.euroclear.depositary, "CENTRAL BANK OF THE UA EMIRATES");
  assert.equal(normalizeSecurityReference({ status: 0, message: "Not found" }), null);
  assert.equal(normalizeSecurityReference({ ...payload, data: { basic: payload.data.basic } }).euroclear, null);
  assert.throws(() => normalizeSecurityReference({ status: 1, data: {} }));
  assert.throws(() => normalizeSecurityReference({ error: "Unavailable" }));
});

test("sends the API key only in the authentication header and preserves failure handling", async context => {
  const calls = [];
  context.mock.method(globalThis, "fetch", async (url, options) => { calls.push({ url, options }); return Response.json(payload); });
  const result = await findSecurityReference(" us24702raj05 ", "test-key");
  const call = calls[0];
  assert.equal(call.url, "https://admin-uat.emfi.uk/api/find-securities");
  assert.equal(call.options.method, "POST");
  assert.equal(call.options.headers["X-Api-Key"], "test-key");
  assert.deepEqual(JSON.parse(call.options.body), { isin: "US24702RAJ05" });
  assert(!call.options.body.includes("test-key"));
  assert.equal(call.options.cache, "no-store");
  assert.equal(result.basic.isin, payload.data.basic.isin);
  globalThis.fetch.mock.mockImplementation(async () => new Response(null, { status: 404 }));
  assert.equal(await findSecurityReference("US24702RAJ05", "test-key"), null);
  globalThis.fetch.mock.mockImplementation(async () => new Response("Unauthorized", { status: 401 }));
  await assert.rejects(findSecurityReference("US24702RAJ05", "test-key"));
  globalThis.fetch.mock.mockImplementation(async () => new Response("invalid JSON"));
  await assert.rejects(findSecurityReference("US24702RAJ05", "test-key"));
  await assert.rejects(findSecurityReference("invalid", "test-key"));
  await assert.rejects(findSecurityReference("US24702RAJ05", ""));
  assert.equal(validSecurityIsin("US24702RAJ05"), true);
  assert.equal(validSecurityIsin("invalid"), false);
});

test("missing reference values remain distinct from zero amounts and negative eligibility", async () => {
  const { referenceQuantity, referenceEligibility } = await import("../src/lib/security-reference-view.ts");
  assert.equal(referenceQuantity("0.00000000"), "0");
  assert.equal(referenceQuantity("100000.00000000"), "100,000");
  assert.equal(referenceQuantity(""), "");
  assert.equal(referenceQuantity(undefined), "");
  assert.equal(referenceEligibility("NO"), "Not available");
  assert.equal(referenceEligibility("YES"), "Available");
  assert.equal(referenceEligibility("0"), "Not available");
  assert.equal(referenceEligibility(undefined), "Not provided");
  assert.equal(referenceEligibility("unknown"), "Not provided");
});

test("hides missing reference fields while retaining zero and explicit negative flags", async () => {
  const { hasReferenceValue } = await import("../src/lib/security-reference-view.ts");
  for (const value of [undefined, "", "  ", "Not provided", " not PROVIDED "]) assert.equal(hasReferenceValue(value), false);
  for (const value of ["0", "0.00000000", "NO", "Not available", "BOND"]) assert.equal(hasReferenceValue(value), true);
});

test("retains every non-empty security field, nested section and array without exposing credentials", () => {
  const result = normalizeSecurityReference({ ...payload, data: {
    ...payload.data,
    basic: { ...payload.data.basic, nominal_currency: "USD", rate: 0, callable: false, missing: null, blank: "  ", absent: "Not provided" },
    additional_reference: { maturity_date: "2030-04-15", creditRating: "BBB", ratings: [{ agency: "Agency", outlook: "Stable" }], aliases: ["Bond A", "Bond B"], api_key: "never-send", credentials: { password: "never-send" }, nested: { access_token: "never-send", supported: true, headers: { "X-Api-Key": "never-send", Key: "never-send" } } },
    outstanding_amount: 0,
    empty_section: {}, empty_list: [], apiKey: "never-send",
  } });
  const fields = result.sections.flatMap(section => section.fields);
  const at = path => fields.find(field => field.path === path);
  assert.equal(at("basic.nominal_currency").value, "USD");
  assert.equal(at("basic.rate").value, "0");
  assert.equal(at("basic.callable").value, "false");
  assert.equal(at("additional_reference.creditRating").label, "Credit Rating");
  assert.equal(at("additional_reference.ratings.0.agency").value, "Agency");
  assert.equal(at("additional_reference.aliases.1").value, "Bond B");
  assert.equal(at("additional_reference.nested.supported").value, "true");
  assert.equal(at("outstanding_amount").value, "0");
  assert(!at("basic.missing")); assert(!at("basic.blank")); assert(!at("basic.absent"));
  assert(!result.sections.some(section => ["empty_section", "empty_list"].includes(section.key)));
  assert(!JSON.stringify(result).includes("never-send"));
});

test("routes every returned field to one details tab, including unknown settlement values", async () => {
  const { securityDetailGroups } = await import("../src/lib/security-reference-view.ts");
  const result = normalizeSecurityReference({ ...payload, data: { ...payload.data,
    future_section: { new_field: "Extra data", flags: [false, 0] },
    settlement: { new_settlement_field: "New settlement value", internal_settlement_eligibility: "PENDING" },
  } });
  const groups = securityDetailGroups(result.sections);
  const shown = [...groups.security, ...groups.settlement].flatMap(group => group.fields);
  assert.equal(shown.length, result.sections.flatMap(section => section.fields).length);
  assert.equal(new Set(shown.map(field => field.path)).size, shown.length);
  assert(groups.security.flatMap(group => group.fields).some(field => field.value === "Extra data"));
  assert(groups.settlement.flatMap(group => group.fields).some(field => field.value === "New settlement value"));
  assert(shown.some(field => field.path.endsWith("internal_settlement_eligibility") && field.value === "PENDING"));
  assert(shown.some(field => field.path === "basic.min_piece" && field.value === "0"));
  assert(shown.some(field => field.path === "future_section.flags.0" && field.value === "false"));
  assert(shown.some(field => field.path === "euroclear.bridge_cbl" && field.value === "Not available"));
});

test("renders a success response containing only new data sections", () => {
  const result = normalizeSecurityReference({ status: 1, data: { alternate_provider: { identifier: "ABC", active: false } } });
  assert.equal(result.sections[0].fields.length, 2);
  assert.equal(result.basic.securityName, "");
});

test("basic-only response keeps trading constraints in Security Details without a Settlement tab", async () => {
  const { securityDetailGroups } = await import("../src/lib/security-reference-view.ts");
  for (const isin of ["USP7807HAV70", "US24702RAJ05"]) {
    const result = normalizeSecurityReference({ status: 1, source_name: "EMFI Database", data: {
      basic: { isin, security_name: "Security from EMFI", market: "Euro", min_piece: 150000, min_increment: 1000, coupon: 7.625 }, euroclear: null,
    } });
    const groups = securityDetailGroups(result.sections);
    assert.equal(groups.settlement.length, 0);
    assert.deepEqual(groups.security.find(group => group.title === "Trading constraints").fields.map(field => field.value), ["150,000", "1,000"]);
    assert.equal(groups.security.flatMap(group => group.fields).length, result.sections.flatMap(section => section.fields).length);
  }
});

test("Euroclear response keeps constraints in Settlement independent of the ISIN", async () => {
  const { securityDetailGroups } = await import("../src/lib/security-reference-view.ts");
  for (const isin of ["AED01089C228", "USP7807HAV70"]) {
    const result = normalizeSecurityReference({ ...payload, data: { ...payload.data, basic: { ...payload.data.basic, isin } } });
    const groups = securityDetailGroups(result.sections);
    assert(groups.settlement.some(group => group.title === "Trading constraints"));
    assert(groups.settlement.some(group => group.title === "Settlement eligibility"));
    assert(!groups.security.some(group => group.title === "Trading constraints"));
  }
});

test("explicit settlement sections remain available for other provider response types", async () => {
  const { securityDetailGroups } = await import("../src/lib/security-reference-view.ts");
  const result = normalizeSecurityReference({ status: 1, data: {
    basic: { isin: "USP7807HAV70", security_name: "Other provider", min_piece: 0 },
    settlement: { clearing_system: "Reported clearing system" },
  } });
  const groups = securityDetailGroups(result.sections);
  assert(groups.settlement.some(group => group.title === "Trading constraints" && group.fields[0].value === "0"));
  assert(groups.settlement.flatMap(group => group.fields).some(field => field.value === "Reported clearing system"));
});
