# Presentation outline: Wix Domains QA, "Can I get this name?"

**Status:** approved by Roy with style and wording changes (piece 6.1). Deck: `presentation/WixDomains_QA.pptx` (piece 6.2).
**Audience:** the hiring manager and the Wix QA guild. **Length:** 16 slides (title + 14 content + closing), about 15–20 minutes.
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

## Slides (restructured on Roy's request around 6 topics)

Every content slide has a small topic label above the title, a key message under it, speaker notes with the detail, and a "Deep dive →" link to its GitHub file.

| # | Topic | Title | Key message | Visual | Deep dive |
|---|---|---|---|---|---|
| 1 | Title | Can I get this name? | QA for the four Wix Domains doors | Drawn search pill | repo |
| 2 | 1 · Tested feature and its importance | "Can I get this name?" is the start of every domain sale | Four doors answer it. A wrong answer means a lost sale, or broken trust | 4 door cards, 3 "why it matters" blocks | `Requirements.md` |
| 3 | 2 · Architecture · overview | All four doors meet in one shared search service | Same service, different login | Diagram redrawn from `ARCHITECTURE.md` §1 | `ARCHITECTURE.md#1-the-big-picture` |
| 4 | 2 · Architecture · 1 of 4 | Domain storefront: the main answer card | One search fires several calls; each fills a part of the page | Made-of panel, calls → screen table, `evidence/SF-01/` | `ARCHITECTURE.md` §2.1 |
| 5 | 2 · Architecture · 2 of 4 | Business Name Generator: names first, then domains | Domains are suggested for the chosen name only | Same layout, `evidence/BNG-02/` | `ARCHITECTURE.md` §2.2 |
| 6 | 2 · Architecture · 3 of 4 | WHOIS lookup: registration data plus things to buy | Who registered it, and alternatives to buy | Same layout, `evidence/WH-01/` | `ARCHITECTURE.md` §2.3 |
| 7 | 2 · Architecture · 4 of 4 | Public API: the same answer, for developers | Two endpoints, an API key, a thinner view | Same layout, response excerpt from `evidence/API-01/free-name.json` | `ARCHITECTURE.md` §2.4 |
| 8 | 3 · Manual tests | Priorities follow customer impact, in one format | P0 protects the answer; every step has proof | P0/P1/P2 bands, format chips, "56 evidence files" | `TEST_PLAN.md#3-priorities-and-why` |
| 9 | 3 · Manual tests | 43 scenarios in 8 areas: every P0 passed | 23 / 12 / 6 / 2; some things left out on purpose | Totals, stacked bar per area, "left out and why" panel | `TEST_PLAN.md#results-summary` |
| 10 | 4 · Automated tests | Playwright, kept small: 24 tests in 3 projects | Checks the answer and response shape, never exact prices | Code tree (13 api / 9 web / 2 cross / 2 helpers), assertion depth, API-07 box | `README.md#how-the-code-is-structured` |
| 11 | 4 · Automated tests | 21 of 43 scenarios automated, all green | Stable checks automated; human judgement and checkout stay manual | 21/43, 24/24 in 44 s, 24/24 fresh clone, 3 green runs; "stayed manual" panel | `README.md#automation-choices` |
| 12 | 5 · Findings highlight | Two major issues: an open API and a screen-reader gap | Both S2 Major, reproduced, with evidence | Finding 1 JSON excerpt (`evidence/API-07/missing-key.json`); Finding 3 axe results (`evidence/automation/A11Y-04/`) | `FINDINGS.md` Finding 1 |
| 13 | 5 · Findings highlight | All five findings, rated by customer impact | Severity = how bad; priority = how soon | Table with severity/priority, "12 risks" strip | `FINDINGS.md#summary` |
| 14 | 6 · Requirements | Every deliverable is in the repo | Each row links to the file that covers it | Traceability table, 10 rows, all ✓ | `Requirements.md` |
| 15 | 6 · Requirements | The rules were kept, with one honest caveat | No purchase, small API budget, key never committed | Traceability table, 8 rows: 7 ✓, 1 partly (R12 429) | `EXECUTION_PLAN.md` |
| 16 | Closing | Protect the one answer, everywhere | 5-line quality strategy and "with another week" | Dark slide, numbered strategy | `README.md` |

