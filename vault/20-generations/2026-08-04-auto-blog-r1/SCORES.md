# SCORES — auto-blog-r1

게이트: `CHROME_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome PW_NO_SANDBOX=1 PW_CHROMIUM_PATH=/opt/pw-browsers/chromium node scripts/gate.mjs --target web --routes /blog-evolve/r1/<v>` (세션 로컬 크로미움 심링크 경로, gate.mjs 자체는 무수정)

후보 소스 동결 해시(전 후보 최종 통과 시점): `e633bbe15d7f8f0b9a2b71d4bf7d83888d0585d7`

| 후보 | static | weights | sweep | a11y | perf | 1-fix |
|---|---|---|---|---|---|---|
| a — Northbeam (B2B 어트리뷰션 SaaS, 히어로+필터형 카드 그리드) | 위반 0 | 3종 | 오버플로 0 | 100 | 57 | 불요 — 1차 전 항목 통과 |
| b — Stackrail (워크플로 오케스트레이션 SaaS, 사이드레일+밀도형 리스트) | 위반 0 | 3종 | 오버플로 0 | 100 | 53 | 불요 — 1차 전 항목 통과 |
| c — Loupe / The Loupe Journal (크리에이티브 리뷰 툴, 월별 타임라인+최다열독 사이드바) | 위반 0 | 3종 | 오버플로 0 | 100 | 60 | 불요 — 1차 전 항목 통과 |

전 후보 생존 (3/3), 전원 1차 통과 — §4 JUDGE 패널로 진행.
