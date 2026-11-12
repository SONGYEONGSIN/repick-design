# auto-native-r35 — DECISION

## 0. Round framing
- round-budget.mjs returned N=1 (`node scripts/round-budget.mjs --explain 2` → "미채움 0종 — N≥2 의 근거(커버리지)가 없다"). The scheduled request asked for 2 consecutive rounds; per skill §0-0-1 that request is satisfied by running the full §0~7 procedure twice sequentially, each invocation independently resolving its own N. This is round 1 of that 2-round session.
- 2026-10-12 is a Monday (UTC). Per the native weekly-cadence rule, N=1 on a Monday forces this round's target to **native**. Round number via the target-specific ledger sequence: 34 prior native entries → r35.
- Agent tool availability confirmed before starting (used throughout — 3 designer + 3 judge subagents, all `general-purpose` since the named `designer`/`comparator` custom agent types the skill references aren't defined in this environment; this substitution matches the established precedent from r31–r34).
- `reassign-queue.md` had no native entry waiting. No candidate was form-locked by reassignment.

## 1. Target assignment (orchestrator-level, informational)
Three domains, each deliberately steered away from the most recently saturated macro-forms (blocked-workflow state machine: r28, r31/a, r32/c, r34/a; row-3-state-no-band: r30/b, r32/b, r34/b; global destructive-confirm band: r30/a, r34/c):
- **a — Seller Response Templates**: selection-driven contextual bottom bar (underused since r32/a).
- **b — Local Pickup Zones**: no fixed band at all, row-level destructive-confirm (underused since r22/origin, r27/c).
- **c — Listing Boost Credits**: persistent always-visible bottom action bar on a read-only ledger (underused since r31/b).

Pre-GENERATE archive grep (per Q63's advisory, ported from the dash-side Q58 fix) found no real domain collisions for any of the three — only tangential unrelated string hits (documented in each candidate's own concept file).

## 2. GENERATE
3 parallel `general-purpose` designer subagents, each handed a fully assembled brief (full GENERATION.md content, full tokens.ts, relevant UX-catalog rows, open deltas, repo conventions — inlined as text, no bare paths) plus an explicit instruction to grep the archive for its own domain before finalizing and to write fresh style-key names/copy rather than reuse the one named comparison screen each was pointed at (a → `BulkRelistScreen.tsx`, b → `ActiveSessionsScreen.tsx`). All three designers completed (confirmed via explicit hand-back reports, not file-existence alone). Registration into `native/src/screens.ts` / `native/screens.json` was done centrally by the orchestrator after all three finished, to avoid parallel agents racing on shared files — matching r34's precedent. Each candidate's file needed one small orchestrator-added `export default <Name>;` line appended (designers were told to use named exports only; the registry's import style needs a default export, same pattern already used by every prior round's screens).

Freeze hash (`cat native/src/evolve/r35/*/*.tsx native/src/evolve/r35/*/*.ts | shasum`): `339c062cd66b7e1e49ad9a3011faf55f211029c8` — verified unchanged immediately before and after the hard gate run.

## 3. HARD GATE
`node scripts/gate.mjs --target native --screens evolve-r35-a evolve-r35-b evolve-r35-c` — **12/12 clean on first attempt**, no 1-fix loop needed, no candidate dropped. See `SCORES.md`.

(Environment note: this sandbox has no outbound access to `cdn.playwright.dev`, so the pinned Playwright browser revision couldn't be downloaded. Worked around with the pre-installed Chromium at `/opt/pw-browsers/chromium` via `PW_CHROMIUM_PATH` — every native script (`capture-shots.mjs`, `dash-sweep.mjs`, `shot-evolve.mjs`, `iframe-check.mjs`) already supports this env var, so no script changes were needed.)

## 4. JUDGE PANEL
Screenshots: 390px + 768px per candidate (native spec — no multi-scroll frames, that's web-only), all 6 verified non-blank before judging. 3 independent `general-purpose` judge subagents, no cross-lens visibility, each given the full rule text inline (not paths) plus named mandatory comparison targets for the duplication check.

| lens | ranking | no-winner votes |
|---|---|---|
| lens1 (DNA/GENERATION.md compliance) | a > b > c | none |
| lens2 (mobile completeness) | c > a > b | none |
| lens3 (screen-type differentiation) | b > a > c | none |

**Complete 3-way tie on 1st place (1-1-1: lens1→a, lens2→c, lens3→b).**

### Tie-break (curation-criteria.md "Q1~Q5 답변 ②")
> 완전 동률 시 brief 렌즈(렌즈1) 우선을 유지하되, 렌즈3(archetype/차별성)이 그 후보를 최하위로 명시 판정했으면 동률 우승서 제외하고 나머지 중 brief(렌즈1) 1위 재적용.

Lens1's pick is **a**. Did lens3 rank **a** last? No — lens3 ranked a 2nd (b > a > c; c was last for lens3). The exclusion condition does not hold, so the default applies: lens1/compliance priority wins.

**Winner: candidate a (Seller Response Templates).**

### Per-lens reasoning summary
- **lens1** ranked a and b both fully clean (zero rule violations in either), with a's edge over b being a genuinely thin, explicitly-acknowledged tiebreaker: a correctly implements *two* distinct live-region sub-patterns in one screen (a purely-derived, never-cleared selection-count alert AND an actively-cleared "just happened" toast alert), while b only needed and implemented the simpler single pattern. Candidate c had one concrete rule-2 violation: a hardcoded `rgba(255,255,255,0.16)` divider color not sourced from `tokens` (`ListingBoostCreditsScreen.tsx:293`).
- **lens2** found c the richest and most fully-wired (real `Share.share()`, hand-traced 12-row running-balance fold matching the screenshots exactly), a close second with zero dead affordances, and b third due to one concrete dead affordance: the empty-state "Add a pickup zone" button (`LocalPickupZonesScreen.tsx:138-144`) has no `onPress` at all — a reachable state (remove all 6 zones) with no way out.
- **lens3** did real side-by-side diffs against the three named comparison files. a vs `BulkRelistScreen.tsx`: shared selection-bar scaffold and a couple of generic names (`clearSelection`, `selectedCount`) but materially different control flow (Alert-gated confirm + whole-array undo snapshot vs. instant-apply + per-field undo) and non-overlapping style-key prefixes — ruled legitimate reimplementation. b vs `ActiveSessionsScreen.tsx`+`SessionRow.tsx`: simpler 2-state vs. the reference's 3-state machine, paraphrased (not copied) style/copy keys, plus an added toggle mechanism the reference entirely lacks — "strongest of the three on this axis." c vs `auto-native-r29/a` (Loyalty Points Statement): weakest case — near-identical fold-based balance-integrity architecture *and* near-identical share+toggle-explainer bar shape, articulated in similarly-worded code comments; not a literal clone but "reads most like the same screen with different words."

### Post-judgment check (§3-1)
Winner **a** was flagged with zero rule violations by any of the three lenses (lens1: clean; lens2: zero dead affordances, both actions real; lens3: legitimate reimplementation, no literal duplication found). **No post-judgment fix needed** — the winner ships exactly as judged.

## 5. LEARN
One new L1 delta appended to `native-deltas-provisional.jsonl` (round `auto-native-r35`, variant `a`): the two-sub-pattern distinction for conditional `accessibilityRole="alert"` (purely-derived/never-needs-clearing vs. "just happened"/must-actively-clear), extracted directly from lens1's decisive tiebreak reasoning.

## 6. Refinement gate
Promoted the `auto-native-r31`→`auto-native-r32` self-clearing-timeout rule to **L2** (new entry appended, `supersedes: "auto-native-r31"`, original lines left untouched per the append-only rule). Reasoning: r31 (origin) → r32 (correction: conditional alone is insufficient without active clearing) → this round provides two further *independent* confirmations (r35/a and r35/b, built by designers with no visibility into r31/r32's text, both correctly self-clearing per lens1's explicit audit, with zero further correction needed) — meets curation-criteria's 2-round+ reproduction bar.

No conflicting delta pairs and no delta that curation-criteria's checklist couldn't justify were found this round — **no new questions-queue entry**.

## 7. Scope / invariants
Canon (`dash-brief-v3.md`, `design-principles.md`, `page-brief-core.md`, `native/GENERATION.md`, `native/src/tokens.ts`) — **unchanged**. `/dash` gallery and `/v1~v5` — untouched (native round, doesn't touch web routes). jsonl writes — append-only throughout (verified: only new lines added to `native-deltas-provisional.jsonl`, no existing lines edited). No commits to `main` — all work on `evolve/dash`.

Candidates b and c (non-winners) keep their routes/registry entries in place per standard practice — subject to weekly `/dash-falsify` review, not dropped here.
