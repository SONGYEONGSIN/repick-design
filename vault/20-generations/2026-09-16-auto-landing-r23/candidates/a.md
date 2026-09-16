---
tags: [candidate, auto-landing-r23]
---

# r23/a — The Grading Timeline

One real overcoat listing, scrubbed through repick's five-step grading pipeline (Intake →
Photo Verification → Physical Inspection → Grade Assignment → Price Lock) via a single
drag-handle-plus-tabs control in the hero; the evidence diagram, defect map, certification
checklist, confidence/grade/price, the product-preview condition summary, the value-split
comparison, and the closing CTA's copy all read from the same `stageIndex` and recompute
together — nothing downstream is a hardcoded restatement of the hero's numbers.

Path: `app/src/app/landing-evolve/r23/a/` — `page.tsx`, `client.tsx`, `data.ts`,
`StageScrubber.tsx`, `GradingDiagram.tsx`, `Hero.tsx`, `ProductPreview.tsx`,
`ValueSplit.tsx`, `SocialProof.tsx`, `ClosingCta.tsx`.

## 브리프에 없던 것

**1. Accent hex + contrast math (required by brief, logged here).**
① `ACCENT_FILL = #7A5F28` for solid fills (buttons, active-stage chip, "Grade B+" pill),
`ACCENT_BRIGHT = #D9BE84` for small text/icons/focus rings directly on the dark page, plus
`ACCENT_FILL_HOVER = #63491E` for hover states.
② Computed by hand (WCAG relative-luminance formula): white on `#7A5F28` = **6.01:1** (passes
AA for normal text with real margin, not a "just barely" 4.53); near-black ink (`#0B0B0F`) on
the same fill = **3.27:1** (fails AA — confirms the brief's "dark ink fails at body size on an
accent fill" rule for this specific hex rather than assuming it). `ACCENT_BRIGHT` on the page
background `#0B0B0F` = **10.90:1**; on the card surface `#111116` = **9.83:1**; on the
16%-active-tab-tint (`#7A5F28` at 20% opacity over `#111116`) = **8.76:1** — all comfortably
past the "~9:1" target for small text/icons/focus outlines used directly on dark surfaces.
③ These are the two numbers everything else in the file reuses (Tailwind can't take a
computed/interpolated hex in an arbitrary-value class, so every `bg-[#7A5F28]` /
`text-[#D9BE84]` in the components is a literal copy of these two constants, not a dynamic
reference — `data.ts` still exports `ACCENT_FILL`/`ACCENT_BRIGHT` as the documented source of
truth for anything, like the raw SVG `fill=` attributes, that isn't a Tailwind utility).

**2. Which "unusual warm tone" this is, and why it isn't just amber with a filter on it.**
① Landed on an antique-brass/bronze gold rather than terracotta, and deliberately did **not**
just pick a different hue angle to "escape" amber.
② `ACCENT_FILL` in HSL is `(40°, 51%, 32%)` and `ACCENT_BRIGHT` is `(41°, 53%, 68%)` — i.e. the
same ~40° hue neighborhood as Tailwind's `amber-500` (`#F59E0B` ≈ `38°, 96%, 50%`). The
difference is entirely in saturation and lightness: roughly half the saturation and well below
the lightness of the amber/marigold scale.
③ "Brown" and "gold/brass" aren't a separate hue band from amber in HSL space — they're what
amber's hue looks like desaturated and darkened. Picking a genuinely different hue (into true
orange ~25° or red ~350°) would have landed back in the orange/rose families this round was
explicitly told to avoid; going dark-and-muted instead of hue-shifting is what actually reads
as "vintage brass ledger stamp" instead of "SaaS amber accent," and it's the same technique the
brief's own suggestion ("brown/terracotta *or* gold") implies.

**3. Body-copy measure in px, not `ch`.**
① Hero/closing paragraphs at 16px use `max-w-[493px]`; the 13–15px supporting paragraphs
(hero narrative, product-preview tag detail, closing-CTA form copy) use `max-w-[431px]`.
② `70 chars × 0.44em × font-size-px` → `70×0.44×16 = 492.8 → 493px`; `70×0.44×14 = 431.2 →
431px`.
③ `ch` is banned by the brief (Pretendard reports 0 advance width for it, ~35% too wide) and
this repo's own `/r22/b` had already landed on the identical `493px` figure for 16px body copy
by the same formula — reusing that value instead of re-deriving a slightly different rounding
keeps the catalog's line-length convention consistent rather than introducing silent drift.

**4. Evidence diagram container: min-height, not a forced `aspect-ratio`.**
① `GradingDiagram`'s outer frame uses `min-h-[300px]` (content can grow past it) rather than a
fixed `aspect-[4/3]`.
② All five per-stage layouts were hand-measured against the shortest realistic mobile width
(390px, card padding included); the rubric-bars stage is the tallest (~200px of content) and at
a forced `aspect-[4/3]` + `overflow-hidden` it would clip against the caption reserved in the
bottom padding. Removed every internal `h-full` in the stage variants for the same reason (a
`min-height`-only ancestor doesn't give percentage-height children a definite box to resolve
against, so `h-full` there would silently collapse to auto/0 instead of stretching).
③ The brief's fixed-aspect-ratio rule exists to stop broken **remote image** loads from
reflowing the page. Nothing here is a remote asset — it's SVG/CSS generated at render time — so
the failure mode the rule guards against can't happen, and a hard aspect ratio would only have
traded a real clipping bug for a rule that doesn't apply to this content.

**5. Match score is a constant, not a per-stage field.**
① `ITEM.matchScore` (94%) lives outside `Stage` and never changes as the user scrubs.
② It's buyer-fit — saved size, style board, price alert — set once at intake from the buyer's
own preferences.
③ Grading and buyer-fit are different questions ("is this item in good condition" vs. "is this
item right for you"); tying match% to inspection progress would have implied inspection somehow
makes an item a better *fit*, which isn't true and would have undercut the pipeline's actual
causal story (inspection changes trust and price certainty, not who the coat is for).

**6. Stopped at one line-art figure, not five.**
① Only the Physical Inspection stage (stage 3 of 5) uses an outline illustration (the garment
silhouette with numbered defect markers). The other four stage exhibits — intake manifest,
photo contact sheet, rubric bars, price ledger — are typography/bar/list-based data panels with
no drawn outlines.
② The brief bans "라인아트 장식" specifically because gradient/line-art decoration reads as
generic "blueprint" AI-slop, in the same sentence that assigns this candidate a garment
defect-map as a required surface — a real tension, not an oversight.
③ Resolved it by treating the one outline as evidentiary instrumentation (flat silhouette fill,
solid strokes, no dashed grid, no crosshairs, no dimension arrows — closer to a museum
condition-report figure than a technical blueprint) and refusing to repeat that visual language
anywhere else on the page, so the "blueprint" read has exactly one, functional, non-decorative
occurrence instead of becoming the page's whole aesthetic.

**7. No ghost numbers anywhere.**
① The brief's optional "ghost 넘버" motif is absent from every section; stage numbers are
small, fully-opaque, real-contrast labels (`01`–`05` at `text-[10px]`), never large low-opacity
background digits.
② Any background-tint digit large enough to read as "ghost" would need ≥3:1 against `#0B0B0F`,
and every zinc shade that reliably clears that (zinc-500 at 4.07:1, checked) sits *below* this
repo's own dark-secondary-text floor (zinc-400 minimum) — so a muted ghost number and a
compliant one are close to mutually exclusive on this background.
③ Rather than spend the accent's already-small color budget on a decorative motif with a narrow
safe range, the numbering job went to fully-legible small labels doing real wayfinding work
(which stage is this) instead of atmosphere.

**8. Value-split toggle defaults to "Self-reported," not "Graded."**
① `ValueSplit`'s baseline/live comparator opens on the ungraded baseline.
② The brief requires proof to be "상시노출 기본값" (on by default) with manipulation
*enhancing* it, not gating it — showing the weaker, self-reported numbers first means the
section is already saying something true and specific (a wide, low-confidence range) before
anyone touches a control, and clicking "Graded" is what demonstrates the improvement rather than
what's required to see any data at all.

## 인터랙션 (5종)

1. **Hero scrub** — native `<input type="range">` (24px hit-box, thin visual track) plus five
   click-to-jump stage tabs; drives the diagram, defect map, checklist, confidence/grade/price
   in the hero, the condition summary + discount in Product Preview, the "Graded (stage N)"
   numbers in Value Split, and the summary sentence + email-form context in the Closing CTA.
2. **Product-preview match-tag accordion** — four `aria-expanded` buttons reveal the rationale
   behind each AI-match tag.
3. **Value-split compare toggle** — `Self-reported` vs. `Graded (stage N)`, recomputing all
   three columns (confidence / price-band width / flaws disclosed pre-sale) in place.
4. **Scroll-triggered reveals** — `whileInView` staggers the stats row and testimonials in
   Social Proof (and section headers elsewhere), all with an `useReducedMotion` early-return to
   a plain, fully-opaque `<div>` rather than a stuck `opacity: 0`.
5. **Closing email form** — client-validated (`EMAIL_RE`), idle/ok/error states with
   `aria-live="polite"` messaging, matching the catalog's existing form-feedback convention.

## 타이포·폰트

- Display face: `var(--font-display-grotesk)` on every H1/H2, Latin only (as assigned).
- Body/Korean: default `--font-sans` (Pretendard) throughout; no Korean copy (English-only per
  repo rule).
- Exactly 3 rendered weights: `font-normal` (400, body), `font-semibold` (600, labels/buttons/
  UI chrome), `font-extrabold` (800, headlines + big numeric stats). The one `font-weight: 700`
  in the file is inside an SVG `<text>` glyph (the numbered defect-marker labels), which the
  weight-count rule explicitly exempts.
- All numeric values (`%`, `$`, stage counts, rubric scores, timestamps) use `tabular-nums`.
