# 05-XVERIFY-FIX — closing the three gaps the xhigh adversarial verify found

The Phase-5 build was verified **genuinely sound** (validators truly execute, reject, and gate;
`run all --space=smoke --smoke` legitimately green). The verify found three real gaps where a
validator/harness was weaker than its stated intent. Each is closed below **without weakening any
verified-correct behavior**. No manifest `reads`/`writes`/`gate`/`prompt` and no stub-emit contract
was changed.

Files touched (all WIRING — extend/strengthen proven brick cores, no wholesale rewrite):
- `engine/hooks/validate-shape.js` — Fix 3 (`__MD__` placeholder/trivial-body refusal).
- `engine/bricks/run-controller.js` — Fix 2 (preflight reuses validate-shape on each `reads[]`).
- `engine/contracts/validate-smoke.sh` — Fix 1 (new generic + controller-escalation pins).
- `engine/contracts/controller-smoke.sh` — fixture seeds a REAL `bet-brief.md` (see Fix 2 note).

---

## Fix 1 (MEDIUM) — pin validate-shape's generic shape gate with a RED test

**Finding.** `validate-shape.js` L134 (missing-top-level-key REJECT) is the SOLE shape gate for the
generic outputs of 7 of 11 steps (04–10). But `validate-smoke.sh`'s only generic missing-key
mutation tested `brands.json`, which is ALSO covered by `validate-finder.js` — so gutting L134 to a
no-op would leave the gate GREEN (finder still rejects). The regression net had a hole over the
generic path.

**Fix (harness, no engine change).** Added to `validate-smoke.sh`:
- **MUTATION (a) tightened** — now asserts `validate-shape`'s exact `OUTPUT-CONTRACT key` wording on
  `brands.json` via `validate-shape.js` directly, so it pins validate-shape (not finder).
- **MUTATION (a2)** — DEFINITIVE PIN: drives a GENERIC non-brands output
  (`market-selection.json`, a step-05 output with NO deep validator) with a renamed top-level key
  through `validate-shape.js` AND through `route.js`'s else-branch, asserting
  `market-selection.json output missing top-level OUTPUT-CONTRACT key(s): [ranked]` — a line ONLY
  L134 can emit.
- **MUTATION (a3)** — CONTROLLER-ESCALATION pin: a temp manifest-dir copy whose `05` manifest
  Mode-A `stub_emit`s a wrong-key `market-selection.json`; walk 00–04 cleanly, then run the mutated
  05 through the controller → Validate phase REJECTs → re-spawn → **ESCALATE**, and asserts
  **0 receipts** minted for step 05 (gate held, no false success).

**RED-first proof.** A disposable co-located copy `engine/hooks/_validate-shape-noop.js` with L134
forced to `missing = []`:
- generic `{"renamed_ranked":[]}` market-selection.json → **exit 0 (hole open)** against the gutted
  copy → MUTATION (a2)/(a3) RED-fail, as intended.
- the REAL (un-gutted) `validate-shape.js` → **exit 2 REJECT** → GREEN.

This proves the new pins can ONLY be satisfied by validate-shape's L134, closing the net hole.

---

## Fix 2 (LOW) — VALID-02 preflight `isHollowInput` was weaker than its intent

**Finding.** `isHollowInput` was top-level-only: it PROCEEDED (exit 0, minted a receipt) on
genuinely-hollow load-bearing inputs — `[{}]`, `{winner:null}` (sole load-bearing key null),
`{data:{}}` (nested-empty / wrong-key), and trivial junk `.md` (a 1-char body). VALID-02 requires
"refuse empty/non-null-CONTENT load-bearing input."

**Fix (preferred clean path — REUSE the validator).** A `reads[]` input IS some upstream step's
output, so it must satisfy the SAME `output-shapes.json` contract. Preflight now calls
`validate-shape.js` as a subprocess on every `reads[]` input (`inputShapeViolation(p)`); a
hollow/wrong-shaped input is refused symmetrically at the INPUT seam with the VALID-02 preflight
exit code (3). No parallel hollow logic — the input seam refuses exactly what the output seam
refuses. (The old `isHollowInput` function was replaced, not duplicated.)

