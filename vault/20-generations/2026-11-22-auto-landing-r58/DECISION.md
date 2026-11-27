# DECISION — auto-landing-r58

Round-budget note (per skill §0-0-1, first-section disclosure): `node scripts/round-budget.mjs "2"` → `1` ("미채움 0종 — N≥2 의 근거(커버리지)가 없다"). This scheduled routine requested 2 consecutive top-level invocations today; this is invocation 1 of 2, and per the skill's rule the caller's "2" is capped to exactly 1 round for this invocation. The second invocation runs separately afterward, excluding this run's target per the continuity rule.

Target selection: all 18 `PAGE_TYPES` are filled (unfilled queue = 0), so target fell to the uniform-random dash/landing/native draw → **landing**. `reassign-queue.md` "대기 중" had no landing item. Round number = max existing `auto-landing-r*` + 1 = **58**.

Sub-agent note: this environment's Agent-tool roster has no custom `designer`/`comparator` subagent types; the Agent tool itself is available (satisfying §0-0), so `general-purpose` was substituted for all 3 designer and all 3 judge dispatches, with role/blindness made explicit in each prompt. Nested nested subagents in this harness cannot themselves call the Agent tool, so the main session drove the designer and judge dispatches directly rather than through an intermediary orchestrator agent — noted as a deviation from the skill's implied single-orchestrator flow, not a deviation from its substance (generation and judging stayed independent/blind).

## Candidates

- **a — "Bulk Trade-In Tier Counter"**: unbounded item-count stepper crossing 3 fixed thresholds into a named bulk tier; dark / green / mono-or-none (mono used on hero h1 only).
- **b — "Add-On Combination Tier"**: 3 independent boolean add-ons, composite tier LABEL keyed by the specific combination (non-monotonic 7-entry lookup), not popcount; light / sky (blue-hex family) / Pretendard-only.
- **c — "Delivery Grid Pick"**: 3×2 shipping-speed × insurance grid, single click selects a full combination, live-recomputed next-best-by-cost comparison strip; dark / violet / mono-or-none.

## §3 Hard gate

All 3 passed clean on the first attempt — no 1-fix cycles. Freeze hash (sorted `.tsx`/`.ts` paths, concatenated, SHA-1): `89adf2c3ed9d7459928bd7f71d5b4956996960b6`. Full gate table in `SCORES.md`. Notable: c's a11y=99 (one `landmark-one-main` audit failure) — above the 95 hard-fail floor, so not a gate failure.

## §4 Judge panel (blind, independent, 3 general-purpose dispatches)

**Lens 1 — brief/DNA compliance.** Ranking: **b > c > a** (close field, all compliant, no gate-missed violations in any). b ranked highest for the most rigorously self-documented compliance: explicit non-monotonic combination lookup (`b/coverage.ts:73-102`), reused `ListingCard` component in the hero proof card (not just a stats panel), hand-computed accent contrast and 0.44em/glyph body-width math in source (`b/tokens.ts`). c ranked 2nd on the same anti-weighted-sum criterion via its own 2-axis lookup + dynamic re-ranking, but with less in-source self-documentation and slightly less specific alt text. a ranked 3rd — fully compliant but the least demonstrative of the round's "not a weighted sum" scrutiny (single-axis step function) and no source-level contrast/width math found. Causal consistency (CTA cites the same live-derived value) verified non-hardcoded in all three. Unseen scope: judge did not re-render pages live (contrast/width checked by hand-calculation against source hex/Tailwind values, not a tool-measured render); did not check widths beyond 1440/390 or scroll depths beyond the 4 given frames; did not exhaustively audit every tracking-letterspacing value against the brief's literal 3-tier scale (spot-checked only, found all three deviate similarly — a shared, non-differentiating observation).

**Lens 2 — commercial polish (Linear/Stripe/Vercel-tier).** Ranking: **c > a > b**. c ranked highest for the most cohesive single typographic voice, richest-but-earned hero mechanism (grid pick + live next-best comparison + cheapest-overall callout), and the cleanest complex-widget mobile compression. a was solid but mixed two typographic registers (monospace hero vs. plain-bold-sans section headers) and had a confirmed real defect: a `next/image` avatar fallback-alt-text collision behind a 36px circular testimonial portrait (`a-1440-s70.png`/`a-1440-s100.png`, confirmed in `SocialProof.tsx`). b had the single best individual component (the 7-tier comparison table) but ranked last for commercial polish specifically because it has **no header/nav markup anywhere in its source** (code-confirmed absence, not a crop artifact) — a real foul against the Linear/Stripe/Vercel bar, which never ships without persistent brand chrome; its product-preview cards also appeared visually empty at the frame boundary, though the judge did not treat this as a confirmed code bug (component itself is well-built; most likely a capture-timing artifact). Unseen scope: no hover/focus/motion states observable from static frames; no 768px check; did not verify live interaction recomputation beyond the single captured state per candidate; did not spot-check a's/c's product-preview source the way it did for b's.

