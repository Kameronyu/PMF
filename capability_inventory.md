# Capability Inventory

The smallest single-job units the whole system composes from. **One job per brick, each routed to one executor** (see `CLAUDE.md`: deterministic jobs are scripts/hooks, only judgment jobs are agents). Steps are not monolithic prompts; they are **compositions of bricks**. This replaces the old flat "Op" tag, which lumped fetch + classify + extract together.

Run learnings not yet folded into bricks or specs live in `run-retrospective.md` — drain the relevant section when you build that part (its §8 maps what folds where).

---

## The brick set

| # | Brick | Executor | Job | Status |
|---|---|---|---|---|
| A1 | **Query design** | agent | Given a goal, produce the queries / venues / lanes to run | built (light pass); specced (VOC Query Planner) |
| A2 | **Classify** | agent | Tag each item against a frozen codebook; N/A allowed; cite evidence | built (light pass); specced (VOC Bucketer) |
| A3 | **Extract** | agent | Pull verbatim spans/fields per schema; no paraphrase | specced (VOC Ladderer, quote extractor) |
| A4 | **Synthesize** | agent | Combine across items into a structured analysis artifact (descriptive: what the data says, organized) | partial (market playbook ran, throwaway quality); specced (VOC Language Analyzer) |
| A5 | **Generate** | agent | Propose net-new candidates from heuristics (products, transformations) | **deferred** — not needed while product is fixed |
| S1 | **Fetch** | script | Retrieve raw data from a source, preserve all metadata | built (`adlib-one.js`, `crowdfund-fetch.js`); to build (Reddit) |
| S2 | **Clean** | script | Normalize, dedupe, strip junk; keep a raw immutable copy | specced (~30-line regex) |
| S3 | **Score/aggregate** | script | Counts, frequency (unique-user), intensity (VADER+engagement+length), co-occurrence matrix | partial (ran as an agent — must become a script); to build (VOC) |
| S4 | **Store** | script | Persist records + materialized views | interim = flat `.md` files; heavy persistence **deferred** (build JIT) |
| S5 | **Retrieve** | script | Query the store by slot | to build (depends on S4) |
| H1 | **Validate/gate** | hook | Reject agent output that breaks a rule (verbatim string-match, off-enum, schema) | specced (VOC verbatim gate) |
| D1 | **Decide** | human | The gates and strategic picks — **your DR strategy sessions** | ongoing (manual) |

**Adjacency rule.** Agents feed the human brick; they do not replace it. `A4 Synthesize → D1 Decide` (agent preps the analysis, you make the call). `A5 Generate → D1 Decide` (agent proposes, you pick). Your edge lives in D1; every other brick exists to feed it well.

**Two naming smells fixed by this model:** the old "market aggregator" and "frequency/intensity *synthesizer*" are **S3 (scripts)**, not synthesis. They count; they don't interpret. Interpretation on top is a separate A4 call.

---

## Steps as brick compositions

- **Light pass (Step 0–1):** `A1 → S1 → H1/S2 verify+dedupe → S4 → A2 classify per-brand → S3 aggregate space → D1 Gate 1` *(already built and running as `step1-light-pass.md`; the brick string shows how a fresh build would decompose, but it works — leave it unless it breaks)*
- **Deep comp (Step 2):** `A1 → S1 (ads/offers/channel) → A3 extract creative+offers → S3 aggregate → A4 cross-brand playbook → D1 Gate 2` *(old `granular-analyzer-brief.md` is throwaway; rebuild as this string)*
- **VOC (Step 3):** `A1 → S1 → S2 → A2 Bucketer → S3 freq+intensity+co-occurrence → A3 Ladderer → H1 verbatim gate → A4 Language Analyzer → S4 copy bank → D1 sub-niche call` *(spec: `handoff-step3-voc-build.md`; the proven template)*
- **Test design (Step 4):** `S5 retrieve copy bank + competitor data → A4 synthesize options → D1 the big DR session (angles, variables, test)`

---

## The ~20 capabilities, re-expressed as brick strings

**Discovery / mapping**
- Space-sketcher (partial-seed expander) → `A5` — *deferred*
- Per-brand extractor → `S1 + A2 + A3` (was one "Op"; it is three jobs)
- Market aggregator → `S3 (+ A4 for the pattern read)`

**Deep brand/market study (Step 2)**
- Ad creative + visual extractor → `S1 + A3`
- Offer/bundle structure extractor → `S1 + A3`
- Channel analysis → `S1 + S3`
- Trend / temporal signal → `S1 + A2` (evergreen vs emerging)

