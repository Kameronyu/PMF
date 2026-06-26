# KB Mechanization — Final Report

## What was built
The knowledge base (28 topics, ~60 raw `{topic}--{source}.md` files) was mechanized into **45 lean, AI-executable skills** under `kb/`, following Option B (split a topic into `-write` + `-score` only when it has both a generative job and a judged job). `hooks` was already done (the reference pair); `differentiator` was the validated pilot.

Each `SKILL.md` is lean (≤130 lines); the substance lives in on-demand `references/` (progressive disclosure). Result: **45/45 pass the verbatim-specimen gate, 45/45 lean, 0 dangling references.**

## The headline: lossiness was caught and fixed
A lean-but-verbatim skill can still silently **drop** source frameworks — and the first sweep did. An adversarial, routing-aware lossiness audit found:

- **Initial:** 2 COMPLETE, 3 MINOR-LOSS, **22 MAJOR-LOSS** — 68 HIGH-severity frameworks/procedures/tool-stacks dropped (e.g. AI video tool stacks, the Five Scaling Levers, ad-build templates, agency playbooks). Coverage as low as 0.31 (case-studies).
- **After remediation (2 bounded passes, restoring lost units into `references/`):** the vast majority recovered — e.g. `ecommerce` 14 HIGH → 0, `case-studies` 0.31 → 1.00, `persuasion-and-sales` 0.46 → 0.84.
- **Final QA (7→9-point adversarial, all 45 skills):** 24 passed clean; 21 flagged and **all 21 fixed** — self-grading "self-test" sections reframed, additional missing frameworks restored, one broken reference repaired, one **fabricated rule removed** (an invented "FOMO for problem-aware" not in any source), one gate inconsistency corrected. Post-fix: 0 specimen failures, 0 lean failures.

## Evals (skill-creator) on the mechanizer itself
- **Routing accuracy** (does triage classify chunks correctly): **89% exact, 94% with acceptable alternates, 6/6 on SCORE tiers** (18 blind chunks). The only true miss + the one alternate were both parametric cadence/threshold rules (ROUTE vs SCORE/REFERENCE) — the one soft spot.
- **Triggering accuracy** (does the skill fire on the right prompts): **4/8 on held-out test**, original description retained (no rewrite beat it). Caveats: run on Sonnet (not the session Opus), deliberately brutal near-miss negatives (the sibling builder skills), and run_loop's simulation ≠ live triggering — read as directional, not a verdict.

## The mechanizer skill itself was hardened (so this can't recur)
The root cause of the lossiness was a verify standard that only checked specimens + length, never coverage. The `kb-mechanizer` skill is now a **9-point standard**:
- **#7 Coverage gate** — dropping a source framework to hit leanness is a FALSE-capable ship-blocker; leanness must be achieved by relocating to `references/`, never deleting.
- **#1 strengthened** — a `-write` skill may not contain a self-grading "self-test/revise" section.
- **#8 Traceability / anti-fabrication** — every *rule* (not just every quote) must trace to source; invented rules are BLOCKED.
- **#9 Reference integrity** — no dangling `references/` pointer.

Plus matching BUILD-WRITE instructions so the builders don't produce these defects in the first place.

## How to use the delivery
- `kb-mechanized.zip` contains the 45 skill folders. **Extract it inside your `kb/` folder** to place the skills (each is a `kb-<topic>-write` / `kb-<topic>-score` folder with `SKILL.md` + `references/`). It's also committed to `kb/kb-mechanized.zip` on your machine. (If you'd prefer I write the 45 folders directly into `kb/` instead of a zip, say so — the bridge commits files individually, so it's a few batched writes.)
- The hardened mechanizer is committed in place at `skills/kb-mechanizer/SKILL.md`.

## Consolidation blueprint (for a future session — NOT done now)
The topic taxonomy is inherited from how the KB was scraped, so several siblings overlap (e.g. ads/ad-creative/advertising/advertorial; cro/conversion-optimization; upsells/upsells-and-monetization/aov-optimization). `CONSOLIDATION-BLUEPRINT.md` proposes a cleaner, job-named taxonomy and which clusters to merge — to run as a separate pass, safely, now that everything is mechanized.

## Safe to delete (superseded / consumed)
- Old pre-rebuild artifacts: `skills/kb-hooks/`, `skills/kb-pricing/`, `skills/kb-social-proof/`, `skills/kb-upsells-aov-optimization/`.
- Once you're satisfied with `kb/`: the raw `{topic}--{source}.md` files in the project root (they've been consumed) and the duplicate `differentiator-framework__2_.md`.
- KEEP: `definitions.md`, `skills/term_registry.json`, and all builder/tool skills (`skill-builder`, `prose-builder`, `system-designer`, `adversarial-reviewer`, `instruction-mechanizer`, `kb-mechanizer`).

## Attached
`kb-mechanized.zip` (45 skills) · `FINAL-REPORT.md` · `LOSSINESS-REPORT.md` · `CONSOLIDATION-BLUEPRINT.md` · `routing_eval_result.json` · `trigger_eval_result.json` · `qa_summary.json` · `kb-mechanizer-SKILL.md` (hardened).
