# auto-dash-r13 — DECISION

Target: `dash`. Candidates: a = Portlane (freight/logistics, 3-pane market) · b = Trestle (CI/CD deploy ops, feed-centric) · c = Runsheet (editorial content calendar, calendar-centric).

Frozen source hash judged: `0021b33bcdd66088803df6dc185739ab0db42e8c` (unchanged since SCORES.md — no judged-state edits after freeze).

Diversity axes assigned this round (banList from `catalog-variety.mjs` — theme banned `light` after 2 consecutive gallery rounds, face banned `pretendard` after 3): all 3 candidates dark, distinct display faces (a=grotesk, b=wide, c=mono), distinct accents (a=rose, b=cyan, c=orange).

## Judge panel (3 lenses, blind — parallel agents, no cross-visibility)

### Lens 1 — brief compliance
**Ranking: a > c > b.**
a is the fullest realization of the brief's component-system checklist: two real `table-fixed`+`colgroup` sortable tables (no forced `min-w`, `ShipmentRail.tsx:148-201`, `CarrierScorecard.tsx:22-69`), and its dominant chart hits the L3 at-a-glance rule exactly (always-on hero/forecast labels + keyboard crosshair, `EtaChart.tsx:96-171`). c is close behind — a real semantic calendar `<table>` with caption/scope/aria-label (`CalendarGrid.tsx:70-144`), and uniquely added an explicit `aria-label` to its ⌘K search-trigger button even though its visible label is `hidden` below `sm` (`Topbar.tsx:31`), correctly preserving an accessible name on mobile. b placed 3rd on two concrete, cited defects: (1) its ⌘K search-trigger button has visible text only inside `hidden ... sm:inline` and **no `aria-label`**, leaving it with zero accessible name at the mandated 390px width (`Topbar.tsx:29-47`, confirmed in `b-390.png`) — a real WCAG button-name gap a single-viewport scan can miss; (2) no `<table>` element anywhere in b's tree, so the brief's explicitly-named "정렬 가능한 데이터 테이블" component has no representation (a's and c's both do).

### Lens 2 — commercial completeness (Mercury/Asana/n8n/Coinbase-grade)
**Ranking: a > b > c.**
All three are defect-free on this axis — this ranks depth of craft, not violations. a is the only candidate to combine a hand-built, richly-encoded dominant chart (forecast confidence band + carrier overlay) with full always-on legibility (`EtaChart.tsx:157-171`, `EtaTrendCard.tsx:112-130`) — the loop's most-reinforced L3 pattern (r7/r9/r10 independent reproductions). b has excellent domain-specific craft (commit sha/diff/log excerpt, `FeedItem.tsx:117-146`) and correctly avoids the hover-legibility trap by being text-first, losing only on its secondary sparkline having no accompanying value (`EnvironmentPanel.tsx:63-70`, minor). c is fully competent but the plainest of the three — its dominant element (the calendar) surfaces presence/count only, no numeric values, the shallowest domain-specific visual craft of the round.

### Lens 3 — archetype/structural differentiation
**Ranking: b > c > a.**
b (no dominant chart, activity-stream-as-spine) and c (month-grid-as-dominant-element, no hero) both land as genuinely new macro buckets with no gallery precedent. a is marked down for a real structural finding: its "fixed rail + period-toggle dominant chart + selection-synced detail pane" (`page.tsx:23-35`, `EtaTrendCard.tsx:24-25`) reproduces the existing gallery piece **Meridian** (d32: "period-toggle price chart + asset-selection sync + allocation donut") at the skeleton level — domain (freight vs. finance) and accent (rose vs. Meridian's palette) don't count as differentiation under this lens's own standard. Secondary, non-decisive note: b and c share an identical `h-dvh overflow-hidden` viewport-lock shell mechanism — flagged but not ranking-relevant since their content skeletons remain visually/structurally distinct.

## Aggregation

| | lens1 (brief) | lens2 (commercial) | lens3 (archetype) |
|---|---|---|---|
| 1st | a | a | b |
| 2nd | c | b | c |
| 3rd | b | c | a |

**1st-place votes: a=2, b=1, c=0. Winner = a (Portlane) by 2-of-3 majority.**

This is the loop's established tie-break precedent in its plain (non-tied) form: brief+commercial dual-majority outranks a lone archetype-differentiation vote when the two conflict (`curation-criteria` — "차별성 ↔ 완성도 상충 시 판정 방향", 2026-07-31, previously reproduced 3× across landing/login rounds). Not a forced winner: a passed all three lenses' individual scrutiny (lens3 still ranked it a legitimate, gate-clean candidate, not disqualified — just structurally unoriginal relative to one existing gallery piece).

## Judgment coverage — self-reported gaps (from the 3 lens outputs, consolidated)
- No lens ran the gate/sweep/Lighthouse tooling itself — all relied on the pre-verified SCORES.md pass state and reasoned from source + the frame-budgeted screenshots (a: 1440/1440-s70/1440-s100/390 · b,c: 1440/1920/390 — single-frame-per-width for b/c reflects their viewport-locked archetype, not missing coverage, per the frame budget briefed to the judges).
- Lens1 did not view 1920px frames for b/c; lens2 did not read `CommandPalette.tsx` for any candidate or `context.tsx`/`types.ts`/`utils.ts` in a; lens3 did not open `CarrierScorecard.tsx`/`ShipmentDetailPanel.tsx`/`EventFeed.tsx` bodies in full.
- None of the three lenses independently audited the exact-3-font-weights rule (explicitly record-only, not hard-fail, per the brief) or cross-referenced the 20-catalog reference docs directly beyond what dash-brief-v3 itself restates.

## 정제 조치 (post-judgment fix — none needed)
Winner a's judged state matches its frozen hash exactly; no rule violation was found in the winning candidate requiring a post-judgment fix per §3-1. (Its two round-mates' defects — b's mobile button-name gap, lens3's Meridian-skeleton note on a — do not trigger §3-1, since that clause is scoped to the winner's own rule violations before promotion, and neither is a promotion-blocking defect in the winner.)

## LEARN — delta extracted (see `dash-deltas-provisional.jsonl` append)
Selected from lens1's b-vs-c comparison (evidenced, reusable, distinct from the existing sr-only/overflow-anchor delta family): a control whose only visible label text lives inside a responsive-hidden utility (e.g. Tailwind `hidden ... sm:inline`) has **zero accessible name** below that breakpoint unless an explicit `aria-label` is also set — `hidden` is `display:none`, which removes the element from the accessibility tree, not just from view. c solved this correctly in the same UI position (⌘K search-trigger) that b did not, giving a same-round paired comparison. This independently corroborates a defect this orchestrator had already found and fixed in c's own first hard-gate pass (c's own search button had the identical bug pre-fix, caught by mobile-preset Lighthouse `button-name` audit at a11y=94) — i.e. the same bug pattern surfaced twice in one round, once caught by machine gate (c, pre-fix) and once caught only by qualitative judge review (b, gate-passing at a11y=95 despite the defect). Recorded as L1 (single round observation across 2 candidates); reproduction in a future round would be grounds for L2.
