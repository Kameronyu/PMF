# 21-CLOSEOUT-SUMMARY — deterministic Phase-21 hardening gaps, closed

**Date:** 2026-06-26 · **Driver:** `HARDENING-CLOSEOUT.md` run via the `/automate` execution protocol.
**Outcome:** every deterministic brick Phase-21 left `untested` is now **proven green** with a committed
fixture smoke; the externally-effecting and IP/env-gated bricks are **honestly labeled** (`dry-run-verified`
/ `partial` / `deferred R6|R7` + reason). **Zero bricks left ambiguously `untested`.**

Re-verify everything in one command: `bash engine/contracts/h6-all.sh` (runs h5-e2e + all H6 smokes).

---

## Final REGISTRY health — 26 capabilities
| state | count | which |
|---|---|---|
| `working` | 22 | incl. the 11 H6 Bucket-A bricks below + the 11 already green from H5/P21 |
| `dry-run-verified` | 1 | `surge-deploy` (compiles + preconditions; live push → R7) |
| `partial` | 1 | `chrome-cdp` (loads + graceful fail; live drive needs operator Windows Chrome) |
| `untested` **but deferred** | 2 | `reddit-extract` (R6), `crowdfund-fetch` (R7) |

`working`-with-caveat (proven core, one hop deferred — noted in each REGISTRY entry):
`funnel-assemble` (deterministic spine proven; live LP render → R7), `asset-fetch` (local proven; remote → R7),
`meta-ad-fetch` (extraction proven; typeahead → R7), `asset-classify-build` (map-rank→emit→validate proven;
video-frame py helpers are live-only).

---

## Bucket A — closed NOW (11 bricks, each: fixture → golden assert → `working` → atomic commit)
| capability | smoke | fixture |
|---|---|---|
| html-clean-markdown | `h6-clean.sh` | `runs/_fixture/corpus/sample-brand/raw/landing.html` |
| dedupe | `h6-dedupe.sh` | `runs/_fixture/brands.json` |
| revenue-estimate | `h6-revenue.sh` | (reuses `brands.json`) |
| funnel-claim-tally | `h6-claim-tally.sh` | golden-compare vs `runs/_fixture/funnels/_tally.json` |
| funnel-analyzer-context | `h6-analyzer-context.sh` | `runs/_fixture/funnels-clean/…` + inject-dr |
| mechanisms-aggregate | `h6-mechanisms.sh` | `runs/_fixture/mechanisms/{sidecar,space-map}` |
| funnel-assemble (det. spine) | `h6-funnel-assemble.sh` | `runs/_fixture/ads/sample-ads.json` |
| audit-tooling (×4) | `h6-audit.sh` | `runs/_fixture/audit/…` |
| asset-classify-build | `h6-asset-classify.sh` | `runs/_fixture/asset-classify/…` |
| asset-fetch (local) | `h6-asset-fetch.sh` | PIL-generated in-smoke (no binary blobs) |
| product-video-assemble | `h6-video-assemble.sh` | source clip generated in-smoke (bundled ffmpeg) |

## Bucket B — best-effort dry-run (`h6-bucketB.sh`)
- `surge-deploy` → **dry-run-verified**: compiles + deploy preconditions (SITE, npx). Live surge.sh push not exercised.
- `chrome-cdp` → **partial**: loads + `status` fails gracefully (ECONNREFUSED) with no Chrome. Live drive is env-dependent.

## Bucket C — deferred, NOT forced green (blocker-protocol W1 evidence captured this session)
- `reddit-extract` → **R6** (reddit OAuth). W1 `.json` alt-rep probed → **HTTP 403** (datacenter WAF); residential/headed works.
- `crowdfund-fetch` → **R7**. W1 probed: **kickstarter 403** (Cloudflare) but **crowdsupply 200** — host-specific, not blanket; R7 can start with crowdsupply.
- `asset-fetch` REMOTE path → **R7** (local mode is working).
- `meta-ad-fetch` `#adlib-typeahead-resolve` → **R7** (extraction works; headless typeahead empty → forcedPageId/keyword-URL/CDP).

---

## Bugs found + fixed this pass (both silent post-reorg path breaks; see ERROR-NOTES)
1. **`funnel-analyzer-context`** spawned `engine/bricks/hooks/inject-dr.js` (should be `../hooks/`) → MODULE_NOT_FOUND → exit 2. Fixed `a57d30e`.
2. **`asset-map-rank`** resolved `tools/asset/section-table.json` (pre-reorg; gone) → exit 1 on every run. Fixed `0ad0fe6`.

Both were invisible because nothing exercised those code paths before H6 — the smokes surfaced them.

## Doc-drift corrected (closeout/REGISTRY rows that disagreed with the code)
- `clean.js` uses `--in/--out` (not `--space`) and does **not** mark `[SECTION]` (that's `funnel-clean.js`).
- `mechanisms-aggregate` reads a `canonical_mechanisms` sidecar + `space-map.json` and writes **into** the space-map — it does **not** read funnels nor write `mechanisms-tally.json`.

## Firewall
`engine/hooks/guard-marketing.js` wired as a PreToolUse `Write|Edit|MultiEdit` hook in `.claude/settings.json`;
`off-limits.json` enforcement → **WIRED**. Hardened to read the target path from argv → `$CLAUDE_TOOL_INPUT_PATH`
→ stdin `tool_input.file_path` (fails open so engine work is never bricked). **Verified live this session** — a
probe Write to `runs/*/_marketing-decisions/` was physically blocked. All writes this run stayed in `engine/` + `runs/_fixture/`.

## Open follow-ups (out of this pass's scope — for the operator / R5–R7)
- **SECURITY:** `surge_drive.py` carries a committed throwaway password (line 11) — move to `--creds`/env at R7.
- `reddit-extract` (R6 OAuth), `crowdfund-fetch` + `asset-fetch` remote + adlib typeahead (R7 live E2E / residential IP).
- `pipeline-audit` SKILL path refs still need a post-reorg touch-up (operator scope).
- REGISTRY `step_served` labels remain `(PROVISIONAL)` — reconcile at R5 against the rebuilt marketing topology.

## RESOLVE checklist — done
- [x] REGISTRY: Bucket A → `working`; B → `dry-run-verified`/`partial`; C → `deferred` + reason; `_meta.health` updated.
- [x] ERROR-NOTES: 2 new bugs OPEN→FIXED with hashes; `#reddit-extract-fingerprint` + `#adlib-typeahead-resolve` kept OPEN.
- [x] REUSE-INDEX: both gray-lines resolved (asset-classification = engineering; analyzer/funnel straddle = wiring reusable, rubric re-authored).
- [x] Re-verify: `h6-all.sh` → 13/13 green (h5-e2e + 12 H6 smokes).
- [x] This summary written.
