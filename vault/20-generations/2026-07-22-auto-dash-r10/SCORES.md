# auto-dash-r10 — HARD GATE

라우트: `/dash-evolve/r10/{a,b,c}` (dev http://localhost:3100)

| 후보 | 정적 검사 | sweep | Lighthouse a11y | Lighthouse perf | 비고 |
|---|---|---|---|---|---|
| a — Wavelength | pass (위반 0건) | pass (1280/1366/1440/1536/1680/1920(−16px 포함)+390px 전 구간 page/table-overflow 0) | 100 | 96 | 하드게이트 전부 1차 통과, 수정 불요 |
| b — Stackyard | pass (위반 0건) | pass (동일 전 구간 0) | 96 | 95 | color-contrast 1건(뱃지 칩 배경 indigo-50 위 zinc-500 11px, 4.31:1 — 임계 4.5 근접 미달) + label-content-name-mismatch 잔여, 둘 다 하드게이트(≥95) 상회로 수정 불요 |
| c — Quorum | pass (위반 0건) | pass (동일 전 구간 0) | 100 | 97 | label-content-name-mismatch 잔여(false-positive 성격), 수정 불요 |

perf는 dev 서버 측정치로 기록만 — 탈락 사유로 쓰지 않음(브리프 규정).

전 후보 하드게이트 통과 → 생존 3개, JUDGE 패널 진행.
