export const home2 = {
  title: "EMFI: Switched On",
  hero: {
    eyebrow: "EMFI: Switched On",
    headline: "Client",
    headlineAccent: "EMFI",
    headlineAccentWords: ["Euroclear", "Allfunds", "NatWest", "Santander"] as const,
    body: "Direct. EMFI connects clients into institutional infrastructure through a single operating relationship.",
    primaryCta: "Discuss your requirements",
    secondaryCta: "Explore services",
    mockupLabel: "Interactive demonstration",
    mockupStatus: "Switched on",
    entities: [
      "EMFI Group Limited",
      "EMFI Securities Limited",
      "EMFI Capital Limited",
      "EMFI Capital (DIFC) Limited",
    ] as const,
  },
  chainEyebrow: "How the relationship works",
  chainTitle: "One Connection.\nDirect Access.",
  chainBody:
    "A single relationship with EMFI gives professional clients direct access to custody, settlement, and banking rails - without managing each one separately.",
  chainHubCaption: "One partner",
  chainNodes: [
    { label: "Client", sub: "Instructions / portfolio" },
    { label: "EMFI", sub: "One operating relationship" },
  ] as const,
  chainInfra: [
    { name: "Euroclear", role: "Securities / depository" },
    { name: "Allfunds", role: "Fund infrastructure" },
    { name: "NatWest", role: "Banking / cash" },
    { name: "Santander", role: "Banking / cash" },
  ] as const,
  infraLogosEyebrow: "Institutional infrastructure",
  infraNote:
    "These are the institutional relationships and infrastructure through which EMFI operates. Descriptors are draft pending legal and operational review.",
  servicesEyebrow: "Services",
  servicesTitle: "Infrastructure\nfor the whole\nworkflow.",
  services: [
    [
      "Research & Execution",
      "Research that supports the investment decision. Execution that reaches the relevant markets and securities.",
      "/services/research-execution",
    ],
    [
      "Settlement & Custody",
      "The infrastructure behind the transaction — settlement, custody, asset servicing and operational visibility.",
      "/services/settlement-custody",
    ],
    [
      "Wealth & Asset Management",
      "MiFID wealth management, AIFMD asset management, and institutional rails for professional counterparties.",
      "/services/wealth-asset-management",
    ],
  ] as const,
  servicesCta: "Explore this service",
  demoEyebrow: "Switched on",
  demoTitle: "See how EMFI works.",
  demoBody:
    "Live components on this site are interactive demonstrations — not client access, and not an offer to trade.",
  demos: [
    {
      label: "Research",
      title: "Explore EMFI Research",
      href: "/services/research-execution#research-demo",
    },
    {
      label: "Market connectivity",
      title: "Security lookup",
      href: "/services/research-execution#execution-demo",
    },
    {
      label: "Infrastructure",
      title: "Settlement route",
      href: "/services/settlement-custody#settlement-demo",
    },
    {
      label: "Platform",
      title: "Explore the platform",
      href: "/services/settlement-custody#workstation-demo",
    },
  ] as const,
  whyEyebrow: "Why EMFI",
  whyTitle: "Direct. Responsive. Accountable.",
  whyBody:
    "Why an institutional client would\nchoose EMFI rather than a conventional\nbank, broker, custodian or platform.",
  why: [
    ["Direct", "Fewer layers. A more direct route between client requirements and market infrastructure."],
    ["Responsive", "Technology where it helps, human judgement where it matters, flexibility when the standard route is wrong."],
    ["Accountable", "Clear ownership, regulated entities, controlled processes and independent oversight."],
  ] as const,
  whyCta: "Why EMFI",
  whyTabs: [
    {
      label: "Authorised.",
      eyebrow: "Public Registers",
      body: "EMFI operates through authorised and regulated entities across the relevant jurisdictions.",
      cta: "See the evidence",
      href: "/trust",
      items: [
        {
          name: "EMFI Securities Limited",
          detail: "Research & execution",
          tag: "FCA · UK",
        },
        {
          name: "EMFI Capital Limited",
          detail: "Settlement & custody · wealth & asset management",
          tag: "FCA · UK",
        },
        {
          name: "EMFI Capital (DIFC) Limited",
          detail: "Relevant DIFC-regulated investment services · F011663",
          tag: "DFSA · DIFC",
        },
        {
          name: "EMFI Fund",
          detail: "Current fund structure",
          tag: "CIMA · Cayman",
        },
      ],
      note: {
        label: "Public evidence",
        body: "The evidence sits in the public registers, the applicable regimes, independent audit, and the infrastructure through which client assets move.",
      },
    },
    {
      label: "Regulated.",
      eyebrow: "Applicable Regimes",
      body: "High-level frameworks covering client assets, investment services, prudential requirements and fund management.",
      cta: "See the evidence",
      href: "/trust",
      items: [
        {
          name: "Client Assets Sourcebook",
          detail: "Protection and segregation of relevant client money and custody assets.",
          tag: "CASS",
        },
        {
          name: "Markets in Financial Instruments Directive",
          detail: "The framework governing relevant investment services and conduct.",
          tag: "MiFID",
        },
        {
          name: "Prudential sourcebook for MiFID investment firms",
          detail: "The applicable UK prudential framework for relevant investment firms.",
          tag: "MIFIDPRU",
        },
        {
          name: "Alternative Investment Fund Managers Directive",
          detail: "Applicable to relevant alternative investment fund management activity.",
          tag: "AIFMD",
        },
      ],
      note: {
        label: "Frameworks",
        body: "The regimes that govern how work is done.",
      },
    },
    {
      label: "Auditable.",
      eyebrow: "Independent External Audit",
      body: "Independent firms examine the financials and the controls behind them.",
      cta: "See the evidence",
      href: "/trust",
      items: [
        {
          name: "Baker Tilly",
          detail: "Independent external audit",
          tag: "Audit",
        },
        {
          name: "Buzzacott",
          detail: "Independent external audit",
          tag: "Audit",
        },
        {
          name: "BDO",
          detail: "Independent external audit",
          tag: "Audit",
        },
        {
          name: "Euroclear · institutional rails",
          detail: "Settlement and custody through recognised market infrastructure.",
          tag: "Settlement",
        },
      ],
      note: {
        label: "Records",
        body: "Institutional infrastructure with reconciled records, reporting and an audit trail available to clients on request.",
      },
    },
  ],
  voiceEyebrow: "Testimonials",
  voiceTitle: "Trusted across the investment ecosystem.",
  quotes: [
    {
      text: "Research and execution that stay connected to the market, not to a product brochure.",
      name: "Faisal Mian",
      firm: "Seaport",
      lens: "Markets",
    },
    {
      text: "More control over the operating relationship — without being forced through a standard institutional product.",
      name: "Theodore King",
      firm: "Lapa Investment Management",
      lens: "Investment",
    },
    {
      text: "Technology and connectivity that sit inside the infrastructure, not on top of it.",
      name: "Ben Sobel",
      firm: "Trumid",
      lens: "Infrastructure / technology",
    },
  ],
  trustEyebrow: "Trust",
  trustTitle: "Authorised. Regulated. Auditable.",
  trustBody:
    "Evidence, not adjectives. Regulators, client-asset rules, independent audit and institutional infrastructure.",
  trustCta: "See the evidence",
  trustSignals: ["FCA", "DFSA", "CIMA", "CASS", "MiFID", "AIFMD"] as const,
  presenceEyebrow: "Geography",
  presenceTitle: "Cayman. London. Dubai.",
  presenceBody:
    "A genuine part of EMFI’s regulatory and corporate story. Cayman is a fund structure.",
  locations: [
    ["Cayman", "EMFI Fund", "Fund structure / Cayman-related matters. Not an EMFI office."],
    ["London", "UK operations", "UK operations and FCA-regulated entities."],
    ["Dubai", "DIFC", "EMFI Capital (DIFC) Limited — DFSA-regulated operations."],
  ] as const,
  anniversaryEyebrow: "Ten years / 2016—2026",
  anniversaryTitle: "A decade of building\ndirect access.",
  anniversaryBody:
    "Since 2016, EMFI has developed an institutional investment platform connecting clients with markets, execution and the infrastructure behind the transaction.",
  anniversaryCta: "About",
  anniversaryBadge: "EMFI 10",
  anniversaryBadgeSub: "2016—2026",
  milestones: [
    ["2016", "Establishment", "EMFI Securities incorporated. First institutional trading relationships."],
    ["2017", "Authorised", "FCA authorisation. A regulated foundation for the operating model."],
    ["2018", "Settlement & custody", "Expansion from execution into custody infrastructure."],
    ["2020", "Depository access", "Direct participation in institutional settlement infrastructure."],
    ["2022", "Technology", "Proprietary platform built around the client workflow."],
    ["2025", "DIFC", "Dubai presence. DFSA-regulated operations."],
    ["2026", "Ten years", "A decade of building direct access."],
  ] as [string, string, string][],
  timeline: [
    ["2016", "Established"],
    ["2018", "Custody"],
    ["2020", "Infrastructure"],
    ["2022", "Platform"],
    ["2025", "DIFC"],
    ["2026", "Ten years"],
  ] as const,
  ctaTitle: "Discuss your\nrequirements.",
  ctaBody:
    "Tell us where the operating model needs a more direct connection. Our team can provide further information on EMFI’s structure, regulatory framework and operating model.",
  ctaButton: "Contact EMFI",
  ctaLocations: [
    {
      label: "London",
      address: "25-26 Dering Street, Third Floor, Mayfair, London W1S 1AW",
      email: "contact@emfi.uk",
    },
    {
      label: "Dubai · DIFC",
      address: "IH-00-01-02-OF-01, Level 2, Innovation One, DIFC, Dubai",
      email: "contact@emfi.ae",
    },
  ],
};
