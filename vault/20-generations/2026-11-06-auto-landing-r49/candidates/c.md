# r49/c — "Point Select"

**Concept (one line):** An abstract, stylized field of seven individually-selectable location
pins (never a map tile/SDK — one hand-drawn flat-filled organic blob, percent-positioned
buttons) stands in for repick's network of in-person drop-off partners; selecting a pin by
click, hover, or keyboard focus instantly swaps a live proof panel (processing time, accepted
categories, queue length, trust badge) and recomputes an aggregate "verified points near you"
stat from real plane-geometry (Euclidean distance over fixed coordinates, radius-bounded) — the
same selection state then also drives each product card's "accepted near you" coverage line and
the closing CTA's headline sentence, all the way down the page.

Files: `app/src/app/landing-evolve/r49/c/{page.tsx, Hero.tsx, PinField.tsx, LocationPanel.tsx,
CategoryFilter.tsx, ProductCard.tsx, ProductPreview.tsx, ValueSplit.tsx, SocialProof.tsx,
ClosingCTA.tsx, data.ts, tokens.ts, Reveal.tsx, useMounted.ts, usePrefersReducedMotion.ts}`.

## Device mapping (assignment recap)

- **Input**: `PinField` — seven real `<button>`s (not divs), each independently Tab-reachable,
  positioned by fixed `left/top` percent on a 0–100 plane inside one hand-drawn SVG blob
  (`ZONE_PATH_D`, flat-filled `#FBEAEC`, no roads/grid/coastline — explicitly not a map). Hover,
  focus, *and* click all call the same `onActivate(id)`, so a keyboard user tabbing through pins
  gets the identical live update a mouse user gets by hovering. Busy/available status is shown
  on the pin itself via a shape-differentiated corner badge (`Check` vs `Clock3` icon, different
  border color) — never color alone — plus restated as icon+text in the panel below.
  `CategoryFilter` is a second, independent input (4th interaction type, see below): choosing a
  category dims pins that don't accept it and recomputes the coverage sentence, without changing
  which pin is selected.
- **Output**: `LocationPanel` — the selected point's name, a verified/pending badge
  (`BadgeCheck`/`ShieldAlert`, never color-only), processing hours, queue count, and a status
  line, wrapped in `aria-live="polite"` directly on the visible container (per the brief's
  explicit instruction — not a separate hidden duplicate), so screen-reader users hear the new
  location's detail the moment focus lands on a different pin. The Hero's big aggregate number
  above the field (`coverage.totalCount`) and `ValueSplit`/`ClosingCTA`'s prose both derive from
  `coverageFor(selectedId)` in `data.ts` — real Euclidean distance over the fixed plane, radius
  = `AREA_RADIUS_PCT` (24 plane-units), never per-pin lookup fields.

## The live chain (hero → every surface → closing CTA)

`coverageFor(activeId)` in `data.ts` is the single source; `page.tsx` computes it once per
render (`useState` for `activeId` + `categoryFilter`) and passes the same object down:
- Hero's aggregate stat line + `PinField` dimming + `LocationPanel`'s full detail.
- Product Preview's 3 full cards' "Accepted at N of M verified points near X" line — a *second*
  live link, independent of the pin-detail panel, computed via `coverageAcceptingCategory`.
- Value Split's third feature card literally states the current sentence
  (`coverageSentence(coverage, categoryFilter)`), word for word the same function the aggregate
  stat and the closing CTA call.
- Closing CTA's headline *is* `coverageSentence(coverage, categoryFilter)` — not a paraphrase.
No section hardcodes a coverage figure; `CLOSED_SALE` in Social Proof is the one deliberately
historical, selection-independent card, and its caption says so explicitly (the catalog's
documented "manipulation must stay alive to the CTA" contrast case).

Default point on load is **Union Yard** (`DEFAULT_POINT_ID`), never an empty state —
`totalCount=4`, avg processing `3.8h`, both real derived numbers from the fixed 7-point dataset.

## What wasn't fully specified in the brief — decisions + math

