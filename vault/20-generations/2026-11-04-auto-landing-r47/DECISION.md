# DECISION — auto-landing-r47

target: landing · round 2 of this scheduled session's two requested sequential `/dash-evolve` executions; round 1 was `auto-dash-r55` (no winner — hard-gate washout, zero survivors), committed+pushed (`d8dd02d`) before this round began.

## 0. Round budget + target draw

`node scripts/round-budget.mjs --explain 2` returned `1  미채움 0종` again — only 1 round this invocation. Target drawn uniformly from `[landing, native]` (`dash` excluded, already drawn by round 1 this session) → **landing**. `reassign-queue.md` "대기 중" confirmed empty for `target: landing` at RETRIEVE — no reassignment consumed this round. `Agent` tool confirmed available and used throughout (3 independent `general-purpose` designers + 2 independent `general-purpose` 1-fix agents + 3 independent `general-purpose` judges, no custom designer/comparator type configured in this environment). `self_judged: false` — generation and judgment were performed by entirely disjoint sets of fresh-context subagents.

## 1. RETRIEVE / target survey

Full RETRIEVE (design-principles.md + page-brief-core + page-brief-repo + open landing deltas + curation-criteria + ux-guidelines/motion catalog + recent landing ledger history + `catalog-variety.mjs` banList + exhaustive device-inventory duplicate-avoidance survey across production `v6`–`v26` and ~46 `landing-evolve` rounds) performed by a research-only `fork` sub-agent (explicitly scoped to research, no file writes, no Agent dispatch — learned from round 1's mis-delegation not to ask a fork to generate). `catalog-variety.mjs` banList over the last 3 landing winners (r46/a, r45/c, r44/c) returned `theme: ["dark"]` (2 consecutive dark winners) — all 3 candidates this round assigned light theme.

3 candidates assigned 3 mechanically distinct devices, none colliding with each other or with the exhaustive 29-device catalog history:
- **a** — "Transit Path" (seller→hub→buyer schematic, shipping-speed toggle). Light/violet/`--font-display-grotesk`.
- **b** — "Checkpoint Deck" (4-card verification stack, drag-swipe + live trust-score/price tally). Light/amber/`--font-display-mono`.
- **c** — "Allocation Flow" (Sankey-style proportional flow, strictness toggle). Light/rose/`--font-display-wide`.

Each designer prompt inlined the full assembled brief (design-principles.md + page-brief-core + page-brief-repo + open deltas + repo conventions, as prose, not paths) plus only its own slot assignment — no designer saw the other two's assignments or output.

## 2. GENERATE

3 real independent `general-purpose` Agent-tool subagents, dispatched in parallel, zero shared context. Each self-verified with `npx tsc --noEmit` + `npx eslint` before reporting (all clean) and wrote a `candidates/<v>.md` with computed contrast ratios and line-length math recorded per the brief's "compute, don't guess" requirements.

**Freeze hash** (post-generation, pre-fix): `0074f8c707a244a93b37cc6836271a4b9f73e16c`.

## 3. HARD GATE

`node scripts/gate.mjs --target web --routes /landing-evolve/r47/<v>`, per-candidate. Round 1: **a and c failed, b passed clean.** Full detail in `SCORES.md`. Summary: a = static 12× `no-unlisted-font` (cross-file `DISPLAY_FONT` variable reference the regex static checker can't resolve) + sweep `cell-overlap` at 390px; c = sweep `page-overflow` at 390px (Sankey wrapper's `min-w-[480px]` forcing the box itself past its mobile container, unconstrained by any ancestor scroll container).

**1-fix pass** (one `general-purpose` subagent each for a and c, given the orchestrator's own exact root-cause diagnosis): a replaced all 12 indirect font references with literal inline strings (found 7 instances beyond the 4 originally named via its own re-grep) and fixed the cell-overlap by stacking the badge vertically below `sm`; c made its Sankey SVG scale fluidly via `viewBox` + `width:100%`, moving labels to a fixed-size HTML overlay to avoid them scaling into illegibility at mobile.

**Re-gate: a passed clean. c re-failed** — the sweep fix held, but a *new* `target-size` violation appeared: a band hit-box `<button>` is now 100×9px, its height having collapsed well below 24px because the diagram's rendered height (not just width) now also scales down fluidly at mobile's much shorter available space. **Per §3 ("재실패 시 탈락"), c is dropped.**

**2 candidates survive to §4 JUDGE: a, b.**

This is the **second independent occurrence**, across this same session's two rounds, of the exact pattern filed as `questions-queue` Q74 after round 1 (`auto-dash-r55`): fixing a `sweep`/overflow violation by making a fixed-size interactive element fully fluid shrinks that element's touch-target size below the 24px floor at mobile width, as a side effect the 1-fix subagent (correctly barred from Playwright/dev-server access) cannot catch before reporting done. Q74 explicitly named this reproduction threshold ("그래도 재현되면 패턴으로 승격한다") — noted and appended to Q74 in §6 below, but **not** promoted to `curation-criteria.md` this round: both occurrences are from the same scheduled session's back-to-back rounds, not two genuinely independent future invocations, so the promotion decision is left to whichever session next observes this pattern with real temporal independence.

## 4. JUDGE panel (a vs b, 3 blind `general-purpose` lenses)

- **lens1 (brief/DNA)** → **b**, decisively on hero-fold completeness: `a`'s Hero component contains only the route diagram + hub stats, none of the 4 required proof types (match%/grade/verification/discount) — those live in a separate `ProductPreview` section below, the exact repeatedly-documented hero-fold failure (r16/r30/r40/r45 lineage). `b`'s Hero contains the full device + live tally, satisfying the rule cleanly. All other dimensions tied.
- **lens2 (commercial polish)** → **a**, modestly: `a` wins on visual restraint and mobile typesetting (`b`'s headline breaks into 4 ragged lines at 390px from a hard-coded `<br/>` colliding with its wide monospace display font at narrow width — a real, pixel-visible craft defect). `b` wins on content completeness and interaction depth. Live-math correctness tied, both fully hand-verified correct including tie-guard logic.
- **lens3 (differentiation)** → **b**, modestly: `a`'s "path" device and its comparison table both render the identical 3-row lookup (3 reachable states total) — structurally the catalogued comparison-table archetype in different chrome. `b`'s 4 independent tri-state cards feeding one continuous aggregate (3⁴ = 81 reachable states, parallel-accumulation topology) is genuinely different in kind, with no exact catalogued precedent for the drag-swipe-to-classify gesture. Macro page-shape ties between the two (near-identical section order/rhythm) — the decision rests on hero-mechanism topology specifically.

**Clean 2:1 majority for b** (lens1 + lens3 vs lens2) — not a tie, no tie-break procedure invoked, no no-winner votes.

No post-judgment §3-1 fix needed on winner `b` — zero rule violations flagged against it by any lens; its hard gate passed clean on first try. `a`'s flagged mobile-typesetting issue and hero-fold violation are recorded here but not fixed (§3-1 is winner-scoped only) and not reassign-queued (judgment-stage loss on a clean-gated candidate, not a hard-gate drop — per this catalog's established convention that reassign-queue is for hard-gate drops specifically).

## 5. LEARN — 1 new L1 delta

Appended to `landing-deltas-provisional.jsonl`: structural differentiation should be judged by a device's reachable-interaction-state topology (how many independent inputs, how they combine), not by visual chrome — a device that renders its own single discrete-lookup result twice through different visual skins (e.g. a path diagram AND a literal comparison table of the identical 3-row data) does not thereby introduce a second distinct mechanism, while independently-toggleable multi-axis inputs feeding one continuous shared aggregate are a genuinely different topology even under a similar domain skin. Drawn directly from lens3's decisive, unprompted reasoning (`judge_votes: {lens1: b, lens2: a, lens3: b}`, confidence: medium — single instance, no reproduction claim, consistent with this catalog's established L1→L2 promotion bar).

## 6. Refinement gate — Q74 updated with a reproduction note

`questions-queue.md` Q74 (filed this session, round 1) anticipated exactly this round's `c` failure mode and named its own promotion threshold: reproduce once more and promote the pattern to `curation-criteria.md`. Appended a short note to Q74 recording this second occurrence (candidate `c`, `auto-landing-r47`, viewBox-height-scaling shrinking a hit-box to 9px tall) **without** promoting to `curation-criteria.md` this round — both occurrences come from this one scheduled session's two back-to-back rounds, not two temporally-independent invocations, and this catalog's own established discipline treats same-session repetition as weaker evidence than genuinely separate future observations. Left for a future session to make the promotion call with full independence.

## 7. Canon + scope + reassignment

Canon (`design-principles.md`/`page-brief-core.md`/`page-brief-repo.md`/`dash-brief-v3.md`/all type profiles/`/dash` gallery/`/v1`–`/v5`) untouched throughout. `questions-queue.md` edited (1 new note appended to existing Q74, not a new question — standard queue operation). `reassign-queue.md` edited — candidate `c` ("Allocation Flow") queued as **#21**: a hard-gate drop with a specific, actionable diagnosis (band hit-box height collapsed at mobile scale; the queue instruction tells the next designer to give band hit-boxes an explicit minimum pixel height independent of the diagram's fluid scale, e.g. via a fixed-height invisible overlay matching the existing label-overlay technique, rather than letting hit-box height scale with the viewBox). `jsonl` append-only (1 delta). All 3 candidates' source remains on disk under `app/src/app/landing-evolve/r47/{a,b,c}/` and their concept docs under `vault/20-generations/2026-11-04-auto-landing-r47/candidates/`.

No commit to `main` — all work on `evolve/dash`.

**This completes both of this scheduled session's two requested rounds** — round 1 = `auto-dash-r55` (no winner — hard-gate washout, 3/3 dropped), round 2 = `auto-landing-r47` (winner b "Checkpoint Deck", clean 2:1). 1 hard-gate drop this round (`c`), 0 judged no-winner votes, canon fully unchanged throughout both rounds.
