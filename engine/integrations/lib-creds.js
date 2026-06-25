'use strict';
// lib-creds.js — #cred-seam (H4): resolve an integration's creds path from, in order:
//   1. a --creds=<path> CLI flag (run-supplied; highest priority)
//   2. an env var holding the path (e.g. SHOPIFY_CREDS=/path/to/.shopify-creds.json)
//   3. the legacy default path.join(<callerDir>, <defaultName>)  (backward-compatible)
//
// Generic code, run-supplied secret. The integrations were promoted from
// runs/arduview/_tooling/ into engine/integrations/, but the creds files stayed at
// runs/arduview/_tooling/, so the old __dirname lookup misses — this seam lets the
// run pass the path explicitly while keeping the legacy default working unchanged.
const fs = require('fs');
const path = require('path');

function credsPath(callerDir, defaultName, envVar) {
  const argv = process.argv;
  // Accept both --creds=<path> and the space-separated --creds <path> (common CLI muscle memory).
  const eq = argv.find(a => a.startsWith('--creds='));
  if (eq) return eq.slice('--creds='.length);
  const i = argv.indexOf('--creds');
  if (i !== -1 && argv[i + 1] && !argv[i + 1].startsWith('--')) return argv[i + 1];
  if (envVar && process.env[envVar]) return process.env[envVar];
  return path.join(callerDir, defaultName);
}

function loadCreds(callerDir, defaultName, envVar) {
  const p = credsPath(callerDir, defaultName, envVar);
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch (e) {
    console.error(
      `[creds] cannot read creds at "${p}" — pass --creds=<path>` +
      (envVar ? ` or set ${envVar}=<path>` : '') + `. (${e.code || e.message})`
    );
    process.exit(1);
  }
}

// Strip CLI flags (--x / --x=y) so positional argv reads are unaffected by --creds etc.
// The space-separated `--creds <path>` form consumes the FOLLOWING token too — drop it so the
// creds path never leaks in as a positional (e.g. cf.js's body / shopify's config path).
function positionals() {
  const args = process.argv.slice(2);
  const out = [];
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--creds') { i++; continue; } // skip the consumed space-separated value
    if (a.startsWith('--')) continue;
    out.push(a);
  }
  return out;
}

module.exports = { credsPath, loadCreds, positionals };
