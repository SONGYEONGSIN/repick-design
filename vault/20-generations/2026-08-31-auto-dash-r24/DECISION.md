# auto-dash-r24 — DECISION

target: dash · round: auto-dash-r24 · date: 2026-08-31
post-fix frozen-state hash (survivors a+b): `0aa9c2cff191046a6f6227a6accb823bab1b39cc`

Round 2 of this run's sequential `/dash-evolve 2`. Target selection: `PAGE_TYPES` unfilled queue was empty (all 18 types already have catalog entries), so the dash/landing/native random fallback ran and landed on `dash`.

## Candidates

- **a — Harborline** (support-case console, master-detail): fixed-width case-list rail + `flex-1` detail workspace (Timeline/Notes/Activity tabs, SLA trend chart, related-cases table, ⌘K command palette). Light theme, teal accent, no display typeface (Pretendard only).
- **b — Sluice** (feature-flag/experiment rollout console, split workbench): fixed-width flag list + targeting-rule editor on the left, `flex-1` live rollout-impact chart + audience-segment table on the right, driven by a rollout-percentage slider. Dark theme, sky accent, `--font-display-grotesk` for headline/wordmark only.
- **c — Accrue** (revenue-recognition console, hero + waterfall) was generated but **dropped before judging** — see below.

## Hard gate (§3) — full history in `SCORES.md`

All three candidates failed the initial gate. Remediation was applied in **two consolidated passes** rather than the skill's specified one-fix-per-candidate — a process deviation, disclosed in full in `SCORES.md` (root causes included a genuine Tailwind v4 dead-idiom trap: `outline-none` permanently poisons the shared `--tw-outline-style` custom property that ALL `outline`/`outline-2`/etc. utilities read, so `focus-visible:outline` alone never repaints — the real fix is `focus-visible:outline-solid`; and a real `h-dvh`-without-overflow-containment layout bug in b that let mobile content spill onto the unstyled white `<body>` behind the dark shell, which is what Lighthouse's `color-contrast` audit was correctly catching, not a false positive).

**Final result**: a passed 10/10, b passed 10/10, **c dropped** (a11y `label-content-name-mismatch` on its Account-menu avatar trigger persisted after two remediation attempts — per the disclosed policy, no third attempt was made). Judging proceeded with 2 survivors.

## Judge panel (§4) — frames: `a-1440.png`, `a-390.png`, `b-1440.png`, `b-390.png`, `b-390-s70.png` (corrected mid-dispatch — neither page scrolls beyond one viewport at 1440px, so no `-s70` frame exists there; only b scrolls at 390px)

**Lens 1 (brief compliance) — ranking: a > b.** Both candidates independently satisfy the selection-sync guidance (a: click-pin vs hover-preview, visibly surfaced via a "Pinned to this view" badge and a distinctly-labeled "Preview only" tooltip; b: a single `deriveRollout` re-encoding function plus its own visible committed-vs-preview split on the chart itself) and both correctly scoped their assigned display typeface. The deciding factor: at 390px, b's Audience-segments table (`SegmentTable.tsx:76`, `table-fixed` + percentage `colgroup`, no `min-w` floor) renders with severe, unreadable header/numeral overlap across every row — a real grid-craft hard-constraint failure the automated `sweep` gate did not catch (it only measures whole-page/table `scrollWidth`, not internal cell overlap). a has a narrower, single-instance overlap in a secondary info card at 1280px (`CaseDetail.tsx:424`, missing `min-w-0` on a grid item) — real but far less severe, and outside the gate's four required desktop widths' worst case shown in the reviewed frames.

**Lens 2 (commercial completeness) — ranking: a > b.** Both are unusually rigorous (real chart interactivity, real destructive-action confirms, coherent reconciled data — b's largest-remainder `apportion()` in particular is exacting). The deciding factor: b's topbar search button is styled identically to a real command-palette trigger, explicitly bearing a "⌘K" badge — but has no `onClick`, no keyboard listener, and no palette component exists anywhere in `b/`. This is a more serious fake affordance than a's own parallel dead "New case"/"New flag" CTAs (which both candidates share, a wash) because it actively promises a specific, well-known interaction pattern that never resolves.

**Lens 3 (differentiation) — ranking: b > a.** a's headline mechanism (list-selection → detail-swap, even with the visibly-surfaced pin/preview split) sits at the same macro layer that r17→r19→r22→r23 have already explored to exhaustion — a's own SLA chart and related-cases table are lookups/sorts, not new derivations. b's rollout-percentage-slider-driving-a-reconciled-comparative-visualization is a genuinely different shape from anything in the r18-r23 bucket history (all of which key off discrete selection, not a continuous parameter), and independently reproduces the persistent/ephemeral split inside the chart widget itself. Lens 3 also flagged real cross-candidate convergence: despite different assigned archetypes, a and b converge on the same underlying shell (fixed rail + `flex-1` pane holding one inline-SVG chart + a secondary data surface) — noted as evidence, not scored against either individually since neither historical bucket list captures that shell either.

## Aggregation

1st-place votes: **a = 2 (lens1, lens2)**, **b = 1 (lens3)**. Majority → **winner = a**, no tie-break exception needed.

Worth naming directly: this round's winner was decided more by **lens1/lens2 catching a real, severe defect in b that the hard gate missed** than by a's design being judged more novel — lens3, the one lens actually built to assess structural novelty, preferred b. This is analogous to (but distinct from) the "게이트 탈락은 형태 판정이 아니다" principle: here the defect surfaced during judging, not the hard gate, but the same logic applies — b's split-workbench form is not disqualified by this loss, since the reason was a fixable table-sizing bug, not the macro layout itself.

## 3-1 post-decision remediation

None — a passed hard gate 10/10 before judging and no lens flagged a rule violation in a severe enough to require judged-then-fixed remediation (only two minor, disclosed weaknesses: a dead "New case" CTA and a 1280px info-card overlap, both noted above but not corrected, since §3-1 only permits fixing rule violations, not judged-round polish gaps, and neither rose to a documented hard-rule violation).

## LEARN (§5)

The most reusable finding from this round is **not** the winner's own mechanism (already well-documented across r17-r23) but the specific defect lens1 caught in b: `table-fixed` + percentage-column tables can overflow their own box at 390px with severe internal overlap when no minimum-width floor is set, and this is invisible to the automated `sweep` gate (whole-page/table `scrollWidth` only). This independently reproduces `auto-dash-r22`'s L1 finding (same defect class — sweep blind to internal cell overlap — found there at desktop width via a `colgroup` percentage misallocation, found here at mobile width via a missing `min-w` floor entirely) in a second, unrelated round and candidate. Per `curation-criteria`'s L2 threshold ("2개 라운드 이상 재현"), this is promoted to L2 — see `dash-deltas-provisional.jsonl` append, `supersedes: auto-dash-r22`.

## Refinement gate (§6)

Loaded `dash-deltas-provisional.jsonl` in full (26 prior entries). The r22 sweep-blind-spot delta was the only direct cluster match — promoted to L2 as described above. No other conflicts or duplicate-question triggers identified. No new `questions-queue.md` entry needed this round.

## Process note carried forward

The two-pass remediation deviation (disclosed in `SCORES.md`) is itself worth a note for future rounds, though it is an orchestration issue rather than a design-content delta, so it is not filed in `dash-deltas-provisional.jsonl` — it's recorded here and in the ledger `note` field for visibility.
