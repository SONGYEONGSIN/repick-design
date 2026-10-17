# Candidate b — Ridgeline

Ridgeline is a revenue-operations dashboard for B2B SaaS finance teams. The page is built around the
**hero number + inline stats** shell rather than a 4-card KPI row: a single large "Ending ARR" figure
(set in `--font-display-mono`, the one display face used on this candidate, Latin/numeric only) with
QoQ/YoY growth, net revenue retention, gross margin and active-account count shown as smaller inline
text-and-icon pairs beside it — never a second equal-weight card row. A trailing-12-month sparkline
sits next to the hero number as supporting context.

The dominant visualization is a hand-built **waterfall / ARR bridge** (no chart library, real SVG +
CSS): Starting ARR → New business → Expansion → Contraction → Churn → Reactivation → Ending ARR (7
bars). Every period's bridge is computed by one function (`buildBridgeSteps` in `data.ts`) from signed
deltas, so the running total is never hand-typed — for This Quarter: 4,220,000 + 410,000 + 265,000 −
95,000 − 180,000 + 60,000 = 4,680,000, and the same pattern chains across Last Quarter → This Quarter →
Trailing‑12‑months so each period's ending balance is the next period's opening balance. Each bar
carries a signed delta label above it and a running-total value below it (both static text, not
hover-only), connected by dashed step lines between running totals.

Page composition: sidebar (brand lockup, workspace switcher, nav, user footer) + topbar (⌘K trigger,
primary action, notifications, avatar menu) + hero + a 12-col row (waterfall, 8 cols · category
spotlight, 4 cols) + a full-width sortable/filterable account-activity table below. Account-level rows
reconcile too — each bridge category's accounts sum exactly to that category's bridge delta (e.g. the
four new-business accounts sum to 410,000).

**Interactions implemented (5):**
1. **Hover/focus crosshair tooltip on the waterfall** — bars are real `<button>`s in normal tab order
   (Tab-focusable, not mouse-only); the hit target spans the full column height regardless of how thin
   a small contribution's bar is, so a $20K contraction is exactly as easy to select as a $1.35M one.
2. **Real table sort + filter** — `aria-sort`-driven column sorting (Account, Category, ARR impact,
   Last activity) plus a category `<select>` and a text search, both genuinely filtering the row set.
3. **Period/view toggle** — a segmented control (This Quarter / Last Quarter / Trailing 12 Months)
   swaps the waterfall's dataset, hero number and inline stats.
4. **Selection → multi-widget sync, split into pin vs. hover** — clicking a bridge bar is a *persistent
   pin* (visibly marked: a pin badge on the bar, a ring, an "Unpin" control in the spotlight panel) with
   **two independently-scoped consumers**: the accounts table seeds its own local filter state from the
   pin but stays freely editable afterward (a manual filter choice isn't stomped until the next pin
   changes), while the Category Spotlight panel ranks movers within that category and keeps its own
   "which mover is shown" cursor — a control the table has no equivalent of. Hovering/focusing a bar is
   fully ephemeral (tooltip only, local `hoveredId` state, touches nothing persistent, reverts on
   mouse-leave/blur).
5. **⌘K command palette** — real keyboard-driven (arrow keys, Enter, Escape), filters by typing, and
   its actions are wired to the same state as the rest of the page (jump to a section, pin a bridge
   step, clear the pin) rather than being a static decoration. Background content is marked `inert`
   while it's open.

