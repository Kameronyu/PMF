# Scout Spec — DR-law scouts for the audit (Sonnet agents)

The scouts run BEFORE the reviewers. Their job is to find and return the DR knowledge-base files each
reviewer needs, so the injection script can put those files in the reviewer's context. Scouts return
**whole files** — they do NOT pick files apart, extract sentences, or summarize. They select and
return complete DR files. Discipline about how each reviewer uses those files lives in the reviewer
prompts, not in surgical bundles.

There are two kinds of scout, run as separate dispatches:

- **A-scouts** — find the DR law that governs *how the pipeline is supposed to reason* (rule-theory).
  Three of them, split by segment, sharing orientation, dividing the corpus dig.
- **B-scout** — finds the DR files that show *what real backing looks like* (what makes a claim
  proven vs. merely asserted). One scout, one narrow target.

A-scouts and B-scout read the **same prompts** for orientation. They differ only in **what they are
told to look for** — their definition of "useful." They return what they return.

---

## ORIENTATION — every scout does this first

1. Read `claude.md`. It points to the DR knowledge base (the KB). Follow it to the KB.
2. **Verify the KB is the right corpus** before digging: confirm it contains DR material from all
   four authors — **Carl Weische, Spencer (origins), Mark (builds-brands), and Alex Hormozi**. If any
   of the four is missing, stop and report the KB looks incomplete rather than digging a partial
   corpus.
3. Read `MAP.md` to orient to the pipeline shape (which stage does what, in what order).
4. Read the decision-surface prompts (below). Read them to learn **what decisions each stage makes** —
   the judgments, the gates, the kills. You are reading for the *decision surface*, not to adopt the
   prompt's reasoning. You are a scout, not the reviewer; you return files, you do not render verdicts.

### The prompts to read (in the marketing-lens md set — these exact files, nothing else)

Read ONLY these. Do NOT read the middleman/plumbing prompts (the extractors and cleaners) — they make
no DR-answerable decision, so they have no law to hunt and only add noise:

- `04-space-classifier.md` — the light-pass judgment stage: what the run chooses to collect/classify.
- `05-market-selection-assessor.md` — the market-pick decision (the four gates).
- `08-funnel-architect.md` — the funnel-design decision.
- `08b-copywriter-STUB.md` — read this too: the architect ended up writing the copy, and this stub
  names the copywriting DR files; the funnel scout needs to know the copy-craft law exists.

(Explicitly NOT read by scouts: `01-finder.md`, `03-dumper.md`, `06-router.md`,
`07-section-analyzer.md` extraction mechanics, `09/10/11` asset stages — these are extraction,
routing, or asset plumbing, not DR-answerable decisions.)

---

## BE LIBERAL — do not be shy picking files

Return generously. A reviewer can ignore a file that turns out marginal; it cannot use a principle
that was never returned. When a file plausibly contains law the reviewer's job touches, include it.
Over-inclusion costs a little context; under-inclusion silently weakens the reviewer's standard and
produces a confident audit built on a thin law. Err toward MORE files. The only thing to avoid is
returning a file with zero relevant principle in it at all.

---

## A-SCOUTS (three, by segment) — hunt RULE-THEORY

**Definition of "useful" for A:** a file is useful if it contains a *principle that states what sound
reasoning REQUIRES* — a rule, law, or causal requirement a decision can be measured against and found
conforming or violating. You are hunting **rulers**, not tactics. "Enter on a differentiating axis or
you teach the market nothing" is a ruler (useful). "Here's how to write a countdown timer" is a
tactic (not useful to A). Hunt requirements and laws phrased as *must / or else / the driver is*.

All three A-scouts share the orientation above. They divide the corpus dig:

- **A-scout / collection** — hunt the law governing what the light pass SHOULD collect and how it
  classifies: what demand validation requires; durability / fad-death as signal; sophistication-stage
  reading from claim distribution; the difference between what brands *say* and what they *pay to run*.
- **A-scout / market** — hunt the law governing the market pick: the anti-fluke floor; why low
  competition is not opportunity; the differentiator requirement (mechanism AND avatar axis);
  sophistication vs. awareness as separate axes; believability tiers; price-conditioning. (Also note:
  `market-evaluation-criteria.md` and `definitions.md` may carry relevant standards — assess them.)
- **A-scout / funnel** — hunt the law governing funnel design AND copy craft: the congruency law;
  structure-follows-awareness / the V-shape; proven-beats-opinion; the three-layer authority model
  and non-convertible currencies; VOC as the foundation of copy; and the copywriting-craft principles
  (the architect wrote the copy itself — the copy-craft law is in play). The four author families to
  comb for these: `funnel-architecture--*`, `persuasion--*` if present, `consumer-psychology--*`,
  `offer-construction--*` if present, `differentiator-framework*`, and `copywriting--*`.

Each A-scout returns: the list of whole DR files for its segment, and for each, a one-line note of
which principle(s) in it the reviewer will prosecute against. Whole files — no extraction.

---

## B-SCOUT (one) — hunt WHAT REAL BACKING LOOKS LIKE

**Definition of "useful" for B:** a file is useful if it helps answer one narrow question — *when is a
claim actually backed by something real, vs. merely asserted?* B's whole job is to check whether each
output's claims trace to real backing upstream; it needs the DR files that define the difference
between **proven** and **said** — e.g. what makes demand proven (spend that ran, a funded raise) vs.
a brand simply stating a thing; what VOC-grounded buyer language is vs. an operator's assumption;
what a Tier-1 self-evident proof is vs. an unbacked assertion.

B-scout reads the SAME orientation and prompts as the A-scouts, but hunts only this proven-vs-asserted
concept. It is NOT hunting rule-theory (gate order, congruency law, awareness model) — B never judges
whether reasoning was *right*, only whether claims are *backed*, so do not return files solely because
they carry rule-theory. If a file carries both (it often will), return it — B's reviewer prompt keeps
it disciplined; you just don't go hunting rule-theory for its own sake.

B-scout returns: the list of whole DR files that illuminate proven-vs-asserted, each with a one-line
note of what backing-definition it carries. Whole files — no extraction. Be liberal here too.

---

## WHAT THE SCOUTS DO NOT DECIDE

Scouts pick DR files. Scouts do NOT pick the evidence artifacts (the run's outputs) — that is the
artifact-scout's fixed job (see the orchestration doc). Scouts do NOT render any audit verdict. Scouts
do NOT pick files apart. They orient, hunt by their definition of useful, and return whole files
liberally.
