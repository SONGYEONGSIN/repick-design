# Candidate b — "Counterweight"

**Archetype:** Physical balance-beam scale (fulcrum + two pans) that visibly tips toward whichever side carries more evidence — a generic secondhand listing (price only, sparse) vs. repick's AI match for the same item (match%, condition grade, verified-seller badge, before/after discount). Not a gauge dial, not a calculator, not a graph.

**Core interactions (4+):**
1. **Scroll-triggered tip-in** — the beam starts flat and only rotates toward the heavier (repick) pan once the hero scrolls into view (`onViewportEnter`, transform/opacity only, `prefers-reduced-motion` gated, no wall-clock/`Math.random`).
2. **Weighted-priority recompute (manipulation = value)** — three keyboard-operable radiogroups (Style fit / Budget / Condition, each Low/Balanced/Top priority) feed a pure deterministic formula (`computeMatch` → `computeAngle` in `data.ts`) that recalculates both the right pan's match% *and* the beam's tilt angle live — real arithmetic, not a decorative wiggle, and the pans also drift vertically (`Math.sin`-derived, no randomness) to sell the physical tip.
3. **Product-preview card hover/focus lift** — four rich cards, each with match%, condition grade, verified-seller badge, and before/after discount all visible at rest (never hover-gated); hover/focus adds an additive lift + image scale.
4. **Scroll-triggered section reveals** — staggered hero entrance, ghost-numbered 3-way method split, stat band, and testimonial all animate in on `whileInView`.

**Differentiation from prior forms:** No radar/scan console, no vertical timeline, no drag-reveal slider, no snap-scroll deck, no masonry filters, no chat transcript, no calculator/stepper, no swipe cards, no 3D tilt/filmstrip, no comparison table/tabs, no gauge dial, no closet-rail drag, no search-chip index, no wax-seal certificate, no receipt recompute, no split-flap board, no equalizer bars, no annotation pins. This is a literal physical balance-scale metaphor — discrete click/keyboard toggles recompute a beam's tilt and a pan's evidence numbers simultaneously, which is a distinct interaction shape from all of the above.

Files: `src/app/landing-evolve/r8/b/{page.tsx,ui.tsx,data.ts,BalanceScale.tsx,ProductPreview.tsx}`
