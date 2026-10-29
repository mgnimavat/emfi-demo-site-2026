export const settlement = {
  title: "Settlement & Custody",
  heroLines: ["Settlement &", "Custody"],
  heroPhrases: ["From trade to settlement.", "Clear custody. Clear view.", "One connected relationship."],

  eyebrow: "Services / Settlement & Custody",
  headline: "The infrastructure\nbehind the transaction.",
  body: "What happens after the investment decision. Securities settlement, custody, asset servicing, cash movement where appropriate, and operational visibility — through institutional depository relationships, not a single logo.",
  entity:
    "The relevant legal entity for settlement and custody is EMFI Capital Limited, authorised and regulated by the FCA.",
  entityCta: "See regulated entities",
  badge: "Institutional depository relationships",
  diffEyebrow: "The flow",
  diffTitle: "Trade → EMFI → Settlement → Depository / Custody",
  diffBody:
    "EMFI sits between the client instruction and the underlying infrastructure. Euroclear is an important part of that infrastructure. It is not the entire custody proposition.",
  chain: [
    ["TRADE", "Investment decision"],
    ["EMFI", "Operating relationship"],
    ["SETTLEMENT", "Matching / confirmation"],
    ["DEPOSITORY", "Custody / asset records"],
  ] as const,
  visEyebrow: "Visibility",
  visTitle: "Operational visibility after the trade.",
  visBody:
    "Status that reflects the underlying settlement infrastructure — not a delayed end-of-day report dressed as a product.",
  assetEyebrow: "Asset servicing",
  assetTitle: "Automation where it works. People where it matters.",
  servicing: [
    ["AUTOMATED", ["Income events", "Corporate actions", "Standard elections"]],
    ["HUMAN-SUPPORTED", ["Complex elections", "Exceptions", "Deadline management"]],
  ] as const,
  demoEyebrow: "Interactive demonstration",
  demoTitle: "Settlement eligibility",
  demoBody:
    "Generic settlement information for a selected security: eligibility, depository and route. Not every security is eligible for every route. This is a demonstration, not a client transaction interface.",
  workstationEyebrow: "Explore the platform",
  workstationTitle: "What working with EMFI feels like.",
  workstationBody:
    "An interactive demonstration of the EMFI workstation environment. Demonstration data only. This is not live client access.",
  workstationTabs: [
    "Research",
    "Orders",
    "Positions",
    "Settlement",
    "Cash",
    "Reporting",
  ] as const,
  roleEyebrow: "The right role for your institution",
  roleTitle: "Primary relationship or independent second rail.",
  roles: [
    [
      "FOR SMALLER INSTITUTIONS",
      "Institutional infrastructure should not require institutional minimums. EMFI’s architecture is commercially accessible.",
      "Discuss a primary relationship",
    ],
    [
      "FOR LARGER INSTITUTIONS",
      "No single global custodian should be the only route to the market. EMFI works as an independent second rail.",
      "Discuss a second rail",
    ],
  ] as const,
  connectedEyebrow: "The connected chain",
  connectedTitle: "One operating relationship.",
  connected: ["Research", "Execution", "Settlement", "Custody", "Asset servicing"],
  capabilities: [
    "DVP settlement",
    "Multi-currency cash",
    "Income processing",
    "Corporate actions",
    "Reconciliation",
    "Portfolio reporting",
    "Fund infrastructure (Allfunds)",
  ],
};
