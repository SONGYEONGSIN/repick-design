# Candidate B — Shiftcast · Capacity Planner

**Product/brand**: Shiftcast — a workforce-capacity planning SaaS for support/ops leaders (chat, email and phone contact centers). Route: `app/src/app/dash-evolve/r42/b/page.tsx`.

**One-line concept**: A split-simulator macro-shell — a persistent left-hand control rail of live sliders (volume growth, average handle time, shrinkage, hires) and segmented targets (SLA %, 8/12-week horizon) drives a continuously-recomputed demand-vs-capacity projection on the right (hero headline number → chart → staffing table), with no "Apply" step: every lever change recalculates the whole page instantly from one pure function.

## Macro-shell & chart differentiation
- **Shell**: split simulator (controls-drive-result), not master-detail, not a KPI-row+chart-split, not a rail+chart+feed terminal. The left rail holds *inputs* (sliders/segmented controls), never a list of selectable items — there is nothing to "select" on that side, only to *tune*.
- **Chart**: a capacity-vs-demand line chart (`capacity-chart.tsx`) with per-week background bands (hatched-red for under-target weeks, tinted-green for surplus weeks) instead of an interpolated area-between-curves fill, so the chart's shading always matches each week's own attainment badge exactly, deterministically, with no crossover-point geometry to get wrong.
- **Selection discipline**: clicking a week **pins** it, which does one thing — expands that exact row inline in the table (channel breakdown + a hiring/surplus recommendation) and marks it with a persistent ring+label on the chart. There is no separate consumer/detail panel anywhere. Hovering/focusing a week (chart point or table row) only shows an **ephemeral** preview (crosshair + floating tooltip on the chart) that explicitly does not render when `hoveredWeek === pinnedWeek`, wired through both `onMouseEnter`/`onMouseLeave` and `onFocus`/`onBlur`. The pin defaults, at first paint, to the real peak (worst) week of the 12-week horizon — never an empty placeholder.

## Interactions implemented (6)
1. **Chart hover crosshair tooltip, keyboard-accessible** — each of the 8–12 weeks has a real, individually focusable 32×32 hit-target button positioned over its point; `Enter`/click pins, hover/focus previews, Arrow Left/Right/Home/End move focus between weeks. An `aria-live="polite"` region mirrors the current pinned/previewed week's numbers for screen-reader users.
2. **Real table sort** — the staffing-plan table's Week/Volume/Required/Gap/Attainment columns are sortable with real `aria-sort`.
3. **Period/view toggles** — SLA target (80/90/95%) and planning horizon (8/12 weeks) segmented controls, both of which recompute the entire projection, not just a filter.
4. **Selection syncing (pin vs. hover, see above)** — the clicked item expands itself inline; nothing is fanned uniformly into 3+ sibling components.
5. **Live simulator controls** — four sliders (volume growth, handle time, shrinkage, hires) recompute the headline number, chart and table in real time, with five scenario presets that set all levers at once.
6. **⌘K command palette** — jumps to any week (pins it) or applies any scenario preset, deterministically, searchable by date or preset name/description.

The header's primary action ("New scenario") has a real `onClick` that resets inputs, re-pins the new peak week, and clears any hover — not a dead button.

