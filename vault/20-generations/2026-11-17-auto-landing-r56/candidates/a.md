# Candidate A — "repick / Live Match Search"

**One-line concept:** A light, near-monochrome editorial landing for **repick**'s used camera & lens
marketplace, where the primary device is a literal free-text search box — type a brand/model/keyword
and a deterministic token-overlap matcher re-ranks a fixed 12-listing catalog live, showing *which word
hit which attribute* (not a bare percentage) alongside condition grade, seller verification, and a
before/after discount — the same derivation the closing CTA cites by name.

---

## 1. Accent color & contrast arithmetic

Theme: **light** (white page, near-black ink). Accent hue: **cyan**.

All numbers below use real sRGB relative-luminance math: for each channel `c = value/255`,
linearize as `c/12.92` if `c ≤ 0.03928`, else `((c+0.055)/1.055)^2.4`; then
`L = 0.2126·R + 0.7152·G + 0.0722·B`; contrast `= (L_light + 0.05) / (L_dark + 0.05)`.

- **Page background**: `#FFFFFF`, `L = 1.0`.
- **Accent base / large fill** — `#0891B2`: `R=8,G=145,B=178` → `L ≈ 0.2352`.
  Contrast vs white bg = `(1.0+0.05)/(0.2352+0.05) ≈ 3.68:1`.
  → Clears the **3:1 non-text/UI-component floor**, so it's used for *fills only*: the primary CTA
  button background (default state) and the discount badge fill. It is **not** used as small text/icon
  color, since 3.68 < 4.5.
- **Accent tint / small text, icons, focus ring** — `#0E7490`: `R=14,G=116,B=144` → `L ≈ 0.1460`.
  Contrast vs white bg = `(1.0+0.05)/(0.1460+0.05) ≈ 5.36:1`.
  → Clears the **4.5:1 small-text floor**. Used for: the eyebrow label, the match-reasoning badge
  border+text, the search box's focus-within border/glow, and every `focus-visible:outline-*` color
  in the route.
  **Note on direction:** the brief's generic instruction says to derive a *lighter* tint for this
  role, written with a dark background in mind (lightening raises contrast against a dark bg). On
  this **light** page a lighter tint would only shrink contrast against white further, so I derived a
  **darker** shade of the same hue instead (`#0891B2 → #0E7490`) and verified the number rather than
  following the letter of the instruction into a worse result. See §4 item 2.
- **Text printed on a filled accent swatch** — computed for *both* candidate ink colors, on *both*
  accent shades I actually use as fills:
  - White `#FFFFFF` (`L=1.0`) on accent base `#0891B2` (`L=0.2352`): `3.68:1` → **fails** 4.5:1 normal
    text.
  - Dark ink `#09090B` (`L ≈ 0.0007`) on accent base `#0891B2`: `(0.2352+0.05)/(0.0007+0.05) ≈ 5.63:1`
    → **passes**.
  - White `#FFFFFF` on the darker accent tint `#0E7490` (`L=0.1460`): `(1.0+0.05)/(0.1460+0.05) ≈
    5.36:1` → **passes**.
  - Dark ink `#09090B` on `#0E7490`: `(0.1460+0.05)/(0.0007+0.05) ≈ 3.87:1` → fails normal-text 4.5:1
    (only large/bold-safe).
  - **Which I used where:** the primary CTA's *default* fill is the lighter `#0891B2`, so its label
    uses **dark ink** (`#09090B`, 5.63:1). On `:hover`, the fill darkens to `#0E7490`, so the label
    color also flips to **white** (5.36:1) at that point — each state's ink color was picked by
    whichever number actually cleared 4.5:1 for *that* fill, not by a single global assumption. The
    discount badge (`bg-[#0891B2]`) uses dark ink for the same reason as the default CTA.

**Muted/secondary text, per surface (not one token everywhere):**
- `#71717A` (zinc-500) vs white/`#FAFAFA` (zinc-50): `L≈0.1673` → `(1.0+0.05)/(0.1673+0.05)≈4.83:1` —
  **passes**, used for captions/labels on the Hero, Social Proof, and Footer (white) and the How-It-
  Works band (`#FAFAFA`).
- `#71717A` vs the tinted chip background `#F4F4F5` (zinc-100, `L≈0.868` roughly): recomputed
  contrast drops to **≈4.3:1 — fails** the 4.5 floor on a tinted surface. So the quick-pick chips
  (which sit on `#F4F4F5`) use **`#52525B`** (zinc-600) instead: `L≈0.0857` →
  `(0.868+0.05)/(0.0857+0.05)≈6.75:1` on that surface — comfortably passes. This is the exact
  "same token passes on white, fails on a tinted card" trap called out in the brief, confirmed by
  arithmetic rather than assumed.
- Primary body copy uses `#3F3F46` (zinc-700), well above either floor — a readability choice, not a
  minimum-compliance one.

---

## 2. Body container width & character arithmetic

Formula given: `chars-per-line = container-px ÷ (0.44 × font-size-px)`.

All body paragraphs on the route are set at `text-base` (16px) inside a `max-w-[500px]` container
(hero subhead, the three "How the match reasoning works" step paragraphs, the three testimonial
quotes, and the closing-CTA paragraph all share this exact pairing, so one calculation covers every
paragraph on the page):

`500 ÷ (0.44 × 16) = 500 ÷ 7.04 ≈ 71.0 characters/line`

That lands inside the ~70-char target and under the 75-char hard cap, without using the `ch` unit
(which the brief flags as overshooting by ~35% in this font).

---

## 3. 브리프에 없던 것 (things the brief left for me to decide)

