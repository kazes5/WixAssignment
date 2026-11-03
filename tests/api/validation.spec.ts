import { test, expect, APIResponse } from '@playwright/test';
import { checkAvailability } from '../support/wixApi';

// Input validation on check-domain-availability (TEST_PLAN.md API-04, API-05).
// We check the status and which field is blamed, not the exact wording of the message.

// Shared assertion: a 400 that points at the `domain` field and carries a message.
async function expectDomainRejected(res: APIResponse) {
  expect(res.status()).toBe(400);
  const body = await res.json();
  expect(body.message).toBeTruthy();
  expect(body.details.validationError.fieldViolations[0].field).toBe('domain');
  return body;
}

test.describe('API: input validation', () => {
  test('API-04: a name without a TLD is rejected', async ({ request }) => {
    // Domain basics: the API needs the TLD in the domain. Missing it must give a clear 400.
    const body = await expectDomainRejected(await checkAvailability(request, `qa-wix-${Date.now()}`));
    expect(body.message).toBe('INVALID_DOMAIN');
  });

  test('API-05: special characters are rejected', async ({ request }) => {
    await expectDomainRejected(await checkAvailability(request, 'my_bakery!.com'));
  });

  test('API-05: a leading hyphen is rejected', async ({ request }) => {
    await expectDomainRejected(await checkAvailability(request, `-qa-wix-${Date.now()}.com`));
  });

  test('API-05: a 64-character label is rejected; exactly 63 is accepted', async ({ request }) => {
    // 63 is the maximum label length (RFC 1035). This also backs FINDINGS.md Finding 5.
    const tooLong = await expectDomainRejected(await checkAvailability(request, `${'a'.repeat(64)}.com`));
    expect(tooLong.message).toBe('DOMAIN_TOO_LONG');

    const maxLength = await checkAvailability(request, `${'a'.repeat(63)}.com`);
    expect(maxLength.status()).toBe(200); // accepted; whether it is free or taken doesn't matter here
  });
});
