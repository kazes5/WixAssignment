# Wix Domains QA: "Can I get this name?"

QA home assignment for the four Wix Domains doors: the domain storefront, the Business Name Generator,
WHOIS lookup and the public Domain Search API.

| File | What's in it |
|---|---|
| [`ARCHITECTURE.md`](ARCHITECTURE.md) | What each door is made of, its network calls, how the doors connect (Mermaid diagram) |
| [`TEST_PLAN.md`](TEST_PLAN.md) | Scope, priorities, 43 scenarios with manual results, and which ones are automated |
| [`FINDINGS.md`](FINDINGS.md) | 5 findings with severity, priority and evidence, plus risks and observations |
| [`evidence/`](evidence/README.md) | Screenshots and API responses from the manual run; [`evidence/automation/`](evidence/automation/) for the automated run |
| [`tests/`](tests/) | Playwright automation (this README explains it) |
| [`EXECUTION_PLAN.md`](EXECUTION_PLAN.md) | Phases, status and the API call budget |
| [`AI_LOG.md`](AI_LOG.md) | How AI was used |

---

## How to run the tests

**Prerequisites:** Node.js 18 or newer (developed on Node 24), and a Wix account-level API key
([create one here](https://manage.wix.com/account/api-keys)).

```bash
# 1. Install dependencies and the browser
npm install
npx playwright install chromium

# 2. Add your API key and account ID (the file is gitignored; never commit it)
cp .env.example .env
#    then edit .env:
#    WIX_API_KEY=<your account-level API key>
#    WIX_ACCOUNT_ID=<your account ID>

# 3. Run everything: the single command
npm test
```

**Results:**
- The terminal shows one line per test.
- The HTML report is written to `playwright-report/`. Open it with `npm run report`.
- For a failed web test, the report has a screenshot and a Playwright trace (`test-results/`).

**Useful extras:** `npm run test:api` (API only, no browser) and `npm run test:web` (storefront only).

**What to expect:**
- About 45 seconds for the whole suite: 24 tests. All pass, and **API-07 is listed as an expected failure**
  (see "Known bug kept visible" below). Latest run: [`evidence/automation/run-summary.txt`](evidence/automation/run-summary.txt).
- The web tests passed 3 runs in a row without retries (2026-11-03, 10:34 to 10:38 UTC).
- One full run makes **19 calls** with your API key (17 API tests + 2 cross-door). The web tests open
  12 public wix.com pages and don't use the key.
- The tests run against live wix.com from your location, so prices, currency and suggestions will differ.
  The tests don't assert on any of those.
- Please run it a few times an hour at most. During development, too many page loads in a short time
  made wix.com's price services answer `429 Too Many Requests`, and the storefront then showed no
  prices (which makes SF-01 fail, correctly, because the user sees no price).

---

## Automation choices

### What was automated and why

The automation covers the **P0 core answer** ("free or taken?") on the public API and the storefront,
plus the **cheap, stable P1 checks** around it. These are the checks you want on every change: if
one of them breaks, users get a wrong answer or can't search.

| Scenario | What the test proves | File |
|---|---|---|
| API-01, API-02 | Free name → `available:true`; `google.com` → `available:false` | `tests/api/availability.spec.ts` |
| API-03 | Suggestions are valid hostnames, respect the limit, and the first one is really available | `tests/api/suggestions.spec.ts` |
| API-04, API-05 | No TLD, special characters, leading hyphen, 64 characters → 400 on the `domain` field; exactly 63 → accepted | `tests/api/validation.spec.ts` |
| API-06 | TLD filter `com` works; `.com` → 400 `INVALID_TLD_FORMAT` (documented) | `tests/api/suggestions.spec.ts` |
| API-07 | No API key → 401/403. **Expected failure: Finding 1** | `tests/api/auth.spec.ts` |
| API-08 | A known premium domain → `premium:true` with a real `premiumType` | `tests/api/availability.spec.ts` |
| API-09 | Response shape (fields and types) checked inside API-01, 02 and 03 | `tests/support/wixApi.ts` |
| API-10, API-11 | Uppercase and `www.` normalised; sold `.co.il` answers, unsold `.de` → `TLD_NOT_SUPPORTED` | `tests/api/availability.spec.ts` |
| SF-01 | Free name → "Available now!", the domain, a price and an enabled "Make It Yours" | `tests/web/storefront.spec.ts` |
| SF-02 | `google.com` → "already registered", no exact-match card, alternatives that aren't google.com | `tests/web/storefront.spec.ts` |
| SF-04 | Name without TLD → results with the same name in some TLD | `tests/web/storefront.spec.ts` |
| SF-05 | Unsold `.de` → "aren't available", not "already registered" | `tests/web/storefront.spec.ts` |
| SF-07 / UI-04 | Special characters and >63 characters → clear messages; exactly 63 accepted (screenshots attached for Finding 5) | `tests/web/storefront.spec.ts` |
| UI-01 | At a 390 px phone viewport, the answer and buy button show without horizontal page scroll | `tests/web/storefront.spec.ts` |
| A11Y-04 | axe-core WCAG A/AA scan of the landing and results pages, **reported, not enforced** | `tests/web/a11y.spec.ts` |
| X-01 | Same free name and same taken name: API and storefront agree | `tests/cross/x01-api-vs-storefront.spec.ts` |

Test names say which scenario they cover, and in total the suite covers **21 of the 43 manual
scenarios** (fully or in part). The rest stay manual (see the end of this section).

### How deep the tests go

- **API:** status codes, the `available` boolean, the echoed domain, the error code and the field it
  blames, and the response shape from the docs. Not the wording of messages.
- **Storefront:** what the user sees: the answer text, the domain, that *a* price exists (any currency),
  and that the buy button is there and enabled. **No test clicks a buy button**, so the purchase flow is
  never entered.
- **Never asserted** (they change by time or location, per "Domain basics"): exact prices or currency,
  which suggestions come back or in what order, card labels such as "Best Match", promotion banners.
- **Test data:** free names are `qa-wix-<unix seconds>.com`, so they're never registered. Taken names
  are `google.com`. The known premium name is `bakeries.store` (registered, so nothing to buy).

### Known bug kept visible: `test.fail()` for API-07

The docs say the API needs an account-level key, but it answers `200` with full data without one
(Finding 1). The API-07 test asserts the **documented** behaviour (401/403) and is marked `test.fail()`:
- The suite stays green, so a real new failure isn't hidden behind a permanently red build.
- The report still lists API-07 as an expected failure, with a link to Finding 1.
- If Wix fixes the API, the test passes, Playwright reports it as **"unexpectedly passed"** (a failure),
  and we remove the marker. The bug can't be fixed or "un-fixed" silently.

Deleting or skipping the test would hide the bug; asserting `200` would turn a bug into a contract.

### Accessibility scan: report, don't gate

The axe scan attaches its full results to the HTML report and adds a one-line summary, but doesn't
fail the build:
- The violations on the results page (`button-name` critical ×3, `label` critical, `html-has-lang`
  serious) are already Finding 3. A failing gate on a page we don't own would be red every run and
  teach people to ignore it.
- On the landing page axe reports `color-contrast` on the "Search Domains" button (white on `#8fa8ff`,
  2.27:1). **We checked it by hand and didn't report it:** the button's computed background is
  `rgb(47, 93, 255)`, which gives about 5.1:1 and passes AA. axe mis-estimated the background. That's
  exactly why the scan is data for a human, not a gate.

### How the code is structured

```
playwright.config.ts           3 projects: api, web, cross. .env loaded with dotenv. 1 worker, 1 retry.
tests/
  support/
    wixApi.ts                  API helpers: auth headers from .env, the two endpoints, shape checks, unique names
    storefront.ts              Storefront results page: locators by data-hook and visible text
  api/                         Public Domain Search API (no browser)
    availability.spec.ts       API-01, 02, 08, 09, 10, 11
    suggestions.spec.ts        API-03, 06, 09
    validation.spec.ts         API-04, 05
    auth.spec.ts               API-07 (expected failure: Finding 1)
  web/                         Domain storefront, logged out
    storefront.spec.ts         SF-01, 02, 04, 05, 07, UI-01, UI-04
    a11y.spec.ts               A11Y-04 axe scan
  cross/
    x01-api-vs-storefront.spec.ts   X-01
```

- **Test names start with the scenario ID** from `TEST_PLAN.md`, so a failure in the report maps straight
  to the scenario and its manual evidence.
- **Two tiny helpers instead of a framework.** A full page-object layer would be more code than tests
  for one results page. The helpers hold the only things that would otherwise be repeated: endpoints,
  headers, locators.
- **Locators** use the page's `data-hook` attributes and visible text (roles and button names), never the
  generated CSS class names.
- **Secrets:** the key is read only from `.env`. The `api` and `cross` projects have **traces turned off**,
  because a trace records request headers, including the key. Browser traces in the `web` project only
  contain wix.com traffic. The HTML report was checked (including its embedded data) and contains no key
  or account ID.
- **Being a polite guest:** 1 worker, 1 retry (absorbs a network blip; a real failure fails twice).
- Comments in the code explain anything non-obvious; this section explains the design.

### What stayed manual, and why

| Left manual | Why |
|---|---|
| SF-03 "Make It Yours" → purchase page | Clicking it enters the purchase flow. The rule is to stop before checkout, and one manual check was enough |
| WHOIS (WH-01 to WH-04) | It calls registry RDAP servers outside Wix, so it's slow and depends on third parties. The bug there (Finding 2) needs a human to judge the message |
| Business Name Generator (BNG-01 to BNG-03, X-02) | Output is AI-generated and changes on every run. The only stable assertion ("some names appear") adds little |
| Premium pricing display (SF-08) | No available premium domain could be found within budget |
| Hebrew / IDN display (I18N-02, Finding 4), keyboard-only (A11Y-02), screen-reader review (A11Y-03) | They need human judgement of what is shown or announced; the axe scan covers the machine-checkable part |
| German site, language list (I18N-01, I18N-05) | One-time checks of what exists, low regression value |
| Logged-in behaviour | Tests run logged out (public pages only); no credentials in the suite |

---

## What I'd do with another week

1. **Run it in CI.** A GitHub Actions job on every PR plus a nightly run, with the key in repository
   secrets, the HTML report kept as an artifact, and a flaky-test log so one red run isn't trusted on its own.
2. **Test from more than one country.** Run the suite from 3–4 regions (e.g. US, EU, Israel, India) and
   compare: same availability answer everywhere, and a price and currency that make sense for each place.
   Today everything was tested from Israel only.
3. **Fault injection instead of load.** Use Playwright's `page.route` to make the price and suggestion
   calls return 429, 500 or a slow response, and check the page never shows "Available now!" with an active
   buy button and no price (R12). This needs no extra traffic to Wix.
4. **Deeper cross-door checks.** Capture the storefront's own `domain-search` calls and compare them field
   by field with the public API. Check that every domain the Name Generator marks as available is also
   available in the API (X-02, automated).
5. **Close the gaps left open:** find an *available* premium domain and check first-year vs renewal pricing
   (SF-08, R2); test WHOIS invalid-input handling once Finding 2 is fixed; do a real VoiceOver/NVDA pass, and
   turn the axe scan into a baseline that fails only on *new* violations.
6. **Get answers on the findings.** Ask the API team whether keyless access (Finding 1) is intended,
   and update the docs or the test to match.

## Quality strategy for Wix Domains (5 lines)

1. **Protect the one answer.** "Can I get this name?" has to be correct and the same across all four doors, so cross-door checks are P0 on every change.
2. **Test the shared service first, then a few journeys.** Contract tests on the `domain-search` service give fast, stable feedback. A thin layer of UI tests per door covers what the user actually sees.
3. **Assert behaviour, not data.** Check availability, status and response shape. Never check exact prices or suggestions, which change with time and location.
4. **Test in the user's world.** Cover several countries and currencies, IDN and RTL input, accessibility and mobile, because that's where the bugs in this assignment were found.
5. **Watch production.** Synthetic checks on each door, plus funnel metrics (search → available → cart) and error-message tracking, so regressions show up as customer impact before they become support tickets.
