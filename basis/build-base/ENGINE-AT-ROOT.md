# Engine is at the repo root: /engine

The hardened engine that was here (`build-base/engine/`) is byte-identical to the
canonical, wired engine at the repo root **`/engine`** (verified 2026-06-26).

It was removed from `basis/` to avoid a duplicate, and because the root copy is the
one wired into `.claude/settings.json` (the PostToolUse `route.js` hook, the
PreToolUse `guard-marketing.js` firewall) and referenced by `engine/contracts/`.

**When building the shell from `SHELL-BUILD-SPEC.md`, target `/engine`** (the map is
`engine/contracts/REGISTRY.md`), NOT a copy under `basis/`.
