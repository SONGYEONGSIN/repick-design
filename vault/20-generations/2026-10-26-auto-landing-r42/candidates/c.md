## Concept summary

"The Bracket" is a live single-elimination tournament for 8 fixed turntable
listings (Technics SL-1200MK2 $650/cond 92, Audio-Technica AT-LP120XUSB
$220/78, Pioneer PLX-500 $340/85, Denon DP-300F $140/70, Rega Planar 3
$480/90, U-Turn Orbit Special $300/82, Crosley C100 $90/55, Numark PT01
Scratch $120/60 — each also carries a fixed originalPrice, verified flag and
sellerSales count). A listing's `priceScore` is `(maxPrice−price)/(maxPrice−
minPrice)×100` across the fixed catalogue; its `fitScore` per mode is a
weighted blend of that `priceScore` and its raw 0–100 `condition` grade:
Price-weighted = 0.8×price + 0.2×condition, Condition-weighted = 0.2×price +
0.8×condition, Balanced = 0.5/0.5. The bracket has a fixed seed pairing
((1v2)(3v4)(5v6)(7v8) → 2 semis → 1 final) that never changes; `winner =
higher fitScore` (deterministic price-then-id tie-break) is recomputed live
at every round for the current mode, so the actual cards occupying each
semifinal/final slot change with the toggle. Verified results: Balanced →
Denon DP-300F (cheap + decent condition); Price-weighted → Crosley C100 (the
single cheapest listing in the catalogue); Condition-weighted → Pioneer
PLX-500 (85/100, "Excellent" grade) — three distinct, fully-resolved
champions, each plausible for its weighting. Accent is `#1D5FE0`, a
saturated blue distinct from the catalogue's indigo/violet staples; computed
contrast is 5.58:1 against `#FFFFFF` and 3.53:1 against ink `#0A0A0C` — the
5.58:1 figure clears the 4.5:1 small-text floor, so the single hex is reused
everywhere (filled buttons, borders, connector lines, small text/icons) with
no separate tint needed. Mobile fallback: below the `lg` (1024px) breakpoint
the whole horizontal tree is swapped for `BracketStacked`, a plain vertical
list of the same four rounds using the same `Matchup`/`MatchCard`
components at `w-full` — no absolute widths, no horizontal scroll region,
so there is nothing that can overflow the page at 390px. The desktop tree
additionally sits inside a local `overflow-x-auto` wrapper as a defensive
second layer for in-between viewport widths.

## Brief gaps

- **Decided:** whether the bracket's connector *lines* should dynamically
  recolor per matchup, versus always reading as "the winner's line."
  **Decision:** lines are a fixed, always-accent structural skeleton (the
  printed-bracket convention); only the *cards occupying each slot* change
  with the toggle, plus an explicit "Advances"/"Eliminated" text+icon label
  on every card. **Why:** a real bracket's grid shape never changes between
  tournaments — only who's seeded where and who wins does — so coloring
  every line identically is accurate, not a cop-out, and keeps the
  color-is-not-the-only-signal rule satisfied through the text labels
  instead of line-color toggling.
- **Decided:** which breakpoint separates the desktop tree from the mobile
  stacked fallback. **Decision:** `lg` (1024px), not the default assumption
  of `sm`/`md`. **Why:** the full 4-round tree's fixed geometry (170/170/
  170/280px columns + 3×40px connector gaps ≈ 910px) needs real room to read
  as a tree without cramming; measuring the exact pixel layout up front let
  me pick the lowest breakpoint that comfortably fits it, rather than
  guessing and risking a squeeze at 768–1023px.
- **Decided:** how to keep the hand-verified bracket outcomes (which
  listing wins which matchup under which mode) honest at runtime.
  **Decision:** the three outcomes are never hardcoded — `computeBracket`
  recomputes every round from `LISTINGS` + `MODE_WEIGHTS` on every render,
  and I verified my hand arithmetic against that same formula before
  writing any copy that cites a specific champion. **Why:** the assignment's
  non-negotiable causal chain requires the toggle to drive real computation
  all the way to the closing CTA, so any copy that merely *described* a
  precomputed table instead of reading live state would be exactly the kind
  of unbacked "live" claim the doctrine flags.
