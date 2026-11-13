# Candidate a — "Instant Appraisal Configurator"

One line: four independent fixed-choice question groups (category / condition / accessories /
photo quality) feed one pure deterministic pricing function, displayed in a live estimate card
inside the hero itself; a cash/trade-credit toggle transforms the same center value a second way,
and the closing CTA echoes the exact same live numbers.

Theme: light · Accent: rose (`#E11D48` large / `#BE123C` small, two-shade split, math in `tokens.ts`)
· Display face: `--font-display-grotesk`.

## 브리프에 없던 것

1. **Accent hue + contrast calculation.** The brief's accent is a free hue choice with a required
   contrast calculation (`design-principles.md` §Color Tokens). Picked rose over this round's
   catalog-variety-survey-avoided hues (amber/teal, both at 8 uses, and this round's last-3-winner
   hues orange/cyan/amber). Computed by hand (sRGB → linear → WCAG relative luminance, no tool
   access in this environment): rose-600 (`#E11D48`) on white = 4.66:1 (passes AA everywhere, but
   with only 0.16 of margin — too close for this catalog's own no-just-barely posture on small
   body text), so a second shade, rose-700 (`#BE123C`) = 6.29:1, carries every small-text/icon/
   focus-ring role instead. Large text, fills, and borders use rose-600; white text on a rose-600
   fill is the same 4.66:1 pair, so the fill itself is safe at any size.
2. **Body-paragraph container width.** Brief gives the character-count target (~70, ceiling 75) and
   the Pretendard average-advance constant (0.44em) but not a literal pixel width. Picked `500px`
   at 17px body size → 500/(0.44×17) ≈ 66.8 characters, inside the target with margin.
3. **Exact pricing/confidence arithmetic.** The brief asks for "조작이 표시되는 핵심 증명을 실시간
   갱신"하는 기능 조건 but not literal numbers. Built a fully deterministic lookup-table model
   (`model.ts`): category base price × condition multiplier × accessories multiplier → center;
   ±12% band; confidence = clamp(70 + condition delta + photo delta, 40, 97); comparable count =
   category base × photo factor. No `Math.random`/`Date.now` anywhere.
3. **Which control persists to the closing CTA.** The brief's L2 rule only says manipulation state
   must survive to the close; it was my call to literally restate the live price band, confidence,
   and comparable count there rather than a shorter derived summary — chosen so the CTA is
   independently falsifiable against the hero card (same numbers, not a paraphrase).
4. **Radio-pill keyboard pattern.** Used real native `<input type="radio">` elements (visually
   hidden, sibling `<span>` styled as the visible pill) rather than a custom ARIA radiogroup, to
   get native arrow-key roving and Tab semantics for free and avoid this catalog's own documented
   custom-widget keyboard-operability failure mode.
