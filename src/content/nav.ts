export const servicePages = [
  { label: "Research & Execution", href: "/services/research-execution" },
  { label: "Settlement & Custody", href: "/services/settlement-custody" },
  { label: "Wealth & Asset Management", href: "/services/wealth-asset-management" },
] as const;

export const navLinks = [
  { label: "Services", href: "/services" },
  { label: "Why EMFI", href: "/trust" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const footer = {
  tagline: "Institutional infrastructure. Without the institutional layers.",
  entities:
    "EMFI Securities Limited · EMFI Capital Limited · EMFI Capital (DIFC) Limited",
  servicesHeading: "Services",
  companyHeading: "Company",
  locationsHeading: "Locations",
  services: servicePages,
  company: [
    { label: "Why EMFI", href: "/why-emfi" },
    { label: "Trust", href: "/trust" },
    { label: "About EMFI", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  offices: [
    {
      city: "London",
      region: "United Kingdom",
      entity: "UK operations and regulated entities",
      lines: [
        "25-26 Dering Street, Third Floor",
        "Mayfair, London W1S 1AW",
        "United Kingdom",
      ],
      email: "contact@emfi.uk",
      note: "Authorised and regulated by the FCA",
    },
    {
      city: "Dubai",
      region: "DIFC",
      entity: "EMFI Capital (DIFC) Limited",
      lines: [
        "IH-00-01-02-OF-01, Level 2",
        "Innovation One, DIFC",
        "Dubai, UAE",
      ],
      email: "contact@emfi.ae",
      note: "Regulated by the DFSA · F011663",
    },
  ],
  cayman: {
    city: "Cayman Islands",
    region: "",
    entity: "EMFI Fund",
    note: "Enquiries relating to EMFI Fund and Cayman-related matters.",
    email: "contact@emfi.uk",
  },
  legal:
    "© 2026 EMFI. All rights reserved. Intended for Professional Clients and Eligible Counterparties only. Not suitable for Retail Clients or US Persons.",
  legalDetail:
    "UK entities authorised and regulated by the Financial Conduct Authority (FCA). EMFI Capital (DIFC) Limited regulated by the Dubai Financial Services Authority (DFSA), Firm Reference F011663 · Company Number 8775. Exact legal names and regulatory statuses are draft pending verification against public registers.",
};
