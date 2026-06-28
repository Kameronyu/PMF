# 03 — XVERIFY-FIX: harden manifest-smoke MANIFEST-02 to an ordered, producer-bound graph check

## Finding (from the xhigh adversarial verification)

The live 11-manifest wiring is genuinely sound (zero orphans, zero dangling reads, exact
gate set {0,1,5,7,8,10}, controller-correct shapes). **No manifest was changed.**

The defect was ONLY in the acceptance harness `engine/contracts/manifest-smoke.sh`. Its
`MANIFEST-02` graph-integrity check was **producer-blind flat-set membership**: it unioned
all `writes` into one `Set` and all `reads` into another, then diffed the two sets. This
carried a confirmed `false_green_risk=true` — three classes of real defect a FUTURE re-wire
(Phases 4–6 add slots + real prompts) could introduce passed GREEN:

1. **Producer-blind TERMINAL allowlist** — a WRONG step emitting a path that string-matches
   a terminal slot was silently excused (terminals matched by path, not bound to the one
   step allowed to emit them). Proven: step3 writing `audit-verdicts.json` / `review/`
   passed GREEN even though those are Step7 / Step10 terminals.
2. **Write-write duplication** masked by the flat `Set` — two producers writing the same
   path dedup'd invisibly (a no-overwrite-v1 clobber hazard). Proven: step3 + step7 both
   writing `funnel-brief.md` passed GREEN.
3. **Order-blind dangling check** — a read satisfied only by a LATER step's write, or a
   step reading its own output (self-loop), passed. Proven: step3 reading later-produced
   `funnel-brief.md`, and step3 self-reading `space-map.json`, both passed GREEN.
4. (low-sev) **Directory-scan exactly-11** — the harness iterated a hardcoded `IDS` list,
   so a rogue/dup `engine/manifests/99-rogue.json` on disk passed GREEN.

## The fix

Rewrote the `MANIFEST-02` `node -e` block to compute the graph with **ordered, per-step,
producer-id-bound** semantics (the independent verifier's reference approach):

- Load all manifests in **pipeline order** (numeric id prefix == `pipeline.yaml` R1 walk).
- Build `producedBy[path] = [stepId,...]` and per-step `readsBy` / `writesBy`.
- **WRITE-WRITE** (closes #2): FAIL on any path produced by >1 step.
- **DANGLING / BACK-EDGE / SELF-LOOP** (closes #3): every read must have a
  **strictly-earlier** producer (by pipeline position); a read produced only by the same
  step (self) or only by a later step (back-edge) FAILs. Reads with no producer at all are
  allowed only if bound to the exact step in a `PIPELINE_ENTRY` allowlist (currently empty —
  Step 0 has empty reads; operator-asset bytes are not a declared slot).
- **ORPHAN / WRONG-PRODUCER** (closes #1): the `TERMINAL` allowlist became a
  `slot -> owning-step-id` map. A write must be consumed by a **strictly-later** step OR be
  a TERMINAL bound to **the exact emitting step**. A terminal-matching path emitted by the
  wrong step FAILs with a named `WRONG-PRODUCER` assertion.
  Terminal ownership map:
  `queries_run.json`,`dumps/` -> `01-collect`; `audit-verdicts.json` -> `07-funnel-architect`;
  `review/_review.json`,`review/` -> `10-adversarial-re-review`.
- Directory slots (path ends `/`) are consumed when a strictly-later step reads a path
  under them, and satisfy a downstream read when an earlier step produces the parent dir.

Added **MANIFEST-02b** (closes #4): directory-scans `engine/manifests/*.json` and asserts
the on-disk id set is **exactly** the canonical 11 — a rogue or duplicate file FAILs.

No other harness section changed; idiom preserved (`set -u`, `ok`/`bad`, accumulate-then-
report, named FAIL lines, final `ALL ASSERTS PASS`).

## Mutation proof (disposable copy under `runs/_vfy_fix`, since `rm -rf`'d)

Each injected defect now RED-fails with a NAMED assertion; clean restore returns GREEN.

| # | injected defect | named RED line | exit |
|---|---|---|---|
| a | step3 emits `audit-verdicts.json` (owned by step7) | `MANIFEST-02 WRONG-PRODUCER terminal (slot owned by 07-funnel-architect): 03-space-map emits runs/SPACE/audit-verdicts.json` (also caught as WRITE-WRITE since step7 also emits it) | 1 |
| a' | isolated: only step3 emits `queries_run.json` (step1's removed) | `MANIFEST-02 WRONG-PRODUCER terminal (slot owned by 01-collect): 03-space-map emits runs/SPACE/queries_run.json` — fires independently of write-write | 1 |
| b | step3 + step7 both write `funnel-brief.md` | `MANIFEST-02 WRITE-WRITE (path written by multiple steps): runs/SPACE/funnel-brief.md <- [03-space-map,07-funnel-architect]` | 1 |
| c | step3 reads later-produced `funnel-brief.md` | `MANIFEST-02 BACK/SELF-EDGE read (no strictly-earlier producer): 03-space-map reads runs/SPACE/funnel-brief.md produced-by [07-funnel-architect]` | 1 |
| c2 | step3 self-reads its own `space-map.json` | `MANIFEST-02 BACK/SELF-EDGE read (no strictly-earlier producer): 03-space-map reads runs/SPACE/space-map.json produced-by [03-space-map]` | 1 |
| d | rogue `99-rogue.json` on disk | `MANIFEST-02b: on-disk set != canonical 11 (extra=[99-rogue] missing=[])` | 1 |
| — | restore to real 11 | `ALL ASSERTS PASS` | 0 |

(The mutation runs used a graph-only trimmed copy of the harness so the exit code reflected
graph asserts, not the scratch controller's unresolved `require`s; the named FAIL lines are
emitted by the unmodified MANIFEST-02 / 02b node blocks.)

## Gate results (real, unmodified 11 manifests)

```
store-smoke      exit=0
controller-smoke exit=0
h6-all           exit=0
manifest-smoke   exit=0
```

## Confirmation

NO manifest and NO `pipeline.yaml` was modified (`git status --porcelain engine/manifests/
pipeline.yaml` empty). Only `engine/contracts/manifest-smoke.sh` changed. All temp/scratch
under `runs/_vfy_fix` removed.
