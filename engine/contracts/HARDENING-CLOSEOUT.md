# HARDENING-CLOSEOUT — close the deterministic Phase-21 gaps (turnkey /automate scope)

**Date:** 2026-06-26 · **From:** the R2 indexing session · **To:** a FRESH session running `/automate`.
**Goal:** smoke-test + flip to `health: working` every deterministic brick Phase 21 left `untested`, atomic-commit each, then run the RESOLVE checklist. Leave the IP/live-network bricks honestly deferred to R6/R7 — do NOT force them green.

**This is turnkey.** Everything you need is below or pointed at. The smoke pattern to copy is `engine/contracts/h5-e2e.sh` (fixture-in → assert required fields → exit code). Authoritative brick index is `engine/contracts/REGISTRY.json`.

---

## TL;DR for the executor
1. Read Guardrails (firewall + atomic commits) — non-negotiable.
2. Run `/automate` over **Bucket A** (below): per brick → locate/build fixture → run → golden assert → flip REGISTRY health → atomic commit.
3. **Bucket B** = best-effort dry-run (mark partial). **Bucket C** = DO NOT TOUCH except to stamp `deferred: R6/R7` + reason.
4. Run the **RESOLVE checklist** → finalize REGISTRY, ERROR-NOTES, REUSE-INDEX; re-verify.

---

## Context (why this exists — don't re-derive)
Phase 21 (R0) hardened the engine and proved the **deterministic funnel spine** via the fixture E2E `h5-e2e.sh` → those 11 are `working`. The 15 `untested` are three buckets:
1. **Off-spine deterministic bricks** whose health was never flipped (the harness starts from a committed funnel fixture, so it never exercised them). ← **this run closes these.**
2. **Live-network bricks** unverifiable from this AWS-datacenter / WSL-headless IP (reddit WAF, adlib typeahead empty, live fetch). ← **roadmap-deferred to R6 (reddit OAuth) / R7 (live E2E).**
3. **"Let holes show on first run"** — the operator stance; nothing was marked green that wasn't proven. `untested` = "no proof captured," not "broken."

---

## Guardrails (CRITICAL — read before running)
- **Marketing firewall** (`engine/contracts/off-limits.json`): WRITE only into `engine/` and `runs/_fixture/`. NEVER edit `marketing-lens/`, `prompts/`, `definitions.md`, `workflow.md`, `runs/*/_marketing-decisions/`.
- **Wire the guard first** (HARDENING.md §Guard): register `engine/hooks/guard-marketing.js` as a `PreToolUse` Write|Edit hook in `.claude/settings.json`, then flip `off-limits.json` `_meta.enforcement` → `WIRED`. Makes the firewall physical for this run.
- **no-overwrite-v1** (CLAUDE.md): never mutate committed run outputs. Smokes write to a transient `runs/_fixture-*/` that you `rm -rf` at the end — exactly like `h5-e2e.sh`.
- **Atomic commit per brick** (GSD-style, `gsd-undo`-able). Message: `H6(engine): smoke + green <capability> (#<anchor>)` + the `Co-Authored-By` line.
- **Deps preflight:** confirm `.venv` has `pillow imagehash imageio-ffmpeg` and that `playwright` is importable; confirm `ffmpeg` for the video brick. If missing, that's a Bucket-B blocker, not a failure.

---

## Bucket A — CLOSE NOW (the target of this run)

Pure-deterministic, no external effect, fixture-smokeable. Build the fixture if it doesn't exist (commit it under `runs/_fixture/`).

| capability | file(s) | run | smoke: fixture → assert | fixture |
|---|---|---|---|---|
| `html-clean-markdown` | `clean.js` | `node engine/bricks/clean.js --space=<sp>` | raw `*.html` in `corpus/<slug>/raw/` → `clean/*.md` non-empty, tags stripped, `[SECTION]` on headings | **BUILD** tiny raw-html fixture |
| `dedupe` | `dedupe.js` | `node engine/bricks/dedupe.js` | `brands.json` with dup slugs → output count < input, no dup slugs | **BUILD** brands-with-dupes fixture |
| `revenue-estimate` | `revenue-est.js` | `node engine/bricks/revenue-est.js` | brands fixture → each brand gets numeric `revenue_est` | reuse brands fixture |
| `funnel-assemble` | `funnel-assemble.js` | `node engine/bricks/funnel-assemble.js --space=<sp>` | `ads/<slug>.json` fixture → `funnels/<id>.json` w/ required fields; golden-compare vs `runs/_fixture/funnels-assembled/gameshell-kickstarter.json` | **BUILD** ads input fixture (output golden EXISTS) |
| `funnel-claim-tally` | `funnel-claim-tally.js` | `node engine/bricks/funnel-claim-tally.js --space=<sp>` | `runs/_fixture/funnels/*.json` → `_tally.json`; **golden-compare vs `runs/_fixture/funnels/_tally.json`** | **EXISTS (golden)** |
| `funnel-analyzer-context` | `funnel-analyzer-context.js` | `node engine/bricks/funnel-analyzer-context.js <id>` | fixture funnel record + DR bundle → non-empty context block | **BUILD** (reuse `funnels/sample.json`) |
| `mechanisms-aggregate` | `aggregate-mechanisms-in-play.js` | `node engine/bricks/aggregate-mechanisms-in-play.js --space=<sp>` | `runs/_fixture/funnels` → `mechanisms-tally.json` non-empty | reuse `_fixture/funnels` |
| `asset-classify-build` | `asset-map-rank.js`, `asset-emit.js`, `asset/probe.py`, `probe_video.py`, `frame-grab.py`, `sample_montage.py` | `node asset-map-rank.js` → `node asset-emit.js` | fixture asset records + a sample image → `ranked.json` → `images.json/videos.json`; py probes return hashes/dims | **BUILD** small asset+image fixture |
| `asset-fetch` (local mode) | `asset-fetch.js`, `asset/probe.py` | `node engine/bricks/asset-fetch.js --local=<dir>` | a local dir of images → `assets/raw/*` + `raw-manifest.json` (this path is offline; the REMOTE download path is Bucket C) | **BUILD** local image dir fixture |
| `product-video-assemble` | `asset/video-assemble.py` | `.venv/bin/python …/video-assemble.py <edl>` | tiny `hero-edl.json` + sample frames → `cuts/<name>.mp4` exists, non-zero size (needs ffmpeg) | **BUILD** mini-edl + frames |
| `audit-tooling` | `audit-inject.js`, `audit-resolve.js`, `validate-receipt.js`, `validate-strip.js` | `node engine/bricks/audit-inject.js …` | evidence-manifest fixture + law → assembled cold-context; receipt gate exit 0 on match / non-0 on mismatch; strip removes justification | **BUILD** mini manifest fixture |

