# DECISION — auto-landing-r42

## 0. Scheduling / deviation notice

Round 2 of this scheduled session's two back-to-back `/dash-evolve` executions. Round 1 was `auto-native-r42` (winner c, Split-Pay Plan Selector), committed and pushed before this round began. `node scripts/round-budget.mjs --explain 2` returned `1  미채움 0종 — N≥2 의 근거(커버리지)가 없다` again (per-invocation budget, same as round 1), so this is a separate `/dash-evolve` invocation, not a second round inside the same call. Target drawn uniformly from `[dash, landing]` (native excluded — already drawn by round 1 this session, per the skill's "이미 생성한 타입/타깃은 제외" rule applied to the dash/landing/native fallback pool) → `landing`. Today (2026-10-26) is a Monday but the native weekly-cadence forcing only applies once per day and was already satisfied by round 1, so it does not re-trigger here. `Agent` tool confirmed available — real blind 3-lens panel, not self-judged.

Environment: dev server (`cd app && npm run dev`, port 3100) started fresh and smoke-tested against an existing promoted route before any generation. `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium` (as round 1) plus, newly for this web-target round, `CHROME_PATH=/opt/pw-browsers/chromium` + `PW_NO_SANDBOX=1` were required for Lighthouse to return real a11y/perf scores instead of a silent `unavailable` — confirmed via a direct `npx lighthouse` smoke test before the full gate run. No script changes made.

## 1. Target & round number

`target: landing`, round = `auto-landing-r42` (max prior landing round in ledger = 41, so N = 42).

RETRIEVE: full `design-principles.md`, `page-brief-core.md`, `page-brief-repo.md` (web-target-always), `curation-criteria.md` (already loaded from round 1), `reassign-queue.md` (empty for landing — the one prior entry, #16, was consumed by `auto-landing-r41/a`), `questions-queue.md` Q70 (the skill's own stale "/v1-v5" duplicate-check path is wrong — real production catalog is `app/src/app/(marketing)/v6`–`v26`, confirmed by directly listing the directory) plus Q60/Q62/Q66/Q67 context, full `landing-deltas-provisional.jsonl`, and `scripts/catalog-variety.mjs` output for current theme/accent distribution. Given the scale of the full landing catalog survey (21 production pages + ~54 evolve-round candidates across `r24`–`r41`, since `r1`–`r23`/`r26` are pruned from disk after past promotion cycles the same way native's early rounds were), this survey + candidate-proposal synthesis was delegated to a `fork` sub-agent (inherits this session's already-loaded brief context) rather than done inline, to keep it efficient — its findings are summarized in §2 below and were independently acted on by the orchestrator, not taken on faith for the actual target assignment (each candidate's duplicate-avoidance claims were re-verified by the designers themselves per their briefs, and by lens3 in judging).

## 2. Duplicate-avoidance survey & candidate assignment

Catalog-wide: `catalog-variety.mjs` showed light theme underused (29 light vs. 36 dark across all page types) and the last 3 landing rounds (`r39`–`r41`) were all dark — this round assigns **light theme to all 3 candidates** to rebalance, a legitimate round-level choice per design-principles.md's "다크 기본, 라이트도 유효 대안(구현 밀도가 같으면 대등)". Display-face history: `r40`=mono, `r41`=grotesk — both excluded per "최소한 직전 2라운드 승자가 쓴 활자는 제외"; candidates assigned `wide`/`mono`/none respectively. Accent history: `r39`=lime, `r40`=emerald, `r41`=violet — candidates assigned orange/green/blue (none recently used, all drawn from the catalog's currently-underused accent pool).

Survey found the catalog has already used, as the live-manipulation **output medium**: dial/gauge, scatter/2D-plot, histogram, treemap, Sankey/funnel/parallel-coords, node-graph, radar, chord diagram, icon-array, box-plot, waterfall, stacked-bar+stepper, orbit device, ledger-calendar, pulse-waveform, magnifier, ring-cluster, bubble-packing, grade-matrix/grid-select, dual-handle range-sweep, scan-line reveal, facet-quiz, a conversational/transcript output (`r15/a`), and a document-redline output (`r16/c`, promoted to `/v19`). Three fresh candidates assigned, each a genuinely new output medium:

- **a — "Why This One"**: 3 discrete facet pickers (budget/condition/category) drive a live-regenerating templated natural-language match-rationale paragraph — a third text-output medium, distinct from both prior text outputs. Narrow centered column macro layout. Light/orange, `--font-display-wide`.
- **b — "Tipping the Scale"**: 2 named comparable listings + 4 weighted-priority sliders drive a literal two-pan SVG balance beam (not a disguised single-needle gauge). Bilaterally-symmetric macro layout. Light/green, `--font-display-mono`.
- **c — "The Bracket"**: 8 fixed listings + a 3-way priority toggle drive a live single-elimination tournament bracket. Wide full-bleed asymmetric macro layout. Light/blue, no display face. **Dropped at the hard gate — see §3.**

