# auto-native-r46 — DECISION

## §0 — Round setup

This is round 2 of this scheduled, unattended session's requested back-to-back `/dash-evolve` executions — round 1 was `auto-dash-r54` (winner c, "Strata"), committed+pushed (`ddb36b0`) before this round began. This is a second, independent single-round `/dash-evolve` invocation, not a continuation of round 1's internal loop (`round-budget.mjs` is re-run fresh for this invocation and, as in round 1, returns N=1 since `PAGE_TYPES` unfilled is still 0 — see below).

`node scripts/round-budget.mjs 2` → **N=1** again (0 unfilled `PAGE_TYPES`). Per the skill's own §0-0-1, only 1 round runs under this invocation.

**Native weekly cadence**: today (2026-11-01) is UTC Sunday, not Monday — no cadence override is in play; native was reached by the ordinary target draw, not the Monday-forced rule.

**Target draw**: unfilled-queue empty → uniform draw over the targets not already used by this session (`dash` was round 1's target, excluded per the skill's "이번 실행에서 이미 생성한 타입은 제외" rule) → `[landing, native]` → **native**. Round number for `native`: max existing `auto-native-r*` + 1 = **46**.

**Agent tool availability**: confirmed present and used for all 6 subagent dispatches this round (3 blind designers, 3 blind judges), same as round 1. No custom `designer`/`comparator` agent type configured in this environment — `general-purpose` used throughout.

**reassign-queue.md at RETRIEVE**: re-checked after round 1's edit (archived #19) — no pending item for `target: native`. Nothing consumed this round.

**Screen-concept pre-check** (manual survey of `native/screens.json` + the last 5 native rounds, `r41`–`r45`, before assigning): avoided recently-used concepts (Listing Q&A, Report a Buyer, Split-Pay Plan Selector, Group Buy Roster, Request-more-time, Shared Collections, Authenticity Escalation Case, Schedule Return Pickup, Seller Reputation Tier, Want List, Local Meetup Events, Negotiation History) and the existing production catalog (watchlist/match/detail/offer-thread/account/handoff/notifications/listing/order-status/verification/disputes/review/meetup-time/chat/membership/certificate/payout/wallet/storefront/relist/authentication/condition/pickup/auction/sessions). Assigned three fresh domains, one per each of `native/GENERATION.md` §3's three fixed band shapes (deliberately, to get full doctrinal coverage in one round):
- a = "Shipping Label Purchase" (blocked-workflow state machine)
- b = "Watched Item Price History" (read-only persistent-action-bar)
- c = "Ended Listings" bulk-relist (selection-derived contextual bar)

Both a and c turned out, independently, to have an existing closely-related production-screen neighbor (`pickup/ShipmentPickupScreen.tsx` for a; `relist/BulkRelistScreen.tsx` for c) that this orchestrator's pre-check did not catch (the pre-check surveyed concept *names*, not the full production screen list for adjacent domains) — both designers found and disclosed their own neighbor unprompted during generation, and both were explicitly instructed to differentiate code surface from it. See §4 for how that held up under judging.

## §1-2 — GENERATE

3 designers dispatched in parallel (`general-purpose` Agent, background), each given the fully assembled `native/GENERATION.md` + `tokens.ts` content inline, plus their specific band-shape assignment and domain. All three self-reported `native/node_modules` was not installed in their environment and so could not run `tsc` themselves — each did a careful manual read-through instead; the orchestrator's own `npm install` + whole-project `npx tsc --noEmit` (run after all three landed) confirmed zero errors.

