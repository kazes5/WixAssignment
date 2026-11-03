# AI Log

How AI was used in this assignment: what it did, where it was wrong, and what stayed human.
Updated throughout the work. Newest entries go at the bottom of each section.

## AI tools used

| Tool | Used for |
|---|---|
| **Claude Code** (CLI, model Claude Opus 5.5) | Main assistant: reading requirements, planning, writing docs, running shell commands, and acting as the manager of the agent team |
| **Wix plugin for Claude Code** (Wix MCP) | Searching the Wix REST docs for the Domain Search API, listing my own Wix site, a domain-suggestion check |
| **Claude in Chrome** (browser extension) | Network inspection of the 3 web doors for `ARCHITECTURE.md` (Phase 1) |
| **Playwright browser plugin** (MCP) | Checking the German site and `he.wix.com`, which the Chrome extension had no permission for (Phase 2) |
| **Playwright** (`@playwright/test`, `@axe-core/playwright`) | Test automation written by the Automation Engineer agent (Phase 4) |

Non-AI tools: `gh` CLI (GitHub), `curl` (one API connectivity check), git.

## Key prompts

| Date | Prompt (summary or quote) | Result |
|---|---|---|
| 2026-11-02 | "read the requirements and explain the required test scenarios in a simple way" | Plain-language breakdown of the 4 doors and test themes (basic answers, TLDs, input, pricing, suggestions, WHOIS, API, path to checkout). It pointed out that the requirements deliberately don't list test cases. |
| 2026-11-02 | "write a plan to describe what user scenarios we want to test for the basic answers put it in Plan.md file" | `Plan.md` with 6 user scenarios (S1–S6) and priorities. The file was later removed from the folder; its scenarios were carried into the scenario catalogue in `EXECUTION_PLAN.md`. |
| 2026-11-02 | "please review agents.md and verify its clear and all requirements are answered" | Coverage table of the requirements vs `Agents.md`, plus clarity issues. |
| 2026-11-02 | "please check if you have access to everything you need before we proceed, do not proceed yet, just check." | Checked tools, network access to the 4 doors, the API key (1 call), and the browser extension. Found gaps: no git repo, no git author name, Playwright not installed. |
| 2026-11-03 | "please check if you have access to wix" | Confirmed Wix plugin access: own site listed, docs search works, suggestions work. |
| 2026-11-03 | "review the Agents.md file once again … create a detailed execution plan … the MVP is the test plan and it's execution … connect to the repo" | Second review of `Agents.md`, `EXECUTION_PLAN.md` with phases, pieces, statuses and an API budget, and the local repo linked to GitHub. |
| 2026-11-03 | "add them to Agents.md, exclude #8 … a ppt with the tests scope, the architecture, test structure and coverage with links to deep dive … do the Architecture first" | Additions appended to `Agents.md` (nothing removed), plan reordered so architecture comes before the test plan, presentation defined as a .pptx. |
| 2026-11-03 | "mark the progress in the EXECUTION_PLAN.md. create a branch for each stage being executed, create a pull request when done. Start Phase 1" | Branch `phase-1-architecture`. The AI used Claude in Chrome to search on the 3 web doors, captured the network calls (with an in-page request hook to see request and response shapes), and wrote `ARCHITECTURE.md` with a Mermaid diagram. |
| 2026-11-03 | "merged, start Phase 2, please make sure to include UI,Functionality,accessability,Multi Language\\RTL in the test plan." | Branch `phase-2-test-plan`. API scenarios run with `curl` (evidence saved as JSON without the key); web doors tested in Chrome; German site and language checks with the Playwright browser; `TEST_PLAN.md` with 43 scenarios and results. |
| 2026-11-03 | "merged, please continue to next stage, please order the evidences so i'll be able to understand the evidence context and time of run. On the Findings, add/link the evidence and the requirement where it is relevant." | Branch `phase-3-findings`. Re-checked Finding 1 with fresh calls, generated `evidence/README.md` (56 files in capture order with times and context), wrote `FINDINGS.md` with severity/priority defences, evidence links and the requirement or standard broken for each. |
| 2026-11-03 | "please switch to main, pull and review the project, phase #3 is merged." | Review of the repo: secrets scan of the git history (clean), link and evidence-index checks, 5 issues listed (Phase 3 status stale, broken AI log table, change-log order, weak evidence for Finding 5, my section of the AI log still empty). |
| 2026-11-03 | "uese your team to fix the issues 1,2 and proceed" | Manager started the Automation Engineer agent on branch `phase-4-automation`: fixed issues 1 and 2, then Playwright suite (24 tests: API, storefront, axe, cross-door), README "How to run" and "Automation choices". Manager re-ran the API suite independently (13/13, API-07 expected failure) before opening the PR. |
| 2026-11-03 | "merged, please continue to Phase 5" | Branch `phase-5-wrap-up`. Manager drafted the README sections ("another week", 5-line quality strategy) and this section from what happened in the session; Roy approved both. Final check: fresh clone from GitHub passed 24/24, no secrets in the git history. |
| 2026-11-03 | "merged, please continue to Phase 6" | Branch `phase-6-presentation`. Designer agent wrote `presentation/OUTLINE.md` (15 slides) and listed numbers that disagreed across files; the Manager fixed the stale ones in `EXECUTION_PLAN.md`. |
| 2026-11-03 | "Please change the font and colors to resemble Wix.com, keep the text simple and eazy to understand." | Outline restyled (black/white, Wix blue `#116DFF`, open-source Wix Madefor fonts, no logo, "not an official Wix document" footer) and simplified; deck built with the pptx skill, rendered and checked slide by slide. |
| 2026-11-03 | "I would like to add a Word document of one pager that includes the description of the tested cases (manual\\Automatic), major bugs found and covarage" | Manager added a Technical Writer agent: `presentation/WixDomains_QA_OnePager.docx`, one A4 page in the same style, every number checked against its source file. |
| 2026-11-03 | "Please modify the PPT to include the following Slides: Tested Feature and it's importance, Architecture of each door, Manual tests structure and coverage, Automatic tests structure and coverage, Findings highlight (major Issues found), Requirements summary and coverage" | Designer restructured the deck into 16 slides around these 6 topics (one slide per door, a requirements traceability table with one honest ⚠️ for the self-caused 429); Manager checked the renders and opened them for review. |
| 2026-11-03 | "I am missing the Bug summary slide" | The 5-bug table already existed (slide 13); after one clarifying question Roy chose to rename it "Bug summary: five findings by customer impact". |

