import { APIRequestContext, APIResponse, expect } from '@playwright/test';

// Shared helpers for the public Domain Search API (used by the api and cross projects).
// Endpoints and headers are documented in EXECUTION_PLAN.md "Shared conventions".

export const API_BASE = 'https://www.wixapis.com/domain-search/v2';

// premiumType values allowed by the docs (see ARCHITECTURE.md §2.4).
export const PREMIUM_TYPES = ['UNKNOWN_PREMIUM_TYPE', 'FIRST_YEAR_ONLY', 'FIRST_YEAR_AND_RENEWAL'];

// A valid hostname: labels of letters, digits and hyphens (not at the ends), plus a TLD.
// Punycode labels (xn--...) match too. Used to sanity-check suggestions, not to validate DNS.
export const HOSTNAME_RE = /^(?!-)[a-z0-9-]{1,63}(?<!-)(\.[a-z0-9-]{2,63})+$/;

// A fresh, unique name that nobody has registered, e.g. qa-wix-1793712345678.com.
// Date.now() plus a random suffix keeps names unique across parallel workers and runs.
export function uniqueFreeName(tld = 'com'): string {
  return `qa-wix-${Date.now()}${Math.floor(Math.random() * 1000)}.${tld}`;
}

// Auth headers read from .env only. The values are never logged or attached to reports.
export function authHeaders(): Record<string, string> {
  const key = process.env.WIX_API_KEY;
  const accountId = process.env.WIX_ACCOUNT_ID;
  if (!key || !accountId) {
    // Say which variable is missing, never what it contains.
    throw new Error('WIX_API_KEY and WIX_ACCOUNT_ID must be set in .env (see .env.example)');
  }
  return { Authorization: key, 'wix-account-id': accountId };
}

// GET check-domain-availability. `auth: false` sends no headers at all (used by API-07).
export function checkAvailability(
  request: APIRequestContext,
  domain: string,
  auth = true,
): Promise<APIResponse> {
  return request.get(`${API_BASE}/check-domain-availability`, {
    params: { domain },
    headers: auth ? authHeaders() : {},
  });
}

// GET suggest-domains. `tlds` is passed as given, so tests can send "com" or ".com".
export function suggestDomains(
  request: APIRequestContext,
  query: string,
  opts: { tlds?: string; limit?: number } = {},
): Promise<APIResponse> {
  const params: Record<string, string> = { query, 'paging.limit': String(opts.limit ?? 5) };
  if (opts.tlds) params.tlds = opts.tlds;
  return request.get(`${API_BASE}/suggest-domains`, { params, headers: authHeaders() });
}

// API-09: the documented shape of a check-domain-availability response.
export function expectAvailabilityShape(body: any): void {
  expect(body).toHaveProperty('availability');
  const a = body.availability;
  expect(typeof a.domain).toBe('string');
  expect(typeof a.available).toBe('boolean');
  expect(typeof a.premium).toBe('boolean');
  expect(PREMIUM_TYPES).toContain(a.premiumType);
}

// API-09: the documented shape of a suggest-domains response.
export function expectSuggestionsShape(body: any): void {
  expect(Array.isArray(body.suggestions)).toBe(true);
  for (const s of body.suggestions) {
    expect(typeof s.domain).toBe('string');
    expect(typeof s.premium).toBe('boolean');
  }
  expect(body).toHaveProperty('pagingMetadata');
  expect(typeof body.pagingMetadata.count).toBe('number');
  expect(typeof body.pagingMetadata.hasNext).toBe('boolean');
  expect(body.pagingMetadata).toHaveProperty('cursors');
}
