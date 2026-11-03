# Test Plan: Wix Domains "Can I get this name?"

**Owner:** Senior QA Engineer · **Executed:** 2026-11-03 · **Built on:** [`ARCHITECTURE.md`](ARCHITECTURE.md)
**Evidence:** all files in capture order, with times and context, in [`evidence/README.md`](evidence/README.md) · **Findings:** [`FINDINGS.md`](FINDINGS.md)

## Results summary

| Area | Scenarios | ✅ Pass | ⚠️ Pass with observation | ❌ Fail | ⏸️ Partial / not run |
|---|---|---|---|---|---|
| Functional: storefront | 8 | 4 | 3 | 0 | 1 |
| Functional: public API | 12 | 9 | 1 | 1 | 1 |
| Functional: WHOIS | 4 | 2 | 1 | 1 | 0 |
| Functional: Name Generator | 3 | 1 | 2 | 0 | 0 |
| Functional: cross-door | 2 | 2 | 0 | 0 | 0 |
| UI | 4 | 1 | 2 | 1 | 0 |
| Accessibility | 4 | 2 | 0 | 1 | 1 |
| Multi-language / RTL | 6 | 2 | 3 | 1 | 0 |
| **Total** | **43** | **23** | **12** | **5** | **3** |

**The core answer works.** Every P0 scenario passed: free names show as available, taken names as taken, and the storefront, WHOIS, Name Generator and API agree with each other.

**Fails (candidates for `FINDINGS.md`):**

| ID | What failed | Door |
|---|---|---|
| API-07 | The public API answers **without any API key**, although the docs require an account-level key | API |
| WH-03 | Invalid input in WHOIS shows a fake **"There is a connection issue"** page and appends `.com` twice (`my_bakery!.com.com`) | WHOIS |
| A11Y-03 | Results page: no `lang`, unlabelled search box, unnamed icon buttons, no `main` landmark, no live region for results | Storefront / WHOIS results |
| I18N-02 | A Hebrew domain (`קפהטעים.com`) is shown as **punycode** (`xn--8dbidqxju.com`) in the main result card | Storefront / WHOIS |
| UI-04 | Error says domains must be "fewer than 63 characters", but exactly 63 is accepted | Storefront |

**Main observations (not bugs, but worth raising):** no Hebrew/Arabic version of the domain pages; Name Generator domains follow the short name, not the business; taken famous names produce trademark-like suggestions (`googleassistantapp.com`); slow alternatives for taken names; struck-through price vs renewal price clarity.

**API budget used in this phase:** ~32 calls with the API key, plus normal page browsing. Total so far ~45 of a target under 200.

---

## 1. Scope

**In scope**

| Door | What's tested |
|---|---|
| Domain storefront (`wix.com/domains`) | Search, availability answer, alternatives, prices shown, input handling, path to purchase (stopping before checkout) |
| Business Name Generator | Name generation, domains for a chosen name, handoff to the storefront |
| WHOIS lookup | Registered and unregistered domains, URL and invalid input |
| Public Domain Search API | Availability, suggestions, validation, auth, response shape |
| Across doors | Same answer for the same name everywhere |

**Test types** (as requested): **Functional**, **UI**, **Accessibility**, and **Multi-language / RTL**.

## 2. Approach

- **Manual, exploratory and scripted.** Each scenario has steps and an expected result written before running it. Actual results were filled in only after running the steps.
- **Web doors:** Chrome, logged in to my own Wix account, desktop 1600×900 plus a narrow mobile-like width. The Playwright browser (logged out) was used for the German site.
- **API:** `curl` with the account-level key from `.env`. Every call saves the request (without the key), status and response to `evidence/<ID>/*.json`.
- **Accessibility:** read-only DOM checks (language, landmarks, labels, names, headings, alt text), keyboard-only navigation with focus visibility, and narrow-width layout. An automated axe scan was planned but blocked in this environment (see A11Y-04); it moves to Phase 4 using Playwright's official axe package.
- **Multi-language / RTL:** the domain pages' own language list, the German version, and Hebrew input (keywords, IDN domains, a business description) on the English pages, since no RTL version exists.
- **Every unexpected result was checked against "Domain basics"** in `Requirements.md` before being marked as a fail.

**Environment notes:** visitor location **Israel**, so prices show in ₪ and `.co.il` is suggested (expected). Free test names use a timestamp (`qa-wix-1793698242.com`) so they're unregistered.

## 3. Priorities and why

