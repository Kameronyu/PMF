# How to run kb-mechanizer in a fresh session

## First, the setup (30 seconds)
1. Open a **new** Claude session (desktop app).
2. **Add the folder** `C:\Users\kyu3\Claude\Projects\pmf3` as context (the "Add folder" button).
3. Paste the kickoff prompt below. (Typing `/kb-mechanizer` alone loads the skill but gives it
   no scope, no file locations, and doesn't tell it the builder skills are files — so paste this.)

---

## KICKOFF PROMPT — plan, then full sweep (recommended)

> Use the **kb-mechanizer** skill to mechanize my knowledge base in
> `C:\Users\kyu3\Claude\Projects\pmf3`.
>
> What you need to know:
> - The raw KB files are the `{topic}--{source}.md` files in the project root (e.g.
>   `copywriting--carl-weische.md`, `pricing--mark-builds-brands.md`). Shared term registry:
>   `definitions.md` and `skills/term_registry.json`.
> - The builder skills the mechanizer calls are **files in this repo, not registered skills** —
>   read and apply them: `skills/system-designer/SKILL.md`, `skills/skill-builder/SKILL.md`,
>   `skills/prose-builder/SKILL.md`, `skills/adversarial-reviewer/SKILL.md`,
>   `skills/instruction-mechanizer/SKILL.md`.
> - `hooks` is **already done** (`kb/kb-hooks-write`, `kb/kb-hooks-score`) — use it as the
>   reference example; don't redo it.
> - New input this run: `differentiator--framework.md` (topic `differentiator`) — a classification
>   framework + case studies; expect it to SHAPE into a single score/route skill (no write job).
> - Stage the files you need from the folder, do the work, and commit the new skills back to the repo.
>
> First, produce a **RUN MANIFEST**: every topic, each one's predicted shape (write / score / both /
> single), the build order, and the shared terms (from the registry). **Show me the manifest**, then
> run the FULL sweep without stopping between topics.
>
> For EACH topic, in build order:
> 1. INVENTORY + TRIAGE every chunk into WRITE / SCORE / ROUTE / REFERENCE (and the COUNTABLE/
>    HEURISTIC/FELT tier for SCORE chunks).
> 2. SHAPE per **Option B**: emit a `-write` skill only if there's a real generative job, a
>    `-score` skill only if there's a membership-testable scoring job; one skill if it's single-job.
> 3. BUILD-WRITE with prose-builder (lead with ≥3 **verbatim** specimens, patterns optional);
>    BUILD-SCORE with skill-builder (hard-gate only the countable; felt → pairwise-vs-specimen).
> 4. Run `skills/kb-mechanizer/scripts/check_specimens.py <skill_dir> <source_dir>` on each emitted
>    skill against the raw source files. Fix anything it returns `BLOCKED` before shipping.
> 5. VERIFY with adversarial-reviewer as a **separate pass** against the 6-point standard in the
>    mechanizer. Fix findings (one retry, then escalate).
> 6. Write to `kb/kb-<topic>-write/` and/or `kb/kb-<topic>-score/` (the mechanized KB folder) and
>    commit. Append any term escalations / `definitions.md` proposals to a single human-review file.
>
> **Sweep rules:** parallelize across TOPICS; keep each skill's WRITING in a single context (don't
> shard a writer across agents); the only mandatory split is writer≠scorer. Resolve term ambiguity by:
> registry → a single read-only grep of the KB → escalate to the human-review file (never a worker pool).
>
> **After all topics**, run the cross-topic **CONSISTENCY** pass: confirm every shared term is
> used/defined identically across the `kb/` skills against the registry (script foreign-key + one
> adversarial-reviewer pass); flag conflicts to the human-review file.
>
> The only place to pause for me is the manifest — otherwise run straight through.

---

## Variant — go slow (one topic at a time)
If you'd rather inspect each topic, replace the manifest paragraph with:
> Do ONE topic — **copywriting** — end to end: show me its TRIAGE table + SHAPE decision, build it,
> verify, commit, then stop and ask which topic next.

---

## Why plan-first
The single checkpoint that matters is the run manifest: it shows you every topic's predicted shape and
the shared terms before anything is built, so you catch a mis-route (prose hard-gated, or a felt
criterion turned into a fake pass/fail) once, up front — not topic by topic. After you approve the
manifest the sweep runs unattended: consistency is held by the shared registry, each skill's writing
stays in one context, and a separate verifier + scripts catch drift. Full autonomous run, one human gate.

## What "done" looks like per topic
- `kb/kb-<topic>-write/SKILL.md` (+ `references/`) and/or `kb/kb-<topic>-score/SKILL.md`
- `check_specimens.py` returns `emit_ready` for each
- adversarial-reviewer verdict PASS (or REVISE fixed)
- both committed to `kb/`; escalations appended to the human-review file

## After ALL topics are mechanized — safe to nuke
Once every topic has a verified skill in `kb/`, these raw inputs and superseded duplicates can be deleted:
- the raw `{topic}--{source}.md` files in the project root (they've been consumed)
- `differentiator-framework__2_.md` (replaced by `differentiator--framework.md`, which is then also consumed)
- `differentiator--framework.md` itself, after it's mechanized
- the old fused `skills/kb-hooks/` (superseded by `kb/kb-hooks-write` + `kb/kb-hooks-score`)

KEEP: `definitions.md` and `skills/term_registry.json` (the shared term registry the skills reference),
and everything under `skills/` that is a builder/tool — `skill-builder`, `prose-builder`,
`system-designer`, `adversarial-reviewer`, `instruction-mechanizer`, `kb-mechanizer`.
