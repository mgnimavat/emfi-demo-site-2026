export const executionVenueGroups = [
  {
    id: 'fixedIncome',
    venues: [
      { name: 'MarketAxess', logo: '/images/execution-venues/marketaxess-navy.svg' },
      { name: 'Tradeweb', logo: '/images/execution-venues/tradeweb-navy.svg' },
      { name: 'Trumid', logo: '/images/execution-venues/trumid-navy.svg' },
    ],
  },
  {
    id: 'otherVenues',
    venues: [
      { name: 'Tradegate Berlin Stock Exchange', logo: '/images/execution-venues/tradegate-navy.svg' },
      { name: 'Allfunds', logo: '/images/execution-venues/allfunds-navy.svg' },
      { name: 'Euroclear FundSettle', logo: '/images/execution-venues/euroclear-navy.svg' },
    ],
  },
] as const;
