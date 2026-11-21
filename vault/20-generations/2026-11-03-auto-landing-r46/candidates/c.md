# Candidate c — Payout Speed Race

**One-line concept:** Two horizontal payout tracks — Instant and Standard — race to a finish line at genuinely different real-time speeds every time a visitor simulates a sale, with a live per-track ETA readout, a toggle for which tier is "your pick," and the exact dollar amount from that race literally feeding both the value-split section's running weekly tally and the closing CTA's headline number.

Files: `app/src/app/landing-evolve/r46/c/{page,LandingClient,Hero,PayoutRace,ProductCard,ValueSplit,SocialProof,ClosingCTA,Reveal,useMounted,usePrefersReducedMotion,race-math,data,tokens}.{tsx,ts}`

## 브리프에 없던 것

Every value below was invented for this candidate; the brief only specified the device family (competing/parallel progress, not a gauge/funnel/sankey/etc.), the five-section order, and the light/rose/Pretendard-only constraints for this slot.

1. **Collision check (grepped before locking the mechanic)**
   - Searched `app/src/app/(marketing)/` and `app/src/app/landing-evolve/` for `race|parallel progress|competing progress|payout speed|instant payout|finish line|horizontal track` and separately for `payout|instant settle|withdraw|settlement speed|business day`.
   - Found plenty of *payout math* devices (`r31/c/payout-panel.tsx`, `r34–35/c/payout-math.ts` + `Stepper`/`StackedBar`, `r37/a/PayoutPanel.tsx`, `v14/PayoutCalculator.tsx`) but every one of them is a **receipt/itemized-breakdown or counter-stepper pattern** — a single recalculated number or a dial-style stepper, never two independently-animating completion tracks. `v14/ProcessTimeline.tsx` ties its reveal to **scroll position**; this candidate's race is purely **user-triggered** (a button press), so it doesn't share v14's mechanism even though both touch "process."
   - Also opened `r22`'s reverse-auction leaderboard-style file names (`r29/a/leaderboard.tsx`) and the ladder-reorder (`r38/a/ladder-math.ts`) by name only, confirmed from their surrounding file names (`slider-panel`, `weight-panel`) that they're **re-sorting/re-ordering by weighted axes**, not a race-to-completion — different mechanic, no further action needed.
   - No existing production or evolve-round page builds two horizontal tracks animating toward a finish line at different durations. Device is clear to use.

2. **Fee rates per tier**
   - Decided: `FEE_RATE = { instant: 0.07, standard: 0.04 }` (`data.ts`).
   - Why: arbitrary, but a deliberate, named trade-off (Instant costs 3 points more) rather than implying Instant is simply "free" — avoids overclaiming and gives the race a second axis (speed vs. cost) instead of a strictly-dominant option.

3. **Race durations, simulated real-world waits, and default (pre-trigger) progress**
   - Decided: `DURATION_MS = { instant: 2200, standard: 9500 }` (ms, concurrent animation lengths); `SIMULATED_SECONDS_INSTANT = 45`; `SIMULATED_DAYS_STANDARD = 3`; `DEFAULT_PROGRESS = { instant: 1, standard: 0.42 }`.
   - Why: durations arbitrary but deliberately far apart (≈4.3×) so the gap is visible without the Standard track taking so long a visitor gives up watching. The default progress is the brief's required "not an empty track" state: Instant reads as already-settled (checkmark state, no animation needed at first paint) and Standard reads as genuinely partway through its 3-day window (`Day 2 of 3`) — both are real, honest "at rest" states of each tier, not placeholders.

4. **Sale amounts and default**
   - Decided: `SALE_AMOUNTS = [38, 96, 212]`, `DEFAULT_SALE_AMOUNT = 96` (`data.ts`).
   - Why: arbitrary, spanning a small accessory to a mid-value jacket; default lands in the middle so neither extreme is implied as typical.

5. **ETA countdown formatting (`race-math.ts`)**
   - `instantEtaLabel(progress)`: `Math.ceil((1-progress) × 45)` seconds remaining, "Arrived" at 100%.
   - `standardEtaLabel(progress)`: maps progress to `Day 1 of 3` → `Day 2 of 3` → `Day 3 of 3` → "Arrived", via `Math.ceil((1-progress) × 3)` days-left inverted to a day number.
   - Why: gives each track a literal, readable ETA readout (not just a bar), satisfying the device's "live countdown/ETA readout per track" requirement distinctly from the reverse-auction/ladder mechanics the brief flagged as already used.

