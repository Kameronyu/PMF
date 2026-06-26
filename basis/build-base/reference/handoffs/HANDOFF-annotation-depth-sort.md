---
status: reference
role: The 'constitution' - the custody/freedom doctrine (marketing-truth vs system-design) that produced PART1+PART2.
read-with:
  - architecture/PART1--dependency-ordered-map.md
supersedes: []
---

> **What this is:** the custody/freedom doctrine every session must honor. **Read by:** every build session (the governing custody rules).

# Handoff — Annotation Depth-Sort & Roadmap Session

## What this session is

This session helps the operator move their multi-agent marketing pipeline toward what they want it to be — the agent architecture, the way the system works, the strategy. You have real freedom to do design and strategy work here, **but that freedom is earned by sequence, not granted up front.** The session runs in three phases of escalating freedom, and the order is load-bearing — it is the mechanism that keeps the output *the operator's project amplified* rather than *your own vision with their notes attached*.

The operator audited the pipeline, read the audit outputs, and annotated their own prompts and the reviewer findings. Those annotations are raw judgment captured at every level of granularity — from system shape down to field-level I/O — currently sorted by *source* (which doc they point to). They are the operator's reserved judgment, and they must be captured and structured *before* any design exploration, or design exploration will read them through its own lens instead of letting them generate the direction.

### Phase 1 — Capture & depth-sort (faithful custody of judgment; free on design)
Re-sort the annotations from source-order into *depth*-order, surface how they gate each other, preserve every annotation **verbatim**. You are a librarian with a depth-gauge here — but only over the operator's *judgment*, not over the *system design*.

The one line that matters: **marketing truth vs. system design are different domains, and your freedom differs between them.**
- **Marketing truth** — what makes good marketing: belief chains, congruency, angle, whether/why VOC matters as a principle. Here the source of truth is **the operator or the DR KB.** You may challenge the operator's marketing reasoning when you see a hole — but ground it in the KB, cite the principle. Don't overrule their marketing strategy from your own priors.
- **System design** — how many agents, where they split, who feeds whom, *how VOC integrates into the pipeline*, how knowledge is scoped and presented. This is agentic architecture and it is **fully yours to play with.** Use your own judgment freely; there is no KB for this and you are not expected to ground it in one. Taking the operator's skeleton and reshaping how it's built is the job, not an overstep.

So: don't freelance on what's *good marketing*; do freelance on *how the system is built to deliver it*. The operator trusts you to know the difference — these aren't strict rails, they're the one real boundary.

What stays firm: preserve the operator's annotations **verbatim**, unreworded, with source tags — append your notes beside them, never overwrite their words. That's custody of their judgment, and it holds regardless of how freely you design around it.

### Phase 2 — Dependency map & roadmap (constrained: derive, don't impose)
From the sort, produce the dependency-ordered map and the build-order roadmap. Let the gating structure speak — the order is *derived* from what gates what, not imposed from outside. Constrained judgment: follow what the annotations gate.

### Phase 3 — Architecture & strategy design (real freedom: explore)
Now explore. Recommend the system shape the dependency map implies — new agents, splits, merges, who-feeds-whom, how knowledge is scoped and presented, how VOC integrates. This is where your exploratory strength earns its keep. But it is built *on top of* phases 1–2, so your exploration is anchored to the operator's captured judgment rather than floating free of it. Design, recommend, flag your calls so they can be vetoed — and honor what the annotations already settle.

The escalation is the whole point: the more exploratory you are, the more phases 1–2 matter as the anchor that keeps phase 3 the operator's, not yours. Do not collapse the phases or start designing before the judgment is captured.

### Where this session stops, and a note on splitting the window

**Terminal deliverable is design — this session stops at design.** It produces: captured + depth-sorted judgment, the dependency map, the architecture design, and the build-order roadmap. It does NOT implement: no built skills, no wired code, no KB mechanization actually performed, no files cleaned. Those are downstream implementation jobs (the operator runs them in a separate coding pass) that consume *this* session's design as their spec. You are the plan step feeding a later implement step. Staying on the design side of that line is also what keeps this session from sprawling and bloating toward implementation.

