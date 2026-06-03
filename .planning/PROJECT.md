# PMF

## What This Is

PMF is a research-to-launch system for direct-response e-commerce. You feed it a product, a transformation, or a niche, and it works that input down a fixed flow — map a space, pick a market worth entering, study the competition and the customer, design and run a creative test, then launch or kill. What comes out is a validated market, the exact customer language to sell with, and a funnel ready to take money. InkLeaf (a foldable programmable e-ink tablet) was the first product run through it — a bare-minimum shakedown, now **retired to `_quarantine/`**; the machinery is built to work for the next product without being rewritten.

## Core Value

A reusable research engine that converts a T/P/N seed into a queryable bank of **real, attributed customer language** (verbatim, with live permalinks) plus a validated market bet — the asset Step 4 copywriting and the launch funnel are built from. If the verbatim copy bank is trustworthy and reusable, everything downstream works.

## Requirements

### Validated

<!-- Durable assets that survive the InkLeaf retirement (2026-06-03). The InkLeaf RUN itself is quarantined; what's validated below is the reusable machinery + locked canon, not the run's artifacts. -->

- ✓ **Light pass (built)** — `prompts/step1-light-pass.md`: Finder + Roster Verifier + Dumper + Space Classifier, enriched with `revenue_est` + `claim_type`. The one durable, reusable competitor-research prompt + the format template for all future prompts.
- ✓ **Brick model (locked)** — `capability_inventory.md`: one job per brick, scripts for deterministic work, agents for judgment, hooks to gate, human Decide for the gates. The build law.
- ✓ **Strategy frameworks (locked, verbatim)** — `prompts/_specs/market-selection-framework.md` (4-gate market selection) + `prompts/_specs/deep-market-analysis-framework.md` (two-lens deep analysis). Kam's source-of-truth sauce.
- ✓ **Deterministic fetch tooling** — `tools/adlib-one.js` (Meta Ad Library + `days_running`), `tools/crowdfund-fetch.js` (SPA/Cloudflare bypass), Playwright-based — rescued from the InkLeaf run.
- ✓ **Locked canon** — `definitions.md` (vocabulary), `workflow.md` (Step spine + PMBD battery, now tagged reservoir), `capability_inventory.md`, `README.md` (the clickable flow), `CLAUDE.md` (agent-design rules).
- ✓ **Launch machinery imported** — `launch/` (Shopify + Klaviyo + LP build/deploy), to generalize into the reusable new-store module (M2). InkLeaf-specific; not yet reconciled.
- ⌫ **InkLeaf run — RETIRED** — `_quarantine/runs/eink-tablets/`: misclassified definitions, throwaway deep-comp brief. Learnings already mined into `run-retrospective.md` + `agents/implementation-notes.md`.

### Active

<!-- M1 — the research engine. The VOC pipeline is the critical path. All hypotheses until shipped + UAT'd. -->

**VOC engine (Step 3a/3b) — critical path:**
- [ ] Classifier codebook — the keystone machine contract (`definitions.md` PMBD×tier ladder + `workflow.md` battery, compiled); built first, everything keys off it
- [ ] Per-quote record schema + two materialized views (frequency brief + copy bank)
- [ ] Query Planner agent — three search lanes + no-clean-venue handling
- [ ] Reddit scraper (official commercial API) + cleaner + verbatim-gate hook (raw-immutable-copy discipline)
- [ ] Bucketer agent (pass 1) — letter + raw theme + counter-signal + vocab flag, whole corpus, cheap
- [ ] Intensity scorer (VADER + engagement + length) — deterministic, rank-not-delete
- [ ] Frequency + co-occurrence clustering — unique-user counts; user×theme incidence matrix → sub-niche clusters (the novel piece, no prior art)
- [ ] Ladderer agent (pass 2) — T1–T4 tier + verbatim spans on hot clusters only
- [ ] Language Analyzer agent (pass 3) + copy-bank store — organize verbatim, light-clean only, never reword
- [ ] End-to-end UAT — run on a reference subreddit; Kam reads the copy bank

**Reusable research tooling:**
- [ ] Templatize `step1-light-pass.md` (finder/verifier/dumper/classifier) into parameterized slots
- [ ] Extract `deliverable-templates.md` (10+ output schemas) + standalone agent-brief template

**Bet selection + downstream research:**
- [ ] Gate 1 three-way comparison — cross-score faith/students/dumb-device, select the InkLeaf bet
- [ ] Step 3c mechanism research on the winning market
- [ ] Step 3d loop-back — revise Step 0/1 hypothesis given Step 3 learnings

### Out of Scope

<!-- Explicit boundaries. M2 is deferred (next milestone), not rejected. -->

