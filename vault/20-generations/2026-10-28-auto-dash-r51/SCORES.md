# auto-dash-r51 — SCORES

Freeze hash (cat all candidate `.tsx`/`.ts`, shasum): `2e985227d0f45828b179c9b039fde27bec9f78e5`

## Hard gate (`node scripts/gate.mjs --target web --routes /dash-evolve/r51/a /dash-evolve/r51/b /dash-evolve/r51/c`)

| candidate | route | static | lint | sweep | a11y | perf | 1-fix needed |
|---|---|---|---|---|---|---|---|
| a — Inboxline (reassigned, reassign-queue #17) | ✅ | ✅ | ✅ | ✅ | ✅ 100 | ✅ 63 | none — pre-fixed before this round's first gate run (see candidates/a.md reassignment note) |
| b — Clearbid | ✅ | ❌→✅ | ❌→✅ | ❌→✅ | ✅ 100 | ✅ 60 | yes — 1 fix applied (see below), re-gate clean |
| c — Siftline | ✅ | ✅ | ✅ | ✅ | ❌→✅ 100 | ✅ 70 | yes — 1 fix applied (see below), re-gate clean |

**Final combined gate (all 3 routes, after fixes): `pass: true`, 0 violations.**

## 1-fix detail

### b (Clearbid) — 1st attempt failures
- `lint`: `react-hooks/set-state-in-effect` in `DetailPane.tsx:42` — `setTab("overview")` called synchronously inside a `useEffect` keyed on `exchange.id`.
  **Fix**: replaced with React's documented "adjust state during render" pattern — track `prevExchangeId` in state and reset `tab` directly in the render body when it changes, no effect.
- `sweep` `cell-overlap`: `ExchangeTable.tsx` — CPM/win-rate/latency `<td>` text bled into the next column at 1264/1280px (desktop) and the status badge bled into the CPM column at 390px (mobile). Root cause: `table-fixed` + `colgroup %` constrains the `<td>` *box* but not the *text inside it* — without `overflow-hidden`, nowrap text paints past the cell boundary into the neighbor when the allocated column is narrower than the text's natural width.
  **Fix**: added `overflow-hidden truncate` (status badge: `overflow-hidden` on its `<td>`) to every narrow numeric/badge cell — a safety net, not expected to visibly trigger given the short deterministic values.
- Re-gate: 10/10 clean, `sweep` 0 overflow, `a11y` 100.

### c (Siftline) — 1st attempt failure
- `a11y` 93, 2 hard-promoted audits failed:
  - `aria-valid-attr-value`: `Tabs` (in `ui.tsx`) generated its own `aria-controls` id via an internal `useId()`, while `TabPanel` used a *different* id (`"detail-tabs"`) passed down from `DetailPanel.tsx` — the two never matched, so `aria-controls` pointed at a non-existent element id.
    **Fix**: `Tabs` now takes an `id` prop instead of generating its own; `DetailPanel` passes the same `tabsId` it already gives `TabPanel`.
  - `target-size`: `SparklineChart.tsx`'s keyboard-accessible crosshair was 14 individual ~13-20px-wide `<button>` overlays (one per day), each well under the 24×24px safe-clickable-space floor with zero gap between them.
    **Fix**: replaced the 14 buttons with the single-element `role="slider"` scrub-rail pattern already established and gate-passing elsewhere in this same round's sibling candidate `a`'s `StreamGraph` — one element spanning the whole chart, `aria-valuemin/max/now/valuetext`, pointer-move + Arrow/Home/End keyboard stepping.
- Re-gate: 10/10 clean, `a11y` 100.

Diagnosed and applied directly by the orchestrator (real dev-server + Lighthouse access), not by a designer subagent — both fixes were narrow, mechanical corrections of an already-identified gate violation, not a redesign, per §3-1 scope.
