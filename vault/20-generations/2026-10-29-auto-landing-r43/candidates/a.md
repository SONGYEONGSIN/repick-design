# a — Appraisal Scorecard

Dark / indigo / grotesk. Five star-pill criteria rows (Condition, Authenticity,
Seller trust, Photo quality, Price fairness) recompute a weighted composite
score (0-100), a Bronze/Silver/Gold tier badge, and an estimated days-to-sell
number — all three read from the same state. Non-trivial default ratings
(4/5/3/4/5 → score 82, Gold) satisfy the established non-trivial-default
doctrine. Closing CTA echoes the live score/tier/days instead of a static
claim. Product-preview section shows 3 static comparable listings (separate
subject from the live device, so no blanket-liveness overclaim).

## 브리프에 없던 것

1. **Accent hex + contrast calc** — chose indigo instead of the default
   `#6E56CF` per "accent 계열은 자유다" (design-principles.md §Color Tokens).
   Computed via WCAG relative-luminance formula: white on `#4f46e5`
   (indigo-600) = 6.29:1 (safe for small-text fills) → used for all
   button/badge fills with white text. `#6366f1` (indigo-500) = 4.45:1 vs
   bg `#09090b` (non-text use only — borders, large stat number, star fill)
   and 4.47:1 against white (not used that direction). Decided fill-text
   pairing by computing, not guessing, per the r9/r10 doctrine.
2. **Body paragraph width** — used the established 0.44em-per-char constant
   (not `ch`) from the r11 L2 delta: targeted ~70 chars at 16px →
   `max-w-[500px]` (500 / (0.44*16) ≈ 71 chars, within the 75-char hard
   cap with margin).
3. **Image strategy** — skipped `next/image`-backed remote photos entirely
   and used a fixed aspect-ratio placeholder block + lucide icon instead.
   Chosen because r41's ledger note flagged `images.unsplash.com` as
   blocked by this sandbox's proxy; a deterministic icon placeholder avoids
   both the random-image-host rule and the proxy risk without guessing at
   a "safe" external host.
4. **Duplicate-avoidance depth** — checked the open-delta history and the
   last 5 rounds' macro shapes (ledger notes) but did not run a fresh
   full-repo grep across all 21 production `(marketing)/v6-v26` pages and
   ~54 landing-evolve candidates (Q70). Chose a grid-of-star-selectors →
   composite-score macro shape, which doesn't match any shape named in the
   last 5 rounds' notes (ledger, range-sweep, photo-scan, balance-beam,
   facet-pickers), but a closer precedent may exist earlier in the archive
   that this round's RETRIEVE didn't surface.
