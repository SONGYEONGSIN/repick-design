# Candidate b — "Comparison Tray"

One line: a sortable grid of six real matched listings, each independently toggleable (max 3) into
a literal live side-by-side attribute table (price, match score, condition, seller rating, ships
in), with the closing CTA naming the current leader by match score among whatever is selected.

Theme: light · Accent: indigo (`#4F46E5`, single hex safe in every role, math in `tokens.ts`) ·
Display face: `--font-display-wide`.

## 브리프에 없던 것

1. **Accent hue + contrast.** Indigo chosen to be distinct from candidate a (rose) and c (lime) in
   the same round, and from this round's banned/avoided hues. Computed by hand: indigo-600 on white
   = 6.29:1 (same luminance pair makes white-on-fill identical) — one hex is safe in every role
   here, unlike a's two-shade split.
2. **Max tray size.** The brief doesn't specify a comparison-set cardinality. Picked 3 (not 2 or
   unlimited) to keep the table's `table-fixed` column math simple and to keep the comparison
   readable at 390px without horizontal scroll — verified by sweep passing clean at all 5 widths.
3. **Which attributes appear in the table rows.** Picked price / match score / condition / seller
   rating / ships-in as the five rows — the brief's own "AI 매칭 근거 태그 + 컨디션 등급 + 판매자
   인증 배지 + before/after 할인율" list names badges for a single card, not table rows for a
   multi-item comparison; mapped the closest equivalents and added seller rating and ship time as
   genuinely comparison-relevant axes a single card's badge row wouldn't carry.
4. **No horizontal-scroll wrapper on the table.** Chose `table-fixed` + percentage `<colgroup>`
   with no `overflow-x-auto` wrapper at all, specifically to sidestep this catalog's own documented
   `sr-only`-inside-a-clipping-container anchoring bug (`page-brief-core.md` §2) — there is nothing
   to clip in the first place.
5. **Default selection.** Brief's own precedent (e.g. the Scrubber's non-zero default day) argues
   against an empty first render. Pre-selected 2 of the 6 listings so the comparison table renders
   real data on first paint instead of a "select something" placeholder.

## Known tension, surfaced honestly

The comparison table — this candidate's actual proof — sits below the first row of listing cards
and is **not** visible without scrolling at 1440px (confirmed in `shots/b-1440.png`: only the
headline, sort control, and the top edge of row 1's cards are in frame; the table itself only
enters view at the 35% scroll frame). The brief's hero-fold rule is written in terms of match/grade/
cert/discount badges on the product cards, which the first row does partially satisfy, but the
table itself — the thing this candidate is actually selling as its mechanic — does not. Flagging
this rather than letting judging discover it silently.
