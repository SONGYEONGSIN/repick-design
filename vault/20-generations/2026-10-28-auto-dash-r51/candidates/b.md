# Candidate b — Clearbid (Programmatic Ad-Exchange Yield Intelligence)

**Product**: Clearbid — a fictional B2B SaaS (Mercury/Monarch tier of polish) that ad-ops teams use to
monitor real-time bidding health across the programmatic ad exchanges they resell inventory to (10
fictional exchanges spanning Display, CTV, Video, PMP, Mobile, Native, Audio, DOOH and Retail-media
supply). Route: `/dash-evolve/r51/b`.

**Macro layout — genuine 3-pane trading-terminal**: app shell sidebar (brand lockup "Clearbid", desk
switcher, 4-item nav, bottom user menu) + topbar, then **four horizontal regions on wide desktop**: the
app-shell sidebar (`w-60`), a narrow **watchlist rail** (`w-64`, the "Following" list — a curated subset
of 6 of the 10 exchanges, each row with a 24h sparkline, current CPM and status), a **center column**
holding the single dominant visualization plus a full directory table beneath it, and a **right detail/
feed pane** (`w-72`, pinned by selection). This is structurally real, not a 2-pane rail+detail reskin: the
center pane's own dominant chart is a market-wide index that is deliberately *not* the selected entity's
data (see the selection-scope section below) — the rail, chart and detail pane are three independently
meaningful panes, exactly the market/trading-terminal shape the brief asked for.

**Dominant visualization — the market chart**: a hand-generated SVG line chart of the **market CPM
index** (the mean of all 10 exchanges' CPM at each tick — derived via `reduce`/`average` in `data.ts`,
never a separately hand-typed series, so it always reconciles with the per-exchange numbers in the table
below it) against a flat dashed **target-floor** reference line (`TARGET_CPM`, the ops team's contracted
CPM commitment). The two lines are differentiated by line style, not just color (solid vs. `stroke-
dasharray`), with a line-style swatch (not a color dot) in the legend. A persistent legend row above the
chart shows four always-visible values — current market avg CPM, the flat target, the live delta between
them (direction via an arrow icon + color + text, never color alone), and the period's high/low — none of
which depend on hover. A `24H / 7D / 30D` segmented-control period toggle recomputes the chart, legend and
the chart's own accessible data-table fallback together from `MARKET_SERIES[period]`.

**Interactions (5 implemented, brief requires 4+, all `'use client'`, deterministic)**:
1. **Chart hover/keyboard crosshair** — moving the mouse over the SVG, or operating a real `<input
   type="range">` "Inspect" scrubber beneath it (native keyboard support: arrows/Home/End/Page keys),
   drives a purely local `hoverIndex` state inside `MarketChart`. It paints a crosshair line + dot and an
   `aria-live="polite"` tooltip with the exact period label and both line values. This state is **never
   read by anything outside `MarketChart`** — it does not touch the watchlist selection or the detail pane.
2. **Real table sort + filter** — `ExchangeTable`'s five column headers are real `<button>`s with correct
   `aria-sort`, toggling direction on repeat clicks; a status segmented control (All/Healthy/Degraded/At
   risk) and a type dropdown/popover filter narrow the 10-row directory independently of sort.
3. **Period toggle** — `24H/7D/30D` segmented control, described above.
4. **Watchlist/table selection → scoped pin, deliberately split from (1)** — clicking a rail row or a
   table row sets the page's one persistent `selectedId`. That selection pins **only** `DetailPane`
   (profile header, win/fill-rate bars, latency/bids stats, a live-feed tab) — it never recomputes the
   market chart, its legend, or the directory table's values. Combined with (1) being a wholly separate,
   ephemeral, locally-scoped mechanism that never writes to `selectedId`, this is two independently-scoped
   selection mechanisms living in different widgets, neither resetting or touching the other — the
   strongest tier this catalog's brief documents, rather than one shared id threaded into every widget.
