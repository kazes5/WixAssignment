# Evidence index

All evidence for `TEST_PLAN.md` and `FINDINGS.md`, **in the order it was captured** on 2026-11-03.

- **Folders** are named by scenario ID (e.g. `WH-03` = TEST_PLAN scenario WH-03).
- **Times** are UTC, with Israel time (UTC+2) next to them. API times are exact (written by the call script). Screenshot times are the start of the browser action batch that captured them (within ~30 s).
- **API JSON files** contain the request URL, the auth mode used, HTTP status and the full response. The API key is never stored.
- Rows marked **FINDING n** are the evidence behind `FINDINGS.md`.

| # | Time UTC | Israel | Door | Type | Scenario | File | What it shows |
|---|---|---|---|---|---|---|---|
| 1 | 09:30:43 | 11:30:43 | Public API | API call (HTTP 200) | API-01 | [free-name.json](API-01/free-name.json) | valid API key + wix-account-id: free name → available:true |
| 2 | 09:30:44 | 11:30:44 | Public API | API call (HTTP 200) | API-02 | [taken-name.json](API-02/taken-name.json) | valid API key + wix-account-id: google.com → available:false |
| 3 | 09:30:46 | 11:30:46 | Public API | API call (HTTP 200) | API-03 | [suggest-bakery.json](API-03/suggest-bakery.json) | valid API key + wix-account-id: suggestions for 'sourdough bakery' |
| 4 | 09:30:46 | 11:30:46 | Public API | API call (HTTP 400) | API-04 | [no-tld.json](API-04/no-tld.json) | valid API key + wix-account-id: no TLD → 400 INVALID_DOMAIN |
| 5 | 09:30:47 | 11:30:47 | Public API | API call (HTTP 400) | API-05 | [special-chars.json](API-05/special-chars.json) | valid API key + wix-account-id: my_bakery!.com → 400 |
| 6 | 09:30:47 | 11:30:47 | Public API | API call (HTTP 400) | API-05 | [too-long.json](API-05/too-long.json) | valid API key + wix-account-id: 70 chars → 400 DOMAIN_TOO_LONG |
| 7 | 09:30:48 | 11:30:48 | Public API | API call (HTTP 400) | API-05 | [leading-hyphen.json](API-05/leading-hyphen.json) | valid API key + wix-account-id: leading hyphen → 400 |
| 8 | 09:30:49 | 11:30:49 | Public API | API call (HTTP 200) | API-06 | [tld-filter-no-dot.json](API-06/tld-filter-no-dot.json) | valid API key + wix-account-id: tlds=com → 200 |
| 9 | 09:30:50 | 11:30:50 | Public API | API call (HTTP 200) | API-07 | [invalid-key.json](API-07/invalid-key.json) | invalid API key: FINDING 1 · invalid key → 200 with data |
| 10 | 09:30:50 | 11:30:50 | Public API | API call (HTTP 400) | API-06 | [tld-filter-with-dot.json](API-06/tld-filter-with-dot.json) | valid API key + wix-account-id: tlds=.com → 400 INVALID_TLD_FORMAT |
| 11 | 09:31:14 | 11:31:14 | Public API | API call (HTTP 200) | API-07 | [missing-key.json](API-07/missing-key.json) | no auth headers: FINDING 1 · no auth headers → 200 with data |
| 12 | 09:31:15 | 11:31:15 | Public API | API call (HTTP 200) | API-07 | [account-id-only.json](API-07/account-id-only.json) | wix-account-id only, no API key: FINDING 1 · account id only → 200 |
| 13 | 09:31:18 | 11:31:18 | Public API | API call (HTTP 200) | API-07 | [invalid-key-suggest.json](API-07/invalid-key-suggest.json) | invalid API key: FINDING 1 · invalid key on suggest → 200 |
| 14 | 09:31:49 | 11:31:49 | Public API | API call (HTTP 200) | API-08 | [premium-candidate-1.json](API-08/premium-candidate-1.json) | valid API key + wix-account-id: premium check-1 → premium:False |
| 15 | 09:31:49 | 11:31:49 | Public API | API call (HTTP 200) | API-08 | [premium-candidate-2.json](API-08/premium-candidate-2.json) | valid API key + wix-account-id: premium check-2 → premium:False |
| 16 | 09:31:50 | 11:31:50 | Public API | API call (HTTP 200) | API-10 | [uppercase.json](API-10/uppercase.json) | valid API key + wix-account-id: uppercase → lowercased, 200 |
| 17 | 09:31:50 | 11:31:50 | Public API | API call (HTTP 200) | API-10 | [www-prefix.json](API-10/www-prefix.json) | valid API key + wix-account-id: www. stripped, 200 |
| 18 | 09:31:51 | 11:31:51 | Public API | API call (HTTP 400) | API-10 | [surrounding-spaces.json](API-10/surrounding-spaces.json) | valid API key + wix-account-id: spaces → 400 |
| 19 | 09:31:52 | 11:31:52 | Public API | API call (HTTP 400) | API-11 | [unsold-tld-de.json](API-11/unsold-tld-de.json) | valid API key + wix-account-id: .de → 400 TLD_NOT_SUPPORTED |
| 20 | 09:31:53 | 11:31:53 | Public API | API call (HTTP 200) | API-11 | [sold-tld-coil.json](API-11/sold-tld-coil.json) | valid API key + wix-account-id: .co.il → 200 |
| 21 | 09:31:54 | 11:31:54 | Public API | API call (HTTP 400) | API-12 | [idn-hebrew.json](API-12/idn-hebrew.json) | valid API key + wix-account-id: Hebrew Unicode → 400 |
| 22 | 09:31:58 | 11:31:58 | Public API | API call (HTTP 200) | API-12 | [suggest-hebrew-query.json](API-12/suggest-hebrew-query.json) | valid API key + wix-account-id: Hebrew query → unrelated Latin suggestions |
| 23 | 09:32:26 | 11:32:26 | Public API | API call (HTTP 200) | API-12 | [idn-punycode.json](API-12/idn-punycode.json) | valid API key + wix-account-id: Hebrew as punycode → 200 |
| 24 | 09:32:34 | 11:32:34 | Public API | API call (HTTP 200) | API-08 | [suggest-premium-search.json](API-08/suggest-premium-search.json) | valid API key + wix-account-id: search for premium suggestions (none found) |
| 25 | 09:32:50 | 11:32:50 | Public API | API call (HTTP 200) | API-08 | [premium-candidate-3.json](API-08/premium-candidate-3.json) | valid API key + wix-account-id: premium check-3 → premium:False |
| 26 | 09:32:51 | 11:32:51 | Public API | API call (HTTP 200) | API-08 | [premium-candidate-4.json](API-08/premium-candidate-4.json) | valid API key + wix-account-id: premium check-4 → premium:True |
| 27 | 09:32:52 | 11:32:52 | Public API | API call (HTTP 200) | API-08 | [premium-candidate-5.json](API-08/premium-candidate-5.json) | valid API key + wix-account-id: premium check-5 → premium:True |
| 28 | 09:33:30 | 11:33:30 | Storefront | screenshot (browser batch start, ±30 s) | SF-01 | [free-name-result.jpg](SF-01/free-name-result.jpg) | Search for unique free name qa-wix-1793698242.com → 'Exact Match · Available now!' with price and 'Make It Yours' |
| 29 | 09:33:30 | 11:33:30 | Storefront | screenshot (browser batch start, ±30 s) | SF-02 | [taken-name-result.jpg](SF-02/taken-name-result.jpg) | Search google.com → 'already registered' + alternatives (incl. trademark-style googleassistantapp.com) |
| 30 | 09:34:12 | 11:34:12 | Storefront | screenshot (browser batch start, ±30 s) | SF-05 | [unsold-tld-de.jpg](SF-05/unsold-tld-de.jpg) | Search qa-wix-1793698242.de → '.de domains aren't available' + alternatives |
| 31 | 09:34:12 | 11:34:12 | Storefront | screenshot (browser batch start, ±30 s) | SF-08 | [registered-premium-bakeries-store.jpg](SF-08/registered-premium-bakeries-store.jpg) | Search bakeries.store (premium per API) → 'already registered' |
| 32 | 09:35:08 | 11:35:08 | Storefront | screenshot (browser batch start, ±30 s) | SF-07 | [special-characters.jpg](SF-07/special-characters.jpg) | Search my_bakery!.com → 'Domains can only contain English letters, numbers, periods and hyphens' |
| 33 | 09:35:08 | 11:35:08 | Storefront | screenshot (browser batch start, ±30 s) | SF-07 | [too-long-70-chars.jpg](SF-07/too-long-70-chars.jpg) | Search 70×'a'.com → 'Domains should contain fewer than 63 characters' (UI-04 wording) |
| 34 | 09:36:11 | 11:36:11 | Storefront | screenshot (browser batch start, ±30 s) | SF-07 | [empty-search-no-message.jpg](SF-07/empty-search-no-message.jpg) | Click 'Search Domains' with empty box → nothing happens, no message |
| 35 | 09:37:08 | 11:37:08 | Storefront | screenshot (browser batch start, ±30 s) | A11Y-02 | [keyboard-focus-on-search-box.jpg](A11Y-02/keyboard-focus-on-search-box.jpg) | Keyboard only: focus ring visible on the search box after Tab |
| 36 | 09:37:08 | 11:37:08 | Storefront | screenshot (browser batch start, ±30 s) | A11Y-02 | [keyboard-focus-get-it-button.jpg](A11Y-02/keyboard-focus-get-it-button.jpg) | Keyboard only on results page: focus ring on a 'Get It' button |
| 37 | 09:37:20 | 11:37:20 | Storefront results | DOM audit (approx.) | A11Y-03 | [results-page-dom-audit.json](A11Y-03/results-page-dom-audit.json) | FINDING 3 · results page: lang empty, unlabelled input, unnamed buttons, no main, no live region |
| 38 | 09:37:52 | 11:37:52 | Storefront | screenshot (browser batch start, ±30 s) | UI-01 | [mobile-width-results.jpg](UI-01/mobile-width-results.jpg) | Narrowest window (606 px viewport): single-column results, no horizontal scroll |
| 39 | 09:38:19 | 11:38:19 | WHOIS | screenshot (browser batch start, ±30 s) | WH-02 | [unregistered-name.jpg](WH-02/unregistered-name.jpg) | WHOIS for free name → redirected to storefront 'Available now!' card |
| 40 | 09:38:19 | 11:38:19 | WHOIS | screenshot (browser batch start, ±30 s) | WH-04 | [deep-link-with-full-url-error.jpg](WH-04/deep-link-with-full-url-error.jpg) | Deep link /domain/result/whois?query=<full URL> → 'There is a connection issue' |
| 41 | 09:38:53 | 11:38:53 | WHOIS | screenshot (browser batch start, ±30 s) | WH-01 | [registered-wikipedia-via-url-input.jpg](WH-01/registered-wikipedia-via-url-input.jpg) | Typed full URL in WHOIS box → normalised to wikipedia.org, registration data shown |
| 42 | 09:39:15 | 11:39:15 | WHOIS | screenshot (browser batch start, ±30 s) | WH-03 | [invalid-input-from-results-page.jpg](WH-03/invalid-input-from-results-page.jpg) | FINDING 2 · results-page box 'my_bakery!' → /whois/result?query=my_bakery!.com → 'connection issue' |
| 43 | 09:39:55 | 11:39:55 | WHOIS | screenshot (browser batch start, ±30 s) | WH-03 | [invalid-input-from-landing-page.jpg](WH-03/invalid-input-from-landing-page.jpg) | FINDING 2 · landing box 'my_bakery!.com' → query=my_bakery!.com.com → 'connection issue' |
| 44 | 09:40:55 | 11:40:55 | Name Generator | screenshot (browser batch start, ±30 s) | BNG-01 | [generated-names-and-domains.jpg](BNG-01/generated-names-and-domains.jpg) | Bakery description → 9 names; domains for 'Doughlicious' |
| 45 | 09:40:55 | 11:40:55 | Name Generator | screenshot (browser batch start, ±30 s) | BNG-03 | [empty-description.jpg](BNG-03/empty-description.jpg) | 'Generate Names' with empty description → nothing happens, no message |
| 46 | 09:41:17 | 11:41:17 | Name Generator | screenshot (browser batch start, ±30 s) | BNG-02 | [rise-unrelated-domains.jpg](BNG-02/rise-unrelated-domains.jpg) | Name 'Rise' → traprise.com, myfundadvance.com, topfundrise.com… |
| 47 | 09:41:35 | 11:41:35 | Public API | API call (HTTP 200) | X-02 | [bng-suggestion-doughliciouskitchen.json](X-02/bng-suggestion-doughliciouskitchen.json) | valid API key + wix-account-id: Name Generator suggestion → available:true |
| 48 | 09:41:36 | 11:41:36 | Public API | API call (HTTP 200) | X-02 | [bng-suggestion-traprise.json](X-02/bng-suggestion-traprise.json) | valid API key + wix-account-id: Name Generator suggestion → available:true |
| 49 | 09:41:44 | 11:41:44 | Storefront | screenshot (browser batch start, ±30 s) | X-02 | [bng-suggestion-in-storefront.jpg](X-02/bng-suggestion-in-storefront.jpg) | doughliciouskitchen.com (from Name Generator) → 'Available now!' in storefront |
| 50 | 09:44:05 | 11:44:05 | Storefront | screenshot (browser batch start, ±30 s) | I18N-02 | [hebrew-idn-punycode-in-main-card.jpg](I18N-02/hebrew-idn-punycode-in-main-card.jpg) | FINDING 4 · Search קפהטעים.com → main card shows xn--8dbidqxju.com; list shows Hebrew |
| 51 | 09:44:05 | 11:44:05 | Storefront | screenshot (browser batch start, ±30 s) | I18N-03 | [hebrew-keyword-search.jpg](I18N-03/hebrew-keyword-search.jpg) | Search Hebrew keyword מאפייה → Hebrew IDN suggestions |
| 52 | 09:44:44 | 11:44:44 | Name Generator | screenshot (browser batch start, ±30 s) | I18N-04 | [bng-hebrew-description.jpg](I18N-04/bng-hebrew-description.jpg) | Hebrew business description → English names + domains |
| 53 | 09:44:44 | 11:44:44 | WHOIS | screenshot (browser batch start, ±30 s) | I18N-06 | [whois-hebrew-idn.jpg](I18N-06/whois-hebrew-idn.jpg) | WHOIS for קפהטעים.com → storefront card with punycode (same as Finding 4) |
| 54 | 10:02:35 | 12:02:35 | Storefront (German) | screenshot (file time) | I18N-05 | [german-results-page.png](I18N-05/german-results-page.png) | de.wix.com search → fully translated results, '21,47 ₪/Jahr' |
| 55 | 10:02:48 | 12:02:48 | Public API | API call (HTTP 200) | API-07 | [recheck-phase3-no-auth-free-name.json](API-07/recheck-phase3-no-auth-free-name.json) | no auth headers: FINDING 1 · Phase 3 re-check, no auth → 200 |
| 56 | 10:02:51 | 12:02:51 | Public API | API call (HTTP 200) | API-07 | [recheck-phase3-no-auth-suggest.json](API-07/recheck-phase3-no-auth-suggest.json) | no auth headers: FINDING 1 · Phase 3 re-check, no auth on suggest → 200 |

