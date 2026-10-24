# auto-landing-r35 — DECISION

Target: `landing` · Round budget: `node scripts/round-budget.mjs 2` → **1** ("미채움 0종 — N≥2 의 근거(커버리지)가 없다", unfilled: 0, requested: 2). The scheduled prompt asked for 2 consecutive rounds; per `/dash-evolve` §0-0-1 the script's answer is authoritative and overrides the caller's requested N. **Only one round ran today.** Native-day check: 2026-10-16 is UTC Friday (`getUTCDay()===5`), not Monday, so the weekly native-day override did not apply even though N<2 made it moot anyway. Target rolled by the dash/landing/native uniform-random fallback (unfilled queue empty): **landing**.

Round id: `auto-landing-r35`. Run dir: `vault/20-generations/2026-10-16-auto-landing-r35/`.

## Candidates

- **a** — "Grading Certificate": light theme, emerald accent, `--font-display-wide`. Generative appraisal-certificate device (grade/tier selectors + 2 checklist toggles → live trust score + stamped verdict + signature/barcode SVG).
- **b** — "The Duel": dark theme, rose accent, no display face. Head-to-head comparator: pick 2 of 4 fixed listings, 4 fixed-weight axes race in bidirectional bars, aggregate verdict bar.
- **c** — "Seller Payout Simulator" (**reassigned** — `reassign-queue.md` #12, reproducing `auto-landing-r34/c`): light theme, sky accent, no display face. 3 stepper counters (Electronics/Fashion/Home) → live total, itemized breakdown, stacked-bar mix.

## Hard gate (§3)

All three candidates passed the full gate (`static`/`lint`/`types`/`weights`/`sweep`/`focus`/`console`/`a11y`/`perf`) — see `SCORES.md` for the per-gate table. Two 1-fixes consumed (both mechanical, not design changes):
- **a**: `graphics.tsx` — `react-hooks/immutability` (render-time variable reassignment in `Barcode()`) → rewrote as a `reduce` accumulator.
- **b**: `ThumbArt.tsx` — static-check `img-needs-alt` false positive, triggered by the literal substring `<img>` appearing inside a source *comment* explaining the file contains no raster images → reworded the comment.
- **c**: passed clean, no 1-fix — confirms both `reassign-queue.md` #12 fixes hold (lint: `useSyncExternalStore`-based mount gate; sweep: `table-fixed`+`colgroup` replacing the `overflow-x-auto` pattern that leaked into `document.scrollWidth` at 390px).

**Environment note** (orchestration-only, not a design/content issue): this session's Lighthouse runs needed `CHROME_PATH=/opt/pw-browsers/chromium` (chrome-launcher doesn't automatically pick up Playwright's bundled browser path) and `PW_NO_SANDBOX=1` (this container runs as root; Chrome refuses to launch without `--no-sandbox` as root). Without both, `a11y`/`perf` silently soft-passed as `unavailable` for every candidate — caught and fixed before judging, so all three candidates have real Lighthouse scores (a11y 100 for all three, perf 66/68/61).

3 of 3 candidates survived to JUDGE.

## Judge panel (§4)

Blind 3-lens panel, frame budget 4 screenshots/candidate (`<v>-1440.png`, `<v>-1440-s100.png`, `<v>-390.png`, `<v>-390-s100.png`) + full source read.

| Lens | Focus | Ranking |
|---|---|---|
| 1 | Brief/DNA compliance | **a** > b > c |
| 2 | Commercial polish (Linear/Stripe/Vercel-tier) | **b** > c > a |
| 3 | Architectural differentiation | **b** > a > c |

**Aggregate: b wins 2:1** (lens2 + lens3; lens1 placed it 2nd, not last). No no-winner votes from any lens → no tie-break procedure needed.

### Why b won
- **Lens3 (differentiation)**: the duel's (input×output) pair — *which 2 of N fixed items compete* (selection, not slider/toggle/drag) × *bidirectional per-axis race bars + aggregate verdict with FIXED weights* — reduces to a genuinely new combination versus the catalog's existing weighted-slider→single-radial-gauge and continuous-slider→reordering-leaderboard devices (both make the weights the input; here the item *pair* is the input and weights are held constant). Confirmed via `Hero.tsx:133-165` (selection), `:272-295`/`:314-337` (bar output), `data.ts:83-141` (fixed weights).
- **Lens2 (commercial polish)**: the duel device fully resolves within the first viewport (`b-1440.png`) — selectors, all 4 axis rows, verdict bar all pre-scroll — the strongest "working product, not a mockup" read of the three. The live winner's identity threads through **three** surfaces (hero comparison → value-section recap → closing summary sentence **and** the CTA button's own label, `Hero.tsx:104-109`, `ValueSplit.tsx:70-79`, `ClosingCta.tsx:33,43`) — a stronger instance of the already-established "manipulation survives to CTA" doctrine (previously confirmed at two surfaces only: `auto-landing-r30/b`, `auto-landing-r32/c`).
- **Lens1 (brief compliance) dissent, for the record**: ranked b 2nd, not last — its stated reasons for preferring a: (1) a's 4 proof cards are all physically inside the hero section matching the mandatory schema most literally, though only 1 of 4 is legible without scrolling at the captured viewport height (b fares worse here — 0 of 4 legible at scroll-0 in `b-1440.png`, only placeholder tops visible); (2) b's rose accent has a broader total-area footprint (headline color-word + button + multiple badge fills + split bars + a full-width tinted verdict box) than a's or c's narrower single-hue usage, which lens1 read as pushing against the near-monochrome "accent stays minimal in total area" principle even though it's a single hue. Neither point reversed the majority, and no lens flagged either as a hard rule violation (both are "legibility at a specific viewport height" and "area-of-restraint" judgment calls, not binary pass/fail items) — so §3-1 (post-decision fixes, rule-violation-only) does not apply here. Logged for the refinement gate.

