# HANDOFF — next session (engine wiring hardening)

**Date:** 2026-06-25 · **From:** engine-separation session · **To:** Phase 21 hardening session.

## State at handoff
- Wiring consolidated `tools/`→`engine/`, committed **`ad5b510`**. Recovery tag **`m1-arduview-retro`** (pre-reorg state — `git show m1-arduview-retro:<path>` recovers anything).
- Arduview forensic done + committed **`b45a7cd`**: 5 wiring failures isolated (3 are free re-runs).
- **Phase 21 created** (`/gsd-add-phase`) → `.planning/phases/21-engine-wiring-hardening-…/21-CONTEXT.md`.
- Nothing nuked. All marketing + cruft still present (operator clears it at the rebuild, after marketing docs land).

## Inputs to this session (all in `engine/contracts/`)
`HARDENING.md` (the plan) · `RETRIEVAL-FAILURES-arduview.md` (the punch-list) · `ERROR-NOTES.md` · `REGISTRY.md`/`.json` (health=untested) · `NAMING.md` · `enums.json` · `schemas/` · `off-limits.json`. Plus: live targets/fixtures in `runs/arduview/` + `runs/_fixture/`; as-ran reference at `pmf3/build-base/reference/as-ran-repo/`; the operator's **automation/wiring-building skill** (drop in); the **`reddit-extract`** retriever (committed bone, smoke-tested in H4).

## Do first (highest leverage)
1. **Free re-runs, no code:** `funnel-store.js` (6a discard, `bbff2ff`) → rebuild `_index.json` → re-run analyzer for `belief_kind` (`35581d4`). Recovers ~24+43 nulled values, de-risks the rest.
2. **H0 contract extraction:** repoint validators to import `enums.json`; finish `asset-record.schema.json`; generate `prompts/_generated/enums.md`. Gate: every existing reject/pass fixture yields identical exit codes.
3. **Then code fixes** in blast-radius order (Trends → adlib → analyzer wiring → plumbing → 404 gate → qualifying_creatives → revenue feed → KS GraphQL → sophistication → creds), each fix→smoke→flip REGISTRY health→commit.

## Loose ends / gotchas
- **`.planning/codebase/` map is STALE** (pre-reorg, says `tools/`). Use `engine/contracts/REGISTRY.md` as the map.
- **`engine-map` skill is global** (`~/.claude/skills/`), not in the repo — available, but won't travel with a clone.
- **`guard-marketing.js` is staged, not wired.** Optional: wire it into `settings.json` PreToolUse before hardening for belt-and-suspenders (hardening is engine-only anyway).
- `.planning/ROADMAP.md` + `STATE.md` are frozen/untrusted — don't plan from them; `21-CONTEXT.md` points to `engine/contracts/`.
- Validators still carry inline enums (that's H0).

## After hardening
Engine green → operator brings marketing docs → see `engine/contracts/REBUILD-ROADMAP.md`.
