# 03 Debug Run Notes — Deep Competitive Analysis Reference Run

> First real run on a market is a DEBUG PASS to break the collection-layer methodology, not
> produce a deliverable (D-17/D-18). Surfacing pipeline breaks IS the deliverable. Record every
> break; do not over-build to pre-empt gaps that haven't appeared.
>
> **DEFERRED — TO BE FILLED on the first real deep-analysis run, once a market exists (D-02).**
> The build-validation plumbing smoke test (D-17, plan 03-04 Task 4) exercises the brick string
> on throwaway data; this doc captures the first real methodology-debug pass.

---

## Task 1 — Reference market/seed (DECISION CHECKPOINT: locked)

> Market is NOT yet picked. This section is filled after the operator completes Stage M1-S2
> (market-selection gate) and chooses a market. Do not fill until then.

- **Chosen market (T/P/N):** _(pending D-02 — market pick from M1-S2 output)_
- **transformation:** _(to be locked at run start)_
- **niche:** _(to be locked at run start)_
- **Space dir:** `runs/<space>/` _(to be set)_
- **Run date:** _(to be filled)_

### Run config locked at run-start

- `--space=<market-space>` parameter set for all brick invocations
- Competitor list sourced from `runs/<space>/brands.json` (M1-S2 output)
- Routing flags (`structure_only` / `messaging_full` / `both`) pre-assigned per competitor per §4
- DR injection hook (`inject-dr.js`) confirmed: six DR files loaded, chars cap OK

---

## Task 2 — Pipeline run + self-audit

> TO BE FILLED on the first real deep-analysis run. Scaffold below mirrors 01-DEBUG-RUN-NOTES.md.

### Pipeline stages completed

| Stage | Status | Notes |
|-------|--------|-------|
| adlib-one.js (destination_url pull) | — | _(pending run)_ |
| funnel-assemble.js (normalize + cluster + render) | — | _(pending run)_ |
| funnel-clean.js (section-marked verbatim) | — | _(pending run)_ |
| funnel-score.js (two-currency validation stamp) | — | _(pending run)_ |
| inject-dr.js (DR context emission) | — | _(pending run)_ |
| Section Analyzer — Agent 1 ROUTER (routing_flag) | — | _(pending run)_ |
| Section Analyzer — Agent 2 SECTION ANALYZER (belief records) | — | _(pending run)_ |
| validate-analyzer.js hook | — | _(pending run)_ |
| funnel-store.js (write runs/<space>/funnels/) | — | _(pending run)_ |

### Hooks fired / rejected

**validate-analyzer.js:** _(pending run — record each reject + fix)_

### Known failure points to watch

The following are flagged as likely debug breaks during methodology calibration (deferred from
the build phase — see plan 03-04 CONTEXT D-17):

1. **URL normalization splatter** — a single competitor's ads may point to multiple near-identical
   URLs (A/B variants, utm param variants not fully stripped) and incorrectly assemble as separate
   funnels instead of one. Check `ambiguous_destinations.json` sidecar and `normalizeUrl()` output.
   Expect to calibrate the normalization regex for the specific market's LP URL patterns.

2. **Funnel-level position vs page-local** — the Section Analyzer is instructed to emit funnel-level
   ordinal `position` (1st belief-instance in the funnel, not "section 3 of the page"), but this is
   a known failure point (spec §5/D-12). Check whether emitted position values are globally monotone
   across the funnel or restart at 1 per page/section. Rejects from validate-analyzer.js rule 4
   (duplicate position) surface this failure.

3. **Two-currency normalization** — funnel-score.js must NOT collapse Currency A + B into one score.
   Verify `validation_lane` is an array carrying both `'A'` and `'B'` for funnels with both ad data
   and crowdfunding stats. A funnel with `validation_lane: ['AB']` or a single merged number is wrong.

