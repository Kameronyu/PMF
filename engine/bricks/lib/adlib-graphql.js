'use strict';
// adlib-graphql.js — extract ad records from captured Meta Ad Library GraphQL response bodies.
//
// #adlib-selectors fix (D-17): Meta serves Ad Library results via /api/graphql/. Each ad object
// carries ad_archive_id + snapshot.link_url (the real destination) + delivery dates + platforms —
// the exact binding-spine fields the rendered React DOM hides behind obfuscated, rotating class
// names. The old extractAdCards() DOM scrape returned null destination_url broadly, which collapsed
// funnel-assemble.js:clusterAdsByUrl (destination_url is the cluster key) → bound_ads:[].
//
// This module is the calibrated replacement source. Pure: takes an array of response-body strings,
// returns a Map(library_id -> card record). No I/O, no deps. Calibrated against the real captured
// fixture engine/_fixture/adlib/flipper-zero-xhr.json (Phase 21 H3).

function daysBetween(aEpochSec, bEpochSec) {
  if (!aEpochSec) return null;
  const end = bEpochSec || Math.floor(Date.now() / 1000);
  return Math.max(0, Math.round((end - aEpochSec) / 86400));
}

function isoFromEpoch(sec) {
  if (!sec || typeof sec !== 'number') return null;
  return new Date(sec * 1000).toISOString().slice(0, 10);
}

// Meta graphql bodies are usually plain JSON, but can carry a `for (;;);` anti-JSON-hijack prefix
// or be newline-delimited multiple JSON objects. Try the whole body, then fall back to per-line.
function tryParse(body) {
  const out = [];
  const stripped = body.replace(/^\s*for\s*\(;;\);/, '').trim();
  try { out.push(JSON.parse(stripped)); return out; } catch (_) {}
  for (const line of stripped.split('\n')) {
    const t = line.trim();
    if (!t || t[0] !== '{') continue;
    try { out.push(JSON.parse(t)); } catch (_) {}
  }
  return out;
}

// Recursively collect every node carrying an ad_archive_id (path-agnostic — robust to graphql
// shape changes; the agent investigation explicitly warned not to assume the nesting path).
function collectAdNodes(node, acc, depth) {
  if (!node || typeof node !== 'object' || depth > 16) return;
  if (Array.isArray(node)) { for (const x of node) collectAdNodes(x, acc, depth + 1); return; }
  if (node.ad_archive_id !== undefined && node.ad_archive_id !== null) acc.push(node);
  for (const k of Object.keys(node)) collectAdNodes(node[k], acc, depth + 1);
}

function mapOne(ad) {
  const snap = ad.snapshot || {};
  const cardLink = Array.isArray(snap.cards)
    ? (snap.cards.find(c => c && c.link_url) || {}).link_url || null
    : null;
  const destination_url = snap.link_url || cardLink || null;
  const startEpoch = ad.start_date || ad.ad_delivery_start_time || null;
  const endEpoch = ad.end_date || ad.ad_delivery_stop_time || null;
  const platformsArr = ad.publisher_platform || snap.publisher_platform || null;
  const impression_bucket =
    (ad.impressions_with_index && ad.impressions_with_index.impressions_text) || null;
  const bodyText = snap.body && typeof snap.body.text === 'string' ? snap.body.text : null;
  return {
    library_id: String(ad.ad_archive_id),
    destination_url,
    cta_text: snap.cta_text || null,
    headline: snap.title || (bodyText ? bodyText.slice(0, 120) : null),
    impression_bucket,
    platforms: Array.isArray(platformsArr) ? platformsArr.join(', ') : (platformsArr || null),
    start_date: isoFromEpoch(startEpoch),
    end_date: isoFromEpoch(endEpoch),
    run_length_days: daysBetween(startEpoch, endEpoch),
    page_name: ad.page_name || snap.page_name || null,
    is_active: ad.is_active === undefined ? null : !!ad.is_active,
    _source: 'graphql',
  };
}

// bodies: array of graphql response-body strings. Returns Map(library_id -> card record).
function mapAdsFromGraphql(bodies) {
  const byId = new Map();
  for (const body of (bodies || [])) {
    if (typeof body !== 'string' || !body.includes('ad_archive_id')) continue;
    for (const root of tryParse(body)) {
      const nodes = [];
      collectAdNodes(root, nodes, 0);
      for (const ad of nodes) {
        const rec = mapOne(ad);
        const prev = byId.get(rec.library_id);
        if (!prev) { byId.set(rec.library_id, rec); continue; }
        // Coalesce across bodies for the SAME ad: keep every field prev already resolved and
        // only fill its nulls from rec. A blanket { ...prev, ...rec } spread regressed an
        // already-resolved destination_url (the clusterAdsByUrl key) back to null when a later
        // body for the same library_id carried only an end_date — silently re-introducing the
        // #adlib-selectors collapse this module exists to fix (WR-01). Coalesce is symmetric:
        // it preserves the body carrying a destination_url AND the body carrying an end_date.
        const merged = { ...prev };
        for (const k of Object.keys(rec)) {
          if (merged[k] === null || merged[k] === undefined) merged[k] = rec[k];
        }
        byId.set(rec.library_id, merged);
      }
    }
  }
  return byId;
}

module.exports = { mapAdsFromGraphql };
