# DECISION — auto-native-r63 (target: native)

## 0. Round context

This is **round 2 of 2** of the outer scheduling task's request ("perform 2 sequential
`/dash-evolve` rounds"). Round 1 was `auto-dash-r65` (target `dash`, winner `b`/Harborwatch via a
complete 3-way tie-break), committed+pushed (`843221c`) before this round began, per the skill's
explicit "연속 라운드는 반드시 순차로 돈다" instruction — this round re-ran §0-§7 fresh, reading
round 1's delta/ledger/questions-queue writes off disk first.

```
$ node scripts/round-budget.mjs "2"
1
$ node scripts/round-budget.mjs --explain "2"
미채움 0종 — N≥2 의 근거(커버리지)가 없다
```

Same forced N=1 as round 1 (0 unfilled `PAGE_TYPES`) — this invocation also runs exactly 1 round.

## 0-0. Sub-agent availability

Confirmed available (used throughout round 1 already in this same session) — 6 `general-purpose`
dispatches this round (3 blind designers, 3 blind judges). Not self-judged.

## 0-1. Target selection

Today (2026-11-24 UTC) is Tuesday, not Monday — no native-cadence forcing; native was reached
through the ordinary uniform `[dash, landing, native]` draw (round 1 already consumed `dash` for
its own draw, but per the continuity rule only types *generated this execution* are excluded, and
`dash` is not a `PAGE_TYPES` type, so this round's draw was a fresh, unrestricted uniform draw over
all three, landing on `native`).

Round number: `auto-native-r63` (previous native round: r62). `reassign-queue.md` "대기 중" is
explicitly empty — no reassignment this round.

Environment bootstrap (session-specific, not a SKILL.md procedure): `native/node_modules` had never
been installed this session — fixed with `npm install`. Playwright Chromium pre-staged at
`/opt/pw-browsers/chromium` (not the default cache path) — reused via the existing `PW_CHROMIUM_PATH`
env var already read by `gate.mjs`/`capture-shots.mjs`/`shot-evolve.mjs`/native `validate.sh`.

## 1. RETRIEVE summary

Read in full: `native/GENERATION.md`, `native/src/tokens.ts`, tail of
`native-deltas-provisional.jsonl` (last ~15 entries summarized), `native/screens.json` (full slug
list — production screens + evolve archive r23-r62), and candidate concept notes from the last 6
evolve rounds (r56-r62) to build the GENERATE-stage dedup list.

**Confirmed dedup-survey gap (see §4 and `questions-queue` Q81)**: this RETRIEVE pass, like at least
two prior occurrences (`questions-queue` Q63, Q78), surveyed only the recent ~6 rounds plus
production screens — not the full `native/src/evolve/` archive going back to r23. This round's own
judging surfaced the consequence directly (candidate c).

## 2. GENERATE — 3 parallel designers (blind to each other)

Three deliberately novel domains + three of GENERATION.md §3's 5 sanctioned bottom-band forms,
triangulated against the dedup survey above (least-recently-used forms favored: destructive-confirm
row flip and no-band terminal-swap had been used less recently than blocked-workflow/
selection-count bar in the prior several rounds):

| v | screen | domain | band form (GENERATION.md §3) |
|---|---|---|---|
| a | Saved Shipping Addresses | buyer's address book, per-row delete/set-default | destructive-confirm row flip |
| b | Request My Data Export | privacy/account data-export request | no band, terminal full-content-swap |
| c | Referral Program | referral stats + invite-link share | persistent read-only action bar |

