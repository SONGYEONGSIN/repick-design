# auto-dash-r48 — DECISION

## 0. Deviations and round-scope (read first)

**Round 2 of 2** of this scheduled session's consecutive `/dash-evolve` execution — round 1
was `auto-landing-r39` (winner c "Afterhours"), committed and pushed to `origin/evolve/dash`
before this round's RETRIEVE began.

**Round-budget**: re-ran `node scripts/round-budget.mjs --explain 2` for this independent
invocation — returned `1	미채움 0종 — N≥2 의 근거(커버리지)가 없다` again (promotion to the
catalog happens only via `/dash-falsify apply`, which did not run between round 1 and this
round, so the unfilled-`PAGE_TYPES` queue is still empty). This round therefore runs as its
own N=1 execution, per skill §0-0-1.

**Target selection**: the unfilled-queue is empty (same as round 1), so §0's uniform
`[dash, landing, native]` random draw applies again. Per this scheduled task's explicit
instruction, `landing` (round 1's target) was excluded from this round's draw to guarantee
coverage variety within the same invocation, so the draw ran over `[dash, native]` only —
`dash` was returned. Today (2026-10-23, Friday) is not the native-cadence Monday, so no
override applied regardless. Round number: `auto-dash-r48` (max existing `auto-dash-r*` + 1,
per `auto-ledger.jsonl`).

**self_judged: true — not a valid blind panel.** Same condition as round 1 (see
`vault/20-generations/2026-10-23-auto-landing-r39/DECISION.md` §0 for the full tool-
availability check) — still no Agent/Task/ListAgents/general-purpose subagent-spawn tool in
this session between rounds. This round proceeded under the same documented fallback
(§0-0's "그래도 돌아버렸다면"): the single session generated all 3 candidates and applied all
3 judge lenses, not blind, not independent. Excluded from `/dash-falsify` promotion
regardless of outcome, per `questions-queue` Q47.

Hard-gate results are unaffected (mechanical, generator-independent) — unlike round 1, two
of this round's three candidates (a, b) needed and used their one allowed 1-fix; both are
documented in full in `SCORES.md` and `candidates/a.md`/`candidates/b.md`.

## 1. RETRIEVE — sources read

- `vault/00-principles/dash-brief-v3.md` (BRIEF, full)
- `vault/00-principles/page-brief-core.md`, `vault/00-principles/page-brief-repo.md` (full —
  already loaded this session for round 1, re-confirmed still current)
- `vault/00-principles/reassign-queue.md` — "대기 중" empty (same state as round 1)
- `vault/00-principles/dash-deltas-provisional.jsonl` (full, 89 lines incl. the
  `auto-dash-r45` radial-label-margin delta that this round independently reproduces — see
  §6)
- `vault/00-principles/curation-criteria.md` — including the explicit 3-way-tie tie-break
  rule used in §4 below ("주간 반증 판정 기준" ②)
- `vault/20-catalog/charts.catalog.md`, `colors.catalog.md`, `motion.catalog.md` (full)
- `vault/30-ledger/auto-ledger.jsonl` — last 5 `dash` entries (r43 no-winner, r44 amber/
  grotesk, r45 indigo/wide, r46 sky/mono, r47 emerald/grotesk) — none of those 4 accent/face
  combinations reused this round
- `node scripts/catalog-variety.mjs` — accent/theme/face distribution (same read as round 1,
  still current: amber 8 · teal 8 most-used accents; pretendard(none) 29 most-used face)
- Dedup: `/dash` gallery category names + `dash-evolve/` accumulated run directories (not
  opened individually, per the skill's own `auto-landing-r11` lesson about designer budget;
  macro-shell/chart-type avoidance judged from the ledger's own inline summaries read above
  plus `reassign-queue.md`'s archive, both already loaded this session)

## 2. GENERATE

Three candidates, three different dash-brief-v3 §추가학습 macro archetypes, three different
chart types from `charts.catalog.md`, none repeating the last 4 winners' accent/face:

- **a — "Pulseboard"**: board/grid-centric, Bullet-style value+target+sparkline cards (SLA/
  uptime ops console). Selection fans into 2 widgets (Inspector + table highlight) — the
  brief's middle fan-out tier. light/rose-600/none.
- **b — "Rundate"**: calendar/board-centric, a month-grid heatmap of publishing activity +
  day-detail sync + sortable upcoming-posts table. dark/blue-400·600/wide.
- **c — "Vantage"**: master-detail, a 5-axis Radar chart (per `charts.catalog.md`'s 2–3
  dataset / 5–8 axis guidance) with a redundant always-visible value list, plus an
  *independently-scoped* compare-overlay mechanic (per-row checkboxes, up to 2) — the
  brief's own named **top** fan-out tier ("다축 독립 스코프"). light/violet-600/mono.

Freeze hash (after the 1-fix round below, before capture/judging):
`cat app/src/app/dash-evolve/r48/*/*.tsx | shasum` → `75d60e11e7c9497d69da6daaa2a717436c594915`.
Unchanged through capture and judging.

## 3. HARD GATE

See `SCORES.md` for the full table and both fix write-ups. **a and b each used their one
allowed 1-fix** (a: hydration mismatch from nested interactive buttons + misplaced
`aria-sort` + 2 contrast/target-size a11y failures; b: an unused variable + 2 a11y failures
from a background-color-encodes-intensity pattern and a competing custom `aria-label`).
**c passed clean on the first attempt.** All three re-gated/gated 10/10, a11y 100/100/100.
§3-1 not invoked for any candidate — no violation was discovered *after* judging; both fixes
above happened *before* judging, inside the normal §3 1-fix loop.

## 4. JUDGE (self-judged — see §0; not a valid blind panel)

Frames reviewed per candidate: `<v>-1440.png`, `<v>-390.png` (2 of 16 captured per
candidate — fewer than round 1's 3-frame budget, a deliberate time-budget reduction for this
second round, disclosed here). Unreviewed: 1280px, 1920px, and all non-zero scroll depths
for all three. `sweep` confirmed zero overflow mechanically at 1280–1920px + 390px for all
three; this is not a visual review. Two real findings were made from just these 2 frames per
candidate by cross-reading them against each other and against source (not from a wider
frame set) — see `SCORES.md` "Self-discovered findings".

### Lens 1 — brief compliance (dash-brief-v3 + page-brief-core + page-brief-repo)

Ranking: **c > a > b**.

- **c, 1st**: reaches dash-brief-v3's own explicitly-named **top** selection-fan-out tier
  ("다축 독립 스코프" — `page.tsx`'s `selectedId` drives the detail panel while `compareIds`
  independently drives the chart overlay, neither reads the other). Its one defect (clipped
  "Quality" label, `candidates/c.md`) is mitigated because the always-visible-value
  requirement is still met through the redundant text list below the chart — the brief's
  core requirement (never hover-only) is not actually violated, only a secondary rendering
  surface is.
- **a, 2nd**: zero defects, but its selection→sync reaches only the **middle** tier (single
  `selectedId` fanning into 2 widgets) per the brief's own tier hierarchy — correct and
  clean, not the strongest available structure.
- **b, 3rd — one real compliance violation**: the calendar cell's displayed post-count and
  the Day-detail panel's actual post list disagree for the same day (`candidates/b.md`,
  `SCORES.md` finding 1) — a direct violation of `dash-brief-v3`'s "데이터 … 합계 정합" clause.
  Not hard-gate-checkable, but exactly the kind of defect lens1 is supposed to catch.

### Lens 2 — commercial polish (Mercury/Monarch/Asana/n8n/Coinbase/Cycle bar)

Ranking: **a > c > b**.

- **a, 1st**: zero discovered defects, a tight and trustworthy numbers narrative (status
  color always matches the real target comparison; incident table and inspector panel stay
  in lockstep with the selected card). The 6-card grid is slightly repetitive next to a true
  hero moment, but matches a legitimate real-world status-page convention (Datadog/
  StatusPage-style), not a defect.
- **c, 2nd**: professional, SaaS-plausible compare-overlay feature; its one rough edge (the
  clipped SVG label) reads as a visible unfinished-polish signal on the page's primary
  visualization, even though the redundant text list beneath it means no number is actually
  unreadable.
- **b, 3rd**: the strongest *visual* presentation of the three (confident dark calendar
  heatmap), but the count-mismatch finding is a trust-breaking defect in a commercial sense
  — a reviewer who clicks into a day and sees a different number than the calendar just
  showed them will doubt every other number on the page. A visually stronger page with a
  numbers-integrity bug reads as *less* commercially ready than a plainer page with none.

### Lens 3 — archetype / visualization differentiation

Ranking: **b > c > a**.

- **b, 1st**: the specific device — a calendar-as-chart (per-day intensity bar, not a
  generic calendar app) feeding a day-detail sync, in an editorial-publishing domain — is
  not represented among this round's other two candidates and reads as the most structurally
  distinct shape of the three (a true calendar grid as the dominant visualization, not a
  card grid or a rail+pane split). Dash-brief-v3 §추가학습 names calendar/board-centric
  shells as explicitly underused.
- **c, 2nd**: Radar as a chart type has one earlier (losing) attempt in this catalog's
  history per the ledger entries read in §1, so it is not a first-of-catalog claim on chart
  type alone — but the independently-scoped compare-overlay mechanic is a genuinely
  differentiated *structural* execution on top of a familiar chart, which lens3 weighs
  as real novelty distinct from the chart-type axis.
- **a, 3rd**: a bullet-style metric-card grid is solid and brief-endorsed (`charts.catalog`
  explicitly recommends Bullet for 3+ KPIs), but structurally it is the closest of the three
  to the generic "grid of metric cards + table" shape dash-brief-v3 itself cautions against
  defaulting to — competent execution of a familiar shape, not a new one.

### Aggregate — genuine 3-way split, tie-break applied

First-place votes: **c — 1** (lens1), **a — 1** (lens2), **b — 1** (lens3). No lens shares a
first-place pick with another — this is `curation-criteria.md`'s documented "3파전 완전
동률" case, not a simple majority.

**Tie-break rule** (`curation-criteria.md`, "주간 반증 판정 기준" ②): *in a complete 3-way
tie, the brief-compliance lens's (lens1) pick wins by default, unless the archetype-
differentiation lens (lens3) explicitly ranked that same pick last — in which case exclude
it and re-apply lens1's top pick among the remainder.*

Checking the exception: lens1's pick is **c**. Does lens3 rank c last? Lens3's ranking is
`b > c > a` — **c is 2nd, not last** (a is last). The exception does not trigger.

**Winner: c ("Vantage")** — by the tie-break rule, not a plain majority vote. This is
disclosed explicitly because it is a different aggregation mechanism than round 1 used
(round 1 had a clean 2:1 majority; this round has none).

Because `self_judged:true`, this is **not eligible for `/dash-falsify` promotion**
regardless of this outcome — only the LEARN delta and refinement-gate promotion below are
live.

## 5. LEARN

```
node -e "import('./scripts/design-loop.mjs').then(m=>m.appendLedger({round:'auto-dash-r48',variant:'b',delta:'A dashboard widget that shows a derived/aggregate number for a time bucket (a calendar cell, a KPI tile, a summary row) must compute that number FROM the same underlying record set that any drill-down view for that same bucket also reads -- not from an independent formula or lookup table that merely looks plausible. auto-dash-r48/b (Rundate) rendered each calendar day cell\'s post-count badge from a fixed arithmetic placeholder (day*7+base*11)%6, while its own Day-detail panel (opened by clicking that same cell) correctly filtered the real POSTS array for that date -- the two numbers silently disagree on Oct 14 (cell: 1, detail panel: 2 real posts) because they were never the same computation. This is a dash-brief-v3 data-integrity violation (\"합계 정합\") that no hard gate measures (static/sweep/Lighthouse never cross-check two widgets\' numbers against each other), so it only surfaces when a judge reads a summary surface and its own drill-down side by side -- exactly the failure mode auto-dash-r42\'s CI/confidence-percentage delta already documented for a single chart, now reproduced across two separate widgets on the same page.',evidence:'self-judged lens1: a direct dash-brief-v3 data-integrity violation -- lens2: a reviewer who clicks into a day and sees a different number than the calendar just showed them will doubt every other number on the page.',judge_votes:{lens1:'c',lens2:'a',lens3:'b'},confidence:'low',level:'L1',status:'provisional'},'vault/00-principles/dash-deltas-provisional.jsonl'))"
```

`confidence: low` — single self-judged round, not independently reproduced, judging was not
blind (§0).

## 6. 지식 정제 게이트

Loaded `dash-deltas-provisional.jsonl` in full (§1, 89 lines / ~20 entries). Checked this
round's two findings against it for reproduction claims, per the mandatory "delta 본문이
재현을 주장하면 먼저 검증" rule:

**`auto-dash-r45`'s radial-label-margin delta is independently reproduced this round.** That
delta's own text explicitly generalizes to "any sunburst/donut/radar with peripheral node or
axis labels" — `auto-dash-r48/c`'s radar chart hit exactly that failure mode (top-axis label
clipped by the SVG `viewBox`, `candidates/c.md` §"자가 발견 결함" has the full geometry).
Verified independently (recomputed the label coordinates myself rather than taking the delta's
claim on faith): axis 0 at `-90°`, label radius `R+22=102`, `CY=100` → `y = 100 + 102·sin(-90°)
= -2`, confirmed negative and outside the `viewBox="0 0 220 210"` bound starting at `y=0`.
This is the same defect class (radial-margin-vs-longest-label) in a structurally different
chart instance (radar, not chord) from a different session — meeting the 2-reproduction bar
`curation-criteria.md`'s L2 checklist asks for.

```
node -e "
const fs=require('fs');
const path='vault/00-principles/dash-deltas-provisional.jsonl';
const ls=fs.readFileSync(path,'utf8').trim().split('\n').filter(Boolean).map(JSON.parse);
const orig=ls.find(e=>e.round==='auto-dash-r45'&&e.variant==='c');
const promoted={...orig, round:'auto-dash-r48', variant:'c', level:'L2', supersedes:'auto-dash-r45', status:'provisional',
  evidence: orig.evidence + ' | auto-dash-r48/c independent reproduction (self-judged): Quality-axis label at angle -90deg, label radius R+22=102, CY=100 -> y=-2, confirmed outside viewBox=\"0 0 220 210\" (y starts at 0). Second chart instance (radar, not chord), second session, same underlying geometry class the original delta named as its generalization target.'};
fs.appendFileSync(path, JSON.stringify(promoted)+'\n');
console.log('promoted');
"
```

No other conflicting pairs found. No new `questions-queue.md` entry — the r45→r48
reproduction resolves cleanly (confirms the existing delta rather than contradicting
anything), and this round's new L1 (§5) does not conflict with any existing entry (data-
integrity-across-widgets is a new axis, distinct from every existing dash delta read in
§1).

## 7. Record

- `auto-ledger.jsonl`: appended below, `self_judged:true`,
  `variety:{theme:"light",accent:"violet",face:"mono"}` (winner c).
- `vault/index.md` "세대 기록": `auto-dash-r48` entry added, noting this completes both of
  this scheduled session's two rounds.
- No reassign-queue item consumed (queue was empty) and none added — all three candidates
  passed the hard gate (after their one allowed 1-fix each for a/b), so none qualifies for
  reassignment (judging-stage/tie-break losses are not reassign-queue candidates, matching
  established precedent, e.g. `auto-dash-r41` archive entry #15's disposition note).
