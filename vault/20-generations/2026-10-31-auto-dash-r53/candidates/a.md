# Outpost — Risk Ops signal feed

## Structure

Feed-centric, three-zone shell inside a standard app frame (fixed 256px sidebar + 64px topbar).
Within the main content area, an explicit 12-col grid splits into:

- **Left (narrow, 2–3 cols): Filters.** Risk-tier and channel checkboxes that live-filter the feed. Sticky on scroll.
- **Center (dominant, 7–9 cols): the feed column.** A "Signal volume" stacked bar chart (the dominant visualization — 14 days of transaction-risk signals, severity-stacked, every bar's total printed above it at all times) sits above a status toggle and the Live feed itself: a dense, sortable, scrollable 8-column table (Time / Event / Account / Channel / Amount / Risk / Status / Pin) showing all 42 underlying signal records. This is the single widest, most information-dense element on the page.
- **Right (narrow, 2–3 cols): Inspector.** Case Inspector (account snapshot, risk bullet-gauge, triggered rules, Approve/Escalate), a Risk distribution histogram, and a Queue summary tile row.

Below `xl` (1280px) everything stacks to one column with a drawer nav and a horizontally-scrollable (mobile-only) feed table. From `xl` the filters+feed sit side by side with the inspector dropping to a full-width row of three cards below; from `2xl` (1536px) the inspector becomes the narrow right rail, giving the complete filters / feed / inspector three-pane composition the brief asks for.

Dominant visualization: the Signal Volume stacked bar chart. Every bar's total count is always-visible text above the bar (not hidden behind hover); severity is encoded by color *and* a diagonal/cross-hatch fill pattern, never color alone; hovering or focusing (keyboard-reachable) a bar reveals the low/medium/high breakdown in a crosshair-style tooltip — strictly additive detail, never the only place a number appears.

Theme: dark product surface (zinc-950/900, white/10 borders, zinc-50/400 text), single blue accent (`blue-500`/`blue-600`, i.e. the `#3B82F6`–`#2563EB` neighborhood) for primary actions, active states and the chart's "high" severity emphasis. Display face: `--font-display-mono` used only for the "OUTPOST" wordmark and page `<h1>` title; everything else — including every number — stays in Pretendard with `tabular-nums`.

## Interactions (7 implemented)

1. **Chart hover/focus crosshair tooltip, keyboard-accessible** — each day-bar in the Signal Volume chart is a real `<button>`; mouse hover *or* keyboard focus (Tab) shows the low/medium/high breakdown tooltip. Fully local state, never read by anything else (see axis note below).
2. **Period toggle** — 7D / 14D segmented control on the Signal Volume chart, re-slicing the same underlying `DAILY_VOLUME` aggregate (no re-fetch, no new data).
3. **View toggle** — All / Open / Escalated / Resolved segmented control above the feed table, filtering the same `EVENTS` array the detail views read from.
4. **Real table sort + filter** — clickable `Time` / `Amount` / `Risk` column headers toggle `aria-sort` + direction; the Filters panel's risk-tier and channel checkboxes narrow the same row set live.
5. **Selection → synced cross-widget update (axis A)** — clicking (or Enter/Space on) a feed row sets `selectedId`, which repopulates the Case Inspector (account, bullet-gauge, triggered rules, history tab) from the same record.
6. **Pin toggle → independent summary (axis C)** — pinning a row updates only the "Pinned" tile inside Queue Summary; it never touches selection or the chart.
7. **⌘K command palette** — global shortcut, searchable list of 5 nav commands + 1 real filter action ("Filter feed to high risk only"), Escape to close, real focus-visible state on every item.

**Selection-fanout note:** axes A (row selection → Inspector), B (chart hover/focus → its own tooltip, defined and commented as intentionally local inside `SignalVolumeChart.tsx`), and C (pin → Queue Summary's Pinned count, defined and commented in `OutpostClient.tsx`/`Inspector.tsx`) are three separate, independently-scoped pieces of state living in three different widgets and are never cross-wired — explicitly called out in a file-level comment in `OutpostClient.tsx`.

Smaller, uncounted extras: Overview/History tabs in the Case Inspector, workspace switcher, notifications and account popovers, mobile nav drawer, Rules-view switches, all keyboard-reachable with real visible focus.

## 브리프에 없던 것

① 데이터 테이블의 열(column) 폭 비율(%) 값 ② 8개 컬럼(Time 17/Event 14/Account 16/Channel 11/Amount 12/Risk 7/Status 16/Pin 7)을, 실제로 `xl` 2-pane 구간(1280px)에서 feed 컬럼이 가장 좁아지는 720px 바닥선을 기준으로 역산해 정함 ③ 브리프가 금지한 "table-fixed % + 안전 여유 없음" 실패 패턴을 피하려면 임의의 안전 마진이 필요했고, 숫자 자체는 브리프에 없으므로 가장 긴 실제 문자열("Escalated", "Oct 18·08:00")의 추정 폭에서 역산.

① 울트라와이드 캡(max-width) 정확한 픽셀값 ② `max-w-[1840px]` ③ 브리프의 공식대로 1920px 기준 `1920 − 256(sidebar) − 48(padding)=1616px`를 구하고, 캡이 그보다 커야 하므로 1840으로 설정 — 1920에서는 캡이 전혀 개입하지 않고 패딩만큼(24px)만 여백이 남도록 역산.

① 데스크톱 셸이 몇 px부터 "데스크톱"으로 전환되는가(사이드바/테이블-fixed/3단 그리드) ② `lg`(1024px) 대신 `xl`(1280px)을 단일 전환점으로, 그리고 인스펙터 레일만 `2xl`(1536px)에서 추가 분기 ③ 브리프가 명시한 검증 폭 목록(1280/1366/1440/1600/1920)에 1024–1279 구간이 없어, 그 구간에서 좁은 3단 그리드가 검증 안 된 채 깨질 위험을 피하려고 임의로 더 보수적인 분기점을 선택.

① 위험 등급(Low/Medium/High) 점수 경계값 ② 70 이상 High, 40–69 Medium, 0–39 Low ③ 브리프에 수치 기준이 없어, 신용/사기 리스크 스코어링에서 흔히 쓰이는 3단 구간 관례를 참고해 임의로 설정 (data.ts의 `riskTier()`).

① 상태(Status) 4종(open/escalated/resolved/hold)을 몇 개 세그먼트의 토글로 노출할지 ② All/Open/Escalated/Resolved 4개만 노출하고 "hold"는 All에만 포함 ③ 브리프는 "period/view toggle"만 요구하고 몇 개 버킷인지는 정하지 않았음; hold 상태는 데이터셋에 1건뿐이라 별도 세그먼트를 만들 가치가 낮다고 임의로 판단.

① 아바타를 실제 Unsplash 사진으로 쓸지 여부 ② 이니셜 아바타(생성형 CSS)로 대체 ③ 브리프가 "아바타를 쓴다면 실제 Unsplash photo-id를 쓰라"면서도 동시에 "제너레이티브 SVG/CSS가 오히려 더 선호됨"이라 명시했고, 가짜 인물 사진을 금융 사기-리스크 도메인에 쓰는 것이 어색하다고 판단해 이니셜로 대체.

① Case Inspector의 Approve/Escalate 버튼이 눌렸을 때 실제로 무엇을 의미하는지 ② 세션 로컬 상태(이 미리보기 밖에서는 영속화되지 않음)로 처리하고 그 사실을 UI 문구("case record unchanged outside this session")로 명시 ③ 브리프에 "결정" 액션의 永속화 요구가 없었고, 가짜 쓰기 API를 만드는 것보다 정직하게 한계를 알리는 쪽을 선택.

① Feed 테이블 전체를 보여줄지, 높이를 제한할지 ② `max-h-[560px] overflow-auto` + sticky header로 내부 스크롤 처리 ③ 브리프의 그리드-크래프트 규칙("형제 카드 높이가 다르면 awkward whitespace를 남기지 말 것, max-height+내부 스크롤 사용") — 42건 전부를 펼치면 Filters/Inspector 옆에서 피드만 압도적으로 길어져 그 규칙을 위반하므로 임의의 라운드 넘버로 제한.

① 브랜드/도메인 자체 ② "Outpost" — B2B 사기·리스크 운영(Risk Ops) SaaS, 가상 은행 "Northfield Bank", 42건의 거래 리스크 시그널, 6개 계정, 4개 채널(Card/ACH/Wire/P2P), 6개 탐지 룰 ③ 브리프는 "아무 B2B 도메인이나, 금지 이름만 피하라"고만 했고 금지 리스트가 항구·물류·해양 테마 이름을 많이 포함해 그와 무관한 금융 사기-리스크 도메인으로 선택.