5. **⌘K command palette** (bonus) — substring search over all 10 exchanges by name/type/region; jumping
   sets `selectedId` (same narrow pin as #4, not a separate mechanism).

A sixth, genuinely functional (non-decorative) action: the topbar's primary button is a real "Add to
watchlist" dropdown/popover listing exchanges not currently followed; picking one appends it to
`followingIds` state and pins it, so the rail is actually editable rather than a static prop.

**Typography/font**: `--font-display-wide` for the "Clearbid" wordmark only (sidebar brand lockup and
mobile drawer), inherited `--font-sans` (Pretendard) for every other character on the page, including
every number. Exactly three rendered weights throughout the folder — `font-normal` (400), `font-medium`
(500), `font-semibold` (600) — with every element a browser would otherwise default to bold (`h1`–`h3`,
`<th>`) given one of the three explicitly, confirmed by grep (`font-light`/`font-bold`/`font-extrabold`:
zero occurrences). All data numbers use `tabular-nums` and `Intl.NumberFormat`/`Intl` currency formatting.

**Theme**: true light — `zinc-50` canvas, `white` cards, `zinc-200` hairlines, no cream/paper tint
anywhere. Single accent **sky**, verified against white: `sky-600` (~4.1:1) is used only for non-text
graphics (the chart line, decorative icons, the active-state border, the range-input thumb) which only
need the 3:1 UI-component floor; anywhere sky sits as actual *text on a sky fill* (the "C" brand mark, the
"Add to watchlist" button), it is bumped to `sky-700` (~5.9:1 white-on-fill) to clear the 4.5:1 text floor
instead of guessing. Status semantics (healthy/degraded/at-risk) stay on the standard emerald/amber/red
ramp, kept separate from the single sky accent. Every caption/label on a tinted surface (the segmented-
control track, status badges) is `zinc-600` or darker per the brief's stated AA floor; `zinc-500` is used
only on near-white/white surfaces.

**Accessibility specifics**: single `h1` — placed as a visually-hidden (`sr-only`) heading in the topbar
("Clearbid — market overview") specifically so it precedes every `h2` in DOM order (the watchlist rail's
"Following" heading renders before the center column in source order even though it reads second
visually; keeping the market chart's own title as an `h1` would have put an `h2` before the page's `h1`
in document order). From there: `h2` × 4 (Following / Market overview / Exchange directory / the selected
exchange's name in the detail pane), `h3` × 2 nested under the detail-pane `h2` (one visible, one
`sr-only` for the feed tab) — no skipped levels. `DetailPane`'s two tabs are real ARIA tabs with
`role="tablist"/"tab"/"tabpanel"`, matching `id`/`aria-controls`/`aria-labelledby` pairs, and `tabIndex`
management (-1 on the inactive tab). Every table is `table-fixed` with a `<colgroup>` of percentage widths
— no `min-w-[Npx]` + `overflow-x-auto` table anywhere, and the page never has two independent horizontal-
scroll containers at once (only vertical `overflow-y-auto` is used, inside the rail list, the directory
table body, the detail-pane tab panels, and the chart's own collapsible fallback table). Focus rings use
the plain `outline`-on-`:focus-visible` pattern (`outline-sky-600`, never `ring`/`ring-offset`, never a
cancelling `outline-none`) on every interactive element, including inside the ⌘K palette and the two
popovers (notifications, avatar menu, add-to-watchlist, type-filter), all of which close on outside-click
or Escape via a shared `useOutsideClose` hook. No images are used anywhere (avatars are initials-in-circle
text, not `<img>`), so the `next/image` rule has nothing to violate.

**1920px cap**: no page-level `max-w` at all. Sidebar (`w-60`=240px) + rail (`w-64`=256px) + detail pane
(`w-72`=288px plus `p-3`=12px padding each side) are fixed-width; the center column is `flex-1 min-w-0`
and the chart/table genuinely stretch to fill whatever space is left, so there is no capped gap to measure
— the rule is satisfied by not imposing a cap rather than by computing one.

**Files**: `app/src/app/dash-evolve/r51/b/{page.tsx, data.ts, ui.tsx, Nav.tsx, Sidebar.tsx,
MobileDrawer.tsx, Topbar.tsx, WatchlistRail.tsx, MarketChart.tsx, ExchangeTable.tsx, DetailPane.tsx,
CommandPalette.tsx}`.

## 브리프에 없던 것

1. **무엇을 정해야 했나**: "시계열에 쓸 날짜/시간 레이블을 어떻게 만드는가" — 하드 룰이 `new Date()`를
   (bare 형태든 아니든) 전면 금지한다고 읽힐 수 있어서, 고정 타임스탬프를 넘긴 `new Date(2026, 0, 1)` 같은
   "안전한" 변형조차 쓸지 애매했다.
   **무엇으로 정했나**: `Date` 객체를 이 폴더 전체에서 완전히 배제하고, `"00:00"`, `"Day 1"`, `"Mon"` 같은
   순수 문자열 배열을 루프로 생성했다(`PERIOD_AXIS`).
   **왜**: 브리프 문구가 "bare `new Date()`"만 명시했지만, 모호함이 남는 순간 가장 안전한 해석(완전 배제)을
   택하는 편이 하드게이트 리스크를 0으로 만들며, 실제로 날짜 객체의 어떤 기능(타임존 변환 등)도 필요하지
   않았다 — 일반적인 "애매하면 더 보수적인 쪽" 원칙.

2. **무엇을 정해야 했나**: 중앙 차트의 "always-visible legend"와 대비되는 두 번째 시계열을 무엇으로 할지.
   브리프는 멀티시리즈 차트에 "색상만으로 구분하지 말 것"만 요구했지, 두 번째 시리즈가 무엇이어야 하는지는
   정하지 않았다. 실제 "전일 동시간대" 비교선을 만들려면 데이터를 두 배로 늘려야 했다.
   **무엇으로 정했나**: 두 번째 선을 "타깃 CPM 플로어"라는 고정 수평 기준선(실제 시계열이 아님)으로 삼았다.
   **왜**: 실존 SaaS 대시보드에서 "실측 vs. 목표/SLA"는 매우 흔한 패턴이고, 가짜 "전일 비교" 배열을 따로
   합성해 데이터를 부풀리는 것보다 더 적은 데이터로 더 명확한 서사(현재 시장이 약정 플로어 위/아래에 있는가)를
   준다 — 자료 합계/일관성 규칙을 지키기도 더 쉽다.

3. **무엇을 정해야 했나**: 워치리스트 레일(following, 6개)과 하단 Exchange directory 테이블(전체 10개)의
   관계 — 브리프는 레일이 "엔티티의 스크롤 가능한 목록"이라고만 했지, 레일과 테이블이 같은 목록이어야 하는지
   말하지 않았다.
   **무엇으로 정했나**: 레일을 "팔로우 중인" 부분집합으로, 테이블을 "전체 디렉터리"로 분리하고, 토프바에
   실제로 동작하는 "Add to watchlist" 드롭다운을 둬서 둘의 관계를 설명 가능하게 만들었다.
   **왜**: 실제 트레이딩 터미널(워치리스트 vs. 전체 마켓)의 일반적인 관례이고, 두 위젯이 완전히 같은 목록을
   중복 표시하는 것보다 더 많은 "진짜 기능"(워치리스트 편집) 표면을 제공한다.

4. **무엇을 정해야 했나**: 선택(selection)이 디테일 패널만 좁게 갱신해야 한다는 요구와, 레일/테이블 둘 다
   "현재 선택된 행"을 시각적으로 표시해야 자연스럽다는 UX 요구가 서로 긴장 관계에 있었다 — 행 하이라이트가
   "선택이 여러 위젯에 영향을 준다"는 금지 패턴처럼 보일 수 있었다.
   **무엇으로 정했나**: 하이라이트(active 배경/`aria-current`)는 허용하되, 그 선택이 레일/테이블 자체의
   **수치**(상태·CPM·승률 등)를 재계산하지는 않는다는 선을 분명히 했다 — 금지된 패턴은 "값의 재계산"이고,
   "지금 무엇이 선택돼 있는지 보여주는 스타일링"은 다른 문제라고 해석했다.
   **왜**: 브리프의 금지 예시("단일 빌더 함수가 헤드라인+차트+통계+테이블의 *값*을 재계산")는 명시적으로
   데이터 재계산을 가리키고 있고, 선택 상태를 전혀 반영하지 않는 레일/테이블은 오히려 사용자가 방향을 잃게
   만드는 나쁜 UX이므로, 값과 스타일을 구분하는 것이 더 합리적인 절충이라고 판단했다.
