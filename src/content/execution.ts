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
    body: "Search EMFI Intelligence reports by keyword or country, and filter results by report type or publication date.",
    label: "EMFI Intelligence publications",
    notice: "Publication and chart snapshot from EMFI Intelligence, imported 21 October 2026.",
    records: intelligencePublications,
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
