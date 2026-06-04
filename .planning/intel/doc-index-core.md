# Doc Index — PMF Core Documents

Generated: 2026-06-04. Scope: prompts/, root *.md, .planning/*.md, .planning/audit/*.md, .claude/skills/**/*.md (PMF + global GSD). Headers + opening lines only — not end-to-end reads.

**Classification key:** KEEP · SLOP · PROMOTE · GSD-ARTIFACT · DUPLICATE

---

## prompts/ and prompts/_specs/

| path | what's in it | who reads it | classification |
|------|-------------|--------------|----------------|
| `prompts/step1-light-pass.md` | Step 1 light-pass agent prompts + schema + determinism scaffold; goal: find competitor brands, collect copy, classify space | funnel-deep-pass skill / Step 1 runs | KEEP |
| `prompts/funnel-deep-pass.md` | Router + Section Analyzer agent prompts + schema + controlled vocab; belief-instance record emission | funnel-deep-pass skill / Step 2 runs | KEEP |
| `prompts/_specs/deep-market-analysis-framework.md` | Source-of-truth strategy spec for Step 2 (deep market study) + front half of Step 4 (merge); Kam's original framework | any agent/human building Step 2 prompts | KEEP |
| `prompts/_specs/funnel-analysis-collection-spec.md` | Build spec (collection layer) for Step 2 — supersedes prose framework for build purposes; references Phase 3 / Stage M1-S3 | Step 2 build agents; Stage M1-S3 planner | KEEP |
| `prompts/_specs/market-selection-framework.md` | Source-of-truth strategy spec for market-selection gates; canonical sauce, operationalized in market-selection SKILL.md | market-selection skill; human reviewing gate logic | KEEP |
| `prompts/_specs/market-selection-assessor-spec.md` | Assessor agent spec: decision procedure + marketing knowledge + resolved judgments for the market-selection gate agent; spec-grade (input paths not wired yet) | market-selection skill build / Step 1 output consumer | KEEP |
| `prompts/_specs/image-classifier-brick.md` | Build spec for image-classifier brick (asset classify pipeline, Phase 16); worked instance = Arduview | asset-classify skill / Phase 16 build | KEEP |
| `prompts/_templates/pre-research-plan.template.md` | Template for per-product pre-research plan (Phase 1 run context); hand-filled per run | human / run-start setup | KEEP |
| `prompts/_generated/section-analyzer-dr-context.md` | Generated DR-knowledge bundle injected into Section Analyzer (6 files bundled); NOT auto-injected | section-analyzer agent (funnel-deep-pass) | KEEP |

---

## Root-level *.md

| path | what's in it | who reads it | classification |
|------|-------------|--------------|----------------|
| `README.md` | High-level project description: research-to-launch system for DR ecom; InkLeaf as first product; links to agent prompts | human onboarding; any agent starting a session | KEEP |
| `CLAUDE.md` | Project instructions: naming rules (Step vs Stage vs Phase), agent design law (one job per brick), locked conventions | every agent in PMF project | KEEP |
| `workflow.md` | End-to-end research workflow: Step sequence, research questions per step, capability vs agent distinction | planning agents; human; any agent needing step context | KEEP |
| `definitions.md` | DR ecom glossary: one-line defs, tests, examples, cross-refs for all key terms | any agent needing vocabulary; human reference | KEEP |
| `capability_inventory.md` | Atomic brick catalog: one-job units, routed to script/agent/hook/human; replaces flat Op tags; points to run-retrospective for unfolded learnings | all build agents; architecture decisions | KEEP |
| `handoff-m1-build.md` | Pick-up doc for finishing M1: canon pointers, InkLeaf retired, Stage status in ROADMAP.md | human / GSD agent resuming M1 build | KEEP |
| `handoff-step3-voc-build.md` | Single context bundle for Step 3 (VOC pipeline) build; decisions locked, canon refs, do-not-regenerate note | Step 3 build agents; GSD planner | KEEP |
| `run-retrospective.md` | Learnings reservoir from InkLeaf run (not yet folded into canon); maps what folds where in §8 | build agents when constructing relevant stages; drain-on-build pattern | KEEP |
| `MARKETING-LENS.md` | Stub/redirect: points to `marketing-lens/MAP.md` and `marketing-lens/prompts/`; no content itself | orphan (redirect only; content lives elsewhere) | SLOP |

---

## .planning/ (top-level)

| path | what's in it | who reads it | classification |
|------|-------------|--------------|----------------|
| `.planning/STATE.md` | GSD machine state: current milestone, status (executing), stopped at Phase 17 | GSD orchestration tooling | GSD-ARTIFACT |
| `.planning/ROADMAP.md` | Two-track M1 roadmap: Track A (competitive, Steps 0–2) + Track B (VOC, Step 3); Phase↔Stage mapping; InkLeaf retired note | GSD planner; human reviewing build progress | GSD-ARTIFACT |
| `.planning/PROJECT.md` | GSD project definition: what PMF is, core value prop, InkLeaf retired | GSD tooling; human orientation | GSD-ARTIFACT |
| `.planning/REQUIREMENTS.md` | M1 requirements: REQ-IDs mapped to Stages; scope = Track A + Track B; InkLeaf retired | GSD planner; requirements-checking agent | GSD-ARTIFACT |
| `.planning/BUILD-STATE.md` | Superseded build-state map (pre-reconciliation); warns stale; InkLeaf framing stale; brick model now in capability_inventory.md | orphan — superseded by ROADMAP.md | SLOP |
| `.planning/POST-RUN-HARDENING-PLAN.md` | Derived from arduview first-run audit (audits 01–08); two parallel tracks + gate; lightweight GSD phases | GSD planner; human deciding next build sprint | KEEP |

