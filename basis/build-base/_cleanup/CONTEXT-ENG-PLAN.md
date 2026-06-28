---
status: process-record
role: The context-engineering plan for producing the one-shot shell-build entry point (ONE-SHOT-SHELL.md). What the entry file contains, the reading path it routes, what is quarantined, the §8 choices resolved, and the preservation ledger.
read-with:
  - ONE-SHOT-SHELL.md
  - HANDOFF-context-engineering.md
  - SHELL-BUILD-SPEC.md
supersedes: []
---

> **What this is:** the plan the context-engineering session wrote before producing the deliverable. **Read by:** the operator (to see what was done and why) and any session auditing the entry file against its sources. **Snapshot date:** 2026-06-26. **Companion deliverable:** `build-base/ONE-SHOT-SHELL.md`.

# CONTEXT-ENGINEERING PLAN — the one-shot shell-build entry point

## 0. Mission (restated, so this plan stands alone)

Package this project so the operator can hand GSD **one file path** and get back the **runnable shell** of the marketing pipeline (Steps 0–10): wiring complete, end-to-end runnable on stub prompts, the only not-yet-good thing being marketing judgment. The deliverable is a single **goal-framed** entry file — it states the GOAL + requirements + success criteria + sources, and does **not** prescribe how GSD builds (GSD owns the HOW). Source of record for the mission: `build-base/HANDOFF-context-engineering.md`.

This plan covers the three phases the handoff ordered: (1) research/orient — done; (2) this plan; (3) the entry file + verification.

## 1. What the research confirmed (so the entry file routes the right things)

The wiring story is sound end-to-end at the **artifact grain**, which is the only grain the shell needs:

- **Canonical R1 step order** is settled (`PART0`; `PART3 §1.5/§1.6`), Steps 0→10: Bet → Collect → Funnel analysis → Space map → VOC market pass → Market selection → VOC deep pass → Funnel architect → Copywriter → Asset classify → Adversarial re-review.
- **The shell is six components, all already specified** (`SHELL-BUILD-SPEC §3`): artifact store · run-controller (`PART3 §8`) · per-step manifests · prompt stubs · loose validators · mock-mode e2e smoke test.
- **A producer→consumer cross-check of all 11 step briefs found zero orphan outputs and zero hard dangling inputs.** Every declared artifact has a downstream consumer (or is a terminal/operator-facing artifact); every consumed artifact has an upstream producer. The only "open" inputs are the **deferred content slots** (○): field-level schemas, test content, currency model, prompt bodies — exactly the things shell-first defers. This is the evidence that the shell is one-shottable now.
- **The glue is built and proven, not hypothetical.** `build-base/engine/` holds 26 deterministic capabilities + the firing layer (validators, router, DR-injectors) + deploy integrations + schemas; `bash engine/contracts/h6-all.sh` → **14/14 green**. GSD **assembles + orders** these bricks into the run-controller and manifests per the architecture's blueprint; it does **not** rewrite the glue. The marketing PROMPTS are deliberately NOT in the engine — they are the drop-in slots.

Implication for the entry file: it must (a) point GSD at the architecture as the authority for the wiring/order, (b) point GSD at the engine index as the raw material to reuse, and (c) state the shell-as-outcome and its success test — without dictating the build.

## 2. What the entry file contains (inline vs route)

Per the handoff's "inline the WHAT, route the wiring" rule, `ONE-SHOT-SHELL.md` will:

**Inline verbatim (the WHAT — so the file survives on its own):**

- The **goal in one breath** (runnable shell of Steps 0–10 on stub prompts; real prompts + field schemas are drop-in slots; only marketing judgment is deferred).
- The **precedence rule**, quoted verbatim from `SHELL-BUILD-SPEC §0` with its source path.
- The **scope guard** — operate inside `build-base/` only — with the reason (root mixes two projects; `UNTRACKED-FILES-REPORT.md`).
- The **five locked operator decisions** (handoff §4 / `STATE-OF-PROJECT.md §5`), including the CLAIM-LIST producer, the architect's required inputs, the two-tier angle/claim/transformation, the precedence ruling, and shell-first.
- The **definition of done** as success criteria (outcomes), quoted from `SHELL-BUILD-SPEC §11`.
- A compact **artifact-slot orientation** (the canonical per-step reads/writes as paths) — explicitly labeled a *derived view* of `PART0` + `PART3 §5.2/§9` + the briefs, with those routed sources named authoritative and nothing reproduced as contract.

**Route by exact path (the wiring GSD derives from — not transcribed):**

- The architecture's **orchestration design** (`PART3 §8`), **seam list** (`PART3 §9`), **consumption matrix** (`PART3 §5.2`), and **canonical order** (`PART3 §1.5/§1.6`, narrated in `PART0`); per-step manifest detail in `PART3 §6.x` and the 11 `briefs/STEP-NN-*.md`.
- The **engine glue index** to reuse: `engine/WIRING-BUNDLE.md`, `engine/contracts/REGISTRY.json` (`.md` human view), `engine/contracts/REUSE-INDEX.md`, `engine/FIRING-MANIFEST.md`, `engine/DEPENDENCIES.md`, `engine/contracts/enums.json` + `schemas/`.
- The **artifact-store convention** to copy: `reference/as-ran-repo/asran-repo-report.md` + `repo-files/runs/arduview/`.
- The **soundness triad** that governs the prompt-stub envelope: `standards/SPEC-marketing-soundness.md`, `standards/marketing-rule-register.md`, `standards/BUILDER-DIRECTIVE.md`.
- The **prompt-stub envelope template**: the one built step, `skills/bet-compiler/SKILL.md`.
- **`SHELL-BUILD-SPEC.md`** as *optional background* (the WHAT/contracts were distilled from it) — explicitly NOT a mandated procedure; its manifest/stub/run-controller mechanics are not transcribed as mandates.
- **`PART5--production-and-launch.md`** as the deferred Phase B (append-only future extension; not built into the shell).

