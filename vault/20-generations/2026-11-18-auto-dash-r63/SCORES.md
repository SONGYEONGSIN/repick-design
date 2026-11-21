# SCORES — auto-dash-r63

Freeze hash (all 3 candidates, pre-gate): `691753d3f30f41e9229771fa8cf7fd05b612be40`

## Candidate a — "Stagebook" (reassigned from reassign-queue.md #23)

First hard-gate attempt — clean pass, no fix needed.

| gate | pass | detail |
|---|---|---|
| route | ✅ | 1 route OK |
| types | ✅ | 0 errors |
| static | ✅ | 0 violations |
| lint | ✅ | 0 violations |
| weights | ✅ | 3 (rendered) |
| sweep | ✅ | 0 overflow |
| focus | ✅ | 0 missing |
| console | ✅ | 38 msgs, 0 defects |
| a11y | ✅ | 100 |
| perf | ✅ | 91 |

**Survives. Only candidate to reach judging this round.**

## Candidate b — "Vernier" (feature-flag rollout console)

1st attempt: FAIL — sweep `table-overflow` ×6 (1264–1440px, by 138→21px, `FlagTable.tsx` desktop table
forced `min-w-[720px]` unconditionally) + a11y 94 `button-name` (Topbar avatar/account-menu button —
no accessible name, both children `aria-hidden`).

1-fix applied (orchestrator): added `aria-label="Account menu"` to the avatar button; added
`lg:min-w-0` to `FlagTable`'s table so desktop no longer forces 720px.

2nd attempt (re-gate): FAIL again — `button-name` resolved, but a **new** a11y failure surfaced:
`label-content-name-mismatch` on the same button — `InitialsAvatar initials="RT"` is visually
rendered ("RT") even though `aria-hidden="true"`, and axe's label-content-name-mismatch rule counts
visually-rendered text regardless of `aria-hidden` (same rule class as the color-contrast
`aria-hidden` note in this round's brief). The new `aria-label="Account menu"` does not contain "RT"
→ mismatch. Also sweep `table-overflow` reduced to 1–7px residual at 1264/1280/1350px — not fully
eliminated by `lg:min-w-0` alone (exact remaining cause undiagnosed: likely cell padding/border
arithmetic at the colgroup-% boundary).

**Eliminated — hard gate, re-failed after 1-fix. Did not reach judging.** Rule violation, not a form
judgment — reassignment-eligible (see DECISION.md).

## Candidate c — "Weir" (API gateway quota console)

1st attempt: FAIL — a11y 100 (score) but `label-content-name-mismatch` audit hard-fail (which
overrides score per page-brief-core §1).

1-fix applied (orchestrator): misdiagnosed — removed a custom `aria-label` from `KeyRail.tsx`'s key
row button (a plausible-looking visible-text/aria-label divergence) without first confirming via
Lighthouse's own audit detail which node was actually failing.

2nd attempt (re-gate): FAIL again — the real offending node (confirmed via direct `npx lighthouse
--preset=desktop` audit detail extraction) is `Heatmap.tsx`'s per-cell button: the peak cell renders
a visible (`aria-hidden="true"` but still visually painted) `<span>{value}</span>` showing the raw
unformatted number (e.g. "1897"), while the button's `aria-label` uses `formatNumber(value)` (with
comma, e.g. "1,897") plus a `requests` suffix — the rendered text is not a literal substring of the
accessible name. Same underlying rule/aria-hidden-does-not-exempt pattern as b's defect, different
component. Also introduced a new `lint` warning (`pct` becomes unused after the KeyRail edit).

**Eliminated — hard gate, re-failed after 1-fix (wrong diagnosis). Did not reach judging.** Rule
violation, not a form judgment — reassignment-eligible (see DECISION.md).

## Outcome

2 of 3 candidates eliminated at the hard gate (1-fix exhausted, both re-failed). 1 survivor
(candidate a) proceeds to §4 JUDGE as a **solo review** (skill §4: "1개면 단독 심사로 승자/
no-winner만 판정").
