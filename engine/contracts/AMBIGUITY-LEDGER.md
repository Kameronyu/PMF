# Ambiguity Ledger — marketing vs. wiring boundary

**Status:** ADJUDICATED 2026-06-24 (rulings in §4). Reorg may proceed.
**Date:** 2026-06-24 · **Pass:** distinguish + reorganize + name + map (harden later)

This is the answer to your concern: *"the line between what-is-what might be blurred."* I classified
everything by the brick rule. The ~90% that is unambiguous is listed in §1 for transparency (no ruling
needed). The genuinely blurry calls are in §2 — each has my **recommendation** and a blank **YOUR
RULING**. §3 records reconcile findings (documented bugs already fixed — the punch-list shrank).

The classification rule (from the approved plan):
- **WIRING** = executed by a script/hook, OR a schema/enum/I-O-contract/orchestration-sequence a
  deterministic executor enforces → preserve, move into `engine/`, register.
- **MARKETING** = agent-judgment text: what a label *means*, what to look for, how to decide, research
  questions, vocabulary → you rewrite; engine never touches; goes on the firewall deny-list.
- **MIXED** = both in one file → de-entangle by extraction at a heading boundary (never line-surgery).

---

## §1 — Unambiguous (no ruling needed, listed for transparency)

**Clear WIRING (preserve → `engine/`):**
- All `tools/*.js` pipeline bricks (fetch, clean, dedupe, funnel-*, asset-*, aggregate-*, revenue-est, validate-*).
- All `tools/asset/*.py` (probe, probe_video, frame-grab, sample_montage, video-assemble).
- `tools/lib/embed.js`.
- All `tools/hooks/*` (route.js dispatcher, 8 validate-*.js, 4 inject-*-dr.js) — the firing mechanics.
- `.claude/skills/reddit-extract/dump.mjs`.
- All generic `runs/arduview/_tooling/*` integrations (cdp/drive/clickxy/win-chrome-forwarder, surge_drive, shopify-*, cf*, kl).
- `prompts/_generated/*` (machine-generated DR bundles), `map/data-model-notes.md` (IO schemas/entity IDs).

**Clear MARKETING (you rewrite → firewall deny-list):**
- `definitions.md` (locked vocabulary meanings).
- The 4 agent-prompt bodies inside `prompts/step1-light-pass.md` (Finder / Roster Verifier / Dumper / Space Classifier — see A1).
- `marketing-lens/prompts/01-finder.md … 11-comprehend-video.md` (agent judgment text).
- `runs/*/_marketing-decisions/**` (your open marketing problems).
- The embedded agent-judgment prompt inside each marketing SKILL (see A3).

---

## §2 — Adjudication required (the blurry calls)

### A1 · `prompts/step1-light-pass.md` (534 lines — the monolith)
**Entangled.** Clean cut confirmed: **lines 1–223 = WIRING**, **lines 224–533 = MARKETING**.
- WIRING (1–223): pipeline topology diagram (7–21), the three output SCHEMAs `brands.json`/`dump.json`/`space-map.json` (29–175), the Closed-enums block (177–185), the DETERMINISTIC SCAFFOLD scripts+hook-rules (189–222).
- MARKETING (224–533): AGENT 1 Finder, AGENT 1.5 Roster Verifier, AGENT 2 Dumper, AGENT 3 Space Classifier, OPEN DECISIONS.
<annotate> pipeline topology diagram </annotate>
Three sub-calls inside the wiring half are blurry:
- **A1a — schema meaning-annotations.** The schemas carry inline *meaning* notes (e.g. `_provenance` "canonical transformations are claim-categories competitors ASSERT", the `mechanism[]` "how/why, not an outcome" explanation). The *field shape* is wiring; the *meaning prose* is marketing.
  **Recommend:** extract pure field-shape → `engine/contracts/schemas/*.schema.json` (frozen contract); the meaning prose moves with your rewritten prompts. → **YOUR RULING: _____yes do reccomended, just put it in there. ___**
- **A1b — the LP-hunt query template** (194–197: `<brand> students|focus|faith|Bible…` + URL patterns). It is "a fixed template, not agent-chosen" (→ wiring), but the *specific* terms are market-specific strategy (→ marketing).
  **Recommend:** treat the *mechanism* (fetch.js reads a fixed term list) as wiring, but move the *term list itself* into a per-run config the operator owns (`runs/<space>/lp-hunt-terms.txt`), not hardcoded in the engine. → **YOUR RULING: ________**
