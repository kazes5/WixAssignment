# Presentation outline: Wix Domains QA, "Can I get this name?"

**Status:** approved by Roy with style and wording changes (piece 6.1). Deck: `presentation/WixDomains_QA.pptx` (piece 6.2).
**Audience:** the hiring manager and the Wix QA guild. **Length:** 15 slides (title + 13 content + closing), about 15 minutes.
**Rules:** every number comes from a file in the repo (sources listed at the end). Detail goes into the "Deep dive →" link and the speaker notes, not onto the slide.

Repo base for deep-dive links: `https://github.com/kazes5/WixAssignment/blob/main/` (written as `…/` below).

---

## Design direction (Wix.com look, Roy's request)

- **Colours:**
  - Base: black `#000000` and white `#FFFFFF`
  - Main accent: Wix blue `#116DFF` (links, highlights, diagram arrows, key numbers)
  - Panels: light blue-grey `#F0F4F7`
  - Body text: dark grey `#20303C`
  - Status colours, tuned to the palette: pass `#12A150` (green), pass with observation `#F5A623` (amber, with dark text), fail `#E62E4D` (red), partial / not run `#8C9BA8` (grey)
- **Fonts:** Wix Madefor Display for headings, Wix Madefor Text for body text. Both are open source (SIL OFL) on Google Fonts.
  - They are set as the deck's theme fonts, marked as sans-serif, so PowerPoint falls back to Arial (or another sans) when they're missing.
  - **The fonts must be installed for the deck to look as designed.** They are not embedded in the file. Get them from Google Fonts ("Wix Madefor Display", "Wix Madefor Text").
  - Code and file paths: Courier New.
- **Style:** lots of white space, large bold headings, simple blocks with rounded corners, light blue-grey panels, one idea per slide. Title and closing slides are black; content slides are white.
- **Brand limits:** no Wix logo, no copied Wix artwork, nothing that looks like an official Wix document. Screenshots of public wix.com pages appear only as test evidence, with a caption naming the evidence file.
- **Footer on every content slide:** left "Roy · Wix Domains QA home assignment · not an official Wix document"; right "Deep dive →" link to the matching GitHub file; slide number.
- **Writing:** short, plain sentences; at most 3–4 bullets per slide, one line each; jargon gets a few plain words of explanation (e.g. "punycode (the encoded xn-- form)", "TLD (the ending, like .com)").

---

## Slides

Each slide: title, key message (shown under the title), on-slide content, visual, deep-dive link. Speaker notes carry the detail and numbers.

### 1. Title (black)
- **Title:** Can I get this name?
- **Subtitle:** QA for the four Wix Domains doors
- **On slide:** Roy · QA Engineer home assignment · November 2026
- **Visual:** a white rounded search pill with `qa-wix-1793698242.com` and a blue "Available" chip (drawn shapes).
- **Notes:** the four doors, the team of AI agents (architect, QA engineer, automation engineer, designer) managed and reviewed by Roy; repo link.
- **Link:** https://github.com/kazes5/WixAssignment

### 2. Four doors answer one question (Scope)
- **Key message:** A wrong answer means a lost sale, or a user trying to buy a name they can't get.
- **On slide:** 4 rounded cards: Domain storefront ("Search a name, see if it's free"), Business Name Generator ("Describe your business, get names and domains"), WHOIS lookup ("See who registered a domain"), Public API ("Developers check names in code"). One line: "Tested on 3 Nov 2026 from Israel, so prices in ₪ are expected."
- **Link:** …/Requirements.md

### 3. What we tested, and what we left out (Scope)
- **Key message:** Scope follows customer impact and the assignment rules.
- **On slide:** two panels.
  - In: all 4 doors, and whether they agree · functional, UI, accessibility, languages (incl. Hebrew).
  - Out: buying a domain (rule) · load testing (rule) · all 415 TLDs (the ending, like .com): a sample instead · other countries (no VPN).
  - Strip: "Not bugs, by design: changing suggestions, local prices, hidden WHOIS owner data, endings Wix doesn't sell." Stat: "~119 API calls, budget under 200".
- **Link:** …/TEST_PLAN.md#4-deliberately-left-out-and-why

