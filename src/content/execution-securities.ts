// Fixed demonstration records and prices; no connection to a market or trading API.
export const executionSecurities = [
  { symbol: "NVDA", name: "NVIDIA CORP", isin: "US67066G1040", exchange: "NASDAQ", bid: 217.22, ask: 217.24 },
  { symbol: "AAPL", name: "APPLE INC", isin: "US0378331005", exchange: "NASDAQ", bid: 229.90, ask: 229.94 },
  { symbol: "MSFT", name: "MICROSOFT CORP", isin: "US5949181045", exchange: "NASDAQ", bid: 418.10, ask: 418.16 },
] as const;

export const demoExecutionSecurities = [
  { symbol: "XXXX-01", name: "XXXX Equity 01", isin: "XXXX00000001", exchange: "XXXX", bid: 12.34, ask: 12.36 },
  { symbol: "XXXX-02", name: "XXXX Equity 02", isin: "XXXX00000002", exchange: "XXXX", bid: 23.45, ask: 23.47 },
  { symbol: "XXXX-03", name: "XXXX Equity 03", isin: "XXXX00000003", exchange: "XXXX", bid: 34.56, ask: 34.58 },
] as const;

export const workstationSecurities = [
  ...executionSecurities,
  { symbol: 'META', name: 'META PLATFORMS', isin: 'US30303M1027', exchange: 'NASDAQ', bid: 512.28, ask: 512.30 },
  { symbol: 'AMZN', name: 'AMAZON.COM INC', isin: 'US0231351067', exchange: 'NASDAQ', bid: 198.40, ask: 198.44 },
] as const;

export const argentinaPreviewSecurities = [
  { symbol: 'ARGENTINA', name: 'ARGBON 0 1/8 07/09/35', isin: 'US040114HT09', exchange: 'Bonds', bid: 70.20, ask: 70.40 },
] as const;

export type ExecutionSecurity = (typeof workstationSecurities)[number] | (typeof demoExecutionSecurities)[number] | (typeof argentinaPreviewSecurities)[number];
export type ExecutionSymbol = ExecutionSecurity["symbol"];
