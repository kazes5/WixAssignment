import { test, expect } from '@playwright/test';
import { checkAvailability, uniqueFreeName } from '../support/wixApi';
import { StorefrontResults } from '../support/storefront';

// X-01 (TEST_PLAN.md §6.5): the same name gets the same answer from the public API and the storefront.
// Both doors call the same check-domain-availability service (ARCHITECTURE.md §3), so a mismatch
// would be a real bug. Availability is a point-in-time answer (Domain basics), so each pair of
// checks runs back to back, seconds apart.

test.describe('Cross-door: API vs storefront', () => {
  test('X-01: a free name is available in both the API and the storefront', async ({ request, page }) => {
    const domain = uniqueFreeName();

    const api = await (await checkAvailability(request, domain)).json();
    expect(api.availability.available, 'API answer').toBe(true);

    const results = new StorefrontResults(page);
    await results.open(domain);
    await expect(results.exactMatchCard, 'storefront answer').toContainText('Available now!');
    await expect(results.exactMatchCard).toContainText(domain);
  });

  test('X-01: a taken name is taken in both the API and the storefront', async ({ request, page }) => {
    const domain = 'google.com';

    const api = await (await checkAvailability(request, domain)).json();
    expect(api.availability.available, 'API answer').toBe(false);

    const results = new StorefrontResults(page);
    await results.open(domain);
    await expect(results.message(`${domain} is already registered`), 'storefront answer').toBeVisible();
    await expect(results.exactMatchCard).toHaveCount(0);
  });
});
