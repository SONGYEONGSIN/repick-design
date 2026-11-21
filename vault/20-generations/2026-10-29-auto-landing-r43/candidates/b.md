# b — Live Auction Ladder

Light / orange / wide. A single continuous range slider ("Your offer") is
inserted into a fixed 6-bid ladder; moving it re-sorts the ladder (via
`layout` animation) and recomputes rank-out-of-7 and a rank-derived
chance-to-win percentage. Non-trivial default ($326, mid-pack rank, not
top or bottom) satisfies the non-trivial-default doctrine. Closing CTA
echoes the live rank/chance pair. The single listing under bid is shown
with static match/grade/verified/discount badges — those describe the
item, not the bid mechanic, so showing them statically does not trigger
the r39 "aggregate recompute must filter cards too" doctrine (there is no
category/dimension split here to desync from).

## 브리프에 없던 것

1. **Accent hex + contrast calc** — chose orange. White on `#c2410c`
   (orange-700) = 5.18:1 (safe small-text fill, used for CTA/badge fills).
   `#ea580c` (orange-600) on white = 3.56:1 — large-text/non-text only
   (slider thumb accent, border accents), not used for small text.
2. **Muted text on light surface** — used `text-zinc-600` (7.73:1 on white)
   per the established "zinc-500 on pure white is unsafe" finding
   (curation-criteria Q10/page-brief-core §2); avoided zinc-500 entirely.
3. **Rank/chance formula** — chose a simple deterministic formula
   (`chance = (total - rank + 1) / total * 90 + 5`) rather than anything
   resembling a tie/comparator-reduce, specifically to avoid the r42/b
   strict-comparator tie bug class (no ties are possible here since
   `offer` is a live float distinct from the 6 fixed integer bids at the
   default and across the full slider range by construction — fixed bids
   are spaced at least 5 apart and the slider moves in $1 steps, so an
   exact collision is possible at specific integer values; did not add
   explicit tie-breaking for that edge case, flagging it here rather than
   silently assuming it away).
4. **Image strategy** — same placeholder-icon approach as candidate a, for
   the same proxy/random-host reasons.
5. **Duplicate-avoidance depth** — same caveat as candidate a: checked
   recent-round notes, not a fresh full-archive grep.