All three designers completed fully, wrote concept notes to `candidates/{a,b,c}.md`, and did not
touch `screens.ts`/`screens.json` (registration done centrally by the orchestrator per this
catalog's established practice, e.g. `auto-native-r60`/`r62`).

**State freeze + hash** (all `.tsx`/`.ts` under `native/src/evolve/r63/`, concatenated):
`50a267bafa4e39f1ec5224bd32cd768c2df1c679` — unchanged from GENERATE through judging (no 1-fix was
needed this round).

## 3. HARD GATE

`node scripts/gate.mjs --target native --screens evolve-r63-a evolve-r63-b evolve-r63-c` →
**12/12 clean on the first attempt across all three candidates** (tsc/export/render/iframe × 3),
0 violations, 0 1-fix. Full table in `SCORES.md`.

**Orchestrator live-interaction verification** (per established practice, e.g. `auto-native-r62`):
independently drove each candidate's core claimed mechanism via Expo Web export + Playwright rather
than trusting self-reports alone — a's per-row delete-confirm flip, b's one-way terminal content
swap, and c's `Share.share()` call (which genuinely rejects in this sandboxed headless-browser
environment, lacking Web Share API support — an environment limitation, not a code defect, confirmed
via screenshots and documented explicitly in `SCORES.md` so judges would not misread it). All three
confirmed to genuinely work as designed.

## 4. JUDGE panel (3 blind lenses, `general-purpose` standing in for the unavailable `comparator`
agent type — same substitution as round 1 and prior scheduled rounds)

Each judge received both default-render screenshots (390px, 768px) per candidate plus full source
access, blind to concept/order/each other.

- **Lens 1 (DNA/accessibility compliance): 1st = c, 2nd = b, 3rd = a.** All three are
  mechanically clean (no hardcoded hex, no Korean, determinism, correct RN idioms, correct band-form
  delivery). c's edge: the one correct use of bare `accessible` in the whole batch (on a
  non-interactive row wrapper), honest `accessibilityHint`, real three-way `Share.share()` branch.
  a's one real defect: `ListEmptyComponent` copy ("removed addresses will show up here") directly
  contradicts the screen's own "can't be undone" deletion copy — a genuine, reachable
  copy/logic inconsistency.
