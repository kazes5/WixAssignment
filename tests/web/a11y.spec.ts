import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { StorefrontResults } from '../support/storefront';
import { uniqueFreeName } from '../support/wixApi';

// A11Y-04: automated axe-core scan (it was blocked in the manual run, see TEST_PLAN.md §6.7).
// The scan REPORTS violations as data and does not fail the suite: the known gaps are already
// FINDINGS.md Finding 3, and a page we don't own would make a "zero violations" gate always red.
// The full axe result is attached to the HTML report; a one-line summary goes into the annotations.

// WCAG 2.0/2.1 level A and AA rules, the usual compliance benchmark.
const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'];

const pages = [
  { name: 'storefront landing', open: async (page) => page.goto('/domains', { waitUntil: 'domcontentloaded' }) },
  { name: 'storefront results', open: async (page) => new StorefrontResults(page).open(uniqueFreeName()) },
];

for (const target of pages) {
  test(`A11Y-04: axe scan of the ${target.name} page (report only)`, async ({ page }, testInfo) => {
    await target.open(page);
    // Wait until the main search box is on screen, so axe scans the rendered page, not a loader.
    await expect(page.getByRole('textbox').first()).toBeVisible();
    if (target.name === 'storefront results') {
      await expect(page.locator('[data-hook="hero-card"]')).toContainText('Available now!');
    }

    const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();

    // Keep the report readable: rule id, impact, how many elements, and the help text.
    const summary = results.violations.map((v) => ({
      rule: v.id,
      impact: v.impact,
      elements: v.nodes.length,
      help: v.help,
    }));
    await testInfo.attach(`axe-${target.name.replace(' ', '-')}.json`, {
      body: JSON.stringify({ url: page.url(), violations: summary, full: results.violations }, null, 2),
      contentType: 'application/json',
    });
    testInfo.annotations.push({
      type: 'axe violations',
      description: summary.map((s) => `${s.rule} (${s.impact}, ${s.elements})`).join('; ') || 'none',
    });

    // The only hard check: the scan itself ran on the right page.
    expect(results.url).toContain('wix.com');
  });
}