### 4. The web doors and the API share one search service (Architecture)
- **Key message:** The storefront, WHOIS and the API ask the same service; only the login differs.
- **On slide:** diagram redrawn from `ARCHITECTURE.md` §1: 4 doors → shared Domain Search service (check availability, suggest domains) → web-only services (prices, TLD list, AI names, WHOIS data) and the domain registry outside Wix; dashed line to the purchase page with "testing stops here". Caption: "Web doors log in with the browser session; the API uses an API key."
- **Link:** …/ARCHITECTURE.md#1-the-big-picture

### 5. Same engine, so the answer must match everywhere (Architecture)
- **Key message:** Availability must agree on every door; suggestions may differ.
- **On slide:** a 5-row ✓/– matrix (availability, suggestions, prices, AI names, owner data × 4 doors) and 3 takeaways: "Availability must agree: P0 test" · "Different suggestions are normal" · "Test what users see, not internal calls".
- **Link:** …/ARCHITECTURE.md#3-how-the-doors-relate

### 6. Priorities follow customer impact (Structure)
- **Key message:** P0 protects the answer itself; the rest is ranked by how much it hurts users.
- **On slide:** three rounded bands: P0 "Free or taken, the same on every door, path to buy" (a wrong answer is a lost sale) · P1 "Input handling, API rules, WHOIS errors, accessibility" (misleads or blocks users) · P2 "Layout, loading, wording, other languages" (hurts trust, rarely blocks).
- **Link:** …/TEST_PLAN.md#3-priorities-and-why

### 7. Every step has a result and proof (Structure)
- **Key message:** One format for all 43 scenarios; results written only after running the step.
- **On slide:** the format as a row of chips (Scope → Scenario → Step → Expected → Actual → Evidence → Pass/Fail); the real SF-01 step as a small table; the SF-01 screenshot; stat "56 evidence files, time-stamped".
- **Visual:** `evidence/SF-01/free-name-result.jpg` (cropped to the result card).
- **Link:** …/TEST_PLAN.md#6-scenarios-and-results

### 8. Automate the stable checks, keep judgement manual (Structure)
- **Key message:** 24 Playwright tests cover 21 of 43 scenarios; the rest need a human or would enter checkout.
- **On slide:** two panels: Automated (API answers and rules · storefront answers · API vs storefront agree · accessibility scan) and Manual (buying flow · WHOIS · Name Generator · screen reader and Hebrew display), plus the code tree and `npm test`.
- **Links:** …/README.md#automation-choices and https://github.com/kazes5/WixAssignment/tree/main/tests

### 9. The core answer works: every P0 scenario passed (Coverage)
- **Key message:** 43 scenarios: 23 pass, 12 pass with a note, 6 fail, 2 partial.
- **On slide:** big totals and a native stacked bar chart per area (8 areas).
- **Link:** …/TEST_PLAN.md#results-summary

### 10. One command, 24 tests, all green (Coverage)
- **Key message:** The suite runs in about 45 seconds and keeps the known API bug visible on purpose.
- **On slide:** stats (24/24 passed · 44 s · web tests green 3 runs in a row · 24/24 from a fresh clone) and a terminal excerpt from `run-summary.txt`.
- **Link:** …/evidence/automation/run-summary.txt

### 11. Five real findings, rated by customer impact (Coverage)
- **Key message:** Each one reproduced at least twice and checked against "Domain basics".
- **On slide:** table with plain titles and severity / priority pills:
  1. The API answers without an API key · S2 Major · P1 High
  2. WHOIS blames your internet for a typo · S3 Moderate · P2 Medium
  3. Results page is hard to use with a screen reader · S2 Major · P2 Medium
  4. Hebrew name shown in encoded form (xn--…) · S3 Moderate · P3 Low
  5. Says "fewer than 63 characters", but 63 works · S4 Minor · P3 Low
  - Caption: "Severity = how bad it is. Priority = how soon to fix it."
- **Link:** …/FINDINGS.md#summary

