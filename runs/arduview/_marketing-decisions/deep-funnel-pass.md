# Deep Funnel Pass — marketing decisions you own

> Surfaced from the Step 3 deep-pass retro (arduview / novelty-object-own × edc-aesthetic-collectors).
> These are open items that require your judgment before the next funnel build.
> The "what went wrong" is signal; the fixes are yours to decide.

---

## Belief-tagging verdict: NEVER validated (43 records consumed as ground truth)

**What happened:** The funnel-architect consumed 43 belief records from the Step 3 deep-pass run as ground truth. The belief-tagging verdict checkpoint (Task 3 of `03-DEBUG-RUN-NOTES.md`) was deferred and never completed. The architect built the full belief chain, angle, and install spec from these records without any operator review of whether the Analyzer classified them correctly.

**Why it matters:** If the Analyzer mis-classifies claims — wrong `belief_id`, wrong `execution_detail` granularity, wrong `verbatim_refs` spans, wrong `routing_flag` — the architect's reasoning is built on bad inputs. There's no way to know which parts of the funnel design are grounded vs. hallucinated from misclassified records.

**Your open calls:**

1. **belief_id assignment:** Does the Analyzer tag claims the way you would? Example: does "30-day guarantee" land in `it's-worth-the-price` or `act-now`? You need to scan 2–3 funnels from `runs/arduview/funnels-analyzer-out/` and confirm or correct the classification. The Analyzer makes this call from its prompt alone — your DR judgment may differ.

2. **execution_detail granularity:** Is `execution_detail` specific enough that the sub-claim is recoverable without re-reading the raw funnel? Or is it too high-level ("they use urgency")? If it's mush, the copywriter brief is missing the tactical install spec that makes a belief convincing.

3. **verbatim_refs spans:** Are `verbatim_refs[]` pulling the actual persuasive copy or adjacent boilerplate? The verbatim-refs gate enforces that refs are substrings of the cleaned body — but it doesn't enforce that they're the load-bearing span. A correct substring can still be the wrong sentence.

4. **routing_flag per competitor:** Does `structure_only` / `messaging_full` / `both` match your read of each competitor? Playdate, Pocket Operator, Divoom, and GameShell each got a routing assignment. If you disagree with any of them, the architect drew fill authority from the wrong source.

**Action:** Open `runs/arduview/funnels-analyzer-out/` and scan one record set per competitor. Record confirmed / mis-classified with your call. Do not do this in the same session as code work — it's a focused read pass.

---

## Funnel-level fields were null — architect inferred structure it should have read

