# Phase 15: Funnel Architect + Copywriter — Research

**Researched:** 2026-06-04
**Domain:** DR copy generation — judgment skill wiring, deterministic DR injection, source-routed RAG, upstream schema extension
**Confidence:** HIGH (all claims verified against on-disk code and spec files)

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D1** — `belief_kind` (crowdfunding-specific | general-DR) is ABSENT from the 6b schema. Extend Section Analyzer schema upstream to emit it per belief record. Update fixture `runs/_fixture/funnels/sample.json` and validator `tools/hooks/validate-analyzer.js`.
- **D2** — Source routing: minimal fix only. `funnel-vectorize.js` must carry funnel-level `source_type` (and `routing_flag`) into each indexed unit (stop dropping them). `funnel-rag-query.js` must add a `--source-type` (and/or `--routing-flag`) prefilter. No new per-belief `source_routing` field.
- **D3** — 2-gate retrieval: belief gate + source gate + broad semantic rank (top 6-10). The Architect specifies per-section: `belief_id` + angle/intent string + source gate. The Architect never runs retrieval. Structural reference (competitor funnel whose belief-order is modeled) is separate from language retrieval.
- **D4** — Build `tools/funnel-claim-tally.js` now. Impl spec is `15-CLAIM-TALLY-IMPL-SPEC.md`. Primary key = individual `moves[]` tag. Secondary grouping = belief_ids the move appeared under. Output: `runs/<space>/funnels/_tally.json`. Injected into Architect context deterministically.
- **D5** — DR injection is deterministic, NEVER auto-injected. Build `tools/hooks/inject-funnel-architect-dr.js` and `tools/hooks/inject-copywriter-dr.js`. Each has a HARDCODED DR-file allowlist. Architect bundle → `.claude/skills/funnel-architect/_dr-context.generated.md`. Copywriter bundle → `.claude/skills/copywriter/_dr-context.generated.md`. Each SKILL.md declares the bundle in a `## read_first` section as a mandatory pre-read.
- **D6** — Both skills are conversational judgment agents. Propose → operator pushes → revise.
- **D7** — Reuse the already-built engine. Do not rebuild `tools/lib/embed.js`, `tools/funnel-vectorize.js`, `tools/funnel-rag-query.js`, `runs/_fixture/funnels/`.

