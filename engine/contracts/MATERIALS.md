# MATERIALS — canonical proven-material manifest (arduview bet)

**Date:** 2026-06-26 · **Source session:** REBUILD-ROADMAP **R2** (indexing) · **Driver:** `INDEXING-HANDOFF.md` Deliverable 2.
**Decision in force:** operator chose **(B)** — `marketing-lens/` is scratch (R4/R5 re-author). So this session ships **only this file**; `PROMPT-WIRING.md` and the `REGISTRY.json` `(PROVISIONAL)` `step_served` reconcile both **defer to R5** (no stable agent topology to name against yet).

**What this answers:** for the Arduview run, *which proven material to reference, where it lives, what produced it, what consumes it* — so an R5 implementer doesn't grab a stale funnel store or miss v1-only outputs. **Inventory only** — every row below was verified on disk 2026-06-26, not copied from the handoff (the handoff's table had four errors, fixed here and flagged in Gotchas).

---

## The canonical set

| material | canonical location | verified | produced by (brick / agent) | consumed by |
|---|---|---|---|---|
| brand roster | `brands.json` (top-level) | 20 brands + 4 dropped (`starting_point`/`brands`/`dropped`) | Finder → `dedupe.js` | Dumper, `fetch.js` |
| cleaned corpus | `corpus/<slug>/clean/` | 20 slugs, all 20 have `clean/` | `clean.js` (html-clean-markdown) | Dumper |
| **classified space (FULL)** | **`space-map.json` (top-level, 48 KB)** | 5 transformations · 4 niches · 17 mechanisms · **6 combos** · **20 per_brand** | Space Classifier | Market Selection Assessor |
| **run scope (chosen cell)** | **`runs/arduview/space-map.json` (9 KB)** | `_chosen_cell: novelty-object-own × edc-aesthetic-collectors`; `run_transformation`/`run_niche`; **1 combo** | operator NTP pick (post Market Selection) | Router, Section Analyzer, Funnel Architect |
| ad records | `ads/<slug>.json` | **only 4 of 20** brands: `anbernic`, `divoom`, `flipper-zero`, `nothing-phone` (+ `_adv.txt` each) | `adlib-one.js` | `funnel-assemble` |
| **funnel store + belief bank** | **`runs/arduview-v2/funnels/`** | **4 funnels → 43 vectorized belief records** (divoom 12 · gameshell 13 · playdate 9 · pocket-operator 9); `_index.json` = Voyage `voyage-3-large`, dim 1024; built 2026-06-25 | `funnel-store` + `funnel-vectorize` | Funnel Architect, RAG (`funnel-rag-query`) |
| **claim tally** | **`runs/arduview/funnels/_tally.json` (v1, 10.5 KB)** | v2 NEVER regenerated it — see Gotcha 2 | `funnel-claim-tally` | Funnel Architect |
| asset-classify outputs | `runs/arduview/asset-classify/` (**v1 — not re-run in v2**) | 52 files (`records/`, `ranked.json`, `images.json`, `videos.json`, `CLAIM-LIST.json`, `hero-edl*.json`, …) | asset chain (`asset-fetch` → Relevance Bucket / Role Classify / Comprehend Video → `asset-map-rank` → `asset-emit`) | LP builder |
| site | `runs/arduview/site/` (**v1**) | 16 files (`index.html`, `styles.css`, `script.js`, `deposit.html`, `order-confirmation-email.html`, `STYLE-LOCK.md`, `assets/`) | LP builder | deploy (`surge-deploy` / `shopify-deploy`) |
| crowdfunding raw | `runs/arduview/crowdfunding/` (**v1**) | **gameshell only** — `gameshell`, `gameshell-kbf`, `gameshell-wb`, `gameshell-wb2` (16 files) | `crowdfund-fetch` | `funnel-score` (Currency B) |
| **SUPERSEDED — do NOT use** | **`runs/arduview/funnels/` (pre-recovery, built 2026-06-05)** | 6 JSONs incl. `_index.json`; replaced by `arduview-v2/funnels/` — **except `_tally.json`, sourced here (Gotcha 2)** | — | — |

**v1 deep-pass intermediates** (provenance only, NOT canonical inputs): `runs/arduview/funnels-assembled/` (4), `funnels-clean/` (4), `funnels-scored/` (4), `funnels-analyzer-out/` (4).

---

## The v1/v2 split, resolved

The Phase-21 hardening re-run wrote `runs/arduview-v2/` but **only re-ran the funnel store+vectorize** (4 funnels). Everything else stayed in `runs/arduview/` (v1). So the canonical composite is **not** "use v2" or "use v1" — it's **v2 funnel store + v1 for all else**:

- **Take from v2:** `runs/arduview-v2/funnels/` (store + `_index.json` vectors). It supersedes `runs/arduview/funnels/` (Jun 25 vs Jun 5).
- **Take from v1 (`runs/arduview/`):** `asset-classify/`, `site/`, `crowdfunding/`, and **`funnels/_tally.json`** — none were re-run in v2.
- **Never use:** `runs/arduview/funnels/*.json` + `_index.json` (the superseded store). The *only* live file in that dir is `_tally.json`.

**no-overwrite-v1 rule (CLAUDE.md D-07/08/09):** a re-run writes a NEW versioned space (`runs/arduview-v3/…`), never mutates any path above in place. v1/v2 stay intact for provenance and diffing.

---

## Gotchas (handoff corrections)

1. **"43 records" ≠ 43 funnel files.** The handoff implied 43 records as the store size. Disk: **4 funnel JSONs**; `_index.json._meta` = `funnel_count: 4, record_count: 43`. The 43 is *vectorized belief records* (12+13+9+9) across the 4 funnels. An implementer pointing a loader at `*.json` gets 4 funnels; the RAG index holds 43 vectors.
2. **`_tally.json` lives ONLY in the superseded v1 dir.** Funnel Architect needs it (per `marketing-lens/MAP.md` Step 4), but `funnel-claim-tally` was not re-run for v2. So you must read the canonical funnel store from `arduview-v2/funnels/` **and** its claim tally from `arduview/funnels/_tally.json` — split across the "use" and "do-NOT-use" dirs. (Cleanest R5 fix: regenerate `_tally.json` into the v2 store so the gotcha disappears.)
3. **Two `space-map.json` files, both real — not stale-vs-fresh.** Top-level (48 KB) = full classified space (all 6 combos, 20 brands) → Market Selection Assessor. `runs/arduview/` (9 KB) = post-pick run scope (1 chosen combo + `run_transformation`/`run_niche`) → deep pass. The handoff called only the top-level "canonical" and omitted the run-scope file the Router/Architect actually read.
4. **Ad records cover only 4 of 20 brands** (`anbernic`, `divoom`, `flipper-zero`, `nothing-phone`). Don't assume `ads/<slug>.json` exists for every roster brand — `funnel-assemble` had ad data for 4.

---

## Done-when

- ✅ `engine/contracts/MATERIALS.md` exists; every row verified on disk 2026-06-26.
- ✅ An implementer can answer from this file alone: *for any proven Arduview material — where is it, what produced it, what consumes it, and is it v1 or v2.*
- ⏸️ Deferred to R5 (per decision B): `PROMPT-WIRING.md`, and clearing the `(PROVISIONAL)` `step_served` labels in `REGISTRY.json`.
