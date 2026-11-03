export const settlementMobileHoldings = {
  title: 'Positions',
  time: '9:41',
  marketValue: '$433,972,490',
  labels: {
    marketValue: 'Market Value',
    security: 'Security',
    price: 'Price',
    amount: 'Amount',
    overview: 'Overview',
    list: 'List',
  },
  positions: [
    { id: 'dtek', name: 'DTEK 8.25 03/19/2031', marketValue: '$134,028,480', price: '115.310', amount: '103,000,000', tone: 'muted' },
    { id: 'pdvsa', name: 'PDVSA 6 11/15/26', marketValue: '$30,971,468', price: '38.161', amount: '81,160,000', tone: 'light' },
    { id: 'zt', name: 'ZT', marketValue: '$30,882,422', price: '102.94141', amount: '150,000', tone: 'dark' },
    { id: 'eur', name: 'EUR FUT 12/14/26', marketValue: '$28,963,194', price: '102.450', amount: '25,000,000', tone: 'navy' },
  ],
  otherHoldings: [
    'BOCAS', 'BUENOS', 'ABSCRT', 'HFM', 'IACA', 'VENEZUELA',
    'SLMG', 'PDVSA', 'GOLD', 'BRAZIL', 'MEXICO', 'COLOMBIA',
    'PERU', 'ECUADOR', 'TREASURY', 'CASH', 'BONDS', 'RESERVE',
  ],
} as const;