| Priority | What | Why |
|---|---|---|
| **P0** | The core answer (free / taken), consistency between doors, path to purchase | A wrong answer means a lost sale, or a user who tries to buy a name they can't get. This is the whole purpose of the doors. |
| **P1** | Input handling, TLD rules, premium, API validation and auth, WHOIS edge cases, Name Generator relevance | Common real-world inputs. Wrong handling misleads users or breaks integrations. |
| **P1** | Accessibility of the search and results | Search is the only way into the funnel; a user who can't operate it can't buy. Also a legal-compliance area. |
| **P2** | UI polish, layout at narrow width, loading states, wording | Affects trust and conversion, rarely blocks the user. |
| **P2** | Multi-language / RTL | Wix serves a global audience, and Hebrew is a natural RTL case given `.co.il` is sold and suggested. |

## 4. Deliberately left out, and why

| Left out | Why |
|---|---|
| Completing a purchase or going past the purchase page | Rule of the assignment. Testing stops at the handoff to `manage.wix.com/premium-domains/...`. |
| Load, performance and brute-force testing | Rule of the assignment (API budget of a few hundred calls). Response times were only observed. |
| Every TLD (415 are sold) | Low value for the cost. A representative set was used: `.com`, `.co.il`, `.store`, `.online`, plus unsold `.de`. |
| Testing from several real countries | No VPN in this environment. Location effects are noted as a risk. |
| Screen-reader end-to-end testing (VoiceOver/NVDA) | Time box. Replaced by DOM checks of what a screen reader would announce. |
| Logged-out vs logged-in comparison in depth | Only the German site was checked logged out. |
| Visual regression | Out of scope for a first plan; screenshots are kept as a baseline. |

## 5. Test data

