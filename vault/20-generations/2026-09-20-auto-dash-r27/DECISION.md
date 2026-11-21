# auto-dash-r27 — DECISION

## 0. Round-budget deviation (read first)

This run was invoked as `/dash-evolve 2` (2 requested rounds, scheduled/unattended execution). Per skill §0-0-1, the actual round count is decided by `scripts/round-budget.mjs`, not by the caller's argument:

```
$ node scripts/round-budget.mjs 2
1
$ node scripts/round-budget.mjs --explain 2
미채움 0종 — N≥2 의 근거(커버리지)가 없다
```

`PAGE_TYPES` in `app/src/lib/works.ts` has 0 unfilled types today, so per the 2026-09-12 policy the upper bound collapses to N=1 regardless of the requested argument. **Only one round (this one) runs in this invocation — this is not a failure, it is the skill's own designed behavior when the coverage queue is empty.**

## 1. Target selection

- Native Monday-forced-target check: UTC day = 0 (Sunday) → does not apply.
- PAGE_TYPES unfilled query → `[]` (0 unfilled) → fell back to equal-random dash/landing/native → **dash**.
- Round number: max existing `auto-dash-r*` in ledger was r26 → this run is **r27**.
- Reassign-queue check: `reassign-queue.md` "대기 중" has no active dash-target item (only a deferred-backlog note referencing 5 other targets' drops not yet queued) → no reassignment slot consumed this round; all 3 candidates were free-generated.

## 2. Generate — 3 candidates

Diversity check (`node scripts/catalog-variety.mjs` + last-3-round dash ledger `variety` fields) → `banList: {theme: [], accent: [], face: []}` (no forced avoidance; last winner r26/c was light/violet/wide, no repeat pattern across the last 2-3 rounds). Assigned three deliberately distinct macro-archetypes not used in the last 5 dash rounds (r22–r26: security timeline, service-dependency graph, BI console, master-detail triage/support ×2, 3-pane comp terminal, calendar scheduling, feature-flag workbench, waterfall, reconciliation ledger, hero-number payout, hex-map dispatch, heatmap, box-plot master-detail, ledger-feed+sunburst) and not in the ~26-work catalog's shipped forms:

- **a — Waymark**: OKR/goals console, bullet-chart grid dominant visualization. dark / teal / `--font-display-grotesk`.
- **b — Fathom**: cloud-cost root-cause console, decomposition-tree dominant visualization. light / blue / `--font-display-mono`.
- **c — Vantage**: vendor-risk scorecard console, radar/spider-chart dominant visualization (with mandatory table fallback per its A11y-B chart-catalog rating). dark / amber / `--font-display-wide`.

Each candidate brief included, in full text (not by reference): dash-brief-v3 core requirements, page-brief-core machine-verified rules, page-brief-repo §1 English-only-copy mandate, the full grid-craft/sr-only/min-w/cell-overlap lineage rules, the selection-fan-out lineage (r17–r26) guidance, at-a-glance completeness requirement, and an explicit instruction not to leak any real session/operator identity into invented personas or dummy data (per the `auto-dash-r3/a` delta on this exact risk). Each candidate wrote a "브리프에 없던 것" gap-report section (9, 8, and gap items respectively — not actioned this round per the ≥2-report threshold rule, filed for future brief-completeness tracking).

## 3. Hard gate

See `SCORES.md` for the full gate table. Summary: all three candidates failed their first gate pass. One 1-fix attempt each:

- **a (Waymark)** — hydration mismatch (13 identical console errors) root-caused to an `Intl.NumberFormat({notation:"compact"})` call whose rounding output differs between server (Node ICU) and client (Chromium ICU) for the same input value. Fixed with a hand-rolled deterministic compact-number formatter. **Re-gate: PASS, 0 violations.**
- **b (Fathom)** — two violations: (1) `no-unlisted-font` static false-positive triggered by a `{ fontFamily: string }` TypeScript type annotation preceding the real (compliant) `var(--font-display-mono)` value on the same line; (2) `react-hooks/set-state-in-effect` lint error. Fix attempt: extracted the type to a named alias (kept the false-positive pattern on its own line — regex re-matched); fixed the lint issue correctly. **Re-gate: static gate re-failed (same rule). Per the skill's explicit 1-fix-then-drop invariant, candidate b is DROPPED even though this is very likely a checker false-positive, not a real font violation** — the checker regex matches the first `fontFamily\s*[:=]` token on a line regardless of whether it's a type position or a value position, and cannot distinguish them without an AST. This is the same root defect class as `questions-queue.md` Q19 (previously reproduced via extracted runtime constants); **a third reproduction (new trigger: type annotation) has been logged there** rather than filed as a new question, per the "동일 유형 중복 금지" rule. No override of the gate result was made — the round proceeds with b dropped, as the skill requires, and the false-positive is routed to the standing question instead of adjudicated mid-round.
- **c (Vantage)** — two violations: (1) `react-hooks/set-state-in-effect` in `CommandPalette.tsx` (fixed correctly — moved the reset into the input's `onChange`); (2) `table-overflow` at 1280–1536px from an unconditional `min-w-[820px]` on the fallback score table. Fix attempt: added `lg:min-w-0` (mobile-only floor, matching the documented "min-w on `<table>`, desktop-fluid" rule). **Re-gate: lint passes, but the `table-fixed` + `<colgroup>` percentage-width path this now exercises produced a NEW `cell-overlap` defect** ("Anchorline Supply" ↔ "At risk", 5–20px overlap at 1280–1536px) plus small residual `table-overflow` (1–8px) at the same widths. This is a fresh, independent reproduction of the already-**promoted L2** delta in `dash-brief-v3.md` §그리드 크래프트 룰 v2 ("표준 처방이 새 결함을 만든다" — `table-fixed` conversions can introduce cell-overlap where columns are narrower than actual content). No new delta needed (already promoted); this occurrence is simply confirming evidence. **Candidate c is DROPPED** (재실패 시 탈락).

Both b and c were dropped for **rule violations, not form judgments** — neither the decomposition-tree nor the radar-scorecard form was ever seen by a judge. Per `reassign-queue.md`'s own standing policy (see its "대기 중" note on `dash r22/b`·`r22/c`·`r23/c`·`r25/b`·`landing r17/c`: eligible-but-not-formally-queued to avoid a backlog the queue's 1-per-round consumption rate can't clear), **b and c are not formally added to the reassign queue this round** — they remain recoverable from `candidates/b.md` and `candidates/c.md` at any time, consistent with existing precedent, rather than adding 2 more items to an already-deferred 5-item backlog.

Only candidate **a** survives to judging.

## 4. Judge panel — solo review

Per skill §4, one survivor → solo review per lens (verdict only, no ranking). Full lens outputs:

**Lens 1 (brief compliance) — WINNER.** App shell complete (sidebar, topbar, all header controls individually 44px per `Topbar.tsx:27,37,51,83` / `Sidebar.tsx:22`); component system (Card token-driven, real `aria-sort` table, tabs/segmented/dropdown/badges/progress/sparkline) all present; English-only copy confirmed, display font (`--font-display-grotesk`) scoped to headline/wordmark only, 3 rendered weights confirmed via grep (no bold/extrabold/serif in route); at-a-glance bullet grid confirmed (value/target/status always visible, hover only reveals a secondary delta); 6 real interactions found (exceeds the 4-minimum); selection fan-out verified non-uniform in source (`CheckinsTable.tsx:45-47` explicit "intentionally never reads pinnedId" comment + visible "Unfiltered by pin" badge; `FocusRail.tsx:79-80` rollup ignores the pin); 1920px cap confirmed (content reaches near viewport edge, no dead margin); dark/teal/no-decoration confirmed; realistic deterministic OKR data confirmed. Unverified: live keyboard Tab order, live screen-reader output, 1024/1280/1600px widths, live computed font-weight.

**Lens 2 (commercial polish) — WINNER.** Alignment crisp (KPI cards identical height/padding, table columns right-justified and clean); density/hierarchy appropriate at both 1440 and 1920; bullet-chart craft genuinely real — confirmed in both screenshot (distinct fill/bands/tick on the "Median API latency" row) and source (`BulletGrid.tsx:90`, target tick positioned independently via `targetPct`, decoupled from the value-fill boundary) — not a disguised progress bar; color discipline holds (teal is the only brand accent, amber/red are semantic status colors shared with common SaaS conventions, not decorative additions); micro-copy specific and product-grade (named personas Jordan Ames/Dana Reyes, explicit UI-behavior subtitle copy); zero lorem/placeholder hits on grep. Unverified: mobile-width bullet-grid rendering beyond scroll-0 screenshot, full ultra-wide page density beyond the top fold, live interaction behavior (hover trend, keyboard sort, command palette, "new check-in" flow).

**Lens 3 (archetype differentiation) — NO-WINNER.** Confirms the bullet chart itself is genuine (bands from `kr.segments`/`BAND_FILL`, distinct value-bar fill, distinct 2px target tick — `BulletGrid.tsx:84-90`) and the selection-fan-out wiring is clean (matches lens1's finding, `WaymarkClient.tsx:18-21,111-121`, `FocusRail.tsx:9-14,80-99`) — but the page shell (a 4-tile KPI row followed by a `grid-cols-12` `col-span-8`/`col-span-4` split, `WaymarkClient.tsx:59-118`) is judged to reproduce this catalog's already-shipped "KPI-row + 8/4 chart shell" archetype verbatim, with only the content inside the 8-column slot changed. Verdict: a novel *widget* substituted into a familiar *layout* is not sufficient for a differentiation win — the panel's explicit charge is to reject candidates that collapse into an already-common shell, and structurally this one does, even though the visualization component is genuinely new and well-built. No completeness-vs-differentiation trade-off issue found (progressive disclosure of only the trend/delta on hover is reasonable). Unverified: hard-gate items (already passed), `CheckinsTable.tsx`/`Sidebar.tsx`/`CommandPalette.tsx`/`data.ts`/`tokens.ts` source directly, live interaction, intermediate widths/scroll states.

**Aggregate**: 2 WINNER (lens1, lens2) / 1 NO-WINNER (lens3). Per skill's rule ("no-winner 표 2개 이상이면 라운드 no-winner"), a single dissenting no-winner vote does not force the round to no-winner. **This 2:1 split (lens1+lens2 vs lens3) is this loop's own documented normal outcome pattern** (`curation-criteria.md` "Q32 판정" table lists exactly this split — 렌즈3 alone dissenting — as the most common historical pattern, alongside `dash r16`). **Round winner: a (Waymark).**

## 5. Learn

One delta extracted and appended to `dash-deltas-provisional.jsonl` (L1, provisional): a genuinely novel dominant-visualization widget can still fail the differentiation lens if the surrounding page shell reproduces an already-common archetype — visualization novelty and layout novelty are separate axes, and this candidate cleared only one. Generalizes `curation-criteria.md` Q6 (differentiation = input-axis × output-axis combination). Full text and judge-quote evidence in the jsonl entry (`round: auto-dash-r27, variant: a`).

## 6. Refinement gate

- No conflicting delta pairs identified this round.
- No delta met the ≥2-round reproduction bar for L1→L2 promotion this round (the new delta is a first occurrence).
- `questions-queue.md` Q19 updated with a third reproduction (new trigger: TS type-annotation false-positive on `no-unlisted-font`, distinct from the previously-documented extracted-constant trigger) rather than filed as a new question — same underlying regex limitation (can't distinguish a `fontFamily:` at a type position from one at a value position without an AST).
- b/c reassign-queue eligibility noted but not formally queued, per existing backlog-avoidance precedent (see §3).

## 7. Environment note (not a skill deviation — infra-only)

Playwright's installed `playwright-core@^1.61.1` expected chromium revision 1228, but only revision 1194 was pre-installed in this container's `/opt/pw-browsers`. Created a compatibility shim (`/opt/pw-browsers/chromium_headless_shell-1228/` with symlinks into the 1194 build's binary + assets, renamed `headless_shell`→`chrome-headless-shell` to match the newer path layout) so `gate.mjs`'s sweep/a11y/perf browser launches would resolve. This is infrastructure plumbing local to this container, not a change to any canonical asset, script, or gate rule — the gate itself ran unmodified.

## 8. Commit

`git add -A && git commit` for this round covers: `app/src/app/dash-evolve/r27/{a,b,c}/*` (winner + dropped candidates, kept per invariant — dropped routes are not deleted), `vault/20-generations/2026-09-20-auto-dash-r27/*` (SCORES, DECISION, candidates/*.md, shots/*), `vault/00-principles/dash-deltas-provisional.jsonl` (append), `vault/00-principles/questions-queue.md` (Q19 update), `vault/30-ledger/auto-ledger.jsonl` (append), `vault/index.md` (register this run). No canonical brief file (`dash-brief-v3.md`, `design-principles.md`) touched. No `/dash` gallery or `/v1–v5` touched. Pushed to `evolve/dash`.
