---
tags: [generation, dash, auto-dash-r14]
round: auto-dash-r14
variant: b
---

# auto-dash-r14 / b — Rampart

**Product**: Rampart — a fictional B2B trust & safety operations console for content-moderation
teams ("Trust & Safety Operations Console for Nimbus Social"). Domain chosen to make a live
activity stream the natural hero: every moderation action (a post flagged, escalated, removed,
reinstated) is a discrete timestamped event, and the console's job is "what's happening right now
in the queues."

**Structure (feed-centric, 12-col grid)**: left rail (`col-span-3`) — the Bullet-chart KPI grid;
center (`col-span-6`, dominant) — the live activity feed; right rail (`col-span-3`) — an at-a-glance
stat trio + a queue-depth crosshair sparkline. A full-width sortable reviewer-capacity table sits
below the grid. Mobile reorders the columns (feed first) via `order-*` rather than a separate layout.
This is deliberately *not* the avoid-listed "rail + big chart + detail/feed" trading-terminal shape:
the center column is the feed itself (text-first), and the chart lives in a side rail — the inverse
of that skeleton.

**Interactions (6, all real `'use client'` state, `motion-reduce` gated)**:
1. **Sortable/filterable feed** — sort by Newest/Severity, filter by queue (pills), both client-computed.
2. **Selection syncs multiple widgets** — the queue-filter pills also highlight the matching bullet
   row in the KPI grid and the matching row in the reviewer-capacity table (border/background tint,
   never a contrast-reducing dim, so no new low-contrast state is introduced).
3. **Period/view toggle** — Last hour / Today / This week switches every bullet's actual value
   (targets stay fixed, like a real SLA).
4. **Keyboard-accessible crosshair tooltip** — the queue-depth sparkline has one focusable/hoverable
   button per checkpoint (`min-w-7`, clears the 24px target-size floor); Tab reveals a tooltip with
   the exact value and hour, while the headline number, delta, and peak stay printed as text regardless.
5. **Live mini-chart/sparkline** — the same queue-depth trend, deterministic 7-point dataset.
6. **Deterministic "new event" entrance** — "Load 3 newer events" appends a fixed, pre-authored batch
   (never random) with a `motion-safe:animate-[…]` slide/fade-in; the resting state is always fully
   opaque so no-JS/first-paint never shows `opacity:0`.

A command palette (⌘K) is also wired: it filters a fixed list of the page's four real sections and
scrolls to them — not a decorative dead link, but not counted toward the required four.

**Dominant visualization — Bullet-chart grid**: six bullets (four per-queue throughput rates, plus
platform-wide SLA compliance and reviewer-utilization ceiling), each printing **actual value and
target as always-visible text** beneath a track with three neutral qualitative bands (poor /
satisfactory / good) and a white target tick — never hover-only, directly per the accumulated
dash-loop learning that at-a-glance legibility (not encoding richness) decides commercial-polish
judging. Labels were shortened after a 1280px screenshot check showed them clipping against the
status badge — the fix was shorter copy + `line-clamp-2` as a safety net, not a wider column that
would starve the feed.

**Typography/font discipline**: exactly three rendered weights route-wide (400 default body/caption,
`font-medium` 500, `font-semibold` 600) — verified by grep across the route, no `font-bold` or
`font-light` anywhere. `--font-display-mono` (via `style={{ fontFamily: "var(--font-display-mono)" }}`,
the pattern already proven safe elsewhere in the catalogue) is applied to every numeral/timestamp —
bullet values, sparkline numbers, table cells, feed times — paired with `tabular-nums`; all prose
stays on Pretendard. No currency in this domain, so the Won-glyph caveat doesn't apply.

