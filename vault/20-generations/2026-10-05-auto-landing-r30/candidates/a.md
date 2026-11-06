# Candidate A — "What $180 clears this week"

A worked-example landing page built around a single continuous price-ceiling
slider and a bullet-graph budget fit. The page opens on one concretely named
buyer moment — $180, a jacket, this week — and stays in that register: every
section either answers that specific scenario or lets the visitor re-run it
with their own number. The core device is five horizontal bullet-graph rows
(outerwear, sneakers, denim, bags, watches), each drawn from fixed literal
price-band data (steal / fair-market / above-market) with a median-ask tick
and a threshold diamond that tracks the slider. Moving the slider recomputes,
in real time, which band each category's threshold lands in and whether the
typical asking price for that category clears the buyer's number — the
qualitative read is never a static illustration, it is arithmetic on fixed
data run on every input event. The product-preview section ties back to the
same worked example (the $172 jacket from the hero reappears here, alongside
a sneaker that's a steal and a bag that currently sits above market), and the
closing section's entire persuasive line is generated from the live slider
state (`closingLine(price)`), never a frozen number. Visual language stays
near-monochrome (zinc scale on near-black) with a single amber accent used
sparingly but always visibly — on the thumb, the active-band highlight, the
button fills, and the eyebrow labels — never hidden behind hover.

## 브리프에 없던 것

**1. Accent hue + the two mandatory contrast calculations**
- *Decide*: the brief leaves the accent hue open (default `#6E56CF`, but
  "any hue" is allowed) and requires reporting contrast against white and
  against the dark ink color.
- *Decided*: amber, specifically Tailwind's named scale value `amber-500`
  (`#F59E0B`), used via Tailwind utility classes (`bg-amber-500`, etc.)
  rather than a bespoke arbitrary hex. Dark ink = `#0B0B0F` (same as page
  bg, used as the near-black text color on bright fills).
  - **Accent vs. white (`#FFFFFF`)**: relative luminance of `#F59E0B` ≈
    0.439, white = 1.0 → contrast ≈ **2.15 : 1**. This *fails* even the
    large-text 3:1 floor — white text on an amber-500 fill is unusable
    anywhere on this page.
  - **Accent vs. dark ink (`#0B0B0F`, lum ≈ 0.0033)**: contrast ≈
    **9.17 : 1** for ink-on-amber (button/chip text) — clears AA body-text
    (4.5:1) with room to spare, at every size.
  - **Accent vs. bg (`#0B0B0F`) directly** (amber text/bars/borders on the
    page background): same **9.17 : 1** — the accent clears full
    body-text AA on its own, so unlike the brief's purple worked example
    (3.73:1, needs a lighter tint for small text) I didn't need to derive
    a separate tint for small text; I kept `amber-300`/`amber-200` only as
    an even-brighter option for eyebrows/badges, not out of necessity.
  - Net rule actually enforced in code: **amber-500 fills always pair with
    `text-[#0B0B0F]` (ink), never white** — the opposite of the brief's own
    worked example, where white was the safe choice and dark ink only
    cleared the large-text floor. Every button/chip in the page (`Start
    your own budget check`, active preset pills, slider thumb border)
    uses ink-on-amber for exactly this reason.

**2. The five categories and their fixed price-distribution literals**
- *Decide*: the brief asks for 3–5 "realistic resale categories" with real
  market-price bands but specifies none of the actual numbers.
- *Decided*: outerwear ($100/$180/$260, median $168), sneakers
  ($90/$160/$230, median $128), denim ($50/$90/$140, median $74), bags
  ($140/$250/$380, median $205), watches ($180/$330/$520, median $295).
  Outerwear leads the list (ties to the jacket in the hero/worked
  example), and the set was chosen so that at the $180 default exactly
  three categories clear (outerwear, sneakers, denim) and two don't (bags,
  watches) — giving the closing section a genuinely mixed, non-trivial
  live sentence instead of "all clear" or "none clear."
- *Why*: a worked example is only convincing if the numbers actually
  produce a specific, slightly surprising outcome (jacket clears by only
  $12; a bag needs $25 more) rather than a round, obviously-staged one.

**3. Slider range, step, and default**
- *Decide*: brief specifies a "continuous price-ceiling slider" but not
  its bounds or starting position.
- *Decided*: $40–$400, step $5, default $180.
- *Why*: $40 sits below every category's steal floor (so the "nothing
  clears" edge state is reachable) and $400 sits above every category's
  ceiling (so the "everything clears" edge state is reachable too) —
  both branches of the closing-line logic are genuinely exercised by the
  slider's own range, not just the happy-path middle. $180 as the default
  matches the hero's literal worked-example premise.

**4. Theme and display typography**
- *Decide*: dark vs. light is open; a display face is optional and, if
  used, limited to `--font-display-grotesk` / `-wide` / `-mono`.
- *Decided*: dark (`#0B0B0F` bg, matches the brief's own default), and
  `--font-display-mono` (`JetBrains Mono Display`) applied *only* to
  numerals — the headline's "$180", the slider readout, median-ask
  captions, and product prices — never to full headline sentences or body
  copy, which stay on the project's default `--font-sans` (Pretendard).
- *Why*: the whole device is about reading numbers against bands; a
  monospace/tabular treatment on the numerals specifically (not the
  words around them) reinforces "this is a price ticker" without
  introducing a second display face or touching the 65–75 char body-line
  budget, which only governs prose paragraphs.

**5. Color-not-the-only-signal encoding for the bullet bands**
- *Decide*: the brief requires the steal/fair/above bands not be
  color-only, but doesn't specify how to pair them with text.
- *Decided*: three redundant signals per row — (a) a persistent text
  legend row under each bar reading "STEAL / FAIR MARKET / ABOVE MARKET"
  in fixed left-to-right order, (b) the live status sentence spells the
  band out in words ("fair-market tier", "above-market tier"), and (c) a
  check/minus icon (circle + check or circle + dash) marks clears vs.
  short, independent of the amber highlight on the active band.
- *Why*: band position/order alone (steal is always leftmost) would have
  been enough for sighted users but not for screen-reader or
  color-vision-deficient users without the explicit words; tripling the
  signal was cheap and removed any ambiguity.
