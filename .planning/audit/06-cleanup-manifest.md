# 06 — Cleanup Manifest

**Date:** 2026-06-04
**Status:** PROPOSAL ONLY — nothing has been moved, deleted, or edited.
**Sources:** audit/01, audit/05, live git status, directory recon, _index.json parse.

---

## 1. Manifest Table

Legend: tracked? = `Y` (git ls-files confirmed) | `N` (untracked) | `P` (partially — some files tracked, some not)

| # | Path | Tracked? | Proposed Action | Confidence | Reason | Reversible? |
|---|------|----------|-----------------|------------|--------|-------------|
| 1 | `launch/inkleaf-landing/` | Y (25 files) | ARCHIVE → `_archive/eink-launch/inkleaf-landing/` | HIGH | InkLeaf brand HTML + assets. Never referenced by arduview pipeline. Phase 17 builds from `runs/arduview/site/` reference only. Imported 2026-06-03, never reconciled. | Yes — git history preserves tracked files |
| 2 | `launch/inkleaf-launch/` (tracked files) | Y (9 files) | ARCHIVE → `_archive/eink-launch/inkleaf-launch/` | HIGH | InkLeaf launch runbook, Klaviyo docs. Same brand boundary. `launch/README.md` explicitly calls this "raw import not yet reconciled." | Yes — git history |
| 3 | `launch/inkleaf-launch/_deep-pass/` | N (untracked) | ARCHIVE → `_archive/eink-launch/inkleaf-launch/_deep-pass/` | HIGH | Untracked scratch from a deep-pass run on InkLeaf LP. Not part of arduview pipeline at any step. | Yes — no git history to lose |
| 4 | `map/data_inventory.md` | Y | INVESTIGATE | MED | 770-line schema/persistence doc from 2026-05-21 (pre-GSD). No arduview references. BUT: §Open Question #1 (VOC unit-of-record granularity) and the VOC `voc_record_id` field definitions are candidate Step 3 build inputs — not distilled anywhere else yet. Must scan §Capability outputs and §Open questions against Step 3 build plan before archiving. |  Yes |
| 5 | `run-retrospective.md` | Y | KEEP (hard keep-list) | — | Explicitly in STATE.md hard keep-list as the official e-ink learnings record. Out of scope. | — |
| 6 | `agents/implementation-notes.md` | Y | KEEP (hard keep-list) | — | Explicitly in STATE.md hard keep-list. Out of scope. | — |
| 7 | `_quarantine/` (entire dir) | Y | KEEP — already quarantined, leave as-is | — | STATE.md instruction: do not propose re-archiving or deleting. Just noted here for completeness. | — |
| 8 | `drive.cjs` (repo root) | N | DELETE | HIGH | Untracked. Exact duplicate of `runs/arduview/_tooling/drive.cjs` (verified: `diff` returned identical). Root placement was a stray copy. Canonical copy lives in `_tooling/`. | N/A — untracked, not in git history |
| 9 | `corpus/_clean-log.txt` | N | GITIGNORE | HIGH | 145-line pipeline run log. Scratch output from `tools/clean.js`. No analytical value. | N/A |
| 10 | `runs/arduview/asset-classify/_asset-emit-log.txt` | N | GITIGNORE | HIGH | 5-line run log from `asset-emit.js`. Scratch. | N/A |
| 11 | `runs/arduview/asset-classify/_asset-map-rank-log.txt` | N | GITIGNORE | HIGH | 2-line run log from `asset-map-rank.js`. Scratch. | N/A |
| 12 | `assets/_asset-fetch-log.txt` | N | GITIGNORE | HIGH | Run log from `asset-fetch.js`. Scratch. | N/A |
| 13 | `runs/arduview/funnels/_funnel-store-log.txt` | N | GITIGNORE | HIGH | Run log from `funnel-store.js`. Scratch. | N/A |
| 14 | `runs/arduview/funnels-scored/_funnel-score-log.txt` | N | GITIGNORE | HIGH | Run log from `funnel-score.js`. Scratch. | N/A |
| 15 | `runs/arduview/funnels-clean/_funnel-clean-log.txt` | N | GITIGNORE | HIGH | Run log from `funnel-clean.js`. Scratch. | N/A |
| 16 | `runs/arduview/STRATEGY-DISCUSS-HANDOFF.md` | N | INVESTIGATE | MED | Untracked. Chronology §3.8 flagged as potentially orphaned — no evidence a "strategy discussion session" was ever run from it. However, it's 128 lines and references run context that informed the LP build; `BUILD-FEEDBACK.md` cites it implicitly. Operator should confirm whether it's a live pickup doc for any future session or truly dead. | N/A |
| 17 | `runs/arduview/_mechanisms-in-play.agent.json` | Y (tracked) | INVESTIGATE | MED | Tracked scratch from the zero-DR market-selection run (step 2). RERUN-BRIEF says the run was invalidated, this file is the dead output. But it's committed — removing requires `git rm`. Operator call on whether to clean from history or just archive. | Reversible with git |
| 18 | `runs/arduview/_marketing-decisions/` | N | KEEP | HIGH | Untracked but clearly current active work — INDEX.md + 3 decision docs (light-pass, funnel-architect-copywriter, lp-builder), all timestamped 2026-06-04. Live operator scratch, not slop. | N/A |
| 19 | `runs/arduview/_asset-classify-proof.md` | N | KEEP | MED | Untracked. Chronology tags it "scratch" but it's the agent reasoning record for brick 4 live validation (Step 10). Could be useful if validate-asset-record.js is ever run retroactively on pre-existing records. | N/A |
| 20 | `runs/arduview/funnels/_index.json` | N | KEEP — hardening only (see §3) | MED | 45,867-line RAG index. Not a cleanup item — it's correct but structurally worth hardening. Classify fix as gated hardening, not immediate cleanup. See §3. | — |

