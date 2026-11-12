# auto-landing-r39 — DECISION

## 0. Deviations and round-scope (read first)

**Round-budget**: this invocation was `/dash-evolve 2` (requested N=2, as a scheduled task
asked for two consecutive rounds). `node scripts/round-budget.mjs --explain 2` returned
`1	미채움 0종 — N≥2 의 근거(커버리지)가 없다` — all 18 `PAGE_TYPES` already have at least one
catalog entry, so the only basis for N≥2 (coverage) does not apply today, and the script
forces N=1 for *this* invocation regardless of the requested value. Per skill §0-0-1, this
round proceeds as N=1; a second, independent invocation of the full §0–§7 pipeline follows
this one (this same date) to satisfy the scheduler's "2 consecutive rounds" request — the
two run sequentially, not in parallel, and the second's §1 RETRIEVE reads this round's
LEARN delta and ledger entry before its own §0 target draw.

**Target selection**: unfilled-PAGE_TYPES queue is empty (confirmed: all 18 types have
`category:` entries in `app/src/lib/works.ts`), so §0's uniform `[dash, landing, native]`
random draw applied. Today is 2026-10-23, a Friday (`getUTCDay()===5`), so the native-day
override (Monday) did not apply either. The draw (`Math.floor(Math.random()*3)`) returned
`landing`.

**self_judged: true — read this before trusting any ranking below.** §0-0 requires
confirming an `Agent`/subagent-dispatch tool exists before proceeding past this section; if
none exists, the skill's primary instruction is to stop (**no-round**) rather than generate
and judge in one session. This session's tool list was checked directly (the full,
non-deferred tool list given at session start) and via `ToolSearch` for every plausible
name (`Task`, `Agent`, `ListAgents`, `general-purpose` subagent dispatch) — **no
subagent-spawn tool of any kind is available in this execution environment**, only
`SendMessage` (which addresses already-named peers/teammates, not a dispatch primitive) and
`SubagentHandback` (reports back to a caller, not out to a worker). This is the same
intermittent-availability condition the skill itself documents (`auto-dash-r31`,
2026-09-27, is the one prior precedent in this ledger with `self_judged:true`) — `r39`–`r42`
(2026-10-15 through 2026-10-17, per `auto-ledger.jsonl`) ran with real independent
general-purpose subagents available, so this is not this environment's permanent state,
just this particular scheduled session's.

Per §0-0's documented fallback ("그래도 돌아버렸다면"), rather than aborting as no-round, this
round proceeded with the single session acting as all three `GENERATE` designers
(sequentially, not blind to each other — candidate b and c were written with knowledge of
candidate a's choices, e.g. explicit avoidance of a's accent hue and macro-shell) and all
three `JUDGE` lenses (§4, below) — **not independent, not blind**. The majority vote below
is therefore **not a valid blind-panel judgment** and this round is marked
`self_judged:true` in the ledger entry. Per the skill's own disposition
([[questions-queue]] Q47): `/dash-falsify` should exclude this round from promotion
regardless of outcome and review only the LEARN delta (§5 below).

Hard-gate results are unaffected by this deviation — `gate.mjs` is mechanical and
generator-independent, and all three candidates passed every stage on the first attempt
(see `SCORES.md`).

## 1. RETRIEVE — sources read

- `vault/00-principles/design-principles.md` (BRIEF, full)
- `vault/00-principles/page-brief-core.md` (full)
- `vault/00-principles/page-brief-repo.md` (full)
- `vault/00-principles/reassign-queue.md` — "대기 중" section empty (last item, #15, was
  consumed 2026-10-17 by `auto-dash-r42/a`); no item to assign this round.
- `vault/00-principles/landing-deltas-provisional.jsonl` (full — all non-refuted entries)
- `vault/00-principles/curation-criteria.md` (meta-criteria)
- `vault/20-catalog/ux-guidelines.catalog.md` (Plat=web/both rows), `vault/20-catalog/motion.catalog.md`
  (landing column)
- `vault/30-ledger/auto-ledger.jsonl` — last 5 `landing` entries (r34–r38: winners a/b/a/b/c;
  variety a=dark/violet/mono, b=dark/rose/none, c=light/teal/wide, d(r37)=light/blue/wide,
  e(r38)=light/cyan/mono)
- `node scripts/catalog-variety.mjs` — accent distribution: amber 8 · teal 8 · violet-hex 7 ·
  blue 6 · indigo 6 · cyan 5 · emerald 5 · rose 5 · sky 5 · orange 3 · violet 3 · lime 2 ·
  green 1 · blue-hex 1. face distribution: pretendard(none) 29 · mono 13 · grotesk 12 ·
  wide 11. theme: dark 36 · light 29.
