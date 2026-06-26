#!/usr/bin/env bash
# h6-all.sh — HARDENING H6 re-verify runner. Runs the deterministic E2E (h5-e2e.sh) plus every
# H6 brick smoke + the Bucket-B dry-run, and reports a pass/fail summary. This is the one command
# the closeout RESOLVE step (and any future regression check) runs to confirm the engine is still
# green. Each child smoke writes only to transient runs/_fixture-*/ dirs it cleans up itself.
# Exit 0 = all green; non-zero = the failing smoke(s) are named.
set -u
cd "$(dirname "$0")" || exit 1   # engine/contracts/

SMOKES=(
  h5-e2e            # deterministic funnel spine (P21 H5)
  h6-clean h6-dedupe h6-revenue h6-claim-tally h6-analyzer-context
  h6-mechanisms h6-funnel-assemble h6-audit h6-asset-classify
  h6-asset-fetch h6-video-assemble
  h6-firing         # firing layer: validators good/bad + route + DR injectors
  h6-bucketB        # surge dry-run-verified + cdp partial (best-effort)
)

pass=0; fail=0; failed=""
for s in "${SMOKES[@]}"; do
  if timeout 180 bash "./${s}.sh" >/dev/null 2>&1; then
    echo "  ✓ ${s}"; pass=$((pass+1))
  else
    rc=$?; echo "  ✗ ${s} (rc=${rc})"; fail=$((fail+1)); failed="${failed} ${s}"
  fi
done

echo ""
echo "H6-ALL: ${pass} passed / ${fail} failed${failed:+ — FAILED:${failed}}"
[ "$fail" -eq 0 ] && { echo "ENGINE SMOKES ALL GREEN ✓"; exit 0; } || exit 1
