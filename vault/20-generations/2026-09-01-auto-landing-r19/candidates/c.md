# Candidate C — Handoff Timeline

A light, near-monochrome hero where a single flagship listing's chain of custody renders as a
four-node WAI-ARIA tabs rail — Seller submission → AI grading → Human verification → Buyer match —
and selecting any stage live-recomputes a real cumulative trust score (`31 + Σdeltas`, via
`cumulativeTrustScore()`), the listing's grade/verification badges, and the closing CTA's headline,
all from the same `activeIndex` state and a single `useMemo`.

## 브리프에 없던 것 (what the brief left open)

**① Accent hue + exact hex + computed contrast**
Decided: `#1D4ED8` (blue-700) as the single accent — used directly for text, borders, focus outlines,
and fills. No second "bright" tint variant was needed (unlike a dark-theme accent), because on a
light ground this one hex already clears every threshold on its own. Computed via proper WCAG
relative-luminance (sRGB → linear, 0.2126/0.7152/0.0722 weights), not guessed — full numbers in
`tokens.ts` comments, headline ones here:
- `#1D4ED8` vs white `#FFFFFF`: **6.70:1** (passes body-text AA on its own, no large-text restriction needed)
- `#1D4ED8` vs ink `#18181B`: **2.64:1** (fails even the 3:1 large-text floor)
- `#1D4ED8` vs zinc-100 `#F4F4F5` (console surface): **6.10:1**
- `#1D4ED8` vs zinc-50 `#FAFAFA` (closing-CTA panel): **6.42:1**
- White text on `#1D4ED8` fill: **6.70:1** (same ratio, symmetric) → passes 4.5:1 comfortably
Why blue: brief bans violet (most overrepresented in the catalog) and I wanted a hue distinct from
r18's amber; a deep "ink-stamp" blue reads as a customs/manifest stamp color, which fits a
chain-of-custody concept without leaning on amber's "calibration instrument" territory again.
Because `#18181B` on `#1D4ED8` fails (2.64:1), every accent-filled surface (CTA button, submit
button, active tab-node fill) uses **white** text/icon, never dark ink — the opposite convention
from r18's amber, and confirmed by calculation rather than assumed.

**② Body paragraph container width / font-size / chars-per-line**
Decided: the hero subhead and every primary section subhead use `font-size: 16px` inside
`max-width: 480px`. Computed with the mandated 0.44em-per-glyph constant, not `ch`:
`480 / (0.44 × 16) = 68.18` chars/line — inside the 70-char target, under the 75-char ceiling.
Narrower supporting columns (value-split body at 15px/300px, testimonial quotes at 14px/300px) use
smaller boxes deliberately: `300 / (0.44 × 15) = 45.45` chars and `300 / (0.44 × 14) = 48.7` chars —
both well under the target, which is the correct direction for a multi-column layout where each
column is meant to read as a short, self-contained note rather than a full paragraph.

**③ Reference listing, stage deltas, and the baseline the trust score is built from**
Decided the anchor listing: a Chanel Classic Flap (medium, caviar leather), $4,380 from $5,900
(−26%, computed via `discountPct()`, not hardcoded). Fixed an implicit `BASELINE_TRUST = 31` (the
default trust of an unlogged, unclaimed item — never shown on its own, only summed from) and four
stage deltas that never change: submission +9, AI grading +24, human verification +21, buyer match
+11 — chosen so the running total (`cumulativeTrustScore`) lands at 40 → 64 → 85 → 96, a monotonic,
believable curve that never hits a suspicious round number or maxes out at 100. A luxury handbag was
picked specifically because authentication language (serial match, hardware inspection, maker
archive) makes the four-stage rationale concrete, and resale authentication is a genuinely
high-stakes real use case for this exact product shape.

**④ Default stage — and why it's the LAST one, not the first**
Decided the hero opens on stage index 3 (Buyer match), not stage 0. Reasoning: the brief requires
the default state to show real, non-empty proof, and a chain-of-custody device's most honest
"default" is the listing's *current* custody state — fully verified and matched — with the visitor
free to scrub backward through history to see how it got there. Opening on stage 0 would default the
whole hero into un-verified, pending-everything language ("not yet verified," "not yet eligible"),
which is a much weaker first impression and arguably closer to "hidden behind interaction" in spirit
even though technically non-empty. Scrubbing backward from a completed state reads as inspecting a
record; scrubbing forward from an empty one reads as watching a form fill in.

**⑤ Stage-selector mechanism: WAI-ARIA tabs, not a slider**
Built the rail as a proper `role="tablist"` / `role="tab"` pattern with roving `tabIndex` (only the
active tab is in the natural Tab order) and manual `ArrowLeft`/`ArrowRight`/`Home`/`End` handling that
moves both selection and focus together (`Timeline.tsx:32-42`). Rejected a native
`<input type="range">` scrub control as the *primary* mechanism — it would have needed the same
custom-thumb CSS the brief flags as focus-visibility-risky (`[&::-webkit-slider-thumb]`), and a
discrete 4-position "scrub" is really just a tab list with extra steps. The tabs pattern gives real
keyboard scrubbing (arrow keys move through stages exactly like scrubbing a timeline) with a
well-defined, testable ARIA contract instead of a bespoke one.