**Lens 3 — structural/archetype differentiation.** Ranking: **b > a > c**. The deciding factor was state-space shape under the standing hierarchy (cumulative/path-dependent > memoryless pure-function > flat single-step lookup): b's 7-entry lookup is memoryless but explicitly **non-monotonic** — two 2-of-3 combinations resolve to unrelated names/prices with no magnitude-tracking order (confirmed on-page: "Essential Lock" $1,299 < "Guarded Hold" $1,478 despite fewer add-ons). c's 2-axis grid lookup is memoryless and **strictly monotonic** (more speed + more insurance = strictly higher cost in every cell) — the judge classified this as functionally "pick 1 of 6 ordered price points," closer to the bottom of the hierarchy than its 2D surface suggests, and additionally flagged its "next-best by cost" re-ranking as echoing two already-avoided catalog mechanisms (`r56/a` fuzzy re-rank, `v22` weighted re-sort). a's single-axis threshold stepper placed in the middle — a true memoryless function of an open-ended (not enumerated) input, but structurally close to `v16`/`r55/a`'s single-ordered-control-into-named-tier shape. Unseen scope: no live DOM interaction available; state-space classification inferred from reading each derivation function's full source plus default-state screenshots; did not screenshot b's persona-preset click transition (read in source only — confirmed it reuses the same 3-boolean setter, so no additional state-space).

## Tally

1st-place votes: lens1→b, lens2→c, lens3→b. **Majority: b, 2:1.** No no-winner votes (no-winner requires 2+ abstention votes; none occurred) — this is a clean majority decision, not a forced tie-break.

**Winner: b — "Add-On Combination Tier."**

No rule violation was raised against b by any lens, so §3-1 post-judgment fixes are not applicable.

## §5 LEARN (append 1 delta)

Delta: within memoryless combination-lookup devices, lens 3 drew a sharper distinction than the standing hierarchy currently states — a lookup whose output does **not** track input magnitude/popcount (non-monotonic, b's winning device) ranks above one that is strictly monotonic across all its axes (c's device), even when the monotonic one has more input dimensions (2 axes vs. b's 3 independent booleans). A monotonic multi-axis lookup is judged close to a flat single-step pick, not meaningfully richer for being multi-dimensional. This refines (does not contradict) the existing open delta on reachable-state richness — it adds a tie-breaker *within* the "memoryless pure function" tier of that hierarchy, which the existing delta text did not yet subdivide. Level L1/provisional — this is the first round to surface the monotonic/non-monotonic distinction explicitly; reproduction in a future round would be grounds to promote it to L2 alongside (not superseding) the existing hierarchy delta.

## §6 Refinement gate

- This delta does not claim to reproduce or extend a specific prior round-id by name, so the "verify reproduction claim" branch does not apply.
- No conflicting delta pair identified this round (checked against the current open landing deltas read in §1 RETRIEVE).
- No meta-criteria-unjustifiable finding and no judge/criteria conflict requiring a `questions-queue.md` entry — the 2:1 split was a clean majority, not a 3-way tie, and all three lenses' reasoning was internally consistent with `curation-criteria.md`.
- Tooling note (not a design delta, not filed to `questions-queue.md`): `scripts/catalog-variety.mjs`'s `themeOf`/`displayFaceOf` misread candidate b when queried directly (`theme: 'unknown'` because b defines its surface via an arbitrary hex constant `BG = "#FFFFFF"` rather than a literal `bg-white` Tailwind utility class, which `themeOf`'s regex doesn't cover on the light side; `face: 'grotesk'` was a false positive from a source comment that merely *names* `--font-display-grotesk` while explaining why it isn't used). The ledger's `variety` field below records the verified-by-hand values (light / blue-hex / pretendard) rather than the raw script output, cross-checked against the designer's own `candidates/b.md` self-report and both judges' visual descriptions ("blue-on-white", "light theme, sky accent"). Flagging here only so a future round doesn't silently trust `readWork` output against a hex-constant-based candidate without a sanity check.

## §7 Record

Ledger entry, `vault/index.md`, and commit/push follow this file.