## By scenario

| Scenario | Files |
|---|---|
| A11Y-02 | [keyboard-focus-on-search-box.jpg](A11Y-02/keyboard-focus-on-search-box.jpg), [keyboard-focus-get-it-button.jpg](A11Y-02/keyboard-focus-get-it-button.jpg) |
| A11Y-03 | [results-page-dom-audit.json](A11Y-03/results-page-dom-audit.json) |
| API-01 | [free-name.json](API-01/free-name.json) |
| API-02 | [taken-name.json](API-02/taken-name.json) |
| API-03 | [suggest-bakery.json](API-03/suggest-bakery.json) |
| API-04 | [no-tld.json](API-04/no-tld.json) |
| API-05 | [special-chars.json](API-05/special-chars.json), [too-long.json](API-05/too-long.json), [leading-hyphen.json](API-05/leading-hyphen.json) |
| API-06 | [tld-filter-no-dot.json](API-06/tld-filter-no-dot.json), [tld-filter-with-dot.json](API-06/tld-filter-with-dot.json) |
| API-07 | [invalid-key.json](API-07/invalid-key.json), [missing-key.json](API-07/missing-key.json), [account-id-only.json](API-07/account-id-only.json), [invalid-key-suggest.json](API-07/invalid-key-suggest.json), [recheck-phase3-no-auth-free-name.json](API-07/recheck-phase3-no-auth-free-name.json), [recheck-phase3-no-auth-suggest.json](API-07/recheck-phase3-no-auth-suggest.json) |
| API-08 | [premium-candidate-1.json](API-08/premium-candidate-1.json), [premium-candidate-2.json](API-08/premium-candidate-2.json), [suggest-premium-search.json](API-08/suggest-premium-search.json), [premium-candidate-3.json](API-08/premium-candidate-3.json), [premium-candidate-4.json](API-08/premium-candidate-4.json), [premium-candidate-5.json](API-08/premium-candidate-5.json) |
| API-10 | [uppercase.json](API-10/uppercase.json), [www-prefix.json](API-10/www-prefix.json), [surrounding-spaces.json](API-10/surrounding-spaces.json) |
| API-11 | [unsold-tld-de.json](API-11/unsold-tld-de.json), [sold-tld-coil.json](API-11/sold-tld-coil.json) |
| API-12 | [idn-hebrew.json](API-12/idn-hebrew.json), [suggest-hebrew-query.json](API-12/suggest-hebrew-query.json), [idn-punycode.json](API-12/idn-punycode.json) |
| BNG-01 | [generated-names-and-domains.jpg](BNG-01/generated-names-and-domains.jpg) |
| BNG-02 | [rise-unrelated-domains.jpg](BNG-02/rise-unrelated-domains.jpg) |
| BNG-03 | [empty-description.jpg](BNG-03/empty-description.jpg) |
| I18N-02 | [hebrew-idn-punycode-in-main-card.jpg](I18N-02/hebrew-idn-punycode-in-main-card.jpg) |
| I18N-03 | [hebrew-keyword-search.jpg](I18N-03/hebrew-keyword-search.jpg) |
| I18N-04 | [bng-hebrew-description.jpg](I18N-04/bng-hebrew-description.jpg) |
| I18N-05 | [german-results-page.png](I18N-05/german-results-page.png) |
| I18N-06 | [whois-hebrew-idn.jpg](I18N-06/whois-hebrew-idn.jpg) |
| SF-01 | [free-name-result.jpg](SF-01/free-name-result.jpg) |
| SF-02 | [taken-name-result.jpg](SF-02/taken-name-result.jpg) |
| SF-05 | [unsold-tld-de.jpg](SF-05/unsold-tld-de.jpg) |
| SF-07 | [special-characters.jpg](SF-07/special-characters.jpg), [too-long-70-chars.jpg](SF-07/too-long-70-chars.jpg), [empty-search-no-message.jpg](SF-07/empty-search-no-message.jpg) |
| SF-08 | [registered-premium-bakeries-store.jpg](SF-08/registered-premium-bakeries-store.jpg) |
| UI-01 | [mobile-width-results.jpg](UI-01/mobile-width-results.jpg) |
| WH-01 | [registered-wikipedia-via-url-input.jpg](WH-01/registered-wikipedia-via-url-input.jpg) |
| WH-02 | [unregistered-name.jpg](WH-02/unregistered-name.jpg) |
| WH-03 | [invalid-input-from-results-page.jpg](WH-03/invalid-input-from-results-page.jpg), [invalid-input-from-landing-page.jpg](WH-03/invalid-input-from-landing-page.jpg) |
| WH-04 | [deep-link-with-full-url-error.jpg](WH-04/deep-link-with-full-url-error.jpg) |
| X-02 | [bng-suggestion-doughliciouskitchen.json](X-02/bng-suggestion-doughliciouskitchen.json), [bng-suggestion-traprise.json](X-02/bng-suggestion-traprise.json), [bng-suggestion-in-storefront.jpg](X-02/bng-suggestion-in-storefront.jpg) |
