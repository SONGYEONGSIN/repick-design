# DECISION — auto-dash-r50

target: dash · round 2 of this scheduled session's two back-to-back `/dash-evolve` executions; round 1 was `auto-native-r43` (winner b, "Return Window Extension Request"), committed+pushed (ac2ee27) before this round began.

## 0. Round budget + target draw

`node scripts/round-budget.mjs --explain 2` returned `1  미채움 0종` again (all 18 `PAGE_TYPES` filled) — only 1 round this invocation. Target drawn uniformly from `[dash, landing]` (`native` excluded, already drawn by round 1 this session) → **dash**. `reassign-queue.md` "대기 중" was empty at RETRIEVE (confirmed before GENERATE) — no reassignment this round.

`Agent` tool confirmed available and used throughout: 3 independent `general-purpose` subagents for GENERATE, 3 independent `general-purpose` subagents for the 1-fix pass. `self_judged: false` is moot this round — no judging occurred (see §3/§4 below).

## 1. RETRIEVE / target survey

Full dash catalog survey (production `/dash/d*` gallery + evolve `r44`–`r49`, macro-layout bucket coverage) delegated to a fork sub-agent. Found: `master-detail`/`feed-centric`/`calendar-board-centric` buckets overrepresented in the last 6 rounds (3-4× each); the brief's own named "fixed-rail + flex-1 + 2-option segment toggle" bucket and the production catalog's rail-free dense-bento shell (`/dash/d34` "Pulse") both unused recently. Dominant-viz types bubble/scatter, streamgraph, and slope chart all unspent in the recent window. `catalog-variety.mjs banList()` over the last 3 dash winners (`r47`/`r48`/`r49`) returned no active bans (nothing repeats 2×).

3 candidates assigned 3 distinct macro layouts and 3 distinct dominant-viz types, each with a freely-invented SaaS domain distinct from the catalog:
- **a** — Riskline (change-management/release-approval console): fixed-rail (440px) pending/approved queue + flex-1 detail pane, bubble/scatter dominant viz (blast-radius × rollback-risk per changed service). Light/blue/`--font-display-wide`.
- **b** — Inboxline (email-deliverability/sender-reputation console): hero + single dominant streamgraph (inbox-placement rate per mailbox provider, no competing stat strip). Dark/lime/none.
- **c** — Flagline (feature-flag/experimentation console): rail-free dense bento (precedented by production `/dash/d34`), slope chart dominant viz (before/after guardrail metric per experiment). Light/green/`--font-display-grotesk`.

Each designer prompt inlined the full assembled brief (dash-brief-v3 + page-brief-core + page-brief-repo content, condensed but complete — not paths) per the skill's own documented lesson (`auto-landing-r11` budget-exhaustion incident), plus this project's accumulated, judge-verified completeness/structural rules: the empty-by-default detail-panel penalty (L2, `r30`/`r40`), directional-icon-orientation cross-checking (`r41`), dead header primary-action buttons (`r41`), derived-number arithmetic consistency (`r42`/`r48`), the sidebar `SidebarContent`/row-flex `min-w-0` overflow bug (L2, `r45`/`r46`), sidebar nav needing real handlers at both desktop and mobile-drawer mounts (`r47`), and the mobile table-fallback/`min-w`-on-`<table>`-not-`<td>` grid-craft rules from `dash-brief-v3` itself.

## 2. GENERATE

3 real independent `general-purpose` Agent-tool subagents, run in background. Each self-verified with `npx tsc --noEmit` + `npx eslint` before reporting (all clean) and produced a `candidates/<v>.md` with a `## Brief gaps` section.

**Freeze hash** (post-generation, pre-fix): `b4079a8355421c6fd2cb270f49e5d60c58394cfe`.

## 3. HARD GATE

`node scripts/gate.mjs --target web --routes /dash-evolve/r50/<v>` for each candidate, round 1: **all 3 failed.**
- a: `sweep` table-overflow (1264–1366px, `table#0`) + `a11y` 94 (`button-name`, `label-content-name-mismatch`).
- b: `sweep` table-overflow (1264–1366px, `div#0`, 30–98px).
- c: `sweep` page-overflow at 390px (270px) + `a11y` 97 (`color-contrast`).

