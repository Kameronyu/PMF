'use strict';
// fanout-path.js — STORE-04: per-cell fan-out filename rule + canonical path-segment
// sanitizer (path-traversal safe). Shared lib: store/version/receipt bricks import this
// instead of re-pasting their own sanitizer (lib/ placement mirrors lib/embed.js, which
// funnel-*.js import via require('./lib/embed')).
//
// Rule: <axis-a>__<axis-b>.json — keys joined by a DOUBLE underscore (a single `_` can
// appear inside a value like `qualifying_creatives`, so `__` is the safe field separator).
// Each key is sanitized to [a-z0-9._-]; a hostile key cannot inject `/` or `..` into the
// filename. `<base>-vN` survives the filter unchanged, so versioned space names compose.
//
// Collisions are impossible: keys are closed-vocabulary cell coordinates (niche ×
// transformation), so two distinct cells always map to two distinct filenames.

function sanitizePathSegment(raw) {
  // Allow only [a-z0-9._-]; strip everything else (including "/" and "..").
  return String(raw)
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, '')
    .replace(/\.\.+/g, '');   // strip residual dot-runs (traversal-safe): a run of 2+ dots
                              // is removed entirely, so ".." -> "" and "a..b" -> "ab".
                              // This guarantees no surviving ".." segment can rejoin into a
                              // parent-dir traversal. (Single dots are kept: "a.b" -> "a.b".)
}

function buildFanoutName(...keys) {
  return keys.map(sanitizePathSegment).join('__') + '.json';
}

module.exports = { buildFanoutName, sanitizePathSegment };
