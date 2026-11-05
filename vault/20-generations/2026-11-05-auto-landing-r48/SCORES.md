# SCORES — auto-landing-r48

Freeze hash (candidate source, unchanged registration→gate→screenshot→judging): `9b47eb480347b27d4638d8a0a0fc5bd1973a5388`

## Candidates
- **a** — "Sorting Yield" (`app/src/app/landing-evolve/r48/a/`) — reassignment of `reassign-queue.md` #21 (`auto-landing-r47/c` "Allocation Flow"), Sankey-style proportional flow diagram (Pass as-is / Refurbish, then sell / Declined) + strictness toggle. light/rose/`--font-display-wide` (preserved from original).
- **b** — "Trade Path Simulator" (`app/src/app/landing-evolve/r48/b/`) — 2-step branching decision tree (sell-method choice) lighting up the committed path + live compounding payout/days-to-cash. dark/blue/no display face.
- **c** — "Sell-Through Window" (`app/src/app/landing-evolve/r48/c/`) — dual-handle time-range selector over a 90-day window, driving a live-clipped trend chart + headline days-to-sell stat. light/emerald/no display face.

## Hard gate (`node scripts/gate.mjs --target web --routes /landing-evolve/r48/a /landing-evolve/r48/b /landing-evolve/r48/c`)

**10/10 clean on first attempt** — route/types/static/lint/weights(3종)/sweep/focus/console/a11y(100)/perf(67), `violations: []`. Zero 1-fix used.

48 screenshots captured (4 widths × 4 scroll points × 3 candidates), zero blanks, zero capture errors.

**Known environment artifact**: all 3 candidates use `images.unsplash.com` product photos, which render as empty/gray boxes in these screenshots — this sandbox's outbound network to external image hosts is blocked (confirmed via `curl`, connection refused). This is a documented prior-session artifact (`questions-queue.md` Q49), not a candidate code defect, and applies uniformly to all 3 candidates this round, so it was explicitly excluded from judging per instruction to all 3 lenses.

## Judge panel (3 independent blind general-purpose Agent-tool subagents, no cross-lens visibility, `candidates/*.md` withheld from all 3)

| lens | 1st | 2nd | 3rd |
|---|---|---|---|
| lens1 — brief/DNA compliance | c | b | a |
| lens2 — commercial completeness | c | b | a |
| lens3 — structural differentiation | c | a | b |

**Unanimous 3-0 for c.** No tie-break needed.

### lens1 (DNA compliance) summary
Decisive axis: the hero-fold product-proof rule, graded by completeness not just presence. c: 2 full `ProductCard`s (all 4 badge types: match%/grade/verified/discount) rendered inside the Hero component, visible at first paint both widths. b: 1 product's proof inside Hero but only 3/4 badge types (no discount%) — the full 4-badge `ProductCard` only appears below-fold. a: the Sankey device itself shows live aggregate proof inside the Hero, but the actual product-preview cards with all 4 badges are a sibling section only visible after ~35% scroll — the closest of the three to the explicitly-named anti-pattern. All 3 clean on every other rule (determinism, font weights, focus pattern, dark-text contrast, accent contrast math independently re-derived and confirmed correct for all 3, causal persistence to ClosingCTA verified for all 3).

### lens2 (commercial completeness) summary
c 1st: all live math hand-verified exactly correct (re-executed `windowStats()` in Node); deepest/most robust interaction (full keyboard-operable dual slider); proactively flags its one static figure as historical to avoid self-contradiction. b 2nd: math verified correct, but a **real verified bug** — the "Four listings your estimated payout could cover" product list is a static set not gated against the live payout, so after clicking to a lower-payout path (e.g. instant-bank $1,395) the page can show a $1,640 item as "affordable," directly contradicting its own "nothing is estimated after the fact" copy. a 3rd: math also verified correct, but **two real defects** — band labels sized as fixed-12px HTML against a percentage of a fixed viewBox truncate/crowd at 390px (visible by default, no interaction needed), plus a minor "a 89%"→"an 89%" grammar nit.

### lens3 (differentiation) summary
c 1st: independently verified as genuinely novel — searched both `(marketing)/v6-v26` and `landing-evolve/r23-r47` for dual-handle/time-window/trend-chart shapes, found only a distant relative (`r32/a`'s dual-handle *price* filter → box-plot, different input semantics and output shape), confirmed no match. a 2nd: a disclosed, intentional reassignment (not claiming novelty) — diffed against `r47/c` and confirmed the reuse is earning its keep (real a11y hit-box fix, independently re-authored data/copy, a materially different responsive headline strategy), not a relabel. b 3rd: **major finding — the "believed-novel" label does not survive independent verification.** `landing-evolve/r45/b` ("Match Reasoning Tree": `ReasoningTree.tsx`+`LitLine.tsx`) is the same input×output device under this project's own Q6 framework — sequential multi-level single-choice tree traversal → animated lit-path diagram + one resolved leaf value in a summary panel — despite different domain words (buyer match-reasoning vs. seller trade-path) and minor mechanic differences (3 levels/hard-locked future steps vs. 2 levels/always-visible-dim steps).

## Non-winner findings (recorded, not queued — both non-winners passed the hard gate clean 10/10, so per this project's established disposition pure judgment-stage losses are not reassign-queue candidates even when a real bug or collision is found)
- **a**: hero-fold proof is device-only, not product-card-complete (lens1); 390px band-label crowding, visible by default (lens2).
- **b**: hero proof is 3/4 badge types, missing discount% (lens1); static product list can contradict live payout after interaction (lens2); **structural duplicate of `r45/b`'s "Match Reasoning Tree"** despite the round's own "believed-novel" assignment (lens3) — see "process learning" below.

No post-judgment §3-1 fix needed on winner c — zero defects/violations cited against it by any lens; freeze hash unchanged throughout.

## Process learning (orchestrator-side, not a design-principles.md finding)
The pre-GENERATE dedup research fork was asked to verify "Priority Ranking Composer" and "Time Window Retention Curve" specifically. "Priority Ranking Composer" came back saturated (correctly rejected), and the orchestrator substituted "Trade Path Simulator" as a replacement **without re-running the dedup check against that specific substitute** before assigning it to candidate b. lens3's independent, mandatory per-candidate catalog search caught the resulting collision (`r45/b`) that the original one-shot research pass never looked for. The blind judge panel's own independent-verification requirement is what caught this — not the RETRIEVE step — which is exactly what that requirement is for, but it means RETRIEVE-stage dedup is only as good as its last re-verification. See DECISION.md for the corresponding `questions-queue.md` entry.
