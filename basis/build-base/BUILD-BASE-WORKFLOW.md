# Build-Base Setup Workflow

## ▼ TO RUN THIS — paste into a fresh session ▼
*To run the cleanup: open a new Cowork session, connect this base folder, attach your skill-builder + system-builder skills, and paste the block below. (Everything under it is the detail the session reads itself.)*

> You are the orchestrator of a one-time **build-base cleanup** job: turn this folder of pipeline design docs into a clean, reconciled, **well-organized**, indexed md base that future per-step build sessions can use without re-explanation — **and that the operator can navigate by eye.** **Read the rest of this file — `BUILD-BASE-WORKFLOW.md` in the connected base folder — and execute it.** Phase 0 is already done (the four `AUDIT-*.md` are consolidated); start at **Phase 1** and run Phases 1→7 in order. Spawn one **opus** subagent per phase; give each the context package this runbook names for its phase, but **never** prior conclusions about the docs (the Phase 1 reviewer reaches its own determination from a full read). **Be willing to cut:** the base contains hastily-assembled docs that are genuinely irrelevant to building forward — recommend reconcile / quarantine / **delete** as warranted, extracting any value first. **Organize the survivors into well-named, human-navigable folders** (each multi-file skill in its own folder, architecture docs together, reference material together) with clear renames — propose the folder map for ratification before moving. **Stop at every ★ operator gate** and wait for ratification before moving, renaming, or deleting anything. Use the operator-provided skill-builder / system-builder skills for Phase 4 and Phase 6; don't block on them. Begin by reading this file and listing the folder.

## ▲ end paste ▲

---

**Goal.** Turn the current doc pile into a clean, reconciled, **well-organized**, indexed **md base** so that each future *per-step build session* (and the birdseye *system-design* session) can be pointed at **one entry file (`INDEX.md`)** and build correctly **without the operator re-explaining context** — and so the **operator can parse the folder by eye**.

**Standing principles (apply to every phase):**
1. **No agent is spawned cold.** Each agent below has a named **context package** it must read before acting. (Operator requirement.)
2. **Reconcile, don't just supersede.** Where a doc holds current "sauce" mixed with stale info, move the sauce to its correct home and mark/quarantine the stale part — don't just tag the whole doc old.
3. **All agents are opus / extra-effort.** Operator gate between phases; the operator ratifies every status, reconciliation, and reorganization call.
4. **Human-navigable is a first-class goal.** The operator must be able to parse the folder by eye — well-named files grouped in well-named folders — even where that helps the human more than the agents.
5. **Scope:** this workflow *sets up the base*. It does **not** write the step prompts — that is the per-step build sessions, later. It also does not touch C1 (prompt mechanization) or C4 (field continuity).

*(Agent N runs in Phase N.)*

---

## Phase 0 — Consolidate (quick; operator + 1 file move)
- Move the four `AUDIT-*.md` files into the base folder so everything lives in one place. **(Done.)**
- Operator confirms the canonical home. **(Resolved: `C:\Users\kyu3\Claude\Projects\pmf3\build-base` — a persistent on-disk folder in the project. Point future sessions there.)**
- **Output:** one folder holding the whole base.

## Phase 1 — Inventory + Reconciliation Plan  → **Agent 1 (Doc-Status & Reconciliation Reviewer)**
This is a **dedicated reviewer agent that reaches its own determination** — not the orchestrator's assertion. It is given context but **not** any prior conclusions about which docs are stale/mixed/reconcilable, so its judgment is genuinely its own.
- **Assume the base is messy.** It was assembled fast and **contains hastily-slapped-together docs that are genuinely irrelevant to building the system forward.** The reviewer is expected to be willing to **cut**, not just reclassify: every doc lands as keep / reconcile / quarantine / **delete**. A doc that carries no value for future system-building is a legitimate delete-candidate — after any salvageable value is extracted first.
- **Context package (briefing, not conclusions):** the Goal + standing principles of this workflow; `SPEC-marketing-soundness.md`. It reads **every file in the base in full** itself. It is **not** handed the orchestrator's earlier provisional read.
- **Task:** produce a manifest, one row per doc — `{role, freshness: current|mixed|mostly-old, proposed_status: authoritative|reference|quarantine|superseded|delete-candidate, sauce_that_belongs_elsewhere, contradictions, reconcile_recommendation, proposed_folder}`. It must check for the general hazard class of **within-doc supersession** (current sauce mixed with overridden/old reasoning in the same file) and for cross-doc drift, and decide for itself where each lands.
- **Output:** `RECON-PLAN.md` (the manifest + a ranked reconciliation to-do).
- **★ Operator gate:** ratify each doc's status and each reconciliation call.

## Phase 2 — Reconcile content  → **Agent 2 (Reconciler)**
- **Context package:** the ratified `RECON-PLAN.md` + the docs it names.
- **Task:** execute only the ratified actions — move sauce to its correct home (attributed), collapse PART3's superseded order into a clearly-marked "SUPERSEDED — reasoning trail only, do not build from" appendix, reconcile PART2 ordering to R1, and **remove the docs the operator ratified as delete-candidates** (sauce extracted first). When in any doubt, quarantine rather than delete; hard-delete only what the operator explicitly approved. *(Physical foldering happens in Phase 3 — here, just fix content and mark what goes where.)*
- **Output:** reconciled docs; every deletion logged in `RECON-PLAN.md`.
- **★ Operator gate:** review diffs (and the deletion log).

