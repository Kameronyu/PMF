# FIRING-MANIFEST — how the engine's firing layer registers + fires

The "firing layer" is the glue that makes the agent prompts actually run safely: a marketing
firewall, per-agent output validators, and DR-context bundlers. In THIS repo it registers via
`.claude/settings.json` hooks; a builder wiring the bundle into a different agentic system
replicates the registrations below. All of it is proven offline by `engine/contracts/h6-firing.sh`.

## 1. Hook registrations (replicate these in the target system)
| event | matcher | command | purpose | exit contract |
|---|---|---|---|---|
| PreToolUse | `Write\|Edit\|MultiEdit` | `node engine/hooks/guard-marketing.js` | marketing firewall — blocks writes to operator-owned paths (`engine/contracts/off-limits.json`) | exit 2 = block (stderr → agent); exit 0 = allow. **Fail-open** if deny-list unreadable. |
| PostToolUse | `Write` | `node engine/hooks/route.js "<path>"` | dispatch a written file to its per-agent validator(s) by basename | propagates the validator's non-zero exit; exit 0 if no rule matches |

## 2. Path-input contract (how a hook receives the target path)
- `guard-marketing.js`: resolves the path from **argv[2] → `$CLAUDE_TOOL_INPUT_PATH` → stdin JSON `tool_input.file_path`** (current Claude Code delivers the PreToolUse payload on stdin). Fails open if none found.
- `route.js`: takes the written file path as **argv[2]** (the repo wires `"$CLAUDE_TOOL_INPUT_PATH"`).
A different harness only needs to hand each hook the path by one of these means.

## 3. route.js dispatch table (exact-basename → validator)
| written file (basename) | validator(s) run |
|---|---|
| `brands.json` | `validate-finder.js` + `validate-revenue.js` |
| `dump.json` | `validate-dumper.js` |
| `space-map.json` | `validate-classifier.js` |
| `*-beliefs.json` | `validate-analyzer.js` |
| anything else | pass (exit 0) |
Each validator: **exit 0 = pass, exit 2 = reject** (off-enum value, missing required field, hallucinated claim, etc. — see each validator's header). Enums come from `engine/contracts/enums.json`.

## 4. SUBAGENT caveat (critical)
Hooks do **NOT** fire inside subagents. Any validator/injector that must run for a subagent's output has to be invoked as an **explicit orchestrator step**, not relied on as a hook. Precedents already in the engine: the funnel-deep-pass orchestrator runs `validate-analyzer.js` explicitly; asset-classify runs `validate-asset-record.js` explicitly; `funnel-analyzer-context.js` spawns `inject-dr.js` explicitly. route.js's PostToolUse routing is **defense-in-depth** for main-loop writes only.

## 5. DR-context injectors (generators, not hooks)
`inject-dr.js` (Section Analyzer), `inject-funnel-architect-dr.js`, `inject-market-selection-dr.js`, `inject-copywriter-dr.js` bundle the DR knowledge files into a context block the agent receives.
- **Run** as an orchestrator step: `--stdout` (paste into the spawn prompt) or `--out=<path>` (write a generated file the agent reads).
- **DR knowledge dir** is configurable: `--dr-dir=<path>` → `$DR_DIR` → homedir default. Supply a fresh dir at wire-time (the repo's old content is stale; `engine/_fixture/dr-knowledge/` holds stubs for smoking only).
- Each injector enforces a hardcoded filename allowlist + a path-traversal guard pinning files under `DR_DIR`.

## 6. Wire-time override points (so the bundle isn't bound to THIS repo's layout)
| coupling | default (this repo) | override |
|---|---|---|
| inject-*-dr generated-bundle output | `.claude/skills/<skill>/_dr-context.generated.md` | `--out=<path>` / `--stdout` |
| inject-*-dr DR source dir | `~/knowledge/dr-marketing` | `--dr-dir=<path>` / `$DR_DIR` |
| audit-inject / audit-resolve manifest | `.claude/skills/pipeline-audit/evidence-manifest.json` | `--manifest=<path>` |
All are already flag-overridable — no code change needed to retarget; just pass the flags at wire-time.

## Verify
`bash engine/contracts/h6-firing.sh` — proves all 4 per-agent validators (good→0/bad→2), route.js dispatch + propagation, and all 4 DR injectors bundling from a `--dr-dir` fixture. (`validate-analyzer` + `validate-asset-record` are additionally covered by h5-e2e + h6-asset-classify; `guard-marketing` verified live.)