**Deliberately NOT in the entry file:** any build recipe, mandated file formats, step-by-step scaffold, prompt bodies, or field-level schemas. GSD owns those.

## 3. The minimal ordered reading path the entry file routes

The entry file presents the source set roughly in the order GSD benefits from reading it: orientation (`STATE-OF-PROJECT`) → the wiring spine (`PART0`, then `PART3 §8/§9/§5.2/§1.5-1.6/§6.x`) → the glue to assemble (`engine/` index) → the artifact-store convention (as-ran repo) → the envelope template + soundness triad (`bet-compiler SKILL`, `standards/`) → optional background (`SHELL-BUILD-SPEC`) → deferred (`PART5`). This mirrors §5a of the handoff with exact paths.

## 4. What gets quarantined (and how)

- **Scope is `build-base/` only.** The entry file says so explicitly and tells GSD not to reach into the `pmf3/` root, `kb/`, or `skills/` (except the two tracked builder skills), per `UNTRACKED-FILES-REPORT.md` and handoff §5e/§5f.
- **Reference-only set** (`PART1`, `PART3-READER`, `reference/reviews/*`, `reference/handoffs/*`, `EXTERNAL-INPUTS-MAP.md`, `_cleanup/*`): the entry file notes these exist as context but tells GSD it does **not** need to reach into them to derive the shell — they are not scope sources.
- **Phase B (`PART5`)**: referenced as a deferred, append-only extension; explicitly out of scope for the shell (Steps 0–10 only).
- **Superseded trail** (`PART3 §4.x`, pre-R1 phrasing in §6.4/§6.7): the entry file flags that build order comes from §1.5/§1.6 (or PART0), never from §4.x.

## 5. The §8 choices, resolved

- **Build recipe vs goal-only — GOAL-ONLY** (operator-resolved). The entry file states goal + requirements + success criteria + sources; it pre-builds no scaffold and prescribes no procedure.
- **Inline vs route — both, split by kind** (per §2 above): inline the goal, precedence, scope, operator decisions, and success criteria verbatim; route by exact path to the architecture/engine sources GSD derives wiring from. Build mechanics are neither inlined nor mandated.
- **One file vs one file + curated pack — ONE FILE, route by exact path; NO `builder-pack/`.** Rationale: GSD operates inside `build-base/` and can read every routed source by its exact path, so a pack of copies would only duplicate authoritative files and create a second, drift-prone source of truth — against the handoff's non-lossy / originals-stay-authoritative rule (§6). Routing is cleaner and keeps a single source of truth. (If a future operator wants a portable pack, it can be added later as copies/pointers without changing the entry file's role.)

## 6. Preservation ledger (mandatory; additive-only session)

**`build-base/` top-level — before:** 16 entries = 9 files (`BUILD-BASE-WORKFLOW.md`, `HANDOFF-context-engineering.md`, `INDEX.md`, `OPEN-DECISIONS.md`, `SHELL-BUILD-SPEC.md`, `STATE-OF-PROJECT.md`, `UNTRACKED-FILES-REPORT.md`, `pipeline-agent-map.html`, `pipeline-agent-map-compact.html`) + 7 dirs (`_cleanup`, `architecture`, `briefs`, `engine`, `reference`, `skills`, `standards`).

**`build-base/` top-level — after:** 17 entries = 10 files (+ `ONE-SHOT-SHELL.md`) + the same 7 dirs.

**`build-base/_cleanup/` — before:** 4 files (`MOVES-LOG.md`, `MOVES-PLAN.md`, `RECON-PLAN.md`, `SKILL-USAGE-PLAN.md`). **after:** 5 files (+ `CONTEXT-ENG-PLAN.md`).

**Files created this session (3 changes, all additive):**
1. `build-base/_cleanup/CONTEXT-ENG-PLAN.md` — this plan (new).
2. `build-base/ONE-SHOT-SHELL.md` — the entry file (new).
3. `build-base/INDEX.md` — **append-only** edit (one manifest row + one routing line); no section deleted, replaced, or reordered.

**Preservation rule honored:** no existing file is deleted, moved, renamed, or truncated. The only edit to a pre-existing file is the additive INDEX append. A post-write check confirms every pre-existing file's byte size is unchanged except `INDEX.md`, which only grows. Nothing in handoff §5e is touched.

## 7. Verification (how the entry file is checked before handing it over)

- **Dry trace:** confirm that GSD, reading only what the entry file routes, can derive a shell that (a) lays out `runs/<space>/`, (b) sequences Steps 0–10 per `PART3 §8`/`§1.5-1.6`, (c) gives each step its declared artifact I/O from `PART0`/`§5.2`/`§9`/the briefs, (d) assembles the engine bricks via the engine index rather than rewriting glue, (e) runs e2e on stubs, and (f) meets the `run all --space=smoke` success criterion — with no reach into the reference-only set. The producer→consumer cross-check (research phase) already shows the artifact graph closes with no orphans/dangling inputs, which is the core of this trace.
- **Self-containment:** confirm every inlined load-bearing rule is reproduced verbatim with its source path, and every routed path resolves to a real file in `build-base/`.
- **Preservation check:** re-list `build-base/` and confirm the ledger in §6 (counts + no shrink).

## 8. The one line back to the operator

Hand GSD this single path: **`build-base/ONE-SHOT-SHELL.md`**.
