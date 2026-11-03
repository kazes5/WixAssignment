import { test, expect } from '@playwright/test';
import { checkAvailability, expectAvailabilityShape, uniqueFreeName, PREMIUM_TYPES } from '../support/wixApi';

// Check Domain Availability: the core "Can I get this name?" answer through the public API.
// Scenario IDs match TEST_PLAN.md §6.2. Assertions are on status, availability and shape only.

test.describe('API: check domain availability', () => {
  test('API-01 + API-09: a fresh unique name is available', async ({ request }) => {
    const domain = uniqueFreeName();
    const res = await checkAvailability(request, domain);

    expect(res.status()).toBe(200);
    const body = await res.json();
    expectAvailabilityShape(body); // API-09: fields and types match the docs
    expect(body.availability.domain).toBe(domain); // the answer is about the name we asked for
    expect(body.availability.available).toBe(true);
  });

  test('API-02 + API-09: a well-known registered name is taken', async ({ request }) => {
    const res = await checkAvailability(request, 'google.com');

    expect(res.status()).toBe(200);
    const body = await res.json();
    expectAvailabilityShape(body);
    expect(body.availability.domain).toBe('google.com');
    expect(body.availability.available).toBe(false);
  });

  test('API-08: a known premium domain reports premium with a valid premiumType', async ({ request }) => {
    // bakeries.store returned premium:true in the manual run (evidence/API-08). Registered, so not buyable.
    const res = await checkAvailability(request, 'bakeries.store');

    expect(res.status()).toBe(200);
    const { availability } = await res.json();
    expect(availability.premium).toBe(true);
    // A premium domain must say how the premium applies, so it can't be the "unknown" value.
    expect(PREMIUM_TYPES).toContain(availability.premiumType);
    expect(availability.premiumType).not.toBe('UNKNOWN_PREMIUM_TYPE');
  });

  test('API-10: uppercase and www. input give the same answer as the plain name', async ({ request }) => {
    const domain = uniqueFreeName();

    // Uppercase is normalised to lowercase.
    const upper = await (await checkAvailability(request, domain.toUpperCase())).json();
    expect(upper.availability.domain).toBe(domain);
    expect(upper.availability.available).toBe(true);

    // A leading "www." is stripped.
    const www = await (await checkAvailability(request, `www.${domain}`)).json();
    expect(www.availability.domain).toBe(domain);
    expect(www.availability.available).toBe(true);
  });

  test('API-11: a TLD Wix sells answers normally; one it does not sell is rejected clearly', async ({ request }) => {
    // .co.il is sold by Wix: normal answer.
    const sold = await checkAvailability(request, uniqueFreeName('co.il'));
    expect(sold.status()).toBe(200);
    expect((await sold.json()).availability.available).toBe(true);

    // .de is not sold by Wix (Domain basics): expected "not supported", not "taken".
    const unsold = await checkAvailability(request, uniqueFreeName('de'));
    expect(unsold.status()).toBe(400);
    const body = await unsold.json();
    expect(body.message).toBe('TLD_NOT_SUPPORTED');
    expect(body.details.validationError.fieldViolations[0].field).toBe('domain');
  });
});
