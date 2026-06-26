---
status: authoritative
role: The single entry point to this build-base. Read this first; it routes you to everything else.
read-with: []
supersedes: []
---

> **What this is:** the map of the whole base. **Read by:** every session that touches this base — start here, then follow the routing for your session type.

# INDEX — pipeline build-base

## Read me first

This folder is the **design base for a multi-step marketing pipeline** (bet → collect → funnel analysis → space map → VOC → market selection → VOC deep → funnel architect → copywriter → audit). It holds the architecture, the marketing-soundness standard, the audits behind it, the one built step-skill, and the as-ran repo it's being rebuilt from. It does **not** build the step prompts — that's the per-step build sessions, later. Each doc opens with front-matter (`status`, `role`, `read-with`, `supersedes`) and a one-line "what this is." **Build from `authoritative` docs; `reference` docs are read-not-built-from.** The canonical step order is **PART3 §1.5 (R1) / §1.6 (R2)**, narrated end-to-end in **PART0**. For a current-state snapshot (what's built, decided, open, and next) read **`STATE-OF-PROJECT.md`** first; for the plan to stand up a runnable shell with prompts deferred, see **`SHELL-BUILD-SPEC.md`**; the **`pipeline-agent-map*.html`** files are an interactive view of the wiring.

## Folder map

```
build-base/
├─ INDEX.md                     ← you are here
├─ STATE-OF-PROJECT.md          ← current-state snapshot (built / decided / open / next) — read first for orientation
├─ SHELL-BUILD-SPEC.md          ← implementer runbook: one-shot the runnable shell; prompts + field I/O drop in later
├─ ONE-SHOT-SHELL.md            ← GSD entry point: hand GSD this one path to build the shell (goal + requirements + success criteria + routed sources)
├─ BUILD-BASE-WORKFLOW.md       ← the cleanup runbook (how this base was assembled)
├─ OPEN-DECISIONS.md            ← open operator decisions surfaced from the audits (no rulings made)
├─ pipeline-agent-map.html      ← interactive agent map (detailed: every agent + full I/O, session decisions baked in)
├─ pipeline-agent-map-compact.html ← compact names-only navigator (hover-trace / click-isolate)
├─ architecture/                ← the build-from spine (PART0–PART3 + human map)
├─ standards/                   ← marketing-soundness Standard + Register + Directive
├─ briefs/                      ← per-step build briefs (STEP-00…10) — the build session's reading list
├─ skills/bet-compiler/         ← the one BUILT step-skill (SKILL.md)
├─ engine/                      ← GLUE RAW MATERIAL — fetch/process bricks, validators, integration drivers (Shopify/CF/Klaviyo), schemas, brick registry (reuse to build the shell; not the shell itself)
├─ reference/                   ← read-not-built-from
│   ├─ EXTERNAL-INPUTS-MAP.md   ← routing to external rebuild inputs (the as-ran step skills live in parent pmf3/)
│   ├─ handoffs/                ← session packets + the custody constitution
│   ├─ reviews/                 ← PART4 audit-synthesis + the 4 AUDITs + the raw review source
│   └─ as-ran-repo/             ← asran-repo-report.md + repo-files/ (the as-ran Arduview run, do not edit)
└─ _cleanup/                    ← process records (RECON-PLAN, MOVES-LOG, etc.) — not base content
```

## Manifest (status + location)

| Doc | Status | Location |
|---|---|---|
| PART0 — pipeline flow | authoritative | `architecture/` |
| PART1 — dependency-ordered map (annotation vault) | authoritative | `architecture/` |
| PART2 — build-order roadmap | authoritative | `architecture/` |
| PART3 — architecture design (primary build-from) | authoritative | `architecture/` |
| PART3-READER — human map | reference | `architecture/` |
| PART5 — production & launch phase (Phase B) | draft | `architecture/` |
| SPEC — marketing-soundness (the Standard) | authoritative | `standards/` |
| marketing-rule-register | authoritative | `standards/` |
| BUILDER-DIRECTIVE | authoritative | `standards/` |
| bet-compiler **SKILL.md** (the one built step) | authoritative | `skills/bet-compiler/` |
| PART4 — review-propagation audit + skill proposals | authoritative | `reference/reviews/` |
| AUDIT-collection / -market / -funnel / -reviewerB | reference | `reference/reviews/` |
| REVIEWS — raw annotated prompts (provenance source) | reference | `reference/reviews/` |
| HANDOFF-1 — bet session packet (+ HANDOFF-N template) | reference | `reference/handoffs/` |
| HANDOFF-PROCESS — open questions | reference | `reference/handoffs/` |
| HANDOFF-annotation-depth-sort — the custody constitution | reference | `reference/handoffs/` |
| asran-repo-report (index into the as-ran repo) | reference | `reference/as-ran-repo/` |
| repo-files/ (as-ran Arduview run data) | reference | `reference/as-ran-repo/repo-files/` |
| EXTERNAL-INPUTS-MAP (external rebuild inputs) | scaffold | `reference/` |
| OPEN-DECISIONS (open operator decisions) | open list | root |
| **STATE-OF-PROJECT** — current-state snapshot (built/decided/open/next) | authoritative | root |
| **SHELL-BUILD-SPEC** — shell/scaffold implementer runbook | authoritative | root |
| **ONE-SHOT-SHELL** — GSD entry point (goal-framed shell-build brief; the single path to hand GSD) | authoritative | root |
| briefs/STEP-00…10 — per-step build briefs | authoritative | `briefs/` |
| pipeline-agent-map(.html) + -compact — interactive agent maps | reference (visual) | root |

## Routing by session type

**New here / orientation** → read `STATE-OF-PROJECT.md` first (what's built, decided, open, and next), then follow the routing below for your session type.

**Standing up the runnable shell (wiring now, prompts later)** → read `SHELL-BUILD-SPEC.md` (with `PART3 §8` orchestration + `§9` seams): how to one-shot the project shell so prompts and field-level I/O drop into slots.

**One-shotting the shell via GSD (hand off the build)** → hand GSD the single path `ONE-SHOT-SHELL.md` — the goal-framed entry point that states the shell goal + requirements + success criteria and routes the wiring sources (`PART0`, `PART3 §8/§9/§5.2`, the engine index, and `SHELL-BUILD-SPEC.md` as background). GSD owns the build.

**System-design / birdseye pass** → read `architecture/PART0--pipeline-flow.md` (the spine), `architecture/PART3--architecture-design.md` (build from §1.5/§1.6; §4 is a superseded trail), `architecture/PART3-READER--human-map.md`, `reference/reviews/PART4--...md`, the three `standards/` docs, and `OPEN-DECISIONS.md`.

**Building a specific step N** → read, for that step: its **PART0** step block (job logic) → its **PART3 §6.x** agent card (mechanics) → its **PART1** annotations (the decision's operator rules, by ID) → its **PART2** Job → the relevant **AUDIT** finding(s) → the step's **as-ran prompt** in `reference/as-ran-repo/repo-files/` (ground truth for what ran) → and always the `standards/` triad first (marketing soundness). **Open the step's brief first** — `briefs/STEP-NN-*.md` lists every slice and leads with the as-ran skill to rebuild.

**Any build that emits marketing decisions** → read `standards/SPEC-marketing-soundness.md` + `standards/marketing-rule-register.md` + `standards/BUILDER-DIRECTIVE.md` first. Every load-bearing judgment carries a `grounding_ref` + a `carried_risks[]` list.

**Rebuilding a step-skill** → the as-ran MVP skills + specs that feed the rebuild live in the **parent `pmf3/` folder**, catalogued in `reference/EXTERNAL-INPUTS-MAP.md` (the 4 `SKILL-*.md`, `step1-light-pass.md`, `15-SPEC-copywriter.md`, the latest `skill-builder` + `system-designer`). KB persona docs are consumed, not reorganized.

## Supersession notes

- **PART3 §4.1–§4.3** (and the pre-R1 phrasing in §6.4/§6.7) are **superseded by §1.5 (R1) / §1.6 (R2)** — kept as a reasoning trail, banner-flagged "do not build from." Build the step order from §1.5/§1.6 (or PART0).
- The **as-ran step skills** in parent `pmf3/` are an **MVP being rebuilt**; treat them as "what ran," not as the target. See `reference/EXTERNAL-INPUTS-MAP.md`.
- `MAP.md` (parent, external) is superseded by `reference/as-ran-repo/asran-repo-report.md`.

## Pipeline steps (R1 order) — where to read each

Canonical order from PART0 / PART3 §1.5. **Each step's full brief is in `briefs/STEP-NN-*.md`** (the build session's reading list); the pointers below are the same slices in brief.

| Step | What | Read |
|---|---|---|
| 0 | Bet brief / Bet Compiler | PART0 §STEP 0 · PART3 §6.1 · **built:** `skills/bet-compiler/SKILL.md` · HANDOFF-1 |
| 1 | Competition search / Collect (Finder, Slop, Coverage, Dumper) | PART0 §STEP 1 · PART3 §6.2–6.3 · AUDIT-collection |
| 2 | Funnel analysis (Assemble, Router, Section Analyzer) | PART0 §STEP 2 · PART3 §6.7 · AUDIT-funnel |
| 3 | Space Map (Space Classifier = synthesizer) | PART0 §STEP 3 · PART3 §6.4 |
| 4 | VOC market pass (pass-1, per cell) | PART0 §STEP 4 · PART3 §5.1 · AUDIT-market |
| 5 | Market Selection → NTP pick | PART0 §STEP 5 · PART3 §6.5 · AUDIT-market |
| 6 | VOC deep pass (pass-2, winner) | PART0 §STEP 6 · PART3 §5.1 |
| 7 | Funnel Architect (+ Awareness Reconciler, + Auditor) | PART0 §STEP 7 · PART3 §6.6–6.8 · AUDIT-funnel/-reviewerB |
| 8 | Copywriter + Copy Chief | PART3 §6.9 · `15-SPEC-copywriter.md` (parent) |
| 9 | Asset classify | PART3 §6.10 |
| 10 | Adversarial re-review | PART3 §10 · PART4 |

## Also here

- **`OPEN-DECISIONS.md`** — forward items surfaced from PART4/the AUDITs that need an operator ruling (the 3 build-time skills to build before Jobs 2/3/4; L1/L3/L6; the missing §7.3 pricing/anchor slot). No rulings made.
- **`_cleanup/`** — the cleanup's own records (`RECON-PLAN.md` manifest + reconciliation log, `MOVES-LOG.md` old→new paths, `MOVES-PLAN.md`, `SKILL-USAGE-PLAN.md`). Provenance, not base content.
- **`architecture/PART5--production-and-launch.md`** (draft) — the production & launch half (**Phase B**): the Asset-Describe hub, the Visual-Branding pipeline, the Funnel-Architect-as-hub (four outputs), the Video Strategist/Builder, and the dumb HTML + parked Shopify implementers. The back-half **seams are settled**; internal step decompositions + the offer layer stay open. **Deferred extension** — the shell build targets Steps 0–10 only; Phase B appends later with no rewiring.
- **`engine/`** — the **glue raw material** the shell is built *from*: `bricks/` (fetch/process scripts), `hooks/` (validators + DR-injectors), `integrations/` (Shopify/Cloudflare/Klaviyo/CDP), `contracts/` (schemas + brick `REGISTRY` + `REUSE-INDEX` + per-brick tests), `_fixture/` data. The glue itself — unordered, imperfect — **not** the assembled shell or the blueprint. Reuse + order per the architecture.
