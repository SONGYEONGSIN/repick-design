# SCORES — auto-scene-r1

| Candidate | static | weights | sweep | a11y | perf | notes |
|---|---|---|---|---|---|---|
| a — KEPT (sneaker, 4단계) | pass | 2종(extralight,semibold — 기록만) | pass | 100 | 30 | 1차 통과, 수정 불요 |
| b — Second (wristwatch, 4단계) | pass | 2종(light,normal — 기록만) | pass | 100 | 29 | 1차 통과, 수정 불요 |
| c — Reframe (vintage camera, 4단계) | pass | 3종 | pass | 100 | 32 | 1차 통과, 수정 불요 |

perf는 이 샌드박스의 dev 서버 측정치(record-only, 탈락 미적용) — `/motion-pilot` 레퍼런스도 동일 dev 서버 조건에서 프로덕션(97)보다 크게 낮게 측정된다는 전례(auto-scene-r1/b 자체 보고, `/motion-pilot`도 동일 서버에서 57 측정)와 일치. 전 후보 하드게이트 생존 → JUDGE 패널 진행.
