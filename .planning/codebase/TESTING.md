# Testing Patterns

**Analysis Date:** 2026-06-26

## Test Framework

**Verification Model:** H6 health-check harness (bash scripts) + H5 deterministic E2E proof

**Test Runner:**
- Bash scripts (no npm test; no vitest/jest)
- Invoked directly: `bash engine/contracts/h6-<capability>.sh`
- Entry point: `bash engine/contracts/h6-all.sh` (all smokes in one command)

**Run Command:**
```bash
# All health checks (reports 14/14 green status)
bash engine/contracts/h6-all.sh

# Deterministic E2E (no-agent spine; funnel coherence proof)
bash engine/contracts/h5-e2e.sh

# Individual capability smoke (any h6-*.sh)
bash engine/contracts/h6-clean.sh
bash engine/contracts/h6-firing.sh
bash engine/contracts/h6-asset-classify.sh
```

**Exit Behavior:**
- Exit 0 = all asserts pass (smoke is green)
- Exit non-zero = named hop/assertion failed (failure message printed)
- Timeout: 180 seconds per smoke (`timeout 180 bash ./${s}.sh`)

## Test File Organization

**Location:** `engine/contracts/h6-*.sh` and `engine/contracts/h5-e2e.sh`

**Naming Convention:**
- H6 smoke naming: `h6-<capability>.sh` (one per major pipeline brick)
- Examples: `h6-clean.sh`, `h6-funnel-assemble.sh`, `h6-asset-classify.sh`, `h6-firing.sh`

**H6 Smokes Tested (14 total):**
1. `h5-e2e` — deterministic E2E (no agent, golden fixtures)
2. `h6-clean` — HTML→markdown stripping
3. `h6-dedupe` — domain normalization + row merging
4. `h6-revenue` — revenue estimation validation
5. `h6-claim-tally` — belief record aggregation
6. `h6-analyzer-context` — context assembly for Section Analyzer
7. `h6-mechanisms` — mechanism discovery + scoring
8. `h6-funnel-assemble` — live-DOM funnel assembly
9. `h6-audit` — audit injection + resolution
10. `h6-asset-classify` — asset map-rank + emit pipeline
11. `h6-asset-fetch` — image probe + technical metadata
12. `h6-video-assemble` — video editing + tone-mapping
13. `h6-firing` — validators + route dispatch + DR injectors
14. `h6-bucketB` — surge dry-run + CDP partial

**Status:** "14/14 green" reported in commit messages; each smoke is self-contained and cleans up transient fixtures.

## Test Structure

**Smoke Structure (bash):**
```bash
#!/usr/bin/env bash
# h6-<capability>.sh — HARDENING H6: smoke <capability>.
# [Description of what the capability does]
# Exit 0 = all asserts pass; non-zero = the failing hop is named.
set -u
cd "$(dirname "$0")/../.." || exit 1   # repo root

FX="engine/_fixture"          # golden read-only fixtures
SCRATCH="runs/${SPACE}"        # or engine/_fixture-<capability>
FAIL=0

ok()  { echo "   PASS: $1"; }
bad() { echo "   FAIL: $1"; FAIL=1; }
rc_is() { [ "$1" -eq "$2" ] && ok "$3 (rc=$1)" || bad "$3 (rc=$1 expected $2)"; }

echo "── H6.<capability>: <description> ──"
# ... test steps ...

rm -rf "$SCRATCH"
[ "$FAIL" -eq 0 ] && exit 0 || exit 1
```

**Pattern:**
- Setup: Create transient output dir (`engine/_fixture-<capability>/`), copy read-only fixtures if needed
- Execution: Run the brick under test with CLI flags
- Assertions: Inline node/bash checks (file exists, output contains X, JSON field has value Y)
- Cleanup: `rm -rf "$SCRATCH"` before exit
- Report: `ok()` / `bad()` functions track PASS/FAIL, final summary line

## Fixtures and Factories

**Fixture Location:** `engine/_fixture/` (read-only golden data for offline testing)

