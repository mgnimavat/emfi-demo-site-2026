export const locales = ['en', 'es', 'ar'] as const;
export type Locale = (typeof locales)[number];
export const isLocale = (value: string): value is Locale =>
  locales.some((locale) => locale === value);

export const localizedPaths = [
  '/about',
  '/contact',
  '/services/research-execution',
  '/services/settlement-custody',
  '/services/wealth-asset-management',
] as const;
export const isLocalizedPath = (pathname: string) =>
  localizedPaths.some((path) => path === pathname);

export const getBasePath = (pathname: string) => {
  const [, locale, ...segments] = pathname.split('/');
  const basePath = `/${segments.join('/')}`;
  return isLocale(locale) && isLocalizedPath(basePath) ? basePath : pathname;
};
export const getPageLocale = (pathname: string): Locale => {
  const locale = pathname.split('/')[1];
  return isLocale(locale) && isLocalizedPath(getBasePath(pathname)) ? locale : 'en';
};
export const localizeHref = (href: string, locale: Locale) =>
  isLocalizedPath(href) ? `/${locale}${href}` : href;
