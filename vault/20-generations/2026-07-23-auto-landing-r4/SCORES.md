# SCORES — auto-landing-r4

## 정적 검사 (node scripts/dash-static-check.mjs)
| 후보 | 결과 |
|---|---|
| a | pass (위반 0건, 1차) |
| b | pass (위반 0건, 1차) |
| c | pass (위반 0건, 1차) |

## sweep (가로 오버플로, node scripts/dash-sweep.mjs)
| 후보 | 1차 | 수정 후 |
|---|---|---|
| a | pass | - |
| b | fail — table-overflow div#1(필름스트립) by=27px @ 전 데스크톱 폭 | pass (필름스트립 gap 2.5→2, 썸네일 폭 96→80px 축소) |
| c | pass | - |

## Lighthouse a11y (하드게이트 ≥95) / perf(기록만)
| 후보 | 1차 a11y | perf | 수정 후 a11y | 수정 후 perf |
|---|---|---|---|---|
| a | 91 (color-contrast, heading-order, target-size) | 95 | **100** (재검증 완료) | 96 |
| b | 99 (sweep 수정 후 1차 측정) | 95 | - | - |
| c | 99 | 95 | - | - |

## 최종 하드게이트 결과
전 후보(a/b/c) 정적·sweep·Lighthouse a11y(≥95) 전부 통과. a는 색대비/헤딩순서/터치타겟 3건 1회 수정 후 통과(100), b는 필름스트립 가로 오버플로 1회 수정 후 통과. 3개 후보 전원 JUDGE 패널로 진행.
