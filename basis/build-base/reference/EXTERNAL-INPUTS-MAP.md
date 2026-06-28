---
status: orchestration-scaffold
role: Catalogue of external (parent pmf3/) inputs that future per-step build sessions read to rebuild the step skills. This cleanup does NOT reorganize these.
read-with: BUILD-BASE-WORKFLOW.md, SKILL-USAGE-PLAN.md
feeds: Phase 5 (INDEX routing), Phase 6 (per-step briefs)
dispositions-source: operator-stated, 2026-06-24
---

# External Inputs Map — what lives outside build-base/ and how the rebuild uses it

**Scope lock:** this cleanup operates on `build-base/` **only**. The files below live in the parent `pmf3/` folder; they are **not** moved, renamed, reconciled, or deleted by this job. They are catalogued here so the INDEX (Phase 5) and per-step briefs (Phase 6) point to them correctly. All dispositions below are **operator-stated**, not a reviewer determination. This map is deliberately **withheld from the Phase 1 reviewer** so its build-base determination stays independent.

## A. As-ran step skills — the MVP that ran (read as "what ran", to rebuild anew)
Future per-step build sessions read these as the as-ran reference and rebuild each step skill *better*, using the reconciled build-base + the latest builder skills (section D).
- `pmf3/SKILL_market_selection.md` — as-ran step skill (MVP) → **market-selection** step
- `pmf3/SKILL-funnel-architect.md` — as-ran step skill (MVP) → **funnel-architect** step
- `pmf3/SKILL-funnel-deep-pass.md` — as-ran step skill (MVP) → **funnel deep-pass** step
- `pmf3/SKILL-asset-classify.md` — as-ran step skill (MVP) → **asset-classify** step
- `pmf3/step1-light-pass.md` — as-ran "step 1 light pass"; operator: **should be a built step too** → **light-pass** step

## B. Per-step spec / reference inputs (live — read to rebuild that step)
- `pmf3/15-SPEC-copywriter.md` — spec; will be used to build the **copywriting** step
- **VOC handoff** — **LOCATED (2026-06-24)**: brought into the base at `reference/handoffs/handoff-step3-voc-build.md`. Covers VOC research Step 3 = pipeline **STEP 4** (pass-1) + **STEP 6** (pass-2/3). Briefs: `briefs/STEP-04-voc-market-pass.md`, `briefs/STEP-06-voc-deep-pass.md`. Note: the handoff names `workflow.md`/`capability_inventory.md` as canon, but those are **stale/superseded** — the in-base architecture (PART3 §5.1) + `pmf3/definitions.md` is sufficient; don't chase them.

## C. Superseded / old (value already absorbed — do NOT rebuild from these)
- `pmf3/MAP.md` — old map of what ran; **superseded by** `build-base/asran-repo-report.md` (the detailed as-ran account)
- `pmf3/prompt-design-failure-modes.md` — old; was a **source** used to build the skill-builder skill (value now in `skills/skill-builder`)
- `pmf3/engineering-skill-design-spec.md` — old; was a **source** for the builder skills; superseded by the built skills
- `pmf3/_dr-context_generated-copywriter_md.md` — per-step DR context; operator: **"useless"**
- `pmf3/_dr-context_generated-funnel-architect.md` — per-step DR context; **"useless"**
- `pmf3/_dr-context_generated-market-selection.md` — per-step DR context; **"useless"**

## D. Current authoritative builder skills (latest — what the rebuilds USE)
- `pmf3/skills/skill-builder/` — latest; built off `engineering-skill-design-spec` + `prompt-design-failure-modes` (section C, now old)
- `pmf3/skills/system-designer/` — latest; same lineage
Future per-step build sessions use these to rebuild: skill-builder hardens each step prompt; system-designer wires the pipeline.

## E. Not yet classified by operator (Phase 5/6 assess pointer-worthiness; left untouched)
- `pmf3/definitions.md` — NB: `build-base/repo-files/definitions.md` also exists (possible drift to flag)
- `pmf3/differentiator-framework__2_.md`
- `pmf3/market-evaluation-criteria.md`
- `pmf3/research-findings.md`
- `pmf3/skill-review.md`, `pmf3/skill-review-2.md`
- `pmf3/Digital_Twins_of_Customers__How_AI-Powered_Synthetic_Consumers_Are_Reshaping_Market_Research.md` (reference article)

## F. KB corpus — UNTOUCHED
61 `<topic>--<persona>.md` files (personas: mark-builds-brands ×23, carl-weische ×17, spencer-origins ×11, alex-hormozi ×10). The pipeline consumes this; briefs point **into** it; it is **not** reorganized or catalogued individually.

---
**Open actions:** (1) locate the VOC handoff before the Phase 6 VOC brief; (2) Phase 5/6 decide which section-E docs are worth a pointer.
