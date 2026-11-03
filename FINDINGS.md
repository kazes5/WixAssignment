# Findings: Wix Domains

**Owner:** Senior QA Engineer · **Tested:** 2026-11-03 (visitor in Israel, logged in to my own account, Chrome desktop)
**Source:** the manual run in [`TEST_PLAN.md`](TEST_PLAN.md). All evidence, in capture order with times, is in [`evidence/README.md`](evidence/README.md).

Each finding was:
- reproduced at least twice;
- checked against the **"Domain basics"** section of [`Requirements.md`](Requirements.md), so expected behaviour isn't reported as a bug;
- linked to the requirement or standard it breaks.

## Summary

| # | Finding | Door | Severity | Priority |
|---|---|---|---|---|
| 1 | Public Domain Search API works **without any API key** | Public API | **S2 Major** | **P1 High** |
| 2 | WHOIS shows a fake **"connection issue"** for invalid input and doubles the TLD | WHOIS | S3 Moderate | P2 Medium |
| 3 | Results page is **not usable with a screen reader**: no language, unlabelled search, unnamed buttons, results not announced | Storefront / WHOIS results | **S2 Major** | P2 Medium |
| 4 | Hebrew domain shown as **punycode** (`xn--8dbidqxju.com`) in the main "Exact Match" card | Storefront / WHOIS | S3 Moderate | P3 Low |
| 5 | Length message says "**fewer than** 63 characters" but exactly 63 is allowed | Storefront | S4 Minor | P3 Low |

### Rating scales

| Severity: how bad when it happens | Priority: how soon to fix |
|---|---|
| **S1 Critical:** wrong answer to "can I get this name?", money or data loss, or no workaround | **P0 Now:** stop-ship |
| **S2 Major:** a contract, security or legal expectation broken, or a user group blocked | **P1 High:** next sprint |
| **S3 Moderate:** misleading or confusing, but the user can recover | **P2 Medium:** plan within the quarter |
| **S4 Minor:** cosmetic or wording, no real impact | **P3 Low:** fix when touching the area |

Severity is about impact on the person affected. Priority adds **how many people hit it**, **business or legal risk**, and **cost to fix**.

---

## Finding 1: The public Domain Search API works without any API key

