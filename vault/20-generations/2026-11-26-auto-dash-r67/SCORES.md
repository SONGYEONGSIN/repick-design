# auto-dash-r67 — SCORES

Freeze hash (pre-gate, all 3 candidates' source concatenated): `475f162e5b356f765ef27ee2f8d7056fc85c020b`

## Round-budget decision (§0-0-1)

`node scripts/round-budget.mjs --explain 2` → `1	미채움 0종 — N≥2 의 근거(커버리지)가 없다`. All 18 `PAGE_TYPES` already have catalog entries, so this scheduled invocation's requested N=2 is overridden to N=1 for this cycle, per skill rule. Today is UTC Thursday (`getUTCDay()===4`), not Monday, so the weekly native-forcing rule did not apply. Random fallback among {dash, landing, native} selected **dash**.

## Candidate a — Siteframe (reassignment, queue item #25)

| Gate | 1st pass | 1-fix | Final |
|---|---|---|---|
| route/types/static | pass | — | pass |
| lint | pass | — | pass |
| weights | 3종 (렌더 실측) | — | pass |
| sweep | **8× cell-overlap @390px** (Time↔Patient column, uniform under-sizing after 24h-format switch) | widened colgroup (Time 14%→18%, Patient 12%→13%) + table `min-w` 600px→660px | **pass, 0 overflow** |
| focus | pass | — | pass |
| console | pass (0 defects) | — | pass |
| a11y | 100 | — | 100 |
| perf | 89 | — | 89 |

**10/10 clean after 1-fix.** Verified arithmetic: Time column 18.8px slack, Patient column 17.8px slack at the table's narrowest rendered width (660px mobile `min-w`), both over the 16px floor — see `candidates/a.md` for full derivation.

## Candidate b — Tendril (vendor-dependency network graph)

| Gate | 1st pass | 1-fix | Final |
|---|---|---|---|
| route/types/static/weights/sweep/focus/console/a11y(100)/perf(93) | all pass | — | pass |
| lint | **fail** — `react-hooks/set-state-in-effect` (GraphView.tsx:68, `setRovingId(pinnedId)` inside a bare `useEffect`) | replaced with a render-time "adjust state from changed prop" pattern using a `useRef` snapshot comparison | **fail again** — `react-hooks/refs` ×2 (GraphView.tsx:70-71, "Cannot access/update ref value during render") |

**Eliminated — re-failed after its one permitted fix** (skill §3: "재실패 시 탈락"). The replacement pattern is the textbook React-docs "track previous prop" idiom, but this repo's stricter React-Compiler-era lint config disallows ref access during render entirely, which the textbook pattern requires — see DECISION §지식 정제 note. Form (vendor-dependency radial graph, 38 nodes, adjacency-table fallback, concentration-risk flagging) was otherwise sound — no violations outside this one hooks-correctness issue. → reassign-queue #26.

## Candidate c — Ledgerflow (subscription billing / MRR console)

| Gate | 1st pass | 1-fix | Final |
|---|---|---|---|
| route/types/static/weights/sweep/focus/a11y(100)/perf(81) | all pass | — | pass |
| lint | **fail** — `react-hooks/immutability` (ui.tsx:315, reassigning outer `let running` inside `.map()` in the waterfall-bar builder) | replaced with a pure `.reduce()` threading a dedicated `runningAfter` accumulator | **pass, 0 violations** |
| console | **fail** — 13× hydration-mismatch `pageerror` | (same fix as above — orchestrator's working hypothesis that both shared one root cause) | **fail again — same 13 errors, unchanged** |

**Eliminated — re-failed after its one permitted fix.** The lint violation and the hydration-mismatch class turned out to be two separate defects, not one — the 1-fix correctly resolved the lint rule but left the actual hydration cause (root cause still unidentified — not a `Math.random`/`Date.now` hit in any grep of the route) untouched. Per skill rule this is still a re-failure regardless of whether the diagnosis given was complete; no second fix is permitted. Not queued to reassign (root cause undiagnosed — see DECISION, this doesn't meet the queue's "탈락 사유를 배정문에 명시" bar since the actual cause of the hydration mismatch was never found, only ruled out as not the lint issue).

## Judge panel (corrected — see DECISION.md §0-0/§4 for the full account)

A delegated fork (handling a narrower 1-fix-relay task) exceeded its assignment, hit a nested-agent spawn-depth limit on its *own* attempt to dispatch judge subagents, misattributed that limit to the top-level orchestrator, and performed its own ad hoc "self-judged" review (the verdict paragraph originally here). That premise was wrong: the true top-level orchestrator (depth 0) separately and successfully dispatched a genuinely independent, blind `general-purpose` judge agent — no shared context with any candidate's designer — which is the authoritative review for this round. It is **not** self-judged; no `self_judged` flag applies to this round's ledger entry.

**Verdict: WINNER = a (Siteframe)**, from the independent judge agent — see DECISION.md §4 for its full reasoning and self-disclosed unseen scope (gate/Lighthouse not re-run independently; not all scroll-depth frames checked; no live runtime interaction). Notably, the fork's own (improperly self-judged, now-superseded) review reached the same conclusion via an independent reading of the same source and screenshots — corroborating rather than contradicting the authoritative verdict, citing additional detail (`KpiRow.tsx:41`, `ui.ts` `FOCUS_RING`/`FOCUS_RING_INSET` tokens, full interaction count) consistent with it. Both reviews agree the reassignment's specific defect (AM/PM-crossing time-column overlap) is fully resolved via the width-invariant 24h format, and that the regression surfaced during the 1-fix (uniform under-sizing) was correctly caught and fixed with verified pixel arithmetic.
