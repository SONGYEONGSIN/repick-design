# auto-native-r31 — DECISION

Target: native · Round: auto-native-r31 (first of 2 sequential rounds in this scheduled run) · Date: 2026-10-06

## Orchestration notes

- This session is a scheduled autonomous run asked to execute `/dash-evolve 2` (two sequential rounds). `node scripts/round-budget.mjs "2"` returned **N=1** (`--explain`: "미채움 0종 — N≥2 의 근거(커버리지)가 없다" — all 18 `PAGE_TYPES` are filled). Per skill §0-0-1, a requested N≥2 that the script downgrades to 1 means **this single `/dash-evolve` execution runs exactly 1 round** — the "2 consecutive rounds" request is satisfied by running the whole §0–§7 playbook twice, sequentially, as two independent executions (this is the same resolution this repo's own ledger shows prior scheduled runs taking, e.g. `auto-dash-r34`/`auto-native-r28`, `auto-native-r26`/`auto-dash-r...`, `auto-native-r29`/`auto-dash-r35`).
- Target draw: all `PAGE_TYPES` filled → uniform random draw over `[dash, landing, native]` → **native**. 2026-10-06 is a Tuesday, not Monday, so the native weekly-cadence forcing rule did not apply (this was a genuine random draw landing on native, not the cadence override).
- `reassign-queue.md` "대기 중" had no native-target entry — no reassignment applied this round.
- Agent-tool availability confirmed before starting (§0-0 precondition) — this environment exposes the `Agent` tool with general-purpose subagents (no dedicated `designer`/`comparator` agent types), so 3 independent `general-purpose` agents were used for GENERATE and 3 more independent `general-purpose` agents for JUDGE, each blind to the others' work and to each other's identity/order (no `self_judged` flag needed).
- Native deps (`native/node_modules`) were not yet installed this session — installed via `npm install`, then the full 4-gate `validate.sh` pipeline was smoke-tested against the existing `watchlist` screen before dispatching designers. Playwright's own bundled Chromium download is blocked by this environment's egress allowlist (`cdn.playwright.dev` 403) — the environment ships a pre-installed Chromium at `/opt/pw-browsers/chromium`, which all three Playwright-driving scripts (`gate.mjs`, `capture-shots.mjs`, `shot-native.mjs`, `native/scripts/validate.sh`) already respect via the pre-existing `PW_CHROMIUM_PATH` env-var override — exported manually per command in this non-interactive shell (`~/.bashrc` additions aren't sourced by this harness's non-login shells).

## GENERATE

3 candidates assigned distinct, currently-under-represented band forms (recent rounds r27–r30 cycled almost entirely among blocked-workflow / selection-bar / per-row-destructive-confirm; the "no fixed chrome, responsibilities split across the body" form (r9 lineage) hadn't recurred in several rounds):

- **a — Export Account Data**: blocked-workflow state machine (drafting → compiling → packaged), with a genuine auto-retract-to-drafting rule when inputs change after submission (closing the "stale ready badge" gap this repo's delta history names).
- **b — Security Activity Log**: persistent always-visible action bar on a read-only security-event log (not a state machine — there's no blocked workflow on a completed-record screen).
- **c — Price Drop Alerts**: zero fixed chrome — a scrolling top live-counter chip + per-row inline threshold editors, following the r9-lineage "split the band's two jobs across the body" pattern.

Each designer was instructed **not** to borrow style-key names or copy-template phrasing from any existing screen, and was given the DNA/tokens/a11y rules as inlined prose rather than pointed at a single "structurally closest" reference file to copy from (the Q57 correction from `auto-native-r29`'s no-winner round, reapplied here as it was in `r30`).

Source hash (frozen immediately before gating): `0721373760afbd95dbbbf36d6e0827fbf600b331` (`cat native/src/evolve/r31/*/*.tsx native/src/evolve/r31/*/*.ts | shasum`). Unchanged through judging — no re-gate needed.

## HARD GATE

`node scripts/gate.mjs --target native --screens evolve-r31-a evolve-r31-b evolve-r31-c` → **12/12 clean on first attempt, no 1-fix needed.** See `SCORES.md`.

## JUDGE PANEL

3 independent blind judges (390px + 768px screenshots + source, no concept docs, no cross-lens visibility):

| Lens | Focus | Ranking |
|---|---|---|
| lens1 | DNA/a11y compliance | b > c > a |
| lens2 | mobile completeness/polish | a > b > c |
| lens3 | screen-type differentiation | c > b > a |

**Complete 1-1-1 three-way tie on 1st place.** Tie-break procedure applied (curation-criteria "주간 반증 판정 기준" ②, same mechanism as `auto-native-r27`): the default in a complete tie is brief/compliance-lens (lens1) priority, **unless** the differentiation lens (lens3) ranked lens1's pick dead last. Lens1's pick is **b**; lens3 ranked b **2nd**, not last (lens3 ranked **a** last). The exclusion condition does not hold, so the **default applies: lens1 priority wins.**

**Winner: b (Security Activity Log).**

### Why each lens landed where it did (concrete, not impressionistic — full per-lens detail in the judges' own reports)
- **lens1** found zero rule violations in b (exactly one `accessibilityLiveRegion`, a *conditionally*-applied `accessibilityRole="alert"` only when the message just changed — the single most precise execution of that rule among the three — accurate hints matching handler behavior, in-place Cancel/Confirm instead of native Alert). It found concrete violations in **a**: 4 bare numeric spacing literals instead of `tokens.space(n)` (`AccountDataExportScreen.tsx:561,576,604,616`), and a hint (`ExportBand.tsx:69`) promising automatic email delivery that no code path performs (the only implemented delivery mechanism is a manual `Share.share()` action) — a direct instance of this repo's established "hint must not overpromise" rule.
- **lens2** ranked **a** first specifically because it is the only candidate calling a real native OS API (`Share.share()`, not a fake "copied"/"shared" label) and because its 3-phase state machine with auto-retract-on-edit is more state-machine-complete than b's or c's scope. It ranked b 2nd on genuinely-wired-but-less-native-integrated grounds, and c 3rd not because anything is broken but because c's domain (fully reversible toggle settings) simply doesn't exercise a destructive-action-safety or terminal-action axis at all.
- **lens3** ranked **c** first as the only candidate with a genuinely distinct outer silhouette this round (zero band/bar at all — both a and b use the "scrollable content + fixed bottom band/bar" macro bucket, making this round a 2-horse race at the skeleton level between a and b). It ranked **a** last specifically because the blocked-workflow gating half of that screen is a near-literal re-implementation of the catalog's established blocked-workflow shell (only the processing/packaged phases are genuinely new material), and flagged a's `confirmRow` style object shape as matching a known generic reusable confirm-pair template rather than being independently composed for this domain.

### Post-judgment fix (§3-1)
None needed. No lens found a rule violation in the winner **b** — lens2's and lens3's critiques of b (no native-API call; recognizable sub-mechanics combined rather than a wholly new primitive) are taste/differentiation judgments, not rule violations, so §3-1 does not apply.

## LEARN

1 new L1 delta appended to `vault/00-principles/native-deltas-provisional.jsonl` (see entry `round: auto-native-r31, variant: b`): the single-live-region doctrine's `accessibilityRole="alert"` should be applied **conditionally** — only when the live region's current text reflects a just-occurred state change — not unconditionally on the live-region Text node regardless of whether anything has changed yet. Evidenced by the direct contrast lens1 drew between b's `accessibilityRole={liveMessage ? "alert" : undefined}` and a's unconditional `accessibilityRole="alert"` applied even to static, unchanged mount-time content.

## Canon

Unchanged — `dash-brief-v3.md`, `design-principles.md`, `page-brief-core.md`, type profiles, `native/GENERATION.md`, `native/src/tokens.ts` all untouched. `/dash` gallery and `/v1–v5` untouched. jsonl files only appended to.