**브리프 구멍 보고 scan**: no gap reported by 2+ designers (each candidate's `candidates/<v>.md` has its own single-instance invented-value list — a: flat-rate pricing/payment-method assumptions; b: domain pick/severity-free design/mobile-simplification choices made implicitly via content density; c: domain pick/thumbnail-placeholder convention/relist semantics). No action per the skill's 2-report threshold.

Freeze hash at generation handoff: `3b36331...` (pre-registration; registration into `screens.ts`/`screens.json` was done by the orchestrator directly afterward, not by any designer, to avoid a 3-way shared-file conflict — matches this round's own designer instructions).

## §3 — HARD GATE

`native/node_modules` installed fresh (503 packages) — not present at session start. `npx tsc --noEmit` on the whole `native/` project: clean, 0 errors. `node scripts/gate.mjs --target native --screens evolve-r46-a evolve-r46-b evolve-r46-c`: **all 12 gates (3 candidates × 4 stages) passed on the first run — zero 1-fix needed for any candidate.**

Freeze hash post-registration (unchanged through screenshot capture and judging): `a086168e7e9f1fa8df490006a63d4e2c48c545b7`.

All three candidates survived to judging.

## §4 — JUDGE

3 lenses, `general-purpose` Agent dispatches, fully blind. Screenshots: 2 per candidate (390×844 and 768×844, per the skill's native screenshot procedure via `scripts/shot-native.mjs` — the repo's own `PW_CHROMIUM_PATH`-aware helper, since the stock `npx playwright screenshot` CLI doesn't read that env var and failed trying to reach `cdn.playwright.dev` through the egress proxy).

| Lens | 1st | 2nd | 3rd |
|---|---|---|---|
| lens1 (DNA compliance) | **a** | b | c |
| lens2 (mobile completeness) | **b** | a | c |
| lens3 (differentiation) | **c** | b | a |

**A complete 3-way tie — each lens picked a different candidate 1st.** This is the exact scenario `curation-criteria.md`'s "주간 반증 판정 기준" ② procedure was written for: *default to the brief-lens's (lens1) top pick, unless the archetype/differentiation lens (lens3) explicitly ranked that pick last — in which case exclude it and reapply lens1's preference among the remaining two.*

- lens1's top pick is **a**.
- lens3 ranked **a dead last (3rd)**, explicitly and with specific evidence (see below) — the exception condition is met.
- Excluding a, lens1 ranked **b** above c among the remaining two.
- **Winner: b ("Price History").** Not a 2:1 majority — a tie resolved by the documented procedure, logged explicitly as such.

Full per-lens reasoning is in `SCORES.md`. The decisive findings worth surfacing here:

**Why lens3 put a last**: a's own concept note disclosed `pickup/ShipmentPickupScreen.tsx` as its closest existing neighbor and claimed a distinct code surface. Lens3 did not take that claim at face value — it opened `ShipmentPickupScreen.tsx` in full and found the match goes deeper than style-key naming: identical `FlatList`+`listRef`+scroll-to-index-on-blocked-press architecture, a **verbatim** `onScrollToIndexFailed` fallback handler, the same discriminated-union blocked/ready/done state shape, the same 3-way band conditional, and near-identical header copy. Renaming the style-key prefix (`control` vs. `dock`) did not prevent this. This generalizes `native/GENERATION.md` §3's existing L2 note ("형태를 맞게 골라도 코드 표면까지 닮으면 진다" — matching style-key names is insufficient differentiation) one layer deeper: **component architecture** (ref patterns, fallback handlers, union-state shape), not just identifier names, is also part of what "code surface" means for this doctrine.

**Why lens3 put c first**: c's own concept note disclosed `relist/BulkRelistScreen.tsx` as its closest neighbor and made the same distinctness claim — but here lens3's verification (reading both files in full) confirmed it: zero shared identifiers at any level, AND a real functional divergence (the existing screen's batch actions are non-destructive/undoable with an undo bar; c's relist action is destructive/irreversible with a dismiss-only confirmation panel), AND c fills an actual gap in the seller lifecycle the catalog didn't cover (ended listings vs. live aging inventory).

**A narrower finding on winner b, noted but not disqualifying**: lens3 also found, unprompted, that b's self-clearing live-announcement mechanism (`ORDER_NOTICE_LIFETIME_MS = 5000`, timer ref, identical cleanup/guard pattern) closely mirrors `evolve/r33/a/ProvenanceRecordScreen.tsx`'s `ANNOUNCEMENT_LIFETIME_MS = 5000` mechanism. This was not disclosed in b's own concept note (which claimed general distinctness without naming a specific precedent to check against — lens1 separately flagged this same gap as "unverified, not falsified"). The echo is real but narrow (a single micro-pattern, not the surrounding screen or the control's actual operation) and is not a violation of any `native/GENERATION.md` enumerated rule — it did not change lens3's own ranking of b (2nd, not last) and does not affect the tie-break outcome, which turns on lens3's ranking of a, not b. Logged here for visibility; not escalated to a reassign-queue or §3-1 action.

## No post-judgment §3-1 fix

No enumerated-rule violation was cited against winner b by any lens. Nothing to fix. Freeze hash for b unchanged from the pre-judging gate run through final judging.

## §5 — LEARN

One new L1 delta appended to `vault/00-principles/native-deltas-provisional.jsonl` (full text in the entry itself) — generalizing `native/GENERATION.md` §3's existing "matching the band shape is not enough if the code surface matches too" doctrine: the relevant "code surface" includes component **architecture** (ref-based imperative patterns like a `FlatList` scroll-to-index jump, a specific `onScrollToIndexFailed` fallback, a discriminated-union state shape), not only identifier/style-key names. A past L2 note (2026-09-12) already established the identifier-naming layer of this doctrine from a different round's evidence; this round's lens3 found a candidate that renamed every identifier yet still read as a near-skeletal clone of its own named closest neighbor at the architecture layer — logged `confidence: high` (verified via a full side-by-side file read, not inference), `level: L1` (single-round instance of this specific architecture-layer framing; the skill's reproduction bar for L2 requires a second independent round, not just that it extends an existing L2 — this round's own candidate c is the counter-example precedent, showing the identifier-level test alone is passable while the architecture-level test is what actually separated the two outcomes).

No questions-queue entry — this round's lens conflict (the complete 3-way tie) is not a conflict between the canon and a candidate, nor between two lenses' stated criteria; it was resolved cleanly by an already-existing, already-questions-queue-settled procedure (`curation-criteria.md`'s Q2-derived tie-break rule), so there is nothing unresolved to queue.

## §6 — reassign-queue.md disposition

No `target: native` item was pending or consumed this round. a and c (both non-winners) passed the hard gate clean with zero 1-fix — this is a pure judgment-stage outcome (one from the tie-break procedure, not a hard-gate drop), so per this project's established disposition (gate-clean candidates that lose at judging are not reassign-queue candidates — that queue is specifically for hard-gate drops), neither is queued.

## §7 — Canon / commit scope

Unchanged throughout: `native/GENERATION.md` and `native/src/tokens.ts` (native's read-only canon, equivalent to the web target's brief files) were read for context only, never modified. `native-deltas-provisional.jsonl` append-only (1 new entry). `native/src/screens.ts` and `native/screens.json` were edited to register the three new candidates (`evolve-r46-a/b/c`) — this is the standard, expected registration step for an evolve-branch native round, not a canon edit (it does not touch the production screen catalog's existing entries). No commits to `main`; all work on `evolve/dash`.

**This completes both of this scheduled session's two requested rounds** — round 1 = `auto-dash-r54` (winner c, "Strata", clean 2:1 majority), round 2 = `auto-native-r46` (winner b, "Price History", resolved via the complete-3-way-tie procedure). 0 candidates dropped at hard gate across either round (round 1 used 2 total 1-fixes across its 3 candidates; round 2 used zero), 0 no-winner rounds, canon fully unchanged throughout both.
