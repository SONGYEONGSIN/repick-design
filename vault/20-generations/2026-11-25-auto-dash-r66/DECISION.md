# auto-dash-r66 — DECISION

## 0. Round-budget & scope note

This round was fired by a scheduled unattended task that asked for **2 consecutive rounds**
(`/dash-evolve 2`). Per SKILL.md §0-0-1, the round count is not taken from the caller's request —
it is computed by `node scripts/round-budget.mjs 2`.

```
$ node scripts/round-budget.mjs 2
1
$ node scripts/round-budget.mjs --explain 2
1	미채움 0종 — N≥2 의 근거(커버리지)가 없다
```

`unfilledTypes()` against `app/src/lib/works.ts` `PAGE_TYPES` (18 types: dashboard, settings,
landing, login, 404, catalog, scene, product-detail, paywall, profile, blog, about, careers,
contact, developers, integration, media-kit, mobile) returns **0 unfilled** — every type has at
least one catalog entry. Per the script's own rule ("미채움 0종 → 1, 요청값과 무관하게"), **N is
hard-capped to 1 regardless of the caller's request.** This is not a failure of this round; it is
the skill's own authoritative gate. The scheduling prompt's success criteria (2 round commits, 2
ledger entries, 2 run dirs) cannot be met today for this reason — documented here per §0-0-1's
explicit instruction ("호출자가 2 이상을 줬어도 스크립트가 1 을 내면 1라운드만 돌고 그 사실을
DECISION 첫 절에 적는다").

Native weekly cadence check: today is 2026-11-25 (Wednesday, UTC day=3), not Monday, so the native
day override does not apply.

Agent tool availability: confirmed present (this run uses it for designer + judge subagents) — no
`self_judged` deviation this round.

## 0-1. Target selection

`unfilledTypes` is empty, so target falls back to the uniform random draw over `[dash, landing,
native]` per SKILL.md §0 → **dash**. Round number for target `dash`: max existing `auto-dash-r*` in
`vault/30-ledger/auto-ledger.jsonl` is r65, so this round is **auto-dash-r66**.

## 1. RETRIEVE — summary

- BRIEF: `dash-brief-v3.md` + `page-brief-core.md` + `page-brief-repo.md` read in full.
- `reassign-queue.md` "대기 중": **(현재 대기 항목 없음.)** — no reassignment this round.
- DELTAS: `dash-deltas-provisional.jsonl` (104 raw entries → 54 active after excluding
  superseded/refuted rounds; 9 L2, 45 L1). All 9 active L2 deltas folded into every designer's
  prompt verbatim; most recent ~14 L1 deltas folded in condensed form. Full L2 list:
  - `r24/b` — cell-overlap inside correctly-non-overflowing documents; sweep only catches
    document/table scrollWidth, not intra-cell overlap. Judge (eyes) is the only net for this class.
  - `r25/all-3` — `min-w` on `<td>`/`<th>` is decorative once `table-fixed` locks columns from
    `<colgroup>`/first row; `min-w` must go on the `<table>` itself.
  - `r40/c` — a selection-fanout secondary/detail pane that renders fully empty by default (no
    sensible placeholder at first paint) is penalized by the commercial-completeness lens even when
    the fan-out wiring itself is narrow/correctly-scoped.
  - `r46/b` — a row-direction flex `<aside>`'s single child wrapper can still overflow a fixed
    `w-64` rail even when the actual overflowing descendant already has `min-w-0`+`flex-1`+truncate.
  - `r48/c` — radial/circular chart peripheral labels need margin sized to the *longest* label
    string at that font size, not just room for the anchor point.
  - `r56/b` — a 1-fix patch for one gate/lint rule can create a *new* violation in the same
    plugin/family (e.g. a `set-state-in-effect` → `refs` fix chain) — check for same-family conflicts
    before applying a fix.
  - `r62/a,c` — `Intl.NumberFormat` compact notation disagrees server/client ICU on trailing-zero
    display for whole numbers → hydration mismatch. Fix: `trailingZeroDisplay:"stripIfInteger"` on
    every compact-notation formatter whose output is server-rendered into hydrated text.
  (`r62/c` and `r65/a` entries on selection-fanout independence are summarized below under "open
  delta directives" since they're the most operationally relevant to this round's bucket design.)
- Recent dash ledger (last 5): r61 no-winner · r62 winner c (dark/sky/grotesk) · r63 no-winner ·
  r64 winner b (light/green/wide) · r65 winner b (light/orange/mono).
- `catalog-variety.mjs`: 65 works catalog-wide, theme dark 36/light 29, accent amber/teal most
  overused (8 each), green/blue-hex most underused (1 each). `banList` computed from the last 3 dash
  ledger entries with a recorded `variety` (r65 light/orange/mono, r64 light/green/wide, and the next
  back which predates the field) → **theme ban: `[light]`** (2 consecutive light winners), no
  accent/face ban (no axis repeats ≥2 in the non-null window).
- Macro-bucket anti-recurrence: r64 used master-detail (a, winner) + calendar/board (b) +
  feed-centric (c); r65 used 3-pane-market (a) + feed-centric (b, winner) + hero/inline-stats (c).
  **master-detail and feed-centric are both recently-overused (feed-centric won twice in the last 2
  rounds)** — neither is assigned this round. This round's three candidates use: 3-pane market
  (least-recently-won of the heavy buckets), calendar/board-centric, and a genuinely new shape not
  in the brief's named list (full-bleed single dominant treemap, no permanent rail, ephemeral
  selection panel instead of a permanent detail pane) — chosen specifically so no candidate is a
  master-detail or feed-centric skeleton.

## 2. GENERATE — 3 parallel designers (blind to each other)

All three were briefed with the full assembled brief text (not paths), per §2's explicit
instruction. Each got a distinct domain/macro-bucket/theme/accent/face assignment and an explicit
instruction NOT to open the other two candidates' files. Full briefs are in the background-agent
prompts; concept summaries + "브리프에 없던 것" reports are in `candidates/{a,b,c}.md`.

| v | product | domain | macro-bucket (assigned) | theme/accent/face |
|---|---|---|---|---|
| a | Gridwell | renewable-energy grid-balancing ops console | 3-pane market (rail + dominant chart + feed) | dark / indigo / `--font-display-wide` |
| b | Siteframe | clinical-trial site visit scheduling console | calendar/board-centric (heatmap calendar + visit board) | light / lime / `--font-display-grotesk` |
| c | Spendmesh | cloud infra cost / spend-allocation console | rail-less full-bleed treemap + ephemeral selection drawer (not a named bucket — deliberately fresh) | dark / violet / pretendard-only |

None of the three domains, chart types, or macro-bucket wirings existed in the catalog or in the
last 5 rounds prior to this one. All three designers completed fully (file-presence + explicit
completion report, not just file existence — per §2's "designer 완료를 확인한 뒤에만 §3으로 넘어간다"
instruction) before the freeze hash was taken.

Selection-fan-out independence (the catalogue's accumulated L1/L2 lesson on this bucket family) was
explicitly required of all three: a) region-pin touches only its own snapshot card, never the chart
or feed; b) day-selection touches only the visit board, with the per-site on-time hover kept as a
fully separate ephemeral axis; c) the tile-click drawer and the treemap↔table view toggle are kept
as two independent state axes, and the drawer does not exist in the DOM at rest.