**What happened:** All four stored funnels had `primary_claim: null`, `awareness_entry: null`, `funnel_sequence: null`, `offer_mechanic: null`, `urgency_construction: null`. (Engineering bug: `funnel-store.js` discarded the Analyzer's `funnel_fields` output — see `08-deep-pass-bugs.md` Bug 1 for the fix.) But even after the engineering fix is applied and the fields are restored, you still need to verify the Analyzer's reads are correct.

**Your open calls:**

5. **awareness_entry per competitor:** Once the engineering fix is applied and you can read the stored `awareness_entry` values, do they match your read of where each competitor enters the awareness continuum? The architect's structural shape decision ("structure follows awareness") depends on this being right.

6. **offer_mechanic and urgency_construction:** For each competitor where you trust the data (i.e., where `routing_flag` is `messaging_full` or `both`), do the stored `offer_mechanic` and `urgency_construction` fields match what you see on their actual LP/funnel? These fields drove the architect's Step 5 offer/urgency design.

---

## Secondary-source competitor data (KS 404) — credibility call is yours

**What happened:** GameShell's Kickstarter campaign page is 404 and unrecoverable from Wayback. The crowdfunding stats (`amount_raised: 350000`, `backer_count: 2300`, `funded_vs_failed: funded`, `delivered_vs_not: delivered`) were sourced from press coverage and the creator's site text — not the original campaign page.

**Why it matters:** These stats drive the validation lane B score and inform the architect's "proven delivery" reasoning. If the secondary sources were wrong, the architect overstated or understated the validation signal from GameShell.

**Your call:** Were the secondary-source GameShell stats good enough to trust? If not, what's the correct figure, and does it change your read of the competitive validation picture?

---

## belief_kind + source_routing — should the Section Analyzer emit these fields?

**What happened:** The funnel-architect SKILL.md references two ghost fields that the Section Analyzer never emits: `belief_kind` (crowdfunding-specific vs. general-DR) and `source_routing` (which funnel type the fill should come from — structure_only | messaging_full | both, scoped per belief rather than per funnel). The architect's three-layer authority model and its SELF-AUDIT checklist depend on these fields to route fill correctly, but the stored belief records contain neither. The architect is currently reading `routing_flag` (a funnel-level field set by the Router) as a proxy — which is a coarser signal than belief-level routing.

**Why it matters (marketing):** The architect builds the copy brief from the belief chain. If it can't distinguish "this belief's install spec should be sourced from in-transformation DTC messaging" vs. "this belief's container should be sourced from the crowdfunding structure," two things break: (1) the source-routing column in the copy brief is missing or inferred, meaning the copywriter receives no routing on which funnels to RAG against per section; (2) the dead-ground / whitespace map conflates crowdfunding-specific moves (ship-trust scaffolding) with general-DR moves, overstating saturation in the crowdfunding-specific layer.

**The ghost-field reference:** funnel-architect SKILL.md INPUTS section explicitly lists `belief_kind (crowdfunding-specific | general-DR)` and `source_routing` as per-belief-instance inputs the architect reads from the stored records. funnel-analysis-collection-spec.md §6b (the schema spec) and validate-analyzer.js (the schema enforcer) do not include either field. The Section Analyzer prompt in funnel-deep-pass SKILL.md does not ask for either field. The current stored records have neither.

**Your open calls:**

1. **Should `belief_kind` be an Analyzer-emitted field?** The Analyzer already segments copy into belief-units and maps each to the 9-anchor taxonomy. Tagging crowdfunding-specific vs. general-DR at that same step is low incremental cost. The call is whether you trust the Analyzer to draw this line correctly — `will-it-ship` is unambiguously crowdfunding-specific; `act-now` is ambiguous (crowdfunding urgency vs. general DR urgency). Does the distinction require your judgment, or is the taxonomy anchor sufficient to derive it?

2. **Should `source_routing` be per-belief (Analyzer-emitted) or per-funnel only (Router-emitted, as now)?** The Router currently stamps one `routing_flag` for the whole funnel. The architect wants per-belief routing so it can pull ship-trust fill from crowdfunding sources and product-claim fill from DTC sources independently, even for a funnel tagged `both`. If per-belief routing is your intent, the Analyzer must emit it; no downstream script can derive it from the per-funnel flag.

3. **What is the default source_routing for general-DR beliefs in a `structure_only` funnel?** If the funnel's `routing_flag` is `structure_only` (off-transformation crowdfunding), and a belief in it happens to be general-DR (e.g. `its-worth-the-price`), should the architect still draw execution fill from that funnel's specific install, or discard the fill and use structure only? This is the edge case the ghost field exists to handle.

**Action:** Decide whether to add `belief_kind` and `source_routing` to the Section Analyzer output schema (6b) and validate-analyzer.js enforcement. This is a schema change that requires: (a) updating funnel-analysis-collection-spec.md §6b, (b) updating the Section Analyzer spawn prompt in funnel-deep-pass SKILL.md, (c) updating validate-analyzer.js to enforce the new fields, and (d) re-running the Section Analyzer on the existing corpus to backfill. Do not make the schema change without deciding whether re-run cost is acceptable for the current belief-record corpus (4 funnels, 43 records).

---

## Competitors with no Meta ads — what the belief set is actually based on

**What happened:** Playdate, Pocket Operator, and Divoom all had 0 Meta ads. All four competitor funnels scored `validation_lane: ['unknown']` (no ad validation). The belief records are sourced entirely from landing pages, not from what these brands paid to run. The architect's belief chain was built from LP structural choices, not from spend-validated messaging.

**Why it matters:** LP copy reflects brand positioning, not necessarily what converts. What a brand pays to run in ads over 90+ days is a much stronger signal. For all four competitors in this run, that signal is absent.

**Your call:** Given that every competitor in this space ran zero trackable Meta ads, do you trust the belief records as a proxy for what actually works? Or do you need to look for validation signals elsewhere (YouTube ads, organic content performance, crowdfunding comment threads) before the next architect run?
