# auto-dash-r14 / candidate a — Harborline

**Product**: Harborline, a B2B support-ticket console (fictional; workspace "Fernbridge Data", a
data-integration platform whose support team triages inbound customer tickets). Route:
`/dash-evolve/r14/a`.

**Structure**: Master-detail, two zones only. Left rail (fixed 380px) is a scrollable, searchable,
filterable, sortable ticket queue with per-row priority/status badges, SLA countdown, assignee
avatar, and channel. Right pane replaces its full content on selection: ticket header (priority,
status, channel, SLA badge) → the dominant SLA/response trend chart → a conversation thread → a
customer-overview `dl` + sortable "other tickets from this account" table. No third pane, no
hero-chart row above the rail (compact inline stats live inside the rail's own header, not a
page-spanning hero band).

**Interactions implemented (6, all real `'use client'` state, `motion-reduce`-gated)**:
1. Crosshair tooltip on the SLA trend chart — hover *or* keyboard focus on any of the (≥24×24px)
   per-week point buttons shows a crosshair + value tooltip; ArrowLeft/ArrowRight jump between
   points, Tab reaches every point in order.
2. Real sortable + filterable ticket rail — text search (id/subject/account), status segmented
   control with live counts, and a priority/SLA-remaining/recently-opened sort menu, all derived
   from `.filter()/.sort()` over the same array (no separate hand-typed totals to drift).
3. Real sortable data table — "Other tickets from this account" (`aria-sort`, `table-fixed` +
   `colgroup` %, no desktop horizontal scroll).
4. Period/view toggle — 8-week / 20-week segmented control governing the chart.
5. Selection → multi-widget sync — picking a ticket (from the rail, the command palette, or the
   related-tickets table) swaps the ticket header, the SLA chart's underlying account, the
   conversation thread, the customer `dl`, and the related-tickets table together.
6. ⌘K command palette — fuzzy-matches tickets and customers, jumps to a ticket or filters the
   queue by account.

**Dominant visualization**: an area/line chart (charts.catalog "Trend Over Time" row) of the
selected ticket's account — weekly SLA-compliance % and average first-response time. Key values
are always-visible text, never hover-only: two headline stat blocks (avg compliance %, avg first
response, each with a trend pill) sit above the chart regardless of interaction, and the latest
point on the line carries a permanent numeral label. Hover/focus only adds a *supplementary*
per-week crosshair readout — removing all interaction still leaves the chart fully legible
at-a-glance, per the repeatedly-reproduced L3 delta on this exact failure mode (r7/r9/r10).

**Typography discipline**: exactly 3 rendered weights — 400 (unstyled/inherited default, verified
`th` elements always carry an explicit `font-medium` override so they don't fall back to the
browser's UA-bold), 500 (`font-medium`, all UI chrome/labels/badges), 600 (`font-semibold`,
headings and emphasis numbers). `--font-display-wide` (Archivo Display) is used only on the
sidebar wordmark and the rail's `<h1>` — never on body text, Korean, or the tabular numerals.

**Accent/theme confirmation**: light-only, pure white/zinc-50 canvas (no cream/paper), single UI
accent teal-600 (buttons, focus outlines, selected rail row, chart line, active nav pill). Rose is
used only for the pre-existing semantic "urgent priority / breached SLA" tone, matching the same
dual-purpose convention already shipped in `/dash/d40` (accent indigo, `TONE.bad` still rose) —
never as UI chrome. Focus-visible uses `focus-visible:outline` + `outline-2` + `outline-offset-2`
with no preceding `outline-none` anywhere (verified there is no v3 `ring`+`ring-offset` idiom in
the route), plus `focus-within:outline` on the one wrapper-highlighted control (the command
palette's search row, where the `<input>` itself keeps `outline-none` because the *wrapper* is the
visible signal).

