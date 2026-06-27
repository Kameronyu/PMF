# Phase 6 — Smoke Run & Definition-of-Done — CONTEXT

**Goal (one paragraph):** Formalize the milestone Definition-of-Done as a 7th acceptance gate (`engine/contracts/smoke-dod.sh`) that runs the FULL pipeline `bin/run all --space=<fresh> --smoke` and asserts the Core Value at the RUN grain — all 11 steps run in canonical R1 order and exit 0; every declared artifact is produced AND consumed (zero orphan outputs / zero dangling inputs computed over the REAL emitted run, not just the manifests); an unbroken 11-receipt chain (each with a 64-hex `inputs_hash`, non-empty all-pass `validator_verdicts`, populated `gate.decision` on the 6 gated steps); operator gates logged; and two fresh full runs are byte-identical (deterministic routing). The one NEW build is **SMOKE-05**: close the deferred completeness/canonical-order hole (`02-XVERIFY-FIX.md` Deferral C) by adding a `run all` PREFLIGHT to the controller that, before spawning anything, verifies the active pipeline graph is CLOSED — every step's `reads[]` has a strictly-earlier producer within the active pipeline (or is a declared pipeline-entry) — and FAILS FAST with a NAMED error if a step is dropped/reordered so an input would dangle. RED-first: author the harness so its SMOKE-05 asserts fail before the preflight exists, then add the preflight to turn them green. Acceptance invariant: committed `bin/run all --space=smoke --smoke` stays clean; all 6 prior gates stay green; `pipeline.yaml` + manifests + stub emits UNCHANGED.

<canonical_refs>

## PROJECT Core Value (the DoD to assert at the RUN grain)
"A runnable shell of Steps 0–10 that completes end-to-end on stub prompts — every declared artifact produced and consumed, deterministic routing, operator gates logged, unbroken receipts chain, zero orphan outputs / dangling inputs."

## REQUIREMENTS SMOKE-01..05 (exact wording — bind asserts to these)
- SMOKE-01: `run all --space=smoke` completes end-to-end on stub prompts.
- SMOKE-02: All preflights green; all validators green on declared top-level shapes.
- SMOKE-03: Every artifact slot is written under `runs/smoke/`.
- SMOKE-04: Every operator gate is logged; the `_receipts/` chain is unbroken across the run.
- SMOKE-05: Zero orphan outputs / dangling inputs across the manifests (the producer→consumer graph closes).

## Deferred SMOKE-05 note (02-XVERIFY-FIX.md Deferral C)
"`runAll()` walks whatever `pipeline.yaml` lists; a pipeline that DROPS a canonical step still exits 0 (the controller faithfully runs the shorter list). No assert proves the walked set is complete or in canonical R1 order. DEFERRED → Phase 6 / SMOKE-05, which surfaces a dropped step as a dangling input / a non-closing producer→consumer graph across all of Steps 0–10." → The fix is a run-grain analog of manifest-smoke's static graph check, wired into the controller's run-all path as a fail-fast preflight.

## run-controller.js — runAll / parsePipeline / the loop (where SMOKE-05 wires in)
- `parsePipeline(file)` → flat ordered list of step ids from `pipeline.yaml` (`- ` lines). No hardcoded order (CTRL-10).
- `runAll(space, opts)` currently: `for (const id of parsePipeline(opts.pipeline)) runStep(sanitizePathSegment(id), space, opts);` — walks the list as-is, no completeness check. **Add a completeness preflight BEFORE the loop**: load each listed step's manifest, build `producedBy[path]=[stepId...]` in list order, and assert every `reads[]` of each step has a STRICTLY-EARLIER producer in the active list (or a declared pipeline-entry). A read whose only producer is the same/later step (dropped/reordered producer) → NAMED refusal, exit ≠ 0, BEFORE any spawn. Reuse `loadManifest`, `parsePipeline`; honor `{space}` normalization and dir-slot (`endsWith('/')`) parent matching exactly as manifest-smoke does. This is WIRING (a new ordering guard in front of the existing loop), not a rewrite of any brick core.

## The manifest producer→consumer graph (the closed run-grain DAG; SMOKE-01..05 all walk this)
- 00 reads []  → writes bet-brief.md, product-intake.md, asset-classify/CLAIM-LIST.json
- 01 reads bet-brief.md → writes brands.json, queries_run.json, dumps/
- 02 reads brands.json → writes ad-volume-aggregate.json, funnels/_tally.json, funnels/
- 03 reads ad-volume-aggregate.json, funnels/_tally.json, bet-brief.md → writes space-map.json
- 04 reads space-map.json, bet-brief.md, product-intake.md → writes voc/market-signal/_index.json, voc/gap_candidates.json, voc/market-signal/
- 05 reads space-map.json, voc/market-signal/_index.json, voc/gap_candidates.json, bet-brief.md → writes market-selection.json, ntp-pick.json
- 06 reads ntp-pick.json → writes voc-bank/_bank.json, awareness-read.json, voc-bank/
- 07 reads bet-brief.md, product-intake.md, funnels/_tally.json, ad-volume-aggregate.json, awareness-read.json, voc-bank/_bank.json, market-selection.json → writes funnel-brief.md, audit-verdicts.json
- 08 reads funnel-brief.md, voc-bank/_bank.json → writes copy/_copy.json, chief-verdicts.json, copy/
- 09 reads asset-classify/CLAIM-LIST.json → writes asset-records.json
- 10 reads funnel-brief.md, copy/_copy.json, chief-verdicts.json, asset-records.json → writes review/_review.json, review/
- Pipeline-entry reads (no upstream producer in the active list): step 00 has empty reads (the only true entry). Terminals (consumed by nobody): queries_run.json, dumps/ (step 01), audit-verdicts.json (step 07), review/_review.json, review/ (step 10).

## Determinism pin pattern (h5-e2e / validate-smoke idiom)
`unset VOYAGE_API_KEY` at the top of the harness so any embed-touching step cannot make a live network call that breaks byte-stable re-runs (stub steps don't embed, but the pin matches the engine harnesses for safety on cross-space byte-diffs). Determinism asserted by re-running the full pipeline into a 2nd fresh space and byte-diffing every emitted artifact (exclude `_receipts/` + `*-log.txt` — per-run spawn-ids/timestamps).

## Harness idiom (mirror store/controller/manifest/stub/validate-smoke.sh)
`set -u`; `cd "$(dirname "$0")/../.."` (engine/contracts → repo root); `ok()/bad()` accumulate `FAIL=1`; inline `node -e` JSON asserts; `expect_reject` helper (non-zero exit + a named stderr pattern); disposable `runs/_vfy*` spaces + a TEMP manifest/pipeline dir for the SMOKE-05 drop/reorder fixtures; `rm -rf` after; final `ALL ASSERTS PASS`. NEVER mutate committed `pipeline.yaml`, `runs/smoke/`, or `engine/manifests/` — copy to temp dirs.

</canonical_refs>
