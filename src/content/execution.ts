export type ExecutionResearchRecord = {
  id: string;
  title: string;
  country: string;
  reportType: string;
  publishedAt: string;
  topics: readonly string[];
  paragraphs: readonly string[];
  source: string;
};

export const execution = {
  title: "Research & Execution",
  description: "Research and execution for professional clients across relevant global markets and securities, with specialist market expertise and direct execution support.",
  eyebrow: "Research & Execution",
  headline: "RESEARCH &\nEXECUTION",
  body: "From Insight to Action. From Decision to Execution. Across Markets.",
  heroPhrases: ["From Insight to Action.", "From Decision to Execution.", "Across Markets."],
  capabilities: [
    {
      id: "research-capability",
      eyebrow: "Research",
      title: "KNOW THE MARKET.",
      body: "Research that helps professional clients understand markets, securities and investment opportunities.",
    },
    {
      id: "execution-capability",
      eyebrow: "Execution",
      title: "MAKE THE TRADE.",
      body: "Professional execution across relevant markets and securities.",
    },
  ],
  workflow: {
    eyebrow: "Why research and execution belong together",
    title: "FROM VIEW TO ACTION.",
    body: "One connected process, from investment insight to trade execution.",
    label: "Execution workflow",
    steps: [
      { label: "Research", detail: "The view" },
      { label: "Requirement", detail: "What to access" },
      { label: "Pricing", detail: "Price discovery" },
      { label: "Execution", detail: "The trade" },
      { label: "Confirmation", detail: "Agreed terms" },
      { label: "Settlement", detail: "Post-trade" },
    ],
  },
  research: {
    eyebrow: "Direct evidence",
    title: "FIND THE INSIGHT.",
    body: "Search approved research by keyword, issuer, market or publication date.",
    label: "Screenshot-sourced research preview",
    notice: "These records were transcribed from the supplied EMFI screenshots. This is not a live research feed. An approved research database or API is still pending.",
    records: [
      {
        id: "venezuela-imf-discount",
        title: "The IMF Discount",
        country: "Venezuela",
        reportType: "Fixed Income",
        publishedAt: "2026-09-28",
        topics: ["Country Report", "Quantitative Insight"],
        paragraphs: [
          "Bitácora Económica reported that the Rodríguez administration has decided to delay the debt restructuring and that the IMF might become involved in producing the DSA framework.",
          "We put numbers on our view that IMF involvement would keep stringent sustainability constraints, use a far more conservative oil production path and extend the restructuring timeline.",
          "The IMF scenario cuts the NPV/Face of the restructuring package by 18.8 pts to 37.9%, against 56.7% without IMF involvement.",
        ],
        source: "Supplied EMFI research screenshots: report selector and readable report excerpt. Publication date is the date displayed in the screenshot; this is historical source text, not a current recommendation.",
      },
      {
        id: "honduras-austerity",
        title: "Asfura’s Austerity Agenda Takes Shape",
        country: "Honduras",
        reportType: "Economics",
        publishedAt: "2026-09-27",
        topics: [],
        paragraphs: [],
        source: "Supplied EMFI report-selector screenshot. Only the title, country, category and date were visible. Full report content has not been provided.",
      },
      {
        id: "egypt-external-accounts",
        title: "The Longer War On External Accounts",
        country: "Egypt",
        reportType: "Economics",
        publishedAt: "2026-09-24",
        topics: [],
        paragraphs: [],
        source: "Supplied EMFI report-selector screenshot. Only the title, country, category and date were visible. Full report content has not been provided.",
      },
      {
        id: "jamaica-debt",
        title: "Raising Cash, Not Reducing Debt",
        country: "Jamaica",
        reportType: "Fixed Income",
        publishedAt: "2026-09-23",
        topics: [],
        paragraphs: [],
        source: "Supplied EMFI report-selector screenshot. Only the title, country, category and date were visible. Full report content has not been provided.",
      },
    ] satisfies ExecutionResearchRecord[],
  },
  trade: {
    title: "PUT INSIGHT INTO ACTION.",
    body: "Explore how a selected research item can lead to a trade enquiry, with the relevant context carried forward.",
  },
  contact: {
    eyebrow: "Next step",
    title: "Discuss a market or trade.",
    body: "Tell us what you are trying to access, execute or research.",
    action: "Discuss a market or trade",
  },
};
