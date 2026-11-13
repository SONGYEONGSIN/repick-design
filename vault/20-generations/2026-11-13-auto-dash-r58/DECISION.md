# DECISION — auto-dash-r58

## §0 Orchestration notes — **deviation disclosed first, per skill §0-0**

**This round is self-judged (`self_judged: true`).** This session's tool list (checked explicitly
at the start of this round, before RETRIEVE, per the top-level prompt's instruction to test
availability early) contains **no `Agent`/`Task`-style tool at all** — only `Artifact`, `Bash`,
`Edit`, `Glob`, `Grep`, `Read`, `Skill`, `Write`, `ToolSearch`, the `claude-code-remote` MCP tools,
and `SubagentHandback`. `ToolSearch` was queried for `"Agent"`, `"Task"`, `"ListAgents"`, and
general "spawn subagent" terms and returned no matching deferred tool in any case. This is not a
transient failure to dispatch — there is no dispatch mechanism present in this session's toolset to
even attempt.

This matches this exact scheduled session's **own round 1** precedent: `auto-landing-r53`
(committed as `6ce3855`, same date) hit the identical constraint and disclosed `self_judged: true`
for the same reason (there, framed as a fork's inability to spawn nested `Agent` calls; here, the
constraint is at the session level from the start — no `Agent` tool was ever present to test).
Both amount to the same operative fact the skill's §0-0 check cares about: **no independent,
blind multi-agent generation-and-judgment pipeline was available this round.**

The skill's own preference is to **stop rather than proceed** without that independence
("무효 산출물을 만드는 것보다 라운드를 거르는 것이 싸다"), but its documented fallback for "그래도
돌아버렸다면" — which the top-level prompt for this run explicitly directed me to follow rather
than guess — is: disclose the deviation here, set `self_judged: true` in the ledger entry, and let
`/dash-falsify` exclude this round from promotion candidates automatically while still reviewing
its delta. That is what this document does. **Treat the ranking below as informative, not
promotion-eligible** — exactly the disposition `auto-landing-r53` used for the same reason.

**A self-judging-specific risk, stated plainly rather than left implicit**: all three candidates,
and the judging below, were authored by the same orchestrator in one continuous session. Candidate
c was built last, after candidate a's hard-gate failures (an absolutely-positioned tooltip
inflating `scrollWidth`; a dark-surface text-color floor violation) and candidate b's hard-gate
failure (a solid-fill contrast miss) had already been found and fixed — so c benefited from both
lessons from the start and passed its first gate attempt cleanly. That is a real, traceable reason
(not fabricated) for c reading as the most "finished" of the three, but it is also exactly the kind
of correlated advantage true blind-and-independent judging is designed to prevent one candidate
from accumulating. The ranking below is reasoned honestly from the live pages and gate evidence,
not rubber-stamped, but this structural asymmetry is a real limitation of self-judging that a
reader should weigh — which is precisely why this round cannot be promotion-eligible.

**Round budget**: `node scripts/round-budget.mjs "2"` → **N=1**
(`미채움 0종 — N≥2 의 근거(커버리지)가 없다` — all 18 `PAGE_TYPES` already have at least one
catalog entry). The orchestrating prompt requested 2 consecutive rounds for this scheduled
session; per the skill's own rule, only **this one round** runs, and this is session round **2 of
2** (round 1 was `auto-landing-r53`, already committed to `evolve/dash` as `6ce3855` before this
round began). This is the skill's documented, intended behavior given today's queue state, not a
shortfall.

**Native weekly cadence**: 2026-11-13 is UTC Friday (`getUTCDay()===5`), not Monday — the native
forced-cadence rule does not apply.

**Target selection**: `app/src/lib/works.ts`'s `PAGE_TYPES` (18 entries) checked against existing
`category:"<type>"` usages — zero unfilled types. Target fell through to the `[dash, landing,
native]` uniform-random branch; `landing` was excluded because this session's round 1 already drew
it, leaving `{dash, native}`, which landed on **dash**. Round number: max existing `auto-dash-r*`
in the ledger was 57 → this round is **r58**.