- **A1c — OPEN DECISIONS block** (525–533): mixes wiring rules (dedup keys: ads by `library_id`, pages by canonical URL) with strategy/scope decisions (awareness dropped from light pass D-05).
  **Recommend:** dedup keys → engine; scope decisions → marketing. → **YOUR RULING: ________**

**Top-level A1 recommend:** split at line 223. Wiring half → `engine/contracts/` (schemas + enums + scaffold doc). Marketing half → your rewrite; old file retired to `_quarantine/` once the light-pass orchestrator skill exists. → **YOUR RULING: ________**

### A2 · `prompts/funnel-deep-pass.md` (190 lines — already ~80% de-entangled)
Agent prompts already relocated to the SKILL (line 186 "ORCHESTRATION + AGENT PROMPTS — RELOCATED"). What remains (1–153) is schema (6a funnel-level + 6b belief-record) + closed enums + deterministic scaffold = **all WIRING**.
**Recommend:** whole remaining file → `engine/contracts/` (it is pure contract). → **YOUR RULING: ________**

### A3 · The marketing SKILL files (orchestration + embedded judgment)
| File | Lines | Shape |
|---|---|---|
| `market-selection/SKILL market selection.md` | 529 | orchestration + **embedded gate-reasoning prompt** |
| `funnel-architect/SKILL-funnel-architect.md` | 227 | orchestration + **embedded design-stance prompt** |
| `funnel-deep-pass/SKILL-funnel-deep-pass.md` | 535 | mostly orchestration; judgment delegated to prompt files |
| `asset-classify/SKILL-asset-classify.md` | 549 | mostly orchestration; judgment delegated |
| `pipeline-audit/SKILL.md` | — | pure audit orchestration = **WIRING** |

The orchestration *sequence* (script order, precondition checks, exclusion guards D-04/05/06, validator calls) is WIRING. The embedded agent-judgment text is MARKETING. But two SKILLs (deep-pass, asset-classify) also encode **methodology-as-orchestration** (live-only exclusion D-08, anti-fluke floors D-09) — strategy expressed as a deterministic rule.
**Recommend:** split each SKILL into `SKILL.md` (orchestration → stays as a skill, the wiring) + `AGENT-<name>.md` (the judgment prompt → your rewrite). Methodology-as-rule (D-08/D-09 floors) **stays in the orchestration as wiring** because a script/guard enforces it — but flag each such rule in the registry so you can see where strategy is baked into wiring. → **YOUR RULING (split SKILLs? + is methodology-as-rule wiring or marketing?): ________**

### A4 · Closed enums — value sets vs. meanings
Value sets (`CLAIM_TYPE`, `EXECUTION_TYPE`, `PROOF_TIER`, `MOVE`, `ROUTING_FLAG`, `BELIEF_ID_ANCHORS`, `BELIEF_KIND`, `AWARENESS_ENTRY`, `DEMAND_TREND_SHAPE`, `CHANNEL`, `LANE`) live as `new Set([...])` in 4 validators (validate-analyzer/finder/asset-record/classifier) — hook-enforced = WIRING. The *meaning* of each value ("enhanced = stacked superlative") is MARKETING.
**Recommend:** extract value sets → one `engine/contracts/enums.json` (the frozen contract; validators import it); meanings stay in your prompts. You can propose new values, but the engine owns the canonical list so a prompt rewrite can't silently drift a contract. → **YOUR RULING (OK to freeze value sets as engine contract?): ________**

### A5 · `workflow.md` (Step 0–8 spec) — the topology crux
The **step topology** (which steps exist, what each consumes/produces) is the skeleton I name the wiring against (→ wiring-ish). The **research questions per step** are marketing judgment (→ marketing). And this file is plausibly where your *rebuilt* I/O contracts will live.
**Recommend:** treat the step *names + producer→consumer seams* as PROVISIONAL wiring topology (registry anchors to it, marked PROVISIONAL); treat the research-question prose as marketing you rewrite. Do NOT move or freeze `workflow.md` — it stays operator-owned; the engine only *reads* the topology from it. → **YOUR RULING: ________**

