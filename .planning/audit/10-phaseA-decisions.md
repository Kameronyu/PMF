# Audit 10 — Phase A decisions (four doc tasks)

Generated: 2026-06-04

---

## Task 0 — Cross-link copy-brief decision (DONE)

The "Fold budget and element order were not specified in the copy brief" entry from
`runs/arduview/_marketing-decisions/lp-builder.md` has been added to
`runs/arduview/_marketing-decisions/funnel-architect-copywriter.md` as a new entry,
cross-referenced to its origin. See that file for the added block.

---

## Task 1 — Is archiving map/data_inventory.md lossy?

**Verdict: LOSSY — distill-then-archive.**

`handoff-step3-voc-build.md` covers the settled 3-pass pipeline architecture, the four agents,
the locked strategy decisions, the codebook keystone, and the storage contract for per-quote
records. It is the authoritative build brief.

`map/data_inventory.md` contains material NOT in the VOC handoff:

1. **Full capability output schemas** for all non-VOC ops: Per-brand extractor, Market aggregator,
   Ad creative extractor, Offer/bundle extractor, Channel analysis, Trend cap, Mechanism research,
   Product candidate discovery, Transformation expanders, Institutional report retrieval, Purchase
   signal composite. These are load-bearing IO contracts for Steps 0–4.

2. **Five open design questions** (p.2) — VOC unit-of-record granularity (voc_record_id = post or
   PMBD instance), investigation scope (global vs scoped), classifier-split decision, multi-pass
   write strategy, N/A handling in classifier output. Some of these are still unresolved.

3. **Step walkthrough for Steps 0–4** — joins, data dependencies per Gate variable, the Gap
   formula decomposed to capability-level inputs. Not reproduced anywhere current.

4. **Cross-cutting architecture notes** — join rankings (author_id as heaviest), multi-pass write
   contract (augment not overwrite), investigation scope lean (one global map), source-metadata
   chain non-negotiable constraint, substrate decision framing (~25 record types, read patterns,
   scale profile).

The VOC handoff covers only the Step 3 chain. The inventory covers the full system. The VOC
content in the inventory (VOC scraper, cleaner, classifier, quote extractor, PMBD clusterer,
frequency synthesizer, copy bank) duplicates the handoff at the field level but is the only place
the VOC ops are described with full IO contracts in the broader system context.

**Recommendation:** distill Steps 0–2 capability IO schemas + open design questions + substrate
framing into a keeper note (e.g., `map/data-model-notes.md`), then archive the full 770-line doc
to `_archive/eink-launch/map/data_inventory.md`.

---

## Task 2 — What is STRATEGY-DISCUSS-HANDOFF.md?

**Verdict: orphaned — safe to delete (untracked).**

`runs/arduview/STRATEGY-DISCUSS-HANDOFF.md` (128 lines, untracked) is a session-handoff doc
written after the market-selection gate re-run (commit 3e56794, 2026-06-03). Its purpose: seed a
fresh session to discuss marketing strategy off the gate output — load order (skill + DR KB +
market-selection.md + run data), product description, data caveats (no demand data, soft-gate
mode), the ranked provisional cell table with reasoning, contested calls, and workflow state.

It was never acted on as a strategy discussion. The LP build proceeded directly from the gate
output and FUNNEL-DESIGN.md without this session. `BUILD-FEEDBACK.md` explicitly classifies it
as "upstream strategy — DO NOT READ" for the builder context. Audit 01 (§3.8) already flagged it
as a likely orphan.

The content is superseded: the ranked output and contested calls are in `market-selection.md`;
the workflow state it describes is outdated (Phase 17 LP builder is already underway); the load
order it specifies is in SKILL.md and the skill's read_first.

**Recommendation:** delete (untracked, zero git cost; content is redundant with current state).

---

## Task 3 — Was _mechanisms-in-play.agent.json a band-aid?

**Verdict: confirmed stopgap output — safe to git rm --cached + gitignore.**

(a) `runs/arduview/space-map.json` DOES have `mechanisms_in_play` populated — it exists as a
top-level field AND as `combos[].mechanisms_in_play[]` with canonical/raw_variants/brands/
brand_count/ownability per entry. The slot is no longer empty.

(b) `.claude/skills/market-selection/mechanisms-in-play-stopgap.md` is explicitly marked
**RETIRED (BREAK 5 resolved)** at the top. It documents that `space-map.json` now carries
`mechanisms_in_play[]` as a first-class field produced by `tools/aggregate-mechanisms-in-play.js`.
The stopgap derivation procedure is kept only as historical record.

(c) `_mechanisms-in-play.agent.json` is a one-off clustering agent output from the zero-DR run
(before BREAK 5 was resolved). It is committed/tracked. No current tool, skill, or prompt reads
it — the gate now reads `space-map.json` directly. Audit 06 (row 17) already flagged it as dead
output from the invalidated zero-DR run. The file is 5K, tracked, and referenced nowhere in
current tooling.

**Recommendation:** `git rm --cached runs/arduview/_mechanisms-in-play.agent.json` + add to
`.gitignore` (or just delete from tree; it's regenerable from the corpus dumps via
`aggregate-mechanisms-in-play.js` if ever needed again).