## Where the AI was wrong, and how it was caught

| Date | What went wrong | How it was caught | What was done |
|---|---|---|---|
| 2026-11-02 | **The AI overwrote an existing `.env` file** while saving the API key, without checking its contents first. | The AI noticed it in its own command output (the file was listed before the write) and reported it. | Previous contents (if any) were lost. Rule kept: look at a file before overwriting it. |
| 2026-11-02 | The first rewrite of `Agents.md` went **beyond the fixes I approved**. I asked for fixes 1–6 and 9; it also restructured the whole file, replaced my original wording, and referred to the requirements file by its old, misspelled name. | I rejected the edit before it was applied. | Second attempt: additions only, original text kept word for word, and all references use `Requirements.md`. |
| 2026-11-03 | The first execution plan put the full architecture **after** the test plan (with only a short recon before it), which reversed the order in the requirements. | My review of the plan. | Plan reordered: architecture (Phase 1) → test plan and manual execution (Phase 2, MVP). |
| 2026-11-03 | The browser extension's privacy filter hid query strings and some hostnames in captured requests, so the first network list was incomplete. | Many entries came back as "[BLOCKED]". | The AI added an in-page hook that records only paths, parameter names and response shapes, and doesn't print personal data or tokens. |
| 2026-11-03 | The AI's first API helper script crashed on the "no auth headers" case (an empty argument list in bash), so the first missing-key test didn't run. | The script printed an "unbound variable" error. | Fixed the script and re-ran; the result (the API answers without a key) was then confirmed 4 ways. |
| 2026-11-03 | The AI tried to load the axe accessibility scanner from a CDN into the live Wix page. | Blocked by the environment's permission check (running external code). | Not retried. Replaced with read-only DOM checks; the axe scan moves to Phase 4 via the official `@axe-core/playwright` package. |
| 2026-11-03 | The WHOIS "connection issue" first appeared on a hand-built deep link, which isn't how users search. | The AI re-ran it through the real input box before calling it a bug. | URL input through the box works (pass); invalid characters fail from both entry points (real bug). |
| 2026-11-03 | Screenshot copies in `evidence/` all had the copy time, not the capture time, so a time-ordered index built from file dates would have been wrong. | Noticed while building the evidence index. | Capture times taken from the browser tool's original file names (batch start, ±30 s) and labelled as approximate; API times come from the call script and are exact. |
| 2026-11-03 | The Automation Engineer's first unique-name format (`Date.now()` + random suffix, a 23-character label) made SF-01 fail. | The failing test; the investigation showed the storefront truncates long names in the "Exact Match" card. | Switched to `qa-wix-<unix seconds>`; the truncation was logged as observation R11. |
| 2026-11-03 | The Automation Engineer caused a `429 Too Many Requests` from wix.com's price services (about 60 result-page loads in ~15 min with 2 workers), so run 3 of the first stability check failed. | Read the trace's network log instead of retrying blindly. | 1 worker, a cool-down and spacing between runs; 3 clean runs in a row afterwards. Documented in the README; the page's behaviour under 429 logged as R12 (not reproduced on purpose). |
| 2026-11-03 | axe flagged the landing page's "Search Domains" button for contrast (2.27:1). | The agent checked the computed colour (`rgb(47, 93, 255)`, about 5.1:1, passes). | Not reported. This is why the axe scan reports results instead of failing the build. |
| 2026-11-03 | The first secrets scan of the HTML report missed the base64 zip embedded in it. | The agent noticed the embedded archive. | Decoded and re-scanned: 0 hits. Traces are off for the API projects because they record request headers. |
| 2026-11-03 | The agent first wrote "12 of 43 scenarios automated", counting headers rather than scenarios. | Its own check before committing. | Corrected to 21 of 43 (fully or partly). |
| 2026-11-03 | The Designer put a "0 results filled in before running" stat on a slide; it isn't a number from the repo. | The Designer's own visual QA against the source files. | Replaced with "8 test areas" from the `TEST_PLAN.md` summary. Rule kept: every number on a slide must come from a file. |
| 2026-11-03 | PowerPoint and Word couldn't be driven from scripts (AppleScript error -9074, timeouts), so the AI couldn't check the files in Office itself. | The render commands failed. | LibreOffice was installed with Homebrew to render previews; the real fonts had to be copied into its profile. Final check in Office left to Roy. |

## What was changed or thrown away

- `Plan.md` (basic-answers scenarios): removed from the folder; its content was merged into the scenario catalogue in `EXECUTION_PLAN.md`.
- The full rewrite of `Agents.md`: thrown away in favour of an additions-only section.
- The AI's suggestion to use separate `.claude/agents/` subagent files and to rename `Agents.md` to `AGENTS.md`: not taken (for now).

## What I chose not to hand to AI

- Reviewing and merging every pull request (PRs #1–#4): the AI never merged its own work.
- Final say on scope and order: architecture before the test plan, adding UI, accessibility and multi-language/RTL, and the evidence-ordering request.
- Deciding what counts as a real bug vs expected behaviour, and accepting the severity/priority ratings in `FINDINGS.md`.
- Approving the quality strategy and the "another week" plan in `README.md`.
- The API key itself: creating it in the Wix account. (It was pasted into the chat once; see Security notes.)

## Security notes

- The API key was pasted into the chat once to be saved in `.env`. Lesson: next time, edit `.env` directly so the key never enters the AI conversation. Consider rotating the key after the assignment.
- `.env` is in `.gitignore` and was checked to be untracked before the first commit.
