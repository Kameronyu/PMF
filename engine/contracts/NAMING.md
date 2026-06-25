# NAMING.md — the canonical naming law for the engine

**Status:** authoritative. Every name in `engine/` obeys this file. If code and this file disagree, this file wins and the code is renamed.
**Date:** 2026-06-24 · Reconciled against `CLAUDE.md` (Step/Stage/Phase vocab) + `capability_inventory.md` (brick taxonomy).

The engine is the **wiring substrate** — the deterministic half of the project that survives the marketing rewrite. This file names every part of it so the substrate is stable, greppable, and self-documenting. The marketing half (agent judgment) is named by the operator and is out of scope here.

---

## 1 · Vocabulary that never collides (inherited from CLAUDE.md — DO NOT reuse)

| Term | Means | Form |
|---|---|---|
| **Step** | a PMF research step | `S0`–`S8` (workflow.md) |
| **Stage** | a GSD build unit | `M1-Sn` |
| **Phase** | GSD roadmap index only | `Phase N` (= Stage M1-SN) |
| **Brick** | a single-job executor | `S-brick` (script) · `H-brick` (hook) · `A-brick` (agent) |
| **Capability** | a named thing the engine can DO | kebab-case id (`lp-clean-markdown`) |

A research Step is never called a Phase. Engine names never reuse `S0`–`S8`, `M1-Sn`, or `Phase N` for anything else.

---

## 2 · The top-level tree (canonical homes)

**PHYSICAL layout = relocation-only (structure-preserving).** The reorg keeps `tools/`'s internal
structure so every `__dirname`/relative reference survives untouched (`route.js`→validators same dir;
`asset-fetch.js`→`./asset/probe.py`; funnel scripts→`./lib/embed`). The capability grouping
(fetch/clean/funnel/asset) is the **logical view in `REGISTRY.md`**, NOT physical sub-dirs. Renames to
canonical names (§3) are a rebuild-time choice, deferred.

```
engine/
  bricks/          # ALL of tools/*.js, FLAT (fetch, clean, dedupe, funnel-*, asset-*,
    *.js           #   aggregate-mechanisms-in-play, revenue-est, audit-*, validate-receipt/strip)
    asset/         #   from tools/asset/ — probe.py, probe_video.py, frame-grab.py,
                   #   sample_montage.py, video-assemble.py, section-table.json
    lib/           #   from tools/lib/ — embed.js  (funnel-*.js require('./lib/embed'))
  hooks/           # from tools/hooks/, FLAT (route.js finds validators via __dirname — keep flat)
    route.js       #   PostToolUse dispatcher (filename → validator)
    validate-*.js  #   6 enforcers (import ../contracts/enums.json after H0)
    inject-*-dr.js #   4 DR-context bundlers
    guard-marketing.js  # PreToolUse marketing firewall (reads off-limits.json) — staged, see §7
  integrations/    # generic external-service automation (promoted out of runs/arduview/_tooling)
    cdp/           #   cdp.cjs, drive.cjs, clickxy.cjs, win-chrome-forwarder.py
    surge/         #   surge_drive.py
    shopify/       #   shopify-deploy-funnel.js, shopify-upload-assets.js
    cloudflare/    #   cf.js, cf-migrate-dns.js
    klaviyo/       #   kl.js
  contracts/       # SINGLE SOURCE OF TRUTH (this dir)
    NAMING.md · enums.json · off-limits.json · schemas/*.schema.json
    REGISTRY.json/.md · AMBIGUITY-LEDGER.md · ERROR-NOTES.md · HARDENING.md
```
> `reddit-extract/dump.mjs` stays in `.claude/skills/reddit-extract/` (skill-co-located; indexed in REGISTRY, not moved).

**Rule of placement.** A new file goes where its *job* lives, not where it was first written:
- deterministic pipeline transform → `bricks/<domain>/`
- talks to an external service → `integrations/<service>/`
- gates or fires a write → `hooks/`
- a shared definition the whole engine reads → `contracts/`

---

## 3 · File naming

| Class | Pattern | Examples |
|---|---|---|
| **S-brick** | `<domain>-<verb>.js` (verb = imperative deterministic job) | `site-fetch.js`, `html-clean.js`, `funnel-assemble.js`, `funnel-score.js`, `asset-emit.js`, `revenue-estimate.js` |
| **Python brick** | `<domain>-<verb>.py` or `<noun>_<verb>.py` (keep existing snake) | `probe_video.py`, `frame-grab.py`, `video-assemble.py` |
| **Integration** | `<service>-<verb>.{js,cjs,py}` under `integrations/<service>/` | `shopify-deploy-funnel.js`, `surge-deploy.py`, `cdp.cjs` |
| **Validator** | `validate-<producer>.js` (producer = the agent/brick whose output it gates) | `validate-finder.js`, `validate-analyzer.js` |
| **Injector** | `inject-<consumer>-dr.js` (consumer = the agent the bundle feeds) | `inject-market-selection-dr.js` |
| **Contract** | enum keys `UPPER_SNAKE` in one `enums.json`; record schema `<record>.schema.json` | `belief-record.schema.json` |
| **Skill (wiring orchestrator)** | `.claude/skills/<name>/SKILL.md` | (orchestration only after the A3 split) |
| **Agent prompt (marketing)** | `.claude/skills/<name>/AGENT-<name>.md` | operator-owned; out of scope here |

