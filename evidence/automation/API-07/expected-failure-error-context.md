# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: api/auth.spec.ts >> API: authentication >> API-07: a call without an API key is refused (known bug: FINDINGS.md Finding 1)
- Location: tests/api/auth.spec.ts:9:7

# Error details

```
Error: expect(received).toContain(expected) // indexOf

Expected value: 200
Received array: [401, 403]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import { checkAvailability } from '../support/wixApi';
  3  | 
  4  | // Authentication (TEST_PLAN.md API-07).
  5  | // The docs say both endpoints "require an account level API key", so a call without one
  6  | // should get 401/403 and no data. Today the API answers 200 with full data: FINDINGS.md Finding 1.
  7  | 
  8  | test.describe('API: authentication', () => {
  9  |   test('API-07: a call without an API key is refused (known bug: FINDINGS.md Finding 1)', async ({ request }) => {
  10 |     // test.fail() = "this test is expected to fail right now". The suite stays green while
  11 |     // the bug exists, and the report shows it as an expected failure. If Wix fixes the API,
  12 |     // this test starts passing, Playwright flags it as "unexpectedly passed", and we remove the marker.
  13 |     test.fail(true, 'Known bug, FINDINGS.md Finding 1: the API answers without an API key');
  14 |     test.info().annotations.push({ type: 'finding', description: 'FINDINGS.md Finding 1 (S2 Major / P1 High)' });
  15 | 
  16 |     const res = await checkAvailability(request, 'google.com', false); // false = no auth headers at all
  17 | 
  18 |     // Documented behaviour: refused, and no availability data in the body.
> 19 |     expect([401, 403]).toContain(res.status());
     |                        ^ Error: expect(received).toContain(expected) // indexOf
  20 |     expect(await res.text()).not.toContain('"available"');
  21 |   });
  22 | });
  23 | 
```