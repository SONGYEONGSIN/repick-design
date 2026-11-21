# auto-landing-r37 — DECISION

## 0. Round framing
- This is round **2 of 2** in a scheduled, unattended 2-round `/dash-evolve`-equivalent execution on
  `evolve/dash` (top-level orchestrator session, no human watching live). Round 1 was
  `auto-native-r40` (winner c, "Payout Method Order") — fully committed and pushed before this round
  began, sequential not parallel, this round's RETRIEVE reads r40's own append-only additions as part
  of its context (no overlap of substance since they're different targets).
- `round-budget.mjs --explain 2` returned `1 (0 unfilled PAGE_TYPES)` for round 1, meaning the skill's
  own authoritative budget script only licenses 1 round per invocation this session. Per this
  session's established convention (visible in prior sessions' ledger notes, e.g. r35→r36,
  r38→r39), the scheduled "2 consecutive rounds" requirement is satisfied by running the full §0–7
  playbook **twice in sequence as two separate invocations**, not by round-budget.mjs itself ever
  returning 2 — this is round 2 of that pair.
- Target draw: unfilled-type queue is still empty at this round's RETRIEVE (nothing changed it between
  rounds) → equal random draw among `[dash, landing, native]` landed on **landing**. Per the skill's own
  native-cadence rule ("월요일이면 첫 라운드의 타깃을 무조건 native로, 나머지 라운드는 미채움 큐를 따른다"), the
  Monday-native-forcing only applies to the day's FIRST round (already satisfied by r40) — round 2 used
  the normal fallback random draw, which landed on landing (not forced).
- Round number: `auto-landing-r37` (max existing landing round + 1, per the ledger before this round).
- `reassign-queue.md` "대기 중" was empty at RETRIEVE time — no landing entry to consume.
- `Agent` tool confirmed available before starting (re-checked per skill §0-0 — required every round,
  not just once per session).

## 0-0. Agent-tool / subagent-type deviation (self-disclosed)
No custom `designer`/`comparator` agent definitions exist in this sandbox, so `general-purpose` agents
stood in for both roles across 6 independent dispatches (3 designers, 3 judges), same as round 1.
Independence and blindness preserved — each designer worked in an isolated route folder and was told
not to open the other two candidates' files; each judge was given the same 12 screenshots + source
folders with no visibility into the other judges' reasoning. `self_judged` is NOT set.

## 0-1. Important process-gap finding (self-disclosed during judging, not by the orchestrator)
**lens3 discovered, independently, that this skill's stated landing dedup-check path is stale.** The
skill's own "타깃 파라미터" table lists landing's "중복 금지" target as `/v1~v5` + landing-evolve
accumulated forms. **`app/src/app/v1` through `v5` do not exist in this repo.** The actual production
landing catalog lives at `app/src/app/(marketing)/v6` through `v26` (21 production pages) — confirmed
directly by the orchestrator after lens3's report (`ls app/src/app/(marketing)/`). This means every
prior landing round's RETRIEVE step that took the skill's stated path literally would have checked an
empty/non-existent directory for dedup purposes, never actually comparing new candidates against the
21 production pages that are the catalog's most important prior-art surface (they're the *promoted*
pages, unlike the still-unpromoted evolve-route candidates). This round's own GENERATE assignment
prompts (written by the orchestrator before this was discovered) also referenced the stale `/v1-v5`
path. In this specific instance the gap did not cause a real collision — lens3's own after-the-fact
grep against `(marketing)/v6-v26` found no disqualifying duplicates among this round's 3 candidates —
but it is exactly the Q58/Q63/Q66 lineage of failure (RETRIEVE silently checking less than the full
prior-art archive) and is filed as a new open question (Q70, see §6) rather than silently patched,
since fixing the skill text is a deliberate maintenance decision outside an autonomous round's scope.

