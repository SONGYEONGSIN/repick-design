# r13 / c — "Reorder"

**One-line concept:** A two-pane control board where the buyer drags their priorities into
order (keyboard-operable up/down) and a live match board re-ranks every listing in real
time — card order, match%, and the "why it ranks here" line all recompute from the order.

- **Macro skeleton:** two-pane control + board (left = ordered priority list, right = ranked
  match board). Not a hero+single-viz, not a timeline, not a live-feed console.
- **Input × output combo:** ordinal REORDER of a priority list × a ranked board whose cards
  carry a per-card reasoning sentence. One reorder recomputes ≥3 surfaces at once: the card
  ORDER re-sorts, every card's match% recomputes, and every card's reasoning line updates to
  cite the now-top priority (plus the priority-list rank badges renumber).
- **Theme:** dark (#0B0B0F). **Accent:** sky/blue only, near-monochrome. **Display face:** none —
  Pretendard throughout, hierarchy from size/tracking/weight. **Weights:** exactly 3 (400/600/800).
- **Interactions:** (1) priority up/down reorder, (2) per-card "Explain this match" expander that
  ADDS detail without gating the always-shown proof, (3) scroll-triggered reveals via framer-motion
  (reduced-motion gated, resolve visible), (4) segmented board filter (All / Verified only / Under $100).

## 브리프에 없던 것

**1. Accent fill hex (brief suggested #0284c7 for white small text)**
① Which sky value carries small white text on fills (CTA, active segment, top-rank badge).
② Used sky-700 #0369a1, not the suggested sky-600 #0284c7.
③ #0284c7 on white measures 4.11:1 — below AA 4.5 for small text; shared-constraint §8 says go one
   step darker rather than sit at a barely-passing value. sky-700 measures 6.0:1. sky-400 #38bdf8
   (9.9:1 on BG) stays the small accent text/icon color, so the accent is still minimal.

**2. Scoring / re-rank function (brief said "deterministic" but not the formula)**
① How priority order maps to match% and board order.
② Rank r carries weight (N−r) = [5,4,3,2,1]; match% is the weight-average of each listing's
   per-dimension 0–100 fit; board sorts by match% desc, ties broken by original catalog index asc.
③ Ordinal weights are the simplest pure function of position (echoes the weighted-rank pattern in
   r12/a's streamStats averaging), and index tie-break guarantees a stable, random-free order.

**3. Reasoning sentence rule (brief said "cite the now-top priority" but not the wording)**
① What each card's one-line "why it ranks here" says.
② `Ranked for {top priority}: {that listing's evidence clause for that dimension}` — every card
   reads its own detail map keyed by the current top priority.
③ Keeps the reasoning honest per-card (real per-listing evidence, not a templated boast) while
   still refreshing on every reorder, satisfying the "manipulation strengthens always-on proof" rule.

## Line-length math (Pretendard 0.44em glyph width; chars/line = containerPx ÷ (0.44 × fontPx))

- Hero lead: 500px ÷ (0.44 × 17) = 500 ÷ 7.48 = **66.8 ch** ✓
- Value-section intro: 460px ÷ (0.44 × 15) = 460 ÷ 6.60 = **69.7 ch** ✓
- Value-card body: 320px ÷ (0.44 × 14) = 320 ÷ 6.16 = **51.9 ch** ✓
- Testimonial quote: 480px ÷ (0.44 × 16) = 480 ÷ 7.04 = **68.2 ch** ✓
- Closing-CTA body: 460px ÷ (0.44 × 15) = 460 ÷ 6.60 = **69.7 ch** ✓

All body-prose paragraphs ≤ 70 ch. The per-card reasoning line and priority-list note are short
captions (longest rendered string ≈ 70 chars total), not wrapping multi-line prose.
