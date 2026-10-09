# auto-native-r28 — DECISION

**§0 note**: round-budget.mjs returned N=1 for this invocation (0 unfilled PAGE_TYPES). Target drawn uniformly at random from [dash, landing, native] (Friday, not Monday, so the native weekly-cadence rule did not force this — the random draw happened to land on native anyway) → **native**. This is round 2 of this scheduled session's 2 independent back-to-back `/dash-evolve` executions (round 1 was `auto-dash-r34`, winner c). Agent-tool availability confirmed present; this environment only exposes generic agent types, so 3 independent `general-purpose` agents were used for GENERATE and 3 more independent `general-purpose` agents for JUDGE, each blind to the others. No `self_judged` flag. reassign-queue.md had no pending native item — no reassignment this round. Native project dependencies (`native/npm install`) were not yet installed in this session; installed before generation, and the full 4-gate pipeline (`tsc`/export/render/iframe) was smoke-tested against an existing catalog screen before dispatching designers, confirming the pre-installed Chromium symlink shim (set up earlier this session for the dash round) also serves native's Playwright-based render/iframe checks without further changes.

## Candidates
- **a** "Appeal Your Suspension" — blocked-workflow state machine (5 reason options, ≥120-char explanation gate, live 0-100 "case strength" meter recomputed from the same gating answers, auto-retract-on-edit-after-filing).
- **b** "Tax Export Tagging" — selection-driven contextual bar (locked-row business rule, disjoint sale/purchase tag vocabularies collapsing to an explanatory message on mixed selection, real signed running-total, irreversible lock converts the bar into Cancel/Confirm).
- **c** "Shipping Protection Claim" — read-only completed-record + persistent action bar (hero coverage figure and itemized damage-finding breakdown both chained through one shared computation so they provably reconcile; two real working dock actions — Email Receipt flips a real `receiptSent` state, Contact Support expands a real panel).

## Hard gate
12/12 clean on first attempt for all 3 candidates (no 1-fix loop needed) — `node scripts/gate.mjs --target native --screens evolve-r28-a evolve-r28-b evolve-r28-c` → `pass:true`, `violations:[]`. See `SCORES.md`. Frozen-source hash at judging time: `c3c2abd1ba10e65e57d52763792c27c4f8d9e35d`. Screens registered in `native/src/screens.ts` (import + `COMPONENTS["evolve-r28-<v>"]`) and `native/screens.json` (`check` strings: a="Appeal Your Suspension", b="Tax Export Tagging", c="Shipping Protection Claim").

## Judge panel (3 independent blind lenses, screenshots at 390/768px + source only, no candidate concept docs, no cross-lens visibility)

| | lens1 (DNA compliance) | lens2 (mobile completeness) | lens3 (screen-type differentiation) |
|---|---|---|---|
| 1st | a | c | c |
| 2nd | b | b | b |
| 3rd | c | a | a |

**Majority: c wins 2:1** (lens2 + lens3 vs lens1). Not a 3-way tie, no tie-break procedure needed, no no-winner votes.

- **lens2** ranked c > b > a on verified data realism (hand-recomputed c's damage-finding arithmetic — 420+260+70+0=750, minus $75 deductible = $675 — matches the rendered hero figure and itemized rows exactly) plus genuinely working dock actions (`receiptSent` state flip, real expand/collapse support panel), against b's comparably strong but entirely unrendered interaction richness (default screenshot shows zero rows selected) and a's solid-but-more-conventional long-form pattern.
- **lens3** ranked c > b > a on code-surface/structural-recurrence grounds, not substance (all three substantively implement their assigned band form — none is "thin"): **a** is a third near-identical occurrence of the "scan ordered checkpoints → name the first unmet one → scroll+focus → submit → auto-retract-on-edit" shape (after `r25/a` TradeInAppraisalScreen and `r26/a` WarrantyClaimScreen), and its band action-copy template ("Go to appeal reason" / "Go to explanation") matches `r26/a`'s `railActionLabel()` template ("Go to defect category" / "Go to evidence photos") near-verbatim. **b**'s closest structural twin is `r27/b` BlockedUsersScreen (same band form, same Set-based selection → business-rule gate → Cancel/Confirm-on-irreversible-action skeleton), and lens3 found a **byte-identical style object** — `confirmRow: { flexDirection: "row", gap: tokens.space(3) }` — matching both key name AND value verbatim in `r25/b` DeliveryReceiptScreen. **c** has no close structural twin and correctly omits a confirm-row escalation (no destructive action exists on this screen, so none was needed) rather than manufacturing one just to reuse the pattern.
- **lens1 dissented for a** (ranked a > b > c) finding no structural/doctrinal violation in any candidate — all three correctly implement their assigned band form, maintain exactly one live region, avoid the `accessible={true}`-traps-children anti-pattern, never overpromise in `accessibilityHint`, stay fully deterministic. The tie-break was a real but minor token-hygiene count: bare (non-`tokens.space()`) spacing literals in each stylesheet — a:1, b:2, **c:5** (all `gap:` values inside otherwise-token-compliant style objects). Lens1 explicitly flagged this as a low-severity differentiator and noted another judge could reasonably call it a near-tie.

## Post-judgment fix (§3-1)
Applied to winner **c**: the 5 bare `gap:` literals lens1 cited (`ShippingProtectionClaimScreen.tsx` — `metaCol` gap:2, `itemPanel` gap:3, two `gap:4` instances, `ledgerRow` gap:3) were snapped to `tokens.space(1)` (=4px), matching the `auto-native-r25` precedent for sub-token spacing hygiene fixes. Re-gated: 12/12 clean, `violations:[]`. Ranking not recalculated — neither lens2 nor lens3 (the winning-side lenses) cited spacing hygiene as part of their decisive reasoning, so this is a pure rule-violation cleanup, not a merits change.

## LEARN
1 new L1 delta appended to `native-deltas-provisional.jsonl` (see below) — sharpens the existing "코드 표면까지 닮으면 진다" doctrine (GENERATION.md §3) with two concrete, independently-found pieces of evidence from this round: a copy-template match ("Go to <section>" action-label pattern reused near-verbatim across 3 rounds of the same band form) and a byte-identical style-object match (same key name AND same value, not just the same key name) as a sharper signal of code-surface copying than key-name overlap alone.

## Canon
`dash-brief-v3.md`, `design-principles.md`, `page-brief-core.md`, `page-brief-repo.md`, `native/GENERATION.md`, type profiles, `/dash` gallery, `/v1-v5` — all unchanged. No new questions-queue entry this round (no sharp principle conflict surfaced — lens1's dissent was a normal, resolved §3-1 case, not an unresolved contradiction).
