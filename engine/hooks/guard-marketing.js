#!/usr/bin/env node
// guard-marketing.js — PreToolUse marketing firewall (WIRED 2026-06-26, Phase-21 closeout).
//
// Blocks Write/Edit/MultiEdit to operator-owned marketing paths so a hardening pass cannot
// touch strategy. Reads the deny-list from engine/contracts/off-limits.json.
// Exit 0 = allow, exit 2 = block (PreToolUse: exit 2 cancels the tool call, stderr → agent).
//
// WIRED in .claude/settings.json as:
//   "PreToolUse": [{ "matcher": "Write|Edit|MultiEdit",
//     "hooks": [{ "type": "command", "command": "node engine/hooks/guard-marketing.js" }] }]
// and off-limits.json _meta.enforcement flipped to WIRED.
//
// Target-path resolution (robust across hook-contract versions):
//   1. argv[2]                         — CLI test mode: `node guard-marketing.js <path>`
//   2. $CLAUDE_TOOL_INPUT_PATH         — legacy env-var convention (route.js uses this)
//   3. stdin JSON tool_input.file_path — current Claude Code hook contract (PreToolUse payload)
// FAIL-OPEN everywhere a path can't be determined or the deny-list can't be read — a hardening
// pass must never be bricked by the guard; the guard only ever BLOCKS on a definite match.

const fs = require('fs');
const path = require('path');

// 1/2: explicit arg or legacy env var. (`""` from an empty `$VAR` expansion is falsy → fall through.)
let target = process.argv[2] || process.env.CLAUDE_TOOL_INPUT_PATH || '';

// 3: current hook contract — JSON on stdin: { tool_name, tool_input: { file_path, ... } }.
if (!target) {
  try {
    const raw = fs.readFileSync(0, 'utf8');           // fd 0; in a hook this is a piped payload
    if (raw && raw.trim()) {
      const payload = JSON.parse(raw);
      const ti = payload.tool_input || payload.toolInput || {};
      target = ti.file_path || ti.path || ti.filePath || '';
    }
  } catch (_) {
    // No stdin / not JSON / read error → fail-open (do not block).
  }
}

if (!target) process.exit(0);

const offLimitsPath = path.resolve(__dirname, '..', 'contracts', 'off-limits.json');
let cfg;
try {
  cfg = JSON.parse(fs.readFileSync(offLimitsPath, 'utf8'));
} catch (e) {
  // Fail-open: if the deny-list is unreadable, do not block (engine work must not be bricked).
  process.exit(0);
}

// Normalize to a repo-relative posix path for prefix matching.
const rel = path.relative(process.cwd(), path.resolve(target)).split(path.sep).join('/');

function matches(rel, rule) {
  // rule may be a prefix ("marketing-lens/prompts/"), a file ("definitions.md"),
  // or contain a single "*" wildcard segment ("runs/*/_marketing-decisions/").
  if (rule.includes('*')) {
    const re = new RegExp('^' + rule.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '[^/]*'));
    return re.test(rel);
  }
  return rel === rule || rel.startsWith(rule);
}

const offLimits = cfg.off_limits || [];
const hit = offLimits.find((r) => matches(rel, r));
if (hit) {
  process.stderr.write(
    `REJECT: "${rel}" is an operator-owned MARKETING surface (matched "${hit}"). ` +
    `Hardening must not edit marketing strategy. See engine/contracts/off-limits.json.\n`
  );
  process.exit(2);
}
process.exit(0);