**Mechanism research**
- Mechanism research → `A1 + S1 + A4` (evidence-quality read)
- Product candidate discovery → `A5` *(deferred)*

**Seed expansion (Pipelines B/C)**
- Transformation-from-product expander → `S1 + A3 + A5` *(deferred)*
- Transformation-from-niche expander → VOC string scoped to "what they want changed"

**VOC pipeline**
- VOC scraper → `S1` · Cleaner → `S2` · Classifier/tagger → `A2` · Quote extractor → `A3` · PMBD clusterer → `S3` (co-occurrence math) · Frequency/intensity synthesizer → `S3` (counts, not synthesis) · Copy bank builder → `A4 organize + S4 store` · Institutional report retrieval → `S1 + A3`

**Purchase signal**
- Purchase signal composite → `S3`

**Test design support**
- VOC language extractor (scoped) → `S5` (query the copy bank, same store, narrower scope)

**Orchestration (the wiring, not a brick)**
- Pipelines A/B/C/D, Step 3d loop → composition logic that sequences bricks per input shape.

---

## Locked decisions

1. **One job per brick, routed to one executor.** Deterministic → script/hook. Judgment → agent. An "agent that cleans/counts/stores" is a category error. (See `CLAUDE.md`.)
2. **Per-brand extractor stays shallow.** Depth in Step 2 comes from *composing* bricks around one brand (`S1 + A3` for ads, offers, channel), not from a smarter extractor.
3. **3a and 3b are distinct.** Frequency aggregate (`S3`, Step 3a) and copy bank (`A4 + S4`, Step 3b) both branch downstream of the classifier (`A2`).
4. **Universal classifier, one schema.** `A2` reads any cleaned text from any source against one schema. N/A is valid. Source metadata is preserved and attached, never routes to source-specific schemas.
5. **Mechanism research = one capability.** Step 0 commercializability + Step 3c science are the same `A1 + S1 + A4`, different output framing.
6. **Cleaner is dumb first.** `S2` = 30 lines of regex now; modular contract lets it be swapped later without touching downstream.
7. **VOC chain is a brick string, not one op.** Branches at the classifier (`A2`) output into `A3/S3/A4`.
8. **Hypothesis selection is an explicit `D1`** between Step 0 and Step 1. Not invisible glue.
9. **Gate 2 = "do I want to run ads for this."** `D1` after deep research; Gate 1 (`D1`) gates whether the space is worth pursuing at all.
10. **Synthesize (A4) ≠ Decide (D1).** A4 reports what the data says, organized. D1 is your prescriptive strategy call on top. Agents stop at A4.

---

## Foundational Unders

> **Course correction (2026-05-21).** Persistence (`S4`) is **deprioritized.** PMF ships brands; the manual workflow + research questions already deliver that (proven on the eink run). Build tooling **just-in-time**: automate a brick only once it is the repeated bottleneck across brand-ships. `S4` is no longer a hard gate on agent specs. See `agents/implementation-notes.md`.

1. **Map / persistence layer (`S4`/`S5`).** Every brick reads from and writes to a shared store; Step 4 is read-heavy on accumulated outputs. Affects every brick's output schema (structured, dedupable, joinable). Interim: flat `.md`. Build the real store when manual friction justifies it.
2. **Authorship + source-metadata pass-through.** Every VOC brick must preserve author ID, platform, venue, URL, timestamp, engagement. Non-negotiable for the 5+ co-occurrence rule. Architectural constraint, not a feature.

---

## Downstream Unders (parked; resolve via manual runs first)

1. **Gap analysis scoring (Gate 1 / `D1`).** Variables locked, weights/thresholds not. Calibrate after 2–3 real spaces (3 now available).
2. **Win-decision framework (Gate 2 / `D1`).** Structure locked (Product UM play + steal proven variables). Thresholds open.
3. **Filtering thresholds.** Strong desire / proven spend / evergreen / underserved-hungry / solvable UM. All consume brick outputs. Calibrate from manual runs.

---

## Brick count

12 brick types across 4 executors. `A5 Generate` and the heavy `S4`/`S5` store are deferred. Everything else is built or specced. Final *agent* count is still decided per spec — a step may run two adjacent agent bricks (e.g. `A2 + A3`) in one call when there is no cost reason to split, but they stay separate brick *types*.
