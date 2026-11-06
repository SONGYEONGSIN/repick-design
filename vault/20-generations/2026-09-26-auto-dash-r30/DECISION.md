# DECISION — auto-dash-r30

## 0. Round-count deviation (recorded per §0-0-1)

The scheduled task requested 2 consecutive dash-evolve rounds. `node scripts/round-budget.mjs 2` returned **N=1** ("미채움 0종 — N≥2 의 근거(커버리지)가 없다") — all 18 `PAGE_TYPES` are already filled in `app/src/lib/works.ts`, so the coverage rationale that justifies N≥2 does not apply. Per skill §0-0-1, the script's output is authoritative regardless of the caller's requested value: **only 1 round ran.** This is not a failure — it is the skill's designed behavior when the unfilled-type queue is empty.

## 1. Target / round

- Target: `dash` (random pick among dash/landing/native — unfilled-type queue empty, so the §0 fallback fired). Not a Monday (2026-09-26 is Saturday), so the native weekly-cycle rule does not apply here either.
- Round: `auto-dash-r30` (previous max dash round was r29).
- Agent-tool availability confirmed before starting (§0-0 self-judged check) — proceeded normally.

## 2. Reassignment queue consumed (§1/§2 mandatory step)

`reassign-queue.md` "대기 중" listed several dash items. Assigned **candidate A** to reassign `auto-dash-r28/b` ("Ridgeline" — hero-number + ARR-waterfall bridge), dropped originally for a focus-visibility hard-gate failure (`outline-none` self-cancelling / `ring`+`ring-offset` rendering transparent in this Tailwind v4 setup, 1-fix re-failed). The reassignment brief stated this exact failure mode and required the safe `focus-visible:outline-2 outline-offset-2` pattern. Candidates B and C were free exploration.

## 3. GENERATE — macro-bucket + variety assignment

Banned macro-buckets (last 5 rounds, r25–r29, 15 candidates) were listed verbatim to all 3 designers: reconciliation-ledger, hero-number-payout, map-geography, heatmap-telemetry, master-detail (×2), feed-centric (×2), KPI-row+8/4 (×2 variants), radar-scorecard, calendar-board, queue-rail+Gantt, 3-pane-market.

