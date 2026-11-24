# Candidate c — Fulcrum

Fulcrum is a workforce/headcount planning console for the People Ops team at Northwind, a fictional mid-size company (389 employees across 9 departments). The page leads with a hero "net headcount growth" figure plus four inline stats (attrition rate, avg time to fill, new roles opened, internal mobility rate), each with its own sparkline, all driven by one QTD/YTD/Trailing-12mo toggle — deliberately with no large dominant chart. Below that, the dominant visual is a repeated small-multiple bullet-chart grid, one row per department, each showing current headcount vs. hiring target with an explicit ceiling tick and a hatched overflow segment for the several departments running over 100% of target (Product, Sales, Customer Success, IT & Security). Clicking a row opens a local, ephemeral inline inspector (levels breakdown + recent hires/departures) that touches nothing else on the page. Below the grid sits a sortable (`aria-sort`, Role/Elapsed), filterable (department, status) open-roles pipeline table. Theme is zinc-950/900 dark with white/10 borders, no glow or grain; the single accent is lime, used as lime-300 for any text (measured well above the 4.5:1 floor against both zinc-950 and zinc-900) and lime-400/500 for non-text fills only; `--font-display-grotesk` is used solely for the "Fulcrum" wordmark and the hero number, everything else is Pretendard/system-ui, and exactly three font weights (400/500/600) render on the route.

## 브리프에 없던 것

**① What the hero number actually means**
① The brief's example hero ("current total headcount") can't literally change with a time-range toggle — a headcount *as of today* is one number regardless of which window you're looking through. I had to decide what the toggle changes.
② The hero now reads "Net headcount growth" (`+4` / `+55` / `+60` for QTD/YTD/T12M), computed as `headcount(now) − headcount(start of window)` from the same employee records the rest of the page uses, with the static current total (389) printed right beside it as grounding text.
③ This is the only framing where the toggle genuinely changes the headline figure (as the brief requires) without inventing a second, disconnected "headcount" number that could contradict the real current total — the display-font treatment stays on this one real, derived figure.

**② Bullet grid is scaled per row, not on one shared axis**
① Department sizes span 14–127 people; a single shared axis would make Engineering's bar dwarf IT & Security's, with no way to read either department's own target gap.
② Each row's track scales to `ceil(max(current, target) × 1.2)`, guaranteeing headroom for the over-target hatched segment and keeping the ceiling tick always on-screen; the real numbers (`127 / 110 target`, `1.15× target (+15% over)`) are printed as text beside every bar regardless of scale.
③ This keeps every row individually legible (the brief's explicit concern) at the cost of cross-row bar-length comparability, which a bullet chart's numeric labels already carry instead.

**③ One `ALL_ROLES` dataset feeds both the table and the time-boxed role stats**
① "Avg time to fill" and "new roles opened" needed to be period-aware while the Pipeline table itself stays "as of today" — two different read patterns over what had to remain one dataset so they could never disagree.
② Every role record carries `openedIdx`/`closedIdx` only; a single `elapsedDays()` formula produces the table's "Elapsed" column *and* the stat's time-to-fill average (filtered to `status === "Filled"` and `closedIdx` inside the selected window) — there is no second, separately-authored pipeline-metrics table.
③ QTD genuinely has zero roles filled in-window, so the avg-time-to-fill tile shows "No roles filled yet" instead of a misleading `0d` — a real empty-state distinguishing "no data" from "filled instantly."

**④ Scope boundaries that aren't in the brief, stated explicitly**
① The time-range toggle drives only the hero row and its four stat tiles; the bullet grid and the Pipeline table are both captioned "as of today, independent of the period toggle above" and read zero period state.
② The per-department inspector (interaction #2) is local `useState` inside `BulletGrid` only — one row open at a time, nothing else on the page subscribes to it, and the command palette deliberately never sets it.
③ No employee or manager photography appears anywhere (the user menu and sidebar use a plain lime initials badge, `role="img"` + `aria-label`) — this page has no legitimate need for a headshot, so it was removed instead of reached for, which also removes the entire image-host/`next/image` risk surface.
