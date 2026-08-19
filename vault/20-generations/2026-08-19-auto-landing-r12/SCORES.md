# auto-landing-r12 — SCORES

freeze hash (app/src/app/landing-evolve/r12/*/*.tsx + *.ts): `5318b55a1c53ca5f326302634637be589c1ef5fd`

## 후보 개요
- a — 실시간 활동 피드 / 라이브 티커 히어로 (다크 · indigo · 디스플레이 활자 없음)
- b — 감정서/등급 인증서 리빌 히어로 (라이트 · emerald · display-grotesk)
- c — 수직 프로세스 타임라인 (다크 · rose/cyan · 디스플레이 활자 없음)

## 하드게이트 (`node scripts/gate.mjs --target web --routes /landing-evolve/r12/a /landing-evolve/r12/b /landing-evolve/r12/c`)

| 관문 | 결과 |
|---|---|
| route | 3개 라우트 응답 OK |
| types | 에러 0 |
| static | 위반 0 |
| lint | 위반 0 |
| weights | 3종 (렌더 실측) |
| sweep | 전 폭 오버플로 0 |
| focus | 포커스 표시 0건 누락 |
| console | 결함 0 |
| a11y | 100 (첫 합산 실행에서 96·color-contrast 플레이크 — 개별 후보 3건 재확인 전원 pass, 재실행 100으로 재현 안 됨. Lighthouse 실행별 변동으로 판단, 1-fix 대상 아님) |
| perf | 63 (기록만) |

3후보 전원 게이트 통과. `violations: []`(최종). 1-fix 불요(플레이크 재실행만 필요했음).

환경 고유: `PW_CHROMIUM_PATH=/opt/pw-browsers/chromium` + `CHROME_PATH` + `PW_NO_SANDBOX=1`로 chromium build 1194 사용.
샌드박스 egress 프록시가 `images.unsplash.com`을 차단 — 세 후보 전원 동일 조건(선례: auto-landing-r10/c). 실제 서비스 환경에서는 로드되나 이 세션 캡처에서는 이미지가 깨진 상태(플레이스홀더 색+alt)로 보일 수 있음 — 이미지 자체의 결함이 아니라 이 컨테이너의 egress 제약.
