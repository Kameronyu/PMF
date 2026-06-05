---
name: pipeline-audit
description: >-
  ADVERSARIAL SOUNDNESS-AUDIT ORCHESTRATOR. Runs a two-reviewer cold audit of one completed product
  run's marketing pipeline. For each reviewer it (a) fans out Sonnet DR-scouts that return the WHOLE
  knowledge-base law files that reviewer needs (A hunts rule-theory; B hunts proven-vs-asserted),
  (b) resolves the FIXED evidence list to real on-disk paths via audit-resolve.js (script, not an
  artifact-scout), (c) for Reviewer B strips justification from scored/verdict outputs via a
  strip-for-b agent, (d) deterministically assembles each reviewer's cold context (LAW + EVIDENCE +
  no-search prohibition) via audit-inject.js and EMBEDS those bytes in the spawn prompt — hooks do
  not fire in subagents, so injection is the orchestrator's script step, (e) spawns Opus Reviewer A
  three times (collection/market/funnel) and Opus Reviewer B once over the four-output chain, each
  receipt-verified against the inject manifest. Diagnosis only — no fixes. Runs AFTER a product run
  has produced space-map.json + market-selection + the funnel deep-pass store + the architected
  funnel. Both reviewers' reports are kept separate — an A/B conflict is signal, not a contradiction.
---

> CANONICAL DESIGN LIVES IN THIS DIR. The full audit rationale is in `AUDIT-ORCHESTRATION.md`; the
> scout contract is in `SCOUT-SPEC.md`; the fixed evidence list + B law-denylist + strip flags are
> in `evidence-manifest.json`; the eight agent prompts are in `prompts/`. This SKILL.md is the
> orchestration layer only — it does not restate the prompts or the evidence list. Edit those files,
> not copies.

# Pipeline Audit — adversarial soundness review (orchestration)

## What this is

You are the **orchestrator** running in the main loop. You run a two-reviewer adversarial audit of
ONE completed product run (Arduview is the first). The audit answers two complementary questions:

- **Is the argument valid?** Does the chain earn "this product wins in this market," or is there a
  join where it behaved as if the evidence supported the conclusion without it doing so?
  → **Reviewer A** (prompt-reading, Opus, runs per segment).
- **Are the premises real?** Ignoring every justification, does each output's claims trace to a real
  datum in the output before it, and did the load-bearing threads survive each handoff?
  → **Reviewer B** (prompt-blind, Opus, runs once over the chain).

The judgment calls are: four Sonnet DR-scouts (one file-selection judgment each), one Sonnet
strip agent per B scored/verdict output, and the reviewers themselves — Reviewer A ×3 + Reviewer B
×1 (Opus). Everything between the judgments is a deterministic script. Reviewers are
**diagnosis-only**: state what is sound/grounded and what is not, mark each unsound finding fatal or
degrading, and stop. No fixes.

## Chain position

```
(a completed product run: space-map.json + market-selection + funnels store + FUNNEL-DESIGN/COPY-DRAFT)
  → /pipeline-audit   ← YOU ARE HERE   (read-only; produces diagnosis reports, touches no pipeline output)
```

**Precondition:** the run's four outputs must already exist on disk. This skill never re-runs the
pipeline and never edits a pipeline artifact — it only reads them (via the scripts) and writes
diagnosis reports + B's stripped copies under `runs/<space>/_audit/`.

---

## ENFORCEMENT MAP — deterministic (enforced) vs judgment (model call)

| Step | Kind | Mechanism | What enforces it |
|------|------|-----------|-----------------|
| DR scouts (A-collection / A-market / A-funnel / B) | **JUDGMENT** | **agent (Sonnet)** | one file-selection judgment each; return whole KB law paths + a one-line note per file |
| audit-resolve.js | DETERMINISTIC | script | fixed evidence list → verified on-disk paths; glob expansion; **exit 1 on any required missing** (→ CANNOT ASSESS) |
| strip-for-b (B only) | **JUDGMENT** | **agent (Sonnet)** | keep-verdict / drop-because transform of B's scored & verdict outputs |
| validate-strip.js | DETERMINISTIC | script | gates each stripped copy: exists + non-empty + **strictly smaller than original** (no verbatim no-op) + must/must-not-contain tokens; **exit 1 → orchestrator re-spawns strip-for-b** |
| audit-inject.js | DETERMINISTIC | script | assembles cold context (LAW + EVIDENCE + prohibition); **exit 2 on any empty/missing file**; **B law-denylist filter**; **B strip-routing guard** (refuses any unstripped strip:true doc, and any missing stripped copy); emits the verification manifest |
| **Reviewer A ×3** | **JUDGMENT** | **agent (Opus)** | prompt-reading prosecution, one per segment; receipt-checked |
| **Reviewer B ×1** | **JUDGMENT** | **agent (Opus)** | prompt-blind grounding/thread audit over the chain; receipt-checked |
| validate-receipt.js | DETERMINISTIC | script | compares each reviewer's CONTEXT RECEIPT line to the inject manifest (counts + basename sets); **exit 1/2 → re-spawn the reviewer** (not an eyeball check) |

