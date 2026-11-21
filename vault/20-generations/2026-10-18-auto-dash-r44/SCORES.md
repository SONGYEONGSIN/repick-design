# auto-dash-r44 — SCORES

Target: dash (round 2 of this scheduled run's two back-to-back `/dash-evolve`-equivalent executions; round 1 was `auto-dash-r43`, no-winner, committed+pushed before this round began). `round-budget.mjs --explain 2` → **1** ("미채움 0종"). Target draw: unfilled PAGE_TYPES = 0 → random[dash,landing,native] → **dash** (drawn again, independently — matches this ledger's documented precedent of the same target repeating across back-to-back rounds, e.g. r35/r36, r37/r38). `reassign-queue.md` "대기 중" is empty for dash — no reassignment this round. `catalog-variety.mjs` banList over the last 3 REAL dash winners (r40 dark/cyan/pretendard, r41 light/sky/grotesk, r42 dark/lime/wide — r43 excluded, no real winner) → `{theme:[], accent:[], face:[]}`, no hard ban.

Macro-bucket/chart-type pre-check against the last 6 dash rounds (r39–r43, including r43's three dropped-at-gate attempts): decomposition-tree, geo-choropleth+feed, radar+pin-supplier, process-mining flow-map, candlestick+watchlist-rail (×2), donut/arc, anomaly-band line, slider-rail simulator, pinned-comparison-bench, Sankey/master-detail, waterfall/3-pane, word-cloud/feed-centric — all avoided. Environment: same `PW_CHROMIUM_PATH`/`CHROME_PATH`/`PW_NO_SANDBOX` workaround as r43 (unchanged, no script edits).

## Candidates

| v | Product | Macro shell | Dominant viz | Fan-out tier | Theme/accent/face |
|---|---|---|---|---|---|
| a | Ration (FinOps cost allocation) | Master-detail | Treemap (slice-and-dice, hand-built) + required tree-table fallback | Tier 1 (2 independent selections: drill-breadcrumb + cross-team pin) | dark / amber / grotesk |
| b | Loadline (fulfillment-ops shipping) | Calendar/board-centric | Per-cell bullet/gauge calendar (bar+tick+band+number per day) | Tier 2 (pin + guarded ephemeral hover) | light / emerald / wide |
| c | Quorum (platform-reliability console) | Feed-centric | Box-plot bench (6 services, always-visible 5-number summaries) | Tier 2 (pin + guarded ephemeral hover) | light / violet / mono |

Source freeze hash (GENERATE completion, before 1st gate): `b911420be0eb24a440d84bb2fd2b5458b92e556e`.

## Hard gate — attempt 1

| v | route | types | static | lint | weights | sweep | focus | console | a11y | perf |
|---|---|---|---|---|---|---|---|---|---|---|
| a | ✅ | ✅ | ✅ | ❌ 1 warning (`@typescript-eslint/no-unused-vars`, `pinned-resource-card.tsx:4`, unused `formatPercent` import) | ✅ 3종 | ✅ | ✅ | ✅ | ✅ **100** | ✅ 65 |
| b | ✅ | ✅ | ✅ | ✅ | ✅ 3종 | ✅ | ✅ | ✅ | ✅ 100 | ✅ 63 |
| c | ✅ | ✅ | ✅ | ✅ | ✅ 3종 | ❌ `cell-overlap`×29 (desktop 1264–1536px, Status↔Age columns in incident-feed table) | ✅ | ✅ | ✅ 97 (`aria-progressbar-name` — not a score-independent hard-fail audit, score≥95 so this gate passes) | ✅ 64 |

**b passes clean on the first attempt — no fix needed.** a and c each get their one allowed fix.

## 1-fix

- **a**: removed the unused `formatPercent` import (the card only renders currency + raw percent literals, never calls it).
- **c**: root-caused the incident-feed table's colgroup — at the tightest failing width (1264px) the table's real available width (~573px, computed from shell/padding/grid-gap) couldn't fit the Status/Severity badges in their allocated columns. Dropped the desktop Assignee column entirely (redundant with Service Detail + Monitors table; kept in the mobile card list) to free 12%, then reallocated all 6 remaining columns against real pixel minimums computed at 1264px specifically (Service 12% / Message 22% / Severity 20% / Status 27% / Age 12% / Pin 7%), verified every wider tested width has *more* margin since pixel requirements are fixed while column-% pixel share grows with viewport.

## Hard gate — attempt 2 (final)

| v | lint | sweep | a11y | perf | **verdict** |
|---|---|---|---|---|---|
| a | ✅ (fixed) | ✅ | ✅ 100 | ✅ 63 | **SURVIVES** |
| b | ✅ | ✅ | ✅ 100 | ✅ 63 | **SURVIVES** (unchanged, no fix needed) |
| c | ✅ | ✅ **0 (fixed)** | ✅ 97 | ✅ 59 | **SURVIVES** |

Post-fix freeze hash: `f45629fecb9ad6569396e168310aab8f83c296a4`.

**All 3 candidates survive to §4 JUDGE.**

## Screenshots

`capture-shots.mjs --widths 1440 390 --scrolls 0 100`, no blanks, no errors. a's page fits entirely within one viewport at both tested widths (scroll 100% produces an identical frame to scroll 0%, so the script did not emit a duplicate) — a has 2 frames (`a-1440.png`, `a-390.png`); b and c each have 4 (`{b,c}-1440.png`, `{b,c}-1440-s10000.png`, `{b,c}-390.png`, `{b,c}-390-s10000.png`).

## JUDGE panel (3 blind lenses, independent `general-purpose` agents, concept docs withheld)

| | 1st | 2nd | 3rd |
|---|---|---|---|
| Lens 1 (brief/DNA compliance) | **a** | c | b |
| Lens 2 (commercial polish) | **a** | b | c |
| Lens 3 (archetype differentiation) | **b** | c | a |

**Clean 2:1 majority for a** — not a complete 3-way tie, no tie-break mechanism needed.

- Lens 1: no defect found against a; a is the only candidate with two fully independently-scoped fan-out axes, both non-empty by default; b has a mobile table-collapse gap (no card-list fallback at 390px, only inferred from source/arithmetic); c has a localized Service-column truncation defect and one focus-ring inconsistency on its command-palette input.
- Lens 2: a and b are near-tied and both essentially flawless; c has two real, cited defects — desktop text clipping that loses meaning on its incident feed's Service/Message columns (acknowledged as a deliberate trade-off in the code's own comment), and a "Create monitor" button whose handler is identical to Cancel's (collects input, produces no observable state change).
- Lens 3 dissents, ranking b>c>a, citing: b's chart-type novelty (per-cell bullet/gauge calendar, not found elsewhere in the catalog by keyword search) with a clean, non-convergent fan-out; c's own novel chart type (box-plot bench) but a fan-out pattern close to this catalog's previously-flagged "uniform selectedId threaded to 3 widgets" defect class; and — the most substantive finding — **a's treemap+master-detail+selection-sync macro concept closely resembles an already-shipped catalog work, `/dash/d35` ("Tessera", `auto dash r7` winner)**.

