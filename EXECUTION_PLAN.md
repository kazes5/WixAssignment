# Execution Plan: Wix Domains QA Assignment

This is the single place to track progress. Each agent updates the **Status** of its pieces
here when it starts and finishes, and adds a one-line note.

**MVP = the test plan and its execution** (Phase 2). The architecture (Phase 1) comes first
because the test plan and the manual testing are built on it. Phases 1 and 2 have to be
finished and committed before the later phases start.

## Status legend

| Status | Meaning |
|---|---|
| ⬜ Not started | |
| 🟦 In progress | An agent is working on it |
| ✅ Done | Output exists, done criteria met, committed |
| ⛔ Blocked | Waiting on something. Note says what |
| ⏭️ Skipped | Deliberately not done. Note says why |

## Summary

| Phase | Name | Owner | MVP? | Status |
|---|---|---|---|---|
| 0 | Setup | Manager | Prerequisite | ✅ Done |
| 1 | Architecture | System Architect | Prerequisite for the MVP | ✅ Done (PR #1 merged) |
| 2 | Test plan and manual execution | Senior QA Engineer | **Yes (MVP)** | ✅ Done (PR #2 merged) |
| 3 | Findings | Senior QA Engineer | No | ✅ Done (PR #3 merged) |
| 4 | Automation | Automation Engineer | No | 🟦 Awaiting review (branch `phase-4-automation`, not pushed) |
| 5 | Wrap-up: README and AI log | Manager and human | No | ⬜ |
| 6 | Presentation | Designer | No | ⬜ |

## Shared conventions

- **Requirements:** `Requirements.md`. Every agent reads it first, especially "Domain basics" (expected behaviour, not bugs).
- **API key:** read from `.env` as `WIX_API_KEY` and `WIX_ACCOUNT_ID`. Never print it, log it or commit it.
- **API endpoints** (confirmed from the Wix docs):
  - `GET https://www.wixapis.com/domain-search/v2/check-domain-availability?domain=<name.tld>`
  - `GET https://www.wixapis.com/domain-search/v2/suggest-domains?query=<text>&tlds=<tld>`
  - Headers: `Authorization: <WIX_API_KEY>`, `wix-account-id: <WIX_ACCOUNT_ID>`
- **Evidence:** saved under `evidence/<scenario-id>/` (screenshots, API responses as `.json`, HAR excerpts). Referenced by path in `TEST_PLAN.md`. Never include the API key in saved evidence.
- **Unique names:** "available" checks use `qa-wix-<timestamp>.com` so results don't depend on a fixed name staying free.
- **Commits:** at the end of every piece, using the message suggested in the piece. Never squash.
- **Branches and PRs:** each phase runs on its own branch (`phase-<n>-<name>`) and ends with a pull request to `main`.

## API call budget

Limit: a few hundred in total. Target: **under 200**.

| Phase | Planned | Used | Notes |
|---|---|---|---|
| 0 (connectivity checks) | 3 | 3 | 1 availability call with the key, 2 Wix plugin calls |
| 1 (architecture recon) | ~5 | ~10 | No API-key calls. Normal page browsing on the 3 doors, plus ~10 extra in-page requests to capture response shapes (2 availability, 2 suggestions, 2 user-domains, prices, TLD list, WHOIS) |
| 2 (manual execution) | ~40 | ~32 | API-key calls via `curl` (evidence in `evidence/API-*`, `evidence/X-02`), plus normal page browsing |
| 3 (findings reproduction) | ~20 | 2 | Finding 1 re-check |
| 4 (automation development and runs) | ~100 | 36 | 19 API-key calls per full run (17 api + 2 cross). Used: 1 API-only run (17) + 1 full run (19). Web-only runs and exploration scripts use no key (~110 public page loads, which hit a 429 rate limit once; see R12) |
| **Total** | **~170** | **~83** | |

---

## Phase 0: Setup

| # | Piece | Output | Done when | Status | Note |
|---|---|---|---|---|---|
| 0.1 | Store API key safely | `.env`, `.gitignore` | `.env` exists, is in `.gitignore`, key verified with one API call | ✅ | HTTP 200 on `google.com` |
| 0.2 | Connect to GitHub repo | local git repo, remote `origin` | `git remote -v` shows `kazes5/WixAssignment` | ✅ | Repo is empty; nothing pushed yet |
| 0.3 | Set git author name | git config | `git config user.name` returns a name | ✅ | Set to Roy (this repo only) |
| 0.4 | Finalize agent instructions | `Agents.md` (additions only) | Review gaps addressed, original content kept | ✅ | Additions section appended |
| 0.5 | Add this plan, `.env.example` and `AI_LOG.md` | files | Files exist | ✅ | |
| 0.6 | First commit and push | commit on `main` | Pushed to GitHub; `.env` confirmed not in the commit | ✅ | Commit bc9ba22, secret scan clean |

---

## Phase 1: Architecture

Owner: **System Architect**. Output: `ARCHITECTURE.md`.

Uses the browser's developer tools (Network tab) on the 3 web doors, and the Wix docs for the API.
Also records what the QA engineer needs for Phase 2: where the answer comes from on each
screen, location-dependent behaviour, and stable selectors.

| # | Piece | Output | Done when | Status | Note |
|---|---|---|---|---|---|
| 1.1 | Storefront network analysis | Section: what it's made of, network calls, what each call drives on screen | Calls listed with method, endpoint and purpose | ✅ | Storefront calls the same `domain-search/v2` endpoints as the public API |
| 1.2 | Name Generator network analysis | Same | Same | ✅ | |
| 1.3 | WHOIS network analysis | Same | Same | ✅ | |
| 1.4 | Public API | Section: endpoints, auth, request and response shape | Matches the docs | ✅ | |
| 1.5 | How the doors relate | Section: shared services, differences, relation to the public API | Clear comparison | ✅ | |
| 1.6 | Diagram | Mermaid diagram: doors → services → shared backends | Renders on GitHub | ✅ | |
| 1.7 | Testing notes | Section: what each call means for testing (risky areas, what to assert on, selectors) | Section exists | ✅ | 6 risks and observations handed to Phase 2 |
| 1.8 | Architecture review | Human review | User approves | ✅ | PR #1 merged |

---

## Phase 2: Test plan and manual execution (MVP)

Owner: **Senior QA Engineer**. Output: `TEST_PLAN.md` plus `evidence/`.

Built on `ARCHITECTURE.md` from Phase 1. Starts only after Phase 1 is approved.

### Pieces

| # | Piece | Output | Done when | Status | Note |
|---|---|---|---|---|---|
| 2.1 | Plan skeleton | `TEST_PLAN.md`: Scope, link to `ARCHITECTURE.md`, Approach, Priorities and why, Out of scope and why, Test data, Environments | All sections filled | ✅ | Commit: `docs: test plan skeleton` |
| 2.2 | Write P0 scenarios | Scenario tables with steps and expected results | All P0 scenarios below written; actual result and Pass/Fail still empty | ✅ | |
| 2.3 | Execute P0 scenarios | Actual result, evidence, Pass/Fail filled in | Every P0 step run and recorded with evidence | ✅ | Commit: `test: P0 scenarios executed` |
| 2.4 | Write P1 scenarios | Scenario tables | All P1 scenarios below written | ✅ | |
| 2.5 | Execute P1 scenarios | Results and evidence | Every P1 step run and recorded | ✅ | Commit: `test: P1 scenarios executed` |
| 2.6 | Execution summary | "Results summary" section: pass/fail counts, blocked items, candidate findings | Summary at the top of `TEST_PLAN.md` | ✅ | 43 scenarios: 23 pass, 12 pass with observation, 5 fail, 3 partial |
| 2.7 | MVP review | Human review | User approves the MVP | ✅ | PR #2 merged |

### Scenario catalogue

> Planning list. The executed scenarios (43, including **UI, Accessibility and Multi-language / RTL** added on request) and their results live in [`TEST_PLAN.md`](TEST_PLAN.md).

Format for each scenario in `TEST_PLAN.md`:

> **Test scope:** … **Scenario:** …
>
> | # | Test step | Expected result | Actual result | Evidence | Pass/Fail |

**P0: the core answer. If these fail, users get the wrong answer to "Can I get this name?"**

| ID | Door | Scenario | Status |
|---|---|---|---|
| SF-01 | Storefront | Search a free name (`qa-wix-<ts>.com`) → shown as available with a price and a buy action | see `TEST_PLAN.md` |
| SF-02 | Storefront | Search a taken name (`google.com`) → shown as taken, alternatives offered | see `TEST_PLAN.md` |
| API-01 | API | Check availability of a free name → `available: true` | see `TEST_PLAN.md` |
| API-02 | API | Check availability of a taken name → `available: false` | see `TEST_PLAN.md` |
| API-03 | API | Suggest domains for a query → list returned; spot-check one suggestion is available | see `TEST_PLAN.md` |
| WH-01 | WHOIS | Look up a registered domain → registration data shown (redacted fields are fine) | see `TEST_PLAN.md` |
| WH-02 | WHOIS | Look up an unregistered name → clear "not registered" message | see `TEST_PLAN.md` |
| BNG-01 | Name Generator | Enter a business description → names generated; domain availability shown | see `TEST_PLAN.md` |
| X-01 | Cross-door | Same free and taken names: storefront, API and WHOIS give consistent answers | see `TEST_PLAN.md` |
| X-02 | Cross-door | A name marked available in the Name Generator is also available in the storefront | see `TEST_PLAN.md` |
| SF-03 | Storefront | Available name → "Get it" leads toward checkout with the right domain and price. **Stop before paying** | see `TEST_PLAN.md` |

**P1: common user paths and inputs. Wrong handling misleads or blocks the user.**

| ID | Door | Scenario | Status |
|---|---|---|---|
| SF-04 | Storefront | Name without a TLD (`qa-wix-<ts>`) → results for one or more TLDs | see `TEST_PLAN.md` |
| SF-05 | Storefront | TLD Wix doesn't sell → "not offered", not "taken", no error | see `TEST_PLAN.md` |
| SF-06 | Storefront | Input variations: uppercase, spaces, `www.`, full URL → same answer or clear message | see `TEST_PLAN.md` |
| SF-07 | Storefront | Invalid input: empty, special characters, too long (>63), leading hyphen → clear validation | see `TEST_PLAN.md` |
| SF-08 | Storefront | Premium domain → higher price shown, first-year vs renewal pricing explained | see `TEST_PLAN.md` |
| API-04 | API | Domain without a TLD → clear validation error | see `TEST_PLAN.md` |
| API-05 | API | Invalid domain (special characters, >63 chars) → 400 with a helpful message | see `TEST_PLAN.md` |
| API-06 | API | TLD filter with a dot (`.com`) vs without (`com`) → documented behaviour | see `TEST_PLAN.md` |
| API-07 | API | Missing or invalid API key → 401/403, no data returned | see `TEST_PLAN.md` |
| API-08 | API | Premium domain → `premium: true` and a valid `premiumType` | see `TEST_PLAN.md` |
| API-09 | API | Response shape matches the docs (fields and types) | see `TEST_PLAN.md` |
| WH-03 | WHOIS | Invalid input (no TLD, special characters) → clear message | see `TEST_PLAN.md` |
| BNG-02 | Name Generator | Generated names → domain link opens the storefront with the right name | see `TEST_PLAN.md` |
| X-03 | Cross-door | Suggestions differ between doors → documented as an observation, not a bug | see `TEST_PLAN.md` |

**Deliberately out of scope** (explained in `TEST_PLAN.md`): completing a purchase; load,
performance and brute-force testing; every TLD; testing from multiple real countries (noted as a
risk); visual regression; screen-reader end-to-end testing; the logged-in dashboard beyond the
user's own account. (Accessibility and multi-language/RTL were added to scope on request.)

---

## Phase 3: Findings

Owner: **Senior QA Engineer** (findings come from manual exploration). Output: `FINDINGS.md`.

| # | Piece | Output | Done when | Status | Note |
|---|---|---|---|---|---|
| 3.1 | Triage candidates | Shortlist from the Phase 2 results | Each candidate checked against "Domain basics" (not expected behaviour) | ✅ | 5 findings + 10 risks/observations |
| 3.2 | Reproduce | Reproduction steps confirmed at least twice | Evidence saved | ✅ | Finding 1 re-checked with 2 fresh calls |
| 3.3 | Write up to 5 findings | Title, door, steps, expected vs actual, evidence, severity, priority, and a one-line defence of each rating | Up to 5; or risks and observations if no real bug | ✅ | Each finding links its evidence and the requirement or standard it breaks |
| 3.4 | Evidence index | `evidence/README.md`: every file in capture order with UTC and Israel time, door, scenario and context | Index exists | ✅ | Requested in review |
| 3.5 | Findings review | Human review | User approves | ✅ | PR #3 merged |

---

## Phase 4: Automation

Owner: **Automation Engineer**. Tool: Playwright (TypeScript).

| # | Piece | Output | Done when | Status | Note |
|---|---|---|---|---|---|
| 4.1 | Project skeleton | `package.json`, `playwright.config.ts`, `.env` loading with `dotenv` | `npm test` runs an empty suite | ✅ | Playwright 1.64 + dotenv; 3 projects (api, web, cross); traces off where the API key is sent |
| 4.2 | API tests | `tests/api/*.spec.ts` for API-01 to API-09 | Pass, or fail only on real findings | ✅ | 13 tests (API-01 to API-11, API-09 inside 01–03); 12 pass, API-07 marked `test.fail()` for Finding 1; 17 API calls per run |
| 4.3 | Web door tests | `tests/web/storefront.spec.ts` for SF-01 and SF-02 (plus SF-04 if stable) | Pass reliably 3 runs in a row | ✅ | SF-01, 02, 04, 05, 07, UI-01, UI-04 + A11Y-04 axe (report only); 9/9 passed 3 runs in a row (10:34–10:38 UTC, 1 worker, no retries) after an earlier 429 rate-limit failure caused by our own volume |
| 4.4 | Cross-door test | X-01: API vs storefront for one free and one taken name | Passes | ✅ | `tests/cross/x01-api-vs-storefront.spec.ts`: free and taken name agree across API and storefront; 2 API calls per run |
| 4.5 | Evidence | HTML report, screenshots and traces on failure | Report opens after a run | ✅ | `evidence/automation/` (run summary, axe JSON, Finding 5 screenshots, observations); report and evidence scanned: no key or account ID |
| 4.6 | Link results back | Automated scenario IDs marked in `TEST_PLAN.md` | Each automated scenario says so | ✅ | "Automated:" marker on 12 scenario headers (21 scenarios, fully or in part), §8 column, A11Y-04 result filled from the real run (❌, summary now 6 fail / 2 partial); FINDINGS: Finding 1 7th repro, axe and 63-char evidence, R11, R12 |
| 4.7 | README: how to run and why | Setup, single command, report location, automation choices | Someone new can run it from the README | ✅ | `README.md` created: how to run, automation choices, what stayed manual; Manager sections left as placeholders |

---

## Phase 5: Wrap-up

Owner: **Manager**, with the human writing or approving the personal sections.

| # | Piece | Output | Done when | Status | Note |
|---|---|---|---|---|---|
| 5.1 | README final sections | "What I'd do with another week", "Quality strategy in 5 lines" | Present | ⬜ | |
| 5.2 | AI log | `AI_LOG.md`: tools and key prompts, where the AI was wrong and how it was caught, what was changed or thrown away, what was not handed to AI | All 4 parts present | ⬜ | Human input required |
| 5.3 | Commit agent config | `Agents.md` and any other agent config files committed | In the repo | ⬜ | Commit: `docs: readme and AI log` |
| 5.4 | Final check | No secrets in the git history; all files present; tests run from a clean clone | Verified | ⬜ | |

---

## Phase 6: Presentation

Owner: **Designer**. Audience: the hiring manager and the Wix QA guild.

| # | Piece | Output | Done when | Status | Note |
|---|---|---|---|---|---|
| 6.1 | Outline | Sections: test scope → architecture → test structure → coverage | User approves the outline | ⬜ | |
| 6.2 | PowerPoint deck | `presentation/WixDomains_QA.pptx` | Each section links to the matching repo file (`ARCHITECTURE.md`, `TEST_PLAN.md`, `FINDINGS.md`, tests, `README.md`) for a deep dive; real results only | ⬜ | |
| 6.3 | Review | User review | Approved | ⬜ | |

---

## Change log

| Date | Change |
|---|---|
| 2026-11-03 | Phase 4 done on branch `phase-4-automation`: 24 Playwright tests (API, storefront, axe, X-01), 24/24 pass with API-07 as an expected failure (Finding 1); web 3 runs in a row green; 36 API calls; R11 and R12 added to `FINDINGS.md`; `README.md` created. Awaiting review. |
| 2026-11-03 | Housekeeping: Phase 3 marked done (PR #3 merged); AI log table fixed. |
| 2026-11-03 | Plan created. Phase 0 partly done (key stored, repo connected). |
| 2026-11-03 | Phase 3 done: `FINDINGS.md` (5 findings, 10 risks) and `evidence/README.md` index; PR opened. |
| 2026-11-03 | Phase 2 done: `TEST_PLAN.md` with 43 executed scenarios (functional, UI, accessibility, multi-language/RTL) and evidence; PR opened. |
| 2026-11-03 | Phase 1 done: `ARCHITECTURE.md` written on branch `phase-1-architecture`, PR opened for review. |
| 2026-11-03 | Architecture moved to Phase 1 (before the test plan). Presentation defined as a .pptx with deep-dive links. Git author set. |
