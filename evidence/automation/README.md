# Automation evidence (Phase 4)

Evidence from the Playwright suite. The representative run is the full `npm test` run at **2026-11-03 10:38 UTC**
(12:38 Israel). It was logged out, headless Chromium, 1 worker, visitor in Israel.

- **Result:** 24 tests, **24 passed** in 44 s, no retries used. API-07 is counted as passed because it is marked
  as an expected failure (`test.fail()`, FINDINGS.md Finding 1).
- **Full terminal output:** [run-summary.txt](run-summary.txt)
- **HTML report:** generated locally in `playwright-report/` on every run (gitignored). Open it with `npm run report`.
- **Secrets:** every file here, and the HTML report including its embedded data, was scanned for the API key
  and account ID: 0 hits. API traces are turned off in `playwright.config.ts`.

| Folder / file | Scenario | What it shows |
|---|---|---|
| [run-summary.txt](run-summary.txt) | all | One line per test, pass or fail, with timings |
| [API-07/expected-failure-error-context.md](API-07/expected-failure-error-context.md) | API-07, Finding 1 | The call **without any API key** got status **200** (the test expected 401/403). Third independent confirmation of Finding 1 |
| [A11Y-04/axe-storefront-results.json](A11Y-04/axe-storefront-results.json) | A11Y-04, Finding 3 | axe on the results page: `button-name` (critical, 3), `label` (critical, 1), `html-has-lang` (serious, 1) |
| [A11Y-04/axe-storefront-landing.json](A11Y-04/axe-storefront-landing.json) | A11Y-04 | axe on the landing page: `color-contrast` on "Search Domains". **False positive:** the computed button colour `rgb(47, 93, 255)` gives about 5.1:1 against white, which passes AA. Not reported |
| [UI-04/70-chars-length-message.png](UI-04/70-chars-length-message.png) | SF-07, UI-04, Finding 5 | 70 characters: "Domains should contain fewer than 63 characters" |
| [UI-04/63-chars-accepted.png](UI-04/63-chars-accepted.png) | UI-04, Finding 5 | Exactly 63 characters: accepted ("is already registered"), no length message |
| [observations/long-name-truncated-exact-match.png](observations/long-name-truncated-exact-match.png) | FINDINGS.md R11 | Long name truncated in the middle of the Exact Match card; full name only in a hover tooltip (10:27 UTC, exploration script) |
| [observations/rate-limited-no-prices-buy-button-active.png](observations/rate-limited-no-prices-buy-button-active.png) | FINDINGS.md R12 | During a rate-limited moment (HTTP 429): "Available now!" and active buy buttons, no prices (10:31 UTC, stability run 3 before the fix to 1 worker) |
| [observations/rate-limited-network-excerpt.json](observations/rate-limited-network-excerpt.json) | FINDINGS.md R12 | Path, method, status and timing of the domain calls in that page load: price services 429, ~50 parallel `tld-display-prices` calls. No headers, cookies or bodies |
