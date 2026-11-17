type ProviderAsset = { src: string; width: number; height: number };

export const wealthProviderAssets: Readonly<Partial<Record<string, ProviderAsset>>> = {
  dechert: { src: '/images/fund-providers/dechert.png', width: 1024, height: 1024 },
  walkers: { src: '/images/fund-providers/walkers.jpg', width: 1797, height: 614 },
  apex: { src: '/images/fund-providers/apex.svg', width: 550, height: 514 },
  'northern-trust': { src: '/images/fund-providers/northern-trust.png', width: 400, height: 400 },
  audit: { src: '/brand/auditors/baker-tilly-brand.png', width: 1023, height: 268 },
};
