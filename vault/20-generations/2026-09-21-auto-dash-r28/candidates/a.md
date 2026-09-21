# Candidate a — Openhour

Openhour is a capacity & scheduling intelligence dashboard for multi-location service businesses (invented client: BrightPath Dental Group, three locations — Downtown, Parkside, Lakeside). The page is calendar-board-centric: a full month grid is the largest, most central element, and every open-day cell is a heatmap swatch encoding a real, generative quantity — booked-capacity %, revenue booked, or SLA risk score, switchable via a metric segmented control — via a six-step orange intensity ramp (each bucket independently AA-contrast-checked against `zinc-900` text). Supporting the calendar: a Day Detail rail (stats, capacity progress bar, staffing coverage, per-location breakdown), a Pinned Days comparison strip, a 30-day trend sparkline, and a sortable/filterable Appointments table for the selected day. Data is generated with a seeded integer LCG keyed off each date's ordinal day count (no `Math.random`/`Date.now`/argument-less `new Date()`); every appointment is generated first and all aggregates (revenue, counts, location/staffing breakdowns) are derived from that list, so subtotals reconcile to totals by construction.

**Interactions implemented (6, all real `'use client'` state, deterministic):**
1. Calendar cell hover/keyboard-focus → ephemeral crosshair-style tooltip (cell `aria-label`) plus an ephemeral "Previewing…" banner in the Day Detail rail that reverts completely on mouse-leave/blur — touches no persistent state.
2. Calendar cell click → persistent `selectedDate`, driving the Day Detail rail and the Appointments table (real data change, not decorative). Arrow-key roving-tabindex navigation across the grid.
3. Metric segmented control (Booked / Revenue / Risk) → recolors every calendar cell live; plus month prev/next navigation (Aug/Sep/Oct 2026) and an "At-risk only" dimming filter.
4. Pin action, split from selection per the catalog pattern: an explicit "Pin day" button in the Day Detail rail adds the *currently selected* day to an independently-scoped `pinnedDates` array (max 3, visibly marked with a Pin glyph on the calendar cell itself), completely separate from the ephemeral hover preview and from `selectedDate` — two independently-scoped, persistent consumers of the same calendar (Day Detail vs. Pinned strip) rather than one shared id threaded through both.
5. Appointments table: real column sort (`aria-sort`, all 8 columns) and a status filter chip row (All/Confirmed/Completed/Cancelled/No-show with live counts).
6. Keyboard-accessible hover crosshair tooltip on the 30-day trend SVG chart (mouse move or arrow-key stepping, `aria-live` announced) — plus a ⌘K command palette (search/filter, arrow-key + Enter) wired to real actions (jump to today, switch metric, toggle risk-only), and a working CSV export of the selected day's appointments via Blob download.

**Typography:** Body/Korean-safe text is `font-sans` (Pretendard) everywhere. `--font-display-wide` (Archivo) is the single display face used, restricted to the wordmark, the page `h1`, and the four KPI tile numbers — always at `font-bold`. Exactly three rendered weights total: `font-normal` (400), `font-medium` (500), `font-bold` (700) — audited by grep across every file.

**Theme/accent:** Pure-white-base light theme (`bg-white` canvas, `zinc-50` sidebar, `zinc-200` hairlines, `shadow-sm` only) — no cream/sepia. Single accent: orange (`orange-50`–`orange-700`), used for the heatmap ramp, active nav pill, primary Export button, and focus outline; every other surface is zinc/white/black. Secondary text uses `zinc-500` on white/near-white and `zinc-600` on tinted pill/segment surfaces per the stated floors (verified by manual contrast calculation, not eyeballed — e.g. `zinc-500`/white ≈ 4.83:1, `zinc-900`/`orange-500` cell ≈ 6.26:1).

**Completeness vs. the Mercury/Asana/Coinbase bar:** real computed data with reconciling subtotals (no placeholder numbers), a working table (sort/filter/CSV export), a full keyboard story (roving-tabindex calendar, arrow-key chart crosshair, command palette, Escape/outside-click on all popovers), a skip-link, single `h1` with no heading-level skips, semantic `<table>` with `<caption>`/`scope`/`aria-sort`, and no dead controls — every visible affordance (nav aside, which is inert wayfinding chrome as is conventional for a single-route dashboard) does something.

**Known pitfall avoidance (explicit):** the initials avatar is `zinc-900` background with white text (~14.9:1, far above AA) — not a low-contrast pastel badge. The account-menu button's visible name ("Ava Morrow") is rendered via `sr-only sm:not-sr-only` (present in the DOM, screen-reader-only below `sm`) rather than `hidden sm:inline` + a diverging `aria-label`, so the accessible name always equals the visible content at every breakpoint — no `label-content-name-mismatch`.

## 브리프에 없던 것

① 캘린더가 여러 달을 오갈 때 인접 달(패딩 셀)에 필요한 날짜 데이터의 범위를 얼마나 생성해둘지가 브리프에 없었음. ② 7월~11월(2026) 전체를 미리 생성해 8·9·10월 그리드의 리딩/트레일링 패딩을 항상 커버하도록 정함. ③ Next.js/React의 결정론적 `Date` 산술(명시적 인자만 사용)로 요일 계산을 구현하는 편이 별도 Zeller's congruence 구현보다 단순하고 검증하기 쉬워서.

① "히트맵이 실제 수량을 인코딩해야 한다"는 요구를 만족할 구체적 지표(무엇을 셀 색상에 매핑할지)가 정해져 있지 않았음. ② 예약 가능 용량(%) / 예약 매출($) / SLA 리스크 점수(0-100) 세 가지를 스위처로 전환 가능하게 함. ③ 치과 체인이라는 가상 제품에 자연스럽고, 캘린더-보드형 대시보드의 대표 사례(용량 계획)와 부합.

① pin과 hover를 분리하라는 지침은 있었지만 pin의 정확한 트리거 위치(셀 자체 vs 디테일 패널)는 정해져 있지 않았음. ② Day Detail 패널에 명시적 "Pin day" 버튼을 두고, 캘린더 셀에는 핀 상태를 나타내는 작은 아이콘만 표시(클릭 불가)하도록 함. ③ 셀마다 별도의 핀 버튼을 두면 42개의 추가 인터랙티브 요소가 생겨 target-size/명료성에 부담이 되고, "명시적 클릭으로 범위가 정해진 하위집합을 갱신"한다는 지침에 디테일 패널 쪽이 더 부합.

① 3개 파일(초안 없음)로 구성된 커맨드 팔레트의 커맨드 목록 구체적 항목이 없었음. ② "오늘로 이동", 지표 3종 전환, 리스크 전용 필터 토글의 5개 실동작 커맨드로 구성(데드 컨트롤 방지 규칙에 따라 모두 실제 동작 연결). ③ 브리프가 "죽은 컨트롤 금지"를 명시했으므로, ⌘K를 넣는다면 모든 항목이 실제 상태를 바꿔야 한다고 판단.

① Export 기본 액션의 형식이 정해져 있지 않았음. ② 선택된 날짜의 예약 목록을 CSV로 클라이언트 사이드 Blob 다운로드. ③ 서버 없는 정적 페이지에서 실제로 동작하는 유일한 "내보내기" 구현이며, B2B 예약/운영 도구에서 흔한 관례.