## 3. HARD GATE

Dev server on :3100 confirmed running (started by this round; will be stopped at the end).
Playwright/Lighthouse browser note: this sandbox's bundled Chromium download is blocked by the
egress proxy, so gate runs used the pre-installed `/opt/pw-browsers/chromium` via
`PW_CHROMIUM_PATH`/`CHROME_PATH` env vars (no script changes — all gate scripts already read
`PW_CHROMIUM_PATH` as a fallback).

- **a (Gridwell)**: 1st gate **10/10 clean**. No 1-fix needed.
- **c (Spendmesh)**: 1st gate **10/10 clean**. No 1-fix needed.
- **b (Siteframe)**: 1st gate failed — `sweep` `cell-overlap` ×43 (the Time column's text
  overflowing into the Patient column across 1264–1440px and 390px) + `a11y` 95 `button-name` (the
  "New visit" button's label was `hidden sm:inline`, leaving only an `aria-hidden` icon below `sm` —
  the exact historical pattern `page-brief-core` §1 names as the cause of 5 prior `button-name`
  failures). 1-fix applied (orchestrator-diagnosed, not re-dispatched to the designer — rule-
  violation-fix only, no taste changes; see `SCORES.md` for the 3 edits): meridiem-dedup in
  `formatRange`, widened+repadded the Time/other columns, `sr-only sm:not-sr-only` on the button
  label. Re-gate: a11y → 100 clean, sweep → down from 43 to **1 residual** (the single row whose
  range crosses AM→PM, which the meridiem-dedup cannot shorten). **Per §3's one-fix rule, any
  residual failure after the single fix attempt is elimination — no second attempt.** Candidate b
  is gate-eliminated and does not proceed to judging.