**Keep in mind: Phase 3 (exploration) should ideally get its own fresh window.** Phases 1–2 want a faithful, low-temperature custodian — verbatim capture, grounded challenge, no wandering. Phase 3 wants exploratory latitude. Those are opposite dispositions, and one context holding both risks the exploratory pull contaminating the capture (starting to design during custody). The cleanest run is: do phases 1–2 here as faithful custody, then hand the finished dependency map to a *separate fresh session* for phase 3 design — so the exploratory work never sees the raw annotations until they are already safely captured and structured. If phases are kept in one window, hold the phase boundaries strictly and do not begin designing until capture is complete.

---

## What you're given

The materials below are **what actually ran** in the pipeline. The prompts, skills, specs, MAP, and DR KB are **in the repo** (you have repo access). The two annotation docs are **provided directly in your context** (see "Also given"). You read against what actually ran — not against any upstream spec, with two explicit exceptions (copywriter and VOC). Do not reference or reason against any spec document that did not run; judging depth against a never-executed spec reintroduces the gap between intent and reality that this work exists to close.

**Prompts / skills as they actually ran:**
- **Light pass (4 agents):** `prompts/step1-light-pass.md` — prompts inline in the AGENT sections. No skill; run manually.
- **Market selection:** `.claude/skills/market-selection/SKILL.md` + `_dr-context.generated.md`.
- **Funnel deep pass (Router + Section Analyzer):** `.claude/skills/funnel-deep-pass/SKILL.md` — prompts folded in verbatim, live nowhere else.
- **Funnel architect:** `.claude/skills/funnel-architect/SKILL.md` + `_dr-context.generated.md`.
- **Copywriter:** **effectively unbuilt.** No skill ran; only `_dr-context.generated.md` was present and nothing wired executed. It ran *loosely on spec at best.* For copywriter ONLY, reference its upstream spec `15-SPEC-copywriter.md` as the intended-but-unbuilt target — because copywriter annotations annotate an *absence against that spec*, not executed behavior, and must be tiered as such (gated on a build, not a fix).
- **Asset classify (relevance/role/video):** `.claude/skills/asset-classify/SKILL.md`.

**VOC (voice-of-customer) — intended but only half-built.** VOC was deliberately omitted from the run for speed, and a VOC build spec exists but is incomplete. Its current latest spec is `handoff-step3-voc-build.md` — reference it for any annotation that touches VOC. Like copywriter, VOC annotations are not "fix what ran"; they are "build/finish against a partial spec," gated on completion rather than slotting into an existing stage. **Expect VOC to surface as a system-shape boulder, not a field-level detail** — introducing VOC changes who-feeds-what across the pipeline (the belief chain currently rests on asserted transformation, not buyer language), so annotations implicating VOC very likely gate a large set of downstream items. Treat it as a probable top-tier decision the annotations are demanding, and reference `handoff-step3-voc-build.md` as the intended-but-incomplete target. Do not extend spec-referencing to any other stage — copywriter and VOC are the only two whose specs are admitted.

**Also given:**
- **The two annotation docs — provided directly in your context (not in the repo).** These are the session's primary input:
  - `annotations--arduview-pipeline.md` — the operator's raw annotations (standalone judgment).
  - `PMF annotated prompts and reviews.md` — the reviewer outputs + per-prompt annotations + the operator's annotations, combined per prompt. **The reviewer audit findings live inside this file** alongside the operator's marks.
  - **Distinguish operator annotations from reviewer findings within these docs.** Only the *operator's* annotations get verbatim-custody treatment (preserve unreworded, append KB-grounded flags beside, never overwrite). The *reviewer findings* are the audit context the annotations respond to — read them as the backdrop, not as operator judgment. Do not file a reviewer claim as if it were the operator's judgment, and do not "challenge" a reviewer finding as though it were the operator's reasoning.
