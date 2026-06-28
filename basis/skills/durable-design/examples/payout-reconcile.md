# Weekly payout reconciliation — durable design

harden_verdict: HYBRID — signals: run_frequency = weekly (observed 6×); interface_stability = Stripe REST API + Google Sheets API, both versioned; input_variance = low (same report shape); reversibility = every step reversible except the final Sheet write, which is gated.

## Intent & success criteria
Pull the week's Stripe payouts, reconcile against the bank CSV, write a summary row to the tracking Sheet. Pass when the summary's payout total equals the Stripe API total to the cent.
GOLDEN OUTPUT: examples/golden/2026-06-15-summary.csv (checksum 9f2a31; 42 rows, columns {date, payout_id, gross, fee, net}).

## Assumptions & dependencies
- Stripe API reachable; key valid; `/v1/payouts` schema unchanged.
- Bank CSV present at ~/Downloads/bank-*.csv for the period.
- Google Sheet `Payouts 2026` reachable; the agent has write scope.

## Preflight
One command asserts: Stripe reachable + key valid + payouts schema matches the recorded fields; bank CSV present and parses; Sheet reachable + writable. On ANY failure, refuse to run and name the broken assumption — do not continue.

## Skeleton (FROZEN)
- Step `pull_payouts` [FROZEN]: Precondition key valid → Action GET /v1/payouts for the period (idempotent; read-only) → Verify count ≥ 1 and total parses → Rollback none (read-only).
- Step `write_summary` [FROZEN]: Precondition reconciliation passed → Action append one summary row via Sheets API with an idempotency key = period hash → Verify the appended row matches the computed summary → Rollback delete the appended row by idempotency key.

## Joints (ADAPTIVE)
- Step `locate_period` [JOINT]: re-discover live which bank CSV + rows cover the period. Rationale: the bank file naming varies month to month; this is wrong if the resolved date range does not match the Stripe payout dates.

## Verification
Diff the computed summary against the golden checksum and row count before writing. Canary: reconcile and write to a scratch tab first on one reversible run, compare, then the real tab. Watch the trajectory — a tool/step count that differs from the golden run is the early drift signal.

## Fallback ladder
- T1: on a transient Stripe 5xx, idempotent retry with backoff; circuit-break after 3.
- T2: if the payouts schema or bank layout changed, re-explore the `locate_period` / pull joints live, guided by the rationale.
- T3: if reconciliation still fails or the totals disagree, do NOT write the Sheet — escalate to a human with the diff, the dead assumption, and a proposed fix. The irreversible Sheet write is barred from T1/T2.

## Maintenance
owner: data-ops; version: 1.2; last_validated: 2026-06-22; recompile trigger: a Stripe API version bump re-runs the schema preflight and regenerates the `pull_payouts` node only (drift localized to that segment).
