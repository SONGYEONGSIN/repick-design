# SCORES — auto-paywall-r2

게이트: `node scripts/gate.mjs --target web --routes /paywall-evolve/r2/<v>` (CHROME_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome, PW_NO_SANDBOX=1 — 세션 로컬 크로미움 심링크 경로, gate.mjs 자체는 무수정)

| 후보 | static | weights | sweep | a11y | perf | 1-fix |
|---|---|---|---|---|---|---|
| a — Meridian (예약 SaaS, 3단계 위저드 인터럽트) | 위반 0 | 3종 | 오버플로 0 | 100 | 71 | 불요 — 1차 전 항목 통과 |
| b — Fathomline (제품분석 SaaS, 상시노출 스플릿스크린) | 위반 0 | 3종 | 오버플로 0 | 100 | 70 | 불요 — 1차 전 항목 통과 |
| c — Postrail (트랜잭셔널 이메일 SaaS, 고정 요약바+독립 확장 모듈) | 위반 0 | 3종 | 오버플로 0 | 100 | 67 | 불요 — 1차 전 항목 통과 |

전 후보 생존 (3/3), 전원 1차 통과 — §4 JUDGE 패널로 진행.