- **MAP.md** (in repo) — pipeline shape (which stage does what, in what order, what feeds what). Use it to judge how stages relate when assigning depth.
- **The DR knowledge base** (in repo / WSL) — at `\\wsl.localhost\Ubuntu\home\kyu3\knowledge\dr-marketing` (the marketing theory corpus: Carl Weische, Spencer origins, Mark builds-brands, Alex Hormozi). Reference it when an annotation or a design choice needs grounding in the DR theory, and when reasoning about how knowledge should be scoped/mechanized per agent in Phase 3.

**Note on the `_dr-context.generated.md` files:** these are ridiculously long. Do NOT read them end to end, and do not treat their bulk as signal. Skim them only for the specific thing an annotation references. An annotation almost never points at "the DR context is too long" — it points at a *decision* the DR context was meant to support. Don't let these files sink the session.

**Special handling — copywriter:** because it never properly built, copywriter annotations are not "fix what ran." They are "build what's missing, against `15-SPEC-copywriter.md`." Tier them accordingly: most will gate on a build decision rather than slotting into an existing stage's I/O. Do not extend this spec-referencing to any other stage — copywriter is the only stage whose upstream spec is admitted.

---

## The three depth tiers

Sort every annotation into the tier where it actually *cuts* — judged against what actually ran, not against the surface phrasing:

1. **System-shape** — how the system fits together: what gets collected, which research feeds which agent, whether agents need to be added/removed/split, how stages relate. The smallest tier, the highest leverage.
2. **Stage-decision** — what a given agent decides, what it needs to decide well, what information it sees and how it is presented to it.
3. **Field-level** — exact inputs/outputs: which field, in which file, in what shape, emitted by whom and consumed by whom.

An annotation may throw implications at more than one tier. When it does, note it at *each* tier it touches — do not force it into one. The operator has already said their annotations hit every level of depth unevenly; expect that and preserve it.

---

## The two patterns that turn the sort into a plan

Tiering alone produces a sorted list and no plan. As you sort, you must also surface:

- **Collapse duplicates:** annotations that are the same higher-level point wearing different clothes (e.g. several scattered notes that all amount to one system-shape decision). Group them; name the single underlying decision they share.
- **Stack gated items:** lower-tier annotations that *cannot be resolved* until a higher-tier decision is made. File each gated item under the decision that gates it. (Example: you can't spec what field an agent emits — field-level — until it's decided whether the system tracks that concept at all — system-shape.)

Most field-level items will turn out to be blocked on a small number of system-shape decisions. Surfacing that is the point: it makes the mountain finite by showing it rests on a few boulders.

### System-shape outcomes the operator anticipates may emerge

The operator already suspects the annotations will demand several specific system-shape changes. These are NOT predetermined answers and you must not assume them — but be alert to surfacing them from the annotations, and do not under-weight annotations pointing this way:

- **KB mechanization:** breaking up the knowledge-base files so each agent reads only the knowledge its decision needs, *presented in a form the agent can't get wrong* — i.e. converting interpretation-dependent checks (e.g. "is this congruent?") into mechanical, checkable form rather than leaving them to the agent's judgment.
- **Agent splitting:** breaking existing agents into more parts where one agent is currently making two distinct decisions that should be separated. Let the dependency map *reveal* the split (an agent carrying two unrelated decisions); do not invent splits speculatively, since a wrong split creates new seams (new failure points).
- **VOC-driven re-routing:** re-deriving who-feeds-what across the pipeline now that VOC is entering. This is likely the largest single re-routing, since VOC reshapes the belief chain's foundation.

When the annotations support these, name them as system-shape decisions in Part 1 and let them order the roadmap in Part 2. When the annotations *don't* support one, say so — the operator's suspicion is a hypothesis to test against the annotations, not a conclusion to confirm.

---

## Freedom to design the agent architecture

On the **architecture** specifically — how many agents, where they split, who feeds whom, how knowledge is scoped and presented — you have latitude. This is a design problem and the operator wants your design thinking, not just sorting. Propose the architecture the dependency map implies: name new agents, splits, merges, and routing as your reasoned recommendation.

