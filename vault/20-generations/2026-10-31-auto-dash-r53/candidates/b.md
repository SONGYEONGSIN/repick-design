# Thrum — reliability-operations control tower for platform/SRE teams

## Structure

Rail-free dense bento. No content-rail, no master-detail pane, no single hero-plus-stat-row. The
app shell is standard chrome only: a 256px left sidebar (brand lockup, workspace switcher, 6-item
nav, user footer) and a 64px top bar (⌘K search trigger, primary action, notifications, avatar
menu) — all shell, not content.

The content area is an explicit 12-column CSS grid (`grid-cols-12` at `lg:`, collapsing to 2 cols
at `md:` and 1 col on mobile) with eight cards of four distinct footprints, in four visual rows:

- Row 1 (2 big cards, each row-span-2): **Request latency** (7/12 cols, the dominant viz — a
  hand-drawn SVG area/line chart with always-visible p50/p95/p99 numbers above it) + **Error
  budget** (5/12 cols — a bullet-gauge list, one bar per service, consumed-vs-target).
- Row 2 (2 big cards, each row-span-2): **Incident queue** (8/12 cols — a real sortable table) +
  **Service health** (4/12 cols — an 8-tile status grid).
- Row 3 (3 small cards, row-span-1): **Deploy frequency** (stacked bar chart), **On-call now**
  (roster list), **Infra spend** (stat + sparkline).
- Row 4 (1 full-width short card): **Anomalies** (a 4-up strip of metric-vs-baseline deltas).

Largest single card by grid area is the Incident Queue at ~22% of the total bento area — nowhere
near the 60% ceiling. There is no single dominant visualization pane; the latency chart is simply
the card whose numbers matter most, and its p50/p95/p99 are printed as plain text above the chart,
not hidden behind hover.

Accent: Tailwind's `green` scale only (`green-600` ≈ `#16A34A`), used for the brand mark, primary
button, active nav pill, "healthy" states, and chart line/area. Canvas is pure white / `zinc-50`;
cards are `white` + `border-zinc-200` + `shadow-sm`. Display face is `--font-display-wide` for the
wordmark and the page `<h1>` only; everything else, including every card title (`<h2>`) and all
body/data text, is Pretendard (`--font-sans`).

## Interactions (5 implemented)

1. **Chart hover crosshair + keyboard tooltip** — `LatencyTrendCard`: moving the pointer over the
   latency chart (or focusing it and pressing ←/→/Home/End) moves a crosshair line + dot and shows
   a tooltip with the exact platform (and, if pinned, service) value at that point. An `sr-only
   aria-live` region mirrors the same text for screen-reader users.
2. **Real table sort** — `IncidentQueueCard`: clicking Severity / Service / Open-for / Status
   toggles `aria-sort="ascending"|"descending"` and re-sorts the underlying record array; default
   sort is "Open for" descending (longest-open incidents first).
3. **Period toggle** — a segmented control (24H/7D/30D) on the latency card swaps the whole
   `LATENCY_SERIES[period]` array, which also drives the p50/p95/p99 stat row and the "last
   refreshed from the hourly/daily/30-day rollup" caption under the page `<h1>`.
4. **Selection → synced update (two independently-scoped axes, explicitly not wired together)**:
   - **Axis A — the pinned-selection axis**, shared across exactly two sibling widgets: clicking a
     service tile in Service Health, an Incident Queue row/service link, or a result in the ⌘K
     palette all call the same `selectService(id)` in `Dashboard.tsx`. That one id highlights the
     tile in **Service Health** and overlays/highlights that service's line + stat values in
     **Request latency** — nothing else on the page reads it.
   - **Axis B — a separate, self-contained ephemeral axis**: hovering (or tab-focusing) a row in
     **Error Budget** shows a minute-level "budget allows / burned" breakdown in that card's own
     footer only. It is deliberately **not** wired to Axis A — the code comment in
     `ErrorBudgetCard.tsx` states this explicitly, and nothing written by Axis B is read anywhere
     else, so the two axes never mirror each other.
5. **⌘K command palette** — global `Cmd/Ctrl+K` (and the top-bar search button) opens a modal
   combobox over services + incidents. Typing filters the list; ↑/↓ move `aria-activedescendant`
   over un-tabindexed `role="option"` items; Enter or click fires the same `selectService(id)` as
   Axis A above, so the palette is a third, equivalent entry point into the same pinned selection.

Also present but not counted toward the 4+: the sidebar's own nav→scroll (`scrollIntoView`,
`prefers-reduced-motion`-gated), the account/notification popovers, and the workspace switcher.

Typeface check: exactly one display face used (`--font-display-wide`, on the sidebar wordmark and
the page `<h1>` only). Every other string, including all 7 card `<h2>` titles, table text, and all
data, is Pretendard via `--font-sans`.

## 브리프에 없던 것

