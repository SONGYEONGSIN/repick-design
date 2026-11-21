# auto-landing-r29 — DECISION

Target: **landing** · Round: **auto-landing-r29** · Date: 2026-10-01
Second of two independent `/dash-evolve` executions in this scheduled 2-round-back-to-back run (the first was `auto-dash-r33`, winner a).

## §0 Target selection

- `round-budget.mjs "2"` → N=1 again this execution (0 unfilled `PAGE_TYPES`).
- Target drawn uniformly from `[landing, native]` (dash excluded — already generated as round 1 of this execution, per the skill's consecutive-round exclusion rule) → **landing**.
- Round number: `auto-landing-r29` (max existing landing round 28 + 1).
- Agent-tool availability re-confirmed fresh for this execution (not assumed from round 1) — this round is NOT `self_judged`.

## §1 RETRIEVE (summary)

Read in full: `design-principles.md`, `page-brief-core.md`, `page-brief-repo.md`, `curation-criteria.md` (all already in context from round 1 — re-confirmed, not re-fetched), `landing-deltas-provisional.jsonl` (60 entries — 14 open/non-superseded identified and folded into designer briefs as directives), `ux-guidelines.catalog.md` + `motion.catalog.md` (dash-only catalogs — `charts.catalog.md`/`colors.catalog.md` skipped per landing's own catalog scope), last 5 landing ledger entries (r25, r27, r28, plus the r26 no-round and a duplicate r25 entry), `reassign-queue.md` (3 landing items, all in archive — **no pending landing item this round**).

- `catalog-variety.mjs` banList (recent 3 valid-variety landing rounds: r28 light/rose-hex/mono, r27 dark/emerald/wide, r25 light/blue-hex/grotesk) → `{theme: [], accent: [], face: []}` — fully free assignment this round.
- Macro/output-visualization avoidance: by r28, this catalog had exhausted every item on its own previously-tracked "untried" shortlist (dial, N-row-list, curve+rollup, scatter, layer-stack, histogram, waterfall, node-graph, circle-pack, radial-arc, streamgraph, heatmap-grid, radar polygon, treemap, slope/bump chart, Sankey/flow, funnel chart, parallel coordinates). This round required identifying genuinely fresh **input×output combinations** rather than a fresh chart type alone — sourced directly from two open deltas (`r19/b`: continuous multi-slider → live re-sorting table; `r17/b`: discrete multi-toggle → cascading gate chain) plus a fresh output-visualization device (a full multi-node constellation graph, distinct from the single-click graph-node interaction already in the catalog).
- Open-delta directives folded into all three designer briefs: baseline-diff widgets must not start at a tied/zero default (r9/c), dual-accent requires a stated functional axis-split (r12/c, not used this round — single-accent-per-candidate assignment), persistent header/nav is required even with a flawless hero (r22/b), nested `overflow-x-auto` inside a CSS grid item can leak a few px of overflow (r25/a), a headline that states the device's own insight reads better than a bolted-on value-prop sentence (r27/b), `whileInView` reveals must mount-gate with `useSyncExternalStore`, not `useReducedMotion()` alone (r28/a, critical — given verbatim code pattern to all three), and assigning distinct top-level visualization categories does not by itself prevent one-level-down convergence in hero narrative/copy templates (r28/c — this round reproduces this finding, see LEARN).

## §2 GENERATE

Three designer agents dispatched in parallel, each given the full assembled brief inline (not links), each isolated from the other two candidates and from `/v1`-`/v5` and `/dash`.

- **a — "Caliper"** (teal, `--font-display-mono`, dark): 3 continuous weighted dials (price sensitivity / shipping speed / seller trust) drive a live-reordering 8-row leaderboard with animated per-row rank-delta badges (▲/▼/– + number, never color alone). Default weights (65/30/55) deliberately non-neutral so the board opens already non-tied. 4 interactions. Live top-match name/price/score threads verbatim to the closing CTA.
- **b — "Gatelist"** (green, `--font-display-wide`, light): 5 independent buyer-requirement toggles drive a true cascading gate-chain pipeline over a 10-listing pool, each listing evaluated gate-by-gate with a `pass`/`fail`/`bypassed`/`unreached` status per stage (not a simple AND-filter), running qualifying-count + top-pick live through to the closing CTA. Default state (2 gates on) yields 5/10 qualifying — explicitly engineered non-degenerate.
- **c — "repick"** (lime, `--font-display-grotesk`, dark): hand-built SVG constellation graph, 4 buyer-need nodes × 6 product nodes across 12 explicit weighted edges, click/focus a need node to re-emphasize its edges and show always-legible match detail (never hover-only). Opens on the single strongest edge in the dataset (Condition→Air Jordan 1, 97%). Includes an always-present accessible fallback table (network graphs are the catalog's own documented D-grade-accessibility chart type).

## §3 HARD GATE

See `SCORES.md` for full tables. a and c each failed pass 1 (a: one `react-hooks/refs` lint error reading a ref inside `useMemo`; c: 4 `cell-overlap` violations at 390px in its fallback table from shrink-to-fit buttons spilling into neighboring columns). b passed clean on the first attempt. Both a and c fixed correctly on their one allowed attempt and passed re-gate clean. **No candidate dropped this round** — all three proceeded to judging, a first since `auto-dash-r27`/`auto-landing-r27` era where single-fix survival was universal.

Source hash at freeze (all 3, pre-gate): `72d7a1ed302e29b729db65076be65e54b6266444`.

## §4 JUDGE PANEL (3 survivors: a, b, c)

**Lens 1 — brief/DNA compliance → 1st: a, 2nd: b, 3rd: c.**
a and b both pass essentially every checked rule cleanly (hero-contained product+proof, live-state-to-closing-CTA traced end-to-end and genuinely live in both, correct accent contrast arithmetic including the white-vs-dark-ink fill distinction, exactly 3 rendered weights in both verified against each display face's actual declared weight range, correct `useSyncExternalStore`-based hydration gating, no dead focus idioms, no heading skips). c's deciding issue: its hero renders **two CTAs** ("Trace your matches" + "See all listings") where the brief requires exactly one — a concrete, citable structural violation. Lens1 also flagged a non-disqualifying aesthetic risk on c (its constellation graph's line/label density reads closer to the banned "blueprint" line-art look than a's/b's more restrained accent usage, and its headline's max clamp size is notably smaller than a's/b's, weakening "impact from typographic scale").

**Lens 2 — commercial polish → 1st: b, 2nd: a, 3rd: c.**
All three pass "manipulation survives to the closing CTA" and "non-trivial default state" cleanly (no "fake interactivity" found anywhere this round). The deciding factor is first-fold completeness: a and b both show complete commerce proof (price + match% + grade/verification) inside the unscrolled hero frame; c's hero shows the graph and its node labels but defers the actual priced listing card and verification badge to content that falls outside the 1440px fold. Between a and b, b's gate-chain table is judged the more sophisticated, "this week's shipped feature"-reading component, outweighing a minor cosmetic quirk (three consecutive identical "remain" counts in its default view, logically correct but visually reads ambiguous at a glance).

**Lens 3 — archetype/differentiation → 1st: c, 2nd: b, 3rd: a.**
All three devices verified as genuinely functioning as claimed (a's leaderboard truly re-sorts with ref-based temporal rank-delta tracking; b's gate-chain truly evaluates sequentially with a real `unreached`-vs-`bypassed` distinction, not a boolean filter; c's graph has real multi-node structure with dual-channel edge encoding). No below-surface state-architecture collapse found — the three candidates' actual wiring mechanisms (weighted-dict+delta-ref vs. toggle-set+pure-fold vs. dual-coupled-ID+local-child-state) are judged genuinely distinct beneath the shared, unavoidable "lift state → derive → render" shape. However, lens3 flagged a real copy-level convergence (see LEARN) between **a and b specifically** (near-identical headline and proof-subhead sentence templates, independently written) — c was not implicated. Lens3 ranked c 1st for most fully executing its assigned axis (output-exploration of a precomputed, accessibility-poor chart type) while visibly engineering around that type's own known accessibility weakness (the always-present fallback table) — judged the most ambitious, least-templated build. a ranked last on this lens specifically for being the candidate most implicated in the copy-template convergence and sitting closest to a familiar "importance-weighted scoring" UX pattern from real products, despite its own genuinely novel rank-delta mechanism.

**Aggregate: complete 3-way split on 1st place (a: lens1, b: lens2, c: lens3 — one vote each).**

### Tie-break (curation-criteria "3파전 동률 tie-break 예외", 2026-07-25)

Rule: on a complete 3-way tie, lens1 (brief) priority applies by default — UNLESS lens3 (archetype/differentiation) ranked lens1's top pick **dead last**, in which case that candidate is excluded from the tie-break and lens1's preference is re-applied among the remaining two.

- Lens1's top pick: **a**.
- Lens3 ranked **a dead last (3rd of 3)** — the exclusion condition holds (unlike the `auto-native-r27` precedent earlier this session, where the analogous check did NOT hold and the default lens1-priority applied directly without exclusion).
- Excluding a, lens1's ranking among the remaining {b, c} prefers **b** (its overall 2nd place) over c (its overall 3rd place).
- **Winner: b ("Gatelist").**

## Winner: b ("Gatelist")

No lens found an unresolved rule violation in b (lens1: zero violations; lens2's only note was a cosmetic data-presentation quirk, not a rule violation; lens3's note was a cross-candidate copy-template observation implicating b and a jointly, not something to patch in b alone post-judgment). **No §3-1 post-judgment fix required.**

## §5 LEARN

One delta extracted and appended to `landing-deltas-provisional.jsonl`, promoted directly to **L2** as a 2-round reproduction of an existing open L1 delta (`auto-landing-r28/c`):

> Assigning three landing candidates genuinely distinct, isolated hero mechanisms (a continuous-slider-driven leaderboard, a discrete-toggle gate-chain, and a node-graph exploration) does not prevent independent convergence on a shared headline/subhead/footer-copy TEMPLATE one level below the mechanism itself. In `auto-landing-r29`, candidates a and b — built by fully isolated agents with no shared context — independently wrote: (1) a near-identical two-imperative-sentence headline skeleton ("Set your [X]. Watch the [Y] [verb].", with "Watch" repeated verbatim), (2) a near word-for-word proof subhead ("Buyers trust the [X], not just the result."), and (3) the same footer-tagline template ("[axis list] — [past-participle clause], [negated alternative]."). Candidate c, assigned a structurally different output-visualization axis, did not converge on any of these templates. This reproduces `auto-landing-r28/c`'s finding (that output-visualization-category assignment alone does not block one-level-down narrative/copy convergence) in a new round with entirely new candidates and a new specific template shape — the two reproductions share the defect CLASS (category/mechanism assignment prevents top-level convergence but not copy-template convergence) despite different concrete templates, meeting this catalog's "reproduction judged by defect class, not surface technique" standard.

Level: **L2** (2-round reproduction: `auto-landing-r28/c` + `auto-landing-r29`). `judge_votes: {lens1: "a", lens2: "b", lens3: "c"}` (recorded as the round's aggregate vote split, since this delta derives from lens3's cross-candidate observation specifically). `confidence: high`. `supersedes: auto-landing-r28/c`.

No new `questions-queue.md` entry this round — the complete 3-way tie was resolved by an already-established rule (`curation-criteria`'s 2026-07-25 tie-break exception), not a novel conflict requiring a new question. This is itself notable: it is the first round observed in this session where the exclusion condition inside that rule actually fired (the `auto-native-r27` precedent earlier this session checked the same condition and found it did not hold).

No reassign-queue update — no candidate was dropped at the gate this round (both 1-fix attempts succeeded).

## Canon

Unchanged: `vault/00-principles/dash-brief-v3.md`, `vault/00-principles/design-principles.md` untouched. `/dash` gallery and `/v1`–`/v5` untouched. `landing-deltas-provisional.jsonl` append-only (+1 entry). No commits to `main`.