**Theme/accent**: fixed product dark (not a `dark:` variant — `bg-zinc-950` canvas, `zinc-900` cards,
`white/10` borders, `zinc-50`/`zinc-300`/`zinc-400` text floor), single emerald accent (brand, buttons,
focus, bullet actual-bars, "good" status), with amber/rose reserved strictly for semantic
warn/destructive states — never used as UI chrome. Focus uses `focus-visible:outline-2
focus-visible:outline-offset-2 focus-visible:outline-emerald-400` with no preceding `outline-none`
anywhere (verified with a real Playwright Tab-through: 8 consecutive stops, every one painted a
solid 2px outline).

**Verification performed**: `tsc --noEmit` clean, `eslint` clean (0 errors/warnings), the repo's own
`dash-static-check.mjs` run against every file in the route (clean — no `no-random`, `no-emoji`,
`no-unlisted-font`, `no-dark-dim-text`, etc.), a full `next build` (static, 0 errors), and a headless
Playwright pass at 1280/1366/1440/1600/1920/390px confirming zero page-overflow and zero table
horizontal-scroll on desktop, plus a functional smoke test (queue filter narrows the feed 14→4 and
highlights exactly one bullet row; "load newer" takes it to 17; utilization-column sort reorders the
table correctly).

**Against the commercial-polish bar**: the qualitative-band bullet chart is a direct, undiluted read
of the Few bullet-graph convention Mercury/Coinbase-grade dashboards use for KPI grids — no chart
library, hand-built SVG-free (CSS-only bars), AAA-rated per the charts catalog. The feed reads like a
real ops console (Linear/PagerDuty-adjacent), not a generic list: severity dots, status badges with
icon+text (never color alone), queue icons, actor attribution.

## 브리프에 없던 것

1. **결정**: Bullet 차트의 "3분위 대역"(poor/satisfactory/good)을 실제로 그릴지, 아니면 값+타깃 텍스트만으로 충분하다고 보고 생략할지.
   **선택**: 그렸다 — 3단 zinc 음영(800/700/600) + 단일 accent 채움 바 + 흰 타깃 틱.
   **근거**: `charts.catalog.md`가 Bullet을 "qualitative band + actual + target" 3요소로 정의하고 있어, 대역을 생략하면 이름만 Bullet인 막대그래프가 된다. 다만 색만으로 판정 전달하지 않도록 상태 배지(아이콘+텍스트)를 항상 병행해 대역 자체는 장식(aria-hidden)으로 처리했다.

2. **결정**: 필터된 상태(예: Image 큐만 보기)에서 다른 Bullet 행/테이블 행을 어떻게 "덜 강조"할지 — 흐리게(투명도) vs 강조만 추가.
   **선택**: 비매칭 행은 그대로 두고 매칭 행에만 에메랄드 보더/배경 틴트를 얹는 "강조 추가" 방식, 투명도 감산은 쓰지 않았다.
   **근거**: `dash-deltas-provisional.jsonl`의 반복 학습(필터/토글로만 도달하는 보조 상태도 기본 뷰와 동일한 대비 규칙을 받는다)을 정적 스캐너가 못 잡는 상태에서까지 스스로 지키려면, 애초에 저대비 상태를 만들지 않는 쪽이 안전하다고 판단했다.

3. **결정**: 사이드바 nav의 비활성 항목(Queues·Escalations·Reports·Policies·Team)을 어떻게 처리할지 — 실제 라우트 없이 링크를 걸어 dead-link를 만들지, 아니면 비활성 처리할지.
   **선택**: `d40`/`d31` 등 기존 산출물의 관례를 그대로 따라 `aria-disabled` + "Soon" 배지로 비활성 처리하고, 활성 항목(Overview)만 `#main-content`로 자기 참조시켰다.
   **근거**: 단일 라우트 산출물에서 존재하지 않는 페이지로의 링크는 이전 라운드(auto-dash-r4 이전)에서 "존재하지 않는 id를 가리키는 앵커" 결함으로 지적된 바 있어(`page-brief-core` a11y 승격 이력), 새 결함을 만들기보다 이미 검증된 관례를 재사용했다.