**Per-brick done = golden assert passes + REGISTRY health flipped to `working` + atomic commit + fixture committed.**

---

## Bucket B — best-effort dry-run (close what's possible; mark the rest)
| capability | why not fully smokeable | do this |
|---|---|---|
| `surge-deploy` (`surge/surge_drive.py`) | a real run deploys live to surge.sh (external effect) | `--help`/arg-validation/dry-run smoke → health `dry-run-verified`; note "live deploy unverified" |
| `chrome-cdp` (`cdp/*.cjs` + `win-chrome-forwarder.py`) | needs a reachable Chrome (Windows Chrome via the forwarder — env-dependent) | attempt `cdp.cjs goto <url>` via the forwarder (see `reference_wsl_windows_chrome_cdp` runbook). If Chrome reachable → smoke + green; else `--help` smoke → `partial`, note env dependency |

---

## Bucket C — DEFER R6/R7 (do NOT force green; the wall is IP/env, not code)
`reddit-extract`, `crowdfund-fetch`, `asset-fetch` (REMOTE download path), and the OPEN `#adlib-typeahead-resolve` gap. For each: **leave health as-is, add `"deferred": "R6"` (reddit/VOC) or `"R7"` (live fetch/E2E) + a one-line reason** to its REGISTRY entry. `/automate`'s blocker protocol (W1 alt-endpoint → W2 OAuth → W3 investigation subagent → W4 real-input RPA) should *confirm and document* the wall, not fake a pass. Real fixes: reddit → official OAuth API (R6); adlib typeahead → `forcedPageId`/keyword-URL/CDP; crowdfund/asset-remote → residential IP at R7.

---

## RESOLVE checklist (after Bucket A is green) — "resolve everything"
1. **REGISTRY:** every Bucket-A capability that smoked → `health: working`. Bucket-B → `dry-run-verified`/`partial`. Bucket-C → keep + `deferred: R6/R7` + reason.
2. **ERROR-NOTES.md:** move newly-closed items OPEN→FIXED with commit hashes. Keep `#adlib-typeahead-resolve` and `#reddit-extract-fingerprint` OPEN (deferred).
3. **REUSE-INDEX.md — resolve the two gray-lines:**
   - **#1 asset-classification → ENGINEERING (operator-confirmed).** Its deterministic bricks are hardened in this run; its perceptual classifier *logic* is reused via `engine/prompts/_specs/image-classifier-brick.md` (§2). Any marketing-flavored copy in the `09/10/11` instances is re-authored at R5 — do not carry the instances across the firewall.
   - **#2 section-analyzer/funnel straddle → already resolved:** firing/contract wiring reusable (§1–2); marketing rubric re-authored (§5). Just confirm the wording.
4. **Re-verify:** `bash engine/contracts/h5-e2e.sh` green + every new smoke green.
5. **Stamp status:** write a short `21-CLOSEOUT-SUMMARY.md` (or append to INDEXING-HANDOFF) — health is now `N working / M deferred(R6/R7) / 0 unexplained-untested`.

---

## Done-when
- Every Bucket-A capability `health: working` in REGISTRY — each backed by a committed fixture smoke + atomic commit.
- Every Bucket-B/C brick explicitly labeled (`dry-run-verified` / `partial` / `deferred: R6|R7` + reason) — **zero bricks left ambiguously `untested`.**
- REUSE-INDEX gray-lines resolved; ERROR-NOTES reconciled to git; `h5-e2e.sh` + new smokes all green.
- A reader of REGISTRY can tell, for every brick: **green = proven**, **deferred = why + when**. Then the engine is safe to hand off.
