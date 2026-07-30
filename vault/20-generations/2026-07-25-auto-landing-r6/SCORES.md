# SCORES — auto-landing-r6

run: `auto-landing-r6` · target: `landing` · date: 2026-07-25 · routes: `/landing-evolve/r6/{a,b,c}`

| 후보 | 아키타입 | static | sweep | a11y | perf | 1-fix 필요 |
|---|---|---|---|---|---|---|
| a | Appraisal certificate / verdict document (output-visualization) | pass (위반 0) | pass (오버플로 0) | 100 | 96 (기록만) | 아니오 — 1차 통과 |
| b | Scroll-driven verification timeline (narrative/scrollytelling) | pass (위반 0) | pass (오버플로 0) | 96 | 96 (기록만) | 아니오 — 1차 통과 |
| c | Personalized estimate generator (input-manipulation + output-visualization 융합) | pass (위반 0) | pass (오버플로 0) | 100 | 96 (기록만) | 아니오 — 1차 통과 |

- 정적 검사: 3종 이미지 규칙(no-raw-img·img-needs-alt·no-next-image-unopt) 포함 전체 위반 0건 (a,b,c 전부 1차부터).
- sweep: 데스크톱 1280/1366/1440/1536/1680/1920(±16px) + 모바일 390px 전 구간 page/table-overflow 0.
- Lighthouse: `--preset=desktop`, dev 서버(localhost:3100) 측정 — a11y 하드게이트(≥95) 전부 통과, perf는 기록만(탈락 미적용, dev 서버 특성상 프로덕션 대비 낮게 나옴).
- 3후보 모두 하드게이트 1차 통과로 1-fix 루프 미사용.