Two boundaries on that freedom:
- **You design the architecture; you do not implement it.** No need to produce the built skills or wired code — produce the architecture *design* (the agents, their decisions, their I/O, their knowledge scope) as a recommendation the operator acts on. Implementation is a later, separate job.
- **The only thing that's not yours is marketing strategy.** Architecture is fully yours — splits, routing, VOC integration, knowledge scoping, agent count, the whole shape. What you don't get to overrule from your own priors is *what makes good marketing* (that's the operator's or the KB's). So: reshape the skeleton however you think builds the best system; just don't quietly rewrite the operator's marketing strategy in the process. Where the operator clearly reserved a marketing call, honor it or challenge it KB-grounded — don't silently replace it. Everything about *how the system is built* is your call to make and recommend.

**Downstream implementation note (the operator's plan — design *toward* it, don't do it here):** the operator intends to use a strong coding model to mechanize the KB afterward — cleaning the DR knowledge files so each agent is presented only the knowledge its decision needs, in a form that removes interpretation-dependent checks (turning "is this congruent?" into a mechanical, checkable form the agent can't get wrong). That is an implementation of *settled design*, downstream of this session. Your Phase 3 job is to produce the design that mechanization implements: for each agent, specify *what* knowledge it needs and *what* currently-interpretive checks should become mechanical — so the later coding pass has a clear spec to render. Do not attempt the mechanization itself here; produce the design it will execute against.

---

## Your deliverable — two parts

### Part 1 — the dependency-ordered map

NOT "N items in 3 tiers." That has failed. Produce:

- The handful of **system-shape decisions** the annotations are implicitly demanding, each stated as a decision to be made.
- Under each, the **stage-decision and field-level annotations it gates or would delete** once resolved.
- A residual list of genuinely independent lower-tier items not gated by anything (the few that can be acted on without an upstream decision).
- Every annotation preserved **verbatim**, with its source tag intact, appearing under each tier/decision it touches.

### Part 2 — the build-order roadmap, DERIVED from Part 1

Now produce the order of work — but **derive it from the gating structure you just built, do not impose an order from outside.** The roadmap falls out almost mechanically: the system-shape decisions that gate the most downstream items get resolved first; wherever field-level annotations cluster across multiple stages, that signals shared-contract / seam work; the dependency map itself reveals where a final reconciliation pass is needed (to confirm the seams between independently-revised stages actually hold). Order by what unblocks what. State, for each job in the roadmap: what it resolves, which annotations it clears, and what it unblocks downstream.

**Reference shape (treat as possibly-wrong, do NOT treat as the target):** in an earlier planning pass — *before these annotations existed* — the work was sketched as roughly: lock the input/output contract spine first (define every seam between stages), then revise each agent against its locked seam in data-flow order, then a final reconciliation pass to verify the seams held end to end, with separate design tracks for validation-economics reasoning and new-data-currency collection, and the copywriter built once the architect's output became a real artifact. This is given ONLY so you know the *shape* of a roadmap deliverable. **The operator's annotations may reshape this entirely** — they may reveal the contract spine isn't first, that a job was never named, that two jobs are actually one, or that a stage needs splitting. Let the annotations generate the roadmap. Do not file the annotations into the prior roadmap to confirm it. If your derived order contradicts the reference shape, say so explicitly and say why — that contradiction is a finding, not an error.

---

## What you do NOT do

- On **marketing truth** (what makes good marketing): don't overrule the operator from your own priors — challenge only when grounded in the DR KB, and cite the principle. On **system design** (agent splits, routing, VOC integration, knowledge scoping): freely yours, use your own judgment, no KB grounding required.
- Do not reword or compress the operator's annotations; preserve verbatim with source tags, append notes beside them, never overwrite.
- Do not read the `_dr-context.generated.md` files whole; skim for referenced specifics only.
- Do not treat the prior reference roadmap as the target. Derive the order from the annotations' gating structure, and overturn the reference where they diverge.
- Do not reason against any upstream spec except copywriter's `15-SPEC-copywriter.md` and VOC's `handoff-step3-voc-build.md`.
- Do not implement — produce architecture *design* and roadmap, not built skills or wired code.
- Do not convert a judgment the operator reserved for themselves into a silent decision of your own; recommend and flag, so it can be vetoed.
