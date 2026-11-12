# DECISION — auto-native-r49

Round 1 of this scheduled session's two requested back-to-back `/dash-evolve` invocations (unattended, 2026-11-05).

## §0 Round budget
`node scripts/round-budget.mjs "2"` returned **N=1** (`--explain`: "미채움 0종 — N≥2 의 근거(커버리지)가 없다" — all 18 `PAGE_TYPES` are filled). Per the skill's own rule ("호출자가 2 이상을 줬어도 스크립트가 1을 내면 1라운드만 돌고 그 사실을 DECISION 첫 절에 적는다"), only 1 round runs in this invocation. The scheduled task's requested 2nd round follows as a separate, independent invocation re-reading this round's freshly-appended delta/ledger state.

## §0 Agent-tool availability
Confirmed available this session — used for all 6 subagent dispatches (3 blind `general-purpose` designers, 3 blind `general-purpose` judges; this environment has no registered custom designer/comparator agent type). Not self-judged (`self_judged: false`).

## §0 Target selection
2026-11-05 is a **Thursday** — no native weekly-cadence (Monday) forcing applied. `PAGE_TYPES` unfilled count = 0 (all 18 web page types have at least one catalog entry), so target was drawn by ordinary uniform random over `[dash, landing, native]` → **native**.

`vault/00-principles/reassign-queue.md` "대기 중" section confirmed empty for `target: native` at RETRIEVE — nothing to reassign this round.

Round number: `node -e` query against `auto-ledger.jsonl` for the max `auto-native-r*` sequence → **r49**.

## §0 Environment bootstrap (session-specific, not skill-prescribed)
- Fresh `npm install` at repo root, `app/`, and `native/` (first run in this container; `native/node_modules` was not present).
- Playwright's own Chromium download was blocked by sandbox egress (`cdn.playwright.dev` → 403 "no rule or allowlist entry allows host"). Worked around by symlinking the pre-installed `/opt/pw-browsers/chromium-1243` build to the revision name (`chromium-1228`) Playwright's installed `playwright-core@1.61.1` expects — no script changes; `gate.mjs`/`validate.sh`/`shot-native.mjs` already read `PW_CHROMIUM_PATH` via `process.env`, consistent with this project's prior session history (r43-r48 notes record the same class of workaround). Verified with a standalone `chromium.launch()` smoke test before proceeding.

## §1 RETRIEVE
Read in full: `native/GENERATION.md`, `native/src/tokens.ts`, `vault/00-principles/page-brief-core.md` (core — read every round regardless of target per skill rule), `vault/00-principles/curation-criteria.md`, `vault/20-catalog/ux-guidelines.catalog.md` (Native/Mobile + Plat=both sections), `vault/00-principles/reassign-queue.md` (no native entry), last 5 `auto-native-r*` ledger entries (r44-r48), and surveyed `native-deltas-provisional.jsonl` (74 entries, r1-r48) for established doctrine. `page-brief-repo.md` was **not** read — per the target-parameter table, that document is web-only (native's copy-language rule is self-contained in `GENERATION.md` §3).

**Dedup survey scope — explicitly covered both the production catalog AND the full evolve/ archive**, per the lesson in this project's own `questions-queue.md` Q72/Q63 (a prior round's RETRIEVE missed the production `native/src/*/` folders and only checked `evolve/`+`screens.json`, letting a near-duplicate of a production screen through to judging). This round: listed all 25 production screen folders (`native/src/<folder>/*.tsx`) by name/domain AND all 76 registered `evolve-r23..r48-*` check strings from `screens.json` — ~100 existing domains total, assembled into the designer brief's dedup list.

## §2 GENERATE
3 candidates assigned 3 distinct, deliberately-chosen-to-be-novel domains (none overlapping the ~100-item dedup list by name, checked against it explicitly before assignment):
- **a** = Nearby Sellers Map Browse (buyer discovery, abstract map/list toggle + filter sheet — no map SDK used, stylized percent-positioned pins)
- **b** = Item Comparison (multi-item side-by-side spec comparison table, frozen label column + scrolling item columns)
- **c** = Seller Onboarding Checklist (whole-screen sequential setup progress tracker, no bottom band)

Each designer received the full assembled brief (DNA rules, tokens.ts verbatim, accessibility rules including the conditional-alert/reset-to-empty and architecture-level non-reuse doctrines, determinism, the full ~100-item dedup list, recent band-mechanic trend list) **in the prompt body itself**, not as file paths — per this project's established "designer reads the assembled brief, not links" lesson (`auto-landing-r11` budget-exhaustion precedent, cited in the skill). All 3 designers confirmed (in their completion reports) they did not open each other's folders and did not read the dedup-list screens' source, only names.

`native/src/screens.ts` + `native/screens.json` were registered **centrally by the orchestrator** after all 3 designers' handback reports confirmed completion (not merely file existence), avoiding the registration race this project's history flags (r44/r45 notes).

Freeze hash (`cat native/src/evolve/r49/*/*.tsx native/src/evolve/r49/*/*.ts | shasum`): **`f145c929b7006812a2037314472a0294b6134892`** — unchanged from registration through gate through screenshot capture through judging (re-verified after gate).

