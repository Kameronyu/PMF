# Phase 1: Artifact Store Scaffold - Context

**Gathered:** 2026-06-26
**Status:** Ready for planning
**Mode:** Auto-generated (infrastructure phase — discuss skipped)

<domain>
## Phase Boundary

A `runs/<space>/` artifact store exists with one declared slot per inter-step artifact, no-overwrite versioning, a `_receipts/` run ledger, and a usable `smoke` space — the foundation every step reads from and writes to. Pure deterministic filesystem/convention scaffolding (mechanism), not marketing content.

</domain>

<decisions>
## Implementation Decisions

### Claude's Discretion
All implementation choices are at Claude's discretion — pure infrastructure phase. The design is already fixed by the authoritative sources and the phase's own research/patterns/validation artifacts:
- Slot list: SHELL-BUILD-SPEC §4 + ONE-SHOT §6 (reconciled in 01-RESEARCH.md).
- No-overwrite-v1 = whole-space versioning (`runs/<space>-vN/`), guard hook DEFERRED.
- Receipt shape + fan-out filename rule fixed in 01-RESEARCH.md / 01-PATTERNS.md.
- Reuse engine conventions (`sanitizePathSegment`, `--space`→`runs/<space>`), do not rewrite glue.

</decisions>

<code_context>
## Existing Code Insights

See 01-PATTERNS.md — every new brick mirrors the `funnel-store.js` shell; `store-smoke.sh` mirrors `engine/contracts/h6-*.sh`; fixture lives at `engine/_fixture/`; `_receipts/<spawn_id>.json` must avoid the `_*-log.txt`/`_index.json` gitignore patterns.

</code_context>

<specifics>
## Specific Ideas

No specific requirements beyond the authoritative sources — infrastructure phase. Refer to 01-RESEARCH.md, 01-PATTERNS.md, 01-VALIDATION.md, and the two PLAN.md files.

</specifics>

<deferred>
## Deferred Ideas

None — the no-overwrite guard hook is explicitly deferred per CLAUDE.md; field-level validation deferred to a later milestone.

</deferred>
