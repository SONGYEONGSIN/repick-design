# auto-landing-r25 — DECISION

## §0 Round budget & target
- `node scripts/round-budget.mjs 2` → **1** (0 unfilled `PAGE_TYPES`, same condition as round 1 of this scheduled execution pair, `auto-native-r26`). Second, independent invocation of the outer 2-round request — each invocation re-runs round-budget independently and gets capped to 1.
- Target draw: unfilled=0 → random among `[dash, landing, native]`, **excluding `native`** (already produced this session, per the consecutive-round coverage rule) → random among `[dash, landing]` → **landing**.
- `reassign-queue.md` "대기 중" has no landing entry — no reassignment this round.
- Round number: max existing `auto-landing-r*` in the ledger is r24 → this round is **r25**.

## §1–2 GENERATE — 3 candidates, 3 new output-visualization geometries
Landing catalog already has 9 output-visualization forms (dial, N-row list, curve+rollup, 2D-coordinate scatter, layer-toggle stack, distribution histogram, waterfall/bridge, node/edge graph, circle-pack — the last two from `auto-landing-r24` even though they lost). Assigned 3 genuinely new geometries:
- **a — "Fair Price Matrix"** (`app/src/app/landing-evolve/r25/a/`): 2D grade×age-bracket heatmap table, segmented grade control + age slider drive a highlighted cell + live price/percentile readout. Light theme, orange accent.
- **b — "Authentication Confidence Ring"** (`.../r25/b/`): multi-segment radial arc (4 toggleable verification-method segments, not a single gauge/dial), toggling recomputes a center confidence %. Light theme, sky accent.
- **c — "Category Demand Ribbon"** (`.../r25/c/`): 4-band streamgraph across a 12-month timeline, 4 weight sliders + presets reflow band thickness/order + a "your item" marker/readout. Light theme, orange accent.

Pre-fix source hash: `78353ed00f70faee66f4cc1f25b38ba32e5ee4fb`. Post-1-fix (frozen for judging): `e2ebea0446325dc2368d0d025f6761bcd59be419`.

## §3 HARD GATE
`node scripts/gate.mjs --target web --routes /landing-evolve/r25/<v>` per candidate, dev server on :3100.
- **a**: 1-fix — `sweep` page-overflow 11px at 390px. Root cause required careful bisection (every element in the subtree individually measured within viewport bounds; `overflow-x-clip` on the ancestor section did NOT stop the leak). Fix: `[contain:layout]` on the section wrapping the grid+scrollable-table pair — verified live via `page.evaluate` before committing to source, then via full re-gate. See SCORES.md and the new landing delta for full detail.
- **b**: 1-fix — `lint` 3× `no-unused-vars` (color constants superseded by inline Tailwind arbitrary values elsewhere in the file). Trivial removal, re-gated clean.
- **c**: clean on first attempt, no 1-fix needed.
- All three: `a11y`/`perf` report `unavailable` (no Lighthouse/Chrome DevTools Protocol in this sandbox) — counts as pass per page-brief-repo §5, not independently verified.
- Final: **8/8 on all three candidates.**

## §4 Screenshots & judge-frame gap (important — see Q53)
Standard capture: 4 widths × 4 scroll depths per candidate via `capture-shots.mjs` (48 frames total, 0 blanks/errors). Judges were given the skill's recommended 4-frame budget per candidate: `<v>-1440.png` (scroll 0) · `-1440-s35.png` · `-1440-s100.png` · `<v>-390.png`.

**This missed the core interactive section on 2 of 3 candidates.** Both a's Fair Price Matrix and c's Demand Ribbon — the exact assigned differentiator geometry for those two candidates — sit in the scroll gap between 35% and 100%, so no judge saw either in their initial pass. Lens3 explicitly self-reported this; lens1 and lens2 had related gaps in their rule-3/completeness findings without immediately flagging it as a frame-coverage problem.