### 12. Findings 1 and 2 up close (Coverage)
- **Key message:** The API ignores its own key rule, and WHOIS blames the user for a typo.
- **On slide:** left, a code card from `evidence/API-07/missing-key.json` (no auth headers → status 200, full answer) and "7 of 7 tries"; right, the WHOIS screenshot and "`my_bakery!.com` → 'There is a connection issue'".
- **Visual:** `evidence/WH-03/invalid-input-from-landing-page.jpg` (cropped).
- **Link:** …/FINDINGS.md#finding-1-the-public-domain-search-api-works-without-any-api-key

### 13. Findings 3 to 5: the results page is where it breaks (Coverage)
- **Key message:** The page where users decide to buy has the accessibility, Hebrew and wording issues.
- **On slide:** three columns: (3) screen-reader gaps, confirmed by an automated axe scan; (4) punycode (the encoded xn-- form) instead of the Hebrew name; (5) the "fewer than 63" message.
- **Visuals:** `evidence/I18N-02/hebrew-idn-punycode-in-main-card.jpg`, `evidence/automation/UI-04/70-chars-length-message.png` (both cropped).
- **Link:** …/FINDINGS.md#finding-3-the-results-page-isnt-usable-with-a-screen-reader

### 14. Twelve risks noted, not called bugs (Coverage)
- **Key message:** Some things look wrong but are expected, a product choice, or not proven yet.
- **On slide:** 4 highlights (brand-name suggestions like `googlebranding.com` · struck-through ₪21.47 vs ₪90.19 renewal · "Rise" for a bakery gets finance domains · busy price service shows "Available now!" with no price) and the BNG-02 screenshot.
- **Visual:** `evidence/BNG-02/rise-unrelated-domains.jpg` (cropped).
- **Link:** …/FINDINGS.md#risks-and-observations-not-reported-as-bugs

### 15. Protect the one answer, everywhere (closing, black)
- **On slide:** quality strategy in 5 short lines (from README) and 3 "with another week" items (CI on every PR and nightly · run from 3–4 countries · simulate failures instead of load).
- **Link:** …/README.md#quality-strategy-for-wix-domains-5-lines

---

## Evidence embedded (all checked to exist; cropped copies used in the deck)

| Slide | File | Shows |
|---|---|---|
| 7 | `evidence/SF-01/free-name-result.jpg` | SF-01: "Exact Match · Available now!" with price and "Make It Yours" |
| 12 | `evidence/WH-03/invalid-input-from-landing-page.jpg` | Finding 2: "There is a connection issue" |
| 12 | `evidence/API-07/missing-key.json` (excerpt as text) | Finding 1: no auth headers → 200 |
| 13 | `evidence/I18N-02/hebrew-idn-punycode-in-main-card.jpg` | Finding 4: punycode main card, Hebrew list |
| 13 | `evidence/automation/UI-04/70-chars-length-message.png` | Finding 5: "fewer than 63 characters" |
| 13 | `evidence/automation/A11Y-04/axe-storefront-results.json` (summarised) | Finding 3: axe results |
| 10 | `evidence/automation/run-summary.txt` (excerpt as text) | 24 passed in 44.0 s |
| 14 | `evidence/BNG-02/rise-unrelated-domains.jpg` | R4: "Rise" → finance-themed domains |

None of these files contain the API key or account ID (`evidence/README.md`, `evidence/automation/README.md`: scanned, 0 hits).

## Number sources

| Number | Source |
|---|---|
| 43 scenarios · 23 / 12 / 6 / 2 and the per-area rows | `TEST_PLAN.md` Results summary |
| 24 tests, 24 passed in 44.0 s; 13 api / 9 web / 2 cross | `evidence/automation/run-summary.txt` |
| 21 of 43 scenarios automated (fully or in part) | `README.md` Automation choices |
| 19 API-key calls per full run; ~119 total, target under 200 | `README.md`; `EXECUTION_PLAN.md` API call budget |
| 24/24 in 46 s from a clean clone; web green 3 runs in a row | `EXECUTION_PLAN.md` 5.4 and 4.3 |
| 5 findings with ratings; R1–R12; Finding 1 seen 7 of 7 times | `FINDINGS.md` |
| 56 manual evidence files | `evidence/README.md` |
| 415 TLDs sold | `ARCHITECTURE.md` §2.1 |
