# Candidate C — "Sell Timeline"

One line: a vertical-scrollytelling landing where a 3-way seller-persona segmented control (first
listing / regular seller / trade-in bulk) in the Hero drives a horizontal, width-encoded stage
timeline (List → AI match → Buyer verification → Payout) whose segment widths and "Payout in N
days" labels recompute live from one fixed persona-keyed dataset, restated consistently from Hero
through to the closing CTA.

Route: `app/src/app/landing-evolve/r57/c/page.tsx` (+ Client.tsx, Hero.tsx, ProductPreview.tsx,
ValueSplit.tsx, SocialProof.tsx, ClosingCta.tsx, ListingCard.tsx, PersonaSelect.tsx,
StageTimeline.tsx, ui.tsx, data.ts — all in the same folder).

## 브리프에 없던 것

1. **Which hue, and the exact contrast arithmetic.**
   Decided: blue (`#3B82F6` / `#60A5FA`), explicitly avoiding violet-hex and the amber/teal the
   brief flagged as overused, and avoiding `--font-display-wide`. Used `--font-display-grotesk`.
   Computed by hand (WCAG relative-luminance formula) against this page's single bg `#0B0B0F`
   (raw L = 0.00345):
   - `#3B82F6` (ACCENT_BASE) vs `#0B0B0F` → **5.35:1** — clears body-size AA (≥4.5:1) directly on
     the dark bg, so no separate tint was needed just to use it as body-size accent text.
   - `#60A5FA` (ACCENT_BRIGHT) vs `#0B0B0F` → **7.73:1** — used for the focus ring, headline
     accent, and the brightest timeline segment.
   - `#18181B` (INK) on `#3B82F6` fill → **4.82:1** (passes small-text AA).
   - `#18181B` (INK) on `#60A5FA` fill → **6.97:1** (passes).
   - `#FFFFFF` on `#3B82F6` fill → **3.68:1** (checked and rejected — fails small-text AA).
   - `#FFFFFF` on `#60A5FA` fill → **2.54:1** (checked and rejected — fails even large-text 3:1).
   Conclusion applied everywhere: every blue-filled surface (primary CTA, active persona pill,
   discount chip, payout chip) uses dark-ink text, never white. Why: the brief requires computing
   this per-hue rather than assuming the usual "white on saturated color" default, and blue-500
   specifically fails that default at small sizes on this background.
   Also computed, since they're load-bearing muted/body tones: `#A1A1AA` (zinc-400) vs bg →
   **7.66:1** (used for all muted/caption text); `#D4D4D8` (zinc-300) vs bg → **13.30:1** (body
   copy); `#71717A` (zinc-500) vs bg → **4.07:1** (used ONLY for decorative, non-text elements —
   the ghost section-folio numeral — never for real text, which floors at zinc-400 throughout).

2. **Body-copy container widths per font size, computed not guessed.**
   Decided, using `chars_per_line = container_px / (0.44 × font_px)`, targeting ~70 chars, never
   above 75:
   - 16px → 492px container → 70.0 chars/line (Hero subhead, ClosingCta paragraph).
   - 14px → 430px container → 69.9 chars/line (section intros, value-split body, blockquotes,
     stage-detail panel).
   - 13px → 400px container → 69.9 chars/line (persona blurb, listing match-reason copy).
   Why: the brief bans `ch` units for this stack and requires the arithmetic shown, not an eyeballed
   max-width.

3. **Exact stage durations per persona (the core dataset).**
   The brief names the mechanism (4–5 stages, width = duration, labels like "Payout in 2 days" vs
   "Payout in 5 days") but not the numbers. Decided, in days, fixed and hand-authored (no
   Math.random/Date.now):
   - First listing: list 1.5, match 3, verify 2, payout 5 → total 11.5 days.
   - Regular seller: list 0.5, match 1.5, verify 1, payout 2 → total 5 days.
   - Trade-in bulk: list 0.25, match 0.5, verify 0.25, payout 1 → total 2 days.
   Why these numbers: they reproduce the brief's own literal example ("Payout in 2 days" for the
   middle tier vs "Payout in 5 days" for the slowest), and the three totals (11.5 / 5 / 2 days) are
   spread widely enough that the bar's *length* difference reads clearly at a glance, not just its
   segment proportions.

