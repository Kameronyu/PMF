# Per-criterion membership tests + the COUNTABLE gate definitions

## Membership tests (all YES = the criterion passes; any can return FALSE)

**C2 Pain callout** (FELT — judged pairwise against a pain specimen, not a script gate)
- Does the hook name a *specific* felt experience ("my face is puffy"), not a category
  ("skin issues," "struggling with weight")?
- Would the named avatar recognize it as their exact pain, not a generic one?
  FALSE example: "having trouble losing weight" → category, not a felt specific → FAIL.

**C3 Solution promise** (FELT — judged: claim present AND resolves the C2 pain)
- Is there a claim of resolution present?
- Does it answer the pain named in C2 (tension→relief), not a different benefit?
  If a claim is present but no C2 pain exists, mark C3 met but flag the pairing incomplete.

**C4 Specificity (COUNTABLE — script gate, highest weight)**
- `contains_specific = has(number) OR has(named_outcome) OR has(timeframe)`
- `round_number(n) = n ends in one or more zeros OR is a common milestone (10,25,50,100,1000)`
- PASS iff `contains_specific AND NOT (only numeric claim is round)`.
  FAIL → PRIORITY REVISION regardless of other criteria. Round "$10,000" → replace "$9,340".

**C5 Simplicity (COUNTABLE — script gate)**
- `sentences <= 1` strongly preferred; PASS if `sentences <= 1`; SOFT-WARN at 2; FAIL ≥3.
- Tie-breaker among passing hooks: fewer words wins at equal message clarity.

**C6 Credibility (FELT — signal, not hard gate)**
- Does it carry a skepticism bridge: acknowledge doubt ("sounds too good to be true"),
  prior-failure ("even though I'd tried everything"), third-party ("my doctor was shocked"),
  or mechanism specificity? Signal strength vs. a credibility specimen; never a hard FALSE.

**C7 Timeframe (COUNTABLE — script gate)**
- `has_timeframe = matches a duration/deadline token ("in 6 days", "by tomorrow", "30 seconds daily")`.
- PASS iff present.

## C1 Curiosity (FELT — pairwise only, NEVER a membership gate)
Do **not** write a yes/no test for C1. Judge pull by comparing the hook to a winning
open-loop specimen (`references/scoring-specimens.md`): does this line make the next line
more necessary than the specimen does? Return `prefer | tie | weaker`. This is the
criterion the first mechanizer wrongly laundered into "would a viewer stop here? → FALSE";
keep it a signal.

## Why the tiers
Hard-gating a felt criterion produces confident-but-wrong FALSEs and pushes writers toward
gaming the gate. Hard-gating a countable one (a number is or isn't round; a sentence count
is what it is) is reproducible and safe. Soft-cap the in-between (passive voice, filler)
because the detectors over-flag.
