# Audit Orchestration — adversarial soundness review of the marketing pipeline

The orchestrator runs a two-reviewer adversarial audit of one product run (the Arduview run is the
first). The audit answers two questions that together form a complete check:

- **Is the argument valid?** Given the data we chose to collect and the way each stage reasons —
  does the chain actually earn the conclusion "this product wins in this market," or is there a join
  where we behaved as if the evidence supported the conclusion without it actually doing so? →
  **Reviewer A (prompt-reading, Opus).**
- **Are the premises real?** Ignoring every justification we offer — does each output's claims trace
  to a real datum in the output before it, and did the load-bearing threads survive each handoff? →
  **Reviewer B (prompt-blind, Opus).**

A asks whether the reasoning is sound and composes. B asks whether the things the reasoning rests on
are actually there. A reads our prompts (our reasoning, written down) and prosecutes them. B never
sees a prompt, so it cannot be talked into anything by how well a prompt argues its own case.

Both reviewers are **diagnosis-only**: they state what is sound and what is not, mark each unsound
finding fatal or degrading, and stop. No fixes, no prescriptions.

---

## THE PIPELINE THE ORCHESTRATOR RUNS

```
[multiple Sonnet DR-scouts]  →  determine which DR files each reviewer-job needs (by content)
        ↓
[injection script]           →  inject the scouted DR files + the fixed evidence files into each
                                 reviewer's context; set the no-search prohibition
        ↓
[Sonnet artifact-scout]      →  resolve the fixed evidence list to the real files on disk
        ↓
[Opus Reviewer A]            →  prompt-reading argument-prosecutor (runs per segment)
[Opus Reviewer B]            →  prompt-blind grounding/thread reviewer (runs once over the chain)
```

Reviewers run COLD: fresh context, only the injected material, no access to this orchestration doc's
design discussion, no access to the conversation in which the pipeline was built, no operator
strategy notes beyond the prompts themselves.

---

## STAGE 1 — DR SCOUTS (multiple Sonnet agents) → see `SCOUT-SPEC.md`

The scouts find and return the whole DR files each reviewer needs. Full spec in `SCOUT-SPEC.md`. In
summary:

- Scouts orient via `claude.md` (it points to the KB), verify the KB has all four authors (Carl
  Weische, Spencer origins, Mark builds-brands, Alex Hormozi), read `MAP.md`, and read the
  decision-surface prompts (`04-space-classifier.md`, `05-market-selection-assessor.md`,
  `08-funnel-architect.md`, `08b-copywriter-STUB.md` — NOT the middleman/plumbing prompts).
- **A-scouts (3, by segment)** hunt RULE-THEORY — principles stating what sound reasoning *requires*
  (rulers, not tactics): collection, market, funnel.
- **B-scout (1)** hunts WHAT REAL BACKING LOOKS LIKE — the proven-vs-asserted distinction only.
- A-scouts and B-scout read the **same prompts**; they differ only in their **definition of "useful"**
  (what to look for). They return **whole files** — no picking files apart, no extraction. File lists
  may overlap between A and B; that's fine — reviewer discipline lives in the reviewer prompts, not in
  disjoint bundles.
- Scouts are told to be **liberal** — return generously; a reviewer can ignore a marginal file but
  cannot use a principle that was never returned.

Each scout returns a list of whole files + a one-line note per file of what principle/definition it
carries. The orchestrator passes these to the injection script.

---

## STAGE 2 — INJECTION SCRIPT + NO-SEARCH PROHIBITION

A script (not an agent) takes the scouts' file lists and the artifact-scout's resolved evidence list
and **injects the exact file contents into each reviewer's context window**. Reviewers do not Read,
fetch, or search for anything — everything they judge is already in context between explicit
boundaries.

Each reviewer's injected context is assembled as:

```
=== THE LAW (DR principles — the standard you prosecute against) ===
[scouted DR file contents, each under its filename header]

=== THE EVIDENCE (what you prosecute) ===
[the fixed evidence files for this reviewer — see STAGE 3]
```

**Hard prohibition, stated in every reviewer prompt:** You may use ONLY the material injected above.
You may not search the DR corpus, the project, the web, or the filesystem. You may not request more
files. If a judgment requires evidence not in context, your verdict for that point is CANNOT ASSESS —
name exactly what is missing. Reaching outside the injected context is a failure of the audit, not a
help.

---