**Recovery**: orchestrator captured 2 additional `id`-selector-targeted section screenshots (`a-chart-section.png`, `c-chart-section.png`) and resumed all 3 judge agents via `SendMessage` (continuing the same agent, not a fresh re-dispatch — per §4's "재개 vs 재디스패치" discipline) with this new evidence, asking each to reconsider only the specific findings that depended on it. Logged as new **questions-queue Q53** — this is a real structural gap in the skill's fixed-percentage frame-sampling strategy for pages with more sections than sample points allow, not a candidate defect.

## §4 JUDGE PANEL — final verdicts (after evidence resumption)

### Lens 1 — brief/DNA compliance
**Final: b > a > c** (unchanged from initial pass; the a↔b gap narrowed once a's interactive control was confirmed real).
- b 1st: only candidate whose mobile hero (390px) shows the complete product card + all proof with zero scroll; interactive control (confidence ring) directly observed from the start; no badge-overlay violation; closing CTA cites the exact same 82% figure shown in the hero.
- a 2nd: strong fundamentals, but mobile hero (390px) cuts off price/badges below the fold — real zero-scroll violation.
- c 3rd (deciding factor): a **direct, repeated badge-overlay violation** — match% badges absolute-positioned on top of the product photo in every card (hero + 6-card grid), against the brief's explicit "badges must not overlay the image" rule. Also fails mobile zero-scroll like a.
- Two "plausible" contrast concerns flagged on winner b (ghost "03" numeral, small match-badge text) were independently verified by the orchestrator against the candidate's own documented contrast math post-judgment — both clear their respective AA floors (GHOST #71717A 4.83:1/4.43:1 for large decorative text ≥3:1 floor; badge text uses ACCENT_STRONG #0369A1 at 5.93:1, not raw ACCENT, clearing 4.5:1 small-text AA). No fix needed.

### Lens 2 — commercial landing polish
**Final: c > a > b** (reversed from initial c > b > a once a's and c's chart sections were confirmed real and well-executed — b dropped from 2nd to 3rd).
- c 1st: densest, most commerce-real product cards (explicit verified/unverified-seller trust signal none of the others show), a working FAQ/objection-handling section, and the tightest closing-CTA/live-state fusion ("List for $1,650 · 28% off" — button copy itself carries the derived value).
- a 2nd (revised up from 3rd): the "no interactive-value section" finding against a was flatly wrong — a fully-built dual-control (segmented + continuous slider) → 20-cell numeric table exists and is directly traceable to the closing CTA's $1,774/76% figures. Best testimonial block, most objective (non-personalized) product-card copy.
- b 3rd (revised down from 2nd): a's and c's corrections removed the compensating weaknesses that had kept them behind b; what's left distinguishing b downward is its passive email-capture closing CTA ("Notify me") versus a's and c's direct commerce actions, and a mild unearned-personalization copy issue shared with c.

### Lens 3 — archetype/output-form differentiation
**Final: b > c > a** (unchanged; reasoning shifted from "geometry unconfirmed for a/c" to "macro-layout repetition between a and c").
- b 1st: confirmed multi-segment arc (not a single gauge), correctly distinct from all 9 prior forms; hero composition is chart-first, not product-card-first, and its control concept recurs meaningfully through later sections (numbered editorial beats, closing restatement) without repeating a "controls-left/chart-right" module.
- c 2nd, a 3rd (close call): both confirmed as genuine, non-collapsing new geometries (streamgraph vs. heatmap) once the missing frames were supplied. What now separates them from b — and what keeps b ahead of both — is that **a and c share not just their hero skeleton but their entire dedicated chart-section skeleton** (controls-card + readout-card left, one large chart card right, as a second full-width module lower on the page), making them structurally closer to the same page template with different chart content than either is to b. c narrowly edges a on the tiebreak (an organic streamgraph is a more visually unusual marketing device than a — correctly-executed but more conventional — heat-graded table); this specific tiebreak is explicitly flagged low-confidence by the judge.

## Aggregation
1st-place votes: **b = 2** (lens1, lens3), **c = 1** (lens2). **2:1 majority winner: b — "Authentication Confidence Ring."** Not a 3-way tie (1-1-1), so no tie-break procedure invoked.

## §3-1 Post-judgment fix
None needed — the two contrast concerns lens1 flagged on winner b were investigated and independently confirmed already-clean per the candidate's own documented math (see Lens 1 section above). No re-gate required.

## §5 LEARN — delta appended (landing-deltas-provisional.jsonl)
`[contain:layout]` resolves a CSS Grid-item + nested-`overflow-x:auto`-scroll-container `documentElement.scrollWidth` leak that `overflow-x-clip` alone does not stop, discovered while fixing candidate a's sweep failure. Full repro steps and evidence in the delta entry and SCORES.md.

## §6 Refinement gate
- Reviewed landing DELTAS for conflicts — none found; new entry is a novel technical finding, not yet L2 (single-round, though mechanically verifiable — kept L1/provisional per the skill's default, pending a second independent reproduction).
- New questions-queue entry **Q53** on the frame-sampling structural gap (see §4 above) — this is a process/methodology finding about the skill's own screenshot-selection strategy, logged for future round awareness; not resolved by rule change this round (single-round sample).
- Canon (`dash-brief-v3.md`, `design-principles.md`, `page-brief-core.md`) unchanged — no L3-worthy claim this round.

## §7 Outcome
- **Winner: b — "Authentication Confidence Ring"** (`/landing-evolve/r25/b`).
- Candidates a, c remain registered in their routes (evolve/dash only) per no-winner-drop convention — disposition happens at `/dash-falsify`, not here.