**Approved verb set** (deterministic jobs): `fetch · clean · dedupe · normalize · assemble · score · store · vectorize · query · tally · emit · rank · upload · estimate · probe · grab · deploy · drive · route · validate · inject · resolve`. A new brick uses one of these or adds to the list in a PR — never invents a synonym (no `get`/`pull`/`build` where `fetch`/`assemble` already mean it).

**This pass = relocation only (stems unchanged).** `tools/X.js` → `engine/bricks/X.js`,
`tools/hooks/*` → `engine/hooks/*`, `tools/asset/*` → `engine/bricks/asset/*`, `tools/lib/*` →
`engine/bricks/lib/*`, `runs/arduview/_tooling/<generic>` → `engine/integrations/<service>/`. No file is
renamed — relocation keeps `__dirname`/relative refs intact and the move stays mechanical/reversible.

**Canonical-name targets (DEFERRED to rebuild — do NOT apply this pass):** `fetch.js`→`site-fetch.js`,
`clean.js`→`html-clean.js`, `revenue-est.js`→`revenue-estimate.js`,
`aggregate-mechanisms-in-play.js`→`mechanisms-aggregate.js`, `surge_drive.py`→`surge-deploy.py`. These
are the names a from-scratch rebuild should adopt; recorded here so the intent isn't lost.

---

## 4 · The self-documenting header contract (why the map can't rot)

Every brick and integration carries a machine-parseable header block. The registry is **generated from these blocks**, so the map is never hand-maintained (hand-maintained docs were the documented drift failure). Required keys:

```
// @capability   lp-clean-markdown          # kebab-case capability id (joins to REGISTRY)
// @step         S1 light-pass / fetch+clean   (PROVISIONAL)   # the step it serves; PROVISIONAL until operator topology lands
// @brick        S2                          # brick_type, joins to capability_inventory.md
// @inputs       brands.json (url, lp paths)
// @outputs      corpus/<slug>/clean/*.md
// @consumers    s1-dumper (agent, PROVISIONAL); validators/validate-dumper.js
// @run          node engine/bricks/clean/html-clean.js --space=<space>
// @deps         node:playwright ; py:- ; env:- ; creds:-
// @flags        D-08 live-only (methodology-as-rule)   # present ONLY if strategy is baked into this wiring
```

- Python bricks use `#` instead of `//`.
- `(PROVISIONAL)` on `@step`/`@consumers` means the agent/step label is reconciled against the operator's rebuilt I/O contracts — the *seam* is stable, the *label* is not.
- `@flags` surfaces methodology-as-wiring (A3 ruling) so the operator can see where strategy is frozen into a deterministic rule.

---

## 5 · Identifiers (registry + map)

- **Capability id** — kebab-case, verb-or-noun-led, stable: `lp-clean-markdown`, `reddit-extract`, `shopify-deploy`, `product-video-assemble`, `embeddings-rag`, `chrome-cdp`, `surge-deploy`, `meta-ad-fetch`, `crowdfund-fetch`, `trend-fetch`.
- **Agent label (PROVISIONAL)** — `<step>-<job>`: `s1-finder`, `s1-roster-verifier`, `s1-dumper`, `s1-space-classifier`, `s2-router`, `s2-section-analyzer`. These are the names the *pipeline topology diagram* uses; they are PROVISIONAL (A1-annotation ruling) and get reconciled when the operator's rebuilt contracts land.
- **Artifact path** — `runs/<space>/<artifact>` for run outputs; `corpus/<slug>/...` for per-brand research data. Run-artifact major deliverables stay `UPPERCASE.md`.
- **Per-run operator config** — `runs/<space>/<thing>.txt|json` (e.g. `runs/<space>/lp-hunt-terms.txt`, A1b ruling). Operator-owned, read by a brick with a tolerant parse.

---

## 6 · Credential seam (so the arduview run stays reproducible)

Promoted integrations are **generic code, run-supplied secrets**:
- the script takes `--creds=<path>` (or an env var), **defaulting to none** — never `__dirname`-resolved;
- the arduview secrets STAY gitignored at `runs/arduview/_tooling/.{shopify,klaviyo,cloudflare}-creds.json`;
- the arduview invocation passes `--creds=runs/arduview/_tooling/.shopify-creds.json`;
- exact invocations recorded in `runs/arduview/_tooling/README-ops.md` before any file moves.

Result: the code is reusable for the next run; the secret never moves; arduview stays reproducible.

---

## 7 · The marketing firewall (boundary, not yet enforced)

`engine/contracts/off-limits.json` lists the operator-owned (marketing) path prefixes. `engine/hooks/guard-marketing.js` is the `PreToolUse` deny hook that reads it and rejects a Write/Edit to any match. **Per the operator's "let holes show on first run" mode, the hook is built but NOT wired into `settings.json` this pass** — it is staged so it can be flipped on once the boundary is proven. Until then the off-limits list is documentation the executing agent honors.

NOT off-limits (engine edits freely): `engine/**`, `prompts/_generated/**`, `engine/contracts/schemas/*.schema.json`.
