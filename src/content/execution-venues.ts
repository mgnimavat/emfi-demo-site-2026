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
      { name: 'Börse Berlin', logo: '/images/execution-venues/boerse-berlin-navy.svg' },
      { name: 'Allfunds', logo: '/images/execution-venues/allfunds-navy.svg' },
      { name: 'Euroclear FundSettle', logo: '/images/execution-venues/euroclear-navy.svg' },
    ],
  },
] as const;
