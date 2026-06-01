# Framework Concerns

**Analysis Date:** 2026-06-01

---

## Priority 1 — Source-of-Truth Conflicts (High Impact)

### workflow.md Line 344 Contradicts the 05-21 Course Correction

- **Issue:** `workflow.md` line 344 cross-cutting note still reads: "Map / persistence layer: every capability writes to and reads from a shared store. Foundational Under — **has to be designed before capability specs.**" This is a hard gate claim that was explicitly reversed by the course correction on 2026-05-21.
- **Files:** `workflow.md:344`, `capability_inventory.md` (Foundational Unders section, now says "deprioritized"), `run-retrospective.md:249`
- **Impact:** A new session reading `workflow.md` cross-cutting notes gets a contradictory signal vs `capability_inventory.md`. The retrospective explicitly flags this: "The `workflow.md:344` system note still says the map/persistence layer 'has to be designed before capability specs' — contradicts the 05-21 course correction."
- **Fix:** Soften `workflow.md:344` to match `capability_inventory.md`'s language: "deprioritized; build just-in-time when manual friction justifies it."

---

### README.md Is Stale on Multiple Points

- **Issue:** `README.md` claims: (a) `workflow.md` covers "Phase −1 → 8" — no Phase -1 exists in `workflow.md`; (b) `agents/` is "not yet written; gated on map layer" — but `agents/implementation-notes.md` exists and the map-layer gate was lifted by the 05-21 course correction; (c) layout lists `map/` as "persistence layer design (foundational Under #1)" with no caveat that this is deprioritized.
- **Files:** `README.md:10`, `README.md:15`, `README.md:14`
- **Impact:** README is the first file a new session may read (it says "Entry point: `handoff.md`" but someone could read it cold). All three errors point away from the actual current state.
- **Fix:** Remove Phase -1 reference, update `agents/` description to reflect `implementation-notes.md` existence and the lifted gate, add deprioritized caveat on `map/`.

---

### flow.md Phase Numbering Diverges from workflow.md

