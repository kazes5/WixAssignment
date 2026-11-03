# QA Engineer, Wix Domains: Home Assignment


## The scenario

A user wants to know one thing: **"Can I get this name?"** At Wix there are four doors that answer it:

| Door | Where |
|---|---|
| Domain storefront | https://www.wix.com/domains |
| Business Name Generator | https://www.wix.com/tools/business-name-generator |
| WHOIS lookup | https://www.wix.com/domains/whois |
| Public Domain Search API | https://dev.wix.com/docs/api-reference/account-level/domains/domain-search/introduction |

Imagine you're joining tomorrow as the QA owner of these surfaces. Show us how you'd understand them, plan their testing, test them and automate them.

---

## Domain basics

This is context, not a list of test cases. It's here so you don't spend your time reporting expected behavior as bugs.

- **Wix doesn't sell every TLD.** A TLD is the ending, like `.com` or `.co.il`. A name can be free at the registry and still not be for sale on Wix.
- **API input formats differ.** In the API, a domain must include its TLD (`mybakery.com`), but the TLD filter is passed without the dot (`com`, not `.com`).
- **Premium domains cost more** than the standard price for their TLD. Sometimes the higher price applies only in the first year, sometimes on renewal too.
- **Prices, currency and some suggestions depend on where you are.** For example, a visitor in Israel may be offered `.co.il` names that a visitor elsewhere won't see.
- **Suggestions are generated,** so they can differ between calls and between doors.
- **WHOIS data for most registered domains is redacted** for privacy. That's normal.
- **Availability is a point-in-time answer.** A name that's free now can be taken a minute later.
- **To call the public API you need an account-level API key.** Create a free Wix account, then generate a key at https://manage.wix.com/account/api-keys. Your key is a secret.

---

## What to do

The time boxes are guidance. Partial and honest beats complete and padded.

### 0. Setup (about 10 min)
- Create a public repo, your Wix account and your API key.
- Keep the key out of git.

### 1. Understand the system (about 35 min) → `ARCHITECTURE.md`
- Use the browser's developer tools on the three web doors.
- Explain what each door is made of, which network calls it makes and what each call drives on the screen.
- Explain how the doors relate to each other and to the public API.
- Include a diagram of the doors, the services they call and how those connect. Any tool is fine; Mermaid works well in Gitub.

### 2. Test plan (about 40 min) → `TEST_PLAN.md`
- Write the test plan you'd want before owning these surfaces.
- Your scope, your approach, your format.
- Explain what you prioritized and why, and what you deliberately left out.

### 3. Explore and report (about 30 min) → `FINDINGS.md`
- Up to 5 findings, each with evidence and a **severity and priority** you can defend.
- If you find no real bug, report risks and observations instead.
- Don't invent bugs.

### 4. Automation (about 55 min) → your test code
- Any language, any framework.
- Cover the public API and at least one web door.
- It must run with a single command documented in your README.
- What to automate, how deep to go and how to structure it are your call. Explain your choices.

### 5. Wrap-up (about 10 min) → `README.md` and `AI_LOG.md`
- **`README.md`:**
  - How to run your tests.
  - What you'd do with another week.
  - Your quality strategy for Wix Domains, in 5 lines.
- **`AI_LOG.md`:**
  - Which AI tools you used and your key prompts.
  - Where the AI was wrong and how you caught it.
  - What you changed or threw away.
  - What you chose *not* to hand to AI.
  - Commit any agent configuration you wrote, such as `CLAUDE.md`, `AGENTS.md` or rules files.

---