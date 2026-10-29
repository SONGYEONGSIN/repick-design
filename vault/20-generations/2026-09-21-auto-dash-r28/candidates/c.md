# Candidate c — Trestle

Trestle is a B2B field-operations SaaS for deployment scheduling: install, retrofit, and audit crews get one live board. Composition: a standard app shell (brand-lockup sidebar with workspace switcher + nav, 44px-control top bar with ⌘K search, primary action, notifications, avatar menu) wraps a second, inner panel pair that is the actual page content — a fixed ~256px "Needs attention" queue rail next to a flex-1 main pane whose dominant content is an always-visible multi-row Gantt/timeline (16 jobs, 5 crews, an 8-week window with a today-marker and week gridlines). The rail never swaps the main pane's content; clicking a rail row only pins/highlights that row inside the Gantt (which keeps rendering every job) and narrows a small always-visible detail strip above the chart — explicitly not a master-detail pattern.

Interactions implemented (5, all real `'use client'` state, deterministic — day offsets from a fixed epoch, no `Math.random`/`Date.now`/no-arg `new Date()`):
1. Hover/focus crosshair tooltip on each Gantt bar — CSS `group-hover`/`group-focus-within`, so it is fully keyboard-reachable via native `<button>` Tab focus, and is ephemeral (touches no React state).
2. Rail sort (Risk severity / Start date) + status filter chips (All/Blocked/At risk/Unscheduled) — local `useState` in `QueueRail`.
3. Week/Month zoom toggle on the timeline — recomputes the visible day window and re-derives tick marks and bar geometry.
4. Rail click / Gantt-bar click / unscheduled-chip click all call one `onPin` — a persistent, narrowly-scoped selection (`aria-pressed`, ring highlight, `scrollIntoView`, and the detail strip) that never collapses the Gantt to a single item; it keeps showing all 16 jobs at all times. This is intentionally the only persistent selection consumer besides the detail strip, both driven by the same scoped `pinnedId`, distinct from the fully local/ephemeral hover tooltip state.
5. ⌘K / Ctrl+K command palette (stretch) — searches jobs by code/site/city/crew and selecting a result pins it in the Gantt, with outside-click and Escape dismissal on it and on the two top-bar menus.

Typography: `font-sans` (Pretendard) everywhere for body/Korean-capable text; exactly one display face, `--font-display-mono`, used only at large sizes (the h1 and the sidebar wordmark) for a schedule-console feel — axis tick labels were deliberately kept on Pretendard/tabular-nums rather than the display face once I noticed they were too small to count as "display" use. Exactly three rendered weights: 400/500/600.

Theme: dark (`zinc-950/900` surfaces, `white/10` borders, `zinc-50` primary / `zinc-400` secondary-text floor). Accent: cyan (not teal, not amber/violet/blue/indigo). Status coding (on-track emerald, at-risk amber, blocked rose, unscheduled zinc) always pairs an icon + text label with the color, on the bar itself, in the row's label column, in the rail, and in the legend.

Completeness vs. the Mercury/Asana/Coinbase bar: real computed data (16 jobs, 5 crews; KPI counts, crew utilization %, and next-available dates are all derived from the job list at module load, not hand-typed, so totals reconcile); a semantic `<table>` (`caption`, `scope`, sortable `aria-sort` column) for crew utilization with `min-w` on the `<table>` element and a mobile-only scroll wrapper; the Gantt itself never needs horizontal scroll (percentage-geometry inside a `flex-1` track), so only that one table can ever scroll horizontally; a skip-link; visible `focus-visible:outline` throughout; date/duration columns are `whitespace-nowrap`; the narrow rail's site names truncate with a `title` attribute and its notes use a 2-line clamp so nothing mid-truncates invisibly at 1280px.

## 브리프에 없던 것

1. 무엇을 정해야 했나: 대시보드 상단의 가상 제품 정체성(이름·업종·용어 체계).
   정한 것: "Trestle" — 설치/개보수/감사 크루를 위한 현장 배포 스케줄링 SaaS. 작업(Job), 크루(Crew), 사이트(Site) 용어 체계와 16개 결정론적 더미 작업 데이터를 직접 설계.
   근거: 중복 회피 목록에 없는 새 제품이어야 했고, 브리프가 지정한 "Gantt/타임라인" 시각화에 자연스러운 도메인(현장 크루 스케줄링)을 선택. 이름은 "-line" 계열(Ledgerline/Harborline/Floorline/Redoubt 등 기존 후보와 겹치지 않도록) 을 피해 "받침대/구조" 뉘앙스의 Trestle로 선택.

2. 무엇을 정해야 했나: "오늘" 기준일과 8주 캘린더 창의 정확한 날짜.
   정한 것: 고정 에폭 2026-08-31(월)을 day 0으로 두고, 세션의 실제 "오늘"인 2026-09-21을 day 21로 고정. 월간 뷰는 day 0–55(8주), 주간 뷰는 day 14–27(오늘을 포함하는 14일)로 설계.
   근거: 결정론 규칙(`new Date()`/`Date.now()` 금지) 을 지키면서도 "Today" 마커가 실제로 오늘 날짜와 일치하도록, 세션에 제공된 실제 오늘 날짜(2026-09-21)를 그대로 반영.

3. 무엇을 정해야 했나: 대기열 레일(rail)에 어떤 작업을 보여줄지의 정확한 집합.
   정한 것: "정상 진행(on-track)"이 아닌 모든 작업(at-risk + blocked + unscheduled, 8건)을 레일에 노출.
   근거: 브리프의 레일 설명("Unscheduled/At-risk items queue rail")을 문자 그대로 두 상태만으로 좁히지 않고, "주의가 필요한 모든 것"으로 자연스럽게 확장 — 실제 SaaS 운영 화면에서 흔한 "Needs attention" 패턴과 일치.

4. 무엇을 정해야 했나: 디스플레이 서체(`--font-display-mono`)를 축 눈금 라벨처럼 작은 날짜 텍스트에도 쓸지 여부.
   정한 것: 쓰지 않음 — h1과 사이드바 워드마크에만 적용하고, 축 눈금·모든 작은 UI 텍스트는 Pretendard + `tabular-nums`로 유지.
   근거: 브리프의 "large sizes only" 규정이 "mono는 날짜/기간 라벨과 잘 어울린다"는 선택 이유 설명보다 우선하는 하드 제약이라고 판단.
