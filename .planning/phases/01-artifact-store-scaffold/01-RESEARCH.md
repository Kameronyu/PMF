# Phase 1: Artifact Store Scaffold - Research

**Researched:** 2026-06-26
**Domain:** Deterministic filesystem/convention scaffolding (the `runs/<space>/` artifact store — mechanism, not marketing content)
**Confidence:** HIGH (all claims grounded in committed repo sources read this session)

## Summary

Phase 1 builds the foundation every pipeline step reads from and writes to: a `runs/<space>/` tree with one declared slot per inter-step artifact, whole-space no-overwrite versioning, a `_receipts/` run ledger, a per-cell fan-out filename rule, and a usable `smoke` space. This is pure mechanism. The hard part is **reconciliation**, not invention: the §4 slot list in `SHELL-BUILD-SPEC.md` is explicitly "representative" and pre-R1 in spots, so it must be reconciled against the authoritative `ONE-SHOT-SHELL §6` slot table and `PART3 §1.5` (R1 order). Where the two disagree, the R1/§6 view wins (architecture-wins precedence, ONE-SHOT §3).

The engine already exists and is proven (`bash engine/contracts/h6-all.sh` → 14/14 green), but **almost nothing in it is reusable for this phase as a brick**: the bricks read/write `runs/<space>/...` only because each takes `--space=<s>` as a required parameter and joins `path.join(cwd, 'runs', SPACE, ...)` itself [VERIFIED: engine/bricks/funnel-store.js L40–90]. There is **no existing brick** that scaffolds the tree, does no-overwrite versioning, or writes a `_receipts/` ledger. `funnel-store.js` writes per-funnel JSON but knows nothing of receipts or version-bumping; `validate-receipt.js` is unrelated (it gates pipeline-audit *context* receipts, not the run ledger) [VERIFIED: engine/contracts/REGISTRY.json L19, L35]. So STORE-02/03/04 are author-new; STORE-01/05 are scaffold + copy-convention work.

The single most load-bearing finding: **no-overwrite-v1 versions the whole SPACE, not individual artifacts.** The as-ran precedent and the canonical rule both say a re-run writes a new versioned *space* (`runs/arduview-v2/`, `runs/arduview-v3/…`) and leaves v1 byte-intact [VERIFIED: engine/contracts/MATERIALS.md L32–38; REGISTRY.json L19 "→ arduview-v2"]. The SHELL-BUILD-SPEC §4 hint of a per-artifact `v2/` subdir is the weaker, less-grounded reading; the planner should treat space-level versioning as the primary mechanism and document per-artifact versioning only if Phase 2's run-controller needs finer grain.

**Primary recommendation:** Author a small `store-scaffold` brick + a `space-version` resolver + a `receipt-write` brick + a `fan-out-path` helper, all parameterized on `--space`, all writing under `runs/<space>/`, copying the as-ran path convention (`runs/<space>/<artifact>`, major deliverables `UPPERCASE.md`, `corpus/<slug>/...` for per-brand). Version at the space grain (`<space>-vN`). Ship a `smoke` space pre-scaffolded with empty slots.

## Architectural Responsibility Map