### Full judge transcripts (condensed — each judge gave all 4 required parts: ranking, per-candidate reasoning, file:line/frame evidence, self-reported unseen scope)

**Lens 1 — brief/DNA compliance** (1st: a, 2nd: b, 3rd: c): deciding factor was the mandatory proof-card schema (item #2) — a matches it most literally (4 cards, all 4 badge fields, inside the hero) even though only 1/4 is legible pre-scroll; b matches the schema structurally but 0/4 legible pre-scroll; c deliberately ships only 1 proof card and omits 2 of the 4 required badge fields (match%, discount%) with an explicit in-source rationale ("a seller doesn't have a match%") — a reasoned but real deviation from the stated spec. Device-to-data wiring, non-zero default diffs, and CTA-threading were all confirmed clean for a and b; c has no baseline-diff display so that sub-check didn't apply. No Korean-copy violations, no schedule-recompute credibility violations, no mobile clipping/collisions visible in any candidate. Unseen scope: did not open every supporting file per candidate (reveal/graphics/value-split for a; ThumbArt/Reveal internals for b; ui/Stepper/StackedBar/Reveal for c), did not independently recompute contrast ratios (trusted in-source documented math), only had the 4 given frames so couldn't rule out mid-page defects.

**Lens 2 — commercial polish** (1st: b, 2nd: c, 3rd: a): b's duel resolves almost entirely within the first viewport and its "Add to duel" product-card toggles are genuine state-changing controls that visibly feed the hero device, plus the strongest frame-to-frame narrative continuity (CTA sentence + button both bound to the live duel winner). c is the cleanest, most restrained, most Stripe/Mercury-adjacent execution with the most quantitatively precise CTA binding (exact counter value in both sentence and button) and documented accessibility polish, but its hero device is the least visually rich of the three and its richest interaction (expandable math rows) sits below the hero. a has a strong, purposeful certificate/seal motif but a conspicuous dead zone in its hero right rail and a looser CTA-binding pattern (summary sentence cites `score`, button binds to a different variable `tier`). No hard-gate-adjacent violations found in any (all three have real sticky headers, insight-stating headlines, no line-wrap defects, no fake-recompute claims). Unseen scope: no mid-scroll frames were available so mid-page sections weren't visually verified (including c's documented overflow fix, which could not be re-confirmed visually); several supporting files per candidate were not read in full; no live interaction testing; no independent contrast-ratio computation.

**Lens 3 — architectural differentiation** (1st: b, 2nd: a, 3rd: c): reduced each candidate to (input×output) and compared against the existing catalog roster. b clears the bar on both axes (selection-of-pair input, bidirectional-race-bar output). a clears it on one axis only — its certificate/document output vocabulary is genuinely new, but its discrete-selectors→weighted-sum input is the same shape as existing toggle/checklist-driven rollup devices (gate-chain pipeline, variable-cardinality set-builder), just differently rendered. c is explicitly exempted from novelty scoring (sanctioned reproduction of its own prior self per the reassignment) and ranks 3rd on this lens by design, not as a quality judgment — assessed instead on faithfulness/polish of the reproduction, which read clean (consistent math, real accessibility care, explicit empty-state handling). Flagged for downstream signal (not decisive for this lens): all three candidates share the same macro page-chrome skeleton (eyebrow → display headline → subcopy → CTA / device panel → stat-pair band → testimonial row → closing CTA band) — CTA phrasing itself differs materially across all three, so this reads as page-chrome convergence, not device convergence. Unseen scope: read only the core device files per candidate (not every supporting/page-chrrecome file), no live interaction testing, source+frames only.

## LEARN (§5)

```
node -e "import('./scripts/design-loop.mjs').then(m=>m.appendLedger({round:'auto-landing-r35',variant:'b',delta:'A head-to-head \"duel\" comparator — selecting WHICH TWO of N fixed candidates compete (a selection input, not a slider/toggle/drag) producing bidirectional per-axis race bars + an aggregate verdict bar, with scoring weights held FIXED rather than user-adjustable — is a genuinely novel (input x output) pair distinct from the catalog landing/dash-evolve/r35/b won the round 2:1 (lens2 commercial-polish + lens3 differentiation; lens1 brief-compliance ranked it 2nd, not last) on exactly this axis, and separately on lens2 for threading the SAME live-derived value (the winning items name) through THREE surfaces -- the hero comparison, a value-section recap, AND both the closing summary sentence and the CTA buttons own label -- the strongest instance yet of the established manipulation-survives-to-CTA doctrine, previously confirmed only at two surfaces (auto-landing-r30/b, auto-landing-r32/c).',evidence:'lens3: \"the bidirectional tug-of-war bar shape... is a genuinely new output shape in this catalog... weights there are the input; here theyre fixed and the item pair is the input\" (Hero.tsx:133-165,272-295,314-337; data.ts:83-141). lens2: \"richest interaction... visibly feed the hero device... giving the strongest frame-to-frame narrative continuity of the three\" (Hero.tsx:104-109, ValueSplit.tsx:70-79, ClosingCta.tsx:33,43).',judge_votes:{lens1:'a',lens2:'b',lens3:'b'},confidence:'high',level:'L1',status:'provisional'},'vault/00-principles/landing-deltas-provisional.jsonl'))"
```

(command executed; see commit for the appended jsonl line)

## Knowledge refinement gate (§6)

- Clustered against the 24 active landing deltas read at RETRIEVE. No conflicting pair found — this round's delta is additive (a new catalogued device + a reinforcement of an existing L2 doctrine at a higher bar), not a contradiction of anything provisional.
- **Re-level check**: the CTA-threading-to-three-surfaces observation is a strengthening of an already-L2 doctrine (`auto-landing-r30/b`, `auto-landing-r32/c` established it at two surfaces). It does not itself get a second independent-round reproduction at the *three-surface* bar specifically in this round, so it stays folded into this round's **L1** entry rather than minted as its own L2/L3 — if a future round independently reproduces the three-surface pattern, that reproduction should supersede this entry to L2.
- **No delta re-leveled this round** (no 2nd-round reproduction of any existing L1 landed today — N=1, no second landing round to compare against this session).
- **Question generated**: lens1's dissent raises a genuine, not-yet-resolved tension — is "total accent area" (lens1's objection to b's broad single-hue rose footprint) a real near-monochrome violation axis independent of hue-count, or a taste call that doesn't rise to a rule? The existing accent rules (`design-principles.md` §Color Tokens) cover hue freedom + contrast math + dual-accent conditions, but say nothing about area/footprint as a separate axis. Logged to `questions-queue.md` as a new open question (target: landing, background: lens1's b-critique this round, tentative hypothesis: "area of a single accent hue, not just its hue-count, may need its own ceiling — candidate for a future delta if a second round reproduces this specific lens1 pattern (brief-lens docking a technically-single-hue candidate for area, not hue-count)").

## Record (§7)

- `auto-ledger.jsonl` entry appended: target=landing, round=auto-landing-r35, winner=b, no_winner=false, hardgate summary, judges={lens1:a,lens2:b,lens3:b}, variety={theme:dark, accent:rose, face:none/pretendard}.
- `vault/index.md` "세대 기록" updated with this run.
- Canonicals untouched (`dash-brief-v3.md`, `design-principles.md`, `/dash` gallery, `/v1`–`/v5`) — confirmed via `git diff --stat` before commit.
- jsonl append-only — confirmed (no existing lines edited, only new lines appended).
- No commit to `main` — all commits on `evolve/dash`.

## Scheduled-task note (round-count discrepancy)

The scheduled prompt that triggered this run asked for 2 consecutive rounds and listed "2 ledger entries / 2 run directories / 2 commits" as part of its success criteria. Per `/dash-evolve` §0-0-1, `scripts/round-budget.mjs 2` returned **1** because the unfilled-page-type queue is empty (`PAGE_TYPES` in `app/src/lib/works.ts` — all 18 types already have at least one catalog entry), and the skill is explicit that this script's answer overrides the caller's requested N regardless of what's asked. This is not a failure of this run; it is the skill's own documented self-correcting mechanism (added 2026-09-12 specifically because an earlier manual run had ignored an equivalent inline rule and wrongly run a 2nd round anyway). Only `auto-landing-r35` ran today.
