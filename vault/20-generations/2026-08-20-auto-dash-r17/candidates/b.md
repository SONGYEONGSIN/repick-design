---
tags: [generation, dash, auto-dash-r17]
---

# auto-dash-r17 / b — Bayline

**Bayline** — a fictional fleet-maintenance bay planner for a commercial trucking terminal ("Midway Freight — Terminal 4", eight service bays), whose one-line concept is *see six weeks of shop-floor load at a glance, then drill any single day down to the jobs that make it up*. The assigned macro skeleton is a **calendar-heatmap spine with a day-drill agenda**: the page's dominant object is a 6-week × 7-day intensity calendar (Mon 2026-02-02 → Sun 2026-03-15, exactly 42 days) built as a generative CSS/`<table>` grid — no chart library — where each cell's blue shade AND its printed number are the same figure, a `Week total` column runs down the right edge and a `Weekday total` row runs along the bottom, both as always-visible text. Selecting any cell drives a **day agenda** card: the full date, a four-item summary strip (work orders / bay hours / overtime / shift use), and an ordered list of that day's real bookings with literal shop-clock timestamps (`06:30 → 09:30 CT`, unit number, model, job code, bay, crew lead, bay hours, overtime). Underneath, a **secondary 42-column daily trend** plots the identical `DAYS[i].values[metric]` array, so the calendar and the trend can never disagree, with a dashed period-average rule as the second series and a caret marker under the selected day. A **weekday profile** table writes the calendar's column totals out in words next to a share meter, and a sortable/filterable **service-bay roster** closes the page. Deliberately not a 3-pane terminal, master-detail rail, kanban, twin mirrored panels, dependency graph, funnel, or dense datagrid-as-page.

Theme: genuine light (zinc-50 canvas, white cards + `border-zinc-200` + `shadow-sm`, text zinc-900/700/600/500), single accent = **blue** (blue-700 `#1d4ed8` for accent text and white-on-fill, 6.70:1), **no display face at all** — Pretendard everywhere, hierarchy from size/tracking/weight/colour only, and exactly three computed weights on the route (400 / 500 / 600; Playwright `getComputedStyle` sweep at 1920 / 1440 / 1280 / 390 reports `["400","500","600"]` at every width). Reconciliation is structural, not typed: a single `ORDERS` array (202 work orders) is reduced into day totals, week totals, weekday totals, the grand total, the trend series and the per-bay roster, so `Σ week = Σ weekday = Σ bay = grand` holds for all three metrics — on screen, 151+139+165+136+171+142 = 162+160+163+164+171+68+16 = **904 bay hours**, and the roster footer prints the same 904h / 100%.

Route: `app/src/app/dash-evolve/r17/b/page.tsx` (thin server wrapper + metadata → `BaylineClient`), split into `tokens.ts`, `data.ts`, `ui.tsx`, `Sidebar`, `Topbar`, `CommandPalette`, `LoadCalendar`, `DayAgenda`, `TrendChart`, `WeekdayProfile`, `BayTable`.

## Interactions implemented (6, all real `'use client'`)

1. **Calendar cell select → three-widget sync.** Click or keyboard-select any of the 42 cells; the day agenda reloads, the always-visible readout bar above the grid rewrites (and announces via `aria-live="polite"`), and the trend's selected column turns blue-700 with a caret under the axis. Cells use a roving `tabIndex` grid: ←/→ step a day, ↑/↓ step a week, Home/End jump to the week edges, and every cell paints the mandated focus outline + glow.
2. **Keyboard crosshair on the trend.** The plot is a `role="slider"`; ←/→/Home/End walk the crosshair and `aria-valuetext` announces `"Friday, March 6, 2026: 10 overtime hours"` on every move, the "Crosshair" stat tile above it updates in sync, and Enter/Space promotes the crosshair day to the page selection (which pulls the calendar and agenda with it). Pointer hover drives the same state.
3. **Hover / focus value overlay on the heatmap.** Every cell carries a popover showing all three metrics for that day (`7 orders · 32h bay · 9h overtime`) on hover and on `:focus-visible` — the a11y-grade-B hover requirement — on top of the printed value and the semantic row/column table underneath.
4. **Real table sort + filter on the bay roster.** Four sortable columns with live `aria-sort` (`ascending`/`descending`/`none`) plus a three-way shift filter; the card header reports the honest subtotal (`2 of 8 bays shown · 48h of 211h in the period`).
5. **Metric toggle (Work orders / Bay hours / Overtime).** One segmented control re-renders the heatmap intensity AND its legend bands AND the week/weekday/grand edge totals AND the trend AND the weekday profile's columns AND the roster's value column AND which KPI tile is highlighted, all from the same reduction.
6. **⌘K command palette** over days, bays and crew leads. Its `<input>` carries the focus token directly (no `outline-none` anywhere on the route), day hits load the agenda, bay hits scroll to the roster and mark the row `Found` — and a found bay stays visible even when the shift filter would otherwise hide it.

