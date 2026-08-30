# auto-dash-r23 — SCORES

Target: dash · Round: auto-dash-r23 · Date: 2026-08-30
Frozen-state hash (post-GENERATE, pre-gate): `f37d36e2801098242f0a41f0983cded7a20c6050`

Gate command: `node scripts/gate.mjs --target web --routes /dash-evolve/r23/<v>`
(run with `PW_CHROMIUM_PATH`/`CHROME_PATH=/opt/pw-browsers/chromium` + `PW_NO_SANDBOX=1`, same sandbox-specific env requirement as landing r18.)

## Candidate a — "repick Trust Console" (master-detail dispute triage)

| gate | 1st pass | after 1-fix |
|---|---|---|
| route/types/static | pass | — |
| lint | **fail** (1× react-hooks/set-state-in-effect, CommandPalette.tsx:31) | pass |
| weights | pass (3종) | — |
| sweep | pass | — |
| focus | pass | — |
| a11y | pass — 100 (bf-cache only, record-only) | — |
| perf | 64 → 66 (record only) | |

**Verdict: SURVIVES.** Single lint fix, clean re-gate, all-pass.

## Candidate b — "Floorline — Comp Terminal" (3-pane price-intelligence terminal)

| gate | 1st pass | after 1-fix |
|---|---|---|
| route/types/static | pass | — |
| lint | **fail** (2× react-hooks/set-state-in-effect, CommandPalette.tsx:39,46) | pass |
| weights | 4종 (400/500/600/700) — **record only, not hard-fail** (project's own history: this threshold stayed record-only after a 41%-violation audit found "exactly 3" unrealistic; unchanged this round) | 4종 (unchanged — 1-fix scope was a11y/lint only, not a rule violation) |
| sweep | pass | — |
| focus | pass | — |
| a11y | **fail** — 93, hard-fail audits `button-name` (1 unlabeled header icon button) + `label-content-name-mismatch` (10 watchlist row buttons, visible short name vs. full aria-label mismatch) | pass — 98 (only bf-cache · landmark-one-main, both record-only) |
| perf | 66 (record only) | 66 |

**Verdict: SURVIVES.** All 3 first-pass violations resolved cleanly (missing aria-label added; watchlist buttons switched from a separate aria-label to sr-only supplementary text alongside visible content). Re-gate clean.

## Candidate c — "repick Ops" (calendar-centric scheduling console)

| gate | 1st pass | after 1-fix |
|---|---|---|
| route/types | pass | — |
| static | **fail** (2× no-random-image-host, picsum.photos in DayDetailPanel.tsx:114 and data.ts:232) | pass (replaced with generated initials-avatar component) |
| lint | **fail** (2× react-hooks/set-state-in-effect) | pass |
| weights | pass (3종) | — |
| sweep | **fail** (page-overflow at 390px by 239px, no selector isolated by the gate) | pass (root-caused: `CardHeader` nested-flex missing `min-w-0`; also fixed Topbar search button and Calendar day-cells defensively) |
| focus | pass | — |
| a11y | **fail** — 97, hard-fail audits `color-contrast` (7 sites, `text-zinc-400` on tinted/white surfaces down to 1.41:1) + `label-content-name-mismatch` (36 calendar day-cell buttons) | **fail again** — 96, hard-fail audits `color-contrast` (**new** site: the just-added generated-avatar initials badge, white-on-`#0d9488` at 7px = 3.74:1, needs 4.5:1) + `label-content-name-mismatch` (**new** site: a pre-existing "Account menu" header button, not flagged in the first pass, unrelated to the 36 calendar cells which the fix did resolve) |
| perf | 56 (record only) | 59 |

**Verdict: DROPPED.** Static, lint, and sweep were all resolved cleanly. The a11y gate re-failed on the second attempt — notably not a persistence of the *same* defect (the 36 calendar-cell label mismatches and the original 7 contrast sites were genuinely fixed) but two *new* defects, one introduced by the fix itself (the replacement avatar component's own contrast) and one pre-existing but previously unflagged (the account-menu button). Per skill §3 ("1-fix 루프... 재통과 → 생존, 재실패 → 탈락"), the rule is mechanical on gate pass/fail, not on whether the specific violation instance repeats — a second a11y failure after the one permitted fix eliminates the candidate. Not sent to judge panel.

**Process note for future rounds**: when a 1-fix pass adds a brand-new UI element (here, a generated-avatar badge added to satisfy `no-random-image-host`), that new element is not automatically re-audited by the designer against the full a11y ruleset before the orchestrator re-gates — it's worth flagging in future 1-fix instructions that any newly-introduced element must itself be contrast/label-checked before considering the fix complete, not just the originally-flagged elements.

## Survivors for §4 JUDGE

- **a** (repick Trust Console)
- **b** (Floorline — Comp Terminal)

Candidate c is dropped per the hard-gate 1-fix rule above.
