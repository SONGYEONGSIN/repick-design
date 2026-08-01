# SCORES — auto-catalog-r1

| Candidate | static | weights | sweep | a11y | perf | notes |
|---|---|---|---|---|---|---|
| a — Loopwire (left filter rail + grid) | pass | 3종 | pass | 95 | 60 | 1차 통과, 수정 불요 |
| b — Overlook (top filter bar + magazine grid) | pass | 3종 | pass | 98 | 55 | 1차 통과, 수정 불요 |
| c — Fathom (split exploration) | pass | 3종 | pass | 100 | 62 | 1차 94(color-contrast: `text-emerald-600`/`text-orange-600` on white 3.77/3.56:1 미달 · landmark-one-main: `<main>` 부재) → `text-emerald-700`/`text-orange-700`(5.48/5.18:1)로 색 교체 + 결과목록+미리보기 영역을 `<main>`으로 승격 후 1회 수정, 재게이트 100 |

전 후보 하드게이트 생존 → JUDGE 패널 진행.
