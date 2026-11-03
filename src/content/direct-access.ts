export const directAccess = {
  title: 'Direct Access',
  description: 'Institutional access should not require an institutional maze. We connect professional investors to established market infrastructure, fund platforms and execution arrangements through a specialist operating model.',
  headline: 'Direct\nAccess',
  heroTitle: { prefix: 'Closer to', words: ['markets.', 'infrastructure.', 'counterparties.'] },
  infrastructure: {
    eyebrow: '01 / Market infrastructure',
    title: 'Closer to the source.',
    lead: 'Access to market infrastructure is fundamental to how financial services operate.',
    body: 'Our established arrangements provide connectivity to international securities settlement and custody infrastructure, alongside specialist fund dealing and distribution platforms.',
    note: 'These are complementary capabilities, not interchangeable depositories.',
    providers: [
      { name: 'Euroclear', category: 'Securities settlement & custody', role: 'Market infrastructure', description: 'International securities settlement, custody and asset servicing infrastructure.' },
      { name: 'FundSettle', category: 'Fund settlement', role: 'Fund platform', description: "Euroclear's dedicated fund solution, supporting order routing, subscriptions, redemptions, switches and settlement." },
      { name: 'Allfunds', category: 'Fund distribution & technology', role: 'Fund distribution & technology', description: 'Fund dealing, distribution and investment technology connecting financial institutions and asset managers.' },
    ],
  },
  execution: {
    eyebrow: '02 / Execution access',
    title: 'Direct Market Access.',
    lead: 'For eligible clients and supported instruments, we provide Direct Market Access (DMA) arrangements to selected trading venues.',
    paragraphs: [
      'DMA allows approved clients to submit orders electronically through designated execution arrangements, subject to applicable pre-trade controls, risk limits and ongoing monitoring.',
      'Access is not automatic or unrestricted. Eligibility and availability depend on professional client classification, account size and activity, instrument and venue availability, operational suitability, credit limits and risk controls.',
      "Access is assessed individually and remains subject to EMFI's approval and applicable venue requirements.",
    ],
    modelLabel: 'Direct Market Access / simplified operating model',
    steps: [
      { label: 'Client', detail: 'Approved professional client submits order.' },
      { label: 'EMFI', detail: 'Pre-trade controls and risk thresholds.' },
      { label: 'Venue', detail: 'Order routed through approved access.' },
      { label: 'Post-trade', detail: 'Execution, confirmation and settlement.' },
    ],
    conditionsTitle: 'Access conditions',
    conditions: [
      'Professional client classification and onboarding',
      'Account size and trading activity criteria',
      'Supported instruments and trading venues',
      'Operational, credit and risk controls',
    ],
  },
  disclosures: {
    title: 'Access & execution information',
    paragraphs: [
      'Access to Euroclear, FundSettle and Allfunds is subject to the relevant account, connectivity and service arrangements.',
      'DMA is available only to approved clients for supported instruments and venues, subject to due diligence, account criteria, risk controls and applicable regulatory requirements.',
      'Infrastructure provider names identify relevant platforms and services; their inclusion does not imply an endorsement of EMFI.',
    ],
    action: { label: 'Execution Policy & Regulatory Disclosures', href: 'https://emfi.uk/english/policydocuments' },
  },
} as const;
