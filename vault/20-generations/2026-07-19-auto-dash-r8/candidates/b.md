# Candidate b — Farsight (r8)

**Farsight** — a revenue-intelligence copilot SaaS for RevOps teams. Route: `app/src/app/dash-evolve/r8/b/` (`page.tsx` default export, split into `Workspace.tsx`, `Sidebar.tsx`, `Topbar.tsx`, `ChatDock.tsx`, `RevenueChart.tsx`, `AccountsTable.tsx`, `CommandPalette.tsx`, `ui.tsx`, `data.ts`, `tokens.ts`).

**Archetype — AI copilot chat-dock workspace**: a persistent right-hand panel hosts **Fara**, the AI copilot, shown open by default as a true third structural column (`xl:` fixed `340px` width, `flex-1 min-w-0` main column never gets squeezed narrower than the dock). It has real chat-bubble UI (user vs. assistant turns, right/left aligned, per-message timestamps, `role="log" aria-live="polite"`), a pinned "제안 인사이트" (proactive insight) card stack above the thread, and a "빠른 질문" quick-reply chip row below. Clicking a quick-reply or insight card appends pre-authored deterministic bubbles **and** pivots the main workspace (region focus on the revenue chart, status filter + row expansion on the accounts table, chart window). Collapsible to a 56px icon rail on desktop; on mobile/tablet (`<1280px`) it becomes a toggleable bottom sheet (`role="dialog"`) opened from a topbar button, never permanently stealing viewport.

**4+ real interactions** (all `'use client'`, `motion-reduce`-gated, deterministic):
1. **Chat/copilot sync** — quick-reply chips and insight cards drive main-view state (region focus, status filter, chart window, account selection) plus deterministic chat replies.
2. **Crosshair tooltip on the revenue chart** — mouse-move and full keyboard support (Arrow keys / Home / End on a focusable SVG), with an `aria-live` text summary mirroring the visual tooltip for screen readers.
3. **Real table sort + filter** — accounts table sortable by name/MRR/health (`aria-sort`) and filterable by status via a segmented control.
4. **Period/view toggle** — 6-week vs 12-week chart window segmented control.
5. **Selection syncing multiple widgets** — clicking an accounts-table row expands an inline detail sub-row (contact, sparkline, next action) and simultaneously emphasizes that account's region line on the chart (thicker stroke + "· 선택됨" legend tag); ⌘K command palette selection does the same.

**Typography/font**: single global `font-sans` (Pretendard) throughout, no `next/font` import, numbers use `tabular-nums`; verified via `dash-static-check.mjs` (`no-next-font`, `no-font-serif` rules) — passes clean (`[]`).

**Contrast tokens**: `TEXT_CAPTION = text-zinc-500 dark:text-zinc-400` applied consistently (light ≥ zinc-500, dark ≥ zinc-400) including toggled/filtered states (at-risk filter, expanded rows, chat bubbles, disabled nav item) — manually audited, no zinc-400-on-light or zinc-500-on-dark instances found.

**Tables**: `table-fixed` + `colgroup` percentage columns, `min-w-[640px] lg:min-w-0` mobile-only gate, `sr-only` on a `<caption>` (never on `<table>` itself), `whitespace-nowrap` on numeric/date cells. Verified via `dash-sweep.mjs` across 1280–1920px (±16px slack) and 390px mobile — zero `page-overflow` / `table-overflow` failures.

**Structural difference from the exclusion list**: not a support-ticket inbox (single ongoing analytical thread, no conversation list); not a 3-pane trading terminal (no persistent watchlist/detail rail — detail is an inline expandable table row, not a third rail); not the generic "sidebar + 4-KPI-row + 8/4 chart+sidebar + full-width table" shape (KPIs are a hero-number card + one inline 3-stat card, not four equal cards; the chart is full-width, not split 8/4; the third persistent column is the AI chat dock, not a sidebar detail rail); no funnel, heatmap, treemap, radial/orbit, kanban, calendar, Gantt, map, or mirrored A/B panels anywhere.

**Fictional persona**: user "Priya Nakamura" / `priya.nakamura@farsight.example` (reserved `.example` TLD) — no real session/environment data used.

**Verification**: `node scripts/dash-static-check.mjs` → `[]`; `npx tsc --noEmit` → clean; `npx eslint` → clean; `dash-sweep.mjs` (desktop 1280–1920px incl. −16px slack widths, mobile 390px) → `{"pass": true, "failures": []}`; route returns HTTP 200; Playwright screenshots confirm chart lines render, light/dark themes both true white/zinc-950 surfaces, and all interaction states (hover tooltip, filter+expand, quick-reply, insight-click, ⌘K, mobile sheet) work as intended.