## Phase 3 — Organize into well-named folders + rename  → **Agent 3 (Organizer)**
**Human-navigability is the point of this phase** — it helps the operator parse the folder even more than it helps agents. After junk is gone and content is reconciled, group the survivors into a clear folder tree and give files/folders clear, consistent names.
- **Context package:** the reconciled set + the Phase 1 manifest (each doc's role + `proposed_folder`) + the ratified `RECON-PLAN.md`.
- **Grouping rules:** each skill that spans multiple md files → its **own folder** (e.g. `/skills/<skill-name>/`); all architecture docs → `/architecture/`; the marketing-soundness Standard + Register + Directive → `/standards/`; reference/quarantined docs → `/reference/`; raw reviews + audits → `/reference/reviews/`; the workflow + `INDEX.md` stay at the **root**. The agent may **rename files and folders** for clarity (consistent, descriptive names) — names are part of the deliverable.
- **Two-step gate:** propose the **folder map + rename list first** for operator ratification; only then apply the moves/renames.
- **Output:** the organized tree + a **`MOVES-LOG.md`** recording every move and rename (`old path → new path`), so the next phase can repair links.
- **★ Operator gate:** ratify the proposed folder map/names before anything moves; review the tree after.

## Phase 4 — Engineer docs for AI pickup  → **Agent 4 (Doc-Cleanup)** + **Agent 4b (System-Cleanup)**
- **Context package:** reconciled docs; `MOVES-LOG.md`; the doc-engineering-for-AI principle set (below); `BUILDER-DIRECTIVE.md`; and — when they exist — the skill-builder and system-builder skill prompts (so cleanup matches how the builders will read).
- **Agent 4 (Doc-Cleanup), per file:** add front-matter `{status, role, read-with, supersedes}`, open each doc with a one-line "what this is / who reads it," normalize cross-references to stable anchors, and **repair every link/path changed by Phase 3 using `MOVES-LOG.md`.**
- **Agent 4b (System-Cleanup), across files:** verify cross-refs resolve, PART0's flow matches reconciled PART3, and no contradiction survives between files.
- **Doc-engineering-for-AI principles used:** single-purpose headers; status front-matter; stable anchors; minimum-feed slices (a reader can grab only what it needs); no buried supersession; an explicit "who reads this" line on every doc.
- **Output:** engineered docs.
- **★ Operator gate:** spot-check.

## Phase 5 — Index  → **Agent 5 (Index)**
- **Context package:** the engineered docs + the manifest + `MOVES-LOG.md` (final paths).
- **Task:** write `INDEX.md` — (1) one-paragraph "what this base is, read me first"; (2) a short **folder-tree map** so a human sees the layout at a glance; (3) manifest table with status **and folder location**; (4) **routing by session type** ("building step N → read these"; "system/birdseye pass → read these"); (5) supersession notes; (6) the pipeline step list with a pointer to each step's brief.
- **Output:** `INDEX.md` (the single entry point).
- **★ Operator gate:** read it.

## Phase 6 — Per-step briefs  → **Agent 6 (Brief-Builder)** (one per step, or batched)
- **Context package:** `INDEX.md` + reconciled PART3/PART0/PART1 + the as-ran prompt for that step + the KB scoping map (PART3 §7.2) + the AUDIT/PART4 findings for that step + `SPEC`/`Register`/`DIRECTIVE`.
- **Task:** for each pipeline step, write `STEP-NN-<name>.md` that **points** (not copies) to the exact slices that step's build session needs: its PART3 card, its PART0 step, its PART1 annotations, its soundness duties (§6.0), its adversarial findings, its as-ran prompt to revise, its KB digest pointers.
- **Output:** one thin brief per step.
- **★ Operator gate:** review **one** sample brief before the rest are generated. (This is the hardest phase — each brief needs a true read of that step's input needs.)

## Phase 7 — Cold-read validation  → **Agent 7 (Cold-Read Validator)**
- **Context package:** deliberately minimal — **only** `INDEX.md` + one `STEP-NN` brief. (Simulates a fresh build session with no operator context.)
- **Task:** determine what to build and what to read; report whether it could proceed and exactly what was missing or ambiguous.
- **Output:** gap report → fix loop on the index/brief that failed.

---

## Open decisions (set before Phase 1)
- **Dep-1 — builder skills not built yet.** Phase 4 cleanup is better if it can read the skill-builder/system-builder prompts. Either (a) run cleanup now against `BUILDER-DIRECTIVE` and re-tune lightly once those skills exist, or (b) build those two skills first. *(Recommended: a.)*
- **Dec-2 — doc-engineering principles source.** Use the compact principle set above, or extract from an operator-supplied source / the skill-builder prompt.
- **Home/stability — RESOLVED.** Canonical home is `C:\Users\kyu3\Claude\Projects\pmf3\build-base` (persistent, on disk). The earlier app-internal session-scratch copy is obsolete.

## How this runs
Either the orchestrator runs Phases 0–7 directly this session (opus agents, operator gates between phases), or this runbook is packaged as an installable Skill so a future session can invoke it. The runbook is the source of truth either way.
