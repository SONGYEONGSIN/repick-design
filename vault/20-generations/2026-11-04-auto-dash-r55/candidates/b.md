# r55 / b — Latch

**Concept.** Latch is a third-party vendor SLA / response-time compliance console: a true-light,
single-desaturated-orange-accent SaaS console (`bg-white` canvas, `zinc-200` hairlines, `shadow-sm`
cards) built as a genuine three-region master-detail shell — the standard app sidebar (workspace
switcher, six-item nav, bottom user block) plus a second, independent ~280px vendor-list rail,
plus a flex-1 detail pane with two tabs (Overview / Incidents). The dominant visualization is a
horizontal box plot (P10/P25/P50/P75/P90) per vendor, and the rail itself IS that dominant
visualization: every vendor row carries its own compact box plot drawn on one exact shared log
scale (1–1000 minutes) across all ten vendors, with each vendor's own SLA-target response time
drawn as a dashed-line marker on that same scale, and the median + target always printed as real,
persistent text next to the plot — never hidden behind a hover state. The Overview tab repeats the
same plot larger for just the pinned vendor, with a full five-number summary (P10–P90) and target
as persistent `<dl>` text; the Incidents tab is a real sortable/filterable table of that vendor's
logged response-time incidents. Compliance status (Compliant / At risk / Breach) is not a
hand-typed field — it falls directly out of the same percentiles the plot draws (`p50 > target` ⇒
breach, `p90 > target` ⇒ at-risk, else compliant), so the badge, the plot shape and the status
filter can never drift out of sync. Selection fan-out is split onto two independently-scoped axes
living on two different widgets, per the brief's guidance: clicking a vendor in the rail (or
picking one from ⌘K) **pins** it — a persistent piece of state with exactly one real consumer, the
detail pane — while hovering or tab-focusing a single whisker/median/target handle on ANY box plot
(rail or detail) is a separate, ephemeral, strictly component-local `useState` that drives only
that one row's own floating tooltip and touches nothing else on the page. Five real `'use client'`
interactions ship: the box-plot hover/focus crosshair tooltip (keyboard-reachable via invisible
focusable handles, exactly like the sparkline pattern elsewhere in this catalog); the rail's live
search + compliance-status filter chips; the Overview/Incidents tab toggle (with arrow-key
navigation between tabs, not just click); the Incidents table's real column sort with `aria-sort`
plus its own Open/Resolved filter; and a ⌘K command palette that can pin any vendor or switch tabs.
Typography stays on Pretendard everywhere except the sidebar wordmark ("Latch") and the page's
single `<h1>` ("Vendor SLA console"), both set in `--font-display-mono`; exactly three rendered
weights appear anywhere on the route (400 default, `font-medium`/500, `font-semibold`/600), with no
`font-bold` or inline `fontWeight` anywhere. The detail pane never defaults to empty: on first
paint it pre-selects Anchor BPO, the vendor whose median response (120m) overshoots its own 30m
target by the widest margin of the whole portfolio — picked by code (`getDefaultVendorId`), not a
hand-typed guess.

## 브리프에 없던 것

- **선형 vs. 로그 공유 스케일**
  - ① 모든 벤더를 "같은 스케일"에 그려 비교 가능하게 하라는 요구는 있었지만, 그 스케일이 선형인지
    로그인지는 비어 있었음.
  - ② 1~1000분 구간의 로그10 스케일로 결정 (선형은 시도 후 폐기).
  - ③ 데이터 자체가 2개 자릿수 이상 차이 나는 벤더들(Relay SMS 1–18분 vs. Coldline Storage
    200–950분)을 포함하므로, 선형 공유 스케일로는 빠른 벤더들의 박스플롯이 축 원점 근처 한 점으로
    짜부라져 "박스플롯이 실제로 그려져 보여야 한다"는 하드 룰을 절반의 벤더에서 어기게 됨. 로그
    스케일 + 명시적 그리드라인(1/10/100/1000)으로 "이것은 로그 축"이라는 사실 자체도 숨기지 않고
    모든 행을 시각적으로 유효하게 유지.

- **지배적 시각화를 레일에 둘지 디테일 패널에 둘지**
  - ① 브리프는 "레일 또는 디테일 패널에 수직으로 쌓으라"고 두 옵션을 모두 허용했음.
  - ② 레일을 1차 장소로 결정 — 10개 벤더 전체가 항상 공유 스케일로 나열되어야 "직접 비교 가능"이라는
    요구가 실제로 성립하므로, 선택된 벤더 하나만 보이는 디테일 패널보다 레일(항상 전체 목록)이 더
    적합. 디테일 패널의 Overview 탭에는 핀된 벤더용 확대판을 중복이 아니라 "보완"으로 추가.
  - ③ 상위 규칙("벤더 간 직접 비교 가능")을 "둘 중 선택"이라는 하위 규칙보다 우선 적용.

- **버튼 중첩 버그 방지 설계**
  - ① 레일의 각 행을 "클릭하면 핀 고정"으로 만들어야 했는데, 동시에 그 행 안에 박스플롯 자체의
    호버/포커스용 버튼들도 들어가야 함 — 이 둘을 어떻게 겹치지 않게 배치할지는 브리프에 없었음.
  - ② 행 전체를 `<button>`으로 감싸지 않고, 행을 일반 `<div>` 카드로 두고 이름/카테고리/배지만
    감싸는 내부 `<button>` 하나만 핀 동작을 맡게 하며, 박스플롯의 핸들 버튼들은 그 바깥 형제로
    분리.
  - ③ `<button>` 안에 다른 상호작용 가능한 엘리먼트(여기선 또 다른 `<button>`)를 넣는 것은 HTML
    파싱 규칙상 브라우저가 바깥 버튼을 조기에 암묵적으로 닫아버려 DOM/레이아웃이 깨지는 실제 버그이며,
    표준 HTML 명세("interactive content" 포함 금지) 위반이라 임의로 분리.

- **SLA 컴플라이언스 상태를 정의하는 기준**
  - ① "컴플라이언스 상태 배지를 보여줘라"는 요구는 있었지만 Compliant/At-risk/Breach를 가르는
    정확한 임계값 공식은 비어 있었음.
  - ② `p50 > target` → Breach, `p50 ≤ target < p90` → At risk, 그 외 → Compliant로 결정.
  - ③ 박스플롯이 이미 그리고 있는 바로 그 퍼센타일(p50, p90)을 그대로 재사용해 상태를 도출함으로써
    배지·플롯·필터가 서로 다른 소스에서 어긋날 가능성을 원천적으로 제거 — "서브토탈은 반드시 총계와
    일치해야 한다"는 브리프의 데이터 원칙을 컴플라이언스 상태에도 동일하게 적용한 결정.

- **기본 선택 벤더와 샘플 데이터의 상태 분포**
  - ① "비어 있는 디테일 패널로 시작하지 말고 가장 주목할 만한(예: SLA 최악) 벤더를 기본 선택하라"는
    규칙은 있었지만, 10개 벤더의 구체적 수치·구성비는 비어 있었음.
  - ② Anchor BPO(중앙값이 목표의 4배)를 기본 선택으로 고정하고, 전체 10개 벤더를 Breach 3 /
    At-risk 4 / Compliant 3으로 구성(처음엔 Compliant가 0개로 나와 재조정).
  - ③ 전부 Breach/At-risk뿐인 포트폴리오는 비현실적이고 "Compliant" 상태 배지·필터 칩이 한 번도
    렌더링되지 않아 완성도가 떨어지므로, 실제 수치를 코드로 재계산해 가며 현실적인 분포로 임의 조정.
