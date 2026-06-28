# Untracked / un-indexed files report — pmf3/

*Cross-referenced against `build-base/INDEX.md` (catalogs `build-base/`) and `reference/EXTERNAL-INPUTS-MAP.md` (maps specific parent-folder rebuild inputs). "Untracked" = referenced by neither.*

**Headline:** `EXTERNAL-INPUTS-MAP.md` is broad — it already tracks the as-ran step skills, most loose root docs, and the **entire 61-file KB persona corpus**. So the genuinely untracked set is much smaller than the raw tree suggests, and **the only real *index gap inside build-base* was 4 files — now added to INDEX.**

## (a) New build-base artifacts — were missing from INDEX → NOW FIXED
- `pipeline-agent-map.html`, `pipeline-agent-map-compact.html`, `SHELL-BUILD-SPEC.md`, `STATE-OF-PROJECT.md`
- These live inside `build-base/` but the INDEX catalogued none. **Resolved this session — added to the folder map, manifest, and routing.**

## (b) Already tracked (no action) — recorded as checked
- The **KB persona corpus** (61 `topic--source.md` files) — `EXTERNAL-INPUTS-MAP §F`; consumed, not reorganized.
- The **as-ran step skills/specs** — the 4 `SKILL-*.md`, `SKILL_market_selection.md`, `step1-light-pass.md`, `15-SPEC-copywriter.md` — `EXTERNAL-INPUTS-MAP §A/§B`.
- The **`_dr-context_*` generated files** — mapped in `§C`, operator-flagged "useless" (archive candidates).

## (c) Untracked — the kb-mechanization meta-skill toolchain (a SEPARATE workstream)
- `kb/` tree (`kb-hooks-score`, `kb-hooks-write`).
- `skills/` toolchain: `kb_inventory.json`, `run_plan.json`, `term_registry.json`, and skill dirs `adversarial-reviewer/`, `durable-design/`, `instruction-mechanizer/`, `kb-hooks*/`, `kb-mechanizer/`, `kb-organizer/`, `kb-pricing/`, `kb-social-proof/`, `kb-upsells-aov-optimization/`, `prose-builder/`, `skill-creator/`.
- **Recommendation:** belongs to the KB-mechanization workstream — do **not** index into the pipeline build-base.
- ⚠️ **Boundary flag:** `skills/skill-builder/` and `skills/system-designer/` **ARE tracked** (`EXTERNAL-INPUTS-MAP §D` — the rebuild's authoritative builder skills). Don't sweep the whole `skills/` folder.

## (d) Untracked — process / working / review drafts (root)
- `DESIGN--kb-mechanizer-rebuild.md`, `HANDOFF-redo-kb-mechanize.md`, `RUN-kb-mechanizer.md`, `mechanizer-research.md`, `reviewer-research.md`, `research--copy-prose-and-llm-elicitation.md`
- `skill-review-3.md`, `-4.md`, `-5-self.md`, `-6-self-confirm.md`  *(the series `§E` only tracked through `-2`)*
- **Recommendation:** park the `kb-mechanize*`/`mechanizer`/`prose` notes with the toolchain workstream; `skill-review-3..6` are archive candidates (confirm stale first).

## (e) Untracked — duplicates / superseded
- `differentiator--framework.md` — **likely duplicate** of the tracked `differentiator-framework__2_.md` (identical size). Diff, drop one.
- `MAP.md` — superseded by `asran-repo-report.md` (already noted in INDEX). Archive candidate.

## (f) Untracked — HTML review renders (root)
- `durable-design-eval-review.html` (232K), `skill-builder-composition-review.html` (114K) — eval renders for the meta-skill toolchain; park with that workstream or archive.

---

### Operator flags
1. ✅ The only true build-base index gap (the 4 files) is fixed.
2. ⚠️ `skills/` is a **mixed folder** — `skill-builder/` + `system-designer/` are tracked rebuild inputs; everything else under `skills/` and all of `kb/` is the separate KB-mechanization toolchain.
3. ⚠️ Archive candidates to confirm: `differentiator--framework.md` (dup), `skill-review-3..6`, `MAP.md`, the `_dr-context_*` trio.

### The load-bearing takeaway for handoff
`pmf3/` root mixes **two projects** — the pipeline build-base and the KB-mechanization toolchain (+ the raw KB corpus + working drafts). **Hand a shell-builder `build-base/`, not the whole `pmf3/`**, or it will wander into the toolchain and the reference mass.