**Accent contrast (rose, light theme, computed by hand — sRGB→linear→WCAG relative luminance,
`L = 0.2126·R + 0.7152·G + 0.0722·B` per channel after linearizing):**
- Background: `#FFFFFF` (true white, not cream — the brief's own "genuine light" distinction).
- Base accent **`#F43F5E`** (rose-500, a different point on the brief's named
  `#E11D48`/`#F43F5E` family than this repo's own existing rose-600 precedent, picked and
  computed independently): R=0.9569→lin 0.8835, G=0.2471→lin 0.0498, B=0.3686→lin 0.1120 →
  L=0.2126·0.8835+0.7152·0.0498+0.0722·0.1120=**0.2316**. Contrast vs `#FFFFFF`:
  (1.05)/(0.2316+0.05)=**3.73:1** — clears the large-text/non-text floor (3:1) but not body AA
  (4.5:1), so it's used directly only for fills/borders/pins/≥24px(≥19px-bold) text, per the
  brief's tiering.
- Small-text/icon/focus-ring derivative **`#BE123C`** (rose-700) — on a light bg the dark-theme
  move ("lighten to a tint") is backwards, so this is a *shade*, verified separately: R=0.7451→
  lin 0.5151, G=0.0706→lin 0.00608, B=0.2353→lin 0.0452 → L=**0.1171**. Contrast vs `#FFFFFF` =
  (1.05)/(0.1171+0.05)=**6.28:1**; vs the panel surface `#F5F3F3` (L≈0.900) =
  (0.95)/(0.1671)=**5.69:1**. Both clear body AA on both surfaces this page uses.
- **Text on the `#F43F5E` fill** — computed both ways, not assumed: white on `#F43F5E` =
  **3.73:1** (same two luminances as the bg contrast above — fails body AA, large-text-only);
  dark ink (`#171717`, L≈0.00858) on `#F43F5E` = (0.2316+0.05)/(0.00858+0.05)=**4.81:1** (clears
  body AA at *every* size). So every filled-accent surface on this page — the selected pin, the
  match-% chip, the CTA pill, the active category chip — carries **dark ink, never white**, the
  reverse of this repo's generic default, verified per-hue rather than assumed to carry over
  (this candidate's number, 4.81, is a genuinely different result from this repo's existing
  rose-600/`#E11D48` precedent, where white clears 4.70 and ink only 3.82 — same family, opposite
  conclusion, which is itself the point of "compute per hue, don't assume").
- Muted text: `zinc-600` (`#52525B`, L≈0.0857) — **7.74:1 on `#FFFFFF`**, **7.00:1 on `#F5F3F3`**
  — one token safe on both surfaces used here. `zinc-500` was checked and rejected for this role:
  4.83:1 on white (passes) but only 4.37:1 on the `#F5F3F3` panel surface (fails AA) — confirms
  `page-brief-core`'s "zinc-500 safe only on pure white" floor rather than assuming it.
- Ghost/decorative numerals (≥24px only, `ValueSplit`'s "9mi"): `zinc-500` (`#71717A`) is the
  floor that clears 3:1 on white at **4.83:1** (`zinc-400` fails it); never used below 24px.

**Body-copy width (0.44em rule, not `ch`):** `chars = width ÷ (0.44 × font-size)`, targeting
~70, with margin under the 75 cap:
- 16px body (Hero subhead `max-w-[492px]`, Product Preview / Value Split intros): 492/(0.44×16)
  = 492/7.04 = **69.9 chars**.
- 14px captions (`max-w-[420px]` in the Hero's aggregate caption, `ClosingCTA`'s supporting
  line): 420/(0.44×14) = 420/6.16 = **68.2 chars**.
Neither uses `ch` — both were back-solved in px from the 0.44em constant.

**Font weights (exactly 3, rendered):** `font-normal` (400) / `font-semibold` (600) /
`font-extrabold` (800) only — verified by grepping every file in the folder for
`font-medium|font-bold|font-light|font-thin|font-black|font-serif`: zero matches outside this
note's own prose. `--font-display-wide` (Archivo Display) applied via inline `style`, Latin
headline/large text only (`h1`/`h2`/the ghost "9mi" numeral); Pretendard carries everything else.

**The abstract distance model:** the pin field has no built-in unit — it's a 0–100 percent
plane, not a real map — so a single fixed, documented conversion was invented:
`MILES_PER_PCT = 0.375`, chosen so `AREA_RADIUS_PCT (24) × MILES_PER_PCT = 9` lands on a round,
plausible metro-radius figure in the copy ("within 9 mi"). This is an arbitrary but fixed and
transparent choice, not a calculation derived from any real-world constant — documented here
rather than left implicit in `data.ts`.

**Pin coordinates + the resulting coverage spread:** the seven `(x, y)` pairs are hand-fixed
integers (never generated), chosen so `coverageFor` produces genuinely different totals per
selection rather than a flat count everywhere — verified by hand before writing the component:
Union Yard→4, Harbor Exchange→3, Old Mill Market→3, Riverside Commons→3, Northside Depot→3,
Lowland Collective→2, Cedar Grove Outpost→**1** (an intentional edge case — `coverageSentence`
branches to "is the only verified point…" singular phrasing when `totalCount===1`, exercised by
selecting that one pin, not a theoretical branch that never renders).

**Busy/available + verification, never color-only:** pin corner badges differ by icon
(`Check` vs `Clock3`) *and* border color *and* the panel below restates both as icon+text
(`BadgeCheck`/`ShieldAlert` for trust, `Check`/`Clock3` + "Available now"/"Busy right now" for
queue state) — `statusFor()` derives busy/available from `queueAhead > QUEUE_BUSY_THRESHOLD (6)`,
so the label can never drift out of sync with the number printed next to it.

**Interactions (4+ required):** (1) pin hover/focus/click selection across the field, (2) the
category filter chips (a genuinely separate mechanic from pin selection — it dims non-matching
pins and recomputes the coverage sentence without touching which pin is active), (3)
scroll-triggered `Reveal` fades on Product Preview / Value Split / Social Proof, (4) each product
card's "Why this match" disclosure toggle (`aria-expanded`/`aria-controls`, native `hidden`).
Bonus: a scroll-linked parallax (`useScroll`/`useTransform`, transform-only via framer-motion's
`y` shorthand) on `ValueSplit`'s decorative ghost numeral, gated by `useMounted` +
`usePrefersReducedMotion` the same way `Reveal` is, falling back to a static, fully-visible span.

**Determinism:** no `Math.random`/`Date.now`/argument-less `new Date()` anywhere — verified by
grep. All geometry (`DROP_POINTS` coordinates, `ZONE_PATH_D`) is fixed integers written by hand,
never computed at runtime from a random or time-based seed.

**Images:** fixed `images.unsplash.com/photo-<id>` URLs reused from IDs already present
elsewhere in this catalog (camera/watch/backpack/leather-bag — confirmed controlled,
non-random content already vetted by prior rounds), rather than freshly-guessed IDs, since this
sandbox's network access to verify a brand-new ID is unreliable and this sandbox cannot reach
`images.unsplash.com` at all (documented environment artifact — renders as the reserved
`aspect-ratio` + `bg-[#F5F3F3]` box, not a code defect).

**Hero fold compactness:** the Hero nests the eyebrow/h1/subhead/CTA/2 compact proof cards *and*
the entire pin-field device (filter chips, aggregate stat, `PinField`, `LocationPanel`) as
literal children of the `Hero` component itself, in the same two-column grid — never a following
section — per the catalog's learned criterion ("증명 카드가 히어로 컴포넌트 자체 안에 있는가").
Both compact proof cards carry all 4 required badge types (match %, condition grade, verified
seller, before/after discount). Column/section paddings mirror this catalog's own most recent
passing precedent (`r48/c`) at matching scale, tightened where this device's content allowed
(fixed-height `PinField` at 168–180px rather than a full aspect-ratio box, a condensed
`LocationPanel`) specifically to keep total Hero height comparable to that reference rather than
exceeding it — build/dev-server runs are out of scope for this task, so the remaining
pixel-exact height judgment is a visual call for the orchestrator's screenshot sweep to confirm.