**Four load-bearing truths:**

1. **Reviewers run COLD and NEVER Read.** Injection is the orchestrator's SCRIPT step
   (`audit-inject.js`) — hooks do not fire inside subagents (the funnel-deep-pass precedent). Each
   reviewer receives the bytes between explicit boundaries; no trust required.
2. **The evidence list is FIXED, never free-discovered.** `audit-resolve.js` only confirms reality
   matches `evidence-manifest.json`. This is what closes the search-everywhere hole the no-search
   prohibition exists to protect.
3. **A and B answer different questions — never merge or reconcile the five reports.** An A/B
   conflict (A: reasoning sound / B: premise naked) is itself signal.
4. **B is hard-blind to rule-theory.** `differentiator-framework*`, `angle.md`, `definitions.md` are
   refused for B by `audit-inject.js` (deterministic denylist) even if a scout slips one in. A gets
   them; B never does.

---

## PRECONDITION CHECK (run once before starting)

```bash
SPACE=arduview

# 1. KB present with all four authors (scouts dig it; abort if the corpus is partial)
for a in carl-weische spencer-origins mark-builds-brands alex-hormozi; do
  ls ~/knowledge/dr-marketing/*--$a.md >/dev/null 2>&1 || { echo "KB INCOMPLETE: no files for author $a"; exit 1; }
done

# 2. Every required prompt + evidence artifact resolves for every segment (exit 1 = CANNOT ASSESS condition)
for seg in A-collection A-market A-funnel B; do
  node tools/audit-resolve.js --segment=$seg >/dev/null || { echo "RESOLVE FAILED for $seg — see required-missing above"; exit 1; }
done
echo "precondition OK — KB complete, all required evidence present"
```

If anything is missing, STOP and tell the operator exactly what. A segment whose required evidence
is absent is run as CANNOT ASSESS, not skipped silently.

---

## RUN ORDER

### 1. Spawn the four DR-scouts (Sonnet, in parallel)
Each scout's prompt = `prompts/scout-orientation.md` + its segment file
(`prompts/scout-a-collection.md`, `-a-market.md`, `-a-funnel.md`, `prompts/scout-b.md`). Each returns
a list of whole KB law-file paths + a one-line note per file. Collect them as `law_<segment>`.
The scouts are the ONLY place law files are chosen — do not hand-pick.

### 2. Resolve evidence (script, per segment)
```bash
mkdir -p runs/<space>/_audit
for seg in A-collection A-market A-funnel B; do
  node tools/audit-resolve.js --segment=$seg > runs/<space>/_audit/resolve-$seg.json
done
```
Read each segment's resolved JSON (`prompts[]`, `evidence[].files[]`, `strip` flags, `missing[]`,
`optional_missing[]`). A `missing[]` entry → that segment's reviewer returns CANNOT ASSESS for the
affected point; note it, do not abort the other segments. `optional_missing[]` items are simply
skipped — not a blocker.

### 3. Strip for B (Sonnet agent — B evidence only)
For each B evidence item with `strip: true` (`market-selection`, `funnels-scored/*`,
`angle-validation-audit`, `funnel-design`), spawn one `prompts/strip-for-b.md` agent per file. If the
manifest item carries a `strip_note`, pass it to the agent (it refines the generic keep/drop for that
file — e.g. the ANGLE doc keeps the table + figures, drops verdicts/recommendation/caveat prose).
Write each stripped copy to `runs/<space>/_audit/b-stripped/<basename>`. `strip: false` items
(`space-map`, `belief-records`, `copy-draft`) pass through unmodified. (Order is independent per
file — fan out.)

**Gate every stripped copy before trusting it (deterministic — do NOT skip):**
```bash
node tools/validate-strip.js \
  --original=runs/<space>/<original-path> \
  --stripped=runs/<space>/_audit/b-stripped/<basename> \
  [--must-not-contain="<manifest strip item's must_not_contain>"] \
  [--must-contain="..."]
```
Exit 0 = accept. **Exit 1 = re-spawn the strip-for-b agent for that file** (it was a no-op, empty, or
leaked a forbidden phrase) — do not proceed with a bad strip. This is the output check that makes the
strip a guaranteed step, not an honor-system one. The `must_not_contain` / `must_contain` come from
the manifest item (e.g. the ANGLE doc forbids `"safest bet"` and `"what got lost"`).