## STAGE 3 — ARTIFACT SCOUT (one Sonnet) + THE FIXED EVIDENCE LIST

The evidence list is **fixed** — the artifact-scout does NOT roam the filesystem deciding what's
interesting. Its only job is to **resolve each item on the fixed list to the real file on disk** for
this run (find the actual space-map file, the actual deep-pass output, the actual architected-funnel
file), confirm it's the clean/latest version, and hand the paths to the injection script. Scoped
resolution of a known list — never free discovery. (Free discovery reopens the search-everywhere hole
the no-search prohibition exists to close.)

Two extra duties for the artifact-scout: (1) produce the **stripped B-copies** of any output carrying
scores/verdicts-with-rationale (see STRIP-FOR-B below). (2) If a required artifact exists only as a
chat transcript rather than a saved file — a known risk for the market decision and the architect
output — resolve to the transcript and flag it as transcript-sourced; the reviewer prosecutes the
transcript as the committed artifact. If a required artifact cannot be found at all, report it
missing so the reviewer returns CANNOT ASSESS for that segment rather than proceeding on a guess.

### Fixed evidence — Reviewer A (prompt-reading), per segment

A runs once per segment. Each segment gets the marketing-lens prompt(s) for its stage(s) PLUS the
input and output artifacts:

- **A / collection segment:** prompt = `04-space-classifier.md` (the light-pass judgment stage; the
  middleman extractor/cleaner prompts are excluded — they make no DR-answerable decision). input =
  product description + the pre-research plan (`arduview-pre-research-plan.md`) + raw brand dumps.
  output = `space-map.json` (the classified space — note: transformation, bet_type, etc. are SCORED
  in here, so the space-map already carries the classifier's judgments, not just raw observation).
- **A / market segment:** prompt = `05-market-selection-assessor.md`. input = `space-map.json` +
  run-context overrides. output = `market-selection.md` (the assessor's mechanical scoring + ranking +
  its reasoning — A reads this UNSTRIPPED).
- **A / funnel segment:** prompts = `06-router.md` + `07-section-analyzer.md` + `08-funnel-architect.md`
  + `08b-copywriter-STUB.md`. input = chosen NTP + run context + the cleaned funnel copy the Analyzer
  read + the funnel deep-pass output = `funnels-analyzer-out/` (the per-funnel belief records: each
  funnel classified into beliefs + how it executed them) + `funnels-scored/` (the mechanical funnel
  scoring). output = `funnel-design.md` (the architected funnel) AND `copy-draft.md` (the copy the
  architect wrote).

### Fixed evidence — Reviewer B (prompt-blind), whole chain at once

B gets NO prompts. It gets the four outputs in sequence and its DR backing-definition files (whole
files, from the B-scout):

1. `space-map.json` — the classified space (transformation, bet_type, etc. are scored in here; this
   is the classified-per-brand data the market decision was run on)
2. the market decision — `market-selection.md`, **STRIPPED** to mechanical scores + the assessor's
   ranking only, with all reasoning/justification removed (see STRIP-FOR-B)
3. the funnel deep-pass output — `funnels-analyzer-out/` (per-funnel belief records: each funnel's
   beliefs + execution) plus `funnels-scored/` (mechanical funnel scoring)
4. the architected funnel — `funnel-design.md` + the written copy `copy-draft.md`

B's grounding check is **output-against-prior-output**: the space-map is its floor (it does not get
the raw dumps), so it checks market-against-space-map, funnel-deep-pass-against-market-cell, and
architected-funnel-against-deep-pass. It does not audit the space-map's own grounding against raw
sources — that is A's collection segment.

### STRIP-FOR-B — remove justification from B's copy of each output

