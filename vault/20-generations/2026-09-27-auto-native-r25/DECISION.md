# auto-native-r25 — DECISION

## §0 Deviations / round-budget note

- This run is the **second** of a scheduled 2-round-back-to-back request (`/dash-evolve 2` equivalent). `node scripts/round-budget.mjs 2` returned `1` for round 1 (`auto-dash-r31`, target `dash`) — 0 unfilled `PAGE_TYPES`, so per §0-0-1 that invocation was capped to a single round. This round is a **separate, independent execution** of the full §0–§7 playbook (its own fresh round-budget check would also return `1` given the same empty-unfilled-queue condition), run sequentially after round 1's commit landed, reading round 1's appended delta/ledger state as the "연속 라운드" section requires. Target selection (§0, dash/landing/native uniform random, since unfilled queue is still empty) excluded `dash` — already produced this session — and drew `native` from the remaining {landing, native}.
- Today (2026-09-27) is a **Sunday** (`getUTCDay()===0`), not Monday, so the native weekly-forcing rule did not apply — `native` was reached by the ordinary random draw, not the Monday override.
- **Genuine blind, independent judging** (unlike round 1 of this scheduled run, `auto-dash-r31`, which was self-judged because that execution's subagent had no nested Agent-spawn tool available to it). This round was orchestrated from the top-level session, which *does* have Agent-tool access, so all 3 designers and all 3 judges are separate, independent agent instances with no visibility into each other's output. `self_judged` is **not** set for this round.
- Environment note: sandbox Playwright Chromium revision is 1194; native's own `playwright` dependency requests 1228. Bypassed via `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium` (same precedent as `auto-native-r16`/`r20`/`r23`) — no skill or gate-script changes made.

## §1 RETRIEVE — summary

Read in full: `native/GENERATION.md`, `native/src/tokens.ts`, `vault/00-principles/native-deltas-provisional.jsonl` (all 50 entries), `vault/00-principles/reassign-queue.md` (no `native` entries pending — "대기 중" section currently only lists dash/landing items), `vault/00-principles/curation-criteria.md`, `vault/20-catalog/ux-guidelines.catalog.md` (Native/Mobile section + `Plat=both` rows), last 5 `auto-native-r*` ledger entries (r20 no-winner, r21 a, r22 b, r23 c, r24 c), `native/screens.json` + `native/src/screens.ts` for the existing catalog (29 screens before this round).

Dedup / macro-band-form precheck across the last 5 native rounds: no-band ×3 (r20 a/c, r24 c), blocked-workflow state machine ×2–3 (r20 b, r21 a-adjacent, r24 a), persistent action bar ×1 (r24 b), selection-driven contextual bar ×2 (r22 row-scoped variant, r23), milestone-ladder ×1 (r21 c). Round 25's three candidates were assigned the three most-established, best-differentiated band forms in genuinely new domains not yet in the catalog (trade-in credit, delivery receipt, saved-search management), each required to use fresh style-key vocabulary rather than the flagged reused names (`bandBlocked*`/`bandReady*`/`bandDone*`/`statusFor`/`jumpTo`).

## §2 GENERATE

3 designer agents dispatched in parallel (top-level session, genuinely independent, no cross-visibility):
- **a — Trade-In Appraisal** (`native/src/evolve/r25/a/TradeInAppraisalScreen.tsx`): blocked-workflow bottom-band state machine, own vocabulary (`dockedBar*`/`holdUp`/`revealCheckpoint`/`checkpointY`).
- **b — Delivery Receipt** (`native/src/evolve/r25/b/DeliveryReceiptScreen.tsx`): persistent always-visible action bar (read-only completed-record doctrine).
- **c — Saved Searches** (`native/src/evolve/r25/c/SavedSearchManagerScreen.tsx`): selection-driven contextual bottom dock (`SelectionDock`/`RecoveryRow`), with domain-specific derived logic (mixed pause/resume gating, cross-item merge).

All three wrote a `candidates/<v>.md` concept note with a "브리프에 없던 것" section (not reproduced here — see the files). Registered in `native/screens.ts`/`native/screens.json` as `evolve-r25-{a,b,c}` by the orchestrator after all three completed (designers did not touch these files, per instruction).

## §3 HARD GATE

`node scripts/gate.mjs --target native --screens evolve-r25-a evolve-r25-b evolve-r25-c` — **all 3 candidates passed all 4 gates (tsc/export/render/iframe) on the first attempt.** No 1-fix loop needed. Full detail: `SCORES.md`.

Frozen source hash (pre-judge): `08e2a7a55126811b48f755124c1be8964b9c4463` (`cat native/src/evolve/r25/*/*.tsx native/src/evolve/r25/*/*.ts | shasum`).

## §4 JUDGE — 3 independent lenses, 3–4 frames each (390px + 768px default-state screenshots)

### Lens 1 — DNA / accessibility compliance
**Ranking: 1st b · 2nd a · 3rd c.**
All three pass every hard-gated rule. b is the cleanest on the two doctrines this lens was told to scrutinize closely: single live region with the confirmation text itself as the live-region content (`DeliveryReceiptScreen.tsx:244-249`), and the ₩ glyph avoided entirely (writes "KRW" text, `data.ts:100-104`). a matches b on live-region/destructive-confirm co-location (`TradeInAppraisalScreen.tsx:369-388`) and correctly separates the ₩ glyph from the `tabular-nums` digit node (`:66-70`), but uses `.map()` instead of `FlatList` for its (short, fixed-length) option groups; on hardcoded sub-token spacing, the raw counts were a=7, b=10, c=2 (all three had some), which the judge treated as a minor tiebreaker rather than a deciding factor — all 7 of a's instances were fixed post-judgment per §3-1 below. c's real gap: its bulk-delete confirmation text (`SelectionDock`, `SavedSearchManagerScreen.tsx:150-152`) is plain, non-live-region text, while a *different* string is what the app's single `announcer` live region actually speaks (`:369-372`) — a real, citable split from the `r13/a` doctrine ("확인 문구 자체를 같은 라이브 리전이 낭독"), not a hard-gate violation but a genuine deviation → raised as **Q52** (questions-queue). c does correctly avoid the `accessibilityHint`-over-promise trap and has the fewest hardcoded spacing values (2) and correctly uses `FlatList` for its primary list.
Full reasoning, per-candidate file:line evidence, and self-disclosed unseen scope: preserved in the judge transcript; condensed above.

### Lens 2 — commercial mobile-app polish
**Ranking: 1st a · 2nd b · 3rd c.**
a has the richest real interactivity: a live-recomputed "Estimated Credit" hero figure driven by the same in-progress disclosure answers that gate the band (`estimateRangeKrw`, `data.ts:124-138`), per-question scroll-to-checkpoint precision (`revealCheckpoint`/`checkpointY`), and correct retraction of a filed submission on any subsequent edit (`retractFiling`). b is extremely well-executed for a simpler screen type (real Share/Save/Report state, correct information hierarchy — total-paid is unmissably the loudest number). c has the most sophisticated underlying logic (real mixed-state pause/resume gating, a genuine merge computation) but two real product issues: no way to actually reach a saved search's new matches from the row or its match-count pill (the row's only interaction is select-for-bulk-action), and a visually louder default state than the DNA's stated near-monochrome restraint (5 of 7 rows carry a solid accent-blue pill).