### Proposed archive location

```
_archive/eink-launch/
  inkleaf-landing/     ← from launch/inkleaf-landing/
  inkleaf-launch/      ← from launch/inkleaf-launch/ (tracked + _deep-pass/ untracked)
```

`.gitignore` pattern to add (covers all pipeline run logs by convention):

```gitignore
# Pipeline run logs (scratch output from deterministic scripts)
_*-log.txt
corpus/_clean-log.txt
assets/_asset-fetch-log.txt
runs/**/funnels/_funnel-store-log.txt
runs/**/funnels-scored/_funnel-score-log.txt
runs/**/funnels-clean/_funnel-clean-log.txt
```

Or simpler global pattern (captures the naming convention used by all current tools):

```gitignore
_*-log.txt
```

---

## 2. Execution Subsets

### Safe to execute immediately (no operator decision needed)

These are either unambiguously scratch/duplicate, or the archive move has no downstream risk.

| # | Path | Action |
|---|------|--------|
| A | `drive.cjs` (root) | DELETE — exact duplicate of `runs/arduview/_tooling/drive.cjs` |
| B | `corpus/_clean-log.txt` | GITIGNORE — add `_*-log.txt` to `.gitignore` |
| C | `runs/arduview/asset-classify/_asset-emit-log.txt` | GITIGNORE (covered by above pattern) |
| D | `runs/arduview/asset-classify/_asset-map-rank-log.txt` | GITIGNORE (covered) |
| E | `assets/_asset-fetch-log.txt` | GITIGNORE (covered) |
| F | `runs/arduview/funnels/_funnel-store-log.txt` | GITIGNORE (covered) |
| G | `runs/arduview/funnels-scored/_funnel-score-log.txt` | GITIGNORE (covered) |
| H | `runs/arduview/funnels-clean/_funnel-clean-log.txt` | GITIGNORE (covered) |
| I | `launch/inkleaf-landing/` | ARCHIVE → `_archive/eink-launch/inkleaf-landing/` |
| J | `launch/inkleaf-launch/` (tracked files + `_deep-pass/`) | ARCHIVE → `_archive/eink-launch/inkleaf-launch/` |