### Requirements traceability (slides 14–15)

| Requirement | Status | Where |
|---|---|---|
| Architecture: parts, network calls, what each drives on screen | ✅ | `ARCHITECTURE.md` §2 |
| How the doors relate to each other and to the API | ✅ | `ARCHITECTURE.md` §3 |
| Diagram (Mermaid) | ✅ | `ARCHITECTURE.md` §1 |
| Test plan in the required format, run by hand | ✅ | `TEST_PLAN.md` §6 |
| What was prioritised, what was left out, and why | ✅ | `TEST_PLAN.md` §3–4 |
| Up to 5 findings with evidence, severity and priority | ✅ | `FINDINGS.md` |
| Playwright covering the public API and a web door | ✅ | `tests/` |
| One command, documented in README | ✅ | `README.md` (npm test) |
| README: automation choices, another week, 5-line strategy | ✅ | `README.md` |
| AI_LOG: tools, prompts, AI errors, changes, what stayed human | ✅ | `AI_LOG.md` |
| Never complete a purchase | ✅ | `TEST_PLAN.md` SF-03 |
| No load testing; a few hundred API calls (~119) | ✅ | `EXECUTION_PLAN.md` budget |
| No brute force or scraping | ⚠️ | `FINDINGS.md` R12: one 429 from our own page loads; fixed with 1 worker |
| Public pages and own account only | ✅ | `TEST_PLAN.md` §2 |
| API key never committed, logged or in evidence | ✅ | `EXECUTION_PLAN.md` 5.4 |
| Real commit history, not squashed | ✅ | GitHub commit history |
| Agent configuration committed | ✅ | `Agents.md`, `.claude/settings.json` |
| Installed tools used (Wix plugin) | ✅ | `AI_LOG.md` tools |

---

## Evidence embedded (all checked to exist; cropped copies used in the deck)

| Slide | File | Shows |
|---|---|---|
| 4 | `evidence/SF-01/free-name-result.jpg` (cropped) | Storefront main card: "Exact Match · Available now!", price, "Make It Yours" |
| 5 | `evidence/BNG-02/rise-unrelated-domains.jpg` (cropped) | "Rise" → finance-themed domains |
| 6 | `evidence/WH-01/registered-wikipedia-via-url-input.jpg` (cropped) | WHOIS domain information for wikipedia.org |
| 7 | `evidence/API-01/free-name.json` (excerpt as text) | API response shape, called with the key |
| 12 | `evidence/API-07/missing-key.json` (excerpt as text) | Finding 1: no auth headers → 200 |
| 12 | `evidence/automation/A11Y-04/axe-storefront-results.json` (summarised) | Finding 3: axe results |

None of these files contain the API key or account ID (`evidence/README.md`, `evidence/automation/README.md`: scanned, 0 hits).

## Number sources

| Number | Source |
|---|---|
| 43 scenarios · 23 / 12 / 6 / 2 and the per-area rows | `TEST_PLAN.md` Results summary |
| 24 tests, 24 passed in 44.0 s; 13 api / 9 web / 2 cross; 3 projects, 1 worker, 1 retry | `evidence/automation/run-summary.txt` |
| 21 of 43 scenarios automated (fully or in part) | `README.md` Automation choices |
| 19 API-key calls per full run; ~119 total, target under 200 | `README.md`; `EXECUTION_PLAN.md` API call budget |
| 24/24 in 46 s from a clean clone; web green 3 runs in a row | `EXECUTION_PLAN.md` 5.4 and 4.3 |
| 5 findings with ratings; R1–R12; Finding 1 seen 7 of 7 times | `FINDINGS.md` |
| 56 manual evidence files | `evidence/README.md` |
| 415 TLDs sold | `ARCHITECTURE.md` §2.1 |