### A6 · `marketing-lens/MAP.md` + `capability_inventory.md`
- `marketing-lens/MAP.md` — a pipeline orchestration map. Wiring (topology) or your mental-model doc (marketing)?
  **Recommend:** marketing-owned (it's *your* lens); the engine's authoritative map is the generated `REGISTRY.md`, not this. → **YOUR RULING: ________**
- `capability_inventory.md` — brick taxonomy + executor routing + locked decisions = WIRING, but it also names the build *methodology*.
  **Recommend:** WIRING (the registry joins to its `brick_type`); keep it as engine reference. → **YOUR RULING: ________**

---

## §3 — Reconcile findings (punch-list corrections, not adjudication)

Verified against git/code today. The deferred hardening punch-list is **smaller** than `CONCERNS.md` claims:
- ✅ **FIXED** `funnel_fields` discard — commit `bbff2ff` (`buildStoredRecord(..., funnelFields={})`, PREFERRED logic). Remove from punch-list.
- ✅ **FIXED** `normalizeUrl` A/B-param phantom funnels — commit `bbff2ff` (strip list now includes variant/test/lp/ver/_pos/_sid/_ss/_psq). Remove from punch-list.
- ✅ **FIXED** `belief_kind` ghost field — commit `35581d4` (`BELIEF_KIND_ENUM` + hard reject in validate-analyzer). Remove from punch-list.
- ⚠️ **STILL OPEN** `validate-analyzer.js` not wired into `route.js` / funnel-deep-pass orchestrator (every belief record unvalidated).
- ⚠️ **STILL OPEN** `source_routing` ghost field (only `belief_kind` got the enum in `35581d4`).
- ⬜ **RE-VERIFY in H-pass** Google Trends 0% fill, adlib selectors uncalibrated, `_index.json` stale (not re-checked this pass; deferred to hardening).

These corrections will be folded into `engine/contracts/ERROR-NOTES.md` (built after adjudication).

---

## §4 — RULINGS (operator, 2026-06-24)

Consolidated from the AskUserQuestion forks + inline annotations. These are the contract.

- **A1 (top) — RULED: extract.** Split `step1-light-pass.md` at line 223. Wiring half → `engine/`; marketing half (the 4 agent prompts) → operator rewrite; old monolith retired to `_quarantine/` once a light-pass orchestrator skill exists.
- **A1a — RULED: extract field-shape** to `engine/contracts/schemas/` ("yes do recommended, just put it in there"). Meaning-prose travels with the rewritten prompts.
- **A1b — RULED (recommended): LP-hunt term list** → per-run operator config (`runs/<space>/lp-hunt-terms.txt`); the read-a-fixed-list *mechanism* stays wiring in `fetch.js`.
- **A1c — RULED (recommended):** dedup keys → engine; scope/awareness decisions → marketing.
- **A1 annotation — pipeline topology diagram:** preserve as the *wiring skeleton* (the script→artifact→script seams are stable wiring), but the **agent names in it are `PROVISIONAL`** — reconciled against the operator's rebuilt I/O contracts. The deterministic seams are frozen; the agent labels are not.
- **A2 — RULED: extract.** `funnel-deep-pass.md` remainder (schema 6a/6b + enums + scaffold) → `engine/contracts/`. Pure contract.
- **A3 — RULED: split + methodology-as-wiring-flagged.** Each marketing SKILL → `SKILL.md` (orchestration = wiring) + `AGENT-<name>.md` (judgment = rewrite). Methodology-as-rule (live-only D-08, anti-fluke D-09) stays as wiring but is FLAGGED in the registry. ("do recommended … the holes will show on first run.")
- **A4 — RULED: freeze.** All enum value sets → one `engine/contracts/enums.json`; validators import it; prompts read a generated copy. Engine owns the canonical list; operator may propose new values.
- **A5 — RULED (recommended):** `workflow.md` stays operator-owned; engine reads its step topology as `PROVISIONAL`. Not moved, not frozen.
- **A6 — RULED (recommended):** `marketing-lens/MAP.md` = marketing-owned (operator's lens); `capability_inventory.md` = wiring (registry joins to its `brick_type`).

**Operating mode (operator, verbatim):** *"anything that isn't needed, I'll know. when we put it into the repo, and ran for the first time, the holes will show and I can rebuild and perfect."* → proceed on recommendations; mark uncertainty `PROVISIONAL`; let first run expose gaps.