1. **결정해야 했던 것**: 구체적인 B2B 도메인과 제품명.
   **결정**: 플랫폼/SRE 엔지니어링 운영(서비스 신뢰성, 인시던트, 배포, 온콜, 인프라 비용)을 다루는
   가상 제품 "Thrum"을 발명.
   **근거**: 브리프가 "any B2B domain you like"라고 명시했고, 이 도메인은 bento 그리드에 자연스럽게
   어울리는 이질적 위젯(차트/테이블/게이지/리스트/스파크라인)을 요구해 "rail-free dense bento"
   레이아웃 제약과 잘 맞음.

2. **결정해야 했던 것**: 울트라와이드 캡 수치.
   **결정**: 사이드바 256px + 좌우 패딩 48px → 1920px에서 가용폭 1616px, 캡을 `max-w-[2200px]`로
   설정(1920px에서는 적용되지 않고, 뷰포트가 약 2504px를 넘을 때부터 적용됨).
   **근거**: 브리프가 제시한 예시 계산식("사이드바 256px, 패딩 48px → 가용폭 ≈1616px, 캡은
   ≥~1660px")을 그대로 내 실제 쉘 치수에 대해 재계산했고, "2560px 이상에서는 완만한 캡이 괜찮다"는
   지침에 맞춰 2200px로 정함.

3. **결정해야 했던 것**: 선택(selection)의 fanout 범위와, 두 번째 독립 축의 정체.
   **결정**: 축 A(핀 고정)는 Request Latency + Service Health 두 카드에만 연결; 축 B(hover 미리보기)는
   Error Budget 카드 내부에만 머무르는 완전히 분리된 ephemeral 상태로 설계.
   **근거**: 브리프의 "Selection-fanout quality bar"가 명시한 최상위 티어("two or more
   independently-scoped axes that live in different dominant widgets and never mirror each
   other")를 그대로 구현 대상으로 채택. 임의 설계가 아니라 브리프 문구를 코드 주석으로 직접 옮겨
   둠(`ErrorBudgetCard.tsx`, `LatencyTrendCard.tsx`, `Dashboard.tsx`).

4. **결정해야 했던 것**: 에러 버짓(error budget) 계산 공식.
   **결정**: `consumed% = (100 - actual) / (100 - target) * 100`로 정의하고, 모든 버짓 관련 숫자가
   이 함수(`consumedBudgetPct`) 하나만 호출하도록 함.
   **근거**: SRE 업계 표준 "error budget burn rate" 정의(Google SRE Workbook 류의 통상적 정식화)를
   채택. 브리프의 "derived number는 같은 record에서 계산, 손으로 따로 타이핑하지 말 것" 규칙을
   만족시키기 위한 단일 소스화.

5. **결정해야 했던 것**: p95/p99 지연시간을 p50과 어떻게 연결할지.
   **결정**: p95 = p50×1.55, p99 = p50×2.05라는 고정 배수로, p50은 24시간 시리즈의 마지막 포인트
   값을 그대로 사용.
   **근거**: 임의 선택이지만, 실제 웹 서비스 지연시간 분포에서 흔히 보이는 전형적 tail 비율 범위를
   참고한 수치이며, 핵심은 "p95/p99가 p50과 별도로 손으로 타이핑되지 않고 항상 같은 숫자에서 파생"
   되게 만든 것(브리프의 derived-number 일관성 규칙).

6. **결정해야 했던 것**: 포커스 링 색상/구현 방식.
   **결정**: `outline-none` + `focus-visible:ring-2 focus-visible:ring-green-600
   focus-visible:ring-offset-2`를 모든 포커스 가능 요소에 공유 상수(`FOCUS_RING`)로 적용.
   **근거**: 브리프가 명시적으로 지목한 "죽은 관용구"(bare `ring-2`, 또는 `outline-none` 뒤에
   `focus-visible:outline-*`)를 피하고, 브리프가 직접 제시한 패턴("ring-2 ring-<accent>-500
   ring-offset-2 with an explicit color")을 그대로 채택.

7. **결정해야 했던 것**: 아바타 이미지 소스.
   **결정**: 이 레포의 다른 dash-evolve 라운드들에서 이미 사용된 것으로 확인된 `images.unsplash.com`
   고정 photo-id 목록 중에서만 골라 재사용(새 ID를 추측해서 쓰지 않음).
   **근거**: "fixed real images.unsplash.com/photo-<id> URLs" 요구사항을 만족시키면서, 존재 여부가
   검증되지 않은 ID를 새로 지어내는 리스크를 피하기 위해 레포 안에서 이미 쓰인 ID만 채택(관례 재사용,
   임의 발명 아님).

8. **결정해야 했던 것**: Incident Queue와 Service Health처럼 콘텐츠 양이 다른 형제 카드의 높이 균형.
   **결정**: Incident Queue 쪽에 `max-h-[360px]` + 내부 스크롤(+ sticky thead)을 줘서, 10행 전부를
   무제한으로 늘어뜨리지 않고 Service Health의 자연스러운 높이(8타일)에 더 가깝게 맞춤.
   **근거**: 브리프의 그리드 공예 규칙 "Balance row/card heights ... max-height + internal scroll"을
   문자 그대로 적용.
