---
phase: 15-stage-m1-s15-funnel-architect-copywriter
plan: "01"
status: complete
requirements:
  - FUNNEL-01
  - FUNNEL-02
completed: 2026-06-04
---

# 15-01 Summary — belief_kind first-class field

## What was built

`belief_kind` (`crowdfunding-specific | general-dr`) is now a first-class
per-belief field across the three contract surfaces:

- **prompts/funnel-deep-pass.md** — §6b belief-instance schema declares the
  `belief_kind` field; closed-enums block declares `BELIEF_KIND_ENUM`.
- **runs/_fixture/funnels/sample.json** — all 4 belief records carry
  `belief_kind` with the D1 values (mechanism-is-the-reason=general-dr,
  trust-the-brand-or-founder=crowdfunding-specific, it-will-ship=crowdfunding-specific,
  act-now=general-dr).
- **tools/hooks/validate-analyzer.js** — `BELIEF_KIND_ENUM` const + Rule 2b
  rejects records with missing or off-enum `belief_kind` (exit 2).

## Verification

The validator's verbatim gate runs before the belief loop and needs a cleaned
funnel body. With a clean body supplied, the belief_kind rule was exercised:

- missing `belief_kind` → exit 2, `missing "belief_kind"` ✓
- off-enum `belief_kind` → exit 2, `off-enum` ✓
- valid values → no belief_kind violation ✓

`grep BELIEF_KIND_ENUM` returns matches in both funnel-deep-pass.md and
validate-analyzer.js (schema/validator consistent).

## Deviation / known issue (out of scope for 15-01)

Plan acceptance asked for `validate-analyzer.js sample.json` to exit 0. It
does NOT — but for reasons unrelated to belief_kind, and which predate this
plan (identical failures at HEAD before 15-01):

1. **No cleaned-body fixture wired.** The verbatim gate aborts with
   CONFIG-ERROR because no `*-clean.json` / `-clean.txt` exists for
   funnel_id `gameshell-kickstarter`. The synthetic fixture ships without one.
2. **Fixture violates pre-existing enums.** `proof_tier` uses `"Tier 1"`
   (space) vs `PROOF_TIER_ENUM = Tier1`; `moves` use descriptive freeform
   tags (e.g. `exploded-diagram`) not in `MOVE_ENUM`.

The belief_kind contract (this plan's actual goal) is complete and correct.
Making the fixture fully validator-clean requires (a) deciding where the
canonical clean body for a synthetic fixture lives and (b) remapping `moves`
to `MOVE_ENUM` lever tags — a semantic judgment. Deferred to 15-05 (E2E
verification), where fixture wiring naturally belongs and the operator can
confirm the moves mapping.