- **A — Ridgeline** (reassignment, fixed form): hero-number + inline-stats shell + hand-built ARR-bridge waterfall. Variety: light / cyan / `--font-display-mono`.
- **B — Corvid**: incident-response N-column kanban/swimlane board (fresh macro-bucket — not used in r25–r29; closest prior instance was the CSS-grid kanban delta from r21, many rounds back). Variety: dark / emerald / no display face.
- **C — Meshline**: service-dependency node-link graph console (fresh macro-bucket, addresses the catalog's known "graph nodes with hidden values" defect head-on). Variety: light / rose / `--font-display-wide`.

Diversity-axis check (`catalog-variety.mjs`, 65 works): recent 6 dash winners' faces were grotesk×3/wide×2 — assigned mono/none/wide this round to avoid repeating the grotesk/wide streak. Accents avoided the two most recent winners' hues (orange r28, sky r29) and the catalog's overused top-3 (amber/teal/violet-hex).

## 4. HARD GATE

| Candidate | 1st attempt | Fix | 2nd attempt |
|---|---|---|---|
| A (Ridgeline) | **pass** (all 10 gates) | — | — |
| B (Corvid) | fail — `lint`: `react-hooks/set-state-in-effect` in `dashboard-app.tsx:61` (`setScrollTarget(null)` called synchronously inside the scroll-into-view effect) | Replaced the reset-via-setState with a `lastScrolledRef` guard so the effect never calls `setState` in its body | **pass** (all 10 gates) |
| C (Meshline) | **pass** (all 10 gates; `weights` recorded 4 rendered weights — record-only, not a hard-fail) | — | — |

No candidate hit `blockedBy` (native-only mechanism, N/A for web). No blank frames on screenshot capture (`capture-shots.mjs`, all 3 candidates, 0 blanks / 0 errors).

Freeze hash (pre-fix, all 3 candidates' `.tsx`/`.ts` concatenated): `6c7966af8749ad795621c3765d912212a671e3ca`. B's source changed post-fix (expected per the 1-fix loop); the re-gate above is the authoritative pass/fail record for the judged state.

## 5. JUDGE PANEL (3 lenses, blind, independent, 3-4 frames/candidate + full source)

### Lens 1 — brief compliance: **C > B > A**
- **A (3rd)**: flagged a real, gate-missed hard-requirement violation — two independent wide `overflow-x-auto` containers on one page (`Waterfall.tsx:123-124` chart wrapper + `AccountsTable.tsx:200-201` table wrapper), both rendering simultaneously and unconditionally (`Dashboard.tsx:111-144`). This is the exact catalog-documented risk pattern from `auto-dash-r20/a` (leaks `document.documentElement.scrollWidth` at narrow widths in some but not all combinations) — sweep passed at all 6 tested widths this run (empirically inconsistent trigger, consistent with r20's own findings), but the static rule violation stands regardless of whether it manifested as measured overflow this time. Selection fan-out (single `pinnedId` → 3 consumers, though with differing prop names and independent per-consumer follow-on state) is a partial, not full, escape from the flagged convergence pattern.
- **B (2nd)**: no hard-requirement violations found. Single `overflow-x-auto`, never concurrent with anything else (board/compact-list are mutually exclusive via a view toggle). Deterministic data confirmed (`ANCHOR = new Date(2026,8,26,9,15)` — fixed-argument, compliant). Selection fan-out is a single raw `pinnedId` into 2 concurrent consumers (board/list-active-view + inspector) — the most literal instance of the flagged pattern among the "no violation" candidates, per this lens.
- **C (1st)**: no hard-requirement violations found; most conservative scroll-container implementation (`overflow-x-auto` collapsing to `overflow-visible` at `lg:`). Ships the brief's stated **strongest form** of selection fan-out: two independently-scoped persistent pin axes (node-pin → SummaryStrip only; edge-pin → a separate "traced dependency" panel only) rather than one axis multiplexed into siblings. Directly addresses the brief's named "graph without visible values" defect — every node prints its value as always-visible SVG text.

### Lens 2 — commercial polish: **B > C > A**
- **B (1st)**: every key figure printed without interaction, org-wide stat strip reconciles exactly with column counts, pinned incident populates a fully-detailed inspector by default (not empty), sparklines carry literal start/end values, tight console-grade composition, deliberately-designed (not squeezed) mobile state.
- **C (2nd)**: also strong at-a-glance density and realistic domain data, but two demerits: the "traced dependency" side panel is an empty placeholder by default, and a stray "ERROR" caption appears next to error-rate values even on healthy/green nodes (component-consistency miss).
- **A (3rd)**: the ARR bridge itself is well-executed (always-visible bar labels/totals), but the entire secondary "Category Spotlight" column is an empty placeholder at first paint with no default-populated content — judged more severe than C's equivalent gap because C pairs its one empty panel with an already-populated companion panel, while A's whole secondary column is dead space.

### Lens 3 — archetype differentiation: **B > A > C**
- **B (1st)**: outlier macro-skeleton (fixed-viewport, non-scrolling kanban shell vs. the other two's ordinary scrolling card-dashboard shells) — genuinely fresh centerpiece, not on the shipped-archetype list. Cleanest escape from the selection-fanout trap: the only "shared prop signature" case is between two *mutually exclusive* alternate renderers of one widget (board vs. compact-list view toggle), never two simultaneously-visible siblings.
- **A (2nd)**: dominant visualization (custom SVG ARR-bridge) is new to the catalog, and pin fan-out uses differing prop names with independent per-consumer state (partial escape from the trap) — but the macro-skeleton (hero-number+inline-stats, chart-8-col+detail-4-col+table-below) closely echoes two already-shipped archetypes at once (hero-number+inline-stats ARR; master-detail-with-table).
- **C (3rd)**: dominant visualization (node-link dependency graph) is genuinely fresh and is the candidate's strongest asset — but its selection wiring is the most literal instance of the round's central risk (one raw `pinnedNodeId`, identical prop name, threaded into 3 simultaneously-rendered siblings), and its macro-skeleton (KPI/hero strip + inline focused-item readout + bordered chart card with adjacent detail box + table card below) is the closest structural pair to A's in this round.

## 6. Aggregate — WINNER: **B (Corvid)**

1st-place votes: B=2 (lens2, lens3), C=1 (lens1). 2:1 majority, no no-winner condition. Per §3-1, no post-judgment remediation is needed for the winner — lens1 (the only lens that would flag rule violations) found **no hard-requirement violations in B**.

A placed 3rd on 2 of 3 lenses (compliance, commercial-polish) and 2nd on the third (archetype) — consistently the weakest despite being a rule-violation-motivated reassignment.

## 7. Reassignment queue disposition

Per `reassign-queue.md` §규약, the `auto-dash-r28/b` (Ridgeline) entry is archived below regardless of outcome. Result: **not promoted** — passed the automated hard gate this time (the focus-visibility violation was fixed as instructed, confirmed via grep: zero `outline-none`/`ring`/`ring-offset` in any className), but placed 3rd in judging on a 3-way split: (a) lens1 found a *different*, newly-surfaced rule-adjacent issue (dual `overflow-x-auto` containers, a known-but-inconsistently-triggering catalog risk that this run's sweep did not catch), (b) lens2 penalized the empty-by-default Spotlight panel as a commercial-completeness gap, (c) lens3 found the macro-skeleton too close to two already-shipped archetypes. Because a genuine rule-violation contributed to (a), this is not a clean "form survives, only taste decided" case — see `reassign-queue.md` archive entry for the nuanced disposition. Left for future judgment whether to re-queue a third time.

## 8. LEARN — delta extracted

See `dash-deltas-provisional.jsonl` append below: a persistent-pin-driven secondary/consumer panel that has no default-populated state (renders an empty placeholder until the user makes a pin) reads as an unfinished demo panel to the commercial-completeness lens, even when the panel's *wiring* is otherwise exemplary — this pattern was independently reproduced by 2 of 3 candidates in this single round (A's Spotlight, C's Traced-dependency panel), both flagged by lens2 independently in the same judging round. Level L1 (single round, but cross-candidate reproduction within it) per curation-criteria's precedent for within-round dual-candidate evidence.

## 9. Coverage note

Since `N=1` this run (see §0), this is the only round; there is no round 2 to carry this delta into within this invocation. The delta is appended to the standard provisional ledger for future rounds to pick up, exactly as the sequential-rounds mechanism intends.
