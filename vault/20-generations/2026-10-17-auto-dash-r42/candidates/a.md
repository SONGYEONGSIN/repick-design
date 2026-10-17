# auto-dash-r42/a — Fathom

**Product/brand**: Fathom — an institutional crypto markets desk console for prop traders (OHLC candlestick trading terminal).

**One-line concept**: Fathom pairs a hot watchlist rail with a candlestick chart (5-period moving-average overlay) and a sortable, filterable trades table in the main pane, keeping order entry in an on-demand drawer instead of a permanently mounted third pane.

**Reassignment context**: this is `auto-dash-r41/a` retried per `reassign-queue.md` item #15. The two flagged root causes are both addressed directly in this build:
1. Every chart `<text>` label sets `fontSize` (and `fontWeight`) as an **SVG presentation attribute** (e.g. `fontSize="10"`), never via a CSS `style` prop, so labels scale correctly with the `viewBox` at every tested desktop width.
2. There is exactly **one** `<table>` element on the route (`trades-table.tsx`, actually imported and rendered from `page.tsx`) and **zero** other `overflow-x-*`-classed elements anywhere on the page — nothing else can collide with the gate's combined `table, [class*="overflow-x"]` index. No decorative unused second table was built. Its `<colgroup>` (Time 11% / Side 9% / Trader 25% / Price 17% / Size 15% / Value 23%, sums to 100) was sized against the card's full desktop width with wide margins for realistic content (prices up to "118,452.30"), and the table itself is full-width (`col-span-12`) rather than sharing a row with a second table, which removes most of the overflow risk outright.

## Interactions implemented
1. **Chart hover crosshair tooltip, keyboard-accessible** — each candle has a transparent, focusable (`tabIndex=0`, `role="button"`) hit-rect; `onMouseEnter`/`onFocus` show a tooltip with O/H/L/C, `onMouseLeave`/`onBlur` hide it, `Enter`/`Space` also select the candle.
2. **Real table sort + filter** — the trades table's Time/Price/Size/Value headers are sortable (`aria-sort`, click toggles asc/desc), and a segmented control filters by side (All/Buy/Sell); both reset to the natural order when the instrument changes.
3. **Period / view toggle** — 1D/1W/1M/1Y segmented control redraws the chart deterministically from seeded sine/cosine series.
4. **Selection syncing multiple widgets, with the pin/hover split** — clicking (or keyboard-activating) a watchlist row **pins** that instrument, which is the one thing that updates the chart, header stats and trades table. Hovering or keyboard-focusing a row only reveals a one-line OHLC preview inline under that row — it changes no other widget, and is explicitly suppressed when the hovered row is already the pinned one (the main pane already shows that instrument in full, so a duplicate preview would be redundant rather than an independent consequence).
5. **⌘K command palette** — opens via the search button or the global shortcut, filters instruments by symbol/name, Escape closes it, focus returns to the input on open.

The order-ticket drawer is the one nullable, on-demand "third pane": it does not exist in the DOM until the topbar's "New Order" button (which has a real `onClick`) opens it, and it resets its own state whenever it (re)opens or the underlying instrument changes.

## Font / typography confirmation
- Body copy, labels, numbers, table text: `--font-sans` (Pretendard) throughout, no exceptions.
- Display face: `--font-display-wide` used in exactly one place — the "Fathom" wordmark lockup in the sidebar (`text-lg`, headline/wordmark scale). No other element uses it, and no other display face is referenced.
- Exactly three rendered font weights on the route: `font-normal` (400), `font-medium` (500), `font-semibold` (600) — including the SVG chart text, which sets `fontWeight="400"`/`"600"` explicitly as presentation attributes rather than relying on any default. No `font-bold` anywhere.
- All numeric values use `tabular-nums`; labels are 11px uppercase with tracking.

