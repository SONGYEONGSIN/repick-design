# DECISION — auto-landing-r43

## 0. Round-budget / self-judged disclosure

`node scripts/round-budget.mjs "2"` → **1** (0 unfilled `PAGE_TYPES`; the
"미채움 큐가 정한다" rule forces N=1 for this single invocation even though
the scheduler asked for 2 back-to-back rounds — the second requested round
runs as a second, separate `/dash-evolve` invocation afterward, same pattern
as prior scheduled sessions, e.g. r39/r40, r41/r42). `--explain` echoed:
"미채움 0종 — N≥2 의 근거(커버리지)가 없다."

Target drawn via the uniform-random `[dash, landing, native]` fallback
(unfilled queue empty): **landing**. Not Monday UTC (2026-10-29 is Thursday),
so no native weekly-cadence override.

**`self_judged: true` — disclosed per questions-queue Q47 disposition.**
This round is executing as an `Agent`-tool **fork**, and forks in this
harness are hard-restricted from spawning further subagents (a harness-level
rule, not a round-level choice — confirmed, not merely assumed). This is the
same constraint previously hit and disclosed in `auto-landing-r39` and
`auto-landing-r41` in this same ledger lineage (both also self-judged,
both also forks of the same scheduled-run pattern); `auto-landing-r40` and
`r42` by contrast ran as the non-fork orchestrator with real independent
`Agent`-tool subagents. Per the established disposition, proceeded rather
than no-round-aborting: generated all 3 candidates directly and applied all
3 judge lenses in the same single non-blind session, with full reasoning
below. Excluded from `/dash-falsify` promotion per Q47.

Reassign-queue checked at RETRIEVE time: no active pending `landing` entry
(all prior numbered entries archived/consumed) — all 3 candidates were free
exploration, no reassignment this round.

## 1. Candidates

- **a — Appraisal Scorecard** (dark / indigo `#4f46e5`+`#6366f1` / grotesk).
  5 star-pill criteria rows → weighted composite score (0-100) + Bronze/
  Silver/Gold tier badge + days-to-sell estimate, all three derived from one
  `ratings` state object. Non-trivial default (4/5/3/4/5 → 84, Gold).
- **b — Live Auction Ladder** (light / orange `#c2410c`+`#ea580c` / wide).
  One continuous slider ("your offer") re-sorts a 6-fixed-bid ladder via
  `framer-motion layout` animation and recomputes rank-out-of-7 + a
  rank-derived chance-to-win %. Non-trivial default ($326 → rank 6 of 7,
  31%).
- **c — Verification Timeline** (dark / sky / none) — **dropped at hard
  gate**, see §2.

Full concepts + "브리프에 없던 것" (accent contrast calcs, body-width
constant, image strategy, duplicate-avoidance depth caveats) in
`candidates/{a,b,c}.md`.

## 2. Hard gate

Both `a` and `b` needed exactly one fix cycle; both re-gated 10/10 clean.
`c` needed one fix cycle, re-failed on the same symptom (`page-overflow` at
390px), and was **dropped per the one-fix-only rule** — full root-cause
diagnosis (found post-drop, does not consume a second attempt) is in
`SCORES.md`: the grid-item wrapper `<div>` itself needed `min-w-0`, not
just its descendants — CSS grid items default to `min-width: auto`
(content-based) exactly like flex items, and the fix was applied one layer
too deep. See §5 for the resulting LEARN delta.

Candidate hash at judging time (a + b sources only, post-fix):
`55077276cbb06829c1b44743c555f7f90849ae8e`

Judging proceeded with **2 survivors** per skill §4 (2+, normal
multi-candidate judging, not single-candidate fallback). No blank frames in
either candidate's full 4-width × 4-scroll-depth capture.

## 3. Judge panel (self-judged, 3 lenses, genuine stress-tested split)