**No false-positives (HARD CONSTRAINT verified).** All **17 distinct `reads[]` basenames** across
the 11 manifests pass preflight on the real stub emits; `run all --smoke` stays green (11 receipts,
all verdicts pass). Minimal-but-real inputs (`{claims:[]}`, `{records:[]}`, a real `ntp-pick.json`,
the real multi-line stub `.md`) still pass (required top-level key present ⇒ shape OK). Step 0's
empty `reads[]` is unaffected.

**Mutation results (each refused by name, exit 3):**
- `brands.json = [{}]` → `REFUSE … bare array … contract expects an object with top-level keys [brands]`
- `brands.json = {"data":{}}` → `REFUSE … missing top-level OUTPUT-CONTRACT key(s): [brands]`
- `ntp-pick.json = {"winner":null}` → `REFUSE … missing top-level OUTPUT-CONTRACT key(s): [pick]`
- `ntp-pick.json = {}` → `REFUSE … empty/scaffold-seed object {}`
- `bet-brief.md = "# bet-brief\n"` (placeholder) → `REFUSE … raw store-scaffold placeholder heading`
- `bet-brief.md = "x"` (1-char junk) → `REFUSE … single trivial line "x" with no body`

---

## Fix 3 (LOW) — VALID-01 `__MD__` overclaim

**Finding.** The `__MD__` branch only rejected empty/whitespace, but its docstring claimed it also
rejects the "scaffold-placeholder."

**Fix (implement the claim, maximalist-clean).** `store-scaffold.js` L151 seeds each `.md` slot with
the literal `# <basename>\n` (a lone lowercase-kebab heading, no body). A real markdown artifact has
a heading AND a body — the three real stub emits carry 5–24 non-empty lines (179–691 chars). The
`__MD__` branch now refuses a `.md` whose entire content is a **single non-empty line** (no body),
naming the scaffold-heading case explicitly (`/^#\s+[a-z0-9._/-]+$/`) and otherwise reporting a
"single trivial line." This subsumes the precise scaffold-pattern AND closes the 1-char-junk `.md`
miss — a single non-arbitrary rule, not a length heuristic.

**Verified.** Real stub `.md` emits (`bet-brief.md`, `product-intake.md`, `funnel-brief.md`) all
PASS. Raw scaffold headings and 1-char junk both REJECT (exit 2). The top-of-file docstring was
updated to match.

---

## Collateral fixture fix (not a weakening)

`controller-smoke.sh` previously scaffolded a space and ran a fixture step directly against the bare
scaffold `bet-brief.md` placeholder. Fix 2's strengthened preflight now correctly REFUSES that
placeholder as hollow. The fixture's intent is "a present, REAL load-bearing input," so a new
`scaffold_space()` helper seeds a real multi-line `bet-brief.md` after scaffolding; all 11
scaffold-then-run sites use it. CTRL-03 (missing-input) still deletes the input afterward and refuses
correctly. This pins the fixture to real content — it does NOT weaken the seam (the seam still
refuses the placeholder everywhere else, which Fix 2/3's own mutation tests prove).

---

## Acceptance + gates (all captured exit 0)

- `bin/run all --space=<fresh> --smoke` → exit 0, **11 receipts**, every `validator_verdicts` = pass,
  no false-positive on real inputs. (`node bin/run …` in the brief is a typo — `bin/run` is a bash
  shim; the canonical smoke run is `bin/run … --smoke` / the controller directly. Running WITHOUT
  `--smoke` blocks at the first gated step — pre-existing, unchanged behavior.)
- Cross-space determinism: 20 emitted artifacts byte-identical across two fresh runs.

| Gate | Exit |
|------|------|
| store-smoke      | 0 |
| controller-smoke | 0 |
| manifest-smoke   | 0 |
| stub-smoke       | 0 |
| validate-smoke   | 0 |
| h6-all           | 0 |

All disposable spaces (`runs/_vfy*`, `runs/_ctrlsmoke*`, temp manifest dirs) are rm -rf'd; the
committed `runs/smoke/` acceptance space is byte-identical to HEAD (no accidental mutation). No
verified-correct behavior was weakened; manifests' reads/writes/gate/prompt + stub-emit contracts
are UNCHANGED.
