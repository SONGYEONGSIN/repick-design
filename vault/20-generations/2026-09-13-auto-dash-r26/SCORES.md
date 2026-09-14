# auto-dash-r26 — SCORES

동결 해시(1-fix 후 재게이트 시점, 게이트·스크린샷·judge가 본 산출물의 SHA-1): `6e5bb520a6ef00d57b26e47701e42570768d0f5e`

| 후보 | route | types | static | lint | weights | sweep | focus | console | a11y | perf | 종합 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| a — Coldline (excursion heatmap) | pass | 에러 0 | 위반 0 | 위반 0 | 4종(기록만) | 오버플로 0 | 누락 0 | 결함 0 (39건) | 100 | 65 | **pass** (1-fix 1회: 390px cell-overlap "Duration↔Status" — min-w를 table 자체에 이동+모바일 overflow-x-auto) |
| b — Auditlane (defect box plot) | pass | 에러 0 | 위반 0 | 위반 0 | 3종 | 오버플로 0 | 누락 0 | 결함 0 (112건) | 100 (1차 93) | 70 | **pass** (1-fix 1회: color-contrast rose-600→700 on tinted pin bg + target-size 히트타겟 최소간격 64 SVG-px) |
| c — Ledgerline (revenue sunburst) | pass | 에러 0 | 위반 0 | 위반 0 | 3종 | 오버플로 0 | 누락 0 | 결함 0 (173건) | 100 (1차 97) | 62 | **pass** (1-fix 1회: 세그먼트 필터 미선택 텍스트 zinc-500→600 on muted track) |

3후보 전원 1-fix 1회로 재통과(재실패 없음). violations: [] (재게이트 기준, 전 후보).

## 1차 게이트 실패 상세
- a: sweep cell-overlap, 390px, "Duration"↔"Status" 3px 겹침
- b: a11y 93 — color-contrast(outlier 라벨 rose-600 on violet-tinted 4.29:1) + target-size(박스플롯 크로스헤어 히트타겟 상호겹침, 여유 21.2px)
- c: a11y 97 — color-contrast(세그먼트 필터 미선택 텍스트 zinc-500 on zinc-100 트랙 4.39:1)