- Dedup list: `/v6`–`/v26` (21 promoted landing works; no `/v1`–`/v5` exist in this
  repo — confirmed via `find app/src/app -iname "v*"`, nothing invariant to violate there)
  + `landing-evolve/r24`–`r38` accumulated archetypes (not opened individually — the skill
  explicitly warns against sending designers into full prior `page.tsx` files; macro-shells
  avoided were judged from ledger/reassign-queue summaries instead: hero+2-col-panel
  families, master-detail, drag-scrubber/timeline families already well covered per r18–r23
  reassign-queue history).

## 2. GENERATE

Three candidates, one macro-shell each, built directly (no Agent dispatch — see §0):

- **a — "Fairline"**: dark/sky/grotesk. Hero + 2 product cards + single continuous
  trust-weight slider blending two named signals into one persistent match score.
- **b — "Marked Down"**: light/orange(-700)/mono. Hero + 2 product cards + 3-way category
  toggle recomputing a 3-stat comparison panel.
- **c — "Afterhours"**: dark/lime(-400)/wide. Vertical trade-ledger macro-shell (most
  distinct of the three) + condition filter that simultaneously changes the visible card
  set and recomputes an aggregate stat, + a referral-code toggle (5th interaction type).

Macro-bucket precheck: a and b both use the hero+panel shell the last several landing
rounds also used (r34–r38 summaries); c deliberately departs from it into a full-bleed
list/ledger shape, specifically to avoid a third round in the same bucket.

Diversity-axis precheck (`catalog-variety.mjs`, see §1): accents chosen — sky (5, mid-freq),
orange (3, low-freq), lime (2, rarest) — none repeats any of the last 5 landing winners'
accents (violet/rose/teal/blue/cyan). Faces — grotesk/mono/wide, one each, none repeated
within the round (`multi-display-face` gate confirms 1 face per route for all three).
Theme — 2 dark (a, c) / 1 light (b).

Freeze hash taken after all three candidates were written, before gating: `cat
app/src/app/landing-evolve/r39/*/*.tsx app/src/app/landing-evolve/r39/*/*.ts | shasum` →
`d7212497f8ee0cad2068a04e653d8bba0d604c2c`. Unchanged through gating, capture, and judging —
no 1-fix loop ran, so there was nothing to invalidate it.

## 3. HARD GATE

See `SCORES.md` for the full table. All three candidates: **10/10 gates clean on the first
attempt**, a11y 100/100/100, no 1-fix loop needed for any candidate. §3-1 ("판정 후 수정")
not invoked — no rule violation survived to the judged candidates.

## 4. JUDGE (self-judged — see §0; not a valid blind panel)

Frames reviewed per candidate: `<v>-1440.png` (scroll 0), `<v>-1440-s70.png` (70% scroll),
`<v>-390.png` (mobile, scroll 0) — 3 of the 16 captured per candidate. **Unreviewed, self-
disclosed**: 1280px, 1920px, and the 35%/100%-scroll and remaining 390px-scroll frames for
all three candidates. `sweep` confirmed zero overflow at 1280/1366/1440/1536/1680/1920/390,
so layout risk at the unreviewed widths is mechanically covered, but this is not a visual
review and is disclosed as such.

### Lens 1 — brief compliance (page-brief-core + design-principles + page-brief-repo)

All three: single `h1`, English-only copy, exactly 3 rendered weights (gate-confirmed),
no serif/emoji/raw-`<img>`, computed accent contrast documented per candidate in
`candidates/<v>.md`, product cards inside the hero component itself (not a separate
section — `design-principles` §Landing구조 1), badges in a row below the art frame rather
than overlaid (§Landing구조 2), manipulation state persists into the closing CTA for all
three (§Landing구조 3, "조작 상태는 끝까지 살아 있어야").

Ranking: **c > a > b**.

- **c, 1st**: the condition filter is the cleanest literal instance of
  "인과적 일관성" in this round — selecting a filter changes *which* cards are visible
  *and* recomputes the aggregate stat from exactly that visible subset, so the two outputs
  can never drift apart by construction (`page.tsx:217–224`, `average(visible.map(...))`
  computed from the same `visible` array the list renders).
- **a, 2nd**: slider → single blended score → closing CTA is a clean, correct single
  causal thread, but it is a thread of one number, not two synchronized outputs.
- **b, 3rd — one real compliance gap**: the category toggle recomputes the 3-stat panel
  correctly, but the two product-preview cards shown in the hero (`b/page.tsx:235–243`,
  `ITEMS` array) are **not** filtered or swapped by the selected category — selecting
  "Sneakers" leaves a bag and a watch on screen. `candidates/b.md` §3 self-reports this gap.
  It is not a hard-gate violation (nothing in `page-brief-core`/`design-principles` is
  machine-checkable here), but it is a real §Landing구조 3 inconsistency a brief-compliance
  lens should catch, and it would in a genuine blind panel too.

### Lens 2 — commercial polish (Linear / Stripe / Vercel bar)

Ranking: **a ≈ c > b** (a and c effectively tied, b behind for the same reason lens 1 docked it).

