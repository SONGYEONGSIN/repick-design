# auto-dash-r29 — DECISION

## §0 Round budget (read first)

The scheduled task that triggered this run requested **N=2 consecutive rounds**. Per `dash-evolve` SKILL.md
§0-0-1, the round count is not decided by the caller — it is decided by `scripts/round-budget.mjs`:

```
$ node scripts/round-budget.mjs --explain 2
1	미채움 0종 — N≥2 의 근거(커버리지)가 없다
```

All 18 `PAGE_TYPES` in `app/src/lib/works.ts` already have at least one catalog entry (0 unfilled types), so
the script forces **N=1** regardless of the requested value, and this fact is logged here per the skill's own
instruction ("호출자가 2 이상을 줬어도 스크립트가 1을 내면 1라운드만 돌고 그 사실을 DECISION 첫 절에 적는다").
**Only one round (this one) executes in this invocation.**

Agent-tool availability was confirmed present before starting (§0-0) — not a self-judged round.

Native weekly-cycle check: today (2026-09-25) is UTC day 5 (Friday), not Monday, so the native fixed-cadence
rule does not apply this run.

Target draw: unfilled-type queue is empty, so target falls back to uniform-random among
`{dash, landing, native}`. Single draw for this run: **dash**. (Recorded here for reproducibility per the
skill's "결과는 ledger에 기록되므로 재현성은 ledger가 담보한다" — the draw itself is orchestration randomness,
not a rule the candidate code must satisfy.)

Round number: `auto-dash-r29` (max existing `auto-dash-r*` round in the ledger was r28 → 29).

Reassign queue (`vault/00-principles/reassign-queue.md`) "대기 중" section has no registered dash entry this
round (several tallied-but-not-yet-queued items exist per that file's own note, capped at 1 slot/round by
policy — none were promoted to "대기 중" as of this run, so nothing was assigned to a candidate).

## Candidates

| v | brand | macro shell | dominant visualization | theme/accent/face (measured via `catalog-variety.mjs readWork`) |
|---|---|---|---|---|
| a | Lotwise | 3-pane trading terminal (watchlist rail + candlestick + bid/detail pane) | hand-built SVG candlestick/OHLC | dark / indigo / mono |
| b | Warden | feed-centric (live access-anomaly event stream + side panels) | hand-built SVG ego-network graph | light / emerald / pretendard (no display face) |
| c | Reloop | master-detail (seller rail + detail) | hand-built SVG scatter/bubble (return-rate × revenue) | dark / sky / grotesk |

All three macro shells were deliberately chosen to avoid the last 5 rounds' saturated buckets: master-detail
(r24a, r26b) was still used once (c) but with a genuinely different dominant visualization (scatter, not a
trend chart or box plot) and different domain; "hero + single dominant visualization" (heavily saturated in
r27a/b/c and r28b) was avoided entirely; calendar/board-centric (r28a, the immediately preceding winner) was
avoided entirely.

## §3 Hard gate

Full detail in `SCORES.md`. Summary: all three candidates failed their first hard-gate pass on three unrelated
defect classes, and all three passed cleanly on the 1-fix retry:

- **a**: `lint` — `prefer-const` (2 errors, `data.ts:163-164`). Fixed by changing `let`→`const` on two
  never-reassigned bindings.
- **b**: `sweep` — `cell-overlap` at 12 widths (390 through 1920px) in the network-graph card's collapsible
  adjacency table, "Relationship" ↔ "Since" columns, inside a narrow 380px side panel. Fixed by merging the
  4-column table into 3 columns (moved "Since" into a wrapped second line inside the Relationship cell instead
  of forcing it into its own rigid percentage column).
- **c**: `console` — 13 hydration-mismatch pageerrors, `$209.0K` (SSR) vs `$209K` (client), from
  `Intl.NumberFormat({ notation: "compact" })`'s ICU-version-dependent trailing-zero behavior differing between
  Node (SSR) and the browser (client render) on fully deterministic input. Fixed by replacing the `Intl`
  compact-notation call with a hand-written formatter (logged as a new hard-gate delta, see LEARN below).