### 4. Assemble each reviewer's cold context (script)
Hooks do not fire in subagents — this is YOUR step. Build the `--law` and `--evidence` lists, then
embed the script's stdout directly in the reviewer spawn.

- **Reviewer A, per segment** — LAW = `law_<segment>` + `definitions.md` (A always gets the
  vocabulary). EVIDENCE = that segment's resolved **prompt(s)** + **artifact files** (A prosecutes
  the prompt, so the prompt is evidence):
  ```bash
  node tools/audit-inject.js --reviewer=A-collection \
    --law="<law_A-collection>,definitions.md" \
    --evidence="<resolved prompts + evidence files for A-collection>" \
    --out=runs/<space>/_audit/ctx/A-collection.txt
  ```
  (repeat for `A-market`, `A-funnel`.)

- **Reviewer B** — LAW = `law_B` (the denylist auto-filters rule-theory). EVIDENCE = the four outputs
  in **seq order**, using the **stripped** path for `strip:true` items and the original for the rest;
  **no prompts**:
  ```bash
  node tools/audit-inject.js --reviewer=B \
    --law="<law_B>" \
    --evidence="space-map.json, _audit/b-stripped/market-selection.md, *-beliefs.json, _audit/b-stripped/*-scored.json, _audit/b-stripped/FUNNEL-DESIGN.md, COPY-DRAFT.md" \
    --out=runs/<space>/_audit/ctx/B.txt
  ```
  `audit-inject.js` writes `<out>.manifest.json` next to each context — that is the receipt-check
  source of truth. It exits 2 if any named file is empty/missing (no reviewer spawns on a thin set).

### 5. Run Reviewer A (Opus) ×3 — one per segment, fresh cold context
Spawn prompt = `prompts/reviewer-a.md` with the matching `ctx/A-<segment>.txt` block appended where
the prompt says the injected block goes. Use a quality (Opus) model. Each segment is an independent
fresh context — do not carry one segment's findings into another.

### 6. Run Reviewer B (Opus) ×1 — over the four-output chain, fresh cold context
Spawn prompt = `prompts/reviewer-b.md` with `ctx/B.txt` appended. Opus model, single run.

### 7. Receipt check (deterministic SCRIPT — after each reviewer returns)
Do NOT eyeball the receipt. Run the gate:
```bash
node tools/validate-receipt.js \
  --manifest=runs/<space>/_audit/ctx/<reviewer>.txt.manifest.json \
  --output=runs/<space>/_audit/<reviewer>.md
```
Exit 0 = the reviewer's `CONTEXT RECEIPT` matches what was injected (counts + basename sets). **Exit
1 (mismatch) or 2 (no/garbled receipt) → discard the review and re-spawn** — the bytes did not all
land. Only a receipt-passing review is accepted. Save accepted reports to
`runs/<space>/_audit/A-collection.md`, `A-market.md`, `A-funnel.md`, `B.md`.

### 8. Collect — do NOT merge
Five diagnosis reports land under `runs/<space>/_audit/`. Present them as-is. Do not reconcile A
against B; a conflict between them is the audit's most valuable output, not an error to resolve.

---

## Reviewer law-access rules (load-bearing — enforced, not honor-system)

- **A gets `definitions.md`** plus its scouted rule-theory. A prosecutes reasoning; the vocabulary +
  frameworks are its ruler.
- **B is denied `differentiator-framework*`, `angle.md`, `definitions.md`** — filtered by
  `audit-inject.js` (`b_law_denylist` in the manifest) and recorded in the inject manifest's
  `denied[]`. If B's `denied[]` is non-empty, that is expected when a scout over-returned; it is not
  an error.

## AGENT PROMPTS — where they live

All eight live in `prompts/` (not folded here, to keep this orchestration layer scannable):
`scout-orientation.md` (shared) + `scout-a-collection.md` / `scout-a-market.md` / `scout-a-funnel.md`
/ `scout-b.md` + `strip-for-b.md` + `reviewer-a.md` + `reviewer-b.md`. Spawn them verbatim; for
reviewers, append the matching `audit-inject.js` block.

## Outputs

Everything the audit writes is under `runs/<space>/_audit/` — `ctx/` (assembled contexts +
manifests), `b-stripped/` (B's justification-free copies), and the five `*.md` diagnosis reports. No
pipeline artifact is ever modified.
