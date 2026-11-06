# SCORES — auto-landing-r42

Freeze hash (sha1 of all candidate sources, computed before gating): `8159d2391c5518309b4318f4d52900cc89217f17`
(`cat app/src/app/landing-evolve/r42/*/*.tsx app/src/app/landing-evolve/r42/*/*.ts | shasum`)

Environment notes (not candidate-code changes): dev server (`cd app && npm run dev`, port 3100) started fresh for this round — confirmed responsive before gating via a smoke-test gate run against an existing promoted route (`/landing-evolve/r41/a`, passed 10/10 including real Lighthouse). This sandbox's pre-installed Playwright Chromium required `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium` (as in round 1). Lighthouse additionally required `CHROME_PATH=/opt/pw-browsers/chromium` + `PW_NO_SANDBOX=1` to get real a11y/perf scores instead of a silent `unavailable` (Lighthouse's own Chrome-launcher needed the explicit path + no-sandbox flag in this container) — confirmed via a direct `npx lighthouse` smoke test before the full gate run. No script changes made.

## Hard gate — `node scripts/gate.mjs --target web --routes /landing-evolve/r42/a /landing-evolve/r42/b /landing-evolve/r42/c` (then isolated per-route to attribute failures)

| candidate | route · static · types · lint · weights · sweep · focus · console · a11y · perf |
|---|---|
| a — Why This One | 10/10 clean, first attempt |
| b — Tipping the Scale | 10/10 clean, first attempt |
| c — The Bracket | **dropped** — see below |

### c — hard-gate re-fail (dropped)

First gate: 2 failures.
1. `lint` — `react/no-unescaped-entities` ×2 (`page.tsx:148`, `:176` — literal `'` in JSX text).
2. `a11y` — 96, failed audit `color-contrast`. Root cause: `MatchCard.tsx`'s eliminated/non-winning-listing card wrapper applies `opacity-55` to the whole card (a CSS-opacity "dimmed" treatment), which blended its `text-zinc-950` title text down to `#787879` on white = 4.41:1 (just under the 4.5:1 floor, measured via Lighthouse's `color-contrast` audit detail).

**1-fix applied** (one fix opportunity per the hard-gate rule): escaped both apostrophes (`&apos;`), and raised the wrapper opacity `55→65` (computed: blending zinc-950's ~rgb(9,9,11) through 65% opacity against white yields ≈rgb(95,95,97), comfortably under the ~119-value cutoff for 4.5:1, vs. 55%'s ≈120 which sat just over it).

**Re-gate: still fails.** Lint is clean, but `a11y` still fails `color-contrast` — a **different, related** cause: the SAME `opacity-65` wrapper also blends down several other, already-marginal text colors that happened to still clear 4.5:1 at full opacity but don't survive ANY opacity blending toward white: the price/condition line (`text-zinc-700`, now 3.82:1), the "Eliminated" label (`text-zinc-500`, now 2.5:1), and an inline-styled score badge (`color:#71717A` on `background-color:#F4F4F5`, now 2.36:1). This reveals the actual defect isn't the one specific color I fixed — it's structural: applying CSS `opacity` to an entire card as a "dimmed" visual treatment is incompatible with AA contrast for any text in that card whose full-opacity color isn't extremely dark, because opacity blends every descendant color toward the background uniformly, and several of this card's text colors were already near the AA floor even before blending.

Per the hard-gate rule ("1회 수정 기회 → 재실패 시 탈락"), candidate c is **dropped** at this point — a second fix cycle is not permitted mid-round. The underlying defect is a **rule violation (color-contrast), not a defect in the Bracket concept/form itself** — the fix (stop using CSS `opacity` on text-bearing containers for a "dimmed" treatment; either give eliminated-row text its own directly-authored AA-safe color at full opacity, or apply the dimming only to non-text chrome like the border/thumbnail) is straightforward and well-scoped. Per this codebase's established convention, `reassign-queue.md` entries are populated at `/dash-falsify apply` time (not by `/dash-evolve` itself), so no queue edit was made here — this SCORES/DECISION record is what feeds that later process if "The Bracket" (live tournament output medium, asymmetric full-bleed macro, blue accent) is considered for reassignment in a future landing round.

c's `candidates/c.md` and source remain in place (not deleted) per this codebase's convention of keeping dropped-candidate sources for later reassignment/audit.

## Surviving candidates (judged)

- **a — Why This One**: buyer-facing hero, 3 discrete facet pickers (budget/condition-tolerance/category) drive a live-regenerating templated natural-language match-rationale paragraph — a genuinely new text-output medium for this catalog (distinct from the existing conversational-transcript and document-redline text outputs). Light theme, orange accent (`#EA580C`, 3.56:1 on white — large/fill only; tint `#C2410C`, 5.18:1 — small text/focus), `--font-display-wide`. Narrow centered single-column macro layout (deliberately avoiding the flagged 7/5-grid convergence skeleton).
- **b — Tipping the Scale**: buyer-facing hero, two named comparable listings + 4 weighted-priority sliders drive a literal rotating two-pan SVG balance beam (not a disguised gauge). Light theme, green accent (`#15803d`, 5.02:1 on white / 3.96:1 on dark ink), `--font-display-mono` (used for numeric/score display). Bilaterally-symmetric macro layout (deliberately distinct from both a's narrow column and c's would-be asymmetric sprawl).

Both confirmed: causal chain from live manipulation state → proof card(s) → closing-CTA recap; non-trivial default on load and on every control reset; hero proof cards inside the Hero fold; 4+ distinct interactions; computed (not guessed) accent contrast values, documented in each `candidates/<v>.md`.
