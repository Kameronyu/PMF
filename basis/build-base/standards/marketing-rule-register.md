---
status: authoritative
role: Operator-owned Register of in-force marketing rules (MR-001..006 + DR-LAW-a..e), cited by agents as grounding_ref.
read-with:
  - standards/SPEC-marketing-soundness.md
  - standards/BUILDER-DIRECTIVE.md
supersedes: []
---

> **What this is:** the in-force marketing-rule register. **Read by:** every build session (cite the rule-IDs); the operator updates it.

# Marketing Rule Register

**Operator-owned source of truth for the marketing rules currently in force.** Agents cite these rule-IDs as their `grounding_ref` (see `SPEC-marketing-soundness.md`, Mechanism 1). Kept separate from the KB because the KB is imperfect.

- **ID namespace** is shared with the mechanized DR-law index: a `grounding_ref` is either a `DR-…` law/test ID or an `MR-…` Register rule-ID.
- **Status values:** `in-force` · `configurable` · `retired`. A rule stays `in-force` until the operator changes its status in a logged decision that engages the rule's *soundness* (recorded in `last_operator_decision`).
- **Schema per entry:** `{id, statement, grounding, status, last_operator_decision}`.
- **How rules enter:** seeded below from the adversarial reviews and the KB passages PART 3 §2 extracted. New rules are added when the operator ratifies an interpretive call carried up under Mechanism 2 (see `SPEC-marketing-soundness.md`, Mechanism 3).

> **Operator note.** This is the *validated/in-force set we have evidence for* — the operator owns the Register and should review each seed's status and expand it. Full DR-law mechanization (assigning `DR-…` test IDs) is the mechanization pass's job; numeric thresholds (anti-fluke n, `low_n` cutoffs, etc.) are Job 2/4 marketing-truth and are deliberately **not set here**.

---

## Seed A — Validated invariants (from the adversarial reviews; PART 4 §3 "must not regress")

| ID | Statement (positive form) | Grounding | Status | last_operator_decision |
|---|---|---|---|---|
| **MR-001** | Validate the *messaging fill* with in-transformation messaging evidence (Currency A); validate *structure/promise* with raise/ship evidence (Currency B). Keep the two currencies in their own lanes; cite each from its own evidence. | First-principle synthesis of Hormozi "Actions-Only Reality Filter" + Carl currency definitions; Reviewer A: "strongest single piece of reasoning in the segment." | **in-force** | Pending — operator flagged P16 to clarify "never merge." Stays in-force until a logged decision; KB-provenance absence is not grounds to retire it. |
| **MR-002** | A demand verdict requires evidence present on **both** the demand side and the supply side; upgrade a demand claim only when both are shown. | Reviewer B — the integrity thread that held ("no laundered upgrade"). | **in-force** | — |
| **MR-003** | Use a brand from a different cell only as a **structure reference** (Currency B); cite in-cell demand only from in-cell evidence, and label cross-cell use as such. | Reviewer B — "thread handled honestly." | **in-force** | — |
| **MR-004** | Market selection ranks **PROVISIONAL** survivors and routes them to a dry test; the deliverable is a tested-or-untested status, not a "market won." | Reviewer A/B — the run's "saving grace"; operator scope ("these are only market tests"). | **in-force** | — |
| **MR-005** | A debut brand claims only what it can back; competitor trust assets that depend on scale/history (marketplace-availability, press logos, backer counts, scale stats) stay out of the brief. | Reviewer A/B — "exemplary"/"strong"; copywriter spec blocked-ports. | **in-force** | — |
| **MR-006** | When the transformation is asserted/unvalidated, carry that status into the ranked output and the operator NTP-pick artifact, where the decider sees it. | Reviewer A (market-segment disclosure finding, PART 4 L1); operator C3 directive. This is the rule-form of the L1 carry-field. | **in-force** | — |

## Seed B — DR-law passages (cited from PART 3 §2 / KB; the mechanization pass assigns `DR-…` test IDs)

| ID | Statement (positive form) | Grounding (source) | Status |
|---|---|---|---|
| **DR-LAW-a** | Where 5+ competitors hold the same mechanism position, require a new mechanism **or** a new avatar before entering. | `differentiator-framework__2_.md` (Hair Dryer case) | in-force (citation; mechanization ○) |
| **DR-LAW-b** | Keep ad → page → retargeting matched in angle and language (congruency). | Carl, funnel-architecture | in-force (citation; mechanization ○) |
| **DR-LAW-c** | Channel demand that already exists; build on a desire the niche already articulates. ("You cannot create mass desire, you channel it.") | `ecommerce--mark-builds-brands.md` | in-force (citation) |
| **DR-LAW-d** | Use buyer-verbatim language in copy — Command+F every assumed customer word against research, and keep only words that appear there. | `copywriting--spencer-origins.md`; `definitions.md` (Desire) | in-force (citation) |
| **DR-LAW-e** | Treat 2+ qualifying competitors at proven spend as the anti-fluke floor; a single comparable licenses a dry test, not a commitment. | market-selection law | in-force (citation; threshold ○ Job 4) |

---

*Companion to `SPEC-marketing-soundness.md` (the Standard) and `BUILDER-DIRECTIVE.md` (the build-session preamble). When the operator ratifies an interpretive call, add it here with a new ID and a `last_operator_decision`.*
