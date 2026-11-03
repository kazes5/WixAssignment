Please read the Requirements.md file and create a team for the following tasks while you manage and monitor their work:

create a system architect team member that will understand the system and
will Use the browser's developer tools on the three web doors.
- Explain what each door is made of, which network calls it makes and what each call drives on the screen.
- Explain how the doors relate to each other and to the public API.
- Include a diagram of the doors, the services they call and how those connect. Any tool is fine; Mermaid works well in Gitub.
- will create an ARCHITECTURE.md file with all the data and explanations so the other agents will be able to use for their tasks.

Create a senior qa engineer that will read the requirements and the architecture Write and execute the test plan
- focus on user experience, start with e2e scenarios that can give a fast indication on failing processes, the format should be:
test scope
scenario description
test step, expected result, actual result, evidence , Failed/pass.
- this agent will create an TEST_PLAN.md file to document his work and explain his decisions.

Create An automation engineer Agent that will use playwrite to create automation, Execute and collect Evidences for the tests from the TEST_PLAN.md Using Playwrite, keep the development simple and straight forward, explain each code line.
- will create a FINDINGS.md file that will contain:
Up to 5 findings, each with evidence and a severity and priority according to cutomer impact.
If you find no real bug, report risks and observations instead.
Don't invent bugs.
- Cover the public API and at least one web door.
- It must run with a single command documented in README.md file.

## Rules
- **Never complete a purchase.** Browsing and searching are fine. Stop before checkout.
- **No load testing, brute force or scraping.** Keep API calls to a few hundred in total.
- **Test public pages and my own account only.**
- **Never commitAPI key.**
- **Keep your real commit history.** Commit as you go and don't squash. We read the commit trail.
- **Use installed tools such as wix Plugin when needed**

- **`README.md`:**
  - How to run your tests.
  - What you'd do with another week.
  - Your quality strategy for Wix Domains, in 5 lines.
- **`AI_LOG.md`:**
  - Which AI tools used and key prompts.

  Create a skilled Designer to Build a presentation
  To present your work to the hiring manager and the Wix QA guild.

---

## Additions (clarifications to the instructions above)

### Execution plan and status
- `EXECUTION_PLAN.md` is the single source of progress. **The MVP is the test plan and its manual execution.**
- Every agent updates the status of its pieces in `EXECUTION_PLAN.md` when it starts and finishes, and adds a one-line note.
- Track every API call in the API budget table in `EXECUTION_PLAN.md`.

### Order of work and handoffs
Agents work in this order. Each one reads the outputs of the agents before it.

| Order | Agent | Reads | Writes |
|---|---|---|---|
| 1 | System Architect | `Requirements.md` | `ARCHITECTURE.md` |
| 2 | Senior QA Engineer | `Requirements.md`, `ARCHITECTURE.md` | `TEST_PLAN.md`, `FINDINGS.md`, `evidence/` |
| 3 | Automation Engineer | `Requirements.md`, `ARCHITECTURE.md`, `TEST_PLAN.md`, `FINDINGS.md` | test code, `README.md` (how to run and automation choices) |
| 4 | Manager (with the human) | everything | `README.md` (final sections), `AI_LOG.md` |
| 5 | Designer | everything | presentation |

The manager doesn't start an agent until the files it reads exist.

### Expected behaviour is not a bug
- Every agent reads the **"Domain basics"** section of `Requirements.md`.
- Never report any of these as a finding:
  - unsold TLDs
  - suggestions that vary
  - location-based prices, currency or suggestions
  - redacted WHOIS data
  - availability that changes over time
  - premium pricing
  - the API's TLD formats (domain with TLD, filter without the dot)

### Test plan content
`TEST_PLAN.md` must also explain:
- **What was prioritized and why** (e.g. P0/P1, based on customer impact).
- **What was deliberately left out and why.**
- Fill in *actual result*, *evidence* and *Failed/pass* only after really running the step. Never fill in results that weren't observed.

### Findings
- The **Senior QA Engineer owns `FINDINGS.md`**, because findings come from manual exploration. The Automation Engineer adds any new issue its tests reveal, following the same rules.
- Rate **severity** (how bad the impact is) and **priority** (how soon to fix) **separately**, each with a one-line defence based on customer impact.
- Confirm every finding at least twice and check it against "Domain basics" before reporting it.

### Automation
- Explain the automation choices in `README.md`:
  - what was automated and why
  - how deep the tests go
  - how the code is structured
  - what was left manual and why
- About "explain each code line": use short comments on anything non-obvious, and explain the overall design in the README.
- Keep tests stable:
  - Use unique timestamped names for "available" checks (e.g. `qa-wix-<timestamp>.com`).
  - Assert on availability, status and response shape, never on exact suggestion lists or exact prices.

### Ownership of the wrap-up files
- The **Automation Engineer** writes the "How to run your tests" section of `README.md`.
- The **Manager** drafts the rest of `README.md` and keeps `AI_LOG.md` up to date throughout the work. The human reviews and approves both.

### API key handling
- Read the key only from `.env`, as `WIX_API_KEY` and `WIX_ACCOUNT_ID`.
- Never print it, log it, or include it in evidence files, screenshots, reports or commits.

### Commits
- Commit at the end of every piece in `EXECUTION_PLAN.md`, with a clear message.
- Check that `.env` is not staged before every commit.

### Presentation (Designer)
Build a **PowerPoint (.pptx)** deck for the hiring manager and the Wix QA guild. It covers:
1. **Test scope:** the 4 doors, what's in scope and what's out, and why.
2. **Architecture:** the doors, the services they call, and how they connect (based on the `ARCHITECTURE.md` diagram).
3. **Test structure:** priorities, scenario format, manual vs automated, and the code structure.
4. **Coverage:** which scenarios are covered (manual and automated), results, and findings.

Every section links to the matching file in the GitHub repo for a deep dive (`ARCHITECTURE.md`, `TEST_PLAN.md`, `FINDINGS.md`, test code, `README.md`). Use only real results and evidence.