**Fixture Subdirectories:**
- `engine/_fixture/corpus/` — HTML raw + cleaned markdown for clean.js test
- `engine/_fixture/analyzer/` — committed golden belief records (golden-<funnel-id>-beliefs.json)
- `engine/_fixture/funnels-assembled/` — funnel_package.json fixtures (live-DOM output cached)
- `engine/_fixture/funnels-clean/` — cleaned funnel output (section-marked body)
- `engine/_fixture/asset-classify/` — asset records (img-001.json, vid-001.json) + claim list
- `engine/_fixture/firing/` — validator test data (brands-good.json, brands-bad-finder.json, dump.json, space-map-*.json)
- `engine/_fixture/audit/` — audit manifest fixtures
- `engine/_fixture/dr-knowledge/` — stub DR knowledge files for injector testing (persuasion--carl-weische.md, etc.)

**Fixture Strategy:**
- Golden fixtures are COMMITTED (read-only during smoke)
- Transient outputs are written to `engine/_fixture-<capability>/` (ephemeral, cleaned at end)
- No-overwrite-v1 convention: smokes create NEW transient dirs on each run, never mutate fixtures in place

**Example Fixture Usage:**
```bash
# Read-only golden input
PKG="${FX}/funnels-assembled/gameshell-kickstarter.json"
BELIEFS="${FX}/analyzer/gameshell-kickstarter-beliefs.json"

# Transient output (cleaned up)
SCRATCH="runs/${SPACE}"
rm -rf "$SCRATCH"; mkdir -p "${SCRATCH}/funnels"
# ... run brick ...
rm -rf "$SCRATCH"
```

## Test Types

### 1. Unit Smoke (H6)

**Scope:** Single brick invocation with golden fixtures

**Pattern:**
```bash
# Invoke the brick
node engine/bricks/clean.js --in="$FX/corpus" --out="$OUT" >/dev/null 2>&1

# Assert output structure
if [ ! -s "$MD" ]; then bad "no/empty clean output"; exit 1; fi
ok "clean output exists and is non-empty"

# Assert content (inline node/bash checks)
echo "$body" | grep -q "Headline Visible Text" && ok "heading text preserved" || bad "heading text lost"
```

**No external setup:** Smokes are fully offline (no live HTTP, no agents).

### 2. Deterministic E2E (H5)

**Scope:** No-agent core spine (deterministic hops only)

**Spine Tested (`h5-e2e.sh`):**
```
H5.0: validate-analyzer GATE (golden beliefs → exit 0)
H5.1: funnel-clean (package → [SECTION]-marked body)
H5.2: funnel-score (package → non-null validation_strength)
H5.3: funnel-store (scored + golden beliefs → 6a fields + belief_records)
H5.4: funnel-vectorize (stored → _index with records + vectors)
H5.5: funnel-rag-query (index → ranked results)
```

**Assertion Pattern:**
- Each hop: output file existence check
- JSON field validation: `(c.cleaned_body||"").length > 0 && secs >= 1`
- Type checks: `Array.isArray(s.validation_lane)`, `.some(r=>Array.isArray(r.vector))`

**Golden Data:** Agent-replaced by committed fixture
- `engine/_fixture/analyzer/gameshell-kickstarter-beliefs.json` (replaces Section Analyzer output)
- `engine/_fixture/funnels-assembled/gameshell-kickstarter.json` (cached live-DOM output)

### 3. Firing Layer (H6.firing)

**Scope:** Validators (exit 0/2 contracts) + route dispatch + DR injectors

**Validator Tests:**
```bash
# Good case → exit 0
node engine/hooks/validate-finder.js "$F/brands-good.json" >/dev/null 2>&1
rc_is $? 0 "validate-finder good"

# Bad case → exit 2 (off-enum value)
node engine/hooks/validate-finder.js "$F/brands-bad-finder.json" >/dev/null 2>&1
rc_is $? 2 "validate-finder bad (off-enum channel)"
```

**Route Dispatch Tests:**
```bash
# Same-basename dispatch
cp "$F/brands-good.json" "$T/brands.json"
node engine/hooks/route.js "$T/brands.json" >/dev/null 2>&1
rc_is $? 0 "route brands.json (good) -> finder+revenue pass -> 0"

# Exit propagation (first validator rejects → chain exits 2)
cp "$F/brands-bad-finder.json" "$T/brands.json"
node engine/hooks/route.js "$T/brands.json" >/dev/null 2>&1
rc_is $? 2 "route brands.json (bad) -> finder rejects -> propagates 2"

# Unmatched basename → pass
node engine/hooks/route.js "$T/unmatched.json" >/dev/null 2>&1
rc_is $? 0 "route unmatched basename -> pass 0"
```

