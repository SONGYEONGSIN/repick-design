# SCORES — auto-blog-r2

게이트: `CHROME_PATH=/opt/pw-browsers/chromium PW_CHROMIUM_PATH=/opt/pw-browsers/chromium PW_NO_SANDBOX=1 node scripts/gate.mjs --target web --routes /blog-evolve/r2/<v>` (세션 로컬 크로미움 심링크 경로 — playwright.dev 다운로드가 프록시에서 차단돼 `/opt/pw-browsers/chromium` 사전설치본 사용, gate.mjs 자체는 무수정)

후보 소스 동결 해시(전 후보 최종 통과 시점): `3d8fadaeb257bee3b09b50bde716c24b743b6980`

| 후보 | static | weights | sweep | a11y | perf | 1-fix |
|---|---|---|---|---|---|---|
| a — Continuum (시스템 엔지니어링 연구/교육 블로그, 시리즈 스파인) | 위반 0 | 3종 | 오버플로 0 | 95 | 58 | 불요 — 1차 전 항목 통과 |
| b — Baseline (벤치마크 저널 블로그, Feed/Compare 토글 + 정렬형 비교 테이블) | 위반 0 | 3종 | 오버플로 0 | 100 | 59 | 불요 — 1차 전 항목 통과 |
| c — Keelson (릴리스노트/체인지로그 블로그, 세로 릴리스 스파인 + 버전 점프 인덱스) | 위반 0 | 3종 | 오버플로 0 | 100 | 57 | 불요 — 1차 전 항목 통과 |

전 후보 생존 (3/3) — §4 JUDGE 패널로 진행.