- **Issue:** `flow.md` uses a different phase structure than `workflow.md`. In `flow.md`, "Phase 1: Sketch Your Competition" contains the Gap Analysis Agent and Gate 1 scoring — which `workflow.md` places in Phase 0. `flow.md` Phase 1 maps roughly to `workflow.md` Phases 0+1 combined. `flow.md` does not mention "Phase 1 — Theorize" at all, and Phases 4–8 are collapsed into a single stub with no sub-phase breakdown.
- **Files:** `flow.md:19-107`, `workflow.md:11-354`
- **Impact:** `flow.md` is untracked and appears to be a newer, parallel rewrite of the orchestration layer (it references `!Agent` directives and three layers that don't exist elsewhere). A session reading `flow.md` as the canonical flow will mis-route the Gap Analysis to Phase 1 instead of Phase 0. The two docs cannot both be correct simultaneously.
- **Impact severity:** High — if `flow.md` is adopted as the session entry point (it's listed in the kickoff reading order for `handoff-granular-analysis.md`: it isn't, but `flow.md` as an untracked file with no pointer to it creates confusion), a session will misframe which gate belongs to which phase.
- **Fix:** Either (a) reconcile `flow.md` with `workflow.md` phase numbering and mark `flow.md` as the operational layer-1 skeleton explicitly subordinate to `workflow.md`, or (b) deprecate `flow.md` in favor of the `prompts/phase1-light-pass.md` approach. Currently neither doc references the other.

---

## Priority 2 — Handoff Document Proliferation (Medium-High Impact)

### Three Handoff Docs With No Explicit Relationship

- **Issue:** The repo has three handoff files — `handoff.md`, `handoff-granular-analysis.md`, `handoff-crowdfunding-teardown.md` — plus `run-retrospective.md` that functions as a fourth session-state document. `README.md` points only to `handoff.md` as the entry point. The other two are untracked and contain kickoff prompts for work that `handoff.md` does not mention (the granular analysis pass and the crowdfunding teardown are not in `handoff.md`'s "What comes next" section).
- **Files:** `README.md:6`, `handoff.md`, `handoff-granular-analysis.md`, `handoff-crowdfunding-teardown.md`
- **Impact:** A session following `README.md` → `handoff.md` will not discover that there are two additional active work streams with their own kickoff prompts. The granular analysis work (`handoff-granular-analysis.md`) already produced 10 per-brand `granular-analysis.md` files and 4 market playbooks — yet `handoff.md` does not reflect this state at all (it still shows "Two parallel market scans now queued: Students and Dumb Device" as the current state, which is superseded). `handoff.md` was last updated 2026-05-23; the granular analysis and crowdfunding teardown runs occurred after.
- **Fix:** Either update `handoff.md` to reflect all completed work and point to the other handoff docs as context, or establish a clear session-state precedence rule (e.g., `run-retrospective.md` is always the latest state and supersedes `handoff.md`).

---

### handoff.md "Current State" Is Superseded

- **Issue:** `handoff.md` current state section (dated 2026-05-23) describes the Faith market scan as the most recent completed work and lists Students and Dumb-Device as "queued." In reality, both those market scans are complete (profiles exist at `runs/eink-tablets/markets/students/students-market-profile.md` and `runs/eink-tablets/markets/dumb-device/dumb-device-market-profile.md`), the Gate 1 three-way comparison produced `runs/eink-tablets/market-opportunity.md`, the granular analysis pass produced all 10 `granular-analysis.md` files and 4 market playbooks, and the crowdfunding teardown produced `runs/eink-tablets/crowdfunding-corpus/teardown.md`.
- **Files:** `handoff.md:4-21`, run artifacts throughout `runs/eink-tablets/`
- **Impact:** Any session that reads `handoff.md` first (as instructed by `README.md`) will have a false picture of current state and may re-run completed work.
- **Fix:** Update `handoff.md` to reflect the actual current state. `run-retrospective.md` contains the accurate synthesis but is not linked from `handoff.md` or `README.md`.

---

## Priority 3 — Uncommitted Work and Artifact Gaps (Medium Impact)

### Critical Framework Files Are Modified but Uncommitted

- **Issue:** `capability_inventory.md`, `handoff.md`, and `workflow.md` are all modified locally (shown in `git status`) but not staged. If a session crashes or the branch is reset, the current state of these three core framework docs is lost.
- **Files:** `capability_inventory.md` (M), `handoff.md` (M), `workflow.md` (M)
- **Impact:** These are the three most-read docs in the system. Loss of uncommitted changes means loss of the 05-21 course correction language in `capability_inventory.md`, the updated `handoff.md` state, and any `workflow.md` reconciliation edits.
- **Fix:** Commit these three files. Branch is `eink-phase0-run`; they should be committed before the next session launches.

---

### Large Volume of Untracked Run Artifacts

- **Issue:** ~100+ files under `runs/eink-tablets/adlibrary/`, all market profiles, all marketing-corpus brand files, all crowdfunding-corpus files, `flow.md`, `handoff-granular-analysis.md`, `handoff-crowdfunding-teardown.md`, `run-retrospective.md`, `prompts/`, `agents/`, and `.claude/` are untracked. The entire research output of the eink-tablets run is not committed.
- **Files:** Everything in `git status` untracked list
- **Impact:** Research outputs are ephemeral. A `git checkout` or branch operation against main would not recover any of the run artifacts. The `run-retrospective.md` explicitly says these artifacts are the de facto persistence layer.
- **Fix:** Commit run artifacts to the branch, or establish an explicit policy that `runs/` is gitignored (currently it is not). Either choice should be documented.

---

### adlibrary/ Has 22 .txt Files With No Matching .png

- **Issue:** 22 adlibrary entries have a `_adv.txt` file but no matching `_adv.png`: `daylight-kw`, `diptyx`, `freewrite-alpha`, `freewrite-final`, `freewrite-smart-typewriter`, `freewrite-smart`, `freewrite-tightq`, `freewrite`, `freewrite_adv` (doubled suffix), `in-touch-bible-tablet`, `ipad`, `microsoft-surface`, `mudita-kompakt`, `mudita`, `one-sec-v2`, `one-sec`, `opal-focus`, `opal-kw`, `punkt-ch`, `punkt`, `test`, `yondr-us`.
- **Files:** `runs/eink-tablets/adlibrary/` (all listed above)
- **Impact:** Visual ad data for these brands is missing. The granular analysis pass notes this gap (Pass 0 was supposed to capture screenshots; `handoff-granular-analysis.md` acknowledged "audit showed 0 screenshots across all 10"). Any future pass building on this adlibrary corpus will have uneven data quality — text-only entries vs. png+text entries.
- **Additional anomaly:** `freewrite_adv_adv.txt` exists (doubled `_adv` suffix) alongside `freewrite_adv.txt` — likely a naming collision from two separate fetch runs. `test_adv.txt` contains an iPad query run under the slug "test" — orphaned test artifact.
- **Fix:** Document which brands intentionally have no visual (e.g., brands with no running Meta ads) vs. which are fetch failures. Delete `test_adv.txt`. Rename `freewrite_adv_adv.txt` or delete the duplicate.

---

### daylight-kids Missing notes-pass0-fetch.md

- **Issue:** `runs/eink-tablets/marketing-corpus/daylight-kids/` does not have `notes-pass0-fetch.md` while all other 9 brands in the 10-brand set do. The Pass 0 supplementary fetch step in `handoff-granular-analysis.md` required this file for every brand.
- **Files:** `runs/eink-tablets/marketing-corpus/daylight-kids/` (missing `notes-pass0-fetch.md`)
- **Impact:** Unknown what screenshots or deposit-funnel data was found/missed for daylight-kids. The granular-analysis.md exists for daylight-kids but its Pass 0 supplement is undocumented.
- **Fix:** Either run the Pass 0 step for daylight-kids and write the missing file, or add a note to the brand's `notes.md` explaining why it was skipped.

---

### winning-message-analysis.md Exists Only for daylight-dc1

- **Issue:** `run-retrospective.md:88` describes the "winning-message analysis" as a durable per-brand output schema (7-section portability-oriented extraction). Only `runs/eink-tablets/marketing-corpus/daylight-dc1/winning-message-analysis.md` exists; none of the other 9 brands have it.
- **Files:** `runs/eink-tablets/marketing-corpus/daylight-dc1/winning-message-analysis.md`; absent for all other brands
- **Impact:** If the winning-message analysis is used as input to future funnel work (the retrospective says it's built to "lift a competitor's persuasion into a different funnel"), having it for only one brand creates an asymmetric corpus.
- **Fix:** Either run the winning-message analysis for the remaining 9 brands, or document in `handoff.md` that this is a partial artifact and only daylight-dc1 was prioritized.

---

## Priority 4 — Undocumented Files and Orphaned Artifacts

### prompts/ and flow.md Have No Pointer From Any Navigation Doc

- **Issue:** `prompts/phase1-light-pass.md` is a substantial spec (350 lines) containing JSON schemas, agent prompts, hook configs, and a deterministic scaffold for Phase 1. `flow.md` is a high-level flow skeleton (107 lines) designed as a three-layer architecture. Neither file is referenced from `README.md`, `handoff.md`, `workflow.md`, or `capability_inventory.md`. There is no way to discover either file by following the documented reading order.
- **Files:** `prompts/phase1-light-pass.md`, `flow.md`
- **Impact:** These are advanced work products — `phase1-light-pass.md` in particular contains the most detailed agent specs in the repo (including hook rejection rules and JSON schemas not found elsewhere). If not discoverable, they cannot be reused.
- **Fix:** Add `prompts/` and `flow.md` to `README.md` layout. `flow.md` should be cross-referenced from `workflow.md` as the operational layer-1 companion (once the phase-numbering divergence in concern #3 is resolved).

---

### M1-paper-replacement/_drafts/supernote-deep.md Is Orphaned

- **Issue:** `runs/eink-tablets/marketing-corpus/markets/M1-paper-replacement/_drafts/supernote-deep.md` exists with no reference to it from any brief, playbook, or handoff. The `_drafts/` directory exists in only M1 and not in M2, M3, or M4.
- **Files:** `runs/eink-tablets/marketing-corpus/markets/M1-paper-replacement/_drafts/supernote-deep.md`
- **Impact:** Unknown whether this is work in progress toward an M1 deep-dive or an abandoned draft. No session is aware of it.
- **Fix:** Read the file and either promote it to the M1 corpus or delete it.

---

### ADHD Market Referenced in market-opportunity.md Has No markets/ Directory

- **Issue:** `runs/eink-tablets/market-opportunity.md` covers four adjacent markets: "faith/devotional, digital minimalists, students, ADHD adults." Three of the four have `markets/` directories (`faith`, `dumb-device` covers digital minimalists, `students`). ADHD adults does not have a directory. The document discusses ADHD at meaningful depth ("The ADHD sub-niche within this market has the clearest hardware gap").
- **Files:** `runs/eink-tablets/market-opportunity.md`, `runs/eink-tablets/markets/` (no `adhd/` dir)
- **Impact:** It is unclear whether ADHD was analyzed as a sub-niche of Students or Dumb-Device (no brands dir), or whether it was written as synthesis in `market-opportunity.md` without a dedicated scan. If a future session runs an ADHD-targeted scan, it will not know whether this work has already been done.
- **Fix:** Clarify in `handoff.md` whether ADHD is a validated market candidate (with a scan) or a synthesis note in `market-opportunity.md` only. If the latter, add a note in `market-opportunity.md` itself.

---

## Priority 5 — Workflow Gaps Documented but Not Resolved

These gaps are catalogued in `run-retrospective.md:237-249` and `map/data_inventory.md:700-711` but have not been addressed in `workflow.md` or `capability_inventory.md`. Listed here for completeness; the retrospective already prescribes remedies.

### Gate 1 Needs VOC That Phase 0 Doesn't Produce

- **Issue:** Gate 1's "Desire to Solve" requires core-driver proximity, severity, and frequency — all of which come from the VOC chain (classifier + frequency synthesizer). Phase 0 as specified in `workflow.md` does not run VOC. The current workaround in the eink runs was using ad library data and review signals as proxies, which is undocumented.
- **Files:** `workflow.md:27-38` (Phase 0 Gap analysis), `map/data_inventory.md:497-498`
- **Fix per retrospective:** Either (a) add lightweight VOC to Phase 0 scope, (b) document that Desire to Solve uses proxy signals at Gate 1 and upgrades at Phase 3d, or (c) relabel the gate.

### No Capability for Authority-Proof Scanning

- **Issue:** Gate 1 D2C Feasibility "believability — authority proof" has no mapped capability in `capability_inventory.md`. Every other Gate 1 sub-variable has a named Op.
- **Files:** `capability_inventory.md`, `map/data_inventory.md:502-503`

### Hypothesis-Selection Has No Record Schema

- **Issue:** The explicit Human step between Phase 0 and Phase 1 is locked as first-class, but `map/data_inventory.md` flags that the actual procedure used (3 candidate markets → parallel scans → Gate 1 cross-comparison → pick) has no schema or persistent record format.
- **Files:** `map/data_inventory.md:524-527`, `workflow.md:44-46`

### Actor/Source Tags Dropped from workflow.md

- **Issue:** The original planning doc had actor/source tags on each research question (human / AI / VOC / glimpse-trends). The `workflow.md` reconciliation note acknowledges these were "dropped inconsistently." Without them, it is ambiguous who does each step and from what source.
- **Files:** `workflow.md:353` (reconciliation note), `run-retrospective.md:248`

### run-retrospective.md §8 Recommendations Not Yet Folded In

- **Issue:** `run-retrospective.md` §8 contains explicit fold-in recommendations: a list of items to add to `workflow.md`, `agents/implementation-notes.md`, and `capability_inventory.md`, plus a new `deliverable-templates.md` to create. None of these changes have been made.
- **Files:** `run-retrospective.md:222-249`
- **Impact:** The retrospective itself is untracked and not linked from `handoff.md` or `README.md` — so its recommendations are in danger of being lost or ignored in the next session.
- **Fix:** Either action the §8 fold-ins now, or add a pointer in `handoff.md` to `run-retrospective.md` with a note that §8 is the pending backlog.

---

## Summary: Highest-Risk Items

| # | Item | Files | Risk |
|---|---|---|---|
| 1 | `workflow.md:344` hard gate contradicts 05-21 course correction | `workflow.md`, `capability_inventory.md` | Misleads a session into waiting for the persistence layer |
| 2 | `handoff.md` current state is ~3 weeks stale | `handoff.md`, all run artifacts | Session re-runs completed work or misses done deliverables |
| 3 | `flow.md` phase numbering conflicts with `workflow.md` | `flow.md`, `workflow.md` | Gate 1 routed to wrong phase; framework confusion |
| 4 | Modified `capability_inventory.md`, `handoff.md`, `workflow.md` uncommitted | git status | State loss on branch reset |
| 5 | `prompts/phase1-light-pass.md` and `flow.md` undiscoverable | `README.md` | Most detailed agent specs in repo never found |
| 6 | `run-retrospective.md` not linked, §8 recommendations unactioned | `README.md`, `handoff.md` | Full session learnings not folded into framework |

---

*Concerns audit: 2026-06-01*
