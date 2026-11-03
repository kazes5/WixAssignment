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
| **Playwright** (planned) | Test automation (Phase 4) |

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

## What was changed or thrown away

- `Plan.md` (basic-answers scenarios): removed from the folder; its content was merged into the scenario catalogue in `EXECUTION_PLAN.md`.
- The full rewrite of `Agents.md`: thrown away in favour of an additions-only section.
- The AI's suggestion to use separate `.claude/agents/` subagent files and to rename `Agents.md` to `AGENTS.md`: not taken (for now).

## What I chose not to hand to AI

_To be filled in by me (Roy)._

<!-- Ideas to consider: judging severity and priority of findings, deciding what's a real bug vs expected behaviour, the final quality strategy, entering and managing the API key, approving any commit or push. -->

## Security notes

- The API key was pasted into the chat once to be saved in `.env`. Lesson: next time, edit `.env` directly so the key never enters the AI conversation. Consider rotating the key after the assignment.
- `.env` is in `.gitignore` and was checked to be untracked before the first commit.
