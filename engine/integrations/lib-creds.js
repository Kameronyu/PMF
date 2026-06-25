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
  const flag = process.argv.find(a => a.startsWith('--creds='));
  if (flag) return flag.slice('--creds='.length);
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
function positionals() {
  return process.argv.slice(2).filter(a => !a.startsWith('--'));
}

module.exports = { credsPath, loadCreds, positionals };
