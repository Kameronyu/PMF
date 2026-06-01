# Research Quality and Verification Practices

**Analysis Date:** 2026-06-01

---

## Overview

This is not a software codebase. There is no test suite, linter, or CI pipeline.
Quality is enforced through: (1) hard rules baked into agent briefs, (2) self-audit
checklists agents run before returning, (3) human checkpoints at stage boundaries,
(4) locked vocabulary enforced by shared framework files, and (5) retrospectives that
fold run failures back into durable corrections.

---

## The De Facto QA Loop

Every research run follows this loop:

```
1. Handoff doc defines scope, locked decisions, and "what NOT to do"
2. Agent brief carries hard rules + self-audit checklist
3. Human checkpoint at key decision points (roster, profile)
4. Human reviews deliverable against worked example
5. Errors → corrections → pushed to shared analyzer-framework.md (propagates to all future runs)
6. Post-milestone retrospective mines session transcripts for what broke
```

Each stage is described below.

---

## Verification Layer 1 — Hard Rules in Agent Briefs

Every brief in `runs/eink-tablets/scripts/` begins with a numbered list of hard rules
derived from prior-run failures. These are non-negotiable enforcement rules, not guidelines.

Example from `runs/eink-tablets/scripts/granular-analyzer-brief.md`:

1. **Verbatim-only** — every claim, headline, hook, angle must be a direct quote with a `source_artifact` reference (file path + line range, or URL). No paraphrasing.
2. **Classify-with-evidence** — every layer classification must cite the verbatim copy it was read from. Ambiguous → mark `unclear / no evidence`.
3. **Anti-bucket** — two different verbatim quotes = two rows, not one. Synthesis groups; the agent catalogs.
4. **No cross-brand comparison** — per-brand agents are forbidden from reading sibling brand files. "Unlike reMarkable..." in output = automatic rewrite.
5. **No saturation calls** — per-brand agents never call anything saturated; that is the cross-brand classifier's job.
6. **Feature ≠ claim ≠ transformation** — with worked examples (see `CONVENTIONS.md`).
7. **UM honesty** — most brands have NO unique mechanism; `none` is the correct answer.
8. **Self-audit checklist** — must run before returning.

Source: `runs/eink-tablets/scripts/granular-analyzer-brief.md` (Hard rules section).

---

## Verification Layer 2 — Self-Audit Checklists

Every agent brief includes a `- [ ]` checklist the agent must tick before returning.
The checklist catches the specific failure modes identified in prior runs.

**Granular analyzer checklist** (from `runs/eink-tablets/scripts/granular-analyzer-brief.md`):
- [ ] Every claim in §5 has a source_artifact reference
- [ ] Every angle in §8 has driver + pole + transformation reference
- [ ] No feature appears in the claims table
- [ ] No transformation is presented as a feature
- [ ] Every "longest-running hook" entry in §10 has a start_date OR §10 states "no ad-longevity data available"
- [ ] No comparisons to other brands anywhere in the output
- [ ] No "saturated" calls anywhere in the output
- [ ] All 13 sections present (even if a section says "N/A" or "none found")

**Crowdfunding teardown checklist** (from `runs/eink-tablets/scripts/crowdfund-teardown-brief.md`):
- [ ] No em dashes, no jargon in output
- [ ] Exact figures or "not found" — no estimated raise/backer numbers
- [ ] At least 2 underperforming/failed campaigns included, or explicit note
- [ ] "Led with" classified for every campaign
- [ ] Tier structure and day-one spike captured where visible
- [ ] Objection list is real comment themes traced to verbatim quotes, not invented

**Methodology corrections baked into `analyzer-framework.md`** (from `handoff.md` — locked):
- Niche is READ from competitor copy, never assumed
- Transformation ≠ feature ≠ mechanism (with worked examples)
- Claims split from features — outcome-promises only in claims table
- Problem-mechanism (shared causal story) recorded separately from UM
- Buyer characterization field on every record — primary buyer + verbatim evidence
- Ad Library Page-ID sanity check REQUIRED; absence of ads is data
- Saturation counts ONLY within a market cell (niche × transformation), never pooled across cells