Items I and J require a `git mv` for tracked files + a plain `mv` for untracked `_deep-pass/`, then a commit.

### Needs operator decision

| # | Path | Question |
|---|------|----------|
| 1 | `map/data_inventory.md` | Does Step 3 (VOC build) need the VOC unit-of-record / open-questions content in here? If yes: scan §§ and distill into Step 3 build brief before archiving. If no: ARCHIVE → `_archive/eink-launch/map/`. |
| 2 | `runs/arduview/STRATEGY-DISCUSS-HANDOFF.md` | Is this a live pickup doc for any planned session, or dead? If dead: DELETE (untracked, zero cost). If uncertain: KEEP until Phase 17 is done. |
| 3 | `runs/arduview/_mechanisms-in-play.agent.json` | It's committed (tracked). Worth a `git rm --cached` + GITIGNORE? Or tolerate the noise? Low stakes either way — it's 5k, but it's the invalidated zero-DR run output permanently in history. |

---

## 3. _index.json Investigation

**File:** `runs/arduview/funnels/_index.json`
**Size:** 45,867 lines / 1,069,903 bytes

**Structure:**

```
{
  "_meta": { space, backend, is_stub, dim: 1024, funnel_count: 4, record_count: 43 },
  "records": [ 43 entries ]
}
```

**Per-record fields:** `funnel_id`, `competitor`, `belief_id`, `embed_text`, `vector` (1024 floats), `verbatim_refs`, `execution_detail`, `moves`, ...

**Root cause of size:** Each of the 43 records contains a `vector` field that is a 1,024-element float array (Voyage-3-large embeddings). 43 records × 1,024 floats × ~24 bytes average per float = ~1 MB, matching the observed file size. The average bytes per record is ~24,881 bytes — almost entirely the 1024-float vector serialized as a JSON number array.

**Not a body-text bloat bug.** The `embed_text` field is a ~600-char summary string per record (not raw campaign HTML). The `verbatim_refs` are short quote excerpts. The size is entirely explained by storing 1024-float dense vectors as JSON.

**Verdict:** Functionally correct for the current 4-brand / 43-belief scale. At this scale the JSON vector store is acceptable. **The design becomes a bug at scale** — if the pipeline runs on 50+ brands with 10+ beliefs each (500+ records × 1024 floats = ~12 MB+ JSON, query time degrades), the vectors should be moved to a proper vector store (Voyage, Chroma, Qdrant) or a binary format (`.npy`, Parquet), with the JSON index holding only metadata + `embed_text` for inspection.

**Classification:** Gated hardening, not a cleanup item. Recommend filing as a Phase 18/infra note: "externalize RAG vectors from JSON index when record count > ~100."

---

## 4. Versioning Hygiene Recommendation

**Observed pattern:** `market-selection.md` was overwritten in-place (v1 gone, no archived copy). `FUNNEL-DESIGN.md` v2 header says "revised after adversarial review" — v1 unrecoverable. Both were significant judgment outputs where the delta matters.

**Recommendation:** Adopt a commit-before-revise rule for judgment outputs.

Rule: Before revising any file tagged `output-data` or `handoff` in the run inventory, commit the current state with message `snapshot(<filename>): pre-revision checkpoint`. Then revise and commit the new version normally.

This is lighter than `.vN` suffixes (no filename sprawl, no reference-update churn) and cheaper than branching. It relies on git history rather than the filesystem, which is where versions belong.

Apply to: `market-selection.md`, `FUNNEL-DESIGN.md`, `COPY-DRAFT.md`, and any future judgment outputs that go through an adversarial revision cycle.

**Do not apply to:** deterministic pipeline outputs (funnel JSON, images.json, etc.) — those are regenerable from inputs and don't need snapshot commits.
