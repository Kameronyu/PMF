#!/usr/bin/env bash
# h6-clean.sh — HARDENING H6: smoke html-clean-markdown (engine/bricks/clean.js).
# Asserts clean.js's REAL contract: corpus/<slug>/raw/*.html -> clean/<page>.md with
# HTML tags stripped, <script>/<style>/<nav>/<header>/<footer> blocks removed, entities
# decoded, and visible body text preserved. (NOTE: clean.js does NOT mark [SECTION] —
# that is funnel-clean.js's job, already green via H5. The closeout row conflated them.)
# Output is written to a transient runs/_fixture-clean/ that is removed at the end.
# Exit 0 = all asserts pass; non-zero = the failing assert is named.
set -u
cd "$(dirname "$0")/../.." || exit 1   # repo root (engine/contracts/ -> repo)

FX="runs/_fixture/corpus"
OUT="runs/_fixture-clean"
MD="${OUT}/sample-brand/clean/landing.md"
FAIL=0
ok()  { echo "   PASS: $1"; }
bad() { echo "   FAIL: $1"; FAIL=1; }

rm -rf "$OUT"

echo "── H6.clean: node clean.js --in=${FX} --out=${OUT} ──"
node engine/bricks/clean.js --in="$FX" --out="$OUT" >/dev/null 2>&1

if [ ! -s "$MD" ]; then bad "no/empty clean output at ${MD}"; echo "H6 clean: FAILED"; rm -rf "$OUT"; exit 1; fi
ok "clean output exists and is non-empty"

body=$(cat "$MD")
# Boilerplate blocks must be gone
for secret in SCRIPT_SECRET SCRIPT_SECRET_2 STYLE_SECRET NAV_SECRET FOOTER_SECRET; do
  if echo "$body" | grep -q "$secret"; then bad "boilerplate leaked: ${secret} present"; else ok "removed ${secret}"; fi
done
# HTML tags must be stripped
if echo "$body" | grep -Eq '<(script|style|h2|h3|nav|header|footer)\b'; then bad "HTML tags survived strip"; else ok "HTML tags stripped"; fi
# Visible content must survive
echo "$body" | grep -q "Headline Visible Text" && ok "heading text preserved" || bad "heading text lost"
echo "$body" | grep -q "BODY_VISIBLE" && ok "body copy preserved" || bad "body copy lost"
# Entity decode
echo "$body" | grep -q "Tom & Jerry" && ok "&amp; decoded" || bad "&amp; not decoded"
echo "$body" | grep -q '"quoted"' && ok "&quot; decoded" || bad "&quot; not decoded"
# Provenance header
echo "$body" | grep -q "<!-- source:" && ok "provenance header present" || bad "no provenance header"

echo ""
rm -rf "$OUT"
if [ "$FAIL" -eq 0 ]; then echo "H6 clean: ALL ASSERTS PASS ✓ (transient ${OUT} cleaned)"; exit 0;
else echo "H6 clean: FAILED — see the named assert above"; exit 1; fi
