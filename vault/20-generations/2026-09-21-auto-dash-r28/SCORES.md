# auto-dash-r28 — SCORES

Target: dash · Round: 28 · Date: 2026-09-21
Freeze hash (pre-fix, all 3 candidates as first gated): `5163abb11203072bf8949adb8797fd0e81e4a494`

## Candidates
- **a** — Openhour (BrightPath Dental Group capacity/scheduling console) — calendar-board-centric shell, calendar-cell heatmap intensity encoding (switchable Booked%/Revenue/SLA-risk), light/orange/`--font-display-wide`
- **b** — Ridgeline (B2B SaaS revenue-ops console) — hero-number + inline-stats shell (no 4-card KPI row), ARR-bridge waterfall, light/cyan/`--font-display-mono`
- **c** — Trestle (field-ops deployment scheduler) — fixed queue-rail + always-visible multi-row Gantt shell, dark/cyan/`--font-display-mono`

Macro shells and dominant-visualization types were pre-assigned by the orchestrator to avoid the last 6 rounds' recurring shells (feed-centric ×2, 3-pane, master-detail, a radial multi-panel, and the generic "KPI-row + 8/4-split" shell r27's own delta flagged as differentiation-costly even for a novel widget).

## Hard gate — `node scripts/gate.mjs --target web --routes /dash-evolve/r28/<v>` (run per candidate separately, not combined)

### Run 1 (pre-fix)
| candidate | route | types | static | lint | weights | sweep | focus | console | a11y | perf |
|---|---|---|---|---|---|---|---|---|---|---|
| a | ✅ | ✅ | ✅ | ❌ 3× `set-state-in-effect` | ✅ 3 | ❌ table-overflow ×4 (1264/1280px) | ✅ | ✅ | ❌ 96, hard-fail audits `color-contrast`+`label-content-name-mismatch` | ✅ |
| b | ✅ | ✅ | ✅ | ❌ 4× `set-state-in-effect` + 1× `no-unescaped-entities` | ✅ 3 | ✅ 0 | ❌ palette input `outline-none` w/ no visible replacement | ✅ | ✅ 100 (only `bf-cache`) | ✅ |
| c | ✅ | ✅ | ✅ | ❌ 1× `set-state-in-effect` | ✅ 3 | ❌ page-overflow ×3 (390px by 117, 1264px by 14, 1280px by 7) | ✅ | ✅ | ❌ 93, hard-fail audit `definition-list` | ✅ |

1-fix routed to each candidate's own designer agent (resumed via SendMessage, full context retained), scoped strictly to the reported violations.

### Run 2 (post 1-fix)
| candidate | result |
|---|---|
| **a** | **10/10 pass.** lint 0, sweep 0 (colgroup rebalanced), a11y 100 (color-contrast fixed by replacing opacity-faded muted cells with a flat pre-verified `bg-zinc-50 text-zinc-500` style; label-content-name-mismatch fixed by giving calendar cells a single `sr-only` accessible-name source instead of a conflicting `aria-label`). **Survives.** |
| **b** | **focus still fails, same element.** The fix added `focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600` alongside the *existing* bare `outline-none` class (not removed). Root-caused post-hoc: Tailwind v4's `outline`/`outline-none` utilities both read/write the shared `--tw-outline-style` custom property; `.outline-none` sets `--tw-outline-style: none` **unconditionally** (no pseudo-class), and `.focus-visible\:outline:focus-visible { outline-style: var(--tw-outline-style); ... }` only *reads* that variable rather than setting its own — so on focus, `outline-style` still resolves to `none` and nothing paints, even though `outline-width`/`outline-color` are correctly set. This is a variant of the exact documented dead-idiom trap (an `outline-none` that cancels a later `focus-visible:outline`), just via a shared custom property instead of the ring-transparency path the canon note originally described. **Dropped — one fix attempt already used, re-failed, regardless of cause per §3.** |
| **c** | **sweep still fails, same by-amounts (117/14/7), different root cause than what was fixed.** The fix correctly removed `CrewTable`'s hardcoded `min-w-[560px]` (a real defect, and now gone), but the actual overflow source turned out to be `GanttChart`'s always-mounted hover/focus tooltip (`w-56`, `absolute left-0 bottom-full`, `pointer-events-none` — present in the DOM at all times, not conditionally rendered, just opacity-hidden until hover/focus) which extends 224px to the right of whichever bar it's anchored to; for bars positioned toward the right side of the timeline (common at narrow row widths / 390px, where every bar is "toward the right" relative to the viewport) the tooltip's box extends past the viewport edge and trips `document.scrollWidth`, independent of the CrewTable fix. **Dropped — one fix attempt already used, re-failed, regardless of cause per §3.**

## Result
Only **candidate a (Openhour)** survives the hard gate. Per skill §4, 1 surviving candidate → single-candidate judging (winner-or-no-winner only, no ranking).
