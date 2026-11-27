# auto-landing-r36 — DECISION

**Deviation disclosure (first section, per skill §0-0)**: same as `auto-dash-r42` earlier in this session — `Agent` tool present, only generic `general-purpose` personas available (no named `designer`/`comparator`). 3 independent agents for GENERATE, 1 for the 1-fix round, 3 more (opus model) for JUDGE, all blind/independent. No `self_judged` flag needed.

**Round-budget deviation**: `round-budget.mjs` returned N=1 again (0 unfilled `PAGE_TYPES`). This is round 2 of this scheduled run's two back-to-back `/dash-evolve` executions — round 1 was `auto-dash-r42` (winner c "Varia"), committed and pushed before this round's RETRIEVE began; this round read that round's fresh ledger state.

## Target & round number
Target drawn: unfilled-queue empty → uniform random `[dash, landing, native]` → **landing**. Round 36 = max existing `auto-landing-r*` (35) + 1.

## Reassignment
`reassign-queue.md` "대기 중" had no landing entry — all 3 candidates free-exploration.

## Candidates
- **a** — resale grading-confidence angle. Condition-grade slider + category select drives a slope/ladder chart (listed price vs. AI price per grade tier), selected row bold, others muted-but-visible. Theme light / accent teal / `--font-display-wide`.
- **b** "Covera" — multi-factor trust angle. 5 toggleable concern chips drive a concentric ring cluster, center readout = live match confidence. Theme light / accent emerald / `--font-display-grotesk`.
- **c** "repick for sellers" — category-velocity angle, seller-facing. Category multi-select chip cloud drives a packed-circle bubble cluster sized by real sell-through rate. Theme light / accent blue / `--font-display-wide`.

All 3 deliberately assigned **light** theme to break the prior 2-round dark streak (r34, r35 both dark — `catalog-variety.mjs`'s `banList` with `themeRun=2` returned `theme: ["dark"]`).

## Hard gate
See `SCORES.md`. b and c passed clean on the first try (10/10 each). a failed 1 audit first try (`label-content-name-mismatch` on 4 slope-chart row buttons — a custom `aria-label` paraphrased the visible text instead of containing it verbatim), 1-fix (removed the competing `aria-label`, un-hid the visible-text spans, added the richer sentence as a trailing `sr-only` span) resolved it cleanly, re-gate clean. All 3 survived to judging.

## Judge panel (3 independent blind lenses, opus model, 3 frames/candidate + source + concept notes, concept withheld)

| Lens | 1st | 2nd | 3rd |
|---|---|---|---|
| 1 — design DNA / brief compliance | **a** | c | b |
| 2 — commercial polish (vs. Linear/Stripe/Vercel) | **c** | a | b |
| 3 — form / structural differentiation | **a** | c | b |

**2:1 majority for a** (lens1 + lens3 vs. lens2). Not a tie, no tie-break invoked. b placed last in all 3 lenses unanimously.

### Why a won
Lens1 and lens3 independently converged: a's device (a paired before/after slope chart) is the input×output pair with the fewest named-pattern overlaps with this catalog's existing device list; its headline ("A grade is a claim. / The price should agree with it.") and closing copy avoid every specifically-named banned template this round's brief listed, where both b and c's value-section, social-proof, and closing-CTA sections turned out — independently, with no shared context between the two designer agents — to be near-identical in structure AND copy (lens3 cites near-byte-identical component structure, matching `LIVE`/`FIXED`/`FIXED` value-section layouts, paraphrased eyebrow copy "YOUR MIX, NOT A DEMO MIX" vs "YOUR SELECTION, NOT A SAMPLE", and matching `lg:grid-cols-12` / `col-span-5` hero splits). Lens1 separately confirmed a's CTA-threading (one `ctaLabel` reaching both the hero and closing buttons), always-visible proof (static price labels, never hover-only), correct image/badge discipline, exactly 3 rendered font weights, and safe focus idioms.

### Why lens2 dissented (not a flaw, see below)
Lens2 ranked c first on pure commercial-polish grounds: c's headline IS the computed value ("{category} sells in {N} days"), the live value reaches 5 distinct surfaces (vs. a's reasonably strong but comparatively narrower threading), and c degraded most gracefully when all three candidates' Unsplash images failed to load in this sandbox (a network-egress limitation of this environment, not a candidate defect per se — see below) — c showed a neutral grey placeholder, while a leaked raw alt text onto the page (overlapping other content) and b showed default broken-image icons. Lens2 ranked a 2nd specifically citing two real content-logic defects: a strikethrough visually misapplied to a price that is actually *higher* than the compared value (reads backwards to a shopper), and an awkward "underpriced, by +21.4%" phrasing with a sign/word mismatch.