Frames reviewed per candidate: 1440 scroll-0/70%/100%, 390 scroll-0 (4 of
the captured 16; full set exists for PR-link/post-hoc verification). No
unseen-scope gaps — both candidates are short enough (3 content sections
below the hero fold) that all 4 reviewed frames covered the full page.

**Shared finding, non-decisive (both candidates equally)**: neither `a` nor
`b` puts the match%/grade/verified/discount badge set *inside the Hero
component itself* — both push product-preview badges to a separate section
below the fold. This directly misses the already-promoted L2 doctrine in
[[design-principles]] §Landing 구조 기본형 1 ("판정 기준을 폴드 안이
아니라 히어로 컴포넌트 안으로 읽어라," 2026-08-29 L2 amendment) — it is
not new information this round surfaced, it's an existing, documented rule
that this round's own GENERATE step failed to apply correctly to either
candidate. Flagging transparently rather than quietly letting a shared gap
pass unmentioned, per the auto-404-r1/auto-dash-r18 precedent that shared
violations don't move a ranking but should still be on the record. Since
both self-judged candidates are excluded from promotion anyway, this does
not block anything procedurally, but a future round's GENERATE prompt
should re-state this rule more forcefully.

**Lens 1 (brief/DNA compliance)**: **a**. a's "Comparable Listings" section
shows the full match%/grade/verified/discount badge vocabulary on *three*
items; b shows it once, on the single item up for bid — a more literal,
thorough satisfaction of design-principles.md §2 ("제품 프리뷰" wants the
AI-matching badge vocabulary demonstrated richly). Weighed against this:
a's accent (indigo `#818cf8` star fills) covers up to 25 small icon
elements across the 5×5 rating grid — a real "근처-단색조, accent는 극소량"
tension that b avoids (b confines its orange accent to the CTA, slider
track/thumb, the single highlighted "You" ladder row, and live-state text).
On balance, the richer §2 badge coverage is the more concrete, rule-literal
win, so lens 1 favors **a**.

**Lens 2 (commercial polish, Linear/Stripe/Vercel bar)**: **b**. The
`framer-motion layout`-animated ladder re-sort reads as a genuinely live
product moment (comparable to a real-time market/bidding dashboard) in a
way a's star-rating-into-score flow doesn't quite match — star ratings are
a familiar, slightly lower-register UI pattern (review widgets) regardless
of what they feed into. a also has a literal empty decorative rectangle
(`<div className="mt-6 h-40 w-full rounded-lg border ... bg-gradient-to-br from-white/[0.06] to-transparent" />`,
visible in the `a-1440.png` frame below the "Estimated time to sell" line)
that reads as unfinished filler with no stated purpose. Counter-weighing
b: its default state (`$326` → rank 6 of 7, barely ahead of the last
bidder) is a real messaging misstep — a landing page's default view
probably shouldn't show a first-time visitor "losing," which undercuts the
value-prop framing even though it technically satisfies the non-trivial-
default hard doctrine (not 0%, not an empty state). Judged the live-
interaction polish and absence of filler content as outweighing the
default-framing critique: lens 2 favors **b**.

**Lens 3 (archetype differentiation)**: **b**, narrowly. a's *input*
primitive (multi-row star rating) is an extremely common, well-worn pattern
regardless of its less-common output (composite+tier badge); the
underlying feel reads closer to "product review form" than something new.
b's *physical list reordering* driven by a continuous slider — rows
visibly swap position via layout animation as the value moves — is a
distinct, concrete interaction primitive. Checked against the open-delta
history and the last 5 rounds' recorded macro shapes (vertical ledger,
dual-handle range-sweep, photo-scan-reveal, balance-beam, facet-pickers) —
neither a live-reordering ranked list nor a weighted-star-to-tier-badge
scorecard matches any of those. **Caveat (same as in both candidates.md
files)**: this check was against recent-round ledger notes and the open
delta log, not a fresh exhaustive grep across all 21 production
`(marketing)/v6-v26` pages and ~54 landing-evolve candidates (Q70) — a
closer precedent may exist further back in the archive that this round's
RETRIEVE didn't surface. Lens 3 favors **b**.

