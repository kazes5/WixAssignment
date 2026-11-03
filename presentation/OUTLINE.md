# Presentation outline: Wix Domains QA, "Can I get this name?"

**Status:** draft for approval (piece 6.1). The deck (`presentation/WixDomains_QA.pptx`, piece 6.2) is built only after this outline is approved.
**Audience:** the hiring manager and the Wix QA guild. **Length:** 15 slides (title + 13 content + closing), about 15 minutes.
**Rule:** every number on a slide comes from a file in the repo. The source is named under each slide.

Repo base for deep-dive links: `https://github.com/kazes5/WixAssignment/blob/main/` (written as `…/` below).

---

## Design direction

- **Tone:** clean, calm, engineering-report feel. One message per slide, written as the slide's headline sentence.
- **Palette (Wix-neutral, no Wix logo, colours or brand fonts):**
  - Ink navy `#1B2A41` (titles, dark title/closing background)
  - Off-white `#F7F6F2` (slide background), mid-grey `#5F6B7A` (body text), hairline grey `#D9DCE1`
  - One accent, teal `#138D90`, for links, highlights and diagram arrows
  - Status colours, used only for results: pass `#2E8B57`, pass with observation `#D99A1E`, fail `#C0392B`, partial / not run `#8A94A3`
- **Typography:** Arial throughout (renders the same on Mac, Windows and Google Slides). Titles 32 pt bold, headline sentence 20 pt, body 14–16 pt. Code, endpoints and file paths in Courier New.
- **Visual style:** generous margins, left-aligned text, thin rules instead of boxes, native PowerPoint tables and shapes (editable, not pictures). Screenshots get a 1 px grey border and a caption with the scenario ID and file path. Severity/priority shown as small coloured pills.
- **Footer on every content slide:** section name on the left; on the right a **"Deep dive →"** link to the matching repo file.
- **Section divider:** a thin teal band with the section number (1 Scope, 2 Architecture, 3 Structure, 4 Coverage) at the top of each slide in that section, instead of separate divider slides (keeps the deck at 15).

---

## Slides

### 1. Title
- **Title:** Can I get this name? QA for the four Wix Domains doors
- **Key message:** How I understood, planned, tested and automated the four doors that answer one question.
- **Content:** Roy · QA Engineer home assignment · 2026-11-03 · repo link. Small line: "Built with a team of AI agents: architect, QA engineer, automation engineer, designer; managed and reviewed by me" (source: `Agents.md`, `AI_LOG.md`).
- **Visual:** dark navy background, a simple search-box line drawing with the text `qa-wix-1793698242.com` and an "Available?" answer (drawn shapes, not a Wix screenshot).
- **Link:** https://github.com/kazes5/WixAssignment

### 2. Section 1, Test scope: one question, four doors
- **Key message:** Four different doors answer "Can I get this name?", and a wrong answer means a lost sale or a user trying to buy a name they can't get.
- **Content:**
  - Domain storefront (`wix.com/domains`)
  - Business Name Generator (`wix.com/tools/business-name-generator`)
  - WHOIS lookup (`wix.com/domains/whois`)
  - Public Domain Search API (`wixapis.com/domain-search/v2`)
  - Tested 2026-11-03 from Israel, logged in to my own account (so ₪ prices and `.co.il` suggestions are expected, per "Domain basics").
- **Visual:** four cards in a row, one per door, each with the door name, its URL and one line of what it does.
- **Sources:** `Requirements.md` (the scenario), `TEST_PLAN.md` §2 (environment).
- **Deep dive:** …/Requirements.md

### 3. Section 1, Test scope: in, out, and why
- **Key message:** Scope follows customer impact: the core answer and the paths around it are in; anything that breaks the rules or costs more than it teaches is out.
- **Content (two columns):**
  - **In scope:** all 4 doors plus cross-door consistency. Test types: Functional, UI, Accessibility, Multi-language / RTL.
  - **Out, and why:** completing a purchase (rule: stop at `manage.wix.com/premium-domains/…`); load, performance and brute force (rule; API budget); all 415 sold TLDs (representative set instead: `.com`, `.co.il`, `.store`, `.online`, unsold `.de`); multiple real countries (no VPN, noted as a risk); screen-reader end-to-end (time box, replaced by DOM checks); in-depth logged-out vs logged-in; visual regression.
  - **Not reported as bugs ("Domain basics"):** unsold TLDs, varying suggestions, location-based prices, redacted WHOIS, premium pricing, API TLD formats.
  - **Budget kept:** ~119 API-key calls in total, against a target under 200.
