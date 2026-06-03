# Handoff — Prompt-Building State

Entry point for the next session. Covers **where the agent prompts stand** — what's durable
vs what was throwaway from the Inkleaf run. Nothing here is committed to git.

## The 3-layer model (decided, locked)

The project separates into three layers. Don't collapse them.
1. **Flow** (`flow.md`) — the skeleton: steps, order, purpose. Thin, no theory.
2. **Agent prompts** (`prompts/`) — theory-heavy. The variables, questions, classification rules
   each step uses. Raw material = the original workflow doc + the Inkleaf briefs.
3. **Technical implementation** — scripts (fetch/clean/dedupe), hook JSON, data storage.

## What's DURABLE (built this cycle, on disk)

- **`flow.md`** — layer 1. Two altitudes (map a space = wide+shallow → pick a market; study a
  market = narrow+deep). Phase 0 → Phase 2 light skeleton + markers for Phase 3/4-8 (not run).
- **`prompts/phase1-light-pass.md`** — layer 2, the FIRST real durable prompts this project has
  had. Three agents + shared schema + deterministic-scaffold spec:
  - **Finder** (1 agent, product-start): 3 lanes (major / crowdfunding incl. KS+IGG / marketplace),
    dedupe, crowdfunding as a schema field. Delivers brands + raw observed facts. Does NOT classify.
  - **Dumper** (1 per brand, parallel): reads CLEAN copy only, verbatim. Unit = the **creative**
    (ad / LP / product page). Inside each creative, copy is grouped into **pitches** — a pitch
    bundles `{claims + mechanism + problem_um_raw}` for ONE outcome, so transformation stays bound
    to its mechanism + problem-UM (not floating in parallel arrays). niche/angle/awareness sit at
    creative level. Dumper assigns NO canonical labels (transformation/canonical_niche/canonical_angle
    all null).
  - **Space Classifier** (1 agent, reads ALL dumps): the only stage that sees every brand at once.
    Clusters raw claims→transformations, niche_raw→niches, angle_raw→angles (all EMERGENT, no preset
    taxonomy). Labels the PITCH (keeps the binding). Builds combos (transf × niche), per-cell
    saturation, and the shared-vs-unique Problem-UM judgment (3+ brands = shared mechanism, 1 = ownable).
  - **Field rules:** open (dumper verbatim → classifier clusters) = claims · mechanism · niche ·
    angle · problem-UM. closed enum (dumper picks, hook-rejected off-list) = awareness · channel · lane.
    **mechanism is per-pitch, never clustered** (deliberate).
  - **Determinism:** scripts own fetch/clean/dedupe; dumper reads only `clean/` (clean-copy rule
    enforced by file layout); hooks REJECT bad output (off-enum, non-verbatim claims, dumper-that-
    classified) instead of trusting the prompt.

## What's THROWAWAY (Inkleaf run — raw material, NOT durable prompts)

The Inkleaf run shipped fast with **briefs**, explicitly "beta prompts for THIS run." They are
NOT the prompt layer — they're the source we mine to write durable prompts. In
`runs/eink-tablets/scripts/`:
- `analyzer-brief.md` (Phase 0 light), `corpus-dumper-brief.md` (verbatim dump),
  `granular-analyzer-brief.md` (Phase 2 deep — the 13-section per-brand inventory),
  `market-playbook-brief.md`, `birdseye-synthesizer-brief.md`, the crowdfund briefs, etc.
- The actual subagent prompts that ran were written **inline in the sessions** — they live only in
  transcripts, never saved as files.

**What needs cleaning when these get turned into durable prompts** (the bugs we already fixed in
the light pass, to repeat in Phase 2):
- Parallel claim/feature/angle/transformation tables → **vacuum problem**. Fix = the **pitch**
  binding (transformation ↔ mechanism ↔ problem-UM).
- Discipline by **honor-system self-audit checklist** → replace with **rejection hooks**.
- Layer conflation (transformation vs feature vs angle vs mechanism mislabeled) → definitions +
  worked examples + the open/closed field split.
- Reads pre-existing corpus files → should read **clean copy** the script produced.

## Scripts (durable tooling that DID work — layer 3 inherits this)

In `runs/eink-tablets/scripts/`: `adlib-one.js` (page-ID-resolved Meta Ad Library — keyword search
was useless, rebuilt 3× around advertiser-page resolution; Boox corrected 0→230), `crowdfund-fetch.js`
(Playwright, bypasses KS/IGG/Crowd-Supply Cloudflare 403s). **Get Hooked: NOT used — dropped.**
Sources are **web search + Ad Library + crowdfunding** only. SimilarWeb blocks Playwright (abandoned).

## NOT built yet

- **Phase 1 layer-3**: `fetch.js` / `clean.js` / `dedupe.js` + the hook JSON. (Worth a subagent
  first to mine the existing scripts so fetch inherits the page-ID-resolution lessons.)
- **Phase 2 deep-analysis prompt**: the durable version of `granular-analyzer-brief.md` — per-brand
  13-section inventory (headlines, claims, features, transformation framing, angles, objection
  handles, **hooks ranked by days_running** = winner detection, funnel structure, trust signals +
  extraordinary identifier, deposit-funnel evidence). Skeleton exists in the old brief; needs the
  pitch structure + hooks + clean-copy input. Runs only on the top ~5 brands of the chosen market.
- **Aggregator / DR-marketer agent**: deferred on purpose.
- **Phase 3 (VOC/customer) and 4-8 (test→launch→eval)**: theory only, never run.

## The unproven caveat

The light-pass prompts are **drafted, never run against a real brand.** Per the project's own
lesson: write the prompt right before running it, stress-test against real output, fix what breaks.
First 2-3 runs are debugging, not research.

## Key files
- `flow.md` — layer 1
- `prompts/phase1-light-pass.md` — layer 2 (the durable prompts)
- `run-retrospective.md` — full delta-mining of the Inkleaf runs (what was learned, not in workflow.md)
- `runs/eink-tablets/scripts/*-brief.md` — throwaway briefs (raw material)
- `definitions.md` — locked vocabulary (every prompt loads it)
