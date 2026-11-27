# auto-landing-r44 — SCORES

Target: landing. Freeze hash after fixes (all source files in `app/src/app/landing-evolve/r44/{a,b,c}/*`): `26d027093093f071d692c9a47c2a4ad61f36cf53` — unchanged from the final gate run through screenshot capture through judging.

## Candidates
- **a** — "Verification Timeline" rebuild (reassign-queue #18), dark/sky, 4-stage clickable-any-order verification stepper → confidence%/badge-count/ETA sync — `app/src/app/landing-evolve/r44/a/`
- **b** — "Nearby Sellers" radius map, dark/indigo, search-radius slider → live geographic pin map + in-range stats — `app/src/app/landing-evolve/r44/b/`
- **c** — "Sell-Through Simulator" (winner), light/emerald/display-wide, price slider → live inventory-depletion time-series projection — `app/src/app/landing-evolve/r44/c/`

## Hard gate (`node scripts/gate.mjs --target web --routes /landing-evolve/r44/<v>`, per-candidate)

**1st attempt: all 3 failed.**

| Candidate | 1st-attempt failure |
|---|---|
| a | `lint` error — `react-hooks/set-state-in-effect` in `useMounted.ts:11` (`useEffect(() => setMounted(true), [])`) |
| b | `lint` error — unescaped apostrophe (`react/no-unescaped-entities`) in `page.tsx:306`; **`a11y` 96 — hard-fail promoted audit `target-size`** |
| c | **`a11y` 94 — score below the 95 threshold**, driven by `aria-valid-attr-value` |

**Root-cause diagnosis** (orchestrator, direct axe-core + Playwright access, not counted against any candidate's 1-fix allowance — per this project's established precedent for orchestrator-direct root-causing):
- The combined 3-route gate call doesn't attribute a11y failures to a specific route (`worstLighthouse` takes the worst Lighthouse score across all routes in one call) — re-ran `gate.mjs` once per candidate individually to localize each failure, per the skill's own prescribed per-candidate gating method.
- **b's target-size**: direct axe-core run (with the `wcag22aa` tag included — the gate's own default `wcag2a`/`wcag2aa` tags miss the WCAG 2.2 target-size criterion, a diagnostic-script gap, not a `gate.mjs` gap) found 4 seller-pin buttons in `radar-map.tsx` with insufficient click-space to their neighbors (3 of the 4 closest-distance sellers cluster near the map's center under the original linear mile→pixel scale).
- **c's aria-valid-attr-value**: direct axe-core run found a Chart/Table toggle button whose `aria-controls` pointed at a panel id that didn't exist in the DOM whenever that panel wasn't the active one — `DepletionChart.tsx` conditionally *unmounted* the inactive panel via a ternary instead of toggling visibility.

**Fixes applied directly by the orchestrator** (rule-violation remediation only, no taste/completeness changes, per §3-1):
- a: `useMounted.ts` rewritten from `useState`+`useEffect` to `useSyncExternalStore`, matching this repo's own already-established idiom for the identical gate (`landing-evolve/r34/a/useMounted.ts`) — avoids the lint rule entirely rather than suppressing it.
- b: `page.tsx:306` apostrophe escaped (`&rsquo;`). `data.ts`'s linear `PERCENT_PER_MILE` mile→pixel scale replaced with a shared `radialScalePct()` sqrt scale, applied identically to both `pinPosition()` and `coverageDiameterPct()` so the wash-circle boundary and pin positions stay geometrically consistent (a pin still sits exactly on the boundary when `distanceMi===radiusMi`) while spreading near-center pins apart enough to clear the 24px target-size/spacing floor.
- c: `DepletionChart.tsx`'s chart/table panels changed from ternary-unmounted to always-mounted with `hidden={view !== "..."}`, so both panel ids exist in the DOM at all times regardless of which is visible.

**Re-gate (per-candidate): all 3 pass clean — 0 violations, a11y 100 across the board.**

| Candidate | route | types | static | lint | weights | sweep | focus | console | a11y | perf |
|---|---|---|---|---|---|---|---|---|---|---|
| a | ✅ | ✅ | ✅ | ✅ | 3종 | ✅ | ✅ | ✅ 0 결함 | ✅ 100 | ✅ 47 |
| b | ✅ | ✅ | ✅ | ✅ | 3종 | ✅ | ✅ | ✅ 0 결함 | ✅ 100 | ✅ 78 |
| c | ✅ | ✅ | ✅ | ✅ | 3종 | ✅ | ✅ | ✅ 0 결함 | ✅ 100 | ✅ 68 |

## Screenshots
`vault/20-generations/2026-10-30-auto-landing-r44/shots/{a,b,c}-{1280,1440,1920,390}[-s35|-s70|-s100].png` — 4 widths × 4 scroll depths (48 frames total), scroll-through pass run before capture to trigger `whileInView` reveals. All 48 frames confirmed non-blank, 0 capture errors.

**Known environment artifact, not a candidate defect**: `images.unsplash.com` product photos render as blank gray placeholder boxes in these screenshots because this sandbox's network proxy blocks that host (consistent with this project's own prior documented instances of the same proxy block). All three candidates' source correctly uses `next/image` with reserved aspect-ratio containers and fixed, deliberately-chosen photo IDs — judges were instructed to judge the code, not penalize the placeholder rendering.

