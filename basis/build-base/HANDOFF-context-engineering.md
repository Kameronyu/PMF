---
status: authoritative
role: Handoff brief for a fresh CONTEXT-ENGINEERING session. Mission → phases → strategy → full file map → guardrails → the one-file deliverable. Hand this whole file to that session to start.
read-with:
  - STATE-OF-PROJECT.md
  - SHELL-BUILD-SPEC.md
  - INDEX.md
supersedes: []
---

> **What this is:** the brief that starts the context-engineering session. **Read by:** the research/context-engineering agent, first and in full. **Repo root (work here):** `C:\Users\kyu3\Claude\Projects\pmf3\`. All paths below are **repo-relative** to that root. **Snapshot date:** 2026-06-26.

# HANDOFF — Context-Engineering Session: produce a one-shot shell-build entry point

## 0. Mission (the end goal — read this twice)

Package this project so the operator can **drop ONE file path into GSD** (Claude's autonomous "Get Shit Done" project build system, which owns the HOW) and it will build the **runnable shell** of the marketing pipeline — wiring complete, end-to-end runnable on stub prompts — **with no hand-holding.** The only thing allowed to be mediocre is marketing judgment (deferred). The plumbing must be correct: every step's output is consumed by the right downstream step, no orphan outputs, no dangling inputs, deterministic routing, the run completes.

Your job is **context engineering**, not pipeline design (that's done) and not prompt-writing (that's deferred). You research, write a plan, then produce the curated entry point.

## 1. Your three phases

1. **Research / orient.** Read the BUILD-FROM set in §5a (and skim the reference set in §5d only enough to confirm precedence and the seams). Confirm the wiring story end-to-end. Do **not** sink time into the do-not-build-from mass.
2. **Write a plan.** A short context-engineering plan: exactly what the one-shot entry file contains, the minimal ordered reading path it routes (or inlines), what gets quarantined, and the open choices in §8 resolved. Save it as `build-base/_cleanup/CONTEXT-ENG-PLAN.md`.
3. **Execute.** Produce the deliverable in §2. Verify it against the definition of done in §7.

## 2. The deliverable — ONE entry file (for GSD)

**Audience: GSD, which owns the HOW.** So the entry file states **the GOAL and the requirements — NOT a build recipe.** Describe *what* a finished shell is and *what* it must satisfy; do **not** prescribe *how* GSD builds it (no mandated file formats, no step-by-step procedure, no scaffold GSD must follow). The goal is: **the shell.**

Produce a single self-contained file — propose `build-base/ONE-SHOT-SHELL.md`. It must contain (inline or by tight, exact-path routing):

- **The goal, in one breath:** a runnable shell of the marketing pipeline (**Steps 0–10**) that runs end-to-end on stub prompts, where real prompts and field-level schemas are drop-in slots, and the only thing not-yet-good is marketing judgment.
- **The precedence rule + the scope guard** ("operate inside `build-base/` only"; architecture > as-ran).
- **The requirements / contracts to honor (the WHAT, not the how):** wire at the artifact grain (steps are black boxes that read/write declared artifacts in `runs/<space>/`); honor the architecture's own orchestration design and seams as *requirements* — route to `PART0`, `PART3 §8` (orchestration), `§9` (seams), `§5.2` (consumption matrix); prompts + field schemas are deferred slots; **reuse the existing glue** in `build-base/engine/` (§5a) — the fetch/process bricks, validators, integration drivers, and schemas already exist, so GSD assembles + orders them rather than writing the glue from scratch; the operator decisions in §4.
- **The minimal source set** (§5a) with exact paths — what GSD reads to derive the wiring.
- **The definition of done (success criteria, NOT method):** the shell runs all 11 steps end-to-end on stub prompts — every declared artifact produced and consumed, no orphan outputs, no dangling inputs, deterministic routing, run completes. State it as an *outcome GSD must achieve*; GSD decides how to scaffold and verify.

Leave the build mechanics to GSD. `build-base/SHELL-BUILD-SPEC.md` is **your background** for deriving the goal + contracts — route to it as optional reference, but do **not** transcribe its manifest/stub/run-controller mechanics into the entry file as mandates.

The test of success: the operator hands that one path to GSD and gets a wired shell back.

## 3. The strategy you are packaging (already decided — do NOT re-litigate)

- **Shell vs content.** The shell (orchestrator, artifact store, contracts, validation, gates) is mechanism and is buildable now. Prompts and field-level schemas are deferred drop-in slots.
- **Wire at the ARTIFACT grain, not the PROMPT grain.** Steps are black boxes that read/write declared files in `runs/<space>/`. Whether a step is 1 prompt or N agents is internal and deferrable (PART2 Job 6). "We don't know the prompt division yet" blocks nothing.
- **The shell = six components:** artifact store · run-controller (`PART3 §8`) · per-step manifests · prompt stubs · loose validators (presence now, field-congruence later) · a mock-mode e2e smoke test. Full detail in `build-base/SHELL-BUILD-SPEC.md`.
- **Precedence (rule #1):** `standards/` → **build-base architecture** → the built `bet-compiler` SKILL → **as-ran repo = reference only.** On any scope disagreement, the architecture wins; as-ran is evidence (vocabulary / feasibility / failure record), never contract.

## 4. Decisions locked this session — fold these into the entry file

(Source of record: `build-base/STATE-OF-PROJECT.md §5`; also annotated on the agent map.)

1. **Step 0 (Bet Compiler) produces `runs/<space>/asset-classify/CLAIM-LIST.json`** — the product's own capability-claim ledger with a best-guess `load_bearing` flag; consumed by Step 9. Distinct from the bet-brief's *competitor* claim-type enum.
2. **The Funnel Architect explicitly consumes the bet-brief AND the product spec/intake `.md`** (required inputs).
3. **Angle/claim/transformation is two-tier:** Section Analyzer (Step 2) emits *raw* per-funnel values; Space Classifier (Step 3) *canonicalizes* across all funnels.
4. **Source-of-truth precedence** as in §3.
5. **Build strategy = shell-first** (this whole handoff).

## 5. Complete file map (all paths, repo-relative to `pmf3/`)

### 5a. BUILD-FROM — the minimal ordered builder set (route THIS, in THIS order)
1. `build-base/STATE-OF-PROJECT.md` — orientation: what's built/decided/open/next.
2. `build-base/SHELL-BUILD-SPEC.md` — the build procedure (the spec the entry file distills).
3. `build-base/architecture/PART0--pipeline-flow.md` — the e2e flow (each step ingests→emits→feeds); the wiring spine.
4. `build-base/architecture/PART3--architecture-design.md` — read specifically **§8** (orchestration / the run-controller), **§9** (the seam list), **§5.2** (the file-level consumption matrix), **§1.5/§1.6** (canonical R1/R2 step order), **§6.x** (per-agent cards for manifest detail). NB **§4.x is superseded** — topology reference only, do not build order from it.
5. `build-base/standards/SPEC-marketing-soundness.md`, `build-base/standards/marketing-rule-register.md`, `build-base/standards/BUILDER-DIRECTIVE.md` — the soundness triad (governs the prompt-stub envelope; content deferred).
6. `build-base/skills/bet-compiler/SKILL.md` — the ONE built step = the prompt-stub envelope template (OUTPUT CONTRACT + COMPLETENESS + HOW-IT'S-CONSUMED).
7. `build-base/reference/as-ran-repo/asran-repo-report.md` + `build-base/reference/as-ran-repo/repo-files/` — the `runs/<space>/` artifact-store convention to copy (see `repo-files/runs/arduview/`, `repo-files/brands.json`, `repo-files/space-map.json`, `repo-files/definitions.md`).
8. `build-base/INDEX.md` — the base's own routing (for navigation).
9. The per-step briefs, one per step, for manifest I/O detail: `build-base/briefs/STEP-00-bet-compiler.md`, `STEP-01-competition-collect.md`, `STEP-02-funnel-analysis.md`, `STEP-03-space-map.md`, `STEP-04-voc-market-pass.md`, `STEP-05-market-selection.md`, `STEP-06-voc-deep-pass.md`, `STEP-07-funnel-architect.md`, `STEP-08-copywriter.md`, `STEP-09-asset-classify.md`, `STEP-10-adversarial-review.md`.
10. **`build-base/engine/` — the GLUE RAW MATERIAL (reuse it; do NOT rewrite the glue).** The actual implementation pieces already exist here, unordered and imperfect: `bricks/` (fetch + process scripts — `fetch.js`, `funnel-assemble/clean/score/store/vectorize.js`, `crowdfund-fetch.js`, `adlib-*.js`, the `asset/` video Python bricks), `hooks/` (validators + DR-injectors + `route.js`), `integrations/` (Shopify / Cloudflare / Klaviyo / CDP deploy drivers), `contracts/` (JSON `schemas/`, `enums.json`, a brick `REGISTRY.json` + `REUSE-INDEX.md` + `WIRING-BUNDLE.md`, per-brick test scripts `h6-*.sh`), `prompts/_specs/`, a `reddit-extract` skill, and `_fixture/` test data. GSD **assembles + orders these bricks** into the shell per the architecture's blueprint — it does not write the fetch/glue from scratch. Use engine's `REGISTRY` / `REUSE-INDEX` to find bricks; use `PART0` / `§8` / `§9` for how to order them; **the architecture wins on intent** where a brick diverges (some bricks are as-ran/pre-R1).

### 5b. Build-order context (for sequencing, not for the shell's prompts)
- `build-base/architecture/PART2--build-order-roadmap.md` — Jobs 0–9. Job 5 = the contract spine (field schemas, deferred); Job 6 = orchestration + prompt-split (the shell front-loads its mechanism).
- `build-base/OPEN-DECISIONS.md` — open operator rulings (A1–A3 build-time skills; L1/L3/L6; C1 pricing slot). None block the shell; note them.

### 5c. The interactive maps (visual reference)
- `build-base/pipeline-agent-map.html` (detailed, full I/O, decisions baked in) · `build-base/pipeline-agent-map-compact.html` (names-only navigator).

### 5d. REFERENCE — read-not-build-from (context only; do NOT derive scope from these)
- `build-base/architecture/PART1--dependency-ordered-map.md` (110 KB annotation vault), `build-base/architecture/PART3-READER--human-map.md`.
- `build-base/reference/reviews/PART4--review-propagation-audit-and-agent-building-skills.md`, `AUDIT-collection.md`, `AUDIT-funnel.md`, `AUDIT-market.md`, `AUDIT-reviewerB.md`, `REVIEWS--raw-annotated-prompts.md` (151 KB).
- `build-base/reference/handoffs/HANDOFF-1--bet-and-pre-research.md`, `HANDOFF-annotation-depth-sort.md`, `HANDOFF-PROCESS--open-questions.md`, `handoff-step3-voc-build.md`.
- `build-base/reference/EXTERNAL-INPUTS-MAP.md` (maps the parent-folder as-ran skills used for *prompt* rebuilds later — NOT needed for the shell).
- `build-base/_cleanup/` (RECON-PLAN.md, MOVES-LOG.md, MOVES-PLAN.md, SKILL-USAGE-PLAN.md) — provenance.

### 5e. DO-NOT-TOUCH — different workstream / not pipeline content
- **The KB-mechanization toolchain:** all of `kb/`, and `skills/` **except** `skills/skill-builder/` and `skills/system-designer/` (those two ARE tracked rebuild inputs per EXTERNAL-INPUTS-MAP §D). Includes `skills/kb-mechanizer/`, `skills/kb-organizer/`, `skills/kb-hooks*/`, `skills/durable-design/`, `skills/skill-creator/`, `skills/adversarial-reviewer/`, `skills/prose-builder/`, `skills/instruction-mechanizer/`, `skills/kb-pricing|kb-social-proof|kb-upsells-aov-optimization/`, and the JSON registries `skills/kb_inventory.json`, `skills/run_plan.json`, `skills/term_registry.json`.
- **The raw KB persona corpus** (the 61 `*--{alex-hormozi|carl-weische|mark-builds-brands|spencer-origins}.md` files at `pmf3/` root) — consumed by future prompt builds, not the shell.
- **Working drafts / review renders** at root: `DESIGN--kb-mechanizer-rebuild.md`, `HANDOFF-redo-kb-mechanize.md`, `RUN-kb-mechanizer.md`, `mechanizer-research.md`, `reviewer-research.md`, `research-findings.md`, `research--copy-prose-and-llm-elicitation.md`, `skill-review*.md`, `durable-design-eval-review.html`, `skill-builder-composition-review.html`.
- **Archive candidates (confirm then remove — out of scope for you):** `differentiator--framework.md` (dup of `differentiator-framework__2_.md`), `MAP.md` (superseded), the `_dr-context_*` trio.

### 5f. The scope finding that governs the handoff
`pmf3/` root mixes **two projects** — this pipeline build-base AND the KB-mechanization toolchain — plus the raw KB corpus and drafts. **Scope GSD to `build-base/`.** Full detail in the companion `UNTRACKED-FILES-REPORT.md` (delivered alongside this handoff).

### 5g. Phase B (production & launch) — DEFERRED extension, out of scope for the shell

A production & launch half of the pipeline is documented in **draft** at `build-base/architecture/PART5--production-and-launch.md` (the Asset-Describe hub, the Visual-Branding pipeline, the Funnel-Architect-as-hub with four outputs, the Video Strategist/Builder, and the dumb HTML + parked Shopify implementers). Its inter-pipeline **seams are settled**; its internal step decompositions + the offer layer are open. Rules for you:

- **Do NOT build Phase B into the shell.** The shell targets **Steps 0–10 only.**
- **DO reference `PART5` in the entry file** (`ONE-SHOT-SHELL.md`) so GSD knows 0–10 is not the whole system, and note Phase B is an **append-only** future extension (new manifests + artifact slots in the same run-controller, no rewiring).
- **Do NOT thread PART5 into PART0/PART3/§5.2/§6 yet** — that full integration is a follow-on after PART5's open items (the architect decomposition, the offer layer) close. Flag it as future work; don't attempt it now. (And per §6: PART5 is a `draft` — leave it intact; don't rewrite or "promote" it.)

## 6. Hard constraints / guardrails

**Non-destructive, additive-only — this is the most important section.**

- **NEVER delete, move, rename, or truncate any existing file.** This session is purely additive. (Deleting files on the operator's device is forbidden regardless of tooling — if something looks like a duplicate or stale, *flag it for the operator*, do not remove it.)
- **NEVER overwrite or rewrite an existing authoritative doc in place.** Create NEW files. The only existing file you may edit is `build-base/INDEX.md`, and only **additively** (append manifest rows / routing lines) — never delete or replace its sections.
- **No lossy curation.** The entry file and any curated pack are **derived views that route to — or faithfully quote — the originals**; the originals stay the single source of truth. If you inline a load-bearing rule (a contract, the precedence rule, a refuse condition, a seam), reproduce it **verbatim and cite its source path** so the builder can check it against the original. Do **not** summarize, simplify, paraphrase, or drop nuance from `architecture/`, `standards/`, the briefs, or the as-ran repo. Curation = selecting and pointing, not rewriting.
- **Preserve all originals byte-for-byte.** Do not "tidy," reformat, condense, or reorganize `architecture/`, `standards/`, `reference/`, `_cleanup/`, the as-ran repo, or anything in §5e. If you create a curated `builder-pack/`, it holds **copies or pointers**, and the originals remain untouched and authoritative.
- Write your outputs **under `build-base/`** (new files: the plan, the entry file). Touch nothing in §5e.
- **Scope the builder to `build-base/`** — the entry file must say so explicitly.
- Honor the **precedence rule**; never let as-ran detail override architecture scope.
- **Do not write prompt bodies or field-level schemas** — those are deferred slots (Job 5 / Job 7). The shell ships with stub prompts + loose validators.
- Keep the entry file **self-contained enough to one-shot** — assume the builder reads only what the entry file routes.

## 7. Definition of done (for your session)

1. `build-base/_cleanup/CONTEXT-ENG-PLAN.md` exists — the plan.
2. The entry file (e.g. `build-base/ONE-SHOT-SHELL.md`) exists and is **goal-framed for GSD** per §2 — it states the *what* + success criteria + sources, and does **not** prescribe the build.
3. A dry trace confirms that GSD, reading *only* what the entry file routes, has everything it needs to *derive* a shell that (a) lays out `runs/<space>/`, (b) sequences Steps 0–10 per the architecture's orchestration design, (c) gives each step its declared artifact I/O, (d) runs end-to-end on stub prompts, and (e) meets the success criterion in §2 — **without** the entry file dictating how. No reach into §5d/§5e required.
4. The entry file is added to `build-base/INDEX.md` — **additively** (append manifest row + a routing line; do not rewrite the INDEX).
5. **Preservation check (mandatory):** confirm **no existing file was deleted, moved, renamed, or shrunk.** All changes are additive — new files plus append-only edits to INDEX. Record in the plan: a before/after top-level file count for `build-base/`, and the explicit list of files you created. If any pre-existing file's size decreased, stop and flag it.
6. One line back to the operator: the single path to hand GSD.

## 8. Choices — one resolved, two minor

- **Build recipe vs goal-only — RESOLVED (operator): GOAL-ONLY.** The entry file goes to **GSD, which owns the build.** State the goal + requirements + success criteria + sources (per §2); do **NOT** pre-build a scaffold, write a build procedure, or prescribe GSD's steps. *(This supersedes any earlier "pre-build the scaffold" instruction.)*
- **Inline vs route (minor).** What to inline into the entry file vs route by path. Inline the **goal, precedence rule, scope, operator decisions, and success criteria verbatim** (these are the *what*) so the entry file survives on its own; route by exact path to the architecture sources GSD derives the wiring from. Do **not** inline build mechanics.
- **One file vs one file + a curated pack (minor).** If routing many files, you may add a `build-base/builder-pack/` of **copies/pointers** to the minimal source set (originals untouched, per §6), with the entry file as its README. The operator still hands ONE path (the entry file).