## Cross-candidate environment note (image loading)
All 3 candidates' `next/image` calls use fixed, real `images.unsplash.com/photo-<id>` URLs exactly as the brief required — none used a randomized-subject host. None of their images rendered in this sandbox's screenshot capture, consistent with a network-egress restriction on `images.unsplash.com` previously observed in this same repo's `auto-landing-r34` round (there independently confirmed by the orchestrator to be a sandbox limitation, not a candidate code defect). The *underlying* load failure is environmental; the *differential gracefulness* of each candidate's fallback (grey placeholder vs. broken-icon vs. leaked alt text) is a legitimate signal since the brief explicitly required reserved aspect-ratio + background-color containers specifically for load-failure resilience — lens2's citation of this differential is treated as valid evidence, not discounted as confound, for that reason.

## Post-judgment fix (§3-1) — NOT APPLIED, and correctly so
No lens cited a hard-gate-checkable rule violation against the winner (a). Every finding against a (the misapplied strikethrough, the "underpriced, by +21.4%" phrasing, the leaked alt-text-over-image rendering under a sandbox-specific load failure, the dead-display-face bug shared with c — see LEARN) is a commercial-completeness, content-logic, or font-polish finding, not a brief rule the gate enforces (choosing not to render a display face is itself a brief-allowed outcome — `design-principles.md`'s display-typeface line is explicitly optional). Left unfixed on the frozen winner, recorded as LEARN deltas, consistent with established precedent.

## LEARN (append to `landing-deltas-provisional.jsonl`)
**Immediately promoted L1→L2 in the same round** (machine-verifiable from compiled CSS output, independently reproduced by 2 of 3 candidates in this single round — matches the established exception for machine-verified findings, same exception class as `auto-landing-r10`'s accent-contrast reversal and `auto-landing-r11`'s line-length constant): `font-[var(--font-display-wide)]` (and the equivalent for any of the three display-face CSS variables) compiles under this repo's exact Tailwind v4 arbitrary-value syntax to a **font-weight** utility (`font-weight: var(--font-display-wide)`), not a font-family rule — confirmed directly by reading the compiled CSS output (`app/.next/dev/static/chunks/*.css`). The working, correct syntax for applying a CSS custom property as a font-family in an arbitrary-value class is `font-[family-name:var(--font-display-wide)]` (the `family-name:` type hint is required). Candidates a and c both used the broken bracket syntax and their chosen display face silently never rendered anywhere on either page — every headline fell back to Pretendard at whatever weight class won the cascade (usually `font-extrabold`) — while candidate b used inline `style={{fontFamily: "var(--font-display-grotesk)"}}` instead and rendered correctly. This is not currently a hard-gate-caught defect (no violation — not using a display face is itself a brief-allowed choice, and the static font checks are regex/string-based so they can't distinguish "classname contains the display-var token" from "that token actually resolves to a font-family at render time") — it is a silent craft-polish gap with a precise, generalizable fix.

## Questions-queue
No new entry. The 2:1 split with a rotating dissenting lens matches established normal-outcome precedent (the dash-target Q32 finding generalizes across targets, already noted in this session's dash round). The b/c template convergence is the 6th-ish independent reproduction of the already-L3 "device differs, lower layers converge" doctrine — strong supporting evidence, not a new finding requiring its own entry.

## Canon
`design-principles.md`, `dash-brief-v3.md`, `page-brief-core.md`, `page-brief-repo.md`, all type profiles, `/dash` gallery, `/v1`–`/v5` — all unchanged. jsonl append-only. No commits to `main`.

## Scheduled-run completion note
This completes both of this scheduled session's two back-to-back `/dash-evolve` executions: round 1 = `auto-dash-r42` (winner c "Varia", 2:1), round 2 = `auto-landing-r36` (winner a, 2:1). 0 no-winner rounds, 0 candidates dropped outright (both rounds' single hard-gate failures were resolved cleanly in their one permitted 1-fix attempt), canon fully unchanged throughout both rounds.