---

## .planning/audit/

| path | what's in it | who reads it | classification |
|------|-------------|--------------|----------------|
| `.planning/audit/01-run-chronology.md` | Chronological inventory of Arduview run artifacts (git log + file skims); dates inferred for untracked files | audit consumers; POST-RUN-HARDENING-PLAN build | KEEP |
| `.planning/audit/02-io-contracts-and-bloat.md` | IO contracts and context-bloat audit across pipeline; identifies over-fat context loads | build agents fixing bloat; POST-RUN planner | KEEP |
| `.planning/audit/03-retro-triage.md` | Triage of 8 retro/debug docs: classified A (agentic) / B (marketing signal) / C (useless) | agents draining run-retrospective; Step 3 builder | KEEP |
| `.planning/audit/04-spec-drift-hooks.md` | Spec-drift hooks audit: prior investigation check, hook enforcement reality, spec-slop examples | build quality agent; POST-RUN planner | KEEP |
| `.planning/audit/05-eink-vs-arduview.md` | Boundary audit: what belongs to e-ink era vs Arduview run; git log + grep sourced | cleanup agent; 06-cleanup-manifest consumer | KEEP |
| `.planning/audit/06-cleanup-manifest.md` | Cleanup proposal: files to move/delete/edit (PROPOSAL ONLY, nothing executed yet); sources 01+05 | human approving cleanup; GSD cleanup phase | KEEP |
| `.planning/audit/07-belief-records-ingest.md` | Belief-records ingest audit: identifies funnel-architect as primary consumer of 43 belief records | funnel-architect build; Step 2→Step 4 planner | KEEP |
| `.planning/audit/08-deep-pass-bugs.md` | Deep-pass bugs: triage + fix design sourced from run notes + debug docs | funnel-deep-pass fix build | KEEP |
| `.planning/audit/09-retro-fidelity.md` | Retro fidelity check (marketing signal / Bucket B only): PRESENT/MISSING/DISTORTED vs decisions file | marketing-signal quality check; Step 2 build | KEEP |
| `.planning/audit/10-phaseA-decisions.md` | Phase A decisions: four doc tasks generated 2026-06-04 | POST-RUN planner; human approving doc changes | KEEP |
| `.planning/audit/11-injection-and-hook-sweep.md` | Anti-pattern sweep: compliance-based injection (A) + dead validators (B); cross-refs audit/04 | build quality agent; hook-enforcement fixes | KEEP |

---

## .claude/skills/ — PMF-specific (under PMF/.claude/skills/)

| path | what's in it | who reads it | classification |
|------|-------------|--------------|----------------|
| `PMF/.claude/skills/asset-classify/SKILL.md` | Asset classification orchestrator: fetch→probe→[video chain]→relevance-bucket subagent per asset | Phase 16 / asset-classify runs | KEEP |
| `PMF/.claude/skills/funnel-architect/SKILL.md` | Funnel Architect skill: reads belief store + funnel fields → crowdfunding funnel DESIGN + COPY BRIEF | Step 4 / post-deep-pass funnel design | KEEP |
| `PMF/.claude/skills/funnel-architect/_dr-context.generated.md` | Generated DR knowledge bundle for funnel-architect (5 files, auto-generated by inject script) | funnel-architect skill at runtime | KEEP |
| `PMF/.claude/skills/funnel-deep-pass/SKILL.md` | Deep-pass collection orchestrator: Router → DR bundle assembly → Section Analyzer fan-out | Step 2 / funnel-deep-pass runs | KEEP |
| `PMF/.claude/skills/market-selection/SKILL.md` | Market-selection skill: three kill-gates (Demand/Product/Sophistication) → ranked provisional survivors | Step 1 gate decision | KEEP |
| `PMF/.claude/skills/market-selection/_dr-context.generated.md` | Generated DR knowledge bundle for market-selection skill (5 files) | market-selection skill at runtime | KEEP |
| `PMF/.claude/skills/market-selection/mechanisms-in-play-stopgap.md` | RETIRED stopgap doc: space-map.json now carries mechanisms_in_play[]; explicitly says "do NOT run" | orphan — retired, no longer consumed | SLOP |
| `PMF/.claude/skills/copywriter/_dr-context.generated.md` | Generated DR knowledge bundle for copywriter skill (3 files) | copywriter skill at runtime | KEEP |

---

## .claude/skills/ — Global GSD (under ~/.claude/skills/)

All ~70 `gsd-*/SKILL.md` files are standard GSD orchestration tooling (add-phase, execute-phase, plan-phase, audit-fix, etc.) — not PMF-specific content.

| path | what's in it | who reads it | classification |
|------|-------------|--------------|----------------|
| `~/.claude/skills/gsd-*/SKILL.md` (×70) | Standard GSD workflow skill definitions; orchestration, planning, audit, deploy commands | GSD harness / Claude Code skill dispatch | GSD-ARTIFACT |
| `~/.claude/skills/humanizer/SKILL.md` | Humanizer skill: removes AI-generated writing markers from text | copywriting / post-processing | GSD-ARTIFACT |
| `~/.claude/skills/humanizer/README.md` | Installation and usage notes for humanizer skill repo | human installing humanizer | GSD-ARTIFACT |
| `~/.claude/skills/humanizer/WARP.md` | WARP.dev guidance for the humanizer skill repo | WARP IDE users only; irrelevant to PMF | SLOP |
