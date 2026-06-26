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
// Collision guarantee (SCOPED — true only for enforced inputs): for the closed-vocabulary
// kebab cell coordinates this brick is fed (niche × transformation: lowercase, no `__`,
// bounded length), two distinct cells always map to two distinct filenames. It is NOT a
// guarantee for arbitrary strings — the `__` separator is not escaped inside values, so
// e.g. buildFanoutName('a','b__c') and buildFanoutName('a__b','c') would both collide to
// 'a__b__c.json', and sanitization can erase a segment ('ADHD!!!' -> 'adhd', '!!!' -> '').
// buildFanoutName() therefore guards every segment (non-empty, no `__`, <=64 chars) and
// THROWS on an off-vocabulary / colliding / over-long coord, so it fails loudly instead of
// silently colliding or risking ENAMETOOLONG.

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
  const segs = keys.map((raw, i) => {
    const s = sanitizePathSegment(raw);
    // Defensive guard: an off-vocabulary / colliding / over-long coord must fail LOUDLY
    // rather than silently collide (the `__` separator is unescaped in values) or risk
    // ENAMETOOLONG. The enforced cell-coordinate vocabulary (lowercase kebab, no `__`,
    // bounded length) always passes; anything else throws.
    if (s === '') {
      throw new Error(`buildFanoutName: segment ${i} ("${raw}") sanitized to empty — off-vocabulary coord`);
    }
    if (s.includes('__')) {
      throw new Error(`buildFanoutName: segment ${i} ("${raw}") contains "__" after sanitize — would collide with the field separator`);
    }
    if (s.length > 64) {
      throw new Error(`buildFanoutName: segment ${i} ("${raw}") is ${s.length} chars (>64) after sanitize — risks ENAMETOOLONG`);
    }
    return s;
  });
  return segs.join('__') + '.json';
}

module.exports = { buildFanoutName, sanitizePathSegment };
