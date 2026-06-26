# WIRING-BUNDLE-HANDOFF — consolidate the proven engine wiring into one drop-in, well-indexed folder

**Date:** 2026-06-26 · **From:** the P21-H6 hardening-closeout session · **To:** a FRESH session.
**Goal:** turn the now-PROVEN engine wiring into a single self-contained, well-indexed folder that an
operator can drop into a builder and have it wired into the agentic system correctly — without the builder
having to chase external dependencies, guess invocation contracts, or re-derive the firing layer.

**Scope (operator-confirmed 2026-06-26):** EVERYTHING that isn't a marketing PROMPT — all code + engineering prompts/specs + the firing/injection glue that makes the marketing prompts actually run (validators, `route.js`, the DR bundlers). The fetch-companions are explicitly IN: `asset-fetch`, `clean.js` (html→markdown), `chrome-cdp` (RPA fallback). OUT: the marketing strategy prompts (REUSE-INDEX §5 — Finder/Classifier/Architect/Copywriter, `definitions.md`, `workflow.md`, `marketing-lens/*`) AND the stale DR-knowledge CONTENT (the injector wiring stays; the content is old — supply fresh at wire-time).

**This is turnkey.** The wiring is built, proven (every brick has a fixture smoke — `bash engine/contracts/h6-all.sh` → 13/13 green), and indexed (`REGISTRY.json`, `REUSE-INDEX.md`). What's left is **packaging**: de-hardcode a few external paths, pull the scattered companion pieces into the folder (or manifest them), and write three index/manifest docs that turn `engine/` into a clean drop-in.

---

## State — how far off are we?

**~80–85% there.** The hard parts (code built, bugs out, every capability proven-or-deferred, the code index) are done this milestone. What remains is portability + consolidation + a builder-facing entry index — mostly moves + small config fixes + docs, NOT new capability code.

| dimension | state |
|---|---|
| Code (26 capabilities) | ✅ built + **proven** (Bucket A green; B dry-run/partial; C deferred R6/R7 w/ reason) |
| Internal index | ✅ strong — `REGISTRY.json/.md` (I/O, run cmd, deps, health), `REUSE-INDEX.md` (§1 code, §2 eng-prompts, §3 skills, §4 contracts), `enums.json`, `schemas/`, `NAMING.md` |
| Proof harness | ✅ `engine/contracts/h6-*.sh` + `h6-all.sh` (one-command re-verify) |
| Bricks proven | ✅ all deterministic bricks green (or deferred R6/R7 with reason) |
| **Firing layer (12 hooks)** | ⚠️ **4 of 12 smoke-proven** (inject-dr, validate-analyzer, validate-asset-record, guard-marketing); the other 8 are wired + contract-aligned but have no fixture proof — see Blocker §4 |
| **Self-contained folder** | ❌ **gap** — code references live OUTSIDE `engine/` (see Blockers) |
| **Portability (no machine-specific paths)** | ❌ **gap** — `os.homedir()` DR dir + hardcoded absolute paths |
| **Builder-facing entry index** | ❌ **gap** — no single "here's the bundle boundary, deps, invocation + firing contracts, what's excluded" doc |

---

## The target

A single folder (recommend: keep `engine/` as the root — REGISTRY paths already say `engine/`) that is **self-contained and self-describing**:

