# SCORES — auto-landing-r43

Frozen source hash (post-fix, before judging): recomputed after fixes below —
see final hash at bottom of this file. Gate run with
`CHROME_PATH=/opt/pw-browsers/chromium PW_NO_SANDBOX=1` (this sandbox requires
both for Lighthouse to produce real a11y/perf instead of a silent
`unavailable` soft-pass — same environment note as prior rounds r40-r42).

## a — Appraisal Scorecard (dark / indigo / grotesk)

1st pass: `a11y` 96 (`color-contrast` — blockquote footer `text-zinc-500` on
`#09090b` = 4.12:1 fails small-text AA 4.5; decorative quote-mark glyph
`text-zinc-600` on `#09090b` = 2.57:1 fails even large-text 3:1, and
`aria-hidden` is not a `color-contrast` exemption per page-brief-core §2).
**1-fix**: footer → `text-zinc-400` (7.76:1), quote glyph → `text-zinc-500`
(4.12:1, passes the 24px+ large-text 3:1 threshold). Re-gate: **10/10 clean**,
a11y 100, perf 71.

## b — Live Auction Ladder (light / orange / wide)

1st pass: `a11y` 98 (`heading-order` — page went h1 → h3 (value-split card
titles) → h2 (closing CTA), skipping a level; the product/bid section had no
heading at all before the h3s). **1-fix**: value-split card titles `h3` →
`h2` (now h1 → h2 → h2 → h2, no skip). Re-gate: **10/10 clean**, a11y 100,
perf 76.

## c — Verification Timeline (dark / sky / none) — DROPPED

1st pass: `lint` 2x `react/no-unescaped-entities` (line 176, literal `"` in
JSX text) + `sweep` `page-overflow` at 390px by 14px.
**1-fix** (single combined attempt): escaped the quotes (`&quot;`); for the
overflow, added `min-w-0` to the stepper `<li>` and its `<button>`, plus
`break-words` on the stage-label `<span>` — hypothesis was the flex-row
stepper's content-based min-width forcing the row wider than the 390px
viewport.
Re-gate: lint now clean, but **sweep `page-overflow` re-failed at the same
14px** — per skill §3's one-fix-only rule, **candidate c is dropped without
a second fix attempt** despite having a name for the symptom.

**Root-cause diagnosis (post-drop, for reassign-queue — does not consume a
second fix attempt)**: direct Playwright inspection at 390px found
`document.documentElement.scrollWidth = 404` and the single widest overflowing
box was the **grid-item `<div>` wrapping the whole left column** (line 74,
no className, a direct child of the `grid gap-10 lg:grid-cols-[1.1fr_0.9fr]`
container) — right edge at x≈404 against a 390px viewport. The `min-w-0`
fixes applied to the `<li>`/`<button>`/label `<span>` inside the stepper were
one layer too deep: CSS grid items default to `min-width: auto`
(content-based) exactly like flex items, so the **grid item itself** (the
unstyled wrapper `<div>` at line 74) needed `min-w-0`, not just its
descendants. This is a new, undocumented instance of the existing
`min-w-0`-for-overflow-prevention rule (page-brief-core §4: "그리드
아이템은 min-w-0") — the existing rule already covers this exact case in
principle, the implementation mistake was applying it at the wrong nesting
depth. Reassignment instruction: same Verification Timeline form, with
`min-w-0` added to the **outer grid-item wrapper div**, not only its
descendants.

## Candidate hash (post-fix, frozen for judging — a and b only; c excluded, dropped)

```
$ cat app/src/app/landing-evolve/r43/{a,b}/page.tsx | shasum
```
Recorded at judging time, see DECISION.md.
