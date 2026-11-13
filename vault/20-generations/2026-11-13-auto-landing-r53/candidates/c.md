# Candidate c — "Price × Condition Plot"

One line: six real listings plotted as points on a price-versus-condition plane; clicking a point
selects it and a live detail panel (photo, match/grade/verified/discount badges, price, condition
meter, AI-match reason) updates beside the plot inside the hero itself.

Theme: light · Accent: lime (`#65A30D` large / `#4D7C0F` small, two-shade split like the catalog's
amber precedent, math in `tokens.ts`) · Display face: `--font-display-mono`.

## 브리프에 없던 것

1. **Accent hue + contrast, and which shade carries fill text.** Lime has only 2 prior catalog
   uses, picked to maximize variety alongside a (rose) and b (indigo) this round. Computed by hand:
   white text on a lime-600 fill = 3.09:1 (fails body AA) but dark ink on the same fill = 6.36:1
   (passes everywhere) — lime behaves like this catalog's documented amber case (a *light* accent),
   so every fill in this candidate uses dark ink, never white. lime-600 text directly on white is
   also only 3.09:1 (large-text only), so small text/icons/focus ring use the darker lime-700
   (4.99:1 on white) instead.
2. **Plot coordinate math.** The brief doesn't specify how to turn two numeric attributes into a
   2D position. Computed each point's `xPct`/`yPct` by hand as literals in `data.ts` (condition
   score mapped linearly to roughly 6–94%, price mapped inverted to roughly 8–88% within this set's
   own $60–$300 span), rounded to 2 decimals — no runtime trigonometry or scaling function, so the
   server and client always paint the identical position.
3. **Hit targets as real `<button>`s, not SVG shapes.** Chose absolutely-positioned native `<button>`
   elements (28px, `aria-pressed`, a descriptive `aria-label` naming the item/price/condition) over
   an SVG `<circle>` with a click handler, specifically for free keyboard focus/activation and to
   avoid re-deriving SVG accessibility semantics from scratch.
4. **Point spacing.** The brief's target-size floor (24×24, 2026-08-17 hardfail) constrains the 6
   fixed positions; chose spreads with the two closest points roughly 40px apart at a conservative
   mobile-container estimate (~358×268px) specifically so no two 28px targets' hit areas touch.

## Known tension, surfaced honestly

`design-principles.md` §3 already lists "연속 2D 좌표 플롯(r21 — 슬라이더 두 값이 그대로 마커의
x/y가 되고 고정 기준점 최근접이웃으로 분류)" among this catalog's already-used output forms. This
candidate's *output* axis (a 2D coordinate plane) is the same as r21's. The *input* axis differs —
r21 is continuous (two sliders the user drags to place a new point, classified by nearest neighbor)
while this candidate is discrete (clicking to select among six already-plotted, fixed real
listings) — but per this project's own input-axis × output-axis reuse test (`curation-criteria.md`
"Q6 판정"), sharing the output axis with a documented precedent is a real differentiation risk this
note is surfacing rather than hiding, not a claim of clean novelty.