---

## Verification Layer 3 — Human Checkpoints

Handoff docs define explicit human checkpoints at stage boundaries. These are not
optional — they are structural decision points where the human reviews agent output
before the next agent fan-out begins.

**Checkpoints in `handoff-crowdfunding-teardown.md`:**
1. After Pass 1 (Finder): confirm roster scope, underperformer hunt results, whether to expand or trim before fan-out
2. After Pass 3 (Teardown synthesizer): final deliverable review

**Checkpoints in `handoff-granular-analysis.md`:**
1. After Pass 0 (supplementary fetch): confirm screenshots captured, deposit funnels found, gaps blocking Pass 1
2. After Pass 2 (per-market playbooks): review all 4 playbooks, especially M4 (Kam's actual funnel)

**Checkpoints in `handoff.md` (market scan pattern):**
- Roster checkpoint after finder, before parallel analyzers fire
- Profile checkpoint after aggregator, before Gate 1 comparison

**Format:** checkpoints use `AskUserQuestion` to present the artifact and confirm before proceeding. This prevents expensive downstream work on a bad foundation.

---

## Verification Layer 4 — Worked Example Anchoring

Each run names a "worked example" — a completed deliverable that future work must match in
density and structure. New agents are told to read it before producing their own output.

From `handoff.md`:
> "Match the Faith profile's density and structure as the worked example."
> "Read `runs/eink-tablets/markets/faith/faith-market-profile.md` before running yours."

This is the primary quality standard for market profiles: match the existing high-quality
output, not an abstract spec.

---

## Verification Layer 5 — Shared Framework Propagation

All methodology corrections flow to one file, not per-market duplicates:

`runs/eink-tablets/scripts/analyzer-framework.md` — the shared analyzer spine.

Every analyzer agent reads this file. A correction to the classification rules or procedure
is made once here and propagates automatically to all future market scans. This prevents
corrections from being local to one run.

From `handoff.md`:
> "Do not redesign the briefs from scratch — adapt the templates. Fixes go in the shared
> analyzer framework, not per market."

---

## Verification Layer 6 — SYNTHESIS Block Rule

Any AI-invented message, synthesis, or recommendation must be fenced and labeled with
a `SYNTHESIS` block, kept separate from verbatim competitor copy.

This is a data-integrity rule applied to every deliverable that contains recommendations
or synthesized patterns alongside direct quotes. It prevents editorializing from
contaminating the verbatim copy bank, which is the primary input to ad creation.

From `run-retrospective.md`:
> "Any AI-invented message is fenced and labeled, kept separate from verbatim competitor
> copy. Data-integrity rule for every deliverable."

The market playbook brief enforces this on the "Recommended Messages" section:
> "The Recommended Messages section MUST be flagged with the SYNTHESIS block per the brief."

---

## Verification Layer 7 — Gate System (Research Quality Gates)

Two formal gates exist in the workflow. Both are Human judgment calls, not automated scores.

**Gate 1 (Phase 0) — Is the space worth pursuing?**

Formula: `Gap Score = [(Desire to Solve × D2C Feasibility) − Market Sophistication] × Market Growth`

Evidence required per axis (not a bare score):
- Desire to Solve: proven spend, core driver proximity, severity, frequency
- D2C Feasibility: mechanism efficacy, believability (UM + authority proof + social proof), economics
- Market Sophistication: claim count, enhanced claim count, competitor sophistication, UM availability
- Market Growth: trend velocity, adjacent trend signals

Quality check: the Gate-1 evidence dossier must be per-axis evidence, not a bare score.
Price-band reality vs $900 is mandatory in every profile.

**Gate 2 (Phase 2) — Do you want to commit to running ads for this market?**

Post-deep-research judgment: "Proven spend but easy competition" is the ideal. Strong UM +
easy competition are the biggest difference-makers. Framework structure locked; threshold
methodology is a downstream Under — calibrate after 2–3 runs.

---

## Retrospective Practice

After completing a milestone, Kam mines session transcripts for failures and new methodology
that was discovered but never folded back into the docs.

`run-retrospective.md` is the output of this practice for the e-ink arc (14 session
transcripts + 6 run-output clusters, covering April-May 2026). It is tagged by where each
finding should land:
- `[NEW]` — surfaced in sessions, nowhere in the docs
- `[HANDOFF-ONLY]` — captured in a handoff but missing from `workflow.md`
- `[STRATEGY]` — substantive product finding

**What a retrospective produces:**
- Corrections to methodology (e.g., the Ad Library Page-ID sanity check, saturation-per-cell rule)
- Durable tooling descriptions (e.g., `crowdfund-fetch.js`, `adlib-one.js`)
- Deliverable template formalizations
- Open gaps carried forward (e.g., VOC not run in Phase 0, authority-proof scanner missing)
- Architecture decisions (e.g., the 3-agent pattern, crash discipline at 60-65 tool uses)

---

## What a Handoff Validates

A `handoff.md` / `handoff-<topic>.md` is not just a status doc — it is the quality gate
and session-entry-point for the next Claude Code session. It must contain:

1. **Current state** — what was completed, method check results, output locations
2. **Read order** — the exact ordered list of files to read before doing anything
3. **What's locked** — vocabulary, phase structure, methodology corrections already in the framework
4. **What's open** — Foundational Unders, Downstream Unders, calibration items
5. **What comes next** — specific tasks with explicit scope limits
6. **What NOT to do** — explicit prohibitions based on prior failure modes
7. **Session scope discipline** — one deliverable per session; end when deliverable is written
8. **Kickoff prompts** — verbatim copy-paste prompts for launching each parallel session

**Quality signal in a handoff:** the "What NOT to do" section length. More prohibitions = more
prior failures surfaced and encoded. A thin "What NOT to do" section signals the handoff is
underspecified.

From `handoff.md`:
> "Don't conflate transformation / feature / mechanism."
> "Don't skip the Ad Library step. Even for free apps / non-DR brands."
> "Don't assume a niche before reading copy."
> "Don't bleed scope between the two parallel sessions."
> "Don't deep-dive Phase 2 in these scans. Selection only."

---

## Open Quality Gaps (from `run-retrospective.md` and `map/data_inventory.md`)

These are known holes in the current QA system, carried forward for resolution:

1. **VOC not run in Phase 0** — Gate-1 Desire to Solve (driver proximity, severity, frequency) requires VOC that Phase 0 doesn't produce. Decision pending: lightweight P0 VOC, proxy signals only, or rough Gate-1 recalibrated at Phase 3d.
2. **Authority-proof scanner absent** — Gate-1 D2C Feasibility "believability" axis has no capability mapped for authority proof assessment.
3. **Awareness-level inference** — Phase 4 awareness targeting has no dedicated synthesis step; classifier emits proxies but nothing aggregates them.
4. **Hypothesis-selection record schema missing** — hypothesis selection is an explicit Human step but has no documented record format.
5. **Actor/source tags on research questions** dropped inconsistently from `workflow.md` — need to specify which steps are Human vs AI vs VOC vs trends-tool.
6. **`workflow.md:344` contradiction** — still says the map/persistence layer "has to be designed before capability specs," which contradicts the 05-21 course correction; needs softening.

---

## Formatting / Style Rules That Enforce Quality

These are quality-enforcement rules, not stylistic preferences:

- **"Exact figures or 'not found'"** — never hand-wave numbers; if the corpus doesn't have it, say "not found"
- **Verbatim + source artifact** — every quoted element must carry a file path or URL; no floating quotes
- **N/A is valid for every field** — no force-fitting; absent data is marked N/A, not omitted
- **Distinguish synthesis from direct quotation** — plain text for analyst writing; quotes for verbatim
- **No em dashes** in deliverables (per teardown brief)
- **Dense over verbose** — framework-mapped responses; no filler
- **"Acknowledge what's locked vs open before reasoning"** (from `handoff.md` working notes)
- **"I'm not sure" beats confident bluffing** (from `handoff.md` working notes)

---

*Testing/verification analysis: 2026-06-01*