**Result: 2:1 majority for b** (lens 2 + lens 3 vs lens 1). Not a tie, no
tie-break rule invoked. Deliberately stress-tested against self-judging
bias before finalizing — the first pass read as a clean b sweep on lenses
2 and 3 plus an *initially* close call on lens 1; re-examining lens 1
specifically for a case favoring a (the §2 badge-richness point) produced
a genuine, reasoned 2:1 split rather than a rubber-stamped 3:0, matching
the stress-test discipline the r41 self-judged round used.

**No post-judgment §3-1 fix on winner b** — no lens found a hard-rule
violation in it (the shared hero-badge-placement gap applies equally to
the losing candidate a, so it is not winner-specific and not a §3-1
scope item; the default-rank framing critique from lens 2 is a judgment
call, not a rule violation).

## 4. LEARN

One new L1 delta appended to `landing-deltas-provisional.jsonl` (see
delta-append command output) — the grid-item `min-w-0` nesting-depth
finding from `c`'s drop diagnosis: adding `min-w-0` to a flex/grid
descendant inside a CSS-grid item is not sufficient to prevent mobile
overflow if the grid item itself (the direct child of the `grid` container)
lacks `min-w-0` — grid items default to `min-width: auto` (content-based
sizing) exactly like flex items, and the existing page-brief-core §4 rule
("그리드 아이템은 min-w-0") doesn't specify which nesting depth needs it.
Single occurrence this round (L1, not yet reproduced).

## 5. Refinement gate

Loaded `landing-deltas-provisional.jsonl` in full during RETRIEVE (77
entries, 58 open-provisional at that point). No conflicting pair found
against this round's new delta — it's a narrow, mechanically-verifiable
CSS-layout finding with no overlap with the open deltas on
non-trivial-defaults, causal-consistency, or accent/contrast topics. No
L1→L2 promotion this round (single occurrence, not yet a 2-round
reproduction, though it is mechanically verifiable in principle — judged
it as still too narrow/novel a single-candidate finding to skip the
reproduction threshold the way the accent-contrast and line-length deltas
did, since those had 3 independent candidates converging on the same
error in one round; this is 1 candidate, 1 occurrence). No new
questions-queue entry — not a conflict pair, and the shared
hero-badge-placement gap (§3) is a GENERATE-execution miss against an
*already-settled* rule, not an open question needing adjudication.

## 6. Reassignment

Added candidate `c`'s form (Verification Timeline, dark/sky/none) to
`reassign-queue.md` "대기 중" with the exact fix instruction (grid-item
`min-w-0`, not just descendants) per the "게이트 탈락은 형태 판정이
아니다" doctrine — the drop was a rule violation (sweep overflow), not a
judgment on the stepper-driven-card-morph concept itself.

## 7. Canon / invariants

`design-principles.md`, `page-brief-core.md`, `page-brief-repo.md`,
`dash-brief-v3.md`, all type profiles, the `/dash` gallery, `/v1-v5`, and
the real production catalog `(marketing)/v6-v26` all untouched.
`landing-deltas-provisional.jsonl` append-only (1 new entry).
`reassign-queue.md` append-only edit (new entry under "대기 중", no
existing entries altered). No commit to `main`, only to `evolve/dash`.

## 8. Environment notes

Sandbox requires `CHROME_PATH=/opt/pw-browsers/chromium PW_NO_SANDBOX=1`
for Lighthouse to produce real a11y/perf (same as prior rounds r40-r42).
Playwright's own `chromium.launch()` default resolution needed the missing
pinned revision (1228) symlinked to the pre-installed 1243 build at
`/opt/pw-browsers/` — done once at session bootstrap by the orchestrator,
not inside this round's candidate code or scripts.
