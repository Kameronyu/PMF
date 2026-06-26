# INDEXING-HANDOFF — build the engine↔marketing bridge

**Date:** 2026-06-26 · **From:** post-Phase-21 (engine hardened + green) · **To:** the indexing session (REBUILD-ROADMAP **R2**).
**Job:** produce the two artifacts that let an R5 implementer slot the hardened engine between the marketing agents without reverse-engineering it. Diagnosis of why this session exists is in the "Gap" section below.

---

## ✅ RESOLVED — 2026-06-26 (read this before acting)

Operator chose **(B): `marketing-lens/` is scratch** (R4/R5 re-author). Consequences, now in force:
- **Shipped:** `engine/contracts/MATERIALS.md` (Deliverable 2) — verified against disk, with four handoff-table corrections (see its Gotchas).
- **Deferred to R5:** Deliverable 1 `PROMPT-WIRING.md` — there is no stable agent topology to name the wiring against until R5 authors the real prompts. **Do NOT start it.**
- **Deferred to R5:** the `REGISTRY.json` `(PROVISIONAL)` `step_served` reconcile — same reason. The "zero PROVISIONAL" exit criterion below is an **(A)-only** goal and does not apply.
- The A/B section and Deliverable 1 below are retained as historical context, not open work.

---

## Settle this FIRST (hard blocker for Deliverable 1) — ✅ ANSWERED: (B), see above

**The marketing-lens contradiction.** `REBUILD-ROADMAP.md` R3 lists `marketing-lens/` among the dirs to quarantine into `_legacy/`. But `marketing-lens/MAP.md` + `marketing-lens/prompts/01-11` ARE the named topology this session wires the engine against, and the thing R5 builds on. You cannot both quarantine it and name the wiring map against it. The operator must pick:

- **(A) marketing-lens/ is the live topology** → keep it live, REMOVE it from R3's quarantine list, write `PROMPT-WIRING.md` against it now. *(Most likely — it has clean per-agent "Hands to" seams.)*
- **(B) marketing-lens/ is scratch** → it gets quarantined, R4 `/gsd-new-project` re-authors, and `PROMPT-WIRING.md` is deferred until R5 produces the real prompts.

Do not write `PROMPT-WIRING.md` until this is answered. `MATERIALS.md` (Deliverable 2) does NOT depend on it — start there.

---

## Source of truth (and what to ignore)

- **USE:** `engine/contracts/` — `REGISTRY.json`/`.md`, `enums.json`, `schemas/`, `NAMING.md`, `ERROR-NOTES.md`, `off-limits.json`. And `marketing-lens/MAP.md` + `marketing-lens/prompts/` (**READ-ONLY** — marketing firewall, see Gotchas).
- **IGNORE:** `.planning/ROADMAP.md`, `.planning/STATE.md`, `.planning/codebase/` — frozen/stale (say `tools/`, pre-reorg). Recovery tag: `m1-arduview-retro`.
- **Regenerate** `REGISTRY.json`/`.md` anytime via the global `engine-map` skill (engine-only — it can index bricks but CANNOT infer agent names; you reconcile those by hand from marketing-lens).

---

## The gap this session closes

Phase 21 left the engine green and REGISTRY indexing every brick (I/O template, run cmd, deps, health). Two things are still missing, and both block a clean R5 handoff:

1. **No prompt↔brick wiring map.** REGISTRY's `step_served` is `"...(PROVISIONAL)"` — never reconciled to the marketing-lens agents. An implementer can't read "Finder hands `brands.json` → which brick → which agent consumes it."
2. **No run-materials manifest, and the proven set is split v1/v2.** Told "use `arduview-v2`" an implementer MISSES v1's `asset-classify/` + `site/`; told "use `arduview`" they use the **stale pre-recovery** funnels v2 superseded. Nothing on disk states the canonical composite.

---

## Deliverable 1 — `engine/contracts/PROMPT-WIRING.md`  *(needs the blocker resolved)*

One row per seam in the marketing-lens pipeline:

`producing agent → output file (+ contract: schema/enums) → engine brick(s) on the seam → output file → consuming agent`

**The seams (from `marketing-lens/MAP.md` "Hands to" lines):**

```
Pre-Research Plan → Finder → Roster Verifier → Dumper(per brand) → Space Classifier
  → Market Selection Assessor → [operator NTP pick] → Router(per funnel) → Section Analyzer(per funnel)
  → Funnel Architect → Copywriter → Relevance Bucket → Role Classify / Comprehend Video
```

