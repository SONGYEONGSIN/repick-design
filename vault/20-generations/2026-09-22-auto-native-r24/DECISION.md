# auto-native-r24 — DECISION

**Target:** native · **Round:** auto-native-r24 · **Date:** 2026-09-22

**Orchestration note (environment deviation):** the custom `designer`/`frontend-design-specialist` and `comparator` subagent types this skill names are not registered in this environment (`.claude/agents/` does not exist here). Substituted `general-purpose` Agent invocations for both GENERATE and JUDGE roles — three independent, parallel, blind agent calls per stage, same as the skill's blind/independent structure requires; only the subagent *type name* differs, not the isolation property §0-0 is actually guarding (no single session both generated and judged). Flagging per §0-0's disclosure requirement; `self_judged` is **not** set to `true` since the generation and judgment steps were performed by separate, independent Agent invocations with no shared context, which is exactly the property §0-0 requires.

## §0 Round-budget

`node scripts/round-budget.mjs "2"` → **N=1** (0 unfilled `PAGE_TYPES`, 2026-09-12 rule: requested N≥2 downgraded to 1 when the unfilled queue is empty). This is round 1 of 2 **outer** sequential `/dash-evolve` executions requested by the scheduled task; each outer execution independently computes its own round-budget N=1, so "2 consecutive rounds" is satisfied by running the full §0-7 cycle twice in sequence, not by a single call's internal N.

Target selection: `PAGE_TYPES` unfilled = 0 (all 18 types have catalog entries) → fallback uniform random over `[dash, landing, native]` → **native**. Today (2026-09-22) is Tuesday, not Monday, so the native weekly-cadence forcing rule did not apply — this was a genuine random draw.

Round number: `auto-native-r24` (max existing native round = r23, +1).

## §1 RETRIEVE

Read in full: `native/GENERATION.md`, `native/src/tokens.ts`, `vault/00-principles/curation-criteria.md`, `vault/20-catalog/ux-guidelines.catalog.md` (Native/Mobile + Plat=both sections), `vault/00-principles/native-deltas-provisional.jsonl` (all 46 entries), `vault/00-principles/reassign-queue.md` (no native-target items in "대기 중" — nothing to assign this round), `vault/00-principles/page-brief-core.md` (mostly web-specific; determinism/decisiveness principles noted as applicable, CSS-specific machine gates not). Reviewed `auto-ledger.jsonl` last 5 native entries (r19-r23) for dedup and recent band-form usage. `catalog-variety.mjs` run for completeness but is **not applicable to native** — theme/accent/face are fixed by `tokens.ts` DNA (light/indigo/system), confirmed by every past native ledger entry's `variety` field.

Dedup list assembled from `native/screens.json` (27 registered screens) + recent non-promoted attempts (Trade Proposal, Build a Saved Search, Compare Items, Invite Friends, Bundle Offer Builder).

## §2 GENERATE

Three concepts assigned to diversify band-form usage (recent winners: r19 state-machine, r21 destructive-confirm-band, r22 destructive-confirm-row, r23 selection-bar — state-machine and persistent-action-bar hadn't repeated recently, and a no-band screen hadn't appeared since r9):

- **a — "Report a Listing"** (trust & safety flagging flow): blocked-workflow state-machine band, own style-key names/copy (not reused from pickup/verification/disputes).
- **b — "Seller Sales Analytics"** (seller performance dashboard): persistent always-visible action bar (certificate precedent), reuses `LineChart`/`BarBreakdown`/`Sparkline`.
- **c — "Following Feed"** (social graph: follow sellers, filtered feed): no band at all (no blocking condition, no terminal action — r9 precedent).

All three designers worked independently and blind to each other. Source hash (candidates concatenated, sha1): `519fd8ed8da5a15cb579d2cd4b289f566733749c`.

## §3 HARD GATE

`node scripts/gate.mjs --target native --screens evolve-r24-a evolve-r24-b evolve-r24-c` → **12/12 pass, 1st attempt** — no 1-fix loop needed, no `blockedBy`. Full detail in `SCORES.md`.

