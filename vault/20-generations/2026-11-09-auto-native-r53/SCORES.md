# auto-native-r53 — HARD GATE SCORES

Freeze hash (post 1-fix, registration-through-judging): `cf0f38e6b403215c04dd4395b653a5b1e26e0b08`
(`cat native/src/evolve/r53/*/*.tsx native/src/evolve/r53/*/*.ts native/src/screens.ts native/screens.json | shasum`)

| screen | tsc | export | render | iframe |
|---|---|---|---|---|
| evolve-r53-a (BoothRegistrationGateScreen — "Pop-Up Booth Registration") | ✅ | ✅ | ✅ | ✅ |
| evolve-r53-b (ConsignmentPartnersScreen — "Consignment Partners") | ✅ | ✅ | ✅ | ✅ |
| evolve-r53-c (SizeReferenceScreen — "Size & Fit Reference") | ✅ (1-fix) | ✅ | ✅ | ✅ |

**1st attempt**: a/b both reported `tsc` clean (0 errors) but `export`/`render`/`iframe` were `blockedBy: "다른 후보(evolve-r53-c)의 tsc 에러로 전역 tsc가 중단됨"` — per SKILL.md §3, this does NOT consume a's or b's 1-fix budget (native shares one global `tsc` run across all three candidates registered in `screens.ts`). c itself failed `tsc` (TS2769 "No overload matches this call", `SizeReferenceScreen.tsx:106`) — `fontVariant` was passed as a direct JSX prop on `<Text>` instead of inside its `StyleSheet` entry (RN's `Text` has no `fontVariant` prop; it's a `TextStyle` field only). Orchestrator applied the 1-fix directly (mechanical, rule-violation-only, no ranking-relevant change): moved `fontVariant: ["tabular-nums"]` into `styles.chartRowValue` and dropped the invalid prop from the JSX.

**2nd attempt**: 12/12 clean, 0 violations, global `tsc` 0 errors.

No blank-frame candidates to report yet (screenshots pending §4).
