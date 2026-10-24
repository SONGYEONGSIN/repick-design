# auto-dash-r43 — SCORES

Target: dash. Round-budget: `node scripts/round-budget.mjs 2` → **1** ("미채움 0종 — N≥2 의 근거(커버리지)가 없다"). The scheduled 2-round request is satisfied by running this whole `/dash-evolve`-equivalent execution twice in sequence (this is round 1), not by a single invocation internally looping twice — consistent with `auto-native-r29`'s prior note on the same scheduling pattern.

Target draw: unfilled PAGE_TYPES = 0 → fallback random draw among `[dash, landing, native]` → **dash**. Today (2026-10-18) is a Sunday, not Monday — no native weekly-cadence override applies. `reassign-queue.md` "대기 중" section is empty for `dash` — no reassignment item consumed this round.

Environment note (not a skill/script change — session-local workaround): this sandbox's pre-installed Playwright Chromium is revision 1194 (Chromium 141.0.7390.37), while this repo's `playwright-core@1.61.1` expects revision 1228 (Chrome for Testing 149.0.7827.55), and `npx playwright install` cannot reach `cdn.playwright.dev` from this sandbox. Gated with `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome`, `CHROME_PATH=<same>`, `PW_NO_SANDBOX=1` env vars (both `dash-sweep.mjs` and Lighthouse/chrome-launcher already read these without any script edits — `PW_CHROMIUM_PATH` is read by `dash-sweep.mjs:146`, `CHROME_PATH`/`PW_NO_SANDBOX` are standard chrome-launcher/Lighthouse env vars). Precedent: `auto-native-r20`/`auto-native-r16` used the identical `PW_CHROMIUM_PATH` workaround for the native/1228 mismatch.

## Candidates

| v | Product | Macro shell | Dominant viz | Theme/accent/face |
|---|---|---|---|---|
| a | Meterbase (usage-billing revops) | Master-detail, tier-3 fan-out (inline row expand) | Sankey (4-stage signup→paid funnel) | light / blue / grotesk |
| b | Driftline (retail shrinkage) | 3-pane market, tier-2 fan-out (pin+guarded hover) | Waterfall/bridge (8 bars) | dark / teal / mono |
| c | Undertone (support-ticket feedback intel) | Feed-centric, tier-1 fan-out (2 independent selections) | Word cloud + sentiment (first-of-catalog) | light / rose / none (Pretendard-only) |

Source freeze hash (`cat r43/*/*.ts r43/*/*.tsx | shasum`) at GENERATE completion, before 1st gate: `73b09a52929369d6126a3b5b548853795f10174b`.

## Hard gate — attempt 1 (all three, full Lighthouse)

| v | route | types | static | lint | weights | sweep | focus | console | a11y | perf |
|---|---|---|---|---|---|---|---|---|---|---|
| a | ✅ | ✅ | ✅ | ❌ 2× `react-hooks/set-state-in-effect` (`command-palette.tsx:69,78`) | ✅ 3종 | ✅ | ✅ | ✅ | ❌ 97 (`color-contrast`) | ✅ 68 |
| b | ✅ | ✅ | ✅ | ✅ | ✅ 3종 | ❌ `cell-overlap`×4 (category↔amount, 390/1264/1280px) + `table-overflow`×18 (1264–1680px, 40px→3px) | ❌ `focus-invisible` (command-palette input, bare `outline-none`) | ✅ | ❌ 96 (`button-name`) | ✅ 61 |
| c | ✅ | ✅ | ✅ | ✅ | ✅ 3종 | ❌ `cell-overlap`×21 (390px, theme-rank-list + feedback-feed headers/badges/time, systemic) | ✅ | ✅ | ❌ 93 (`color-contrast`, `target-size`) | ✅ 67 |

**pass:false for all three on attempt 1.**

## 1-fix (one allowed revision each, sent via SendMessage to the originating designer agent)

- **a**: fixed both `set-state-in-effect` violations (moved resets out of effects into the open-toggling handler + derived `safeActiveIndex`). *Orchestrator note: the first-attempt `color-contrast` failure was not included in this fix request — an orchestration oversight (the first full-Lighthouse gate run that surfaced it happened during environment debugging, before the 1-fix message was composed, and its output wasn't carried over). This is the same failure-mode the repo has already named for `auto-dash-r41/a` (orchestrator table misdiagnosis) — logged honestly rather than granting an extra, unsanctioned fix round.*
- **b**: fixed the overlap (bounded `Pill` to `max-w-full overflow-hidden`, `min-w-0`/`overflow-hidden` on cells, shortened "Admin / paperwork error"→"Admin error"), removed the `min-w-[680px]` floor and rebalanced `<colgroup>` to 8/22/19/15/16/11/9, fixed the dead `outline-none` focus idiom, fixed `button-name` (account-menu label was `hidden sm:inline`, a11y-invisible below `sm` → `sr-only sm:not-sr-only`).
- **c**: fixed `color-contrast` (`zinc-500`→`zinc-600` where rows self-tint to `bg-rose-50`) and most of `target-size` (`SortHeader`/rank-list buttons → `min-h-6`; word-cloud terms → `min-h-7/min-w-7` + inverted z-index so small terms are never occluded by larger siblings); restructured both tables into a `sm:hidden` card-list + `hidden sm:block` table split to kill the systemic 390px cell-overlap class at its root (flex-wrap can't overlap).

## Hard gate — attempt 2 (final — one fix consumed, re-fail ⇒ drop per §3)

| v | types | static | lint | weights | sweep | focus | a11y | perf | **verdict** |
|---|---|---|---|---|---|---|---|---|---|
| a | ✅ | ✅ | ✅ (fixed) | ✅ | ✅ | ✅ | ❌ **97, `color-contrast` persists** | ✅ 64 | **DROPPED** |
| b | ✅ | ✅ | ✅ | ✅ | ❌ **new** `cell-overlap`×2 (390px, header row: "Investigator"↔"Status" 27px, "Status"↔"Logged" 5px) + residual `table-overflow`×4 (1264px 6px, 1280px 4px — shrunk from 40px/39px but not eliminated) | ✅ (fixed) | ✅ 100 (fixed) | ✅ 68 | **DROPPED** |
| c | ✅ | ✅ | ✅ | ✅ | ✅ **0 (fixed)** | ✅ | ❌ **97, `target-size` persists** (improved from 93) | ✅ 66 | **DROPPED** |

All three candidates fail on the final attempt. **No candidate reaches §4 JUDGE — 0 survivors.**

## Verdict

**NO WINNER** (hard-gate stage; judge panel never convened — per §4 this only runs "생존 후보 2개 이상 / 1개면 단독 심사", and here there were 0). No forced winner. See DECISION.md.