4. **A shared width-scale ceiling (`MAX_SCALE_DAYS = 12`) instead of each bar always filling 100%.**
   Decided: every persona's bar draws against the same 12-day track, so trade-in-bulk's bar
   visibly stops at ~17% of the track while first-listing's reaches ~96%. Why: the brief's output
   vocabulary is explicitly "segment WIDTH... recompute live" — normalizing every bar to its own
   100% would still change segment *proportions* per persona but would hide the fact that one
   persona's whole journey is dramatically shorter in absolute terms, which is the more honest and
   more visually distinctive encoding of "duration."

5. **Where the "4th interaction" lives and what it does.**
   The brief lists 3 (persona-select, scroll triggers, product-preview interaction) and asks for
   "plus one more." Decided: clicking a stage card in the full timeline (ValueSplit section)
   selects it (`aria-pressed`) and swaps a detail panel below the grid to that stage's fixed
   description. Why: it's a second genuinely different interaction (selection, not disclosure)
   inside the same assigned output form, keyboard-reachable, deterministic, and gives the
   horizontal timeline a reason to be explored stage-by-stage rather than only read passively.

6. **How the product-preview interaction works.**
   Decided: a real `<button aria-expanded>` on each `ListingCard` toggling a "Why this match"
   paragraph (the match-reason copy already in the data). Why: the brief bans hover-only reveals
   and demands a real interactive element; this reuses data already in the model instead of
   inventing new copy, and is identical in both the Hero's single card and the ProductPreview grid.

7. **Heading level for card titles.**
   `ListingCard` is used both inside the Hero (before any `<h2>` exists) and inside the
   `ProductPreview` grid (after the first `<h2>`). An `<h3>` title would be a legal nesting in the
   grid but an `h1 → h3` skip in the Hero. Decided: render the listing name as a styled `<p>`, not
   a heading, in both places. Why: one shared component, one semantic treatment, no skip risk
   regardless of where it's mounted.

8. **Default persona and default selected stage.**
   Decided: `regular-seller` as the page's default persona (a plausible "middle" visitor, not the
   fastest or slowest extreme), and `match` (AI match) as the full timeline's default-selected
   stage detail. Why: both must be non-empty/non-zero at first paint per the hero-fold rule; the
   brief doesn't specify which of the 3×4 options should be the resting state.

9. **Mapping 4 stages onto a required "3-way split."**
   The brief's structural skeleton wants a 3-way value split in section 3, but the stage timeline
   has 4 stages. Decided: "Get listed" (list stage), "Get matched" (match stage), "Get paid"
   (verify + payout combined, citing both labels). Why: keeps the 3-way split structurally
   required by the skeleton while still citing all four stage labels somewhere in that section
   (three columns plus the full timeline immediately below them).

10. **Scroll-progress bar as the literal "connective tissue."**
    Decided to add a thin fixed top bar (`scaleX` bound to `useScroll().scrollYProgress`) as the
    one additional, purely decorative scroll-linked element layered on top of the `whileInView`
    section reveals. Why: the brief asks for scroll-linked reveals as connective tissue between
    sections generically; this makes the "you are scrolling through one long document" feeling
    explicit. It's skipped entirely (not rendered, not left at `opacity:0`) under
    `prefers-reduced-motion` and before mount, since it carries no content.

11. **Product catalog identity.**
    Decided on 4 non-footwear-heavy items (sneaker, jacket, canvas bag, sunglasses) with invented
    brand names (Northfield, Carrow & Co., Portside, Solane) and reused known-good
    `images.unsplash.com/photo-<id>` ids already present elsewhere in this repo's landing-evolve
    catalog. Why: the brief requires the fixed-id Unsplash pattern and no new/unverified hosts;
    reusing ids already proven to load in this codebase is lower-risk than guessing new ones, and
    varying the category away from an all-sneaker set avoids visual monotony in the 4-card grid.