All three stayed buyer-facing specifically to sidestep Q62 (open, unresolved: whether the hero's "4 proof badges" rule applies as-is to a seller-facing page) rather than require an on-the-spot principle-relaxation judgment call this round.

Active doctrine handed to all 3 designers verbatim (not just avoidance — live requirements accumulated from `landing-deltas-provisional.jsonl`): non-trivial default state on first paint AND every control reset (`r38`/`r41`, L2); a segmented stat requires a matching product-card filter, not just the abstract number (`r39`); closing-CTA/any copy must not overclaim universal liveness beyond what's actually threaded (`r40`); manipulation state should reach 2+ surfaces, ideally 3 (`r30`/`r32`/`r35` progression); hero proof cards must live inside the Hero component itself (`r16`, L2); the specific `font-[var(--font-display-wide)]` Tailwind-bracket-class gotcha (`r36` — silently compiles to `font-weight` not `font-family`); the accumulated banned-phrase list (6 independent reproductions, `r28`→`r37`).

## 3. GENERATE + hard gate

3 independent `general-purpose` Agent-tool subagents in parallel, each handed literal design-principles.md/page-brief-core.md/page-brief-repo.md text, the active-doctrine list, the banned-phrase list, and their specific assignment. Designer completion confirmed via hand-back reports, not file existence.

Freeze hash (pre-gate): `8159d2391c5518309b4318f4d52900cc89217f17`.

`node scripts/gate.mjs --target web --routes /landing-evolve/r42/a /landing-evolve/r42/b /landing-evolve/r42/c` → **a and b: 10/10 clean on first attempt.** c: 2 failures (lint `react/no-unescaped-entities` ×2; a11y `color-contrast` 96, traced to `MatchCard.tsx`'s `opacity-55` wrapper blending its `text-zinc-950` title to 4.41:1 on white). **1-fix applied** (apostrophe escapes + opacity 55→65) and re-gated: lint clean, but a11y **still fails** — the SAME opacity wrapper also blends down two other already-marginal text colors (`text-zinc-700` → 3.82:1, `text-zinc-500` "Eliminated" label → 2.5:1) plus an inline-styled badge (2.36:1), none of which were the color I'd fixed. Per the hard-gate rule ("1회 수정 기회 → 재실패 시 탈락"), **c is dropped** — full detail and root-cause analysis in `SCORES.md`. The defect is a rule violation (CSS-opacity-blended text dropping already-marginal colors below AA), not a flaw in the Bracket concept itself; per this codebase's convention, `reassign-queue.md` entries are populated at `/dash-falsify apply` time, not by `/dash-evolve` itself, so no queue edit was made here — this record is what feeds that process if the form is considered for reassignment.

a and b survive to judging (2 candidates — normal judging applies, not single-candidate fallback).

## 4. JUDGE — 3-lens blind panel (2 surviving candidates)

Screenshots: full scroll-through capture (`capture-shots.mjs`, 4 widths × 4 scroll depths) for both survivors, zero blank frames, visually spot-checked. 3 independent `general-purpose` Agent-tool subagents, each given 4 frames per candidate (fold + mid-scroll + bottom + mobile) + full source + the design canon, explicitly barred from reading `candidates/*.md`.

**Rankings:**

| lens | 1st | 2nd |
|---|---|---|
| lens1 (brief/DNA compliance) | b | a |
| lens2 (commercial completeness, Linear/Stripe/Vercel bar) | a | b |
| lens3 (archetype/structural differentiation) | b | a |

**Majority: b wins 2:1** (lens1 + lens3 vs. lens2). Not a tie.

**lens1** found both clean on hard rules (3 rendered weights, correct `style={{fontFamily:...}}` display-face syntax in both, correct `focus-visible:outline` pattern, no `aria-label` contradictions, badges never overlaid on photos, no raw `<img>`/random hosts, determinism clean) with no disqualifying violation in either. Ranked b 1st on two margins: b's live-manipulation causality is architecturally deeper (4 sliders → one real formula → per-factor breakdown → beam → table → closing-CTA recap, closer to this codebase's own named unanimous-winner precedent) versus a's shallower 3-facet → 27-cell-lookup indexing (still legitimate, just thinner); and b retains more real proof signal in the literal above-the-fold screenshot (a live "Currently leading" badge visible at 0% scroll) versus a (whose matched-product card is entirely below the tested fold, though both pass the "inside the Hero component" structural reading the codebase uses instead of strict pixel-fold).

**lens2** found both well-engineered with no disqualifying defect, but surfaced one real, confirmed bug in each (see §5 — the orchestrator independently verified both). Ranked a 1st primarily on fold-level proof legibility (a's rationale paragraph states concrete numbers at 0% scroll; b's fold shows no numbers at all, only shells) weighed against a's minor "a/an" grammar slip, against b's more serious self-contradiction bug (weighed more heavily since it's a logical/content defect, not a copy nitpick) and b's computational rigor (independently hand-verified correct by lens2 across multiple surfaces).

**lens3** independently traced a's rationale-paragraph mechanism against both prior catalog text-output media (retrieved `r15/a` and the promoted `r16/c`/`v19` via git history since both are pruned from the working tree) and confirmed it's a genuinely third mechanism (whole-sentence template-swap, neither multi-turn/branching like r15 nor segment-toggle/redline-typography like r16/c) — but flagged a's *input* structure (3 discrete facet groups) as structurally resembling this catalog's already-named "facet-quiz" input device, a partial (non-disqualifying) convergence. For b, confirmed the balance beam is a genuine two-pan rotating device, not a disguised single-needle dial (traced the actual SVG transform-origin/group structure), and found the underlying weighted-average formula shape is reused from a prior renormalizing-gauge precedent (`r18/c`/`v21`) but the *output structure* differs (b reduces two parallel per-listing composites to a comparative delta + winner; r18/c redistributes one composite across a single radial fill) — a real but non-disqualifying partial convergence, symmetric with a's. Neither candidate used the flagged `col-span-7+col-span-5/col-span-12` hero grid skeleton (neither uses CSS grid in its hero at all). Zero banned-phrase hits in either candidate (full grep sweep).

## 5. Post-judgment fixes (§3-1)

**Fix applied to winner b.** lens2 found and the orchestrator independently verified: `dominantWeightLabel`/`weakestWeightLabel` (`b/data.ts:140-146`, a `reduce`-based `pickBy` over 4 weight fields with strict `>`/`<` comparators) silently collapse to the SAME field (`WEIGHT_FIELDS[0]`, "Price priority") whenever all 4 weights are tied — a state reachable via ordinary slider interaction (e.g. setting all 4 sliders equal), not a contrived edge case. `ClosingCTA.tsx` rendered the resulting sentence unconditionally (outside its `leaderId === "tie"` branch), producing a visible self-contradiction: *"That's with Price priority weighted heaviest and Price priority weighted lightest."* This is a rule-violation-class defect (a self-contradicting, dishonest-reading copy output from a real code bug — the same family as this codebase's established "don't overclaim/contradict the underlying state" doctrine), not a taste/completeness improvement, so it is in-scope for §3-1.

**Fix**: guarded `ClosingCTA.tsx`'s dominant/weakest paragraph with `dominant === weakest`, rendering *"That's with all four priorities weighted equally..."* instead when they collapse to the same label. Minimal, localized change — no other text/logic touched. **Re-gated**: `node scripts/gate.mjs --target web --routes /landing-evolve/r42/b` → 10/10 clean (unchanged from pre-fix). **Post-fix freeze hash**: `a8e3bad172ab96c2a2599a0e44a630d587e39dd8` (differs from the pre-fix hash only in `b`'s `ClosingCTA.tsx`). **Ranking not recomputed** — none of the 3 lenses' decisive reasoning depended on this specific bug being present or absent (lens1 and lens3 didn't cite it at all; lens2 cited it as one of several factors but still ranked a 1st overall, and a already lost 2:1 on the other two lenses independent of this point), consistent with §3-1's scope (fix rule violations, don't re-litigate the panel's verdict).

a's minor "a/an" grammar slip (lens2, `a/data.ts:131`, e.g. "a 87% fit" instead of "an 87% fit" for 7 of 27 facet cells) is on the **losing** candidate — no action taken, §3-1 is winner-scoped.

## 6. LEARN

One L1 delta extracted from the winner's judging rationale (the §5 bug, surfaced and fixed in this round): a UI that derives "most X"/"least X" (or any two-extremes) labels via a strict-comparator `reduce` over a weighted/ranked set will silently produce the identical label for both extremes whenever the inputs are tied at the reduce's starting point — because neither comparator (`>` nor `<`) ever beats the initial accumulator under equality — and if the surrounding copy names both extremes in one sentence without guarding the tie case, the result is a visible, reachable self-contradiction under ordinary (non-malicious) interaction, not a contrived edge case. This generalizes the codebase's established "closing copy must not overclaim/contradict the underlying live state" doctrine to a new source: a logically-derived self-contradiction from a degenerate comparator edge case, not just a hardcoded-vs-live literal mismatch.

## 7. Refinement gate

No level changes this round (new delta is L1, single occurrence). No conflicting delta pairs requiring a forced question. No new questions-queue entry — the findings this round (a's minor grammar slip, b's now-fixed tie-break bug, c's opacity/contrast structural issue) are all either resolved or already governed by existing doctrine; none meets the §6 bar (conflict pair / meta-criteria-unjustifiable).

## 8. Invariants confirmed

`vault/00-principles/dash-brief-v3.md`, `vault/00-principles/design-principles.md`, `/dash` gallery, `/v1`–`/v5` (nonexistent — real catalog `(marketing)/v6`–`v26` also untouched) — all untouched. jsonl append-only. No commits to `main` — all work on `evolve/dash`. Dropped candidate c's source retained (not deleted) per convention.