## Completeness vs. the SaaS reference bar
- Full mandatory app shell: sidebar with brand lockup, workspace switcher (functional desk-switching dropdown), primary nav with active pill, watchlist rail, bottom user row; topbar with ⌘K search, a primary action button with a real `onClick` (opens the order drawer), notifications popover, avatar menu.
- Component system present: Card, sortable table with hover rows/status badges/avatar cells/`aria-sort`, tabs (order type), segmented control (period, side filter, order side), dropdown/popover (notifications, account menu, workspace switcher), badge (buy/sell, change), progress bar (order-flow split), sparkline (watchlist rows).
- Dark theme is genuinely product-dark: `zinc-950`/`zinc-900` surfaces, `white/10` borders, `zinc-50`/`zinc-400` text — no `zinc-500`/`600` dim text anywhere.
- Accent is `violet` throughout (nav active state, focus rings, MA overlay, selected-candle outline, primary button), contrast-checked against the project's actual installed Tailwind OKLCH values (not guessed): `violet-400` on `zinc-900`/`zinc-950` ≈ 6.2–7.0:1; `zinc-50` on `violet-600` ≈ 5.6:1 (hover `violet-700` ≈ 7.0:1); `zinc-50` on `emerald-700` ≈ 5.1:1 (the buy-submit button uses `emerald-700`, not `600`, specifically because `emerald-600` with `zinc-50` text only reaches ≈3.5:1); `rose-600` with `zinc-50` text ≈ 5.8:1.
- Single `<h1>` (instrument symbol/name in the page header), semantic table with caption/scope/`aria-sort`, skip link to `#main-content`, full keyboard reachability, `focus-visible:outline-2 outline-offset-2 outline-violet-400` with no preceding `outline-none` and no bare `ring` anywhere.
- The header's "New Order" button's visible label is wrapped in `sr-only sm:not-sr-only` (not a competing custom `aria-label`) specifically because this exact pattern — a hidden-at-small-breakpoint visible label plus a separate `aria-label` — was the known defect in two prior-round candidates.
- No `Math.random`/`Date.now`/bare `new Date()` anywhere; all series come from seeded sine/cosine functions; compact volume formatting is a hand-written divide/round/strip formatter (not `Intl` compact notation) to avoid SSR/client ICU disagreement.

## 브리프에 없던 것

1. ① 워치리스트의 "호버 미리보기"를 정확히 어떻게 구현할지(팝오버 vs 인라인) 브리프는 지정하지 않았다. ② 행의 버튼 바로 아래 한 줄짜리 인라인 텍스트로 구현했다(절대위치 팝오버 아님). ③ 절대위치 팝오버는 레일의 좁은 폭에서 잘림/오버플로 위험이 있고, 인라인 확장은 이미 `overflow-y-auto`인 레일 안에서 안전하게 흐름에 참여한다 — 추가 포지셔닝 로직이 전혀 필요 없다.

2. ① 두 번째(과거 OHLC 히스토리) 테이블을 만들지 여부는 브리프가 명시하지 않았다(원 배정문은 "만들면 반드시 렌더하라"고만 했다). ② 만들지 않기로 결정했다 — 거래 테이블 하나만 유지. ③ 배정문의 근본 원인이 "페이지에 실존하는 테이블이 1개뿐인데 오케스트레이터가 다른 파일을 지목"한 오진단이었으므로, 애초에 테이블을 1개만 두면 그 종류의 오진단이 구조적으로 재발할 수 없다.

3. ① "Trader" 칼럼의 실제 이름 데이터(브리프는 "Trader 또는 유사"라고만 함)는 직접 발명해야 했다. ② Alex Mercer, Priya Nair 등 8명의 가상 데스크 트레이더 이름을 결정적 시드로 배정했다. ③ 실제 프로덕션 트레이딩 데스크의 거래 상대/트레이더 명부와 유사한 현실감을 주되, 영어 전용 요구를 지키기 위해 비영어 이름은 피했다.

4. ① 데스크톱 테이블의 정확한 칼럼 퍼센트 배분(브리프는 "합이 100이고 콘텐츠에 맞을 것"만 요구)은 직접 계산해야 했다. ② Time 11 / Side 9 / Trader 25 / Price 17 / Size 15 / Value 23로 배정했다. ③ 1264px에서 사이드바·패딩을 뺀 실제 가용폭(~928px)을 역산해 각 칼럼의 최대 콘텐츠 폭(9자리 가격 등)에 2배 이상 여유를 두도록 산출했다 — 임의가 아니라 역산 결과다.

5. ① 사이드바의 "Workspace switcher" 버튼에 실제 onClick을 달지(브리프는 헤더의 주요 액션 버튼만 명시했다)는 브리프가 요구하지 않았다. ② 작은 2개 데스크 드롭다운으로 실제 동작하게 만들었다. ③ v2-failure 교훈("장식적 크롬 금지")과 일관되게, 시각적으로 존재하는 모든 버튼은 장식이 아니라 실제 동작을 갖는 쪽을 택했다 — 과잉이 아니라 안전한 기본값.
