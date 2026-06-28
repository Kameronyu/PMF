# Verification review #4 — `instruction-mechanizer/SKILL.md` (revised)

Scope: confirm the revision clears every finding in `skill-review-3.md`, and — decisively — that the skill now passes its OWN dog-food test (its load-bearing prose contains none of the smells it bans). Checked against `mechanizer-research.md` (the lossless standard) and the step-0 plug-in point in `skill-builder/SKILL.md`. Critique only; I did not rewrite the file.

---

## (1) Resolution audit

Strict reading: "mentioned" ≠ "resolved." Evidence is quoted from the revised file by line.

| Finding (review-3) | Status | Evidence from revised SKILL.md |
|---|---|---|
| **1.1** Word lists under-stocked; silently drops INCOSE R7/R8 + QuARS words | **RESOLVED** | Step 1 now states "The word lists are representative, not exhaustive — flag any word that fails the gate above" (L35) AND restocks: Subjective adds `customary, typical, routine, generic, ancillary` (L36); a new dedicated bucket "**Vague descriptive (everyday):** bad, clear, close, far, fast, slow, near, recent" (L38) imports the QuARS Vagueness words; escape-clause bucket adds `to the extent necessary, as far as possible, if practicable` (L39). The "neither claims exhaustiveness nor is exhaustive" double-fault is closed. |
| **1.3** INCOSE R16/R26 absolutes have NO home (real MISSING asset) | **RESOLVED** | New bucket: "**Absolutes:** all, every, always, never, none, 100% — flag; require the real bound or the actual required reaction" (L42). A doc saying "always validate every field" now has two hits with a home. Negative-statement bucket also broadened to "demand the positive spec" (L48). |
| **1.4** EARS singularity-counting rule dropped (EARS→singular bridge lost) | **RESOLVED** | Step 3 rewrite operators now carry the count rule inline: "split a compound into singular instructions (≥2 triggers or ≥2 obligations in one rule → split)" (L66). The mechanism that makes EARS self-checking is restored. |
| **1.6** Coordination/and-or scope absent | **RESOLVED** | Step 1 "**Compound / coordination scope:** one sentence carrying several obligations (and/or, lists), or unclear scope of and/or ('A and B or C') → split" (L47). The "A and B or C" cue from the Handbook is present. (Lexical ambiguity still omitted — review-3 explicitly graded that omission "acceptable," so not counted against.) |
| **1.7** Example-normalization (Anthropic transforms 2/3) missing; missed reuse of skill-builder A3 | **RESOLVED** | Step 3 final operator: "if the doc carries few-shot examples, make each pass its own gate (`skill-builder` A3)" (L66). Closes the gap and makes the A3 reuse real. |
| **3.1** Skill uses its own banned words (`genuinely`×3, `usually`, `clear`, `gratuitously`, `if it matters`) | **RESOLVED** | All six purged from prose (verified by grep — see §2). `usually LEAVE`→ GENERAL bullet now reads "→ LEAVE, unless the agent must make a judgment call to apply it" (L29). `genuinely subjective` → "Use a rubric + pass-threshold only where no deterministic check can decide the quality" (L68). `gratuitously … clear prose` → "Rewrite a span only if it carries a kept flag (leave unflagged prose untouched)" (L84). `note it if it matters` → "state the size/rigidity increase in the change report" (L86, unconditional). |
| **3.2** Unpinned `it` (two antecedents) in honest-trade-off | **RESOLVED** | The offending sentence is gone; replaced by L86 "Mechanizing lengthens a doc and makes it more rigid; state the size/rigidity increase in the change report" — referent ("the size/rigidity increase") is pinned. The borderline Step-5 `it` ("fake precision onto it") is rewritten to "fake precision onto a flagged span" (L75) — pinned. |
| **3.3** Compound Step-5 instruction (flag OR route; AND don't-fake) | **RESOLVED** | Step 5 is now three separate bullets, one obligation each: "If a span needs human or taste judgment that no rule can decide, flag it." / "Do not put fake precision onto a flagged span." / "For each flagged span, record `{…}`" (L74-76). Eats its own "split a compound" dog food. |
| **3.4** Membership-test lines self-attesting (can't return FALSE) | **RESOLVED** | The soft "Did you apply the gate?" process-check is gone. Lines are now outcome-anchored to the artifact: "Of the spans you LEFT, take the 3 most general: can you name the context that makes each one decidable? If not, you under-mechanized" (L89); each remaining line is a per-artifact YES/NO that an external reader can falsify (L90-93). Header: "answer each from the artifact; any NO = not done" (L88). |
| **3.5** Worked example: 3rd rewrite not verifiable; never shows gate returning FALSE | **RESOLVED** | Third bullet changed from "omits background the reader already has" to "excludes any fact already stated in the parent thread" (L102) — names the source, now Verifiable. A FALSE-returning case was added: "**A rewrite that FAILS Step 4 (so the gate bites):** 'the agent must include relevant details' → Verifiable? NO (no named set of which details) → return to Step 3 → becomes the three-item named set above" (L105). |
| **4.2** CLASSIFY taxonomy has no home for temporal/trigger vagueness | **RESOLVED** | Step 2 now opens with a dedicated class: "**TRIGGER/TIMING** (when or whether to act): pin the trigger to a named signal or threshold; recast with an EARS WHEN/WHILE/IF-THEN form" (L52). Step 1's temporal smells (L46) now have a Step-2 target. Six classes total. |
| **4.5** Acceptance→rewrite has no loop-back; produce+verify collapsed | **RESOLVED** | Step 4 now states the loop and the separation explicitly: "On any FALSE, return the span to Step 3 and re-test. Acceptance is a separate pass from rewriting" (L71). |
| **5.1** Reuse CLAIMED but checkable-forms menu / verdict-last RE-DERIVED | **RESOLVED** | Step 3 now references rather than reproduces: "A rewritten CHECK lowers to a concrete form (`skill-builder` reference → 'Checkable forms'): e.g. `contains` / `regex` / `is-json` / a sentence-count bound / a numeric threshold" (L68) — one illustrative example kept, full menu pointed to. Step 2 JUDGMENT "reuse `skill-builder`'s A1 membership test" (L51) and "Put criteria before the verdict; verdict last" tie to the sibling. |
| **5.3** Output-field→skill-builder seam lacks a handoff trigger | **RESOLVED** | New "## Handoffs" section: "If a flagged span is about an OUTPUT FIELD's contract, de-vague the prose here, then hand that field to `skill-builder` — do not build the soundness block here" (L80). Names the seam and the owner. |
| **5.4** Multi-step-doc→system-designer seam thin | **RESOLVED** | "If the doc describes ≥2 distinct job-types handing off to each other, route to `system-designer` to decompose it first" (L81) — a concrete trigger, mirrors system-designer's decomposition cue. |
| **Axis 6** bloat (duplicated menu, thrice-stated gate, §Discipline overlap) | **RESOLVED** | Checkable-forms menu de-duplicated (L68, see 5.1). Gate stated once in its own section (L26-32); Step 1 and the membership test reference it ("flag any word that fails the gate above" L35) rather than re-paraphrase the core test. §Discipline trimmed to three non-overlapping lines (L83-86). Net: the file is shorter AND the sibling reuse is real — the aligned fix review-3 predicted. |
| **7.2** Flagged-irreducible items lack per-item disposition/owner | **RESOLVED** | Step 5: "For each flagged span, record `{span, why-irreducible, routed-to: author | decision-step, what-would-resolve-it}`" (L76); membership test enforces it: "Does every flagged span carry a routed-to + what-would-resolve-it?" (L93). A flagged item is now a tracked handoff, not a shrug. |

**Resolution score: 17 / 17 RESOLVED. Zero PARTIAL, zero UNRESOLVED.** (Items review-3 itself graded acceptable/optional — 1.2 `too low`, 1.5 inquiry-resistance, 1.8 `contains-all`, 1.9, 1.10, 1.11, 4.1 nit, 7.3 — were not blocking and are not held against the revision; none regressed.)

---

## (2) Dog-food test — scan the skill's OWN load-bearing prose

Method: scanned every prose sentence the agent must act on, EXCLUDING (per instructions) the Step-1 word-list examples, the Sources footer, and quoted before/after example text. Cross-checked with grep for each named offender.

### The prior 3.1 offenders — confirmed GONE from load-bearing prose
- `genuinely` — **GONE.** grep for `genuinely` returns zero hits anywhere in the file. (Was ×3, load-bearing: gated the rubric fallback and the FLAG decision. Both rewritten: rubric fallback is now "where no deterministic check can decide the quality" L68; FLAG is "needs human or taste judgment that no rule can decide" L74.)
- `usually` — **GONE.** Zero hits. The GENERAL bullet now reads "→ LEAVE, unless the agent must make a judgment call to apply it" (L29) — the hedge replaced by a stated condition.
- `clear` — **GONE from prose.** The only occurrence of the token `clear` is inside the Step-1 word-list itself ("bad, clear, close…" L38), where it is a *banned-word example*, not an instruction. Excluded by the scan rules. No load-bearing use.
- `gratuitously` — **GONE.** Zero hits.
- `if it matters` — **GONE.** Zero hits.
- the unpinned `it` — **GONE.** The two flagged instances (honest-trade-off; Step 5 "fake precision onto it") are both rewritten with pinned referents (L86, L75).

### Residual scan of remaining prose — hits and adjudication
I checked the whole prose surface for the smell families the skill itself lists. Findings:

1. **"the actual required reaction"** — Step 1 Absolutes bucket, L42: "require the real bound or the **actual required reaction**." Adjudication: this is *instructional prose telling the author what to demand*, and `actual`/`real` here are not vague-degree words — they contrast against the absolute (all/never) the author wrote, i.e. "the genuine bound that replaces the absolute." Not a degree-threshold smell. **Incidental, passes Step 4** (Verifiable: the rewrite must state a numeric/named bound). No action.

2. **"the quality"** — Step 3, L68: "Use a rubric + pass-threshold only where no deterministic check can decide **the quality**." Adjudication: `quality` is a noun, not a subjective adjective; the sentence's load-bearing test is the *checkable* clause "no deterministic check can decide" (a falsifiable condition: try equals/contains/regex/count/threshold — if one fits, don't use a rubric). The decision does NOT rest on judging "quality." **Load-bearing but passes Step 4** — the gate is the deterministic-check test, which is Verifiable. No action.

3. **"a careful agent follows it the same way every time"** — Core principle, L24. `careful` describes the agent, not a threshold the agent must meet; the operational test in the same sentence is "you can check whether it did." **Incidental.** Borderline-decorative but not an obligation that turns on `careful`. No action.

4. **"a bare category noun"** — Step 1 under-specified nouns, L45. `bare` is a precise technical term here (noun with no instance/modifier), immediately disambiguated by the parenthetical examples "'the data,' 'access.'" **Passes** (Verifiable: does the noun name a specific instance? yes/no).

5. **Negative-framed prose** — "do not auto-replace" (L34 heading), "Do not put fake precision onto a flagged span" (L75), "do not build the soundness block here" (L80). Adjudication: the skill bans *negative-only* instructions that omit the positive spec. Each of these END-placed prohibitions sits beside its positive counterpart (L34 pairs with "flag" in the same line; L75 follows the positive "flag it" in L74; L80 follows the positive "hand that field to skill-builder"). This is exactly the "one short prohibition at the END beside the positive spec" pattern skill-builder permits (skill-builder L38). **Passes** — these are not naked negatives.

6. **"Change wording, not meaning"** (L24) / "leave unflagged prose untouched" (L84) — terse imperatives, single obligation each, no vague term. **Pass.**

**Dog-food verdict: PASS.** No load-bearing instruction in the revised prose contains a subjective adjective, vague-degree word, escape clause, weak-verb-as-obligation, unpinned pronoun, or unsplit compound that would fail the skill's own Step-4 acceptance test. The three borderline tokens (`actual`/`real`, `quality`, `careful`) are all cases where the *operative* test in the sentence is itself checkable, so the instruction does not turn on the soft word. The skill now eats its own dog food.

### Specific confirmations requested
- **Membership-test lines falsifiable (can return FALSE, not self-attesting):** CONFIRMED. L89 "take the 3 most general [spans you LEFT]: can you name the context that makes each one decidable? If not, you under-mechanized" is an outcome check on the artifact — an over-mechanizer who left nothing, or who left an undecidable span, returns FALSE. L90-93 are each per-artifact binaries ("Does every change carry a named smell + specific span?" — one counterexample = NO). None is a self-reported "did you apply X?" process-attestation. Matches the skill-builder standard it cites ("a real gate, not 'assert YES'").
- **Worked example shows a rewrite returning FALSE and names its source:** CONFIRMED. L105 shows `"the agent must include relevant details" → Verifiable? NO → return to Step 3`. The repaired rewrite's source is named: L102 "excludes any fact already stated in **the parent thread**"; L104 "an explicit exclude-rule whose source is named (the parent thread)."
- **Step-2 has a home for temporal/trigger smells:** CONFIRMED. L52 TRIGGER/TIMING class receives them and routes to EARS WHEN/WHILE/IF-THEN.
- **Step-3 references skill-builder's checkable-forms rather than re-deriving the menu:** CONFIRMED. L68 "lowers to a concrete form (`skill-builder` reference → 'Checkable forms')" + one inline example, not the full menu.
- **Step-0 integration in skill-builder reads coherently:** CONFIRMED. skill-builder L46 lists the hardening workflow as "**(0) mechanize the doc's instructions first — run `instruction-mechanizer` to de-vague the prose, so the output-spec work is not fighting ambiguous instructions** → triage judged-vs-copied fields → …". This is coherent with the mechanizer's own description (L12-14: "the RETROFIT front-door … for specifying a NEW prompt's output contract use skill-builder (which invokes this as its first step)") and with the mechanizer's Handoffs (L80: output-field contracts hand back to skill-builder). The two skills agree on the seam from both sides: mechanizer de-vagues prose first, then hands output-FIELD contracts to skill-builder; skill-builder calls mechanizer as step 0 before field work. No circularity or contradiction.

---

## (3) New issues introduced by the revision

Nothing the revision newly broke rises above cosmetic. Minor observations, none blocking:

- **N1 (trivial).** Step 5 disposition record uses `routed-to: author | decision-step` (L76) but the Handoffs section (L80-81) routes to two *named skills* (`skill-builder`, `system-designer`), not to a generic "decision-step." A reader could wonder whether a skill handoff is recorded as `routed-to: skill-builder` or under "decision-step." Harmless — both are plausibly "decision-step" — but the disposition vocabulary and the Handoffs vocabulary aren't stitched. One word ("…| decision-step | sibling-skill") would close it. Not worth a re-spin.
- **N2 (trivial).** L24 "a careful agent follows it the same way every time" — `careful` is decorative; could be dropped for zero loss. Below the Step-4 threshold (the operative clause is the checkable "you can check whether it did"), so not a dog-food failure, just a place a maximalist would trim.
- **N3 (not a defect, noted for completeness).** Femmer `too low` / `almost always` (review-3 item 1.2) and QuARS `in case` are still not inline. Review-3 graded 1.2 "minor, no need to renumber" and the new "representative, not exhaustive" disclaimer (L35) now formally covers any omission, so this is no longer a silent drop. Acceptable.

No regressions in method shape, IO declaration, boundary statements, or the gate's placement.

---

## VERDICT

**PASS.**

The revision resolves all 17 blocking findings from review-3, and — the decisive test — the skill now passes its own Step-4 acceptance test on its own load-bearing prose: every prior offender (`genuinely`×3, `usually`, `clear`, `gratuitously`, `if it matters`, the unpinned `it`) is purged, the compound Step-5 instruction is split, the membership-test lines are falsifiable, and the worked example demonstrates the gate returning FALSE with a named source. The step-0 integration with skill-builder is coherent from both sides. A skill whose product is "remove vague language" no longer ships vague language. Ship it.

**Single most important remaining change (optional, non-blocking):** stitch the Step-5 disposition vocabulary to the Handoffs section — extend `routed-to: author | decision-step` to also admit a named sibling skill (`skill-builder` / `system-designer`), so a flagged output-field handoff has an explicit disposition value. One word; do at next touch, not a reason to hold the ship.