**Commercial-polish bar**: the app-shell (sidebar + workspace switcher + 44px-tall header controls,
each individually 44px, not just the bar) follows the same Linear/Superhuman reference the brief
names. Verified against the repo's own gates rather than by inspection alone: `dash-static-check`
0 violations across all 12 files, `tsc --noEmit` and `eslint` clean, `dash-sweep` (1280/1366/1440/
1536/1680/1920 + 16px-slack variants + 390 mobile) passes with zero page- or table-overflow and
zero focus-visible regressions, and a full Lighthouse accessibility pass scored 98/100 with a
`<main>` landmark added for the one non-hard-fail miss.

## 브리프에 없던 것

- **① 무엇을 결정했나**: aside 컬럼(고객 정보 + 관련 티켓 테이블)의 폭 배분 방식.
  **② 무엇으로 결정**: `xl:grid-cols-12`의 리터럴 4/12 비율 대신
  `grid-template-columns: minmax(0,1fr) minmax(300px,340px)`로, aside에 하한(300px)을 못 박고
  main만 계속 줄어들게 했다.
  **③ 근거**: 처음엔 문자 그대로 12-col 4/12를 썼는데, 1280~1366px 구간에서 실측
  `dash-sweep`이 `table-overflow`(최대 17px)를 잡아냈다 — aside가 좁아지면서 "Other tickets"
  테이블의 뱃지(`Escalated` 등 9자)가 셀 폭보다 넓어져 `table-fixed`인데도 테이블 자체가
  scrollWidth를 넘겼다. `curation-criteria`의 "12-col 비대칭 재해석"(리터럴 비율이 아니라
  콘텐츠 밀도 비대칭이 유효)을 근거로 리터럴 fraction을 버리고 하한을 보장하는 쪽을 택했고,
  동시에 테이블 자체도 4열→3열로 줄여(Priority를 점+sr-only로 대체) 재발을 막았다.

- **① 무엇을 결정했나**: 마스터-디테일에서 모바일(390px)의 두 존을 어떻게 공존시킬지 — 배정
  브리프는 "레일+상세 두 존"만 명시하고 모바일 동작은 침묵.
  **② 무엇으로 결정**: 둘 다 DOM에 항상 존재시키되, `mobileDetailOpen` 상태로 `hidden`
  클래스를 토글해 390px에서는 한 번에 하나만 보이게(리스트→상세 전환+"Back to queue" 버튼),
  lg+ 에서는 항상 둘 다 보이게 했다.
  **③ 근거**: Linear/Superhuman 앱의 실제 모바일 관용구가 이 패턴이고, `sr-only`/포커스 관련
  delta들(r5/r11)이 전부 "요소를 DOM에서 완전히 빼는" `hidden`(display:none)과 "위치만
  옮기는" 접근의 차이를 다루길래, 조건부 렌더(언마운트) 대신 CSS `hidden` 토글로 상태를
  보존해 재검색/재선택 시 리렙 손실이 없게 했다.

- **① 무엇을 결정했나**: 픽션 인물/회사명과 대시보드가 속한 "제품 세계관"의 층위 —
  브리프는 "제품·브랜드는 자유 발명"만 요구.
  **② 무엇으로 결정**: 대시보드 앱 자체(Harborline)와 그 사용자가 속한 회사(Fernbridge Data),
  그리고 Fernbridge의 고객사 8곳(Vantree Logistics 등)을 3계층으로 분리했다.
  **③ 근거**: `auto-dash-r3` delta(세션 컨텍스트의 실제 이메일을 더미 인물명으로 오인해
  베낀 사고)를 의식해 `CURRENT_USER`는 완전히 무관한 이름/이메일(`reyna.okoye@fernbridge.io`)
  로 고정했고, 계층을 나누니 "타사 지원 티켓" 도메인에 자연스러운 티켓 소재(SSO, 웹훅, CSV
  export 등 실제 B2B SaaS 지원 티켓 소재)를 무리 없이 채울 수 있었다 — 임의 선택이지만
  도메인 그럴듯함을 위한 구조적 선택.
