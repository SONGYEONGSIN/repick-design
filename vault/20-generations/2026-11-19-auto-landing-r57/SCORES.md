# auto-landing-r57 — HARD GATE

frozen source hash (pre-fix): `a6eab68c548e33416d3b8792771ac0abc4b322f8`
env: `CHROME_PATH`/`PW_CHROMIUM_PATH=/opt/pw-browsers/chromium` + `PW_NO_SANDBOX=1` (sandbox Chromium revision mismatch workaround, same pattern as prior rounds)

## 1차 게이트 (pre-fix)

| candidate | route · sweep · focus · console | a11y | lint | perf | pass |
|---|---|---|---|---|---|
| a | sweep **FAIL** — 390px cell-overlap 14px, "Condition ≥ Good" ↔ "Verified seller" (EligibilityTable header) | 100 | pass | 91 | **false** |
| b | sweep pass | a11y **FAIL** — `target-size` (hardfail audit, RankDevice.tsx move-up/move-down buttons, `p-0.5` + 14px icon ≈ 18px box) | pass | 93 | **false** |
| c | sweep pass | 100 | **FAIL** — `react/no-unescaped-entities` ×2 (ClosingCta.tsx:31, SocialProof.tsx:14) | 88 | **false** |

## 1-fix (orchestrator-applied, each a single mechanical fix within the existing design — no ranking-relevant change)

- **a**: `EligibilityTable.tsx` header `<th>` now renders a `shortLabel` (added to `CRITERIA` in `model.ts`: "Condition"/"Verified"/"Budget"/"Shipping") instead of the long label, plus `abbr={c.label}` for the full text and `whitespace-normal break-words`. Full labels remain in the `ValueSplit` legend.
- **b**: `RankDevice.tsx` move-up/move-down buttons enlarged from `p-0.5` (~18×18px) to `h-7 w-7` (28×28px) flex-centered — clears the 24×24 WCAG target-size minimum with margin.
- **c**: Escaped two unescaped apostrophes (`&rsquo;`) in `ClosingCta.tsx` and `SocialProof.tsx`.

## 2차 게이트 (post-fix) — 전원 클린

| candidate | static | lint | types | weights | sweep | focus | console | a11y | perf | pass |
|---|---|---|---|---|---|---|---|---|---|---|
| a | 0 | 0 | 0 | 3종 | 0 | 0 | 0 | 100 | 91 | **true** |
| b | 0 | 0 | 0 | 3종 | 0 | 0 | 0 | 100 | 93 | **true** |
| c | 0 | 0 | 0 | 3종 | 0 | 0 | 0 | 100 | 87 | **true** |

All 3 candidates survive to §4 JUDGE.
