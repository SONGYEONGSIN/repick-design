# SCORES — auto-profile-r2

게이트: `CHROME_PATH=/opt/pw-browsers/chromium PW_CHROMIUM_PATH=/opt/pw-browsers/chromium PW_NO_SANDBOX=1 node scripts/gate.mjs --target web --routes /profile-evolve/r2/<v>` (세션 로컬 크로미움 심링크 경로 — playwright.dev 다운로드가 프록시에서 차단돼 `/opt/pw-browsers/chromium` 사전설치본을 사용, gate.mjs 자체는 무수정)

후보 소스 동결 해시(전 후보 최종 통과 시점, judge 패널 입력): `ecd0a7708c9f111a2ed7552dea4147bd26d2739f`

**정제 조치 후 재동결 해시**(b — §3-1 규칙 위반 해소, 순위 재계산 없음. 상세는 DECISION.md "정제 조치" 절): `c93d6cb43fd06f86a16cf9f15216a3d5f5af9df5`

| 후보 | static | weights | sweep | a11y | perf | 1-fix |
|---|---|---|---|---|---|---|
| a — Imogen Castellane / Keel & Ballast Audits (독립 프로토콜 보안감사관, 케이스로그 스파인) | 위반 0 | 3종 | 오버플로 0 | 100 | 54 | 불요 — 1차 전 항목 통과 |
| b — Renata Kessler / Solstice Macro on Meridian (트레이딩 전략 벤치마크, sticky 스코어보드 밴드+베이스라인 비교) | 위반 0 | 3종 | 오버플로 0 | 96 | 62 | 불요 — 1차 전 항목 통과 |
| c — Reeve Calloway / Fieldwork (프리랜스 프로덕트·그로스 디자이너, 케이스스터디 그리드) | 위반 0 | 3종 | 오버플로 0 | 100 | 61 | 불요 — 1차 전 항목 통과 |

전 후보 생존 (3/3) — §4 JUDGE 패널로 진행.