This phase is single-tier (local filesystem / storage), so the map is degenerate but worth stating to prevent the planner from pushing any logic into a runtime it doesn't belong in.

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Tree scaffold (STORE-01) | Filesystem / Storage | — | Pure `mkdir -p` + slot declaration; deterministic script, never an agent |
| No-overwrite versioning (STORE-02) | Filesystem / Storage | Run-controller (Phase 2) | The *resolver* (what's the next free version) lives in the store layer; the *decision to bump* is invoked by the controller's "store+receipt" phase (CTRL-08) — Phase 1 builds the resolver, Phase 2 calls it |
| `_receipts/` ledger (STORE-03) | Filesystem / Storage | Run-controller (Phase 2) | Phase 1 defines the ledger *shape + writer*; Phase 2's phase-6 (CTRL-08/VALID-04) supplies the *content* (inputs hash, validator verdicts) per spawn |
| Fan-out filename rule (STORE-04) | Filesystem / Storage | Step manifests (Phase 3) | Phase 1 defines the *rule + helper*; Phase 3/4 step writers *apply* it when emitting per-cell outputs |
| `smoke` space (STORE-05) | Filesystem / Storage | Smoke run (Phase 6) | Phase 1 creates the space; Phase 6 runs `run all --space=smoke` against it |

**Boundary note for the planner:** Phase 1 is the store's *structure and writers*. The run-controller (Phase 2) is the *caller*. Do NOT design the 7-phase loop, the receipt-content population, or the manifest-driven slot writes here — those are Phases 2–4. Build the scaffold, the version resolver, the ledger writer (shape + append/one-per-spawn mechanics), and the fan-out helper, each callable in isolation.

## Standard Stack

This is a Node-script + filesystem phase inside an existing, proven engine. There is no new library to add. The "stack" is the engine's existing conventions.

### Core
| Tool | Version | Purpose | Why Standard |
|------|---------|---------|--------------|
| Node | 20 | All new store/version/receipt bricks (engine is Node-first) | [CITED: engine/DEPENDENCIES.md] Engine bricks are Node 20; new bricks match |
| `node:fs` / `node:path` | stdlib | `mkdir -p`, `writeFileSync`, `path.join` for `runs/<space>/...` | [VERIFIED: engine/bricks/funnel-store.js L40–90] existing bricks use exactly this — no fs library |
| Python | 3.12 | Only if a brick reuses the asset/py chain (not needed for Phase 1) | [CITED: engine/DEPENDENCIES.md] `.venv/bin/python` convention |

### Supporting
| Pattern | Purpose | When to Use |
|---------|---------|-------------|
| `--space=<s>` required CLI flag | Every store-touching brick takes the space as a parameter, never hardcodes it | [VERIFIED: engine/bricks/funnel-store.js L52–53, L73–74] — "Market-agnostic: `<space>` is a required parameter, never hardcoded" |
| Path-segment sanitize `[a-z0-9._-]`, strip `..` and `/` | Prevent path traversal when space/funnel ids derive from data | [VERIFIED: engine/bricks/funnel-store.js L68, L85–89] — note `arduview-v2` passes this filter, so `<space>-vN` is a legal space name |
| Sidecar log `_<thing>-log.txt` (gitignored) | Per-run scratch logs separate from committed artifacts | [VERIFIED: engine/bricks/funnel-store.js L65; .gitignore L13–15] `_*-log.txt` ignored |
| `UPPERCASE.md` for major deliverables | `bet-brief.md` is lowercase per slot list, but run-artifact major deliverables stay UPPER | [CITED: engine/contracts/NAMING.md §5] "Run-artifact major deliverables stay `UPPERCASE.md`" — reconcile against the §4/§6 lowercase names (see Open Questions Q3) |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Space-level versioning (`<space>-v2`) | Per-artifact `v2/` subdir | Per-artifact gives finer provenance but contradicts the proven as-ran convention (whole-space); adds complexity the controller doesn't yet need. Default to space-level (see No-Overwrite section). |
| One-receipt-per-spawn file | Single append-log JSONL | Append-log is simpler to "prove unbroken chain"; per-file is easier to diff and survives partial writes. See `_receipts/` section for the recommendation. |

**Installation:** No new packages. New bricks live under `engine/bricks/` (engine edits are allowed — NOT off-limits) or, if the planner treats the store layer as marketing-firewall-neutral scaffolding, under a new top-level the controller owns. [VERIFIED: engine/contracts/NAMING.md §7 — `engine/**` is "NOT off-limits"].

**Version verification:** N/A — no external packages introduced. Node 20 / Python 3.12 are the engine's already-provisioned runtimes [CITED: engine/DEPENDENCIES.md].

## The Exact `runs/<space>/` Slot List (STORE-01)

This is the deliverable the planner most needs. It reconciles **SHELL-BUILD-SPEC §4** (representative, partly pre-R1) with **ONE-SHOT §6** (the authoritative orientation table) and **PART3 §1.5** (R1 order) + **§5.2** (consumption). Per ONE-SHOT §6, the §6 table itself is "orientation, not the contract" — the binding source is `PART0` + `PART3 §5.2/§9` + per-step `briefs/`. The list below is the **slot set to scaffold**; field *contents* are deferred (Job 5). Where §4 and §6 disagree, §6/R1 wins (architecture-wins, ONE-SHOT §3).

Legend: **[F]** = file · **[D]** = directory · **[D-fanout]** = directory holding per-cell/per-id fan-out files (needs STORE-04 rule) · ★ = operator-gate step (informational; gate wiring is Phase 5).

| Step | Slot path (under `runs/<space>/`) | F/D | Notes / source |
|------|-----------------------------------|-----|----------------|
| 0 ★ | `bet-brief.md` | F | Step 0 structured contract [§4; §6; PART3 §6.1] |
| 0 ★ | `product-intake.md` | F | Step 0 product spec; required input to Step 7 (WIRE-02) [§6; ONE-SHOT §4.2] |
| 0 ★ | `asset-classify/CLAIM-LIST.json` | F (in dir) | Step 0 product capability-claim ledger; consumed by Step 9 (WIRE-01) [§4; ONE-SHOT §4.1] |
| 1 ★ | `brands.json` | F | Step 1 roster [§4; §6; as-ran top-level] |
| 1 ★ | `queries_run.json` | F | Step 1 coverage audit trail (§6.2 `queries_run[]`) [§4; §6] |
| 1 ★ | `dumps/` | D-fanout | Per-brand verbatim dumps. **As-ran used `corpus/<slug>/dump.json`** — see Open Questions Q1 [§4 says `dumps/`; as-ran says `corpus/<slug>/dump.json`] |
| 1 | `corpus/<slug>/clean/*.md` | D-fanout | Cleaned per-brand copy (gitignore excludes only `corpus/*/raw/`, so `clean/` IS committed) [VERIFIED: as-ran §5; .gitignore L1–2] |
| 1 | `ads/<slug>.json` | D-fanout | Per-brand ad records (only when ad data exists — not every brand) [VERIFIED: MATERIALS.md Gotcha 4] |
| 2 | `funnels/<id>.json` | D-fanout | Per-funnel analyzed records; id is funnel_id [§4; §6; as-ran `funnels/<funnel_id>.json`] |
| 2 | `funnels/_tally.json` | F (in dir) | Claim tally (dead-ground/whitespace); underscore-prefixed meta file [VERIFIED: as-ran §5; funnel-claim-tally] |
| 2 | `ad-volume-aggregate.json` | F | Deterministic rollup `{transformation, angle, funnel_count, ad_count, max_ad_longevity_days, ...}` [VERIFIED: PART3 §1.5 "Contracts R1 adds"] |
| 2 | `funnel-store/` (a.k.a. funnels intermediates) | D | §4 names "funnel-store"; as-ran has `funnels-assembled/`, `funnels-clean/`, `funnels-scored/`, `funnels-analyzer-out/` as provenance intermediates [§4; MATERIALS.md L26]. Treat as a provenance dir; not a hard inter-step seam. |
| 3 | `space-map.json` | F | Step 3 synthesizer output; schema OPEN (deferred) [§4; §6; PART3 §1.5 STEP 3] |
| 4 | `voc/market-signal/<niche>__<transformation>.json` | D-fanout | **The canonical fan-out slot** (STORE-04). One file per candidate niche×transformation cell [§4 `voc/market-signal/<cell>.json`; §6; PART3 §5.1 Product 1] |
| 4 | `voc/gap_candidates.json` | F (in dir) | Whitespace-vs-scary rows [§4; §6; PART3 §5.1] |
| 5 ★ | `market-selection.json` | F | Step 5 ranked survivors. **As-ran used `market-selection.md`** — §4/§6 say `.json`; reconcile (Q3) [§4; §6; as-ran §5 `.md`] |
| 5 ★ | `ntp-pick.json` | F | Operator NTP pick artifact [§4 `(operator)`; §6] |
| 6 | `voc-bank/` | D | Step 6 copy bank (deep pass, chosen cell) [§4; §6; PART3 §5.1 Product 2] |
| 6 | `awareness-read.json` | F | Awareness Reconciler output `{entry_distribution, recommended_entry, basis[], conflicts[]}` [§4; §6; PART3 §6.6] |
| 7 ★ | `funnel-brief.md` | F | Step 7 architect design + copy brief [§4; §6; PART3 §6.7] |
| 7 ★ | `audit-verdicts.json` | F | Funnel Auditor verdicts [§4; §6; PART3 §6.8] |
| 8 ★ | `copy/` | D-fanout | Step 8 copy outputs (per-section files) [§4; §6; PART3 §6.9] |
| 8 ★ | `chief-verdicts.json` | F | Copy Chief line verdicts [§4; §6] |
| 9 | `asset-records.json` | F | Step 9 classified asset records (reads `asset-classify/CLAIM-LIST.json`) [§4; §6; PART3 §6.10] |
| 10 ★ | `review/` | D | Step 10 adversarial re-review reports (as-ran `_audit/`: A-*.md, B.md) [§4; §6; as-ran §2f] |
| — | `_receipts/` | D | Run ledger; one entry per spawn (STORE-03) [§4; §6; PART3 §8 step 6] |

**Reconciliation rule for the planner:** scaffold the **§6 column names** as the canonical slots (they are the orientation the operator handed GSD). Where as-ran differs (`dumps/` vs `corpus/<slug>/dump.json`; `market-selection.json` vs `.md`), surface as a manifest-defined decision (Phase 3 owns the final `writes:` paths) — Phase 1 just needs the *directories* to exist and the *convention* documented. The two confirmed fan-out dirs are `voc/market-signal/` and `funnels/` (plus `corpus/<slug>/`, `ads/`, `copy/`).

## No-Overwrite Versioning Approach (STORE-02)

**Mechanism: version the whole SPACE, not the artifact.** This is the proven convention.

- **Canonical rule** [VERIFIED: engine/contracts/MATERIALS.md L38]: *"a re-run writes a NEW versioned space (`runs/arduview-v3/…`), never mutates any path above in place. v1/v2 stay intact for provenance and diffing."*
- **As-ran precedent** [VERIFIED: REGISTRY.json L19; MATERIALS.md L32]: the Phase-21 hardening re-run wrote `runs/arduview-v2/` (re-ran only the funnel store+vectorize); everything else stayed in `runs/arduview/` (v1). The canonical composite is "v2 funnels + v1 everything else."
- **CLAUDE.md project convention (D-07/08/09)** [VERIFIED: ./CLAUDE.md "Versioning"]: a committed run output is never mutated in place; a re-run writes a NEW versioned location (a `v2/` subdir **or** a `-v2` suffix). Governs committed run outputs + emitted bricks; does NOT govern logs/scratch (gitignored). **Enforcement is convention-only; a guard hook is explicitly DEFERRED — do NOT build one this phase.**

**Recommendation for the planner:**
1. Build a **space-version resolver**: given a base space `smoke`, the next versioned space is `smoke-v2`, then `smoke-v3`, … (scan `runs/` for existing `<base>` and `<base>-vN`, return the next free name). `<base>-vN` passes the existing `[a-z0-9._-]` sanitize, so it composes with every brick's `--space` flag with zero brick changes.
2. **Default grain = whole space.** Per-artifact `v2/` (the §4 hint) is allowed by CLAUDE.md but is the *weaker* precedent and adds complexity the controller doesn't need yet. If finer grain is wanted later it's additive, no rewiring.
3. **v1-byte-intact is the verifiable invariant**: after a re-run, checksum every file in `runs/<base>/` and confirm unchanged. This is the STORE-02 acceptance check (see Validation Architecture).
4. **Do NOT build a guard hook** — it is explicitly deferred. The resolver *enables* the convention; the controller (Phase 2 CTRL-08) *calls* it.

**Gotcha [VERIFIED: MATERIALS.md Gotcha 2]:** a partial re-run that versions only some artifacts creates a split-brain (`-v2` funnels + v1 tally) that nothing on disk explains. If Phase 1's resolver supports partial re-runs, the receipt (STORE-03) MUST record which slots were (re)written so the composite is reconstructable. Cleanest design: a full re-run bumps the whole space; partial re-runs are a controller concern, deferred.

## `_receipts/` Ledger Shape (STORE-03)

**What a receipt records** [VERIFIED: PART3 §8 step 6 + step 5; SHELL-BUILD-SPEC §4]: *"receipt = inputs hash, digest version, validator verdicts, the run ledger entry."* §4: *"every spawn: inputs hash, validator verdicts."*

Concrete receipt fields (Phase 1 defines the *shape + writer*; Phase 2/5 populate verdicts):

```json
{
  "spawn_id": "<step>-<agent>-<timestamp-or-counter>",
  "step": "04-voc-market-pass",
  "space": "smoke",
  "inputs_hash": "<sha256 of the concatenated/sorted input artifact bytes>",
  "inputs": ["runs/smoke/space-map.json", "runs/smoke/bet-brief.md"],
  "outputs": ["runs/smoke/voc/market-signal/edc-aesthetic-collectors__novelty-object-own.json"],
  "digest_version": "<context digest version, if any>",
  "validator_verdicts": [{ "validator": "validators/04.js", "verdict": "PASS" }],
  "gate": { "step_gated": false, "decision": null },
  "ts": "2026-06-26T00:00:00Z"
}
```

**File format & layout:**
- **One-per-spawn JSON file** under `runs/<space>/_receipts/`, named `<spawn_id>.json` (sortable). Rationale: survives partial writes, easy to diff, "unbroken chain" = every spawn in the plan has a matching receipt file. This matches the engine's existing per-record-file style (`funnels/<id>.json`).
- **Alternative — append-only JSONL** (`_receipts/ledger.jsonl`): simpler "chain" semantics but a torn write corrupts the whole file. Recommend **per-spawn files** as primary; the controller can derive a chain-index if needed.
- `inputs_hash` proves the spawn ran on the declared inputs (the contract-or-refuse discipline, P3). Phase 1 supplies the hashing helper (sha256 over sorted input bytes) and the writer; Phase 2 supplies the actual input list per step; Phase 5 supplies validator verdicts (VALID-04) and gate decisions (VALID-05).
- **Gitignore:** `_receipts/` is NOT in `.gitignore`, so receipts are committed by default — correct, they are provenance. (Only `_index.json`, `_*-log.txt`, `_*.agent.json`, `corpus/*/raw/`, `assets/`, creds are ignored.) [VERIFIED: .gitignore]

**Append vs one-per-spawn verdict:** one-per-spawn file, with `ts` + sortable `spawn_id`. The "unbroken chain" check (SMOKE-04) is then "for every planned spawn there is a receipt; for every output artifact there is a receipt naming it as an output."

## Fan-Out Filename Rule (STORE-04)

**Canonical rule** [VERIFIED: SHELL-BUILD-SPEC §4 final para; ONE-SHOT §5.7; STORE-04 text]:

> Per-cell fan-out outputs get a disambiguating filename rule, e.g. `voc/market-signal/<niche>__<transformation>.json`.

**Concrete pattern:** `<axis-a>__<axis-b>.json` — two values joined by a **double underscore** `__`, each value path-sanitized to `[a-z0-9._-]` (reuse the existing `sanitizePathSegment`). The double underscore is the field separator (single underscores appear inside values like `edc-aesthetic-collectors` and `novelty-object-own` → no, those use hyphens; but `qualifying_creatives`-style values could carry single `_`, so `__` is the safe separator).

Worked example from the real run [VERIFIED: MATERIALS.md L17 chosen cell]:
- niche = `edc-aesthetic-collectors`, transformation = `novelty-object-own`
- → `runs/smoke/voc/market-signal/edc-aesthetic-collectors__novelty-object-own.json`

**Apply the rule wherever a step fans out per cell/id:**
| Fan-out dir | Key(s) | Filename |
|-------------|--------|----------|
| `voc/market-signal/` | niche × transformation | `<niche>__<transformation>.json` |
| `funnels/` | funnel_id (single key) | `<funnel_id>.json` (already sanitized) |
| `corpus/<slug>/` | brand slug | dir per slug |
| `ads/` | brand slug | `<slug>.json` |
| `copy/` | section (TBD Phase 4) | per-section file |

Phase 1 provides a **`fan-out-path` helper** (`buildFanoutName(...keys)` → sanitize each, join with `__`, append `.json`). Steps (Phase 4) call it; manifests (Phase 3) declare the dir. The helper is the STORE-04 deliverable; collisions are impossible because keys are closed-vocabulary cell coordinates.

## What Already Exists in `engine/` to Reuse (vs Author New)

**REUSE (assemble, do not rewrite):**
| Asset | What it gives Phase 1 | Source |
|-------|----------------------|--------|
| `sanitizePathSegment` pattern (`[a-z0-9._-]`, strip `..`/`/`) | Path-traversal-safe space/cell/id segments | [VERIFIED: engine/bricks/funnel-store.js L68, L85–89] |
| `--space=<s>` → `path.join(cwd,'runs',SPACE,...)` convention | The exact store-root resolution every new brick must match | [VERIFIED: funnel-store.js L40, L89; WIRING-BUNDLE "read/write under runs/<space>/… you choose"] |
| `runs/<space>/<artifact>` + `corpus/<slug>/...` + `UPPERCASE.md` naming law | The committed naming convention to copy | [VERIFIED: engine/contracts/NAMING.md §5] |
| `runs/_fixture/` (committed test fixtures) | Pattern for a committed, smoke-able space | [VERIFIED: .gitignore L20–21 whitelist; as-ran runs/_fixture] |
| As-ran `runs/arduview/` tree | The de-risked layout convention to mirror | [VERIFIED: asran-repo-report §5; reference/as-ran-repo/repo-files/runs/arduview/] |

**AUTHOR NEW (no engine equivalent exists):**
| Deliverable | Why new | Confidence |
|-------------|---------|------------|
| Tree-scaffold brick (STORE-01) | No brick scaffolds the slot tree; bricks assume the dir exists and write into it | HIGH [no scaffold capability in REGISTRY.json] |
| Space-version resolver (STORE-02) | `arduview-v2` was created **by hand**, not by a brick; no version logic exists | HIGH [REGISTRY p21 "→ arduview-v2" is a manual `mv`/re-run, not a capability] |
| Receipt writer + `_receipts/` ledger (STORE-03) | `funnel-store.js` has no receipt logic; `validate-receipt.js` is pipeline-audit context-receipt verification, NOT a run ledger | HIGH [VERIFIED: REGISTRY.json L19, L35; FIRING-MANIFEST has no receipt hook] |
| Fan-out-path helper (STORE-04) | No shared fan-out namer exists; funnel-store sanitizes a single id only | HIGH |
| `smoke` space scaffold (STORE-05) | No `smoke` space exists; only `arduview`/`arduview-v2`/`_fixture` (and those are quarantined to `_legacy/`) | HIGH [VERIFIED: REBUILD-ROADMAP L23; HANDOFF L45–46] |

**Flag for the planner:** the as-ran `runs/arduview*` and `_legacy/` are quarantined reference, NOT the live store [VERIFIED: HANDOFF.md L45–46 `mv runs/* _legacy/runs/`; REBUILD-ROADMAP L23]. There is currently **no `runs/` at repo root** [VERIFIED: `ls -d runs` → absent]. Phase 1 creates `runs/` fresh.

## Runtime State Inventory

This is greenfield scaffolding (creating new dirs/files), not a rename/refactor of existing live state. Most categories are empty, but two are worth stating explicitly because the as-ran repo has quarantined state that must not be confused with the new store.

| Category | Items Found | Action Required |
|----------|-------------|------------------|
| Stored data | None live — `runs/` does not exist at repo root; old `runs/arduview*` moved to `_legacy/` (quarantined). | None. Phase 1 creates `runs/` + `runs/smoke/` fresh. |
| Live service config | None — no external service stores a slot path. | None. |
| OS-registered state | None. | None. |
| Secrets/env vars | Creds live gitignored at `runs/arduview/_tooling/.*-creds.json` (legacy). New `runs/smoke/` has no creds; integrations take `--creds`/env. | None for Phase 1; do NOT scaffold a creds slot. |
| Build artifacts | `runs/_fixture/` is the committed smoke fixture for the *engine* (`h6-all.sh`); distinct from the new `runs/smoke/`. | None — keep `_fixture` untouched; create a separate `smoke` space. |

**Canonical question answered:** after Phase 1, the new `runs/smoke/` is the only live store; the legacy `_legacy/runs/arduview*` stays byte-intact and ignored.

## Common Pitfalls

### Pitfall 1: Confusing per-artifact `v2/` with whole-space `-v2`
**What goes wrong:** Building a per-artifact versioning scheme because SHELL-BUILD-SPEC §4 mentions a `v2/` subdir, when the proven convention versions the whole space.
**Why it happens:** §4 is "representative" and lists `v2/` as one option; MATERIALS.md (the verified-on-disk manifest) is the authoritative precedent.
**How to avoid:** Default to space-level (`<base>-vN`). [VERIFIED: MATERIALS.md L38]
**Warning signs:** A resolver that takes an artifact path instead of a space name.

### Pitfall 2: Split-brain partial re-runs
**What goes wrong:** Re-running only some steps creates `<space>-v2` with a few artifacts + `<space>` with the rest, and nothing records the composite (the exact arduview v1/v2 `_tally.json` gotcha).
**Why it happens:** Versioning at the space grain but only writing some slots.
**How to avoid:** Phase 1 default = full-space re-run bumps everything; if partial is supported, the receipt MUST name which slots were rewritten. [VERIFIED: MATERIALS.md Gotcha 2]
**Warning signs:** A canonical artifact you can only assemble by reading two different version dirs.

### Pitfall 3: Hooks don't fire in subagents — receipts must be orchestrator-written
**What goes wrong:** Assuming a PostToolUse hook can write the receipt on every spawn's output.
**Why it happens:** The engine's `route.js`/validators are PostToolUse hooks, but hooks do NOT fire inside subagents.
**How to avoid:** The receipt writer is an **explicit orchestrator step** (Phase 2 CTRL-08), not a hook. Phase 1 builds it as a directly-callable brick. [VERIFIED: FIRING-MANIFEST §4; PART3 P8]
**Warning signs:** Receipt-writing wired into `.claude/settings.json` hooks.

### Pitfall 4: Gitignoring committed slots (or committing scratch)
**What goes wrong:** Treating `runs/<space>/` as scratch (it's committed provenance) or committing `_*-log.txt`/`_index.json` (those are scratch).
**Why it happens:** The `_`-prefix convention is overloaded: `_receipts/` is committed, `_*-log.txt`/`_index.json`/`_*.agent.json` are ignored.
**How to avoid:** Follow the exact `.gitignore` — only `corpus/*/raw/`, `_index.json`, `_*-log.txt`, `_*.agent.json`, `assets/`, creds are ignored; everything else under `runs/<space>/` is committed. [VERIFIED: .gitignore]
**Warning signs:** A `_receipts/ledger.jsonl` named to match `_*-log.txt`... it wouldn't be ignored (only `-log.txt` suffix is), but avoid the naming collision; use `_receipts/<spawn_id>.json`.

### Pitfall 5: Scaffolding the §4 list verbatim without R1 reconciliation
**What goes wrong:** Using SHELL-BUILD-SPEC §4's pre-R1 phrasing (it labels some steps with the old order) as the slot contract.
**Why it happens:** §4 is the most slot-explicit doc but is superseded in spots.
**How to avoid:** Scaffold the §6/R1 names; §4 is "representative." Architecture-wins. [VERIFIED: ONE-SHOT §3, §6; PART3 §1.5 "§4.x superseded"]
**Warning signs:** A slot list that puts VOC before the space map (pre-R1 order).

## Code Examples

Verified patterns from the existing engine (copy these conventions for the new bricks):

### Space resolution + path-traversal-safe segment (the convention every store brick follows)
```javascript
// Source: engine/bricks/funnel-store.js (L40, L68, L85–89) — VERIFIED
function sanitizePathSegment(s) {
  return String(s)
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, '')
    .replace(/\.\.+/g, '');          // collapse residual dots — block traversal
}
const SPACE = sanitizePathSegment(opts.space);
if (!SPACE) { console.error('ERROR: --space sanitized to empty'); process.exit(1); }
const OUT_DIR = path.join(process.cwd(), 'runs', SPACE, 'funnels');
// `arduview-v2` survives this filter unchanged → `<base>-vN` is a legal space name.
```

### Fan-out filename helper (STORE-04 — author new, same sanitize)
```javascript
// Pattern derived from SHELL-BUILD-SPEC §4 example + funnel-store sanitize — RECOMMENDED
function buildFanoutName(...keys) {
  return keys.map(sanitizePathSegment).join('__') + '.json';
}
// buildFanoutName('edc-aesthetic-collectors', 'novelty-object-own')
//   → 'edc-aesthetic-collectors__novelty-object-own.json'
```

## State of the Art

| Old Approach (as-ran) | Current Approach (R1 shell) | When Changed | Impact |
|-----------------------|------------------------------|--------------|--------|
| `corpus/<slug>/dump.json` for Step-1 dumps | §6 names `dumps/` (slot dir) | R1 reorg | Reconcile in manifests (Q1) — Phase 1 just creates the dir convention |
| `market-selection.md` (prose) | `market-selection.json` per §4/§6 | R1 | Slot name change; reconcile (Q3) |
| Space map built from raw dumps (light pass) | Space map = synthesizer over analyzed funnel rows; VOC after map | PART3 §1.5 (R1) | Slot *order/consumers* changed, not the store mechanics |
| Per-artifact ad hoc `arduview-v2` (manual) | Space-version resolver (author new) | This phase | Automates the convention; no guard hook (deferred) |

**Deprecated/outdated:**
- SHELL-BUILD-SPEC §4 slot list: "representative," partly pre-R1 — reconcile against §6/R1.
- PART3 §4.x topology: superseded reasoning trail — do not build from it. [VERIFIED: PART3 §4.1 header]
- `runs/arduview*`: quarantined to `_legacy/` — reference only, not the live store.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | One-receipt-per-spawn JSON file is preferable to a JSONL append-log | `_receipts/` Ledger | LOW — both satisfy STORE-03; if the controller (Phase 2) prefers append-log, switch with no upstream impact |
| A2 | The exact receipt field set (`spawn_id, inputs_hash, validator_verdicts, gate, ts, ...`) | `_receipts/` Ledger | MEDIUM — PART3 §8 names "inputs hash, digest version, validator verdicts, ledger entry"; exact JSON keys are inferred. Validator verdicts/gate fields are populated by Phase 5, so the shape is confirmable then. Confirm key names with the planner. |
| A3 | `__` (double underscore) is the right separator for fan-out (vs single `_` or `-`) | Fan-Out Rule | LOW — §4's literal example uses `<niche>__<transformation>`; matches. |
| A4 | New store bricks live under `engine/bricks/` | Reuse vs Author | LOW — `engine/**` is not off-limits; but the planner may choose a controller-owned top-level. Either works. |
| A5 | Whole-space versioning is the default grain (not per-artifact) | No-Overwrite | LOW — MATERIALS.md L38 is explicit; per-artifact remains a documented option. |

**These are the only assumptions** — every other claim is VERIFIED against a read file or CITED to a doc section.

## Open Questions

1. **`dumps/` vs `corpus/<slug>/dump.json`** — §6 lists a `dumps/` slot; the as-ran put dumps at `corpus/<slug>/dump.json`. 
   - Known: both exist in the corpus; `corpus/*/raw/` is gitignored, `corpus/*/clean/` is committed.
   - Unclear: whether Step-1 dumps land in a flat `dumps/` dir or per-brand `corpus/<slug>/`.
   - Recommendation: scaffold BOTH directory conventions (`corpus/` for per-brand, and let Phase 3 manifests declare the dump path). Phase 1 doesn't lock it; it ensures the parent dirs are creatable.

2. **Receipt content boundary** — Phase 1 builds the receipt *writer + shape*; Phase 2 (CTRL-08) and Phase 5 (VALID-04/05) populate `inputs_hash`, `validator_verdicts`, and gate decisions.
   - Recommendation: Phase 1 ships a writer taking a fully-formed receipt object + the hashing helper; do NOT couple it to step internals.

3. **`.json` vs `.md` and lowercase vs `UPPERCASE.md`** — §4/§6 say `market-selection.json`; as-ran used `market-selection.md`. NAMING.md §5 says major deliverables stay `UPPERCASE.md` (but §4/§6 use lowercase `bet-brief.md`, `funnel-brief.md`).
   - Recommendation: follow the §6 slot names verbatim (lowercase, the extensions §6 declares). NAMING.md §5's UPPERCASE rule governs the *engine's* deliverables; the §6 pipeline slot names are the operator-handed contract and win for the shell. Surface to the planner as a one-line decision.

4. **Where `runs/` is rooted** — confirmed: repo root (`path.join(process.cwd(), 'runs', SPACE)`). No `runs/` currently exists; Phase 1 creates it. No further question — stated for completeness.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node | New store/version/receipt/fan-out bricks | ✓ (engine ships package.json; runtime provisioned) | 20 | — |
| `node:fs`/`node:path` | All scaffolding | ✓ (stdlib) | — | — |
| sha256 (`node:crypto`) | `inputs_hash` in receipts | ✓ (stdlib) | — | — |
| git | Verifying committed/byte-intact + checksum diffing | ✓ (repo is a git repo) | — | — |
| Python 3.12 | NOT needed for Phase 1 (asset/py chain unused here) | ✓ | 3.12 | — |

**Missing dependencies with no fallback:** None.
**Missing dependencies with fallback:** None — this phase is stdlib-only Node + filesystem.

## Validation Architecture

> nyquist_validation is enabled (config.json `workflow.nyquist_validation: true`).

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None detected — engine proves itself with **bash smoke scripts** (`engine/contracts/h6-*.sh`, `h5-e2e.sh`), not a unit-test runner [VERIFIED: engine/contracts/ listing; no jest/vitest/pytest config in repo] |
| Config file | none — see Wave 0 |
| Quick run command | `bash engine/contracts/h6-all.sh` (proves the engine bricks, 14/14; NOT this phase's store) |
| Full suite command | A new `runs`-store smoke script, e.g. `bash .planning/phases/01-artifact-store-scaffold/store-smoke.sh` (author in Wave 0) |

**Recommendation:** match the engine's proven idiom — a **bash smoke script** that scaffolds a `smoke` space, asserts each slot exists, does a re-run, and checksum-diffs v1. This is consistent with `h6-*.sh` and avoids introducing a test framework the project hasn't chosen.

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command (illustrative) | File Exists? |
|--------|----------|-----------|----------------------------------|-------------|
| STORE-01 | `runs/smoke/` tree scaffolded; every §6 slot dir/file present | smoke | `test -d runs/smoke/voc/market-signal && test -d runs/smoke/_receipts && test -f runs/smoke/bet-brief.md ...` | ❌ Wave 0 |
| STORE-02 | Re-run writes `runs/smoke-v2/`; `runs/smoke/` byte-intact | smoke | scaffold → snapshot `sha256sum runs/smoke/**` → re-run → resolver returns `smoke-v2` → re-checksum `runs/smoke/**` equal | ❌ Wave 0 |
| STORE-03 | A receipt JSON exists per spawn with required keys | smoke | write a receipt → `jq -e '.spawn_id and .inputs_hash and .validator_verdicts and .outputs' runs/smoke/_receipts/<id>.json` | ❌ Wave 0 |
| STORE-04 | Fan-out namer produces `<niche>__<transformation>.json`; no collisions | unit/smoke | `buildFanoutName('a','b') === 'a__b.json'`; two distinct cells → two distinct files | ❌ Wave 0 |
| STORE-05 | `runs/smoke/` exists and a no-op `run` can target it | smoke | `test -d runs/smoke` + a stub write into a slot succeeds | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** the relevant slice of the store-smoke script (e.g. `test -d`/`jq -e` for the slot just built).
- **Per wave merge:** full `bash .../store-smoke.sh` (scaffold + version + receipt + fan-out + re-run checksum).
- **Phase gate:** full store-smoke green before `/gsd-verify-work`. (`bash engine/contracts/h6-all.sh` should still be 14/14 — confirm Phase 1 didn't disturb the engine.)

### Wave 0 Gaps
- [ ] `.planning/phases/01-artifact-store-scaffold/store-smoke.sh` — the bash acceptance harness covering STORE-01..05 (scaffold, version-resolve, receipt-shape, fan-out, re-run-checksum).
- [ ] No unit-test framework to install — deliberately matching the engine's bash-smoke idiom. (If the planner wants JS unit tests for the fan-out helper, `node --test` (stdlib, Node 20) needs no install.)

## Sources

### Primary (HIGH confidence — read in full or in the cited section this session)
- `basis/build-base/SHELL-BUILD-SPEC.md` — §4 slot list, §3 six components, §8 smoke, §11 DoD, §9 build order
- `basis/build-base/ONE-SHOT-SHELL.md` — §4 locked decisions, §5.7 copy-convention, §6 slot table, §7 DoD
- `basis/build-base/architecture/PART3--architecture-design.md` — §8 orchestration (receipt = inputs hash + verdicts + ledger), §9 seams, §5.2 consumption, §1.5 R1 order + ad-volume-aggregate contract, §5.1 VOC products (fan-out cell), §3 principles (P3/P8/P9)
- `engine/contracts/MATERIALS.md` — L32–38 no-overwrite-v1 = whole-space; v1/v2 split; Gotcha 2 (split-brain)
- `engine/contracts/REGISTRY.json` — 26 capabilities; confirmed no store/version/receipt/fan-out capability exists (L19 funnel-store, L35 validate-receipt is pipeline-audit)
- `engine/contracts/REUSE-INDEX.md` — §1 reusable code, §5 re-author marketing (store is neither — it's new scaffolding)
- `engine/contracts/NAMING.md` — §2 tree, §3 verbs (`store`), §5 artifact path `runs/<space>/<artifact>`, §6 cred seam, §7 off-limits (engine editable)
- `engine/bricks/funnel-store.js` — the `--space` + `sanitizePathSegment` + `path.join(cwd,'runs',SPACE,...)` convention to copy
- `engine/WIRING-BUNDLE.md` — "bricks read/write under runs/<space>/… you choose"; declared external inputs
- `engine/FIRING-MANIFEST.md` — §4 hooks don't fire in subagents (receipt = orchestrator step)
- `basis/build-base/reference/as-ran-repo/asran-repo-report.md` — §5 the actual `runs/arduview/` artifact inventory; §9 discrepancy gotchas
- `./CLAUDE.md` (project) — no-overwrite-v1 convention (D-07/08/09); guard hook DEFERRED
- `.gitignore` — exactly what's committed vs scratch under `runs/`
- `.planning/REQUIREMENTS.md`, `.planning/ROADMAP.md`, `.planning/PROJECT.md` — STORE-01..05 text, Phase 1 success criteria, constraints

### Secondary (MEDIUM confidence)
- `reference/as-ran-repo/repo-files/runs/arduview/` (listed) — sparse (only `space-map.json`, `_marketing-decisions/`, plan `.md`s) — the *report* §5 is the fuller inventory; the convention to copy is the report, not this thin tree.

### Tertiary (LOW confidence)
- None. No web/training-data claims were used; this is a closed-corpus repo phase.

## Project Constraints (from CLAUDE.md)

Actionable directives the planner must honor (root `~/CLAUDE.md` + project `PMF/CLAUDE.md`):
- **One job per agent; deterministic jobs are scripts/hooks, not agents.** Scaffold/version/receipt/fan-out are deterministic → **scripts**, never agents. "An agent that cleans/stores data is a category error." [PMF/CLAUDE.md "Agent design"]
- **no-overwrite-v1:** committed run outputs never mutated in place; re-run writes a NEW versioned location; v1 stays byte-intact. Governs committed `runs/<space>/…`; does NOT govern gitignored logs/scratch. **A guard hook is explicitly DEFERRED — do NOT build one.** [PMF/CLAUDE.md "Versioning"]
- **Ask before committing/pushing.** [root CLAUDE.md]
- **Simplicity first / minimal impact / no laziness — root causes, no temp fixes.** [root CLAUDE.md "Core Principles"]
- **Verify before done** — prove the scaffold works (the store-smoke script is the proof). [root CLAUDE.md]
- **No emoji, no fluff.** [root CLAUDE.md]

## Metadata

**Confidence breakdown:**
- Slot list (STORE-01): HIGH — reconciled §4 + §6 + R1; two name-discrepancies surfaced as decisions (Q1, Q3), not guesses.
- No-overwrite versioning (STORE-02): HIGH — MATERIALS.md L38 + REGISTRY p21 + CLAUDE.md are unambiguous (whole-space).
- `_receipts/` shape (STORE-03): MEDIUM — PART3 §8 names the four contents; exact JSON keys inferred (A2), confirmable when Phase 5 populates verdicts.
- Fan-out rule (STORE-04): HIGH — §4 gives the literal pattern; sanitize helper exists.
- Reuse vs author (engine): HIGH — REGISTRY.json scanned; no store/version/receipt/fan-out capability exists.

**Research date:** 2026-06-26
**Valid until:** ~30 days (stable closed-corpus repo; the only volatility is the planner resolving Q1/Q3 and Phase 2/5 settling receipt content).
