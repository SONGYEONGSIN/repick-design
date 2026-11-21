# Candidate A — "The Appraisal Comes First"

A light-themed, near-monochrome editorial landing page whose entire hero is built around a
single device: a generative Repick Appraisal Report — a literal grading-certificate document
with a serial number, a stamped verdict, a signature line and a faint geometric seal watermark —
that recomputes its trust score, verdict stamp and price-fairness verdict live as the visitor
moves a condition-grade selector, a brand-tier selector and two authentication-checklist
toggles. The certificate sits as the dominant 7-column visual directly beside a 5-column stack
of four richly-tagged product-preview cards inside one hero grid (asymmetric 8/4 headline row on
top, 7/5 device/cards row below — deliberately not the banned headline+single-card+full-width-
panel skeleton). The live score and tier thread forward into a methodology section, then into the
closing section's summary sentence and into the closing CTA button's own label
("Browse {tier} pieces on Repick"), so the manipulated state survives all the way to conversion.

## 브리프에 없던 것

1. **Accent hex + contrast math (emerald).**
   Decided: `emerald-600 #059669` for fills/borders/large stamps, `emerald-700 #047857` for
   small text/icons on the light paper surface, `emerald-400 #34d399` reserved for small
   text/icons if ever placed on a dark-ink surface, and ink (`#15140E`) as the text color used
   ON any emerald-600 fill.
   Why: computed by hand (WCAG relative-luminance formula) rather than guessed — emerald-600 on
   white is only 3.77:1 (fails 4.5:1 small-text AA, so it's restricted to non-text/large-text use
   at ≥3:1); emerald-700 on white is 5.48:1 (clears AA, used for all small accent text/icons/eyebrow);
   ink-on-emerald-600 is 4.90:1 (clears AA) while white-on-emerald-600 is only 3.77:1 (fails), so
   every "stamp"/badge chip uses ink text on the emerald fill, never white — this is the opposite
   of what the brief's own example ("brighter tint for small text") suggests, but that example is
   written for a dark-background context; on this candidate's light background the fix for
   emerald-600 failing small-text AA is a *darker* shade (700), not a brighter one. emerald-400 was
   kept in the token file for the one dark-chip scenario (9.61:1 against ink) that this candidate
   ultimately didn't need, but is there in case any future edit adds a dark surface.

2. **Theme exact hex pair.**
   Decided: background `#FAFAF8`, ink `#15140E` (contrast 18.45:1, far above AA).
   Why: a warm near-white/near-black "paper" pair rather than pure `#FFFFFF`/`#000000`, chosen to
   reinforce the certificate/appraisal-document metaphor (physical paper tone) rather than a cold
   SaaS white; arbitrary within the brief's "near-white/near-black, your choice" instruction.