**1-fix pass** (one `general-purpose` subagent per candidate, each given the exact violations and this repo's own documented fix patterns for the matching bug class — e.g. the `r46` L2 `min-w-0`-on-ancestor pattern for the overflow violations, the `sr-only sm:not-sr-only` pattern for `button-name`). All three reported plausible, doctrine-matching root-cause diagnoses and applied targeted fixes; full detail in `SCORES.md`.

**Re-gate, round 2 — all 3 re-failed.** Before re-gating, discovered and eliminated an environment confound: a stale `next-server` process from this session's *first* round (native, started hours earlier at container boot) was still bound to port 3100 holding a corrupted Turbopack persistent cache (`Persisting failed: Another write batch or compaction is already active`), causing transient 500s on a naive restart. Killed all stale processes (`next dev` wrapper + orphaned `next-server` worker + defunct child), wiped `.next`, did a fully clean restart, and confirmed HTTP 200 on all 3 candidate routes before re-gating — eliminating cache staleness as an explanation for what followed.

With a confirmed-clean server: **a re-failed worse** (`div#0` overflow grew from 22px to 125px at 1264px; a wholly new `table#1` violation appeared at all 4 widths — the re-wrap introduced a second overflow source rather than resolving the first; a11y did reach 100). **b re-failed unchanged** — all 4 violations reproduced to the exact pixel (98/87/41/30px), meaning the `min-w-0` additions had zero measurable causal effect on the measured overflow. **c re-failed unchanged** — the 270px violation at 390px reproduced identically despite `min-w-0` added to all 5 bento-grid children (a11y did reach 100).

**Per §3 ("재실패 시 탈락"), all 3 candidates are dropped.** Zero candidates survive to §4 JUDGE.

## 4. JUDGE — did not occur

§4 presupposes "생존 후보 2개 이상" (normal panel) or "1개면 단독 심사" (single-candidate fallback). With zero survivors, neither precondition holds — there is nothing to blind-judge. This is **not** a judged no-winner round (where a panel convenes and splits 2+ no-winner votes); it is a hard-gate washout one stage earlier in the pipeline. No `judges` votes exist this round.

## 5. LEARN — did not occur

§5 extracts a delta from the winning candidate's judgment rationale. There is no winner and no judgment rationale to extract from. No new delta appended to `dash-deltas-provisional.jsonl` this round.

## 6. Refinement gate — a new question instead

The round's one substantive, reusable finding isn't a design delta but a **process/tooling** one: two of the three 1-fix attempts applied the exact, doctrine-matching fix pattern this repo already codified (`auto-dash-r46` L2's "add `min-w-0` to the flex/grid ancestor that's missing it") and produced **measurably zero effect** on the targeted violation — not a partial improvement, the identical pixel values before and after. That's a strong signal the fix pattern, as currently understood/applied, is incomplete for this failure shape, or that the 1-fix subagents (which lack Playwright/the dev server in their own sandboxes and could only reason from source + arithmetic, never re-measure) are structurally under-equipped to verify their own fix before reporting it done. Filed as **[[questions-queue]] Q71** (new — no existing question covers "a correctly-diagnosed, doctrine-matching fix measurably fails to move the needle"), with a tentative hypothesis that 1-fix subagents need real gate/dev-server access, not just source-reading, to be reliable.

## 7. Canon + scope + reassignment

Canon (`dash-brief-v3.md`/`page-brief-core.md`/`page-brief-repo.md`/`design-principles.md`/all type profiles/`/dash` gallery/`/v1`–`/v5`) untouched throughout. `questions-queue.md` append-only (1 new entry, Q71). `reassign-queue.md` edited — candidate `b` ("Inboxline") queued as #17 (the most clearly diagnosed of the three re-fails: a specific, named violation with explicit guidance not to repeat the exact fix attempt that already failed). Candidates `a` and `c` are equally eligible (rule-violation drops) but not queued, per the queue's established one-per-round convention — noted in the queue entry with reasons (a's re-fail got *worse* with an unidentified new failure mode; c's overflow magnitude, 270px, is large enough to suggest a less tractable reassignment). All 3 candidates' source remains on disk under `app/src/app/dash-evolve/r50/{a,b,c}/` and their concept docs under `vault/20-generations/2026-10-27-auto-dash-r50/candidates/` for future reassignment. No commit to `main` — all work on `evolve/dash`.

This completes both of this scheduled session's two requested rounds: round 1 = `auto-native-r43` (winner b, "Return Window Extension Request", 2:1), round 2 = `auto-dash-r50` (**no winner — hard-gate washout, 3/3 candidates dropped after 1-fix re-failure**). 0 no-winner-by-judging rounds; this round's non-winning outcome is a hard-gate washout, a distinct and rarer failure mode, fully disclosed above and in `SCORES.md`. Canon fully unchanged throughout both rounds.