## 1920px width arithmetic

- Sidebar `w-64` = **256px**, `<main>` padding `lg:px-8` = **32px** each side.
- Available content width at 1920 = 1920 − 256 − 32 − 32 = **1600px**.
- **No `max-w` cap anywhere on the route** — the KPI row, both 12-column grids and the roster card all fill that 1600px.
- Playwright-measured at 1920: the right-most card edge sits at **1888px**, so the gap to the viewport is exactly the **32px** page padding (≤ 40px). Document `scrollWidth === clientWidth === 1920` at 1920 / 1440 / 1280 / 1024 / 768 / 390, and zero elements report `scrollWidth > clientWidth`.

## 브리프에 없던 것

1. ① 도메인을 무엇으로 발명할지 정해야 했다 — 브리프는 "시간 형태의 부하를 가진 B2B SaaS"만 요구하고 임상 스케줄링·콜센터·정비 베이·데이터센터·법정 기일을 예시로 나열할 뿐 하나를 지정하지 않았다.
   ② 상용 트럭 플릿의 정비 베이 플래너(Bayline)로 확정하고, 지표를 work orders(건수) · bay hours(작업시간) · overtime(초과근무시간) 세 가지 **가산 가능한** 값으로 좁혔다.
   ③ 세 값이 전부 개별 작업지시(work order)의 필드 합이라, "행합 = 열합 = 총합"이라는 정합 요구가 **설계로 보장**된다(손으로 총계를 타이핑할 자리 자체가 없다). 데이터센터/인프라는 r16/c(Parhelion)가 이미 쓴 소재라 피했고, 임상은 가상의 환자 데이터를 만드는 부담이 있어 제외했다.

2. ① 히트맵 축을 "주 × 요일"로 할지 "시간 × 요일"로 할지 정해야 했다 — 배정문은 둘 다 허용한다.
   ② 6주 × 7일 = 42셀(2026-02-02 월 ~ 2026-03-15 일)로 정했다. 2026년 2월은 28일이고 2026-02-01이 일요일이라 이 창은 정확히 6주에 딱 맞아떨어진다.
   ③ 배정문이 요구한 드릴다운이 "DAY/SLOT 아젠다"인데, 주×요일이면 셀 하나가 곧 **하나의 실제 날짜**여서 아젠다가 자연스럽게 "그날의 예약 목록 + 실제 타임스탬프"가 된다. 시간×요일이었다면 셀이 요일-시간대 집계라 리터럴 날짜를 붙일 수 없다. 또 42셀은 트렌드 차트의 42포인트와 1:1 대응이라 "히트맵과 트렌드가 일치한다"를 우연이 아니라 **같은 배열을 읽는 구조**로 만들 수 있었다.