- **M2 — launch/execution engine (Step 4–8 + InkLeaf fold)** — deferred to the next milestone; rolling-wave, don't plan before M1 shakes out. Includes test design, hook test, deposit-funnel build, creatives, eval, iterate.
- **Step 3c as an agent / Step 4 copywriting** — out of M1's VOC scope; VOC ends at a stored queryable copy bank. Writing copy *from* it is Step 4.
- **Vectorization / RAG vector DB** — JIT only; build the structured attributed store now, add embeddings when Step 4 needs semantic retrieval.
- **Persistence / substrate layer** — DEFERRED (2026-05-21); `.md` files are de-facto persistence; build JIT when manual friction demands it.
- **`space-sketcher` (partial-seed expander)** — DEFERRED; no partial-seed case has appeared.
- **InkLeaf research run** — RETIRED, quarantined to `_quarantine/`. Not regenerated, not a UAT corpus. Learnings mined into `run-retrospective.md` + `agents/implementation-notes.md`.
- **LLM-generated customer copy** — hard prohibition; the moat is real attributed verbatim. No agent ever authors a customer sentence into the bank.

## Context

- **Brownfield, doc-and-prompt codebase.** Not a software product: markdown specs + agent briefs + a handful of Playwright fetch scripts + a directory tree as persistence. No package.json, build, server, or test suite. Node v20, Playwright 1.59 installed globally.
- **Source-of-truth hierarchy (authority order):** `definitions.md` → `workflow.md` → `capability_inventory.md` → `handoff.md` / `BUILD-STATE.md` → agent briefs / run artifacts (beta, not locked).
- **The build brief for M1's critical path is ready:** `handoff-step3-voc-build.md` (architecture settled 2026-06-01, all strategy decisions locked). The 3-pass pipeline (Bucketer → frequency/clustering → Ladderer → Language Analyzer) and the one-job-per-agent split are locked there.
- **Prior art researched:** DeTAILS, LLMCode (verbatim-grounding gate), Reddit_Scrapper, PainOnSocial (where commercial twins stop — no per-user clustering), Xiao CHI'23 / CollabCoder (deductive coding vs frozen codebook). Co-occurrence clustering *within individuals* is the genuine white space.
- **Manual precedent:** Vindicta PMBD prompts (`~/Documents/Vindicta/`) — the mature manual method; its good parts (frequency-table architecture, output-check rules) survive as scripts + hooks, its bloat (three jobs in one prompt) is split into the micro-agents.
- **GSD ceremony was abandoned for the InkLeaf run** as too heavy for learn-by-building. This initialization is the transition from ad-hoc exploration to systematic build — kept deliberately lightweight.

## Constraints

- **Naming (locked):** **Step** = PMF research step 0–8 (`workflow.md`), immutable. **Stage** = GSD build unit. **Milestone** = a grouping of stages (M1 = research engine, M2 = launch engine). Never reuse Step numbers for build units. *(Note: the auto-generated `.planning/codebase/*.md` maps invert this — they are wrong on naming; the canon above governs.)*
- **Agent design (locked):** One job per agent, split to the smallest part, route to the right executor. Deterministic jobs (fetch, clean, dedupe, count/score, store, validate) are scripts/hooks; only judgment jobs (query design, classify, extract, synthesize) are agents.
- **Verbatim grounding (locked, hook-enforced):** agents return `(author_id, source, char-offsets)` and never emit quote text; a script slices from the raw immutable copy and string-verifies; reject on mismatch.
- **Source-metadata pass-through (locked):** every VOC record preserves platform/venue/author_id/url/timestamp/engagement — required for the 5+ single-individual co-occurrence sub-niche rule.
- **Reddit ingestion:** must run on Reddit's official commercial API (GummySearch died Nov 2025 over API licensing — same shutdown risk otherwise).
- **Tech:** markdown + thin Node/Playwright scripts; build tooling JIT; dumb-modular-first (30-line cleaner, not an NLP pipeline).
- **Verification:** UAT, not unit tests — prompt/research quality isn't test-passable. Run on a reference subreddit + Kam reads the output.
- **Collaboration:** Kam owns strategy (codebook content, search lanes, intensity definition, how the brief reads); Claude builds plumbing (scrapers, hooks, matrix math, storage, JSON contracts). Surface only genuine strategy forks; default and proceed on everything mechanical.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Initialize GSD now, at the ad-hoc→systematic transition | Heavy GSD ceremony was abandoned mid-InkLeaf as too heavy; lightweight structure fits learn-by-building | — Pending |
| M1 = research engine, M2 = launch engine (deferred) | VOC pipeline is the critical path; rolling-wave avoids over-planning M2 before M1 teaches us | — Pending |
| Build the classifier codebook first | It is simultaneously classifier instructions, record schema, and copy-retrieval index — everything keys off it | — Pending |
| Models: Opus for planning/research/roadmap, Sonnet for executor | Opus where context+reasoning+orchestration matter; Sonnet for worker-bee implementation | — Pending |
| InkLeaf run RETIRED / quarantined | Bare-minimum first run; misclassified definitions + throwaway deep-comp; learnings mined to reservoir docs | ✓ Done (2026-06-03) |
| Co-occurrence clustering within individuals is the differentiator | No prior art; commercial twins (PainOnSocial) stop short of per-user clustering | — Pending |

## Evolution

This document evolves at step transitions and milestone boundaries.

**After each step transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with step reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-06-02 after initialization*
