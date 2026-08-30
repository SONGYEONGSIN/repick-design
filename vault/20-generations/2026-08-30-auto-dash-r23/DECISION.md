# auto-dash-r23 — DECISION

Target: dash · Round: auto-dash-r23 · Date: 2026-08-30
Candidates generated: a (repick Trust Console, master-detail), b (Floorline — Comp Terminal, 3-pane terminal), c (repick Ops, calendar-centric)
Hard-gate survivors: **a, b** (c dropped — see SCORES.md, a11y re-failed on two new defects after 1-fix)

## Judge panel result: 2:1 majority — winner **b**

| lens | 1st | 2nd |
|---|---|---|
| lens1 (brief/DNA compliance) | b | a |
| lens2 (commercial SaaS polish) | a | b |
| lens3 (archetype differentiation) | b | a |

No abstentions, no resumes needed — all three lenses returned complete verdicts on the first pass.

## Lens 1 (brief compliance) — summary
b wins on the brief's specifically-flagged nuances: its selection-propagation split is the most fully realized of the two (three cleanly separated mechanisms — `activeId` for immediate chart recompute, `pinnedFeedId` changing only via an explicit "Pin comps to…" button, and a fully local `hovered` crosshair state never lifted to page state), its flagship chart passes the always-visible-value check with persistent end-of-line labels, and its 3-pane layout is fully visible at the standard 1440px judging width. a has tighter font discipline (3 rendered weights vs. b's 4, a known soft-violation) and a fully-wired workspace-switcher popover (b's equivalent has no `onClick`, a dead control), but a's master-detail split only resolves into two visible panes at the `2xl` (1536px) breakpoint — at 1440px the detail pane requires scrolling, a real hit against at-a-glance/viewport-filling compliance at the exact width being judged.

## Lens 2 (commercial polish) — summary
a wins here: its KPI row, master-detail dispute workflow (buyer claim/seller response/AI re-grade confidence/three explicit resolution actions with a gated confirm button), and specific, internally-consistent case data read as a genuine daily-use ops tool. b's all-black/single-amber-accent terminal treatment across the entire canvas was judged to lean toward "trading-terminal mood board" rather than restrained ops console — the brief explicitly penalizes decoration that isn't information-serving, and full-canvas dark+single-accent commitment read as landing-page-style expressiveness carried into the dashboard side. b's chart itself was praised as genuinely at-a-glance readable, and its data was equally realistic to a's — the gap was component/table density and the "themed" full-page accent commitment, not fundamentals.

## Lens 3 (differentiation) — summary
Both candidates avoided the known "one selectedId, uniform threading" trap that has cost three consecutive prior rounds this lens — this was not a no-winner round. b wins because its propagation split is surfaced as a **visible UI element**: `CompFeedPanel.tsx` renders an explicit amber "out-of-sync" banner when the chart's active item and the pinned comp-feed item diverge, with a "Pin comps to X" button — making the deliberate gap a first-class, discoverable interaction rather than a hidden implementation detail. a's equivalent (a `key`-based remount on `DetailPane` that resets internal tab/resolution state on every case switch, with `KpiRow` deliberately excluded from selection) is real and intentional (confirmed via source comments) but manifests purely as internal behavior — nothing in the UI itself surfaces that a deliberate propagation boundary exists. Both structural wrinkles are genuine; b's is simply more legible as differentiation because a user (or judge) can see the split without reading source.

## Winner: b ("Floorline — Comp Terminal")

## LEARN — delta extracted (§5)
See `dash-deltas-provisional.jsonl` append below. One L1 delta:

> Extending the r17→r22 "selection propagation split" lineage: when two candidates both correctly split propagation into a persistent-pin mode and a fully-ephemeral hover mode (avoiding the known uniform-`selectedId`-threading trap), the one that **surfaces the deliberate gap as a visible, discoverable UI element** (an explicit "out of sync" banner + re-pin action, rather than only a `key`-remount/reset that resets internal state invisibly) wins the differentiation lens. Both mechanisms are equally "correct" per the propagation-split rule, but only the visibly-surfaced version reads as structural novelty to a judge who hasn't read the source — the invisible version is functionally sound but legible only via code inspection, which a differentiation judgment (by design, working mostly from screenshots) will not credit as strongly.

## Refinement gate (§3-1) — none needed
No post-judgment rule-violation fixes were required on b; both a and b passed their hard gate cleanly after one fix pass each, and no violations survived into judging.

## Candidate c — hard-gate elimination (recorded here per §7 for completeness)
Dropped before judging: static (picsum.photos ×2), lint (2× set-state-in-effect), and sweep (390px overflow) were all resolved cleanly in its one fix pass, but the a11y gate re-failed — not on the same defects (the originally-flagged 7 contrast sites and 36 calendar-cell label mismatches were genuinely fixed) but on two new ones: the replacement generated-avatar badge introduced its own low-contrast text (added to satisfy the static-gate fix), and a pre-existing "Account menu" header button surfaced a label mismatch not caught in the first Lighthouse pass. Per skill §3, the rule is mechanical on gate pass/fail after the one permitted fix — this eliminates the candidate regardless of whether the specific violation instance repeats. See SCORES.md for full detail and a process note for future rounds (newly-introduced elements in a fix pass should be self-audited against the full a11y ruleset before considering the fix complete).

## Invariants confirmed
- No edits to `vault/00-principles/dash-brief-v3.md`, `vault/00-principles/design-principles.md`, `/dash` gallery, or `/v1`–`/v5`.
- `dash-deltas-provisional.jsonl` append-only (no edits to existing lines).
- No commits to `main` — all work on `evolve/dash`.
