import { test, expect } from '@playwright/test';
import { checkAvailability } from '../support/wixApi';

// Authentication (TEST_PLAN.md API-07).
// The docs say both endpoints "require an account level API key", so a call without one
// should get 401/403 and no data. Today the API answers 200 with full data: FINDINGS.md Finding 1.

test.describe('API: authentication', () => {
  test('API-07: a call without an API key is refused (known bug: FINDINGS.md Finding 1)', async ({ request }) => {
    // test.fail() = "this test is expected to fail right now". The suite stays green while
    // the bug exists, and the report shows it as an expected failure. If Wix fixes the API,
    // this test starts passing, Playwright flags it as "unexpectedly passed", and we remove the marker.
    test.fail(true, 'Known bug, FINDINGS.md Finding 1: the API answers without an API key');
    test.info().annotations.push({ type: 'finding', description: 'FINDINGS.md Finding 1 (S2 Major / P1 High)' });

    const res = await checkAvailability(request, 'google.com', false); // false = no auth headers at all

    // Documented behaviour: refused, and no availability data in the body.
    expect([401, 403]).toContain(res.status());
    expect(await res.text()).not.toContain('"available"');
  });
});