B prosecutes verdicts and claims as things-to-ground; it must NOT be handed the reasoning that
justifies them, or it grades the reasoning instead of checking the data (that is Reviewer A's job).
So the artifact-scout produces a **stripped copy of each output for B**: keep the conclusions, scores,
verdicts, ranks, and stated claims; delete every inline "because…", every prose rationale, every
gate-by-gate justification riding alongside a score. Keep the verdict, drop the because.

Concretely for the market decision (`market-selection.md`): keep "demand magnitude: high,
believability: Tier 2, passed Gate 1, survivor rank 2"; delete the sentences explaining why each grade
was assigned. The scoring is mechanical, so a bare score is a crisp, self-meaning claim B can check the
space-map against — which is exactly why the strip is safe AND necessary: the number means something on
its own, and the because is the part that would glaze B. Apply the same strip to any output that
carries scores or verdicts with attached rationale (`funnels-scored/`, and any stated rationale in
`funnel-design.md`).

A gets the UNSTRIPPED outputs — A must read the reasoning, because A prosecutes the reasoning. Only
B's copies are stripped.

---

## REVIEWER A — PROMPT-READING ARGUMENT-PROSECUTOR (Opus)

> You are a direct-response prosecutor. You are given THE LAW (DR principles) and THE EVIDENCE (one
> segment of a marketing pipeline: the prompt(s) that ran, the actual data in, the actual data out).
> The DR principles are the law. The pipeline segment is the defendant.
>
> **Central trap — read first.** The prompts you are given ARE the operator's reasoning written down.
> They argue for their own logic; they do not merely instruct. A well-argued prompt will talk you
> into agreeing its logic is sound BEFORE you have checked that logic against the law independently.
> You must not let the defendant hand you the ruler. The phases below are ordered specifically to
> defeat this. Follow the order.
>
> **Your goal is not to evaluate. Your goal is to disprove** — to mount the strongest case the law
> allows that this segment's reasoning is unsound, and then to report honestly how far that case got.
> You do not succeed by finding fault and you do not succeed by clearing the work. You succeed by
> prosecuting hard against a fixed external standard and reporting what survived. A move you could not
> break, say so plainly. A move you broke, you broke with a quoted law, not a vibe.
>
> ### PHASE 0 — DERIVE THE STANDARD FROM THE LAW (before reading any prompt)
> From THE LAW only, write down what sound DR reasoning REQUIRES for each load-bearing decision in
> this segment — the principle each decision must obey, quoted. Commit this in writing BEFORE you
> read the prompt's own argument for itself. This is your ruler. You formed it from the law, not from
> the defendant.
>
> ### PHASE 1 — BREAK EACH PROMPT (local prosecution, stage by stage)
> Now read the prompt(s). Treat every argument a prompt makes for its own logic as a CLAIM TO
> PROSECUTE, not a premise to adopt. For each load-bearing decision:
> - Hunt THE LAW for the principle it might violate. Default to suspicion — you must hunt before you
>   may clear.
> - Resolve each decision as **VIOLATION** (quote the law broken or the missing datum; show the
>   break; mark fatal if the decision collapses when this is false, degrading if it only weakens),
>   **SURVIVED** (hunted, found no violating principle; state the law it conforms to and the datum
>   that licenses it — survival is earned by a shown hunt, never assumed), or **CANNOT ASSESS** (the
>   evidence isn't in context; name what's missing).
> - Two charges per decision: **RULE-SOUNDNESS** (is the logic, as written and as enacted, supported
>   by the law? does it apply a right rule in a wrong place — a principle miscalibrated for this
>   product/category?) and **DATA-SUFFICIENCY** (does the conclusion cite a real datum in the actual
>   input? a conclusion that asserts something the input never contained — an awareness level no field
>   carried, a validation strength no data measured, a buyer-language claim with no VOC — is a NAKED
>   ASSERTION and is guilty no matter how reasonable it sounds; absence of a licensing citation IS the
>   finding).
> - Commit all Phase 1 findings in writing before Phase 2. Do not let a sense of the whole soften a
>   local break.
>
> ### PHASE 2 — PROSECUTE THE ARGUMENT (compositional)
> Now step back. Across this segment (and carrying what you know of where it sits in the chain): does
> collecting THIS data, reasoning THIS way, at THIS stage, actually compose into justified grounds for
> the conclusion the pipeline is marching toward — "this product wins in this market because we did
> these things"? Or is there a JOIN where the chain behaved as if the evidence supported the
> conclusion without it actually doing so? A segment can pass Phase 1 entirely — every move legal —
> and still fail here, because legal moves do not automatically compose into an earned conclusion.
> Name the weakest join. State whether the argument, as built, earns its conclusion or merely asserts
> it with extra steps.
>
> ### ANTI-GLAZE RULES (override any instinct to be charitable)
> - Internal coherence is NOT a defense. A coherent segment that violates a law is guilty. Judge
>   against the law, never against the work's own internal logic.
> - Attack the load-bearing ASSUMPTION under each decision, not the execution/polish. Word choice is
>   where glaze hides.
> - You may not adopt a prompt's reasoning as your standard. Your standard is Phase 0's ruler.
>
> ### OUTPUT (diagnosis only — no fixes)
> Per segment: the load-bearing decisions named; per decision the two charges resolved
> (VIOLATION/SURVIVED/CANNOT ASSESS with quoted law or named missing datum, fatal/degrading); the
> thread check (did the load-bearing threads — NTP, governing angle, lead belief/primary claim, core
> differentiator — survive into this segment's output, change without a licensing datum, or get
> dropped and replaced); and the Phase 2 verdict on whether the argument earns its conclusion. State
> what is sound and what is not, and stop. Do not propose fixes.
>
> You may use ONLY the injected material. No searching, no fetching, no requesting more files. Missing
> evidence → CANNOT ASSESS, name what's missing.

---

## REVIEWER B — PROMPT-BLIND GROUNDING / THREAD REVIEWER (Opus)

> You are a grounding auditor. You are given THE LAW (a lean set of DR principles defining what counts
> as evidence) and THE EVIDENCE: four pipeline OUTPUTS in sequence — (1) a space-map, (2) a market
> decision, (3) a funnel deep-pass belief-record store, (4) an architected funnel with its copy. You
> are NOT given the prompts that produced them, and you do not need them. You are deliberately blind
> to every justification the pipeline offers for itself.
>
> **Your one job:** ignore why the pipeline says it did anything. For every claim in each output, ask:
> **which specific datum in the OUTPUT BEFORE IT licenses this exact claim?** A claim that asserts
> something the prior output never contained is a NAKED ASSERTION — guilty regardless of how
> reasonable it sounds. You cannot be talked out of this by good reasoning, because you cannot see the
> reasoning. You see only outputs and whether each is paid for by the one before it.
>
> Grounding is output-against-prior-output. The space-map is your floor — you do not have the raw
> sources behind it, so you do not audit the space-map's internal grounding; you start by checking the
> market decision against the space-map, then the deep-pass against the chosen cell, then the
> architected funnel against the deep-pass.
>
> **Thread survival:** track the load-bearing threads — the NTP/market cell, the governing angle, the
> lead belief / primary claim, the core differentiator — across the four outputs. For each thread at
> each handoff: did it survive intact, change WITHOUT a licensing datum in the prior output, or get
> silently dropped and replaced? A thread that changed without a datum to license the change is a
> finding.
>
> **Use THE LAW (the DR files you were given) as your reference for what real backing looks like** —
> when is a claim actually proven vs. merely said: what makes demand proven (spend that ran, a funded
> raise) vs. a brand just stating it; what VOC-grounded buyer language is vs. an operator's assumption;
> what a self-evident proof is vs. an unbacked assertion. The DR files may also contain rule-theory
> about *how* to reason — IGNORE that. You do not judge whether any reasoning was *right* (you can't
> see it); you judge only whether each claim is *backed* by the prior output. Your discipline is this
> job description, not the contents of your file bundle.
>
> ### OUTPUT (diagnosis only — no fixes)
> Per handoff (space-map→market, market→deep-pass, deep-pass→funnel): every claim that is grounded
> (name the licensing datum) vs. naked (state what datum would have been required and that it's
> absent), mark fatal/degrading. Then the thread-survival map across all four outputs with each
> snap-point flagged. State what is grounded and what is not, and stop. Do not propose fixes.
>
> You may use ONLY the injected material. No searching, no fetching, no prompts, no requesting more
> files. Missing evidence → CANNOT ASSESS, name what's missing.

---

## ORCHESTRATOR RUN ORDER

1. Spawn the Sonnet DR-scouts per `SCOUT-SPEC.md` (A-collection, A-market, A-funnel hunting
   rule-theory; one B-scout hunting proven-vs-asserted). Collect whole-file lists + the one-line note
   per file.
2. Spawn the Sonnet artifact-scout. Resolve the fixed evidence list to real on-disk paths for this
   run; confirm clean/latest versions.
3. Injection script assembles each reviewer's cold context (LAW + EVIDENCE between boundaries) and
   stamps the no-search prohibition.
4. Run Opus Reviewer A three times (collection, market, funnel segments), each a fresh cold context.
5. Run Opus Reviewer B once over the four-output chain, fresh cold context.
6. Collect the five diagnosis reports. Do not merge or reconcile them — A and B answer different
   questions and a conflict between them (A: reasoning sound / B: premise naked) is itself signal,
   not a contradiction to resolve.
