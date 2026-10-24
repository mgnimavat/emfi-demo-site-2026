export const home9 = {
  title: "EMFI — Settle For Less.",
  description:
    "Institutional infrastructure. Without the institutional layers. Research, execution, settlement, custody and asset management for professional clients.",
  hero: {
    eyebrow: "Investment Infrastructure for Professional Clients",
    pillars: [
      {
        index: "01",
        label: "Cost",
        title: "Less Cost.",
        body: "Fewer intermediary charges and less duplicated processing, where the structure allows.",
      },
      {
        index: "02",
        label: "Complexity",
        title: "Less Complexity.",
        body: "Fewer parties to coordinate. Clearer workflows, fewer handovers and more direct accountability.",
      },
      {
        index: "03",
        label: "Exposure",
        title: "Less Exposure.",
        body: "Fewer third-party dependencies in the custody chain can mean fewer points of failure affecting access to or recovery of assets.",
      },
    ],
  },
  navLinks: [
    { label: "Research & Execution", href: "/services/research-execution" },
    { label: "Settlement & Custody", href: "/services/settlement-custody" },
    { label: "Wealth & Asset Management", href: "/services/wealth-asset-management" },
  ] as const,
  utilityLinks: [
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ] as const,
  direct: {
    title: "More Direct.",
    lead: "Closer to market infrastructure.",
    body: "Fewer unnecessary layers between your requirement and the infrastructure behind the transaction.",
    cardTitle: "The same instruction, through EMFI",
    previous: "Previously 4",
    handoversLabel: "Handovers",
    handovers: "2",
    points: ["Fewer handovers.", "Less complexity.", "Less operational friction."] as const,
    note: "Illustrative operating route. Actual settlement and custody arrangements depend on the market, instrument and client.",
  },
  responsive: {
    title: "More Responsive.",
    lead: "Solutions when the standard route falls short.",
    body: "EMFI combines a real-time operating system with experienced people to find workable solutions for complex requirements.",
    panelEyebrow: "Real-time system",
    panelTitle: "EMFI Operations",
    live: "Live",
    rows: [
      { id: "EM-2041", title: "FX execution", status: "Checked", highlight: false },
      { id: "EM-2042", title: "Bond settlement", status: "Checked", highlight: false },
      { id: "EM-2043", title: "Cross-border settlement", status: "Solution found", highlight: true },
      { id: "EM-2044", title: "Custody transfer", status: "Completed", highlight: false },
    ] as const,
  },
  accountable: {
    title: "More Accountable.",
    lead: "One relationship, from instruction to outcome.",
    body: "You know who owns the relationship and who coordinates the work. Responsibility stays with one team instead of being passed from desk to desk.",
    requestLabel: "Request",
    request: "Settlement requirement",
    ownerLabel: "Owner",
    owner: "EMFI Relationship Owner",
  },
  discuss: {
    eyebrow: "Start a conversation",
    title: "Let's discuss\nyour requirements.",
    body: "A more direct route to execution, settlement, custody or investment management starts with understanding what you need.",
    action: "Discuss your requirements",
  },
};
