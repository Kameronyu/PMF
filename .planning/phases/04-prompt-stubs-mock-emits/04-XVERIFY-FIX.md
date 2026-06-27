# 04 — XVERIFY-FIX: harden `stub-smoke.sh` (false-green / over-claim remediation)

**Date:** 2026-06-27
**Branch:** `pmf-shell-build`
**Scope:** harness-only. NO prompt / manifest / `pipeline.yaml` / `run-controller.js` /
`route.js` / validator was modified. The Phase-4 build was independently confirmed sound by
the xhigh adversarial verification; this note closes the one HIGH finding it raised.

## Finding (confirmed HIGH `false_green_risk`)

`engine/contracts/stub-smoke.sh` **over-claimed its coverage**. It printed
`STUB-SMOKE: ALL ASSERTS PASS` on broken-but-hollow stubs — so once real prompts replace
the current ones (Phases 5–7), a hollow or mis-shaped emit would still report green,
defeating the milestone's Core Value (real prompts = pure drop-in slots, gated by this
regression harness). Five holes, each independently proven GREEN-but-broken.

## Fix per hole

1. **No real top-level shape assertion** (STUB-03 was only `o===null||typeof o!=='object'`).
   Added an **expected top-level shape map** (`EXPECTED_SHAPE_JSON`): every emitted `.json`
   relpath → the top-level keys that MUST be present (e.g. `brands.json→[brands]`,
   `space-map.json→[transformations,angles,niches,bet_types,mechanisms_in_play,saturation,combos,per_brand]`,
   `ntp-pick.json→[pick]`, `review/_review.json→[findings,verdict]`, …). Per emit, the
   harness now asserts those keys are present; a hollow `{}`/`[]`/`{_stub:true}` is missing
   them and FAILS by name. The map is **self-checked** against the live emits first (a probe
   pipeline run) — if a future key rename drifts the map, the harness REFUSES to run rather
   than pass stale-green.

2. **Emit indistinguishable from scaffold seed** (`store-scaffold.js` pre-seeds every `.json`
   slot with `{}\n`; a no-op emit leaves the seed and passed). Added a **non-seed assert**:
   each emitted `.json` body is rejected if byte-equal to the `{}` seed / an empty container
   (`{}\n`, `{}`, `[]`) — "emit produced content" now provably ≠ "seed untouched".

3. **WIRE-03 single-axis only** (collapse + trace was hardcoded to `transformations`). The
   block now **iterates ALL FIVE axes** (transformation, angle, niche, bet_type, mechanism).
   For each: (a) canonical set non-empty (a dropped/empty axis FAILS); (b) every
   `raw_variants`/`raw_claim_variants` value traces to a Step-2 raw label on that axis;
   (c) a **real collapse** — ≥2 distinct Step-2 raw labels fold into FEWER canonicals
   (a cosmetic 1:1 raw==canonical copy FAILS).

4. **Determinism covered only `space-map.json`.** The cross-space check now re-runs the
   **FULL 11-step pipeline** into a second fresh space and **byte-diffs EVERY emitted
   artifact** (all 20 emits; `_receipts/` + sidecar log excluded — they carry per-run
   spawn-ids/timestamps by design). Any non-byte-identical emit FAILS named.

5. **No emitted-path ↔ scaffold-slot cross-check.** Derived the authoritative slot list from
   a **freshly-scaffolded space** (file slots + dir slots). Each emitted path must be an exact
   scaffolded file slot OR live inside a scaffolded dir slot (e.g. `copy/_copy.json` under the
   `copy/` dir slot). A drifted/orphan emit path (self-consistent across manifest+stub but not
   a real slot) now FAILS. (Manifest-level graph integrity stays owned by `manifest-smoke.sh`;
   this is emit-path fidelity to the scaffold.)

## Mutation proof (six defects → named RED; disposable repo copies, NO committed file mutated)

Each mutation was injected into an isolated copy of `engine/ prompts/ pipeline.yaml` under
the scratchpad; defects targeted **unvalidated basenames** (no `route.js` validator) so the
harness's OWN new asserts are what catch them, not a Phase-3 validator. GREEN confirmed on
the real, unmodified 11 stubs.

| # | Defect injected | Named RED line (harness FAIL) |
|---|---|---|
| a  | hollow `{}` where shaped JSON required (`market-selection.json`) | `STUB-03 05-market-selection: market-selection.json is the scaffold {} seed / empty container (emit produced no content)` |
| a' | shaped but WRONG top-level key `{wrong:[…]}` (isolates hole #1) | `STUB-03 05-market-selection: market-selection.json missing expected top-level key(s): [ranked] … have [wrong]` |
| b  | no-op emit leaving the scaffold `{}` seed | `STUB-03 05-market-selection: market-selection.json is the scaffold {} seed / empty container (emit produced no content)` |
| c  | cosmetic 1:1 raw==canonical copy on a NON-transformation axis (angles) | `WIRE-03: axis angles did not collapse: raw=2 canonical=2 (a 1:1 copy is not canonicalization)` |
| d  | fully-dropped axis (`mechanisms_in_play: []`) | `WIRE-03: Step3 axis mechanisms_in_play is empty (dropped axis)` |
| e  | non-deterministic emit (per-run nonce in `market-selection.json`) | `DETERMINISM: non-deterministic emit(s): market-selection.json` |
| f  | emit to a drifted/non-scaffolded path (`market-selection-DRIFT.json`) | `STUB-03 05-market-selection: emit path "market-selection-DRIFT.json" is not a scaffolded slot (drift/orphan)` |

(The expected-shape **self-check** also fires on a/a'/f as defense-in-depth — the probe run
emits the same defect, so the live emit lacks the mapped key — an additional named RED, not a
substitute for the per-step asserts above.)

## Gate re-confirmation (all GREEN, exit 0, side-effect-free)

| Gate | Command | Exit |
|---|---|---|
| store-smoke | `bash engine/contracts/store-smoke.sh --space=smoke` | 0 |
| controller-smoke | `bash engine/contracts/controller-smoke.sh` | 0 |
| h6-all | `bash engine/contracts/h6-all.sh` | 0 |
| manifest-smoke | `bash engine/contracts/manifest-smoke.sh` | 0 |
| stub-smoke | `bash engine/contracts/stub-smoke.sh` | 0 |

No `runs/_vfy*` / `_probe` residue after the run; committed content untouched.

## Phase-5 deferrals (tracked, not dropped)

These are real gaps surfaced by the verification but **out of scope** for this harness fix.
The STUB-03 top-level-key check is a lightweight stub-gate guard, **NOT** a replacement for
real per-step field validators.

- **VALID-01..05** — `route.js` dispatches shape validators for only 4 of ~14 output
  basenames; steps 04–10 have **zero** shape enforcement at the controller's Validate phase.
  Bind real per-step `validate-*.js` in Phase 5.
- `validate-classifier.js` lacks raw→canonical trace-back and axis-presence checks → Phase 5.
- All-dir manifests run 0 validators yet mint a success receipt → Phase 5.
- `writeOne` has no `existsSync` guard (no-overwrite-v1 destructive write) →
  **explicitly DEFERRED per `CLAUDE.md`** (convention only; guard hook deferred). NOT a
  regression; left untouched.
