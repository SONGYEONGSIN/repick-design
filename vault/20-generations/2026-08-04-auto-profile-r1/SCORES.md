# SCORES — auto-profile-r1

게이트: `CHROME_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome PW_NO_SANDBOX=1 PW_CHROMIUM_PATH=/opt/pw-browsers/chromium node scripts/gate.mjs --target web --routes /profile-evolve/r1/<v>` (세션 로컬 크로미움 심링크 경로, gate.mjs 자체는 무수정)

후보 소스 동결 해시(전 후보 최종 통과 시점): `c1670092edd721b37b2eae7ea7bf78fa1ff41f27`

| 후보 | static | weights | sweep | a11y | perf | 1-fix |
|---|---|---|---|---|---|---|
| a — Circuitloom Restorations (리퍼비시 리셀러 공개 프로필, 신뢰도 스토어프론트) | 위반 0 | 3종 | 오버플로 0 | 1차 94→100 | 60 | **필요** — `landmark-one-main`(`<main>` 랜드마크 부재) + `select-name`(정렬 select 2개에 접근 가능한 이름 없음) → `<main>` 래핑 + 양쪽 select에 `aria-label` 추가, 재게이트 100 |
| b — Sable Voss / Loopwire (개발자·연동 퍼블리셔 공개 프로필, 기여 히트맵+연동 그리드) | 위반 0 | 3종 | 오버플로 0 | 100 | 44 | 불요 — 1차 전 항목 통과 |
| c — Signal & Noise / Ridgeline (크리에이터 구독 프로필, 포스트 피드+멤버십 티어) | 위반 0 | 3종 | 오버플로 0 | 100 | 62 | 불요 — 1차 전 항목 통과 |

전 후보 생존 (3/3) — §4 JUDGE 패널로 진행.