**Orchestrator verification of lens 3's d35 finding**: confirmed `/dash/d35/cockpit.tsx` is a real, promoted, registered gallery work (`works.ts:229`) using a treemap + a **single uniform `selectedId`** threaded into the treemap, table, and detail panel — this is exactly the catalog's own established *weakest* fan-out tier ("전면 재계산"). Candidate a, by contrast, was explicitly built this round with **two independently-scoped selection axes** (treemap-drill → breadcrumb; table-pin → pinned-resource-card, neither resetting the other) — the catalog's established *strongest* tier. So while the chart type and coarse macro shell do match d35, the specific mechanism this catalog's own doctrine treats as the primary differentiation currency for this archetype family is not just different but is a direct, deliberate improvement on the exact anti-pattern d35 embodies. This is a genuine tension between two of this catalog's own established doctrines (`curation-criteria` "Q6 판정" input×output reuse-detection vs. the fan-out-tier hierarchy) rather than a clear-cut duplication — logged as **questions-queue Q68** rather than decided unilaterally here. Per this catalog's own precedent ("차별성 ↔ 완성도 상충 시 판정 방향" — 3+ prior reproductions, always resolved by taking the completeness/compliance majority) and Q32's finding that a 2:1 split with a rotating dissenting lens is this catalog's *normal* result, not a flaw: **the 2:1 majority for a stands.**

## Verdict

**WINNER: a (Ration)** — 2:1 majority (lens1 + lens2 vs. lens3). No lens cited a hard-gate rule violation against a (lens3's finding is a structural-differentiation/prior-art observation, not a rule violation), so §3-1 (post-judgment fix) does not apply — a is promoted as-is, unmodified since its 1-fix.

LEARN: 1 new L1 delta (b's `ExceptionsTable` correctly places `min-w` on `<table>` per the rule, but ships no mobile card-list fallback, unlike its two round-mates — appended to `dash-deltas-provisional.jsonl`, variant `b`). New question: **Q68** (fan-out-tier-improvement vs. same-chart-type+shell reuse doctrine), appended to `questions-queue.md`.