## 1. RETRIEVE
Read in full: `design-principles.md` (landing brief, all sections), `page-brief-core.md` (cross-type
machine-verified rules), `page-brief-repo.md` (this repo's bindings — English-only copy, font
whitelist, build commands), `vault/20-catalog/ux-guidelines.catalog.md` (web/both rows) +
`vault/20-catalog/motion.catalog.md` (landing column), `vault/00-principles/curation-criteria.md`
(full), `vault/00-principles/reassign-queue.md` (empty for landing), `vault/00-principles/questions-queue.md`
(landing-targeted open items, especially the Q60 lineage on copy/layout convergence and Q62/Q67),
`vault/00-principles/landing-deltas-provisional.jsonl` (all 69 entries), the last 6 landing ledger
entries (r31–r36) for macro-device/winner history, and `scripts/catalog-variety.mjs` output for
catalog-wide theme/accent/face distribution. **Also grepped the full `app/src/app/landing-evolve/`
archive** (not just the last few rounds) for keyword collisions against 3 candidate device ideas before
finalizing assignment — this caught a real near-collision early (a planned "Sankey/flow diagram"
device idea was dropped after discovering `landing-evolve/r28/a/flow-diagram.tsx` already exists) and
was replaced with the "Instant Estimate" search/autocomplete device instead. (The `(marketing)/v6-v26`
gap described in §0-1 was NOT caught at this stage — only during judging, by lens3. See Q70.)

**Macro-device/winner history (r31–r36)**: box-plot-from-dual-handle-slider (r32/a, no-winner round),
orbital renormalizing-slider gauge (r33/a, winner), calendar heatmap (r33/b), pulse waveform (r33/c),
match-weight reorder (r34/a, winner), seller-payout stepper simulator (r34/c and its reassigned
reproduction r35/c — used twice), "the appraisal comes first" (r35/a), head-to-head duel comparator
(r35/b, **most recent winner before this round**), slope-chart-from-grade-slider (r36/a, **winner**),
"Covera" (r36/b), sell-through-by-category (r36/c). None of this round's 3 assigned devices
(search/autocomplete, click-to-inspect chain, drag-magnifier-over-illustration) repeat any of these.

## 2. GENERATE — 3 parallel designers, explicit device + macro-layout + copy-convergence avoidance
Each candidate was given a distinct interactive-device assignment, explicitly instructed to use a
**different hero grid ratio than `col-span-7`/`col-span-5`** (independently converged on twice in prior
rounds, per the Q60 lineage), and given the accumulated list of 8 specific convergent copy
patterns from the Q60/Q21 lineage to consciously avoid (none of which recurred this round — see §4).

- **a — "Instant Estimate"**: a real WAI-ARIA combobox (typed search + keyboard-navigable
  listbox, not a native `<select>`) filtering a fixed 25-item comparable dataset; selecting a result
  recomputes a live payout-range estimate + 3 comparable-sold cards via one shared pure function,
  threading to the value section and closing CTA.
- **b — "The Verification Walk"**: a horizontal 4-step click-to-inspect chain (order-independent),
  each step revealing an evidence panel; a persistent "Trust Score" derived from the running average of
  only the steps actually opened, threading to the closing CTA with three distinct copy branches
  (zero/partial/fully inspected).
- **c — "Spot the Proof"**: a drag/keyboard-driven magnifier over a hand-built SVG product
  illustration revealing 4-5 fixed authenticity hotspots on contact (append-only discovery, never
  "un-found"); a live "X/5 markers found" counter + derived confidence percentage threading to the
  value section and closing CTA.

