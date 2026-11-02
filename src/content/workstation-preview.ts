import { executionSecurities } from './execution-securities';
import type { ExecutionWatchlist } from './execution-watchlists';

const quantity = 100;
const transactionCount = 5;
const previewSecurities = [
  ...executionSecurities,
  { symbol: 'META', name: 'META PLATFORMS', isin: 'US30303M1027', bid: 512.28, ask: 512.30 },
  { symbol: 'AMZN', name: 'AMAZON.COM INC', isin: 'US0231351067', bid: 198.40, ask: 198.44 },
] as const;
const money = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const workstationWatchlist: ExecutionWatchlist = {
  id: 'sample-equity',
  title: 'Equity',
  precision: 2,
  initialIds: previewSecurities.map((security) => security.symbol),
  instruments: previewSecurities.map((security) => ({
    id: security.symbol,
    name: security.name,
    identifier: security.isin,
    bid: security.bid,
    ask: security.ask,
    bidSize: String(quantity),
    askSize: String(quantity),
  })),
};

export const workstationTransactions = Array.from({ length: transactionCount }, (_, index) => {
  const security = previewSecurities[index % previewSecurities.length];
  return {
    id: `sample-transaction-${index + 1}`,
    cells: [
      `DEMO-100${index + 1}`,
      '15 Oct 2026',
      '16 Oct 2026',
      security.symbol,
      'Market',
      security.isin,
      index % 2 ? 'Sell' : 'Buy',
      String(quantity),
      money.format(index % 2 ? security.bid : security.ask),
      money.format(quantity * (index % 2 ? security.bid : security.ask)),
      '0.00',
      'Model Equity',
      'Sample Broker',
      'Filled',
    ],
  };
});
