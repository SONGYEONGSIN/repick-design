# auto-landing-r18 — DECISION

Target: landing · Round: auto-landing-r18 · Date: 2026-08-30
Candidates generated: a (Grading Timeline), b (Matching Board), c (Trust Score Console)
Hard-gate survivors: **b, c** (a dropped — see SCORES.md, focus violation re-failed after 1-fix)

## Judge panel result: 3:0 unanimous — winner **c**

| lens | 1st | 2nd |
|---|---|---|
| lens1 (brief/DNA compliance) | c | b |
| lens2 (commercial SaaS polish) | c | b |
| lens3 (archetype differentiation) | c | b |

No abstentions, no resumes needed — all three lenses returned complete verdicts (ranking + reasoning + evidence + self-reported unseen scope) on the first pass.

## Lens 1 (brief compliance) — summary
Decisive factor: the brief's single most-emphasized rule — real product proof must be visible in the hero's own unscrolled (scroll-0) frame, not one section down. **c** shows the full trust-score gauge + 4 live weighted sliders + a scored listing card fully rendered at scroll 0 (`c-1440.png`), satisfying this cleanly. **b**'s matched-pair cards are architecturally inside the hero `<section>` (confirmed in source, `Hero.tsx`) but are cut off below the visible fold at 1440px scroll-0 (`b-1440.png` shows only empty card outlines; real data only appears at `b-1440-s35.png`) — a viewport-sizing defect that puts it on the wrong side of this specific rule in practice, even though the intent was there. Everything else (voice, no-Korean, badge/photo separation, 3-weight typography, accent-contrast discipline) was assessed as essentially tied.

## Lens 2 (commercial polish) — summary
Both candidates read as shippable. c's tie-break advantages: (1) the slider→gauge recompute is a genuine weighted-average (`gauge-math.ts:53-67`, confirmed non-decorative in source) with a live callback in the closing CTA that literally quotes the resulting number back to the user (`ClosingCTA.tsx:29-32`, "89.6 is the score your weights produced"); (2) a more deliberate typographic system (monospace reserved for data, grotesk sans for narrative — the Stripe/Linear convention) versus b's single monospace display face across the whole hero headline, which the lens read as a riskier fit for a trust-driven marketplace. b's category-filter recompute is also confirmed real (dataset swap per category, `client.tsx:13-14`, `data.ts:360-365`) and its closing CTA also references live state — a genuine strength, just judged as demonstrating "matching" more than "AI grading," which is half of this product's stated positioning.

**Correction (environment artifact, does not affect the verdict):** Both lens2 and lens1 independently flagged broken-image placeholders on ProductPreview cards in both candidates' screenshots. Orchestrator confirmed: both designers used fixed, content-matched `images.unsplash.com/photo-<id>` URLs (not random services — compliant with the brief), but this sandbox's outbound network access to `images.unsplash.com` is blocked/times out (candidate c's own designer flagged this as a caveat during GENERATE; candidate b hit the same wall independently). This is the same class of environment artifact documented in this project's history for `auto-landing-r12` and `auto-landing-r15` — not a candidate defect, and both judges who noticed it correctly treated it as inconclusive/neutral between candidates rather than a differentiator.

## Lens 3 (differentiation) — summary
**c** introduces a macro-device the catalog has not used before: a radial gauge/dial fed by weighted, renormalizing sliders (confirmed in source that dragging any one slider renormalizes and redistributes all four contribution bars, not just the dragged one — `gauge-math.ts:49-53`). None of v0–v5 or r13–r17 puts a circular gauge/dial at the hero centerpiece, and none ties a multi-input weighted renormalization to a single dial readout. **b**'s dual-column buyer/listing "threaded pair" board is a real sub-device but sits inside the same coarse skeleton already established by r16/r17 (chip/toggle atop a live card region) — an incremental variant rather than a new macro-structure. The lens also noted b and c converge on an identical downstream skeleton after the hero (product grid with AI-rationale accordion → 3-up testimonials → closing CTA) — consistent with this project's previously-documented pattern that discrete-choice assignment (macro-skeleton only) doesn't prevent convergence at lower layers; recorded as an observation only, not actioned this round per that same precedent (no new assignment axis added on a single observation).

## Winner: c ("Trust Score Console")

## LEARN — delta extracted (§5)
See `landing-deltas-provisional.jsonl` append below. One L1 delta:

> A radial-gauge/dial output-visualization device fed by weighted, renormalizing multi-slider input (moving any one slider redistributes all contribution values, not just the dragged one) is a macro-device category absent from the entire landing catalog (v0-v5, r13-r17) and won a landing round decisively (3:0) on differentiation, commercial polish, and brief compliance simultaneously — the first time in this catalog's history the "output-visualization" axis (flagged as underused since `auto-landing-r5`) has been realized as a literal dial/gauge rather than a bar/timeline/spec-grid. The closing-CTA-quotes-the-live-number pattern (literally interpolating the manipulated state's resulting value into the closing headline, not just referencing that manipulation happened) reads as the strongest form yet observed of the existing "조작 상태는 히어로에서 끝나지 않는다" principle.

## Refinement gate (§3-1) — none needed
No post-judgment rule-violation fixes were required on c; it passed the hard gate clean on the first attempt (see SCORES.md) and no violations survived into judging.

## Candidate a — hard-gate elimination (recorded here per §7 for completeness)
Dropped before judging: focus-visibility violation on 3 testimonial-nav dot buttons re-failed after its one permitted fix attempt (see SCORES.md for full detail — replacement `focus-visible:shadow-[...]` utility produced no gate-detectable pixel change on very small (7×7px/18×7px) elements). Not eligible for reassign-queue (this is a within-round hard-gate drop, not a `/dash-falsify apply` drop — reassign-queue is populated only from the latter per its own stated scope).

## Invariants confirmed
- No edits to `vault/00-principles/dash-brief-v3.md`, `vault/00-principles/design-principles.md`, `/dash` gallery, or `/v1`–`/v5`.
- `landing-deltas-provisional.jsonl` append-only (no edits to existing lines).
- No commits to `main` — all work on `evolve/dash`.