### Claude's Discretion
- Exact DR-file allowlist per bundle (within the spec's named categories).
- Exact SKILL.md structure/wording, beyond the required `read_first`.
- CLI flag names where not pinned (follow `funnel-rag-query.js` / mechanism-tool conventions).
- Test/fixture scaffolding details for verification.

### Deferred Ideas (OUT OF SCOPE)
- Birdseye synthesis agent (downstream phase).
- Live-on-real-funnels validation (rides D-02; this phase verifies against fixture only).
- Per-belief `source_routing` field (rejected as redundant — D2).
- Dynamic/proportional claim-tally threshold (rejected — breaks reproducibility).
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| FUNNEL-01 | Funnel Architect skill: reads funnel store + DR KB + operator run-context + claim-tally; produces congruent funnel DESIGN + COPY BRIEF | D5 injection pattern, D4 tally injection, SPEC behavior authority |
| FUNNEL-02 | Copywriter skill: consumes Architect's brief + per-section source-routed RAG'd verbatim; writes finished prose in locked format | D2/D3 RAG wiring, D5 injection pattern, COPYWRITE-WIRING-REFERENCE contract |
</phase_requirements>

---

## Summary

Phase 15 builds two coupled judgment skills (Funnel Architect + Copywriter) plus the deterministic scaffolding they require. The operator's #1 risk is injection wiring: both specs say DR files are "auto-injected / pasted alongside" — this is the documented mislabel that caused a zero-grounding run in 2026-06 (Arduview). The fix is proven in `inject-market-selection-dr.js` and `market-selection/SKILL.md`: a bundler script writes a generated file; the SKILL.md `read_first` section declares it as a mandatory Read before the agent proceeds.

The second hard technical problem is source-routed retrieval. The existing `_index.json` records confirmed by inspection carry NO `source_type` or `routing_flag` fields — `funnel-vectorize.js` `loadUnits()` never adds them to the unit object. The fix is a one-line addition to `loadUnits()`, then a new prefilter branch in `funnel-rag-query.js`. No re-architecting.

The third problem is `belief_kind`. The Architect's INPUT contract requires it per belief record; the 6b schema and `validate-analyzer.js` do not have it. Adding it is a schema-doc edit + fixture update + one new validator rule: `belief_kind` must be `'crowdfunding-specific'` or `'general-dr'`.

Everything else (tally script, new bundlers, two new SKILL.md files) is new-file construction that mirrors existing patterns exactly.

**Primary recommendation:** Plan in four waves: (W0) shared schema + tooling substrate, (W1) Funnel Architect skill + bundle, (W2) Copywriter skill + bundle, (W3) end-to-end fixture verification proving injection, RAG routing, and tally injection all land in context.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| DR file bundling | Deterministic script | — | Pure fs-read + concatenate; zero judgment |
| Claim tally | Deterministic script | — | Pure fs-read + count; zero judgment |
| RAG vectorization | Deterministic script | — | Arithmetic (embed + write) |
| RAG retrieval per section | Deterministic script | — | Arithmetic (embed query + cosine sort) |
| Funnel design + copy brief | Judgment agent (Architect) | — | Requires DR reasoning over analysis data |
| Copy prose generation | Judgment agent (Copywriter) | — | Requires craft reasoning over brief + RAG |
| Context injection into agents | Orchestrator main loop | — | Hooks do NOT fire in subagents |
| Schema validation | PostToolUse hook | — | Already built; extend only |

---

## Standard Stack

All existing; no new dependencies.

| Tool | Version | Purpose | Status |
|------|---------|---------|--------|
| `tools/lib/embed.js` | — | Voyage embed + cosine; stub fallback | Built, committed |
| `tools/funnel-vectorize.js` | — | Builds `_index.json` from belief_records | Built; needs D2 extend |
| `tools/funnel-rag-query.js` | — | Prefilter + semantic kNN → injection block | Built; needs D2 extend |
| `tools/aggregate-mechanisms-in-play.js` | — | Convention reference for tally script | Built, committed |
| `tools/hooks/inject-dr.js` | — | Pattern reference for new bundlers | Built, committed |
| `tools/hooks/inject-market-selection-dr.js` | — | Pattern reference (closer to new bundlers) | Built, committed |
| `.claude/skills/market-selection/SKILL.md` | — | `read_first` declaration pattern | Built, committed |

**New files to create (all new, no rewrites):**
- `tools/funnel-claim-tally.js`
- `tools/hooks/inject-funnel-architect-dr.js`
- `tools/hooks/inject-copywriter-dr.js`
- `.claude/skills/funnel-architect/SKILL.md`
- `.claude/skills/funnel-architect/_dr-context.generated.md` (generated by bundler)
- `.claude/skills/copywriter/SKILL.md`
- `.claude/skills/copywriter/_dr-context.generated.md` (generated by bundler)

**Schema/fixture changes (existing files):**
- `prompts/funnel-deep-pass.md` — add `belief_kind` to 6b schema + enum
- `runs/_fixture/funnels/sample.json` — add `belief_kind` to each of 4 belief records
- `tools/hooks/validate-analyzer.js` — add `belief_kind` closed-enum rule
- `tools/funnel-vectorize.js` — carry `source_type` + `routing_flag` into unit object
- `tools/funnel-rag-query.js` — add `--source-type` prefilter branch

---

## Architecture Patterns

### System Architecture Diagram

```
Operator run context (product, UM, backer awareness, offer, blocked ports)
         │
         ▼
[ORCHESTRATOR — funnel-architect skill main loop]
         │
         ├─── node tools/funnel-claim-tally.js --space=<space>
         │         └── writes runs/<space>/funnels/_tally.json
         │
         ├─── Read .claude/skills/funnel-architect/_dr-context.generated.md
         │         └── (generated by inject-funnel-architect-dr.js; fail if missing)
         │
         ├─── Read runs/<space>/funnels/*.json  (funnel store)
         │
         ├─── Read runs/<space>/funnels/_tally.json
         │
         └─── SPAWN Funnel Architect agent
                   Context assembled in spawn prompt:
                   [SKILL.md body] + [DR bundle bytes] + [funnel store dump] +
                   [_tally.json content under === CLAIM TALLY === header]
                         │
                         ▼
                  Architect produces COPY BRIEF
                  (per section: belief_id, angle/intent, source gate,
                   install spec, dead-ground, blocked ports)
                         │
                         ▼
[ORCHESTRATOR — copywriter skill main loop]
         │
         ├─── Read .claude/skills/copywriter/_dr-context.generated.md
         │         └── (generated by inject-copywriter-dr.js; fail if missing)
         │
         ├─── For EACH section in copy brief:
         │         node tools/funnel-rag-query.js \
         │           --space=<space> \
         │           --query="<section.intent>" \
         │           --belief=<section.belief_id> \
         │           --source-type=<section.source_gate> \
         │           --top=8
         │         └── returns attributed injection block
         │
         └─── SPAWN Copywriter agent
                   Context assembled in spawn prompt:
                   [SKILL.md body] + [DR craft bundle bytes] +
                   [architect brief] + [per-section RAG blocks pasted inline]
                         │
                         ▼
                  Copywriter produces finished prose (locked format)
```

### Recommended Project Structure

```
.claude/skills/
├── funnel-architect/
│   ├── SKILL.md                          # read_first + behavior (from 15-SPEC-funnel-architect.md)
│   └── _dr-context.generated.md         # generated by inject-funnel-architect-dr.js
└── copywriter/
    ├── SKILL.md                          # read_first + behavior (from 15-SPEC-copywriter.md)
    └── _dr-context.generated.md         # generated by inject-copywriter-dr.js

tools/
├── funnel-claim-tally.js                # NEW — moves[]-based claim counter
├── funnel-vectorize.js                  # EXTEND — carry source_type + routing_flag
├── funnel-rag-query.js                  # EXTEND — add --source-type prefilter
└── hooks/
    ├── inject-funnel-architect-dr.js    # NEW — architect DR bundler
    └── inject-copywriter-dr.js         # NEW — copywriter DR bundler
```

---

## Research Question Answers

### RQ1: INJECTION — Exact anatomy of the bundler pattern

**Verified by reading `inject-dr.js` and `inject-market-selection-dr.js` in full.** [VERIFIED: codebase]

The anatomy of every DR bundler:

```javascript
// 1. HARDCODED ALLOWLIST — never from argv
const ALLOWLIST = [
  { file: 'filename.md', use: 'what this file does for the skill' },
  // ...
];

// 2. DEFAULT OUTPUT PATH — skill-relative, not shared
const DEFAULT_OUT = path.resolve(__dirname, '..', '..',
  '.claude', 'skills', '<skill-name>', '_dr-context.generated.md');

// 3. PATH-TRAVERSAL GUARD
function isUnderDrDir(p) {
  const normalized = path.resolve(p);
  const base = path.resolve(DR_DIR);
  return normalized === base || normalized.startsWith(base + path.sep);
}

// 4. LOAD LOOP — warn on missing, never crash
for (const { file, use } of ALLOWLIST) {
  if (file.includes('/') || ...) { console.error('SECURITY...'); continue; }
  const resolved = path.join(DR_DIR, file);
  if (!isUnderDrDir(resolved)) { console.error('SECURITY...'); continue; }
  if (!fs.existsSync(resolved)) { console.error('WARNING...'); continue; }
  content = fs.readFileSync(resolved, 'utf8');
  parts.push(`\n${bar}\n=== DR FILE: ${file}\n=== Use in this skill: ${use}\n${bar}\n\n${content}\n`);
  loaded++;
}

// 5. ZERO-FILES GUARD (inject-market-selection-dr.js has this; inject-dr.js does not)
if (loaded === 0) { console.error('REJECT: zero DR files loaded'); process.exit(2); }

// 6. BANNER explaining what the bundle is and what the agent must NOT let it override
// 7. WRITE to DEFAULT_OUT (or --out or --stdout)
// 8. Exit 0 / exit 2 on write failure
```

**Key differences between the two existing bundlers:**
- `inject-dr.js`: Section Analyzer bundler; has `--max-chars` truncation logic; exit 2 only on write failure; zero-files does NOT exit 2.
- `inject-market-selection-dr.js`: market-selection bundler; NO max-chars; exits 2 on zero files loaded; includes `<!-- GENERATED FILE -->` banner comment.

**For the two new bundlers, mirror `inject-market-selection-dr.js` exactly** (simpler; the architect and copywriter have no char-cap concern for their smaller allowlists).

**Output bundle path convention:**
- Architect: `.claude/skills/funnel-architect/_dr-context.generated.md`
- Copywriter: `.claude/skills/copywriter/_dr-context.generated.md`
- Pattern: `.claude/skills/<skill-name>/_dr-context.generated.md` — the underscore prefix marks it as generated, mirrors market-selection exactly.

**How the agent actually receives the bundle bytes:**

Three valid paths (all equivalent — the bundle is a regular file):

1. **Orchestrator Reads it and embeds bytes in the spawn prompt** (the funnel-deep-pass model: `funnel-analyzer-context.js` does this for the Section Analyzer).
2. **Agent Reads it as its first step** (the market-selection model: SKILL.md `read_first` section instructs the agent to `Read .claude/skills/<skill>/_dr-context.generated.md` before proceeding).
3. **Both** (belt and suspenders for skills that are both orchestrated and interactive).

For Phase 15: use Path 2 (agent reads it on first step, declared in `read_first`). The Architect and Copywriter are interactive conversational agents — there is no batch orchestrator spawning them; the operator opens the skill. The SKILL.md `read_first` section is the mechanism.

**The regenerate-if-missing shell check in SKILL.md:**

From `market-selection/SKILL.md` (verbatim pattern):
```
These files are bundled into ONE generated file. **There is NO auto-injection — you must Read it:**

- `.claude/skills/<skill>/_dr-context.generated.md` — all N DR files below,
  concatenated. ONE Read loads them all. If it is missing or stale, regenerate with
  `node tools/hooks/inject-<skill>-dr.js` then Read it. **Do NOT proceed without it**
```

The agent checks by trying to Read it; if missing, the agent runs the regenerate command via Bash then Reads the output.

### RQ2: SUBAGENT EMBED — How the Section Analyzer receives its bundle

**Verified by reading `prompts/funnel-deep-pass.md` pipeline diagram.** [VERIFIED: codebase]

The Section Analyzer pipeline:
```
funnel-analyzer-context.js (assembler)
  ← assembles [DR bundle (via inject-dr.js)] + [cleaned funnel body in <funnel_copy>]
  → into the analyzer's spawn prompt
```

`funnel-analyzer-context.js` is the orchestrator-side assembler that:
1. Runs `inject-dr.js` (or reads the pre-generated bundle file)
2. Reads the cleaned funnel body
3. Concatenates them into the spawn prompt string
4. Spawns the Section Analyzer agent with that assembled string as context

**For the Architect and Copywriter, the equivalent mechanism is the SKILL.md `read_first` section** — because these are interactive skills, not batch-spawned subagents. The operator opens the skill; the agent reads the bundle as step 0.

**Where the lesson "hooks do NOT fire in subagents" is recorded:**

- `tools/hooks/inject-dr.js` header: "There is NO harness auto-injection — the analyzer runs as a subagent where settings hooks don't fire."
- `tools/hooks/inject-market-selection-dr.js` header: "the market-selection assessor runs as an @-referenced subagent... where settings-based PreToolUse hooks do NOT fire. The 2026-06 Arduview run consequently executed the gate with ZERO DR-doc grounding."
- `market-selection/SKILL.md`: "There is NO auto-injection — you must Read it... the 2026-06 Arduview run executed the entire gate with ZERO DR grounding because this step was silently skipped (SKILL.md falsely claimed the files were auto-injected; no such mechanism exists)"
- `15-COPYWRITE-WIRING-REFERENCE.md`: "hooks do not fire in subagents and injection must be an explicit orchestrator step (same lesson as inject-dr.js / market-selection)"
- `15-CONTEXT.md` D5: "hooks do NOT fire inside subagents"

[VERIFIED: codebase — four independent records of the same lesson]

### RQ3: RAG SOURCE-ROUTING — Exact minimal edits (D2)

**Verified by reading `funnel-vectorize.js` `loadUnits()` and `funnel-rag-query.js` prefilter block.** [VERIFIED: codebase]

**Problem confirmed:** The existing `_index.json` records DO NOT contain `source_type` or `routing_flag`. Inspected the fixture `_index.json` — the unit object in the index starts at line 44 and has: `funnel_id, competitor, transformation, primary_claim, claim_type, awareness_entry, validation_lane, validation_strength, position, belief_id, execution_type, proof_tier, execution_detail, moves, verbatim_refs, embed_text, vector`. No `source_type`. No `routing_flag`.

**Edit 1 — `funnel-vectorize.js` `loadUnits()` (single unit push, lines 107-128):**

Add two lines to the unit object literal:
```javascript
units.push({
  // existing funnel-level attribution:
  funnel_id:           funnel.funnel_id,
  competitor:          funnel.competitor ?? null,
  transformation:      funnel.transformation ?? null,
  primary_claim:       funnel.primary_claim ?? null,
  claim_type:          funnel.claim_type ?? null,
  awareness_entry:     funnel.awareness_entry ?? null,
  validation_lane:     funnel.validation_lane ?? null,
  validation_strength: funnel.validation_strength ?? null,
  // ADD THESE TWO:
  source_type:         funnel.source_type ?? null,      // 'dtc' | 'crowdfunding'
  routing_flag:        funnel.routing_flag ?? null,     // 'structure_only' | 'messaging_full' | 'both'
  // ... rest unchanged
});
```

**Edit 2 — `funnel-rag-query.js` prefilter block (lines 79-81):**

After the existing two prefilter lines, add:
```javascript
if (opts['source-type'])  records = records.filter(r => norm(r.source_type)  === norm(opts['source-type']));
if (opts['routing-flag']) records = records.filter(r => norm(r.routing_flag) === norm(opts['routing-flag']));
```

And update the `--help` block and `prefilter:` emit line accordingly.

**Will re-vectorizing be required?** YES — the existing `_index.json` (including the fixture's `_index.json`) does not have these fields. After editing `funnel-vectorize.js`, re-run `node tools/funnel-vectorize.js --space=_fixture` to rebuild. The fixture `_index.json` will then carry `source_type: "crowdfunding"` and `routing_flag: "both"` on all 4 records.

**Does fixture `_index.json` need rebuilding?** Yes, as above. The `embed_text` string itself does NOT change (source_type is not embedded); only the metadata fields on the unit change. If `VOYAGE_API_KEY` is set, this is a real API call. If not, the stub runs. The fixture was originally built with Voyage (`"backend": "voyage:voyage-3-large", "is_stub": false`). The re-build should use Voyage again to keep the same vectors, or accept that stub vectors differ.

**Recommended:** For the verification task, if no VOYAGE_API_KEY is available in the test environment, build a separate `_fixture-stub` fixture with stub embeddings. Document this in the wave plan.

### RQ4: belief_kind (D1) — Exact edit sites

**Verified by reading `prompts/funnel-deep-pass.md` §6b and `tools/hooks/validate-analyzer.js`.** [VERIFIED: codebase]

**Edit 1 — `prompts/funnel-deep-pass.md` §6b schema:**

Add field after `belief_confidence`:
```json
"belief_kind": "'crowdfunding-specific' | 'general-dr' — which category of belief this is; crowdfunding-specific = beliefs that only appear in crowdfunding funnels (e.g. it-will-ship, trust-the-brand-or-founder as founder-credibility); general-dr = beliefs that appear in any DR funnel"
```

And add to the closed enums block:
```
BELIEF_KIND_ENUM:       crowdfunding-specific | general-dr
```

**Edit 2 — `runs/_fixture/funnels/sample.json`:**

Add `belief_kind` to each of the 4 existing belief records:
- record position 1 (`mechanism-is-the-reason` / mechanism-explanation): `"belief_kind": "general-dr"`
- record position 3 (`trust-the-brand-or-founder` / founder-credibility): `"belief_kind": "crowdfunding-specific"` (founder-on-camera install is crowdfunding-characteristic)
- record position 4 (`it-will-ship` / social-proof): `"belief_kind": "crowdfunding-specific"` (ship-trust is the canonical crowdfunding-specific belief)
- record position 5 (`act-now` / scarcity): `"belief_kind": "general-dr"`

**Edit 3 — `tools/hooks/validate-analyzer.js`:**

Add a new `BELIEF_KIND_ENUM` constant:
```javascript
const BELIEF_KIND_ENUM = new Set(['crowdfunding-specific', 'general-dr']);
```

Add a new rule in the belief_records loop (after Rule 2, before Rule 3):
```javascript
// --- Rule 2b: belief_kind closed vocab ---
if (rec.belief_kind === undefined || rec.belief_kind === null) {
  violations.push(`REJECT: ${rLabel} missing "belief_kind" — must be 'crowdfunding-specific' | 'general-dr'`);
} else if (!BELIEF_KIND_ENUM.has(rec.belief_kind)) {
  violations.push(`REJECT: ${rLabel} belief_kind="${rec.belief_kind}" is off-enum — must be 'crowdfunding-specific' | 'general-dr'`);
}
```

**Other consumers that read belief records:**
- `tools/funnel-vectorize.js` — does NOT read `belief_kind` (not included in `embedText()` or unit object). No breakage; `belief_kind` is transparently passed through since it will be in the funnel file.
- `tools/funnel-rag-query.js` — does NOT filter on `belief_kind`. No breakage.
- `tools/funnel-claim-tally.js` — the new script; does NOT use `belief_kind`. By spec it reads `moves[]` only.
- `tools/hooks/validate-analyzer.js` — the only consumer that validates the schema; requires the Rule 2b addition above.
- `validate-analyzer.js` currently passes on records without `belief_kind` (field is absent = no violation). After the rule is added, all existing stored records that lack `belief_kind` will be rejected. The only stored record set is the fixture — update it first.

**Sequence:** edit fixture FIRST, then add the validator rule, so existing validation passes don't break mid-work.

### RQ5: claim-tally (D4) — Buildability and MOVE_ENUM location

**Verified by reading `15-CLAIM-TALLY-IMPL-SPEC.md`, `tools/hooks/validate-analyzer.js`, `runs/_fixture/funnels/sample.json`.** [VERIFIED: codebase]

**Buildable as-is?** YES, with one clarification: the fixture's `moves[]` tags are synthetic off-enum strings. The spec documents this explicitly (§2b: "SYNTHETIC FIXTURE — not real scraped data"). The script will:
- Accept off-enum tags without rejecting them (by spec: "Do NOT reject or filter. Accept any non-empty string as a move key.")
- Produce `low_n_warning: true` since 1 < threshold 5
- All 14 move keys go to `whitespace[]`

Tests A, B, C, D, E in §5 of the spec are runnable against the fixture without modification.

**Where MOVE_ENUM lives:**
- Canonical definition: `prompts/funnel-deep-pass.md` in the "Closed enums" block (line ~123-128 of the file):
  ```
  MOVE_ENUM: market-avatar-flip | market-transformation-change | um-mechanism-reveal |
             um-problem-framing | um-proprietary-naming | angle-desire | angle-pain |
             angle-external-blame | angle-care-signaling | angle-identity-belonging |
             angle-curiosity-secret | offer-bundle | offer-guarantee |
             offer-urgency-scarcity | offer-price-anchor
  ```
- Runtime enforcement: `tools/hooks/validate-analyzer.js` lines 90-106, the `MOVE_ENUM` Set constant. This is the authoritative code copy.

The claim-tally script does NOT validate against MOVE_ENUM (it accepts any string). This is correct — the validator is the gatekeeper; the tally is a reader.

### RQ6: SKILL files — Location and structural template

**Verified by reading `.claude/skills/market-selection/SKILL.md` in full.** [VERIFIED: codebase]

**Where new SKILL.md files live:**
- `.claude/skills/funnel-architect/SKILL.md`
- `.claude/skills/copywriter/SKILL.md`

(Directory `.claude/skills/` already contains `funnel-deep-pass/` and `market-selection/` subdirectories — the pattern is confirmed.)

**Complete PMF skill structure (from market-selection SKILL.md):**

```markdown
---
name: <skill-name>
description: >-
  <what this skill does, when to run it, what it produces> (used by Claude
  to decide when to invoke the skill)
---

> Derived from <source spec> — edit the spec, regenerate this.

# <Skill Title> — <subtitle>

## Role
<what the agent IS and IS NOT; its output; what it does NOT do>

## read_first (load before running — do not proceed without these)
- `<relative path>` — <what it contains and why needed>
- `.claude/skills/<skill>/_dr-context.generated.md` — all N DR files below,
  concatenated. ONE Read loads them all. If missing or stale, regenerate with
  `node tools/hooks/inject-<skill>-dr.js` then Read it. **Do NOT proceed without it**
  — [brief statement of what zero-grounding cost on last run]

Bundled files (sources under `~/knowledge/dr-marketing/`):
- `<filename>` — <what this file does for this skill>
...

---
## INPUTS
<what the operator provides / what files the skill reads>

## [THE PROCEDURE / THE GATES / HOW YOU DESIGN]
<the judgment steps — referenced from the operator spec, not re-written here>

## OUTPUT
<what the skill produces; where it writes; what it does NOT produce>

## SELF-AUDIT (run before writing — reject your own output if any fails)
- [ ] <checklist items>
```

**Key structural rules from the market-selection example:**
1. The YAML frontmatter `name` + `description` is required — Claude uses it for skill routing.
2. `## read_first` MUST be the second substantive section (after Role), so the agent reads context before seeing the procedure.
3. The bundle path and regenerate command are stated inline in `read_first` — not in a footnote or appendix.
4. The spec's behavior content (procedure, rules, failure modes) is inlined or referenced — for Phase 15, it will be inlined from the operator specs verbatim.
5. A SELF-AUDIT checklist is at the bottom — prevents the agent from submitting output that violates its own rules.

### RQ7: VERIFICATION — Concrete runnable checks

All verification commands assume `cwd = /home/kyu3/PMF`.

**A. Each DR bundle lands in the right agent's context:**

```bash
# 1. Generate the bundles
node tools/hooks/inject-funnel-architect-dr.js
node tools/hooks/inject-copywriter-dr.js

# 2. Verify output files exist and are non-empty
stat .claude/skills/funnel-architect/_dr-context.generated.md
stat .claude/skills/copywriter/_dr-context.generated.md

# 3. Verify each expected DR filename is present in its bundle
# Architect bundle must contain:
grep -c "=== DR FILE:" .claude/skills/funnel-architect/_dr-context.generated.md
# Copywriter bundle must contain exactly 3 files:
grep "=== DR FILE:" .claude/skills/copywriter/_dr-context.generated.md
# Expected: copywriting--spencer-origins.md, copywriting--carl-weische.md, copywriting--mark-builds-brands.md

# 4. Runtime proof: when the Architect skill is opened, the first agent action must be:
#    Read .claude/skills/funnel-architect/_dr-context.generated.md
#    The operator verifies this Read appears in the tool-call log before any analysis output.
```

**B. Source-routed RAG filters correctly:**

```bash
# First rebuild the fixture index after funnel-vectorize.js is edited
node tools/funnel-vectorize.js --space=_fixture

# Verify source_type is now present in the index records
node -e "const i=require('./runs/_fixture/funnels/_index.json'); console.log(i.records[0].source_type, i.records[0].routing_flag)"
# Expected: crowdfunding both

# Filter test: all 4 fixture records are source_type=crowdfunding → expect 4 results
node tools/funnel-rag-query.js --space=_fixture --query="ship trust" --source-type=crowdfunding --top=10 2>&1 | head -5
# Expected: "Prefilter: source_type=crowdfunding · returned 4 of 4 indexed"

# Filter test: source_type=dtc → 0 results (all fixture records are crowdfunding)
node tools/funnel-rag-query.js --space=_fixture --query="ship trust" --source-type=dtc --top=10 2>&1 | head -5
# Expected: "[warn] prefilter eliminated all records"
```

**C. Claim-tally output is injected:**

```bash
# Generate the tally
node tools/funnel-claim-tally.js --space=_fixture --json 2>&1

# Expected:
# - stderr: [claim-tally] WARN: store has 1 funnels < threshold 5
# - stdout: JSON with _meta.low_n_warning: true, dead_ground: [], whitespace: 14 entries

# Write to file
node tools/funnel-claim-tally.js --space=_fixture
cat runs/_fixture/funnels/_tally.json | node -e "const d=require('fs').readFileSync('/dev/stdin','utf8'); const j=JSON.parse(d); console.log('funnels:', j._meta.total_funnels, '| low_n:', j._meta.low_n_warning, '| whitespace:', j.whitespace.length)"
# Expected: funnels: 1 | low_n: true | whitespace: 14

# Runtime proof: when the Architect skill is opened, the agent must read _tally.json and
# its content must appear verbatim (or as a labeled block) in the conversation context
# before the agent's first design output. Operator inspects the tool-call log.
```

**D. belief_kind round-trips:**

```bash
# After adding belief_kind to sample.json, verify the validator accepts it
node tools/hooks/validate-analyzer.js runs/_fixture/funnels/sample.json
# Expected: exit 0 (silent)

# After adding the Rule 2b validator check, a record missing belief_kind must be rejected:
# Create a temp file without belief_kind on one record and verify exit 2
node -e "
  const data = JSON.parse(require('fs').readFileSync('runs/_fixture/funnels/sample.json','utf8'));
  delete data.belief_records[0].belief_kind;
  require('fs').writeFileSync('/tmp/test-no-belief-kind.json', JSON.stringify(data));
"
node tools/hooks/validate-analyzer.js /tmp/test-no-belief-kind.json
# Expected: exit 2, stderr contains 'missing "belief_kind"'
```

**E. End-to-end fixture verification (the integration gate):**

```bash
# Full chain:
# 1. Rebuild fixture index (after funnel-vectorize.js edit)
node tools/funnel-vectorize.js --space=_fixture

# 2. Build tally
node tools/funnel-claim-tally.js --space=_fixture

# 3. Verify validator passes on updated fixture
node tools/hooks/validate-analyzer.js runs/_fixture/funnels/sample.json

# 4. Query RAG with source-type filter
node tools/funnel-rag-query.js --space=_fixture \
  --query="open hardware modular handheld" \
  --belief=mechanism-is-the-reason \
  --source-type=crowdfunding \
  --top=3

# 5. Verify both DR bundles are generated and non-empty
wc -c .claude/skills/funnel-architect/_dr-context.generated.md
wc -c .claude/skills/copywriter/_dr-context.generated.md
```

### RQ8: PLAN/WAVE SPLIT

**Four waves, ordered by dependency:**

```
Wave 0 — Shared schema + tooling substrate (unblocks both skills)
  Tasks:
  - Add belief_kind to funnel-deep-pass.md §6b schema + BELIEF_KIND_ENUM
  - Update sample.json with belief_kind on all 4 belief records
  - Add Rule 2b to validate-analyzer.js; verify exit 0 on updated fixture
  - Extend funnel-vectorize.js to carry source_type + routing_flag
  - Add --source-type (and --routing-flag) prefilter to funnel-rag-query.js
  - Rebuild _fixture _index.json; run filter verification tests
  - Build tools/funnel-claim-tally.js per 15-CLAIM-TALLY-IMPL-SPEC.md
  - Run claim-tally verification tests A-E from the spec

Wave 1 — Funnel Architect skill
  Tasks:
  - Build inject-funnel-architect-dr.js (mirror inject-market-selection-dr.js exactly)
  - Determine architect DR allowlist (5 files: see allowlist section below)
  - Generate .claude/skills/funnel-architect/_dr-context.generated.md
  - Build .claude/skills/funnel-architect/SKILL.md (inline 15-SPEC-funnel-architect.md;
    add read_first section; add SELF-AUDIT)
  - Verify bundle generation + read_first check

Wave 2 — Copywriter skill
  Tasks:
  - Build inject-copywriter-dr.js (mirror inject-market-selection-dr.js exactly)
  - Determine copywriter DR allowlist (3 files: see allowlist section below)
  - Generate .claude/skills/copywriter/_dr-context.generated.md
  - Build .claude/skills/copywriter/SKILL.md (inline 15-SPEC-copywriter.md;
    add read_first section; add SELF-AUDIT)
  - Verify bundle generation + read_first check

Wave 3 — End-to-end verification (operator verification mandate)
  Tasks:
  - Run full chain against fixture: tally → architect context → brief → copywriter RAG → prose
  - Operator verifies Architect's tool-call log shows Read of _dr-context.generated.md
    as first action, _tally.json content present in context
  - Operator verifies Copywriter's tool-call log shows Read of _dr-context.generated.md
    as first action, RAG blocks present per section
  - Operator verifies source-routing filter works (crowdfunding vs dtc gate)
  - Document any gaps found; fix before phase is marked complete
```

**Coupling note:** Wave 1 and Wave 2 are independent of each other (can be done in either order or in parallel). Both depend on Wave 0 (shared tooling). Wave 3 depends on all of 0, 1, 2.

---

## DR Allowlist Recommendations (Claude's Discretion)

**Architect bundle** (DR files per spec's named categories: funnel-architecture, persuasion, differentiator-framework, consumer-psychology, offer-construction/pricing):

| File | Rationale |
|------|-----------|
| `funnel-architecture--carl-weische.md` | V-shape awareness model, 4 funnel types, pre-sale 4-part, 8-step advertorial, hybrid sales-page architecture — the structural vocabulary |
| `persuasion--carl-weische.md` | 6 cold-offer persuasion elements, objection→element mapping — the execution vocabulary |
| `differentiator-framework__2_.md` | 4 levers, claim-typing, believability tiers, market-vs-angle test — keeps angle singular |
| `consumer-psychology--carl-weische.md` | Awareness-stage + sophistication-stage tables, Mass Desire core drivers — awareness-calibration reference |
| `offer-construction--carl-weische.md` | Irresistible-offer / value-equation, anchor structures, crowdfunding offer mechanics — offer shaping |

(5 files total; excludes pricing--mark-builds-brands.md as secondary — Architect spec does not list it separately and offer-construction covers the mechanics needed.)

**Copywriter bundle** (craft files per spec, Hormozi excluded per spec):

| File | Rationale |
|------|-----------|
| `copywriting--spencer-origins.md` | Word/line-level craft: power-word substitution, show-don't-tell, steal-frameworks-not-words, Grade-6 readability — primary file per spec |
| `copywriting--carl-weische.md` | Section/paragraph construction: Hook-Pain-Bridge-Outcome, feature-to-benefit, sensory language, advertorial frameworks, don't-dilute — primary file per spec |
| `copywriting--mark-builds-brands.md` | Body-copy structure, eight-element sales page, slippery-slide chiefing pass — secondary file per spec |

(3 files total; exactly as specified in 15-SPEC-copywriter.md §SUPPORTING KNOWLEDGE)

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Embedding vectors | Custom embedding | `tools/lib/embed.js` | Already built; Voyage + stub dual-backend; swap point is here |
| Semantic similarity | Custom cosine | `tools/lib/embed.js` `cosine()` | Already built; handles dim mismatch and zero-vector |
| DR file concatenation | Manual copy-paste | `inject-*.js` bundler scripts | Path-traversal guard, missing-file safety, deterministic headers |
| Funnel store enumeration | Custom glob | `funnel-claim-tally.js` pattern (mirror aggregate-mechanisms) | Sanitized path, underscore-prefix exclusion convention already established |
| RAG retrieval | Custom embedding call in SKILL.md | `funnel-rag-query.js` (called by orchestrator) | Deterministic script; agent never does arithmetic |

---

## Common Pitfalls

### Pitfall 1: "Auto-injected" means the agent will receive the DR files
**What goes wrong:** The SKILL.md says "DR files are auto-injected" and no bundler is built. The agent runs with zero DR grounding. This happened on the 2026-06 Arduview run.
**Why it happens:** Hooks (PostToolUse, PreToolUse) do not fire in subagents or @-referenced skills. There is no harness auto-injection mechanism in this repo.
**How to avoid:** Every "auto-injected" reference in both specs MUST be replaced with the deterministic `inject-*.js` + `read_first` pattern. The OPERATOR VERIFICATION MANDATE at the bottom of both specs exists for this reason.
**Warning signs:** SKILL.md says "auto-injected" with no bundler script and no `read_first` Read step.

### Pitfall 2: `belief_kind` validator added before fixture is updated
**What goes wrong:** Adding Rule 2b to `validate-analyzer.js` before adding `belief_kind` to `sample.json` causes the fixture to fail validation. Any CI or manual verification step that runs the validator against the fixture will fail unexpectedly.
**How to avoid:** Update `sample.json` first; add the validator rule second. Verify `exit 0` after each step.

### Pitfall 3: Re-running funnel-vectorize.js without VOYAGE_API_KEY on a Voyage-built index
**What goes wrong:** The existing `_fixture/_index.json` was built with Voyage (`is_stub: false`, `dim: 1024`). Re-running with no key builds a stub index (`dim: 512`). Querying the new stub index with the funnel-rag-query.js will see the backend-drift guard fire and return meaningless cosines.
**How to avoid:** Keep VOYAGE_API_KEY set when rebuilding the fixture index, or explicitly build a `_fixture-stub` space for key-free testing. Document which space has which backend in the verification task.

### Pitfall 4: Claim-tally injected into Copywriter context instead of Architect
**What goes wrong:** The tally is the Architect's dead-ground/whitespace input (Step 6). If it lands only in the Copywriter context, the Copywriter has no use for it (the Architect already made strategic decisions).
**How to avoid:** Per spec: "_tally.json is an ARCHITECT INPUT, not a copywriter input." The orchestrator only injects the tally into the Architect's spawn context.

### Pitfall 5: Copywriter runs RAG without source-type filter
**What goes wrong:** The Copywriter retrieves crowdfunding + DTC results for a ship-trust section, gets DTC results that don't install ship-trust, produces copy that doesn't land the belief.
**How to avoid:** The Architect's copy brief must specify the source gate per section. The orchestrator reads that gate value and passes `--source-type=crowdfunding` (or `--source-type=dtc`) for each section. The `--source-type` flag is only useful after funnel-vectorize.js is extended (Wave 0).

### Pitfall 6: The Copywriter re-decides strategy
**What goes wrong:** The Copywriter "improves" the angle or changes the install spec, creating congruency breaks with the Architect's brief.
**How to avoid:** Copywriter Rule 1 ("the brief's angle beats the RAG's angle, always") is the safeguard. The SKILL.md SELF-AUDIT must check: "Did I change the angle, the belief assignment, or the install spec? If yes, revert."

---

## Code Examples

### Pattern: New DR bundler (copy of inject-market-selection-dr.js structure)
```javascript
// inject-funnel-architect-dr.js
'use strict';
const fs   = require('fs');
const path = require('path');
const os   = require('os');

const args = process.argv.slice(2);
const opts = Object.fromEntries(
  args.filter(a => a.startsWith('--'))
      .map(a => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; })
);

const DR_DIR = path.join(os.homedir(), 'knowledge', 'dr-marketing');
const DEFAULT_OUT = path.resolve(__dirname, '..', '..',
  '.claude', 'skills', 'funnel-architect', '_dr-context.generated.md');

const ALLOWLIST = [
  { file: 'funnel-architecture--carl-weische.md', use: 'V-shape awareness model, 4 funnel types, structural vocabulary' },
  { file: 'persuasion--carl-weische.md',          use: 'Cold-offer persuasion elements + objection mapping' },
  { file: 'differentiator-framework__2_.md',      use: '4 levers, claim-typing, believability tiers, market-vs-angle test' },
  { file: 'consumer-psychology--carl-weische.md', use: 'Awareness + sophistication stage tables; Mass Desire core drivers' },
  { file: 'offer-construction--carl-weische.md',  use: 'Irresistible-offer/value-equation, crowdfunding offer mechanics' },
];

// ... (isUnderDrDir, load loop, zero-files guard, banner, write — identical to inject-market-selection-dr.js)
```

### Pattern: `read_first` section in SKILL.md
```markdown
## read_first (load before running — do not proceed without these)

- `runs/<space>/funnels/*.json` — the funnel store produced by the Section Analyzer
- `runs/<space>/funnels/_tally.json` — the claim tally (run `node tools/funnel-claim-tally.js --space=<space>` if missing or stale)
- `.claude/skills/funnel-architect/_dr-context.generated.md` — all 5 DR files bundled.
  ONE Read loads them all. If missing or stale, regenerate with
  `node tools/hooks/inject-funnel-architect-dr.js` then Read it.
  **Do NOT proceed without it** — the 2026-06 Arduview run executed the market-selection
  gate with ZERO DR grounding because this step was silently skipped.
```

### Pattern: funnel-rag-query.js prefilter addition
```javascript
// Existing (lines 79-81):
if (opts.belief)        records = records.filter(r => norm(r.belief_id)  === norm(opts.belief));
if (opts['proof-tier']) records = records.filter(r => norm(r.proof_tier) === norm(opts['proof-tier']));

// Add after:
if (opts['source-type'])  records = records.filter(r => norm(r.source_type)  === norm(opts['source-type']));
if (opts['routing-flag']) records = records.filter(r => norm(r.routing_flag) === norm(opts['routing-flag']));
```

### Pattern: funnel-vectorize.js unit carry-through
```javascript
// In loadUnits(), the units.push({...}) block — add these two lines:
source_type:   funnel.source_type  ?? null,   // 'dtc' | 'crowdfunding' (D2: carry funnel-level field into unit)
routing_flag:  funnel.routing_flag ?? null,   // 'structure_only' | 'messaging_full' | 'both'
```

---

## Runtime State Inventory

This is not a rename/refactor phase. No runtime state inventory required.

---

## Validation Architecture

Tests are manual + script-verified (no automated test framework in this repo). All verification is the concrete shell commands in RQ7 above. The Wave 3 task is the integration gate — it must pass before the phase is marked complete.

| Req ID | Behavior | Test Type | Command |
|--------|----------|-----------|---------|
| FUNNEL-01 | Architect DR bundle lands in agent context | Script + operator | `grep "=== DR FILE:" .claude/skills/funnel-architect/_dr-context.generated.md` + Read log inspection |
| FUNNEL-01 | Claim tally runs against fixture | Script | `node tools/funnel-claim-tally.js --space=_fixture --json` |
| FUNNEL-01 | Tally present in Architect context | Operator | Inspect agent tool-call log for _tally.json Read + content |
| FUNNEL-02 | Copywriter DR bundle lands in agent context | Script + operator | `grep "=== DR FILE:" .claude/skills/copywriter/_dr-context.generated.md` + Read log inspection |
| FUNNEL-02 | Source-type filter works | Script | `node tools/funnel-rag-query.js --space=_fixture --query=... --source-type=crowdfunding` |
| D1 | belief_kind round-trips through validator | Script | `node tools/hooks/validate-analyzer.js runs/_fixture/funnels/sample.json` → exit 0 |
| D1 | Missing belief_kind rejected | Script | Modified temp fixture → exit 2 |

---

## Security Domain

No new external-facing surface. The new bundler scripts mirror the path-traversal guard already in `inject-dr.js` and `inject-market-selection-dr.js` — the filename allowlist is hardcoded, each resolved path is checked against DR_DIR before reading. No user input reaches the filesystem.

The `--space` sanitization in `funnel-claim-tally.js` must mirror `funnel-rag-query.js`'s `sanitizePathSegment` function (T-03-13 parity). The spec documents this.

---

## Open Questions

1. **VOYAGE_API_KEY availability for fixture rebuild**
   - What we know: the existing `_index.json` was built with Voyage (dim=1024). Rebuilding without a key produces a stub index (dim=512), which triggers the backend-drift guard.
   - What's unclear: whether the test environment has VOYAGE_API_KEY set.
   - Recommendation: The verification task should first check `echo $VOYAGE_API_KEY`. If set, rebuild with Voyage. If not, create `runs/_fixture-stub/funnels/` as a parallel space using the same `sample.json` and build with stub backend — both spaces are valid for testing different behaviors.

2. **Architect-to-Copywriter handoff format for the copy brief**
   - What we know: the spec says "per section: belief_id, angle/intent string, source gate, install spec, dead-ground, blocked ports."
   - What's unclear: the exact JSON or markdown format of the copy brief. The spec does not prescribe it; it is designed in conversation.
   - Recommendation: The planner should spec a copy-brief format as a Wave 1 deliverable. Proposed minimal fields per section:
     ```json
     {
       "section_id": "string",
       "belief_id": "string",
       "belief_kind": "crowdfunding-specific | general-dr",
       "angle_intent": "string — what this section accomplishes and how it's framed",
       "source_gate": "crowdfunding | dtc | both",
       "install_spec": "string — execution_type + the specific move + proof type",
       "dead_ground_avoid": ["string — move tags to avoid"],
       "blocked_ports": ["string — claims/assets unavailable"]
     }
     ```
     This is Claude's Discretion and does not need operator confirmation.

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `funnel-analyzer-context.js` assembles the Section Analyzer spawn prompt by reading the pre-generated DR bundle + funnel body | RQ2 | Medium — the pipeline diagram in funnel-deep-pass.md is authoritative but the actual funnel-analyzer-context.js file was not read. No plan task depends on this file's internals. |
| A2 | The `.claude/skills/` directory is the correct location for new skills in this repo | RQ6 | Low — confirmed by `ls .claude/skills/` showing two subdirs already |
| A3 | The 5-file architect allowlist excludes `funnel-architecture--mark-builds-brands.md` and `funnel-architecture--spencer-origins.md` without loss | Allowlist | Low — the spec names "Carl + Mark" for architecture but the carl file covers the V-shape model the spec quotes directly; the mark file is secondary |

**All other claims are VERIFIED against on-disk code or spec files.**

---

## Sources

### Primary (HIGH confidence — verified via Read tool against on-disk files)
- `tools/hooks/inject-dr.js` — full anatomy of the Section Analyzer bundler pattern
- `tools/hooks/inject-market-selection-dr.js` — full anatomy of the market-selection bundler pattern (the closer template)
- `.claude/skills/market-selection/SKILL.md` — complete `read_first` declaration pattern and skill structure
- `tools/funnel-vectorize.js` — confirmed `source_type` and `routing_flag` are dropped from index units
- `tools/funnel-rag-query.js` — confirmed existing prefilter handles `--belief` and `--proof-tier` only
- `tools/hooks/validate-analyzer.js` — confirmed MOVE_ENUM, BELIEF_ANCHOR_SET, all closed-enum rules
- `tools/aggregate-mechanisms-in-play.js` — confirmed repo conventions for tally scripts
- `runs/_fixture/funnels/sample.json` — confirmed fixture has 4 belief records with synthetic moves[]
- `runs/_fixture/funnels/_index.json` — confirmed index lacks `source_type` / `routing_flag` fields
- `tools/lib/embed.js` — confirmed `embed()`, `cosine()`, `backendName()`, `isStub()` signatures
- `15-CONTEXT.md` — LOCKED decisions D1-D7 and canonical references
- `15-SPEC-funnel-architect.md` — behavior authority; OPERATOR VERIFICATION MANDATE
- `15-SPEC-copywriter.md` — behavior authority; OPERATOR VERIFICATION MANDATE
- `15-CLAIM-TALLY-IMPL-SPEC.md` — implementation-ready spec for `funnel-claim-tally.js`
- `15-COPYWRITE-WIRING-REFERENCE.md` — RAG orchestration contract
- `prompts/funnel-deep-pass.md` — 6a/6b schema; MOVE_ENUM; pipeline diagram

### Secondary
- `runs/arduview/RERUN-BRIEF.md` (not read directly) — referenced in multiple files as the source of the zero-grounding lesson

---

## Metadata

**Confidence breakdown:**
- Injection pattern: HIGH — read both existing bundlers in full; anatomy is copy-pasteable
- Source-routing edits: HIGH — read both files; exact line locations identified
- belief_kind edits: HIGH — read schema doc and validator; exact rule specified
- claim-tally buildability: HIGH — read impl spec and fixture; tests are runnable
- DR allowlist recommendation: MEDIUM — inferred from spec categories; Hormozi exclusion is explicit; mark file for architecture is discretionary
- SKILL.md structure: HIGH — read the only existing complete PMF skill file

**Research date:** 2026-06-04
**Valid until:** Until any of the referenced on-disk files change. The most volatile: `prompts/funnel-deep-pass.md` schema (changes if Section Analyzer is extended again) and the fixture (changes if real market data arrives).