All 3 designers reported full completion (code + a `candidates/<v>.md` concept note with a documented
accent-contrast calculation and line-length arithmetic, both explicitly required this round per prior
rounds' repeated findings that these calculations are easy to get wrong — e.g. candidate c's own
write-up documents catching its own near-miss: an initially-chosen emerald-500 looked "near-monochrome
safe" but computed at only 2.31:1 for white-on-fill, corrected to emerald-700 at 4.99:1). No concurrent
file-edit races occurred this round (each candidate worked in a fully separate route folder, unlike
native's shared registration files).

**Freeze hash** (computed after all 3 designers confirmed completion, before gating):
`cat app/src/app/landing-evolve/r37/*/*.tsx app/src/app/landing-evolve/r37/*/*.ts | shasum` →
`bbd4f27212e8273516c5714a9381647635d67bf7`. Unchanged through judging.

## 3. HARD GATE
`node scripts/gate.mjs --target web --routes /landing-evolve/r37/<v>` (one candidate at a time, dev
server on :3100). **10/10 pass on the first attempt for all 3 candidates — zero 1-fix loops, zero
candidates dropped.** Full table in `SCORES.md`, including the one-time sandbox environment fix needed
to get real Lighthouse scores instead of a silent `unavailable` soft-pass (`CHROME_PATH` +
`PW_NO_SANDBOX` env vars — chrome-launcher doesn't share Playwright's browser-path resolution, and
Chromium refuses to launch as root without `--no-sandbox`). a11y: a=100, b=100, c=98 (the only failed
audits across all three — `bf-cache` on all, `landmark-one-main` additionally on c — are neither in
`page-brief-core.md`'s promoted hard-fail list, so these are record-only, not failures).

## 4. JUDGE — 3-lens blind panel
Screenshots: desktop 1440px at scroll 0%/35%/100% + mobile 390px at scroll 0% (4 frames/candidate, 12
total), selected per the skill's recommended frame-budget combination. All 48 captured frames (full
16-per-candidate set at 1280/1440/1920/390 × 4 scroll depths) were confirmed non-blank by
`capture-shots.mjs`'s own pixel probe (zero `blanks`, zero `errors`). Each of 3 independent
`general-purpose` agents was dispatched in parallel, blind to the others, with an explicit note that
the screenshots only show the DEFAULT (non-interacted) render state and that live-recompute claims
must be verified by reading source, not by screenshot alone.

**Lens1 (brief/DNA compliance)**: ranking **b > c > a**. Found zero rule violations in any candidate —
all three correctly implement the accent-fill/white-text rule, the font-weight-count rule, the
`family-name:`-safe display-font syntax (or correctly skip a display font), single-`h1`/no-heading-skip,
`useSyncExternalStore`-gated `whileInView` reveals, and the hero-embeds-proof-cards structural rule.
The deciding factor was a **confirmed, screenshot-visible copy bug in a**: `ClosingCTA.tsx:32` renders
`"A {selected.grade} {itemLabel(selected)}..."` where the default item's grade is already `"A-"`,
producing the literal rendered headline *"A A- Nike Air Jordan 1 Retro High 'UNC' estimates at
$87–$105"* — a double-article grammar glitch, visible in the page's default (no-interaction) state in
both `a-1440-s100.png` and `a-390.png`, in exactly the section the brief treats as the mandatory
"manipulation survives to the close" proof point. b edged out c on a secondary basis (slightly more
rigorous motion-gating nuance and focus-in-expanded-state handling, explicitly checked and confirmed
correct in b; c was equally compliant but had less code-level rigor signal to cite beyond "also
correct").

**Lens2 (commercial completeness)**: ranking **b > a > c**. All three "clear the core bar" (genuine
wired devices, no dead affordances, coherent mobile reflow). b won specifically for **honesty under
every state** — its `ClosingCTA.tsx` has three distinct non-generic copy branches for
zero/partial/fully-inspected, including an explicit admission when nothing has been inspected yet
("there is no honest trust score to show you here either") rather than a generic fallback pitch, and a
`ValueSection.tsx` that explicitly labels one stat column "LIVE" against two labeled "FIXED" — a
transparency device lens2 read as Stripe-grade restraint. a ranked 2nd for having the single most
evidence-dense, commercially-native device (an actual "what's my item worth" payout calculator, the
most direct resale-marketplace value prop of the three) but was marked down for the closing CTA
unconditionally claiming personalization ("from your search") even for visitors who never touch the
search box (a pre-selected default item renders a full estimate with no interaction required) — a
milder version of the "claims something the code doesn't back up" problem, distinct from a's lens1-cited
grammar bug but compounding it. c ranked 3rd not for any defect but for its derived "AI match %" being
the least-grounded number of the three (its own source comment concedes it's "a plausible pre-scan
match floor" formula invented to make a number move, versus a's real comp-price arithmetic and b's real
average of actual sub-scores) and a fully-inert default state (0/5 found) with no pre-populated example,
a slightly weaker first impression than a's fully-populated default.

**Lens3 (archetype/form differentiation)**: ranking **c > a > b**. Ran the mandatory grep sweep
against the full `landing-evolve/` archive **and** discovered and swept the real `(marketing)/v6-v26`
production catalog (see §0-1) — this is the first time a landing judge panel has actually checked that
directory. Confirmed c's continuous-2D-drag-over-an-image input modality has zero precedent anywhere
in the catalog (every prior "drag" hit is a 1D slider, never 2D pointer position on an image) — the
cleanest novelty claim of the three. Confirmed a's typed-search input is also genuinely new, though its
output half (payout-range + comparables) has a **partial** precedent in production `(marketing)/v14`'s
`PayoutCalculator.tsx` (same output type, different input — dropdowns, not typed search); per the
input×output-pair doctrine this is not disqualifying (no prior round pairs typed-search with
payout+comps) but is noted. **b ranked last** on archetype grounds for two reasons, neither a rule
violation: (1) **output-type saturation** — a derived 0-100 "Trust Score"/confidence output is now the
single most-reused output type in the catalog (8+ prior instances found, including production
`(marketing)/v21` literally titled "Trust Score Console"); (2) **vocabulary echo** — b's own
`theme.ts`/`VerificationWalk.tsx` use "chain"/"chain-node" terminology closely echoing
`landing-evolve/r29/b`'s "Gatelist" gate-chain device's naming, though the interaction mechanic itself
(order-independent click-reveal vs. toggle) genuinely differs. Lens3 explicitly treated both findings
as archetype observations, not rule violations, and did not claim they invalidate b's win.

**New convergent-copy finding (6th reproduction of the Q60 lineage)**: lens3 found the secondary CTA
phrase **"Browse verified listings"** verbatim-identical in both b and c (`Hero.tsx` and `ClosingCTA.tsx`
in each), with 2 further precedents found in the broader archive (`r27/c`, `r33/c`) — a 9th specific
convergent phrase in this lineage (the first 8 were explicitly given to all 3 designers to avoid this
round, and none of those 8 recurred; this is a brand-new one neither designer could have known to
avoid). Lens3 explicitly treated this as an observation only, consistent with established practice —
it did not change the ranking.

**Aggregate**: 1st-place votes — b: 2 (lens1, lens2), c: 1 (lens3). **Clean 2:1 majority for b, not a
3-way tie** — the `curation-criteria` tie-break rule does not apply. **No no-winner votes from any
lens.**

**Winner: b — "The Verification Walk".**

## 3-1. Post-judgment fix
**None needed.** No lens found a confirmed rule violation in the winner (b) — lens1 found zero
defects, lens2 ranked it 1st on genuine strengths, and lens3's concerns about b (output-type
saturation, vocabulary echo with a prior round) are explicitly archetype/differentiation observations,
not rule violations, and did not change its own non-winning ranking's validity. No source modification
was made; the promoted source is identical to what was judged (freeze hash unchanged throughout:
`bbd4f27212e8273516c5714a9381647635d67bf7`).

## Reassign-queue disposition for a and c
Neither a nor c was dropped at the hard gate (both 10/10 clean) — both lost purely at the judge panel,
on judgment grounds (a's closing-CTA grammar bug + overclaimed personalization; c's less-grounded
confidence formula + inert default state, offset by its strongest archetype novelty). Per this
project's own established precedent (e.g. `auto-dash-r38/c`→`r40/a`, `auto-landing-r34/c`→`r35/c`:
"이번 탈락은 게이트 위반이 아니라 순수 판정 패배... 재배정 큐의 목적은 완수됐다"), a pure judgment loss with
no hard-gate-level rule violation is **not** registered to `reassign-queue.md` — that queue is
specifically for candidates whose loss traces to a rule violation rather than a form/taste judgment.
Neither a nor c came from a reassign-queue entry in the first place. No entry added.

## 5. LEARN
One delta appended to `vault/00-principles/landing-deltas-provisional.jsonl` (see next section).

## 6. Refinement gate
- **L3 supersedes-chain extension (6th reproduction)**: the Q60/Q21 lineage ("device+narrative-skeleton
  assignment alone does not prevent convergence — it migrates to a lower copy/layout layer") is
  extended with this round's specific new finding — the phrase "Browse verified listings" converging
  independently across 2 of 3 candidates (plus 2 further archive precedents). Appended as a new entry,
  `level: 'L3'`, `supersedes: 'auto-landing-r32/multi'` (the most recent entry in this chain). The
  established disposition (record the observation, do not expand the banned-phrase list given
  diminishing-returns concerns already flagged in the chain) is kept unchanged — the 8 previously-known
  phrases were explicitly given to all 3 designers this round and none recurred, which is itself
  evidence the targeted-avoidance approach works for *known* phrases; the lineage's core finding is
  that *new* ones keep surfacing regardless.
- **New questions-queue entry (Q70)**: the `/v1-v5` vs. `(marketing)/v6-v26` path-staleness finding
  (§0-1) — filed as open, target: landing, background: this round's GENERATE assignment prompts and
  (per the skill's own "타깃 파라미터" table) likely every prior landing round's RETRIEVE referenced a
  dedup-check path that does not exist in this repo, while the actual 21-page production catalog at
  `(marketing)/v6-v26` was never checked by any RETRIEVE step until this round's lens3 found it
  independently during judging (too late to inform GENERATE). Proposes the Q58/Q63/Q66-lineage fix
  (mandatory full-archive grep against the REAL production path before assignment) be extended to
  cover this corrected path, alongside a one-time correction check for whether other skill-stated paths
  in this repo have similarly drifted.
- No conflicting delta pairs found this round. No cross-target conflicts found.

## 7. Record + commit
- `auto-ledger.jsonl` entry appended: target=landing, round=auto-landing-r37, winner=b, no_winner=false,
  hardgate={sweep,static,lighthouse: all "a/b/c 전원 1차 통과"}, judges={lens1:b, lens2:b, lens3:c},
  variety={theme, accent, face} per the winner's actual tokens.
- `vault/index.md` "세대 기록" section updated with this run.
- `reassign-queue.md` not touched this round (see disposition above — no qualifying entry).
- `landing-deltas-provisional.jsonl`: 1 new L3 entry (Q60/Q21 lineage, 6th reproduction,
  `supersedes: 'auto-landing-r32/multi'`).
- `questions-queue.md`: Q70 added (대기 중).
- Canon unchanged throughout: `design-principles.md`, `page-brief-core.md`, `page-brief-repo.md` all
  untouched — append-only jsonl + one questions-queue entry only.
- **This completes the scheduled run's second and final round.** Both rounds of the requested
  "2 consecutive rounds" are now done: round 1 = `auto-native-r40` (winner c, "Payout Method Order"),
  round 2 = `auto-landing-r37` (winner b, "The Verification Walk"). 0 no-winner rounds, 0 candidates
  dropped at the hard gate across either round, canon fully unchanged throughout both.
