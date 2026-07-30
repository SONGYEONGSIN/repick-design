# SCORES — auto-landing-r7

run: `auto-landing-r7` · target: `landing` · date: 2026-07-28 · routes: `/landing-evolve/r7/{a,b,c}`

| 후보 | 아키타입 | static | sweep | a11y | perf | 1-fix 필요 |
|---|---|---|---|---|---|---|
| a | Split-Flap Departure Board (output-visualization + tab manipulation) | pass (위반 0) | pass (오버플로 0, 1회 수정 후) | 100 | 79 (기록만) | **예** — 390px page-overflow 99px(table-layout:auto+flex shrink-0 flap셀 폭 고정이 원인) → table-fixed+colgroup+min-w-0 체인으로 수정 후 재통과 |
| b | Confidence Equalizer (output-visualization, 바 차트) | pass (위반 0) | pass (오버플로 0) | 100 | 96 (기록만) | 아니오 — 1차 통과 |
| c | AI Annotation Scan (output-visualization, 사진 주석 핀) | pass (위반 0) | pass (오버플로 0) | 100 | 96 (기록만) | 아니오 — 1차 통과 |

- 정적 검사: 3종 이미지 규칙(no-raw-img·img-needs-alt·no-next-image-unopt) 포함 전체 위반 0건 (a,b,c 전부).
- sweep: 데스크톱 1280/1366/1440/1536/1680/1920(±16px) + 모바일 390px 전 구간 page/table-overflow — a는 1차 390px에서 99px page-overflow(flap-board 테이블이 table-layout:auto+고정폭 글리프 셀로 320px 근방에서 넘침) → table-fixed/colgroup/min-w-0 체인 수정 후 전 구간 0.
- Lighthouse: `--preset=desktop`, dev 서버(localhost:3100) 측정(PW_NO_SANDBOX=1 + CHROME_PATH로 사전설치 Chromium rev1194 기동 — 이 샌드박스는 root 실행이라 기본 설정으론 sandbox 오류로 크래시했으나 opt-in env var 추가로 정상 측정) — a11y 전부 100(하드게이트 95 이상), perf는 기록만(탈락 미적용, dev 서버 특성상 프로덕션 대비 낮게 나옴, a=79는 flap-board 애니메이션 코스트로 b/c보다 낮으나 비하드페일).
- 3후보 모두 생존 — a만 1-fix 루프 1회 사용(재통과).
