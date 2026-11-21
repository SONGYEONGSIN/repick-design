# auto-native-r51 — DECISION

target: native · round: auto-native-r51 · date: 2026-11-06

## §0 orchestration notes

- `node scripts/round-budget.mjs --explain 2` → `1\t미채움 0종 — N≥2 의 근거(커버리지)가 없다` (all 18 `PAGE_TYPES` filled). This invocation runs exactly 1 round.
- Target drawn via the ordinary uniform `[dash,landing,native]` random pick → `native`. Not a Monday, so the native weekly-cadence override did not apply — native was reached by ordinary draw.
- **Note on this session's r50**: a prior invocation this session attempted `auto-native-r50` by delegating the *entire* round (including designer/judge spawning) to a single subagent, which correctly discovered it had no further subagent-spawn capability of its own and logged a no-round per §0-0's exact instructions. That was a correct no-round given that subagent's actual tool access, but wasteful — the top-level orchestrating session *does* have the Agent tool and can spawn designer/judge subagents directly. This round (`r51`) is driven directly by the top-level orchestrator (not delegated to a single subagent), which is why candidate generation and judging proceeded normally. `r50`'s no-round ledger entry stands unmodified (append-only).
- Agent tool confirmed available at the orchestrating level — used for all 6 subagent dispatches (3 blind `general-purpose` designers, 3 blind `general-purpose` judges; no custom `designer`/`comparator` agent type is configured in this environment). Not self-judged.
- `reassign-queue.md` "대기 중" section checked — no `target: native` entry pending. No reassignment consumed this round.
- Environment note: this sandbox could not download Playwright's own Chromium (network-blocked to `cdn.playwright.dev`). Gate/screenshot steps ran with `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium PW_NO_SANDBOX=1 CHROME_PATH=/opt/pw-browsers/chromium` — pre-existing env vars the repo's own scripts (`shot-native.mjs`, `capture-shots.mjs`, `dash-sweep.mjs`, lighthouse's chrome-launcher) already read; no script changes made.

## §1 RETRIEVE

Read: `native/GENERATION.md` (full), `native/src/tokens.ts` (full), `vault/00-principles/page-brief-core.md`, `vault/00-principles/page-brief-repo.md` (§1 English-only copy rule), `vault/00-principles/reassign-queue.md` (no native entry pending), `vault/00-principles/native-deltas-provisional.jsonl` (75 entries, recent context summarized into designer briefs), `vault/00-principles/curation-criteria.md`, `vault/20-catalog/ux-guidelines.catalog.md` Native/Mobile section + Plat=both rows, last 5 native ledger entries (r45-r49 + the r50 no-round), full production screen folder listing + evolve r23-r49 check-string archetype list for dedup. `catalog-variety.mjs` not run — native's theme/accent/face are fixed by DNA tokens (not applicable; recorded as fixed values in the ledger as in all prior native rounds).

## §2 GENERATE — target selection and assignment

Three candidates assigned, deliberately checked against the dedup list for domain novelty and for variety in bottom-band mechanic (per GENERATION.md §3's band-form taxonomy):

- **a** — "Item Swap Proposal" (Propose an Item Swap) — item-for-item barter proposal; **externally-gated block** (waiting on the other party's response, no self-unblock), a band-form variant not previously built in this codebase.
- **b** — "Combine Shipments" — multi-select purchased-unshipped items into one shipment with live-recalculated weight/cost; **selection-count-derived contextual bar** (an established, sanctioned form per GENERATION.md §3).
- **c** — "Authenticator Review Queue" — a new staff persona (item authenticator, distinct from this app's existing buyer/seller-facing screens) claims pending authentication cases from a shared queue; **claim-based row lock** (ownership-gated, not completion-gated — also not previously built).

Each designer received the full assembled brief in the prompt body (RN idioms, tokens.ts verbatim, DNA/band doctrine, accessibility rules including the `accessible={true}` trap and the accessibilityHint no-false-promise rule, determinism, the ₩-glyph caution note, the full dedup list, and an explicit "3 lenses simultaneously, code-surface reuse is judged even when the band shape is sanctioned" instruction), not file paths. Designers were explicitly told not to touch `native/src/screens.ts`/`native/screens.json` — the orchestrator registered all 3 centrally after collecting all 3 completion reports, to avoid the registration race flagged in prior rounds' history (r44/r45).

## §3 HARD GATE

`node scripts/gate.mjs --target native --screens evolve-r51-a evolve-r51-b evolve-r51-c` → **12/12 clean on first attempt**, 0 violations, 0 candidates used their 1-fix opportunity, 0 `blockedBy` cross-candidate failures (global `tsc` 0 errors). Freeze hash `8086bcaa2a4ff9c62afde9802a625e35b2b8b8d6`, unchanged from registration through gate through screenshot capture through judging. Full detail: `SCORES.md`.

## §4 JUDGE — 3-lens blind panel

Screenshots: 390px + 768px per candidate (6 frames total), Expo Web export+serve+Playwright screenshot, all visually confirmed non-blank, distinct, and free of the ₩-glyph strikethrough artifact this project has a documented unresolved history with. 3 independent `general-purpose` Agent-tool subagents, no cross-lens visibility, candidate concept notes (`candidates/*.md`) withheld from all 3 (blind to authorship/order).

### Lens 1 (DNA compliance) — ranking: **b > a > c**
All three pass RN-idiom, token, English-only, monochrome/no-emoji, and determinism checks cleanly (verified by grep: zero hardcoded hex, zero `Math.random`/`Date.now`/no-arg `new Date()`, zero Korean text, zero `accessible={true}` on any wrapper). Ranking decided on finer accessibility/band-doctrine clauses:
- **b**: clean. Selection-derived bar genuinely derived (`selectedCount > 0`, not an independent boolean, `CombineShipmentsScreen.tsx:171`); bar/banner structurally mutually exclusive by construction; destructive confirm correctly flips the surface; every `accessibilityHint` checked against its handler matches real immediate behavior; live-region alert tagging unconditional across both stages.
- **a**: one real violation — the `awaitingReply → confirmWithdraw` transition is a genuine state change but `messageIsAlert` (`ItemSwapProposalScreen.tsx:135`) excludes `confirmWithdraw`, so that confirm-prompt message renders without `accessibilityRole="alert"` despite being a reachability-change transition.
- **c**: one real violation — `ReviewCaseRow.tsx:184`'s `accessibilityHint` ("Unlocks this case so it returns to the open queue") describes the *Release* button, but that press only opens the inline confirm step (`handleRequestRelease`, screen `:104-106`) — the actual unlock happens on a separate, unhinted "Confirm release" button. A direct instance of "hint promises something that doesn't happen."

### Lens 2 (mobile-app completeness/polish) — ranking: **b > c > a**
Derived/computed state hand-traced against literal dummy data for all three; no functional defects found in b or c.
- **b**: weight/cost tiering hand-verified correct and boundary-inclusive; reducer actions (toggle/confirm/commit/undo) traced correct including single-level-undo semantics; ineligible item hard-disabled and visually distinguished; explicit `ListEmptyComponent` (the only candidate with one); all buttons have explicit `minHeight: 44-48`.
- **c**: single-claim invariant (`claimedCaseId: string | null`) verified structurally un-violatable across every traced path; summary counts hand-verified against `data.ts` and screenshots exactly; queue ordering (expedited-first, longest-wait-first) verified correct. One minor non-invariant-breaking rough edge found: `confirmingReleaseId` isn't cleared on `handleStartReview`/`handleDismissBlocked`, so a stray release-confirm prompt can remain open on one row while a block-conflict prompt shows on another — self-heals on next claim action, doesn't break the core invariant.
- **a**: state machine itself is bug-free, but two real polish gaps: (1) bottom-band buttons rely only on `paddingVertical` with no explicit `minHeight`/`hitSlop` anywhere in the file — likely at or under the repo's 44×44pt touch-target rule, unlike b/c which set it explicitly; (2) the primary CTA stays tappable-but-visually-muted (opacity 0.55) when incomplete rather than disabled, and pressing it doesn't do what its label says ("Send Proposal" that doesn't send) — a deliberate "never do nothing" choice but a non-standard idiom next to b/c, which only ever show a tappable CTA when the labeled action is actually available.

### Lens 3 (screen-type differentiation) — ranking: **b > c > a**
Full side-by-side reads of each candidate's nearest-neighbor files, not just domain-word comparison. No candidate is a macro-concept duplicate of anything in the existing catalog (confirmed independently).
- **b**: both assigned neighbors (`r46/c/BulkRelistScreen.tsx`, production `relist/BulkRelistScreen.tsx`) share the sanctioned selection-bar *form* but not the code surface — b's single `useReducer` architecture (vs. both neighbors' scattered `useState`), its added confirm-stage step (neither neighbor has one), its 4-file component split, and its non-overlapping style-key vocabulary are all real, non-cosmetic differences. Genuine new numeric-derivation mechanic (tiered shipping-cost recompute), not a renamed batch action.
- **c**: `SellerVerificationScreen` doesn't collide (c explicitly has no fixed bottom band, confirmed). `ActiveSessionsScreen`/`SessionRow` is the real nearest neighbor — the row-level destructive-confirm idiom is a legitimate, doctrine-sanctioned reuse (GENERATION.md §4 names `ActiveSessionsScreen` as its origin), with modest literal style-key overlap (4 identical generic key names: `metaLine`, `confirmText`, `confirmButton`, `confirmButtonPressed`) judged plausibly convergent rather than copied. The core claim-lock mechanic (single nullable `claimedCaseId`, cross-row conflict surfaced on a different row, permanently-dead-end "held elsewhere" rows) has no analog in `SessionRow`, which has no cross-row exclusivity at all — structurally new.
- **a**: two collision signals. (1) Shape collision with `r32/c/AppealNegativeReviewScreen.tsx` — its `"withTrustSafety"` externally-gated wait + in-band Withdraw→Cancel/Confirm→resolve flow nearly matches a's `awaitingReply`→`confirmWithdraw` flow almost phase-for-phase; the only structural difference is a's withdraw lands on a terminal state vs. the neighbor resetting to editable. (2) Literal style-key overlap with `r31/b/SecurityActivityLogScreen.tsx` — 4 of a's 5 band keys (`band`, `bandButtonPrimary`, `bandButtonSecondary`, `bandButtonDanger`) match token-for-token, weighted as moderate (generic vocabulary) but compounding with the shape collision above.

### Aggregation
**Unanimous 3-0 for b ("Combine Shipments").** No tie-break needed. Zero defects cited against b by any lens; freeze hash unchanged throughout judging — **no §3-1 post-judgment fix needed on the winner.**

### Non-winner findings (recorded, not fixed — S3-1 is winner-scoped only; per this project's established disposition, pure judgment-stage losses, even with a real bug or collision found, are not reassign-queue candidates — both a and c passed the hard gate clean, 12/12, so neither was a gate-level drop)
- **a**: missing `alert` tag on the withdraw-confirm transition (lens1); likely-sub-44pt touch targets + non-standard muted-but-tappable incomplete-CTA idiom (lens2); shape collision with `r32/c` + style-key overlap with `r31/b` (lens3).
- **c**: `accessibilityHint` false-promise on the Release button (lens1); stray uncle­ared `confirmingReleaseId` cross-row prompt edge case (lens2, non-invariant-breaking); modest generic style-key overlap with `SessionRow.tsx` (lens3, judged plausibly convergent).

## §5 LEARN

See delta appended to `vault/00-principles/native-deltas-provisional.jsonl` (round `auto-native-r51`, variant `b`, level L1).

## §6 refinement gate

Reviewed native-deltas-provisional.jsonl for clustering/conflicts against this round's new delta — no direct conflict found with existing entries. No reproduction claim made in this round's delta text (it's a fresh L1 observation, not an extension of a prior entry), so no L2 promotion check applies. No new questions-queue entry needed — no unresolved conflict or meta-criteria gap surfaced this round.

## §7 record

Canon (`dash-brief-v3.md`, `design-principles.md`, `page-brief-core.md`, `native/GENERATION.md`, `native/src/tokens.ts`, `/dash` gallery, `/v1`-`/v5`) fully unchanged throughout. `native/src/screens.ts` + `native/screens.json` edited (standard per-round registration, done centrally by the orchestrator after all 3 designers confirmed completion). `native-deltas-provisional.jsonl` append-only (1 new L1 entry). No commits to `main`, all work on `evolve/dash`.
