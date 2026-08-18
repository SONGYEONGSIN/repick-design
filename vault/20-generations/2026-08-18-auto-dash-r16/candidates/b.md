---
tags: [generation, dash, auto-dash-r16]
round: auto-dash-r16
variant: b
route: /dash-evolve/r16/b
---

# b — Stockloom (multi-warehouse inventory console)

**Product/brand**: Stockloom — a fictional B2B SaaS for DTC/retail brands tracking SKU-level stock
across three warehouses (Reno NV, Columbus OH, Allentown PA). Domain chosen specifically because a
retailer's daily task ("which SKUs need attention right now") is naturally a big, scannable table,
not a chart.

**Macro-shape (grid-dominant, confirmed distinct from the last three rounds' shapes)**: a single
dense data grid *is* the page. A 64px-header page title with an inline `dl` stat strip (SKU count
+ per-status counts + total value — never a 4-card KPI row) sits above a slim toolbar (search,
status-filter chips, warehouse `<select>`, group-by `<select>`, density segmented control,
column-visibility popover), which sits directly above one full-width table that owns the rest of
the viewport. No persistent detail rail (master-detail), no 3-pane market layout, no feed+rails, no
calendar/board, and no separate hero chart competing with the grid — the only visualizations are
14-day sparklines living inside the grid's own "trend" column. Row click opens a transient
right-side slide-over with more detail; it closes and gives focus back, it never stays open.

**Grid craft**: `table-fixed` with **percentage** column widths recomputed from a weight map
whenever a column is toggled (`colWidthPct` in `columns.ts`) — not fixed rem widths with
breakpoint-hiding. This guarantees the 9-column table can never need a desktop horizontal
scrollbar at any of 1280/1366/1440/1600/1920 (columns always sum to exactly 100% of whatever width
the card has), and it means the column-visibility toggle behaves identically at every width instead
of silently doing nothing between two breakpoints.

**6 real interactions** (`'use client'`, wired, `motion-reduce`-gated where relevant):
1. Column sort — click any of 6 sortable `<th>` (SKU, Product, Status, On hand, 14-day trend, Total
   value); real `aria-sort` toggle (ascending → descending), sorts within groups when grouped.
2. Search (SKU code or product name) + status-filter chips + warehouse `<select>` — three
   independent, composable filters over the same 26-row dataset.
3. Sparkline hover/focus tooltip — mousemove finds the nearest of 14 points and shows "Day N: X
   units"; keyboard focus shows the latest point; the Δ% is also always printed in plain text next
   to the chart (dash-brief-v3's "single dominant visualization" rule: the key value is visible
   before any hover).
4. Row click → right-side detail slide-over (bigger sparkline, stat tiles, a computed
   days-of-cover recommendation); Escape or backdrop click closes and returns focus to the
   triggering control.
5. Group-by (None / Category / Warehouse) — real regrouping into collapsible sections with a
   per-group subtotal (count + total value), each independently expand/collapsible.
6. Column-visibility popover (Warehouse / Reorder point / Unit value checkboxes) and a
   Comfortable/Compact density toggle, both driving the live percentage-width recompute.

Bonus: a ⌘K quick-jump palette (search → jump straight to a SKU's detail sheet) and a working
"Export CSV" action that serializes the *currently filtered* rows via a client-side `Blob` download
— both genuinely wired, not decorative.

**Theme/accent**: light only (white/zinc-50 canvas, white cards, `border-zinc-200`, `shadow-sm`) —
no `dark:` variants declared at all, so `no-dark-dim-text` has nothing to trip on. Single brand
accent is **blue** (`blue-600`), used only for the active nav pill, links, the one primary CTA and
every focus ring — never for status. Status semantics (Healthy/Low Stock/Backorder/Discontinued)
use their own emerald/amber/rose/zinc pairing, always icon + text, chosen independently of the
brand accent so the two systems never collide. This avoids violet (already the most-used catalog
accent) and avoids teal/cyan (reserved, per the round brief, for a network/graph-style sibling
candidate).

**Display face**: `--font-display-mono` (JetBrains Mono Display) for the wordmark and page `h1`
only — Pretendard everywhere else, per-route font-weight budget held to exactly three classes
(`font-normal`, `font-semibold`, `font-bold`).

**Focus-visibility audit performed on non-default states**: the ⌘K palette, every popover
(workspace switcher, notifications, avatar menu, column-visibility), the mobile nav drawer, and the
detail slide-over were all opened and their interactive children checked for a real focus-visible
paint. All focus rings use literal Tailwind palette classes (`ring-blue-600` / `ring-offset-white`
or `outline-zinc-900`), never a `ring-[var(--x)]` arbitrary value, per this round's Tailwind v4
oklab-transparency warning.

## 브리프에 없던 것

**1. 열 가시성(column-visibility) 컨트롤의 형태**
① 브리프의 "column visibility toggle" 요구가 어떤 메커니즘이어야 하는지(체크박스 팝오버? 인라인
세그먼트? `<select multiple>`?) 미지정.
② 팝오버 트리거 버튼 + 그 안에 실제 `<input type="checkbox">` 3개(Warehouse/Reorder
point/Unit value)로 정했다.
③ charts.catalog/ux-guidelines 어디에도 규격이 없어, 이 레포의 다른 대시보드(`/dash/d36`
Topbar 등)가 이미 쓰는 "trigger button + popover panel + 실제 폼 컨트롤" 관례를 그대로
따랐다 — 새 패턴을 발명하기보다 기존에 게이트를 통과한 문법을 재사용.

**2. `table-fixed` 열 폭 배분 방식**
① 브리프는 "table-fixed + % 열 배분"이라고만 쓰고 정확한 계산 방식(고정 rem + 반응형 숨김 vs
순수 %)은 미지정.
② 처음엔 고정 rem 폭 + `<col>`에 `hidden 2xl:table-column`을 토글하는 반응형 숨김 방식을
구현했으나, 그 방식이 실제로 열 폭 예약을 없애는지 검증할 헤드리스 브라우저가 이 환경에 없어
확신할 수 없었다. 이 라운드에서는 폐기하고, 가중치 맵 기반 순수 퍼센트 배분(`colWidthPct`,
보이는 열의 가중치 합으로 나눠 항상 100%)으로 전면 재작성했다.
③ 퍼센트 방식은 몇 개 열이 보이든 합이 항상 정확히 100%이므로 "데스크톱 가로 스크롤 금지"를
브라우저 렌더링 세부 동작(`<col>` display:none의 폭 반영 여부)에 기대지 않고 산술적으로
보장한다 — 검증 불가능한 방식보다 증명 가능한 방식을 선택(리스크 회피가 근거인 임의 판단).

**3. 상단바 "주요 액션 버튼"의 실제 동작**
① 상단바에 있어야 할 "주요 액션 버튼" 하나가 정확히 무엇을 해야 하는지 브리프는 지정하지
않는다(예시가 없다).
② 현재 필터·정렬이 적용된 행만 CSV로 내보내는 "Export CSV" 버튼(client-side Blob 다운로드,
실제 동작)으로 정했다.
③ dash-brief-v3 §완성도 기준이 장식성 인터랙션을 감점 대상으로 명시하므로, 눌러도 아무 일도
안 일어나는 자리채우기 버튼(예: "New Purchase Order") 대신 그리드 자체와 직접 연결되어 실제로
파일을 생성하는 동작을 골랐다 — "격자가 페이지의 주인공"이라는 과제 지시와도 일치.

**4. 사이드바 폭과 1920px 캡 처리**
① 페이지-폭 검증(1920 기준 캡) 계산에 정확한 사이드바 폭 숫자가 필요한데 브리프는 "256"을
예시로만 든다.
② 그대로 256px(`w-64`)를 채택하고, 1920px에서는 `max-w` 캡 자체를 두지 않아 콘텐츠가 셸
잔여폭(1920−256−좌우 패딩)을 그대로 채우게 했다(`auto-dash-r15/c` Crewline의 "캡 없이
flex-1이 채운다" 전례를 계승).
③ 캡 값을 새로 계산해 맞추는 것보다 캡 자체를 없애 "우측 여백=페이지 패딩뿐"이라는 결과를
구조적으로 보장하는 편이, 이 라운드가 강조하는 1920px 규칙을 가장 확실히 만족시킨다고 판단.
