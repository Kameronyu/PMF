---
status: authoritative
role: Implementer runbook — how to one-shot the runnable SHELL (orchestrator, artifact store, per-step manifests, prompt stubs) so prompts and field-level I/O drop in later. Mechanism, not marketing.
read-with:
  - architecture/PART0--pipeline-flow.md
  - architecture/PART3--architecture-design.md   # §8 orchestration, §9 seams, §6 cards
  - standards/SPEC-marketing-soundness.md
  - STATE-OF-PROJECT.md
supersedes: []
---

> **What this is:** the build procedure for the *shell* — the deterministic plumbing that runs the pipeline end-to-end with empty prompt slots. **Read by:** the implementer (human or an autonomous one-shot workflow) that builds the project skeleton. **Goal:** a system that runs e2e correctly today, where the only thing not-yet-good is the marketing content you drop in later.

# SHELL BUILD SPEC — one-shot the skeleton, fill the prompts later

## 0. Precedence (rule #1, applies to everything here)

`standards/` → **build-base architecture (`PART0`/`PART3`/`PART1`)** → the built `bet-compiler` SKILL → **as-ran repo = reference only.** When the as-ran (old prompts) and the architecture disagree about what a step produces or consumes, **the architecture wins.** Use the as-ran for field-name *vocabulary*, proof a computation is *achievable*, and a record of past *failures* — never as the definition of a step's scope.

## 1. The core idea: separate the shell from the content

The pipeline has two layers. The **shell** is mechanism: an orchestrator, an artifact store, per-step I/O contracts, validation, operator gates. The **content** is the marketing judgment inside each prompt, plus the exact field schemas at each seam. The shell is deterministic and **buildable now**; the content is deferred. The architecture already models this split — `PART3 §6.1` calls the Bet Compiler a "D4 **shell**; ○ **content** = Job 1." This spec generalizes that to all 11 steps.

## 2. The load-bearing principle: wire at the ARTIFACT grain, not the PROMPT grain

You do **not** need to know how each step divides into prompts to build the shell. The only thing that must be deterministic is the **inter-step artifact flow** — which files a step reads and writes. Everything inside a step is a black box.

