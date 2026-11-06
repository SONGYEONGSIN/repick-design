# auto-dash-r46 — DECISION

## 0. Round-budget / scheduling note

Round 2 of this scheduled session's two back-to-back `/dash-evolve`-equivalent executions. Round 1 (`auto-dash-r45`) won on candidate a ("Vendly"), committed+pushed before this round's RETRIEVE began — this round read r45's fresh ledger entry and both new deltas before drawing a new target. `round-budget.mjs --explain 2` again returns **1** (0 unfilled `PAGE_TYPES`) — same reading as round 1. Subagent availability (§0-0) reconfirmed: `Agent` tool present; no named `designer`/`comparator` persona types in this sandbox, `general-purpose` used throughout for GENERATE and JUDGE, independence preserved (each a fresh instance with no shared context). Native weekly cycle: still Tuesday (`getUTCDay()===2`), not Monday — rule does not apply.

Target determination: `PAGE_TYPES` unfilled count is still 0 (r45's winner is not yet promoted into `works.ts` — that happens at a later `/dash-falsify apply` step, not immediately), so the random draw ran again independently and **landed on dash again** — a coincidence this exact session's own precedent already names as expected behavior (`auto-dash-r35`/`r36`, `r37`/`r38` native-native precedent cited in the skill itself).

Round number: next `auto-dash-r*` after r45 → **r46**. Run dir: `vault/20-generations/2026-10-20-auto-dash-r46/`.

Reassign-queue (§1): dash queue still empty (unchanged since r42) — all 3 candidates free exploration.

## 1. RETRIEVE

Re-read DELTAS fresh (now including both deltas r45 appended — the chord-diagram radial-label-clipping L1 entry), re-ran `catalog-variety.mjs` (works count unchanged at 65, since r45's winner isn't promoted yet), and recomputed the macro-bucket/chart-type avoid-list to additionally exclude this session's own immediately-preceding round: parallel-coordinates+master-detail-folded, Marimekko+board-centric, and chord-diagram+feed-centric (all three from r45), on top of the standing 6-round avoid-list already carried forward. `banList(window=3, themeRun=2)` computed on the 3 most recent dash ledger entries (`[r45 {light,indigo,wide}, r44 {dark,amber,grotesk}, r43 {no clean single-winner theme}]`) comes out empty on all three axes (the theme run breaks at r43, which has no single winner theme field) — same empty result as r45's own RETRIEVE, but the two most recent *rounds'* actual axes (r45: light/indigo/wide, r44: dark/amber/grotesk) were still passed to designers as "immediately preceding axes to diversify away from," per the skill's continuous-round instruction.

## 2. GENERATE

Three `general-purpose` subagents dispatched in parallel with the fully assembled brief text in-line, plus the same distilled "known pitfalls" list used in r45 (now updated to also flag the new L1 radial-label-margin lesson from r45/c).

| v | product | dominant visualization (first-of-catalog claim) | macro shell | selection-fanout target | theme/accent/face |
|---|---|---|---|---|---|
| a | **Threadline** — integration-analytics console | Bump chart (8 integrations × 8 weekly rank snapshots) | Hero + inline-stats, rail-free | targeted: no separate detail component | dark / sky / `--font-display-mono` |
| b | **Relay** — cross-team handoff-intelligence console | Arc diagram (8 teams on a linear pipeline axis, 15 handoff pairs) | Hero + a reserved spotlight card (see below) | targeted: multi-axis independently-scoped selections | light / emerald / `--font-display-wide` |
| c | **Tidemark** — acquisition-channel revenue console | Horizon chart (10 channels, color-banded compact rows) | Board/grid of compact rows | targeted: no separate detail component | dark / violet / `--font-display-grotesk` |

Candidate b was given explicit, highly specific guardrails referencing r45/b's exact failure mode (a `pinnedRegionId` read by 2 components, which cost it the "multi-axis independent scoping" tier) — see §4 for whether it actually avoided the mistake this time.

**GENERATE completion freeze hash** (pre-fix): `cat app/src/app/dash-evolve/r46/*/*.tsx app/src/app/dash-evolve/r46/*/*.ts | shasum` → `76654727829db406ce2038a51fa61e3d6173e0a9`.

## 3. HARD GATE

Dev server still running from round 1 (confirmed 200 on `:3100`, not restarted). Same `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium` override carried forward (no script edits).

- **a**: 1st gate failed on **two independent gates in one cycle** — `console` (a React 19/Next.js 16 hydration mismatch: a literal `<title>` element nested inside a decorative `aria-hidden="true"` SVG was being hoisted for document-metadata purposes regardless of its SVG nesting context, rendering in a different DOM position on the client than the server emitted — a React-19-specific gotcha with no prior record in this repo's deltas) and `sweep` (`table-overflow` by 70–86px at 1264/1280px on the 11-column leaderboard matrix, which used a fixed-px `min-w-[980px]` floor on the `<table>` with px-based `colgroup` widths). **Orchestrator applied both fixes directly** in the single allowed 1-fix cycle: removed the SVG `<title>` entirely (the SVG was already `aria-hidden`, so no accessible-name loss), and converted the leaderboard table's `colgroup` to percentage widths while dropping the `min-w` px floor (letting `table-fixed` compress at the narrowest tested desktop width, the same documented fix pattern as `auto-dash-r44/b`'s `ExceptionsTable`). Re-gate: clean, 0 violations.
- **b**: 1st gate failed on `sweep` only (`table-overflow` by 1–58px at 1264/1280/1350px) — the handoff table already used a percentage `colgroup` (22/22/18/18/20%) but still carried a `min-w-[640px]` px floor on the `<table>` forcing a wider minimum than the percentages alone would need. **Orchestrator removed the floor** (same fix family as a's table, simpler since the colgroup was already percentage-based). Re-gate: clean, 0 violations.
- **c**: 1st gate failed on `lint` only — 2 instances of `react/no-unescaped-entities` (a literal `"` pair in plain JSX text in the notifications-menu empty state). **Orchestrator fixed** by swapping to `&ldquo;`/`&rdquo;`. Re-gate: clean, 0 violations.

Post-fix freeze hash: `9739e1c9f33fbea54d69f417848118c1501ee9d9` (full per-gate table in `SCORES.md`). All three candidates survive to JUDGE.

Screenshots captured for all three; none of the three pages scroll this round (only the base scroll=0 frame exists for each at all 4 widths). No blank frames, no capture errors.

## 4. JUDGE

Three independent `general-purpose` judge subagents (model: opus), blind to each other, to concept notes, and to generation order. 3 frames per candidate (`1440`/`1920`/`390`).

| lens | 1st | 2nd | 3rd |
|---|---|---|---|
| lens1 (brief compliance) | **a** | c | b |
| lens2 (commercial polish) | **a** | b | c |
| lens3 (archetype differentiation) | **c** | a | b |

**2:1 majority for a** (lens1 + lens2) — the identical vote structure as r45 (same two lenses forming the majority, lens3 dissenting toward the differentiation-favored candidate). Per `curation-criteria`'s established "차별성 ↔ 완성도 상충 시 판정 방향" and "Q32 판정" (a 2:1 split with a rotating dissenting lens is this catalog's normal outcome), the majority stands. **b placed last on all three lenses again** (3:0 unanimous for last place, the same pattern as r45) — but for a *different* reason than r45/b: this round's b actually technically achieves the targeted "multi-axis independently-scoped selections" tier on the strict file-count check (lens3 explicitly grepped and confirmed neither `active` nor `selectedId`/`hoverId` is read by 2+ files, unlike r45/b's `pinnedRegionId`) — it loses instead on (a) lens3's finding that its two selections are redundant in substance (both scope over the identical 8-team entity set, and the "independent" `TeamSpotlight` card is itself a permanently-reserved, always-populated panel structurally reminiscent of the flagged anti-pattern even though it isn't literally a third pane fed by a shared id), and (b) lens1/lens2's independently-confirmed, real visual defects (the sidebar-switcher overlapping the page's own `<h1>`, an SVG-`<text>`-based label-scaling problem that makes team names illegible at both 390px and 1920px, two competing saturated hues).