3. **~70-char line-length container widths, with the arithmetic.**
   Decided, per the brief's formula `chars = container-px ÷ (0.44 × font-px)`, solved backward:
   - Hero subhead, 18px → `556px ÷ (0.44×18=7.92) = 70.2 chars` → `max-w-[556px]`.
   - Value-split column body, 14px (`text-sm`) → `432px ÷ (0.44×14=6.16) = 70.1 chars` →
     `max-w-[432px]` (first pass used 494px assuming 16px type and had to be corrected once I
     checked the actual rendered font-size against the formula).
   - Value-split's shorter secondary caption, 12px (`text-xs`) → `370px ÷ (0.44×12=5.28) = 70.1
     chars` → `max-w-[370px]`.
   - Social-proof quote, 17px → `524px ÷ (0.44×17=7.48) = 70.1 chars` → `max-w-[524px]`.
   - Closing-CTA paragraph, 16px (`text-base`) → `494px ÷ (0.44×16=7.04) = 70.2 chars` →
     `max-w-[494px]`.
   Why: the brief explicitly bans `ch`-unit sizing and requires the arithmetic to be shown; each
   width was solved for ≈70 chars and re-checked against the 75-char ceiling with margin to spare.

4. **Scoring model for the certificate (weights, bands, baseline).**
   Decided: grade weights Good 22 / Excellent 32 / Mint 40; tier weights Core 18 / Premium 27 /
   Designer 35; each checklist item worth 12; a fixed category-average baseline of 68/100; fixed
   fair-price bands per tier (Core $120–180, Premium $300–420, Designer $480–650) against one
   fixed listed price of $340.
   Why: invented from scratch since the brief only specifies the *kind* of inputs (grade/tier/
   checklist) and that outputs must be "real displayed numbers," not the actual weights. The
   numbers were chosen so the default state (Excellent + Premium + one checklist item) scores 71
   against the 68 baseline — a deliberate non-zero +3 at rest, satisfying the brief's "seed an
   initial asymmetry" rule — and so that switching tiers visibly flips the fairness verdict
   between "Below Market," "Within Fair Range" and "Above Market" against the one fixed price.

5. **No real brand names.**
   Decided: "brand tier" is abstracted to Core/Premium/Designer rather than naming any actual
   luxury house, and the appraised item is a generic "Structured Top-Handle Bag, Lot 00482."
   Why: the brief's device assignment says "brand-tier selector" generically; naming a real brand
   on a generated demo page risked an unwanted implied endorsement/trademark issue the brief never
   asked for, so I genericized it — same mechanic, invented labels.

6. **Product-thumbnail medium.**
   Decided: four product thumbnails are small deterministic inline-SVG line-drawings (literal
   fixed coordinates per item, no trig/no randomness) rather than photographs.
   Why: the brief explicitly prefers "deterministic SVG/CSS generative art" over photos to avoid
   load-failure/layout-jump risk and any next/image domain dependency — since nothing on this page
   needed a real photo, I skipped `next/image` entirely rather than add an unnecessary dependency
   on an external image host.

7. **Verdict "stamp" treatment for the low-trust case.**
   Decided: the stamp renders as a solid emerald-600 fill (ink text) for Exceptional/Trusted/Fair
   verdicts, but switches to an outlined ink-only stamp (no emerald) with an AlertTriangle icon for
   the "Caution" verdict.
   Why: the brief leaves hue semantics free, but using the one accent color for a *bad* verdict as
   well as good ones felt like a judgment call worth making deliberately rather than by default —
   keeping the accent reserved for positive/neutral outcomes reads as more honest for a trust
   product, and color is still never the only signal (icon + text label change too).

8. **Hero grid proportions.**
   Decided: row 1 is an 8/4 split (headline+subhead+CTA / a short "live simulation" caption column
   with a border rule), row 2 is 7/5 (certificate device / stacked product-card list), both inside
   one hero grid.
   Why: the brief explicitly bans the "headline-7 + single-card-5, device-12-below" skeleton used
   previously; this reverses which element is dominant (device, not a single card) and adds a
   second top row instead of a bottom full-width panel, while still satisfying "device as the
   single dominant hero visual, cards alongside it."

9. **Social-proof stats.**
   Decided: "48,210 certificates issued to date" and "1 in 6 listings flagged for reinspection
   before going live," both fixed literals.
   Why: the brief bans the specific "$ paid out to sellers + 72 hrs payout time" stat pairing
   verbatim; these are a different pair, chosen to reinforce the grading/inspection theme rather
   than payments, and are presented as fixed historical figures, never framed as something the
   page "recomputes" or "re-pulls" on a schedule.

10. **Fixed issue date and serial.**
    Decided: `Oct 12, 2026` and `RPK-24-00482-A`, both hardcoded strings.
    Why: `new Date()`/`Date.now()` are banned for determinism; a certificate needs *some* printed
    issue date and serial, so both are fixed literals invented to look plausible rather than
    computed, consistent with the lot number used in product-copy elsewhere on the page.
