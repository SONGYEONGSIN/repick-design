# SCORES — auto-dash-r30

## Hard gate (`node scripts/gate.mjs --target web --routes /dash-evolve/r30/<v>`)

| Gate | A (Ridgeline) | B (Corvid) — 1st attempt | B — after 1-fix | C (Meshline) |
|---|---|---|---|---|
| route | pass | pass | pass | pass |
| types | pass (0 errors) | pass (0 errors) | pass (0 errors) | pass (0 errors) |
| static | pass (0 violations) | pass (0 violations) | pass (0 violations) | pass (0 violations) |
| lint | pass (0) | **fail** — `react-hooks/set-state-in-effect` (dashboard-app.tsx:61) | pass (0) | pass (0) |
| weights | 3 (rendered, measured) | 3 (rendered, measured) | 3 (rendered, measured) | 4 (rendered, measured) — record-only |
| sweep | pass (0 overflow, all widths) | pass (0 overflow, all widths) | pass (0 overflow, all widths) | pass (0 overflow, all widths) |
| focus | pass (0 missing) | pass (0 missing) | pass (0 missing) | pass (0 missing) |
| console | pass (26 msgs, 0 defects) | pass (13 msgs, 0 defects) | pass (13 msgs, 0 defects) | pass (26 msgs, 0 defects) |
| a11y | pass (100) | pass (100) | pass (100) | pass (100) |
| perf | 69 (record only) | 69 (record only) | 68 (record only) | 64 (record only) |
| **verdict** | **pass** | **fail** | **pass** | **pass** |

1-fix applied to B: replaced `setScrollTarget(null)` call inside a `useEffect` body with a `lastScrolledRef` guard (no `setState` call left in the effect body). Re-gate: all 10 gates pass.

## Screenshot capture (`capture-shots.mjs`, 4 widths × 4 scroll positions)

| Candidate | Blanks | Errors | Note |
|---|---|---|---|
| A | 0 | 0 | Full scroll range (page scrolls normally at all widths) |
| B | 0 | 0 | Desktop (≥1280px, `xl:`) locks to `h-dvh overflow-hidden` — no page scroll, so only base frames exist at 1280/1440/1920; mobile (390px) reverts to normal scroll and has full scroll-position frames |
| C | 0 | 0 | Full scroll range |

## Judge panel (3 lenses, blind/independent — full transcripts in DECISION.md)

| Lens | 1st | 2nd | 3rd |
|---|---|---|---|
| 1 — brief compliance | C | B | A |
| 2 — commercial polish | B | C | A |
| 3 — archetype differentiation | B | A | C |

**Aggregate 1st-place votes: B=2, C=1, A=0 → WINNER: B (2:1 majority)**
