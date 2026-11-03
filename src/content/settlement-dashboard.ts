export type DashboardBar = {
  label: string;
  value: number;
  tone: 'muted' | 'light' | 'dark' | 'gray' | 'navy' | 'steel';
};

export type DashboardSeries = {
  title: string;
  total: string;
  maximum: number;
  ticks: readonly number[];
  bars: readonly DashboardBar[];
  maskLength?: number;
  maskLabels?: boolean;
  barHeight?: number;
};

export const settlementDashboard = {
  balances: {
    title: 'Balances',
    total: '$211,240',
    maskLength: 5,
    currencies: [
      { label: 'GBP', share: 47, tone: 'muted' },
      { label: 'EUR', share: 37, tone: 'light' },
      { label: 'USD', share: 16, tone: 'dark' },
    ],
  },
  transactions: {
    title: 'Transactions',
    total: '40',
    maskLength: 2,
    maximum: 50,
    ticks: [0, 10, 20, 30, 40, 50],
    bars: [
      { label: 'Submitted', value: 39, tone: 'muted' },
      { label: 'Settled', value: 1, tone: 'light' },
    ],
  },
  exposure: {
    title: 'Exposure',
    total: '$96,890,830',
    maximum: 30000000,
    ticks: [0, 10000000, 20000000, 30000000],
    bars: [
      { label: 'Bridge Capital', value: 25000000, tone: 'muted' },
      { label: 'Finchain Commodities', value: 16800000, tone: 'light' },
      { label: 'Finnova Payments', value: 12400000, tone: 'dark' },
      { label: 'Country Securities', value: 10600000, tone: 'gray' },
      { label: 'Emerald Financial', value: 10200000, tone: 'dark' },
      { label: 'Mills Capital', value: 9400000, tone: 'navy' },
      { label: 'Mockbank International', value: 8200000, tone: 'steel' },
    ],
  },
  positions: {
    title: 'Positions',
    total: '$99,139',
    maskLength: 6,
    maximum: 70000,
    ticks: [0, 20000, 40000, 70000],
    bars: [
      { label: 'Treasury 3.625% 2053', value: 62000, tone: 'muted' },
      { label: 'ABC 3.45% 2027', value: 29000, tone: 'light' },
      { label: 'Argentina 5.5% 2027', value: 8000, tone: 'dark' },
    ],
  },
  charges: {
    title: 'Charges',
    total: '$1,699',
    maskLength: 4,
    maskLabels: true,
    maximum: 800,
    ticks: [0, 200, 400, 600, 800],
    bars: [
      { label: 'Cross Border', value: 280, tone: 'muted' },
      { label: 'Same Day', value: 200, tone: 'light' },
      { label: 'Incoming Wire', value: 150, tone: 'dark' },
      { label: 'Amendment', value: 90, tone: 'gray' },
      { label: 'Settlement', value: 45, tone: 'dark' },
    ],
  },
  performance: {
    title: 'Performance',
    total: '$113,174',
    barHeight: 24,
    maximum: 50000,
    ticks: [0, 15000, 30000, 50000],
    bars: [
      { label: 'Treasury 3.625% 2053', value: 48000, tone: 'muted' },
      { label: 'ABC 3.45% 2027', value: 43000, tone: 'light' },
      { label: 'Argentina 5.5% 2027', value: 39000, tone: 'dark' },
      { label: 'Brazil 2035', value: 33000, tone: 'gray' },
      { label: 'Colombia 2034', value: 28500, tone: 'dark' },
      { label: 'Mexico 2033', value: 23000, tone: 'navy' },
    ],
  },
} as const satisfies {
  balances: {
    title: string;
    total: string;
    maskLength: number;
    currencies: readonly { label: string; share: number; tone: DashboardBar['tone'] }[];
  };
  transactions: DashboardSeries;
  exposure: DashboardSeries;
  positions: DashboardSeries;
  charges: DashboardSeries;
  performance: DashboardSeries;
};