### Lens 3 — screen-type / interaction-shell differentiation
**Ranking: 1st a · 2nd c · 3rd b.**
a's style-key vocabulary and continuous-scroll layout share nothing with the `verification`/`disputes` blocked-workflow precedents (checked directly, file:line), its domain (trade-in credit to the platform itself) is new, and it gates on more conditions (6) than either precedent (3–4) — clears the "thinnest application" trap. Minor echoes: the "Tap to go there" hint string is verbatim shared with `verification`/`condition` (judged a widespread genre convention, not disqualifying), and the "live hero value derived from in-progress answers" trick has a precedent in `condition/ConditionAssessmentScreen`'s grade card. c's domain (a standing saved search, distinct from `watchlist`/`following-feed`) and its merge/pause derived logic are genuinely new, but its selection/undo scaffolding is a **near-verbatim code-surface port** of `evolve/r23/c/PhotoManagerScreen` (`toggleSelect`/`cancelSelection`/`undoDelete`/`dismissUndo` — matching control flow *and* verbatim strings "Selection cleared." / "Delete undone.") — the clearest instance of the "reused the right general principle, copied the specific mechanics" trap (r18/r19, L2) among all three candidates, though the layered domain logic on top is real and uncredited-elsewhere. b's own differentiation comment (vs. `certificate`) holds up, but the candidate never checked itself against the far closer sibling `order-status` — `OrderTrackingScreen` already models the same order/item/price/seller/carrier data and a chronological timeline with a near-identical terminal "funds released" framing; b's vertical timeline component also echoes `disputes`'s timeline component structurally.