| | |
|---|---|
| **Door** | Public Domain Search API (`www.wixapis.com/domain-search/v2/...`) |
| **Severity** | **S2 Major.** The documented access-control contract is broken: anyone can use both endpoints anonymously, so Wix can't identify, rate-limit or attribute callers per account. The data itself (availability, suggestions) is public, which is why this isn't S1. |
| **Priority** | **P1 High.** Every caller is affected (100% reproducible). It leaves the suggestion engine and registry lookups open to unmetered anonymous use (cost and abuse risk). Whether the fix is gateway enforcement or a docs correction, it's a small, well-scoped change. |
| **Requirement broken** | Wix docs, [Check Domain Availability](https://dev.wix.com/docs/api-reference/account-level/domains/domain-search/availability-v2/check-domain-availability) and [Suggest Domains](https://dev.wix.com/docs/api-reference/account-level/domains/domain-search/suggestion-v2/suggest-domains): "This call requires an account level API key". Assignment, [`Requirements.md`](Requirements.md) → Domain basics: "To call the public API you need an account-level API key." |
| **Domain basics check** | Not covered by any "expected behaviour" item. |
| **Reproducibility** | 6 of 6 attempts, on both endpoints, in two separate sessions (Phase 2 and the Phase 3 re-check). |

**Steps to reproduce**
1. `curl "https://www.wixapis.com/domain-search/v2/check-domain-availability?domain=google.com"` with **no headers**.
2. Repeat with only `wix-account-id`, and with `Authorization: IST.invalid-key-for-testing`.
3. `curl "https://www.wixapis.com/domain-search/v2/suggest-domains?query=bakery&paging.limit=3"` with no headers.

**Expected:** `401 Unauthorized` / `403 Forbidden` and no data, as documented.
**Actual:** `200 OK` with full availability and suggestion data in every case.

| Attempt | Auth sent | Result | Evidence |
|---|---|---|---|
| 1 | Invalid key + account ID | 200, `google.com available:false` | [invalid-key.json](evidence/API-07/invalid-key.json) |
| 2 | No headers | 200, `google.com available:false` | [missing-key.json](evidence/API-07/missing-key.json) |
| 3 | Account ID only | 200, `google.com available:false` | [account-id-only.json](evidence/API-07/account-id-only.json) |
| 4 | Invalid key, suggestions endpoint | 200, 3 suggestions | [invalid-key-suggest.json](evidence/API-07/invalid-key-suggest.json) |
| 5 | No headers (Phase 3 re-check) | 200, fresh name `available:true` | [recheck-phase3-no-auth-free-name.json](evidence/API-07/recheck-phase3-no-auth-free-name.json) |
| 6 | No headers, suggestions (Phase 3 re-check) | 200, 3 suggestions | [recheck-phase3-no-auth-suggest.json](evidence/API-07/recheck-phase3-no-auth-suggest.json) |

**Notes**
- For comparison, the same calls **with** a valid key return identical data ([free-name.json](evidence/API-01/free-name.json)), so the key currently makes no difference.
- If anonymous access is intentional, the finding becomes a **documentation bug** (lower severity). Either way, the docs and the behaviour disagree.
- No load or brute-force testing was done to confirm whether rate limits exist. That's out of bounds for this assignment, and noted as an open question.

---

## Finding 2: WHOIS shows a fake "connection issue" for invalid input, and doubles the TLD

| | |
|---|---|
| **Door** | WHOIS lookup (`wix.com/domains/whois` → `/domain/result/whois...`) |
| **Severity** | **S3 Moderate.** The user is told their **internet connection** is the problem, and "Try Again" can never succeed, which is a dead end with a false message. They can recover by retyping, so it's not S2. |
| **Priority** | **P2 Medium.** Only users who type an invalid character hit it, but typos are common. The fix pattern already exists in the storefront (SF-07), so it's cheap to fix. |
| **Requirement broken** | Consistency with the storefront's own validation for the same input ([SF-07](TEST_PLAN.md#61-functional-domain-storefront)), and the expected result in [WH-03](TEST_PLAN.md#63-functional-whois-lookup). Usability heuristic "help users recognize, diagnose and recover from errors" (Nielsen #9): the message names the wrong cause. |
| **Domain basics check** | Not covered: this is an error-handling defect, not domain behaviour. |
| **Reproducibility** | 2 of 2, from two different entry points. |

**Steps to reproduce**
1. Open `https://www.wix.com/domains/whois`.
2. Type `my_bakery!.com` in "Enter a domain name or URL" and press Enter.
3. Separately, on any WHOIS results page, type `my_bakery!` in the top search box and press Enter.

**Expected:** a validation message such as the storefront's "Domains can only contain English letters, numbers, periods and hyphens", ideally with suggestions.
**Actual:**
- Step 2 goes to `/domain/result/whois?query=my_bakery!.com.com`. **`.com` is appended to input that already ends in `.com`.**
- Both entry points show **"We couldn't load this page. There is a connection issue. Check your internet and try again."**

| Evidence | What it shows |
|---|---|
| [invalid-input-from-landing-page.jpg](evidence/WH-03/invalid-input-from-landing-page.jpg) | Landing-page entry: "connection issue" page; URL with `my_bakery!.com.com` (captured 09:39 UTC) |
| [invalid-input-from-results-page.jpg](evidence/WH-03/invalid-input-from-results-page.jpg) | Results-page entry: same error page (09:39 UTC) |
| [special-characters.jpg](evidence/SF-07/special-characters.jpg) | Storefront handles the same input correctly, for comparison |
| [deep-link-with-full-url-error.jpg](evidence/WH-04/deep-link-with-full-url-error.jpg) | Related: a shared WHOIS link containing a full URL shows the same misleading error |

**Likely cause (from [`ARCHITECTURE.md` §2.3](ARCHITECTURE.md)):** the WHOIS page appends a default TLD when it doesn't recognise one, then calls the RDAP and WHOIS services with an invalid hostname. The failed call is shown as a generic network error instead of a validation message.

---

## Finding 3: The results page isn't usable with a screen reader

| | |
|---|---|
| **Door** | Storefront and WHOIS results pages (`/domain/result/...`), the pages that show the answer and the buy buttons |
| **Severity** | **S2 Major.** A screen-reader user lands on a page in an undeclared language, with a search box and buttons announced only as "edit text" and "button", and gets no announcement when results load. That makes it very hard to search again, or to know which domain a "Get It" button buys. It blocks a user group from the purchase funnel. |
| **Priority** | **P2 Medium.** It affects every assistive-technology user. There's legal exposure: the European Accessibility Act has applied to e-commerce services since June 2025, and WCAG 2.1 AA is the usual benchmark. Fixes are small attribute changes, and the landing page already does them right. Raised to P1 if accessibility compliance is a company goal this quarter. |
| **Requirement broken** | [WCAG 2.2](https://www.w3.org/TR/WCAG22/) Level A/AA: **3.1.1** Language of Page; **4.1.2** Name, Role, Value; **1.3.1** Info and Relationships; **4.1.3** Status Messages; **2.4.6** Headings and Labels. Wix links its own "Accessibility Statement" in the page footer. |
| **Domain basics check** | Not covered. |
| **Reproducibility** | Checked on the English results page and again on the German results page (`lang` also empty). The landing page passes the same checks, which confirms it's specific to the results page. |

**Steps to reproduce**
1. Open `https://www.wix.com/domain/result/?q=qa-wix-1793698242.com`.
2. Inspect `<html lang>`, the search `<input>`, the icon buttons, landmarks, headings, and any `aria-live` region (or listen with VoiceOver or NVDA).
3. Tab through the page.

**Expected:** `lang="en"`; the search box has an accessible name (as on the landing page: "Type the domain you want"); icon buttons named ("Clear search", "Search"); a `main` landmark with the `h1` first; a live region or focus move announcing the answer; buy buttons whose names include the domain.

**Actual**

| Check | WCAG | Result |
|---|---|---|
| `<html lang>` | 3.1.1 | **Empty** (also empty on `de.wix.com` results) |
| Search box name | 4.1.2 | **None**: no label, `aria-label` or placeholder |
| Clear and submit icon buttons | 4.1.2 | **No accessible name** (`data-hook=module-coreDomainSearch-clearInput`, `...-searchSubmitButton`) |
| Landmarks and headings | 1.3.1 | **No `main`**; heading order h2 → h1 → h2 |
| Results announced | 4.1.3 | **No live region** |
| "Get It" buttons | 2.4.6 | Many identical "Get It" buttons with no domain in the name (minor) |
| Keyboard focus | 2.4.7 | ✅ Visible on all stops |

| Evidence | What it shows |
|---|---|
| [results-page-dom-audit.json](evidence/A11Y-03/results-page-dom-audit.json) | Full results-page audit, including the keyboard tab order (`INPUT (no name)`, `BUTTON (no name)`), with the landing page as a comparison |
| [keyboard-focus-get-it-button.jpg](evidence/A11Y-02/keyboard-focus-get-it-button.jpg) | Focus visible (passes), but the "Get It" buttons have no domain context |
| [german-results-page.png](evidence/I18N-05/german-results-page.png) | Same results page in German (`lang` empty there too) |

**Limitation:** the automated axe-core scan couldn't run in this environment ([A11Y-04](TEST_PLAN.md#67-accessibility)). It's planned for Phase 4 with `@axe-core/playwright` and may find more.

---

## Finding 4: A Hebrew domain is shown as punycode in the main "Exact Match" card

| | |
|---|---|
| **Door** | Storefront results (also reached from WHOIS for an unregistered IDN) |
| **Severity** | **S3 Moderate.** The availability answer is **correct**, but the domain the user is asked to buy ("Make It Yours") is shown as `xn--8dbidqxju.com`, a string they won't recognise as what they typed. It undermines trust at the moment of purchase. The alternatives list on the same page shows the Hebrew correctly, so the user can recover there. |
| **Priority** | **P3 Low.** It affects only internationalised-domain searches, a small share of traffic. Higher for the Israeli market, where `.co.il` and Hebrew are actively promoted. The fix is likely a display change, since the list already decodes it. |
| **Requirement broken** | Showing Unicode to users is standard practice for IDNs ([Unicode UTS #46](https://www.unicode.org/reports/tr46/) / [RFC 5890](https://www.rfc-editor.org/rfc/rfc5890): punycode "A-labels" are for DNS, Unicode "U-labels" are for display). Internal consistency: the same page shows `קפהטעים.com` in the list. Expected result in [I18N-02](TEST_PLAN.md#68-multi-language--rtl). |
| **Domain basics check** | Not covered. The API requiring punycode is fine ([API-12](TEST_PLAN.md#62-functional-public-domain-search-api)); this is about **display**. |
| **Reproducibility** | 2 of 2 (storefront search and WHOIS → storefront). |

**Steps to reproduce**
1. Open `https://www.wix.com/domain/result/?q=קפהטעים.com`, or type `קפהטעים.com` in the storefront search.

**Expected:** the main card shows `קפהטעים.com` (optionally with the punycode as secondary text).
**Actual:** the main card shows **`xn--8dbidqxju.com`**, with "Exact Match · Available now!" and "Make It Yours". The alternatives list right below shows **`קפהטעים.com`**.

| Evidence | What it shows |
|---|---|
| [hebrew-idn-punycode-in-main-card.jpg](evidence/I18N-02/hebrew-idn-punycode-in-main-card.jpg) | Main card in punycode, list in Hebrew, on the same page (09:44 UTC) |
| [whois-hebrew-idn.jpg](evidence/I18N-06/whois-hebrew-idn.jpg) | Same result when starting from WHOIS |
| [idn-punycode.json](evidence/API-12/idn-punycode.json) | API: `xn--8dbidqxju.com` is available, so the answer is correct |

---

## Finding 5: Length message says "fewer than 63 characters", but 63 is allowed

| | |
|---|---|
| **Door** | Storefront |
| **Severity** | **S4 Minor.** Wording only. A user with a 63-character name might shorten it unnecessarily. |
| **Priority** | **P3 Low.** Very few users have 63-character names. It's a one-word copy fix ("63 characters or fewer"). |
| **Requirement broken** | [RFC 1035 §2.3.4](https://www.rfc-editor.org/rfc/rfc1035#section-2.3.4): a label is at most 63 octets. Wix's own API says "maximum allowed domain name is 63 characters (not including tld)" ([too-long.json](evidence/API-05/too-long.json)), and the docs say "3–63 characters". |
| **Domain basics check** | Not covered. |
| **Reproducibility** | 2 of 2 (the message for 70 characters, and 63 characters accepted). |

**Steps to reproduce**
1. Search 70×`a` + `.com`. The message reads "Domains should contain **fewer than 63** characters".
2. Search exactly 63×`a` + `.com`. It's accepted (and reported as registered).

**Expected:** "Domains can contain up to 63 characters", matching the API and the rule.
**Actual:** "fewer than 63", which implies 63 isn't allowed.

| Evidence | What it shows |
|---|---|
| [too-long-70-chars.jpg](evidence/SF-07/too-long-70-chars.jpg) | The message (09:35 UTC) |
| [too-long.json](evidence/API-05/too-long.json) | The API's wording: "maximum allowed … 63 characters" |
| 63-character search | Recorded in [TEST_PLAN UI-04](TEST_PLAN.md#66-ui) (page text, no screenshot) |

---

## Risks and observations (not reported as bugs)

These came up during testing. Each one is either expected per "Domain basics", a product decision, or not proven to be a defect, so they're listed here instead of above.

| # | Observation | Why it isn't a bug (yet) | Risk | Evidence |
|---|---|---|---|---|
| R1 | Taken famous names produce **trademark-style suggestions** (`googleassistantapp.com`, `googlebranding.com`) | Suggestions are generated (Domain basics) | Legal (UDRP) risk for buyers; brand trust | [taken-name-result.jpg](evidence/SF-02/taken-name-result.jpg) |
| R2 | Struck-through `.com` price **₪21.47** differs from the **₪90.19** renewal price in the page's own price data | Prices depend on location (Domain basics); the ⓘ tooltip wasn't checked | Users may misread what they pay in year 2 | [free-name-result.jpg](evidence/SF-01/free-name-result.jpg), [ARCHITECTURE §4](ARCHITECTURE.md) |
| R3 | **No Hebrew or Arabic (RTL) version** of the domain pages; `he.wix.com` returns 404 | Likely a product decision | Gap for the market where `.co.il` is pushed | [TEST_PLAN I18N-01](TEST_PLAN.md#68-multi-language--rtl) |
| R4 | Name Generator domains follow only the short name: "Rise" (bakery) → `myfundadvance.com`, `topfundrise.com` | Suggestions are generated | Lower conversion from the generator | [rise-unrelated-domains.jpg](evidence/BNG-02/rise-unrelated-domains.jpg) |
| R5 | API suggestions for Hebrew `מאפייה` are unrelated Latin names (`stitin.net`); the storefront gives Hebrew IDNs | Doors may differ (Domain basics) | Poor API results for non-Latin queries | [suggest-hebrew-query.json](evidence/API-12/suggest-hebrew-query.json), [hebrew-keyword-search.jpg](evidence/I18N-03/hebrew-keyword-search.jpg) |
| R6 | Alternatives for a taken name took **~8 s** to appear (skeleton loaders) | Single observation, not a performance test | Abandonment | [ARCHITECTURE §2.1](ARCHITECTURE.md) |
| R7 | Empty search (storefront and Name Generator) does nothing, with no hint | Harmless | Minor UX | [empty-search-no-message.jpg](evidence/SF-07/empty-search-no-message.jpg), [empty-description.jpg](evidence/BNG-03/empty-description.jpg) |
| R8 | Internally, `google.com` / `facebook.com` are classified as "belongs to a different Wix user" (`user-domains` 403, analytics `DOMAIN_IN_ANOTHER_WIX_ACCOUNT`) | The screen message was correct | Skewed analytics or offers if the label is used downstream | [ARCHITECTURE §2.1 and §5](ARCHITECTURE.md) |
| R9 | Premium pricing (first year vs renewal) **not verified**: no *available* premium domain found within budget | Untested, not failed | Premium price display is a known complaint area | [API-08 folder](evidence/API-08/) |
| R10 | Business description from the Name Generator is placed in the page URL | Common pattern | Minor privacy and analytics exposure | [ARCHITECTURE §2.2](ARCHITECTURE.md) |