Post-fix freeze hash (all three candidates, source concatenated): `1ed60729b989a26f60ac1d0e22fbf9d16317b21d`.
Screenshots captured after this hash was frozen; no blank frames across any candidate (`capture-shots.mjs`
`blanks: []` for a/b/c).

## §4 Judge panel (blind, 3 lenses, general-purpose subagents — no `designer`/`comparator` custom agent type
exists in this environment's `.claude/agents/`, confirmed absent before dispatch; general-purpose agents were
used in its place with the same blind/independent dispatch discipline: separate Agent calls, no shared context,
no candidate concept/order revealed)

Frame budget: 4 frames/candidate (`<v>-1440.png`, `<v>-1440-s70.png`, `<v>-390.png`, `<v>-1920.png`).

### Lens 1 — brief compliance
**Ranking: 1. c 2. a 3. b.**
c is the only candidate implementing the brief's target selection-fanout pattern as a genuinely separate
persistent-pin + ephemeral-hover-preview pair (`c/ScatterChart.tsx:207-226`, `c/DashboardApp.tsx:93,96,108`),
with always-visible outlier labels on its dominant chart (`c/ScatterChart.tsx:276-301`). a has a real
narrowly-scoped pin (`a/WatchlistRail.tsx`, `a/DashboardApp.tsx:73,76,82`) with standing OHLC values, but its
"hover" is local CSS-only row disclosure, not a cross-widget ephemeral preview. b also has a narrow pin
(`b/dashboard-app.tsx:20-26`) but no cross-component ephemeral hover at all, and its dominant graph requires
hover (or a click-through table) for exact values rather than always-visible key numbers. Full reasoning,
evidence, and self-reported coverage gaps preserved in the judge's original transcript (not reproduced verbatim
here for length; available via this run's Agent history).

### Lens 2 — commercial/production-grade polish
**Ranking: 1. a 2. c 3. b.**
a's candlestick has the strongest domain-specific completeness (live OHLC stat row, highlighted current candle,
full 30-row history table, concrete mechanism-specific copy). c's scatter is close behind (real axis labels,
sized bubbles, direct outlier labels, a color system that's load-bearing not decorative). b has the best copy
of the three and the only genuinely sticky left nav, but its centerpiece (3-node access graph) is visually thin
next to a's/c's charts, and — a real grid-craft defect independently found by this lens — **at 70% scroll on
1440px, b's right rail (graph + risk panel) has run out of content while the still-scrolling feed leaves a
large blank void beside it** (`b-1440-s70.png`). a and c share a lesser flaw: their left nav is not sticky and
scrolls away by 70% scroll depth (`a-1440-s70.png`, `c-1440-s70.png`) — flagged as a real but smaller defect
than b's blank-void mismatch, since it costs orientation, not usable page area.