- A step **reads** its declared input artifacts from `runs/<space>/`, **writes** its declared output artifacts, and the orchestrator sequences steps by those declarations.
- Whether a step is **one prompt or four named agents** (e.g. Step 1 = Finder/Slop/Coverage/Dumper) is an *internal* detail. Start each step as **one prompt slot**; split it into the named agents later (that's PART2 **Job 6**, and `PART3 §4.3` marks the splits as recommended-and-vetoable) — **without touching any inter-step wiring.**
- Therefore "I don't know the prompt division yet" blocks nothing. The manifest's `prompt` field can point to 1 or N prompts; the step's *external* artifact contract is unchanged either way.

This is also why the R1/R2 reorder is cheap: step order is **data** (a `pipeline.yaml` list), not code. Reordering steps is a config edit, not a rebuild.

## 3. What "the shell" is — six components, each already specified

| Component | What it is | Authoritative source |
|---|---|---|
| **Artifact store** | `runs/<space>/` tree with one declared file per inter-step artifact | as-ran `runs/<space>/` layout (copyable); seam list `PART3 §9` |
| **Run-controller** | `run <step> --space=<s>`; the 7-phase loop | `PART3 §8` (verbatim spec) |
| **Step manifests** | one declarative file per step: reads / writes / scripts / prompt / validator / gate | derived from `PART0` + `PART3 §5.2` + `§4.1` |
| **Prompt stubs** | one prompt file per step (or per agent once split), standard envelope | template = `skills/bet-compiler/SKILL.md` |
| **Validators** | per-step blocking check, orchestrator-run with a receipt | `PART3 §8 step 5`, P3, P8 |
| **Operator gates** | runner blocks on a sign-off artifact; "deferred" is logged, never silent | `PART3 §8 step 7`, P9 |

**Most of these components already exist as raw material in `build-base/engine/`** — `bricks/` (fetch + process scripts), `hooks/` (validators + DR-injectors), `integrations/` (Shopify/Cloudflare/Klaviyo deploy), and `contracts/schemas/` are written; what's missing is the *ordering* into a run-controller + `pipeline.yaml`. **Reuse the bricks — don't rewrite the glue.**

The run-controller is the heart, and `PART3 §8` already writes it out: **1 Preflight** (input contracts checked, missing → named refusal) → **2 Plan-print** (the step's DAG declared before running) → **3 Context-assembly** (a script embeds the digest + corpus bytes; the agent never Reads shared state) → **4 Spawn** (agent waves ≤5) → **5 Validate** (blocking script; reject → bounded re-spawn ≤2 → escalate) → **6 Store + receipt** (no-overwrite versioning; receipt = inputs hash + validator verdicts + ledger entry) → **7 Operator gates**. Determinism comes from scripts, validators, receipts, and refuse-gates around every agent call — not from trusting the orchestrator.

## 4. Artifact store layout

One file (or folder) per inter-step artifact, under `runs/<space>/`. This list is the `PART3 §9` seam set rendered as paths; field *contents* are deferred to the seam-map (Job 5). Representative slots:

```
runs/<space>/
  bet-brief.md                      # Step 0  (+ product-intake.md)
  asset-classify/CLAIM-LIST.json    # Step 0  ← decided this session; consumed by Step 9
  queries_run.json  brands.json  dumps/        # Step 1
  funnels/<id>.json  funnel-store/  _tally.json  ad-volume-aggregate.json   # Step 2
  space-map.json                    # Step 3
  voc/market-signal/<cell>.json  gap_candidates.json                        # Step 4
  market-selection.json  ntp-pick.json (operator)                           # Step 5
  voc-bank/  awareness-read.json    # Step 6 (+ Step 7 reconciler)
  funnel-brief.md  audit-verdicts.json                                      # Step 7
  copy/  chief-verdicts.json        # Step 8
  asset-records.json                # Step 9
  review/                           # Step 10
  _receipts/                        # run ledger (every spawn: inputs hash, validator verdicts)
```

Copy the `runs/<space>/` *convention* from the as-ran repo (de-risked); **assign new R1 artifacts their own paths** (they have no as-ran equivalent), and give per-cell fan-out outputs a disambiguating filename rule (e.g. `voc/market-signal/<niche>__<transformation>.json`).

## 5. Step manifest (the wiring, as data)

One per step. The orchestrator reads these to sequence, route, and validate. Example (Step 2):

```yaml
id: 02-funnel-analysis
reads:
  - runs/{space}/brands.json
  - runs/{space}/dumps/
writes:
  - runs/{space}/funnels/                 # per-funnel analyzed records
  - runs/{space}/ad-volume-aggregate.json
scripts:
  pre:  [funnel-assemble.js]              # ad→LP→PDP, link-path verified, same-brand (A41)
  post: [ad-volume-rollup.js]             # deterministic group-by transformation × angle
prompt: prompts/02-funnel-analysis.md     # ONE slot now; may later become assemble+router+section-analyzer
agents: 1                                 # bump when the prompt is split (Job 6) — wiring unchanged
validator: validators/02.js               # presence + top-level shape now; field-continuity later
gate: false                               # no operator sign-off at this step
```

`pipeline.yaml` just lists the step ids in R1 order; `run all --space=<s>` walks it. Reordering = edit this list.

## 6. Prompt stub envelope (drop-in slot)

Every prompt file — stub or real — carries the same envelope, modeled on `bet-compiler/SKILL.md`. The envelope (frontmatter + contract sections) is part of the **shell**; only the BODY is **content** you fill later.

```markdown
---
step: 02-funnel-analysis
reads:  [brands.json, dumps/]
writes: [funnels/, ad-volume-aggregate.json]
status: STUB            # STUB | DRAFT | REAL
---
# ROLE — <one decision sentence; no undefined abstract noun>
# INPUTS (refuse if missing — P3) — <named inputs + grain>
# OUTPUT CONTRACT — funnels/<id>.json: { funnel_id, transformation, niche, claim_type,
#   awareness_entry, validation_lane, angle(raw), ... }   # field names provisional until Job 5
# COMPLETENESS (machine-checkable) — every kept brand has ≥1 funnel record; every record carries the OUTPUT CONTRACT keys
# HOW IT'S CONSUMED — Space Map (Step 3) keys on transformation/niche/claim_type/awareness_entry; rollup groups by angle
# BODY
<<< PROMPT CONTENT — operator fills later. In STUB mode the step emits a minimal valid-shaped artifact. >>>
```

The envelope's `reads`/`writes` must match the manifest, and `OUTPUT CONTRACT` is what the validator checks. Because the contract is declared even while the body is empty, the validator can pass/fail a stub's output the same way it will judge the real one.

## 7. Validation policy: presence now, congruence later

Validators are **loose now, tightened later**, so the shell runs before the seam-map exists:

- **Now (shell):** validator checks the output artifact *exists* and has the declared **top-level keys** (the `OUTPUT CONTRACT` shape). Missing/empty load-bearing field → refuse (P3), never improvise.
- **Later (Job 5 / WB1):** when the seam field-map is written, add **field-continuity** checks to the same validators — every emitted field has a consumer, every consumed field has a producer at the matching grain (this is `OPEN-DECISIONS A2` / `contract-congruence`). No rewiring; you're tightening existing gates.

## 8. The acceptance test: mock-mode e2e smoke run

This is how you *prove the shell is built* without any real prompt. Give each stub a **mock emit**: in `status: STUB`, the step writes a minimal artifact whose top-level keys match its `OUTPUT CONTRACT` (hardcoded sample values are fine). Then:

```
run all --space=smoke
```

must complete end-to-end: every step's preflight passes, every validator passes, every artifact lands in `runs/smoke/`, operator gates block-and-log (auto-approve in smoke mode), and `_receipts/` shows an unbroken chain. **If `run all` completes on stubs, the wiring is correct** — no orphan outputs, no dangling inputs, no routing ambiguity — *independent of marketing quality*. That is exactly the property you wanted. Then swap real prompts in one step at a time; each swap is validated against the same contract, so a bad prompt can't silently break a downstream consumer.

## 9. Build order for the shell (the one-shot sequence)

1. **Scaffold** `runs/<space>/` + the artifact-slot list (§4) + an empty `<space>` for smoke tests.
2. **Build the run-controller** (`PART3 §8`'s 7 phases) + the `pipeline.yaml` step list + the manifest loader.
3. **Author the 11 step manifests** (§5) from `PART0` + `PART3 §5.2`/`§4.1`. This is the deterministic wiring.
4. **Drop in 11 prompt stubs** (§6) with mock emits.
5. **Run `run all --space=smoke`** and fix until it completes clean (§8). ← *shell done.*
6. **Hand to the operator:** real prompts + field schemas drop into slots, step by step, in `PART2` order — no shell changes required.

## 10. What is deferred, and to whom

- **Prompt bodies (the marketing):** the operator / `PART2 Job 7`, step by step.
- **Field-level seam schemas:** `PART2 Job 5` / the seam field-map / `OPEN-DECISIONS A2`. Tightens validators; no rewiring.
- **Prompt-division (1 vs N agents per step):** `PART2 Job 6` (`PART3 §4.3` splits, vetoable). Changes a step's internal plan only.
- **Marketing truth & thresholds:** `Jobs 2–4` + `OPEN-DECISIONS` (tests, currency model, whitespace-vs-scary, claim-typing taxonomy, pricing-anchor slot C1).

## 11. Definition of done (the shell)

`run all --space=smoke` completes end-to-end on stub prompts with: all preflights green, all validators green on declared top-level shapes, every artifact slot written under `runs/smoke/`, every operator gate logged, an unbroken `_receipts/` chain, and **zero orphan outputs / dangling inputs** across the manifests. At that point the project is a fully-wired shell: prompts and field schemas are pure drop-ins, and the only thing standing between you and a real run is the content — exactly as intended.

*Add this doc + `STATE-OF-PROJECT.md` to `INDEX.md`'s manifest when filing them.*