## Font/typography confirmation
- Body/UI text: `--font-sans` (Pretendard) throughout; every single rendered text node carries an explicit `font-normal`/`font-medium`/`font-semibold` class (including every `<th>`, which otherwise inherits the browser's bold default — fixed explicitly), so the route renders exactly 3 computed weights (400/500/600).
- Display face: `--font-display-mono` used in exactly three places — the "Shiftcast" wordmark, the page `<h1>` ("Capacity planner"), and the hero headline number itself (digits in a mono face read cleanly as a readout). Nothing else uses it; no serif, no second display face.
- All numbers `tabular-nums`; `Intl.NumberFormat`/`Intl.DateTimeFormat` for formatting, no `compact` notation anywhere (hydration-safety).
- Accent: `green-700` for all actionable/text use (verified 5.02:1 on white, 4.79:1 on `green-50`), `green-600` never used for text; secondary/caption text standardized on `zinc-600` everywhere (not `zinc-500`) so no surface — tinted or not — can fall below the contrast floor.

## Completeness vs. the SaaS reference bar
- Full mandatory shell: sidebar (brand + workspace switcher + 4-item nav + user) / mobile drawer, topbar (⌘K search, working primary action, notifications popover, avatar menu), all header controls `h-11`.
- Deterministic dataset: 12 fixed weekly ticket-volume literals (Oct 19 2026 – Jan 11 2027, rising into the holiday peak), every derived number (required headcount, channel split, attainment %) computed by one pure formula from inputs — no `Math.random`, no `Date.now`, no bare `new Date()`. Channel splits (chat/email/phone) always reconcile exactly to the required headcount via a remainder-absorbing rounding scheme.
- Single `<table>` on the route, `table-fixed` + `<colgroup>` percentage columns verified to sum to 100 and sized against realistic worst-case content (e.g. "104,300" volume, "Below SLA" badge); zero `overflow-x` containers anywhere; mobile gets a fully-interactive card list (same pin/expand behavior), not a dead summary.
- Focus-visible: every interactive element uses `focus-visible:outline-2 outline-offset-2 outline-green-700` with no preceding `outline-none` and no bare `ring` anywhere in the route.
- Color never the only signal: SLA status pairs icon+text (`AlertTriangle`/`CircleCheck` + "Below SLA"/"On target"); surplus/deficit pairs icon+text everywhere via one single-meaning `GapIndicator` component (`TrendingUp`=surplus/green, `TrendingDown`=deficit/red, used identically at all 4 call sites, never flipped).

## 브리프에 없던 것

1. **도메인/제품을 무엇으로 할지**: ① 브리프는 자유 탐색이라 도메인 자체가 비어 있었다. ② B2B 고객지원(채팅/이메일/전화) 운영팀을 위한 인력 배치 시뮬레이터(Shiftcast)로 정했다. ③ "split simulator" 형태가 가장 자연스럽게 성립하는 도메인(레버 몇 개 → 즉시 계산되는 숫자)을 찾다 보니 콜센터 캐파시티 플래닝이 Zendesk/Assembled류 실제 SaaS 카테고리와 가장 가깝고 과장 없이 설득력 있었다.

2. **"심플레이터" 인터랙션의 구체적 수식**: ① 볼륨→필요 인원으로 환산하는 공식이 브리프엔 없었다. ② `필요 에이전트시간 = 주간 티켓량 × AHT(분)/60`, `생산 가능 시간/에이전트 = 40h × (1 − 결손율%)`, `필요 인원 = ceil(에이전트시간 / 생산시간)`로 정했다. ③ 콜센터 업계의 표준 Erlang 근사 없이도 이해 가능한 선형 근사식이며, 모든 중간값이 정수 슬라이더 조합에서 항상 결정적으로 재현된다.

3. **핀/호버 분리를 차트+테이블 양쪽에 어떻게 배선할지**: ① 브리프는 "핀은 명시적, 호버는 일시적"이라는 원칙만 주고 구체적 배선 방법은 비워뒀다. ② 차트의 각 포인트 히트타겟과 테이블의 각 행 둘 다 동일한 `hoveredWeek`/`onPinWeek` 콜백을 공유하되, 소비처는 "그 자체가 확장되는 행"과 "차트 위 영속 마커" 둘뿐으로 제한했다. ③ 브리프의 "별도 디테일 패널이 전혀 없는 편이 더 강한 탈출"이라는 조언을 그대로 따른 것으로, 임의 선택이 아니라 브리프 문구에서 직접 역산한 결정이다.

4. **주간 타임라인의 실제 날짜**: ① "12주 호라이즌"이라고만 했지 어느 달력에 얹을지는 정해지지 않았다. ② 2026-10-19(월)부터 12주 — 정확히 홀리데이 시즌(12월) 피크를 포함하도록 — 로 고정했다. ③ 임의 선택이지만, 콜센터 도메인에서 "12월 피크"는 업계에서 가장 흔한 캐파시티 위기 시나리오라 데모 설득력을 위해 일부러 그 구간을 포함했다(Python으로 요일까지 사전 검증: 10/19은 실제 월요일).

5. **SLA 배지 문구 길이**: ① 브리프는 "색만으로 신호를 주지 말라"고만 했지 정확한 라벨 텍스트는 정하지 않았다. ② 처음엔 "Under target"/"On target"이었으나 `table-fixed` 6열 레이아웃에서 폭이 부족해 "Below SLA"/"On target"으로 줄였다. ③ 1280px 데스크톱 폭에서 글자 수 기반으로 셀 폭을 역산해보니(각주 11px 대문자 기준 ~6px/글자) 원래 문구가 column budget을 초과해, 실측 없이도 클리핑 위험을 줄이는 쪽으로 임의 조정했다.
