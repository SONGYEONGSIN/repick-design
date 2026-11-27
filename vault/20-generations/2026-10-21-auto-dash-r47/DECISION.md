# auto-dash-r47 — DECISION

Target: dash · Round: 47 · Date: 2026-10-21

## 0. N (round-budget) deviation disclosure — required by skill §0-0-1

This scheduled run's prompt requested **2 back-to-back `/dash-evolve` rounds**. `node scripts/round-budget.mjs --explain 2` returned:

```
1	미채움 0종 — N≥2 의 근거(커버리지)가 없다
```

`unfilledTypes()` (`scripts/round-budget.mjs`, reading `app/src/lib/works.ts`'s `PAGE_TYPES`) returned `[]` — all 18 page types currently have at least one promoted catalog entry. Per skill §0-0-1, the script's output overrides the requested count unconditionally: **only this one round (`auto-dash-r47`) runs.** The scheduling prompt itself anticipated this exact divergence and explicitly delegates target/round-count authority to the skill rather than re-specifying the rule inline, so this is expected behavior, not a failure — logged here per the skill's own disclosure requirement.

Today (2026-10-21) is a Wednesday (`getUTCDay()===3`), so the weekly native-day-forces-native rule does not apply either way.

Target was drawn via the §0 script (unfilled queue empty → uniform random among `['dash','landing','native']`) → **dash**. Round number for `dash` = ledger-max(`auto-dash-r*`) + 1 = **47**.

## 1. RETRIEVE

Read in full: `dash-brief-v3.md`, `page-brief-core.md`, `page-brief-repo.md`, `curation-criteria.md` (all entries through Q38 / "없다는 관측" 2026-09-12), `reassign-queue.md` ("대기 중" — **empty**, no dash item to reassign this round), `dash-deltas-provisional.jsonl` (last 15 entries), `charts.catalog.md`, `colors.catalog.md`, `ux-guidelines.catalog.md`, `motion.catalog.md`, last 5 `auto-dash-r*` ledger entries (r42–r46).

`catalog-variety.mjs` run fresh (65 promoted works): theme dark 36/light 29, accent amber 8 · teal 8 · violet-hex 7 · blue 6 · indigo 6 · cyan 5 · emerald 5 · rose 5 · sky 5 · orange 3 · violet 3 · lime 2 · green 1 · blue-hex 1, face pretendard 29 · mono 13 · grotesk 12 · wide 11. `banList(window=3, themeRun=2)` on the 3 most-recent *promoted catalog* dash entries (d40 light/indigo/pretendard, d39 light/sky/pretendard, d38 dark/teal/pretendard) = `{theme:["light"], accent:[], face:["pretendard"]}` — so this round's candidates were steered toward dark themes and non-pretendard-only display faces.

Macro-bucket/chart-type avoid-list, carried forward from r44/r45/r46 DECISIONs (last 6+ actual evolve rounds, not just catalog): decomposition-tree, geo-choropleth+feed-centric, radar+pin-supplier, process-mining flow-map, candlestick+watchlist-rail (×2), donut/arc, anomaly-band line, slider-rail simulator, pinned-comparison-bench, Sankey/master-detail, waterfall/3-pane, word-cloud/feed-centric, box-plot bench, sunburst, bullet/gauge grid, scatter/bubble correlation, real-time streaming area, network/dependency graph, treemap, gantt/timeline, line+confidence-band forecast, calendar/activity heatmap, funnel, cohort triangular matrix, OHLC candlestick trading console, parallel-coordinates+master-detail-folded, Marimekko+board-centric, chord-diagram+feed-centric, bump-chart+hero-inline-stats (r46 winner). Last 3 rounds' theme/accent/face: r46 dark/sky/mono · r45 light/indigo/wide · r44 dark/amber/grotesk.

Candidates were assigned genuinely distinct chart types (waffle / non-calendar intensity heatmap / horizontal bar-ranking) and macro shells (board-centric Kanban / feed-centric / strict two-pane master-detail), none overlapping the avoid-list above, with explicit theme/accent/face diversification (a: dark/emerald/grotesk, b: dark/rose/wide, c: light/blue/mono).

## 2. GENERATE

Three independent `general-purpose` agents, each given the fully assembled brief (prose, not links) plus a distinct archetype/chart/theme assignment, dispatched in parallel, blind to each other's work:

| v | product | dominant visualization (first-of-catalog claim) | macro shell | selection-fanout target | theme/accent/face |
|---|---|---|---|---|---|
| a | **Warden** — SOC 2 audit/controls-compliance workspace | 10×10 Waffle (100 controls by compliance status) | Board-centric: 4-column Kanban (Backlog → In Progress → Evidence Review → Attested) | tier-3 (strongest): two independently-scoped persistent pins in two different widgets, neither resets the other | dark / emerald / `--font-display-grotesk` |
| b | **Keelwatch** — multi-region SRE reliability console | 7×5 service×region intensity heatmap (non-calendar, non-geographic), doubles as its own semantic-table a11y fallback | Feed-centric: live incident feed as hero column + side rail | tier-2 (baseline target): one persistent pin (→ 1 card) + one fully independent ephemeral hover (local to feed.tsx) | dark / rose / `--font-display-wide` |
| c | **Northbound** — renewal-ops ranking console | Horizontal bar ranking folded directly into the ranked rail rows (no separate bar widget) | Strict two-pane master-detail (rail + detail only, explicitly no third always-populated pane) | plain rail→detail (one consumer) + one fully independent sparkline-hover ephemeral | light / blue / `--font-display-mono` |

Each produced a complete candidate + concept doc with a "브리프에 없던 것" (brief-gap) section — collected but not acted on this round per the 2-report threshold rule.

## 3. HARD GATE (`gate.mjs --target web`)

Frozen pre-fix source hash: `2fc6263301db72e96a8befb8848ca2bb2f53837c`.

**1st pass**: all three candidates failed, on a striking convergence — all three independently wrote the identical `useEffect`-based "reset query/activeIndex when the palette opens" idiom in their own from-scratch `CommandPalette` component, tripping `react-hooks/set-state-in-effect` (a:2 instances, b:2 instances, c:1 instance). Separately, **c** also failed `sweep` `page-overflow` (34px @ 390px).

**1-fix (orchestrator-applied — small, mechanical, rule-violation-only, per this catalog's established precedent of small orchestrator fixes, e.g. r40's "오케스트레이터 1줄 보정")**:
- All three: converted the effect-based state reset to a render-time state adjustment (`if (open !== wasOpen) { setWasOpen(open); if (open) { setQuery(""); ... } }`) — the documented React "derive state during render" pattern, which isn't flagged by `set-state-in-effect` since it isn't inside an effect. DOM-only side effects (autofocus) stayed in their own effect.
- **c only**: root-caused via direct Playwright DOM inspection (not guessed) — `PrimaryButton`'s base class hardcodes `inline-flex` unconditionally (`ui.tsx:117`); the caller then passed `className="hidden sm:inline-flex"` to one sibling instance and `className="sm:hidden"` to the other. Measured computed `display` showed BOTH instances rendering simultaneously (`display:flex`) at 390px — this Tailwind build's cascade resolved the caller's unprefixed `hidden` as losing to the component's own hardcoded unprefixed `inline-flex` on the same element. Fixed by moving the visibility toggle to wrapper `<span>` elements with no competing display utility of their own.

**2nd pass**: all three clean, 10/10 (full detail in `SCORES.md`). `a11y`/`perf` report `unavailable` for all three uniformly (this sandbox's Lighthouse+Chrome path isn't wired; per `page-brief-repo.md` §5 this is a documented pass-through, not a candidate defect — non-differentiating).

Post-fix frozen hash: `3a5defb95223eb824f5cdc9189e7fbb25aed5a10`.

## 4. JUDGE PANEL

Screenshots: 4 widths × 4 scroll positions each (16/candidate, 48 total), zero blank frames. Judges were each given 4 frames/candidate (`<v>-1440.png`, `<v>-1440-s70.png`, `<v>-390.png`, `<v>-390-s70.png`) + full source access, blind to concept docs and to each other. Three parallel `general-purpose` agents as lenses.

### Lens 1 — brief/DNA compliance: **a > b > c**
Decisive axis: rule "선택→다중위젯 동기화." **a** is the only candidate that delivers the brief's hardest, explicitly-named target pattern *twice* — `selectedCategory` (WaffleChart → CategoryBreakdown only) and `selectedFindingId` (KanbanBoard → FindingDetailCard only), verified via direct prop/state-wiring trace, neither resetting the other. **b** and **c** each land one tier lower: one genuine cross-widget persistent selection + one same-widget-only ephemeral (b's `hoverId` never leaves `feed.tsx`; c's sparkline hover is explicitly local-only per its own code comment). b edged out c on tie-break: always-visible per-cell values (b's heatmap prints every cell's value as text, doubling as its a11y table fallback) vs. c's per-row-only values; b hits all 5 listed interaction mechanisms vs. c's 4/5; c's outer page canvas is `bg-zinc-50` rather than pure white (a minor, debatable miss on "real light = pure-white base" that a/b's zinc-950 dark canvases don't have an equivalent for). All three: zero `Math.random`/`Date.now`, exactly 3 rendered weights each with exactly one display-font var each, zero `outline-none`/bare-ring focus styling, zero `dark:text-zinc-{500,600}` violations, single `<h1>` each, semantic tables with `table-fixed`+colgroup (no cell-level `min-w`, no stray `overflow-x-auto` scrollers), `motion-reduce` gating present, 100% English copy, `SidebarContent` `w-full min-w-0` guard present in all three (the r46 regression did not reproduce), arithmetic hand-reconciled clean in all three. Self-disclosed gaps: 1920px frame not reviewed for any candidate (rule 6's "≤40px right-margin at 1920" unconfirmed for all three, non-differentiating since unconfirmed uniformly); no live interactive click-through (source-trace + static frames only); no mobile-drawer-open frame reviewed for any candidate.

### Lens 2 — commercial SaaS polish: **a > c > b**
**a** wins: dominant viz (100-cell waffle) fully above-the-fold at both 1440 and 390 with zero scroll/hover required; hand-recomputed rate math (75%, prior 66%, "+9pts" — cannot drift, single source function); both pin panels default-populated (no blank state). One real gap: "New Finding" modal closes/resets but never mutates the visible dataset (an incomplete create-loop, not a dead button). **c** 2nd: most behaviorally-complete header CTA of the three (CSV export builds and downloads a real file end-to-end from live state); KPI math hand-reconciled exactly; dominant viz and detail both fully above-the-fold; shares a minor flaw with b (desktop sidebar nav items are no-op — see delta below). Dominant-viz genre (ranked bar list) scored as less "generative-visualization-dense" than a's waffle or b's matrix. **b** 3rd: concrete, specific (not vague) disqualifying finding — the heatmap the component's own source comment calls "the dominant visualization" is entirely absent from the 1440 scroll-0 frame, appearing only after 70% scroll, because document order places the feed + a 3-card stat rail ahead of it; sidebar nav buttons have literally no `onClick` at all (fully dead, not just unwired); mobile search field collapses to unreadable "S…" at 390px with no responsive-visibility class guarding it. b's incident-composer CTA and arithmetic were both hand-verified fully correct — its ranking position is earned on the above concrete, cited defects, not a vague impression. Self-disclosed: no live click-through; only the two given scroll points per width checked (can't rule out issues strictly between 0% and 70%).

### Lens 3 — archetype/structural differentiation: **a > b > c**
All three candidates used genuinely different macro shells (Kanban+waffle / feed+matrix-heatmap / rail+detail) — **this round is not a silent 2-way convergence**, each is structurally distinct from the other two at the top level. **a** wins on both decisive axes simultaneously: highest chart-type rarity (waffle/unit-chart is a distinct genre from every banned chart type on the standing avoid-list, confirmed as a true 10×10 colored grid in both frames, not a reskinned donut) AND the strongest fan-out tier found this round (two independently-scoped **persistent** selections in two different dominant widgets — the tier dash-brief-v3 itself names as scoring "even higher" than the baseline pin+ephemeral pattern). **b** 2nd: matches the brief's baseline target pattern exactly (one persistent pin, cleanly isolated via grep-verified disjoint file sets for `pinnedKey` vs. `hoverId`) on a moderate-rarity chart type (service×region matrix — more generic than a's waffle, though not literally on the avoid-list since it isn't a calendar/date-grid); its own "feed-centric" self-framing echoes a structural idiom this catalog has used before (paired differently each time, so not a literal repeat). **c** 3rd: plain single-selection master-detail (one `selectedId`, one consumer) is structurally the closest of the three to this catalog's single most over-used/penalized shape (rail of entities + permanently-visible detail pane fed by the same selection) — simplified to two parts rather than three, but the same core failure mode the brief's own worked example warns against ("judged interchangeable glyphs despite looking different on the surface"); lowest chart-type rarity (ranked bar list + sparkline, both generic dashboard primitives). Self-disclosed: 1280/1920 frames not reviewed (unlikely to change the structural verdict, since layout logic was fully readable from source breakpoints); no live interactive click-through.

## Aggregation

**3:0 unanimous for a.** A clean sweep, not merely a majority — per `curation-criteria` "Q32 판정," occasional full unanimity (e.g. `native r9`) is itself a normal, expected outcome of a well-functioning 3-lens panel, not evidence the panel is miscalibrated. No tie-break mechanism needed. No inter-lens conflict requiring a new `questions-queue` entry this round.

**WINNER: a — "Warden."**

## 3-1. Post-judgment rule-violation fixes

None needed — no judge identified a hard-rule violation on the winner (a) that would require post-judgment remediation. The two pre-judgment 1-fix corrections (§3 above) both occurred before judging and are already reflected in the judged artifact; no further "정제 조치" required.

## 5. LEARN — delta appended

See `dash-deltas-provisional.jsonl` append below. Extracted finding: **sidebar nav items can be non-functional on desktop via two different, independently-arising root causes within the same round** — b's nav buttons had no `onClick` at all; c's nav buttons called an `onNavigate`-style prop that the page's desktop mount of the same `SidebarContent` component simply never passed (while the mobile-drawer mount correctly wired it). Both reproduced the identical externally-observable symptom (desktop nav clicks do nothing) via different causes, caught only by lens2 tracing the actual prop wiring at both mount points — the hard gate cannot catch this (no console error, no a11y violation for a button with a valid but no-op handler, or none at all).

## 6. 지식 정제 게이트

Loaded all `dash-deltas-provisional.jsonl` entries (88 existing + this round's new one). No conflicting delta pairs found. No delta in the existing backlog claims reproduction against this round's new finding, so no L1→L2 promotion this round (reproduction threshold — 2+ rounds — not yet met for the new "dual-root-cause dead desktop nav" finding; held at L1 pending a future independent reproduction). No new `questions-queue` entry — panel was clean 3:0 with no unresolved inter-lens tension.

## 7. 기록 + 커밋

Ledger entry, `vault/index.md` update, and git commit/push follow this DECISION (see repo history). Canon (`dash-brief-v3.md`, `design-principles.md`, `page-brief-core.md`, any type profile, `/dash` gallery, `/v1`–`/v5`) — **untouched**, confirmed via `git diff --stat` before commit.
