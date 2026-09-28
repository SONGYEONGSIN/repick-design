# Candidate b — Authentication Confidence Ring

One-line concept: a light-theme landing built around the **Authentication Confidence Ring** — a
fixed-slot, multi-segment radial arc (one arc per verification method: visual inspection,
serial-number lookup, expert review, provenance check) that visitors toggle with a discrete
multi-select; each method owns a permanent angular slot sized to its own weight, toggling swaps
that slot between accent-filled and track-gray, and the ring's total colored sweep is always
exactly the confidence percentage shown at its center — no separate gauge, no renormalization step,
no single-value dial.

Route: `app/src/app/landing-evolve/r25/b/` — `page.tsx`, `client.tsx`, `data.ts`, `ring.tsx`.

## 브리프에 없던 것

1. **Ring geometry: fixed weighted slots + a real numeric gap, not round end-caps.** The brief asks
   for "toggling adds/removes its arc segment and changes the segment weighting." I resolved this
   as: each method has a fixed weight (24/27/31/18, summing to exactly 100) and a fixed angular slot
   (`weight/100 * 360deg`) in a fixed clockwise order, built in `ring.tsx`'s `buildSlots()`. Toggling
   a method doesn't resize other segments — it swaps that one slot between the accent color (active)
   and a neutral gray track (inactive). Because weights sum to 100, the ring's total colored sweep
   is *always* mathematically equal to the confidence percentage at the center — the two numbers can
   never drift apart, which is the strongest version of "recomputing a total confidence percentage"
   I could build. I originally considered redistributing remaining segments to fill the circle when
   one is toggled off (a "true" pie-chart renormalization), but that would decouple the ring's visual
   fullness from the literal confidence number (a renormalized ring is always 100% full regardless of
   how few methods are on), which contradicts the "shown at the ring's center" requirement reading
   the ring as the source of the number. I also switched from `strokeLinecap="round"` to `"butt"`:
   with round caps, the visual bleed at `strokeWidth=22` extends each segment by roughly 7deg per end
   at this radius, which would have eaten the 5.5deg gap I use for segment separation and made
   adjacent active segments visually merge into one blob at the default 3-of-4 state — defeating the
   "visibly distinct segments, not a single dial" requirement. Flat butt caps keep the math exact.

2. **Accent hue + computed contrast (required by the Color Tokens section).** Chose **sky**
   (`#0284C7` / `#0369A1`), an explicitly underused hue per the diversity-steering list, on a light
   theme (bg `#FFFFFF`, alternating section tint `#F5F5F4`, ink `#131316`). Computed via WCAG relative
   luminance (not eyeballed):
   - `#131316` (ink) vs white: **18.54:1**.
   - `#0284C7` (raw accent — ring's active arc fill, borders, large text) vs white: **4.09:1**.
     Clears the 3:1 large-text/non-text floor; does *not* clear 4.5:1, so it is never used for small
     text in this build.
   - `#0369A1` (accent-strong — small text, icons, focus rings, and any accent-filled surface that
     carries text) vs white: **5.93:1**. White text on `#0369A1` fill: **5.93:1** (same pair, passes
     AA 4.5:1) — used for every filled button/active-chip label.
   - `#52525B` (single muted token, used for all body/caption text) vs white: **7.74:1**, vs the
     `#F5F5F4` tint section: **7.10:1**. I deliberately used one muted gray everywhere instead of a
     lighter one for white-only sections, because the base token the brief supplies (`#A1A1AA`)
     computes to only **2.56:1** on white — below even the 3:1 large-text floor — so it's unusable on
     a light surface at all; I did not carry it into this build in any text role.
   - `#71717A` (ghost/decorative numbers only, ≥28px, needs only 3:1) vs white: **4.83:1**, vs tint:
     **4.43:1**. Both clear 3:1 with margin.
   - **Light-theme adaptation of the brief's dark-theme-authored rule**: the Color Tokens section
     says small text needs a "brighter tint" of the accent. That phrasing assumes a dark base (where
     brighter = more contrast). On a light base the opposite is true, so I used a *darker* accent
     step (`#0369A1` vs the raw `#0284C7`) for the small-text/icon/focus-ring role instead — same
     intent (a second, higher-contrast step of the one hue), inverted direction for the theme.
   - No second accent hue for data-encoding. The one candidate for a second hue was the email-form
     error state, where I used a semantic red (`#B91C1C`, 6.47:1 vs white) purely for form validation
     — I'm treating that as a standard semantic UI color, not a "second accent" in the data-axis
     sense the brief means, since it doesn't encode a chart/data split.

3. **Body copy width arithmetic (required by the Body copy width section).** Body paragraphs are
   16px with `max-w-[490px]` containers. `490 / (0.44 × 16) = 490 / 7.04 ≈ 69.6` characters per line
   — under the ~70-72 target and comfortably under the 75 ceiling. I reused this exact container
   width for every body `<p>` in the route (hero subhead, section intros, closing paragraph) rather
   than computing a bespoke width per section, so the ceiling holds everywhere without per-instance
   arithmetic.

4. **Two independent breakdown surfaces feeding the same state, one read-only.** The brief's
   "manipulated value must stay alive to the end of the page" requirement pulled the hero's toggle
   state through the metric cards and the method-by-method list in the Ring section, and into the
   closing CTA's copy. I added a *second*, separate interactive surface in the product-preview cards
   (a per-listing "view verification breakdown" accordion) that is deliberately **not** wired to the
   hero's global toggle state — each listing shows its own fixed, already-decided method mix (e.g.
   the Leica card only ran 2 of 4 methods, the Canon lens ran all 4). I chose this split so the
   "product-preview interaction" required by the brief is a genuinely distinct interaction from the
   "hero interaction," rather than the same control duplicated in two places, while still keeping the
   thematic throughline (methods → confidence) intact across sections.

5. **Domain images.** `images.unsplash.com` was unreachable from this sandbox to verify photo IDs
   directly (proxy policy rejects the host), so instead of guessing new fixed IDs, I reused four
   photo IDs already load-bearing elsewhere in this repo's marketing routes
   (`1489987707025-afc232f7ea0f`, `1543076447-215ad9ba6923`, `1560243563-062bfc001d68`,
   `1608256246200-53e635b5b65f` — all camera/lens photography), on the reasoning that IDs already
   shipped in multiple existing routes in this same codebase are the safest available evidence of a
   working, fixed, non-random Unsplash photo ID without live network access.

6. **Exactly 3 rendered font weights.** Used `font-normal` (400, body), `font-semibold` (600, nav/
   buttons/chips/stat labels), and `font-extrabold` (800, headings + the ring's center number) —
   and avoided `font-bold` (700) and `font-medium` (500) everywhere, including inside the framer-
   motion `AnimatePresence` accordion panels, since those are only reachable by interacting and
   wouldn't be caught by a first-render scan.
