import { test, expect } from '@playwright/test';
import { StorefrontResults, PRICE_RE } from '../support/storefront';
import { uniqueFreeName } from '../support/wixApi';

// Domain storefront, logged out (public pages only). Scenario IDs match TEST_PLAN.md §6.1 and §6.6.
// We assert on what the user sees: the answer text, the domain, that a price and a buy button exist.
// Never on exact prices, currency, suggestion lists or card labels (they vary by time and location).
// No test clicks a buy button: the purchase flow is out of bounds.

test.describe('Storefront: the answer to "Can I get this name?"', () => {
  test('SF-01: a free name is shown as available with a price and a buy button', async ({ page }) => {
    const domain = uniqueFreeName();
    const results = new StorefrontResults(page);
    await results.open(domain);

    const card = results.exactMatchCard;
    await expect(card).toContainText('Available now!');
    await expect(card).toContainText(domain);
    await expect(card).toContainText(PRICE_RE); // some price, any currency
    await expect(card.getByRole('button', { name: 'Make It Yours' })).toBeEnabled();

    // Alternatives in other TLDs are offered too, each with its own buy button.
    await expect(results.alternativeRows.first()).toBeVisible();
    await expect(results.alternativeRows.first().getByRole('button', { name: 'Get It' })).toBeVisible();
  });

  test('SF-02: a taken name is shown as registered and alternatives are offered', async ({ page }) => {
    const results = new StorefrontResults(page);
    await results.open('google.com');

    await expect(results.message('google.com is already registered')).toBeVisible();
    // No "Exact Match" card, so there is no way to "buy" google.com itself.
    await expect(results.exactMatchCard).toHaveCount(0);

    // Alternatives exist (generous wait: they took ~8 s in the manual run), and none of them is google.com.
    await expect(results.firstAlternativeCard.getByRole('button', { name: 'Make It Yours' })).toBeVisible();
    await expect(results.alternativeRows.first()).toBeVisible();
    const offered = await results.alternativeRows.allInnerTexts();
    for (const row of offered) {
      expect(row.split('\n')[0].trim()).not.toBe('google.com'); // first line of a row is the domain
    }
  });

  test('SF-04: a name without a TLD gets results in one or more TLDs', async ({ page }) => {
    const name = uniqueFreeName().replace(/\.com$/, ''); // e.g. qa-wix-1793712345678 (no TLD)
    const results = new StorefrontResults(page);
    await results.open(name);

    // The first card offers the same name with some TLD; which TLD is not asserted (location-based).
    await expect(results.firstAlternativeCard).toContainText(`${name}.`);
    await expect(results.firstAlternativeCard.getByRole('button', { name: 'Make It Yours' })).toBeVisible();
    await expect(results.alternativeRows.first()).toContainText(name);
  });

  test('SF-05: a TLD Wix does not sell says "not available", not "taken"', async ({ page }) => {
    const domain = uniqueFreeName('de'); // .de is not in Wix's TLD list (Domain basics: unsold TLDs)
    const results = new StorefrontResults(page);
    await results.open(domain);

    // The page uses a curly apostrophe (aren’t), so match either kind.
    await expect(results.message(/\.de domains aren.t available/)).toBeVisible();
    await expect(page.getByText('is already registered')).toHaveCount(0);
    await expect(results.exactMatchCard).toHaveCount(0);
  });
});

test.describe('Storefront: input validation', () => {
  test('SF-07: special characters get a clear validation message', async ({ page }) => {
    const results = new StorefrontResults(page);
    await results.open('my_bakery!.com');

    await expect(
      results.message('Domains can only contain English letters, numbers, periods and hyphens'),
    ).toBeVisible();
  });

  test('SF-07 / UI-04: over 63 characters gets a length message; exactly 63 is accepted', async ({ page }, testInfo) => {
    const results = new StorefrontResults(page);

    // 70 characters: a length message that mentions the 63 limit (exact wording is Finding 5, not asserted).
    await results.open(`${'a'.repeat(70)}.com`);
    await expect(results.message(/63 characters/)).toBeVisible();
    await testInfo.attach('70-chars-length-message', { body: await page.screenshot(), contentType: 'image/png' });

    // Exactly 63 characters: no length message, the name gets a normal answer. Evidence for Finding 5.
    await results.open(`${'a'.repeat(63)}.com`);
    await expect(results.message(/already registered|Available now!/)).toBeVisible();
    await expect(page.getByText(/63 characters/)).toHaveCount(0);
    await testInfo.attach('63-chars-accepted', { body: await page.screenshot(), contentType: 'image/png' });
  });
});

test.describe('Storefront: phone layout', () => {
  // UI-01: a real phone width, which the desktop browser couldn't reach manually (606 px minimum).
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

  test('UI-01: at 390 px the answer and buy button are visible without horizontal page scroll', async ({ page }) => {
    const domain = uniqueFreeName();
    const results = new StorefrontResults(page);
    await results.open(domain);

    await expect(results.exactMatchCard).toContainText('Available now!');
    const buy = results.exactMatchCard.getByRole('button', { name: 'Make It Yours' });
    await buy.scrollIntoViewIfNeeded();
    await expect(buy).toBeVisible();

    // The page itself must not be wider than the screen (inner strips may scroll on purpose).
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(1); // 1 px tolerance for sub-pixel rounding
  });
});