**Typography/theme confirmation:** `font-sans` (Pretendard) everywhere except the hero ARR figure,
which is the only element using `--font-display-mono`. Exactly 3 rendered weights (400 default, 500
`font-medium`, 600 `font-semibold` — including on the hero number, so the display face doesn't add a
4th weight). Theme is pure white (`bg-white` canvas, `zinc-200` hairline borders, one subtle shadow
token) — no cream/paper backgrounds. Accent is **cyan** (an underused hue per this round's brief),
reserved for the brand/interactive accent; increase/decrease semantics in the chart and table use
emerald/rose independent of the brand accent, which is standard financial-dashboard convention. No
registration marks, crop marks or skeuomorphic chrome — polish comes from consistent card radius
(`rounded-xl`), hairline borders, and precise column alignment.

**Completeness vs. the Mercury/Asana/Coinbase bar:** all copy is real and deterministic (no
`Math.random`/`Date.now`), all totals reconcile by computation not hand-waving, the table fits its card
at desktop widths (`table-fixed` + `<colgroup>` %, `min-w` on the `<table>` element, mobile-only
`overflow-x-auto`), date/numeric cells are `whitespace-nowrap`, focus is a painted
`outline-2`/`outline-offset-2` everywhere, every icon-only control has an accessible name, and the
waterfall's hit targets were explicitly redesigned (full column height, not the data-proportional bar)
so small contributions stay ≥24px targets.

## 브리프에 없던 것

1. **제품 정체성 (이름/업종/핵심 지표)** — 브리프는 "가상의 B2B 제품"이라고만 명시. → **결정:** Ridgeline,
   SaaS 기업용 매출 운영(RevOps) 대시보드, 히어로 지표는 Ending ARR. → **근거:** 워터폴 차트가 브리프에서
   명시적으로 예시로 든 "revenue/cost bridge, P&L-style"과 가장 자연스럽게 맞물리는 업종이 구독형 SaaS의
   ARR 브릿지였음 (Recurly/ChartMogul/Baremetrics류 실제 제품군과 같은 카테고리, 다만 이름·비주얼은 독자
   설계).

2. **워터풀의 정확한 카테고리 구성 (몇 개 막대, 어떤 항목)** — 브리프는 "4–12 bars"라고만 규정. →
   **결정:** Starting → New business → Expansion → Contraction → Churn → Reactivation → Ending (7개). →
   **근거:** SaaS ARR 브릿지의 업계 표준 분해(로짓·ChartMogul 등이 쓰는 5가지 운동 유형)를 따름 — 자의적
   숫자가 아니라 관습적 분류.

3. **핀(pin) 상태의 "독립적으로 분리된 두 소비자"를 구체적으로 무엇으로 만들지** — 브리프는 패턴만
   요구("persistent pin"과 "ephemeral hover"를 분리하고, 2개 이상의 지속적 소비자는 독립적으로 스코프된
   상태를 가지라)했지 구체적 위젯을 지정하지 않음. → **결정:** 계정 테이블의 "필터"(리스트 관점)와
   스포트라이트 패널의 "무버 커서"(랭킹/단일 항목 관점)로 분리. → **근거:** 브리프가 강조한 "가장 강한
   형태 = 동일 선택의 서로 다른 측면에 대한 두 개의 독립적 반응"을 가장 명확하게 구현하는 조합이라고 판단.

4. **⌘K 팔레트의 구체적 액션 목록** — 브리프는 "stretch" 항목으로만 언급. → **결정:** 섹션 이동 2개 +
   브릿지 단계별 핀 고정 5개 + 핀 해제 1개, 총 8개 액션. → **근거:** 팔레트를 장식용 껍데기로 두지 않고
   페이지의 실제 상태(핀 고정)와 연결해 "죽은 컨트롤 없음" 요구를 팔레트에도 적용.

5. **좌측 사이드바의 나머지 내비게이션 항목(Invoices/Reports/Settings)의 동작** — 이 페이지 범위 밖의
   기능. → **결정:** 시각적으로만 존재하고 `href="#"` + `preventDefault`로 무동작(모바일에서는 드로어만
   닫음). → **근거:** 실제 SaaS 앱의 사이드바는 항상 현재 페이지 밖의 섹션도 노출하며, 이 라운드의 범위는
   "Revenue overview" 페이지 하나이므로 나머지는 셸(chrome)로만 존재하는 것이 합리적.
