# Candidate a — Isobar

**Concept**: Isobar is an edge-network operations console (CDN/PoP health monitoring) — a hex-tile choropleth of 16 global points of presence paired with a live incident feed, built for an ops team watching uptime and incidents across regions in real time.

**Interactions implemented** (5, all `use client`, deterministic, `motion-reduce`-gated):
1. Incident feed tabs (Active / Resolved / All) — filters the scroll-spine feed only.
2. Region table segmented control (All / Degraded / Critical) — filters the fallback table only, independent of the tab filter above.
3. Region table column sort (Region / Status / Up / Inc.) with real `aria-sort`, toggling asc/desc.
4. Selection sync: clicking a feed item or a hex tile sets one shared `pinnedRegionId`; the hex map (ring + scale) and the table row (tinted row) both reflect it. The map always shows all 16 regions regardless of the two filters above — narrow fan-out, not broadcast.
5. ⌘K command palette (global keydown listener) searching regions and incidents, selecting either sets the same pin.
Plus the form's required non-persistent hex-tile hover tooltip, done with `group-hover`/`group-focus-within` CSS only — no React state involved in showing/hiding it.

**Font/typo confirmation**: body and all copy on `--font-sans` (Pretendard, global default, not set explicitly). The wordmark "Isobar" in the sidebar brand lockup is the only text set in `--font-display-mono`, applied exactly once, no second display face anywhere. Exactly 3 rendered font weights used across the whole route: `font-normal`, `font-medium`, `font-semibold` (verified by grep — no `font-bold`/`font-light`/etc. anywhere).

**Color-contrast self-check** (per the reassignment's defect #1 — computed with the real WCAG relative-luminance formula, not eyeballed): `text-zinc-400` on `bg-zinc-900` ≈ 6.9:1; `text-zinc-50` on `bg-zinc-900` ≈ 17:1. Hex-tile text is `text-zinc-950` on solid status fills — green-500 ≈ 8.7:1, amber-500 ≈ 9.3:1, red-500 ≈ 5.3:1, sky-500 ≈ 7.2:1 — all computed, all clear AA (4.5:1) with margin; an earlier draft used `opacity-80` on the uptime line, which alpha-blends toward the red-500 fill and drops to ≈4.4:1 (fails), so that opacity was removed before finalizing.

## 브리프에 없던 것

- **Region/incident roster (16 PoPs, 8 feed items) and which ones are unhealthy.** Brief gave the form and the "most severe region defaults the pin" rule but no actual dataset. Based on: realistic CDN PoP naming (IAD/LHR/SIN/etc., matching how real edge networks label nodes) + hand-picked severity distribution (1 critical, 2 degraded, 1 maintenance, 12 healthy) chosen to give the map/table visible color variety without making the page look broken.
- **Hex grid as CSS `clip-path` tiles in a plain 4×4 grid, not true tessellated/offset SVG hexagons.** Brief said "hex-grid" but not the implementation. Based on: avoiding SVG trig-coordinate math and absolute-positioning risk (tooltip overflow at viewport edges) entirely — a uniform `grid-cols-4` of clip-path hexagons scales correctly at every width from 390px to 1920px with zero custom math, which was judged a better trade than a more "literal" honeycomb.
- **Which two feed-filter controls to call "tabs" vs. "segmented control."** Brief's completeness bar lists both as separate required components without saying where either goes. Based on: the repo's own component checklist (both must exist) + keeping their effects non-overlapping (one filters the feed, the other filters the table) so they read as genuinely different controls rather than two skins on one filter.
- **Letting hex tiles themselves also set the pin (not just the feed).** Brief's structural directive says "feed→map," singular direction. Based on: general convention for map/geo consoles (clickable map markers are expected) plus the accessibility need for tiles to be keyboard-operable at all — decided this stays "one axis, two entry points" rather than a second competing axis, so it doesn't violate the narrow-fan-out guidance.