## Judge panel (3 independent blind general-purpose Agent-tool subagents, no cross-lens visibility, candidates/*.md concept notes withheld from all three)

| Lens | 1st | 2nd | 3rd |
|---|---|---|---|
| lens1 — DNA/design-principles.md compliance | **c** | b | a |
| lens2 — commercial landing-page completeness | **c** | a | b |
| lens3 — archetype differentiation | **b** | c | a |

**Clean 2:1 majority for c** (lens1+lens2 vs lens3) — not a tie, no tie-break procedure needed this round (unlike round 1 of this session, which required one).

### Key findings by lens

**lens1 (DNA compliance)**: c strongest on the hero-fold check (product+proof fully visible at scroll-0 at both widths, confirmed in screenshots) and has all four named editorial-density devices (12-col grid, ghost number, Fig captions, oversized quote glyph) plus the full 3-tier tracking scale; contrast math independently re-verified exact. b nearly as strong structurally but its product-preview badges sit below the fold at scroll-0 on desktop (map pushes them down) — confirmed only visible in the s70 scroll frame. **a weakest**: no standalone value-3-split section (only 2 value-prop cards folded into the hero, not 3 in their own section), missing ghost number and Fig captions entirely, generic small quote icon instead of the oversized glyph device, non-12-col grid, only 2 of 3 tracking tiers used; worst hero-fold instance of the three — on mobile (`a-390.png`) **no product card is visible at all** at scroll-0.

**lens2 (commercial completeness)**: All three candidates' core math was hand-verified correct at multiple input values (no inversions or wrong formulas found anywhere). c ranked 1st on the strongest overclaim discipline of the three (explicitly labels its one static comparison as "historical," a footer disclaimer, zero blanket liveness claims) plus the richest page structure (only candidate with a true dedicated features section beyond the hero). a ranked 2nd, correct and honest but comparatively thin (no separate feature section, only 2 testimonials, minor stepper-button hover-state gap, mobile label truncation). **b ranked 3rd on a real, independently-verified defect**: the closing CTA and a "See what's in range" button both cite the live `stats.inRangeCount`, but the listings grid they link to (`#listings`) always renders the same fixed 3 `LISTINGS` items regardless of `radiusMi` — at low radius settings (e.g. 1-3mi, within the slider's own 1-25mi range) the page can literally say "See the 0 sellers in range" while the linked section still shows 3 full listing cards. This is exactly the live-state/static-content contradiction this project's established causal-consistency doctrine already names, applied to a CTA-destination relationship rather than CTA copy alone.

**lens3 (differentiation)**: b's device (a fixed-pin geographic/distance radial map) and c's device (a single-slider forward time-series depletion projection) are both independently confirmed genuinely new output-visualization types for this catalog — zero code-surface or mechanism collision found against the nearest neighbors (b vs. the existing criteria-radar-polygon device; c vs. r40/b's dual-handle-range→static-histogram). a, as a disclosed reassignment rebuilding its own prior form (`auto-landing-r43/c`), is correctly not penalized for reuse of itself, but ranks last on fresh catalog-expansion value since it's "catalog-stable, not catalog-expanding." **b ranked 1st over c on a within-round finding**: b and c share a near-identical macro section order (hero-with-device-and-product-cards → 3-card value-split → testimonials+stats → closing CTA), and c's file split (`Hero.tsx`/`ValueSplit.tsx`/`SocialProof.tsx`/`ClosingCTA.tsx`) matches `r42/b`'s file-naming scaffolding exactly — the catalog's known, already-established "device differs, lower layers converge" pattern (documented ≥7 times previously per the r40/b ledger entry), with c being the more literal instance of it this round. b avoids the templated file-split (everything inlined in one `page.tsx`) and reads as a more distinct execution of the same underlying shell.

Full per-candidate reasoning, all cited evidence (including hand-verified math at multiple input values per candidate), and each lens's self-disclosed unseen scope are preserved verbatim in DECISION.md.
