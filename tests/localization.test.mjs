import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';

const readCopy = (locale, page) => JSON.parse(readFileSync(
  new URL(`../src/content/locales/${locale}/${page}.json`, import.meta.url), 'utf8'
));
const validateShape = (reference, translation, path = '') => {
  assert.equal(typeof translation, typeof reference, path);
  if (Array.isArray(reference)) {
    assert.ok(Array.isArray(translation), path);
    assert.equal(translation.length, reference.length, path);
    reference.forEach((value, index) => validateShape(value, translation[index], `${path}[${index}]`));
  } else if (reference && typeof reference === 'object') {
    assert.deepEqual(Object.keys(translation).sort(), Object.keys(reference).sort(), path);
    Object.entries(reference).forEach(([key, value]) => validateShape(value, translation[key], `${path}.${key}`));
  } else if (typeof reference === 'string') {
    assert.ok(translation.trim(), `${path} must have copy`);
  }
};

test('every supported language has complete page and shared dictionaries', () => {
  for (const page of ['about', 'contact', 'common', 'research', 'settlement', 'wealth']) {
    const english = readCopy('en', page);
    for (const locale of ['es', 'ar']) validateShape(english, readCopy(locale, page), `${locale}/${page}`);
  }
});

test('translations preserve form identifiers, assets, years and contact destinations', () => {
  for (const locale of ['es', 'ar']) {
    const englishContact = readCopy('en', 'contact');
    readCopy(locale, 'contact').cta.fields.forEach((field, index) => {
      for (const key of ['name', 'type', 'autoComplete', 'required']) {
        assert.equal(field[key], englishContact.cta.fields[index][key]);
      }
    });
    const englishPeople = readCopy('en', 'about').people;
    readCopy(locale, 'about').people.forEach((person, index) => {
      assert.equal(person.name, englishPeople[index].name);
      assert.equal(person.photo, englishPeople[index].photo);
    });
    assert.deepEqual(readCopy(locale, 'about').milestones.map(([year]) => year), readCopy('en', 'about').milestones.map(([year]) => year));
    const englishPlaces = readCopy('en', 'common').locations.places;
    readCopy(locale, 'common').locations.places.forEach((place, index) => {
      for (const key of ['email', 'phone', 'mapQuery']) assert.equal(place[key], englishPlaces[index][key]);
      assert.deepEqual(place.kicker, englishPlaces[index].kicker);
    });
  }
});

test('service translations preserve regulatory entities, identifiers and disclosure links', () => {
  const inspect = (english, translation, key = '', path = '') => {
    if (Array.isArray(english)) return english.forEach((value, index) => inspect(value, translation[index], key, path));
    if (english && typeof english === 'object') return Object.entries(english).forEach(([name, value]) => {
      if (name !== 'ui') inspect(value, translation[name], name, `${path}.${name}`);
    });
    if (['entity', 'name', 'id', 'href', 'relatedHref'].includes(key) && path !== '.workstation.name') assert.equal(translation, english);
  };
  for (const page of ['research', 'settlement', 'wealth']) {
    for (const locale of ['es', 'ar']) inspect(readCopy('en', page), readCopy(locale, page));
  }
});
