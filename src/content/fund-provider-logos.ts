type FundProviderLogo = { src: string; width: number; height: number };

export const fundProviderLogos: Readonly<Partial<Record<string, FundProviderLogo>>> = {
  audit: {
    src: '/brand/auditors/baker-tilly-brand.png',
    width: 1023,
    height: 268,
  },
};
