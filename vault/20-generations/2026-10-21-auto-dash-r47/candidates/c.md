# Candidate C — Northbound

**Pitch:** Northbound is a renewal-operations command center for B2B SaaS customer-success teams — a single ranked rail of every renewing account by the metric that matters today, with the full renewal picture for whichever one you pick sitting right beside it.

## Archetype / shell

- **Macro shell:** strict two-pane master-detail. Left pane (7/12 cols) = the ranked account rail; right pane (5/12 cols) = the detail panel for the selected account. No third always-populated panel — the only other sections on the page (KPI strip above, renewal-tasks table below) are globally scoped, never driven by `selectedId`.
- **Dominant visualization:** horizontal bar ranking, folded directly into the rail itself — every row *is* the bar (track width ∝ value, value label always printed at the row's end, not hover-only). No separate standalone bar-chart widget exists anywhere else on the page.
- **Theme / accent:** light (pure white canvas + `zinc-50` body background, `zinc-200` hairline borders, `shadow-sm` cards), single blue accent (`blue-600`).

## Interactions implemented (5)

1. **Chart hover/focus crosshair tooltip** — the usage-trend sparkline in the detail panel has 8 invisible, individually-focusable hit targets; hovering or tabbing to one draws a dashed crosshair + a floating value tooltip. This state is 100% local (`useState` inside `sparkline.tsx`) — it is never lifted, never read by anything else, and has zero connection to the rail's selection state.
2. **Real table sort + filter** — the Renewal Tasks table has four sortable columns (`aria-sort`, click-to-toggle asc/desc) and an independent status segmented-control filter (All/Open/Blocked/Done).
3. **Period/view toggle (re-ranking control)** — a segmented control above the rail switches the ranking metric (ARR at Risk / Health Score / NRR). The rail re-sorts, rescales every bar to the new metric's max, and recomputes every rank-change arrow — all derived, nothing hand-authored.
4. **Selection → detail sync** — clicking (or ⌘K-selecting) a rail row updates `selectedId`, which drives the detail panel only. That's the one and only consumer; no KPI card or chart title is threaded to the same id.
5. **⌘K command palette** — global toggle, fuzzy account search, arrow-key navigation with `aria-activedescendant`, plus three quick actions (export CSV, jump to tasks, cycle ranking metric).

A sixth real action: the header's primary button ("Export ranking") builds and downloads an actual CSV of the currently visible ranking (Blob + object URL), not a dead `onClick`.

## Typography

Body and all UI copy: Pretendard (`--font-sans`) only. Display face: `--font-display-mono` (JetBrains Mono Display), used in exactly two places — the sidebar wordmark "Northbound" and the three *non-currency* big KPI numbers (avg. health score, avg. NRR, accounts tracked). The one currency KPI ("Total ARR at risk") and every ARR figure elsewhere stay in Pretendard tabular-nums, per the no-currency-glyph rule. Exactly three rendered weights across the route: 400 (default body), 500 (`font-medium` — labels, nav, badges, buttons), 600 (`font-semibold` — h1/h2, card titles, KPI values, wordmark).

## 브리프에 없던 것

1. **기본 랭킹 지표 선택** — ① 세 지표(ARR at Risk / Health Score / NRR) 중 페이지 로드시 어느 것을 기본으로 보여줄지 브리프에 명시 없음 ② "ARR at Risk"를 기본값으로 선택 ③ 임의 선택이지만, renewal-ops 제품에서 "돈이 걸린 리스크"가 가장 실행지향적인 디폴트 렌즈라는 도메인 관례를 따름 (Gainsight/ChurnZero류 CS 툴의 기본 뷰가 대개 risk-first인 것과 동일 논리).
2. **바 스케일 기준(분모)** — ① 지표별로 막대 길이의 분모(최대값)를 무엇으로 할지 브리프는 "value-proportional"만 요구하고 기준은 안 정함 ② Health Score는 고정 100을, ARR at Risk·NRR은 현재 데이터셋의 동적 최댓값을 분모로 사용 ③ 임의 결정이지만 "점수는 만점 대비, 금액/비율은 상대 비교"라는 두 개의 흔한 관례를 그대로 섞어 적용.
3. **지표 전환 시 선택 유지 여부** — ① 랭킹 지표를 바꿨을 때 이미 선택된 계정을 유지할지, 새 1위로 재설정할지 브리프 미명시 ② 선택을 유지하도록 결정 ③ 사용자가 명시적으로 고른 항목을 시스템이 임의로 뺏지 않는다는 일반적 UI 관례(임의 선택, 근거는 사용성 직관).
4. **아바타 표현 방식** — ① "실사용 시 고정 Unsplash photo-id만" 규칙이 있으나 아바타를 꼭 써야 하는지, 쓴다면 사진 대신 이니셜 칩도 허용되는지 브리프 미명시 ② 전부 이니셜 칩(색상 원 + 2글자)으로 통일, 사진 아바타 전면 배제 ③ Linear/Notion류 B2B 툴에서 흔한 관례 참조 — 가상의 인물 사진을 "진짜처럼" 쓰는 것보다 안전하고, next/image 의존도 피함.
5. **CSV 내보내기 스키마** — ① "CSV-export affordance는 nice-to-have"라고만 하고 컬럼 구성은 미정 ② Rank/Account/Segment/Health/현재 지표값/Renewal Date 6컬럼으로 결정 ③ 임의 선택이지만 화면에 이미 보이는 랭킹 정보를 그대로 1:1로 반영하는 것이 "내가 보는 걸 그대로 내보낸다"는 CSV export의 일반 기대와 부합.
6. **순위변동 비교 기준 기간의 레이블** — ① 모든 지표에 `current`/`previous` 값이 있지만 그 "previous"가 무엇을 가리키는 기간인지(지난 분기? 지난 달?) 브리프 미명시 ② "since last quarter"로 고정 레이블링 ③ 임의 결정, renewal-ops 도메인에서 분기 단위 리뷰가 가장 흔한 캐던스라는 관례.
7. **1920px 폭에서의 콘텐츠 캡 여부** — ① "매우 넓은 화면에만 완만한 캡"이 옵션으로 허용되나 둘지 말지는 자유 ② 캡을 아예 두지 않고 완전 유동 폭으로 결정 ③ 사이드바 256px + 좌우 패딩을 뺀 가용폭(1920 기준 약 1664px)에 억지로 캡을 맞추는 계산 리스크를 원천적으로 피하기 위한 임의 선택.