```
engine/
  bricks/            # deterministic CLI scripts (the capabilities)
  hooks/             # firing layer: route + validate-* + inject-*-dr + guard-marketing
  integrations/      # surge / cdp / shopify / cloudflare / klaviyo / lib-creds
  contracts/         # the index + schemas + enums + NAMING + this handoff
  _fixture/          # MOVED IN from runs/_fixture/ — the smoke inputs (so proof travels with the code)
  skills/            # MOVED IN: reddit-extract (the one engineering skill the bricks index)
  prompts/           # MOVED IN: _specs/ + _generated/ + _templates/ (REUSE-INDEX §2 engineering prompts)
  WIRING-BUNDLE.md   # NEW keystone: the builder's entry doc (boundary, deps, contracts, verify, exclusions)
  DEPENDENCIES.md    # NEW: node/py/CLI runtime deps + versions a builder must provision
  FIRING-MANIFEST.md # NEW: which hooks register where + matchers (replaces reliance on .claude/settings.json)
```
External **inputs** the builder supplies at wire-time (NOT vendored — they're operator/marketing-owned):
the DR knowledge dir, run-space root, and creds. Document these as the bundle's declared inputs.

---

## Blockers to close (grouped; each cites on-disk evidence)

### 1. Portability code fixes — de-hardcode machine/run-specific paths
- **`~/knowledge/dr-marketing/` via `os.homedir()`** — ALL FOUR DR injectors hardcode `path.join(os.homedir(),'knowledge','dr-marketing')`: `inject-dr.js:71`, `inject-funnel-architect-dr.js:60`, `inject-market-selection-dr.js`, `inject-copywriter-dr.js`. The injector CODE is engineering/reusable; the DR CONTENT is **OLD/stale (operator-confirmed 2026-06-26) — do NOT preserve or vendor it.** **Fix: make `DR_DIR` configurable** — `--dr-dir=<path>` → `$DR_DIR` env → homedir default (back-compat). The bundle ships a **tiny fixture knowledge dir** (`engine/_fixture/dr-knowledge/` — a few stub .md files) purely to SMOKE the injectors; the operator supplies the real, fresh knowledge dir at wire-time. Keeps the firewall clean and breaks the stale-content dependency.
- **Hardcoded absolute paths** — `engine/integrations/surge/surge_drive.py:8` (`SITE='/home/kyu3/PMF/runs/arduview/site'`, plus the committed DOMAIN + **throwaway password line 11 — SECURITY**), `engine/bricks/adlib-sweep.js:7` (`OUT='/home/kyu3/PMF/runs/eink-tablets/adlibrary'`). **Fix: flags/env**, no absolute paths or committed creds in the bundle.
- **`.claude/skills/` output coupling** — `inject-*-dr.js` write generated bundles into `.claude/skills/<skill>/_dr-context.generated.md`; `audit-inject.js:117` / `audit-resolve.js:80` default the manifest to `.claude/skills/pipeline-audit/`. **Fix: make these output/lookup targets configurable** so the bundle isn't bound to this repo's `.claude/` layout.

### 2. Consolidation — bring the companion pieces into the folder (respect no-overwrite-v1 + firewall)
- **Fixtures** `runs/_fixture/` → `engine/_fixture/` and update the `h6-*.sh` smokes' `FX=` paths + the in-brick defaults that point at `runs/<space>/…`. The smokes are the proof; the proof must travel with the bundle.
- **reddit-extract skill** `.claude/skills/reddit-extract/{SKILL.md,dump.mjs}` → `engine/skills/reddit-extract/` (REGISTRY currently indexes it "in place — skill-co-located"; flip that to the moved path).
- **Engineering prompts/specs** `prompts/_specs/{image-classifier-brick,funnel-analysis-collection-spec}.md`, `prompts/_generated/*`, `prompts/_templates/*` (REUSE-INDEX §2) → `engine/prompts/`. Update `gen-enums-md.js` + `inject-dr.js` default out-paths accordingly. **Do NOT move** `prompts/step1-light-pass.md`, `funnel-deep-pass.md`, or anything under `marketing-lens/` — those are marketing (off-limits / re-authored R5).

### 3. Missing index/manifest docs (the builder-facing layer)
- **`WIRING-BUNDLE.md` (keystone)** — the one doc a builder reads first: the bundle boundary; the declared external inputs (DR dir, run-space, creds); per-capability invocation contract (point at `REGISTRY.json`); the firing contract (point at FIRING-MANIFEST); how to verify (`h6-all.sh`); and **what's explicitly NOT included** (the marketing layer — Finder/Classifier/Architect/Copywriter prompts, `definitions.md`, `workflow.md`; re-authored at R4/R5 per decision B).
- **`DEPENDENCIES.md`** — runtime a builder must provision: **node** `playwright`; **python (.venv)** `Pillow`, `imagehash`, `imageio-ffmpeg`; **CLI** `npx`/`surge`. No `engine/package.json` or `requirements.txt` exists today — add them (or document inline). Note: `.venv` lives at repo root and is shared.
- **`FIRING-MANIFEST.md`** — the firing layer currently lives in `.claude/settings.json` (PreToolUse `guard-marketing.js`; PostToolUse `route.js`). A builder wiring into a different agentic system needs a portable description: each hook, its event, its matcher (`Write|Edit|MultiEdit` etc.), its command, and the stdin/argv path contract. (Reference: `guard-marketing.js` header documents its own registration.)

---

### 4. Bring the FIRING LAYER to the same proof bar (the glue that makes the marketing prompts run)
This is the part the H6 run only PARTIALLY covered. The firing layer = 12 hooks; **4 are smoke-proven, 8 are wired but have no fixture proof** — they sit where the bricks were *before* H6.
- **Proven this run:** `inject-dr` (h6-analyzer-context — a path bug was fixed there), `validate-analyzer` (h5-e2e gate), `validate-asset-record` (h6-asset-classify), `guard-marketing` (live block + argv/stdin tests).
- **Wired, NOT smoked (close these):** `route.js`; `validate-finder` / `-dumper` / `-classifier` / `-revenue` (H0 repointed them to `enums.json`, behavior-preserving, but no fixture exercises them); `inject-market-selection-dr` / `inject-funnel-architect-dr` / `inject-copywriter-dr` (never run; share the `os.homedir()` DR-dir dep from §1).
- **Fix:** add `engine/contracts/h6-firing-*.sh` smokes — for each validator a good→exit-0 / bad→exit-2 fixture pair (mirror the `validate-analyzer` pattern in h5-e2e); for the 3 DR injectors, run them against the `engine/_fixture/dr-knowledge/` stub dir (post the §1 `--dr-dir` fix) and assert a non-empty bundle with the attribution headers; for `route.js`, assert it routes a fixture write to the right validator. Then flip the `firing-hooks` REGISTRY entry from a blanket "working" to per-hook proof, and add these to `h6-all.sh`. **Only then is the non-marketing bundle proven end-to-end, not just the bricks.**

## Guardrails (unchanged from the hardening pass)
- **Marketing firewall** (`off-limits.json`, now WIRED): write only `engine/` + `runs/_fixture/` (which moves into `engine/`). Never touch `marketing-lens/`, `prompts/{step1,funnel-deep-pass}`, `definitions.md`, `workflow.md`, `runs/*/_marketing-decisions/`. The DR knowledge dir is an external input — do not vendor it in.
- **no-overwrite-v1** (CLAUDE.md): consolidation MOVES are fine (git mv preserves history); never mutate a committed run output in place. Smokes write only to transient `runs/_fixture-*/` (rename to `engine/_fixture-*` scratch) that they clean up.
- **Atomic commits**, `gsd-undo`-able, one logical change each. After every move/fix: **re-run `bash engine/contracts/h6-all.sh` — it must stay 13/13 green.** That green bar is the regression guard for the whole consolidation.

---

## Recommended execution order (each step ends green)
1. **Portability fixes first** (§1) — DR_DIR + absolute-path + `.claude/` output configurability; re-verify smokes. (Smokes pass `--dr-dir`/flags; defaults keep back-compat.)
2. **Manifests** (§3) — write DEPENDENCIES.md + FIRING-MANIFEST.md + WIRING-BUNDLE.md against the CURRENT layout (cheap, no moves).
3. **Consolidation moves** (§2) — `git mv` fixtures, reddit skill, eng-prompts into `engine/`; update every path ref + smoke `FX=`; re-verify after each move. Update REGISTRY/REUSE-INDEX paths + the "co-located/in-place" notes.
4. **Final index pass** — regenerate/verify `REGISTRY.json` paths (the `engine-map` skill can help), confirm WIRING-BUNDLE.md cross-refs resolve, run `h6-all.sh` one last time.

## Done-when
- `engine/` is self-contained: `bash engine/contracts/h6-all.sh` passes **with no files referenced outside `engine/`** except the three declared external inputs (DR dir, run-space, creds), and those are flag/env-configurable with documented defaults.
- A builder reading `engine/WIRING-BUNDLE.md` alone can answer: what each capability is + how to invoke it, what to provision (DEPENDENCIES.md), how the firing layer registers (FIRING-MANIFEST.md), how to verify (`h6-all.sh`), and what is intentionally excluded (the marketing layer).
- No machine-specific absolute paths and **no committed credentials** remain in the bundle.
- REGISTRY/REUSE-INDEX reflect the moved paths; health bar unchanged (22 working / 1 dry-run-verified / 1 partial / 2 deferred).

## What is NOT in scope (don't pull these in)
- The **marketing layer** (Finder/Roster/Dumper/Classifier/Market-Selection/Router/Section-Analyzer/Funnel-Architect/Copywriter prompts, `definitions.md`, `workflow.md`, `marketing-lens/*`) — re-authored at R4/R5 per decision B; it plugs in ON TOP of this bundle.
- The **DR knowledge content** itself — operator-owned external input, supplied at wire-time.
- The **R6/R7 deferred** live-network capabilities stay deferred (reddit OAuth, residential-IP fetch); the bundle ships them labeled, not green.
```
