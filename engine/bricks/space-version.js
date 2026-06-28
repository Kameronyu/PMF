'use strict';
// space-version.js — STORE-02: the whole-SPACE no-overwrite-v1 version RESOLVER.
// Given a base space name, scans runs/ for <base> and <base>-vN and PRINTS the next free
// versioned space name to stdout (one bare line). It is READ-ONLY — it creates, writes,
// and mutates NOTHING under runs/. That read-only property is exactly what guarantees the
// byte-intact invariant the store-smoke harness asserts (STORE-02): resolving the next
// version never touches v1.
//
// Grain = whole SPACE, NEVER per-artifact (D-version-grain; engine/contracts/MATERIALS.md L38;
// CLAUDE.md "Versioning"). The resolver takes a SPACE NAME, never an artifact path. A re-run
// names a NEW versioned space (`runs/<base>-v2/`); v1 stays intact for provenance + diffing.
//
// Semantics:
//   - runs/ absent OR no runs/<base>           → print "<base>"      (the first run uses the
//                                                                      un-suffixed base name —
//                                                                      matches as-ran runs/arduview/ = v1)
//   - runs/<base> exists, no runs/<base>-v*     → print "<base>-v2"
//   - runs/<base> + runs/<base>-v2 exist        → print "<base>-v3"
//   - the regex ^<base>-v(\d+)$ (with <base> regex-escaped first, since sanitize permits
//     "." — a regex wildcard) matches ONLY the exact -vN suffix, so runs/<base>-backup is
//     NOT counted as a version, and a dotted base like foo.bar never matches fooXbar-v2.
//
// `<base>-vN` survives sanitizePathSegment unchanged ([a-z0-9._-]), so the printed name
// composes directly with every brick's --space flag with zero brick changes.
//
// NO GUARD HOOK (D-no-guard-hook): enforcement of no-overwrite-v1 is convention-only this
// phase and a guard hook is EXPLICITLY DEFERRED (CLAUDE.md "Versioning"). This brick only
// NAMES the next free space; the run-controller (Phase 2 CTRL-08) decides whether/when to
// scaffold the bumped space.
//
// Security (T-01-05): --space is sanitized to [a-z0-9._-] (strips "/" and "..") BEFORE it
// becomes a regex/path segment, and the resolver only READS runs/ dirnames — it cannot
// traverse or mutate.
//
// Usage:
//   node engine/bricks/space-version.js --space=<market-space>
//   node engine/bricks/space-version.js --help
//
// Output: the next free space name on stdout (one bare line). Exit 0 ok / 1 on bad usage.

const fs   = require('fs');
const path = require('path');

const { sanitizePathSegment } = require('./lib/fanout-path');

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);
const opts = Object.fromEntries(
  args.filter(a => a.startsWith('--'))
    .map(a => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; })
);

if (opts.help) {
  console.log(`
space-version.js — STORE-02: whole-SPACE no-overwrite-v1 version resolver (read-only)

Usage:
  node engine/bricks/space-version.js --space=<market-space>

Options:
  --space=<str>   Base market space name (e.g. smoke). REQUIRED. Sanitized to [a-z0-9._-];
                  "/" and ".." stripped (no path traversal out of runs/).
  --help          Show this help.

Behavior:
  Scans runs/ for <base> and <base>-vN and PRINTS the next free versioned space name to
  stdout (one bare line). READ-ONLY — creates/writes/mutates NOTHING under runs/.
    no runs/<base>            -> "<base>"
    runs/<base>, no -v*       -> "<base>-v2"
    runs/<base> + -v2         -> "<base>-v3"

  Capture in a script with:  NEXT=$(node engine/bricks/space-version.js --space=smoke)
`);
  process.exit(0);
}

if (typeof opts.space !== 'string' || opts.space === '') {
  console.error('ERROR: --space=<market-space> is required (did you forget the =value?)');
  process.exit(1);
}

const base = sanitizePathSegment(opts.space);
if (!base) {
  console.error('ERROR: --space value sanitized to empty string; use only [a-z0-9._-]');
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Resolve the next free whole-space name (READ-ONLY scan of runs/)
// ---------------------------------------------------------------------------
const runsDir  = path.join(process.cwd(), 'runs');
const existing = fs.existsSync(runsDir) ? fs.readdirSync(runsDir) : [];
// Escape regex metachars in the base (sanitize permits ".", a wildcard) so a dotted
// base like foo.bar matches ONLY foo.bar-vN, never a sibling like fooXbar-v2.
const esc = base.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const re  = new RegExp(`^${esc}-v(\\d+)$`);

// maxV: 0 = no <base> dir at all (next = base, the un-suffixed first run);
//       1 = <base> exists but no -vN yet (next = <base>-v2);
//       N = highest existing -vN suffix (next = <base>-v(N+1)).
const maxV = existing.reduce((m, d) => {
  if (d === base) return Math.max(m, 1);
  const match = d.match(re);
  return match ? Math.max(m, +match[1]) : m;
}, 0);

const next = maxV === 0 ? base : `${base}-v${maxV + 1}`;

// READ-ONLY: print the next free name and exit. No directory/file is created or mutated.
process.stdout.write(next + '\n');
process.exit(0);
