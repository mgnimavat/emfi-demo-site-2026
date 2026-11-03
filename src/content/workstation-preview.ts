import { workstationSecurities as previewSecurities } from './execution-securities';
import type { ExecutionWatchlist } from './execution-watchlists';

export const maskedWorkstationValue = '*******';

const quantity = 100;
const transactionCount = 5;
const referenceMask = 'T-*****';
const referenceSuffixStart = 23;
const sampleReferenceNumbers = [121343, 458712, 736084, 294615, 861930] as const;
const sampleReferencePrefix = 'T-X';
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
      `${referenceMask}${referenceSuffixStart + index}`,
      '',
      '',
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

export const unmaskedWorkstationTransactions = workstationTransactions.map((row, index) => ({
  ...row,
  cells: [`${sampleReferencePrefix}${sampleReferenceNumbers[index]}`, ...row.cells.slice(1)],
}));