- **Visual:** two-column table (In | Out + why), with a small "Domain basics = expected" strip underneath.
- **Sources:** `TEST_PLAN.md` §1 and §4, `ARCHITECTURE.md` §2.1 (415 TLDs), `EXECUTION_PLAN.md` API budget table (~119).
- **Deep dive:** …/TEST_PLAN.md#4-deliberately-left-out-and-why

### 4. Section 2, Architecture: the doors share one Domain Search service
- **Key message:** The storefront, WHOIS and the public API call the same `domain-search/v2` endpoints; only the login differs (browser session vs API key).
- **Content:**
  - Web doors are pages on www.wix.com (Wix's own site platform, React 18). Landing page → results page under `/domain/result/…`.
  - Shared Domain Search service: `check-domain-availability`, `suggest-domains`, `bulk/domain-availabilities/check`, `suggested-tlds`.
  - Web-only serverless services: TLD list (415 TLDs), per-TLD display prices, AI business names, WHOIS/RDAP parsing.
  - WHOIS calls the registry's RDAP server (e.g. `rdap.verisign.com`) directly from the browser.
  - Purchase hand-off to `manage.wix.com/premium-domains/…`: the testing boundary.
- **Visual:** the `ARCHITECTURE.md` §1 Mermaid diagram, redrawn as native shapes in 4 lanes: Doors → Domain Search service (shared) → Domains serverless services → Other Wix services / external RDAP. Shared calls drawn in teal; the purchase hand-off as a dashed line to a "stop here" marker.
- **Sources:** `ARCHITECTURE.md` §1 (diagram) and §2.
- **Deep dive:** …/ARCHITECTURE.md#1-the-big-picture

### 5. Section 2, Architecture: what each door adds, and what it means for testing
- **Key message:** Same engine with different inputs per door, so availability must agree everywhere, while suggestions may differ.
- **Content:**
  - Capability matrix (condensed from §3): single availability (storefront, WHOIS, API) · bulk availability (storefront only) · suggestions (all 4; limit 50 / 50 / 5; the Name Generator sends the **generated name**, not the description) · prices (web doors only; the API has only a `premium` flag) · AI names (Name Generator) · registration data (WHOIS).
  - What this means for testing: (1) one source of truth for availability → cross-door checks are P0; (2) every suggestion should be available and in a sold TLD; (3) assert on what the user sees, not on internal endpoints, which can change without notice.
  - Six risks handed from architecture to QA (e.g. the ~8 s alternatives for a taken name, Name Generator relevance).
- **Visual:** a 6-row × 4-door ✓/✗ matrix on the left; three "testing implications" callouts on the right.
- **Sources:** `ARCHITECTURE.md` §3 and §5.
- **Deep dive:** …/ARCHITECTURE.md#3-how-the-doors-relate

### 6. Section 3, Test structure: priorities by customer impact
- **Key message:** P0 protects the one answer; everything else is ranked by how badly and how often it misleads or blocks a user.
- **Content:**
  - **P0:** the core answer (free / taken), consistency between doors, path to purchase. A wrong answer is a lost sale.
  - **P1:** input handling, TLD rules, premium, API validation and auth, WHOIS edge cases, Name Generator relevance; accessibility of search and results (search is the only way into the funnel, plus legal compliance).
  - **P2:** UI polish, narrow-width layout, loading states, wording; multi-language / RTL (global audience; Hebrew is the natural RTL case since `.co.il` is sold and suggested).
- **Visual:** three horizontal priority bands (P0 / P1 / P2), each with "what" and "why".
- **Sources:** `TEST_PLAN.md` §3.
- **Deep dive:** …/TEST_PLAN.md#3-priorities-and-why

### 7. Section 3, Test structure: one scenario format, evidence for every step
- **Key message:** Every scenario uses the same format, and actual results were written only after running the step, each with its evidence.
- **Content:**
  - Format: Test scope · Scenario (ID, priority) · table of Test step | Expected | Actual | Evidence | Pass/Fail.
  - Real example, SF-01 (P0), "A user searches for a name that is free": step 2 expected "Available, the domain, a price and a buy button"; actual "Exact Match · Available now!", `qa-wix-1793698242.com`, "Make It Yours" → ✅.
  - Evidence discipline: 56 manual evidence files (screenshots and API JSON) indexed in capture order with UTC times; the API key is never stored. Free test names are timestamped (`qa-wix-<timestamp>.com`).
  - Every unexpected result was checked against "Domain basics" before being marked a fail.
- **Visual:** the SF-01 table rendered as a native table (3 rows) next to the screenshot `evidence/SF-01/free-name-result.jpg`.
- **Sources:** `TEST_PLAN.md` §2 and §6.1 (SF-01), `evidence/README.md` (56 rows).
- **Deep dive:** …/TEST_PLAN.md#6-scenarios-and-results

### 8. Section 3, Test structure: manual vs automated, and the code
- **Key message:** Automation covers the P0 answer and cheap, stable P1 checks; anything that needs human judgement, enters checkout or depends on AI output stays manual.
- **Content:**
  - Playwright (TypeScript): 24 tests covering 21 of the 43 scenarios, fully or in part (API-01 to API-11, SF-01, 02, 04, 05, 07, SF-08 partly, UI-01, UI-04, A11Y-04, X-01).
  - Stayed manual, and why: SF-03 (would enter the purchase flow), WHOIS (third-party RDAP, needs judgement), Name Generator (AI output changes every run), premium pricing (no available premium found), IDN display, keyboard and screen-reader review, one-time language checks.
  - Design choices: tests assert on availability, status and shape, never on exact prices or suggestions; no test clicks a buy button; API-07 kept as `test.fail()` so the known bug stays visible without a red build; the axe scan reports but doesn't gate; traces off where the API key is sent; 1 worker, 1 retry.
  - Single command: `npm test`.
- **Visual:** left, the code tree from README (`playwright.config.ts`, `tests/support/{wixApi,storefront}.ts`, `tests/api/*`, `tests/web/*`, `tests/cross/*`) in Courier New; right, a manual-vs-automated split bar (21 automated or partly automated / 22 manual-only, of 43).
- **Sources:** `README.md` "Automation choices", "How the code is structured", "What stayed manual"; `TEST_PLAN.md` §8.
- **Deep dive:** …/README.md#automation-choices and https://github.com/kazes5/WixAssignment/tree/main/tests

### 9. Section 4, Coverage: manual results, 43 scenarios
- **Key message:** The core answer works: every P0 scenario passed, and the doors agree with each other.
- **Content:**
  - 43 scenarios: **23 pass · 12 pass with observation · 6 fail · 2 partial / not run**.
  - Per area (Pass / Obs / Fail / Partial): storefront 8 (4/3/0/1) · API 12 (9/1/1/1) · WHOIS 4 (2/1/1/0) · Name Generator 3 (1/2/0/0) · cross-door 2 (2/0/0/0) · UI 4 (1/2/1/0) · Accessibility 4 (2/0/2/0) · Multi-language / RTL 6 (2/3/1/0).
  - The 6 fails: API-07, WH-03, A11Y-03, I18N-02, UI-04, A11Y-04 (A11Y-04 confirms A11Y-03 by automated scan).
  - The 2 partial: SF-08 and API-08 (no *available* premium domain found within budget).
- **Visual:** horizontal 100% stacked bar per area (8 bars) in the four status colours, with the 43 / 23 / 12 / 6 / 2 totals as large numbers above.
- **Sources:** `TEST_PLAN.md` "Results summary".
- **Deep dive:** …/TEST_PLAN.md#results-summary

### 10. Section 4, Coverage: the automated run
- **Key message:** One command, 24 tests, about 45 seconds, green, with the known API bug kept visible on purpose.
- **Content:**
  - Representative run 2026-11-03 10:38 UTC: **24 passed in 44.0 s**, no retries used; API-07 counted as an expected failure.
  - Split: 13 API tests, 9 web tests (7 storefront + 2 axe), 2 cross-door tests.
  - Web tests passed 3 runs in a row without retries (10:34–10:38 UTC).
  - Clean-clone check from GitHub (`npm ci` + `.env`): 24/24 passed in 46 s.
  - 19 API-key calls per full run (17 API + 2 cross-door); report and evidence scanned: 0 hits for the key or account ID.
- **Visual:** a stylised terminal block with excerpts of `evidence/automation/run-summary.txt` (the ✘ API-07 expected-failure line, a few ✓ lines, "24 passed (44.0s)"), plus a small 13 / 9 / 2 split chart.
- **Sources:** `evidence/automation/run-summary.txt`, `evidence/automation/README.md`, `README.md` "How to run the tests", `EXECUTION_PLAN.md` 4.3 and 5.4.
- **Deep dive:** …/evidence/automation/run-summary.txt and …/README.md#how-to-run-the-tests

### 11. Section 4, Coverage: five findings, rated by customer impact
- **Key message:** Five confirmed findings, each reproduced at least twice, checked against "Domain basics", with severity and priority rated separately.
- **Content (table):**

  | # | Finding | Door | Severity | Priority |
  |---|---|---|---|---|
  | 1 | Public API works without any API key | API | S2 Major | P1 High |
  | 2 | WHOIS shows a fake "connection issue" for invalid input and doubles the TLD | WHOIS | S3 Moderate | P2 Medium |
  | 3 | Results page not usable with a screen reader | Storefront / WHOIS results | S2 Major | P2 Medium |
  | 4 | Hebrew domain shown as punycode in the "Exact Match" card | Storefront / WHOIS | S3 Moderate | P3 Low |
  | 5 | "Fewer than 63 characters", but 63 is allowed | Storefront | S4 Minor | P3 Low |

  - Scale in one line: severity = how bad for the person affected; priority adds how many people, business/legal risk and cost to fix.
- **Visual:** the table with coloured severity/priority pills.
- **Sources:** `FINDINGS.md` Summary and Rating scales.
- **Deep dive:** …/FINDINGS.md#summary

### 12. Section 4, Coverage: findings 1 and 2 up close
- **Key message:** The API ignores its documented key requirement, and WHOIS blames the user's internet for a typo.
- **Content:**
  - **Finding 1 (S2 / P1):** 7 of 7 attempts, both endpoints, three sessions (Phase 2, Phase 3 re-check, Phase 4 automated test). No headers → `200` with full data. Docs: "This call requires an account level API key." If intentional, it becomes a docs bug.
  - **Finding 2 (S3 / P2):** `my_bakery!.com` from the WHOIS landing page → `/domain/result/whois?query=my_bakery!.com.com` and "We couldn't load this page. There is a connection issue." Reproduced from 2 entry points; the storefront handles the same input correctly (SF-07).
- **Visual:** left, a code card with an excerpt of `evidence/API-07/missing-key.json` (`"auth": "no auth headers"`, `"status": 200`, `"available": false`); right, screenshot `evidence/WH-03/invalid-input-from-landing-page.jpg`.
- **Sources:** `FINDINGS.md` Findings 1 and 2.
- **Deep dive:** …/FINDINGS.md#finding-1-the-public-domain-search-api-works-without-any-api-key

### 13. Section 4, Coverage: findings 3 to 5 up close
- **Key message:** The results page, where the user decides to buy, is where accessibility, IDN display and wording break down.
- **Content:**
  - **Finding 3 (S2 / P2):** results page has empty `lang`, an unlabelled search box, unnamed icon buttons, no `main`, no live region. Found by hand (A11Y-03) and confirmed by axe (A11Y-04): `button-name` critical ×3, `label` critical, `html-has-lang` serious. The landing page passes the same checks.
  - **Finding 4 (S3 / P3):** `קפהטעים.com` shown as `xn--8dbidqxju.com` in the main card, while the list below shows the Hebrew correctly.
  - **Finding 5 (S4 / P3):** 70 characters → "should contain fewer than 63 characters"; exactly 63 is accepted.
- **Visual:** three columns: (3) an axe-results mini table; (4) screenshot `evidence/I18N-02/hebrew-idn-punycode-in-main-card.jpg`; (5) screenshot `evidence/automation/UI-04/70-chars-length-message.png`.
- **Sources:** `FINDINGS.md` Findings 3–5, `evidence/automation/A11Y-04/axe-storefront-results.json`.
- **Deep dive:** …/FINDINGS.md#finding-3-the-results-page-isnt-usable-with-a-screen-reader

### 14. Section 4, Coverage: risks and observations, and what was not reported
- **Key message:** Twelve risks are recorded but not called bugs, because they are expected behaviour, product decisions or unproven.
- **Content:**
  - Highlights: trademark-style suggestions for taken famous names (R1); struck-through ₪21.47 vs ₪90.19 renewal (R2); no RTL version of the domain pages (R3); Name Generator "Rise" for a bakery → finance domains (R4); price services rate-limited → "Available now!" with no price (R12, seen once, caused by our own test volume).
  - Not reported on purpose: axe `color-contrast` on "Search Domains" (checked by hand: about 5.1:1, passes AA: an axe false positive); everything listed under "Domain basics".
  - Open: premium pricing (first year vs renewal) untested: no available premium domain found (R9).
- **Visual:** a compact 2-column list of R1–R12 (one line each) with the screenshot `evidence/BNG-02/rise-unrelated-domains.jpg` or `evidence/automation/observations/rate-limited-no-prices-buy-button-active.png` as a single supporting image.
- **Sources:** `FINDINGS.md` "Risks and observations", `TEST_PLAN.md` A11Y-04.
- **Deep dive:** …/FINDINGS.md#risks-and-observations-not-reported-as-bugs

### 15. Closing: quality strategy and next week
- **Key message:** Protect the one answer across all four doors, assert behaviour not data, and test in the user's world.
- **Content:**
  - **Quality strategy in 5 lines (verbatim headings from README):** 1. Protect the one answer. 2. Test the shared service first, then a few journeys. 3. Assert behaviour, not data. 4. Test in the user's world. 5. Watch production.
  - **With another week:** CI on every PR plus nightly; run from 3–4 countries; fault injection with `page.route` instead of load (R12); deeper cross-door checks; close the gaps (premium pricing, real VoiceOver/NVDA pass, axe baseline); get answers on Finding 1.
  - Links: README, AI_LOG.
- **Visual:** dark navy background; two columns (strategy | next week); repo URL at the bottom.
- **Sources:** `README.md` "Quality strategy for Wix Domains (5 lines)" and "What I'd do with another week".
- **Deep dive:** …/README.md#quality-strategy-for-wix-domains-5-lines

---

## Evidence to embed (all checked to exist)

| Slide | File | Size (px) | Shows |
|---|---|---|---|
| 7 | `evidence/SF-01/free-name-result.jpg` | 941×427 | SF-01: "Exact Match · Available now!" with price and "Make It Yours" |
| 12 | `evidence/WH-03/invalid-input-from-landing-page.jpg` | 941×425 | Finding 2: "connection issue" and `my_bakery!.com.com` |
| 12 | `evidence/API-07/missing-key.json` (excerpt, re-typed as text) | — | Finding 1: no auth headers → 200 |
| 13 | `evidence/I18N-02/hebrew-idn-punycode-in-main-card.jpg` | 941×425 | Finding 4: punycode main card, Hebrew list |
| 13 | `evidence/automation/UI-04/70-chars-length-message.png` | 1280×720 | Finding 5: "fewer than 63 characters" |
| 13 | `evidence/automation/A11Y-04/axe-storefront-results.json` (summarised as a table) | — | Finding 3: axe violations |
| 10 | `evidence/automation/run-summary.txt` (excerpt as text) | — | 24 passed in 44.0 s |
| 14 | `evidence/BNG-02/rise-unrelated-domains.jpg` | 941×425 | R4: "Rise" → finance-themed domains |
| 14 (alternative) | `evidence/automation/observations/rate-limited-no-prices-buy-button-active.png` | 1280×720 | R12: available, no price |

Backup (only if a slide needs it): `evidence/SF-02/taken-name-result.jpg`, `evidence/SF-05/unsold-tld-de.jpg`, `evidence/WH-01/registered-wikipedia-via-url-input.jpg`, `evidence/UI-01/mobile-width-results.jpg`.

None of these files contain the API key (`evidence/README.md`, `evidence/automation/README.md`: scanned, 0 hits). Screenshots are of public wix.com pages; they're shown as evidence, not as Wix branding.

## Number sources (for checking the deck)

| Number | Source |
|---|---|
| 43 scenarios · 23 / 12 / 6 / 2 and the per-area rows | `TEST_PLAN.md` Results summary (rows add up) |
| 24 tests, 24 passed in 44.0 s; 13 api / 9 web / 2 cross | `evidence/automation/run-summary.txt` |
| 21 of 43 scenarios automated (fully or in part) | `README.md` Automation choices; `EXECUTION_PLAN.md` 4.6 |
| 19 API-key calls per full run | `README.md`; `EXECUTION_PLAN.md` budget table |
| ~119 API-key calls total, target under 200 | `EXECUTION_PLAN.md` API call budget |
| 24/24 in 46 s from a clean clone | `EXECUTION_PLAN.md` 5.4 |
| 3 web runs in a row green | `README.md`; `EXECUTION_PLAN.md` 4.3 |
| 5 findings with S/P ratings; R1–R12 | `FINDINGS.md` |
| Finding 1: 7 of 7 attempts | `FINDINGS.md` Finding 1 |
| 56 manual evidence files | `evidence/README.md` (rows 1–56) |
| 415 TLDs sold | `ARCHITECTURE.md` §2.1 |
