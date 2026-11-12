# Candidate B — AI Listing Copywriter Preview

One-line concept: a seller-facing hero device — tone toggle (Concise / Detailed / Storytelling) × category select (Bags / Sneakers / Furniture) drives a pure, deterministic lookup that swaps a full marketing paragraph + tagline + four extracted keyword chips in place, with click-to-highlight linking each chip back to its exact phrase inside the paragraph.

Output path: `app/src/app/landing-evolve/r46/b/` — `page.tsx`, `LandingClient.tsx`, `Hero.tsx`, `GeneratedCopy.tsx`, `ToneToggle.tsx`, `CategorySelect.tsx`, `ProductGrid.tsx`, `ProductCard.tsx`, `ItemArt.tsx`, `ValueSplit.tsx`, `SocialProof.tsx`, `ClosingCTA.tsx`, `data.ts`, `hooks.ts`, `Reveal.tsx`.

## 충돌 검사 (collision check)

Grepped `app/src/app/(marketing)/` and `app/src/app/landing-evolve/` before committing to the mechanic:

- **`/v17`** (`Negotiation.tsx`, 304 lines): a multi-turn buyer/seller **negotiation dialogue transcript** driven by a price-ceiling + bargaining-style control. Confirmed via grep for `negotiat|bargain|transcript` — output shape is a chat-style back-and-forth log, not a single regenerating paragraph. No overlap.
- **`/v19`** (`CorrectionText.tsx` + `RedlineCard.tsx`, part of a 14-file page): a **tracked-changes/redline editor** — the seller's *original* sentence is struck through and repick's correction is inserted inline, toggled by a category-filter control (confirmed by reading `CorrectionText.tsx`'s own header comment: "Renders the seller's paragraph as tracked changes… the original claim is struck through and repick's correction is inserted"). That is explicitly the mechanic the brief says to avoid. My device never shows the seller's "before" text struck through inline — the paragraph is replaced wholesale on each control change (crossfade, not a diff), and the one "before/after" moment that exists lives in a separate ValueSplit card as two static/live blocks side by side, not an inline redline.
- Grepped `landing-evolve/**` for `tone|copywrit|listing description|generat(e|ed|or)|keyword chip` (case-insensitive) — 48 files matched on loose terms like "generate" used generically (pricing generators, ladder generators, etc.); none build a tone+category → full-paragraph copy generator with keyword-chip-to-phrase highlighting. No collision found.
- Cross-checked the "known-already-used" list in the brief (gauges, funnel, Sankey, parallel-coordinates, scatter, histogram, exploded stack, scroll timeline, before/after photo slider, comparison table, preference graph, ledger breakdown, price-band, spec-grid, reverse-auction book, bundle builder, verification pipeline, balance-beam, ladder reorder, depletion projection, draggable split) — none of these describe a text-paragraph-regeneration device; distinct on output shape (text, not a chart/diagram/table) as required.

Mechanic is therefore distinct in output *shape* from both named prior-art devices and the rest of the catalog: a single prose paragraph that fully regenerates (not a diff/redline, not a dialogue log), plus keyword chips whose click scrolls to / highlights their exact phrase in that paragraph (bold + underline + background tint, never color alone).

## 브리프에 없던 것 (decisions beyond the brief)

**Accent contrast math (WCAG relative luminance, manually computed).**

Base accent `#0d9488` (teal-600). Relative luminance via the standard formula (`c' = c/12.92` if `c ≤ 0.03928` else `((c+0.055)/1.055)^2.4`, `L = 0.2126R + 0.7152G + 0.0722B`):
- R=13→0.00401, G=148→0.2961, B=136→0.2463 → **L ≈ 0.2299**
- vs. white (L=1): `(1.05)/(0.2299+0.05) ≈ 3.75:1` — passes only the **large-text/UI 3:1** floor, fails normal-text 4.5:1.
- vs. dark ink `#171717` (L ≈ 0.00858): `(0.2299+0.05)/(0.00858+0.05) ≈ 4.78:1` — passes 4.5:1, but per the brief's convention dark-ink-on-accent is reserved for large/bold/non-text use, not small body text.

Because base accent fails small-text white-on-accent, I derived a second, **darker** token for anywhere small text/icons sit on or as the accent: `#0f766e` (teal-700), `L ≈ 0.14183`.
- vs. white: `1.05/0.19183 ≈ 5.48:1` — passes AA normal text. Used for: primary CTA fill (white label, ~14px semibold), active tone-toggle/chip fill (white label, 13px), small accent-colored text/icons on the plain page background (verified badge, discount %, keyword-chip hover/active border+text), and the focus-visible outline color (3:1 non-text floor, cleared by a wide margin).
- vs. dark ink: `0.19183/0.05858 ≈ 3.28:1` — only clears the large-text floor, so I never pair teal-700 fill with dark-ink text.

Net rule actually implemented: **teal-600** only as plain accent-colored display text at ≥20px/semibold (tagline, icon accents on white) where its own 3.75:1-vs-white-text case never arises (text sits directly on the page background, not inside a teal-600 fill) and its 3:1 floor vs. the page background is moot since the comparison that matters there is teal-600 *text* vs **white page background**, which is the same 3.75:1 figure above and already ≥3:1 for the ≥20px semibold sizes it's used at. **teal-700** for every small-text/icon/fill/focus-ring case. No small text is ever set in base teal-600.

**Muted-text floor, checked on the two filled surfaces that exist:**
- Tone-toggle inactive labels sit on `bg-zinc-100` (a tinted track) → used `text-zinc-700` (L≈0.0230 → ~9.9:1 vs. white-ish zinc-100, comfortably past the "one step darker than zinc-600" floor the brief calls for on tinted surfaces).
- Category-select chevron / "Previewing a sample…" caption sit on plain white → used `zinc-500` (`L≈0.1674` → `1.05/0.2174 ≈ 4.83:1`, computed by hand) and `zinc-600` (`L≈0.0856` → `≈7.75:1`) elsewhere — both clear the near-white floor the brief sets at "roughly zinc-500-equivalent."

**Focus rings**: used native `outline` (not `ring`/box-shadow) throughout — `outline-none` paired with `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f766e]` on every button, chip, and the select. Chose `outline` deliberately over Tailwind's `ring` utility because `outline` paints outside the border box without relying on a box-shadow stacking trick that some v4 ring configurations render transparently under; `outline-color` arbitrary values (`outline-[#0f766e]`) are supported by Tailwind v4's outline utilities directly.

**Line-length container width.** Target ~70 chars/line, ceiling 75, at the project's measured 0.44em/char average for Pretendard-mixed body text, body set at 16px (`text-base`):
- `chars-per-line = container-px ÷ (0.44 × font-px)` → solving for container-px at 70 chars: `70 × 0.44 × 16 = 492.8px`.
- Chose `max-w-[480px]` for the generated-paragraph container (and reused it for the hero subhead) → `480 ÷ (0.44×16) = 480 ÷ 7.04 ≈ 68.2` chars/line — just under the 70-char target and safely clear of the 75-char ceiling. Deliberately rounded down from 492.8 rather than up, since this component's whole job is a body paragraph and erring short of the ceiling mattered more here than hitting the target exactly.

**Reduced-motion mount-gating.** `hooks.ts` exports `usePrefersReducedMotion()` built on `useSyncExternalStore` (subscribing to `matchMedia("(prefers-reduced-motion: reduce)")` change events, `getServerSnapshot` returning `false`) instead of framer-motion's `useReducedMotion()`, per the brief's reasoning: framer's hook is state+effect based, so the first client render (the hydration pass) still reports `false` regardless of the real OS setting, which is the exact window an `initial={{opacity:0}}` reveal would flash through. `Reveal.tsx` (used by `ValueSplit` and `SocialProof`, both below the hero fold) uses this hook to set `initial={prefersReducedMotion ? false : {opacity:0,y:16}}`. As a second, independent safety net, `page.tsx` also ships a plain `<style>` block — `@media (prefers-reduced-motion: reduce) { [data-reveal]{opacity:1!important;transform:none!important} }` — which is evaluated by the browser at paint time, before any React hydration, so a reduced-motion visitor never sees a flash regardless of JS timing. The hero's own paragraph crossfade (`GeneratedCopy.tsx`) is user-triggered (tone/category change), not a `whileInView` mount reveal, but it's gated through the same hook for consistency.

**Default non-empty state.** `LandingClient.tsx` initializes `tone="concise"`, `category="bags"` — the hero renders a fully generated paragraph, tagline, chips, and product cards on first paint, never an empty/placeholder state. Since there is no separate "reset" affordance (the controls themselves are the only state mutators and are always in some valid combination), there's no code path that produces an empty state at all.

**Causal consistency.** `tone`/`category`/`copy` are lifted once in `LandingClient.tsx` and passed down to `Hero`, `ValueSplit`, and `ClosingCTA` — there is exactly one source of truth. `ValueSplit`'s third card quotes the live paragraph's first sentence (`copy.paragraph.split(". ")[0]`) next to a clearly-labeled, deliberately static "typical seller draft" (framed as a generic illustration of unstructured seller text, not a measurable competing claim, so there's nothing in it that the live side could contradict). `ClosingCTA` interpolates the literal current tagline in quotes (`` "${copy.tagline}" ``) plus the live tone/category labels, and its only CTA link (`#listing-generator`) scrolls back to the same shared-state hero — so "try it again" always lands on the real, current, live device, never a separate static example.

**Images.** Used flat inline-SVG "item art" (`ItemArt.tsx`) instead of `next/image` + Unsplash — solid color-block silhouettes (bag/sneaker/chair), not outline/line-art, avoiding both the network-dependency risk flagged in the brief and the line-art-ornamentation ban. Since there's no raster asset, `next/image`'s alt/aspect-ratio rules don't apply to the mark itself; the image *container* still gets a fixed `aspect-square` + reserved `bg-zinc-200`, and the SVG is `aria-hidden` with the real item name conveyed by the adjacent visible `<p>` in the card.

## Interactions implemented (≥4 required)
1. Tone toggle (segmented control, `aria-pressed`).
2. Category select (native `<select>`, visible focus ring).
3. Keyword-chip ↔ paragraph-phrase highlight (click toggles a sticky highlight — background tint + bold + underline, never color alone — `scrollIntoView`s the phrase, and announces the highlighted phrase via a `role="status"` live region for screen-reader users; hover previews the same highlight).
4. Scroll-triggered reveal on `ValueSplit`'s and `SocialProof`'s cards (`Reveal.tsx`, mount-gated per above).
5. (bonus) Hero primary CTA and Closing CTA are both real, honest anchor links — "Start selling with repick" → closing CTA section, "Try another tone or category" → back to the live generator — nothing links anywhere unwired.