### Orchestrator verification of the recurring "sidebar switcher overflow" claim

Both lens1 and lens2 again claimed a sidebar workspace-switcher overflow this round — against **both** a (the eventual winner) and b. Given the identical claim type was fully debunked as a false alarm (no reproduction at all) against r45's winner, the orchestrator re-verified directly this time by reading both rendered frames (`a-1440.png`, `b-1440.png`) at full resolution and the source of both sidebars. Result: **the claim is TRUE for b** (the switcher box's chevron visibly touches/overlaps the "H" of "Handoff Flow" — confirmed directly in `b-1440.png`) and **does not visibly reproduce for the winner, a** (the switcher box sits with clear whitespace before "Integration Leaderboard" in `a-1440.png` — consistent with lens1's own more careful phrasing, which said a's case "only abuts" without covering anything). Reading both sidebars' source side-by-side revealed the actual mechanism: both ship the byte-for-byte identical `SidebarContent`/`aside` flexbox structure with an unguarded `min-width:auto` on the outer flex child, and whether this visibly overflows the 256px rail depends entirely on whether the current workspace-name string happens to be long enough — a's label ("Lumen Robotics — Production", 27 chars) happens to fit; b's ("Northwind Platform — Engineering", 32 chars) does not. The same exact structural pattern was confirmed present (but non-manifesting) in r45/a's sidebar too. **This real, structurally-verified, cross-round-reproduced defect is recorded as a delta below (§5–6) rather than fixed in the winning candidate**, since it causes no current visible defect in a and §3-1 scopes fixes to confirmed current rule violations on the candidate actually being promoted, not latent/dormant structural risk.

