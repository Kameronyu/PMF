#!/usr/bin/env node
// guard-marketing.js — PreToolUse marketing firewall (STAGED, NOT WIRED).
//
// Blocks Write/Edit to operator-owned marketing paths so a hardening pass cannot touch strategy.
// Reads the deny-list from engine/contracts/off-limits.json. Exit 0 = allow, exit 2 = block.
//
// TO ENFORCE: add to .claude/settings.json:
//   "PreToolUse": [{ "matcher": "Write|Edit|MultiEdit",
//     "hooks": [{ "type": "command",
//       "command": "node engine/hooks/guard-marketing.js \"$CLAUDE_TOOL_INPUT_PATH\"" }] }]
// then flip off-limits.json _meta.enforcement to WIRED.
//
// Until wired this script is inert (never invoked) — the deny-list is documentation.

const fs = require('fs');
const path = require('path');

const target = process.argv[2] || process.env.CLAUDE_TOOL_INPUT_PATH || '';
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
