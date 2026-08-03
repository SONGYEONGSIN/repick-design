---
tags: [generation, paywall, auto-paywall-r2]
---

# auto-paywall-r2 / a — "Meridian"

**Product/brand/trigger**: Meridian, booking & scheduling infrastructure for service businesses (salons, clinics, studios). Paywall trigger: the account (Solo plan, 1 calendar) has used all 500 bookings in its monthly allowance — new booking requests stop reaching the calendar until the cycle resets or the account upgrades.

**Macro structure**: a genuine progressive multi-step wizard, not a scrolling page with anchors. Client-side step state (`step`/`maxReached`) mounts exactly one step's content at a time — the other two steps' DOM doesn't exist while inactive, so it's a real interaction-state change, not a scroll position. Steps: **1) Evidence** (persuasion — 14-day daily-bookings SVG chart against a capacity line, an estimated-missed-value stat, and a list of specific declined booking requests) → **2) Size it** (sizing calculator — independent from step 1, two live inputs recompute the recommended tier/price/headroom, plus an always-visible 3-tier comparison table) → **3) Confirm** (carries the sizing decision forward, feature checklist, compare-all-plans and FAQ disclosures, final upgrade CTA). A persistent summary rail (current usage + recommended plan/price/headroom) stays mounted across all three steps so the number is visible at rest from step 1 onward, never gated behind reaching the end. This takes the round-1 delta (persuasion ≠ sizing, kept structurally distinct) further than r1/b: r1/b split persuasion/sizing into two sections of one scrollable page; here they're two separate mounted views the visitor moves through via a stepper.

**Interactions implemented** (6, all information-bearing):
1. Step nav — click a reached step pill to jump back to it (gated forward-only via Continue buttons).
2. Continue/Back buttons advancing/regressing the wizard state.
3. Staff-calendars stepper (+/− buttons and direct number input) in step 2 — recomputes recommended tier live.
4. Expected-bookings range slider in step 2 — recomputes recommended tier/price/headroom live.
5. Billing-period toggle (monthly/annual) — recomputes price across the sizing step, confirm step, and the persistent rail simultaneously.
6. Native `<details>`/`<summary>` disclosures — "Compare all plans" table and 5-item FAQ accordion in step 3.

**Palette**: near-monochrome light theme (white/zinc-50 surfaces, zinc-900 foreground, zinc-200 borders) with a single amber accent, adapted from the catalog's Banking/Analytics amber notes. Used `amber-700` (not `amber-600`) for text/button-fill roles that carry text, since `amber-600` on white only reaches ~3.2:1 — `amber-700` (#B45309) on white/on-white-text-on-amber-700 clears ~5:1 AA. Deliberately light theme: all three round-1 paywalls were dark, so this is a legible departure rather than the "safe" third dark repeat.

**Font**: default Pretendard throughout, no `--font-display-*` override (grotesk/wide/mono were all used in recent rounds). Exactly 3 weight classes route-wide: `font-normal`, `font-medium`, `font-semibold` — verified by grep across every file in the route.

**Files**: `app/src/app/paywall-evolve/r2/a/page.tsx`, `paywall-client.tsx`, `step-nav.tsx`, `evidence-step.tsx`, `usage-chart.tsx`, `sizing-step.tsx`, `confirm-step.tsx`, `summary-rail.tsx`, `data.ts`.

**Confirmed**: `cd app && npx next build` passes cleanly; no raw `<img>`, no `Math.random`/`Date.now`/bare `new Date()`, no emoji, no `dark:text-*-500/600`, no `<dl>` used anywhere (feature lists use `<ul>`, comparisons use real `<table>` with `<caption>`/`scope`), single `h1` per rendered view (each step owns its own `<h1>` but only one step is ever mounted), focus-visible rings on every interactive element, `motion-reduce:` guards on the step-transition and chevron-rotate animations.