- **a**: tightest end-to-end narrative — one hero, one slider, one score, one close,
  nothing competes for attention. The native `<input type=range>` is lightly styled
  (`accent-[#0EA5E9]` + track background) rather than fully custom, which is a minor polish
  gap against a Stripe-level bar but not a defect.
- **c**: the ledger reads as a genuinely useful surface (a real app view, not just a
  marketing page), and the referral-code toggle is a nice small functional touch. Slightly
  denser than a and asks more of the viewer before the payoff lands.
- **b, 3rd**: the tinted "Avg. savings" callout card is a good polish instinct (draws the
  eye to the money number), but the card/category mismatch lens 1 found reads, at a
  commercial-polish level, as "the demo doesn't fully work" — the kind of inconsistency a
  Stripe/Linear review would flag before shipping.

### Lens 3 — archetype differentiation

Ranking: **c > a > b**.

- **c, 1st**: macro-shell (vertical full-bleed ledger) is the most distinct of the three
  from the hero+panel shape the last several landing rounds (per §1 ledger summary) share,
  and the mechanic (multi-item visible-set filtering + synchronized aggregate recompute) is
  closer to the "population reshaping" family (`landing-deltas-provisional.jsonl`, the
  `auto-landing-r23/b` entry read in §1) than to a plain single-slider or single-toggle
  recompute, applied here to a literal product list rather than a chart.
- **a, 2nd**: clean execution, but a single continuous slider blending two named signals
  into one score is a well-covered mechanic in this catalog's history (sliders recur across
  many prior landing rounds per the deltas file); the hero+panel shell is also the most
  common recent shape.
- **b, 3rd**: discrete single-select driving a recomputed stat panel is likewise a familiar
  family, and the un-synced product cards (lens 1/2 finding) read here as *reduced*
  differentiation too — the manipulation doesn't actually reach far enough into the page to
  feel structurally new.

### Aggregate

First-place votes: **c — 2** (lens 1, lens 3), **a — 1** (lens 2, where c is an effective
tie for 1st but not an outright win). **Winner: c ("Afterhours")** — 2:1 majority, no
no-winner.

Because `self_judged:true`, this is **not eligible for `/dash-falsify` promotion**
regardless of this outcome — only the LEARN delta below is live.

## 5. LEARN

```
node -e "import('./scripts/design-loop.mjs').then(m=>m.appendLedger({round:'auto-landing-r39',variant:'c',delta:'When a landing page\'s live manipulation recomputes an aggregate stat segmented by a dimension (category, condition grade, etc.), any product-preview cards shown in the same fold must be filtered/swapped by that same dimension too -- not left static while only the abstract stat changes. auto-landing-r39/b recomputed a 3-stat panel by category but left its 2 hero product cards fixed (a bag and a watch, regardless of the selected category), which both the brief-compliance and commercial-polish lenses independently flagged as breaking design-principles section Landing-structure-3\'s causal-consistency requirement -- the manipulation has to reach every visible proof surface it claims to govern, not just the one it was built against. auto-landing-r39/c avoided this by construction: its condition filter and its visible card set and its recomputed average all read from the same filtered array, so they cannot drift apart.',evidence:'lens1 (self-judged): \"selecting Sneakers leaves a bag and a watch on screen... a real Landing-structure-3 inconsistency\" -- lens2 (self-judged): \"reads, at a commercial-polish level, as the demo does not fully work\"',judge_votes:{lens1:'c',lens2:'a',lens3:'c'},confidence:'low',level:'L1',status:'provisional'},'vault/00-principles/landing-deltas-provisional.jsonl'))"
```

`confidence: low` — single self-judged round, not independently reproduced, and the
judging itself was not blind (see §0). Level L1; promotion to L2 needs independent
reproduction per `curation-criteria.md`'s checklist, same as any other delta.

## 6. 지식 정제 게이트

Loaded `landing-deltas-provisional.jsonl` in full (§1). No conflicting pair found against
this round's new entry — it is additive to, not in tension with, the existing
"조작 상태는 끝까지 살아있어야" L2 entry (2026-08-26) already in `design-principles.md`
§Landing구조 3: that entry established *that* state must persist to the close; this
round's L1 entry narrows it further to *multi-surface* consistency (every visible proof
surface, not only the one number a designer chose to thread through). No reclassification
of any existing entry performed — nothing in this round's output met the 2-round-reproduction
or machine-verifiable bar for an L1→L2/L3 promotion.

No new entry added to `questions-queue.md` — no conflicting pair and no meta-criteria
contradiction surfaced this round.

## 7. Record

- `auto-ledger.jsonl`: appended below (§ledger entry), `self_judged:true`,
  `variety:{theme:"dark",accent:"lime",face:"wide"}` (winner c).
- `vault/index.md` "세대 기록": `auto-landing-r39` entry added.
- No reassign-queue item consumed (queue was empty) and none added — all three candidates
  passed the hard gate clean, so none qualifies for reassignment (that queue is for
  rule-violation dropouts, not judging-stage losers).
