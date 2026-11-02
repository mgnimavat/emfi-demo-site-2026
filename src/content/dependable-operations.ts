export const dependableOperations = {
  title: "Dependable Operations",
  description:
    "Regulation, governance, audit and established professional relationships provide the framework within which EMFI operates.",
  headline: "Dependable\nOperations",
  phrases: ["control", "precision", "accountability"],
  fixed: "Built on",
  regulation: {
    title: "Regulated. Structured. Accountable.",
    lead: "EMFI operates through specialist legal entities, each authorised or licensed for its respective activities.",
    paragraphs: [
      "The regulatory status of each entity, rather than the group name alone, defines the services it may provide.",
      "The entities below are linked to their public registers for independent verification.",
    ],
    entities: [
      {
        region: "United Kingdom / FCA",
        name: "EMFI Securities Limited",
        detail: "Reference 763979. Authorised and regulated by the Financial Conduct Authority.",
        href: "https://register.fca.org.uk/s/firm?id=001b000003YCzJGAA1",
      },
      {
        region: "United Kingdom / FCA",
        name: "EMFI Capital Limited",
        detail: "Reference 822389. Authorised and regulated by the Financial Conduct Authority.",
        href: "https://register.fca.org.uk/s/firm?id=0010X00004H6h4dQAB",
      },
      {
        region: "DIFC / DFSA",
        name: "EMFI Capital (DIFC) Limited",
        detail: "Reference F011663. Endorsed for holding or controlling client assets.",
        href: "https://www.dfsa.ae/public-register/firms/emfi-capital-difc-limited",
      },
    ],
  },
  oversight: {
    title: "Boring, by design.",
    lead: "Controls. Reconciliations. Audit trails. Defined responsibilities.",
    paragraphs: [
      "The things that matter most are rarely the things that make the best marketing.",
      "Relevant entities and activities are subject to independent external audit.",
    ],
  },
  disclosure: {
    title: "Regulatory information",
    paragraphs: [
      "The permissions described apply to the named legal entities and the activities each is authorised to conduct.",
      "Third-party names identify specific relationships. Their inclusion does not imply endorsement of EMFI or guarantee the performance of its services.",
      "Fund appointments and audit arrangements apply to the relevant legal entity or portfolio.",
    ],
    action: { label: "Regulatory disclosures", href: "https://emfi.uk/english/policydocuments" },
  },
} as const;
