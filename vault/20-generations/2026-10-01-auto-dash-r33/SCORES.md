# auto-dash-r33 — SCORES

Target: dash · Round: auto-dash-r33 · Date: 2026-10-01
Frozen-source hash (all 3 candidates, pre-gate): `451e62d6cfae1d0102b9547ca14c1eaee0dd3706`

Reassignment: candidate **a** ("Census", 10×10 waffle grid + on-demand slide-over) is a reassignment from `reassign-queue.md` item #6 (`auto-dash-r32/b`), dropped there for a `table-overflow` sweep failure that survived one fix attempt. This round's `a` fixes the root cause (no `min-width` on the drawer's ticket table; fluid `table-fixed` + `<colgroup>` percentages instead) and is a clean rebuild, not a copy.

## Hard gate — pass 1

| Candidate | route · lint | a11y | other gates | verdict |
|---|---|---|---|---|
| a (Census) | lint error 5 (`set-state-in-effect` ×1, `static-components` ×4) | 96 — failed `color-contrast` | route/types/static/weights/sweep/focus/console/perf all pass | **1-fix** |
| b (Routeline) | lint error 1 (`set-state-in-effect`) | 100 | all pass | **1-fix** |
| c (Arcway) | lint error 2, warning 2 (`set-state-in-effect`, 2× unused eslint-disable, `react-hooks/refs`) | 100 | all pass | **1-fix** |

Notable: all three candidates, built by three independently-isolated designer agents with no shared context, converged on the exact same `react-hooks/set-state-in-effect` pattern in their command-palette's reset-on-open logic (`useEffect(() => { if (open) { setQuery(""); ... } }, [open])`). Not plagiarism — a genuinely convergent idiom mistake, flagged here for the record since the loop's own history treats independent convergence as a signal worth noting.

## Hard gate — pass 2 (1-fix)

| Candidate | result |
|---|---|
| a (Census) | **PASS** — lint 0, a11y 100. Fixed: moved `SortIcon` to module scope (was recreated during render), moved the palette's index-reset out of the effect into the input's `onChange`, darkened amber CTA/badge from `amber-600`→`amber-700` and bumped several default-view `zinc-500`→`zinc-600` for contrast. |
| b (Routeline) | **PASS** — lint 0, a11y 100. Fixed: split `CommandPalette` into an always-mounted trigger + an inner `PaletteDialog` that only mounts while open, so `query`/`activeIndex` reset for free via initial `useState` instead of an imperative effect. |
| c (Arcway) | **FAIL — dropped.** First fix (wrap `close` in `useCallback`) did not resolve the `react-hooks/refs` "Cannot access refs during render" error on `ui.tsx:350` (`Popover`'s `children({ close })` render-prop call) — same rule, same line, re-flagged after the fix. Per §3 (one fix attempt, re-failure → drop), c is dropped before judging. Not a form-level rejection — see `reassign-queue.md` for the new entry and precise diagnosis for a future reassignment. |

Full gate JSON for each pass/candidate is in this session's tool transcript (not re-pasted here); `verdict.gates` summary sourced into the ledger's `hardgate` field below.

## Screenshots

16 frames captured for the 2 survivors (0 blank):
- `shots/a-{1280,1440,1920,390}.png` (a is a viewport-locked single-screen shell — all scroll offsets collapse to 0, by design, consistent with its on-demand-overlay macro).
- `shots/b-{1280,1440,1920,390}{,-s35,-s70,-s100}.png` (b scrolls at all four widths — rail/map/detail stack below `2xl`).

## Judge panel (2 survivors: a vs b — c excluded, dropped pre-judging)

| Lens | 1st | Reasoning (condensed — full in DECISION.md) |
|---|---|---|
| 1 — brief compliance | **a** | Both clean; decided on b having 4 unguarded `sr-only` elements inside `overflow-y-auto` containers (missing `position:relative` anchor — an explicit, verbatim brief rule) vs. a's zero instances of the same pattern (a visibly engineered around it, in-source comment documents the fix). |
| 2 — commercial polish | **b** | Both commercial-grade; b's default-populated detail panel (non-null `DEFAULT_SELECTED_ID`), dual hue+intensity map encoding, and scroll-adds-new-information narrative edge out a's cleaner but rounder-at-the-top-KPI data and overlay-only secondary content. |
| 3 — archetype differentiation | **a** | Both genuinely novel visualization types (first waffle-grid promotion attempt, first geographic/hex-map in catalog) and no within-round collapse into sameness. a's macro skeleton (no persistent third pane, nullable selection, dismissible overlay) has no catalog precedent; b's fixed rail+center+permanently-reserved-detail-pane skeleton structurally resembles the catalog's existing 3-pane trading-terminal shells, even though its map content is new. |

**Result: 2:1 majority for a.** Not a complete tie (no tie-break procedure invoked). No no-winner votes from any lens.

## Winner: a (Census)

No rule violations found in a by any lens → **no §3-1 post-judgment fix needed.**

## Variety axes (winner a)

`{ "theme": "light", "accent": "amber", "face": "wide" }` — per `scripts/catalog-variety.mjs` assignment for this round (banList at round start: `{theme: [], accent: [], face: ['pretendard']}` — avoided; a correctly uses `--font-display-wide`, not Pretendard-only).
