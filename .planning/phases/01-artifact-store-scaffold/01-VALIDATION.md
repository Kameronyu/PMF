---
phase: 1
slug: artifact-store-scaffold
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-06-26
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution. Mirrors the engine's existing bash-smoke idiom (`engine/contracts/h6-*.sh`) — no JS/TS test framework is introduced for filesystem-scaffold validation.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | bash smoke script (mirrors `engine/contracts/h6-all.sh` idiom: `test -d/-f`, `jq -e`, `sha256sum` diff) |
| **Config file** | none — Wave 0 authors the smoke script |
| **Quick run command** | `bash engine/contracts/store-smoke.sh --space=smoke` |
| **Full suite command** | `bash engine/contracts/store-smoke.sh --space=smoke` (single script covers STORE-01..05) |
| **Estimated runtime** | ~3 seconds |

---

## Sampling Rate

- **After every task commit:** Run the quick command
- **After every plan wave:** Run the full command
- **Before `/gsd-verify-work`:** Smoke script must exit 0
- **Max feedback latency:** ~5 seconds

---

## Per-Requirement Verification Map

| Requirement | Behavior | Test Type | Automated Check | File Exists | Status |
|-------------|----------|-----------|-----------------|-------------|--------|
| STORE-01 | `runs/<space>/` tree has one declared slot per inter-step artifact | smoke | `test -d`/`test -f` for every slot path in the §4/§6 list (bet-brief.md, asset-classify/, brands.json, funnels/, space-map.json, voc/market-signal/, market-selection.json, voc-bank/, funnel-brief.md, copy/, asset-records.json, review/) | ❌ W0 | ⬜ pending |
| STORE-02 | re-run writes a NEW versioned space; v1 byte-intact | smoke | resolve target for an existing space → `runs/<space>-v2/`; `sha256sum` of a v1 file unchanged after the re-run | ❌ W0 | ⬜ pending |
| STORE-03 | `_receipts/` ledger records every spawn | smoke | `test -d runs/<space>/_receipts/`; a sample receipt validates: `jq -e '.spawn_id and .inputs_hash and .validator_verdicts and .ts'` | ❌ W0 | ⬜ pending |
| STORE-04 | per-cell fan-out uses disambiguating filenames | smoke | a helper resolves `(niche, transformation)` → `voc/market-signal/<niche>__<transformation>.json`; two distinct cells → two distinct paths | ❌ W0 | ⬜ pending |
| STORE-05 | a `smoke` space exists and is usable | smoke | `test -d runs/smoke/`; scaffolding the `smoke` space succeeds idempotently | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `engine/contracts/store-smoke.sh` — the smoke script asserting STORE-01..05 (exit 0 = green)
- [ ] No framework install needed (bash + `jq` + `sha256sum`; `jq` already a dependency per `engine/DEPENDENCIES.md`)

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| — | — | All STORE behaviors have automated bash-smoke verification | — |

*All phase behaviors have automated verification.*

---

## Validation Sign-Off

- [ ] All requirements have an automated smoke check or Wave 0 dependency
- [ ] Sampling continuity: smoke script runs after each task
- [ ] Wave 0 covers the smoke script (the only MISSING reference)
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter once smoke script exists and is green

**Approval:** pending
