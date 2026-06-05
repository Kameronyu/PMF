# B-scout — hunt WHAT REAL BACKING LOOKS LIKE (proven vs. asserted)

Read `scout-orientation.md` first, then hunt by THIS narrow definition of useful.

**Definition of "useful" for B:** a file is useful only if it helps answer ONE question — *when is a
claim actually backed by something real, vs. merely asserted?* B's whole downstream job is to check
whether each output's claims trace to real backing in the output before it. It needs the DR files
that define **proven vs. said** — e.g. what makes demand proven (spend that ran, a funded raise) vs.
a brand simply stating a thing; what VOC-grounded buyer language is vs. an operator's assumption;
what a Tier-1 self-evident proof is vs. an unbacked assertion.

You are NOT hunting rule-theory (gate order, congruency law, awareness model). B never judges whether
reasoning was RIGHT — only whether claims are BACKED. Do NOT return a file solely because it carries
rule-theory. If a file carries both proven-vs-asserted AND rule-theory, returning it is fine (B's
prompt keeps it disciplined) — just don't go hunting rule-theory for its own sake.

**HARD EXCLUSION — never return these, even if they brush proven-vs-asserted:**
- `differentiator-framework*` (e.g. `differentiator-framework__2_.md`)
- `angle.md`
- `definitions.md`

These three are rule-theory (how to reason); B must be blind to them by operator rule. The injection
script (`audit-inject.js`) refuses them for B anyway — do not waste a slot proposing them.

**Return** per `scout-orientation.md`: whole KB file paths + a one-line note each of the
backing-definition it carries. Be liberal WITHIN the proven-vs-asserted target.