**Matching rule (membership test per row):** the producing agent's output artifact must equal the input artifact a brick consumes per its REGISTRY `io` field. If no brick sits on a seam, write `direct agent→agent (no engine step)`. Every brick in REGISTRY must land on exactly one seam or be marked `cross-cutting` (validators, injectors, RAG).

**Provisional → real label reconciliation** (replace every `step_served` in `REGISTRY.json`; starting map — verify against MAP.md, don't trust blindly):

| PROVISIONAL | real marketing-lens agent(s) | example bricks on/around it |
|---|---|---|
| S1 light-pass | Finder / Dumper / Space Classifier | fetch.js, clean.js, dedupe.js, adlib-one.js, revenue-est.js, crowdfund-fetch.js |
| S2 gate | Market Selection Assessor | aggregate-mechanisms, funnel-claim-tally |
| S2 deep-pass | Router / Section Analyzer / Funnel Architect / Copywriter | funnel-assemble, funnel-clean, funnel-score, funnel-store, funnel-analyzer-context, funnel-vectorize, funnel-rag-query |
| S3 VOC | (build-absent — R6) reddit-extract | dump.mjs |
| S6 build | Relevance Bucket / Role Classify / Comprehend Video | asset-fetch, asset/probe.py, asset-map-rank, asset-emit |
| S7 deploy | (post-copy) | shopify-deploy, surge, cloudflare-dns, klaviyo |
| firing | (cross-cutting) | route.js, validate-*.js, inject-*-dr.js |

**Done-when:** zero `(PROVISIONAL)` strings remain in `REGISTRY.json`; every marketing-lens seam has a row; every brick is placed.

---

## Deliverable 2 — `engine/contracts/MATERIALS.md`  *(no blocker — start here)*

The canonical proven-material manifest for the **arduview** bet. Resolve the v1/v2 split EXPLICITLY:

| material | canonical location | produced by | consumed by |
|---|---|---|---|
| brand roster | `brands.json` (top-level) | Finder + dedupe.js | Dumper, fetch |
| classified space | `space-map.json` (top-level) | Space Classifier | Market Selection Assessor |
| cleaned corpus | `corpus/<slug>/clean/` | clean.js | Dumper |
| ad records | `ads/<slug>.json` | adlib-one.js | funnel-assemble |
| **funnel store + belief bank** | **`runs/arduview-v2/funnels/*.json` + `_index.json`** (43 records, vectors) | funnel-store + funnel-vectorize | Funnel Architect, RAG query |
| asset-classify outputs | `runs/arduview/asset-classify/` (**v1 — not re-run in v2**) | asset chain | LP builder |
| site | `runs/arduview/site/` (**v1**) | LP builder | — |
| crowdfunding raw | `runs/arduview/crowdfunding/` (v1) | crowdfund-fetch | funnel-score (Currency B) |
| **SUPERSEDED — do NOT use** | `runs/arduview/funnels/` (pre-recovery) | — | replaced by `arduview-v2/funnels/` |

State the **no-overwrite-v1** rule: a re-run writes a NEW versioned space (`arduview-v3`), never mutates these in place.

---

## Do-first order
1. Get the operator's marketing-lens decision (A or B above).
2. Write `MATERIALS.md` (pure inventory — no blocker).
3. Write `PROMPT-WIRING.md` (needs step 1).
4. Reconcile `REGISTRY.json` `step_served` labels; regenerate `REGISTRY.md` via `engine-map`.
5. Verify (Done-when lines on each deliverable).

## Gotchas
- **Marketing firewall** (`off-limits.json`): `marketing-lens/`, `prompts/`, `definitions.md`, `workflow.md`, `runs/*/_marketing-decisions/` are READ-ONLY. This session WRITES only into `engine/contracts/`.
- **Do NOT run R3 quarantine from this session** unless the operator explicitly approves — it's a destructive repo-wide `mv`→`_legacy/` + commit, and it depends on the marketing-lens decision. R3/R4 are a separate, operator-driven step after these two artifacts land.
- `engine-map` is a global skill (`~/.claude/skills/`), not in the repo — available but won't travel with a clone.

## Exit / done-when
- `engine/contracts/PROMPT-WIRING.md` + `MATERIALS.md` exist.
- `REGISTRY.json` has zero `(PROVISIONAL)` `step_served` labels.
- An implementer can answer, from these two files alone: "what produces brick X's input, what consumes its output, and where is the proven material to reference."
