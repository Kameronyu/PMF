# Roadmap: PMF — Milestone 1 (Research Engine)

> **Naming (locked).** **Phase** = PMF research step 0–8 (`workflow.md`), immutable. **Stage** = GSD
> build unit (`M1-S{n}`). **Milestone** = a group of stages. Never reuse Phase numbers for build units.
>
> **InkLeaf is RETIRED.** The `runs/eink-tablets/` research run + its throwaway briefs are quarantined
> to `_quarantine/`. It was the first bare-minimum instance — not canon, not a UAT rebuild target, not
> a source of durable prompts. Mine learnings only from `run-retrospective.md` + `agents/implementation-notes.md`.
> Durable fetch tooling was rescued to `tools/`. The launch machinery lives in `launch/` (M2 source).

## Overview

M1 builds the reusable **research engine**: a T/P/N seed → a validated market bet + a queryable bank
of attributed customer language. Everything composes from the **brick model** (`capability_inventory.md`
— one job per brick; deterministic work = scripts/hooks, judgment = agents; gates are agent-prep → human).

Two tracks make up M1:

- **Track A — Competitive analysis** (PMF Phase 0/1/2): find competitors → analyze the space → **pick a
  market (Gate 1)** → study the winner's marketing deeply → **messaging strategy (Gate 2)**. The light
  pass is **built**; the market-selection gate is **drafted**; deep analysis is **specced**.
- **Track B — VOC** (PMF Phase 3a/3b): Reddit customer-language mining → attributed copy bank. Fully
  **specced** in `handoff-phase3-voc-build.md`; the original critical path; not yet built.

**M2 — Launch engine** (Phases 4–8 + the `launch/` Shopify/Klaviyo/LP machinery) is deferred, rolling-wave.

## Status legend

`BUILT` · `DRAFTED` (exists, needs finishing/wiring) · `SPECCED` (spec ready — build it) · `TO-BUILD` (no spec yet)

## Stages

### Track A — Competitive analysis (Phase 0/1/2)

- **M1-S1 — Light pass** · `BUILT` — Finder + Roster Verifier + Dumper + Space Classifier, enriched with
  `revenue_est` (traffic×CVR×AOV + review-proxy) and `claim_type` (direct/enlarged/mechanism/enhanced).
  → `prompts/phase1-light-pass.md`. **Remaining:** layer-3 scripts (`fetch`/`clean`/`dedupe`/`revenue-est`)
  to run automated; optional brick-split per the brick model. *(Serves Phase 0/1; feeds Gate 1.)*
- **M1-S2 — Market-selection gate** · `DRAFTED` — the 4-gate decision skill (Demand → Product →
  Sophistication → Awareness → ranked survivors → **human picks**). → `.claude/skills/market-selection/SKILL.md`,
  spec `prompts/_specs/market-selection-framework.md`. **Remaining:** wire the S1 data contract
  (claim-typing, revenue, trend shape, awareness rollup). *(GATE-01.)*
- **M1-S3 — Deep competitive analysis + messaging strategy** · `SPECCED` — two lenses (structure +
  messaging) over one competitor pool → merged deployable plan; **human Gate 2**. Build as a brick string.
  → spec `prompts/_specs/deep-market-analysis-framework.md`. *(Serves Phase 2 + front-half Phase 4.)*

### Track B — VOC pipeline (Phase 3a/3b) — `SPECCED` (`handoff-phase3-voc-build.md`)

- **M1-S4 — Classifier codebook + per-quote record schema** (keystone) — VOC-01, VOC-02.
- **M1-S5 — Query Planner agent** (3 lanes + no-clean-venue handling) — VOC-03.
- **M1-S6 — Scraper + cleaner + verbatim-gate hook** — VOC-04, VOC-05.
- **M1-S7 — Bucketer agent (pass 1) + intensity scorer** — VOC-06, VOC-07.
- **M1-S8 — Frequency + co-occurrence clustering** (the novel per-individual piece) — VOC-08.
- **M1-S9 — Ladderer agent (pass 2)** — VOC-09.
- **M1-S10 — Language Analyzer + copy-bank store** — VOC-10.
- **M1-S11 — End-to-end VOC UAT** on a reference subreddit — VOC-11.

### Cross-cutting

- **M1-S12 — Tooling templatization + deliverable templates** — TOOL-01, TOOL-02.
- **M1-S13 — Phase 3c mechanism research** (after a market is picked) — UM-01.
- **M1-S14 — Phase 3d loop-back** (augment-not-overwrite) — LOOP-01.

## Suggested order

Track A and Track B are independent and can run in **parallel sessions** (use `git worktree` per session
so they don't clobber each other). Track A is closest to running (S1 built, S2 drafted) — finishing S1's
scripts + S2's wiring lets you pick a market now. Track B (VOC) starts at the **S4 codebook keystone** —
everything in VOC keys off it.

## M2 — Launch engine (deferred)

Generalize `launch/` (the imported InkLeaf Shopify + Klaviyo + landing-page build/deploy machinery) into
one product-agnostic new-store setup module + an agent that drives the browser through it with human gates.
PMF Phases 4–8 (test design, hook test, build-a-brand/funnel, eval, iterate). Plan after M1 produces a bet
+ copy bank. Full source state in `launch/README.md`.

---

*Rewritten 2026-06-03: reorganized into the two-track research engine, build-state-aware; InkLeaf retired;
brick model is the build law. Supersedes the prior VOC-only 12-stage roadmap.*
