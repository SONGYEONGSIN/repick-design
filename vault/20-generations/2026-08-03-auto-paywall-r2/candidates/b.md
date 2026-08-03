---
tags: [generation, paywall, auto-paywall-r2]
---

# auto-paywall-r2 / b — "Fathomline"

**Product/brand/trigger**: Fathomline, a product-analytics + session-replay SaaS. Paywall trigger: the account (Starter plan) tracked 512,340 events this month against a 500,000-event allowance — new event collection paused automatically 12,340 events over the cap, and session replay retention is separately capped at 3 days on Starter.

**Macro structure**: a genuine simultaneous split-screen, not a hero-then-stacked-sections page. `paywall-client.tsx` renders one `grid lg:grid-cols-2` that holds the entire page body — no full-width sections live below it. **Left pane (persuasion, `persuasion-pane.tsx`)**: the exact overage number, a re-windowable (7d/30d/90d) day-by-day usage chart with dashed/icon-marked "paused" bars, and a `<dl>` before/after list of what's locked on Starter. **Right pane (sizing, `sizing-pane.tsx`)**: a live calculator (events slider, seat stepper, retention radio) feeding a single recommended-plan card that both panes read from. State (`billing`/`events`/`seats`/`retentionDays`) is lifted to the parent so the plan name/price quoted inline in the left pane's copy and the card in the right pane never drift out of sync — the two panes are reactive to the same source of truth, reinforcing that they're read together rather than in sequence. Both columns scroll together at their natural content height (no independent scroll locking), stacking only at mobile widths. This is structurally distinct from r1/a and r1/c (card-embedded sizing) and from r1/b (hero split + four separate stacked sections below it) — here the split *is* the whole page.

**Interactions implemented** (6, all information-bearing):
1. Usage-window tabs (7d/30d/90d) in the left pane — swaps the chart's dataset and paused-day markers.
2. Billing-period toggle (monthly/annual) — recomputes the displayed price, live, in the recommended-plan card.
3. Monthly-tracked-events range slider — recomputes recommended plan tier, price, and headroom text live.
4. Team-seats stepper (+/−) — recomputes price via per-seat overage live.
5. Session-replay-retention radio group (3d/30d/90d) — can force a plan-tier change (90d forces Scale even when event volume alone would recommend Growth), recomputing price live.
6. Native `<details>`/`<summary>` FAQ accordion in the right pane (3 items).

**Palette**: near-monochrome light theme (white/`slate-50` surfaces, `slate-900` foreground, `slate-200` borders) with a single teal accent, adapted from the catalog's Productivity-Tool teal note (its paired orange accent was dropped — single-accent DNA). Used `teal-700` (not `teal-600`) for any text/button-fill role that carries text — `teal-600` on white only reaches ~3.75:1, `teal-700` (#0F766E) clears ~5.5:1 AA; `teal-600` is reserved for icon strokes, focus rings, and non-text bar fills where the 3:1 UI-component threshold applies. Deliberately light: all three r1 paywalls were dark, so this is a considered departure, not a default.

**Font**: default Pretendard throughout, no `--font-display-*` override (grotesk/wide/mono all used in recent rounds). Exactly 3 weight classes route-wide — `font-normal`, `font-medium`, `font-semibold` — verified with `grep -roE "font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)\b"` across every file in the route.

**Files**: `app/src/app/paywall-evolve/r2/b/page.tsx`, `paywall-client.tsx`, `persuasion-pane.tsx`, `sizing-pane.tsx`, `usage-chart.tsx`, `data.ts`.

**Confirmed**: `cd app && npx next build` passes cleanly (verified). `node scripts/dash-static-check.mjs` returns zero violations on every file in the route. No raw `<img>`, no `Math.random`/`Date.now`/bare `new Date()`, no emoji, no `dark:text-*-500/600`. The one `<dl>` (feature comparison) follows the curation-criteria fix exactly — `dl > div > (dt, dd)`, icon lives inside `dt` only, verified against rendered production HTML. Single `h1` confirmed in rendered output, heading order `h1 → h2 → h2 → h2 → h3 → h3` with no skips. Focus-visible rings (`FOCUS_TEAL`) on every interactive control; color is never the sole signal (paused chart bars carry a dashed border + icon + sr-only text; comparison rows carry strikethrough vs. non-strikethrough, not just color).
