# auto-dash-r44 — DECISION

## 0. Round-budget / scheduling note

Round 2 of this scheduled session's two back-to-back `/dash-evolve`-equivalent executions. Round 1 (`auto-dash-r43`) was a hard-gate no-winner, committed+pushed before this round's RETRIEVE began — this round read r43's fresh ledger entry and DECISION before drawing a new target. `round-budget.mjs --explain 2` again returns **1** (0 unfilled `PAGE_TYPES`) — same reading as round 1 and the established `auto-native-r29` precedent for this scheduling pattern. Subagent availability (§0-0) reconfirmed: `Agent` tool present; no named `designer`/`comparator` persona types in this sandbox, `general-purpose` used throughout for GENERATE and JUDGE. `self_judged` not applicable/true (independent fresh agents for every GENERATE and JUDGE role, no shared context, judging convened normally this round).

## 1. Target & setup

- Unfilled-type queue: 0. Fallback target draw: random among `[dash, landing, native]` → **dash** again (independently redrawn — matches this ledger's documented precedent of the same target repeating across back-to-back rounds).
- Round number: `auto-dash-r44`.
- `reassign-queue.md` "대기 중" empty for dash — no reassignment this round.
- `catalog-variety.mjs` banList over the last 3 real dash winners (r40/r41/r42; r43 excluded, no real winner) → no hard ban. Assigned axes: a=dark/amber/grotesk, b=light/emerald/wide, c=light/violet/mono — distinct from each other and from the recent-3-winner axes.
- Macro-bucket/chart-type pre-check against the last 6 dash rounds (r39–r43, including r43's three dropped-at-gate attempts) — avoided: decomposition-tree, geo-choropleth+feed, radar+pin-supplier, process-mining flow-map, candlestick+watchlist-rail (×2), donut/arc, anomaly-band line, slider-rail simulator, pinned-comparison-bench, Sankey/master-detail, waterfall/3-pane, word-cloud/feed-centric.

## 2. GENERATE

Three independent `general-purpose` agents, each given the fully assembled brief plus a distinct archetype/chart/fan-out-tier/theme assignment: a=Master-detail+Treemap(tier-1, 2 independent axes), b=Calendar/board-centric+per-cell bullet/gauge grid(tier-2), c=Feed-centric+Box-plot bench(tier-2). All produced complete candidates + concept docs with brief-gap sections.

## 3. HARD GATE

Full detail in SCORES.md. **b passed clean on the first attempt (10/10, no fix needed).** a had one lint warning (unused import); c had a systemic desktop `cell-overlap` in its incident-feed table (Status↔Age column collision, 1264–1536px). Both given their one allowed fix (via `SendMessage` resuming the original designer agent). **Both fixes held cleanly on re-gate** — a's unused import removed; c root-caused its colgroup allocation (dropped a redundant desktop column, reallocated the rest against real pixel minimums at its tightest failing width) and passed 0 overflow on re-gate. **All 3 candidates survive to §4 JUDGE** — the first round in this session's two-round pair where every candidate reaches judging.

## 4. JUDGE

Three independent blind `general-purpose` judges (lens1=brief/DNA compliance, lens2=commercial polish, lens3=archetype differentiation), concept docs withheld, each given 2–4 screenshot frames per candidate + full source access.

- **Lens 1**: a > c > b. a is the only candidate with two fully independently-scoped fan-out axes (neither resetting the other, both non-empty by default); b's single data table has no mobile card-list fallback (inferred from source/arithmetic, no mobile-scroll frame available to confirm visually); c has a localized Service-column truncation defect plus one focus-ring inconsistency on an otherwise-compliant command-palette input.
- **Lens 2**: a > b > c, with a/b nearly tied. c has two concrete, cited defects: desktop text clipping on its incident feed's Service/Message columns (the code's own comment acknowledges this trade-off explicitly) and a "Create monitor" drawer button whose `onClick` is identical to Cancel's — collects form input, produces no observable state change.
- **Lens 3** dissents: b > c > a. b's per-cell bullet/gauge calendar reads as the most genuinely novel chart-type-in-shell combination with a clean, non-convergent fan-out. c's box-plot bench is also novel but its fan-out threads one id into 3 widgets, close to this catalog's previously-flagged "uniform `selectedId`" defect class. Most substantively: lens3 found a's treemap+master-detail+selection-sync macro concept closely resembles an already-shipped catalog work, `/dash/d35` ("Tessera", `auto dash r7` winner).

**Orchestrator verification of the d35 finding** (since it's the most consequential claim in the panel and only one lens raised it, with a self-disclosed shallow check): confirmed `/dash/d35/cockpit.tsx` is a real, promoted gallery work (`works.ts:229`) using a treemap with a **single uniform `selectedId`** threaded into treemap+table+detail — this catalog's own doctrine (`dash-brief-v3.md`, "선택→다중 위젯 동기화" section) names this as the *weakest* established fan-out tier ("전면 재계산"). Candidate a was explicitly built this round with **two independently-scoped selection axes** — the *strongest* established tier. So a's mechanism is not simply identical to d35's; it's a direct, deliberate improvement on the exact anti-pattern d35 embodies, even though the chart type and coarse macro shell do match. This is a genuine, unresolved tension between two of this catalog's own doctrines (`curation-criteria` "Q6 판정" input×output reuse-detection, which doesn't look at fan-out-tier quality, vs. the fan-out-tier hierarchy itself, which treats tier as the primary differentiation signal for exactly this archetype family) — logged as **questions-queue Q68** rather than decided unilaterally by this orchestrator.

**Decision on the majority**: per this catalog's own established precedent — "차별성 ↔ 완성도 상충 시 판정 방향" (differentiation-vs-completeness conflicts are resolved by taking the completeness/compliance majority; reproduced 3+ times: landing r2/r3, `auto-login-r1`) and Q32's finding that a clean 2:1 split with a rotating dissenting lens is this catalog's *normal*, expected outcome, not evidence of a flawed panel — **the 2:1 majority for a (lens1+lens2) stands.** This is a clean majority, not a complete 3-way tie, so no tie-break mechanism applies.

## 5. LEARN

Winner exists → 1 new delta extracted and appended to `dash-deltas-provisional.jsonl` (L1, variant `b`): a table with `min-w` correctly placed on the `<table>` element itself (per this repo's own rule) can still be unusable on mobile if the candidate never adds a `sm:hidden` card-list fallback the way sibling candidates in the same round independently chose to — b's `ExceptionsTable` is textbook-compliant with the letter of the rule but, unlike a's and c's tables in the very same round, ships no mobile alternative at all.

## 6. 지식 정제 게이트

No conflicting delta pairs found against the existing provisional backlog. New **questions-queue Q68** opened (fan-out-tier improvement vs. same-chart-type+macro-shell reuse doctrine — see §4 above for full reasoning) — not decided here, left for a future reproduction per this catalog's own re-leveling discipline (판정 체계 변경은 더 높은 재현 임계를 요구한다).

## 7. 기록 + 커밋

Canon unchanged: `dash-brief-v3.md`, `design-principles.md`, `page-brief-core.md`, type profiles, `/dash` gallery, `/v1–v5` all untouched this round (only read, for the d35 verification). `dash-deltas-provisional.jsonl` and `questions-queue.md` both append-only. Winner a promoted as-is (no §3-1 fix — no rule violation cited against it). No commit to `main` — this commits to `evolve/dash` only. Candidate routes b and c retained per standard practice (not dropped; they lost judging, not the hard gate) for the next `/dash-falsify` review.

**This completes both of this scheduled session's two back-to-back `/dash-evolve` executions**: round 1 = `auto-dash-r43` (hard-gate no-winner, all 3 candidates dropped), round 2 = `auto-dash-r44` (winner a, "Ration"). 0 candidates dropped in round 2 (both 1-fixes held); 3 candidates dropped total across both rounds (all in round 1). Canon fully unchanged throughout both rounds. 정본 무변경.