Screenshots captured (Expo web export + serve + Playwright, 390px phone / 768px tablet, single scroll position each per this repo's native-branch convention — no multi-scroll capture for native): `shots/{a,b,c}-{390,768}.png`, all non-blank (49-72KB each), visually spot-checked before judging.

## §4 JUDGE

Three independent blind judges (general-purpose Agent, see orchestration note above), each given the same 6 screenshots + source files, no knowledge of each other's verdicts or of which candidate the orchestrator might favor.

| Lens | Criterion | Ranking |
|---|---|---|
| 1 | DNA / a11y compliance | **a** > c > b |
| 2 | Mobile-app completeness/polish | **b** > a > c |
| 3 | Screen-type differentiation | **c** > b > a |

**Complete 3-way tie on 1st place (1-1-1: lens1=a, lens2=b, lens3=c).**

### Tie-break

Per `curation-criteria.md` "주간 반증 판정 기준" ②: *"완전 동률 시 brief 렌즈 우선을 유지하되, archetype 렌즈가 그 후보를 최하위로 명시 판정했으면 동률 우승서 제외하고 나머지 중 brief 1위 재적용."*

Lens 1 (DNA/compliance) is the brief-lens; lens 3 (differentiation) is the archetype-lens. Lens 3 ranked lens 1's top pick, **a, in last place (3rd)** — this is exactly the stated exception condition (same structure as the `auto-native-r13` precedent in the ledger, where lens3 ranked lens1's pick `b` last, `b` was excluded, and lens1's ranking reapplied among the rest).

**Applying the exception**: exclude **a** from the tied-winner set. Reapply lens 1's ranking among the remainder {b, c}: lens1 ranked **c (2nd)** ahead of **b (3rd)**.

**Winner: c ("Following Feed"), 2:1-equivalent via tie-break exception** (not a raw majority — the tie-break, not a plurality vote, decided it; this is recorded distinctly from an ordinary 2:1 split).

### Why not a is also worth noting

Lens 1 gave a a strong, well-evidenced case (correctly exercises the hardest a11y rule — single live region, single alert, honest no-op hint, exact match to §4's documented rules). Lens 3's reason for ranking a last was not a quality defect but thinness of the interaction shell: a single required radio-select gate is the shallowest application of the state-machine form in the catalog, conceded in the candidate's own header comment. This is a real, cited structural critique, not a hand-wave — the tie-break exception is being applied on its merits, not as a formality.

### Why b lost outright (not just the tie)

Lens 1 found a genuine, previously-undocumented rule violation in b: `handlePeriodChange` (`SellerAnalyticsScreen.tsx:96-101`) fires from one user tap and changes content inside **two simultaneous `accessibilityLiveRegion="polite"` containers** at once — the hero `% change` region (`:147`) and the persistent action-bar region (`:219`, via `setCopied(false)`). GENERATION.md already prohibits two live regions ("라이브 리전을 두 개 이상 두지 마라"), but every prior native round's compliance with this rule involved screens with a single live region total; this is the first observed case of two individually-legitimate-looking live regions that only conflict because one user action can update both at once. See LEARN below.

## §3-1 Post-judgment fixes

None needed — lens 1 (the compliance lens) found the winner (c) fully clean on every checked item; no rule violations to resolve before promotion. Rank not recalculated (n/a — no fix applied).

## §5 LEARN

One delta appended to `vault/00-principles/native-deltas-provisional.jsonl` (see below) — the dual-live-region-from-one-action finding, since it's the round's most novel, mechanically-actionable observation and it's about a *failure mode* (reusable across future rounds) rather than a one-off design choice.

## §6 Refinement gate

Loaded full `native-deltas-provisional.jsonl` (46 prior entries + this round's new one). No conflicting pairs identified against this round's new delta (it's a refinement/extension of the already-existing "no more than one live region" rule, not a contradiction of it — GENERATION.md §4 already says "라이브 리전을 두 개 이상 두지 마라"; this delta specifies a way that rule can be violated even when each region looks locally correct, which is a clarifying elaboration, not a conflict).

**Level assessment**: this is a single-round observation (L1) about a *specific mechanism* new to this round, but it is mechanically verifiable (a static grep/AST check could in principle detect "one state setter that's referenced inside two different `accessibilityLiveRegion` JSX subtrees" or similar) — per curation-criteria's L2 bar ("2개 라운드 이상 재현되었거나 **하드게이트로 기계 검증 가능**"), it qualifies for immediate L2 on the *mechanical-verifiability* branch alone, following the `auto-native-r21`/`r22` precedent (accessible={true}-trap and destructive-confirm-row-generalization were both promoted straight to L2 on a single round for the same reason: mechanically checkable rule extension, no need to wait for a second round). Recorded at L1→L2 with `supersedes` in the same append (see appended entries below) — not yet promoted to GENERATION.md itself (that's a `/dash-falsify apply` decision, kept L2/provisional here per this skill's remit).

**Questions generated**: none — no conflicting pair, no meta-criteria-unjustifiable delta this round.

## §7 Ledger + commit

Appended to `auto-ledger.jsonl`; `vault/index.md` updated; committed to `evolve/dash` and pushed. See commit history for this run.