**Reassign queue**: `vault/00-principles/reassign-queue.md` "대기 중" section read in full —
confirmed empty for `target:dash` (*"현재 대기 중인 항목 없음 — target:dash·target:landing 모두
큐가 비어 있다"*). No reassignment candidate consumed; all 3 candidates are free exploration.

**Environment bootstrap** (session-specific, logged here per the top-level prompt's instruction,
not a SKILL.md procedure): root `npm install` and `app/ npm install` were already done per the
prompt's own stated facts. `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium-1228/chrome-linux64/chrome`
worked immediately for `gate.mjs`, `capture-shots.mjs`, and ad-hoc `playwright-core` scripts used
during judging — no `npx playwright install` attempt was needed this round since the pre-built
binary's path was already known. `CHROME_PATH=/usr/bin/google-chrome` was already set for direct
Lighthouse debugging (used once, to pin down a `color-contrast` audit's exact failing node for
candidate b). Dev server was not running at round start; started fresh (`next dev -p 3100`),
confirmed `200` on `/` before gating. No `.next` cache corruption was observed.

## §1 RETRIEVE

Read in full: `dash-brief-v3.md` (BRIEF), `page-brief-core.md`, `page-brief-repo.md`,
`curation-criteria.md` (full — all accumulated Q-judgments), `reassign-queue.md` (empty for dash),
and the tail of `dash-deltas-provisional.jsonl` (most recent entries, including the `r57/c`
truncate-blockification delta and the `r56` 1-fix-chain L2 promotion). Checked the last 7
`auto-dash-r*` ledger entries (r51–r57) for recent winners' theme/accent/face and, more
importantly, their macro skeletons, to build this round's banned-bucket list:

- `r51/a` Inboxline (hero + single stream-graph), `r52` (not dash), `r53/a` Outpost (unrecorded
  macro in this read but confirmed distinct), `r54/c` Strata (treemap + stacked column), `r55`
  no-winner (Gantt dock-timeline / master-detail + box-plot / rail-less ticker + slope chart — all
  3 hard-gate-dropped), `r56/a` Arbor (rail-less ticker + slope chart, reassigned from r55/c),
  `r56/c` Nodewatch (network-dependency graph), `r57/a` reassigned Ridgehaul (box-plot + feed),
  `r57/c` Trestle (hero + single dominant process-map chart).

**Banned macro skeletons for this round** (derived from the above): Gantt/dock-timeline, box-plot
(any pairing), rail-less ticker + slope chart, treemap, network-dependency graph, process-map
hero-chart, kanban board (seen as a non-winning candidate in r54), sunburst master-detail (r57/b
Outlay). None of these appear in any of this round's three candidates.

`node scripts/catalog-variety.mjs` run for the full-catalog distribution (65 works): theme dark
36/light 29; accent amber 8/teal 8 (joint most-saturated), violet-hex 7, blue/indigo 6,
cyan/emerald/rose/sky 5 each, orange/violet 3, lime 2, green/blue-hex 1 each; face pretendard
29/mono 13/grotesk 12/wide 11. Last 3 *real* dash winners (chronological): `r54/c` Strata
(light/rose/grotesk), `r56/a` Arbor (light/lime/none-Pretendard), `r57/c` Trestle
(dark/violet/mono) — no two consecutive identical values on any axis, so no catalog-variety ban
fired automatically. This round additionally avoided amber/teal (catalog's two most-saturated
accents) and spread the three whitelisted display faces one-per-candidate (grotesk is used twice
— by the catalog's own established deliberate-repeat allowance when 3 candidates and 3 choices
don't force a strict 1:1 — see below).

**Duplicate-avoidance summary** (gallery `/dash` registered works + accumulated evolve
archetypes, names + one-line shape only, per the skill's explicit instruction not to open their
full sources): Waypoint/Slotted/Conduit/Meridian/Keel (early app-shell archetypes) · Crewline
(calendar-first dispatch board) · Harborline/Floorline/Redoubt/Cadence/Parhelion/Trussline/Vela
(master-detail and selection-sync variations) · Portlane/Portage (logistics 3-pane and
hub-and-spoke) · Ledgerline×3/Verdant/Hopline (commissioned finance dashboards) · the recent-round
list above. None of this round's three candidates reuse a registered name or an already-catalogued
input×output combination (checked individually below under each candidate and under Lens 3).

## §2 GENERATE

**No `Agent` tool available this round (see §0) — all 3 candidates were authored directly by this
orchestrating session**, not by independent designer subagents. Each was assigned a distinct
macro skeleton (none from the banned list above, none shared with each other), a distinct
accent hue (avoiding the catalog's two most-saturated), and a distinct display face:

- **a — "Grainhouse"** (production-studio equipment/room booking ops console). Macro skeleton:
  **calendar/board-centric** (`dash-brief-v3`'s explicitly-encouraged, recently-unused bucket) — a
  resource-by-hour availability table for one selected day (day switcher, resource-type filter),
  not a literal 7-day grid. Dark / indigo / `--font-display-wide`. 5 interactions (≥4 required):
  hover/focus-preview status line, click-to-select with 3 independently-scoped widget reactions
  (KPI swap + detail panel + table-row highlight), resource-type filter, day selector, ⌘K palette.
- **b — "Signalwatch"** (security/reliability incident-response console). Macro skeleton:
  **feed-centric** (also explicitly-encouraged, also unused in r51–r57) — a central chronological
  incident feed, not a chart, with a severity-filter rail and a pinnable inspector. Light / emerald
  / `--font-display-grotesk`. 5 interactions: severity-filter checkboxes, click-to-pin (feed
  highlight + inspector + KPI swap), sort toggle (real re-sort), hover/focus sparkline bucket,
  ⌘K palette.
- **c — "Pulseband"** (API reliability / latency-monitoring console). Macro skeleton: **hero +
  single dominant visualization** — a latency-distribution histogram (a chart type new to this
  catalog; box plot, slope chart, treemap, sunburst, network graph, candlestick, waterfall, funnel
  and choropleth have all appeared before, a frequency histogram has not) with permanently-visible
  p50/p95/p99 markers, directly applying `dash-brief-v3`'s named "단일 지배 시각화 완성도" rule.
  Dark / rose / `--font-display-mono`. 5 interactions: hover/focus histogram bar, period toggle
  (1h/24h/7d, real data swap across chart + 3 KPI tiles + percentile readout), click an endpoint
  row to annotate (not replace) the aggregate histogram with a reference line + swap the 4th KPI
  tile, sortable endpoint table (`aria-sort`), ⌘K palette.

Full per-candidate concepts and "브리프에 없던 것" reports (written honestly as part of
authoring, including cross-candidate lesson transfer within this one session — disclosed, not
hidden):
`candidates/a.md`, `candidates/b.md`, `candidates/c.md`.

**Freeze hash** (concatenated sources, a+b+c; the round's first freeze, before a late visual-only
fix to candidate a's KPI delta sign display found during screenshot review, was
`5e51db03d4bfd4eaf4ac97a61f6def8c137c52df` — superseded before any screenshot was captured for
judging):

```
4ec0be9e61e7ceb0bb9e8a629a48c0335d023fad
```

Verified unchanged from this point through the final gate run, through screenshot capture, and
through the interactive-state verification below.

## §3 HARD GATE

Full results and the issues found/fixed before freeze: `SCORES.md`. Summary of the **final**
state (all three 10/10 clean):

| Candidate | route | types | static | lint | weights | sweep | focus | console | a11y | perf |
|---|---|---|---|---|---|---|---|---|---|---|
| a Grainhouse | ✅ | ✅ | ✅ | ✅ | ✅ 3 | ✅ 0 | ✅ 0 | ✅ 0 | ✅ 100 | ✅ 96 |
| b Signalwatch | ✅ | ✅ | ✅ | ✅ | ✅ 3 | ✅ 0 | ✅ 0 | ✅ 0 | ✅ 100 | ✅ 95 |
| c Pulseband | ✅ | ✅ | ✅ | ✅ | ✅ 3 | ✅ 0 | ✅ 0 | ✅ 0 | ✅ 100 | ✅ 97 |

Because there was no separate designer round to hand a correction back to, the three bugs found
during this orchestrator's own first gate pass (detailed in `SCORES.md`) were fixed **before**
this freeze, not treated as a post-freeze "1-fix" — there was never a failing frozen state that
went to judging. The most load-bearing of the three is worth restating here because it is this
round's §5 delta candidate: an absolutely-positioned per-cell tooltip in candidate a's
`ScheduleGrid.tsx`, even at `opacity:0` and with no `sr-only`/clipping involved at all, inflated
its enclosing `<table>`'s `scrollWidth` past its `table-fixed`+`colgroup%` budget at five desktop
widths — confirmed by direct Playwright measurement (`td.scrollWidth` 91–143px against a
`td` width of 61.9px, with the discrepancy traced to the tooltip child, not the button). Fixed by
removing all per-cell floating tooltips in favor of one shared `aria-live` status line — applied
pre-emptively to candidates b and c from the start.

## §3-1 Post-judgment fixes

None. No rule violation was found against the winner (c) by any lens below — only judgment-stage,
non-rule commentary. (All fixes described in §3/`SCORES.md` happened before judging, not after.)

## §4 JUDGE — self-judged 3-lens panel (see §0 disclosure)

Screenshots: full 16-frame capture per desktop width tested (1280/1440/1920 + 390, each at 4
scroll depths where the page is tall enough to scroll) via `capture-shots.mjs`, **0 blanks, 0
errors**, confirmed in each run's own output. Candidate c's desktop views did not scroll (the page
fits in one viewport at 1280+), so only its 390px mobile view has scroll-depth variants — expected,
not a capture gap. Frames actually reviewed for this judgment (3–4 per candidate, per the skill's
frame-budget guidance): `<v>-1440.png` (scroll 0), `<v>-1920.png`, `<v>-390.png`, plus
`a-1440-s100.png` (bookings-table tail) and `a-1440-s100`'s neighbors were used to confirm no
desktop scroll artifacts.

**Beyond static screenshots**, one interactive state per candidate was verified with a live,
scripted Playwright click (not just source-reading) to confirm the selection-sync interaction
actually fires as designed, not only that the code compiles: clicking a booked cell in a's
schedule grid, a feed card in b, and an endpoint row in c. All three produced exactly the
designed, scoped reaction — screenshots at `/tmp/a-interact.png`, `/tmp/b-interact.png`,
`/tmp/c-interact.png` (not published to the vault, ephemeral verification artifacts; the
behavior they confirm is summarized per-candidate below).

**Self-disclosed unseen scope**: 1280/1366/1600/1664/1680/1904px intermediate widths were covered
by the hard gate's own sweep (`sweep` passed 0 overflow at all of them) but not individually
eyeballed here — only 1280/1440/1920/390 were. The command palette's open state and the mobile
drawer nav were verified by source reading and the gate's `focus` check (which does open the
palette and tab through it), not by a dedicated screenshot in this judging pass. One cosmetic,
unscored observation: the sidebar avatar photo (`next/image`, a real Unsplash ID) rendered
correctly in every `capture-shots.mjs` frame reviewed, but failed to load in the ad-hoc
interactive-verification script's fresh page loads for a and b (showing the initials fallback
circle instead) — most likely a transient network/timing artifact of that one-off script
launching three fresh browser contexts back-to-back, not a reproduction in the gate's own
screenshot run; not treated as a defect against any candidate.

### Lens 1 — brief/DNA compliance

**Ranking: c › a › b.**

- **Component-system checklist** (`dash-brief-v3.md` §완성도 기준 names: "Card, 정렬 가능한 데이터
  테이블(…aria-sort), 탭, 세그먼트 컨트롤, 드롭다운/팝오버, 배지, 프로그레스, 스파크라인"). a has
  two literal `<table>`s with `aria-sort` (the schedule grid's row headers plus the bookings
  table). c has one (`EndpointTable.tsx`, `aria-sort` on 4 columns, confirmed sortable by the live
  interaction test). **b has no literal `<table>` anywhere** — its "sortable" affordance (Newest /
  Severity) re-orders a list of cards, not a data table. This is a real, citable, differentiating
  compliance gap specific to b (a and c both satisfy the named component unambiguously); none of
  the three has a literal progress-bar or a true dropdown/popover menu, which is shared across all
  three and therefore non-differentiating (`curation-criteria.md`'s own "모든 후보가 어기는 규칙은
  루프가 강제하지 않는 규칙이다" — not applied here as a free pass, just noted as uninformative for
  ranking).
- **"단일 지배 시각화 완성도"** (`dash-brief-v3.md`, named rule, L3, reproduced r7/r9/r10): this
  rule only applies to a candidate whose *archetype has* a dominant chart. a (table-grid-dominant)
  and b (feed-dominant) don't have one, so the rule is structurally inapplicable to them — neither
  helped nor hurt. c does, and satisfies it about as literally as the rule can be satisfied:
  p50/p95/p99 are rendered as permanent text (`LatencyHistogram.tsx:54-75`) beside, not inside, the
  interactive SVG, confirmed unchanged in both the hover and the endpoint-focused interactive
  states captured above.
- **Grid-craft / overflow discipline**: all three pass `sweep` with 0 violations at every tested
  width including the 16px-margin check; a's own history this round (the tooltip-overflow bug)
  shows the discipline was earned through a real failure-and-fix, not accidental.
- **Theme authenticity**: a and c are dark ("진짜 다크" — zinc/slate-950 base, white/10 borders, no
  theatrical glow); b is light ("진짜 라이트" — white canvas, zinc-200 borders, no cream/paper
  tint). All three pass this cleanly.
- Net: c and a are both essentially clean; c edges ahead on the one named, hard-won rule (단일
  지배 시각화) that specifically applies to it and that it satisfies unusually literally; b trails
  due to the missing sortable-table component.

### Lens 2 — commercial completeness (Mercury/Asana/n8n/Coinbase-grade)

**Ranking: c › a › b.**

- **c (Pulseband)**: the histogram + always-visible percentile block + sortable endpoint table is
  an extremely recognizable, mature convention for this exact product category (Datadog/Grafana/
  New Relic-style APM). The live interaction test confirmed the endpoint-focus annotation (dashed
  reference line + dot on the correct bin + KPI swap + row highlight) fires correctly and reads as
  a genuinely useful "where does this endpoint sit in the overall distribution" feature, not a
  decorative toggle.
- **a (Grainhouse)**: reads as a convincing, complete booking-ops product (Resource Guru /
  Calendly-adjacent). The verified interaction (cell click → detail panel + KPI swap + table
  highlight, confirmed live) is clean and the empty state ("No slot selected") is a small but real
  completeness touch. The utilization ring is a nice domain-appropriate device.
- **b (Signalwatch)**: also very polished execution (severity rail + feed + inspector is a
  recognizable PagerDuty/Opsgenie-adjacent pattern, and the pin interaction was confirmed live:
  feed highlight + inspector populate + KPI-tile swap, all correctly scoped). It loses a notch
  here for the same reason as Lens 1 — a feed of cards, however well executed, reads as a thinner
  "data surface" than a's or c's literal sortable table sitting alongside their other widgets; the
  enterprise-dashboard convention this brief is calibrated against (Mercury/Asana/Coinbase) tends
  to pair a primary surface with at least one real tabular data view, which b's console is the
  only one of the three to omit entirely.

### Lens 3 — archetype/structural differentiation

**Ranking: a › c › b.**

- **a**: calendar/board-centric is a macro bucket named in the brief but **not used by any of the
  last 7 dash rounds** (r51–r57, enumerated in §1). Within that bucket, the specific combination —
  single-day resource×hour grid with a day switcher (not a literal week view), 3-way split
  selection sync (KPI/detail/table-highlight, none of them a full re-render) — does not match any
  registered `/dash` work either; the closest named precedent, `d46` Crewline, is a drag-based
  calendar-plus-board hybrid with a fundamentally different interaction model (drag-to-reschedule
  vs. click-to-inspect). Domain (studio/equipment booking) is new to the catalog.
- **c**: the hero-plus-single-chart macro *bucket* has two recent siblings (`r55` no-winner, `r57`
  Trestle), so the bucket itself is not fresh — but the realization is: a frequency histogram is a
  chart type new to this catalog (box plot, slope, treemap, sunburst, network graph, candlestick,
  waterfall, funnel, choropleth have all appeared; a binned-count histogram has not), and the
  selection-sync mechanism (annotate the existing aggregate with a reference marker, rather than
  recompute or partially recompute it) is a narrower, more minimal point on `dash-brief-v3`'s own
  documented sync-axis spectrum (전면 재계산 < 단일 축 부분 재계산 < 다축 독립 스코프) than any of
  those three named points — it doesn't swap data at all, only overlays a derived annotation.
  Domain (API latency/SRE) is new to the catalog.
- **b**: domain (SOC/incident response) is new to the catalog, but the underlying shape — a
  list/feed with a pinnable detail inspector, selection scoped to inspector + one KPI tile — is
  the least distinct of the three from this catalog's own history of master-detail-with-pin
  entries (Harborline, Floorline, Redoubt, and others share the same "select → persistent pin +
  inspector" skeleton, just rendered as a table row instead of a feed card). Rendering the list as
  a chronological feed rather than a table is a real but modest surface variation on an
  already-common catalog pattern, not a new input×output combination under
  `curation-criteria.md`'s own "Q6 판정" test.
- Net: a is the freshest at both the macro-bucket and the combination level; c is fresh in
  realization but shares its macro bucket with two recent rounds; b is the least differentiated of
  the three.

### Aggregation — 2:1 ordinary majority, no tie-break needed

| | lens1 | lens2 | lens3 |
|---|---|---|---|
| 1st | c | c | a |
| 2nd | a | a | c |
| 3rd | b | b | b |

Two lenses (1 and 2) independently placed **c** first; lens 3 placed **a** first but ranked **c**
second, not last — so this is an ordinary 2:1 majority (`curation-criteria.md`'s Q32 disposition:
"2:1이 정상 결과다"), not a complete three-way split and not a case where the tie-break exception
(lens3-ranks-the-leader-last) applies. **b is ranked last by all three lenses (3:0)** — a
consistent, non-arbitrary signal, not a coin-flip artifact.

**Informative winner: c ("Pulseband").** No rule violation was cited against it by any lens — only
the DNA-match-quality and differentiation-nuance commentary above. §3-1 is not invoked.

**Per this round's §0 disclosure, this outcome is not promotion-eligible** — `/dash-falsify`
should treat this round's candidates as excluded from the keep/promote decision and review only
the delta below.

## §5 LEARN — isolated append

```
node -e "import('./scripts/design-loop.mjs').then(m=>m.appendLedger({round:'auto-dash-r58',variant:'a',delta:'An absolutely-positioned per-cell element (e.g. a hover tooltip), even fully invisible via opacity:0 and with no sr-only/clipping involved at all, still contributes its full un-clipped layout box to its nearest non-clipping table/row ancestor\'s scrollWidth in Chromium -- this can silently break a correctly-sized table-fixed+colgroup% layout\'s desktop width budget (sweep table-overflow) even though every column percentage is computed correctly... [full text in dash-deltas-provisional.jsonl]',evidence:'Direct Playwright measurement: td.scrollWidth 91-143px vs clientWidth 61.9px, traced to the tooltip child not the button.',judge_votes:{lens1:'c',lens2:'c',lens3:'a'},confidence:'high',level:'L1',status:'provisional'},'vault/00-principles/dash-deltas-provisional.jsonl'))"
```

(Run and appended already; the exact text above is abbreviated for this record — the live entry in
`dash-deltas-provisional.jsonl` carries the full delta and evidence text, reproduced in full in
§3's hard-gate narrative above.)

Confidence `high`, not `medium`: this is not an inference from judge prose but a directly
*measured* DOM mechanism (Playwright `scrollWidth`/`clientWidth` readings before and after the
fix), the same evidentiary bar `curation-criteria.md`'s own "계측을 만들 때는 계측 자신을
반증해야 한다" principle asks for. Level `L1`, not `L2`: although two sibling candidates in this
same round avoided the bug by applying the fix pre-emptively, that is within-round transfer by the
same author, not independent reproduction across separate rounds — the L2 bar
(`curation-criteria.md`'s checklist: "2개 라운드 이상 재현되었거나 하드게이트로 기계 검증 가능")
is not met by a single round's internal consistency alone, and no automated gate currently checks
for this specific mechanism (sweep's `table-overflow`/`page-overflow` would catch an *instance* of
the symptom, but doesn't diagnose this specific cause).

## §6 Refinement gate

Loaded `dash-deltas-provisional.jsonl` in full (99 lines before this round's append) and
re-checked `curation-criteria.md`'s level checklist and its accumulated Q-judgments for any
existing delta this round's new entry might cluster with, conflict with, or wrongly claim to
extend.

**Searched specifically** for prior entries mentioning `tooltip`, `opacity`, or `scrollWidth`
pollution mechanisms — none found beyond the already-known, already-promoted (`dash-brief-v3.md`
grid-craft section, L2) **sr-only anchor** rule. That rule and this round's new delta share an
*effect* (an invisible element inflating an ancestor's `scrollWidth`) but not a *mechanism*: the
sr-only rule requires a missing `position:relative` ancestor letting a *clipped* element's
containing block escape its clipping container; this round's bug has no `sr-only` element and no
clipping container anywhere in the picture — a plain `opacity:0` absolutely-positioned sibling is
sufficient on its own. Per `curation-criteria.md`'s own "재현 판정은 결함 클래스로 한다" and "Q21
판정" guidance (don't conflate two things that only share a symptom), this round's delta does
**not** claim `supersedes` and is **not** filed as a reproduction of the sr-only rule — it is
logged as its own, separate L1 entry, with the relationship to the sr-only rule stated explicitly
in its own text (satisfying the organizational "관련 노트로의 링크 1개 이상" requirement via prose
reference rather than a formal `［［link］］`, since `dash-brief-v3.md` is read-only canon and this
delta file doesn't use wiki-link syntax elsewhere).

**No level promotion**: no existing delta makes a matching reproduction claim across rounds, and
the checklist's L2 bar (2+ round reproduction, or machine-verifiable) is not met by a same-round,
same-author fix transfer alone — see the confidence/level rationale in §5. Stays **L1,
provisional**.

**No `questions-queue.md` entry.** Neither of this round's two §6 trigger conditions applies: ①
no conflicting delta pair was found (the sr-only-rule comparison above resolved cleanly, in this
round's own analysis, as "related but distinct" rather than leaving an open contradiction); ② the
new delta is fully justified by existing meta-criteria (the mechanism-vs-symptom distinction is
exactly `curation-criteria.md`'s own already-settled "재현 판정은 결함 클래스로 한다" principle
applied to a new case, not a case that principle can't resolve).

## §7 Record + commit

Ledger entry appended to `vault/30-ledger/auto-ledger.jsonl`:
`target:'dash', round:'auto-dash-r58', date:'2026-11-13', winner:'c', no_winner:false,
hardgate:{static, sweep, lighthouse}, judges:{lens1:'c', lens2:'c', lens3:'a'}, refuted:null,
variety:{theme:'dark', accent:'rose', face:'mono'} (winner c's axes, per
`catalog-variety.mjs`'s `readWork` convention), self_judged:true`. Because `self_judged:true`,
`/dash-falsify` should exclude this round from promotion/keep decisions per the skill's own
documented disposition for this flag, and review only the §5 delta.

`vault/index.md` "세대 기록" section gets a new bullet:
`[[20-generations/2026-11-13-auto-dash-r58/DECISION|auto-dash-r58]]`.

**Canon unchanged**: `dash-brief-v3.md`, `design-principles.md`, `page-brief-core.md`,
`page-brief-repo.md`, all `brief-*.md` type profiles, the `/dash` gallery routes, and `/v1`–`/v5`
were never opened for writing this round (confirmed via `git diff` before commit, see final
report). `reassign-queue.md` was read but not written (nothing to archive — no item was consumed
this round). `questions-queue.md` was not written (§6 found no trigger condition). jsonl files
(`dash-deltas-provisional.jsonl`, `auto-ledger.jsonl`) are append-only — verified via `git diff`
showing only `+` lines on those two files before commit.

This is **round 2 of 2** for this scheduled session (round 1 = `auto-landing-r53`, already
committed and pushed as `6ce3855`). No further round follows from this invocation.