4. **Belief over-classification** — the Section Analyzer may emit too many belief-instance records
   per funnel (one per sentence rather than one per belief installed). Validate: does the number of
   records reflect distinct beliefs, or are adjacent sentences split into separate records? Validate
   also that overflow beliefs (`belief_confidence: 'low'`) are genuine novel beliefs, not anchor
   mis-classifications.

5. **DOM selector calibration (adlib-one.js)** — the `extractAdCards()` DOM selectors are marked
   `TODO(D-17)` — they are heuristic and may miss `destination_url`, `cta_text`, or `headline` on
   the live Ad Library DOM for this market. Check null rates per field in the assembled packages;
   if destination_url is broadly null, no funnels can assemble and the DOM extraction must be
   recalibrated for the current Ad Library DOM.

6. **Review-block tagging (funnel-clean.js)** — `extractReviewBlocks()` uses HTML class-name
   heuristics. Platforms with hashed class names (Kickstarter React rendering) may return empty
   `review_blocks[]`. The cleaned body still carries the text; Analyzer can locate it. Log fill-rate.

### Self-audit: structural checks

_(to be filled after the run — checklist adapted from 01-DEBUG-RUN-NOTES.md §Task 2 self-audit)_

- [ ] `validation_lane` is array, never string; both A+B lanes present where applicable
- [ ] `position` is funnel-level ordinal (not page-local); no duplicate positions within a funnel
- [ ] `execution_detail` is granular (sub-claim recoverable), not mush ("they use urgency")
- [ ] `verbatim_refs[].text` passes validate-analyzer.js verbatim-substring gate on all records
- [ ] No `routing_flag`-excluded content bled into `belief_records[]` for `structure_only` funnels
- [ ] `_provenance.space` in stored JSON matches the `--space` param passed
- [ ] `funnel_id` in stored files matches sanitized form (no raw URL chars in filenames)
- [ ] DR injection: six files loaded, context cap not exceeded (check inject-dr.js stderr)

### D-17 Plumbing smoke test — STATUS: DEFERRED

The D-17 build-validation smoke test (end-to-end brick-string run on live data with a throwaway
analyzer call) was DEFERRED at the operator's choice during plan 03-04 execution.

**Rationale for deferral:** The plumbing is validated-by-construction — each brick
(funnel-store.js, funnel-score.js, funnel-clean.js, funnel-assemble.js, adlib-one.js,
inject-dr.js, validate-analyzer.js) had its syntax checked and its key contracts verified by
automated node -e checks during plans 01-03 and 03-04. Prior plans' Self-Check gates all PASSED.
The brick interfaces are self-consistent (field names, JSON conventions, file-path conventions
conform). However, the pipeline has NOT been run end-to-end on live data and a live-DOM or
network failure could surface at any stage.

**The real methodology-debug pass remains deferred to D-02** (after a market is picked via
M1-S2 and a real competitor list exists). That pass is what this file is designed to capture.

_(D-17 debug breaks: to be filled on first real run — record every break, which stage, which brand, what failed)_

---

## Task 3 — Kam's belief-tagging verdict (HUMAN-VERIFY CHECKPOINT)

> DEFERRED — TO BE FILLED after the first real methodology-debug run.
>
> Kam scans a sample of belief-instance records (2-3 funnels) from `runs/<space>/funnels/`.
> Records: confirmed, or specific mis-classifications to fold (funnel_id + field + Kam's call).
>
> Key questions:
> - Does the Analyzer tag belief_id the way Kam would? (e.g. does "30-day guarantee" land in
>   `it's-worth-the-price` or `act-now`? Kam decides.)
> - Is `execution_detail` granular enough that the sub-claim is recoverable without re-reading
>   the raw funnel? Or is it too high-level to mine?
> - Are `verbatim_refs[]` pulling the right copy spans? (review_language vs competitor-marketing
>   tags correct?)
> - Does `routing_flag` (structure_only / messaging_full / both) match Kam's read of each competitor?

_(pending Kam — record verdict after the first real run)_

---

## Verdict

_(clean | gaps-to-fold — pending first real methodology-debug run)_
