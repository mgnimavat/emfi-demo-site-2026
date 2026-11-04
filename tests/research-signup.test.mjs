import assert from 'node:assert/strict';
import test from 'node:test';
import { buildResearchSignupPayload } from '../src/lib/research-signup.ts';

const formData = (overrides = {}) => {
  const data = new FormData();
  const values = {
    type: 'individual',
    first_name: ' Alex ',
    last_name: ' Morgan ',
    email: ' alex@example.com ',
    jurisdiction: 'United Kingdom',
    ...overrides,
  };
  for (const [key, value] of Object.entries(values)) data.set(key, value);
  return data;
};

test('prepares a trimmed, JSON-serializable individual payload using only signup fields', () => {
  const payload = buildResearchSignupPayload(formData({ distribution_list: 'unused@example.com', extra: 'ignored' }));
  assert.deepEqual(JSON.parse(JSON.stringify(payload)), {
    type: 'individual', first_name: 'Alex', last_name: 'Morgan', email: 'alex@example.com', jurisdiction: 'United Kingdom',
  });
});

test('includes a clean distribution list only for entity requests', () => {
  const payload = buildResearchSignupPayload(formData({ type: 'entity', distribution_list: ' research@example.com, team@example.com ' }));
  assert.deepEqual(payload.distribution_list, ['research@example.com', 'team@example.com']);
});

test('rejects missing required details and unsupported signup types', () => {
  for (const overrides of [{ type: '' }, { type: 'unknown' }, { first_name: '  ' }, { last_name: '' }, { email: '' }, { jurisdiction: '' }]) {
    assert.equal(buildResearchSignupPayload(formData(overrides)), null);
  }
});

test('does not prepare an entity request with an empty distribution list', () => {
  assert.equal(buildResearchSignupPayload(formData({ type: 'entity', distribution_list: ' , ' })), null);
});