**⑥ Ghost stage numbers — the exact zinc-500-on-zinc-100 trap the brief warned about**
First pass colored the "01–04" ghost numerals `MUTED` (`#71717A`, zinc-500). They sit inside the
console panel, which is `SURFACE` (`#F4F4F5`, zinc-100) — and `#71717A` on `#F4F4F5` computes to
**4.40:1**, failing the 4.5:1 floor at the numeral's smaller responsive sizes (which drop under the
24px large-text threshold on narrower viewports). Caught this by re-deriving contrast per actual
background, not assuming the BG-level number carried over, and switched every text/icon color that
lives on `SURFACE` — ghost numbers included — to `MUTED_STRONG` (`#52525B`, zinc-600, **7.03:1** on
`#F4F4F5`). Kept the numerals visually "ghost" through size (they shrink at narrow viewports),
weight (400, the lightest of the three approved weights), and restrained tracking, exactly per the
brief's "hierarchy via size/weight, not color" guidance — not by cheating the color floor.

**⑦ Product images — known unverified risk**
Used four fixed, content-matched `images.unsplash.com/photo-<id>` URLs (handbag, watch, mountain
bike, sneakers), each inside a fixed-aspect-ratio box with a `#F4F4F5` background placeholder so a
failed load never collapses a card. Confirmed via a direct `curl` probe from this sandbox that
outbound HTTPS to `images.unsplash.com` is rejected at the proxy here (`connect_rejected`), so the
IDs are hand-picked for content match but **could not be verified to resolve** — the same class of
environment artifact this project has documented before (r12, r15, r18). Flagging explicitly rather
than silently hoping.

**⑧ Interaction inventory (need: 4 distinct types)**
1. Hero: the stage-selector tab rail — click or `←`/`→`/`Home`/`End` keyboard navigation, live
   recomputes trust score, grade, verification badge, and stage narrative in place.
2. Scroll-triggered reveal (`framer-motion` `whileInView`, `once: true`, gated by `useReducedMotion`
   so the resting state is always the finished, fully-visible one — never a stuck `opacity:0`).
3. Product-preview interaction: per-card "Full AI matching rationale" disclosure
   (`aria-expanded`/`aria-controls`, keyboard-operable), with a first tier of match-reasoning tags
   already visible without interaction.
4. Closing-CTA email capture with client-side pattern validation and an `aria-live` status region
   (idle/invalid/success) — no fake async delay, no `Date`/`Math.random` anywhere in the route.

**⑨ Focus-visible styling**
Avoided both dead idioms the brief calls out: no `ring-2`/`ring-offset-*` anywhere, and `outline-none`
does not appear once in any file in this folder — every interactive element (tab buttons, disclosure
buttons, CTA link, submit button, email input) uses
`focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2` (or `-4` on the pill
CTA) with an explicit `outlineColor: ACCENT`, which is a real `outline` property, not the
box-shadow-based ring hack. Specifically audited the stage-tabs' *post-interaction* active state
(the high-risk area called out for this archetype): an active tab still renders its own
`focus-visible:outline` on top of its filled accent background when tabbed to, since outline paints
outside the border box regardless of the button's own fill/border styling — verified no interaction
path resets or fights that outline.

**⑩ Display face and the mono-metric overflow it almost caused**
Picked `--font-display-mono` (JetBrains Mono Display) over `--font-display-wide` — grotesk is banned
this round, and a monospace face fits the "shipping manifest / customs stamp" register of a
provenance timeline better than a humanist wide face would. Used it for every heading and every
tabular-nums stat, never mixed with a second display face. The catch: monospace glyphs run ~0.6em
advance width per character (vs. a proportional face's ~0.5-0.55em), so my first h1 draft — a 2-line,
forced-`<br/>`, `clamp(2.5rem,3vw+1.75rem,4.75rem)` headline in a 6-column, ~457px-wide box at the
1280px test width — would have needed `"Logged in order."` (17 chars) at up to 76px, i.e.
`17 × 0.6 × 76 = 775px`, nearly double the available column width. Fixed by widening the hero to a
6/6 column split (556px column at the tightest 1280px test width, computed as
`6 unit-cols × 59.33px + 5 internal gaps × 40px`), rewording the second line to `"On the record."`
(14 chars), and re-deriving a safe clamp ceiling: `556 / (0.6 × 14) ≈ 66px` max before the 14-char
line would wrap, so I set the ceiling to `3.75rem` (60px) for real margin
(`clamp(2.25rem, 2.4vw + 1.6rem, 3.75rem)`). Every other heading in the page uses natural wrapping
(no forced `<br/>`), which sidesteps this class of risk entirely since a wrapping heading just grows
taller, never wider than its box.

**⑪ Font-weight audit (need: exactly 3, render-measured)**
Weights in use: `400` (`font-normal` / explicit `fontWeight:400` — body copy, inactive tab labels,
ghost numbers), `600` (`font-semibold` / explicit `fontWeight:600` — eyebrows, labels, buttons,
badges, the active tab's label), `800` (explicit `fontWeight:800` — h1/h2, all tabular-nums stats).
Verified no element relies on an unstyled native default that could leak a 4th weight — every
`<h1>`/`<h2>`/`<h3>` sets its own weight explicitly rather than trusting Tailwind's preflight
`font-weight: inherit` reset, and the one `<strong>` in the copy (`ValueSplit.tsx`) is explicitly
pinned to `600` rather than left at the browser's native bold (`700`).