### Lens 3 — archetype/structural differentiation
**Ranking: 1. c 2. a 3. b**, with an explicit flag: **b converges closely on r26c's skeleton** (central live
feed + side panels holding a relationship-graph chart + a pin-scoped rollup card — the same information
architecture as r26c's payments-ledger feed + sunburst + pin-rollup, with the domain and chart type swapped but
the macro shape essentially unchanged). c combines rail+detail with a load-bearing second visualization (the
scatter) and a dense table in one scrolling main column, a shape not directly matching any single r24-r28 entry,
and is again credited for the same explicit pin/hover state-hook separation found by lens 1
(`c/DashboardApp.tsx:18-19,93,96,108,112`, `c/ScatterChart.tsx:209-212`'s `hoveredRailId !== pinnedId` guard,
`c/SellerRail.tsx:97-100`'s pointer+keyboard event pairing). a's three-column shape (nav rail + watchlist rail +
main + a mostly-static right sidebar) is judged a real, non-cosmetic master-detail variant (partial-swap main
pane, two of four fan-out consumers deliberately excluded) despite sharing a family with r24a/r26b/r28c. None of
the three collapsed into the heavily-saturated "hero + single dominant visualization, no rail/feed structure"
shape (r27×3, r28b).

### Aggregation
1st-place votes: **c = 2** (lens1, lens3), a = 1 (lens2). No lens returned a no-winner verdict, so no-winner
tie-break rules do not apply. **Winner: c (Reloop), 2:1 (lens1 + lens3 vs lens2).**

All three judges returned complete verdicts on first dispatch (ranking + per-candidate reasoning + cited
evidence + self-reported coverage gaps) — no incomplete/partial output requiring a `SendMessage` continuation,
no abstentions.

## §3-1 Post-judgment corrections
None. All hard-gate violations were resolved before judging (§3, 1-fix loop) — no rule violations remained in
the judged/frozen state that would require post-judgment correction, and no post-judgment changes were made to
any candidate. Ranking is exactly as judged.

## §5 LEARN — 격리 적재 (2 entries this round — see note below)

The skill's §5 step calls for exactly 1 delta extracted from the winner's judge reasoning. This round also
surfaced a second, independent, mechanically-verified finding during the **hard gate** (§3) — a previously
unrecorded failure class not covered by the existing `no-random` rule. Consistent with this repo's established
practice of logging hard-gate-discovered findings directly to the same ledger (e.g. the r22/r24 `cell-overlap`
discoveries, the r25 `table-fixed`+`min-w` finding), both are appended as separate L1 `provisional` entries
rather than picking one arbitrarily:

1. **(hard-gate-sourced)** `Intl.NumberFormat({ notation: "compact" })`'s trailing-zero/rounding behavior is
   ICU-version-dependent and can render differently on Node (SSR) vs. the browser (client), producing a
   hydration mismatch on fully deterministic input with no `Math.random`/`Date.now`/no-arg `new Date()`
   anywhere — a failure class the existing static `no-random` check cannot catch (nothing to grep for). Fix:
   hand-write compact-number formatting instead of delegating to `Intl`'s compact notation. Confidence high
   (before/after re-gate directly confirms causation), level L1 (single occurrence, one candidate).
2. **(judge-sourced, from winner c)** Refines the r17-r28 selection-fanout lineage: the ephemeral-hover half of
   a pin+hover split reads as genuinely separate (not just "a hover state that happens to coexist with a pin")
   when it (a) explicitly guards against colliding with the current pin (`hoveredId !== pinnedId`, no redundant
   preview on an already-pinned item) and (b) is wired through both pointer and keyboard event pairs
   (`onMouseEnter`/`onFocus` + `onMouseLeave`/`onBlur`), not mouse-only. Two independent lenses (brief-compliance
   and archetype-differentiation) both credited this specific implementation detail as what separated a genuine
   split from siblings that had a narrowly-scoped pin but no true cross-widget ephemeral preview at all.
   Confidence high, level L1.

Both entries appended to `vault/00-principles/dash-deltas-provisional.jsonl` (append-only, `status: provisional`,
`level: L1`).

## §6 지식 정제 게이트

Loaded full `dash-deltas-provisional.jsonl` (67 pre-existing entries + 2 new this round). Clustering: neither new
entry conflicts with any existing entry or with a정본 (dash-brief-v3 / page-brief-core / page-brief-repo).
Neither claims to "reproduce" or "extend" a specific prior round's delta text in the sense §6 requires verifying
(entry 1 is a wholly new failure class; entry 2 is a synthesis across this round's own 3 sibling candidates, not
a claim about a specific earlier round) — so no promotion to L2/L3 and no `supersedes` chain was created this
round. No cross-target conflicts identified (dash vs landing/native deltas). No new entry to `questions-queue.md`
— no conflict pair or meta-criteria-unjustifiable item surfaced.

정본 files (`dash-brief-v3.md`, `design-principles.md`, `page-brief-core.md`) — **unmodified**, per invariant.
`/dash` gallery and `/v1-v5` — **unmodified**.

## §7 Record

- `vault/30-ledger/auto-ledger.jsonl`: entry appended below.
- `vault/index.md` "세대 기록": this run's entry appended below.
- Final commit: `feat(dash-evolve): dash r29 c — Reloop, master-detail seller-quality scatter (2:1 lens1+lens3 vs lens2)`
  → `evolve/dash`.