3. ① 히트맵 램프의 최댓값과 셀 텍스트 색을 정해야 했다 — 브리프는 "램프 전체를 먼저 계산하고 텍스트 색을 고르라"고만 경고한다.
   ② 램프를 blue-50 → blue-400(`#60a5fa`)에서 **끊고**, 0단계(빈 날)만 흰 배경, 1~5단계는 전부 zinc-900 한 토큰으로 통일했다. 실측: zinc-900(#18181b) on blue-400 = **6.97:1**, 같은 배경에 zinc-600을 얹었다면 3.04:1로 탈락한다. blue-500까지 갔다면 4.82:1로 "겨우 통과"라 한 단계 물러섰다.
   ③ 브리프가 인용한 선례("어떤 색도 램프 전체에서 AA를 못 넘겨 intensity-conditional 텍스트를 통째로 포기한 카탈로그 작업")를 반복하지 않으려면, 텍스트를 색에 맞추는 게 아니라 **램프를 텍스트에 맞춰 잘라야** 한다고 판단했다. 대비 여유를 6.97:1까지 벌어두면 판정 색공간이 달라도 흔들리지 않는다.

4. ① a11y 등급 B가 요구하는 "행/열 라벨 테이블"을 히트맵과 **별개의 표**로 또 만들지, 히트맵 자체를 시맨틱 테이블로 만들지 정해야 했다.
   ② 히트맵 자체를 진짜 `<table>`로 지었다 — `<caption>`, `<th scope="col">` 요일 헤더, `<th scope="row">` 주 헤더, 주합 `<td>` 열, 요일합 `<tfoot>`. 그 위에 **별도 성격의** 표(Weekday profile: 요일별 세 지표 + 점유율 미터)를 디자인의 정식 카드로 얹었다.
   ③ 같은 숫자를 두 표로 두 번 그리면 "폴백을 붙였다"는 티가 나고 화면 예산만 먹는다. 히트맵을 테이블로 지으면 라벨·스코프·총계가 **한 벌**로 끝나고, 남는 자리에는 중복이 아니라 새 집계(요일 프로파일)를 넣는 편이 판정에도 독자에게도 낫다고 봤다.

5. ① r16 델타가 요구한 "390px에서 다른 레이아웃으로 갈아타기"의 **전환점과 대체 레이아웃**을 정해야 했다 — 브리프는 "genuinely different (stacked/grouped list)"라고만 한다.
   ② 캘린더는 `lg`(1024px) 아래에서 9열 그리드를 버리고 **주 단위로 묶인 스택 리스트**로 갈아탄다: 주 헤더(주 라벨 + 주합) 아래 7개 전폭 행, 각 행은 `요일/날짜 · 비례 로드바 · 우측 정렬 값`이고 빈 날은 바 대신 "Shop closed — no bay work" 문장이 들어간다. 베이 로스터는 `md`(768px) 아래에서 6열 표를 버리고 **베이당 스택 카드**(플랫 `dl` 4항목 + 점유율 미터)가 된다. 요일 프로파일은 열을 좁히는 대신 보조 2열을 **제거**한다(`hidden sm:table-cell`).
   ③ 전환점을 캘린더는 `lg`, 로스터는 `md`로 서로 다르게 잡은 이유는 열 수가 다르기 때문이다 — 9열은 1024px 아래에서 이미 셀당 90px 밑으로 떨어지고, 6열은 768px까지는 버틴다. 실제로 1024px 실측에서 주 범위 라벨("Feb 16 – Feb 22")이 `whitespace-nowrap` 상태로 월요일 칸을 침범하는 것을 스크린샷에서 잡아, 라벨을 `Feb 16–22` 형태로 줄이고 라벨 열을 13%→15%로 올려 고쳤다. r16 델타가 경고한 그 실패가 390px가 아니라 1024px에서 먼저 나타났다.

6. ① 42개 셀의 키보드 모델을 정해야 했다 — 브리프는 "키보드로 도달 가능 + 보이는 포커스"만 요구한다.
   ② roving `tabIndex`(선택된 셀만 0, 나머지 −1) + 화살표 이동, 그리고 **이동이 곧 선택**(포커스가 옮겨가면 아젠다·트렌드도 따라온다)으로 정했다. ↑/↓는 ±7일(같은 요일 위아래), Home/End는 그 주의 월/일요일.
   ③ 42개를 전부 탭 순서에 넣으면 키보드 사용자가 캘린더를 빠져나가는 데만 42번 탭을 눌러야 하고, 게이트의 포커스 계측이 첫 40개 focusable을 캘린더 셀로 다 채워 그 뒤 컨트롤을 영영 못 본다. WAI-ARIA grid 관례와 게이트 실효성이 같은 답을 가리켰다.

7. ① `TRANSITION` 토큰에 무엇을 넣을지 정해야 했다 — 카탈로그 관례는 `transition-colors`다.
   ② `transition-[color,background-color,border-color]`로 **직접 열거**했다.
   ③ Tailwind v4의 `transition-colors`는 속성 목록에 `outline-color`가 들어 있다(`dist/lib.js`에서 확인). 그래서 포커스 아웃라인이 요소의 `currentColor`에서 파랑으로 **페이드인**하고, 실제로 첫 계측에서 Tab 직후의 아웃라인 색이 `rgb(25,60,184)`처럼 절반 섞인 값으로 찍혔다. 게이트가 Tab 직후 프레임을 샘플링한다는 걸 아는 이상, 포커스 표시가 애니메이션 중간값으로 관측될 여지를 남길 이유가 없다.

8. ① 작업지시를 베이에 배정하는 결정론적 규칙을 정해야 했다.
   ② 처음엔 `bays[(i + k) % n]`(일 인덱스 + 슬롯)로 썼다가, `Math.floor(i / 2) + k`로 바꿨다.
   ③ 템플릿 선택이 `(7i + 5k) mod 12`이라 **한 템플릿 안에서는 `i + k`의 패리티가 고정**된다(mod 2로 내리면 `7i+5k ≡ i+k`). 그 결과 2개 베이를 가진 작업 유형이 항상 같은 베이로만 가고, Quick lane 1은 6주 내내 0시간 — 스크린샷에서 `0h / 0%` 행으로 드러났다. 결정론적 수식은 "무작위처럼 보이는" 것과 다르고, 이런 숨은 불변량은 렌더 결과를 눈으로 보기 전엔 잡히지 않는다는 게 이번의 교훈이다.

9. ① 세그먼티드 컨트롤의 ARIA를 `role="radiogroup"`+`aria-checked`로 할지 `aria-pressed` 토글 버튼으로 할지 정해야 했다.
   ② `role="group"` + `aria-pressed`를 택했다.
   ③ 게이트의 상태 프로브가 여는 대상이 `[aria-pressed="false"]`와 `[role="tab"][aria-selected="false"]` 두 가지뿐이다(`dash-sweep.mjs`). radiogroup으로 두면 지표 토글과 필터 칩 뒤의 뷰가 **계측되지 않은 채** 통과한다 — r14·r15·r16을 죽인 것이 정확히 "기본 뷰 밖의 포커스"였으므로, 계측당하는 쪽을 골랐다.

10. ① 트렌드 차트의 두 번째 계열을 무엇으로 둘지 정해야 했다 — 브리프는 "다계열은 색만으로 구분 금지"라고만 하고 무엇을 비교할지는 말하지 않는다.
    ② 기간 일평균을 **파선 기준선**으로 깔고, 선택된 날은 색 + 축 아래 caret(도형)으로 이중 표시했다. 범례에도 "Period average, 21.5 bay h"처럼 숫자를 적어 둔다.
    ③ 지표가 셋으로 바뀌는 화면에서 고정 목표선(예: "베이 정원 36h")은 work orders나 overtime으로 토글하면 의미를 잃는다. 일평균은 세 지표 모두에서 같은 뜻을 유지하는 유일한 기준선이었고, 파선+캐럿이라는 두 개의 비색 채널을 얻는 부수효과도 있었다.

11. ① 하루 베이 정원(capacity)과 근무 캘린더를 발명해야 했다 — "shift use %"를 쓰려면 분모가 필요한데 브리프에 없다.
    ② 평일 36 bay-hours, 토요일 18, 일요일 0으로 두고, 일요일에 잡힌 소수의 작업은 정원 0이므로 퍼센트를 계산하지 않고 "off-shift call-in" / "call-in crew only"라는 **문장**으로 대체했다.
    ③ 0으로 나누는 칸에 `NaN%`나 `0%`를 찍는 대신 상태를 말로 바꾸면, 도메인 상 실제로 존재하는 사실(주말 로드콜 대응)을 설명하면서 계산 예외도 함께 해결된다. 기간 전체로 보면 904h / 1,188h = 76%로 KPI 타일과 아젠다의 일별 %가 같은 정의를 공유한다.

12. ① 요일 프로파일 표의 보조 두 열을 고정할지 지표 토글을 따라가게 할지 정해야 했다.
    ② 활성 지표를 뺀 나머지 두 지표가 자동으로 보조 열이 되도록 했다(`METRICS.filter(m => m.id !== metric)`).
    ③ 처음엔 보조 열을 Orders / OT h로 고정했는데, 지표를 Overtime으로 토글하면 헤더가 `OT h … OT h`로 **같은 이름이 두 번** 나왔다. 브리프가 경고한 "기본 뷰만 보면 상태 분기가 샌다"의 조판 버전이었고, 인터랙션 테스트에서 헤더 텍스트를 실제로 읽어 보고서야 발견했다.