**DR Injector Tests:**
```bash
# Injector bundling from --dr-dir fixture
inj_check() { # $1=script $2=expected stub filename in output
  local out; out=$(node "engine/hooks/$1.js" --stdout --dr-dir="$DRFX" 2>/dev/null)
  if [ "${#out}" -gt 200 ] && printf '%s' "$out" | grep -q "$2"; then
    ok "$1 bundled from --dr-dir (refs $2)"
  else
    bad "$1 did not bundle $2 from --dr-dir"
  fi
}
inj_check inject-dr "persuasion--carl-weische.md"
inj_check inject-funnel-architect-dr "funnel-architecture--carl-weische.md"
```

## Assertion Helpers

**Helper Functions (bash):**
```bash
ok()  { echo "   PASS: $1"; }              # Log a passing assertion
bad() { echo "   FAIL: $1"; FAIL=1; }      # Log a failing assertion, set flag
rc_is() { [ "$1" -eq "$2" ] && ok "$3 (rc=$1)" || bad "$3 (rc=$1 expected $2)"; }  # Exit code assertion
step() { echo ""; echo "── H5.$1 ──"; }    # Print step header
```

**Inline JSON/File Checks (node):**
```javascript
// Check file existence and parse JSON
const fs=require("fs");const f="<path>";
if(!fs.existsSync(f)){console.error("   FAIL: no output");process.exit(1);}
const c=JSON.parse(fs.readFileSync(f,"utf8"));

// Field presence and type
const n=(c.cleaned_body||"").length;
if(n>0){console.log("   PASS: cleaned_body "+n+" chars");}else{process.exit(1);}

// Array checks
if(Array.isArray(r.belief_records) && r.belief_records.length>=1){
  console.log("   PASS: belief_records="+r.belief_records.length);
}else{console.error("   FAIL: no belief_records");process.exit(1);}
```

## Error Testing

**Pattern:** Validators have explicit "bad" fixtures that trigger rejection

**Example (`h6-firing.sh`):**
```bash
# Bad fixture for enum validation
node engine/hooks/validate-finder.js "$F/brands-bad-finder.json" >/dev/null 2>&1
rc_is $? 2 "validate-finder bad (off-enum channel)"
```

**Bad Fixture Structure:**
- `brands-bad-finder.json` — has off-enum `channel` value (violates CHANNEL_ENUM)
- `brands-bad-revenue.json` — placeholder (pending validator implementation)
- `space-map-bad.json` — has off-enum `demand_trend.shape` value

**Coverage:** All validators have both good + bad fixtures in `engine/_fixture/firing/`.

## Transient Cleanup

**Pattern:** Every smoke creates transient dirs that are fully cleaned at exit

**Convention:**
```bash
SCRATCH="engine/_fixture-<capability>"    # transient workspace
rm -rf "$SCRATCH"                          # clean before (if re-run)
mkdir -p "$SCRATCH"
# ... write outputs to $SCRATCH ...
rm -rf "$SCRATCH"                          # clean after
```

**Why:** Allows re-runs (no leftover state) and keeps fixture dir pristine (no-overwrite-v1 convention).

## Coverage Status

**"14/14 green":**
- All H6 smokes pass (verified by `h6-all.sh`)
- H5 E2E deterministic spine coherent
- Firing layer (validators + route + injectors) verified offline
- Asset pipeline (fetch + classify + emit) verified offline

**What's NOT tested:**
- Live-HTTP bricks (fetch, funnel-assemble) are smoke-verified against cache fixtures only (live test in H3)
- Agent outputs (Section Analyzer, market classifier) are replaced by golden fixtures (agent logic not tested here)
- Marketing firewall (guard-marketing.js) is built but NOT wired into settings.json yet (staged for operator)

**Re-Verify Command:**
```bash
# Complete regression check (same command the closeout RESOLVE step runs)
bash engine/contracts/h6-all.sh

# Print summary: "H6-ALL: 14 passed / 0 failed — ENGINE SMOKES ALL GREEN ✓"
# Exit 0 if all pass; exit 1 if any fail
```

---

*Testing analysis: 2026-06-26*