Full gate detail: `SCORES.md`.

**Reassign-queue entry filed** (§6/§7) for candidate b: the failure is a rule violation (table
column-width budget), not a verdict on the calendar/board macro-bucket or the Siteframe
domain/product itself — per the catalogue's "게이트 탈락은 형태 판정이 아니다" rule, the form is
eligible for reassignment with the exact fix instruction (widen the Time column further still, or
switch to a format that doesn't vary in length by AM/PM-crossing, e.g. lowercase compact `8:30a–
9:00a` / 24h time) attached, so a future round doesn't fall into the same trap.

Freeze-hash note: the hash recorded in `SCORES.md` (`6d04334c2ea77505f0523f12d4004842a64c8b56`) is
the pre-1-fix state of all three candidates, taken once after all three designers confirmed
completion. Candidate b's source changed during its 1-fix (rule-violation-fix only, scope allowed by
§3-1) — but b did not survive to judging, so this does not affect what the judges saw. Candidates a
and c were judged on exactly the frozen-hash state (neither needed a 1-fix).

## 3-1. Judging with 2 survivors

Per §4's explicit rule ("생존 후보 2개 이상일 때" the panel ranks normally; only at exactly 1
survivor does it become a solo winner/no-winner call), 2 survivors (a, c) is judged as an ordinary
ranked comparison, not a solo review — the panel ranks the two and a plain majority (2 of 3 lenses
agreeing on 1st) decides the round; a 3-lens no-winner vote (≥2 lenses naming no-winner) still
applies.

## 3-2. Blank-frame catch on candidate c (manual screenshot inspection, not an automated gate)

Per §4's explicit warning that the automated per-frame blank-classifier only catches a fully-blank
frame, not a blank *region* within an otherwise non-blank frame, a manual look at c's first-capture
screenshots (before judging) found the treemap — c's entire dominant visualization — rendering as
empty space at every desktop width. This was diagnosed (CSS percentage-height resolution bug: `h-full`
against a `min-height`-only, non-definite-height ancestor chain) and fixed directly, which in turn
surfaced a previously-invisible `label-content-name-mismatch` a11y hard-fail on every treemap tile
(fixed the same way `page-brief-core` §2 already documents for this exact pattern). Full diagnosis,
evidence, and both fixes are in `SCORES.md`'s candidate-c section. Re-gate after both fixes: **10/10
clean**. Screenshots were recaptured post-fix; judges see the fully-rendered state. Candidate a
needed no equivalent intervention — its first-capture screenshots were already clean on visual
inspection.

## 4. JUDGE PANEL (2 survivors — ordinary ranked comparison, per §3-1 above)

Frames given to all three lenses (blind to each other, each lens run as an independent background
agent, no cross-communication): `a-1440.png`, `a-1920.png`, `a-390.png`, `c-1440.png`, `c-1920.png`,
`c-390.png` (scroll-0 only for both — neither page has meaningful page-level scroll content beyond
one viewport once c's treemap area got its fixed-height fix). Each lens also had Read/Grep access to
both candidates' full source.

### Lens 1 — profile/brief compliance: **1st = A, 2nd = C**
Both pass cleanly; A edges out on execution discipline, not on any brief violation by C. Selection
fan-out for A confirmed independently-scoped (region-pin → only `RegionRail` highlight +
`EventFeed` snapshot card; `GridChart` never receives `pinnedRegionId`). Macro-bucket assignments
both honored structurally. No copy-language, grid-craft, or data-integrity violations found in either.

### Lens 2 — commercial-grade completeness: **1st = A, 2nd = C**
A's headline stats are always-legible and arithmetically self-consistent (Generation − Demand = Net
balance; Wind/Total matches renewable-share %). C's central flaw on this lens: several treemap
sub-tiles render illegible/truncated text even at 1920px width (`treemapLayout.ts` has no
minimum-label-size gate or small-slice aggregation) — a real miss against this bucket's own
"label+value legible at every tile size" requirement. C's mobile responsive treatment (a dedicated,
clearly-labeled table view below 640px, not a squeezed treemap) was called out as the single
strongest piece of evidence either candidate produced on responsive craft. A has minor polish
nits (two stat-chip labels ellipsis-clip at 1440 despite rendering in full at 1920; non-"nice" chart
y-axis tick values; double-truncated alert-feed rows at 1440) — real but secondary to C's central-viz
legibility gap.

### Lens 3 — structural/archetype differentiation: **1st = C, 2nd = A**
Both candidates' fan-out independently re-verified via source trace (not taking either designer's
own description at face value) and both land in this catalogue's established best tier (multiple
independently-scoped axes on separate widget clusters). The tiebreak for this lens is bucket-level,
not fan-out-level: A's "3-pane market" is a well-executed instance of a bucket the brief itself
flags as recently-overused and already-saturated; C's rail-less full-bleed-treemap-plus-ephemeral-
drawer shell is a genuinely new addition to the catalogue's vocabulary (confirmed: no permanent
`<aside>`/rail at any width in `Topbar.tsx`; `SelectionDrawer` unmounted at rest via
`<AnimatePresence>`; view-toggle and tile-selection are two independently-set state slots with one
documented one-way bridge). C's domain (cloud-cost treemap) and chart type (treemap) are also new to
the catalogue.

### Aggregation
1st-place votes: **A = 2 (lens 1, lens 2)**, **C = 1 (lens 3)**. No no-winner votes from any lens.
Per §4's rule ("1위 표 다수결 ... no-winner 표 2개 이상이면 라운드 no-winner" — not triggered here),
**plain 2:1 majority — Candidate A ("Gridwell") wins auto-dash-r66.**

This is not the "archetype loses to completeness" pattern this catalogue has repeatedly observed
(where the more novel candidate is penalized for an *unforced* completeness tradeoff) — lens 3 itself
confirms A's execution is clean on its own bucket; the vote split reflects that A simply executed a
known-good, if saturated, shape better than C executed its riskier, more novel one (C's genuine
central-viz legibility defect was the deciding factor for 2 of 3 lenses). No tie-break rule needed
(this is a plain majority, not a 3-way or 2-way tie).

No regression/rule-violation was found by any lens in the winning candidate that would trigger §3-1
post-judgment remediation — A is promotable as judged, no further source changes.

## 5. LEARN

One delta extracted from judge reasoning (lens1 + lens2 independently found the same defect on the
same screenshot frame, from different angles — a judge-reasoning-sourced finding, not an orchestrator
observation): a treemap dominant-visualization needs its own tile-rendering code to carry a minimum-
size floor (hide text below some threshold, or merge smallest slices into "Other"), or individual
tiles render illegible/mid-digit-truncated dollar values even at wide desktop widths. Appended to
`vault/00-principles/dash-deltas-provisional.jsonl` as L1/provisional (this catalogue's first
treemap, so no 2-round reproduction is possible yet).

Candidate b's reassignable form (Siteframe) filed to `vault/00-principles/reassign-queue.md` #25 with
the exact fix instruction (widen the Time column further, or switch to a meridiem-count-invariant time
format) per the catalogue's "게이트 탈락은 형태 판정이 아니다" rule — the elimination was a rule
violation (table column-width budget), not a verdict on the calendar/board bucket or the clinical-
trial domain, both of which were unviolated (a11y 100, 9/10 other gates clean).

## 6. 지식 정제 게이트

- Loaded `dash-deltas-provisional.jsonl` in full (104 raw entries, 54 active after excluding
  superseded/refuted rounds) before GENERATE (§1) — this round's new entry is additive, not in
  conflict with any existing active delta or with `dash-brief-v3`/`page-brief-core`/`page-brief-repo`.
  No cross-target conflict either (no landing/native delta touches treemap rendering).
- **Level reassessment**: the new treemap-tile-floor delta stays **L1** — this is the catalogue's
  first treemap-type dominant visualization, so there is no second round to reproduce against yet
  (the L2 bar requires either 2-round reproduction or direct mechanical/gate verifiability; neither
  applies here since no automated gate checks tile-text legibility). No existing delta was
  re-leveled this round.
- **Separately documented, NOT appended as a delta this round** (§5 caps the judge-reasoning-sourced
  LEARN step at exactly one delta per round, and this second finding was discovered by the
  orchestrator pre-judging, not sourced from judge reasoning): the CSS root cause behind candidate
  c's initially-invisible treemap (`height: 100%` not resolving against an ancestor whose own CSS
  `height` property is `min-height`-only, even when flex-grow is also present but the flex-grow
  chain's ultimate ancestor also lacks a definite height) is fully written up in `SCORES.md`'s
  candidate-c section for a future round to promote into a delta if it reproduces independently.
- **Questions-queue**: no conflicting delta pair and no delta left meta-criteria-unjustifiable this
  round, so no new entry was forced into `questions-queue.md` (§6's mandate is conditional on those
  two triggers, not unconditional every round).
