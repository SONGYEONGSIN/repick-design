# r47 · Candidate C — Allocation Flow

A light, near-monochrome landing page for repick's AI-assisted resale marketplace, built around a Sankey-style **Allocation Flow** diagram: a single inbound-batch node splits into three proportionally-sized outcome bands — Pass-as-is, Refurbish-then-sell, Fail-rejected — rendered as curved ribbons whose widths and node heights are computed directly from each band's item count. A Standard/Strict inspection-strictness toggle swaps the underlying band counts and the whole diagram reflows live: ribbon widths, node heights, the "most likely outcome" line, and two stat tiles (expected payout per item, sell-through rate) all recompute from the same three pure functions in `flow-math.ts`, so the Value-in-3-parts section and the Closing CTA — which both read the identical lifted `strictnessId` state — can never cite a number the hero's device didn't just show. The one rose accent marks the Pass-as-is band and every interactive control persistently (never hover-only); Refurbish and Fail are distinguished from Pass by value and a diagonal-hatch texture rather than by a second hue, keeping the page near-monochrome. Hovering, focusing, or clicking a band's node shows its own live detail line (count, share, dollar contribution to the headline payout figure), defaulting to the tie-guarded "most likely" band rather than sitting blank.

## 브리프에 없던 것

**① Exact band counts and payout/sell-through model, since the brief only named the three band categories.**
② Fixed a 120-item weekly reference batch with counts Standard = {Pass 70, Refurbish 37, Fail 13} and Strict = {Pass 41, Refurbish 50, Fail 29}; payout rate per band = {Pass 0.90, Refurbish 0.58, Fail 0} × a $150 average market value. `expectedPayoutPerItem` → Standard $106, Strict $82; `sellThroughPercent` → Standard 89%, Strict 76%.
③ Needed round, visually-legible numbers where every band's rounded share still sums to exactly 100% (70+37+13=120 and 41+50+29=120 both land on clean percentages: 58/31/11 and 34/42/24), and needed Strict to plausibly cost less expected payout than Standard while still being a defensible seller choice — never a trap state.

**① How to keep the page near-monochrome while still letting one band "read" as the headline outcome, since the brief bans color-as-meaning but also requires the rose accent stay visible at rest.**
② Rose fills only the Pass-as-is ribbon/node plus every interactive control (toggle, CTA, focus ring, "most likely" label); Refurbish uses a dark warm-gray (#3F3B3B), Fail uses a light neutral (#D8D4D3) reinforced with a diagonal hatch pattern — texture, not hue, carries the Fail distinction. Added a solid `#8F8A89` 1px stroke to every band node (verified at 3.41:1 on white / 3.11:1 on the panel bg) so the low-contrast Fail fill still has a legible boundary without relying on fill contrast alone.
③ A second or third hue would make color carry outcome meaning (banned); but an accent that never appears outside hover states would violate "stays visible at rest." Picking exactly one band to always carry the accent satisfies both constraints at once.

**① Tie-guard for `mostLikelyBand`, since the fixed data never actually ties but the function still has to be provably safe.**
② Implemented as `bands.reduce((best, b) => (b.count > best.count ? b : best), bands[0])` — seeded with the array's own first element (not `0` or `-Infinity`), compared only with strict `>`. A tie (equal counts) never satisfies `>`, so the earlier band in the fixed `[pass, refurbish, fail]` order is kept and the label can't flip to a different band on an unguarded equality.
③ The brief explicitly calls out that an unguarded tie (`>=` swapping, or a `0`/`-Infinity` seed that both `>` and `<` beat) can produce a visible self-contradiction under ordinary interaction — correct seeding is what prevents that regardless of whether the shipped data ever actually ties.

### Computed numbers (for the record)

**Rose accent contrast** (WCAG relative luminance, `L = 0.2126R + 0.7152G + 0.0722B` on linearized sRGB channels):
- `#E11D48` (base accent, large-scale fills/borders/CTA/focus ring) → L ≈ 0.1735. White text on this fill: **4.70:1** (clears AA 4.5:1 at any size). Dark ink (#171717) on this fill: **3.82:1** (clears only the 3:1 large-text/non-text floor — ink is never paired with this fill below 24px/19px-bold).
- `#BE123C` (small-scale tint, text/icons/labels directly on the white/near-white page) → L ≈ 0.1170. On white: **6.29:1** (clears AA 4.5:1 with real margin).
- Flow-node border `#8F8A89` (added specifically to keep the low-contrast Fail-rejected fill legible) → L ≈ 0.2583. Against white: **3.41:1**. Against the panel surface `#F6F4F4` (L ≈ 0.908): **3.11:1**. Both clear the 3:1 non-text floor.

**Line-length containers** (Pretendard mixed-glyph constant 0.44em; chars/line = width ÷ (0.44 × font-size-px)):
- Hero subhead: 17px → 7.48px/char → `max-w-[520px]` → 520/7.48 ≈ **69.5 chars/line**.
- ValueSplit body + its live-summary caption: 15px → 6.6px/char → `max-w-[460px]` → 460/6.6 ≈ **69.7 chars/line**.
- SocialProof quote: 16px → 7.04px/char → `max-w-[480px]` → 480/7.04 ≈ **68.2 chars/line**.
- ClosingCTA lead: 17px → 7.48px/char → `max-w-[520px]` → 520/7.48 ≈ **69.5 chars/line**.
- AllocationFlow header caption: 13px → 5.72px/char → `max-w-[320px]` → 320/5.72 ≈ **56 chars/line** (under the 65-char short-caption exemption, so its total length isn't held to the 70/75 ceiling).

All five clear the ~70 target / 75 ceiling (or the ≤65 short-caption exemption); none use `ch` units.