6. **Weekly tally baseline and causal-consistency wiring**
   - Decided: `BASE_WEEKLY_INSTANT_TOTAL = 128_440`, a static editorial "this week so far" figure, explicitly captioned as such (not claimed as a live global feed).
   - The only *live* part is `simulatedTotalAdded`, a single `useState` owned by `LandingClient.tsx` and incremented by the Instant payout amount once a race fully resolves (`onRaceComplete`). Both `ValueSplit`'s tally (`BASE_WEEKLY_INSTANT_TOTAL + simulatedTotalAdded`) and `ClosingCTA`'s headline number read the **identical** expression from the **identical** state — not two copies of a similar-looking number — so the closing section's claim can never drift from what the race above actually produced. `ClosingCTA`'s copy explicitly says "That total updates live as you simulate a sale in the panel above," which is literally true.

7. **Body-copy container widths (px, not `ch`)**
   - Formula per the brief: `chars-per-line = container-width ÷ (0.44 × font-size-px)`.
   - Decided values:
     - Hero subhead: `text-[18px]` → `max-w-[560px]` → 560 ÷ (0.44×18) = 560 ÷ 7.92 ≈ **70.7 chars/line**.
     - `ValueSplit` body copy (feature grid + tally caption): `text-[15px]`/`text-[14px]` → `max-w-[460px]` → 460 ÷ (0.44×15) = 460 ÷ 6.6 ≈ **69.7 chars/line**.
     - `SocialProof` testimonial quotes: `text-[16px]` → `max-w-[480px]` → 480 ÷ (0.44×16) = 480 ÷ 7.04 ≈ **68.2 chars/line**.
     - `ClosingCTA` lead paragraph: `text-[17px]` → `max-w-[520px]` → 520 ÷ (0.44×17) = 520 ÷ 7.48 ≈ **69.5 chars/line**.
   - Why: every container solved backward from the ~70-char target, all landing at or under it and comfortably clear of the 75-char ceiling; `ch` units never used.

