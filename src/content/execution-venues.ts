export const executionVenueGroups = [
  {
    id: 'fixedIncome',
    venues: [
      { name: 'MarketAxess', logo: '/images/execution-venues/marketaxess-navy.svg', href: 'https://www.marketaxess.com/' },
      { name: 'Tradeweb', logo: '/images/execution-venues/tradeweb-navy.svg', href: 'https://www.tradeweb.com/' },
      { name: 'Trumid', logo: '/images/execution-venues/trumid-navy.svg', href: 'https://www.trumid.com/' },
    ],
  },
  {
    id: 'otherVenues',
    venues: [
      { name: 'Börse Berlin', logo: '/images/execution-venues/boerse-berlin-navy.svg', href: 'https://www.boerse-berlin.com/' },
      { name: 'Allfunds', logo: '/images/execution-venues/allfunds-navy.svg', href: 'https://allfunds.com/en/' },
      {
        name: 'Euroclear FundSettle',
        logo: '/images/execution-venues/euroclear-navy.svg',
        href: 'https://www.euroclear.com/services/en/funds/trading-custody.html',
      },
    ],
  },
] as const;
