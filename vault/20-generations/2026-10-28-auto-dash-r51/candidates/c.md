# Candidate c — Siftline (Trust & Safety review-queue console)

**Siftline** — a fictional trust & safety moderation console for "Fieldgood," a general marketplace.
The product's entire job is to keep a dense, always-live **review queue** of flagged listings,
messages, profiles, reviews and comments in front of reviewers until each one is disposed of inside
its policy's SLA window. Route: `/dash-evolve/r51/c`. Light theme, `green-700`/`green-800` accent,
`--font-display-mono` on the wordmark and the page `h1` only.

## What was built

- **Macro layout — feed-centric, mandatory variant.** A central `FeedColumn` (the review queue) is
  the page's visual center of gravity: 24 flagged-content reports, each a dense card showing
  severity, status, category, a line-clamped title+snippet, actor avatar, content type and an
  always-visible SLA chip — nothing is gated behind hover. It sits between a left `QueueSummaryRail`
  (14-day volume sparkline, open/SLA-breach counts, a category-filter chip list, reviewer workload
  with capacity bars) and a right `DetailPanel` (tabs: Overview / History / Related, plus three real
  decision actions). No chart dominates the page; the feed itself is the content.
- **App shell.** `Sidebar.tsx` (brand lockup, workspace switcher with a deliberately long 50-char
  workspace name to exercise the truncation fix, two nav sections, bottom user row, now also
  `lg:sticky` so it stays in view while the page scrolls past the feed into the audit log) +
  `Topbar.tsx` (⌘K search button, "Export queue" primary action that downloads a real CSV of
  whatever's currently visible, notifications popover, avatar menu). 44px header controls throughout.
  Mobile: a drawer for the sidebar, and a `feed ⇄ detail` swap for the three-column content area.
- **Components.** `Card`/`CardHead`/`Eyebrow` (`ui.tsx`), `SeverityBadge`/`StatusBadge` (colour +
  icon + text, never colour alone), generated initials `Avatar` (deterministic hash-based tone, no
  photo host), `Segmented` control, an APG-ish `Tabs`/`TabPanel` pair (arrow-key roving focus),
  `ProgressBar`, and `SparklineChart` (hand-generated SVG, 2-decimal-rounded coordinates).
  `AuditTable.tsx` is a second, `table-fixed` + `%`-`colgroup` sortable table (reviewer decisions /
  avg handle time / accuracy / last active) — distinct from the feed, satisfying the brief's
  secondary-ledger option directly.
- **Interactions (5, all real, all `'use client'`):**
  1. **Chart hover/keyboard crosshair** — `SparklineChart`'s 14 day-points each have an invisible,
     keyboard-focusable button; hover or focus opens the same tooltip. Local, ephemeral state.
  2. **Real filter + sort** — a text search, a category filter (left rail), a queue-scope segmented
     control and a Newest/Oldest/Severity sort all actually filter/sort the 24-report array (plus a
     second, independent sort on `AuditTable`).
  3. **Period/view toggle** — the "My queue / Team queue / All reports" segmented control.
  4. **Selection → synced widgets, strongest tier.** Two independently-scoped mechanisms, neither
     touching the other: (a) clicking a feed card sets `selectedId`, which pins **only**
     `DetailPanel`; (b) clicking a category chip in the left rail narrows **only** the feed's visible
     list and that chip's own active state. Switching the queue scope or sort also never resets or
     reads `selectedId` — the pinned report survives every unrelated filter change.
  5. **⌘K command palette** (bonus) — wired to the same real setters (jump to a view, a category
     filter, or a specific report), not a decorative shell.
  - Bonus: three real decision actions (Approve / Remove / Escalate) mutate that one report's status
    everywhere it's shown, with an Undo affordance — a data mutation, not a selection-fan-out.
- **Data.** `data.ts` carries the full contract: no `Math.random()`, no `Date.now()`/bare `new Date()`
  anywhere; SLA remaining is *derived* from `receivedMinutesAgo` + a severity-keyed target, so a
  severity badge and its SLA chip can never disagree; every count on the page (category chips, scope
  counts, SLA breaches, reviewer workload, `AuditTable`'s decision totals) is produced by filtering
  `REPORTS`/`REVIEWERS` at read time — confirmed by hand: 10 New + 7 In Review + 4 Escalated + 3
  Resolved = 24, and the 4 resolved reports (all reviewer-assigned) sum to `AuditTable`'s own total.

## 브리프에 없던 것

① **"Feed-centric, no dominant chart" 레이아웃을 정확히 몇 단으로 나눌지.**
   → 12-col grid를 `col-span-3 / 6 / 3` (rail / feed / detail)로 고정 비율 분배했다.
   → 좌/우 패널을 px 고정폭으로 박으면 뷰포트 폭이 바뀔 때마다 캡(max-w) 계산을 다시 해야 하는데, 퍼센트 기반 grid-fraction은 그 자체로 "뷰포트를 채우고 과도한 max-w 없음" 규칙을 공짜로 만족시킨다 — 그래서 아예 max-w 캡을 선언하지 않았다(계산할 필요가 없어짐).

② **피드 카드 1개의 정보 밀도 — 몇 개의 메타데이터를 상시 노출할지.**
   → severity + status + category + content-type + reporter + actor + relative-time + SLA, 8가지를 전부 hover 없이 상시 노출.
   → 브리프가 반복해서 강조한 "핵심 증거를 hover 뒤에 숨기지 말 것" 원칙을 가장 빡빡하게 해석했다 — 피드가 메인 콘텐츠인데 그 안의 카드가 요약판이면 결국 유저가 클릭해서 detail을 열어야만 상황 판단이 되는, "피드가 장식"인 꼴이 되기 때문.

③ **"두 개의 독립적으로 스코프된 선택" 쌍을 구체적으로 어디에 박을지.**
   → (a) 피드 카드 클릭 → DetailPanel만 pin, (b) 좌측 카테고리 칩 클릭 → 피드 목록 + 칩 자신의 active 상태만 변경, 둘을 서로 완전히 무관하게 설계.
   → 브리프가 이 축을 "이 카탈로그 역사상 가장 많이 언급된 완성도 기준"이라고 명시했으므로, 두 메커니즘이 실제로 서로의 상태를 절대 건드리지 않는지(카테고리를 바꿔도 선택된 리포트가 안 바뀌는지, 리포트를 선택해도 카테고리 필터가 안 바뀌는지) 코드 레벨에서 직접 보장하도록 state를 완전히 분리된 두 개의 `useState`로 유지했다.

④ **색상 의미 체계 — green 단일 accent와 severity/status 팔레트의 충돌 방지.**
   → severity는 red/orange/amber/zinc, status는 sky/violet/rose(+ Resolved만 green 재사용)로 green과 분리.
   → brief는 "accent는 green 하나"라고만 했지 severity/status 색까지 전부 green 1종으로 할 수는 없다(4단계 심각도를 구분 못 함) — 카탈로그 내 기존 Riskline/Inboxline 사례(단일 accent 옆에 별도의 tier/grade 팔레트를 두는 패턴)를 그대로 따랐고, "Resolved"만 green을 재사용해 accent의 유일성을 지켰다.

⑤ **대비 플로어를 surface 종류별로 분기할지, 통일할지.**
   → zinc-500/zinc-600을 표면별로 분기하지 않고 `TEXT_AUX = zinc-600` 하나로 통일.
   → brief가 준 플로어 공식이 두 가지(순백=zinc-500, tinted=zinc-600)인데, 컴포넌트가 재사용되면서 흰 배경에도 tinted 배경에도 동시에 쓰이는 경우(예: 뱃지, 세그먼트 라벨)가 많아, 매번 "이 표면이 tinted인가?"를 판단하는 대신 더 엄격한 zinc-600을 전역 기본값으로 삼아 분류 실수 가능성 자체를 없앴다 — WCAG 수치로도 직접 계산해 모든 실사용 조합이 4.5:1 이상임을 확인했다.

⑥ **"테이블/필터" 요건을 피드 자체 필터로 만족시킬지, 별도 테이블로 만족시킬지.**
   → 둘 다 구현했다 (`AuditTable`을 별도로 추가).
   → brief가 "둘 중 하나면 된다"고 명시했지만, 이 라운드의 형제 후보(a)가 바로 이 지점(테이블 overflow)에서 재작업된 이력이 있어 — 테이블 관련 요건은 아예 중복으로 충족시켜 리스크를 낮추는 쪽을 선택했다.

⑦ **아바타를 실사 사진으로 할지 생성 이니셜로 할지.**
   → 생성 이니셜 아바타(해시 기반 고정 팔레트)로 결정, 실사 사진은 전혀 사용하지 않음.
   → brief가 "둘 다 유효하고, 오히려 밀도 높은 ops 피드엔 생성 아바타가 더 적합할 수 있다"고 명시적으로 허용했고, 24개 리포트 × 각기 다른 actor 이름에 맞는 "진짜 존재하는 특정 unsplash photo-id"를 20개 이상 큐레이션하는 것보다 결정론적 해시 아바타가 더 안전하고 빨랐다.
