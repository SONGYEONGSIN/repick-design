# Candidate b — Provenance

Provenance is a resale marketplace landing page built around one idea: authenticity shouldn't be
a seller's unverifiable claim, it should be a number a buyer can watch get built. The hero carries
an "Authenticity Confidence Meter" — four independent, freely-toggleable boolean checks (serial
number, material scan, expert review, photo-match), each worth a different fixed weight (30/25/25/
20, summing to 100). Toggling any check in any order recomputes a live 0–100 Trust Score, a
qualitative band label ("Unverified" → "Fully verified"), and a per-check checkmark/cross row —
and that same live score drives the sample listing card sitting directly beneath the meter inside
the same Hero component, so the control and its proof are never split across sections. The
Product Preview grid below repeats the exact same scoring function on four fixed listings, each
with its own check combination, and the "Value, three ways" section demonstrates three preset
combinations (including one that lands on the same score as the live default through a completely
different set of checks, to make the point that this is a weighted accumulator, not a count). The
closing CTA headline cites the same live score and label the hero meter computed, via the same
`summarize()` function — never a hardcoded string. Visual language is dark, near-monochrome, with
a single lime/chartreuse accent (`#84CC16`) used sparingly but always present at rest (CTA fill,
progress-bar fill, active-toggle borders), set in `--font-display-mono` for the two display
headlines only, Pretendard everywhere else.

## Brief gaps

1. **Accent hue + contrast calculations (required).** Decision: `#84CC16` (a mid-saturation
   "lime-500"-range chartreuse), used directly as the text/icon/border/fill color at every size,
   with `#0B0B0F` (ink) as the only color ever placed as text ON an accent fill. Why: the
   assignment explicitly warned that bright limes often fail white-text-on-fill contrast at high
   lightness, so I ran the numbers (sRGB → linear → WCAG relative luminance) on several
   candidates before picking one, and recorded the exact result in `tokens.ts`'s header comment:
   - `#84CC16` vs background `#0B0B0F`: **9.94:1**. This clears not just the large-text/fill floor
     the brief's default-hue worked example describes, but body-text AA (4.5:1) directly — so,
     unlike the catalogue default `#6E56CF` (3.73:1, needs a separate lighter tint for small
     text), this hue needed no second "small-text tint" token; the same hex is safe for icons,
     links, and body-size captions directly on the dark background.
   - White text on the `#84CC16` fill: **1.98:1** — fails even the large-text 3:1 floor. This is
     the exact failure mode the assignment flagged: a bright lime is high-luminance, so white text
     sitting on it is low-contrast, not high. White-on-accent-fill is not used anywhere on this
     route.
   - Dark ink (`#0B0B0F`) on the `#84CC16` fill: **9.94:1** — clears body AA with large headroom.
     Every accent-filled element (both CTA buttons, active-toggle checkmark badges) uses ink text,
     the inverse of the default hue's "white on fill" rule. This is a real, calculated difference
     driven by the hue being free, not an oversight of the default guidance.
   I also checked the muted floor `#A1A1AA` against both the page background (`#0B0B0F`, 7.66:1)
   and the card surface (`#141418`, 7.17:1) — close enough that one `MUTED` token covers both, so
   no separate "on-tint" muted variant was needed (unlike a hue sitting right at the AA floor).

2. **Body-column character-count arithmetic (required).** Decision: three fixed pixel max-widths
   — hero subhead 560px at 18px type, section body copy 480px at 16px, testimonial quotes 400px at
   14px. Why: per the brief, Pretendard's mixed-script average glyph advance is 0.44em/char (not
   CSS `ch`, which measures the digit "0" and runs ~35% wider). chars-per-line = container-px ÷
   (0.44 × font-size-px):
   - Hero subhead, 18px: 0.44×18 = 7.92px/char → 560px ÷ 7.92 = **70.7 chars**. A 70-char line at
     this size would be 554px; 560px lands 0.7 chars over target and 16.3 chars under the 75-char
     ceiling (593.5px) — inside budget.
   - Section body, 16px: 0.44×16 = 7.04px/char → 480px ÷ 7.04 = **68.2 chars**, versus a 528px
     75-char ceiling — 48px (6.8 chars) of headroom.
   - Testimonial quotes, 14px: 0.44×14 = 6.16px/char → 400px ÷ 6.16 = **64.9 chars**, versus a
     462px 75-char ceiling — comfortably under.
   Recorded verbatim (with the same arithmetic) in `tokens.ts`.

3. **Check weights (30/25/25/20).** Decision: serial-number match carries the highest weight (30);
   material-composition scan and third-party expert review are treated as equal, strong
   corroborating signals (25 each); photo-match against the manufacturer archive carries the
   lowest weight (20). Why: arbitrary but reasoned — a serial-registry match is the hardest signal
   to forge convincingly, so it anchors the score; material scans and in-person expert review both
   require specialized access a forger rarely has, so they're treated as equally strong; a
   photo-archive match is the weakest of the four because manufacturer archives are incomplete for
   older or regional releases, so a non-match there is less conclusive than a miss on the other
   three. The weights sum to exactly 100, and the top three alone (30+25+25=80) cannot reach the
   90–100 "Fully verified" band — only activating all four can — which was a deliberate choice to
   make "fully verified" mean something.

4. **Trust-score bands.** Decision: 0–39 "Unverified", 40–69 "Partially verified", 70–89
   "Verified", 90–100 "Fully verified" (badge-worthy at 70+). Why: taken directly from the brief's
   own worked example, since it already expresses a clean, evenly-reasoned four-tier scale and
   introducing a different one would have been change for its own sake rather than an improvement.

5. **Dark surface ramp (`#0B0B0F` / `#141418` / `#1C1C24` / border `#2A2A33`).** Decision: three
   incrementally lighter near-black tones plus one border tone, rather than a single flat dark
   background. Why: arbitrary but conventional editorial-dark-mode practice — it lets card/panel
   nesting (hero device card → nested listing preview; scenario card → "live" highlight state) read
   through elevation rather than color, keeping the page genuinely near-monochrome instead of
   reaching for a second hue to show structure.

6. **Font weights (400/600/800).** Decision: `font-normal` (400, body copy and any unstyled text),
   `font-semibold` (600, eyebrows/captions/UI labels/toggle labels), `font-extrabold` (800,
   headings/big numbers/CTA labels/listing titles) — never `font-medium`/`font-bold`/`font-black`.
   Why: the brief requires exactly 3 rendered weights measured by computed style, and Tailwind's
   unstyled-text default of 400 is one of the three allowed weights, so the rule was simply never
   to reach for 500, 700, or 900 anywhere in the route (verified by grep before finishing).

7. **"Value, three ways" device vocabulary vs. the dedup list.** Decision: kept the free-combination
   weighted-toggle accumulator as the device for both the hero and the "Value" section (three fixed
   scenario presets of the same device, with a "Try this combination" button that lifts state into
   the hero), rather than introducing a second, different interactive mechanism for that section.
   Why: the assignment's device brief is explicit that this is NOT the catalogue's existing
   variable-cardinality multi-select-then-filter/count pattern, and the open-delta history (`r52/a`,
   `r53/a`) validates a single device whose state broadcasts to multiple fixed-cardinality regions
   without a chart — reusing the same scoring function across hero, product-preview, value-section,
   and closing CTA is what keeps the "manipulated state survives to the closing CTA" doctrine
   honest everywhere at once, rather than introducing a second mechanism that could drift out of
   sync with the first.