1. **① Default search-box value.** The brief requires a non-trivial default (never an empty grid at
   rest) but doesn't say what it should contain. **② Decided:** prefill with `"Sony a7 II"`. **③ Why:**
   it's the brief's own illustrative example, and it exercises the real matching code path (no special
   "empty state" branch needed) while deterministically surfacing the Sony A7 III as the top result via
   the `defaultRank` tie-break — a clean, honest default rather than a hand-staged one.
2. **① Direction of the small-text accent tint on a light theme.** §2 of the brief says to derive a
   *lighter* tint for small text/focus rings; that phrasing assumes a dark background. **② Decided:**
   derive a **darker** shade instead (`#0891B2 → #0E7490`). **③ Why:** verified by the actual luminance
   math (§1 above) — lightening on a white background only reduces contrast further, so I followed the
   intent (clear 4.5:1) over the literal word ("lighter").
3. **① Which ink color goes on which accent fill.** The brief says "default to white unless dark ink
   clears it too." **② Decided:** compute both ink colors against *both* accent shades I actually use as
   fills, and let each fill's own number decide independently. **③ Why:** the math flips depending on the
   fill's luminance — my lighter accent-base fill (`#0891B2`) needs dark ink (5.63:1 vs white's 3.68:1),
   while my darker hover tint (`#0E7490`) needs white (5.36:1 vs dark ink's 3.87:1) — a single global rule
   would have gotten one of the two wrong.
4. **① How "title" should score in the match function.** Not specified by the brief. A naive version let
   every attribute (brand/model/title/category) score independently, but a listing's title is almost
   always "Brand + Model," so title redundantly re-matched the same tokens, producing a cluttered
   reasoning tag like `brand "sony" · model "a7" · title "sony" + "a7"`. **② Decided:** title only earns
   credit for a token when brand/model/category do *not* already explain it. **③ Why:** keeps the
   "why it matched" reasoning tag honest and legible — it only ever states genuinely new information,
   matching the brief's own ordering intent ("a hit on brand or model counts more than title").
5. **① Product domain, catalog, and specific photo IDs.** The brief's examples ("Sony a7", "Jordan 1")
   left the vertical open. **② Decided:** a used camera-and-lens resale vertical, 12 fixed listings across
   7 brands (bodies, lenses, one film camera, one compact), with specific real Unsplash photo IDs chosen
   for plausibility to the subject (not a seeded-random service). **③ Why:** cameras pair naturally with
   the brief's own search example and give a rich, legitimately-varied badge/condition/price spread.
   Caveat: this sandbox's outbound network proxy returns `403` on `CONNECT` to `images.unsplash.com`
   even from plain `curl`, so the exact IDs could not be live-verified from here; I chose widely-known,
   frequently-reused real Unsplash camera/lens photos rather than guessed ones, and every image
   container reserves a fixed `aspect-square` box with a `bg-[#F4F4F5]` fallback (per §0 of the brief)
   so a failed load degrades gracefully instead of collapsing layout.
6. **① How to gate the one hero entrance animation for `prefers-reduced-motion`.** The brief warns
   specifically against IntersectionObserver-reveal patterns that leave an element stuck at `opacity:0`
   for reduced-motion users. **② Decided:** instead of framer-motion's `useReducedMotion()` JS hook (which
   can't synchronously know the media query during SSR, risking a hydration-timing gap), I used this
   project's own pre-existing `rise` keyframe from `app/src/app/globals.css` with Tailwind's
   `motion-safe:animate-[rise_...]` / `motion-reduce:animate-none` variants. **③ Why:** it's a pure-CSS,
   zero-JS mechanism whose resting state (per the project's own comment on that keyframe) is already the
   fully-visible finished state, so `motion-reduce:` never has anything to "undo" — the safest available
   option, and one the codebase had already solved for.

---

## 4. Confirmations

- **Rendered font weights: exactly 3** — `font-normal` (400, all body paragraphs/captions-by-default),
  `font-semibold` (600, eyebrow/labels/badges/buttons/nav), `font-extrabold` (800, h1/h2/h3/logo/price/
  discount-badge/strong). No `font-medium`, `font-bold`, or `font-light` appears anywhere in the route
  (verified by grep across `page.tsx`, `Client.tsx`, `match.ts`).
- **Display face:** `var(--font-display-grotesk)` only, applied (via inline `style`, never a second
  face) to: the `repick` wordmark in the header and footer, the hero `<h1>`, the three section `<h2>`
  headings ("How the match reasoning works", "What sellers and buyers say", "Ready when you are"), and
  the decorative quote-mark glyph in Social Proof. `var(--font-display-wide)` and
  `var(--font-display-mono)` are never referenced.
- **Other candidates:** I did not open, read, or peek at any `b/` or `c/` file inside `r56`, any
  `DECISION.md`/`SCORES.md`, or any other candidate's `candidates/*.md`. While checking this repo's
  general conventions (folder lettering, the Unsplash `remotePatterns` allowlist) I ran `ls` on the
  sibling `landing-evolve/r55/` folder (saw only the *names* `a/b/c`, no contents) and one `grep
  --files-with-matches` across the app that happened to list a couple of r54/r55 file *paths* as hits —
  I never opened or read the contents of any of those files. No code or copy from any other candidate,
  past or present, was read.

---

## 5. Files

- `app/src/app/landing-evolve/r56/a/page.tsx` — metadata + default export.
- `app/src/app/landing-evolve/r56/a/Client.tsx` — the full page UI, state, and composition
  (`"use client"`).
- `app/src/app/landing-evolve/r56/a/match.ts` — deterministic data + the single `rankListings()`
  derivation function shared by the hero search, the proof cards, and the closing CTA.