No other hard-gate rule violation was cited against winner a by any lens. The edge-label-clipping finding on a (names truncating to e.g. "Zend…" in the chart's narrow label column at 390px, full name preserved only via `aria-label`) and the "display face used on text-xl, not only large headline text" finding are both completeness/craft-level per §3-1's explicit scope limit, not rule violations — left unfixed, available as future-delta input if reproduced.

## 5. LEARN

One new delta appended at L1 (`round: auto-dash-r46, variant: b`) — the sidebar-switcher structural overflow mechanism described above (an unguarded `min-width:auto` on a row-flex `<aside>`'s single child, `SidebarContent`, lets a deeply-nested `white-space:nowrap` text descendant's full un-truncated width override the descendant's own correctly-applied `min-w-0`/`truncate`, since `min-width:auto` resets don't propagate across flex-container boundaries).

## 6. 지식 정제 게이트

Because this delta's reproduction is already **cross-round** (confirmed present via direct source inspection in `auto-dash-r45/a`, `auto-dash-r46/a`, and `auto-dash-r46/b` — 3 independently-built sidebars, 2 rounds) and is source-verifiable by exact structural signature (not merely a similar-looking visual symptom), it was **promoted directly to L2 within this same round's refinement gate** (`supersedes: 'auto-dash-r45/a'`) rather than held for a future round's observation, per `curation-criteria`'s allowance for immediate promotion when the reproduction evidence is already in hand and mechanically precise (the same principle the "Q29 판정" entry already established for hard-gate-verified deltas, extended here to a source-verified-by-direct-inspection case). No conflicting delta pairs found in the full 20-entry `dash-deltas-provisional.jsonl`. No new `questions-queue.md` entry needed.

## 7. 기록 + 커밋

Ledger entry appended (`target: 'dash'`, `round: 'auto-dash-r46'`, `winner: 'a'`, `no_winner: false`, `variety: {theme: 'dark', accent: 'sky', face: 'mono'}`). `vault/index.md` "세대 기록" updated. Canon (`dash-brief-v3.md`, `design-principles.md`, `/dash` gallery, `/v1–v5`) left untouched — confirmed via `git status` before commit. Commit + push to `evolve/dash` to follow immediately. **This completes both of this scheduled session's two back-to-back `/dash-evolve` executions** (round 1: dash r45 winner a "Vendly"; round 2: dash r46 winner a "Threadline"; 0 no-winner rounds, 0 candidates dropped outright at hard gate across either round, canon fully unchanged throughout both).
