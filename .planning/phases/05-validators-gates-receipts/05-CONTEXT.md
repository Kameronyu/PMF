# Phase 5 — Validators, Gates & Receipts — CONTEXT

**Goal (one paragraph):** Bind a real per-step validator to every step's `writes[]` so a wrong-shaped / missing / hollow output produces a NAMED validator REJECT (not the current "pass silently" for ~14 of ~20 output basenames); strengthen preflight to REFUSE an empty/hollow load-bearing INPUT (VALID-02); make the 6 gated steps block-and-log with a real `gate.decision` written into the receipt (VALID-03/04/05); and keep the `_receipts/` chain unbroken and write-once. The acceptance invariant: `run all --space=smoke` still completes end-to-end clean because the Phase-4 stub emits are well-formed and the real validators PASS on them, while mutations (wrong shape / hollow input / dropped axis / missing file) REJECT by name.

<canonical_refs>

## PART3 §8 — the 7-phase loop (the phases this phase touches)
- **Phase 1 Preflight** (`run-controller.js preflight()`): checks every `reads[]` exists + is-a-file. VALID-02 adds: a load-bearing INPUT that is empty / `{}` / `[]` / null-content → NAMED REFUSE (exit 3), never proceed on hollow data. store-scaffold pre-seeds `.json` slots with `{}\n` so "file exists" ≠ "has content".
- **Phase 5 Validate** (`run-controller.js validate()`): for each output, runs `[m.validator, out]` if `m.validator` set, else `[route.js, out]` (basename dispatch). VALID-01: every output basename must reach a real validator that checks presence + top-level OUTPUT-CONTRACT keys + non-hollow.
- **Phase 6 Store+receipt** (`storeAndReceipt()` → `receipt-write.js`): write-once receipt with `inputs_hash` (sha256 sorted input bytes), `validator_verdicts` (default `[]` — Phase 5 populates), `gate:{step_gated,decision}` (decision was `null` — Phase 5 populates).
- **Phase 7 Operator-gate** (`operatorGate()`): gated step + `--smoke` → `auto-approved-smoke`, logged. The decision string must flow into the receipt (VALID-05).

## REQUIREMENTS VALID-01..05 (exact)
- VALID-01: per-step validator checks output exists + carries declared top-level keys (OUTPUT CONTRACT shape).
- VALID-02: validator/preflight refuses a missing/empty load-bearing field (P3) — never improvise.
- VALID-03: validators loose now (presence/shape); field-continuity deferred, addable with no rewiring.
- VALID-04: every spawn writes a receipt (inputs hash + validator verdicts + ledger entry); chain unbroken.
- VALID-05: operator gates block-and-log; a deferred/auto-approve decision is recorded, never silent.

## route.js dispatch (current → extended)
Current: brands.json→finder+revenue; dump.json→dumper; space-map.json→classifier; *-beliefs.json→analyzer; **any other path → pass silently**. Extend: ALL output basenames covered; unknown `.json`/`.md` → `validate-shape.js` (declarative shape map); never silent-pass a real output basename.

## Per-step writes[] + live emitted top-level shapes (authoritative, from a fresh `run all`)
| basename | top-level shape |
|---|---|
| bet-brief.md / product-intake.md / funnel-brief.md | `__MD__` (non-empty markdown) |
| asset-classify/CLAIM-LIST.json | `[claims]` |
| brands.json | `[brands]` (also deep: validate-finder + validate-revenue) |
| queries_run.json | `[queries]` |
| ad-volume-aggregate.json | `[rows]` |
| funnels/_tally.json | `[funnels]` |
| space-map.json | `[transformations,niches,angles,bet_types,mechanisms_in_play,saturation,combos,per_brand]` (also deep: validate-classifier + WIRE-03 trace) |
| voc/market-signal/_index.json | `[cells]` |
| voc/gap_candidates.json | `[candidates]` |
| market-selection.json | `[ranked]` |
| ntp-pick.json | `[pick]` |
| voc-bank/_bank.json | `[entries]` |
| awareness-read.json | `[awareness_stage,basis]` |
| audit-verdicts.json | `[verdicts]` |
| copy/_copy.json | `[sections]` |
| chief-verdicts.json | `[verdicts]` |
| asset-records.json | `[records]` |
| review/_review.json | `[findings,verdict]` |

## WIRE-03 (classifier trace-back + axis-presence — recorded Phase-5 deferral)
space-map's 5 canonical axes (transformations/angles/niches/bet_types/mechanisms_in_play) each carry `raw_variants` (or `raw_claim_variants`). Every raw_variant must trace to a real Step-2 raw label on that axis in `funnels/_tally.json` (funnel-level `transformation/angle/niche/bet_type/mechanism`); no axis may be empty/dropped. The Phase-4 stub-smoke harness already checks this; the classifier validator must now enforce it too.

## Gates (6 gated steps): 00, 01, 05, 07, 08, 10 (`gate:true`). receipt.gate.decision = `auto-approved-smoke` in smoke mode; `null` for non-gated.

## Receipt shape (receipt-write.js): `{spawn_id, step, space, inputs_hash, inputs[], outputs[], validator_verdicts[], gate:{step_gated,decision}, ts}`. Write-once (refuses on existing path — do not regress).

## Determinism pin (h5-e2e idiom): `unset VOYAGE_API_KEY` before embed-touching steps so re-runs are byte-identical. Stub steps don't embed, but the harness mirrors the pin for safety on any cross-space byte-diff.

## Harness idiom (store-smoke.sh / stub-smoke.sh): `set -u`; `cd "$(dirname "$0")/../.."`; `ok()/bad()` accumulate `FAIL=1`; inline `node -e` JSON asserts; mutation tests into disposable `runs/_vfy*` spaces, `rm -rf` after; final `ALL ASSERTS PASS`. NEVER mutate a committed file — copy to a temp manifest-dir / temp space.

</canonical_refs>