8. **Accent hue, exact hex values, and computed contrast (light theme)**
   - Hue family: rose. Base accent `#E11D48` (Tailwind's rose-600) for large scale only — fills, borders, progress-bar fills, the CTA button background, ≥24px/19px-bold figures. Small-scale tint `#BE123C` (rose-700) for every small text/icon/standalone label that sits on the plain white/near-white page surface.
   - Computed contrasts (WCAG relative luminance; white L=1, page ink `#171717` L≈0.00861, `#E11D48` L≈0.1736, `#BE123C` L≈0.1171):
     - **White text on the `#E11D48` fill → 4.70:1** (clears the 4.5:1 AA floor for any text size — used for the CTA button's and race-trigger button's white label text at 13–14px).
     - **Dark ink (`#171717`) text on the `#E11D48` fill → 3.82:1** (clears only the 3:1 large-text/non-text floor — this pairing is never used below 24px/19px-bold in this candidate; it isn't used at all, documented here only as the "why not" check).
     - **`#BE123C` (small-scale tint) on white → 6.28:1** (clears 4.5:1 with real margin). On the badge chip surface `#FFF1F2` specifically (L≈0.906, computed by hand) → **5.72:1** — still clears 4.5:1, confirming the brief's warning that a tinted surface needs its own check rather than assuming the white-background number carries over.
     - **Muted text `#525252` on white → 7.83:1**; on the panel surface `#F7F5F5` (L≈0.933) → ≈7.4:1; on the inactive race-track fill `#E5E5E5` (L≈0.783) → ≈6.2:1. All three clear 4.5:1, so one muted token is reused everywhere, including inside the toggle's inactive segment, per the brief's explicit callout to check that surface.
   - **Why "small-scale tint" is darker, not literally "brighter," than the base accent**: the brief's "derive a brighter tint for small text/icons/focus rings" instruction is written for the case of a lighter tint raising contrast against a *dark* background (that's what it did for `r45`'s dark-theme sky-300 ring). On this candidate's *light* surface, the physics inverts: a darker, more saturated step (`#BE123C`, rose-700) is what raises contrast against white, while an actually lighter tint (rose-300/400, computed and rejected: rose-400 `#FB7185` → only 2.69:1 on white) would fail outright. The underlying rule — never reuse the large-scale base accent at small sizes — is honored; the direction of the shift was re-derived for a light surface rather than copied literally.
   - **Why focus rings use the base accent, not a separate tint**: rings use `outline` + `outline-offset-2` (not Tailwind's `ring-*` utilities, to sidestep the brief's documented v4 ring-rendering risk). The offset means a ring is always drawn on the page/panel surface just outside the element, never on top of an accent fill, so it never needs to contrast against the fill itself — only against white (4.70:1) or the panel surface `#F7F5F5` (≈4.38:1, hand-computed), both well clear of the 3:1 non-text floor. `outline-none` only ever appears on the same element as its own `focus-visible:outline-2` override (`FOCUS` constant in `tokens.ts`), never cancelled by a separate unconditional rule.

9. **Font-weight trio and no display face**
   - Decided: exactly `font-normal` (400, all body copy), `font-semibold` (600, labels/captions/buttons/badges/toggle), `font-extrabold` (800, the H1, every big figure — race ETA/payout numbers, the weekly tally, the closing-CTA number). `font-bold` (700) and `font-medium` (500) are not used anywhere in this candidate (grepped to confirm after writing all files).
   - No `--font-display-*` class is used anywhere, including the `<h1>` — this candidate's assigned, deliberate choice for this slot. Hierarchy leans on literal size (`clamp(2.4rem,1.6rem+4vw,4.5rem)` for the H1 vs. 11–18px for everything else), tracking (`-0.015em` headline vs. `0.12–0.2em` uppercase labels), and color (ink vs. muted vs. accent) rather than a second typeface.

10. **Non-color track differentiation**
    - Instant: solid `#E11D48` fill, `Zap` icon, label "Instant Payout," small-tint-colored ETA text.
    - Standard: solid `#171717` fill with a repeating diagonal white-stripe texture (`repeating-linear-gradient`), `Clock3` icon, label "Standard Payout," a small `Package` marker that rides the fill's leading edge, muted-colored ETA text.
    - Why: satisfies "color never the only signal" for the two tracks — label text, icon, fill texture, and marker all differ independently of hue.

11. **Reduced-motion behavior and the two separate hydration hooks**
    - `usePrefersReducedMotion.ts`: a live `useSyncExternalStore` subscription to `matchMedia("(prefers-reduced-motion: reduce)")` (not a one-shot read) — this is what gates the race itself. Triggering "Simulate a sale" while this is true jumps both tracks straight to their fully-resolved state (and fires the same outcome announcement) instead of silently suppressing the animation with no alternative feedback.
    - `useMounted.ts`: a separate `useSyncExternalStore` hydration gate used only by `Reveal.tsx`'s `whileInView` scroll reveals in `ValueSplit`/`SocialProof`/`ClosingCTA`. Before mount, `Reveal` renders the plain, fully-visible `<div>` with no `initial` prop at all, so the server-rendered HTML never ships a literal `opacity:0`.
    - Why two hooks, not one: the race animation and the scroll reveals have different failure modes (a race that silently never resolves vs. a reveal that never fades in), so they're gated independently rather than one hook serving both call sites.

12. **Live-region outcome announcement**
    - A single `role="status" aria-live="polite"` paragraph in `PayoutRace`, updated exactly twice per run: once to "Simulating a sale now — both payout timers are running" when triggered, and once to the exact sentence pair `"Instant payout: funds available now. Standard payout: funds available in 3 business days."` when the slower (Standard) track's `onComplete` fires — never updated continuously during the animation itself. Its initial (pre-trigger) value is a plain-language description of the default progress state, so it's never empty.

13. **Interaction inventory (4 required, 5 delivered)**
    - Sale-amount selector (3 buttons, `aria-pressed`, changes the dollar figures used everywhere below).
    - Payout-tier toggle (`Instant`/`Standard`, `aria-pressed`, drives the "your pick" sentence and which wait/payout combination is quoted).
    - Race-trigger/replay action ("Simulate a sale" → "Simulate another sale," disabled mid-run, restarts both tracks from zero at their real relative speeds).
    - Product-card "Quick look" disclosure (`ProductCard.tsx`, a real `<button aria-expanded aria-controls>`, independently focusable, reveals a genuine extra sentence — not decorative/hover-only).
    - Scroll-triggered reveal (`Reveal.tsx`, Framer Motion `whileInView`, hydration-gated via `useMounted` and independently checked against `usePrefersReducedMotion`) on `ValueSplit`, `SocialProof`, and `ClosingCTA`.
