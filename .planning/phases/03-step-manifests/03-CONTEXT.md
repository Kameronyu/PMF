# Phase 3 — Step Manifests ×11 (the wiring)

## Goal (one paragraph)

Author **11 declarative step manifests** (canonical R1 order, steps 0..10) under `engine/manifests/<id>.json`, in the exact §5 shape the existing `run-controller.js` already loads via `loadManifest`/`parsePipeline` (keys: `id, reads, writes, scripts, prompt, agents, validator, gate`). Each manifest's `reads[]`/`writes[]` are **derived from PART0 + PART3 §5.2 + the per-step briefs + the already-scaffolded store slot list** (NOT invented). The producer→consumer graph across all 11 must close: **zero orphan outputs, zero dangling inputs** — every `writes[]` slot is consumed downstream or is a terminal deliverable; every `reads[]` slot is produced upstream or is a documented pipeline-entry input (operator intake / KB digest / operator assets, seeded into the store). Wire `pipeline.yaml` (already lists 0..10) to walk the real `engine/manifests/` set (the controller's `DEFAULT_MANIFEST_DIR` is already `engine/manifests`). Reuse the controller with **no rewrite** — adapt manifests to its contract. Author the Wave-0 RED harness `engine/contracts/manifest-smoke.sh` first, then build the manifests GREEN. Honor no-overwrite-v1.

## Constraints / locked decisions

- **WIRE-01:** Step 0 `writes[]` includes `asset-classify/CLAIM-LIST.json`; Step 9 `reads[]` includes it (closes Step 9's dangling input).
- **WIRE-02:** Step 7 `reads[]` includes BOTH `bet-brief.md` AND `product-intake.md`.
- **Gate set (`gate:true`) is exactly {0,1,5,7,8,10}**; all others `false` (MANIFEST-03; matches ONE-SHOT §6 ★ rows: 0 Bet, 1 Collect apply-flags, 5 NTP pick, 7 review, 8 chief, 10 re-review).
- **Preflight grain:** the controller's `preflight()` rejects any `reads[]` path that is not an existing **regular file**. So `reads[]` must point at file-grained artifacts (seeded pipeline-entry files or upstream file writes), never at directory/fan-out slots. Directory/fan-out artifacts (`dumps/`, `funnels/`, `voc/market-signal/`, `voc-bank/`, `copy/`, `review/`) are declared in `writes[]` and graph-tracked, but a downstream consumer preflights on the file-grained representative (e.g. Step 2 reads `brands.json` not `dumps/`; Step 7 reads `funnels/_tally.json` not `funnels/`).
- **`writes[0]` must be a concrete file** (the controller's `mockEmit` writes to `writes[0]`).
- **Architecture wins** where a brief's prose disagrees with PART0/§6 (precedence rule #1). Step-00 brief folds intake in and omits CLAIM-LIST; §6 splits them out — wire all three per §6. Step-07 brief omits `product-intake.md` by name; §6 + WIRE-02 require it — wire both.

## Canonical artifact slots (authoritative filenames — from the scaffolded store + ONE-SHOT §6 + PART0)

Confirmed present in `engine/bricks/store-scaffold.js` and seeded in `runs/smoke/`:
`bet-brief.md`, `product-intake.md`, `asset-classify/CLAIM-LIST.json`, `brands.json`, `queries_run.json`, `dumps/`, `funnels/` (+ `funnels/_tally.json`), `ad-volume-aggregate.json`, `space-map.json`, `voc/market-signal/` (fan-out), `voc/gap_candidates.json`, `market-selection.json`, `ntp-pick.json`, `voc-bank/`, `awareness-read.json`, `funnel-brief.md`, `audit-verdicts.json`, `copy/`, `chief-verdicts.json`, `asset-records.json`, `review/`, `_receipts/`.

Pipeline-entry inputs (no upstream producer; seeded into the store): operator intake / KB digest (→ Step 0), operator assets (→ Step 9). Step 0 has no `runs/` reads.

<canonical_refs>
- basis/build-base/ONE-SHOT-SHELL.md        # build mandate + §6 orientation slot table (★ gate set)
- basis/build-base/SHELL-BUILD-SPEC.md       # §5 manifest shape example, §11 DoD
- basis/build-base/architecture/PART0--pipeline-flow.md            # canonical end-to-end flow
- basis/build-base/architecture/PART3--architecture-design.md      # §5.2 consumption matrix, §8 orchestration, §9 seams, §1.5/§1.6 R1 order, §6.x cards
- basis/build-base/briefs/STEP-00-bet-compiler.md
- basis/build-base/briefs/STEP-01-competition-collect.md
- basis/build-base/briefs/STEP-02-funnel-analysis.md
- basis/build-base/briefs/STEP-03-space-map.md
- basis/build-base/briefs/STEP-04-voc-market-pass.md
- basis/build-base/briefs/STEP-05-market-selection.md
- basis/build-base/briefs/STEP-06-voc-deep-pass.md
- basis/build-base/briefs/STEP-07-funnel-architect.md
- basis/build-base/briefs/STEP-08-copywriter.md
- basis/build-base/briefs/STEP-09-asset-classify.md
- basis/build-base/briefs/STEP-10-adversarial-review.md
- basis/build-base/skills/bet-compiler/SKILL.md   # envelope yardstick
- engine/bricks/run-controller.js                 # loadManifest/parsePipeline — the §5 shape to match (DO NOT rewrite)
- pipeline.yaml                                    # steps 0..10 R1 order (walked by `run all`)
- engine/bricks/store-scaffold.js                  # the authoritative artifact slot list
- runs/_fixture/pipeline/manifests/fx-*.json       # fixture manifests (shape reference; controller currently only runs these)
- engine/contracts/store-smoke.sh                  # harness style to mirror
- engine/contracts/controller-smoke.sh             # harness style to mirror
</canonical_refs>

## Deliverables

1. `engine/manifests/00-bet-compiler.json` … `10-adversarial-re-review.json` (11 files, ids matching `pipeline.yaml`).
2. `engine/contracts/manifest-smoke.sh` — asserts MANIFEST-01..04 + WIRE-01 + WIRE-02 + graph integrity (orphans=0/dangling=0) + controller can load the real set. Authored RED first.
3. `pipeline.yaml` already points the controller at `engine/manifests/` via DEFAULT_MANIFEST_DIR — confirm `run all --space=smoke` walks the real manifests.

## Acceptance

- `bash engine/contracts/manifest-smoke.sh` → ALL ASSERTS PASS.
- The 4 existing gates stay green: store-smoke, controller-smoke, h6-all, manifest-smoke.
