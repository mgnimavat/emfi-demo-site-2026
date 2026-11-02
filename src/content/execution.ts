import { intelligencePublications } from "./intelligence-publications";

export const researchReportTypes = ["Daily Notes", "Country Report", "Large Report"] as const;
export const researchDerivedTypes = ["Country Report", "Strategy Viewpoint", "Trade Idea", "Quantitative Insight", "Special Report", "Flash Note", "EMFI Monthly Review"] as const;

export type ExecutionResearchChart = {
  title: string;
  kind: "price" | "world";
  points?: readonly { date: string; value: number }[];
  benchmarkPoints?: readonly { date: string; value: number }[];
  benchmarkTitle?: string;
  countries?: readonly { id: string; name: string; value: number }[];
};

export type ExecutionResearchRecord = {
  id: string;
  title: string;
  country: string;
  reportType: string;
  publicationType?: typeof researchReportTypes[number];
  publishedAt: string;
  topics: readonly string[];
  paragraphs: readonly string[];
  source: string;
  sourceUrl?: string;
  chartSource?: "other" | "special";
  chart?: ExecutionResearchChart;
};

export const execution = {
  title: "Research & Execution",
  description: "Research and execution for professional clients across relevant global markets and securities, with specialist market expertise and direct execution support.",
  eyebrow: "Research & Execution",
  headline: "Research &\nExecution",
  heroTitle: {
    prefix: 'Beyond the',
    words: ['headlines', 'consensus', 'obvious'],
  },
  body: "From Insight to Action. From Decision to Execution. Across Markets.",
  heroPhrases: ["From Insight to Action.", "From Decision to Execution.", "Across Markets."],
  capabilities: [
    {
      id: "research-capability",
      eyebrow: "Research",
      title: "Know the Market.",
      body: "Research that helps professional clients understand markets, securities and investment opportunities.",
    },
    {
      id: "execution-capability",
      eyebrow: "Execution",
      title: "Make the Trade.",
      body: "Professional execution that helps clients put investment decisions into action across relevant markets and securities.",
    },
  ],
  workflow: {
    eyebrow: "Why research and execution belong together",
    title: "From View to Action.",
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
    title: "Find the Insight.",
    body: "Search EMFI Intelligence reports and filter by date and country. Open a report to see its chart and analysis.",
    introduction: {
      eyebrow: '01 / Research',
      title: 'Less noise.',
      accent: 'More signal.',
      lead: 'Research should help you see beyond the consensus.',
      paragraphs: [
        'Our research combines economic analysis, country-level intelligence, quantitative models and market insight to develop independent views on the markets we cover.',
        'From sovereign fundamentals and debt sustainability to political developments and relative value, we focus on the factors that drive investment decisions.',
      ],
    },
    label: "EMFI Intelligence Reports",
    notice: "Publication and chart snapshot from EMFI Intelligence, imported 21 October 2026.",
    records: intelligencePublications,
  },
  workstation: {
    title: 'Insight into',
    accent: 'execution.',
    lead: 'Understanding the opportunity is only the beginning.',
    paragraphs: [
      'Our sales and trading team works directly with clients and counterparties to source liquidity, assess pricing and execute transactions.',
      'We combine market knowledge with specialist execution capabilities, focusing on the details that matter: price, liquidity, timing and settlement.',
    ],
    name: 'The EMFI Workstation',
    description: 'A dedicated execution interface connecting market information, trading activity and transaction workflows.',
    visualLabel: 'EMFI Workstation order entry interface',
  },
  disclosures: {
    title: 'Regulatory & research information',
    entity: 'EMFI Securities Limited',
    regulation: 'is authorised and regulated by the Financial Conduct Authority (FCA), United Kingdom. Reference Number: 763979.',
    paragraphs: [
      'Execution services are provided to eligible professional clients, subject to applicable regulatory permissions, client classification and execution arrangements.',
      'Research is provided for informational purposes and does not constitute a personal recommendation or an offer to buy or sell financial instruments.',
    ],
    action: {
      label: 'Execution Policy & Research Disclosures',
      href: 'https://emfi.uk/english/policydocuments',
    },
  },
  trade: {
    title: "Put Insight Into Action.",
    body: "Explore how a selected research item can lead to a trade enquiry, with the relevant context carried forward.",
  },
  contact: {
    eyebrow: "Next step",
    title: "Discuss a market or trade.",
    body: "Tell us what you are trying to access, execute or research.",
    action: "Discuss a market or trade",
  },
};
