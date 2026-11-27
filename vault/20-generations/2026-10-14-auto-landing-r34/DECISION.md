# auto-landing-r34 — DECISION

## 0. Round framing
- Round 2 of a scheduled 2-round sequential `/dash-evolve 2` execution (unattended). Round 1
  (`auto-native-r39`, winner b "Vacation Mode") was fully committed and pushed before this round's
  RETRIEVE began — sequential, not parallel, per the skill's consecutive-round rule.
- `round-budget.mjs --explain 2` re-run fresh after r39's commit → still `1\t미채움 0종 — N≥2 의
  근거(커버리지)가 없다` (one evolve round doesn't change `PAGE_TYPES`; promotion only happens at
  `/dash-falsify apply`). This round runs exactly 1 of §0–7, per precedent.
- Target draw: unfilled queue still empty → equal random draw among `[dash, landing, native]` landed
  on **landing** (this execution's first draw was native, so "exclude types already generated this
  run" per the scheduled prompt's own instruction didn't need to filter it out — landing was never
  generated earlier in this run).
- Round number: `auto-landing-r34` (max existing landing round + 1).
- `reassign-queue.md` "대기 중" had no `target: landing` entry (only dash #11) before this round.

## 0-0. Agent-tool / subagent-type deviation (self-disclosed)
No custom `designer`/`comparator` agent definitions exist in this sandbox, so `general-purpose`
agents stood in for both roles across 6 independent, blind invocations (3 designers, 3 judges).
Independence and blindness preserved. `self_judged` not set.

## 1. RETRIEVE
Read in full: `vault/00-principles/design-principles.md`, `vault/00-principles/page-brief-core.md`,
`vault/00-principles/page-brief-repo.md`, `vault/00-principles/curation-criteria.md` (tie-break rule,
Q21/Q30 assignment-only-blocks-convergence-at-the-assigned-layer), `vault/00-principles/
reassign-queue.md` (no landing entry), `vault/00-principles/questions-queue.md` Q60/Q62 (open,
landing-targeted), `landing-deltas-provisional.jsonl` tail, last 3 landing ledger entries + their full
notes (r31/r32/r33) for macro-bucket/device saturation, and `scripts/catalog-variety.mjs` banList —
only `face: grotesk` banned (2+ uses in the last-3 window: r31, r33 both grotesk), no theme/accent
bans.

**RETRIEVE gap found post-hoc (see §6/LEARN/Q66 below)**: the hand-maintained duplicate-avoidance
list assembled for this round's GENERATE prompts omitted `auto-landing-r24/a`'s toggle-checklist→
waterfall/bridge-chart archetype, which candidate b ended up closely reproducing. Not caught before
assignment; caught by blind lens3 during judging.

## 2. GENERATE
Three genuinely new device×output combinations assigned (per the pre-judging avoidance list, later
found incomplete — see above), avoiding the banned `grotesk` face:

| v | audience | device | output | variety |
|---|---|---|---|---|
| a | buyer | drag-to-reorder 4 priority chips (Price/Condition/Trust/Speed) | live re-ranked 3-card product grid, match% recomputed per rank-weighted formula | dark / violet / mono |
| b | buyer | 5 toggle switches (qualifying conditions) | live SVG waterfall/stacked-discount chart + live-priced hero card | light / teal / wide |
| c | seller (deliberate reframe, following `r31/c`'s precedent) | 3 stepper counters (category item counts) | live itemized payout breakdown table + stacked-bar category mix | dark / sky / no display face |

Each candidate required to compute and log accent contrast (vs white and vs their own ink) and the
body line-length calculation (0.44em average-char-width constant, not `ch`) in their self-report.
Mandatory hero-embedded-proof rule given to all three, with an explicit seller-facing carve-out for
c (condition-grade + verified-sale badge in place of match%/discount, which don't semantically apply
to a seller audience — logged, not faked, per `r31/c` precedent).

Source hash at freeze: `1ac086aa78b636809036a6150aba354fd921225b` (computed after c was dropped, over
a+b's final source only — c's files remain on disk per skill convention but are excluded from the
judged hash since they never reached judging). Verified unchanged through screenshot capture and
judging — round is valid.

## 3. HARD GATE
Dev server: 3100 was not already running — started `cd app && npm run dev` in background per skill
§3 (this round's orchestrator started it; left running for subsequent gate/capture calls).
`PW_CHROMIUM_PATH`/`CHROME_PATH`/`PW_NO_SANDBOX` set to the sandbox's pre-installed Chromium (same
environment workaround as the native round earlier today — `cdn.playwright.dev` is unreachable here).

`node scripts/gate.mjs --target web --routes /landing-evolve/r34/<v>` per candidate:

- **a**: 1st pass a11y 96 (`target-size` — the up/down reorder-chevron buttons were ~20px effective
  touch target, below the 24×24 floor). 1-fix: added `flex min-h-6 min-w-6 items-center
  justify-center` to both buttons. 2nd pass: **clean** (a11y 100, 0 violations).
- **b**: **clean on first attempt** (a11y 100, 0 violations).
- **c**: 1st pass lint 1 error (`react-hooks/set-state-in-effect`, `Reveal.tsx:29`) + sweep
  `page-overflow` 148px@390px (a grid-item's default `min-width: auto` was letting the itemized
  breakdown table's `min-w-[480px]` force the grid track wide). 1-fix: replaced the effect-based
  mount flag with the proven `useSyncExternalStore` pattern (copied from candidate a's own
  `useMounted.ts`, which cleared the identical lint rule cleanly), and added `min-w-0` to the grid
  item feeding the table's scroll wrapper. 2nd pass: lint **resolved**; sweep **re-failed** (148px→
  127px, reduced but not eliminated). Root-caused via direct `getComputedStyle`/`scrollWidth`
  instrumentation to a genuine Chromium quirk — a nested `overflow-x:auto`/`hidden` wrapper does not
  by itself isolate a wide descendant from contributing to `document.documentElement.scrollWidth`
  (confirmed: `overflow:hidden !important` left `scrollWidth` unchanged; `contain:layout` on the same
  wrapper dropped it from 517→390 while the table's own local scroll stayed intact). Per skill §3,
  this is a genuine re-failure after the one permitted fix-and-regate cycle — **c dropped**, logged
  to `reassign-queue.md` #12 with the exact prescribed fix (`contain:layout`, one line) for a future
  attempt. Full diagnostic detail in `SCORES.md`.

Two survivors (a, b) proceed to judging.

## 3-1. Post-judgment refinement (applied — see §4 aggregation)

## 4. JUDGE PANEL
Screenshots: `scripts/capture-shots.mjs` at 1280/1440/1920/390px × 4 scroll depths (0/35/70/100%) for
both survivors — 32 frames total, zero blanks, zero capture errors. Judges given 4 frames each
(`-1440`, `-1440-s70`, `-390`, `-390-s35`) plus full source. 3 parallel blind `general-purpose` agents
(lens roles substituted per §0-0). All three completed with full rankings, `file:line` evidence, and
self-reported unchecked scope.

### Lens 1 — brief / DNA compliance
**Ranking: b > a.** Both cleanly satisfy the catalog's single most load-bearing rule (proof card
inside Hero's own `return`, verified in source not self-report) and every other mechanical rule
(3 weights, single correct display face, accent contrast — a's fully independently re-verified to 2
decimals, b's had one arithmetic error in its self-report log, `0.0D9488` vs ink claimed 3.24:1 vs
lens1's own recomputed 4.73:1, but with no live consequence since that pairing is never used as text),
determinism, image rules, body line-length. **Decisive factor**: a's interaction count. Lens1 grepped
every file outside the reorder device and found only 3 distinct interactions (device, scroll-reveal,
the re-sorting grid as a device consequence) against the brief's explicit "minimum 4" floor; found no
4th anywhere, and a's own brief-gaps report never claims one. b clears the floor with margin (device,
scroll, product-preview, a `<details>` price breakdown, AND a `<select>` sort control on the similar-
listings grid — 5 distinct, functionally-justified interactions).

### Lens 2 — commercial polish
**Ranking: a > b** — ***with a material confound, disclosed below***. Both candidates' live
computations are genuine (traced `reorder-math.ts`'s weighted-sum and `savings-math.ts`'s running-
total, neither faked/hardcoded), neither has a dead affordance, both propagate state correctly to the
closing CTA. The decisive factor lens2 cited: b's hero and "similar listings" product photos
(`next/image` hotlinking `images.unsplash.com/photo-<id>`) rendered as broken-image boxes in
**every** screenshot provided (1920/1440/1280/390px), while a's generated SVG/CSS icon placeholders
rendered correctly throughout. **This orchestrator independently confirmed, after judging completed,
that `images.unsplash.com` is unreachable from this sandbox's network policy** (`curl` to a fixed
Unsplash photo URL times out/fails, consistent with the same `cdn.playwright.dev`-blocking policy
that required the `PW_CHROMIUM_PATH` workaround earlier today) — `next.config.ts` does correctly
allow-list the host, and lens2 itself flagged this as "very plausibly a network-egress artifact of the
screenshot-capture sandbox... rather than a code bug" even before this confirmation. **This is a
material caveat on lens2's ranking**: with the broken-image finding discounted as an environment
artifact rather than a b-specific defect, lens2's remaining case for a (marginally tighter discount-
percentage spread in a's dummy data, one likely-animation-timing-artifact faded section in a single
b screenshot explicitly judged non-consequential) is thin, and lens2's vote should be read with
reduced weight rather than taken as a clean, confound-free signal.

### Lens 3 — differentiation
**Ranking: a > b — not a confound, independently and separately grounded.** Both clear the
device/output-level differentiation test from each other (continuous reordering vs. discrete toggles;
re-sorting card grid vs. segmented running-total chart) and the catalog's well-documented Q60 layer-
below-device copy convergence (closing-CTA shape and header chrome are similar between a and b, but
traced to shared repo doctrine / `page-brief-core` convention, not organic duplication — logged as an
observation per this catalog's established practice, not scored). **Decisive factor**: catalog-
duplication depth. b is a close reproduction of the already-shipped `auto-landing-r24/a` archetype
(toggle-checklist → live cumulative waterfall/bridge chart → CTA price line) — same device type, same
output type, same CTA-threading pattern, differing mainly in parameter count/sign-mix, and b's own
self-report never cites or distinguishes from r24/a. a's catalog lineage (`auto-landing-r29/a`'s
weighted-dial → reordering-leaderboard genre) is looser — same genre, materially different device
(discrete drag-reorder of 4 labeled criteria vs. 3 continuous dials) and output (3-card grid with
match%/grade/verified badges vs. an 8-row leaderboard with rank-delta badges). See §6/LEARN/Q66 for
the RETRIEVE-process root cause of why this wasn't caught before assignment.

### Aggregation
| lens | ranking | basis |
|---|---|---|
| lens1 (brief compliance) | b > a | a's interaction-count shortfall (3 found, floor is 4) |
| lens2 (commercial polish) | a > b | **confounded** — driven mainly by b's broken images, confirmed a sandbox network artifact, not a code defect |
| lens3 (differentiation) | a > b | clean — b closely reproduces an existing catalog archetype (r24/a), a's reproduction is looser |

1st-place votes: **a×2** (lens2, lens3), b×1 (lens1). Not a complete 3-way tie — majority applies
directly. **Winner: a** ("Match-Weight Reorder"). Despite lens2's confound, the majority holds on
independent grounds: lens3's vote for a rests entirely on the (unconfounded) catalog-duplication
finding, giving two genuinely distinct reasons (one process/interaction-floor reason favoring b, two
independent reasons — one confounded, one clean — favoring a) rather than a false 2:1 built on a
single shared defect.

## 3-1 (applied). Post-judgment refinement on winner a
Lens1's dissenting finding (a's interaction count: 3 found vs. the brief's 4-minimum floor) is a
narrow, mechanical brief-compliance gap — not something lens2 or lens3 weighed in their winning
rationale (lens2 weighed live-computation integrity and the image-render confound; lens3 weighed
catalog-duplication depth). Per skill §3-1 this qualifies for a narrowly-scoped post-judgment fix:
added a `<details>/<summary>` disclosure to each compact (Hero) product card, revealing the existing
`reasoningByLeadChip` text that was previously only shown in the separate expanded Product Preview
cards — purely additive, touches no ranking math, data, or anything either winning lens cited.
Re-gated clean (10/10, a11y 100, 0 violations). Ranking **not** recalculated, per skill §3-1 (the fix
is invisible to what lens2/lens3 actually weighed). Full detail in `SCORES.md`.

## 5. LEARN — isolated append
1 new L1 delta appended to `vault/00-principles/landing-deltas-provisional.jsonl`: landing RETRIEVE's
hand-maintained duplicate-avoidance list does not scale with a 34-round-deep catalog and can silently
drop an already-shipped archetype (this round: `auto-landing-r24/a`'s toggle-checklist→waterfall/
bridge-chart, missing from the list given to candidate b's designer) — the landing-target instance of
the same RETRIEVE gap already diagnosed for dash (Q58) and native (Q63). `confidence: high` (caught
and attributed by an independent blind lens, not just an orchestrator hunch), `judge_votes:
{lens1:'b', lens2:'a', lens3:'a'}`.

## 6. 지식 정제 게이트
- No conflicting delta pairs against the existing provisional tail; no supersedes relationship.
- New `questions-queue.md` entry **Q66** (target: landing, RETRIEVE prompt design): proposes porting
  dash's Q58 / native's Q63 fix (a mandatory full-archive grep step before device/output assignment,
  replacing/supplementing the hand-maintained list) to landing RETRIEVE — third independent
  reproduction of the same cross-target failure shape. Not disqualifying this round (lens3 explicitly
  confirmed this is archetype-level reproduction, not literal code-surface duplication — no no-winner
  trigger), and b is the loser so no §3-1 action applies to it.
- The Unsplash sandbox-network-block finding is recorded here and in §4 above as a DECISION-level
  caveat rather than a formal delta — it's an environment property of this specific sandbox run, not
  a reusable design-loop principle, though future rounds in this same environment should expect it to
  recur for any candidate using `images.unsplash.com`.

## 7. 기록 + 커밋
- `auto-ledger.jsonl` entry appended: `target: 'landing'`, `round: 'auto-landing-r34'`,
  `date: '2026-10-14'`, `winner: 'a'`, `no_winner: false`, `judges: {lens1:'b', lens2:'a', lens3:'a'}`,
  `refuted: null`, `variety: {theme:'dark', accent:'violet', face:'mono'}`.
- `vault/index.md` "세대 기록" updated with this run.
- This completes both of this scheduled run's rounds (round 1: `auto-native-r39`, winner b "Vacation
  Mode"; round 2: `auto-landing-r34`, winner a "Match-Weight Reorder"). 0 no-winner rounds, 1 candidate
  dropped total across both rounds (landing r34/c, logged to reassign-queue #12 with an exact fix).
  Canon (`dash-brief-v3`/`design-principles`/`page-brief-core`/`page-brief-repo`/type profiles/native
  `GENERATION.md`/`tokens.ts`) fully unchanged throughout both rounds.
