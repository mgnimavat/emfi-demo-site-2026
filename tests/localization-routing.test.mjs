import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getBasePath, getPageLocale, isLocalizedPath, localizeHref } from '../src/lib/i18n/routing.ts';

const paths = ['/', '/why-emfi/direct-access', '/why-emfi/responsive-technology', '/why-emfi/dependable-operations', '/about', '/contact', '/services/research-execution', '/services/settlement-custody', '/services/wealth-asset-management'];
test('language switching keeps every supported page path intact', () => {
  for (const path of paths) for (const locale of ['en', 'es', 'ar']) {
    assert.equal(isLocalizedPath(path), true);
    const localized = localizeHref(path, locale);
    assert.equal(localized, `/${locale}${path === "/" ? "" : path}`);
    assert.equal(getBasePath(localized), path);
    assert.equal(getPageLocale(localized), locale);
  }
});
test('untranslated and invalid locale paths do not change', () => {
  for (const path of ['/home-16', '/home-21', '/services', '/why-emfi', '/fr/about', '/es/services/unknown']) {
    assert.equal(isLocalizedPath(path), false);
    assert.equal(localizeHref(path, 'ar'), path);
    assert.equal(getBasePath(path), path);
    assert.equal(getPageLocale(path), 'en');
  }
});

test('localized links preserve fragments and query strings', () => {
  for (const locale of ['en', 'es', 'ar']) {
    assert.equal(localizeHref('/?preview=1#say-less', locale), `/${locale}?preview=1#say-less`);
    assert.equal(localizeHref('/why-emfi/direct-access#dma-heading', locale), `/${locale}/why-emfi/direct-access#dma-heading`);
    assert.equal(localizeHref('/services/settlement-custody?view=dashboard#workstation-demo', locale), `/${locale}/services/settlement-custody?view=dashboard#workstation-demo`);
  }
});