- **Lens 2 (mobile completeness): 1st = c, 2nd = b, 3rd = a.** c's derived pending/credited split
  (verified by hand: $45 from 3 credited entries, 2 pending correctly excluded) and genuine
  platform-API use (`Share.share()`, the most distinctly "native, not web" touch among the three)
  edge out b's excellent but simpler one-shot transition and a's real but smaller completeness gap
  (no auto-promotion of a new default address when the default one is deleted — honestly flagged in
  a's own code comment).
- **Lens 3 (screen-type differentiation): 1st = b, 2nd = a, 3rd = c.** **Critical finding,
  independently re-verified by the orchestrator via direct grep**: candidate c is a confirmed,
  severe duplication of the existing `native/src/evolve/r37/a/ReferralRewardsScreen.tsx` — identical
  domain (referral program: invite code/link, `Share.share()`, referred-friends list with credits,
  running balance) AND 8 literally-identical style-key names (`listContent`, `headerBlock`,
  `inviteCodeLabel`, `inviteCodeValue`, `shareButton`, `shareButtonPressed`, `shareButtonLabel`,
  `statTile`) plus near-identical copy. a's nearest neighbor (`r61/b` payment methods) is a milder,
  pre-sanctioned "same shape, different object" case with genuinely distinct style-key names and
  data schema. b's nearest neighbor (`r59/b` warehouse intake) shares only the abstract shape
  (no band + terminal swap) with a verified, structurally real difference (one-shot vs.
  incremental-counter interaction model) — a clean, non-derivative execution. Today's three
  candidates are mutually distinct from each other (no two converge on the same underlying
  state-machine shape).

### Aggregation — **ordinary 2:1 majority for c** (lens1+lens2; lens3 dissented)

1st-place votes: c=2 (lens1, lens2), b=1 (lens3) — not a complete 3-way tie (c already has a
majority), so `curation-criteria.md`'s tie-break exception does not apply; this is a plain majority
under the skill's base aggregation rule ("1위 표 다수결").

**However, this is recorded with an explicit promotion-caution, not a silent pass-through.** lens1
and lens2 ranked c 1st purely on DNA/a11y-compliance and mobile-completeness grounds respectively —
neither lens's rubric includes a cross-round code-surface-duplication check (that is specifically
lens3's job), so neither lens was in a position to catch what lens3 found. This is **not** a judgment
call or a borderline reading — the orchestrator independently re-verified all 8 style-key matches and
the domain identity via direct `grep` before writing this document. This is this catalog's
"architecture-level code-surface cloning" failure mode (`GENERATION.md` §3, 2026-09-12 L2 entry)
in its clearest form yet.

**Root cause, documented transparently**: this is the orchestrator's own RETRIEVE-stage failure, not
a designer failure — the dedup list given to designer c covered only the last ~6 evolve rounds
(r56-r62) plus production screens, never surfacing `r37/a` (an older archive entry). This is a third
occurrence of a previously-named failure pattern (`questions-queue` Q63, Q78: "RETRIEVE doesn't keep
up with the full archive"), with the worst consequence observed so far — previous occurrences led to
a reassignment or a non-winning data point; this one let a confirmed duplicate win the round's
ordinary majority.

**Disposition**: per this catalog's established precedent for confirmed-duplication findings against
a winning candidate (e.g. `auto-native-r61`'s b/`r23-b` case, which also won via mechanical rule
application despite a confirmed-severe finding), the panel's aggregation rule is applied as written —
c is recorded as this round's winner, not an invented or forced one. **This DECISION explicitly
recommends against promoting candidate c** in the next `/dash-falsify` review, given the directness
and severity of the evidence. A new `questions-queue` entry (Q81) extends Q78's question from the
narrow tie-break case to ordinary majorities generally, since the same structural gap (only one lens
checks for duplication) can produce this outcome without any tie-break being involved at all.

## 5. LEARN — delta (1, isolated)

```
node -e "import('./scripts/design-loop.mjs').then(m=>m.appendLedger({round:'auto-native-r63',variant:'c',delta:'...(see native-deltas-provisional.jsonl for full text)...',evidence:'...',judge_votes:{lens1:'c',lens2:'c',lens3:'b'},confidence:'high',level:'L1',status:'provisional'}, 'vault/00-principles/native-deltas-provisional.jsonl'))"
```

L1 (first occurrence of this specific *consequence* — prior occurrences of the dedup-survey gap
itself are known, but this is the first time it demonstrably let a confirmed duplicate win an
ordinary majority rather than just get reassigned or lose outright).

## 6. Knowledge refinement gate

- **Cluster check**: sits alongside the existing L2 "코드 표면까지 닮으면 진다" entry in
  `GENERATION.md` §3 (that entry is about *losing* the differentiation vote; this round's delta is
  about the *aggregation-structural* reason a duplicate can still *win* an ordinary majority despite
  that same L2 principle) — filed as a sibling L1, not a supersedes.
- **Level re-assessment**: not yet eligible for L2 — this specific consequence (confirmed duplicate
  winning an ordinary, non-tie majority) is a first occurrence; the underlying dedup-survey gap itself
  has 2+ prior occurrences (Q63, Q78) but at a different severity, so re-using that reproduction count
  for this new L1 would conflate distinct claims.
- **Forced question generation**: **Q81** appended to `questions-queue.md` "대기 중" (target `native`,
  extends Q78's scope from tie-break-only to ordinary majorities; recorded not acted on, consistent
  with this catalog's higher reproduction bar for judging-system changes).

## 7. Record + commit

- `auto-ledger.jsonl` entry appended (target `native`, round `auto-native-r63`, winner `c`,
  flagged `self_judged` omitted — not self-judged).
- `vault/index.md` "세대 기록" updated with this run.
- No canon file modified (`native/GENERATION.md`/`native/src/tokens.ts` untouched); jsonl files
  append-only; `native/src/screens.ts` + `native/screens.json` edited (standard per-round
  registration, not canon); no commit to `main`.
- **This completes both of the outer scheduled task's 2 requested rounds** — round 1 =
  `auto-dash-r65` (dash, winner b/Harborwatch, complete 3-way tie resolved per documented policy),
  round 2 = `auto-native-r63` (native, winner c/Referral Program, ordinary 2:1 majority — with an
  explicit non-promotion recommendation given a confirmed severe duplication finding). 1 hard-gate
  1-fix total across both rounds (round 1 only), 0 no-winner rounds, canon fully unchanged throughout
  both.
- Dev server (started during round 1, reused for round 1's gating; native round uses its own
  Expo-Web export/serve cycle on port 8091, not the Next.js dev server) stopped at the end of this
  round.
