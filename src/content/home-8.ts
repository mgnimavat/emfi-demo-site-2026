export const home8 = {
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
  contactCta: {
    title: "What Do You Need Access To?",
    body: "From research and execution to settlement, custody and asset management, let's discuss the right approach for your requirements.",
    action: "Discuss your requirement",
  },
  responsive: [
    {
      title: "Less Complexity",
      titleLead: "Less",
      titleRest: "Complexity",
      body: "Fewer parties sit between the instruction and the depository. The route stays short, so the work does not pass through a chain of agents before it reaches the relevant market infrastructure.",
    },
    {
      title: "Less Expense",
      titleLead: "Less",
      titleRest: "Expense",
      body: "Each additional intermediary adds process, delay and expense. A shorter chain removes duplicated steps and the fees that sit between the client instruction and settlement.",
    },
    {
      title: "Less Exposure",
      titleLead: "Less",
      titleRest: "Exposure",
      body: "A shorter route means fewer handovers. Each extra party in the chain adds operational, timing and reconciliation risk. Cutting those steps reduces that exposure.",
    },
  ] as const,
};