| Data | Value | Why |
|---|---|---|
| Free name | `qa-wix-1793698242.com` (timestamp) | Guaranteed unregistered at test time |
| Taken names | `google.com`, `facebook.com`, `wikipedia.org` | Always registered |
| Registered premium | `bakeries.store`, `bread.online` | API returns `premium:true` |
| Unsold TLD | `.de` (not in Wix's TLD list) | Tests the "not sold here" message |
| Invalid | `my_bakery!.com`, 70×`a`.com, `-qa-wix-….com`, empty | Validation |
| Boundary | 63×`a`.com | Maximum label length |
| Hebrew | `קפהטעים.com` (IDN), `מאפייה` (keyword), Hebrew business description | Multi-language / RTL |

---

## 6. Scenarios and results

Status key: ✅ Pass · ⚠️ Pass with observation · ❌ Fail · ⏸️ Partial / not run

### 6.1 Functional: Domain storefront

**Test scope:** Storefront · **Scenario SF-01 (P0):** A user searches for a name that is free.

| # | Test step | Expected result | Actual result | Evidence | Pass/Fail |
|---|---|---|---|---|---|
| 1 | Open `wix.com/domain/result/?q=qa-wix-1793698242.com` | Results page loads | Loaded | [screenshot](evidence/SF-01/free-name-result.jpg) | ✅ |
| 2 | Read the main card | "Available", the domain, a price and a buy button | "Exact Match · Available now!", `qa-wix-1793698242.com`, ~~₪21.47/yr~~ ₪0.00/yr "Free for 1 year", "Make It Yours" | same | ✅ |
| 3 | Read the alternatives | Same name in other sold TLDs, each with price and "Get It" | `.net`, `.co.il`, `.org`, `.co`… each with price and "Get It" | same | ✅ |

**Test scope:** Storefront · **Scenario SF-02 (P0):** A user searches for a name that is taken.

| # | Test step | Expected result | Actual result | Evidence | Pass/Fail |
|---|---|---|---|---|---|
| 1 | Open results for `google.com` | Clearly marked as taken, no buy action for it | "google.com is already registered. Explore some great alternatives below." No buy button for google.com | [screenshot](evidence/SF-02/taken-name-result.jpg) | ✅ |
| 2 | Check alternatives | Available alternatives offered | Hero cards `googleassistantapp.com`, `googlebranding.com`, plus a list | same | ⚠️ |

> **Observation:** for famous brands, suggestions include the trademark (`googleassistantapp.com`, `googlebranding.com`, `googleplatform.com`). Selling these is a legal (UDRP) and trust risk for buyers. Suggestions are generated (expected), so this is a risk, not a bug.

**Test scope:** Storefront · **Scenario SF-03 (P0):** A user clicks "Make It Yours" on an available name.

| # | Test step | Expected result | Actual result | Evidence | Pass/Fail |
|---|---|---|---|---|---|
| 1 | On the free-name results, click "Make It Yours" | Goes toward purchase with the same domain | Opened `manage.wix.com/premium-domains/desktop-split-page?domainName=qa-wix-1793700000.com`, page title "Domain Purchase". **Stopped there.** | Observed during the Phase 1 capture the same day; see [ARCHITECTURE.md §2.1](ARCHITECTURE.md). The browser extension has no access to manage.wix.com, so there's no screenshot | ✅ |

**Test scope:** Storefront · **Scenario SF-04 (P1):** A user types a name without a TLD.

| # | Test step | Expected result | Actual result | Evidence | Pass/Fail |
|---|---|---|---|---|---|
| 1 | Search `qa-wix-1793700000` | Results for one or more TLDs | "Best Match" `.com` and "Great Alternative" `.co.il`, plus a list | [ARCHITECTURE.md §2.1](ARCHITECTURE.md) (flow by input type) | ✅ |
| 2 | Search Hebrew keyword `מאפייה` (no TLD) | Results for one or more TLDs | `מאפייה.info`, `מאפייה.org`, `.ai`, `.net` | [screenshot](evidence/I18N-03/hebrew-keyword-search.jpg) | ✅ |

**Test scope:** Storefront · **Scenario SF-05 (P1):** A user searches a TLD that Wix doesn't sell.

| # | Test step | Expected result | Actual result | Evidence | Pass/Fail |
|---|---|---|---|---|---|
| 1 | Search `qa-wix-1793698242.de` | Clear "not offered" message, not "taken", no error | ".de domains aren't available. Explore other options below or view available extensions." Alternatives `.com`, `.net`… | [screenshot](evidence/SF-05/unsold-tld-de.jpg) | ✅ |

**Test scope:** Storefront · **Scenario SF-06 (P1):** Small input variations.

| # | Test step | Expected result | Actual result | Evidence | Pass/Fail |
|---|---|---|---|---|---|
| 1 | Search `QA-WIX-1793698242.COM` | Same answer as lowercase | Lowercased; "Exact Match · Available now!" | page text captured during the run | ✅ |
| 2 | Search full URL `https://www.qa-wix-1793698242.com/about` | Domain extracted, or a clear message | Message "Domains can only contain English letters, numbers, periods and hyphens", **but** the correct domain is shown as "Best Match" | page text captured during the run | ⚠️ |

> **Observation:** the storefront rejects a URL with a misleading character message, while WHOIS (same company, same session) accepts URLs. Users recover via the Best Match card.

**Test scope:** Storefront · **Scenario SF-07 (P1):** Invalid input.

| # | Test step | Expected result | Actual result | Evidence | Pass/Fail |
|---|---|---|---|---|---|
| 1 | Search `my_bakery!.com` | Clear validation message | "Domains can only contain English letters, numbers, periods and hyphens." Suggests `my-bakery.net` | [screenshot](evidence/SF-07/special-characters.jpg) | ✅ |
| 2 | Search 70×`a`.com | Clear length message | "Domains should contain fewer than 63 characters. Explore shorter options below." Suggestions are 63-character labels (valid) | [screenshot](evidence/SF-07/too-long-70-chars.jpg) | ✅ (wording: see UI-04) |
| 3 | Click "Search Domains" with an empty box | A hint or nothing harmful | Nothing happens; focus goes to the box; no message | [screenshot](evidence/SF-07/empty-search-no-message.jpg) | ⚠️ |

**Test scope:** Storefront and API · **Scenario SF-08 (P1):** A premium domain.

| # | Test step | Expected result | Actual result | Evidence | Pass/Fail |
|---|---|---|---|---|---|
| 1 | Find an available premium domain (API checks and suggestion searches) | One available premium domain to test pricing | Found only **registered** premium domains (`bakeries.store`, `bread.online`, `premium:true`, `available:false`). No available premium domain found within the call budget | [API-08 evidence](evidence/API-08/) | ⏸️ |
| 2 | Search `bakeries.store` in the storefront | Shown as taken | "bakeries.store is already registered." Consistent with the API | [screenshot](evidence/SF-08/registered-premium-bakeries-store.jpg) | ✅ |

> Premium price display (first year vs renewal) remains **untested**. To finish it, a known available premium domain is needed. Suggestions with `premium:true` are a good source, as is a longer search in Phase 4.

### 6.2 Functional: Public Domain Search API

All calls: `GET https://www.wixapis.com/domain-search/v2/...` with `Authorization` and `wix-account-id`, unless noted.

**Test scope:** API · **Scenarios API-01 to API-03 (P0):** The core answers.

| ID | Test step | Expected result | Actual result | Evidence | Pass/Fail |
|---|---|---|---|---|---|
| API-01 | `check-domain-availability?domain=qa-wix-1793698242.com` | 200, `available:true` | 200, `available:true`, `premium:false` | [json](evidence/API-01/free-name.json) | ✅ |
| API-02 | `check-domain-availability?domain=google.com` | 200, `available:false` | 200, `available:false` | [json](evidence/API-02/taken-name.json) | ✅ |
| API-03 | `suggest-domains?query=sourdough bakery&paging.limit=10` | 200, non-empty list of valid domains | 200, 10 suggestions (`sourdoughbakery.co.il`, `sourdoughbakeryco.com`…) | [json](evidence/API-03/suggest-bakery.json) | ✅ |

**Test scope:** API · **Scenarios API-04 to API-12 (P1):** Validation, auth, shape, variations.

| ID | Test step | Expected result | Actual result | Evidence | Pass/Fail |
|---|---|---|---|---|---|
| API-04 | Domain without TLD: `qa-wix-1793698242` | 400 with a clear error | 400 `INVALID_DOMAIN`: "a tld is missing or invalid" | [json](evidence/API-04/no-tld.json) | ✅ |
| API-05 | `my_bakery!.com`; 70×`a`.com; `-qa-wix-….com` | 400 with helpful messages | 400 "not a valid hostname"; 400 `DOMAIN_TOO_LONG` "maximum … 63 characters"; 400 "not a valid hostname" | [special](evidence/API-05/special-chars.json), [long](evidence/API-05/too-long.json), [hyphen](evidence/API-05/leading-hyphen.json) | ✅ |
| API-06 | `tlds=com` vs `tlds=.com` | Without dot works; with dot behaves as documented | `com` → 200, all `.com`; `.com` → 400 `INVALID_TLD_FORMAT` | [no dot](evidence/API-06/tld-filter-no-dot.json), [dot](evidence/API-06/tld-filter-with-dot.json) | ✅ |
| **API-07** | Call **without** a valid key: (a) no auth headers, (b) only `wix-account-id`, (c) invalid key, (d) invalid key on `suggest-domains` | **401/403**, no data. The docs say: "requires an account level API key" | **All four returned 200 with full data** | [none](evidence/API-07/missing-key.json), [account only](evidence/API-07/account-id-only.json), [invalid](evidence/API-07/invalid-key.json), [suggest](evidence/API-07/invalid-key-suggest.json) | ❌ |
| API-08 | Premium domains | `premium:true` with `premiumType` from the documented set | `bakeries.store`, `bread.online` → `premium:true`, `FIRST_YEAR_AND_RENEWAL` (both registered). No available premium found | [folder](evidence/API-08/) | ⏸️ |
| API-09 | Response shape (all 200 responses above) | `availability{domain,available,premium,premiumType}`; `suggestions[]{domain,premium}` + `pagingMetadata{count,cursors,hasNext}` | Matches the docs in every response | all API evidence | ✅ |
| API-10 | `QA-WIX-….COM`; `www.qa-wix-….com`; `" qa-wix-….com "` | Same answer, or a clear error | Uppercase → lowercased, `available:true`; `www.` → stripped, `available:true`; spaces → 400 "not a valid hostname" (clear) | [upper](evidence/API-10/uppercase.json), [www](evidence/API-10/www-prefix.json), [spaces](evidence/API-10/surrounding-spaces.json) | ✅ |
| API-11 | Unsold `.de`; sold `.co.il` | `.de` → clear "not supported"; `.co.il` → normal answer | `.de` → 400 `TLD_NOT_SUPPORTED` with the list of supported TLDs; `.co.il` → 200 `available:true` | [de](evidence/API-11/unsold-tld-de.json), [co.il](evidence/API-11/sold-tld-coil.json) | ✅ |
| API-12 | Hebrew IDN as Unicode `קפה-….com`, as punycode `xn--8dbidqxju.com`; Hebrew `suggest-domains?query=מאפייה` | Punycode works; Unicode works or gives a clear error; Hebrew query gives relevant suggestions | Unicode → 400 "not a valid hostname"; punycode → 200 `available:true`; Hebrew query → `stitine.com`, `stitin.net`… (unrelated to the word) | [unicode](evidence/API-12/idn-hebrew.json), [punycode](evidence/API-12/idn-punycode.json), [hebrew query](evidence/API-12/suggest-hebrew-query.json) | ⚠️ |

> **API-07 detail:** checked on both endpoints, repeated 4 times. This isn't "Domain basics" behaviour. The availability data itself is public, but without a key nobody can be identified, rate-limited or billed per account, and the docs promise the opposite. Candidate finding #1.
>
> **API-12 observation:** for the same Hebrew word, the storefront suggests Hebrew IDNs (`מאפייה.info`), while the API suggests unrelated Latin names (`stitin.net`). Suggestions may differ between doors (expected), but these don't relate to the query at all.

### 6.3 Functional: WHOIS lookup

**Test scope:** WHOIS · **Scenario WH-01 (P0):** A user looks up a registered domain.

| # | Test step | Expected result | Actual result | Evidence | Pass/Fail |
|---|---|---|---|---|---|
| 1 | On `wix.com/domains/whois`, type `https://www.wikipedia.org/wiki/Main_Page` (a URL, as the placeholder invites) and press Enter | URL reduced to the domain; WHOIS data shown | Query became `wikipedia.org`; "wikipedia.org is taken. A broker might be able to get it for you."; Created Jan 13, 2001, Expires Jan 13, 2027, nameservers `ns0–2.wikimedia.org`, status flags | [screenshot](evidence/WH-01/registered-wikipedia-via-url-input.jpg) | ✅ |
| 2 | Look up `google.com` | Registration data; redacted personal data is OK | Created 1997, Expires 2028, `ns1–4.google.com`; registrant redacted | [ARCHITECTURE.md §2.3](ARCHITECTURE.md) | ✅ |

**Test scope:** WHOIS · **Scenario WH-02 (P0):** A user looks up an unregistered name.

| # | Test step | Expected result | Actual result | Evidence | Pass/Fail |
|---|---|---|---|---|---|
| 1 | Look up `qa-wix-1793698242.com` | Clear "not registered / available" answer | Redirected to the storefront card "Exact Match · Available now!" with "Make It Yours". No WHOIS section or "no record" message | [screenshot](evidence/WH-02/unregistered-name.jpg) | ⚠️ |

> **Observation:** the answer is correct, but the user leaves the WHOIS tool without being told "this domain has no WHOIS record". A reasonable sales choice, but a sudden context switch.

**Test scope:** WHOIS · **Scenario WH-03 (P1):** A user enters invalid input.

| # | Test step | Expected result | Actual result | Evidence | Pass/Fail |
|---|---|---|---|---|---|
| 1 | From the WHOIS landing page, type `my_bakery!.com`, press Enter | Clear validation message (as the storefront does) | Navigates to `/domain/result/whois?query=my_bakery!.com.com` (**`.com` appended twice**) and shows **"We couldn't load this page. There is a connection issue. Check your internet and try again."** | [screenshot](evidence/WH-03/invalid-input-from-landing-page.jpg) | ❌ |
| 2 | From the WHOIS results page search box, type `my_bakery!`, press Enter | Clear validation message | Navigates to `/domain/result/whois/result?query=my_bakery!.com` and shows the same "connection issue" page | [screenshot](evidence/WH-03/invalid-input-from-results-page.jpg) | ❌ |

> Reproduced from two entry points. The user is told their internet is broken, and "Try Again" can't succeed. The storefront handles the same input correctly (SF-07). Candidate finding #2.

**Test scope:** WHOIS · **Scenario WH-04 (P1):** A shared link containing a full URL.

| # | Test step | Expected result | Actual result | Evidence | Pass/Fail |
|---|---|---|---|---|---|
| 1 | Open `wix.com/domain/result/whois?query=https://www.wikipedia.org/wiki/Main_Page` directly | Domain extracted (as the landing page does), or a clear message | "We couldn't load this page. There is a connection issue." | [screenshot](evidence/WH-04/deep-link-with-full-url-error.jpg) | ✅ for the main flow (URL works via the input, WH-01) |

> **Observation:** URL normalisation happens only in the input box, not on the results URL, so a bookmarked or shared link with a URL fails with the same misleading error as WH-03.

### 6.4 Functional: Business Name Generator

**Test scope:** Name Generator · **Scenario BNG-01 (P0):** A user generates names and sees domains.

| # | Test step | Expected result | Actual result | Evidence | Pass/Fail |
|---|---|---|---|---|---|
| 1 | Enter "I own a small bakery in Tel Aviv that sells sourdough bread", click "Generate Names" | A list of relevant names | 9 names: Doughlicious, Rise, Sourdough Society, Grain & Hearth, Pure Sourdough, Bready, Elysian Loaves, Soul Bread, Bakerly | [screenshot](evidence/BNG-01/generated-names-and-domains.jpg) | ✅ |
| 2 | Check the domains for the first name | Domains with price and "Get It" | `doughlicious.co.il`, `doughlicio.us`, `the-doughlicious.com`, `doughliciouskitchen.com`… | same | ✅ |

**Test scope:** Name Generator · **Scenario BNG-02 (P1):** Domains for a chosen name relate to the business.

| # | Test step | Expected result | Actual result | Evidence | Pass/Fail |
|---|---|---|---|---|---|
| 1 | Click the name "Rise" | Domains related to "Rise" and, ideally, to a bakery | `traprise.com`, `slaprise.com`, `myfundadvance.com`, `fundadvancenow.com`, `topfundrise.com`, `fundrisecompany.com`… | [screenshot](evidence/BNG-02/rise-unrelated-domains.jpg) | ⚠️ |

> **Observation (reproduced twice, Phase 1 and Phase 2):** only the short name is sent to `suggest-domains`, not the business description, so a single-word name gets finance-themed or odd domains. Suggestions are generated (expected), so this is a UX quality issue, not a functional bug.

**Test scope:** Name Generator · **Scenario BNG-03 (P1):** Empty description.

| # | Test step | Expected result | Actual result | Evidence | Pass/Fail |
|---|---|---|---|---|---|
| 1 | Click "Generate Names" with an empty box | A hint, or nothing harmful | Nothing happens, focus goes to the box, no message | [screenshot](evidence/BNG-03/empty-description.jpg) | ⚠️ |

### 6.5 Functional: Cross-door consistency

**Test scope:** All doors · **Scenario X-01 (P0):** The same name gives the same answer everywhere.

| # | Test step | Expected result | Actual result | Evidence | Pass/Fail |
|---|---|---|---|---|---|
| 1 | `qa-wix-1793698242.com` in API, storefront and WHOIS (same hour) | All say available | API `available:true`; storefront "Available now!"; WHOIS "Available now!" | API-01, SF-01, WH-02 | ✅ |
| 2 | `google.com` in API, storefront and WHOIS | All say taken | API `available:false`; storefront "already registered"; WHOIS "taken" with data | API-02, SF-02, WH-01 step 2 | ✅ |
| 3 | `bakeries.store` (premium) in API and storefront | Both say taken | API `available:false, premium:true`; storefront "already registered" | API-08, SF-08 | ✅ |

**Test scope:** Name Generator → storefront → API · **Scenario X-02 (P0):** A domain offered by the Name Generator is really available.

| # | Test step | Expected result | Actual result | Evidence | Pass/Fail |
|---|---|---|---|---|---|
| 1 | Take `doughliciouskitchen.com` from BNG-01 and search it in the storefront | Available | "Exact Match · Available now!" | [screenshot](evidence/X-02/bng-suggestion-in-storefront.jpg) | ✅ |
| 2 | Check `doughliciouskitchen.com` and `traprise.com` via the API | `available:true` | Both `available:true` | [json 1](evidence/X-02/bng-suggestion-doughliciouskitchen.json), [json 2](evidence/X-02/bng-suggestion-traprise.json) | ✅ |

### 6.6 UI

**Test scope:** Storefront results · **Scenario UI-01 (P2):** Layout at a narrow (mobile-like) width.

| # | Test step | Expected result | Actual result | Evidence | Pass/Fail |
|---|---|---|---|---|---|
| 1 | Resize the window to its narrowest (606 px viewport) and open the free-name results | Single column, no horizontal scroll, buy button reachable | Single column; full-width "Make It Yours"; no horizontal page scroll (the trust strip scrolls on purpose); hamburger menu | [screenshot](evidence/UI-01/mobile-width-results.jpg) | ✅ |

> The desktop browser couldn't go below 606 px, so a real phone width (360–390 px) moves to Playwright device emulation in Phase 4.

**Test scope:** Storefront · **Scenario UI-02 (P2):** Loading states.

| # | Test step | Expected result | Actual result | Evidence | Pass/Fail |
|---|---|---|---|---|---|
| 1 | Search `google.com` and watch the page load | A loading state, results within a few seconds | Skeleton placeholders shown; alternatives took **about 8 s** (`suggest-domains`) in one capture | [ARCHITECTURE.md §2.1](ARCHITECTURE.md) | ⚠️ |

**Test scope:** Storefront · **Scenario UI-03 (P2):** Prices are clear.

| # | Test step | Expected result | Actual result | Evidence | Pass/Fail |
|---|---|---|---|---|---|
| 1 | Read the `.com` price on the free-name card | The user can tell what they pay now and later | ~~₪21.47/yr~~ ₪0.00/yr, "Free for 1 year ⓘ". The struck-through ₪21.47 isn't what they pay later: the renewal price in the page's own price data is **₪90.19** | [screenshot](evidence/SF-01/free-name-result.jpg), [ARCHITECTURE.md §4](ARCHITECTURE.md) | ⚠️ |

> **Observation:** what the ⓘ tooltip says wasn't checked. Worth a quick product question on whether the struck-through price is meant to be the regular price.

**Test scope:** Storefront · **Scenario UI-04 (P2):** Validation wording matches the rule.

| # | Test step | Expected result | Actual result | Evidence | Pass/Fail |
|---|---|---|---|---|---|
| 1 | Search 70×`a`.com | Message matches the real limit (63 allowed, per API and docs) | "Domains should contain **fewer than 63** characters" | [screenshot](evidence/SF-07/too-long-70-chars.jpg) | ❌ |
| 2 | Search exactly 63×`a`.com | Accepted | Accepted ("is already registered") | page text captured during the run | ✅ |

> The message is off by one: 63 is allowed. Low impact, cheap fix. Candidate finding (low).

### 6.7 Accessibility

**Test scope:** Storefront landing · **Scenario A11Y-01 (P1):** Page basics.

| # | Test step | Expected result | Actual result | Evidence | Pass/Fail |
|---|---|---|---|---|---|
| 1 | Inspect `wix.com/domains` | `lang` set, one `h1`, logical headings, `main` landmark, labelled search box, images with alt | `lang="en"`, 1 `h1`, h1→h2→h3 order, `main`, header and nav landmarks, search `aria-label="Type the domain you want"`, 14/14 images have `alt` | DOM check during the run (comparison block in [A11Y-03 json](evidence/A11Y-03/results-page-dom-audit.json)) | ✅ |

**Test scope:** Storefront · **Scenario A11Y-02 (P1):** Keyboard-only search.

| # | Test step | Expected result | Actual result | Evidence | Pass/Fail |
|---|---|---|---|---|---|
| 1 | Tab from the top of the landing page | Logical order, visible focus | Sub-nav → search box (visible focus ring) → "Search Domains" → TLD chips; focus visible on every stop | [screenshot](evidence/A11Y-02/keyboard-focus-on-search-box.jpg) | ✅ |
| 2 | Type a name, press Enter | Search runs | Results page opened | — | ✅ |
| 3 | Tab through the results page | Reach the buy buttons with visible focus | Back → search box → 2 buttons → "Make It Yours" → "Get It"…; focus ring visible | [screenshot](evidence/A11Y-02/keyboard-focus-get-it-button.jpg) | ✅ |

**Test scope:** Storefront and WHOIS results page · **Scenario A11Y-03 (P1):** What a screen reader gets on the results page.

| # | Test step | Expected result | Actual result | Evidence | Pass/Fail |
|---|---|---|---|---|---|
| 1 | Check page language | `lang` set (WCAG 3.1.1) | `<html lang="">` (also empty on the German results page) | [json](evidence/A11Y-03/results-page-dom-audit.json) | ❌ |
| 2 | Check the search box name | Accessible name (WCAG 4.1.2) | No `aria-label`, label or placeholder | same | ❌ |
| 3 | Check icon buttons (clear, submit) | Accessible names | No names: announced only as "button" | same | ❌ |
| 4 | Check landmarks and headings | `main` landmark, `h1` first | No `main`; order is h2 → h1 → h2 | same | ❌ |
| 5 | Check results are announced | Live region or focus move after search (WCAG 4.1.3) | No live region found | same | ❌ |
| 6 | Check buy-button names | Name says which domain | Many identical "Get It" buttons without the domain in their name | same | ⚠️ |

> The landing page is in good shape (A11Y-01), but the results page, where the answer and the buy buttons are, isn't. Candidate finding #3.

**Test scope:** All web doors · **Scenario A11Y-04 (P1):** Automated accessibility scan (axe-core).

| # | Test step | Expected result | Actual result | Evidence | Pass/Fail |
|---|---|---|---|---|---|
| 1 | Run axe-core on landing and results pages | No serious or critical violations | **Not run:** loading axe from a CDN into the live page was blocked by this environment's security policy | — | ⏸️ Moved to Phase 4 (`@axe-core/playwright`) |

### 6.8 Multi-language / RTL

**Test scope:** All web doors · **Scenario I18N-01 (P2):** Which languages exist, and is there an RTL version?

| # | Test step | Expected result | Actual result | Evidence | Pass/Fail |
|---|---|---|---|---|---|
| 1 | Read the `hreflang` list on `wix.com/domains` | Language versions listed | 16: en, de, es, fr, it, ja, ko, nl, no, pl, pt, ru, sv, th, tr, zh. **No Hebrew or Arabic** | page inspection during the run | ⚠️ |
| 2 | Open `he.wix.com/domains` | Hebrew RTL page, or a redirect to English | `he.wix.com` returns **404**; in a browser `he.wix.com/domains` redirects to the English **homepage**, not the domains page | `curl` status check during the run | ⚠️ |

> **Observation:** no RTL version of the domain pages exists, even though Hebrew `.co.il` domains are sold and pushed to Israeli visitors. Product decision or gap? Worth asking. RTL testing therefore covers Hebrew **input** on the English pages (I18N-02 to I18N-04, I18N-06).

**Test scope:** Storefront · **Scenario I18N-02 (P2):** Hebrew domain name (IDN).

| # | Test step | Expected result | Actual result | Evidence | Pass/Fail |
|---|---|---|---|---|---|
| 1 | Search `קפהטעים.com` | Availability answered; domain shown as the user typed it | Answer correct ("Available now!"), but the **main card shows `xn--8dbidqxju.com`** (punycode). The alternatives list shows `קפהטעים.com` correctly, with a badge | [screenshot](evidence/I18N-02/hebrew-idn-punycode-in-main-card.jpg) | ❌ |
| 2 | Check Hebrew + `.com` direction | Readable, no bidi scrambling | `קפהטעים.com` renders correctly in the list | same | ✅ |

> A user who types Hebrew sees a technical string they don't recognise as the "Exact Match" they're asked to buy. Candidate finding #4.

**Test scope:** Storefront · **Scenario I18N-03 (P2):** Hebrew keyword search.

| # | Test step | Expected result | Actual result | Evidence | Pass/Fail |
|---|---|---|---|---|---|
| 1 | Search `מאפייה` | Relevant results, correct RTL rendering | `מאפייה.info`, `מאפייה.org`, `מאפייה.ai`, `מאפייה.net`, rendered correctly | [screenshot](evidence/I18N-03/hebrew-keyword-search.jpg) | ✅ |

**Test scope:** Name Generator · **Scenario I18N-04 (P2):** Hebrew business description.

| # | Test step | Expected result | Actual result | Evidence | Pass/Fail |
|---|---|---|---|---|---|
| 1 | Use description "אני מחזיק מאפייה קטנה בתל אביב" | Names generated; Hebrew text displayed correctly | 9 relevant English names (Doughlicious, Bakery Bliss, Flour & Flavor…) with domains; Hebrew text shown correctly in the box | [screenshot](evidence/I18N-04/bng-hebrew-description.jpg) | ⚠️ |

> **Observation:** no Hebrew names or Hebrew IDN domains are offered for a Hebrew description, although Wix sells them (I18N-03).

**Test scope:** Storefront (German) · **Scenario I18N-05 (P2):** A translated version.

| # | Test step | Expected result | Actual result | Evidence | Pass/Fail |
|---|---|---|---|---|---|
| 1 | Open `de.wix.com/domain/kaufen`, search `qa-wix-1793698242.com` | Fully translated landing and results; local number format | Landing `lang="de"`; results fully in German ("Genaue Übereinstimmung · Jetzt verfügbar!", "Jetzt sichern"); German number format `21,47 ₪/Jahr` (currency still ₪ by location, expected) | [screenshot](evidence/I18N-05/german-results-page.png) | ✅ (results page `lang` empty: see A11Y-03) |

**Test scope:** WHOIS · **Scenario I18N-06 (P2):** Hebrew domain in WHOIS.

| # | Test step | Expected result | Actual result | Evidence | Pass/Fail |
|---|---|---|---|---|---|
| 1 | WHOIS lookup of `קפהטעים.com` | Correct answer for an unregistered IDN | Redirected to the storefront: "Available now!" with the same punycode main card as I18N-02 | [screenshot](evidence/I18N-06/whois-hebrew-idn.jpg) | ⚠️ |

---

## 7. Candidate findings handed to Phase 3

Ranked by customer impact. Phase 3 re-checks each one and assigns severity and priority.

1. **API-07:** the public API works without authentication (contradicts the docs; no per-account control).
2. **WH-03:** WHOIS invalid input → fake "connection issue" error, plus a duplicated `.com`.
3. **A11Y-03:** results page accessibility gaps (lang, names, landmarks, live region).
4. **I18N-02:** Hebrew IDN shown as punycode in the main result card.
5. **UI-04:** "fewer than 63 characters" off-by-one wording.

Risks and observations: trademark-style suggestions (SF-02), struck-through vs renewal price (UI-03), no RTL version of the pages (I18N-01), Name Generator relevance (BNG-02, I18N-04), slow alternatives (UI-02), empty-input feedback (SF-07, BNG-03), premium pricing untested (SF-08).

## 8. Automation candidates for Phase 4

| Scenario | Why automate |
|---|---|
| API-01 to API-07, API-09 to API-11 | Fast, stable, cheap; API-07 guards the auth behaviour |
| SF-01, SF-02, SF-05, SF-07 | The core UI answers; assert on visible text, not prices |
| X-01 | API vs storefront agreement on one free and one taken name |
| A11Y-03 / A11Y-04 | axe scan with `@axe-core/playwright` on landing and results pages |
| UI-01 | Phone viewport (390 px) via device emulation |