### Aggregation
1st-place votes: **a — 2** (lens2, lens3) · **b — 1** (lens1). Clean 2:1 majority, not a complete tie — **no tie-break exception needed**. No no-winner votes from any lens.

**Winner: a — Trade-In Appraisal.**

## §3-1 Post-judgment remediation (rule-violation resolution only, no re-ranking)

Lens1 flagged 7 hardcoded sub-token spacing values in the winner (`marginRight: 3`, six `gap: 2`/`marginTop: 2` instances) that bypass `tokens.space(n)`'s 4/8 rhythm — the same defect class (though smaller magnitude) as the `auto-native-r23/c` precedent that was fixed post-judgment. Fixed all 7 to `tokens.space(1)` (4px) in `TradeInAppraisalScreen.tsx` (lines 516, 555, 679, 692, 729, 748, 767). Re-gated `evolve-r25-a` standalone: 4/4 pass, unchanged. This is a token-hygiene fix only (2–3px → 4px on tight label/note stacks and a currency-symbol gap) — not the kind of change that could plausibly move a 2-vs-1 lens split, so the ranking is **not** recalculated, per §3-1's own rule.

## §5 LEARN

One L1 delta appended to `vault/00-principles/native-deltas-provisional.jsonl` (round `auto-native-r25`, variant `a`, confidence high): a blocked-workflow band screen earns a stronger completion-lens read when it drives a live, continuously-recomputed hero value from the same in-progress answers that gate the band (not a gate bolted onto an otherwise-static form) — and separately, when the workflow allows post-submission edits, correctness requires those edits to auto-retract the prior submission rather than leaving a stale "filed" state beside newly-changed answers. Neither half is currently named by the existing L3 blocked-workflow doctrine (r3→r5→r6→r7).

## §6 Refinement gate

- No existing delta reached a new L2/L3 threshold this round (no 2-round reproduction of a not-yet-L2 claim; the compliance/differentiation findings above are fresh confirmations of already-L2/L3 rules, not new claims).
- **Forced question appended**: `questions-queue.md` **Q52** — does the `r13/a` "확인 문구 자체를 같은 라이브 리전이 낭독" doctrine require the *same string* to serve both the visual confirmation text and the live-region announcement, or is a synchronized-but-differently-worded announce sufficient? Candidate c (runner-up, not this round's winner) is the evidence case; did not affect this round's outcome since c did not win. Left open pending a future round where this exact pattern appears on a winning candidate.
- Canonical docs (`dash-brief-v3.md`, `design-principles.md`, `page-brief-core.md`) — **untouched**. `native/GENERATION.md` — **untouched** (no L3-worthy claim this round). `/dash` gallery and `works.ts` — **untouched**.

## §7 Record

- Ledger: `auto-ledger.jsonl` entry appended (see below).
- `vault/index.md` "세대 기록" updated.
- Commit + push to `evolve/dash`.
