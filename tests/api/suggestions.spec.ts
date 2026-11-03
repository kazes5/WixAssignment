import { test, expect } from '@playwright/test';
import { suggestDomains, checkAvailability, expectSuggestionsShape, HOSTNAME_RE } from '../support/wixApi';

// Suggest Domains (TEST_PLAN.md API-03, API-06, API-09).
// Suggestions are generated and vary between calls (Domain basics), so we never assert on
// which names come back, their order or exact count. Only on shape, validity and availability.

test.describe('API: suggest domains', () => {
  test('API-03 + API-09: a query returns valid, available suggestions', async ({ request }) => {
    const res = await suggestDomains(request, 'sourdough bakery', { limit: 5 });

    expect(res.status()).toBe(200);
    const body = await res.json();
    expectSuggestionsShape(body); // API-09
    expect(body.suggestions.length).toBeGreaterThan(0);
    expect(body.suggestions.length).toBeLessThanOrEqual(5); // paging.limit is respected
    for (const s of body.suggestions) {
      expect(s.domain).toMatch(HOSTNAME_RE);
    }

    // Spot-check: a suggestion is meant to be buyable, so the first one should be available.
    const first = body.suggestions[0].domain;
    const check = await (await checkAvailability(request, first)).json();
    expect(check.availability.available, `${first} was suggested but is not available`).toBe(true);
  });

  test('API-06: TLD filter "com" (no dot) returns only .com', async ({ request }) => {
    const res = await suggestDomains(request, 'sourdough bakery', { tlds: 'com', limit: 5 });

    expect(res.status()).toBe(200);
    const { suggestions } = await res.json();
    expect(suggestions.length).toBeGreaterThan(0);
    for (const s of suggestions) {
      expect(s.domain.endsWith('.com')).toBe(true);
    }
  });

  test('API-06: TLD filter ".com" (with a dot) is rejected as documented', async ({ request }) => {
    // Domain basics: the filter is passed without the dot. With the dot, a clear 400 is expected.
    const res = await suggestDomains(request, 'sourdough bakery', { tlds: '.com', limit: 5 });

    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.message).toBe('INVALID_TLD_FORMAT');
    expect(body.details.validationError.fieldViolations[0].field).toBe('tlds');
  });
});
