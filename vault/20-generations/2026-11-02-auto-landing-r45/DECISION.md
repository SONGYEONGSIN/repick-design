# auto-landing-r45 — DECISION

target: landing · round: auto-landing-r45 · date: 2026-11-02 (round 2 of this scheduled session's two requested back-to-back `/dash-evolve` invocations; round 1 was `auto-native-r47` (winner a, "Instant Trade-In Offer"), committed+pushed (`bdaa118`) before this round began)

`round-budget.mjs 2` returned N=1 again (0 unfilled PAGE_TYPES). Target drawn uniformly `[dash,landing]` (`native` excluded, already drawn by round 1 via Monday's weekly-cadence rule) → `landing`. `reassign-queue.md` confirmed empty (no pending entries for any target) at RETRIEVE — no reassignment consumed this round.

`catalog-variety.mjs` banList: last 3 landing winners (r42/b, r43/b, r44/c) were **all theme:light** (2+ consecutive triggers the ban) → this round's theme avoidance was `light`; all 3 candidates assigned `dark`. Accent/face bans were empty (no value repeated ≥2× in the last-3 window) — candidates assigned distinct hues (sky/rose/lime) and distinct display faces (grotesk/mono/none), per the "assign a different one per candidate, exclude at minimum the last 2 winners' face" rule (r44/c=`display-wide`, r43/b=`wide` — both excluded).

Agent tool confirmed available — used for all 6 subagent dispatches (3 blind `general-purpose` designers, 3 blind `general-purpose` judges; no custom designer/comparator agent type configured in this environment). Generation and judgment never performed by the same agent, nor by the orchestrator itself.

## Candidates

- **a — Live Payout Receipt** (`app/src/app/landing-evolve/r45/a/`): price slider + condition-grade selector drive a live itemized ticket/receipt (listed price → condition deduction → platform fee → shipping credit → net payout). Dark/sky/grotesk.
- **b — Match Reasoning Tree** (`app/src/app/landing-evolve/r45/b/`): 3-question branching quiz lights a decision-tree flowchart's path in real time, terminating in a computed match archetype (active-seller count + avg days-to-sell). Dark/rose/mono.
- **c — "Meet in the Middle" Side-by-Side Savings Split** (`app/src/app/landing-evolve/r45/c/`): draggable (pointer + full keyboard) vertical divider between two priced panels ("On repick" vs "Buying new"), one shared discount% variable recomputing both panels plus a "Save $X" badge live. Dark/lime/none (Pretendard only).

Three genuinely distinct output vocabularies (receipt/ticket document, branching flowchart, dual-panel draggable split) — none previously used in this catalog's extensive device-vocabulary history (data-viz widgets, chat transcripts, document redlines, radar gauges, 2D plots, layer stacks, histograms, maps, time-series charts). Confirmed by lens3 not to collide with each other or with the production catalog (`(marketing)/v6`–`v26`) beyond the single shared drag-handle *primitive* between c and `v6/Slider.tsx` (different purpose/payload, judged acceptable per this repo's "device differs in purpose" doctrine).

## Hard gate

Per-candidate gate (`node scripts/gate.mjs --target web --routes /landing-evolve/r45/<v> --app-root app/src/app`), run individually to localize a11y failures to their actual route (combined multi-route calls don't attribute `a11y`/`worstLighthouse` per-route — `auto-landing-r44` precedent):

| candidate | 1st attempt | 1-fix | re-gate |
|---|---|---|---|
| a | FAIL — `lint` 2× `react/no-unescaped-entities`; `a11y` 96 `color-contrast` (ghost-numeral token `text-zinc-800` on `#0B0B0F`, `aria-hidden` is not a contrast exemption per `page-brief-core` §2) | escaped both apostrophes; `GHOST_TEXT` → `text-[#6B6B78]` (this repo's own documented remedy for a ghost numeral on this exact background, `design-principles.md` §Layout, `auto-landing-r14`, 3.74:1) | **pass**, a11y 100 |
| b | FAIL — `lint` 1× `react-hooks/set-state-in-effect` (`useMounted.ts`) | rewrote `useMounted` to this repo's established `useSyncExternalStore` idiom (`landing-evolve/r34/a/useMounted.ts`) | **pass**, a11y 100 |
| c | **pass clean** — 0 violations | none needed | — |

All 3 candidates stayed within their single 1-fix allowance. Freeze hash computed post-1-fix and re-verified unchanged through screenshot capture (48 frames, 4 widths × 4 scroll depths, 0 blanks/errors) through judging: `6a38f6956f0384cae593d12a072eaf79c122e46d`.

## Judge panel (3 blind `general-purpose` Agent dispatches, no cross-lens visibility, `candidates/*.md` concept notes withheld from all 3)

- **lens1 (DNA/design-principles.md compliance)**: c > a > b. No hard brief violations in any candidate — a compliance-*degree* ranking, decided mainly by the hero/fold rule's real-world outcome at each candidate's actual **default state**: c (discount defaults to 42%, not empty) shows its complete proof — both prices, match%, grade/verified badges, savings badge — entirely within the fold on both desktop and mobile. a clips its net-payout row below the fold on desktop and shows almost nothing on mobile. **b is worst: its tree defaults to `EMPTY_ANSWERS`, so literally zero numeric proof is visible at scroll 0 on either width** — correctly placed inside the hero component, but with nothing yet to show. All three pass the live-value-reaches-closing-CTA doctrine, confirmed via source trace (not just screenshot), with b's honest "no path lit yet" fallback (rather than a fake number) singled out as the cleanest anti-pattern avoidance of the three. Full detail: `DECISION-lens1.md`.
- **lens2 (commercial polish)**: c > a > b. All three closing CTAs confirmed genuinely live via source trace + hand-verified math (a: default price 85/grade excellent → netPayout $75.66, confirmed exact; b: 3-factor multiplicative formula, 2 input combos hand-verified, not a lookup table; c: discount 42% on $480 → $278/$202 saved, confirmed exact, **and cross-checked live across 4 independent dollar figures at once** — the richest multi-figure liveness proof of the three). The decisive structural gap: `design-principles.md`'s L2-promoted rich-product-card requirement (photo/match%/condition/verified/discount) — a `grep` across all of b's source for `Image|matchPercent|verified|ITEM|photo` returned **zero matches**; c has all four signals in one row; a has two of four (grade+verified, no match%, single item only). A possible mobile image-bleed in c was flagged with explicit uncertainty (see Non-winner/environment-artifact section below — investigated and resolved, not a real defect). Full detail: `DECISION-lens2.md`.
- **lens3 (differentiation)**: b > a > c, no disqualifications. All three confirmed structurally distinct devices from each other and from the production catalog by direct source comparison. b (branching tree) found most structurally distinctive — no close neighbor found after checking `r42/c/BracketTree.tsx` (static, non-interactive), `v10/PreferenceGraph.tsx` (flat network graph), `r41/c/MatchQuiz.tsx` (flat pill filter). a (receipt) checked against `v14/PayoutCalculator.tsx` (plain form, not itemized/skeuomorphic) and `v13/LedgerCard.tsx` (closest cousin, no ticket skin) — novel presentation on a common mechanic. c (draggable split) checked against `v6/Slider.tsx` — same core drag-handle primitive (`setPointerCapture`, same event pattern) but a different payload (before/after image reveal vs. dual priced-panel comparison); judged acceptable per this repo's "device differs in purpose" doctrine, but flagged as the weakest novelty claim since drag-handle sliders are this catalog's most-repeated interaction primitive (also present in a, and in `v6`/`v13`/`v21`/`v24`/`r44/c`). Also noted (non-scoring, applies equally to all three, named as expected/systemic): all three share the identical `Hero`/`ValueSplit`/`SocialProof`/`ClosingCTA`/`Reveal`/`tokens`/`useMounted`/`data` file-split scaffold and section order, matching this repo's previously-documented macro-shell-convergence pattern (also present in production `v20`–`v22`). Full detail: `DECISION-lens3.md`.

## Aggregate — clean 2:1 majority for c

lens1 + lens2 both rank **c 1st**; lens3 ranks it 3rd. Not a tie (2:1 clean majority) — no tie-break procedure needed.

## Investigated, not a defect: c's mobile closed-sale thumbnail

Lens2 flagged, with explicit uncertainty, that c's mobile fully-scrolled screenshot (`shots/c-390-s100.png`) shows the "Brown shearling jacket" closed-sale comp card's alt text visibly bleeding below its 64px thumbnail. Investigated directly: `SocialProof.tsx:46` has the container correctly built per the image-regulation doctrine (`relative aspect-[4/3] w-16 shrink-0 overflow-hidden rounded-lg bg-[#1C1C22]`, fixed aspect-ratio + reserved background color, exactly as `design-principles.md`'s asset discipline requires). `curl -s -o /dev/null -w '%{http_code}' https://images.unsplash.com/...` from this sandbox returns `000` (connection failure) — this environment's egress proxy blocks `images.unsplash.com` entirely, the same documented artifact `auto-landing-r44`'s DECISION disclosed and excluded from scoring ("images.unsplash.com product photos render as blank placeholders in this sandbox — proxy blocks that host"). The alt-text overflow here is headless Chromium's own broken-image-alt-text rendering escaping a small `overflow-hidden` box in this sandbox specifically — not a reproducible defect in the candidate's code, which is correctly built. **No fix applied** — modifying already-compliant code to chase a non-reproducing sandbox artifact would itself be an unneeded change outside §3-1's scope (rule-violation resolution only). All three candidates use the same `next/image` + fixed `images.unsplash.com/photo-<id>` pattern already established elsewhere in this catalog, so none is penalized for it.

## Post-judgment §3-1 fix

Not needed. No enumerated rule violation was cited against winner c by any lens (the image artifact above was investigated and is not a code defect). Freeze hash unchanged since the final gate run.

## Non-winner findings (recorded, not fixed, not reassign-queued)

Both non-winning candidates passed the hard gate clean after their single 1-fix — pure judgment-stage losses, matching this project's established disposition (reassign-queue is for hard-gate drops only).
- **a**: missing match% badge; single-item proof only (lens2); net-payout row clips below the fold on desktop, almost nothing visible on mobile at scroll 0 (lens1).
- **b**: zero product imagery/badges anywhere in its source (lens2, a structural L2-doctrine gap, not cosmetic); empty default state means zero numeric proof visible at scroll 0 on any width (lens1) — despite being the most structurally distinctive device (lens3) and the cleanest anti-fake-liveness behavior (both lens1 and lens2).

## LEARN — new L1 delta

See `vault/00-principles/landing-deltas-provisional.jsonl` (round `auto-landing-r45`, variant `c`, drawing the contrast against non-winner b): the hero/fold product-proof rule depends on a live device's **default state at first paint**, not only its placement in the DOM. A device correctly embedded inside the hero component can still fail the rule if its default state is empty/unanswered (b's `EMPTY_ANSWERS` tree showed zero numeric proof at scroll 0 on either width), while a device that defaults to a non-trivial, pre-filled example value (c's 42% discount default) shows its complete proof immediately. This extends the existing "non-trivial default" doctrine (L2 since `auto-landing-r38`, extended at L1 by `auto-landing-r41/b` to every control reset, not just first load) one more step: the requirement isn't just about avoiding an empty/zero *value*, it specifically gates whether the hero-fold proof rule is satisfiable at all.

No refinement-gate promotion this round (single instance of this specific fold-rule sub-case; the parent non-trivial-default doctrine is already L2/L1 from its own prior reproductions). No new `questions-queue.md` entry — the lens split (2:1, not a tie) needed no escalation, and the image artifact above was fully resolved by investigation, not left open.

## Canon / invariants

`design-principles.md`, `page-brief-core.md`, `page-brief-repo.md`, `dash-brief-v3.md`, all type profiles, `/dash` gallery, `(marketing)` production catalog (`v6`–`v26`) all fully unchanged throughout. `landing-deltas-provisional.jsonl` append-only (1 new entry). `reassign-queue.md` untouched (nothing pending, nothing to archive). No commits to `main`, all on `evolve/dash`.

**This completes both of this scheduled session's two requested rounds** — round 1 = `auto-native-r47` (winner a, unanimous 3-0, plus an L2 promotion of the architecture-collision doctrine via non-winner c's independent reproduction), round 2 = `auto-landing-r45` (winner c, clean 2:1 majority). 0 candidates dropped at hard gate across either round (2 total 1-fixes used across native r47's 0 + landing r45's 2), 0 no-winner rounds, canon fully unchanged throughout both.