## §3 HARD GATE
`npx tsc --noEmit` (native project-wide, run separately before the gate dispatcher as a sanity pre-check): 0 errors.
`node scripts/gate.mjs --target native --screens evolve-r49-a evolve-r49-b evolve-r49-c`: **12/12 clean on the first attempt** — `pass: true`, `violations: []`. Zero candidates used their 1-fix. Zero `blockedBy` cross-candidate failures. Full table in `SCORES.md`.

## §4 JUDGE
Screenshots: 390×844 and 768×844 (Expo Web export + serve + `scripts/shot-native.mjs`), 2 per candidate (6 total). All visually spot-checked by the orchestrator before dispatch — no blank frames, all distinct, non-overlapping real content.

3-lens blind panel (3 independent `general-purpose` Agent-tool subagents, no cross-lens visibility, `candidates.md` concept notes withheld from all 3, each lens's prompt included the full `GENERATION.md` text and explicit completion-format requirements: ranking + per-candidate reasoning + file:line/screenshot evidence + self-reported unchecked scope):

| lens | 1st | 2nd | 3rd |
|---|---|---|---|
| lens1 — DNA/GENERATION.md compliance | **c** | a | b |
| lens2 — mobile completeness | **c** | b | a |
| lens3 — screen-type differentiation | **b** | c | a |

**Clean 2:1 majority for c** (lens1 + lens2 both ranked c 1st; lens3 ranked c 2nd, not last, so the established 3-way-complete-tie exception — "exclude the brief-lens pick only if the differentiation lens ranked it dead last" — does not even need to be invoked here, since this isn't a complete 1-1-1 tie in the first place). Per `curation-criteria.md`'s "Q32 판정" (a 2:1 split is the *normal* result, not an anomaly needing a new rule), this is resolved as an ordinary majority vote. **WINNER: c — "Set up your shop to start selling" (Seller Onboarding Checklist)**.

Full per-lens reasoning and evidence: see `SCORES.md` (condensed from each lens's full report) and this session's conversation log for the complete verbatim subagent reports.

**Non-winner findings** (both on gate-clean candidates, so per this project's established disposition — r41/r42/r44/r45/r46/r47/r48 — pure judgment-stage losses, even ones surfacing a real bug or collision, are **not** reassign-queue candidates; reassign-queue is for hard-gate drops specifically):
- **a**: lens2 found a real, verified data/visual inconsistency — 2 of 10 sellers (`slr-secondstory` 6.2mi, `slr-analogaudio` 7.8mi) are drawn inside the map's own labeled "5 mi" ring despite their displayed distance exceeding it. lens3 found a's core scaffold (map/list toggle union, single-selection-id pattern, percent-positioned pin + `accessibilityState` pattern, callout-with-one-CTA shape) closely parallels `native/src/evolve/r40/b/ReturnDropoffScreen.tsx` — confirmed via full side-by-side reads of `ReturnDropoffScreen.tsx`/`CanvasPin.tsx`/`SiteDetailPanel.tsx`, the same architecture-level-collision class this project's doctrine (r46/a, r47/c precedent) already names. Real domain differences (distance-ring overlay, filter sheet, cross-mode scrollToIndex) were weighed but judged insufficient to clear the core-scaffold overlap.
- **b**: lens2 found the comparison table doesn't width-adapt at 768px, leaving dead space.

No post-judgment §3-1 fix needed on winner c — zero defects/violations cited against it by any lens; freeze hash unchanged throughout.

## §5 LEARN
1 new L1 delta appended to `native-deltas-provisional.jsonl` (confidence: medium — 2:1 majority, not unanimous), round `auto-native-r49`, variant `c`: generalizes GENERATION.md §3/§4's locked/no-op-hint doctrine to a new whole-screen checklist archetype — single derived `completedStepIds`-array state (vs. parallel per-field booleans or a free-order pending/done array) + hard sequential lock-chain + exhaustion explained on both visible copy and `accessibilityHint`. All 3 lenses independently corroborated pieces of this (lens1 compliance, lens2 correctness-trace, lens3's explicit full-neighbor-read confirming non-duplication).

## §6 지식 정제 게이트
No existing provisional delta makes the same reproduction claim this round's delta could be checked against — this is a genuinely new pattern (whole-screen sequential checklist, not a bottom-band variant), so **no promotion to L2** (consistent with this project's 2-3-round reproduction bar for judgment-based deltas). No charter/canon conflict found requiring a `questions-queue.md` entry — the 2:1 split resolved via the already-settled "ordinary majority" disposition (Q32), not a new judgment-system question.

## §7 Canon / invariant confirmation
`vault/00-principles/dash-brief-v3.md`, `vault/00-principles/design-principles.md`, the `/dash` gallery, and `/v1~v5` — **fully untouched**. `native/GENERATION.md` and `native/src/tokens.ts` — **fully untouched** (read-only canon). `native/src/screens.ts` + `native/screens.json` edited (standard per-round registration of all 3 candidates, not a canon edit). `native-deltas-provisional.jsonl` — append-only (1 new entry). No commits to `main` — all work on `evolve/dash`.

This is round 1 of this scheduled session's 2 requested rounds. Round 2 follows as an independent invocation after this one is committed+pushed, re-reading this round's fresh ledger/delta state and excluding `native` from its initial target draw only insofar as the ordinary uniform draw naturally varies (no forced exclusion rule exists for same-day repeats outside the Monday native-cadence rule).
